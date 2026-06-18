# Threads Poster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Local Python script that reads a Google Sheet, posts to Threads API on schedule, adds a first comment 120s later, and sends Telegram alerts on failure.

**Architecture:** Five focused modules — `threads_client` (API calls), `sheets_client` (Google Sheets read/write), `notifier` (Telegram), `poster` (orchestration) — wired together by `run.sh` via crontab every 5 minutes.

**Tech Stack:** Python 3.11+, `gspread`, `requests`, `python-dotenv`, `pytz`, `pytest`

---

## File Map

| File | Responsibility |
|---|---|
| `tool-threads-poster/threads_client.py` | Threads API: create post, create reply, error types |
| `tool-threads-poster/sheets_client.py` | Google Sheets: read due rows, update row fields |
| `tool-threads-poster/notifier.py` | Telegram alert, swallows network errors |
| `tool-threads-poster/poster.py` | Main loop: find rows → post → wait → reply → update |
| `tool-threads-poster/run.sh` | Crontab entry point: activate venv, run poster.py |
| `tool-threads-poster/config.env` | Secrets (not committed to git) |
| `tool-threads-poster/config.env.template` | Template with placeholder values |
| `tool-threads-poster/requirements.txt` | Python dependencies |
| `tool-threads-poster/tests/test_threads_client.py` | Unit tests for ThreadsClient |
| `tool-threads-poster/tests/test_sheets_client.py` | Unit tests for SheetsClient |
| `tool-threads-poster/tests/test_notifier.py` | Unit tests for send_alert |
| `tool-threads-poster/tests/test_poster.py` | Integration tests for run() |

---

## Task 1: Project Scaffold

**Files:**
- Create: `tool-threads-poster/` directory
- Create: `tool-threads-poster/requirements.txt`
- Create: `tool-threads-poster/config.env.template`
- Create: `tool-threads-poster/.gitignore`
- Create: `tool-threads-poster/tests/__init__.py`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p "/Users/artem/Claude v 1.0/tool-threads-poster/tests"
touch "/Users/artem/Claude v 1.0/tool-threads-poster/tests/__init__.py"
```

- [ ] **Step 2: Write requirements.txt**

Create `tool-threads-poster/requirements.txt`:
```
gspread==6.1.4
requests==2.32.3
python-dotenv==1.0.1
pytz==2024.1
pytest==8.2.2
```

- [ ] **Step 3: Write config.env.template**

Create `tool-threads-poster/config.env.template`:
```
THREADS_ACCESS_TOKEN=your_long_lived_token_here
THREADS_APP_ID=987367130812900
GOOGLE_CREDENTIALS_PATH=./credentials.json
SPREADSHEET_ID=your_google_sheet_id_here
TELEGRAM_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

- [ ] **Step 4: Write .gitignore**

Create `tool-threads-poster/.gitignore`:
```
config.env
credentials.json
.venv/
__pycache__/
*.pyc
poster.log
```

- [ ] **Step 5: Create virtualenv and install deps**

```bash
cd "/Users/artem/Claude v 1.0/tool-threads-poster"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Expected: `Successfully installed gspread-6.1.4 requests-2.32.3 ...`

- [ ] **Step 6: Commit**

```bash
cd "/Users/artem/Claude v 1.0"
git add tool-threads-poster/
git commit -m "chore: scaffold threads-poster project"
```

---

## Task 2: ThreadsClient (TDD)

**Files:**
- Create: `tool-threads-poster/threads_client.py`
- Create: `tool-threads-poster/tests/test_threads_client.py`

- [ ] **Step 1: Write failing tests**

Create `tool-threads-poster/tests/test_threads_client.py`:
```python
from unittest.mock import patch, MagicMock
import pytest
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from threads_client import ThreadsClient, ThreadsAuthError, ThreadsAPIError


def _resp(status_code, json_data):
    r = MagicMock()
    r.status_code = status_code
    r.ok = status_code < 400
    r.json.return_value = json_data
    r.text = str(json_data)
    return r


@pytest.fixture
def client():
    return ThreadsClient(access_token="test_token")


@patch("threads_client.requests.post")
def test_create_post_returns_post_id(mock_post, client):
    mock_post.side_effect = [
        _resp(200, {"id": "container_123"}),
        _resp(200, {"id": "post_456"}),
    ]
    assert client.create_post("Hello world") == "post_456"


@patch("threads_client.requests.post")
def test_create_reply_returns_reply_id(mock_post, client):
    mock_post.side_effect = [
        _resp(200, {"id": "container_789"}),
        _resp(200, {"id": "reply_012"}),
    ]
    result = client.create_reply("post_456", "My first comment")
    assert result == "reply_012"
    params = mock_post.call_args_list[0][1]["params"]
    assert params["reply_to_id"] == "post_456"


@patch("threads_client.requests.post")
def test_create_post_raises_auth_error_on_401(mock_post, client):
    mock_post.return_value = _resp(401, {"error": "invalid token"})
    with pytest.raises(ThreadsAuthError):
        client.create_post("Hello")


@patch("threads_client.requests.post")
def test_create_post_raises_api_error_on_500(mock_post, client):
    mock_post.return_value = _resp(500, {"error": "server error"})
    with pytest.raises(ThreadsAPIError):
        client.create_post("Hello")
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd "/Users/artem/Claude v 1.0/tool-threads-poster"
source .venv/bin/activate
pytest tests/test_threads_client.py -v
```

Expected: `ModuleNotFoundError: No module named 'threads_client'`

- [ ] **Step 3: Implement threads_client.py**

Create `tool-threads-poster/threads_client.py`:
```python
import requests


class ThreadsAuthError(Exception):
    pass


class ThreadsAPIError(Exception):
    pass


class ThreadsClient:
    BASE_URL = "https://graph.threads.net/v1.0"

    def __init__(self, access_token: str):
        self._token = access_token

    def create_post(self, text: str) -> str:
        creation_id = self._create_container(text, reply_to_id=None)
        return self._publish(creation_id)

    def create_reply(self, post_id: str, text: str) -> str:
        creation_id = self._create_container(text, reply_to_id=post_id)
        return self._publish(creation_id)

    def _create_container(self, text: str, reply_to_id: str | None) -> str:
        params = {
            "media_type": "TEXT",
            "text": text,
            "access_token": self._token,
        }
        if reply_to_id:
            params["reply_to_id"] = reply_to_id
        resp = requests.post(f"{self.BASE_URL}/me/threads", params=params)
        self._check(resp)
        return resp.json()["id"]

    def _publish(self, creation_id: str) -> str:
        params = {"creation_id": creation_id, "access_token": self._token}
        resp = requests.post(f"{self.BASE_URL}/me/threads_publish", params=params)
        self._check(resp)
        return resp.json()["id"]

    def _check(self, resp: requests.Response) -> None:
        if resp.status_code == 401:
            raise ThreadsAuthError("Access token expired or invalid")
        if not resp.ok:
            raise ThreadsAPIError(f"API error {resp.status_code}: {resp.text}")
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
pytest tests/test_threads_client.py -v
```

Expected: `4 passed`

- [ ] **Step 5: Commit**

```bash
cd "/Users/artem/Claude v 1.0"
git add tool-threads-poster/threads_client.py tool-threads-poster/tests/test_threads_client.py
git commit -m "feat: add ThreadsClient with post and reply"
```

---

## Task 3: SheetsClient (TDD)

**Files:**
- Create: `tool-threads-poster/sheets_client.py`
- Create: `tool-threads-poster/tests/test_sheets_client.py`

- [ ] **Step 1: Write failing tests**

Create `tool-threads-poster/tests/test_sheets_client.py`:
```python
from unittest.mock import MagicMock, patch
from datetime import datetime, timezone
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from sheets_client import SheetsClient


HEADERS = [
    "scheduled_time", "timezone", "post_text", "first_comment",
    "status", "posted_at", "post_id", "error", "retry_count"
]


def _make_client(records):
    with patch("sheets_client.gspread.service_account") as mock_gc:
        mock_sheet = MagicMock()
        mock_sheet.get_all_records.return_value = records
        mock_sheet.row_values.return_value = HEADERS
        mock_gc.return_value.open_by_key.return_value.sheet1 = mock_sheet
        client = SheetsClient("creds.json", "sheet_id")
        client._sheet = mock_sheet
        return client, mock_sheet


def _row(status="pending", retry_count=0, time="2026-06-08 07:00", tz="ET"):
    return {
        "scheduled_time": time, "timezone": tz,
        "post_text": "Hello", "first_comment": "Comment",
        "status": status, "posted_at": "", "post_id": "",
        "error": "", "retry_count": retry_count,
    }


# 12:00 UTC = 08:00 ET (EDT, UTC-4)
NOW = datetime(2026, 6, 8, 12, 0, tzinfo=timezone.utc)


def test_returns_due_pending_row():
    client, _ = _make_client([_row()])
    due = client.get_due_rows(NOW)
    assert len(due) == 1
    assert due[0]["post_text"] == "Hello"


def test_skips_already_posted_row():
    client, _ = _make_client([_row(status="posted")])
    assert client.get_due_rows(NOW) == []


def test_skips_row_with_max_retries():
    client, _ = _make_client([_row(retry_count=3)])
    assert client.get_due_rows(NOW) == []


def test_skips_future_row():
    client, _ = _make_client([_row(time="2026-06-08 20:00")])
    assert client.get_due_rows(NOW) == []


def test_kyiv_timezone_conversion():
    # 10:00 Kyiv (UTC+3) = 07:00 UTC → not yet at NOW (12:00 UTC)
    client, _ = _make_client([_row(time="2026-06-08 10:00", tz="Kyiv")])
    assert client.get_due_rows(NOW) == []


def test_row_includes_row_index():
    client, _ = _make_client([_row()])
    due = client.get_due_rows(NOW)
    assert due[0]["_row"] == 2


def test_update_row_sets_cell():
    client, mock_sheet = _make_client([])
    client.update_row(2, status="posted", post_id="abc123")
    calls = mock_sheet.update_cell.call_args_list
    updated_fields = {call[0][2] for call in calls}
    assert "posted" in updated_fields
    assert "abc123" in updated_fields
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
pytest tests/test_sheets_client.py -v
```

Expected: `ModuleNotFoundError: No module named 'sheets_client'`

- [ ] **Step 3: Implement sheets_client.py**

Create `tool-threads-poster/sheets_client.py`:
```python
from datetime import datetime, timezone
import gspread
import pytz


class SheetsClient:
    def __init__(self, credentials_path: str, spreadsheet_id: str):
        gc = gspread.service_account(filename=credentials_path)
        self._sheet = gc.open_by_key(spreadsheet_id).sheet1

    def get_due_rows(self, now_utc: datetime) -> list[dict]:
        records = self._sheet.get_all_records()
        due = []
        for i, row in enumerate(records, start=2):
            if row.get("status") != "pending":
                continue
            if int(row.get("retry_count", 0)) >= 3:
                continue
            scheduled = _parse_time(row["scheduled_time"], row["timezone"])
            if scheduled is None or scheduled > now_utc:
                continue
            due.append({"_row": i, **row})
        return due

    def update_row(self, row_index: int, **fields) -> None:
        headers = self._sheet.row_values(1)
        for key, value in fields.items():
            if key in headers:
                col = headers.index(key) + 1
                self._sheet.update_cell(row_index, col, value)


def _parse_time(scheduled_time: str, tz_name: str) -> datetime | None:
    try:
        tz = pytz.timezone(
            "America/New_York" if tz_name == "ET" else "Europe/Kyiv"
        )
        naive = datetime.strptime(scheduled_time, "%Y-%m-%d %H:%M")
        return tz.localize(naive).astimezone(timezone.utc)
    except Exception:
        return None
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
pytest tests/test_sheets_client.py -v
```

Expected: `8 passed`

- [ ] **Step 5: Commit**

```bash
cd "/Users/artem/Claude v 1.0"
git add tool-threads-poster/sheets_client.py tool-threads-poster/tests/test_sheets_client.py
git commit -m "feat: add SheetsClient with timezone-aware scheduling"
```

---

## Task 4: Notifier (TDD)

**Files:**
- Create: `tool-threads-poster/notifier.py`
- Create: `tool-threads-poster/tests/test_notifier.py`

- [ ] **Step 1: Write failing tests**

Create `tool-threads-poster/tests/test_notifier.py`:
```python
from unittest.mock import patch
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from notifier import send_alert


@patch("notifier.requests.post")
def test_send_alert_calls_telegram_api(mock_post):
    send_alert("bot_token", "chat_123", "Test message")
    mock_post.assert_called_once()
    url = mock_post.call_args[0][0]
    assert "bot_token" in url


@patch("notifier.requests.post", side_effect=Exception("Network error"))
def test_send_alert_does_not_raise_on_failure(mock_post):
    send_alert("bot_token", "chat_123", "Test message")  # must not raise
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
pytest tests/test_notifier.py -v
```

Expected: `ModuleNotFoundError: No module named 'notifier'`

- [ ] **Step 3: Implement notifier.py**

Create `tool-threads-poster/notifier.py`:
```python
import requests


def send_alert(token: str, chat_id: str, message: str) -> None:
    try:
        requests.post(
            f"https://api.telegram.org/bot{token}/sendMessage",
            data={"chat_id": chat_id, "text": message},
            timeout=10,
        )
    except Exception:
        pass
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
pytest tests/test_notifier.py -v
```

Expected: `2 passed`

- [ ] **Step 5: Commit**

```bash
cd "/Users/artem/Claude v 1.0"
git add tool-threads-poster/notifier.py tool-threads-poster/tests/test_notifier.py
git commit -m "feat: add Telegram notifier"
```

---

## Task 5: Poster — Main Loop (TDD)

**Files:**
- Create: `tool-threads-poster/poster.py`
- Create: `tool-threads-poster/tests/test_poster.py`

- [ ] **Step 1: Write failing tests**

Create `tool-threads-poster/tests/test_poster.py`:
```python
from unittest.mock import MagicMock, patch
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from threads_client import ThreadsAPIError, ThreadsAuthError


def _setup_env(monkeypatch):
    monkeypatch.setenv("THREADS_ACCESS_TOKEN", "tok")
    monkeypatch.setenv("GOOGLE_CREDENTIALS_PATH", "./creds.json")
    monkeypatch.setenv("SPREADSHEET_ID", "sheet_id")
    monkeypatch.setenv("TELEGRAM_TOKEN", "tg_tok")
    monkeypatch.setenv("TELEGRAM_CHAT_ID", "chat_id")


def _due_row():
    return {"_row": 2, "post_text": "Hello", "first_comment": "Comment", "retry_count": 0}


@patch("poster.load_dotenv")
@patch("poster.time.sleep")
@patch("poster.send_alert")
@patch("poster.SheetsClient")
@patch("poster.ThreadsClient")
def test_posts_and_replies(mock_tc, mock_sc, mock_alert, mock_sleep, mock_dotenv, monkeypatch):
    _setup_env(monkeypatch)
    mock_threads = MagicMock()
    mock_threads.create_post.return_value = "post_123"
    mock_tc.return_value = mock_threads
    mock_sheets = MagicMock()
    mock_sheets.get_due_rows.return_value = [_due_row()]
    mock_sc.return_value = mock_sheets

    from poster import run
    run()

    mock_threads.create_post.assert_called_once_with("Hello")
    mock_sleep.assert_called_once_with(120)
    mock_threads.create_reply.assert_called_once_with("post_123", "Comment")
    kw = mock_sheets.update_row.call_args[1]
    assert kw["status"] == "posted"
    assert kw["post_id"] == "post_123"


@patch("poster.load_dotenv")
@patch("poster.time.sleep")
@patch("poster.send_alert")
@patch("poster.SheetsClient")
@patch("poster.ThreadsClient")
def test_posted_no_comment_when_reply_fails(mock_tc, mock_sc, mock_alert, mock_sleep, mock_dotenv, monkeypatch):
    _setup_env(monkeypatch)
    mock_threads = MagicMock()
    mock_threads.create_post.return_value = "post_123"
    mock_threads.create_reply.side_effect = ThreadsAPIError("Reply failed")
    mock_tc.return_value = mock_threads
    mock_sheets = MagicMock()
    mock_sheets.get_due_rows.return_value = [_due_row()]
    mock_sc.return_value = mock_sheets

    from poster import run
    run()

    kw = mock_sheets.update_row.call_args[1]
    assert kw["status"] == "posted_no_comment"
    mock_alert.assert_called_once()


@patch("poster.load_dotenv")
@patch("poster.time.sleep")
@patch("poster.send_alert")
@patch("poster.SheetsClient")
@patch("poster.ThreadsClient")
def test_increments_retry_on_post_fail(mock_tc, mock_sc, mock_alert, mock_sleep, mock_dotenv, monkeypatch):
    _setup_env(monkeypatch)
    mock_threads = MagicMock()
    mock_threads.create_post.side_effect = ThreadsAPIError("Post failed")
    mock_tc.return_value = mock_threads
    mock_sheets = MagicMock()
    mock_sheets.get_due_rows.return_value = [_due_row()]
    mock_sc.return_value = mock_sheets

    from poster import run
    run()

    kw = mock_sheets.update_row.call_args[1]
    assert kw["retry_count"] == 1
    assert kw.get("status") != "posted"
    mock_alert.assert_called_once()


@patch("poster.load_dotenv")
@patch("poster.time.sleep")
@patch("poster.send_alert")
@patch("poster.SheetsClient")
@patch("poster.ThreadsClient")
def test_sets_failed_at_max_retries(mock_tc, mock_sc, mock_alert, mock_sleep, mock_dotenv, monkeypatch):
    _setup_env(monkeypatch)
    mock_threads = MagicMock()
    mock_threads.create_post.side_effect = ThreadsAPIError("Post failed")
    mock_tc.return_value = mock_threads
    mock_sheets = MagicMock()
    row = {**_due_row(), "retry_count": 2}
    mock_sheets.get_due_rows.return_value = [row]
    mock_sc.return_value = mock_sheets

    from poster import run
    run()

    kw = mock_sheets.update_row.call_args[1]
    assert kw["status"] == "failed"
    assert kw["retry_count"] == 3


@patch("poster.load_dotenv")
@patch("poster.time.sleep")
@patch("poster.send_alert")
@patch("poster.SheetsClient")
@patch("poster.ThreadsClient")
def test_stops_all_rows_on_auth_error(mock_tc, mock_sc, mock_alert, mock_sleep, mock_dotenv, monkeypatch):
    _setup_env(monkeypatch)
    mock_threads = MagicMock()
    mock_threads.create_post.side_effect = ThreadsAuthError("Token expired")
    mock_tc.return_value = mock_threads
    mock_sheets = MagicMock()
    mock_sheets.get_due_rows.return_value = [_due_row(), _due_row()]
    mock_sc.return_value = mock_sheets

    from poster import run
    run()

    # Only one update_row call (for the first row), not two
    assert mock_sheets.update_row.call_count == 1
    kw = mock_sheets.update_row.call_args[1]
    assert kw["status"] == "auth_error"
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
pytest tests/test_poster.py -v
```

Expected: `ModuleNotFoundError: No module named 'poster'`

- [ ] **Step 3: Implement poster.py**

Create `tool-threads-poster/poster.py`:
```python
import os
import time
from datetime import datetime, timezone

from dotenv import load_dotenv

from notifier import send_alert
from sheets_client import SheetsClient
from threads_client import ThreadsAPIError, ThreadsAuthError, ThreadsClient

COMMENT_DELAY_SECONDS = 120
MAX_RETRIES = 3


def run() -> None:
    load_dotenv("config.env")

    threads = ThreadsClient(os.environ["THREADS_ACCESS_TOKEN"])
    sheets = SheetsClient(
        os.environ["GOOGLE_CREDENTIALS_PATH"],
        os.environ["SPREADSHEET_ID"],
    )
    tg_token = os.environ["TELEGRAM_TOKEN"]
    tg_chat = os.environ["TELEGRAM_CHAT_ID"]

    due_rows = sheets.get_due_rows(datetime.now(timezone.utc))

    for row in due_rows:
        row_index = row["_row"]
        retry_count = int(row.get("retry_count", 0))

        try:
            post_id = threads.create_post(row["post_text"])
        except ThreadsAuthError as e:
            sheets.update_row(row_index, status="auth_error", error=str(e))
            send_alert(tg_token, tg_chat, f"⚠️ Threads: токен протермінований\n{e}")
            return
        except ThreadsAPIError as e:
            new_retry = retry_count + 1
            if new_retry >= MAX_RETRIES:
                sheets.update_row(row_index, status="failed", error=str(e), retry_count=new_retry)
            else:
                sheets.update_row(row_index, error=str(e), retry_count=new_retry)
            send_alert(tg_token, tg_chat, f"⚠️ Threads: пост не опублікувався (спроба {new_retry})\n{e}")
            continue

        time.sleep(COMMENT_DELAY_SECONDS)

        posted_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        try:
            threads.create_reply(post_id, row["first_comment"])
            sheets.update_row(
                row_index,
                status="posted",
                posted_at=posted_at,
                post_id=post_id,
                error="",
            )
        except (ThreadsAuthError, ThreadsAPIError) as e:
            sheets.update_row(
                row_index,
                status="posted_no_comment",
                posted_at=posted_at,
                post_id=post_id,
                error=str(e),
            )
            send_alert(tg_token, tg_chat, f"⚠️ Threads: пост опублікований, коментар не вдався\n{e}")


if __name__ == "__main__":
    run()
```

- [ ] **Step 4: Run all tests — expect PASS**

```bash
pytest tests/ -v
```

Expected: `15 passed`

- [ ] **Step 5: Commit**

```bash
cd "/Users/artem/Claude v 1.0"
git add tool-threads-poster/poster.py tool-threads-poster/tests/test_poster.py
git commit -m "feat: add poster main loop with retry and error handling"
```

---

## Task 6: run.sh + Crontab Setup

**Files:**
- Create: `tool-threads-poster/run.sh`

- [ ] **Step 1: Write run.sh**

Create `tool-threads-poster/run.sh`:
```bash
#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt -q
fi

source .venv/bin/activate
python poster.py
```

- [ ] **Step 2: Make executable**

```bash
chmod +x "/Users/artem/Claude v 1.0/tool-threads-poster/run.sh"
```

- [ ] **Step 3: Copy credentials and fill config.env**

```bash
cp "/Users/artem/Claude v 1.0/tool-threads-poster/config.env.template" \
   "/Users/artem/Claude v 1.0/tool-threads-poster/config.env"
```

Open `config.env` and fill in:
- `THREADS_ACCESS_TOKEN` — token from Meta Developer Console (generated in setup)
- `SPREADSHEET_ID` — from the Google Sheet URL: `https://docs.google.com/spreadsheets/d/{THIS_PART}/edit`
- `GOOGLE_CREDENTIALS_PATH` — path to downloaded service account JSON
- `TELEGRAM_TOKEN` + `TELEGRAM_CHAT_ID` — same as in job-search agent

- [ ] **Step 4: Test manual run**

```bash
"/Users/artem/Claude v 1.0/tool-threads-poster/run.sh"
```

Expected: script runs without error. Check `poster.log` if it exists, or no output means no due rows found (correct if sheet is empty).

- [ ] **Step 5: Add test row to Google Sheet**

In your Google Sheet, add a row:
```
scheduled_time: 2026-06-08 HH:MM  (2 minutes from now, your timezone)
timezone: Kyiv
post_text: Test post from automation
first_comment: Test first comment
status: pending
retry_count: 0
(leave other columns empty)
```

Wait 5 minutes and verify:
- Post appears on your Threads profile
- First comment appears ~2 minutes after post
- Row status in Sheet changed to "posted"

- [ ] **Step 6: Add crontab entry**

```bash
crontab -e
```

Add this line (note quotes for path with spaces):
```
*/5 * * * * "/Users/artem/Claude v 1.0/tool-threads-poster/run.sh" >> "/Users/artem/Claude v 1.0/tool-threads-poster/poster.log" 2>&1
```

**Mac sleep note:** The script only runs if your Mac is awake. To keep it awake during US posting hours (7–9am ET = 2–4pm Kyiv), go to **System Settings → Battery → Options → "Prevent automatic sleeping when display is off"** — or schedule a Power Nap window via Energy Saver.

- [ ] **Step 7: Verify crontab is active**

```bash
crontab -l
```

Expected: your line is listed.

- [ ] **Step 8: Commit**

```bash
cd "/Users/artem/Claude v 1.0"
git add tool-threads-poster/run.sh tool-threads-poster/config.env.template
git commit -m "feat: add run.sh and crontab instructions"
```

---

## Google Sheets Setup (one-time, before Task 6)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (e.g. "threads-poster")
3. Enable **Google Sheets API**: APIs & Services → Library → search "Sheets" → Enable
4. Create **Service Account**: APIs & Services → Credentials → Create Credentials → Service Account
5. Give it any name, skip optional fields
6. Under the service account: Keys → Add Key → JSON → Download
7. Save JSON as `tool-threads-poster/credentials.json`
8. Copy the service account email (looks like `name@project.iam.gserviceaccount.com`)
9. In your Google Sheet: Share → paste service account email → Editor

**Create the Sheet columns (Row 1 headers, exact spelling):**
```
scheduled_time | timezone | post_text | first_comment | status | posted_at | post_id | error | retry_count
```
