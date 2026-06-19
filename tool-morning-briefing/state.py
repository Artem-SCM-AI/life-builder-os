import json
from datetime import date
from pathlib import Path

STATE_DIR = Path(__file__).parent / "state"


def save_state(kind: str, d: date, text: str) -> None:
    STATE_DIR.mkdir(exist_ok=True)
    (STATE_DIR / f"{kind}-{d.isoformat()}.txt").write_text(text, encoding="utf-8")


def load_state(kind: str, d: date) -> str | None:
    path = STATE_DIR / f"{kind}-{d.isoformat()}.txt"
    if not path.exists():
        return None
    return path.read_text(encoding="utf-8")


def extract_commitment(evening_text: str) -> str:
    for line in evening_text.splitlines():
        if line.upper().startswith("COMMITMENT:"):
            return line[len("COMMITMENT:"):].strip()
    return "Немає"


def save_weekly_rate(year: int, week: int, rate: float) -> None:
    STATE_DIR.mkdir(exist_ok=True)
    path = STATE_DIR / f"weekly-{year}-W{week:02d}.json"
    path.write_text(json.dumps({"rate": rate}), encoding="utf-8")


def load_weekly_rate(year: int, week: int) -> float | None:
    path = STATE_DIR / f"weekly-{year}-W{week:02d}.json"
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))["rate"]
