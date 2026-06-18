@~/.claude/shared/coding-style.md
@~/.claude/shared/testing.md
@~/.claude/shared/security.md
@~/.claude/shared/code-review.md
@~/.claude/shared/development-workflow.md

# tool-threads-poster

Posts content to Threads from a Google Sheet. Multi-account support.

## Run

```bash
./run.sh                  # default: monetizer-biz
./run.sh artem-org-ua
./run.sh hmelinka
```

## Accounts

| Slug | Account | Config file |
|---|---|---|
| `monetizer-biz` | @monetizer_biz | `config.monetizer-biz.env` |
| `artem-org-ua` | @artem.org.ua | `config.artem-org-ua.env` (from template) |
| `hmelinka` | @hmelinka | `config.hmelinka.env` (from template) |

## Key files

| File | Purpose |
|---|---|
| `poster.py` | Main loop: reads Sheet, posts to Threads, updates status |
| `threads_client.py` | Threads API wrapper (create post, reply, media upload) |
| `sheets_client.py` | Google Sheets read/write |
| `notifier.py` | Telegram alert on error or success |
| `run.sh` | Entry point — activates venv, loads config, runs poster.py |

## Config (per account)

Copy `config.env.template` → `config.[account].env`. Required vars:
- `THREADS_ACCESS_TOKEN` — long-lived token from Meta developer console
- `SPREADSHEET_ID` — Google Sheet ID
- `GOOGLE_CREDENTIALS_PATH` — path to `credentials.json`
- `TELEGRAM_TOKEN` + `TELEGRAM_CHAT_ID` — for error alerts

## Google Sheet columns

`post_text` | `status` | `media_url` (optional) | `retry_count`

Status flow: `Ready` → `Posted` / `Failed`

## Thread replies

Long posts auto-split at sentence boundaries into thread replies. Max 500 chars per post. Replies posted with 120s delay between them.

## Tests

```bash
source .venv/bin/activate && pytest tests/
```

## Known quirks

- Empty `retry_count` cells are handled (treated as 0)
- Header row spaces are stripped automatically
- Container delay: 5s on startup to avoid race conditions on cron
