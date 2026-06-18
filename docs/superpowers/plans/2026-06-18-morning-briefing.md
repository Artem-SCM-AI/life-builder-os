# Morning Briefing → Telegram Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Python script that reads hot.md + 2 memory files, calls Claude Haiku, and sends a 200-word Ukrainian morning briefing to Telegram at 8:45 AM Mon–Fri via Mac crontab.

**Architecture:** Three focused modules (`reader.py`, `sender.py`, `briefing.py`) wired by a shell entry point (`run.sh`). Tests mock filesystem and HTTP calls. Crontab calls `run.sh` which activates the venv before running the script.

**Tech Stack:** Python 3.11+, `anthropic`, `requests`, `python-dotenv`, `pytest`, Mac crontab.

## Global Constraints

- Model: `claude-haiku-4-5-20251001` — do not substitute
- Max output tokens: 400
- Briefing language: Ukrainian only
- Telegram bot reuses credentials from `tool-threads-poster/config.monetizer-biz.env`
- `config.env` must never be committed — `.gitignore` entry required
- All paths with spaces must be quoted in shell scripts
- `run.sh` must be executable (`chmod +x`)

---

## File Map

```
tool-morning-briefing/
├── briefing.py          # main: orchestrates, --dry-run flag, error handling
├── reader.py            # reads hot.md + project_current.md + user_profile.md
├── sender.py            # send_telegram() + send_error_alert()
├── run.sh               # activates venv, calls briefing.py "$@"
├── config.env           # secrets — NOT committed
├── config.env.template  # committed template
├── requirements.txt     # anthropic, requests, python-dotenv
├── .gitignore           # ignores config.env
└── tests/
    ├── test_reader.py
    ├── test_sender.py
    └── test_briefing.py
```

---

### Task 1: Scaffold — directory, config, venv, run.sh

**Files:**
- Create: `tool-morning-briefing/requirements.txt`
- Create: `tool-morning-briefing/.gitignore`
- Create: `tool-morning-briefing/config.env.template`
- Create: `tool-morning-briefing/run.sh`

**Interfaces:**
- Produces: working venv at `tool-morning-briefing/.venv/`, `run.sh` entry point

- [ ] **Step 1: Create directory and requirements.txt**

```bash
mkdir -p "tool-morning-briefing/tests"
```

`tool-morning-briefing/requirements.txt`:
```
anthropic>=0.40.0
requests>=2.31.0
python-dotenv>=1.0.0
pytest>=8.0.0
```

- [ ] **Step 2: Create .gitignore**

`tool-morning-briefing/.gitignore`:
```
config.env
.venv/
__pycache__/
*.pyc
.pytest_cache/
```

- [ ] **Step 3: Create config.env.template**

`tool-morning-briefing/config.env.template`:
```
TELEGRAM_TOKEN=
TELEGRAM_CHAT_ID=
ANTHROPIC_API_KEY=
HOT_MD_PATH=/Users/artem/Claude v 1.0/hot.md
PROJECT_CURRENT_PATH=/Users/artem/.claude/projects/-Users-artem-Claude-v-1-0/memory/project_current.md
USER_PROFILE_PATH=/Users/artem/.claude/projects/-Users-artem-Claude-v-1-0/memory/user_profile.md
```

- [ ] **Step 4: Create config.env from template and fill in secrets**

```bash
cp "tool-morning-briefing/config.env.template" "tool-morning-briefing/config.env"
```

Open `tool-morning-briefing/config.env` and fill in:
- `TELEGRAM_TOKEN` — copy from `tool-threads-poster/config.monetizer-biz.env`
- `TELEGRAM_CHAT_ID` — copy from `tool-threads-poster/config.monetizer-biz.env`
- `ANTHROPIC_API_KEY` — from Anthropic console (or `echo $ANTHROPIC_API_KEY` in terminal)

- [ ] **Step 5: Create run.sh**

`tool-morning-briefing/run.sh`:
```bash
#!/bin/bash
cd "$(dirname "$0")"
source .venv/bin/activate
python briefing.py "$@"
```

```bash
chmod +x "tool-morning-briefing/run.sh"
```

- [ ] **Step 6: Create venv and install dependencies**

```bash
cd "tool-morning-briefing"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Expected output ends with: `Successfully installed anthropic-... requests-... python-dotenv-... pytest-...`

- [ ] **Step 7: Verify pytest runs (empty)**

```bash
cd "tool-morning-briefing"
source .venv/bin/activate
pytest tests/ -v
```

Expected: `no tests ran` or `collected 0 items`

- [ ] **Step 8: Create empty placeholder files so imports work**

`tool-morning-briefing/reader.py`:
```python
```

`tool-morning-briefing/sender.py`:
```python
```

`tool-morning-briefing/briefing.py`:
```python
```

`tool-morning-briefing/tests/__init__.py`:
```python
```

- [ ] **Step 9: Commit scaffold**

```bash
git add tool-morning-briefing/
git commit -m "feat: scaffold morning-briefing tool"
```

---

### Task 2: reader.py — read 3 context files

**Files:**
- Modify: `tool-morning-briefing/reader.py`
- Create: `tool-morning-briefing/tests/test_reader.py`

**Interfaces:**
- Produces: `read_context(hot_md_path, project_current_path, user_profile_path) -> dict` with keys `hot_md`, `project_current`, `user_profile`

- [ ] **Step 1: Write failing tests**

`tool-morning-briefing/tests/test_reader.py`:
```python
from pathlib import Path

import pytest

from reader import read_context


def test_read_context_returns_file_contents(tmp_path):
    hot = tmp_path / "hot.md"
    hot.write_text("hot content", encoding="utf-8")
    proj = tmp_path / "project.md"
    proj.write_text("project content", encoding="utf-8")
    profile = tmp_path / "profile.md"
    profile.write_text("profile content", encoding="utf-8")

    result = read_context(str(hot), str(proj), str(profile))

    assert result["hot_md"] == "hot content"
    assert result["project_current"] == "project content"
    assert result["user_profile"] == "profile content"


def test_read_context_handles_missing_file(tmp_path):
    existing = tmp_path / "exists.md"
    existing.write_text("data", encoding="utf-8")

    result = read_context(
        str(tmp_path / "missing.md"),
        str(existing),
        str(existing),
    )

    assert "[File not found:" in result["hot_md"]
    assert result["project_current"] == "data"
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd "tool-morning-briefing" && source .venv/bin/activate
pytest tests/test_reader.py -v
```

Expected: `FAILED` — `ImportError` or `AttributeError`

- [ ] **Step 3: Implement reader.py**

`tool-morning-briefing/reader.py`:
```python
from pathlib import Path


def read_context(hot_md_path: str, project_current_path: str, user_profile_path: str) -> dict:
    def _read(path: str) -> str:
        try:
            return Path(path).read_text(encoding="utf-8")
        except FileNotFoundError:
            return f"[File not found: {path}]"

    return {
        "hot_md": _read(hot_md_path),
        "project_current": _read(project_current_path),
        "user_profile": _read(user_profile_path),
    }
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
pytest tests/test_reader.py -v
```

Expected:
```
PASSED tests/test_reader.py::test_read_context_returns_file_contents
PASSED tests/test_reader.py::test_read_context_handles_missing_file
2 passed
```

- [ ] **Step 5: Commit**

```bash
git add tool-morning-briefing/reader.py tool-morning-briefing/tests/test_reader.py
git commit -m "feat: add context file reader"
```

---

### Task 3: sender.py — Telegram send functions

**Files:**
- Modify: `tool-morning-briefing/sender.py`
- Create: `tool-morning-briefing/tests/test_sender.py`

**Interfaces:**
- Produces:
  - `send_telegram(token: str, chat_id: str, text: str) -> None`
  - `send_error_alert(token: str, chat_id: str, error: str) -> None` — never raises

- [ ] **Step 1: Write failing tests**

`tool-morning-briefing/tests/test_sender.py`:
```python
from unittest.mock import patch

from sender import send_error_alert, send_telegram


def test_send_telegram_posts_to_correct_url():
    with patch("sender.requests.post") as mock_post:
        send_telegram("TOKEN123", "CHAT456", "Hello")

    mock_post.assert_called_once_with(
        "https://api.telegram.org/botTOKEN123/sendMessage",
        data={"chat_id": "CHAT456", "text": "Hello"},
        timeout=10,
    )


def test_send_error_alert_prefixes_message():
    with patch("sender.send_telegram") as mock_send:
        send_error_alert("TOKEN", "CHAT", "something broke")

    mock_send.assert_called_once_with(
        "TOKEN", "CHAT", "Morning briefing failed: something broke"
    )


def test_send_error_alert_does_not_raise_on_telegram_failure():
    with patch("sender.send_telegram", side_effect=Exception("network error")):
        send_error_alert("TOKEN", "CHAT", "error")  # must not raise
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pytest tests/test_sender.py -v
```

Expected: `FAILED` — `ImportError`

- [ ] **Step 3: Implement sender.py**

`tool-morning-briefing/sender.py`:
```python
import requests


def send_telegram(token: str, chat_id: str, text: str) -> None:
    requests.post(
        f"https://api.telegram.org/bot{token}/sendMessage",
        data={"chat_id": chat_id, "text": text},
        timeout=10,
    )


def send_error_alert(token: str, chat_id: str, error: str) -> None:
    try:
        send_telegram(token, chat_id, f"Morning briefing failed: {error}")
    except Exception:
        pass
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
pytest tests/test_sender.py -v
```

Expected:
```
PASSED tests/test_sender.py::test_send_telegram_posts_to_correct_url
PASSED tests/test_sender.py::test_send_error_alert_prefixes_message
PASSED tests/test_sender.py::test_send_error_alert_does_not_raise_on_telegram_failure
3 passed
```

- [ ] **Step 5: Commit**

```bash
git add tool-morning-briefing/sender.py tool-morning-briefing/tests/test_sender.py
git commit -m "feat: add telegram sender"
```

---

### Task 4: briefing.py — prompt builder, Claude API call, main()

**Files:**
- Modify: `tool-morning-briefing/briefing.py`
- Create: `tool-morning-briefing/tests/test_briefing.py`

**Interfaces:**
- Consumes: `read_context()` from `reader.py`, `send_telegram()` + `send_error_alert()` from `sender.py`
- Produces: runnable `main()` with `--dry-run` flag

- [ ] **Step 1: Write failing tests**

`tool-morning-briefing/tests/test_briefing.py`:
```python
from unittest.mock import MagicMock, patch

from briefing import build_prompt, generate_briefing


def test_build_prompt_includes_all_labeled_sections():
    context = {
        "hot_md": "hot content here",
        "project_current": "project details here",
        "user_profile": "profile info here",
    }
    prompt = build_prompt(context)

    assert "[USER PROFILE]" in prompt
    assert "profile info here" in prompt
    assert "[CURRENT PROJECTS & STATE — hot.md]" in prompt
    assert "hot content here" in prompt
    assert "[ACTIVE PROJECTS DETAIL]" in prompt
    assert "project details here" in prompt
    assert "Ukrainian" in prompt


def test_generate_briefing_calls_haiku_model():
    mock_client = MagicMock()
    mock_client.messages.create.return_value.content = [MagicMock(text="Брифінг готовий")]

    with patch("briefing.Anthropic", return_value=mock_client):
        result = generate_briefing("test prompt", "test-api-key")

    assert result == "Брифінг готовий"
    mock_client.messages.create.assert_called_once_with(
        model="claude-haiku-4-5-20251001",
        max_tokens=400,
        messages=[{"role": "user", "content": "test prompt"}],
    )
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pytest tests/test_briefing.py -v
```

Expected: `FAILED` — `ImportError`

- [ ] **Step 3: Implement briefing.py**

`tool-morning-briefing/briefing.py`:
```python
import argparse
import os

from anthropic import Anthropic
from dotenv import load_dotenv

from reader import read_context
from sender import send_error_alert, send_telegram

PROMPT_TEMPLATE = """You are Artem's morning assistant. Generate his daily briefing in Ukrainian.

[USER PROFILE]
{user_profile}

[CURRENT PROJECTS & STATE — hot.md]
{hot_md}

[ACTIVE PROJECTS DETAIL]
{project_current}

Answer these 4 questions:
1. The ONE most important thing to do today
2. What needs action before noon and why
3. What is at risk if ignored today
4. One open decision to make before starting work

Rules:
- Max 200 words
- Ukrainian language
- Start with most urgent item
- Plain text only — no markdown, no headers
- Do not repeat project names more than once each"""


def build_prompt(context: dict) -> str:
    return PROMPT_TEMPLATE.format(**context)


def generate_briefing(prompt: str, api_key: str) -> str:
    client = Anthropic(api_key=api_key)
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=400,
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Print to stdout, skip Telegram")
    args = parser.parse_args()

    load_dotenv("config.env")

    token = os.environ["TELEGRAM_TOKEN"]
    chat_id = os.environ["TELEGRAM_CHAT_ID"]
    api_key = os.environ["ANTHROPIC_API_KEY"]

    try:
        context = read_context(
            hot_md_path=os.environ["HOT_MD_PATH"],
            project_current_path=os.environ["PROJECT_CURRENT_PATH"],
            user_profile_path=os.environ["USER_PROFILE_PATH"],
        )
        prompt = build_prompt(context)
        briefing = generate_briefing(prompt, api_key)

        if args.dry_run:
            print(briefing)
        else:
            send_telegram(token, chat_id, briefing)

    except Exception as e:
        send_error_alert(token, chat_id, str(e))
        raise


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run all tests to confirm they pass**

```bash
pytest tests/ -v
```

Expected:
```
PASSED tests/test_reader.py::test_read_context_returns_file_contents
PASSED tests/test_reader.py::test_read_context_handles_missing_file
PASSED tests/test_sender.py::test_send_telegram_posts_to_correct_url
PASSED tests/test_sender.py::test_send_error_alert_prefixes_message
PASSED tests/test_sender.py::test_send_error_alert_does_not_raise_on_telegram_failure
PASSED tests/test_briefing.py::test_build_prompt_includes_all_labeled_sections
PASSED tests/test_briefing.py::test_generate_briefing_calls_haiku_model
7 passed
```

- [ ] **Step 5: Commit**

```bash
git add tool-morning-briefing/briefing.py tool-morning-briefing/tests/test_briefing.py
git commit -m "feat: add briefing generator and main entrypoint"
```

---

### Task 5: Dry-run test + crontab setup

**Files:** no new files

- [ ] **Step 1: Test dry-run manually**

```bash
cd "tool-morning-briefing"
./run.sh --dry-run
```

Expected: Ukrainian briefing text printed to terminal, no Telegram message sent. Read it — does it make sense given current `hot.md`?

- [ ] **Step 2: Test full send manually**

```bash
./run.sh
```

Expected: briefing arrives in Telegram within 15 seconds.

- [ ] **Step 3: Add crontab entry**

```bash
(crontab -l 2>/dev/null; echo '45 8 * * 1-5 "/Users/artem/Claude v 1.0/tool-morning-briefing/run.sh" >> /tmp/morning-briefing.log 2>&1') | crontab -
```

Verify it was added:
```bash
crontab -l
```

Expected: last line shows the `45 8 * * 1-5` entry.

- [ ] **Step 4: Final commit**

```bash
git add tool-morning-briefing/
git commit -m "feat: morning briefing tool complete — runs daily at 08:45 via crontab"
```
