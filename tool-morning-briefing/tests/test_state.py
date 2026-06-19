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
