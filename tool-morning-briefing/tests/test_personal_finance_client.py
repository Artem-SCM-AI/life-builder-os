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
