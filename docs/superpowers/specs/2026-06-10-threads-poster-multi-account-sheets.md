# Spec: Threads Poster — Multi-Account Shared Google Sheet

**Date:** 2026-06-10  
**Project:** `tool-threads-poster/`

## Goal

Replace per-account spreadsheets with a single Google Sheet where each account = one tab. Start by connecting `artem-org-ua`; `hmelinka` follows the same pattern later.

## Architecture

### Google Sheet structure

One spreadsheet, three tabs:

| Tab name | Account |
|----------|---------|
| `monetizer-biz` | @monetizer_biz (migrated from existing sheet) |
| `artem-org-ua` | @artem.org.ua (new) |
| `hmelinka` | @hmelinka (new) |

All tabs share identical column layout (9 columns):

```
post_text | first_comment | scheduled_time | timezone | status | posted_at | post_id | retry_count | error
```

- `scheduled_time` format: `YYYY-MM-DD HH:MM`
- `timezone` values: `ET` (maps to America/New_York) or `Europe/Kyiv`
- `status` flow: `pending` → `posted` / `failed` / `posted_partial` / `posted_no_comment` / `auth_error`

### Code changes

**`sheets_client.py`**
- `SheetsClient.__init__` gains a `sheet_tab: str` parameter
- `.sheet1` replaced with `.worksheet(sheet_tab)`

**`poster.py`**
- New CLI arg `--account` (default: `monetizer-biz`)
- `SheetsClient` instantiated with `sheet_tab=args.account`

**`run.sh`**
- Passes `--account "$ACCOUNT"` to `poster.py`

**Config files (`config.*.env`)**
- All three point to the same `SPREADSHEET_ID`
- No new env vars needed — tab name comes from `--account` CLI arg

### Crontab

Replace `*/5 * * * *` (all accounts) with per-account entries at fixed Kyiv-time slots:

| Account | Time (Kyiv) | UTC |
|---------|------------|-----|
| `monetizer-biz` | 17:00 | 14:00 |
| `artem-org-ua` | 09:00 and 19:00 | 06:00 / 16:00 |
| `hmelinka` | TBD |

Exact times confirmed with Artem before updating crontab.

## Connection checklist for `artem-org-ua`

1. Create tab `artem-org-ua` in the shared Google Sheet with correct column headers
2. Migrate `monetizer-biz` data to tab `monetizer-biz` in the same sheet
3. Update `config.monetizer-biz.env` → new `SPREADSHEET_ID`
4. Get Threads long-lived token for @artem.org.ua via Meta Developer Console
5. Fill `config.artem-org-ua.env` (token + shared `SPREADSHEET_ID`)
6. Update crontab

## Out of scope

- `hmelinka` connection (same pattern, separate session)
- Telegram Content Bot integration
- Column schema changes beyond documenting existing ones
