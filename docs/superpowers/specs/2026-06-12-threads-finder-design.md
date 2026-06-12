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

**Trigger:** cron every 5 minutes. Stateless — reads state from Sheets on every run.

**Flow:**
1. Load `seen_ids` from Sheets `Log` tab (post_id column, last 30 days only)
2. Load `replies_today` count from Sheets `Log` where date = today
3. If `replies_today >= 8`: exit immediately, no API calls
4. For each keyword tab in Sheets (all tabs except `Log` and `Reply Map`):
   - Read active keywords (active = TRUE)
   - For each keyword: `GET /threads/search?q={keyword}&fields=id,text,timestamp,username`
   - Filter posts: not in seen_ids · not older than 3h · text length > 40 chars
   - Call Claude: generate reply in Artem's voice (≤ 280 chars, Ukrainian)
   - Post reply via `threads_manage_replies`
   - Append to Sheets `Log`: timestamp, segment, keyword, post_id, post_text, our_reply_id, our_reply_text
   - `replies_today++`
   - If `replies_today >= 8`: stop

**Error handling:**
- Sheets load failure → exit immediately, log error, do not post (prevents duplicate replies on next run)
- Threads API error on a single post → skip that post, continue
- Claude API error → skip that post, continue

**Safeguards:**
- Hard cap: 8 replies/day — checked at start and enforced per-reply
- seen_ids window: last 30 days (posts older than that won't surface in search)
- Minimum post length: 40 chars — filters one-liners and spam

---

## Component 2: bot.py

**Trigger:** persistent daemon, two concurrent async tasks.

### Task 1 — Threads Reply Monitor (every 5 min)

1. Load `our_reply_id` values from Sheets `Log` (last 7 days)
2. Load known `their_comment_id` values from Sheets `Reply Map`
3. For each `our_reply_id`: `GET /{our_reply_id}/replies`
4. For each reply not in `Reply Map`:
   - Send Telegram notification to Artem:
     ```
     💬 Відповідь на твій коментар

     Від: @{commenter_handle}
     "{comment_text}"

     Пост: {original_post_url}
     ```
   - Save to Sheets `Reply Map`: timestamp, our_reply_id, their_comment_id, commenter, comment_text, telegram_msg_id, status=pending

**Implementation note:** `GET /{our_reply_id}/replies` reads replies to a reply (not only to top-level posts). This is the expected behavior of `threads_read_replies` but should be verified against the live API during initial testing.

### Task 2 — Telegram Listener (long polling)

1. On incoming Telegram message:
   - If message is a reply to a known bot notification:
     - Look up `their_comment_id` from `Reply Map` by `telegram_msg_id`
     - Post Artem's text as reply to `their_comment_id` on Threads
     - Update `Reply Map`: status → `replied`
     - Confirm to Artem: "✅ Опубліковано"
   - If message is NOT a reply to a known notification: ignore silently

---

## Google Sheets Structure

**One spreadsheet, seven tabs:**

| Tab | Columns |
|---|---|
| `Sales & Marketing` | keyword, active |
| `Ops & Finance` | keyword, active |
| `HR & Legal` | keyword, active |
| `Owners` | keyword, active |
| `Job Seekers` | keyword, active |
| `Log` | timestamp, segment, keyword, post_id, post_text, our_reply_id, our_reply_text |
| `Reply Map` | timestamp, our_reply_id, their_comment_id, commenter, comment_text, telegram_msg_id, status |

**Keyword tabs:** Tab name = segment label logged to `Log`. searcher.py reads every tab except `Log` and `Reply Map` — adding a new segment requires no code change. Disabling a keyword: set active = FALSE.

---

## Claude Reply Generation

Single API call per qualifying post. Prompt context:
- ICP segment (tab name)
- Original post text
- Voice rules: direct, Ukrainian, no coaching language, no em-dashes, one concrete insight, soft offer or question at the end
- Hard output constraint: ≤ 280 chars

No pre-classification step. Keywords are specific enough to imply intent.

---

## Threads API Permissions

| Permission | Used by |
|---|---|
| `threads_basic` | Both |
| `threads_keyword_search` | searcher.py |
| `threads_manage_replies` | searcher.py + bot.py Task 2 |
| `threads_read_replies` | bot.py Task 1 |

---

## Environment Variables (.env)

```
THREADS_ACCESS_TOKEN=
ANTHROPIC_API_KEY=
GOOGLE_SHEETS_ID=
GOOGLE_CREDENTIALS_JSON=credentials.json   # path to service account file
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=                          # Artem's personal chat ID
```

---

## Startup

```bash
# cron (every 5 min) — use absolute path:
*/5 * * * * cd /Users/artem/tool-threads-finder && python searcher.py >> searcher.log 2>&1

# daemon:
python bot.py
```

---

## Known Scope Boundary (v1)

The system monitors replies to our automated comments only. If Artem replies via Telegram and the person responds again, that second reply is not automatically detected — Artem continues the conversation in Threads directly. Full multi-turn monitoring is v2.

---

## Initial Keyword List (from ICP)

| Segment | Keywords |
|---|---|
| Sales & Marketing | "збираю ліди вручну", "CRM вручну", "звіт по рекламі вручну", "публікую пости вручну", "переношу ліди вручну" |
| Ops & Finance | "обробляю інвойси вручну", "відстежую залишки вручну", "розношу витрати вручну", "відстежую відправлення вручну" |
| HR & Legal | "переглядаю резюме вручну", "відповідаю на питання клієнтів вручну", "готую договори вручну" |
| Owners | "відповідаю клієнтам вручну", "записую клієнтів вручну", "веду облік вручну", "хочу автоматизувати" |
| Job Seekers | "шукаю вакансії вручну", "адаптую резюме вручну" |

Note: "хочу автоматизувати" is a broad keyword with a higher false-positive rate — monitor and tune after first week.
