# Briefing System v2 Design

**Date:** 2026-06-19
**Tool:** `tool-morning-briefing/`
**Scope:** Extend morning briefing into a 3-type closed-loop briefing system

---

## Overview

The existing morning briefing tool (`tool-morning-briefing/`) becomes a unified briefing runner supporting three types: morning, evening, weekly. The core insight driving the design: briefings must form a closed loop — morning reads yesterday's evening commitment, evening evaluates morning's plan, weekly tracks velocity over time.

---

## Schedule

| Type | Days | Time (Kyiv) | LaunchAgent |
|------|------|-------------|-------------|
| morning | Mon–Fri | 08:45 | `com.artem.morning-briefing` (existing) |
| evening | Mon–Thu | 20:45 | `com.artem.evening-briefing` (new) |
| evening | Fri | 20:00 | same agent, different interval |
| weekly | Fri | 20:05 | `com.artem.weekly-briefing` (new) |

Mac timezone: `Europe/Kiev` — no offset conversion needed.

---

## File Structure Changes

```
tool-morning-briefing/
├── briefing.py          # MODIFY: add --type flag, shared system prompt
├── prompts.py           # NEW: MORNING_PROMPT, EVENING_PROMPT, WEEKLY_PROMPT
├── formatter.py         # NEW: format_morning(), format_evening(), format_weekly()
├── state.py             # NEW: save_state(), load_state(), extract_commitment(), save_weekly_rate()
├── reader.py            # MODIFY: add extract_current_focus(hot_md_text) → str
├── clickup_client.py    # MODIFY: add closed_today(), closed_this_week(), get_prev_weekly_rate()
├── sender.py            # MODIFY: add parse_mode="HTML" to sendMessage
├── run.sh               # MODIFY: pass $@ through to briefing.py
└── state/               # NEW directory
    ├── morning-YYYY-MM-DD.txt
    ├── evening-YYYY-MM-DD.txt
    └── weekly-YYYY-Wnn.json
```

---

## Prompt Templates

### Shared system prompt (hardcoded in `generate_briefing()`)

```
Відповідай українською. Без markdown.
Тільки пронумеровані відповіді — без вступу і підсумків.
```

### Morning

```
{weekday}, {date}

ВХІД:
Commitment вчора: {yesterday_commitment}
ClickUp сьогодні: {due_today}
Поточний фокус: {hot_md_current_focus}

ПИТАННЯ:
1. COMMITMENT — виконано? Якщо ні — одна системна причина.
2. ЦІЛЬ — одна задача + метрика що доведе виконання.
3. СТОП — одне що свідомо не робиш сьогодні і чому.

[120 слів]
```

`{yesterday_commitment}` — рядок `COMMITMENT:` з `state/evening-YYYY-MM-DD.txt` вчорашньої дати. Якщо файл відсутній → `"Немає (перший день)"`.

`{hot_md_current_focus}` — тільки секція `## Current Focus` з hot.md, не весь файл.

### Evening

```
{weekday}, {date}

ВХІД:
Ранковий план: {morning_state}
Закрито сьогодні: {closed_today}

ПИТАННЯ:
1. ФАКТ — план vs реальність по пунктах.
2. ПРИЧИНА — по кожному незакритому: системна причина, не "не встиг".
3. COMMITMENT — "Завтра о __:__ я зроблю ___"

Останній рядок завжди: COMMITMENT: [завтра о X:00 я зроблю Y]
[150 слів]
```

`{morning_state}` — повний текст з `state/morning-YYYY-MM-DD.txt`. Якщо відсутній → `"Ранковий бріф не знайдено"`.

### Weekly

```
Тиждень {week_num} · {date_range}

ВХІД:
Закрито: {closed_count} задач
Нових відкрито: {created_count} задач
Completion rate: {rate}% (минулий: {prev_rate}%, Δ{delta:+}%)

ПИТАННЯ:
1. ПЕРЕМОГИ — 2–3 результати з числами.
2. ПРОПУЩЕНО — що не зроблено + одна системна причина.
3. ТРЕНД — що означає Δ{delta}% і одна дія на наступний тиждень.

[200 слів]
```

`{rate}` = `closed_count / (closed_count + created_count) * 100`, округлено до цілого. Зберігається у `state/weekly-YYYY-Wnn.json` для наступного тижня.

---

## Telegram Output Format

`sender.py` додає `parse_mode="HTML"` до всіх запитів.

### Morning

```
🌅 <b>Пн, 19 чер</b>

{claude_text}

───────────
📋 <b>ClickUp · сьогодні</b>
• [high] Task name (дедлайн)
• [normal] Task name
```

### Evening

```
🌙 <b>Пн, 19 чер</b>

{claude_text}

───────────
📊 <b>ClickUp · сьогодні</b>
✅ Закрито: 3   🆕 Відкрито: 2
```

### Weekly

```
📅 <b>Тиждень 25 · 16–20 чер</b>

{claude_text}

───────────
📊 <b>Тиждень 25</b>
✅ Закрито: 23   🆕 Відкрито: 18   📈 Rate: 71%
```

---

## State Management (`state.py`)

```python
save_state(type: str, date: date, text: str) → None
# Writes to state/{type}-YYYY-MM-DD.txt

load_state(type: str, date: date) → str | None
# Returns text or None if file missing

extract_commitment(evening_text: str) → str
# Finds line starting with "COMMITMENT:" and returns the rest
# Returns "Немає" if not found

save_weekly_rate(week: int, year: int, rate: float) → None
# Writes {"rate": 71.4} to state/weekly-YYYY-Wnn.json

load_weekly_rate(week: int, year: int) → float | None
```

---

## ClickUp Client Extensions

```python
get_tasks_closed_today(token, team_id) → list[Task]        # existing
get_tasks_due_today(token, team_id) → list[Task]           # existing
get_tasks_created_yesterday(token, team_id) → list[Task]   # existing
get_tasks_closed_this_week(token, team_id) → list[Task]    # NEW
get_tasks_created_this_week(token, team_id) → list[Task]   # NEW
```

"This week" = Monday 00:00 → Friday 23:59 Kyiv time.

---

## briefing.py Changes

```python
parser.add_argument("--type", choices=["morning", "evening", "weekly"], default="morning")
```

Dispatch:
- `morning` → reads yesterday's evening state → builds prompt → generates → saves morning state → formats → sends
- `evening` → reads today's morning state → builds prompt → generates → saves evening state → formats → sends
- `weekly` → pulls week ClickUp data → builds prompt → generates → saves weekly rate → formats → sends

Shared `SYSTEM_PROMPT` prepended to all Claude calls.

---

## LaunchAgents (new)

### `com.artem.evening-briefing`

StartCalendarInterval array:
- Mon–Thu (weekday 1–4): hour 20, minute 45
- Fri (weekday 5): hour 20, minute 0

ProgramArguments: `run.sh --type evening`

### `com.artem.weekly-briefing`

StartCalendarInterval: weekday 5, hour 20, minute 5

ProgramArguments: `run.sh --type weekly`

Both inherit same env vars as morning agent (HOME, PATH).

---

## Error Handling

All three types use existing `send_error_alert()`. Error messages prefixed with type:
- `"Morning briefing failed: ..."`
- `"Evening briefing failed: ..."`
- `"Weekly briefing failed: ..."`

State files are written only after successful Claude generation — no partial state on failure.

---

## Tests

- `test_state.py` — save/load/extract_commitment, missing file edge cases
- `test_formatter.py` — all three format functions, HTML escaping
- `test_prompts.py` — template rendering with missing yesterday_commitment
- `test_clickup.py` — extend with this_week methods (mock API)
