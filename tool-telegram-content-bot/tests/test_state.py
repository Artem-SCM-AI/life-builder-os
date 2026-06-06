from pathlib import Path
import pytest
from state import ConversationState, load_state, save_state, clear_state

STATE_FILE = Path(__file__).parent.parent / "state.json"


@pytest.fixture(autouse=True)
def cleanup():
    yield
    if STATE_FILE.exists():
        STATE_FILE.unlink()


def test_load_state_returns_default_when_no_file():
    state = load_state(user_id=123)
    assert state.source_text == ""
    assert state.platform == "Threads"
    assert state.current_draft == ""
    assert state.revision_history == []


def test_save_and_load_state():
    state = ConversationState(
        source_text="test news",
        platform="LinkedIn",
        current_draft="test draft",
        revision_history=[("make it shorter", "shorter draft")],
    )
    save_state(user_id=123, state=state)
    loaded = load_state(user_id=123)
    assert loaded.source_text == "test news"
    assert loaded.platform == "LinkedIn"
    assert loaded.current_draft == "test draft"
    assert loaded.revision_history == [("make it shorter", "shorter draft")]


def test_multiple_users_isolated():
    save_state(user_id=1, state=ConversationState(source_text="user1"))
    save_state(user_id=2, state=ConversationState(source_text="user2"))
    assert load_state(user_id=1).source_text == "user1"
    assert load_state(user_id=2).source_text == "user2"


def test_clear_state_resets_to_default():
    save_state(user_id=123, state=ConversationState(source_text="something"))
    clear_state(user_id=123)
    state = load_state(user_id=123)
    assert state.source_text == ""
