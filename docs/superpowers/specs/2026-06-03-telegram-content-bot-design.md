# Telegram Content Bot — Design Doc

**Date:** 2026-06-03 (updated after self-critique)
**Author:** Artem Stepanenko  
**Scope:** Python bot that converts Telegram news reposts into Threads/LinkedIn posts in Artem's TOV, with approval loop and Notion content calendar integration

---

## Purpose

Artem reposts interesting news in his Telegram channel. This bot accepts those posts, generates an adapted Threads or LinkedIn post in his voice via Claude API, and runs an approval loop until the draft is finalized — then saves it to the Notion Content Calendar with Status: Ready.

---

## Conversation Flow

**Default platform: Threads.** No platform selection step unless overridden.

To use LinkedIn instead: send `/l` before or with the content, or use `/linkedin` command.

```
Artem → [forwards post / sends news text / sends URL]

          ↓ if URL detected: bot fetches page text silently

Bot  → "Генерую..."
Bot  → [draft post — Threads by default]
          [✅ Approve]  [✏️ Revise]  [🔄 New version]  [🔀 LinkedIn]

--- If ✏️ Revise ---

Bot  → "Що змінити? Або надішли свій варіант:"

  Artem sends short instruction ("зроби коротше", "прибери Supply Chain")
  → Bot detects as instruction → Claude revises
  → [revised draft] + buttons

  Artem sends full post text (their own version)
  → Bot detects as replacement text → skips Claude
  → [Artem's text displayed] + buttons

--- If ✅ Approve ---

Bot  → "Коли публікувати?"
          [📅 Сьогодні]  [📅 Завтра]  [📅 Без дати]

Bot  → "Збережено в Notion ✅
         Платформа: Threads
         Дата: 4 червня"

--- If 🔄 New version ---

Bot  → "Генерую новий варіант..."
Bot  → [new draft] + buttons

--- If 🔀 LinkedIn ---

Bot  → "Генерую LinkedIn-версію..."
Bot  → [LinkedIn draft] + buttons
```

`/cancel` — resets conversation state at any point.

---

## Input Handling

Artem can send three types of input:

| Input type | Handling |
|---|---|
| Plain text | Pass directly to Claude |
| Forwarded Telegram post | Extract `message.text` or `message.caption`; ignore media attachments |
| URL | Fetch page via `trafilatura.fetch_url()`, extract body text with `trafilatura.extract()`, pass to Claude. If fetch fails → ask Artem to paste text manually |

Forwarded channel posts use `message.text` or `message.caption`. If the forwarded message contains only media (photo, video) with no text — bot replies: "Я бачу тільки медіа. Надішли текст або посилання."

---

## Revision Detection Logic

When Artem sends a message in `AWAITING_REVISION` state, the bot classifies it as:

- **Instruction** — short message, contains imperative verbs or directives ("зроби", "прибери", "make it shorter", "remove", "add", etc.), or is under ~100 characters → send to Claude for revision
- **Replacement text** — longer message that reads as a complete post (multiple sentences, no imperative directives) → treat as Artem's final version, skip Claude, show with approval buttons

Edge cases default to **instruction** (Claude revision). If Claude misunderstood, Artem can revise again.

---

## File Structure

```
tool-telegram-content-bot/
├── bot.py              ← entry point, ConversationHandler, all handlers
├── claude_client.py    ← Claude API: generate_post(), revise_post()
├── notion_client.py    ← Notion API: add_to_calendar()
├── url_fetcher.py      ← URL detection and text extraction
├── state.py            ← ConversationState dataclass + JSON persistence
├── config.py           ← loads .env, typed settings
├── .env.template       ← token placeholders
└── requirements.txt
```

---

## State Machine

| State | Description |
|---|---|
| `IDLE` | Waiting for content input |
| `GENERATING` | Claude API call in progress |
| `AWAITING_APPROVAL` | Draft displayed, waiting for user action |
| `AWAITING_REVISION` | User clicked Revise, waiting for instruction or replacement text |
| `AWAITING_DATE` | User clicked Approve, waiting for date choice |

Transitions:
```
IDLE → GENERATING (any message received)
GENERATING → AWAITING_APPROVAL (Claude responds)
AWAITING_APPROVAL → AWAITING_DATE (Approve clicked)
AWAITING_APPROVAL → AWAITING_REVISION (Revise clicked)
AWAITING_APPROVAL → GENERATING (New version or LinkedIn clicked)
AWAITING_REVISION → GENERATING (instruction detected → Claude revision)
AWAITING_REVISION → AWAITING_APPROVAL (replacement text detected → show as draft)
AWAITING_DATE → IDLE (date button clicked → Notion saved)
Any state → IDLE (/cancel)
```

---

## Claude API Integration

**Module:** `claude_client.py`  
**Model:** `claude-sonnet-4-6` — TOV compliance is nuanced; quality over speed.

**System prompt:** Condensed TOV rules (~400 tokens):
- Short declarative sentences, one thought per sentence
- Facts first, no coaching language, no motivational closers
- Real specifics: numbers, places, dates, names
- No em-dashes for effect, no arrow bullets in narrative posts
- Threads: 3–12 lines max per post; LinkedIn: slightly longer, blank lines between paragraphs
- First person, past or present tense. Fragments are fine.
- Voice test: sounds like a person thinking out loud about their life, not a coach presenting a lesson

**`generate_post(source_text, platform)`**  
Single user message:
```
Platform: {platform}

Source material:
{source_text}

Write a post in my voice based on this. Personal angle required —
tie it to my specific experience, not just summarize the news.
```

**`revise_post(source_text, platform, previous_draft, feedback)`**  
Passes full conversation history to Claude:
```
[system prompt]
[user]: Platform: {platform}\n\nSource: {source_text}\n\nWrite a post...
[assistant]: {previous_draft}
[user]: {feedback}
```
Claude sees the full context and revises in place.

**`regenerate_post(source_text, platform)`**  
New API call with same inputs as `generate_post`. Natural temperature variation produces a different output.

---

## Notion Integration

**Module:** `notion_client.py`  
**Database:** Existing Content Calendar (`NOTION_DATABASE_ID` from env)

**`add_to_calendar(text, platform, date)`**

Creates a page in DB `2b00b04f-ed94-455b-a301-3078cc32aaf9`:
- `Post` (title): first 60 chars of post text
- `Content` (text): full post text
- `Channel` (select): "Threads" or "LinkedIn"
- `Status` (select): "Ready"
- `Publish Date` (date): today, tomorrow, or null (if "Без дати")

**Error handling:** if Notion API fails, bot replies:
```
"Не вдалось зберегти в Notion. Ось текст — збережи вручну:

[post text]"
```
State resets to IDLE either way.

---

## State Persistence

**Module:** `state.py`

`ConversationState` dataclass:
```python
@dataclass
class ConversationState:
    source_text: str = ""
    platform: str = "Threads"       # default
    current_draft: str = ""
    revision_history: list = field(default_factory=list)  # [(feedback, draft)]
    telegram_state: str = "IDLE"
```

Stored in `state.json` in the project directory. Written to disk after every state change. On bot startup, loads existing state — allows resuming after restart.

Dict keyed by `user_id` (int). In v1, only one user (`ALLOWED_USER_ID`) so the file stays small.

---

## Configuration

**`config.py`** loads from `.env`:

| Variable | Description |
|---|---|
| `TELEGRAM_BOT_TOKEN` | From @BotFather |
| `ANTHROPIC_API_KEY` | From Anthropic console |
| `NOTION_API_KEY` | From Notion integrations |
| `NOTION_DATABASE_ID` | Content Calendar DB ID |
| `ALLOWED_USER_ID` | Artem's Telegram user ID — bot ignores all other users |

**Security:** bot silently ignores all messages from users other than `ALLOWED_USER_ID`.

---

## Dependencies

```
python-telegram-bot>=20.0
anthropic>=0.25.0
notion-client>=2.0.0
python-dotenv>=1.0.0
requests>=2.31.0
trafilatura>=1.8.0
```

---

## Runtime

Runs locally on Mac. Start with `python bot.py`. Long polling — no webhook, no server required.

launchd auto-start: out of scope for v1, can be added later with a plist file.

---

## Out of Scope (v1)

- launchd auto-start setup
- Multiple users
- Instagram or X.com support
- Post analytics or tracking
- Automatic "next available slot" date scheduling in Notion
