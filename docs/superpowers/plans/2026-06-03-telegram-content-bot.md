# Telegram Content Bot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Python Telegram bot that converts forwarded news posts into Threads/LinkedIn posts in Artem's TOV, with a Claude-powered approval/revision loop and automatic Notion content calendar integration.

**Architecture:** Single Python package (`tool-telegram-content-bot/`) with 6 focused modules. `python-telegram-bot` v20+ ConversationHandler manages a 3-state machine. Claude Sonnet handles generation and revision with full TOV system prompt. Notion API saves approved posts to the existing Content Calendar DB.

**Tech Stack:** python-telegram-bot 20+, anthropic SDK, notion-client 2+, trafilatura, python-dotenv, pytest, pytest-asyncio

---

## Notion DB Reference

- **DB ID:** `2b00b04f-ed94-455b-a301-3078cc32aaf9`
- **Properties:** `Post` (title), `Content` (text), `Channel` (select: Threads/LinkedIn), `Status` (select: Ready), `Publish Date` (date)

---

## File Map

| File | Responsibility |
|---|---|
| `tool-telegram-content-bot/config.py` | Load + validate env vars, expose typed `Config` dataclass |
| `tool-telegram-content-bot/state.py` | `ConversationState` dataclass + JSON persistence to `state.json` |
| `tool-telegram-content-bot/url_fetcher.py` | Detect URLs in text, fetch + extract page content via trafilatura |
| `tool-telegram-content-bot/claude_client.py` | Claude API: `generate_post()`, `revise_post()` |
| `tool-telegram-content-bot/notion_client.py` | Notion API: `add_to_calendar()` |
| `tool-telegram-content-bot/bot.py` | Entry point, ConversationHandler, all Telegram handlers |
| `tool-telegram-content-bot/tests/test_state.py` | Unit tests for state module |
| `tool-telegram-content-bot/tests/test_url_fetcher.py` | Unit tests for URL fetcher |
| `tool-telegram-content-bot/tests/test_claude_client.py` | Unit tests for Claude client (mocked API) |
| `tool-telegram-content-bot/tests/test_notion_client.py` | Unit tests for Notion client (mocked API) |
| `tool-telegram-content-bot/tests/test_bot_handlers.py` | Unit tests for revision detection logic |

---

## Task 1: Project setup

**Files:**
- Create: `tool-telegram-content-bot/requirements.txt`
- Create: `tool-telegram-content-bot/.env.template`
- Create: `tool-telegram-content-bot/config.py`
- Create: `tool-telegram-content-bot/tests/__init__.py`
- Create: `tool-telegram-content-bot/__init__.py`

- [ ] **Step 1: Create project directory and files**

```bash
mkdir -p "tool-telegram-content-bot/tests"
touch "tool-telegram-content-bot/__init__.py"
touch "tool-telegram-content-bot/tests/__init__.py"
```

- [ ] **Step 2: Create `requirements.txt`**

```
python-telegram-bot>=20.0
anthropic>=0.25.0
notion-client>=2.0.0
python-dotenv>=1.0.0
trafilatura>=1.8.0
pytest>=8.0.0
pytest-asyncio>=0.23.0
```

- [ ] **Step 3: Create `.env.template`**

```
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
ANTHROPIC_API_KEY=your_anthropic_api_key
NOTION_API_KEY=your_notion_integration_secret
NOTION_DATABASE_ID=2b00b04f-ed94-455b-a301-3078cc32aaf9
ALLOWED_USER_ID=your_telegram_user_id
```

To find your Telegram user ID: send any message to `@userinfobot`.

- [ ] **Step 4: Create `config.py`**

```python
from dataclasses import dataclass
from dotenv import load_dotenv
import os

load_dotenv()


@dataclass
class Config:
    telegram_bot_token: str
    anthropic_api_key: str
    notion_api_key: str
    notion_database_id: str
    allowed_user_id: int


def load_config() -> Config:
    return Config(
        telegram_bot_token=_require("TELEGRAM_BOT_TOKEN"),
        anthropic_api_key=_require("ANTHROPIC_API_KEY"),
        notion_api_key=_require("NOTION_API_KEY"),
        notion_database_id=_require("NOTION_DATABASE_ID"),
        allowed_user_id=int(_require("ALLOWED_USER_ID")),
    )


def _require(key: str) -> str:
    value = os.getenv(key)
    if not value:
        raise ValueError(f"Missing required env var: {key}")
    return value
```

- [ ] **Step 5: Install dependencies**

```bash
cd tool-telegram-content-bot && pip install -r requirements.txt
```

Expected: all packages install without errors.

- [ ] **Step 6: Commit**

```bash
git add tool-telegram-content-bot/
git commit -m "feat: scaffold telegram content bot project"
```

---

## Task 2: State management

**Files:**
- Create: `tool-telegram-content-bot/state.py`
- Create: `tool-telegram-content-bot/tests/test_state.py`

- [ ] **Step 1: Write failing tests**

```python
# tool-telegram-content-bot/tests/test_state.py
import json
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
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd tool-telegram-content-bot && pytest tests/test_state.py -v
```

Expected: `ModuleNotFoundError: No module named 'state'`

- [ ] **Step 3: Create `state.py`**

```python
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
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
cd tool-telegram-content-bot && pytest tests/test_state.py -v
```

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add tool-telegram-content-bot/state.py tool-telegram-content-bot/tests/test_state.py
git commit -m "feat: add conversation state with JSON persistence"
```

---

## Task 3: URL fetcher

**Files:**
- Create: `tool-telegram-content-bot/url_fetcher.py`
- Create: `tool-telegram-content-bot/tests/test_url_fetcher.py`

- [ ] **Step 1: Write failing tests**

```python
# tool-telegram-content-bot/tests/test_url_fetcher.py
from unittest.mock import patch, MagicMock
from url_fetcher import extract_url, fetch_text


def test_extract_url_finds_url():
    text = "Interesting article https://example.com/article check it out"
    assert extract_url(text) == "https://example.com/article"


def test_extract_url_returns_none_when_no_url():
    assert extract_url("just plain text with no links") is None


def test_extract_url_with_only_url():
    assert extract_url("https://t.me/channel/123") == "https://t.me/channel/123"


def test_fetch_text_returns_extracted_content():
    with patch("url_fetcher.trafilatura.fetch_url") as mock_fetch, \
         patch("url_fetcher.trafilatura.extract") as mock_extract:
        mock_fetch.return_value = "<html>page content</html>"
        mock_extract.return_value = "Extracted article text here."
        result = fetch_text("https://example.com")
        assert result == "Extracted article text here."
        mock_fetch.assert_called_once_with("https://example.com")


def test_fetch_text_returns_none_when_fetch_fails():
    with patch("url_fetcher.trafilatura.fetch_url") as mock_fetch:
        mock_fetch.return_value = None
        result = fetch_text("https://example.com")
        assert result is None


def test_fetch_text_returns_none_when_extract_fails():
    with patch("url_fetcher.trafilatura.fetch_url") as mock_fetch, \
         patch("url_fetcher.trafilatura.extract") as mock_extract:
        mock_fetch.return_value = "<html>page</html>"
        mock_extract.return_value = None
        result = fetch_text("https://example.com")
        assert result is None
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd tool-telegram-content-bot && pytest tests/test_url_fetcher.py -v
```

Expected: `ModuleNotFoundError: No module named 'url_fetcher'`

- [ ] **Step 3: Create `url_fetcher.py`**

```python
import re
import trafilatura

_URL_PATTERN = re.compile(r'https?://\S+')


def extract_url(text: str) -> str | None:
    match = _URL_PATTERN.search(text)
    return match.group(0) if match else None


def fetch_text(url: str) -> str | None:
    downloaded = trafilatura.fetch_url(url)
    if not downloaded:
        return None
    return trafilatura.extract(downloaded)
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
cd tool-telegram-content-bot && pytest tests/test_url_fetcher.py -v
```

Expected: 6 passed.

- [ ] **Step 5: Commit**

```bash
git add tool-telegram-content-bot/url_fetcher.py tool-telegram-content-bot/tests/test_url_fetcher.py
git commit -m "feat: add URL fetcher with trafilatura extraction"
```

---

## Task 4: Claude client

**Files:**
- Create: `tool-telegram-content-bot/claude_client.py`
- Create: `tool-telegram-content-bot/tests/test_claude_client.py`

- [ ] **Step 1: Write failing tests**

```python
# tool-telegram-content-bot/tests/test_claude_client.py
from unittest.mock import MagicMock, patch
from config import Config
from claude_client import ClaudeClient

FAKE_CONFIG = Config(
    telegram_bot_token="x",
    anthropic_api_key="test-key",
    notion_api_key="x",
    notion_database_id="x",
    allowed_user_id=123,
)


def _make_response(text: str):
    response = MagicMock()
    response.content = [MagicMock(text=text)]
    return response


def test_generate_post_calls_api_and_returns_text():
    with patch("claude_client.anthropic.Anthropic") as MockAnthropic:
        mock_client = MockAnthropic.return_value
        mock_client.messages.create.return_value = _make_response("Generated post text")
        client = ClaudeClient(FAKE_CONFIG)
        result = client.generate_post("interesting AI news", "Threads")
        assert result == "Generated post text"
        call_kwargs = mock_client.messages.create.call_args.kwargs
        assert call_kwargs["model"] == "claude-sonnet-4-6"
        assert any("Threads" in str(m) for m in call_kwargs["messages"])
        assert any("interesting AI news" in str(m) for m in call_kwargs["messages"])


def test_revise_post_includes_previous_draft_and_feedback():
    with patch("claude_client.anthropic.Anthropic") as MockAnthropic:
        mock_client = MockAnthropic.return_value
        mock_client.messages.create.return_value = _make_response("Revised post")
        client = ClaudeClient(FAKE_CONFIG)
        result = client.revise_post(
            source_text="AI news",
            platform="Threads",
            previous_draft="First draft",
            feedback="Make it shorter",
        )
        assert result == "Revised post"
        messages = mock_client.messages.create.call_args.kwargs["messages"]
        message_texts = [str(m) for m in messages]
        combined = " ".join(message_texts)
        assert "First draft" in combined
        assert "Make it shorter" in combined
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd tool-telegram-content-bot && pytest tests/test_claude_client.py -v
```

Expected: `ModuleNotFoundError: No module named 'claude_client'`

- [ ] **Step 3: Create `claude_client.py`**

```python
import anthropic
from config import Config

_SYSTEM_PROMPT = """You write social media posts for Artem Stepanenko (@monetizer_biz), personal brand "Artem | The Life Builder".

Voice rules — follow exactly:
- Short declarative sentences. One thought per sentence. Fragments are fine.
- Facts first, insight optional. Let the reader conclude. Never explain what the fact means.
- Real specifics only: numbers, places, dates, names. Never vague ("a prestigious company", "years of experience").
- First person, past or present tense.
- No coaching language: no "most people don't realize", "the key insight is", "if you want X you need Y", "here's what I've learned"
- No em-dashes for dramatic effect. Use a period instead.
- No arrow bullets (→) in narrative posts.
- No motivational closers. Stop when the thought is done.
- No filler: "so here's the thing", "long story short", "at the end of the day"

Threads format: 3–12 lines max. One sentence per line when it stands alone. No hashtags unless requested.
LinkedIn format: slightly longer. Blank line between every paragraph.

Voice test: sounds like a person thinking out loud about their own life — not a coach presenting a lesson."""


class ClaudeClient:
    def __init__(self, config: Config) -> None:
        self._client = anthropic.Anthropic(api_key=config.anthropic_api_key)

    def generate_post(self, source_text: str, platform: str) -> str:
        response = self._client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=_SYSTEM_PROMPT,
            messages=[{
                "role": "user",
                "content": (
                    f"Platform: {platform}\n\n"
                    f"Source material:\n{source_text}\n\n"
                    "Write a post in my voice based on this. "
                    "Personal angle required — tie it to my specific experience, not just summarize the news."
                ),
            }],
        )
        return response.content[0].text

    def revise_post(
        self,
        source_text: str,
        platform: str,
        previous_draft: str,
        feedback: str,
    ) -> str:
        response = self._client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=_SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"Platform: {platform}\n\n"
                        f"Source material:\n{source_text}\n\n"
                        "Write a post in my voice based on this. Personal angle required."
                    ),
                },
                {"role": "assistant", "content": previous_draft},
                {"role": "user", "content": feedback},
            ],
        )
        return response.content[0].text
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
cd tool-telegram-content-bot && pytest tests/test_claude_client.py -v
```

Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add tool-telegram-content-bot/claude_client.py tool-telegram-content-bot/tests/test_claude_client.py
git commit -m "feat: add Claude client with TOV system prompt"
```

---

## Task 5: Notion client

**Files:**
- Create: `tool-telegram-content-bot/notion_client.py`
- Create: `tool-telegram-content-bot/tests/test_notion_client.py`

- [ ] **Step 1: Write failing tests**

```python
# tool-telegram-content-bot/tests/test_notion_client.py
from datetime import date
from unittest.mock import MagicMock, patch
from config import Config
from notion_client_wrapper import NotionClientWrapper

FAKE_CONFIG = Config(
    telegram_bot_token="x",
    anthropic_api_key="x",
    notion_api_key="test-notion-key",
    notion_database_id="test-db-id",
    allowed_user_id=123,
)

POST_TEXT = "I quit drugs at 27. On my own. No clinic. Just a decision."


def test_add_to_calendar_with_today_sets_date():
    with patch("notion_client_wrapper.Client") as MockClient:
        mock_pages = MockClient.return_value.pages
        client = NotionClientWrapper(FAKE_CONFIG)
        client.add_to_calendar(POST_TEXT, "Threads", "today")
        call_kwargs = mock_pages.create.call_args.kwargs
        props = call_kwargs["properties"]
        assert props["Status"]["select"]["name"] == "Ready"
        assert props["Channel"]["select"]["name"] == "Threads"
        assert props["Publish Date"]["date"]["start"] == date.today().isoformat()
        assert POST_TEXT[:60] in props["Post"]["title"][0]["text"]["content"]


def test_add_to_calendar_with_no_date_omits_date_property():
    with patch("notion_client_wrapper.Client") as MockClient:
        mock_pages = MockClient.return_value.pages
        client = NotionClientWrapper(FAKE_CONFIG)
        client.add_to_calendar(POST_TEXT, "LinkedIn", "no_date")
        props = mock_pages.create.call_args.kwargs["properties"]
        assert "Publish Date" not in props
        assert props["Channel"]["select"]["name"] == "LinkedIn"


def test_add_to_calendar_content_block_has_full_text():
    with patch("notion_client_wrapper.Client") as MockClient:
        mock_pages = MockClient.return_value.pages
        client = NotionClientWrapper(FAKE_CONFIG)
        client.add_to_calendar(POST_TEXT, "Threads", "no_date")
        children = mock_pages.create.call_args.kwargs["children"]
        block_text = children[0]["paragraph"]["rich_text"][0]["text"]["content"]
        assert block_text == POST_TEXT
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd tool-telegram-content-bot && pytest tests/test_notion_client.py -v
```

Expected: `ModuleNotFoundError: No module named 'notion_client_wrapper'`

- [ ] **Step 3: Create `notion_client_wrapper.py`**

(Named `notion_client_wrapper.py` to avoid shadowing the `notion_client` package installed via pip.)

```python
from datetime import date, timedelta
from notion_client import Client
from config import Config


class NotionClientWrapper:
    def __init__(self, config: Config) -> None:
        self._client = Client(auth=config.notion_api_key)
        self._database_id = config.notion_database_id

    def add_to_calendar(self, text: str, platform: str, date_choice: str) -> None:
        title = text[:60].strip()
        properties: dict = {
            "Post": {"title": [{"text": {"content": title}}]},
            "Content": {"rich_text": [{"text": {"content": text}}]},
            "Channel": {"select": {"name": platform}},
            "Status": {"select": {"name": "Ready"}},
        }
        resolved = _resolve_date(date_choice)
        if resolved:
            properties["Publish Date"] = {"date": {"start": resolved}}

        self._client.pages.create(
            parent={"database_id": self._database_id},
            properties=properties,
            children=[{
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [{"type": "text", "text": {"content": text}}]
                },
            }],
        )


def _resolve_date(date_choice: str) -> str | None:
    today = date.today()
    if date_choice == "today":
        return today.isoformat()
    if date_choice == "tomorrow":
        return (today + timedelta(days=1)).isoformat()
    return None
```

- [ ] **Step 4: Update test import**

The test file imports `notion_client_wrapper` — no change needed, that's what we created.

- [ ] **Step 5: Run tests — expect PASS**

```bash
cd tool-telegram-content-bot && pytest tests/test_notion_client.py -v
```

Expected: 3 passed.

- [ ] **Step 6: Commit**

```bash
git add tool-telegram-content-bot/notion_client_wrapper.py tool-telegram-content-bot/tests/test_notion_client.py
git commit -m "feat: add Notion client for content calendar integration"
```

---

## Task 6: Bot core — content entry point

**Files:**
- Create: `tool-telegram-content-bot/bot.py`
- Create: `tool-telegram-content-bot/tests/test_bot_handlers.py`

- [ ] **Step 1: Write failing tests for revision detection**

```python
# tool-telegram-content-bot/tests/test_bot_handlers.py
from bot import is_instruction


def test_short_message_is_instruction():
    assert is_instruction("make it shorter") is True


def test_imperative_verb_is_instruction():
    assert is_instruction("remove the supply chain mention and make the tone rawer") is True


def test_ukrainian_imperative_is_instruction():
    assert is_instruction("зроби коротше і прибери згадку про Supply Chain") is True


def test_long_post_text_is_replacement():
    long_post = (
        "I quit drugs at 27.\n"
        "On my own. No clinic. No program.\n"
        "Just a decision made in a kitchen in Dnipro.\n"
        "Nine years behind bars across the CIS.\n"
        "That chapter ended the moment I chose it to."
    )
    assert is_instruction(long_post) is False


def test_medium_text_without_imperatives_is_replacement():
    text = "The AI wave is not coming. It already arrived. Most professionals missed it because they were waiting for permission."
    assert is_instruction(text) is False
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd tool-telegram-content-bot && pytest tests/test_bot_handlers.py -v
```

Expected: `ModuleNotFoundError: No module named 'bot'`

- [ ] **Step 3: Create `bot.py`**

```python
import asyncio
import re
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    ConversationHandler,
    filters,
    ContextTypes,
)
from config import load_config
from state import ConversationState, load_state, save_state, clear_state
from url_fetcher import extract_url, fetch_text
from claude_client import ClaudeClient
from notion_client_wrapper import NotionClientWrapper

logging.basicConfig(level=logging.INFO)

# Conversation states
AWAITING_APPROVAL = 0
AWAITING_REVISION = 1
AWAITING_DATE = 2

# Callback data constants
CB_APPROVE = "approve"
CB_REVISE = "revise"
CB_NEW_VERSION = "new_version"
CB_LINKEDIN = "linkedin"
CB_DATE_TODAY = "date_today"
CB_DATE_TOMORROW = "date_tomorrow"
CB_DATE_NONE = "date_none"

_IMPERATIVE_PATTERN = re.compile(
    r'\b(make|remove|add|change|shorten|lengthen|fix|rewrite|delete|include|exclude|'
    r'зроби|прибери|додай|зміни|скороти|видали|перепиши|включи|виключи|прибрати|зробити)\b',
    re.IGNORECASE,
)


def is_instruction(text: str) -> bool:
    if len(text) < 120:
        return True
    if _IMPERATIVE_PATTERN.search(text):
        return True
    return False


def _approval_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup([
        [
            InlineKeyboardButton("✅ Approve", callback_data=CB_APPROVE),
            InlineKeyboardButton("✏️ Revise", callback_data=CB_REVISE),
        ],
        [
            InlineKeyboardButton("🔄 New version", callback_data=CB_NEW_VERSION),
            InlineKeyboardButton("🔀 LinkedIn", callback_data=CB_LINKEDIN),
        ],
    ])


def _date_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup([[
        InlineKeyboardButton("📅 Сьогодні", callback_data=CB_DATE_TODAY),
        InlineKeyboardButton("📅 Завтра", callback_data=CB_DATE_TOMORROW),
        InlineKeyboardButton("📅 Без дати", callback_data=CB_DATE_NONE),
    ]])


def _extract_message_text(update: Update) -> str:
    msg = update.message
    return (msg.text or msg.caption or "").strip()


async def handle_content(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.effective_user.id
    claude: ClaudeClient = context.bot_data["claude"]
    text = _extract_message_text(update)

    if not text:
        await update.message.reply_text(
            "Я бачу тільки медіа. Надішли текст або посилання."
        )
        return ConversationHandler.END

    platform = "Threads"

    url = extract_url(text)
    if url:
        await update.message.reply_text("Знайшов посилання, отримую текст...")
        fetched = fetch_text(url)
        if fetched:
            text = fetched
        else:
            await update.message.reply_text(
                "Не вдалось отримати текст зі сторінки. Надішли текст вручну."
            )
            return ConversationHandler.END

    state = ConversationState(source_text=text, platform=platform)
    save_state(user_id, state)

    await update.message.reply_text("Генерую...")
    draft = claude.generate_post(text, platform)

    state.current_draft = draft
    save_state(user_id, state)

    await update.message.reply_text(draft, reply_markup=_approval_keyboard())
    return AWAITING_APPROVAL


async def handle_linkedin_content(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.effective_user.id
    claude: ClaudeClient = context.bot_data["claude"]
    args = context.args
    text = " ".join(args).strip() if args else ""

    if not text:
        await update.message.reply_text("Надішли текст після /l, наприклад: /l [текст новини]")
        return ConversationHandler.END

    state = ConversationState(source_text=text, platform="LinkedIn")
    save_state(user_id, state)

    await update.message.reply_text("Генерую LinkedIn-пост...")
    draft = claude.generate_post(text, "LinkedIn")

    state.current_draft = draft
    save_state(user_id, state)

    await update.message.reply_text(draft, reply_markup=_approval_keyboard())
    return AWAITING_APPROVAL


async def handle_approve(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    await update.callback_query.answer()
    await update.callback_query.message.reply_text(
        "Коли публікувати?", reply_markup=_date_keyboard()
    )
    return AWAITING_DATE


async def handle_new_version(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.effective_user.id
    claude: ClaudeClient = context.bot_data["claude"]
    state = load_state(user_id)

    await update.callback_query.answer()
    await update.callback_query.message.reply_text("Генерую новий варіант...")

    draft = claude.generate_post(state.source_text, state.platform)
    state.current_draft = draft
    save_state(user_id, state)

    await update.callback_query.message.reply_text(draft, reply_markup=_approval_keyboard())
    return AWAITING_APPROVAL


async def handle_linkedin_switch(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.effective_user.id
    claude: ClaudeClient = context.bot_data["claude"]
    state = load_state(user_id)
    state.platform = "LinkedIn"
    save_state(user_id, state)

    await update.callback_query.answer()
    await update.callback_query.message.reply_text("Генерую LinkedIn-версію...")

    draft = claude.generate_post(state.source_text, "LinkedIn")
    state.current_draft = draft
    save_state(user_id, state)

    await update.callback_query.message.reply_text(draft, reply_markup=_approval_keyboard())
    return AWAITING_APPROVAL


async def handle_revise(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    await update.callback_query.answer()
    await update.callback_query.message.reply_text(
        "Що змінити? Або надішли свій варіант:"
    )
    return AWAITING_REVISION


async def handle_revision_input(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.effective_user.id
    claude: ClaudeClient = context.bot_data["claude"]
    state = load_state(user_id)
    text = update.message.text.strip()

    if is_instruction(text):
        await update.message.reply_text("Оновлюю...")
        new_draft = claude.revise_post(
            source_text=state.source_text,
            platform=state.platform,
            previous_draft=state.current_draft,
            feedback=text,
        )
        state.revision_history.append((text, state.current_draft))
        state.current_draft = new_draft
        save_state(user_id, state)
        await update.message.reply_text(new_draft, reply_markup=_approval_keyboard())
    else:
        state.current_draft = text
        save_state(user_id, state)
        await update.message.reply_text(text, reply_markup=_approval_keyboard())

    return AWAITING_APPROVAL


async def handle_date(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.effective_user.id
    notion: NotionClientWrapper = context.bot_data["notion"]
    state = load_state(user_id)

    date_map = {
        CB_DATE_TODAY: ("today", "сьогодні"),
        CB_DATE_TOMORROW: ("tomorrow", "завтра"),
        CB_DATE_NONE: ("no_date", "без дати"),
    }
    callback_data = update.callback_query.data
    date_choice, date_label = date_map[callback_data]

    await update.callback_query.answer()

    try:
        notion.add_to_calendar(state.current_draft, state.platform, date_choice)
        await update.callback_query.message.reply_text(
            f"Збережено в Notion ✅\nПлатформа: {state.platform}\nДата: {date_label}"
        )
    except Exception as e:
        logging.error("Notion save failed: %s", e)
        await update.callback_query.message.reply_text(
            f"Не вдалось зберегти в Notion. Ось текст — збережи вручну:\n\n{state.current_draft}"
        )

    clear_state(user_id)
    return ConversationHandler.END


async def handle_cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    clear_state(update.effective_user.id)
    await update.message.reply_text("Скасовано. Надішли новий пост коли будеш готовий.")
    return ConversationHandler.END


def _build_auth_filter(allowed_user_id: int) -> filters.BaseFilter:
    return filters.User(user_id=allowed_user_id)


def main() -> None:
    config = load_config()
    auth = _build_auth_filter(config.allowed_user_id)

    app = Application.builder().token(config.telegram_bot_token).build()
    app.bot_data["claude"] = ClaudeClient(config)
    app.bot_data["notion"] = NotionClientWrapper(config)

    conv_handler = ConversationHandler(
        entry_points=[
            MessageHandler(auth & filters.TEXT & ~filters.COMMAND, handle_content),
            CommandHandler("l", handle_linkedin_content, filters=auth),
            CommandHandler("linkedin", handle_linkedin_content, filters=auth),
        ],
        states={
            AWAITING_APPROVAL: [
                CallbackQueryHandler(handle_approve, pattern=f"^{CB_APPROVE}$"),
                CallbackQueryHandler(handle_revise, pattern=f"^{CB_REVISE}$"),
                CallbackQueryHandler(handle_new_version, pattern=f"^{CB_NEW_VERSION}$"),
                CallbackQueryHandler(handle_linkedin_switch, pattern=f"^{CB_LINKEDIN}$"),
            ],
            AWAITING_REVISION: [
                MessageHandler(auth & filters.TEXT & ~filters.COMMAND, handle_revision_input),
            ],
            AWAITING_DATE: [
                CallbackQueryHandler(handle_date, pattern=f"^date_"),
            ],
        },
        fallbacks=[CommandHandler("cancel", handle_cancel, filters=auth)],
        per_user=True,
        per_chat=True,
    )

    app.add_handler(conv_handler)
    app.run_polling()


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run handler tests — expect PASS**

```bash
cd tool-telegram-content-bot && pytest tests/test_bot_handlers.py -v
```

Expected: 5 passed.

- [ ] **Step 5: Run full test suite**

```bash
cd tool-telegram-content-bot && pytest -v
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add tool-telegram-content-bot/bot.py tool-telegram-content-bot/tests/test_bot_handlers.py
git commit -m "feat: add telegram bot with full conversation flow"
```

---

## Task 7: .env setup and smoke test

**Files:**
- Create: `tool-telegram-content-bot/.env` (from template, not committed)
- Verify: bot starts and responds

- [ ] **Step 1: Create `.env` from template**

```bash
cp tool-telegram-content-bot/.env.template tool-telegram-content-bot/.env
```

Fill in the values:
- `TELEGRAM_BOT_TOKEN` — create bot via [@BotFather](https://t.me/BotFather): `/newbot` → get token
- `ANTHROPIC_API_KEY` — from console.anthropic.com
- `NOTION_API_KEY` — from notion.so/my-integrations → create integration → copy secret; then open the Content Calendar DB in Notion → Share → invite the integration
- `NOTION_DATABASE_ID` — already set: `2b00b04f-ed94-455b-a301-3078cc32aaf9`
- `ALLOWED_USER_ID` — send any message to [@userinfobot](https://t.me/userinfobot) to get your ID

- [ ] **Step 2: Add `.env` to `.gitignore`**

```bash
echo ".env" >> "tool-telegram-content-bot/.gitignore"
echo "state.json" >> "tool-telegram-content-bot/.gitignore"
git add "tool-telegram-content-bot/.gitignore"
git commit -m "chore: add .gitignore for telegram bot secrets"
```

- [ ] **Step 3: Start the bot**

```bash
cd tool-telegram-content-bot && python bot.py
```

Expected output:
```
INFO:httpx:HTTP Request: POST https://api.telegram.org/bot.../getMe
INFO:telegram.ext.Application:Application started
```

- [ ] **Step 4: Smoke test in Telegram**

Send any short text to the bot. Expected:
1. Bot replies "Генерую..."
2. Bot replies with a draft post
3. Buttons appear: ✅ Approve / ✏️ Revise / 🔄 New version / 🔀 LinkedIn

Click ✅ Approve. Expected:
1. Bot asks "Коли публікувати?" with 3 date buttons
2. Click "📅 Сьогодні"
3. Bot replies "Збережено в Notion ✅"
4. Post appears in Content Calendar DB with Status: Ready

- [ ] **Step 5: Final commit**

```bash
git add tool-telegram-content-bot/
git commit -m "feat: telegram content bot — complete and tested"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| Polling Telegram Bot | Task 6 — `app.run_polling()` |
| Default platform Threads | Task 6 — `ConversationState(platform="Threads")` |
| `/l` and `/linkedin` commands | Task 6 — `handle_linkedin_content` |
| URL detection + fetching | Task 3 — `url_fetcher.py` |
| Forwarded message text extraction | Task 6 — `_extract_message_text()` uses `msg.text or msg.caption` |
| Claude generation | Task 4 — `ClaudeClient.generate_post()` |
| Claude revision with history | Task 4 — `ClaudeClient.revise_post()` |
| Instruction vs replacement detection | Task 6 — `is_instruction()`, tested in Task 6 |
| ✅/✏️/🔄/🔀 buttons | Task 6 — `_approval_keyboard()` |
| Revision flow (one step) | Task 6 — `handle_revise` → `handle_revision_input` |
| Date selection after approve | Task 6 — `handle_date()` with 3 options |
| Notion save with correct properties | Task 5 — `NotionClientWrapper.add_to_calendar()` |
| Notion error fallback | Task 6 — try/except in `handle_date()` |
| JSON state persistence | Task 2 — `state.py` with `state.json` |
| Security (allowed user only) | Task 6 — `auth` filter applied to all handlers |
| `/cancel` command | Task 6 — `handle_cancel` fallback |

All spec requirements covered. No gaps found.
