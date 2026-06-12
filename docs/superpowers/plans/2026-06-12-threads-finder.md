# Threads Client Finder — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a two-component system that automatically finds potential clients on Threads by keyword, posts personalized replies, monitors responses, and notifies Artem via Telegram so he can reply with one tap.

**Architecture:** `searcher.py` runs via cron every 5 min — searches keywords from Google Sheets, generates replies via Claude, posts them, and logs to Sheets. `bot.py` runs as a persistent async daemon — polls for replies to our comments and forwards them to Artem via Telegram; Artem's Telegram reply auto-publishes to Threads.

**Tech Stack:** Python 3.11+, `anthropic`, `gspread`, `python-telegram-bot>=21`, `requests`, `python-dotenv`, `pytest`, `pytest-asyncio`, `pytest-mock`

---

## File Map

```
tool-threads-finder/
  config.py             — env loading, Config dataclass
  threads_client.py     — Threads API: search(), reply(), get_replies()
  sheets_client.py      — Sheets I/O: keywords, Log, Reply Map
  claude_client.py      — Claude API: generate_reply()
  searcher.py           — cron script: full search→filter→reply→log flow
  bot.py                — async daemon: Threads monitor + Telegram listener
  setup_sheets.py       — one-time: creates tabs + adds initial keywords
  .env.template         — env var template
  requirements.txt
  tests/
    test_config.py
    test_threads_client.py
    test_sheets_client.py
    test_claude_client.py
    test_searcher.py
    test_bot.py
```

---

## Task 1: Project Setup + config.py

**Files:**
- Create: `tool-threads-finder/` (directory)
- Create: `tool-threads-finder/requirements.txt`
- Create: `tool-threads-finder/.env.template`
- Create: `tool-threads-finder/config.py`
- Create: `tool-threads-finder/tests/test_config.py`

- [ ] **Step 1: Create directory and requirements.txt**

```bash
mkdir -p "/Users/artem/Claude v 1.0/tool-threads-finder/tests"
```

```
# tool-threads-finder/requirements.txt
anthropic>=0.28.0
gspread>=6.1.4
python-dotenv>=1.0.1
python-telegram-bot>=21.0
requests>=2.31.0
pytest>=8.0.0
pytest-asyncio>=0.23.0
pytest-mock>=3.12.0
```

- [ ] **Step 2: Create .env.template**

```
# tool-threads-finder/.env.template
THREADS_ACCESS_TOKEN=
ANTHROPIC_API_KEY=
GOOGLE_SHEETS_ID=
GOOGLE_CREDENTIALS_JSON=credentials.json
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

- [ ] **Step 3: Write failing test**

```python
# tests/test_config.py
import pytest
from unittest.mock import patch
import os

def test_load_config_raises_on_missing_vars():
    with patch.dict(os.environ, {}, clear=True):
        from config import load_config
        with pytest.raises(ValueError, match="Missing env vars"):
            load_config()

def test_load_config_returns_config():
    env = {
        'THREADS_ACCESS_TOKEN': 'tok',
        'ANTHROPIC_API_KEY': 'key',
        'GOOGLE_SHEETS_ID': 'sheetid',
        'TELEGRAM_BOT_TOKEN': 'bottoken',
        'TELEGRAM_CHAT_ID': '12345',
    }
    with patch.dict(os.environ, env, clear=True):
        from config import load_config
        cfg = load_config()
        assert cfg.threads_token == 'tok'
        assert cfg.anthropic_key == 'key'
        assert cfg.sheets_id == 'sheetid'
        assert cfg.credentials_path == 'credentials.json'
        assert cfg.telegram_bot_token == 'bottoken'
        assert cfg.telegram_chat_id == '12345'
```

- [ ] **Step 4: Run test to verify it fails**

```bash
cd "/Users/artem/Claude v 1.0/tool-threads-finder"
pip install -r requirements.txt -q
pytest tests/test_config.py -v
```

Expected: `ModuleNotFoundError: No module named 'config'`

- [ ] **Step 5: Write config.py**

```python
# config.py
import os
from dataclasses import dataclass
from dotenv import load_dotenv

@dataclass
class Config:
    threads_token: str
    anthropic_key: str
    sheets_id: str
    credentials_path: str
    telegram_bot_token: str
    telegram_chat_id: str

_REQUIRED = ['THREADS_ACCESS_TOKEN', 'ANTHROPIC_API_KEY', 'GOOGLE_SHEETS_ID',
             'TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID']

def load_config() -> Config:
    load_dotenv()
    missing = [k for k in _REQUIRED if not os.getenv(k)]
    if missing:
        raise ValueError(f"Missing env vars: {', '.join(missing)}")
    return Config(
        threads_token=os.environ['THREADS_ACCESS_TOKEN'],
        anthropic_key=os.environ['ANTHROPIC_API_KEY'],
        sheets_id=os.environ['GOOGLE_SHEETS_ID'],
        credentials_path=os.getenv('GOOGLE_CREDENTIALS_JSON', 'credentials.json'),
        telegram_bot_token=os.environ['TELEGRAM_BOT_TOKEN'],
        telegram_chat_id=os.environ['TELEGRAM_CHAT_ID'],
    )
```

- [ ] **Step 6: Run test to verify it passes**

```bash
pytest tests/test_config.py -v
```

Expected: `2 passed`

- [ ] **Step 7: Commit**

```bash
cd "/Users/artem/Claude v 1.0"
git add tool-threads-finder/
git commit -m "feat: threads-finder project setup and config"
```

---

## Task 2: threads_client.py

**Files:**
- Create: `tool-threads-finder/threads_client.py`
- Create: `tool-threads-finder/tests/test_threads_client.py`

> **Note:** The exact keyword search endpoint must be verified against the live Threads API during this task. Expected: `GET https://graph.threads.net/v1.0/threads/keyword_search?q={keyword}&fields=id,text,timestamp,username,permalink`. If this returns 404, check Meta's Threads Platform docs for the current path.

- [ ] **Step 1: Write failing tests**

```python
# tests/test_threads_client.py
import pytest
from unittest.mock import patch, Mock
from threads_client import ThreadsClient, ThreadsAPIError, ThreadsAuthError

TOKEN = 'test-token'

def make_client():
    return ThreadsClient(TOKEN)

def test_search_returns_posts(requests_mock):
    requests_mock.get(
        'https://graph.threads.net/v1.0/threads/keyword_search',
        json={'data': [
            {'id': 'p1', 'text': 'обробляю інвойси вручну щодня', 'timestamp': '2026-06-12T10:00:00Z', 'username': 'user1'},
        ]}
    )
    client = make_client()
    posts = client.search('обробляю інвойси вручну')
    assert len(posts) == 1
    assert posts[0]['id'] == 'p1'

def test_search_returns_empty_on_no_results(requests_mock):
    requests_mock.get(
        'https://graph.threads.net/v1.0/threads/keyword_search',
        json={'data': []}
    )
    posts = make_client().search('xyz')
    assert posts == []

def test_search_raises_on_401(requests_mock):
    requests_mock.get(
        'https://graph.threads.net/v1.0/threads/keyword_search',
        status_code=401, json={}
    )
    with pytest.raises(ThreadsAuthError):
        make_client().search('keyword')

def test_search_raises_on_api_error(requests_mock):
    requests_mock.get(
        'https://graph.threads.net/v1.0/threads/keyword_search',
        status_code=500, text='error'
    )
    with pytest.raises(ThreadsAPIError):
        make_client().search('keyword')

def test_reply_returns_id(requests_mock):
    requests_mock.post('https://graph.threads.net/v1.0/me/threads', json={'id': 'container1'})
    requests_mock.post('https://graph.threads.net/v1.0/me/threads_publish', json={'id': 'reply1'})
    with patch('threads_client.time.sleep'):
        result = make_client().reply('post1', 'Відповідь тут')
    assert result == 'reply1'

def test_get_replies_returns_list(requests_mock):
    requests_mock.get(
        'https://graph.threads.net/v1.0/our_reply_123/replies',
        json={'data': [
            {'id': 'c1', 'text': 'Цікаво, розкажіть більше', 'username': 'user2', 'timestamp': '2026-06-12T11:00:00Z'}
        ]}
    )
    replies = make_client().get_replies('our_reply_123')
    assert len(replies) == 1
    assert replies[0]['id'] == 'c1'
```

> Install `requests-mock` for these tests: add `requests-mock>=1.11.0` to requirements.txt.

- [ ] **Step 2: Add requests-mock to requirements.txt**

```
# append to requirements.txt
requests-mock>=1.11.0
```

```bash
pip install requests-mock -q
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
pytest tests/test_threads_client.py -v
```

Expected: `ModuleNotFoundError: No module named 'threads_client'`

- [ ] **Step 4: Write threads_client.py**

```python
# threads_client.py
import time
import requests

BASE_URL = "https://graph.threads.net/v1.0"
CONTAINER_READY_DELAY = 5


class ThreadsAuthError(Exception):
    pass


class ThreadsAPIError(Exception):
    pass


class ThreadsClient:
    def __init__(self, access_token: str):
        self._token = access_token

    def search(self, keyword: str) -> list[dict]:
        """Search public posts by keyword."""
        resp = requests.get(
            f"{BASE_URL}/threads/keyword_search",
            params={
                "q": keyword,
                "fields": "id,text,timestamp,username,permalink",
                "access_token": self._token,
            },
        )
        self._check(resp)
        return resp.json().get("data", [])

    def reply(self, post_id: str, text: str) -> str:
        """Post a reply to a thread. Returns our reply ID."""
        resp = requests.post(
            f"{BASE_URL}/me/threads",
            params={
                "media_type": "TEXT",
                "text": text,
                "reply_to_id": post_id,
                "access_token": self._token,
            },
        )
        self._check(resp)
        creation_id = resp.json()["id"]
        time.sleep(CONTAINER_READY_DELAY)
        pub = requests.post(
            f"{BASE_URL}/me/threads_publish",
            params={"creation_id": creation_id, "access_token": self._token},
        )
        self._check(pub)
        return pub.json()["id"]

    def get_replies(self, thread_id: str) -> list[dict]:
        """Get replies to one of our comments."""
        resp = requests.get(
            f"{BASE_URL}/{thread_id}/replies",
            params={
                "fields": "id,text,timestamp,username",
                "access_token": self._token,
            },
        )
        self._check(resp)
        return resp.json().get("data", [])

    def _check(self, resp: requests.Response) -> None:
        if resp.status_code == 401:
            raise ThreadsAuthError("Access token expired or invalid")
        if not resp.ok:
            raise ThreadsAPIError(f"API error {resp.status_code}: {resp.text}")
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
pytest tests/test_threads_client.py -v
```

Expected: `6 passed`

- [ ] **Step 6: Commit**

```bash
cd "/Users/artem/Claude v 1.0"
git add tool-threads-finder/
git commit -m "feat: threads client — search, reply, get_replies"
```

---

## Task 3: sheets_client.py

**Files:**
- Create: `tool-threads-finder/sheets_client.py`
- Create: `tool-threads-finder/tests/test_sheets_client.py`

- [ ] **Step 1: Write failing tests**

```python
# tests/test_sheets_client.py
import pytest
from unittest.mock import MagicMock, patch, call
from datetime import datetime, timezone, timedelta

@pytest.fixture
def mock_ss():
    ss = MagicMock()
    log_ws = MagicMock()
    log_ws.title = 'Log'
    reply_map_ws = MagicMock()
    reply_map_ws.title = 'Reply Map'
    sales_ws = MagicMock()
    sales_ws.title = 'Sales & Marketing'
    ss.worksheets.return_value = [sales_ws, log_ws, reply_map_ws]
    ss.worksheet.side_effect = lambda name: {
        'Log': log_ws, 'Reply Map': reply_map_ws, 'Sales & Marketing': sales_ws
    }[name]
    return ss, log_ws, reply_map_ws, sales_ws

def test_keyword_tabs_returns_active_keywords(mock_ss):
    ss, log_ws, reply_map_ws, sales_ws = mock_ss
    sales_ws.get_all_records.return_value = [
        {'keyword': 'збираю ліди вручну', 'active': 'TRUE'},
        {'keyword': 'CRM вручну', 'active': 'FALSE'},
    ]
    with patch('sheets_client.gspread.service_account', return_value=MagicMock(open_by_key=lambda k: ss)):
        from sheets_client import SheetsClient
        client = SheetsClient('sheet_id', 'creds.json')
        tabs = client.keyword_tabs()
    assert len(tabs) == 1
    assert tabs[0][0] == 'Sales & Marketing'
    assert tabs[0][1] == ['збираю ліди вручну']

def test_seen_ids_filters_to_30_days(mock_ss):
    ss, log_ws, reply_map_ws, sales_ws = mock_ss
    old = (datetime.now(timezone.utc) - timedelta(days=31)).isoformat()
    recent = datetime.now(timezone.utc).isoformat()
    log_ws.get_all_records.return_value = [
        {'post_id': 'old1', 'timestamp': old},
        {'post_id': 'new1', 'timestamp': recent},
    ]
    with patch('sheets_client.gspread.service_account', return_value=MagicMock(open_by_key=lambda k: ss)):
        from sheets_client import SheetsClient
        client = SheetsClient('sheet_id', 'creds.json')
        seen = client.seen_ids()
    assert 'new1' in seen
    assert 'old1' not in seen

def test_replies_today_counts_only_today(mock_ss):
    ss, log_ws, reply_map_ws, sales_ws = mock_ss
    today = datetime.now(timezone.utc).date().isoformat()
    yesterday = (datetime.now(timezone.utc) - timedelta(days=1)).date().isoformat()
    log_ws.get_all_records.return_value = [
        {'timestamp': f'{today}T10:00:00+00:00', 'post_id': 'p1'},
        {'timestamp': f'{today}T11:00:00+00:00', 'post_id': 'p2'},
        {'timestamp': f'{yesterday}T10:00:00+00:00', 'post_id': 'p3'},
    ]
    with patch('sheets_client.gspread.service_account', return_value=MagicMock(open_by_key=lambda k: ss)):
        from sheets_client import SheetsClient
        client = SheetsClient('sheet_id', 'creds.json')
        assert client.replies_today() == 2

def test_find_their_comment_id_returns_match(mock_ss):
    ss, log_ws, reply_map_ws, sales_ws = mock_ss
    reply_map_ws.get_all_records.return_value = [
        {'telegram_msg_id': '999', 'their_comment_id': 'tc_abc'},
    ]
    with patch('sheets_client.gspread.service_account', return_value=MagicMock(open_by_key=lambda k: ss)):
        from sheets_client import SheetsClient
        client = SheetsClient('sheet_id', 'creds.json')
        result = client.find_their_comment_id('999')
    assert result == 'tc_abc'

def test_find_their_comment_id_returns_none_on_miss(mock_ss):
    ss, log_ws, reply_map_ws, sales_ws = mock_ss
    reply_map_ws.get_all_records.return_value = []
    with patch('sheets_client.gspread.service_account', return_value=MagicMock(open_by_key=lambda k: ss)):
        from sheets_client import SheetsClient
        client = SheetsClient('sheet_id', 'creds.json')
        assert client.find_their_comment_id('999') is None
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pytest tests/test_sheets_client.py -v
```

Expected: `ModuleNotFoundError: No module named 'sheets_client'`

- [ ] **Step 3: Write sheets_client.py**

```python
# sheets_client.py
from datetime import datetime, timezone, timedelta
import gspread

LOG_COLUMNS = ['timestamp', 'segment', 'keyword', 'post_id', 'post_text', 'our_reply_id', 'our_reply_text']
REPLY_MAP_COLUMNS = ['timestamp', 'our_reply_id', 'their_comment_id', 'commenter', 'comment_text', 'telegram_msg_id', 'status']
RESERVED_TABS = {'Log', 'Reply Map'}


class SheetsClient:
    def __init__(self, spreadsheet_id: str, credentials_path: str):
        gc = gspread.service_account(filename=credentials_path)
        self._ss = gc.open_by_key(spreadsheet_id)

    def keyword_tabs(self) -> list[tuple[str, list[str]]]:
        """Returns [(segment_name, [active_keywords])] for all non-reserved tabs."""
        result = []
        for ws in self._ss.worksheets():
            if ws.title in RESERVED_TABS:
                continue
            rows = ws.get_all_records()
            keywords = [r['keyword'] for r in rows if str(r.get('active', '')).upper() == 'TRUE']
            if keywords:
                result.append((ws.title, keywords))
        return result

    def seen_ids(self) -> set[str]:
        """Post IDs from the last 30 days."""
        cutoff = (datetime.now(timezone.utc) - timedelta(days=30)).isoformat()
        rows = self._get_or_create('Log', LOG_COLUMNS).get_all_records()
        return {r['post_id'] for r in rows if r.get('timestamp', '') >= cutoff}

    def replies_today(self) -> int:
        today = datetime.now(timezone.utc).date().isoformat()
        rows = self._get_or_create('Log', LOG_COLUMNS).get_all_records()
        return sum(1 for r in rows if r.get('timestamp', '').startswith(today))

    def append_log(self, segment: str, keyword: str, post_id: str,
                   post_text: str, our_reply_id: str, our_reply_text: str) -> None:
        ws = self._get_or_create('Log', LOG_COLUMNS)
        ws.append_row([
            datetime.now(timezone.utc).isoformat(),
            segment, keyword, post_id, post_text, our_reply_id, our_reply_text,
        ])

    def our_reply_ids_last_7_days(self) -> list[str]:
        cutoff = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
        rows = self._get_or_create('Log', LOG_COLUMNS).get_all_records()
        return [r['our_reply_id'] for r in rows
                if r.get('timestamp', '') >= cutoff and r.get('our_reply_id')]

    def known_their_comment_ids(self) -> set[str]:
        rows = self._get_or_create('Reply Map', REPLY_MAP_COLUMNS).get_all_records()
        return {r['their_comment_id'] for r in rows if r.get('their_comment_id')}

    def append_reply_map(self, our_reply_id: str, their_comment_id: str,
                         commenter: str, comment_text: str, telegram_msg_id: int) -> None:
        ws = self._get_or_create('Reply Map', REPLY_MAP_COLUMNS)
        ws.append_row([
            datetime.now(timezone.utc).isoformat(),
            our_reply_id, their_comment_id, commenter, comment_text,
            str(telegram_msg_id), 'pending',
        ])

    def find_their_comment_id(self, telegram_msg_id: str) -> str | None:
        rows = self._get_or_create('Reply Map', REPLY_MAP_COLUMNS).get_all_records()
        for r in rows:
            if str(r.get('telegram_msg_id', '')) == str(telegram_msg_id):
                return r.get('their_comment_id')
        return None

    def update_reply_map_status(self, telegram_msg_id: str, status: str) -> None:
        ws = self._get_or_create('Reply Map', REPLY_MAP_COLUMNS)
        rows = ws.get_all_records()
        for i, r in enumerate(rows, start=2):
            if str(r.get('telegram_msg_id', '')) == str(telegram_msg_id):
                col_idx = REPLY_MAP_COLUMNS.index('status') + 1
                ws.update_cell(i, col_idx, status)
                return

    def _get_or_create(self, name: str, columns: list[str]):
        try:
            return self._ss.worksheet(name)
        except gspread.WorksheetNotFound:
            ws = self._ss.add_worksheet(name, rows=1000, cols=len(columns))
            ws.append_row(columns)
            return ws
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pytest tests/test_sheets_client.py -v
```

Expected: `5 passed`

- [ ] **Step 5: Commit**

```bash
cd "/Users/artem/Claude v 1.0"
git add tool-threads-finder/
git commit -m "feat: sheets client — keywords, log, reply map"
```

---

## Task 4: claude_client.py

**Files:**
- Create: `tool-threads-finder/claude_client.py`
- Create: `tool-threads-finder/tests/test_claude_client.py`

- [ ] **Step 1: Write failing tests**

```python
# tests/test_claude_client.py
import pytest
from unittest.mock import MagicMock, patch

def make_mock_response(text: str):
    msg = MagicMock()
    msg.content = [MagicMock(text=text)]
    return msg

def test_generate_reply_returns_string():
    with patch('claude_client.anthropic.Anthropic') as mock_cls:
        mock_cls.return_value.messages.create.return_value = make_mock_response('Це класика. Ми автоматизували такий процес — інвойси парсяться агентом, йдуть в таблицю. Як це виглядало у вас?')
        from claude_client import ClaudeClient
        client = ClaudeClient('test-key')
        result = client.generate_reply('Ops & Finance', 'обробляю інвойси вручну кожен день')
    assert isinstance(result, str)
    assert len(result) > 0

def test_generate_reply_truncates_over_280_chars():
    long_text = 'А ' * 200  # 400 chars
    with patch('claude_client.anthropic.Anthropic') as mock_cls:
        mock_cls.return_value.messages.create.return_value = make_mock_response(long_text)
        from claude_client import ClaudeClient
        client = ClaudeClient('test-key')
        result = client.generate_reply('Owners', 'test post')
    assert len(result) <= 280

def test_generate_reply_passes_segment_and_post_to_claude():
    with patch('claude_client.anthropic.Anthropic') as mock_cls:
        mock_instance = mock_cls.return_value
        mock_instance.messages.create.return_value = make_mock_response('ok')
        from claude_client import ClaudeClient
        ClaudeClient('key').generate_reply('HR & Legal', 'переглядаю резюме вручну')
        call_kwargs = mock_instance.messages.create.call_args
        user_content = call_kwargs.kwargs['messages'][0]['content']
    assert 'HR & Legal' in user_content
    assert 'переглядаю резюме вручну' in user_content
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pytest tests/test_claude_client.py -v
```

Expected: `ModuleNotFoundError: No module named 'claude_client'`

- [ ] **Step 3: Write claude_client.py**

```python
# claude_client.py
import anthropic

MAX_REPLY_CHARS = 280
MODEL = "claude-sonnet-4-6"

_SYSTEM = """Ти — Артем Степаненко. Пишеш від першої особи коментар у Threads.

Правила:
- Мова: українська
- Максимум 280 символів
- Без тире (— або –), без стрілок (→)
- Без coaching-мови ("розкрий потенціал", "зроби крок" тощо)
- Один конкретний інсайт або приклад із власного досвіду
- Закінчуй м'яким питанням або пропозицією
- Не рекламуй явно"""


class ClaudeClient:
    def __init__(self, api_key: str):
        self._client = anthropic.Anthropic(api_key=api_key)

    def generate_reply(self, segment: str, post_text: str) -> str:
        msg = self._client.messages.create(
            model=MODEL,
            max_tokens=150,
            system=_SYSTEM,
            messages=[{
                "role": "user",
                "content": f"Сегмент: {segment}\n\nПост:\n{post_text}\n\nНапиши коментар.",
            }],
        )
        reply = msg.content[0].text.strip()
        if len(reply) > MAX_REPLY_CHARS:
            reply = reply[:MAX_REPLY_CHARS].rsplit(' ', 1)[0]
        return reply
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pytest tests/test_claude_client.py -v
```

Expected: `3 passed`

- [ ] **Step 5: Commit**

```bash
cd "/Users/artem/Claude v 1.0"
git add tool-threads-finder/
git commit -m "feat: claude client — reply generation with voice rules"
```

---

## Task 5: searcher.py

**Files:**
- Create: `tool-threads-finder/searcher.py`
- Create: `tool-threads-finder/tests/test_searcher.py`

- [ ] **Step 1: Write failing tests**

```python
# tests/test_searcher.py
import pytest
from unittest.mock import MagicMock, patch, call
from datetime import datetime, timezone, timedelta

def make_post(post_id='p1', text='обробляю інвойси вручну щодня', hours_ago=1):
    ts = (datetime.now(timezone.utc) - timedelta(hours=hours_ago)).strftime('%Y-%m-%dT%H:%M:%SZ')
    return {'id': post_id, 'text': text, 'timestamp': ts, 'username': 'user1'}

def run_searcher(sheets_mock, threads_mock, claude_mock):
    with patch('searcher.SheetsClient', return_value=sheets_mock), \
         patch('searcher.ThreadsClient', return_value=threads_mock), \
         patch('searcher.ClaudeClient', return_value=claude_mock), \
         patch('searcher.load_config', return_value=MagicMock()):
        import importlib, searcher
        importlib.reload(searcher)
        searcher.run()

def test_exits_early_when_daily_cap_reached():
    sheets = MagicMock()
    sheets.seen_ids.return_value = set()
    sheets.replies_today.return_value = 8
    threads = MagicMock()
    run_searcher(sheets, threads, MagicMock())
    threads.search.assert_not_called()

def test_skips_seen_post():
    sheets = MagicMock()
    sheets.seen_ids.return_value = {'p1'}
    sheets.replies_today.return_value = 0
    sheets.keyword_tabs.return_value = [('Ops & Finance', ['інвойси вручну'])]
    threads = MagicMock()
    threads.search.return_value = [make_post('p1')]
    claude = MagicMock()
    run_searcher(sheets, threads, claude)
    claude.generate_reply.assert_not_called()

def test_skips_post_older_than_3_hours():
    sheets = MagicMock()
    sheets.seen_ids.return_value = set()
    sheets.replies_today.return_value = 0
    sheets.keyword_tabs.return_value = [('Ops & Finance', ['інвойси вручну'])]
    threads = MagicMock()
    threads.search.return_value = [make_post('p1', hours_ago=4)]
    claude = MagicMock()
    run_searcher(sheets, threads, claude)
    claude.generate_reply.assert_not_called()

def test_skips_post_too_short():
    sheets = MagicMock()
    sheets.seen_ids.return_value = set()
    sheets.replies_today.return_value = 0
    sheets.keyword_tabs.return_value = [('Ops & Finance', ['інвойси'])]
    threads = MagicMock()
    threads.search.return_value = [make_post('p1', text='короткий')]
    claude = MagicMock()
    run_searcher(sheets, threads, claude)
    claude.generate_reply.assert_not_called()

def test_posts_reply_and_logs_for_qualifying_post():
    sheets = MagicMock()
    sheets.seen_ids.return_value = set()
    sheets.replies_today.return_value = 0
    sheets.keyword_tabs.return_value = [('Ops & Finance', ['інвойси вручну'])]
    threads = MagicMock()
    threads.search.return_value = [make_post('p1')]
    threads.reply.return_value = 'our_reply_id_1'
    claude = MagicMock()
    claude.generate_reply.return_value = 'Класика. Ми це автоматизували.'
    run_searcher(sheets, threads, claude)
    threads.reply.assert_called_once_with('p1', 'Класика. Ми це автоматизували.')
    sheets.append_log.assert_called_once()

def test_exits_on_sheets_load_failure():
    sheets = MagicMock()
    sheets.seen_ids.side_effect = Exception("Sheets down")
    with patch('searcher.SheetsClient', return_value=sheets), \
         patch('searcher.ThreadsClient', return_value=MagicMock()), \
         patch('searcher.ClaudeClient', return_value=MagicMock()), \
         patch('searcher.load_config', return_value=MagicMock()), \
         pytest.raises(SystemExit):
        import importlib, searcher
        importlib.reload(searcher)
        searcher.run()
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pytest tests/test_searcher.py -v
```

Expected: `ModuleNotFoundError: No module named 'searcher'`

- [ ] **Step 3: Write searcher.py**

```python
# searcher.py
import sys
import logging
from datetime import datetime, timezone, timedelta

from config import load_config
from sheets_client import SheetsClient
from threads_client import ThreadsClient, ThreadsAPIError
from claude_client import ClaudeClient

MAX_REPLIES_PER_DAY = 8
MAX_POST_AGE_HOURS = 3
MIN_POST_LENGTH = 40

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
log = logging.getLogger(__name__)


def run() -> None:
    cfg = load_config()

    try:
        sheets = SheetsClient(cfg.sheets_id, cfg.credentials_path)
        seen = sheets.seen_ids()
        today_count = sheets.replies_today()
    except Exception as e:
        log.error(f"Sheets load failed: {e} — exiting without posting")
        sys.exit(1)

    if today_count >= MAX_REPLIES_PER_DAY:
        log.info(f"Daily cap reached ({today_count}/{MAX_REPLIES_PER_DAY})")
        return

    threads = ThreadsClient(cfg.threads_token)
    claude = ClaudeClient(cfg.anthropic_key)
    cutoff = datetime.now(timezone.utc) - timedelta(hours=MAX_POST_AGE_HOURS)

    for segment, keywords in sheets.keyword_tabs():
        for keyword in keywords:
            if today_count >= MAX_REPLIES_PER_DAY:
                return

            try:
                posts = threads.search(keyword)
            except Exception as e:
                log.warning(f"Search failed for '{keyword}': {e}")
                continue

            for post in posts:
                if today_count >= MAX_REPLIES_PER_DAY:
                    return

                post_id = post.get('id', '')
                text = post.get('text', '')

                if post_id in seen:
                    continue
                if len(text) < MIN_POST_LENGTH:
                    continue
                try:
                    ts = post.get('timestamp', '')
                    post_time = datetime.fromisoformat(ts.replace('Z', '+00:00'))
                    if post_time < cutoff:
                        continue
                except (ValueError, AttributeError):
                    continue

                try:
                    reply_text = claude.generate_reply(segment, text)
                    our_reply_id = threads.reply(post_id, reply_text)
                    sheets.append_log(segment, keyword, post_id, text, our_reply_id, reply_text)
                    seen.add(post_id)
                    today_count += 1
                    log.info(f"Replied [{segment}] {post_id} — {reply_text[:60]}...")
                except Exception as e:
                    log.warning(f"Failed to reply to {post_id}: {e}")


if __name__ == '__main__':
    run()
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pytest tests/test_searcher.py -v
```

Expected: `6 passed`

- [ ] **Step 5: Commit**

```bash
cd "/Users/artem/Claude v 1.0"
git add tool-threads-finder/
git commit -m "feat: searcher — keyword search, filter, reply, log"
```

---

## Task 6: setup_sheets.py + Initial Keywords

**Files:**
- Create: `tool-threads-finder/setup_sheets.py`

This script runs once to create all Sheets tabs with headers and populate initial keywords. Re-running it is safe (skips existing tabs).

- [ ] **Step 1: Write setup_sheets.py**

```python
# setup_sheets.py
"""Run once to set up the Google Sheets structure with headers and initial keywords."""
import gspread
from config import load_config
from sheets_client import LOG_COLUMNS, REPLY_MAP_COLUMNS

INITIAL_KEYWORDS = {
    'Sales & Marketing': [
        'збираю ліди вручну',
        'CRM вручну',
        'звіт по рекламі вручну',
        'публікую пости вручну',
        'переношу ліди вручну',
    ],
    'Ops & Finance': [
        'обробляю інвойси вручну',
        'відстежую залишки вручну',
        'розношу витрати вручну',
        'відстежую відправлення вручну',
    ],
    'HR & Legal': [
        'переглядаю резюме вручну',
        'відповідаю на питання клієнтів вручну',
        'готую договори вручну',
    ],
    'Owners': [
        'відповідаю клієнтам вручну',
        'записую клієнтів вручну',
        'веду облік вручну',
        'хочу автоматизувати',
    ],
    'Job Seekers': [
        'шукаю вакансії вручну',
        'адаптую резюме вручну',
    ],
}

def setup():
    cfg = load_config()
    gc = gspread.service_account(filename=cfg.credentials_path)
    ss = gc.open_by_key(cfg.sheets_id)
    existing = {ws.title for ws in ss.worksheets()}

    # Keyword tabs
    for tab_name, keywords in INITIAL_KEYWORDS.items():
        if tab_name in existing:
            print(f"  skip (exists): {tab_name}")
            continue
        ws = ss.add_worksheet(tab_name, rows=100, cols=2)
        ws.append_row(['keyword', 'active'])
        for kw in keywords:
            ws.append_row([kw, 'TRUE'])
        print(f"  created: {tab_name} ({len(keywords)} keywords)")

    # Log tab
    if 'Log' not in existing:
        ws = ss.add_worksheet('Log', rows=5000, cols=len(LOG_COLUMNS))
        ws.append_row(LOG_COLUMNS)
        print("  created: Log")
    else:
        print("  skip (exists): Log")

    # Reply Map tab
    if 'Reply Map' not in existing:
        ws = ss.add_worksheet('Reply Map', rows=1000, cols=len(REPLY_MAP_COLUMNS))
        ws.append_row(REPLY_MAP_COLUMNS)
        print("  created: Reply Map")
    else:
        print("  skip (exists): Reply Map")

    print("Setup complete.")

if __name__ == '__main__':
    setup()
```

- [ ] **Step 2: Copy credentials.json from tool-threads-poster**

```bash
cp "/Users/artem/Claude v 1.0/tool-threads-poster/credentials.json" \
   "/Users/artem/Claude v 1.0/tool-threads-finder/credentials.json"
```

- [ ] **Step 3: Create .env from template, fill in GOOGLE_SHEETS_ID**

```bash
cp "/Users/artem/Claude v 1.0/tool-threads-finder/.env.template" \
   "/Users/artem/Claude v 1.0/tool-threads-finder/.env"
```

Fill in `GOOGLE_SHEETS_ID` with the URL Artem provides. Extract the ID from the URL:
`https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit` → copy `{SHEET_ID}`.

(Other tokens to be filled before running bot.py — not needed for setup_sheets.py.)

- [ ] **Step 4: Run setup**

```bash
cd "/Users/artem/Claude v 1.0/tool-threads-finder"
python setup_sheets.py
```

Expected output:
```
  created: Sales & Marketing (5 keywords)
  created: Ops & Finance (4 keywords)
  created: HR & Legal (3 keywords)
  created: Owners (4 keywords)
  created: Job Seekers (2 keywords)
  created: Log
  created: Reply Map
Setup complete.
```

- [ ] **Step 5: Commit**

```bash
cd "/Users/artem/Claude v 1.0"
git add tool-threads-finder/setup_sheets.py
git commit -m "feat: setup_sheets — creates tabs and initial keyword list"
```

---

## Task 7: bot.py

**Files:**
- Create: `tool-threads-finder/bot.py`
- Create: `tool-threads-finder/tests/test_bot.py`

- [ ] **Step 1: Write failing tests**

```python
# tests/test_bot.py
import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch

pytest_plugins = ['pytest_asyncio']

@pytest.mark.asyncio
async def test_handle_telegram_reply_publishes_to_threads():
    sheets = MagicMock()
    sheets.find_their_comment_id.return_value = 'tc_abc'
    threads = MagicMock()

    update = MagicMock()
    update.message.text = 'Так, розкажу детальніше'
    update.message.reply_to_message.message_id = 999
    update.message.reply_text = AsyncMock()

    with patch('bot.sheets', sheets), patch('bot.threads', threads):
        from bot import handle_telegram_reply
        await handle_telegram_reply(update, MagicMock())

    threads.reply.assert_called_once_with('tc_abc', 'Так, розкажу детальніше')
    sheets.update_reply_map_status.assert_called_once_with('999', 'replied')
    update.message.reply_text.assert_called_once_with('✅ Опубліковано')

@pytest.mark.asyncio
async def test_handle_telegram_reply_ignores_non_reply_messages():
    update = MagicMock()
    update.message.reply_to_message = None
    threads = MagicMock()

    with patch('bot.threads', threads):
        from bot import handle_telegram_reply
        await handle_telegram_reply(update, MagicMock())

    threads.reply.assert_not_called()

@pytest.mark.asyncio
async def test_handle_telegram_reply_ignores_unknown_notification():
    sheets = MagicMock()
    sheets.find_their_comment_id.return_value = None
    threads = MagicMock()

    update = MagicMock()
    update.message.reply_to_message.message_id = 777

    with patch('bot.sheets', sheets), patch('bot.threads', threads):
        from bot import handle_telegram_reply
        await handle_telegram_reply(update, MagicMock())

    threads.reply.assert_not_called()
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pytest tests/test_bot.py -v
```

Expected: `ModuleNotFoundError: No module named 'bot'`

- [ ] **Step 3: Write bot.py**

```python
# bot.py
import asyncio
import logging

from telegram import Bot, Update
from telegram.ext import Application, MessageHandler, filters, ContextTypes

from config import load_config
from sheets_client import SheetsClient
from threads_client import ThreadsClient, ThreadsAPIError

MONITOR_INTERVAL = 300

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
log = logging.getLogger(__name__)

cfg = load_config()
sheets = SheetsClient(cfg.sheets_id, cfg.credentials_path)
threads = ThreadsClient(cfg.threads_token)


async def monitor_replies() -> None:
    bot = Bot(token=cfg.telegram_bot_token)
    while True:
        try:
            our_reply_ids = sheets.our_reply_ids_last_7_days()
            known_ids = sheets.known_their_comment_ids()

            for our_reply_id in our_reply_ids:
                try:
                    replies = threads.get_replies(our_reply_id)
                except ThreadsAPIError as e:
                    log.warning(f"get_replies failed for {our_reply_id}: {e}")
                    continue

                for reply in replies:
                    their_id = reply.get('id', '')
                    if their_id in known_ids:
                        continue
                    commenter = reply.get('username', 'unknown')
                    comment_text = reply.get('text', '')
                    text = (
                        f"💬 Відповідь на твій коментар\n\n"
                        f"Від: @{commenter}\n"
                        f'"{comment_text}"'
                    )
                    sent = await bot.send_message(chat_id=cfg.telegram_chat_id, text=text)
                    sheets.append_reply_map(our_reply_id, their_id, commenter, comment_text, sent.message_id)
                    known_ids.add(their_id)
                    log.info(f"Notified: reply {their_id} from @{commenter}")

        except Exception as e:
            log.error(f"Monitor error: {e}")

        await asyncio.sleep(MONITOR_INTERVAL)


async def handle_telegram_reply(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    msg = update.message
    if not msg or not msg.reply_to_message:
        return

    original_msg_id = str(msg.reply_to_message.message_id)
    their_comment_id = sheets.find_their_comment_id(original_msg_id)
    if not their_comment_id:
        return

    try:
        threads.reply(their_comment_id, msg.text)
        sheets.update_reply_map_status(original_msg_id, 'replied')
        await msg.reply_text('✅ Опубліковано')
        log.info(f"Published reply to {their_comment_id}")
    except Exception as e:
        await msg.reply_text(f'❌ Помилка: {e}')
        log.error(f"Failed to publish reply: {e}")


async def main() -> None:
    app = (
        Application.builder()
        .token(cfg.telegram_bot_token)
        .build()
    )
    app.add_handler(
        MessageHandler(
            filters.TEXT & filters.REPLY & filters.Chat(chat_id=int(cfg.telegram_chat_id)),
            handle_telegram_reply,
        )
    )
    async with app:
        await app.start()
        asyncio.create_task(monitor_replies())
        await app.updater.start_polling()
        await asyncio.Event().wait()  # run forever


if __name__ == '__main__':
    asyncio.run(main())
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pytest tests/test_bot.py -v
```

Expected: `3 passed`

- [ ] **Step 5: Run full test suite**

```bash
pytest tests/ -v
```

Expected: all tests pass

- [ ] **Step 6: Commit**

```bash
cd "/Users/artem/Claude v 1.0"
git add tool-threads-finder/
git commit -m "feat: bot — threads reply monitor + telegram listener"
```

---

## Task 8: E2E Smoke Test + Deployment

**Files:**
- No new files — configure cron and run bot.py

- [ ] **Step 1: Fill in remaining .env values**

Open `tool-threads-finder/.env` and fill in all remaining values:
- `THREADS_ACCESS_TOKEN` — from Meta Developer Console → your new app → token
- `ANTHROPIC_API_KEY` — from console.anthropic.com
- `TELEGRAM_BOT_TOKEN` — from @BotFather in Telegram
- `TELEGRAM_CHAT_ID` — send `/start` to your bot, then `https://api.telegram.org/bot{TOKEN}/getUpdates` → find `chat.id`

- [ ] **Step 2: Verify keyword search endpoint with live API**

```bash
cd "/Users/artem/Claude v 1.0/tool-threads-finder"
python - <<'EOF'
from config import load_config
from threads_client import ThreadsClient
cfg = load_config()
client = ThreadsClient(cfg.threads_token)
posts = client.search('вручну')
print(f"Found {len(posts)} posts")
for p in posts[:2]:
    print(f"  {p.get('id')} | {p.get('text', '')[:60]}")
EOF
```

If this returns a 404, check the Threads API docs and update the endpoint in `threads_client.py` `search()` method accordingly.

- [ ] **Step 3: Run searcher.py once manually**

```bash
cd "/Users/artem/Claude v 1.0/tool-threads-finder"
python searcher.py
```

Watch logs. Confirm at least one reply is posted and appears in the Sheets `Log` tab.

- [ ] **Step 4: Set up cron for searcher.py**

```bash
crontab -e
```

Add line:
```
*/5 * * * * cd "/Users/artem/Claude v 1.0/tool-threads-finder" && /usr/bin/python3 searcher.py >> searcher.log 2>&1
```

Verify cron is registered:
```bash
crontab -l | grep searcher
```

- [ ] **Step 5: Start bot.py**

```bash
cd "/Users/artem/Claude v 1.0/tool-threads-finder"
nohup python bot.py >> bot.log 2>&1 &
echo $! > bot.pid
echo "bot.py started with PID $(cat bot.pid)"
```

- [ ] **Step 6: Smoke test the Telegram bot**

In Telegram: send `/start` to your bot to confirm it's running. Then find a Threads post manually, reply to it via searcher (or test with a known post_id), enter it in the Sheets Log manually, wait for bot.py to detect it, and confirm Telegram notification arrives.

- [ ] **Step 7: Final commit**

```bash
cd "/Users/artem/Claude v 1.0"
git add tool-threads-finder/
git commit -m "feat: threads-finder complete — searcher + bot deployed"
```

---

## Spec Coverage Check

| Spec requirement | Task |
|---|---|
| Search by keyword via threads_keyword_search | Task 2, Task 5 |
| Filter: not older 3h, not in seen_ids, text > 40 chars | Task 5 |
| Hard cap 8 replies/day, loaded from Sheets | Task 5 |
| Sheets load failure → exit, don't post | Task 5 |
| Claude generates reply in Artem's voice ≤ 280 chars | Task 4 |
| seen_ids window: last 30 days | Task 3 |
| Seven Sheets tabs with correct columns | Task 3, Task 6 |
| Tab name = segment label in Log | Task 3 |
| New segment = new tab, no code change | Task 3 |
| Monitor replies to our comments (last 7 days) | Task 7 |
| Telegram notification with commenter + text | Task 7 |
| Artem reply → publishes to Threads | Task 7 |
| Reply Map status updated on publish | Task 7 |
| Ignore non-reply Telegram messages | Task 7 |
| threads_read_replies on reply-to-reply — verify live | Task 8 |
| Cron every 5 min for searcher | Task 8 |
| bot.py as persistent daemon | Task 8 |
