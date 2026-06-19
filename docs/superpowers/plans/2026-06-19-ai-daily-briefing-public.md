# AI Daily Briefing — Public Repo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `tool-morning-briefing/` into a standalone public GitHub repo (`ai-daily-briefing/`) with a plugin adapter system (ClickUp/Notion/None) and a Claude-powered setup wizard.

**Architecture:** New repo at `/Users/artem/ai-daily-briefing/`. Adapters in `adapters/` return `Task` dataclass objects. `briefing.py` loads the correct adapter via factory. `setup.py` interviews the user, writes `config.env`, and registers macOS LaunchAgents via plist templates.

**Tech Stack:** Python 3.11+, python-dotenv, requests, pytest, macOS LaunchAgents, Claude CLI, Telegram Bot API, ClickUp API v2, Notion API 2022-06-28.

## Global Constraints

- macOS only — LaunchAgents for scheduling, no cron, no Linux support
- Python 3.11+ — use `ZoneInfo` from stdlib (no `pytz`)
- All adapters return `list[Task]` — never raw dicts or strings
- `Task` dataclass: `name: str`, `priority: str = "normal"`, `due: str | None = None`
- `TaskAdapter` is a `typing.Protocol` — no ABC inheritance required
- `_fmt_task(t: Task) -> str` lives in `formatter.py` — shared by formatter and prompts
- Prompts in English only — SYSTEM_PROMPT: `"Answer in English. No markdown.\nNumbered answers only — no intro, no summary."`
- COMMITMENT: token in evening prompt must stay uppercase — morning parser depends on it
- `config.env` is gitignored — never committed
- LaunchAgent labels: `com.{username}.morning-briefing` etc. — no hardcoded "artem"
- New repo dir: `/Users/artem/ai-daily-briefing/` — separate git repo, independent of current workspace
- All tests run from `ai-daily-briefing/` with: `cd /Users/artem/ai-daily-briefing && python -m pytest tests/ -v`

---

### Task 1: Repo scaffold + adapters/base.py

**Files:**
- Create: `/Users/artem/ai-daily-briefing/` (git init)
- Create: `adapters/__init__.py`
- Create: `adapters/base.py`
- Copy verbatim: `state.py`, `sender.py`, `run.sh` from `tool-morning-briefing/`
- Copy verbatim: `tests/test_state.py`, `tests/test_sender.py` from `tool-morning-briefing/tests/`
- Create: `tests/__init__.py`
- Create: `requirements.txt`
- Create: `.gitignore`
- Create: `logs/` dir (empty, with `.gitkeep`)

**Interfaces:**
- Produces: `Task` dataclass and `TaskAdapter` Protocol used by Tasks 2–8

- [ ] **Step 1: Create repo**

```bash
mkdir /Users/artem/ai-daily-briefing
cd /Users/artem/ai-daily-briefing
git init
mkdir -p adapters tests logs
touch adapters/__init__.py tests/__init__.py logs/.gitkeep
```

- [ ] **Step 2: Copy unchanged files**

```bash
cd /Users/artem/ai-daily-briefing
cp "/Users/artem/Claude v 1.0/tool-morning-briefing/state.py" .
cp "/Users/artem/Claude v 1.0/tool-morning-briefing/sender.py" .
cp "/Users/artem/Claude v 1.0/tool-morning-briefing/run.sh" .
cp "/Users/artem/Claude v 1.0/tool-morning-briefing/tests/test_state.py" tests/
cp "/Users/artem/Claude v 1.0/tool-morning-briefing/tests/test_sender.py" tests/
```

- [ ] **Step 3: Create requirements.txt**

```
requests>=2.31
python-dotenv>=1.0
pytest>=8.0
```

- [ ] **Step 4: Create .gitignore**

```
config.env
focus.md
state/
logs/
__pycache__/
.venv/
*.pyc
.pytest_cache/
```

- [ ] **Step 5: Write failing test for Task dataclass**

```python
# tests/test_base.py
from adapters.base import Task, TaskAdapter

def test_task_defaults():
    t = Task(name="Deploy")
    assert t.priority == "normal"
    assert t.due is None

def test_task_explicit():
    t = Task(name="Review", priority="high", due="2026-06-20")
    assert t.name == "Review"
    assert t.priority == "high"
    assert t.due == "2026-06-20"
```

- [ ] **Step 6: Run test — verify it fails**

```bash
cd /Users/artem/ai-daily-briefing
python -m pytest tests/test_base.py -v
```

Expected: `ModuleNotFoundError: No module named 'adapters.base'`

- [ ] **Step 7: Create adapters/base.py**

```python
from dataclasses import dataclass
from typing import Protocol


@dataclass
class Task:
    name: str
    priority: str = "normal"  # "high" | "normal" | "low"
    due: str | None = None


class TaskAdapter(Protocol):
    def get_tasks_due_today(self) -> list[Task]: ...
    def get_tasks_closed_today(self) -> list[Task]: ...
    def get_tasks_created_today(self) -> list[Task]: ...
    def get_tasks_closed_this_week(self) -> list[Task]: ...
    def get_tasks_created_this_week(self) -> list[Task]: ...
```

- [ ] **Step 8: Run test — verify it passes**

```bash
python -m pytest tests/test_base.py -v
```

Expected: `2 passed`

- [ ] **Step 9: Verify copied tests still pass**

```bash
python -m pytest tests/test_state.py tests/test_sender.py -v
```

Expected: all pass (adjust imports if needed — `from state import ...`, `from sender import ...`)

- [ ] **Step 10: Commit**

```bash
git add .
git commit -m "feat: repo scaffold, base types, copied state/sender"
```

---

### Task 2: adapters/none.py

**Files:**
- Create: `adapters/none.py`
- Create: `tests/test_none_adapter.py`

**Interfaces:**
- Consumes: `Task`, `TaskAdapter` from `adapters/base.py`
- Produces: `NoneAdapter` class — used by `load_adapter("none")` in Task 8

- [ ] **Step 1: Write failing test**

```python
# tests/test_none_adapter.py
from adapters.none import NoneAdapter

def test_none_adapter_all_empty():
    a = NoneAdapter()
    assert a.get_tasks_due_today() == []
    assert a.get_tasks_closed_today() == []
    assert a.get_tasks_created_today() == []
    assert a.get_tasks_closed_this_week() == []
    assert a.get_tasks_created_this_week() == []
```

- [ ] **Step 2: Run — verify fails**

```bash
python -m pytest tests/test_none_adapter.py -v
```

Expected: `ModuleNotFoundError: No module named 'adapters.none'`

- [ ] **Step 3: Create adapters/none.py**

```python
from .base import Task


class NoneAdapter:
    def get_tasks_due_today(self) -> list[Task]:
        return []

    def get_tasks_closed_today(self) -> list[Task]:
        return []

    def get_tasks_created_today(self) -> list[Task]:
        return []

    def get_tasks_closed_this_week(self) -> list[Task]:
        return []

    def get_tasks_created_this_week(self) -> list[Task]:
        return []
```

- [ ] **Step 4: Run — verify passes**

```bash
python -m pytest tests/test_none_adapter.py -v
```

Expected: `1 passed`

- [ ] **Step 5: Commit**

```bash
git add adapters/none.py tests/test_none_adapter.py
git commit -m "feat: NoneAdapter — no-op task adapter"
```

---

### Task 3: adapters/clickup.py

**Files:**
- Create: `adapters/clickup.py`
- Create: `tests/test_clickup.py`

**Interfaces:**
- Consumes: `Task` from `adapters/base.py`
- Produces: `ClickUpAdapter(token: str, team_id: str)` — used by `load_adapter("clickup")` in Task 8

**Note:** Existing `clickup_client.py` uses module-level functions returning `list[str]`. This task wraps that logic into a class returning `list[Task]`. The `_fmt()` string formatter is replaced by `_to_task()` which returns a `Task`.

- [ ] **Step 1: Write failing tests**

```python
# tests/test_clickup.py
from unittest.mock import patch, MagicMock
from adapters.clickup import ClickUpAdapter
from adapters.base import Task

MOCK_TASK = {
    "name": "Review PR",
    "priority": {"id": "2", "priority": "high"},
    "due_date": "1750000000000",
    "date_done": None,
    "date_created": "1749900000000",
    "status": {"type": "open"},
    "parent": None,
}

MOCK_CLOSED_TASK = {**MOCK_TASK, "name": "Deploy", "status": {"type": "closed"}, "date_done": "1750000000000"}


def _adapter():
    return ClickUpAdapter(token="pk_test", team_id="team123")


@patch("adapters.clickup.requests.get")
def test_get_tasks_due_today_returns_tasks(mock_get):
    mock_get.return_value = MagicMock(
        status_code=200,
        json=lambda: {"tasks": [MOCK_TASK]},
    )
    mock_get.return_value.raise_for_status = lambda: None
    tasks = _adapter().get_tasks_due_today()
    assert len(tasks) == 1
    assert isinstance(tasks[0], Task)
    assert tasks[0].name == "Review PR"
    assert tasks[0].priority == "high"


@patch("adapters.clickup.requests.get")
def test_get_tasks_closed_today_filters_open(mock_get):
    mock_get.return_value = MagicMock(
        status_code=200,
        json=lambda: {"tasks": [MOCK_TASK, MOCK_CLOSED_TASK]},
    )
    mock_get.return_value.raise_for_status = lambda: None
    tasks = _adapter().get_tasks_closed_today()
    assert all(t.name == "Deploy" for t in tasks)


@patch("adapters.clickup.requests.get")
def test_to_task_maps_priority(mock_get):
    mock_get.return_value = MagicMock(
        status_code=200,
        json=lambda: {"tasks": [MOCK_TASK]},
    )
    mock_get.return_value.raise_for_status = lambda: None
    tasks = _adapter().get_tasks_due_today()
    assert tasks[0].priority == "high"


@patch("adapters.clickup.requests.get")
def test_to_task_missing_priority_defaults_normal(mock_get):
    task = {**MOCK_TASK, "priority": None}
    mock_get.return_value = MagicMock(
        status_code=200,
        json=lambda: {"tasks": [task]},
    )
    mock_get.return_value.raise_for_status = lambda: None
    tasks = _adapter().get_tasks_due_today()
    assert tasks[0].priority == "normal"
```

- [ ] **Step 2: Run — verify fails**

```bash
python -m pytest tests/test_clickup.py -v
```

Expected: `ModuleNotFoundError: No module named 'adapters.clickup'`

- [ ] **Step 3: Create adapters/clickup.py**

```python
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

import requests

from .base import Task

_KYIV = ZoneInfo("Europe/Kiev")
_PRIORITY_MAP = {"1": "high", "2": "high", "3": "normal", "4": "low"}


class ClickUpAdapter:
    def __init__(self, token: str, team_id: str) -> None:
        self._token = token
        self._team_id = team_id

    def _get(self, params: dict) -> list:
        resp = requests.get(
            f"https://api.clickup.com/api/v2/team/{self._team_id}/task",
            headers={"Authorization": self._token},
            params={**params, "include_closed": "true", "subtasks": "true"},
            timeout=15,
        )
        resp.raise_for_status()
        return resp.json().get("tasks", [])

    def _to_task(self, t: dict) -> Task:
        p = t.get("priority") or {}
        priority = _PRIORITY_MAP.get(str(p.get("id", "3")), "normal") if p else "normal"
        due_ts = t.get("due_date")
        due = None
        if due_ts:
            due = datetime.fromtimestamp(int(due_ts) / 1000, tz=timezone.utc).strftime("%Y-%m-%d")
        return Task(name=t["name"], priority=priority, due=due)

    def _today_range(self) -> tuple[int, int]:
        now = datetime.now(_KYIV)
        start = datetime(now.year, now.month, now.day, 0, 0, 0, tzinfo=_KYIV)
        end = datetime(now.year, now.month, now.day, 23, 59, 59, tzinfo=_KYIV)
        return int(start.timestamp() * 1000), int(end.timestamp() * 1000)

    def _week_range(self) -> tuple[int, int]:
        now = datetime.now(_KYIV)
        monday = now - timedelta(days=now.weekday())
        start = datetime(monday.year, monday.month, monday.day, 0, 0, 0, tzinfo=_KYIV)
        friday = start + timedelta(days=4)
        end = datetime(friday.year, friday.month, friday.day, 23, 59, 59, tzinfo=_KYIV)
        return int(start.timestamp() * 1000), int(end.timestamp() * 1000)

    def get_tasks_due_today(self) -> list[Task]:
        start, end = self._today_range()
        raw = self._get({"due_date_gte": start, "due_date_lte": end})
        return [
            self._to_task(t) for t in raw
            if t.get("due_date")
            and start <= int(t["due_date"]) <= end
            and t.get("status", {}).get("type") != "closed"
        ][:15]

    def get_tasks_closed_today(self) -> list[Task]:
        start, end = self._today_range()
        raw = self._get({"date_updated_gte": start, "date_updated_lte": end})
        return [
            self._to_task(t) for t in raw
            if t.get("date_done")
            and start <= int(t["date_done"]) <= end
            and t.get("status", {}).get("type") == "closed"
        ][:15]

    def get_tasks_created_today(self) -> list[Task]:
        start, end = self._today_range()
        raw = self._get({"date_created_gte": start, "date_created_lte": end})
        return [
            self._to_task(t) for t in raw
            if t.get("date_created")
            and start <= int(t["date_created"]) <= end
            and not t.get("parent")
        ][:15]

    def get_tasks_closed_this_week(self) -> list[Task]:
        start, end = self._week_range()
        raw = self._get({"date_updated_gte": start, "date_updated_lte": end})
        return [
            self._to_task(t) for t in raw
            if t.get("date_done")
            and start <= int(t["date_done"]) <= end
            and t.get("status", {}).get("type") == "closed"
        ]

    def get_tasks_created_this_week(self) -> list[Task]:
        start, end = self._week_range()
        raw = self._get({"date_created_gte": start, "date_created_lte": end})
        return [
            self._to_task(t) for t in raw
            if t.get("date_created")
            and start <= int(t["date_created"]) <= end
            and not t.get("parent")
        ]
```

- [ ] **Step 4: Run — verify passes**

```bash
python -m pytest tests/test_clickup.py -v
```

Expected: `4 passed`

- [ ] **Step 5: Commit**

```bash
git add adapters/clickup.py tests/test_clickup.py
git commit -m "feat: ClickUpAdapter — wraps ClickUp API, returns Task objects"
```

---

### Task 4: adapters/notion.py

**Files:**
- Create: `adapters/notion.py`
- Create: `tests/test_notion.py`

**Interfaces:**
- Consumes: `Task` from `adapters/base.py`
- Produces: `NotionAdapter(token, database_id, done_property="Status", done_value="Done")`

**Notion API notes:**
- Base URL: `https://api.notion.com/v1`
- Header: `Notion-Version: 2022-06-28`
- Query endpoint: `POST /databases/{db_id}/query` with JSON body `{"filter": {...}}`
- Page title is in `properties["Name"]["title"][0]["plain_text"]` or `properties["Title"]["title"][0]["plain_text"]`
- Due date: `properties["Due"]["date"]["start"]` — may be absent if not set
- Status property: `properties[done_property]["select"]["name"]`
- Timezone-aware timestamps for filters use ISO 8601 with offset: `"2026-06-19T00:00:00+03:00"`

- [ ] **Step 1: Write failing tests**

```python
# tests/test_notion.py
from unittest.mock import patch, MagicMock
from adapters.notion import NotionAdapter
from adapters.base import Task

def _page(name: str, status: str = "In progress", due: str | None = "2026-06-19") -> dict:
    props = {
        "Name": {"title": [{"plain_text": name}]},
        "Status": {"select": {"name": status}},
    }
    if due:
        props["Due"] = {"date": {"start": due}}
    return {"properties": props, "created_time": "2026-06-19T08:00:00.000Z", "last_edited_time": "2026-06-19T10:00:00.000Z"}


def _adapter():
    return NotionAdapter(token="secret_test", database_id="db123")


@patch("adapters.notion.requests.post")
def test_get_tasks_due_today_returns_tasks(mock_post):
    mock_post.return_value = MagicMock(
        status_code=200,
        json=lambda: {"results": [_page("Design review")]},
    )
    mock_post.return_value.raise_for_status = lambda: None
    tasks = _adapter().get_tasks_due_today()
    assert len(tasks) == 1
    assert isinstance(tasks[0], Task)
    assert tasks[0].name == "Design review"
    assert tasks[0].priority == "normal"


@patch("adapters.notion.requests.post")
def test_get_tasks_due_today_no_due_date(mock_post):
    mock_post.return_value = MagicMock(
        status_code=200,
        json=lambda: {"results": [_page("No deadline", due=None)]},
    )
    mock_post.return_value.raise_for_status = lambda: None
    tasks = _adapter().get_tasks_due_today()
    assert tasks[0].due is None


@patch("adapters.notion.requests.post")
def test_empty_database(mock_post):
    mock_post.return_value = MagicMock(
        status_code=200,
        json=lambda: {"results": []},
    )
    mock_post.return_value.raise_for_status = lambda: None
    assert _adapter().get_tasks_closed_today() == []


@patch("adapters.notion.requests.post")
def test_custom_done_property(mock_post):
    props = {
        "Name": {"title": [{"plain_text": "Task"}]},
        "State": {"select": {"name": "Complete"}},
    }
    mock_post.return_value = MagicMock(
        status_code=200,
        json=lambda: {"results": [{"properties": props}]},
    )
    mock_post.return_value.raise_for_status = lambda: None
    adapter = NotionAdapter(token="t", database_id="d", done_property="State", done_value="Complete")
    tasks = adapter.get_tasks_closed_today()
    assert tasks[0].name == "Task"
```

- [ ] **Step 2: Run — verify fails**

```bash
python -m pytest tests/test_notion.py -v
```

Expected: `ModuleNotFoundError: No module named 'adapters.notion'`

- [ ] **Step 3: Create adapters/notion.py**

```python
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import requests

from .base import Task

_TZ = ZoneInfo("Europe/Kiev")
_NOTION_VERSION = "2022-06-28"


class NotionAdapter:
    _BASE = "https://api.notion.com/v1"

    def __init__(
        self,
        token: str,
        database_id: str,
        done_property: str = "Status",
        done_value: str = "Done",
    ) -> None:
        self._headers = {
            "Authorization": f"Bearer {token}",
            "Notion-Version": _NOTION_VERSION,
            "Content-Type": "application/json",
        }
        self._db = database_id
        self._done_property = done_property
        self._done_value = done_value

    def _query(self, body: dict) -> list[dict]:
        resp = requests.post(
            f"{self._BASE}/databases/{self._db}/query",
            headers=self._headers,
            json=body,
            timeout=15,
        )
        resp.raise_for_status()
        return resp.json().get("results", [])

    def _to_task(self, page: dict) -> Task:
        props = page.get("properties", {})
        title_prop = props.get("Name") or props.get("Title") or {}
        title_parts = title_prop.get("title", [])
        name = "".join(t.get("plain_text", "") for t in title_parts) or "(untitled)"
        due_prop = props.get("Due") or props.get("Due date") or {}
        due = (due_prop.get("date") or {}).get("start")
        return Task(name=name, priority="normal", due=due)

    def _today_iso(self) -> str:
        now = datetime.now(_TZ)
        return datetime(now.year, now.month, now.day, tzinfo=_TZ).isoformat()

    def _week_start_iso(self) -> str:
        now = datetime.now(_TZ).date()
        monday = now - timedelta(days=now.weekday())
        return datetime(monday.year, monday.month, monday.day, tzinfo=_TZ).isoformat()

    def _done_filter(self) -> dict:
        return {"property": self._done_property, "select": {"equals": self._done_value}}

    def _not_done_filter(self) -> dict:
        return {"property": self._done_property, "select": {"does_not_equal": self._done_value}}

    def get_tasks_due_today(self) -> list[Task]:
        today = datetime.now(_TZ).strftime("%Y-%m-%d")
        pages = self._query({"filter": {"and": [
            {"property": "Due", "date": {"equals": today}},
            self._not_done_filter(),
        ]}})
        return [self._to_task(p) for p in pages]

    def get_tasks_closed_today(self) -> list[Task]:
        pages = self._query({"filter": {"and": [
            {"timestamp": "last_edited_time", "last_edited_time": {"on_or_after": self._today_iso()}},
            self._done_filter(),
        ]}})
        return [self._to_task(p) for p in pages]

    def get_tasks_created_today(self) -> list[Task]:
        pages = self._query({"filter": {
            "timestamp": "created_time",
            "created_time": {"on_or_after": self._today_iso()},
        }})
        return [self._to_task(p) for p in pages]

    def get_tasks_closed_this_week(self) -> list[Task]:
        pages = self._query({"filter": {"and": [
            {"timestamp": "last_edited_time", "last_edited_time": {"on_or_after": self._week_start_iso()}},
            self._done_filter(),
        ]}})
        return [self._to_task(p) for p in pages]

    def get_tasks_created_this_week(self) -> list[Task]:
        pages = self._query({"filter": {
            "timestamp": "created_time",
            "created_time": {"on_or_after": self._week_start_iso()},
        }})
        return [self._to_task(p) for p in pages]
```

- [ ] **Step 4: Run — verify passes**

```bash
python -m pytest tests/test_notion.py -v
```

Expected: `4 passed`

- [ ] **Step 5: Commit**

```bash
git add adapters/notion.py tests/test_notion.py
git commit -m "feat: NotionAdapter — queries Notion database, returns Task objects"
```

---

### Task 5: reader.py + prompts.py

**Files:**
- Create: `reader.py`
- Create: `prompts.py`
- Create: `tests/test_reader.py`
- Create: `tests/test_prompts.py`

**Interfaces:**
- Produces: `read_focus(path: str) -> str` — used by `briefing.py` in Task 8
- Produces: `SYSTEM_PROMPT`, `build_morning_prompt`, `build_evening_prompt`, `build_weekly_prompt` — used by `briefing.py`
- Produces: `_fmt_task(t: Task) -> str` in `prompts.py` — shared formatting helper also imported by `formatter.py`

**Note:** `_fmt_task` lives in `prompts.py` (not formatter) because prompts need it first, and formatter imports it. This avoids a circular import.

- [ ] **Step 1: Write failing tests for reader**

```python
# tests/test_reader.py
import tempfile
from pathlib import Path
from reader import read_focus

def test_read_focus_returns_content(tmp_path):
    f = tmp_path / "focus.md"
    f.write_text("Q1: ship the product", encoding="utf-8")
    assert read_focus(str(f)) == "Q1: ship the product"

def test_read_focus_missing_file():
    result = read_focus("/nonexistent/focus.md")
    assert "[Focus file not found" in result

def test_read_focus_empty_file(tmp_path):
    f = tmp_path / "focus.md"
    f.write_text("", encoding="utf-8")
    assert read_focus(str(f)) == ""
```

- [ ] **Step 2: Run — verify fails**

```bash
python -m pytest tests/test_reader.py -v
```

Expected: `ModuleNotFoundError: No module named 'reader'`

- [ ] **Step 3: Create reader.py**

```python
from pathlib import Path


def read_focus(path: str) -> str:
    try:
        return Path(path).read_text(encoding="utf-8")
    except FileNotFoundError:
        return "[Focus file not found. Run setup.py to create it.]"
```

- [ ] **Step 4: Write failing tests for prompts**

```python
# tests/test_prompts.py
from datetime import date
from adapters.base import Task
from prompts import (
    SYSTEM_PROMPT,
    _fmt_task,
    build_morning_prompt,
    build_evening_prompt,
    build_weekly_prompt,
)

def test_system_prompt_english():
    assert "English" in SYSTEM_PROMPT
    assert "markdown" in SYSTEM_PROMPT.lower()

def test_fmt_task_with_due():
    t = Task(name="Deploy API", priority="high", due="2026-06-20")
    result = _fmt_task(t)
    assert "Deploy API" in result
    assert "high" in result
    assert "2026-06-20" in result

def test_fmt_task_without_due():
    t = Task(name="Review", priority="normal")
    result = _fmt_task(t)
    assert "Review" in result
    assert "--" in result

def test_morning_prompt_contains_commitment():
    today = date(2026, 6, 19)
    p = build_morning_prompt(today, "Done it", [], "Focus on shipping")
    assert "Done it" in p
    assert "COMMITMENT" in p
    assert "Focus on shipping" in p

def test_morning_prompt_empty_tasks():
    today = date(2026, 6, 19)
    p = build_morning_prompt(today, "n/a", [], "Focus")
    assert "None" in p or "No tasks" in p or "—" in p

def test_evening_prompt_contains_commitment_line():
    today = date(2026, 6, 19)
    tasks = [Task(name="Ship PR")]
    p = build_evening_prompt(today, "Morning plan text", tasks)
    assert "COMMITMENT:" in p

def test_weekly_prompt_with_no_prev_rate():
    today = date(2026, 6, 20)
    p = build_weekly_prompt(today, 10, 5, 67, None)
    assert "67%" in p
    assert "n/a" in p.lower() or "N/A" in p
```

- [ ] **Step 5: Run — verify fails**

```bash
python -m pytest tests/test_prompts.py -v
```

Expected: `ModuleNotFoundError: No module named 'prompts'`

- [ ] **Step 6: Create prompts.py**

```python
from datetime import date, timedelta

from adapters.base import Task

WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

SYSTEM_PROMPT = (
    "Answer in English. No markdown.\n"
    "Numbered answers only — no intro, no summary."
)

_MORNING = """{weekday}, {date}

INPUT:
Yesterday's commitment: {yesterday_commitment}
Tasks due today: {due_today}
Current focus: {current_focus}

QUESTIONS:
1. COMMITMENT — was it done? If not, one systemic reason.
2. GOAL — one task + metric that proves completion.
3. STOP — one thing you won't do today and why.

[120 words]"""

_EVENING = """{weekday}, {date}

INPUT:
Morning plan: {morning_state}
Closed today: {closed_today}

QUESTIONS:
1. FACT — plan vs. reality, point by point.
2. REASON — for each incomplete item: systemic reason, not "didn't have time".
3. COMMITMENT — "Tomorrow at __:__ I will ___"

Last line always: COMMITMENT: [tomorrow at X:00 I will Y]
[150 words]"""

_WEEKLY = """Week {week_num} · {date_range}

INPUT:
Closed: {closed_count} tasks
Opened: {created_count} tasks
Completion rate: {rate}% (last week: {prev_rate}, delta {delta})

QUESTIONS:
1. WINS — 2-3 results with numbers.
2. MISSED — what wasn't done + one systemic reason.
3. TREND — what the delta means + one action for next week.

[200 words]"""


def _fmt_task(t: Task) -> str:
    due_str = t.due or "--"
    return f"[{t.priority}] {t.name} ({due_str})"


def build_morning_prompt(
    today: date,
    yesterday_commitment: str,
    due_today: list[Task],
    current_focus: str,
) -> str:
    due_str = "\n".join(_fmt_task(t) for t in due_today) if due_today else "No tasks due"
    return _MORNING.format(
        weekday=WEEKDAYS[today.weekday()],
        date=f"{today.day} {MONTHS[today.month]}",
        yesterday_commitment=yesterday_commitment,
        due_today=due_str,
        current_focus=current_focus,
    )


def build_evening_prompt(
    today: date,
    morning_state: str,
    closed_today: list[Task],
) -> str:
    closed_str = "\n".join(_fmt_task(t) for t in closed_today) if closed_today else "None"
    return _EVENING.format(
        weekday=WEEKDAYS[today.weekday()],
        date=f"{today.day} {MONTHS[today.month]}",
        morning_state=morning_state,
        closed_today=closed_str,
    )


def build_weekly_prompt(
    today: date,
    closed_count: int,
    created_count: int,
    rate: int,
    prev_rate: float | None,
) -> str:
    monday = today - timedelta(days=today.weekday())
    friday = monday + timedelta(days=4)
    week_num = today.isocalendar()[1]
    date_range = f"{monday.day}-{friday.day} {MONTHS[friday.month]}"

    if prev_rate is None:
        prev_rate_str = "N/A"
        delta_str = "N/A"
    else:
        delta = rate - round(prev_rate)
        prev_rate_str = f"{round(prev_rate)}%"
        delta_str = f"{delta:+}%"

    return _WEEKLY.format(
        week_num=week_num,
        date_range=date_range,
        closed_count=closed_count,
        created_count=created_count,
        rate=rate,
        prev_rate=prev_rate_str,
        delta=delta_str,
    )
```

- [ ] **Step 7: Run all tests — verify passes**

```bash
python -m pytest tests/test_reader.py tests/test_prompts.py -v
```

Expected: `10 passed`

- [ ] **Step 8: Commit**

```bash
git add reader.py prompts.py tests/test_reader.py tests/test_prompts.py
git commit -m "feat: reader.py (read_focus), prompts.py (English, Task-aware)"
```

---

### Task 6: formatter.py

**Files:**
- Create: `formatter.py`
- Create: `tests/test_formatter.py`

**Interfaces:**
- Consumes: `Task` from `adapters/base.py`, `_fmt_task` from `prompts.py`
- Produces: `format_morning`, `format_evening`, `format_weekly` — used by `briefing.py`

**Note:** `append_personal_finance` is NOT included. Date labels are in English. `_fmt_task` is imported from `prompts.py`.

- [ ] **Step 1: Write failing tests**

```python
# tests/test_formatter.py
from datetime import date
from adapters.base import Task
from formatter import format_morning, format_evening, format_weekly

TODAY = date(2026, 6, 19)

def test_format_morning_structure():
    tasks = [Task(name="Ship PR", priority="high", due="2026-06-19")]
    msg = format_morning("1. Done\n2. Ship PR\n3. Skip meetings", TODAY, tasks)
    assert "🌅" in msg
    assert "Ship PR" in msg
    assert "high" in msg
    assert "<b>" in msg

def test_format_morning_html_escape():
    tasks = [Task(name="Review <code>")]
    msg = format_morning("text", TODAY, tasks)
    assert "<code>" not in msg
    assert "&lt;code&gt;" in msg

def test_format_morning_no_tasks():
    msg = format_morning("text", TODAY, [])
    assert "No tasks" in msg

def test_format_evening_counts():
    closed = [Task("Fix bug"), Task("Deploy")]
    msg = format_evening("text", TODAY, closed, created_count=3)
    assert "2" in msg
    assert "3" in msg

def test_format_weekly_rate():
    msg = format_weekly("text", TODAY, closed_count=15, created_count=5, rate=75)
    assert "75%" in msg
    assert "15" in msg
    assert "5" in msg
```

- [ ] **Step 2: Run — verify fails**

```bash
python -m pytest tests/test_formatter.py -v
```

Expected: `ModuleNotFoundError: No module named 'formatter'`

- [ ] **Step 3: Create formatter.py**

```python
from datetime import date, timedelta

from adapters.base import Task
from prompts import _fmt_task

_WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
_MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
_SEP = "───────────"


def _esc(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _date_label(d: date) -> str:
    return f"{_WEEKDAYS[d.weekday()]}, {d.day} {_MONTHS[d.month]}"


def _fmt_task_html(t: Task) -> str:
    due_str = t.due or "--"
    return f"• [{t.priority}] {_esc(t.name)} ({due_str})"


def format_morning(claude_text: str, today: date, due_today: list[Task]) -> str:
    header = f"🌅 <b>{_date_label(today)}</b>"
    if due_today:
        tasks_block = "\n".join(_fmt_task_html(t) for t in due_today)
    else:
        tasks_block = "No tasks due today"
    clickup = f"{_SEP}\n📋 <b>Tasks today</b>\n{tasks_block}"
    return f"{header}\n\n{_esc(claude_text)}\n\n{clickup}"


def format_evening(claude_text: str, today: date, closed_today: list[Task], created_count: int) -> str:
    header = f"🌙 <b>{_date_label(today)}</b>"
    clickup = (
        f"{_SEP}\n📊 <b>Today's summary</b>\n"
        f"✅ Closed: {len(closed_today)}   🆕 Opened: {created_count}"
    )
    return f"{header}\n\n{_esc(claude_text)}\n\n{clickup}"


def format_weekly(claude_text: str, today: date, closed_count: int, created_count: int, rate: int) -> str:
    monday = today - timedelta(days=today.weekday())
    friday = monday + timedelta(days=4)
    week_num = today.isocalendar()[1]
    header = f"📅 <b>Week {week_num} · {monday.day}–{friday.day} {_MONTHS[friday.month]}</b>"
    clickup = (
        f"{_SEP}\n📊 <b>Week {week_num}</b>\n"
        f"✅ Closed: {closed_count}   🆕 Opened: {created_count}   📈 Rate: {rate}%"
    )
    return f"{header}\n\n{_esc(claude_text)}\n\n{clickup}"
```

- [ ] **Step 4: Run — verify passes**

```bash
python -m pytest tests/test_formatter.py -v
```

Expected: `5 passed`

- [ ] **Step 5: Commit**

```bash
git add formatter.py tests/test_formatter.py
git commit -m "feat: formatter.py — English labels, Task dataclass, no personal_finance"
```

---

### Task 7: briefing.py

**Files:**
- Create: `briefing.py`
- Create: `tests/test_briefing.py`

**Interfaces:**
- Consumes: all adapters (`load_adapter`), `read_focus`, prompts, formatter, sender, state
- Produces: `main()` entrypoint called by `run.sh`

- [ ] **Step 1: Write failing tests**

```python
# tests/test_briefing.py
import os
import tempfile
from datetime import date
from pathlib import Path
from unittest.mock import patch, MagicMock
import pytest
from briefing import _claude_path, load_adapter, update_focus
from adapters.none import NoneAdapter
from adapters.clickup import ClickUpAdapter
from adapters.notion import NotionAdapter


def test_claude_path_returns_string():
    path = _claude_path()
    assert isinstance(path, str)
    assert len(path) > 0


def test_load_adapter_none():
    adapter = load_adapter("none")
    assert isinstance(adapter, NoneAdapter)


def test_load_adapter_clickup(monkeypatch):
    monkeypatch.setenv("CLICKUP_TOKEN", "pk_test")
    monkeypatch.setenv("CLICKUP_TEAM_ID", "team1")
    adapter = load_adapter("clickup")
    assert isinstance(adapter, ClickUpAdapter)


def test_load_adapter_unknown_defaults_none():
    adapter = load_adapter("asana")
    assert isinstance(adapter, NoneAdapter)


def test_update_focus_writes_file(tmp_path, monkeypatch):
    focus_file = tmp_path / "focus.md"
    focus_file.write_text("Old focus", encoding="utf-8")
    monkeypatch.setenv("FOCUS_MD_PATH", str(focus_file))

    mock_result = MagicMock(returncode=0, stdout="New focus content\n")
    with patch("briefing.subprocess.run", return_value=mock_result):
        update_focus(NoneAdapter())

    assert focus_file.read_text(encoding="utf-8") == "New focus content"


def test_update_focus_skips_on_claude_error(tmp_path, monkeypatch):
    focus_file = tmp_path / "focus.md"
    focus_file.write_text("Original", encoding="utf-8")
    monkeypatch.setenv("FOCUS_MD_PATH", str(focus_file))

    mock_result = MagicMock(returncode=1, stdout="", stderr="error")
    with patch("briefing.subprocess.run", return_value=mock_result):
        update_focus(NoneAdapter())

    assert focus_file.read_text(encoding="utf-8") == "Original"
```

- [ ] **Step 2: Run — verify fails**

```bash
python -m pytest tests/test_briefing.py -v
```

Expected: `ModuleNotFoundError: No module named 'briefing'`

- [ ] **Step 3: Create briefing.py**

```python
import argparse
import os
import shutil
import subprocess
from datetime import date, timedelta
from pathlib import Path

from dotenv import load_dotenv

from adapters.base import TaskAdapter
from adapters.clickup import ClickUpAdapter
from adapters.none import NoneAdapter
from adapters.notion import NotionAdapter
from formatter import format_evening, format_morning, format_weekly
from prompts import SYSTEM_PROMPT, build_evening_prompt, build_morning_prompt, build_weekly_prompt
from reader import read_focus
from sender import send_error_alert, send_telegram
from state import extract_commitment, load_state, load_weekly_rate, save_state, save_weekly_rate


def _claude_path() -> str:
    return shutil.which("claude") or os.path.expanduser("~/.local/bin/claude")


def generate_briefing(prompt: str) -> str:
    full_prompt = f"{SYSTEM_PROMPT}\n\n{prompt}"
    result = subprocess.run(
        [_claude_path(), "--print", full_prompt],
        capture_output=True, text=True, timeout=60,
    )
    if result.returncode != 0:
        raise RuntimeError(
            f"Claude CLI error (rc={result.returncode}):\n"
            f"stderr: {result.stderr.strip()}\nstdout: {result.stdout.strip()}"
        )
    return result.stdout.strip()


def load_adapter(task_manager: str) -> TaskAdapter:
    if task_manager == "clickup":
        return ClickUpAdapter(
            token=os.environ["CLICKUP_TOKEN"],
            team_id=os.environ["CLICKUP_TEAM_ID"],
        )
    if task_manager == "notion":
        return NotionAdapter(
            token=os.environ["NOTION_TOKEN"],
            database_id=os.environ["NOTION_DATABASE_ID"],
            done_property=os.environ.get("NOTION_DONE_PROPERTY", "Status"),
            done_value=os.environ.get("NOTION_DONE_VALUE", "Done"),
        )
    return NoneAdapter()


def update_focus(adapter: TaskAdapter) -> None:
    closed = adapter.get_tasks_closed_this_week()
    current_focus = read_focus(os.environ.get("FOCUS_MD_PATH", "focus.md"))
    prompt = (
        "Based on this week's completed tasks and the current focus, "
        "write an updated focus.md for next week. "
        "Plain text only. No markdown. No headers. 150 words max.\n\n"
        f"Current focus:\n{current_focus}\n\n"
        f"Completed this week: {[t.name for t in closed]}"
    )
    result = subprocess.run(
        [_claude_path(), "--print", prompt],
        capture_output=True, text=True, timeout=60,
    )
    if result.returncode == 0:
        Path(os.environ.get("FOCUS_MD_PATH", "focus.md")).write_text(
            result.stdout.strip(), encoding="utf-8"
        )


def run_morning(today: date, token: str, chat_id: str, dry_run: bool) -> None:
    adapter = load_adapter(os.environ.get("TASK_MANAGER", "none"))
    yesterday = today - timedelta(days=1)
    evening_state = load_state("evening", yesterday)
    yesterday_commitment = (
        extract_commitment(evening_state) if evening_state else "None (first day)"
    )
    current_focus = read_focus(os.environ.get("FOCUS_MD_PATH", "focus.md"))
    due_today = adapter.get_tasks_due_today()
    prompt = build_morning_prompt(today, yesterday_commitment, due_today, current_focus)
    text = generate_briefing(prompt)
    save_state("morning", today, text)
    message = format_morning(text, today, due_today)
    if dry_run:
        print(message)
    else:
        send_telegram(token, chat_id, message)


def run_evening(today: date, token: str, chat_id: str, dry_run: bool) -> None:
    adapter = load_adapter(os.environ.get("TASK_MANAGER", "none"))
    morning_state = load_state("morning", today) or "Morning briefing not found"
    closed_today = adapter.get_tasks_closed_today()
    created_today = adapter.get_tasks_created_today()
    prompt = build_evening_prompt(today, morning_state, closed_today)
    text = generate_briefing(prompt)
    save_state("evening", today, text)
    message = format_evening(text, today, closed_today, len(created_today))
    if dry_run:
        print(message)
    else:
        send_telegram(token, chat_id, message)


def run_weekly(today: date, token: str, chat_id: str, dry_run: bool) -> None:
    adapter = load_adapter(os.environ.get("TASK_MANAGER", "none"))
    closed = adapter.get_tasks_closed_this_week()
    created = adapter.get_tasks_created_this_week()
    closed_count, created_count = len(closed), len(created)
    total = closed_count + created_count
    rate = round(closed_count / total * 100) if total else 0

    iso = today.isocalendar()
    year, week = iso[0], iso[1]
    last_day_prev_year = date(year - 1, 12, 28)
    prev_year, prev_week, _ = last_day_prev_year.isocalendar()
    prev_rate = load_weekly_rate(prev_year, prev_week)

    prompt = build_weekly_prompt(today, closed_count, created_count, rate, prev_rate)
    text = generate_briefing(prompt)
    save_weekly_rate(year, week, float(rate))
    message = format_weekly(text, today, closed_count, created_count, rate)
    if dry_run:
        print(message)
    else:
        send_telegram(token, chat_id, message)
    update_focus(adapter)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--type", choices=["morning", "evening", "weekly"], default="morning")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    load_dotenv("config.env")
    token = os.environ["TELEGRAM_TOKEN"]
    chat_id = os.environ["TELEGRAM_CHAT_ID"]
    briefing_type = args.type
    today = date.today()

    try:
        if briefing_type == "morning":
            run_morning(today, token, chat_id, args.dry_run)
        elif briefing_type == "evening":
            run_evening(today, token, chat_id, args.dry_run)
        elif briefing_type == "weekly":
            run_weekly(today, token, chat_id, args.dry_run)
    except Exception as e:
        try:
            send_error_alert(token, chat_id, f"{briefing_type.capitalize()} briefing failed: {e}")
        except Exception:
            pass
        raise


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run — verify passes**

```bash
python -m pytest tests/test_briefing.py -v
```

Expected: `6 passed`

- [ ] **Step 5: Run full suite**

```bash
python -m pytest tests/ -v
```

Expected: all pass

- [ ] **Step 6: Commit**

```bash
git add briefing.py tests/test_briefing.py
git commit -m "feat: briefing.py — adapter factory, _claude_path, update_focus, run_*"
```

---

### Task 8: setup.py

**Files:**
- Create: `setup.py`
- Create: `launchagents/morning-briefing.plist.template`
- Create: `launchagents/evening-briefing.plist.template`
- Create: `launchagents/weekly-briefing.plist.template`
- Create: `tests/test_setup.py`

**Interfaces:**
- Consumes: `sender.send_telegram`, all env vars from config.env
- Produces: `config.env`, `focus.md`, three plists in `~/Library/LaunchAgents/`

- [ ] **Step 1: Create launchagents/ directory and templates**

```bash
mkdir /Users/artem/ai-daily-briefing/launchagents
```

`launchagents/morning-briefing.plist.template`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.{{USERNAME}}.morning-briefing</string>
    <key>ProgramArguments</key>
    <array>
        <string>{{REPO_PATH}}/run.sh</string>
        <string>--type</string>
        <string>morning</string>
    </array>
    <key>StartCalendarInterval</key>
    <array>
        <dict><key>Weekday</key><integer>1</integer><key>Hour</key><integer>{{MORNING_HOUR}}</integer><key>Minute</key><integer>{{MORNING_MINUTE}}</integer></dict>
        <dict><key>Weekday</key><integer>2</integer><key>Hour</key><integer>{{MORNING_HOUR}}</integer><key>Minute</key><integer>{{MORNING_MINUTE}}</integer></dict>
        <dict><key>Weekday</key><integer>3</integer><key>Hour</key><integer>{{MORNING_HOUR}}</integer><key>Minute</key><integer>{{MORNING_MINUTE}}</integer></dict>
        <dict><key>Weekday</key><integer>4</integer><key>Hour</key><integer>{{MORNING_HOUR}}</integer><key>Minute</key><integer>{{MORNING_MINUTE}}</integer></dict>
        <dict><key>Weekday</key><integer>5</integer><key>Hour</key><integer>{{MORNING_HOUR}}</integer><key>Minute</key><integer>{{MORNING_MINUTE}}</integer></dict>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
{{ENV_VARS}}
    </dict>
    <key>StandardOutPath</key>
    <string>{{REPO_PATH}}/logs/morning.log</string>
    <key>StandardErrorPath</key>
    <string>{{REPO_PATH}}/logs/morning.err</string>
</dict>
</plist>
```

`launchagents/evening-briefing.plist.template`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.{{USERNAME}}.evening-briefing</string>
    <key>ProgramArguments</key>
    <array>
        <string>{{REPO_PATH}}/run.sh</string>
        <string>--type</string>
        <string>evening</string>
    </array>
    <key>StartCalendarInterval</key>
    <array>
        <dict><key>Weekday</key><integer>1</integer><key>Hour</key><integer>{{EVENING_HOUR}}</integer><key>Minute</key><integer>{{EVENING_MINUTE}}</integer></dict>
        <dict><key>Weekday</key><integer>2</integer><key>Hour</key><integer>{{EVENING_HOUR}}</integer><key>Minute</key><integer>{{EVENING_MINUTE}}</integer></dict>
        <dict><key>Weekday</key><integer>3</integer><key>Hour</key><integer>{{EVENING_HOUR}}</integer><key>Minute</key><integer>{{EVENING_MINUTE}}</integer></dict>
        <dict><key>Weekday</key><integer>4</integer><key>Hour</key><integer>{{EVENING_HOUR}}</integer><key>Minute</key><integer>{{EVENING_MINUTE}}</integer></dict>
        <dict><key>Weekday</key><integer>5</integer><key>Hour</key><integer>{{EVENING_FRI_HOUR}}</integer><key>Minute</key><integer>{{EVENING_FRI_MINUTE}}</integer></dict>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
{{ENV_VARS}}
    </dict>
    <key>StandardOutPath</key>
    <string>{{REPO_PATH}}/logs/evening.log</string>
    <key>StandardErrorPath</key>
    <string>{{REPO_PATH}}/logs/evening.err</string>
</dict>
</plist>
```

`launchagents/weekly-briefing.plist.template`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.{{USERNAME}}.weekly-briefing</string>
    <key>ProgramArguments</key>
    <array>
        <string>{{REPO_PATH}}/run.sh</string>
        <string>--type</string>
        <string>weekly</string>
    </array>
    <key>StartCalendarInterval</key>
    <array>
        <dict><key>Weekday</key><integer>5</integer><key>Hour</key><integer>{{WEEKLY_HOUR}}</integer><key>Minute</key><integer>{{WEEKLY_MINUTE}}</integer></dict>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
{{ENV_VARS}}
    </dict>
    <key>StandardOutPath</key>
    <string>{{REPO_PATH}}/logs/weekly.log</string>
    <key>StandardErrorPath</key>
    <string>{{REPO_PATH}}/logs/weekly.err</string>
</dict>
</plist>
```

- [ ] **Step 2: Write failing tests for setup helpers**

```python
# tests/test_setup.py
import tempfile
from pathlib import Path
from setup import write_config, substitute_plist, _parse_time, _build_env_xml

def test_write_config(tmp_path):
    config = {"TASK_MANAGER": "none", "TELEGRAM_TOKEN": "tok", "TELEGRAM_CHAT_ID": "123"}
    write_config(config, tmp_path / "config.env")
    content = (tmp_path / "config.env").read_text()
    assert "TASK_MANAGER=none" in content
    assert "TELEGRAM_TOKEN=tok" in content

def test_parse_time():
    h, m = _parse_time("08:45")
    assert h == 8
    assert m == 45

def test_substitute_plist():
    template = "Label: com.{{USERNAME}}.morning\nPath: {{REPO_PATH}}/run.sh\nHour: {{MORNING_HOUR}}"
    result = substitute_plist(template, {
        "{{USERNAME}}": "alice",
        "{{REPO_PATH}}": "/home/alice/briefing",
        "{{MORNING_HOUR}}": "8",
    })
    assert "com.alice.morning" in result
    assert "/home/alice/briefing/run.sh" in result
    assert "Hour: 8" in result

def test_build_env_xml_clickup():
    config = {
        "TASK_MANAGER": "clickup",
        "CLICKUP_TOKEN": "pk_123",
        "CLICKUP_TEAM_ID": "t1",
        "TELEGRAM_TOKEN": "tg",
        "TELEGRAM_CHAT_ID": "chat",
        "FOCUS_MD_PATH": "/tmp/focus.md",
        "TZ": "Europe/Kiev",
    }
    xml = _build_env_xml(config, "/home/alice")
    assert "<key>CLICKUP_TOKEN</key>" in xml
    assert "<string>pk_123</string>" in xml
    assert "<key>HOME</key>" in xml
```

- [ ] **Step 3: Run — verify fails**

```bash
python -m pytest tests/test_setup.py -v
```

Expected: `ModuleNotFoundError: No module named 'setup'`

- [ ] **Step 4: Create setup.py**

```python
import getpass
import os
import shutil
import subprocess
from pathlib import Path

REPO_PATH = Path(__file__).parent.resolve()
LAUNCHAGENTS_DIR = Path.home() / "Library" / "LaunchAgents"

_ENV_KEYS_ALWAYS = [
    "TASK_MANAGER", "TELEGRAM_TOKEN", "TELEGRAM_CHAT_ID", "FOCUS_MD_PATH", "TZ",
]
_ENV_KEYS_CLICKUP = ["CLICKUP_TOKEN", "CLICKUP_TEAM_ID"]
_ENV_KEYS_NOTION = ["NOTION_TOKEN", "NOTION_DATABASE_ID", "NOTION_DONE_PROPERTY", "NOTION_DONE_VALUE"]


def ask(prompt: str, default: str = "") -> str:
    display = f"{prompt} [{default}]: " if default else f"{prompt}: "
    value = input(display).strip()
    return value or default


def _parse_time(t: str) -> tuple[int, int]:
    h, m = t.split(":")
    return int(h), int(m)


def _build_env_xml(config: dict, home: str) -> str:
    task_manager = config.get("TASK_MANAGER", "none")
    keys = list(_ENV_KEYS_ALWAYS)
    if task_manager == "clickup":
        keys += _ENV_KEYS_CLICKUP
    elif task_manager == "notion":
        keys += _ENV_KEYS_NOTION

    lines = []
    for key in keys:
        if key in config:
            lines.append(f"        <key>{key}</key>")
            lines.append(f"        <string>{config[key]}</string>")
    lines.append(f"        <key>HOME</key>")
    lines.append(f"        <string>{home}</string>")
    path_val = os.environ.get("PATH", "/usr/local/bin:/usr/bin:/bin")
    lines.append(f"        <key>PATH</key>")
    lines.append(f"        <string>{path_val}</string>")
    return "\n".join(lines)


def substitute_plist(template: str, substitutions: dict) -> str:
    result = template
    for placeholder, value in substitutions.items():
        result = result.replace(placeholder, value)
    return result


def write_config(config: dict, path: Path | None = None) -> None:
    target = path or (REPO_PATH / "config.env")
    lines = [f"{k}={v}" for k, v in config.items()]
    target.write_text("\n".join(lines) + "\n", encoding="utf-8")


def collect_config() -> dict:
    config: dict = {}

    print("\nWhich task manager do you use?")
    print("  1. ClickUp")
    print("  2. Notion")
    print("  3. None")
    choice = input("Enter 1, 2 or 3: ").strip()
    task_manager = {"1": "clickup", "2": "notion", "3": "none"}.get(choice, "none")
    config["TASK_MANAGER"] = task_manager

    if task_manager == "clickup":
        config["CLICKUP_TOKEN"] = ask("ClickUp API token")
        config["CLICKUP_TEAM_ID"] = ask("ClickUp Team ID")
    elif task_manager == "notion":
        config["NOTION_TOKEN"] = ask("Notion API token")
        config["NOTION_DATABASE_ID"] = ask("Notion database ID")
        config["NOTION_DONE_PROPERTY"] = ask("Status property name", "Status")
        config["NOTION_DONE_VALUE"] = ask("Done value", "Done")

    config["TELEGRAM_TOKEN"] = ask("Telegram bot token")
    config["TELEGRAM_CHAT_ID"] = ask("Telegram chat ID")
    config["TZ"] = ask("Timezone", "Europe/Kiev")

    print("\nBriefing times (Enter for defaults):")
    config["MORNING_TIME"] = ask("Morning Mon-Fri", "08:45")
    config["EVENING_TIME"] = ask("Evening Mon-Thu", "20:45")
    config["EVENING_FRI_TIME"] = ask("Evening Fri", "20:00")
    config["WEEKLY_TIME"] = ask("Weekly Fri", "20:05")
    config["FOCUS_MD_PATH"] = str(REPO_PATH / "focus.md")
    return config


def run_focus_interview() -> str:
    print("\n--- Focus Interview ---")
    answers = {
        "role": ask("What's your role — what do you do?"),
        "goals": ask("What are your top 2-3 goals for this quarter?"),
        "blocker": ask("What's your biggest current blocker or challenge?"),
        "success": ask("What does success look like for you in 3 months?"),
    }
    prompt = (
        "You are creating a personal focus file. "
        "Write focus.md based on these answers. "
        "Plain text only. No markdown. No headers. 150 words max.\n\n"
        f"Role: {answers['role']}\n"
        f"Goals: {answers['goals']}\n"
        f"Blocker: {answers['blocker']}\n"
        f"Success: {answers['success']}"
    )
    claude = shutil.which("claude") or os.path.expanduser("~/.local/bin/claude")
    result = subprocess.run([claude, "--print", prompt], capture_output=True, text=True, timeout=60)
    if result.returncode != 0:
        raise RuntimeError(f"Claude failed during focus interview: {result.stderr.strip()}")
    return result.stdout.strip()


def install_launchagents(config: dict) -> None:
    username = getpass.getuser()
    home = str(Path.home())
    templates_dir = REPO_PATH / "launchagents"

    morning_h, morning_m = _parse_time(config["MORNING_TIME"])
    evening_h, evening_m = _parse_time(config["EVENING_TIME"])
    evening_fri_h, evening_fri_m = _parse_time(config["EVENING_FRI_TIME"])
    weekly_h, weekly_m = _parse_time(config["WEEKLY_TIME"])
    env_xml = _build_env_xml(config, home)

    subs = {
        "{{USERNAME}}": username,
        "{{REPO_PATH}}": str(REPO_PATH),
        "{{MORNING_HOUR}}": str(morning_h),
        "{{MORNING_MINUTE}}": str(morning_m),
        "{{EVENING_HOUR}}": str(evening_h),
        "{{EVENING_MINUTE}}": str(evening_m),
        "{{EVENING_FRI_HOUR}}": str(evening_fri_h),
        "{{EVENING_FRI_MINUTE}}": str(evening_fri_m),
        "{{WEEKLY_HOUR}}": str(weekly_h),
        "{{WEEKLY_MINUTE}}": str(weekly_m),
        "{{ENV_VARS}}": env_xml,
    }

    for name in ["morning", "evening", "weekly"]:
        template = (templates_dir / f"{name}-briefing.plist.template").read_text(encoding="utf-8")
        content = substitute_plist(template, subs)
        plist_path = LAUNCHAGENTS_DIR / f"com.{username}.{name}-briefing.plist"
        plist_path.write_text(content, encoding="utf-8")
        subprocess.run(["launchctl", "load", str(plist_path)], check=True)
        print(f"  Loaded: {plist_path.name}")


def main() -> None:
    print("=== AI Daily Briefing Setup ===")

    config = collect_config()

    print("\nGenerating focus.md via Claude...")
    focus_text = run_focus_interview()
    (REPO_PATH / "focus.md").write_text(focus_text, encoding="utf-8")
    print(f"focus.md written ({len(focus_text)} chars)")

    write_config(config)
    print("config.env written")

    print("Installing LaunchAgents...")
    install_launchagents(config)

    from sender import send_telegram
    send_telegram(
        config["TELEGRAM_TOKEN"],
        config["TELEGRAM_CHAT_ID"],
        f"Briefing system ready. First morning briefing at {config['MORNING_TIME']}.",
        parse_mode=None,
    )
    print(f"\nSetup complete! First briefing at {config['MORNING_TIME']}.")


if __name__ == "__main__":
    main()
```

- [ ] **Step 5: Run — verify passes**

```bash
python -m pytest tests/test_setup.py -v
```

Expected: `4 passed`

- [ ] **Step 6: Run full suite**

```bash
python -m pytest tests/ -v
```

Expected: all pass

- [ ] **Step 7: Commit**

```bash
git add setup.py launchagents/ tests/test_setup.py
git commit -m "feat: setup.py wizard + plist templates"
```

---

### Task 9: run.sh + requirements.txt + README

**Files:**
- Create/verify: `run.sh`
- Verify: `requirements.txt`
- Create: `README.md`

**Note:** `run.sh` was copied in Task 1. Verify it works with the new repo structure. README covers install, prerequisites, and usage.

- [ ] **Step 1: Verify run.sh**

Open `run.sh` and confirm it contains:

```bash
#!/bin/bash
set -e
cd "$(dirname "$0")"
source .venv/bin/activate 2>/dev/null || true
python briefing.py "$@"
```

If it doesn't, replace it with the above.

- [ ] **Step 2: Make run.sh executable**

```bash
chmod +x /Users/artem/ai-daily-briefing/run.sh
```

- [ ] **Step 3: Create README.md**

```markdown
# AI Daily Briefing

Three automated briefings via Telegram, powered by Claude. Closed loop — each briefing feeds the next.

**Morning (08:45 Mon-Fri):** Yesterday's commitment checked. One goal. One stop.
**Evening (20:45 Mon-Thu, 20:00 Fri):** Plan vs. reality. Systemic reasons for gaps. Tomorrow's commitment.
**Weekly (20:05 Fri):** Completion rate. Week-over-week trend. Focus updated automatically.

## Prerequisites

- macOS (uses LaunchAgents for scheduling)
- Python 3.11+
- [Claude Code CLI](https://claude.ai/code) installed and authenticated
- Telegram bot token + chat ID
- Optional: ClickUp or Notion account

## Install

```bash
git clone https://github.com/yourusername/ai-daily-briefing.git
cd ai-daily-briefing
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python setup.py
```

Setup takes ~5 minutes. Claude will interview you to create your focus file.

## Manual run

```bash
source .venv/bin/activate
python briefing.py --type morning --dry-run
python briefing.py --type evening --dry-run
python briefing.py --type weekly --dry-run
```

## Supported task managers

| Manager | v1 |
|---------|-----|
| ClickUp | ✅  |
| Notion  | ✅  |
| None    | ✅  |
| Asana   | v2  |
| Trello  | v2  |

## Focus file

`focus.md` is your personal context — updated automatically every Friday after the weekly briefing.
To update manually: delete `focus.md` and run `python setup.py` again (it will skip already-configured steps if `config.env` exists — or re-run fully to reconfigure).

## Tests

```bash
python -m pytest tests/ -v
```
```

- [ ] **Step 4: Final test run**

```bash
cd /Users/artem/ai-daily-briefing
python -m pytest tests/ -v --tb=short
```

Expected: all pass, no warnings about missing modules.

- [ ] **Step 5: Commit**

```bash
git add run.sh README.md requirements.txt
git commit -m "docs: README, verify run.sh"
```

- [ ] **Step 6: Tag v0.1.0**

```bash
git tag v0.1.0
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Task adapter Protocol + Task dataclass — Task 1
- [x] NoneAdapter — Task 2
- [x] ClickUpAdapter (class, returns Task) — Task 3
- [x] NotionAdapter — Task 4
- [x] reader.py simplified (read_focus only) — Task 5
- [x] prompts.py English rewrite — Task 5
- [x] formatter.py (Task-aware, no personal_finance) — Task 6
- [x] briefing.py (_claude_path, load_adapter, update_focus, run_*) — Task 7
- [x] setup.py wizard (Block A + B + C) — Task 8
- [x] plist templates — Task 8
- [x] COMMITMENT: token preserved in evening prompt — Task 5 (prompts.py)
- [x] ISO week 52/53 fix carried over — Task 7 (briefing.py run_weekly)
- [x] LaunchAgent label uses username not "artem" — Task 8 (setup.py)
- [x] config.env gitignored — Task 1 (.gitignore)
- [x] English prompts — Task 5
- [x] update_focus skips on Claude error — Task 7

**Type consistency:**
- `Task` defined in Task 1, used in Tasks 2–7 ✓
- `_fmt_task(t: Task) -> str` defined in Task 5 (prompts.py), imported in Task 6 (formatter.py) ✓
- `load_adapter(task_manager: str) -> TaskAdapter` defined in Task 7 ✓
- `read_focus(path: str) -> str` defined in Task 5, used in Task 7 ✓
