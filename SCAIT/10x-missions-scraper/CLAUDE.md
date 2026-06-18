@~/.claude/shared/coding-style.md
@~/.claude/shared/testing.md
@~/.claude/shared/security.md
@~/.claude/shared/development-workflow.md

# 10x-missions-scraper

Scrapes job missions from 10x Talent Portal and saves them to a Notion database.

## Run

```bash
cd "SCAIT/10x-missions-scraper"
pip install -r requirements.txt   # first time only
python fetch_missions.py
```

## Setup (first time)

```bash
cp .env.example .env   # fill BEARER_TOKEN, NOTION_TOKEN, NOTION_PARENT_PAGE_ID
python setup_notion.py  # creates Notion DB, prints NOTION_DATABASE_ID → add to .env
```

## Key files

| File | Purpose |
|---|---|
| `fetch_missions.py` | Fetches missions from 10x API → saves to Notion (skips duplicates) |
| `filter_missions.py` | Filters/searches existing Notion DB |
| `setup_notion.py` | One-time: creates Notion database structure |

## Config (.env)

| Var | Source |
|---|---|
| `BEARER_TOKEN` | DevTools → Network → any request to `web-api.10x.team` → Authorization header. Expires ~1hr |
| `NOTION_TOKEN` | notion.so/my-integrations → New integration → Secret |
| `NOTION_PARENT_PAGE_ID` | Notion page URL after workspace slug |
| `NOTION_DATABASE_ID` | Output of `setup_notion.py` (add after first setup) |

## Notion columns

`Role` · `Company` · `Location` · `Workplace` · `Budget` · `Domain` · `Status` · `Invited` · `Matched` · `URL` · `Date Found` · `Description`

Status values: `New` / `Interested` / `Applied` / `Skip`

## Notes

- Token expires ~1hr — refresh from DevTools before each run
- Duplicates auto-skipped (checked by Mission ID)
- Connect Notion integration to parent page before first run (page → `...` → Connections)
