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
