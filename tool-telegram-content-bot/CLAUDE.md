@~/.claude/shared/coding-style.md
@~/.claude/shared/testing.md
@~/.claude/shared/security.md
@~/.claude/shared/code-review.md
@~/.claude/shared/development-workflow.md

# tool-telegram-content-bot

Telegram bot: forwards news posts → Claude API → generates Threads/LinkedIn content in Artem's TOV → approval loop → saves to Notion Content Calendar.

## Status: ON HOLD

**Blocker:** Anthropic API requires separate credit balance (not covered by Claude.ai subscription).
Fix: add credits at console.anthropic.com → Plans & Billing (min $5), then run.

## Run

```bash
cd tool-telegram-content-bot
source .venv/bin/activate   # or: python3 -m venv .venv && pip install -r requirements.txt
python3 bot.py
```

## Key files

| File | Purpose |
|---|---|
| `bot.py` | Entry point — Telegram handler, approval flow |
| `claude_client.py` | Anthropic API calls — generates post drafts |
| `notion_client_wrapper.py` | Saves approved posts to Notion Content Calendar |
| `url_fetcher.py` | Fetches article content from URLs in Telegram messages |
| `config.py` | Loads and validates env vars at startup |
| `state.py` | Tracks pending approvals between messages |

## Config (.env)

All credentials configured and correct. Required vars:
- `TELEGRAM_BOT_TOKEN`
- `ANTHROPIC_API_KEY` — needs credits at console.anthropic.com
- `NOTION_API_KEY`
- `NOTION_DATABASE_ID` — Content Calendar DB
- `ALLOWED_USER_ID` — Artem's Telegram user ID (whitelist)

## Flow

1. Artem sends news link/text to bot
2. Bot fetches article content (url_fetcher)
3. Claude generates Threads + LinkedIn drafts in Artem's TOV
4. Bot sends drafts for approval (inline buttons: Approve / Edit / Reject)
5. Approved → saved to Notion Content Calendar with status "Ready"

## Tests

```bash
pytest tests/   # 20/20 passing
```

## Notion

Content Calendar DB: `374d4d2e-2457-81ed-8808-cae6e74785a3`
