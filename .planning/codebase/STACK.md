# Technology Stack

**Analysis Date:** 2026-04-18

## Overview

This is a **monorepo** containing multiple projects:
1. **notebooklm-py** - Python package for Google NotebookLM automation
2. **website-project** - Static documentation and guides
3. **Root Node.js** - Minimal Node wrapper (ai-codex CLI)

## Languages

**Primary:**
- **Python** 3.10+ - Primary language for `notebooklm-py` package
  - Used in: `src/notebooklm/` (client library, CLI)
  - Tests: `tests/` (unit, integration, e2e)

**Secondary:**
- **JavaScript/Node.js** (minimal) - Root package for ai-codex CLI
  - Entry point: `package.json` (dependency management only)
  - No source code in root

## Runtime

**Python Environment:**
- **Minimum:** Python 3.10
- **Tested:** Python 3.10, 3.11, 3.12, 3.13, 3.14
- **Recommended:** Use `uv` for venv management (relocatable environments)
  - Initialize: `uv venv .venv`
  - Install: `uv pip install -e ".[all]"`

**Node.js:**
- **Version:** Not specified (uses system Node)
- **Package Manager:** npm (v10+ implied from lockfile version 3)
- **Lockfile:** `package-lock.json` (present)

## Frameworks & Core Dependencies

### notebooklm-py

**Core Libraries:**
- **httpx** >=0.27.0 - Async HTTP client
  - Used for: RPC calls to Google NotebookLM API
  - Auth: CSRF tokens + session cookies

- **click** >=8.0.0 - CLI framework
  - Used for: `notebooklm` command-line tool
  - Location: `src/notebooklm/cli/`

- **rich** >=13.0.0 - Terminal UI and tables
  - Used for: Formatted CLI output, progress indicators

**Optional/Dev Dependencies:**
- **playwright** >=1.40.0 (optional `browser` extra)
  - Used for: Browser-based authentication (`notebooklm login`)
  - Installs: Chromium browser for cookie capture
  - Installation: `uv pip install -e ".[browser]"` or manual `playwright install chromium`

- **rookiepy** >=0.1.0 (optional `cookies` extra)
  - Purpose: Alternative cookie extraction method (if Playwright unavailable)

## Testing Stack

**Framework:** pytest >=8.0.0
- **Async Support:** pytest-asyncio >=0.23.0
  - Configuration: `asyncio_mode = "auto"` (fixtures auto-select function scope)
  - Global timeout: 60 seconds (prevents hanging tests)

**HTTP Mocking:** pytest-httpx >=0.30.0
  - Used for: Integration tests (mock Google responses)

**Coverage:** pytest-cov >=4.0.0
  - Requirement: Minimum 90% coverage (`fail_under = 90`)
  - Command: `pytest --cov`

**VCR (Cassette Recording):** vcrpy >=6.0.0
  - Purpose: Record/replay HTTP interactions for reproducible tests
  - Marker: `@pytest.mark.vcr` for cassette-based tests
  - Record mode: `NOTEBOOKLM_VCR_RECORD=1 pytest`

**Test Utilities:**
- **pytest-timeout** >=2.3.0 - Per-test timeout override
- **pytest-rerunfailures** >=14.0 - Flaky test detection

**Environment:** python-dotenv >=1.0.0 (dev only)
  - Purpose: Load `.env` for test credentials

## Code Quality Tools

**Linting & Formatting:**
- **ruff** v0.8.6 - High-performance Python linter and formatter
  - Config location: `pyproject.toml` (tool.ruff section)
  - Enabled checks: E (errors), W (warnings), F (flakes), I (isort), B (bugbear), C4, UP, SIM
  - Disabled: E501 (line length, handled by formatter), B008, SIM102, SIM105
  - Line length: 100 characters

**Type Checking:**
- **mypy** >=1.0.0 (dev only)
  - Target: Python 3.10+
  - Scope: `src/notebooklm/` only (excludes tests)
  - Config: `tool.mypy` in `pyproject.toml`
  - Strictness: Check untyped defs, but not full `disallow_untyped_defs`

**Pre-commit Hooks:**
- **pre-commit** >=4.5.1
  - Config: `.pre-commit-config.yaml`
  - Hooks: ruff (lint + fix), ruff-format
  - Usage: Auto-runs on git commit

## Build System

**Build Tool:** hatchling
  - Config: `[build-system]` in `pyproject.toml`
  - Hooks: `hatch-fancy-pypi-readme` (markdown → PyPI readme)

**Package Scripts:**
- CLI entry point: `notebooklm` → `notebooklm.notebooklm_cli:main`
- Command: `notebooklm --help` (after install with `-e` flag)

## Configuration Files

**Python:**
- `pyproject.toml` - Main config (dependencies, pytest, ruff, mypy, coverage)
- `.pre-commit-config.yaml` - Ruff formatter + linter hooks

**Node.js:**
- `package.json` - Single dependency: `ai-codex` (GitHub)
- `package-lock.json` - Lockfile (regenerated on `npm install`)

**Project Config:**
- `.mcp.json` - MCP server config (chrome-devtools for browser automation)
- `skills-lock.json` - Locked versions of agent skills (from everything-claude-code)

## Development Requirements

**Local Setup:**
- Python 3.10+ interpreter
- `uv` package manager (recommended) or `pip` + `venv`
- Playwright (optional, for browser-based login)
- Git (for pre-commit hooks)

**Authentication:**
- Google account (for NotebookLM access)
- Valid CSRF token + session cookie (obtained via `notebooklm login`)
- Storage: `~/.notebooklm/auth/` (Playwright storage state file)

## Production Considerations

**Distribution:**
- PyPI package: `notebooklm-py`
- Installation: `pip install notebooklm-py` or `pip install notebooklm-py[browser]`

**Deployment:**
- No deployment container (pure Python package)
- Works on Linux, macOS, Windows (Playwright supports all)

**Performance:**
- HTTP timeout: 30 seconds (configurable)
- Connection timeout: 10 seconds
- Rate limiting: RPC calls are sequential (no concurrent batching)

## Key Dependencies Summary

| Package | Version | Purpose | Critical? |
|---------|---------|---------|-----------|
| httpx | >=0.27.0 | HTTP requests | Yes |
| click | >=8.0.0 | CLI framework | Yes |
| rich | >=13.0.0 | Terminal formatting | Yes |
| playwright | >=1.40.0 | Browser auth | Optional |
| pytest | >=8.0.0 | Testing | Dev only |
| ruff | v0.8.6 | Linting | Dev only |
| mypy | >=1.0.0 | Type checking | Dev only |

---

*Stack analysis: 2026-04-18*
