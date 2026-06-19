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


_PF_SEP = "\n\n───────────\n\n"


def append_personal_finance(message: str, pf_section: str, pf_urgent: bool) -> str:
    if not pf_section:
        return message
    if pf_urgent:
        return pf_section + _PF_SEP + message
    return message + _PF_SEP + pf_section
