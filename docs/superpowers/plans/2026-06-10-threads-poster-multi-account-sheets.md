# Threads Poster — Multi-Account Shared Google Sheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace per-account spreadsheets with one Google Sheet (one tab per account), and connect `artem-org-ua` as the second posting account alongside `monetizer-biz`.

**Architecture:** `run.sh` passes `--account <slug>` to `poster.py`, which uses the slug as the worksheet tab name when constructing `SheetsClient`. All accounts share one `SPREADSHEET_ID`; each has its own `config.<account>.env` with its Threads token.

**Tech Stack:** Python 3, gspread, python-dotenv, pytest. Crontab for scheduling.

---

## File Map

| File | Change |
|------|--------|
| `tool-threads-poster/sheets_client.py` | Add `sheet_tab` param; `.sheet1` → `.worksheet(sheet_tab)` |
| `tool-threads-poster/poster.py` | Add `--account` CLI arg; pass `sheet_tab` to `SheetsClient` |
| `tool-threads-poster/run.sh` | Pass `--account "$ACCOUNT"` to `poster.py` |
| `tool-threads-poster/tests/test_sheets_client.py` | Update `_make_client` mock; add tab-routing test |
| `tool-threads-poster/tests/test_poster.py` | Add test: `run()` passes `sheet_tab` to `SheetsClient` |
| `tool-threads-poster/config.monetizer-biz.env` | Update `SPREADSHEET_ID` to new shared sheet |
| `tool-threads-poster/config.artem-org-ua.env` | Create (token + new shared `SPREADSHEET_ID`) |

---

## Task 1: Update `SheetsClient` to use a named worksheet tab

**Files:**
- Modify: `tool-threads-poster/sheets_client.py`
- Modify: `tool-threads-poster/tests/test_sheets_client.py`

- [ ] **Step 1: Update `_make_client` helper and add a failing test**

Open `tool-threads-poster/tests/test_sheets_client.py`. Replace `_make_client` and add `test_opens_correct_worksheet_tab`:

```python
def _make_client(records, sheet_tab="monetizer-biz"):
    with patch("sheets_client.gspread.service_account") as mock_gc:
        mock_sheet = MagicMock()
        mock_sheet.get_all_records.return_value = records
        mock_sheet.row_values.return_value = HEADERS
        mock_gc.return_value.open_by_key.return_value.worksheet.return_value = mock_sheet
        client = SheetsClient("creds.json", "sheet_id", sheet_tab=sheet_tab)
        client._sheet = mock_sheet
        return client, mock_sheet


def test_opens_correct_worksheet_tab():
    with patch("sheets_client.gspread.service_account") as mock_gc:
        mock_spreadsheet = MagicMock()
        mock_gc.return_value.open_by_key.return_value = mock_spreadsheet
        SheetsClient("creds.json", "sheet_id", sheet_tab="artem-org-ua")
        mock_spreadsheet.worksheet.assert_called_once_with("artem-org-ua")
```

- [ ] **Step 2: Run the new test — expect failure**

```bash
cd "/Users/artem/Claude v 1.0/tool-threads-poster"
source .venv/bin/activate && pytest tests/test_sheets_client.py::test_opens_correct_worksheet_tab -v
```

Expected: `FAILED` — `TypeError: __init__() got an unexpected keyword argument 'sheet_tab'`

- [ ] **Step 3: Update `SheetsClient.__init__` in `sheets_client.py`**

Replace:

```python
class SheetsClient:
    def __init__(self, credentials_path: str, spreadsheet_id: str):
        gc = gspread.service_account(filename=credentials_path)
        self._sheet = gc.open_by_key(spreadsheet_id).sheet1
```

With:

```python
class SheetsClient:
    def __init__(self, credentials_path: str, spreadsheet_id: str, sheet_tab: str = "monetizer-biz"):
        gc = gspread.service_account(filename=credentials_path)
        self._sheet = gc.open_by_key(spreadsheet_id).worksheet(sheet_tab)
```

- [ ] **Step 4: Run all sheets tests — expect all pass**

```bash
pytest tests/test_sheets_client.py -v
```

Expected: all 9 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add tool-threads-poster/sheets_client.py tool-threads-poster/tests/test_sheets_client.py
git commit -m "feat: sheets_client accepts sheet_tab for multi-account support"
```

---

## Task 2: Update `poster.py` to pass `sheet_tab` to `SheetsClient`

**Files:**
- Modify: `tool-threads-poster/poster.py`
- Modify: `tool-threads-poster/tests/test_poster.py`

- [ ] **Step 1: Add a failing test for account routing**

Open `tool-threads-poster/tests/test_poster.py`. Add at the end:

```python
@patch("poster.load_dotenv")
@patch("poster.time.sleep")
@patch("poster.send_alert")
@patch("poster.SheetsClient")
@patch("poster.ThreadsClient")
def test_run_passes_sheet_tab_to_sheets_client(
    mock_tc, mock_sc, mock_alert, mock_sleep, mock_dotenv, monkeypatch
):
    _setup_env(monkeypatch)
    mock_tc.return_value = MagicMock()
    mock_sc.return_value = MagicMock()
    mock_sc.return_value.get_due_rows.return_value = []

    from poster import run
    run(sheet_tab="artem-org-ua")

    _, kwargs = mock_sc.call_args
    assert kwargs.get("sheet_tab") == "artem-org-ua"
```

- [ ] **Step 2: Run the new test — expect failure**

```bash
pytest tests/test_poster.py::test_run_passes_sheet_tab_to_sheets_client -v
```

Expected: `FAILED` — `run() got an unexpected keyword argument 'sheet_tab'`

- [ ] **Step 3: Update `run()` signature and `SheetsClient` call**

In `tool-threads-poster/poster.py`, change:

```python
def run(config_path: str = "config.env") -> None:
    load_dotenv(config_path)

    threads = ThreadsClient(os.environ["THREADS_ACCESS_TOKEN"])
    sheets = SheetsClient(
        os.environ["GOOGLE_CREDENTIALS_PATH"],
        os.environ["SPREADSHEET_ID"],
    )
```

To:

```python
def run(config_path: str = "config.env", sheet_tab: str = "monetizer-biz") -> None:
    load_dotenv(config_path)

    threads = ThreadsClient(os.environ["THREADS_ACCESS_TOKEN"])
    sheets = SheetsClient(
        os.environ["GOOGLE_CREDENTIALS_PATH"],
        os.environ["SPREADSHEET_ID"],
        sheet_tab=sheet_tab,
    )
```

- [ ] **Step 4: Update `__main__` block to add `--account` arg**

Replace:

```python
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="config.env", help="Path to .env config file")
    args = parser.parse_args()
    run(config_path=args.config)
```

With:

```python
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="config.env", help="Path to .env config file")
    parser.add_argument("--account", default="monetizer-biz", help="Account slug (used as sheet tab name)")
    args = parser.parse_args()
    run(config_path=args.config, sheet_tab=args.account)
```

- [ ] **Step 5: Run all poster tests — expect all pass**

```bash
pytest tests/test_poster.py -v
```

Expected: all tests PASS (existing tests unaffected — `run()` default is still `"monetizer-biz"`).

- [ ] **Step 6: Commit**

```bash
git add tool-threads-poster/poster.py tool-threads-poster/tests/test_poster.py
git commit -m "feat: poster accepts --account arg, passes sheet_tab to SheetsClient"
```

---

## Task 3: Update `run.sh` to pass `--account`

**Files:**
- Modify: `tool-threads-poster/run.sh`

- [ ] **Step 1: Add `--account` to the python call**

Replace the last line of `run.sh`:

```bash
python poster.py --config "$CONFIG"
```

With:

```bash
python poster.py --config "$CONFIG" --account "$ACCOUNT"
```

- [ ] **Step 2: Verify script syntax**

```bash
bash -n tool-threads-poster/run.sh && echo "OK"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add tool-threads-poster/run.sh
git commit -m "feat: run.sh passes --account to poster.py"
```

---

## Task 4: Create the shared Google Sheet (manual)

This task is done in the browser — no code.

- [ ] **Step 1: Create a new Google Sheet**

Go to [sheets.google.com](https://sheets.google.com) → New spreadsheet. Name it: `Threads Poster — All Accounts`.

- [ ] **Step 2: Rename the default tab to `monetizer-biz`**

Right-click Sheet1 → Rename → `monetizer-biz`.

- [ ] **Step 3: Add column headers to `monetizer-biz` tab (row 1)**

```
post_text | first_comment | scheduled_time | timezone | status | posted_at | post_id | retry_count | error
```

Paste these 9 headers into cells A1–I1.

- [ ] **Step 4: Migrate existing `monetizer-biz` data**

Open the old `monetizer-biz` spreadsheet (ID is in `config.monetizer-biz.env`). Copy all rows (except header) from the old sheet → paste into the new `monetizer-biz` tab starting at row 2. Verify column alignment matches the new header order.

- [ ] **Step 5: Create the `artem-org-ua` tab**

Click `+` at the bottom of the sheet → rename to `artem-org-ua`. Copy the same 9-column header row (A1:I1) from `monetizer-biz` tab → paste into `artem-org-ua` A1.

- [ ] **Step 6: Note the new SPREADSHEET_ID**

Copy the spreadsheet ID from the URL:  
`https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit`

Keep it — needed in Task 5.

- [ ] **Step 7: Share the sheet with the service account**

Open the spreadsheet → Share → paste the service account email from `credentials.json` field `"client_email"`. Give Editor access.

---

## Task 5: Update config files

**Files:**
- Modify: `tool-threads-poster/config.monetizer-biz.env`
- Create: `tool-threads-poster/config.artem-org-ua.env`

- [ ] **Step 1: Get the Threads long-lived token for @artem.org.ua**

Go to [developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer):
1. Select the Meta app that has Threads permissions
2. Add permission `threads_basic` + `threads_content_publish`
3. Generate token for @artem.org.ua account
4. Exchange for long-lived token (valid 60 days) via:

```bash
curl "https://graph.threads.net/refresh_access_token?grant_type=th_refresh_token&access_token=<SHORT_TOKEN>"
```

Copy the `access_token` from the response.

- [ ] **Step 2: Update `config.monetizer-biz.env`**

Change `SPREADSHEET_ID` to the new shared sheet ID from Task 4 Step 6. All other values stay the same.

- [ ] **Step 3: Create `config.artem-org-ua.env`**

```
THREADS_ACCESS_TOKEN=<long_lived_token_from_step_1>
THREADS_APP_ID=<app_id_from_meta_console>
GOOGLE_CREDENTIALS_PATH=./credentials.json
SPREADSHEET_ID=<new_shared_spreadsheet_id_from_task_4>
TELEGRAM_TOKEN=<telegram_bot_token>
TELEGRAM_CHAT_ID=<telegram_chat_id>
```

- [ ] **Step 4: Commit**

```bash
git add tool-threads-poster/config.monetizer-biz.env tool-threads-poster/config.artem-org-ua.env
git commit -m "config: migrate to shared spreadsheet, add artem-org-ua config"
```

---

## Task 6: Update crontab

- [ ] **Step 1: View current crontab**

```bash
crontab -l
```

Note the existing `*/5 * * * *` monetizer-biz line and the path to `run.sh`.

- [ ] **Step 2: Edit crontab**

```bash
crontab -e
```

Replace the existing `*/5 * * * *` monetizer-biz line with these entries (adjust the absolute path to match what was in the existing entry):

```
# monetizer-biz — 17:00 Kyiv (UTC+3) = 14:00 UTC
0 14 * * * /Users/artem/"Claude v 1.0"/tool-threads-poster/run.sh monetizer-biz >> /tmp/threads-monetizer-biz.log 2>&1

# artem-org-ua — 08:40 Kyiv = 05:40 UTC
40 5 * * * /Users/artem/"Claude v 1.0"/tool-threads-poster/run.sh artem-org-ua >> /tmp/threads-artem-org-ua.log 2>&1

# artem-org-ua — 19:40 Kyiv = 16:40 UTC
40 16 * * * /Users/artem/"Claude v 1.0"/tool-threads-poster/run.sh artem-org-ua >> /tmp/threads-artem-org-ua.log 2>&1
```

- [ ] **Step 3: Verify crontab saved**

```bash
crontab -l | grep threads
```

Expected: 3 lines (monetizer-biz + 2× artem-org-ua).

---

## Task 7: Smoke test

- [ ] **Step 1: Add a test row to `artem-org-ua` tab**

In the Google Sheet, `artem-org-ua` tab, add a row:

| post_text | first_comment | scheduled_time | timezone | status | posted_at | post_id | retry_count | error |
|-----------|--------------|----------------|----------|--------|-----------|---------|-------------|-------|
| Test post від @artem.org.ua — перевірка підключення. | 👇 | `<now minus 5 min>` | Europe/Kyiv | pending | | | 0 | |

Set `scheduled_time` to 5 minutes in the past (format: `YYYY-MM-DD HH:MM`).

- [ ] **Step 2: Run manually**

```bash
cd "/Users/artem/Claude v 1.0/tool-threads-poster"
./run.sh artem-org-ua
```

- [ ] **Step 3: Verify result**

Check:
1. Google Sheet row status changed to `posted`
2. `posted_at` and `post_id` filled in
3. Post visible on @artem.org.ua Threads profile
4. Telegram alert received (if any error)

- [ ] **Step 4: Delete test row from sheet**

Remove the test row so it doesn't interfere with real content.

- [ ] **Step 5: Run full test suite to confirm no regressions**

```bash
cd "/Users/artem/Claude v 1.0/tool-threads-poster"
source .venv/bin/activate && pytest tests/ -v
```

Expected: all tests PASS.
