# Briefing System v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend `tool-morning-briefing/` into a 3-type closed-loop briefing system (morning / evening / weekly) with Tim Cook–style accountability prompts and structured Telegram HTML output.

**Architecture:** One unified `briefing.py` with `--type morning|evening|weekly` flag dispatches to type-specific runners. Morning saves its output to `state/morning-YYYY-MM-DD.txt`; evening reads it for comparison and writes `state/evening-YYYY-MM-DD.txt`; morning reads that back for the commitment check. Weekly reads ClickUp data for the full week and stores completion rate in `state/weekly-YYYY-Wnn.json`.

**Tech Stack:** Python 3.14, pytest 9.1, requests, python-dotenv, zoneinfo (stdlib), Telegram Bot API HTML parse_mode.

## Global Constraints

- All files live under `tool-morning-briefing/`
- Tests run from `tool-morning-briefing/` via `python -m pytest tests/ -v`
- No new dependencies — zoneinfo is stdlib in Python 3.9+
- Ukrainian output from Claude; no markdown in Claude responses
- All LaunchAgents: `StandardOutPath`/`StandardErrorPath` → `/tmp/morning-briefing.log`
- Mac timezone: `Europe/Kiev` — already confirmed

---

### Task 1: `state.py` — state persistence layer

**Files:**
- Create: `tool-morning-briefing/state.py`
- Create: `tool-morning-briefing/tests/test_state.py`

**Interfaces:**
- Produces:
  - `save_state(kind: str, d: date, text: str) -> None`
  - `load_state(kind: str, d: date) -> str | None`
  - `extract_commitment(evening_text: str) -> str`
  - `save_weekly_rate(year: int, week: int, rate: float) -> None`
  - `load_weekly_rate(year: int, week: int) -> float | None`
  - `STATE_DIR: Path` (module-level, monkeypatchable in tests)

- [ ] **Step 1: Write failing tests**

```python
# tool-morning-briefing/tests/test_state.py
from datetime import date
import state
from state import save_state, load_state, extract_commitment, save_weekly_rate, load_weekly_rate


def test_save_and_load_state(tmp_path, monkeypatch):
    monkeypatch.setattr(state, "STATE_DIR", tmp_path)
    d = date(2026, 6, 19)
    save_state("morning", d, "briefing text")
    assert load_state("morning", d) == "briefing text"


def test_load_state_returns_none_for_missing(tmp_path, monkeypatch):
    monkeypatch.setattr(state, "STATE_DIR", tmp_path)
    assert load_state("morning", date(2026, 6, 19)) is None


def test_extract_commitment_finds_line():
    text = "1. ФАКТ: done\n2. ПРИЧИНА: reason\nCOMMITMENT: завтра о 10:00 я зроблю X"
    assert extract_commitment(text) == "завтра о 10:00 я зроблю X"


def test_extract_commitment_case_insensitive():
    text = "commitment: завтра о 9:00 я зроблю Y"
    assert extract_commitment(text) == "завтра о 9:00 я зроблю Y"


def test_extract_commitment_returns_default_when_missing():
    text = "1. ФАКТ: done\n2. ПРИЧИНА: reason"
    assert extract_commitment(text) == "Немає"


def test_save_and_load_weekly_rate(tmp_path, monkeypatch):
    monkeypatch.setattr(state, "STATE_DIR", tmp_path)
    save_weekly_rate(2026, 25, 71.4)
    assert load_weekly_rate(2026, 25) == 71.4


def test_load_weekly_rate_returns_none_for_missing(tmp_path, monkeypatch):
    monkeypatch.setattr(state, "STATE_DIR", tmp_path)
    assert load_weekly_rate(2026, 25) is None
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
cd "/Users/artem/Claude v 1.0/tool-morning-briefing" && source .venv/bin/activate && python -m pytest tests/test_state.py -v
```

Expected: `ModuleNotFoundError: No module named 'state'`

- [ ] **Step 3: Implement `state.py`**

```python
# tool-morning-briefing/state.py
import json
from datetime import date
from pathlib import Path

STATE_DIR = Path(__file__).parent / "state"


def save_state(kind: str, d: date, text: str) -> None:
    STATE_DIR.mkdir(exist_ok=True)
    (STATE_DIR / f"{kind}-{d.isoformat()}.txt").write_text(text, encoding="utf-8")


def load_state(kind: str, d: date) -> str | None:
    path = STATE_DIR / f"{kind}-{d.isoformat()}.txt"
    if not path.exists():
        return None
    return path.read_text(encoding="utf-8")


def extract_commitment(evening_text: str) -> str:
    for line in evening_text.splitlines():
        if line.upper().startswith("COMMITMENT:"):
            return line[len("COMMITMENT:"):].strip()
    return "Немає"


def save_weekly_rate(year: int, week: int, rate: float) -> None:
    STATE_DIR.mkdir(exist_ok=True)
    path = STATE_DIR / f"weekly-{year}-W{week:02d}.json"
    path.write_text(json.dumps({"rate": rate}), encoding="utf-8")


def load_weekly_rate(year: int, week: int) -> float | None:
    path = STATE_DIR / f"weekly-{year}-W{week:02d}.json"
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))["rate"]
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
python -m pytest tests/test_state.py -v
```

Expected: 7 passed

- [ ] **Step 5: Commit**

```bash
git add tool-morning-briefing/state.py tool-morning-briefing/tests/test_state.py
git commit -m "feat: add state.py — save/load briefing state and weekly rate"
```

---

### Task 2: `prompts.py` — prompt templates

**Files:**
- Create: `tool-morning-briefing/prompts.py`
- Create: `tool-morning-briefing/tests/test_prompts.py`

**Interfaces:**
- Produces:
  - `SYSTEM_PROMPT: str`
  - `build_morning_prompt(today, yesterday_commitment, due_today, hot_md_current_focus) -> str`
  - `build_evening_prompt(today, morning_state, closed_today) -> str`
  - `build_weekly_prompt(today, closed_count, created_count, rate, prev_rate) -> str`

- [ ] **Step 1: Write failing tests**

```python
# tool-morning-briefing/tests/test_prompts.py
from datetime import date
from prompts import build_morning_prompt, build_evening_prompt, build_weekly_prompt, SYSTEM_PROMPT


def test_morning_prompt_includes_commitment():
    today = date(2026, 6, 19)
    result = build_morning_prompt(today, "завтра о 10:00 я зроблю X", ["• task 1"], "focus here")
    assert "завтра о 10:00 я зроблю X" in result
    assert "task 1" in result
    assert "focus here" in result
    assert "COMMITMENT" in result


def test_morning_prompt_no_due_shows_nemaye():
    today = date(2026, 6, 19)
    result = build_morning_prompt(today, "Немає (перший день)", [], "focus")
    assert "Немає" in result


def test_evening_prompt_includes_morning_state():
    today = date(2026, 6, 19)
    result = build_evening_prompt(today, "ранковий план тут", ["• task done"])
    assert "ранковий план тут" in result
    assert "task done" in result
    assert "COMMITMENT" in result


def test_evening_prompt_no_closed_shows_nemaye():
    today = date(2026, 6, 19)
    result = build_evening_prompt(today, "план", [])
    assert "Немає" in result


def test_weekly_prompt_includes_rate_and_delta():
    today = date(2026, 6, 20)
    result = build_weekly_prompt(today, 23, 18, 56, 48.0)
    assert "56%" in result
    assert "23" in result
    assert "18" in result
    assert "+8%" in result


def test_weekly_prompt_handles_no_prev_rate():
    today = date(2026, 6, 20)
    result = build_weekly_prompt(today, 10, 5, 67, None)
    assert "н/д" in result


def test_system_prompt_requires_ukrainian_and_no_markdown():
    assert "українською" in SYSTEM_PROMPT
    assert "markdown" in SYSTEM_PROMPT.lower()
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
python -m pytest tests/test_prompts.py -v
```

Expected: `ModuleNotFoundError: No module named 'prompts'`

- [ ] **Step 3: Implement `prompts.py`**

```python
# tool-morning-briefing/prompts.py
from datetime import date, timedelta

WEEKDAYS_UK = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"]
MONTHS_UK = ["", "січ", "лют", "бер", "кві", "тра", "чер", "лип", "сер", "вер", "жов", "лис", "гру"]

SYSTEM_PROMPT = (
    "Відповідай українською. Без markdown.\n"
    "Тільки пронумеровані відповіді — без вступу і підсумків."
)

_MORNING = """{weekday}, {date}

ВХІД:
Commitment вчора: {yesterday_commitment}
ClickUp сьогодні: {due_today}
Поточний фокус: {hot_md_current_focus}

ПИТАННЯ:
1. COMMITMENT — виконано? Якщо ні — одна системна причина.
2. ЦІЛЬ — одна задача + метрика що доведе виконання.
3. СТОП — одне що свідомо не робиш сьогодні і чому.

[120 слів]"""

_EVENING = """{weekday}, {date}

ВХІД:
Ранковий план: {morning_state}
Закрито сьогодні: {closed_today}

ПИТАННЯ:
1. ФАКТ — план vs реальність по пунктах.
2. ПРИЧИНА — по кожному незакритому: системна причина, не "не встиг".
3. COMMITMENT — "Завтра о __:__ я зроблю ___"

Останній рядок завжди: COMMITMENT: [завтра о X:00 я зроблю Y]
[150 слів]"""

_WEEKLY = """Тиждень {week_num} · {date_range}

ВХІД:
Закрито: {closed_count} задач
Нових відкрито: {created_count} задач
Completion rate: {rate}% (минулий: {prev_rate}, Δ{delta})

ПИТАННЯ:
1. ПЕРЕМОГИ — 2–3 результати з числами.
2. ПРОПУЩЕНО — що не зроблено + одна системна причина.
3. ТРЕНД — що означає Δ{delta} і одна дія на наступний тиждень.

[200 слів]"""


def build_morning_prompt(
    today: date,
    yesterday_commitment: str,
    due_today: list[str],
    hot_md_current_focus: str,
) -> str:
    due_str = "\n".join(due_today) if due_today else "Немає"
    return _MORNING.format(
        weekday=WEEKDAYS_UK[today.weekday()],
        date=f"{today.day} {MONTHS_UK[today.month]}",
        yesterday_commitment=yesterday_commitment,
        due_today=due_str,
        hot_md_current_focus=hot_md_current_focus,
    )


def build_evening_prompt(
    today: date,
    morning_state: str,
    closed_today: list[str],
) -> str:
    closed_str = "\n".join(closed_today) if closed_today else "Немає"
    return _EVENING.format(
        weekday=WEEKDAYS_UK[today.weekday()],
        date=f"{today.day} {MONTHS_UK[today.month]}",
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
    date_range = f"{monday.day}–{friday.day} {MONTHS_UK[friday.month]}"

    if prev_rate is None:
        prev_rate_str = "н/д"
        delta_str = "н/д"
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

- [ ] **Step 4: Run tests — verify they pass**

```bash
python -m pytest tests/test_prompts.py -v
```

Expected: 7 passed

- [ ] **Step 5: Commit**

```bash
git add tool-morning-briefing/prompts.py tool-morning-briefing/tests/test_prompts.py
git commit -m "feat: add prompts.py — morning/evening/weekly templates with SYSTEM_PROMPT"
```

---

### Task 3: `reader.py` — add `extract_current_focus()`

**Files:**
- Modify: `tool-morning-briefing/reader.py`
- Modify: `tool-morning-briefing/tests/test_reader.py`

**Interfaces:**
- Consumes: `reader.py` (existing `read_context`)
- Produces: `extract_current_focus(hot_md_text: str) -> str`

- [ ] **Step 1: Add failing tests to existing `test_reader.py`**

Append to `tool-morning-briefing/tests/test_reader.py`:

```python
from reader import extract_current_focus


def test_extract_current_focus_returns_section_content():
    text = (
        "# hot.md\n\n"
        "## Current Focus\n"
        "- Jello SC Build\n"
        "- FlowerOS\n\n"
        "## Open Decisions\n"
        "- something"
    )
    result = extract_current_focus(text)
    assert "Jello SC Build" in result
    assert "FlowerOS" in result
    assert "Open Decisions" not in result


def test_extract_current_focus_missing_section():
    text = "## Other Section\nsome content"
    result = extract_current_focus(text)
    assert result == "[Current Focus not found]"


def test_extract_current_focus_empty_section():
    text = "## Current Focus\n\n## Next Section\ncontent"
    result = extract_current_focus(text)
    assert result == "[Current Focus not found]"
```

- [ ] **Step 2: Run tests — verify new ones fail**

```bash
python -m pytest tests/test_reader.py -v
```

Expected: 2 existing pass, 3 new fail with `ImportError` or `AttributeError`

- [ ] **Step 3: Add `extract_current_focus` to `reader.py`**

Append to the bottom of `tool-morning-briefing/reader.py`:

```python
def extract_current_focus(hot_md_text: str) -> str:
    in_section = False
    result = []
    for line in hot_md_text.splitlines():
        if line.startswith("## Current Focus"):
            in_section = True
            continue
        if in_section:
            if line.startswith("## "):
                break
            result.append(line)
    content = "\n".join(result).strip()
    return content if content else "[Current Focus not found]"
```

- [ ] **Step 4: Run all tests — verify 5 pass**

```bash
python -m pytest tests/test_reader.py -v
```

Expected: 5 passed

- [ ] **Step 5: Commit**

```bash
git add tool-morning-briefing/reader.py tool-morning-briefing/tests/test_reader.py
git commit -m "feat: add extract_current_focus() to reader.py"
```

---

### Task 4: `clickup_client.py` — add week + today functions

**Files:**
- Modify: `tool-morning-briefing/clickup_client.py`
- Create: `tool-morning-briefing/tests/test_clickup.py`

**Interfaces:**
- Produces (new functions):
  - `get_tasks_closed_today(token, team_id, limit=15) -> list[str]`
  - `get_tasks_created_today(token, team_id, limit=15) -> list[str]`
  - `get_tasks_closed_this_week(token, team_id, limit=50) -> list[str]`
  - `get_tasks_created_this_week(token, team_id, limit=50) -> list[str]`
  - `_today_range_kyiv() -> tuple[int, int]` (internal, patchable in tests)
  - `_week_range_kyiv() -> tuple[int, int]` (internal, patchable in tests)

- [ ] **Step 1: Write failing tests**

```python
# tool-morning-briefing/tests/test_clickup.py
from unittest.mock import patch
import clickup_client
from clickup_client import (
    get_tasks_closed_today,
    get_tasks_created_today,
    get_tasks_closed_this_week,
    get_tasks_created_this_week,
)

START = 1718700000000
END = 1718799999000
MID = (START + END) // 2


def _task(name, status_type, date_done=None, date_created=None, parent=None):
    return {
        "name": name,
        "status": {"type": status_type},
        "date_done": str(date_done) if date_done else None,
        "date_created": str(date_created) if date_created else None,
        "parent": parent,
        "priority": {"priority": "normal"},
        "due_date": None,
    }


def test_get_tasks_closed_today_returns_closed_in_range():
    tasks = [
        _task("Done", "closed", date_done=MID),
        _task("Open", "open"),
        _task("Old closed", "closed", date_done=START - 1),
    ]
    with patch.object(clickup_client, "_get", return_value=tasks), \
         patch.object(clickup_client, "_today_range_kyiv", return_value=(START, END)):
        result = get_tasks_closed_today("token", "team")
    assert len(result) == 1
    assert "Done" in result[0]


def test_get_tasks_created_today_excludes_subtasks():
    tasks = [
        _task("Parent", "open", date_created=MID),
        _task("Subtask", "open", date_created=MID, parent="some_id"),
    ]
    with patch.object(clickup_client, "_get", return_value=tasks), \
         patch.object(clickup_client, "_today_range_kyiv", return_value=(START, END)):
        result = get_tasks_created_today("token", "team")
    assert len(result) == 1
    assert "Parent" in result[0]


def test_get_tasks_closed_this_week_returns_closed_in_range():
    tasks = [_task("Weekly done", "closed", date_done=MID)]
    with patch.object(clickup_client, "_get", return_value=tasks), \
         patch.object(clickup_client, "_week_range_kyiv", return_value=(START, END)):
        result = get_tasks_closed_this_week("token", "team")
    assert len(result) == 1
    assert "Weekly done" in result[0]


def test_get_tasks_created_this_week_excludes_subtasks():
    tasks = [
        _task("Top", "open", date_created=MID),
        _task("Sub", "open", date_created=MID, parent="p"),
    ]
    with patch.object(clickup_client, "_get", return_value=tasks), \
         patch.object(clickup_client, "_week_range_kyiv", return_value=(START, END)):
        result = get_tasks_created_this_week("token", "team")
    assert len(result) == 1
    assert "Top" in result[0]
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
python -m pytest tests/test_clickup.py -v
```

Expected: `ImportError` — functions not yet defined

- [ ] **Step 3: Add helpers and new functions to `clickup_client.py`**

Add at the top of the file, after the existing imports:

```python
from zoneinfo import ZoneInfo

_KYIV = ZoneInfo("Europe/Kiev")
```

Add after the existing `_day_range` function:

```python
def _today_range_kyiv() -> tuple[int, int]:
    now = datetime.now(_KYIV)
    start = datetime(now.year, now.month, now.day, 0, 0, 0, tzinfo=_KYIV)
    end = datetime(now.year, now.month, now.day, 23, 59, 59, tzinfo=_KYIV)
    return int(start.timestamp() * 1000), int(end.timestamp() * 1000)


def _week_range_kyiv() -> tuple[int, int]:
    now = datetime.now(_KYIV)
    monday = now - timedelta(days=now.weekday())
    start = datetime(monday.year, monday.month, monday.day, 0, 0, 0, tzinfo=_KYIV)
    friday = start + timedelta(days=4)
    end = datetime(friday.year, friday.month, friday.day, 23, 59, 59, tzinfo=_KYIV)
    return int(start.timestamp() * 1000), int(end.timestamp() * 1000)
```

Add at the bottom of `clickup_client.py`:

```python
def get_tasks_closed_today(token: str, team_id: str, limit: int = 15) -> list[str]:
    start, end = _today_range_kyiv()
    tasks = _get(token, team_id, {"date_updated_gte": start, "date_updated_lte": end})
    result = [
        _fmt(t) for t in tasks
        if t.get("date_done")
        and start <= int(t["date_done"]) <= end
        and t.get("status", {}).get("type") == "closed"
    ]
    return result[:limit]


def get_tasks_created_today(token: str, team_id: str, limit: int = 15) -> list[str]:
    start, end = _today_range_kyiv()
    tasks = _get(token, team_id, {"date_created_gte": start, "date_created_lte": end})
    result = [
        _fmt(t) for t in tasks
        if t.get("date_created")
        and start <= int(t["date_created"]) <= end
        and not t.get("parent")
    ]
    return result[:limit]


def get_tasks_closed_this_week(token: str, team_id: str, limit: int = 50) -> list[str]:
    start, end = _week_range_kyiv()
    tasks = _get(token, team_id, {"date_updated_gte": start, "date_updated_lte": end})
    result = [
        _fmt(t) for t in tasks
        if t.get("date_done")
        and start <= int(t["date_done"]) <= end
        and t.get("status", {}).get("type") == "closed"
    ]
    return result[:limit]


def get_tasks_created_this_week(token: str, team_id: str, limit: int = 50) -> list[str]:
    start, end = _week_range_kyiv()
    tasks = _get(token, team_id, {"date_created_gte": start, "date_created_lte": end})
    result = [
        _fmt(t) for t in tasks
        if t.get("date_created")
        and start <= int(t["date_created"]) <= end
        and not t.get("parent")
    ]
    return result[:limit]
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
python -m pytest tests/test_clickup.py -v
```

Expected: 4 passed

- [ ] **Step 5: Commit**

```bash
git add tool-morning-briefing/clickup_client.py tool-morning-briefing/tests/test_clickup.py
git commit -m "feat: add closed_today/created_today/this_week functions to clickup_client"
```

---

### Task 5: `formatter.py` — Telegram HTML output

**Files:**
- Create: `tool-morning-briefing/formatter.py`
- Create: `tool-morning-briefing/tests/test_formatter.py`

**Interfaces:**
- Produces:
  - `format_morning(claude_text, today, due_today) -> str`
  - `format_evening(claude_text, today, closed_today, created_count) -> str`
  - `format_weekly(claude_text, today, closed_count, created_count, rate) -> str`

- [ ] **Step 1: Write failing tests**

```python
# tool-morning-briefing/tests/test_formatter.py
from datetime import date
from formatter import format_morning, format_evening, format_weekly


def test_format_morning_header_and_clickup():
    today = date(2026, 6, 19)  # Friday
    result = format_morning("1. виконано\n2. ціль\n3. стоп", today, ["• [high] Task (06-19)"])
    assert "🌅" in result
    assert "<b>Пт, 19 чер</b>" in result
    assert "📋" in result
    assert "Task" in result


def test_format_morning_no_due_shows_nemaye():
    today = date(2026, 6, 19)
    result = format_morning("text", today, [])
    assert "Немає" in result


def test_format_morning_escapes_html_in_claude_text():
    today = date(2026, 6, 19)
    result = format_morning("text with <b>bold</b> & stuff", today, [])
    assert "&lt;b&gt;" in result
    assert "&amp;" in result
    assert "<b>Пт" in result  # header bold is NOT escaped


def test_format_evening_shows_counts():
    today = date(2026, 6, 19)
    result = format_evening("1. факт\n2. причина\nCOMMITMENT: x", today, ["t1", "t2"], 3)
    assert "🌙" in result
    assert "✅ Закрито: 2" in result
    assert "🆕 Відкрито: 3" in result


def test_format_weekly_shows_rate_and_counts():
    today = date(2026, 6, 20)  # Saturday — week 25
    result = format_weekly("1. перемоги\n2. пропущено\n3. тренд", today, 23, 18, 56)
    assert "📅" in result
    assert "Rate: 56%" in result
    assert "Закрито: 23" in result
    assert "Відкрито: 18" in result
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
python -m pytest tests/test_formatter.py -v
```

Expected: `ModuleNotFoundError: No module named 'formatter'`

- [ ] **Step 3: Implement `formatter.py`**

```python
# tool-morning-briefing/formatter.py
from datetime import date, timedelta

_WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"]
_MONTHS = ["", "січ", "лют", "бер", "кві", "тра", "чер", "лип", "сер", "вер", "жов", "лис", "гру"]
_SEP = "───────────"


def _esc(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _date_label(d: date) -> str:
    return f"{_WEEKDAYS[d.weekday()]}, {d.day} {_MONTHS[d.month]}"


def format_morning(claude_text: str, today: date, due_today: list[str]) -> str:
    header = f"🌅 <b>{_date_label(today)}</b>"
    tasks = "\n".join(_esc(t) for t in due_today) if due_today else "Немає"
    clickup = f"{_SEP}\n📋 <b>ClickUp · сьогодні</b>\n{tasks}"
    return f"{header}\n\n{_esc(claude_text)}\n\n{clickup}"


def format_evening(claude_text: str, today: date, closed_today: list[str], created_count: int) -> str:
    header = f"🌙 <b>{_date_label(today)}</b>"
    clickup = (
        f"{_SEP}\n📊 <b>ClickUp · сьогодні</b>\n"
        f"✅ Закрито: {len(closed_today)}   🆕 Відкрито: {created_count}"
    )
    return f"{header}\n\n{_esc(claude_text)}\n\n{clickup}"


def format_weekly(claude_text: str, today: date, closed_count: int, created_count: int, rate: int) -> str:
    monday = today - timedelta(days=today.weekday())
    friday = monday + timedelta(days=4)
    week_num = today.isocalendar()[1]
    header = f"📅 <b>Тиждень {week_num} · {monday.day}–{friday.day} {_MONTHS[friday.month]}</b>"
    clickup = (
        f"{_SEP}\n📊 <b>Тиждень {week_num}</b>\n"
        f"✅ Закрито: {closed_count}   🆕 Відкрито: {created_count}   📈 Rate: {rate}%"
    )
    return f"{header}\n\n{_esc(claude_text)}\n\n{clickup}"
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
python -m pytest tests/test_formatter.py -v
```

Expected: 5 passed

- [ ] **Step 5: Commit**

```bash
git add tool-morning-briefing/formatter.py tool-morning-briefing/tests/test_formatter.py
git commit -m "feat: add formatter.py — HTML Telegram output for morning/evening/weekly"
```

---

### Task 6: `sender.py` — add HTML parse_mode

**Files:**
- Modify: `tool-morning-briefing/sender.py`
- Modify: `tool-morning-briefing/tests/test_sender.py`

**Interfaces:**
- Modifies: `send_telegram(token, chat_id, text, parse_mode="HTML") -> None`
- Modifies: `send_error_alert(token, chat_id, message) -> None` — no longer adds prefix; caller owns it

- [ ] **Step 1: Update tests in `test_sender.py`**

Replace the entire contents of `tool-morning-briefing/tests/test_sender.py`:

```python
from unittest.mock import patch

from sender import send_error_alert, send_telegram


def test_send_telegram_posts_with_html_parse_mode():
    with patch("sender.requests.post") as mock_post:
        send_telegram("TOKEN123", "CHAT456", "Hello")

    mock_post.assert_called_once_with(
        "https://api.telegram.org/botTOKEN123/sendMessage",
        data={"chat_id": "CHAT456", "text": "Hello", "parse_mode": "HTML"},
        timeout=10,
    )


def test_send_error_alert_forwards_message_as_given():
    with patch("sender.send_telegram") as mock_send:
        send_error_alert("TOKEN", "CHAT", "Evening briefing failed: network error")

    mock_send.assert_called_once_with(
        "TOKEN", "CHAT", "Evening briefing failed: network error"
    )


def test_send_error_alert_does_not_raise_on_telegram_failure():
    with patch("sender.send_telegram", side_effect=Exception("network error")):
        send_error_alert("TOKEN", "CHAT", "error")  # must not raise
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
python -m pytest tests/test_sender.py -v
```

Expected: 2 fail (parse_mode and prefix tests), 1 pass

- [ ] **Step 3: Update `sender.py`**

Replace entire contents of `tool-morning-briefing/sender.py`:

```python
import requests


def send_telegram(token: str, chat_id: str, text: str, parse_mode: str = "HTML") -> None:
    requests.post(
        f"https://api.telegram.org/bot{token}/sendMessage",
        data={"chat_id": chat_id, "text": text, "parse_mode": parse_mode},
        timeout=10,
    )


def send_error_alert(token: str, chat_id: str, message: str) -> None:
    try:
        send_telegram(token, chat_id, message)
    except Exception:
        pass
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
python -m pytest tests/test_sender.py -v
```

Expected: 3 passed

- [ ] **Step 5: Commit**

```bash
git add tool-morning-briefing/sender.py tool-morning-briefing/tests/test_sender.py
git commit -m "feat: sender.py — HTML parse_mode, caller-owned error prefix"
```

---

### Task 7: `briefing.py` — full refactor with `--type` dispatch

**Files:**
- Modify: `tool-morning-briefing/briefing.py`
- Modify: `tool-morning-briefing/tests/test_briefing.py`

**Interfaces:**
- Consumes: `state.py`, `prompts.py`, `reader.py`, `clickup_client.py`, `formatter.py`, `sender.py`
- Produces: `generate_briefing(prompt: str) -> str` (kept, used by all runners)

- [ ] **Step 1: Update `test_briefing.py`**

Replace entire contents of `tool-morning-briefing/tests/test_briefing.py`:

```python
from unittest.mock import MagicMock, patch

from briefing import generate_briefing
from prompts import SYSTEM_PROMPT


def test_generate_briefing_prepends_system_prompt_and_calls_claude():
    mock_result = MagicMock()
    mock_result.returncode = 0
    mock_result.stdout = "Брифінг готовий"

    with patch("briefing.subprocess.run", return_value=mock_result) as mock_run:
        result = generate_briefing("test prompt")

    assert result == "Брифінг готовий"
    expected = f"{SYSTEM_PROMPT}\n\ntest prompt"
    mock_run.assert_called_once_with(
        ["/Users/artem/.local/bin/claude", "--print", expected],
        capture_output=True,
        text=True,
        timeout=60,
    )


def test_generate_briefing_raises_with_details_on_nonzero_exit():
    mock_result = MagicMock()
    mock_result.returncode = 1
    mock_result.stderr = "auth error"
    mock_result.stdout = ""

    with patch("briefing.subprocess.run", return_value=mock_result):
        try:
            generate_briefing("test prompt")
            assert False, "Should have raised"
        except RuntimeError as e:
            assert "rc=1" in str(e)
            assert "auth error" in str(e)
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
python -m pytest tests/test_briefing.py -v
```

Expected: fail (briefing.py still has old `build_prompt`, missing `SYSTEM_PROMPT` prepend)

- [ ] **Step 3: Replace `briefing.py` entirely**

```python
# tool-morning-briefing/briefing.py
import argparse
import os
import subprocess
from datetime import date, timedelta

from dotenv import load_dotenv

from clickup_client import (
    get_tasks_closed_today,
    get_tasks_closed_this_week,
    get_tasks_created_this_week,
    get_tasks_created_today,
    get_tasks_due_today,
)
from formatter import format_evening, format_morning, format_weekly
from prompts import (
    SYSTEM_PROMPT,
    build_evening_prompt,
    build_morning_prompt,
    build_weekly_prompt,
)
from reader import extract_current_focus, read_context
from sender import send_error_alert, send_telegram
from state import (
    extract_commitment,
    load_state,
    load_weekly_rate,
    save_state,
    save_weekly_rate,
)

CLAUDE_PATH = "/Users/artem/.local/bin/claude"


def generate_briefing(prompt: str) -> str:
    full_prompt = f"{SYSTEM_PROMPT}\n\n{prompt}"
    result = subprocess.run(
        [CLAUDE_PATH, "--print", full_prompt],
        capture_output=True,
        text=True,
        timeout=60,
    )
    if result.returncode != 0:
        raise RuntimeError(
            f"Claude CLI error (rc={result.returncode}):\n"
            f"stderr: {result.stderr.strip()}\n"
            f"stdout: {result.stdout.strip()}"
        )
    return result.stdout.strip()


def _clickup_env() -> tuple[str, str]:
    return os.environ.get("CLICKUP_TOKEN", ""), os.environ.get("CLICKUP_TEAM_ID", "")


def run_morning(today: date, token: str, chat_id: str, dry_run: bool) -> None:
    cu_token, cu_team = _clickup_env()
    yesterday = today - timedelta(days=1)

    evening_state = load_state("evening", yesterday)
    yesterday_commitment = (
        extract_commitment(evening_state) if evening_state else "Немає (перший день)"
    )

    hot_md_text = read_context(
        hot_md_path=os.environ["HOT_MD_PATH"],
        project_current_path=os.environ["PROJECT_CURRENT_PATH"],
        user_profile_path=os.environ["USER_PROFILE_PATH"],
    )["hot_md"]
    hot_focus = extract_current_focus(hot_md_text)

    due_today = get_tasks_due_today(cu_token, cu_team) if cu_token else []
    prompt = build_morning_prompt(today, yesterday_commitment, due_today, hot_focus)
    text = generate_briefing(prompt)
    save_state("morning", today, text)

    message = format_morning(text, today, due_today)
    if dry_run:
        print(message)
    else:
        send_telegram(token, chat_id, message)


def run_evening(today: date, token: str, chat_id: str, dry_run: bool) -> None:
    cu_token, cu_team = _clickup_env()
    morning_state = load_state("morning", today) or "Ранковий бріф не знайдено"

    closed_today = get_tasks_closed_today(cu_token, cu_team) if cu_token else []
    created_today = get_tasks_created_today(cu_token, cu_team) if cu_token else []

    prompt = build_evening_prompt(today, morning_state, closed_today)
    text = generate_briefing(prompt)
    save_state("evening", today, text)

    message = format_evening(text, today, closed_today, len(created_today))
    if dry_run:
        print(message)
    else:
        send_telegram(token, chat_id, message)


def run_weekly(today: date, token: str, chat_id: str, dry_run: bool) -> None:
    cu_token, cu_team = _clickup_env()
    closed = get_tasks_closed_this_week(cu_token, cu_team) if cu_token else []
    created = get_tasks_created_this_week(cu_token, cu_team) if cu_token else []
    closed_count, created_count = len(closed), len(created)
    total = closed_count + created_count
    rate = round(closed_count / total * 100) if total else 0

    iso = today.isocalendar()
    year, week = iso[0], iso[1]
    prev_week = week - 1 if week > 1 else 52
    prev_year = year if week > 1 else year - 1
    prev_rate = load_weekly_rate(prev_year, prev_week)

    prompt = build_weekly_prompt(today, closed_count, created_count, rate, prev_rate)
    text = generate_briefing(prompt)
    save_weekly_rate(year, week, float(rate))

    message = format_weekly(text, today, closed_count, created_count, rate)
    if dry_run:
        print(message)
    else:
        send_telegram(token, chat_id, message)


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
        send_error_alert(token, chat_id, f"{briefing_type.capitalize()} briefing failed: {e}")
        raise


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run all tests — verify full suite passes**

```bash
python -m pytest tests/ -v
```

Expected: all 24 tests pass (2 briefing + 5 reader + 3 sender + 7 state + 7 prompts + 4 clickup + 5 formatter — minus the deleted test_build_prompt = 23 tests)

Exact count: 2 briefing + 5 reader + 3 sender + 7 state + 7 prompts + 4 clickup + 5 formatter = **33 tests**

- [ ] **Step 5: Smoke test dry-run for all three types**

```bash
cd "/Users/artem/Claude v 1.0/tool-morning-briefing" && source .venv/bin/activate
python briefing.py --type morning --dry-run
python briefing.py --type evening --dry-run
python briefing.py --type weekly --dry-run
```

Expected: each prints a formatted HTML Telegram message to stdout with emoji header and ClickUp footer. Evening shows "Ранковий бріф не знайдено" if morning hasn't run yet today.

- [ ] **Step 6: Commit**

```bash
git add tool-morning-briefing/briefing.py tool-morning-briefing/tests/test_briefing.py
git commit -m "feat: briefing.py v2 — --type dispatch, closed loop, HTML output"
```

---

### Task 8: LaunchAgents — deploy evening and weekly

**Files:**
- Create: `~/Library/LaunchAgents/com.artem.evening-briefing.plist`
- Create: `~/Library/LaunchAgents/com.artem.weekly-briefing.plist`

**Interfaces:**
- Consumes: `run.sh --type evening` and `run.sh --type weekly`

- [ ] **Step 1: Create evening LaunchAgent plist**

```bash
cat > ~/Library/LaunchAgents/com.artem.evening-briefing.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.artem.evening-briefing</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/artem/Claude v 1.0/tool-morning-briefing/run.sh</string>
        <string>--type</string>
        <string>evening</string>
    </array>
    <key>StartCalendarInterval</key>
    <array>
        <dict><key>Weekday</key><integer>1</integer><key>Hour</key><integer>20</integer><key>Minute</key><integer>45</integer></dict>
        <dict><key>Weekday</key><integer>2</integer><key>Hour</key><integer>20</integer><key>Minute</key><integer>45</integer></dict>
        <dict><key>Weekday</key><integer>3</integer><key>Hour</key><integer>20</integer><key>Minute</key><integer>45</integer></dict>
        <dict><key>Weekday</key><integer>4</integer><key>Hour</key><integer>20</integer><key>Minute</key><integer>45</integer></dict>
        <dict><key>Weekday</key><integer>5</integer><key>Hour</key><integer>20</integer><key>Minute</key><integer>0</integer></dict>
    </array>
    <key>WorkingDirectory</key>
    <string>/Users/artem/Claude v 1.0/tool-morning-briefing</string>
    <key>StandardOutPath</key>
    <string>/tmp/morning-briefing.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/morning-briefing.log</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>HOME</key><string>/Users/artem</string>
        <key>PATH</key><string>/Users/artem/.local/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
    </dict>
</dict>
</plist>
EOF
```

- [ ] **Step 2: Create weekly LaunchAgent plist**

```bash
cat > ~/Library/LaunchAgents/com.artem.weekly-briefing.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.artem.weekly-briefing</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/artem/Claude v 1.0/tool-morning-briefing/run.sh</string>
        <string>--type</string>
        <string>weekly</string>
    </array>
    <key>StartCalendarInterval</key>
    <array>
        <dict><key>Weekday</key><integer>5</integer><key>Hour</key><integer>20</integer><key>Minute</key><integer>5</integer></dict>
    </array>
    <key>WorkingDirectory</key>
    <string>/Users/artem/Claude v 1.0/tool-morning-briefing</string>
    <key>StandardOutPath</key>
    <string>/tmp/morning-briefing.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/morning-briefing.log</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>HOME</key><string>/Users/artem</string>
        <key>PATH</key><string>/Users/artem/.local/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
    </dict>
</dict>
</plist>
EOF
```

- [ ] **Step 3: Load both agents**

```bash
launchctl load ~/Library/LaunchAgents/com.artem.evening-briefing.plist
launchctl load ~/Library/LaunchAgents/com.artem.weekly-briefing.plist
```

- [ ] **Step 4: Verify both agents registered**

```bash
launchctl list | grep artem
```

Expected output includes:
```
-    0    com.artem.morning-briefing
-    0    com.artem.evening-briefing
-    0    com.artem.weekly-briefing
```

- [ ] **Step 5: Manual trigger test for evening**

```bash
launchctl start com.artem.evening-briefing
sleep 90
launchctl list | grep evening
```

Expected: exit code 0 in second column

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/plans/2026-06-19-briefing-system-v2.md
git commit -m "feat: deploy evening and weekly LaunchAgents"
```
