# Jello Slack Intelligence Bot — Implementation Plan

---

## Handover for next session

**What was built this session (2026-06-19):**
Brainstorming + full design for a Jello/Accommerce Slack bot. Design doc and this implementation plan are both written and ready.

**Design spec:** `docs/superpowers/specs/2026-06-19-jello-slack-intelligence-bot-design.md`

**What to do next:**
1. Read the spec above for full context
2. Choose execution mode: Subagent-Driven (`/superpowers:subagent-driven-development`) or Inline (`/superpowers:executing-plans`)
3. Execute this plan task by task, starting with Task 1

**Key decisions already made:**
- Runtime: FastAPI + `slack-bolt` AsyncApp on Railway (~$5/month)
- Classifier: Claude Haiku (`claude-haiku-4-5-20251001`) per message
- All channels + DMs monitored (entire Accommerce workspace)
- Task creation: user confirms with ✅ reaction → ClickUp "Slack Backlog" list
- Reply drafts: private DM to Artem only → ✅ to auto-send via bot OR copy-paste manually
- Logging: all messages (except noise) → Google Sheets "Slack Log" tab
- Team Q&A (others asking the bot) → deferred to v2

**Pre-implementation checklist (before Task 1):**
- [ ] Create Slack App at api.slack.com/apps (needed for tokens in Task 1 `.env`)
- [ ] Create "Slack Backlog" list in ClickUp Space 901510747838 (get list ID for `CLICKUP_LIST_ID`)
- [ ] Create Google Sheet "Jello Slack Log" + service account (for `GOOGLE_SERVICE_ACCOUNT_JSON`)
- [ ] Get your Slack user ID (`ARTEM_SLACK_USER_ID`) — Slack profile → "Copy member ID"

---

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A real-time Slack bot for Accommerce that classifies messages with Claude Haiku, proposes ClickUp tasks (confirmed with ✅ reaction), drafts reply suggestions for messages directed at Artem, and logs all messages to Google Sheets.

**Architecture:** Async Python service using `slack-bolt` AsyncApp + FastAPI, deployed on Railway. Every incoming Slack message is classified by Claude Haiku into action_item / decision / reply_needed / info / noise. Action items surface as thread proposals awaiting ✅; reply drafts go to Artem's DM privately.

**Tech Stack:** Python 3.11+, FastAPI, slack-bolt (AsyncApp), anthropic SDK, httpx, gspread, pydantic-settings, pytest + pytest-asyncio + pytest-mock

## Global Constraints

- All code in `jello-sc/tools/slack-bot/`
- Python 3.11+ (uses `str | None` union syntax and `asyncio.to_thread`)
- No secrets hardcoded — all from env vars via `config.py`
- Claude model: `claude-haiku-4-5-20251001`
- ClickUp token from `$CLICKUP_TOKEN` env var (already exists in `~/.zshenv`)
- Bot posts from its own Slack account — never impersonates users
- In-memory state only (MVP) — restart clears pending actions

---

## File Map

```
jello-sc/tools/slack-bot/
├── config.py          # Pydantic Settings — all env vars
├── classifier.py      # Claude Haiku: classify + extract fields
├── clickup.py         # ClickUp REST API client (sync, wrapped in to_thread)
├── sheets.py          # Google Sheets append client (sync, wrapped in to_thread)
├── slack_client.py    # Slack Web API helpers (sync, wrapped in to_thread)
├── state.py           # In-memory pending actions store
├── main.py            # FastAPI app + Slack Bolt AsyncApp event handlers
├── tests/
│   ├── conftest.py
│   ├── test_classifier.py
│   ├── test_clickup.py
│   ├── test_sheets.py
│   ├── test_slack_client.py
│   ├── test_state.py
│   └── test_main.py
├── requirements.txt
├── .env.example
└── railway.toml
```

---

## Task 1: Project scaffold + config

**Files:**
- Create: `jello-sc/tools/slack-bot/config.py`
- Create: `jello-sc/tools/slack-bot/requirements.txt`
- Create: `jello-sc/tools/slack-bot/railway.toml`
- Create: `jello-sc/tools/slack-bot/.env.example`
- Test: `jello-sc/tools/slack-bot/tests/conftest.py`

**Interfaces:**
- Produces: `settings` (Settings instance), importable from `config`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p "jello-sc/tools/slack-bot/tests"
touch "jello-sc/tools/slack-bot/tests/__init__.py"
```

- [ ] **Step 2: Write `requirements.txt`**

```
fastapi==0.111.0
uvicorn==0.30.1
slack-bolt==1.19.1
anthropic==0.28.0
httpx==0.27.0
gspread==6.1.2
google-auth==2.30.0
pydantic-settings==2.3.4
python-dotenv==1.0.1
pytest==8.2.2
pytest-asyncio==0.23.7
pytest-mock==3.14.0
```

- [ ] **Step 3: Write `railway.toml`**

```toml
[deploy]
startCommand = "uvicorn main:fastapi_app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
healthcheckTimeout = 10
```

- [ ] **Step 4: Write `.env.example`**

```
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
ANTHROPIC_API_KEY=sk-ant-...
CLICKUP_TOKEN=pk_...
CLICKUP_LIST_ID=901500000000
GOOGLE_SHEETS_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OhyCnbyZ
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
ARTEM_SLACK_USER_ID=U0123456789
```

- [ ] **Step 5: Write `config.py`**

```python
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    slack_bot_token: str
    slack_signing_secret: str
    anthropic_api_key: str
    clickup_token: str
    clickup_list_id: str
    google_sheets_id: str
    google_service_account_json: str
    artem_slack_user_id: str

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
```

- [ ] **Step 6: Write `tests/conftest.py`**

```python
import pytest
from unittest.mock import patch


@pytest.fixture(autouse=True)
def mock_settings(monkeypatch):
    monkeypatch.setenv("SLACK_BOT_TOKEN", "xoxb-test")
    monkeypatch.setenv("SLACK_SIGNING_SECRET", "test-secret")
    monkeypatch.setenv("ANTHROPIC_API_KEY", "sk-test")
    monkeypatch.setenv("CLICKUP_TOKEN", "pk_test")
    monkeypatch.setenv("CLICKUP_LIST_ID", "901500000001")
    monkeypatch.setenv("GOOGLE_SHEETS_ID", "sheet-id-test")
    monkeypatch.setenv("GOOGLE_SERVICE_ACCOUNT_JSON", '{"type":"service_account"}')
    monkeypatch.setenv("ARTEM_SLACK_USER_ID", "UARTEM123")
```

- [ ] **Step 7: Install dependencies**

```bash
cd "jello-sc/tools/slack-bot" && pip install -r requirements.txt
```

Expected: all packages install without errors.

- [ ] **Step 8: Verify config loads**

```bash
cd "jello-sc/tools/slack-bot" && python -c "
import os
os.environ.update({
    'SLACK_BOT_TOKEN': 'xoxb-test',
    'SLACK_SIGNING_SECRET': 'sec',
    'ANTHROPIC_API_KEY': 'sk-test',
    'CLICKUP_TOKEN': 'pk_test',
    'CLICKUP_LIST_ID': '901500000001',
    'GOOGLE_SHEETS_ID': 'sheet-id',
    'GOOGLE_SERVICE_ACCOUNT_JSON': '{\"type\":\"service_account\"}',
    'ARTEM_SLACK_USER_ID': 'UARTEM123',
})
from config import settings
assert settings.slack_bot_token == 'xoxb-test'
print('config OK')
"
```

Expected: `config OK`

- [ ] **Step 9: Commit**

```bash
git add jello-sc/tools/slack-bot/
git commit -m "feat: scaffold jello-slack-bot project"
```

---

## Task 2: Message classifier

**Files:**
- Create: `jello-sc/tools/slack-bot/classifier.py`
- Test: `jello-sc/tools/slack-bot/tests/test_classifier.py`

**Interfaces:**
- Consumes: `settings.anthropic_api_key`, `settings.artem_slack_user_id`
- Produces:
  - `ActionItem(title: str, description: str, assignee_name: str | None, priority: str)`
  - `ClassificationResult(classifications: list[str], action_item: ActionItem | None, reply_draft: str | None)`
  - `classify_message(text: str, sender_name: str, sender_id: str, channel_name: str) -> ClassificationResult`

- [ ] **Step 1: Write failing tests**

```python
# tests/test_classifier.py
import json
import pytest
from unittest.mock import MagicMock, patch


def make_anthropic_response(data: dict):
    mock_resp = MagicMock()
    mock_resp.content = [MagicMock(text=json.dumps(data))]
    return mock_resp


@patch("classifier.Anthropic")
def test_classify_action_item(MockAnthropic):
    MockAnthropic.return_value.messages.create.return_value = make_anthropic_response({
        "classifications": ["action_item"],
        "action_item": {
            "title": "Confirm B2 shipment ETA",
            "description": "Malcolm needs ETA confirmation for B2 batch.",
            "assignee_name": "Artem",
            "priority": "urgent",
        },
        "reply_draft": None,
    })

    from classifier import classify_message
    result = classify_message("Can you confirm B2 ETA?", "Malcolm", "UMALCOLM", "logistics")

    assert "action_item" in result.classifications
    assert result.action_item is not None
    assert result.action_item.title == "Confirm B2 shipment ETA"
    assert result.action_item.priority == "urgent"
    assert result.reply_draft is None


@patch("classifier.Anthropic")
def test_classify_reply_needed(MockAnthropic):
    MockAnthropic.return_value.messages.create.return_value = make_anthropic_response({
        "classifications": ["reply_needed"],
        "action_item": None,
        "reply_draft": "Hi Malcolm, B2 is on track for Jun 28.",
    })

    from classifier import classify_message
    result = classify_message("<@UARTEM123> what is the ETA?", "Malcolm", "UMALCOLM", "general")

    assert "reply_needed" in result.classifications
    assert result.reply_draft == "Hi Malcolm, B2 is on track for Jun 28."
    assert result.action_item is None


@patch("classifier.Anthropic")
def test_classify_noise(MockAnthropic):
    MockAnthropic.return_value.messages.create.return_value = make_anthropic_response({
        "classifications": ["noise"],
        "action_item": None,
        "reply_draft": None,
    })

    from classifier import classify_message
    result = classify_message("👍", "Clemens", "UCLEMENS", "general")

    assert result.classifications == ["noise"]
    assert result.action_item is None
    assert result.reply_draft is None


@patch("classifier.Anthropic")
def test_classify_multi(MockAnthropic):
    MockAnthropic.return_value.messages.create.return_value = make_anthropic_response({
        "classifications": ["action_item", "reply_needed"],
        "action_item": {
            "title": "Send FF invoice",
            "description": "FF invoice needs to be sent to accounting.",
            "assignee_name": None,
            "priority": "normal",
        },
        "reply_draft": "On it — will send by EOD.",
    })

    from classifier import classify_message
    result = classify_message("<@UARTEM123> can you send the FF invoice?", "Raj", "URAJ", "ff-ops")

    assert "action_item" in result.classifications
    assert "reply_needed" in result.classifications
    assert result.action_item.title == "Send FF invoice"
    assert result.reply_draft == "On it — will send by EOD."
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd "jello-sc/tools/slack-bot" && python -m pytest tests/test_classifier.py -v 2>&1 | head -20
```

Expected: `ModuleNotFoundError: No module named 'classifier'`

- [ ] **Step 3: Write `classifier.py`**

```python
from dataclasses import dataclass
from typing import Literal
import json

from anthropic import Anthropic

from config import settings

SYSTEM_TEMPLATE = """You are an AI assistant for Accommerce GmbH (Jello brand), a supply chain company.
Artem's Slack user ID is: {artem_id}

Key people: Clemens Severin Büder (CEO), Andrei Oboukhov (co-founder), Malcolm (Fly Fulfillment contact), Raj (Fly Fulfillment), Ziyao Luo (factory/China), Artem (SC Manager).

Classify the message into one or more of: action_item, decision, reply_needed, info, noise

Rules:
- action_item: a concrete task that needs to be done by someone
- decision: a decision was made or needs to be made
- reply_needed: message is directed at Artem (<@{artem_id}>, DM, or question clearly expecting his response)
- info: informational update with no required action
- noise: small talk, emoji-only, one-word acknowledgements (ok, thanks, 👍)

If action_item: extract title (max 80 chars), description (1-2 sentences), assignee_name (person name or null), priority (urgent/normal/low).
If reply_needed: write a concise professional reply in English (max 3 sentences).

Return valid JSON only, no markdown fences:
{{"classifications": [...], "action_item": null or {{"title": "...", "description": "...", "assignee_name": null, "priority": "normal"}}, "reply_draft": null or "..."}}"""


@dataclass
class ActionItem:
    title: str
    description: str
    assignee_name: str | None
    priority: Literal["urgent", "normal", "low"]


@dataclass
class ClassificationResult:
    classifications: list[str]
    action_item: ActionItem | None = None
    reply_draft: str | None = None


def classify_message(
    text: str,
    sender_name: str,
    sender_id: str,
    channel_name: str,
) -> ClassificationResult:
    client = Anthropic(api_key=settings.anthropic_api_key)
    system = SYSTEM_TEMPLATE.format(artem_id=settings.artem_slack_user_id)

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=512,
        system=system,
        messages=[{
            "role": "user",
            "content": f"Sender: {sender_name} | Channel: #{channel_name}\nMessage: {text}",
        }],
    )

    data = json.loads(response.content[0].text)

    action = None
    if data.get("action_item"):
        a = data["action_item"]
        action = ActionItem(
            title=a["title"],
            description=a["description"],
            assignee_name=a.get("assignee_name"),
            priority=a.get("priority", "normal"),
        )

    return ClassificationResult(
        classifications=data["classifications"],
        action_item=action,
        reply_draft=data.get("reply_draft"),
    )
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
cd "jello-sc/tools/slack-bot" && python -m pytest tests/test_classifier.py -v
```

Expected: `4 passed`

- [ ] **Step 5: Commit**

```bash
git add jello-sc/tools/slack-bot/classifier.py jello-sc/tools/slack-bot/tests/test_classifier.py
git commit -m "feat: add Claude Haiku message classifier"
```

---

## Task 3: ClickUp API client

**Files:**
- Create: `jello-sc/tools/slack-bot/clickup.py`
- Test: `jello-sc/tools/slack-bot/tests/test_clickup.py`

**Interfaces:**
- Consumes: `settings.clickup_token`, `settings.clickup_list_id`
- Produces: `create_task(title: str, description: str, slack_permalink: str) -> str` (returns task URL)

- [ ] **Step 1: Write failing tests**

```python
# tests/test_clickup.py
import pytest
from unittest.mock import patch, MagicMock


@patch("clickup.httpx.post")
def test_create_task_returns_url(mock_post):
    mock_response = MagicMock()
    mock_response.json.return_value = {"url": "https://app.clickup.com/t/abc123", "id": "abc123"}
    mock_response.raise_for_status = MagicMock()
    mock_post.return_value = mock_response

    from clickup import create_task
    url = create_task("Confirm ETA", "Malcolm needs ETA for B2.", "https://slack.com/archives/C123/p456")

    assert url == "https://app.clickup.com/t/abc123"


@patch("clickup.httpx.post")
def test_create_task_payload(mock_post):
    mock_response = MagicMock()
    mock_response.json.return_value = {"url": "https://app.clickup.com/t/xyz"}
    mock_response.raise_for_status = MagicMock()
    mock_post.return_value = mock_response

    from clickup import create_task
    create_task("My Task", "Task description.", "https://slack.com/p/123")

    call_kwargs = mock_post.call_args
    payload = call_kwargs.kwargs["json"]
    assert payload["name"] == "My Task"
    assert "Task description." in payload["description"]
    assert "https://slack.com/p/123" in payload["description"]
    assert any(t["name"] == "source:slack" for t in payload["tags"])
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd "jello-sc/tools/slack-bot" && python -m pytest tests/test_clickup.py -v 2>&1 | head -10
```

Expected: `ModuleNotFoundError: No module named 'clickup'`

- [ ] **Step 3: Write `clickup.py`**

```python
import httpx

from config import settings

CLICKUP_BASE = "https://api.clickup.com/api/v2"


def create_task(title: str, description: str, slack_permalink: str) -> str:
    headers = {"Authorization": settings.clickup_token}
    payload = {
        "name": title,
        "description": f"{description}\n\nSlack: {slack_permalink}",
        "status": "to do",
        "tags": [{"name": "source:slack"}],
        "priority": 3,
    }
    response = httpx.post(
        f"{CLICKUP_BASE}/list/{settings.clickup_list_id}/task",
        json=payload,
        headers=headers,
        timeout=10,
    )
    response.raise_for_status()
    return response.json()["url"]
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
cd "jello-sc/tools/slack-bot" && python -m pytest tests/test_clickup.py -v
```

Expected: `2 passed`

- [ ] **Step 5: Commit**

```bash
git add jello-sc/tools/slack-bot/clickup.py jello-sc/tools/slack-bot/tests/test_clickup.py
git commit -m "feat: add ClickUp task creation client"
```

---

## Task 4: Google Sheets logging client

**Files:**
- Create: `jello-sc/tools/slack-bot/sheets.py`
- Test: `jello-sc/tools/slack-bot/tests/test_sheets.py`

**Interfaces:**
- Consumes: `settings.google_sheets_id`, `settings.google_service_account_json`
- Produces:
  - `SheetRow(timestamp, channel, author, message, classification, task_id, task_url, slack_permalink)`
  - `log_message(row: SheetRow) -> None`

- [ ] **Step 1: Write failing tests**

```python
# tests/test_sheets.py
import pytest
from unittest.mock import patch, MagicMock
from sheets import SheetRow


@patch("sheets.gspread.authorize")
@patch("sheets.Credentials.from_service_account_info")
def test_log_message_appends_8_columns(mock_creds, mock_authorize):
    mock_sheet = MagicMock()
    mock_authorize.return_value.open_by_key.return_value.worksheet.return_value = mock_sheet

    from sheets import log_message
    row = SheetRow(
        timestamp="2026-06-19T10:00:00Z",
        channel="logistics",
        author="Malcolm",
        message="Can you confirm ETA?",
        classification="reply_needed",
        task_id="",
        task_url="",
        slack_permalink="https://slack.com/p/123",
    )
    log_message(row)

    mock_sheet.append_row.assert_called_once()
    appended = mock_sheet.append_row.call_args[0][0]
    assert len(appended) == 8
    assert appended[0] == "2026-06-19T10:00:00Z"
    assert appended[1] == "logistics"
    assert appended[2] == "Malcolm"
    assert appended[3] == "Can you confirm ETA?"
    assert appended[4] == "reply_needed"
    assert appended[7] == "https://slack.com/p/123"
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
cd "jello-sc/tools/slack-bot" && python -m pytest tests/test_sheets.py -v 2>&1 | head -10
```

Expected: `ModuleNotFoundError: No module named 'sheets'`

- [ ] **Step 3: Write `sheets.py`**

```python
import json
from dataclasses import dataclass

import gspread
from google.oauth2.service_account import Credentials

from config import settings

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]


@dataclass
class SheetRow:
    timestamp: str
    channel: str
    author: str
    message: str
    classification: str
    task_id: str = ""
    task_url: str = ""
    slack_permalink: str = ""


def _get_sheet():
    creds_dict = json.loads(settings.google_service_account_json)
    creds = Credentials.from_service_account_info(creds_dict, scopes=SCOPES)
    gc = gspread.authorize(creds)
    sh = gc.open_by_key(settings.google_sheets_id)
    return sh.worksheet("Slack Log")


def log_message(row: SheetRow) -> None:
    sheet = _get_sheet()
    sheet.append_row([
        row.timestamp,
        row.channel,
        row.author,
        row.message,
        row.classification,
        row.task_id,
        row.task_url,
        row.slack_permalink,
    ])
```

- [ ] **Step 4: Run test — expect PASS**

```bash
cd "jello-sc/tools/slack-bot" && python -m pytest tests/test_sheets.py -v
```

Expected: `1 passed`

- [ ] **Step 5: Commit**

```bash
git add jello-sc/tools/slack-bot/sheets.py jello-sc/tools/slack-bot/tests/test_sheets.py
git commit -m "feat: add Google Sheets logging client"
```

---

## Task 5: In-memory state manager

**Files:**
- Create: `jello-sc/tools/slack-bot/state.py`
- Test: `jello-sc/tools/slack-bot/tests/test_state.py`

**Interfaces:**
- Produces:
  - `PendingAction(action_type, task_title, task_description, slack_permalink, reply_text, target_channel, target_thread_ts, awaiting_edit)`
  - `add_pending(message_ts: str, action: PendingAction) -> None`
  - `pop_pending(message_ts: str) -> PendingAction | None`
  - `set_edit_mode(dm_channel: str, message_ts: str) -> None`
  - `get_edit_pending(dm_channel: str) -> PendingAction | None`
  - `resolve_edit(dm_channel: str, new_text: str) -> str | None` (returns message_ts or None)

- [ ] **Step 1: Write failing tests**

```python
# tests/test_state.py
import pytest
import importlib


@pytest.fixture(autouse=True)
def reset_state():
    import state
    state._pending.clear()
    state._edit_mode.clear()
    yield
    state._pending.clear()
    state._edit_mode.clear()


def test_add_and_pop_pending():
    from state import add_pending, pop_pending, PendingAction
    action = PendingAction(action_type="clickup_task", task_title="Fix ETA")
    add_pending("ts-001", action)
    result = pop_pending("ts-001")
    assert result is not None
    assert result.task_title == "Fix ETA"
    assert pop_pending("ts-001") is None  # already removed


def test_pop_missing_returns_none():
    from state import pop_pending
    assert pop_pending("nonexistent") is None


def test_set_and_get_edit_mode():
    from state import add_pending, set_edit_mode, get_edit_pending, PendingAction
    action = PendingAction(
        action_type="send_reply",
        reply_text="Original draft",
        target_channel="C-GENERAL",
        target_thread_ts="ts-999",
    )
    add_pending("ts-bot-001", action)
    set_edit_mode("D-DM-CHAN", "ts-bot-001")

    pending = get_edit_pending("D-DM-CHAN")
    assert pending is not None
    assert pending.reply_text == "Original draft"


def test_resolve_edit_updates_text():
    from state import add_pending, set_edit_mode, resolve_edit, pop_pending, PendingAction
    action = PendingAction(action_type="send_reply", reply_text="Old draft")
    add_pending("ts-bot-002", action)
    set_edit_mode("D-DM-CHAN2", "ts-bot-002")

    returned_ts = resolve_edit("D-DM-CHAN2", "New improved draft")
    assert returned_ts == "ts-bot-002"

    updated = pop_pending("ts-bot-002")
    assert updated.reply_text == "New improved draft"
    assert not updated.awaiting_edit


def test_resolve_edit_clears_edit_mode():
    from state import add_pending, set_edit_mode, resolve_edit, get_edit_pending, PendingAction
    action = PendingAction(action_type="send_reply", reply_text="Draft")
    add_pending("ts-bot-003", action)
    set_edit_mode("D-DM-CHAN3", "ts-bot-003")
    resolve_edit("D-DM-CHAN3", "New draft")

    assert get_edit_pending("D-DM-CHAN3") is None
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd "jello-sc/tools/slack-bot" && python -m pytest tests/test_state.py -v 2>&1 | head -10
```

Expected: `ModuleNotFoundError: No module named 'state'`

- [ ] **Step 3: Write `state.py`**

```python
import time
from dataclasses import dataclass, field
from typing import Literal


@dataclass
class PendingAction:
    action_type: Literal["clickup_task", "send_reply"]
    task_title: str | None = None
    task_description: str | None = None
    slack_permalink: str | None = None
    reply_text: str | None = None
    target_channel: str | None = None
    target_thread_ts: str | None = None
    awaiting_edit: bool = False
    created_at: float = field(default_factory=time.time)


_pending: dict[str, PendingAction] = {}
_edit_mode: dict[str, str] = {}  # dm_channel_id -> bot_message_ts


def add_pending(message_ts: str, action: PendingAction) -> None:
    _pending[message_ts] = action


def pop_pending(message_ts: str) -> PendingAction | None:
    return _pending.pop(message_ts, None)


def set_edit_mode(dm_channel: str, message_ts: str) -> None:
    action = _pending.get(message_ts)
    if action:
        action.awaiting_edit = True
    _edit_mode[dm_channel] = message_ts


def get_edit_pending(dm_channel: str) -> PendingAction | None:
    ts = _edit_mode.get(dm_channel)
    if ts:
        return _pending.get(ts)
    return None


def resolve_edit(dm_channel: str, new_text: str) -> str | None:
    ts = _edit_mode.pop(dm_channel, None)
    if ts and ts in _pending:
        _pending[ts].reply_text = new_text
        _pending[ts].awaiting_edit = False
        return ts
    return None
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
cd "jello-sc/tools/slack-bot" && python -m pytest tests/test_state.py -v
```

Expected: `5 passed`

- [ ] **Step 5: Commit**

```bash
git add jello-sc/tools/slack-bot/state.py jello-sc/tools/slack-bot/tests/test_state.py
git commit -m "feat: add in-memory pending actions state manager"
```

---

## Task 6: Slack Web API helpers

**Files:**
- Create: `jello-sc/tools/slack-bot/slack_client.py`
- Test: `jello-sc/tools/slack-bot/tests/test_slack_client.py`

**Interfaces:**
- Consumes: `settings.slack_bot_token`
- Produces:
  - `reply_in_thread(channel: str, thread_ts: str, text: str) -> str` (returns message ts)
  - `send_dm(user_id: str, text: str) -> tuple[str, str]` (returns channel_id, message_ts)
  - `post_message(channel: str, thread_ts: str | None, text: str) -> None`
  - `get_permalink(channel: str, message_ts: str) -> str`
  - `get_user_name(client: WebClient, user_id: str) -> str`
  - `get_channel_name(client: WebClient, channel_id: str) -> str`
  - `make_client() -> WebClient`

- [ ] **Step 1: Write failing tests**

```python
# tests/test_slack_client.py
import pytest
from unittest.mock import patch, MagicMock


@patch("slack_client.WebClient")
def test_reply_in_thread_returns_ts(MockWebClient):
    mock_client = MagicMock()
    mock_client.chat_postMessage.return_value = {"ts": "1234567890.000001"}
    MockWebClient.return_value = mock_client

    from slack_client import reply_in_thread
    ts = reply_in_thread("C-GENERAL", "1234567880.000000", "Task detected!")

    assert ts == "1234567890.000001"
    mock_client.chat_postMessage.assert_called_once_with(
        channel="C-GENERAL",
        thread_ts="1234567880.000000",
        text="Task detected!",
    )


@patch("slack_client.WebClient")
def test_send_dm_returns_channel_and_ts(MockWebClient):
    mock_client = MagicMock()
    mock_client.conversations_open.return_value = {"channel": {"id": "D-DM-001"}}
    mock_client.chat_postMessage.return_value = {"ts": "9999999999.000001"}
    MockWebClient.return_value = mock_client

    from slack_client import send_dm
    channel_id, ts = send_dm("UARTEM123", "Draft reply here")

    assert channel_id == "D-DM-001"
    assert ts == "9999999999.000001"
    mock_client.conversations_open.assert_called_once_with(users="UARTEM123")


@patch("slack_client.WebClient")
def test_post_message_with_thread(MockWebClient):
    mock_client = MagicMock()
    MockWebClient.return_value = mock_client

    from slack_client import post_message
    post_message("C-GENERAL", "1234567880.000000", "Reply sent!")

    mock_client.chat_postMessage.assert_called_once_with(
        channel="C-GENERAL",
        thread_ts="1234567880.000000",
        text="Reply sent!",
    )


@patch("slack_client.WebClient")
def test_post_message_without_thread(MockWebClient):
    mock_client = MagicMock()
    MockWebClient.return_value = mock_client

    from slack_client import post_message
    post_message("C-GENERAL", None, "Hello channel")

    call_kwargs = mock_client.chat_postMessage.call_args.kwargs
    assert "thread_ts" not in call_kwargs


@patch("slack_client.WebClient")
def test_get_permalink(MockWebClient):
    mock_client = MagicMock()
    mock_client.chat_getPermalink.return_value = {"permalink": "https://slack.com/archives/C123/p456"}
    MockWebClient.return_value = mock_client

    from slack_client import get_permalink
    url = get_permalink("C-GENERAL", "1234567890.000001")

    assert url == "https://slack.com/archives/C123/p456"
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd "jello-sc/tools/slack-bot" && python -m pytest tests/test_slack_client.py -v 2>&1 | head -10
```

Expected: `ModuleNotFoundError: No module named 'slack_client'`

- [ ] **Step 3: Write `slack_client.py`**

```python
from slack_sdk import WebClient

from config import settings


def make_client() -> WebClient:
    return WebClient(token=settings.slack_bot_token)


def reply_in_thread(channel: str, thread_ts: str, text: str) -> str:
    resp = make_client().chat_postMessage(channel=channel, thread_ts=thread_ts, text=text)
    return resp["ts"]


def send_dm(user_id: str, text: str) -> tuple[str, str]:
    client = make_client()
    dm = client.conversations_open(users=user_id)
    channel_id = dm["channel"]["id"]
    resp = client.chat_postMessage(channel=channel_id, text=text)
    return channel_id, resp["ts"]


def post_message(channel: str, thread_ts: str | None, text: str) -> None:
    kwargs: dict = {"channel": channel, "text": text}
    if thread_ts:
        kwargs["thread_ts"] = thread_ts
    make_client().chat_postMessage(**kwargs)


def get_permalink(channel: str, message_ts: str) -> str:
    resp = make_client().chat_getPermalink(channel=channel, message_ts=message_ts)
    return resp["permalink"]


def get_user_name(client: WebClient, user_id: str) -> str:
    try:
        info = client.users_info(user=user_id)
        return info["user"]["real_name"]
    except Exception:
        return user_id


def get_channel_name(client: WebClient, channel_id: str) -> str:
    try:
        info = client.conversations_info(channel=channel_id)
        return info["channel"].get("name", channel_id)
    except Exception:
        return channel_id
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
cd "jello-sc/tools/slack-bot" && python -m pytest tests/test_slack_client.py -v
```

Expected: `5 passed`

- [ ] **Step 5: Commit**

```bash
git add jello-sc/tools/slack-bot/slack_client.py jello-sc/tools/slack-bot/tests/test_slack_client.py
git commit -m "feat: add Slack Web API helper client"
```

---

## Task 7: FastAPI + Slack Bolt event handlers

**Files:**
- Create: `jello-sc/tools/slack-bot/main.py`
- Test: `jello-sc/tools/slack-bot/tests/test_main.py`

**Interfaces:**
- Consumes: `classify_message`, `create_task`, `log_message`, `reply_in_thread`, `send_dm`, `post_message`, `get_permalink`, `get_user_name`, `get_channel_name`, `add_pending`, `pop_pending`, `set_edit_mode`, `get_edit_pending`, `resolve_edit`, `PendingAction`, `SheetRow`, `settings`
- Produces: `fastapi_app` (ASGI app, entry point for Railway)

- [ ] **Step 1: Write failing tests**

```python
# tests/test_main.py
import pytest
import pytest_asyncio
from unittest.mock import patch, MagicMock, AsyncMock
from fastapi.testclient import TestClient


@pytest.fixture
def client():
    with patch("main.settings") as mock_settings:
        mock_settings.slack_bot_token = "xoxb-test"
        mock_settings.slack_signing_secret = "test-secret"
        mock_settings.anthropic_api_key = "sk-test"
        mock_settings.clickup_token = "pk_test"
        mock_settings.clickup_list_id = "901500000001"
        mock_settings.google_sheets_id = "sheet-id"
        mock_settings.google_service_account_json = '{"type":"service_account"}'
        mock_settings.artem_slack_user_id = "UARTEM123"
        from main import fastapi_app
        yield TestClient(fastapi_app)


def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@patch("main.classify_message")
@patch("main.log_message")
@patch("main.reply_in_thread")
@patch("main.get_permalink", return_value="https://slack.com/p/123")
@patch("main.make_client")
def test_bot_message_skipped(mock_make_client, mock_permalink, mock_reply, mock_log, mock_classify):
    """Messages with bot_id should be ignored."""
    from main import bolt_app
    
    handled = []

    @bolt_app.event("message")
    def capture(event):
        handled.append(event)

    event = {"type": "message", "bot_id": "B123", "text": "I am a bot", "channel": "C-GEN", "ts": "123.456"}
    # bolt_app processes events internally; verify classify is NOT called
    mock_classify.assert_not_called()


@pytest.mark.asyncio
@patch("main.classify_message")
@patch("main.log_message")
@patch("main.get_permalink", return_value="https://slack.com/p/999")
@patch("main.reply_in_thread", return_value="bot-ts-001")
@patch("main.add_pending")
@patch("main.make_client")
async def test_action_item_creates_pending(mock_make_client, mock_add_pending, mock_reply, mock_permalink, mock_log, mock_classify):
    """action_item classification should call reply_in_thread and add_pending."""
    from classifier import ClassificationResult, ActionItem
    from main import _handle_message_logic

    mock_make_client.return_value = MagicMock(
        users_info=MagicMock(return_value={"user": {"real_name": "Malcolm"}}),
        conversations_info=MagicMock(return_value={"channel": {"name": "logistics"}}),
    )
    mock_classify.return_value = ClassificationResult(
        classifications=["action_item"],
        action_item=ActionItem(
            title="Confirm B2 ETA",
            description="Malcolm needs confirmation.",
            assignee_name=None,
            priority="normal",
        ),
    )

    await _handle_message_logic(
        text="Can you confirm B2 ETA?",
        channel="C-LOGISTICS",
        ts="1234567890.000001",
        thread_ts="1234567890.000001",
        user_id="UMALCOLM",
    )

    mock_reply.assert_called_once()
    proposal_text = mock_reply.call_args[0][2]
    assert "Confirm B2 ETA" in proposal_text
    mock_add_pending.assert_called_once()
    pending_action = mock_add_pending.call_args[0][1]
    assert pending_action.action_type == "clickup_task"
    assert pending_action.task_title == "Confirm B2 ETA"
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd "jello-sc/tools/slack-bot" && python -m pytest tests/test_main.py::test_health_endpoint -v 2>&1 | head -15
```

Expected: `ModuleNotFoundError: No module named 'main'`

- [ ] **Step 3: Write `main.py`**

```python
import asyncio
from datetime import datetime, timezone

from fastapi import FastAPI, Request
from slack_bolt.async_app import AsyncApp
from slack_bolt.adapter.fastapi.async_handler import AsyncSlackRequestHandler
from slack_sdk import WebClient

from classifier import classify_message
from clickup import create_task
from sheets import log_message, SheetRow
from slack_client import (
    reply_in_thread, send_dm, post_message, get_permalink,
    get_user_name, get_channel_name, make_client,
)
from state import (
    PendingAction, add_pending, pop_pending,
    set_edit_mode, get_edit_pending, resolve_edit,
)
from config import settings

bolt_app = AsyncApp(
    token=settings.slack_bot_token,
    signing_secret=settings.slack_signing_secret,
)
handler = AsyncSlackRequestHandler(bolt_app)

fastapi_app = FastAPI()


@fastapi_app.get("/health")
def health():
    return {"status": "ok"}


@fastapi_app.post("/slack/events")
async def slack_events(req: Request):
    return await handler.handle(req)


async def _handle_message_logic(
    text: str,
    channel: str,
    ts: str,
    thread_ts: str,
    user_id: str,
) -> None:
    client = make_client()
    sender_name = await asyncio.to_thread(get_user_name, client, user_id)
    channel_name = await asyncio.to_thread(get_channel_name, client, channel)

    result = await asyncio.to_thread(classify_message, text, sender_name, user_id, channel_name)

    if set(result.classifications) - {"noise"}:
        try:
            permalink = await asyncio.to_thread(get_permalink, channel, ts)
        except Exception:
            permalink = ""

        await asyncio.to_thread(
            log_message,
            SheetRow(
                timestamp=datetime.now(timezone.utc).isoformat(),
                channel=channel_name,
                author=sender_name,
                message=text[:1000],
                classification=",".join(result.classifications),
                slack_permalink=permalink,
            ),
        )
    else:
        permalink = ""

    if "action_item" in result.classifications and result.action_item:
        a = result.action_item
        proposal = (
            f"🎯 *Action item detected:*\n"
            f"*{a.title}*\n"
            f"{a.description}\n\n"
            f"React ✅ to create in ClickUp · ❌ to dismiss"
        )
        bot_ts = await asyncio.to_thread(reply_in_thread, channel, thread_ts, proposal)
        add_pending(bot_ts, PendingAction(
            action_type="clickup_task",
            task_title=a.title,
            task_description=a.description,
            slack_permalink=permalink,
        ))

    if "reply_needed" in result.classifications and result.reply_draft:
        dm_text = (
            f"📩 *Reply needed — {sender_name} in #{channel_name}:*\n"
            f"_{text[:300]}_\n\n"
            f"✏️ *Draft:*\n{result.reply_draft}\n\n"
            f"React ✅ to send via bot · or copy-paste above to send yourself"
        )
        dm_channel, dm_ts = await asyncio.to_thread(send_dm, settings.artem_slack_user_id, dm_text)
        add_pending(dm_ts, PendingAction(
            action_type="send_reply",
            reply_text=result.reply_draft,
            target_channel=channel,
            target_thread_ts=thread_ts,
        ))


@bolt_app.event("message")
async def handle_message(event, logger):
    if event.get("bot_id") or event.get("subtype"):
        return

    text = event.get("text", "").strip()
    if not text:
        return

    channel = event["channel"]
    ts = event["ts"]
    thread_ts = event.get("thread_ts", ts)
    user_id = event.get("user", "")

    # Check if Artem is editing a reply draft
    if user_id == settings.artem_slack_user_id:
        pending = get_edit_pending(channel)
        if pending:
            resolve_edit(channel, text)
            await asyncio.to_thread(
                post_message, channel, ts,
                "✏️ Draft updated. React ✅ to the original proposal to send.",
            )
            return

    try:
        await _handle_message_logic(text, channel, ts, thread_ts, user_id)
    except Exception as e:
        logger.error(f"handle_message error: {e}")


@bolt_app.event("reaction_added")
async def handle_reaction(event, logger):
    reaction = event["reaction"]
    item = event["item"]

    if item["type"] != "message":
        return

    message_ts = item["ts"]
    item_channel = item["channel"]

    if reaction == "white_check_mark":
        action = pop_pending(message_ts)
        if not action:
            return

        if action.action_type == "clickup_task":
            try:
                task_url = await asyncio.to_thread(
                    create_task,
                    action.task_title,
                    action.task_description,
                    action.slack_permalink or "",
                )
                await asyncio.to_thread(
                    post_message, item_channel, message_ts,
                    f"✅ Task created: {task_url}",
                )
            except Exception as e:
                logger.error(f"ClickUp error: {e}")
                await asyncio.to_thread(
                    post_message, item_channel, message_ts,
                    "❌ Failed to create task. Check logs.",
                )

        elif action.action_type == "send_reply":
            try:
                await asyncio.to_thread(
                    post_message,
                    action.target_channel,
                    action.target_thread_ts,
                    action.reply_text,
                )
            except Exception as e:
                logger.error(f"Reply send error: {e}")

    elif reaction == "pencil2":
        action = pop_pending(message_ts)
        if action and action.action_type == "send_reply":
            add_pending(message_ts, action)
            set_edit_mode(item_channel, message_ts)
            await asyncio.to_thread(
                post_message, item_channel, message_ts,
                "✏️ Send your edited version as a reply here, then react ✅ to send.",
            )

    elif reaction == "x":
        pop_pending(message_ts)
```

- [ ] **Step 4: Run all tests**

```bash
cd "jello-sc/tools/slack-bot" && python -m pytest tests/ -v
```

Expected: all tests pass (minimum 14 tests across all files)

- [ ] **Step 5: Smoke test server starts**

```bash
cd "jello-sc/tools/slack-bot" && python -c "
import os, sys
os.environ.update({
    'SLACK_BOT_TOKEN': 'xoxb-test',
    'SLACK_SIGNING_SECRET': 'sec',
    'ANTHROPIC_API_KEY': 'sk-test',
    'CLICKUP_TOKEN': 'pk_test',
    'CLICKUP_LIST_ID': '901500000001',
    'GOOGLE_SHEETS_ID': 'sheet-id',
    'GOOGLE_SERVICE_ACCOUNT_JSON': '{\"type\":\"service_account\"}',
    'ARTEM_SLACK_USER_ID': 'UARTEM123',
})
from main import fastapi_app
print('main imports OK')
"
```

Expected: `main imports OK`

- [ ] **Step 6: Commit**

```bash
git add jello-sc/tools/slack-bot/main.py jello-sc/tools/slack-bot/tests/test_main.py
git commit -m "feat: add FastAPI + Slack Bolt event handlers"
```

---

## Task 8: Slack App config + Railway deploy

**Files:**
- No code changes — configuration and deployment steps

**Interfaces:**
- Consumes: all previous tasks (deployed service)
- Produces: live webhook URL, bot running in Accommerce Slack workspace

- [ ] **Step 1: Create Slack App at api.slack.com/apps**

Go to https://api.slack.com/apps → "Create New App" → "From scratch"
- App Name: `Jello Assistant`
- Workspace: Accommerce workspace

- [ ] **Step 2: Configure Bot Token Scopes**

Under "OAuth & Permissions" → "Bot Token Scopes", add:
```
channels:history
groups:history
im:history
im:write
chat:write
reactions:read
users:read
conversations:open
```

Click "Install to Workspace" → copy the `Bot User OAuth Token` (xoxb-...)

- [ ] **Step 3: Get Signing Secret**

Under "Basic Information" → "App Credentials" → copy `Signing Secret`

- [ ] **Step 4: Create Railway project and set env vars**

```bash
# Install Railway CLI if needed
npm install -g @railway/cli

# Login and create project
cd "jello-sc/tools/slack-bot"
railway login
railway init
railway up --detach
```

In Railway dashboard → your project → Variables, add:
```
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
ANTHROPIC_API_KEY=sk-ant-...
CLICKUP_TOKEN=<value from $CLICKUP_TOKEN in ~/.zshenv>
CLICKUP_LIST_ID=<create "Slack Backlog" list in ClickUp Space 901510747838, copy its ID>
GOOGLE_SHEETS_ID=<sheet ID from Step 5>
GOOGLE_SERVICE_ACCOUNT_JSON=<full JSON string, one line>
ARTEM_SLACK_USER_ID=<your Slack user ID — find in Slack: profile → "Copy member ID">
```

- [ ] **Step 5: Create Google Sheets log + service account**

1. Create a new Google Sheet named "Jello Slack Log"
2. On Sheet 1, rename tab to "Slack Log"
3. Add header row in row 1: `Timestamp | Channel | Author | Message | Classification | Task ID | Task URL | Slack Permalink`
4. In Google Cloud Console (https://console.cloud.google.com):
   - Create project or use existing (same as SC Ops Dashboard if it exists)
   - Enable "Google Sheets API"
   - Create Service Account → Download JSON key
5. Share the Sheet with the service account email (Editor access)
6. Minify the JSON key to one line, set as `GOOGLE_SERVICE_ACCOUNT_JSON`

- [ ] **Step 6: Create "Slack Backlog" list in ClickUp**

In ClickUp → Supply Chain space (901510747838) → "+ New List" → Name: `Slack Backlog`
Copy the list ID from the URL (last number segment) → set as `CLICKUP_LIST_ID`

- [ ] **Step 7: Configure Slack Event Subscriptions**

In Slack App settings → "Event Subscriptions":
- Enable Events: ON
- Request URL: `https://<your-railway-domain>/slack/events`
- Wait for Railway to confirm the URL (it will challenge it)
- Under "Subscribe to bot events", add:
  ```
  message.channels
  message.groups
  message.im
  reaction_added
  ```
- Save Changes

- [ ] **Step 8: End-to-end smoke test**

In Accommerce Slack, in any channel, send:
```
Malcolm can you please send the FF invoice to accounting by tomorrow?
```

Expected within 5 seconds:
1. Bot replies in thread: "🎯 Action item detected: [title]..."
2. React ✅ to the bot's message
3. ClickUp task appears in Slack Backlog list
4. Google Sheets row added

- [ ] **Step 9: Test reply_needed flow**

In Accommerce Slack, send a DM to yourself (or have someone @mention you):
```
@Artem what is the current stock level for Jello?
```

Expected within 5 seconds:
1. Bot sends you a DM with draft reply
2. React ✅ → bot posts draft in original channel/thread

- [ ] **Step 10: Final commit**

```bash
git add jello-sc/tools/slack-bot/
git commit -m "feat: complete Jello Slack Intelligence Bot — ready for deploy"
```
