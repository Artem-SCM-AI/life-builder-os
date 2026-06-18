# Threads Poster — Design Spec
*Date: 2026-06-07*

## Problem

Artem posts to Threads daily (US/Canada audience, 7–9am ET). He sleeps during posting time (Ukraine, UTC+3). The native Threads scheduler loses the second/third post in multi-part threads 50–90% of the time. He also needs a first comment posted 2 minutes after each post to seed the algorithm's engagement window.

## Solution

A local Python script (`tool-threads-poster`) that:
1. Reads scheduled posts from a Google Sheet
2. Posts to Threads via the official API at the correct time
3. Waits 120 seconds, then posts the first comment as a reply
4. Updates the row status in the Sheet
5. Sends Telegram alerts on failure

---

## Architecture

```
Google Sheets (content plan)
        │
        │  every 5 minutes (crontab)
        ▼
  poster.py
        │
        ├─ find rows: scheduled_time ≤ now AND status = "pending"
        │
        ├─ POST to Threads API → get post_id
        │
        ├─ wait 120 seconds
        │
        ├─ POST first_comment as reply to post_id
        │
        └─ update row: status = "posted" | "failed" | "posted_no_comment"
```

---

## Google Sheet Structure

| Column | Type | Notes |
|---|---|---|
| `scheduled_time` | `YYYY-MM-DD HH:MM` | Date + time of posting (always include date) |
| `timezone` | `ET` or `Kyiv` | Script converts to UTC |
| `post_text` | text | Main post body (max 500 chars) |
| `first_comment` | text | Comment posted 120s after post |
| `status` | enum | `pending` / `posted` / `posted_no_comment` / `failed` / `auth_error` |
| `posted_at` | timestamp | Filled by script after posting |
| `post_id` | string | Threads post ID (for reference) |
| `error` | text | Error message if failed |
| `retry_count` | number | 0–3, incremented on each failed attempt |

**Date format:** Always `YYYY-MM-DD HH:MM`. Partial formats are rejected — script logs a warning and skips the row.

---

## File Structure

```
tool-threads-poster/
├── poster.py           # main loop: find due rows, post, comment, update
├── threads_client.py   # Threads API: create post, create reply
├── sheets_client.py    # Google Sheets: read rows, update status
├── notifier.py         # Telegram alerts on failure
├── config.env          # secrets (not in git)
├── run.sh              # crontab entry point
└── requirements.txt    # gspread, requests, python-dotenv, pytz
```

---

## Threads API Flow

Meta App ID: `1914607169198574`
Threads App ID: `987367130812900`
Permissions: `threads_basic`, `threads_content_publish`, `threads_manage_replies`

**Posting a text post:**
```
POST https://graph.threads.net/v1.0/me/threads
  ?media_type=TEXT
  &text={post_text}
  &access_token={token}
→ returns: { id: "creation_id" }

POST https://graph.threads.net/v1.0/me/threads_publish
  ?creation_id={creation_id}
  &access_token={token}
→ returns: { id: "post_id" }
```

**Posting first comment (reply):**
```
POST https://graph.threads.net/v1.0/me/threads
  ?media_type=TEXT
  &text={first_comment}
  &reply_to_id={post_id}
  &access_token={token}
→ returns: { id: "reply_creation_id" }

POST https://graph.threads.net/v1.0/me/threads_publish
  ?creation_id={reply_creation_id}
  &access_token={token}
```

---

## Error Handling

| Scenario | Status | Action |
|---|---|---|
| Post published, comment failed | `posted_no_comment` | Telegram alert |
| Post failed (API error) | stays `pending`, `retry_count`++ | Telegram alert on attempt; after 3 attempts → `failed` |
| Token expired (401) | `auth_error` | Telegram alert — manual token refresh needed |
| Google Sheets unreachable | — | Log to `poster.log`, no Sheet update |

**Retry logic:** Script tracks `retry_count` in Sheet. Skips rows where `retry_count >= 3`.

**Token lifespan:** Long-lived token = 60 days. Script checks token expiry and alerts 7 days before via Telegram.

---

## Timezone Handling

Script converts all scheduled times to UTC before comparison with `datetime.now(UTC)`:
- `ET` → UTC-5 (EST) or UTC-4 (EDT), handled by `pytz`
- `Kyiv` → UTC+2 (EET) or UTC+3 (EEST), handled by `pytz`

---

## Notifications (Telegram)

Reuses existing bot from job-search agent (`TELEGRAM_TOKEN`, `TELEGRAM_CHAT_ID` already in env).

Alert format:
```
⚠️ Threads Poster: пост {scheduled_time} {timezone} не опублікувався
Помилка: {error_message}
Рядок: {sheet_row_number}
```

---

## config.env

```
THREADS_ACCESS_TOKEN=...
THREADS_APP_ID=987367130812900
GOOGLE_CREDENTIALS_PATH=./credentials.json
SPREADSHEET_ID=...
TELEGRAM_TOKEN=...
TELEGRAM_CHAT_ID=...
```

---

## Crontab

```
*/5 * * * * /Users/artem/.../tool-threads-poster/run.sh >> /Users/artem/.../poster.log 2>&1
```

`run.sh` activates virtualenv and runs `poster.py`.

---

## Google Sheets API Setup (one-time)

1. Google Cloud Console → new project → enable Sheets API
2. Create Service Account → download `credentials.json`
3. Share the Google Sheet with the service account email (Editor access)
4. Set `SPREADSHEET_ID` from the Sheet URL

---

## Out of Scope

- Image/video posts (text only for now)
- Multi-part threads (single posts only — per KB-03 recommendation: 150–200 words, one idea)
- Web UI for content management
- Analytics or engagement tracking
