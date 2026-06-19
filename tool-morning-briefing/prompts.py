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
