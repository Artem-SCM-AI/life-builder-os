import json
from dataclasses import dataclass, field, asdict
from pathlib import Path

STATE_FILE = Path(__file__).parent / "state.json"


@dataclass
class ConversationState:
    source_text: str = ""
    platform: str = "Threads"
    current_draft: str = ""
    revision_history: list = field(default_factory=list)


def load_state(user_id: int) -> ConversationState:
    if not STATE_FILE.exists():
        return ConversationState()
    data = json.loads(STATE_FILE.read_text(encoding="utf-8"))
    user_data = data.get(str(user_id))
    if not user_data:
        return ConversationState()
    user_data["revision_history"] = [
        tuple(item) for item in user_data.get("revision_history", [])
    ]
    return ConversationState(**user_data)


def save_state(user_id: int, state: ConversationState) -> None:
    data: dict = {}
    if STATE_FILE.exists():
        data = json.loads(STATE_FILE.read_text(encoding="utf-8"))
    serialized = asdict(state)
    data[str(user_id)] = serialized
    STATE_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def clear_state(user_id: int) -> None:
    save_state(user_id, ConversationState())
