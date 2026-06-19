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
