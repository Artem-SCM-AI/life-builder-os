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
    if not credentials_path or not spreadsheet_id:
        return "", False
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
