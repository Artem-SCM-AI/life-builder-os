# Threads Client Finder — Design Spec
*2026-06-12 · tool-threads-finder*

## Goal

Automatically find potential clients on Threads by keyword, post a personalized comment, monitor replies, and notify Artem via Telegram so he can respond with one message. Zero involvement required for initial outreach; one tap for follow-up.

---

## Architecture

Two components, one tool directory:

```
tool-threads-finder/
  searcher.py       — stateless, runs every 5 min via cron
  bot.py            — persistent daemon (Threads monitor + Telegram bot)
  sheets_client.py  — shared Sheets I/O
  claude_client.py  — reply generation
  config.py         — env loading + constants
  .env              — tokens (Threads, Telegram, Claude, Google)
  requirements.txt
```

---

## Component 1: searcher.py

**Trigger:** cron every 5 minutes.

**Flow:**
1. Load `seen_ids` from Sheets `Log` tab (post_id column)
2. Load `replies_today` count from Sheets `Log` where date = today
3. For each keyword tab in Sheets (`Sales & Marketing`, `Ops & Finance`, `HR & Legal`, `Owners`, `Job Seekers`):
   - Read active keywords (active = TRUE)
   - For each keyword: `threads_keyword_search?q=keyword`
   - Filter posts: not in seen_ids · not older than 3h · text length > 40 chars
   - If `replies_today >= 8`: stop, exit
   - Call Claude: generate reply in Artem's voice (~150 chars, Ukrainian)
   - Post reply via `threads_manage_replies`
   - Append to Sheets `Log`: timestamp, segment, keyword, post_id, post_text, our_reply_id, our_reply_text
   - `replies_today++`

**Safeguards:**
- Hard cap: 8 replies/day (counted from Log tab, survives restarts)
- seen_ids always loaded from Sheets (not in-memory, survives restarts)
- Minimum post length filter: avoids one-word posts and spam

---

## Component 2: bot.py

**Trigger:** persistent daemon, two async tasks.

### Task 1 — Threads Reply Monitor (every 5 min)

1. Load `our_reply_id` values from Sheets `Log` for the last 7 days
2. For each: `GET /{our_reply_id}/replies` via `threads_read_replies`
3. Filter: not in Sheets `Reply Map` (by threads comment_id)
4. For each new reply:
   - Send Telegram message to Artem with: commenter handle, comment text, link to original post
   - Save to Sheets `Reply Map`: timestamp, our_reply_id, commenter, comment_text, telegram_msg_id, status=pending

### Task 2 — Telegram Listener (long polling)

1. On incoming message:
   - If message is a reply to a known bot notification → look up `threads_post_id` from `Reply Map` by `telegram_msg_id`
   - Post Artem's text as reply on Threads
   - Update `Reply Map` status → `replied`
   - Confirm to Artem: "✅ Опубліковано"
   - If message is NOT a reply to a notification → ignore silently

---

## Google Sheets Structure

**One spreadsheet, six tabs:**

| Tab | Columns |
|---|---|
| `Sales & Marketing` | keyword, active |
| `Ops & Finance` | keyword, active |
| `HR & Legal` | keyword, active |
| `Owners` | keyword, active |
| `Job Seekers` | keyword, active |
| `Log` | timestamp, segment, keyword, post_id, post_text, our_reply_id, our_reply_text |
| `Reply Map` | timestamp, our_reply_id, commenter, comment_text, telegram_msg_id, status |

**Keyword tabs:** Adding a segment = adding a new tab. searcher.py reads all tabs except `Log` and `Reply Map` automatically. Tab name = segment label used in Log. Disabling a keyword = set active = FALSE.

---

## Claude Reply Generation

Single API call per qualifying post. Prompt includes:
- ICP segment (derived from which keyword tab matched)
- Original post text
- Artem's voice rules: direct, Ukrainian, no coaching language, no em-dashes, adds one concrete insight, soft offer or question at the end
- Hard constraint: output ≤ 280 chars

No pre-classification step. Keywords are specific enough to imply intent.

---

## Threads API Permissions

| Permission | Used by |
|---|---|
| `threads_basic` | Both |
| `threads_keyword_search` | searcher.py |
| `threads_manage_replies` | searcher.py + bot.py |
| `threads_read_replies` | bot.py Task 1 |

---

## Known Scope Boundary (v1)

The system monitors replies to our **automated comments only**. If Artem replies via Telegram and the person responds again, that second reply is NOT automatically detected — Artem continues the conversation in Threads directly. Full conversation thread monitoring is v2.

---

## Environment Variables (.env)

```
THREADS_ACCESS_TOKEN=
CLAUDE_API_KEY=
GOOGLE_SHEETS_ID=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=        # Artem's personal chat ID — bot sends notifications here
```

## Startup

```bash
# cron (every 5 min):
*/5 * * * * cd /path/to/tool-threads-finder && python searcher.py

# daemon (persistent):
python bot.py --account artem-org-ua
```

---

## Initial Keyword List (from ICP)

**Sales & Marketing:** "збираю ліди вручну", "CRM вручну", "звіт по рекламі вручну", "публікую пости вручну", "переношу ліди вручну"

**Ops & Finance:** "обробляю інвойси вручну", "відстежую залишки вручну", "розношу витрати вручну", "відстежую відправлення вручну"

**HR & Legal:** "переглядаю резюме вручну", "відповідаю на питання клієнтів вручну", "готую договори вручну"

**Owners:** "відповідаю клієнтам вручну", "хочу автоматизувати", "записую клієнтів вручну", "веду облік вручну"

**Job Seekers:** "шукаю вакансії вручну", "адаптую резюме вручну"
