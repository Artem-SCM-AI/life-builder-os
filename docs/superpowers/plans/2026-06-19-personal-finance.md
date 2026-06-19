# Personal Finance System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a personal finance section to the morning Telegram briefing (bills/budget/taxes) and create a `personal-finance` Claude skill for on-demand income allocation.

**Architecture:** New `personal_finance_client.py` module in the existing `tool-morning-briefing/` tool reads a Google Sheets "Personal Finance" workbook (Bills, Budget, Taxes tabs) and returns a formatted block. `briefing.py` injects it into the daily message — above ClickUp if anything is urgent. A separate Claude skill file handles the income allocation calculator.

**Tech Stack:** Python 3.11, gspread, pytest, Google Sheets service account (same credentials.json as `tool-threads-poster/`)

## Global Constraints

- All user-facing text in Ukrainian
- No secrets in code — all credentials via env vars
- `gspread.service_account` for Sheets access (same pattern as `tool-threads-poster/sheets_client.py`)
- Existing tests must continue to pass after every task
- TDD: write failing test → verify fail → implement → verify pass → commit

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `tool-morning-briefing/personal_finance_client.py` | Create | Bills/Budget/Taxes reader + section formatter |
| `tool-morning-briefing/tests/test_personal_finance_client.py` | Create | Tests for client module |
| `tool-morning-briefing/briefing.py` | Modify | Import client, inject section into message |
| `tool-morning-briefing/tests/test_briefing.py` | Modify | Test new message assembly helper |
| `tool-morning-briefing/requirements.txt` | Modify | Add `gspread>=5.12.0` |
| `tool-morning-briefing/config.env` | Modify | Add `GOOGLE_CREDENTIALS_PATH`, `PERSONAL_FINANCE_SHEET_ID` |
| `tool-morning-briefing/config.env.template` | Modify | Same keys with empty values |
| `~/.claude/skills/personal-finance.md` | Create | Income allocation skill |

---

## Task 1: Google Sheets Setup + Config

**Manual steps — no code.**

- [ ] **Step 1: Create the Sheets workbook**

Open [sheets.google.com](https://sheets.google.com), create a new workbook called "Personal Finance".

- [ ] **Step 2: Create Bills tab**

Rename Sheet1 → "Bills". Add these exact column headers in row 1:
`Name | Amount (UAH) | Due day | Season | Notes`

Pre-populate with known bills:

| Name | Amount (UAH) | Due day | Season | Notes |
|---|---|---|---|---|
| Оренда | 28000 | 1 | all | |
| Комунальні + інтернет + мобільний + YouTube | 5000 | 10 | summer | квітень–жовтень |
| Комунальні + інтернет + мобільний + YouTube | 6500 | 10 | winter | листопад–березень |
| Психолог | 7750 | 1 | all | 150 EUR / міс, оновлювати за курсом |

Note: "Season" for seasonal rows must be exactly `summer` or `winter` (lowercase). Bills with `all` always appear.

- [ ] **Step 3: Create Budget tab**

Add new sheet → rename to "Budget". Headers in row 1:
`Date | Category | Amount (UAH) | Notes`

Leave empty — Artem fills manually throughout the month.

- [ ] **Step 4: Create Taxes tab**

Add new sheet → rename to "Taxes". Pre-fill (for reference only — not read by code):

| Tax | Q1 | Q2 | Q3 | Q4 |
|---|---|---|---|---|
| ЄСВ | Jan 20 | Apr 20 | Jul 20 | Oct 20 |
| Єдиний податок (3 група) | Jan 20 | Apr 20 | Jul 20 | Oct 20 |

(Tax deadlines are hardcoded in Python, not read from this tab.)

- [ ] **Step 5: Share with service account**

Copy the Spreadsheet ID from the URL (the long string between `/d/` and `/edit`).

Open the Sheets workbook → Share → add the service account email from `tool-threads-poster/credentials.json` (open the file, find `"client_email"`) with Editor access.

- [ ] **Step 6: Update config files**

In `tool-morning-briefing/config.env`, add:
```
GOOGLE_CREDENTIALS_PATH=/Users/artem/Claude v 1.0/tool-threads-poster/credentials.json
PERSONAL_FINANCE_SHEET_ID=<paste-spreadsheet-id-here>
```

In `tool-morning-briefing/config.env.template`, add:
```
GOOGLE_CREDENTIALS_PATH=
PERSONAL_FINANCE_SHEET_ID=
```

- [ ] **Step 7: Add gspread to requirements**

In `tool-morning-briefing/requirements.txt`, add:
```
gspread>=5.12.0
```

Run: `pip install gspread`

---

## Task 2: `personal_finance_client.py` — Bills, Budget, Taxes + Tests

**Files:**
- Create: `tool-morning-briefing/personal_finance_client.py`
- Create: `tool-morning-briefing/tests/test_personal_finance_client.py`

**Interfaces:**
- Produces: `format_personal_finance_section(credentials_path: str, spreadsheet_id: str, today: date | None = None) -> tuple[str, bool]`
  - Returns `(section_text, has_urgent)` where `has_urgent` is True if any bill is due today

- [ ] **Step 1: Write all tests (they will all fail)**

Create `tool-morning-briefing/tests/test_personal_finance_client.py`:

```python
from datetime import date
from unittest.mock import MagicMock, patch

import pytest

from personal_finance_client import (
    _next_due_date,
    _season,
    format_personal_finance_section,
    get_bills_lines,
    get_budget_line,
    get_tax_line,
)


# ── _season ──────────────────────────────────────────────────────────────────

def test_season_april_is_summer():
    assert _season(4) == "summer"

def test_season_october_is_summer():
    assert _season(10) == "summer"

def test_season_november_is_winter():
    assert _season(11) == "winter"

def test_season_march_is_winter():
    assert _season(3) == "winter"


# ── _next_due_date ────────────────────────────────────────────────────────────

def test_due_date_future_this_month():
    assert _next_due_date(25, date(2026, 6, 19)) == date(2026, 6, 25)

def test_due_date_today():
    assert _next_due_date(19, date(2026, 6, 19)) == date(2026, 6, 19)

def test_due_date_past_rolls_to_next_month():
    assert _next_due_date(10, date(2026, 6, 19)) == date(2026, 7, 10)

def test_due_date_december_rolls_to_january():
    assert _next_due_date(20, date(2026, 12, 25)) == date(2027, 1, 20)

def test_due_date_invalid_day_returns_none():
    assert _next_due_date(31, date(2026, 4, 1)) is None  # April has 30 days


# ── get_bills_lines ───────────────────────────────────────────────────────────

def test_bills_urgent_today():
    today = date(2026, 6, 19)
    records = [{"Name": "Інтернет", "Amount (UAH)": 200, "Due day": 19, "Season": "all"}]
    lines, has_urgent = get_bills_lines(records, today)
    assert has_urgent is True
    assert lines[0] == "🔴 СЬОГОДНІ: Інтернет — 200 грн"

def test_bills_soon_within_7_days():
    today = date(2026, 6, 19)
    records = [{"Name": "Оренда", "Amount (UAH)": 28000, "Due day": 24, "Season": "all"}]
    lines, has_urgent = get_bills_lines(records, today)
    assert has_urgent is False
    assert "🟡 ЦЕЙ ТИЖДЕНЬ" in lines[0]
    assert "Оренда" in lines[0]
    assert "28000 грн" in lines[0]

def test_bills_skips_wrong_season_winter_in_summer():
    today = date(2026, 6, 19)
    records = [{"Name": "Опалення", "Amount (UAH)": 1500, "Due day": 10, "Season": "winter"}]
    lines, _ = get_bills_lines(records, today)
    assert lines == []

def test_bills_skips_wrong_season_summer_in_winter():
    today = date(2026, 1, 5)
    records = [{"Name": "Кондиціонер", "Amount (UAH)": 500, "Due day": 10, "Season": "summer"}]
    lines, _ = get_bills_lines(records, today)
    assert lines == []

def test_bills_nothing_due_this_week():
    today = date(2026, 6, 19)
    records = [{"Name": "Оренда", "Amount (UAH)": 28000, "Due day": 1, "Season": "all"}]
    # Due day 1 → next due July 1 = 12 days away → not shown
    lines, _ = get_bills_lines(records, today)
    assert lines == []

def test_bills_urgent_shows_before_soon():
    today = date(2026, 6, 19)
    records = [
        {"Name": "Оренда", "Amount (UAH)": 28000, "Due day": 24, "Season": "all"},
        {"Name": "Інтернет", "Amount (UAH)": 200, "Due day": 19, "Season": "all"},
    ]
    lines, has_urgent = get_bills_lines(records, today)
    assert has_urgent is True
    assert lines[0].startswith("🔴")
    assert lines[1].startswith("🟡")


# ── get_budget_line ───────────────────────────────────────────────────────────

def test_budget_partial_spend():
    today = date(2026, 6, 19)
    records = [
        {"Date": "2026-06-15", "Category": "їжа", "Amount (UAH)": 5000},
        {"Date": "2026-06-18", "Category": "дім", "Amount (UAH)": 1200},
        {"Date": "2026-05-30", "Category": "їжа", "Amount (UAH)": 9000},  # prev month, excluded
    ]
    line = get_budget_line(records, today)
    assert "6,200" in line
    assert "26,000" in line
    assert "23%" in line

def test_budget_zero_spend():
    today = date(2026, 6, 1)
    line = get_budget_line([], today)
    assert "0" in line
    assert "0%" in line

def test_budget_month_name_in_line():
    today = date(2026, 6, 19)
    line = get_budget_line([], today)
    assert "ЧЕРВНЯ" in line


# ── get_tax_line ──────────────────────────────────────────────────────────────

def test_tax_upcoming_q3():
    today = date(2026, 6, 19)  # next deadline Jul 20 = 31 days
    line = get_tax_line(today)
    assert "ЄСВ" in line
    assert "31" in line
    assert "20.07" in line

def test_tax_due_today():
    today = date(2026, 7, 20)
    line = get_tax_line(today)
    assert "0 днів" in line

def test_tax_last_deadline_passed_wraps_to_next_year():
    today = date(2026, 10, 21)  # Oct 20 just passed
    line = get_tax_line(today)
    assert "20.01" in line


# ── format_personal_finance_section ──────────────────────────────────────────

def _make_mock_wb(bills_records, budget_records):
    mock_bills_ws = MagicMock()
    mock_bills_ws.get_all_records.return_value = bills_records
    mock_budget_ws = MagicMock()
    mock_budget_ws.get_all_records.return_value = budget_records

    mock_wb = MagicMock()
    def _ws(name):
        return mock_bills_ws if name == "Bills" else mock_budget_ws
    mock_wb.worksheet.side_effect = _ws
    return mock_wb


def test_format_section_structure():
    today = date(2026, 6, 19)
    mock_wb = _make_mock_wb(bills_records=[], budget_records=[])
    with patch("personal_finance_client.gspread.service_account") as mock_sa:
        mock_sa.return_value.open_by_key.return_value = mock_wb
        section, _ = format_personal_finance_section("creds.json", "sheet-id", today)
    assert "🏠 ДОМАШНІ СПРАВИ" in section
    assert "📊 БЮДЖЕТ" in section
    assert "🧾 ПОДАТКИ" in section


def test_format_section_urgent_flag():
    today = date(2026, 6, 19)
    bills = [{"Name": "Інтернет", "Amount (UAH)": 200, "Due day": 19, "Season": "all"}]
    mock_wb = _make_mock_wb(bills_records=bills, budget_records=[])
    with patch("personal_finance_client.gspread.service_account") as mock_sa:
        mock_sa.return_value.open_by_key.return_value = mock_wb
        _, has_urgent = format_personal_finance_section("creds.json", "sheet-id", today)
    assert has_urgent is True


def test_format_section_not_urgent_when_no_bills_due():
    today = date(2026, 6, 19)
    bills = [{"Name": "Оренда", "Amount (UAH)": 28000, "Due day": 1, "Season": "all"}]
    mock_wb = _make_mock_wb(bills_records=bills, budget_records=[])
    with patch("personal_finance_client.gspread.service_account") as mock_sa:
        mock_sa.return_value.open_by_key.return_value = mock_wb
        _, has_urgent = format_personal_finance_section("creds.json", "sheet-id", today)
    assert has_urgent is False
```

- [ ] **Step 2: Run tests to verify they all fail**

```bash
cd "/Users/artem/Claude v 1.0/tool-morning-briefing"
python -m pytest tests/test_personal_finance_client.py -v 2>&1 | head -30
```

Expected: `ImportError: cannot import name '_next_due_date' from 'personal_finance_client'` (file doesn't exist yet)

- [ ] **Step 3: Create `personal_finance_client.py`**

```python
import calendar
from datetime import date

import gspread

BUDGET_CEILING = 26_000

_TAX_SCHEDULE = [(1, 20), (4, 20), (7, 20), (10, 20)]  # (month, day) Q1–Q4

_MONTH_UA = [
    "", "СІЧНЯ", "ЛЮТОГО", "БЕРЕЗНЯ", "КВІТНЯ", "ТРАВНЯ", "ЧЕРВНЯ",
    "ЛИПНЯ", "СЕРПНЯ", "ВЕРЕСНЯ", "ЖОВТНЯ", "ЛИСТОПАДА", "ГРУДНЯ",
]


def _season(month: int) -> str:
    return "summer" if 4 <= month <= 10 else "winter"


def _next_due_date(due_day: int, today: date) -> date | None:
    try:
        candidate = date(today.year, today.month, due_day)
    except ValueError:
        return None
    if candidate < today:
        next_month = today.month % 12 + 1
        next_year = today.year + (1 if today.month == 12 else 0)
        last_day = calendar.monthrange(next_year, next_month)[1]
        candidate = date(next_year, next_month, min(due_day, last_day))
    return candidate


def get_bills_lines(records: list, today: date) -> tuple[list, bool]:
    season = _season(today.month)
    urgent, soon = [], []

    for row in records:
        bill_season = str(row.get("Season", "all")).strip().lower()
        if bill_season not in ("all", season):
            continue
        try:
            due_day = int(row["Due day"])
        except (KeyError, ValueError, TypeError):
            continue
        due_date = _next_due_date(due_day, today)
        if due_date is None:
            continue
        days = (due_date - today).days
        name = row.get("Name", "?")
        amount = row.get("Amount (UAH)", "?")
        label = f"{name} — {amount} грн"
        if days == 0:
            urgent.append(f"🔴 СЬОГОДНІ: {label}")
        elif days <= 7:
            soon.append(f"🟡 ЦЕЙ ТИЖДЕНЬ: {label} ({due_date.strftime('%d.%m')})")

    return urgent + soon, bool(urgent)


def get_budget_line(records: list, today: date) -> str:
    prefix = today.strftime("%Y-%m")
    total = sum(
        float(row.get("Amount (UAH)") or 0)
        for row in records
        if str(row.get("Date", "")).startswith(prefix)
    )
    pct = int(total / BUDGET_CEILING * 100)
    month = _MONTH_UA[today.month]
    return f"📊 БЮДЖЕТ {month}: {int(total):,} / {BUDGET_CEILING:,} грн ({pct}%)"


def get_tax_line(today: date) -> str:
    for month, day in _TAX_SCHEDULE:
        try:
            deadline = date(today.year, month, day)
        except ValueError:
            continue
        if deadline >= today:
            days = (deadline - today).days
            return f"🧾 ПОДАТКИ: ЄСВ — через {days} днів ({day:02d}.{month:02d})"
    deadline = date(today.year + 1, 1, 20)
    days = (deadline - today).days
    return f"🧾 ПОДАТКИ: ЄСВ — через {days} днів (20.01)"


def format_personal_finance_section(
    credentials_path: str,
    spreadsheet_id: str,
    today: date | None = None,
) -> tuple[str, bool]:
    if today is None:
        today = date.today()
    gc = gspread.service_account(filename=credentials_path)
    wb = gc.open_by_key(spreadsheet_id)
    bills_records = wb.worksheet("Bills").get_all_records()
    budget_records = wb.worksheet("Budget").get_all_records()

    bills_lines, has_urgent = get_bills_lines(bills_records, today)
    budget_line = get_budget_line(budget_records, today)
    tax_line = get_tax_line(today)

    parts = ["🏠 ДОМАШНІ СПРАВИ"]
    if bills_lines:
        parts.extend(bills_lines)
    parts.append("")
    parts.append(budget_line)
    parts.append(tax_line)

    return "\n".join(parts), has_urgent
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd "/Users/artem/Claude v 1.0/tool-morning-briefing"
python -m pytest tests/test_personal_finance_client.py -v
```

Expected: all 22 tests PASS

- [ ] **Step 5: Run full test suite to check no regressions**

```bash
python -m pytest tests/ -v
```

Expected: all tests PASS

- [ ] **Step 6: Commit**

```bash
cd "/Users/artem/Claude v 1.0"
git add tool-morning-briefing/personal_finance_client.py tool-morning-briefing/tests/test_personal_finance_client.py tool-morning-briefing/requirements.txt
git commit -m "feat: personal finance client — bills, budget, taxes reader"
```

---

## Task 3: Wire into `briefing.py`

**Files:**
- Modify: `tool-morning-briefing/briefing.py`
- Modify: `tool-morning-briefing/tests/test_briefing.py`

**Interfaces:**
- Consumes: `format_personal_finance_section(credentials_path, spreadsheet_id) -> tuple[str, bool]`
- Produces: updated `main()` that injects 🏠 section; `assemble_message(briefing, clickup_section, pf_section, pf_urgent) -> str` (new helper, testable)

- [ ] **Step 1: Write failing tests for message assembly**

Add to `tool-morning-briefing/tests/test_briefing.py`:

```python
from briefing import assemble_message


def test_assemble_message_no_pf():
    result = assemble_message("briefing text", "clickup text", "", False)
    assert result == "briefing text\n\n---\n\nclickup text"

def test_assemble_message_pf_not_urgent():
    result = assemble_message("briefing text", "clickup text", "🏠 section", False)
    assert result == "briefing text\n\n---\n\nclickup text\n\n---\n\n🏠 section"

def test_assemble_message_pf_urgent_goes_first():
    result = assemble_message("briefing text", "clickup text", "🏠 section", True)
    assert result == "🏠 section\n\n---\n\nbriefing text\n\n---\n\nclickup text"

def test_assemble_message_no_clickup_no_pf():
    result = assemble_message("briefing text", "", "", False)
    assert result == "briefing text"

def test_assemble_message_no_clickup_pf_not_urgent():
    result = assemble_message("briefing text", "", "🏠 section", False)
    assert result == "briefing text\n\n---\n\n🏠 section"
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd "/Users/artem/Claude v 1.0/tool-morning-briefing"
python -m pytest tests/test_briefing.py::test_assemble_message_no_pf -v
```

Expected: `ImportError: cannot import name 'assemble_message'`

- [ ] **Step 3: Update `briefing.py`**

Replace the existing `briefing.py` with:

```python
import argparse
import os
import subprocess

from dotenv import load_dotenv

from clickup_client import (
    format_clickup_section,
    get_tasks_closed_yesterday,
    get_tasks_created_yesterday,
    get_tasks_due_today,
)
from personal_finance_client import format_personal_finance_section
from reader import read_context
from sender import send_error_alert, send_telegram

CLAUDE_PATH = "/Users/artem/.local/bin/claude"

PROMPT_TEMPLATE = """You are Artem's morning assistant. Generate his daily briefing in Ukrainian.

[USER PROFILE]
{user_profile}

[CURRENT PROJECTS & STATE — hot.md]
{hot_md}

[ACTIVE PROJECTS DETAIL]
{project_current}

Answer these 4 questions:
1. The ONE most important thing to do today
2. What needs action before noon and why
3. What is at risk if ignored today
4. One open decision to make before starting work

Rules:
- Max 200 words
- Ukrainian language
- Start with most urgent item
- Plain text only — no markdown, no headers
- Do not repeat project names more than once each"""


def build_prompt(context: dict) -> str:
    return PROMPT_TEMPLATE.format(**context)


def generate_briefing(prompt: str) -> str:
    result = subprocess.run(
        [CLAUDE_PATH, "--print", prompt],
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


def assemble_message(briefing: str, clickup_section: str, pf_section: str, pf_urgent: bool) -> str:
    parts = []
    if pf_urgent and pf_section:
        parts.append(pf_section)
    parts.append(briefing)
    if clickup_section:
        parts.append(clickup_section)
    if not pf_urgent and pf_section:
        parts.append(pf_section)
    return "\n\n---\n\n".join(parts)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Print to stdout, skip Telegram")
    args = parser.parse_args()

    load_dotenv("config.env")

    token = os.environ["TELEGRAM_TOKEN"]
    chat_id = os.environ["TELEGRAM_CHAT_ID"]

    try:
        context = read_context(
            hot_md_path=os.environ["HOT_MD_PATH"],
            project_current_path=os.environ["PROJECT_CURRENT_PATH"],
            user_profile_path=os.environ["USER_PROFILE_PATH"],
        )
        prompt = build_prompt(context)
        briefing = generate_briefing(prompt)

        clickup_section = ""
        clickup_token = os.environ.get("CLICKUP_TOKEN", "")
        clickup_team_id = os.environ.get("CLICKUP_TEAM_ID", "")
        if clickup_token and clickup_team_id:
            due_today = get_tasks_due_today(clickup_token, clickup_team_id)
            closed_yesterday = get_tasks_closed_yesterday(clickup_token, clickup_team_id)
            created_yesterday = get_tasks_created_yesterday(clickup_token, clickup_team_id)
            clickup_section = format_clickup_section(due_today, closed_yesterday, created_yesterday)

        pf_section, pf_urgent = "", False
        pf_creds = os.environ.get("GOOGLE_CREDENTIALS_PATH", "")
        pf_sheet = os.environ.get("PERSONAL_FINANCE_SHEET_ID", "")
        if pf_creds and pf_sheet:
            pf_section, pf_urgent = format_personal_finance_section(pf_creds, pf_sheet)

        message = assemble_message(briefing, clickup_section, pf_section, pf_urgent)

        if args.dry_run:
            print(message)
        else:
            send_telegram(token, chat_id, message)

    except Exception as e:
        send_error_alert(token, chat_id, str(e))
        raise


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run all tests**

```bash
cd "/Users/artem/Claude v 1.0/tool-morning-briefing"
python -m pytest tests/ -v
```

Expected: all tests PASS (including the 3 original briefing tests + 5 new assembly tests)

- [ ] **Step 5: Dry-run smoke test**

```bash
cd "/Users/artem/Claude v 1.0/tool-morning-briefing"
python briefing.py --dry-run
```

Expected: briefing prints to stdout with 🏠 ДОМАШНІ СПРАВИ section at bottom (or top if a bill is due today).

- [ ] **Step 6: Commit**

```bash
cd "/Users/artem/Claude v 1.0"
git add tool-morning-briefing/briefing.py tool-morning-briefing/tests/test_briefing.py tool-morning-briefing/config.env tool-morning-briefing/config.env.template
git commit -m "feat: wire personal finance section into morning briefing"
```

---

## Task 4: `personal-finance` Claude Skill

**Files:**
- Create: `~/.claude/skills/personal-finance.md`

No tests — skill files are markdown read by Claude, not executed code.

- [ ] **Step 1: Create the skill file**

Create `~/.claude/skills/personal-finance.md`:

```markdown
---
name: personal-finance
description: Income allocation calculator for Artem. Activate when he says "прийшло X грн", "прийшло X EUR", "отримав X", or "дохід X". Splits income across debt / living / investments and shows exact UAH amounts for each bucket.
---

## Trigger

Activate on any message containing: income amount + currency (грн / EUR / USD / долар).

## Steps

1. Extract income amount and currency from the message.
2. Determine current season: April–October = summer, November–March = winter.
3. If income in EUR or USD: fetch live exchange rate via WebSearch ("EUR UAH курс сьогодні" or "USD UAH курс сьогодні").
4. Convert to UAH.
5. Run allocation calculation.
6. Output formatted result.

## Allocation Rules

### Step 1 — Debt: 20% of gross income

Outstanding debt: $100,000 USD.
Rule: always 20% off the top, every time, no exceptions.
Show: UAH amount + USD equivalent at current rate.

### Step 2 — Fixed monthly living expenses

Auto-select by season:

**Summer (April–October) total: ~76,158 UAH**

| Expense | Amount |
|---|---|
| Квартира | 28,000 UAH |
| Комунальні + інтернет + мобільний + YouTube | 5,000 UAH |
| Їжа + все для дому | 26,000 UAH |
| Психолог | 150 EUR → convert at live rate |
| Барбер | 1,600 UAH |
| Собачий корм та смаколики | 2,500 UAH |
| Дитина (кишенькові) | 1,733 UAH |
| Дружина | 1,600 UAH |
| Артем особисто | 2,000 UAH |

**Winter (November–March) total: ~77,658 UAH**

Same as summer but Комунальні = 6,500 UAH (з опаленням).

### Step 3 — Investable remainder

`remainder = gross_uah − debt_uah − living_uah`

| Bucket | Share | Instrument |
|---|---|---|
| 💵 Валюта готівка | 40% | Купити EUR або USD, тримати готівкою |
| 📦 Короткий термін (3–6 міс) | 30% | ОВДП 3–6 міс / Mono депозит |
| 🌱 Довгий термін (1–2 роки) | 30% | ОВДП 1–2 роки |

If remainder is negative: do NOT show investment buckets. Instead show:
`⚠️ Дефіцит: −X грн — витрати перевищують дохід після боргу`

## Output Template

```
💰 РОЗПОДІЛ ДОХОДУ

Прийшло: [amount] [currency] = [uah_total] грн (курс [currency]/UAH: [rate])

💸 Борг (20%):        −[debt_uah] грн (~$[debt_usd] USD) → переказати сьогодні

Витрати на життя:     −[living_total] грн
  Квартира 28,000 · Комунальні [5000/6500] · Їжа 26,000
  Психолог [X] · Барбер 1,600 · Собака 2,500
  Дитина 1,733 · Дружина 1,600 · Артем 2,000

💼 На інвестиції: [invest_total] грн

  💵 Валюта готівка (40%):  [X] грн → купити EUR або USD
  📦 Короткий термін (30%):  [X] грн → ОВДП 3-6 міс
  🌱 Довгий термін (30%):    [X] грн → ОВДП 1-2 роки
```

## Notes

- Always fetch live rate — never use a hardcoded rate
- Round all UAH amounts to nearest whole number
- Debt shown in both UAH paid and USD equivalent for tracking $100K total
- If income amount seems unusually low (< 30,000 UAH equivalent), confirm with user before calculating
```

- [ ] **Step 2: Verify skill is discoverable**

```bash
ls ~/.claude/skills/ | grep personal
```

Expected: `personal-finance.md`

- [ ] **Step 3: Test the skill manually**

In a new Claude session, type: `прийшло 2600 EUR`

Expected: Claude loads the skill and outputs the full allocation breakdown with live EUR/UAH rate.

- [ ] **Step 4: Commit**

```bash
cd "/Users/artem/Claude v 1.0"
git add docs/superpowers/plans/2026-06-19-personal-finance.md
git commit -m "feat: personal-finance skill — income allocation calculator"
```

Note: `~/.claude/skills/personal-finance.md` lives outside the repo — no need to commit it.
```
