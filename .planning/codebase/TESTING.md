# Testing Patterns

**Analysis Date:** 2026-04-18

## Test Framework

**Runner:**
- Framework: pytest 8.0.0+
- Async support: pytest-asyncio 0.23.0+
- Config: `pyproject.toml` [tool.pytest.ini_options]

**Assertion Library:**
- pytest built-in assertions (simple and expressive)
- No custom assertion framework

**Run Commands:**
```bash
# Run all tests (excluding e2e by default per addopts)
pytest

# Run with coverage report
pytest --cov

# Watch mode (requires pytest-watch)
pytest-watch

# Run specific test file
pytest tests/unit/test_encoder.py

# Run specific test class or function
pytest tests/unit/test_encoder.py::TestEncodeRPCRequest
pytest tests/unit/test_encoder.py::TestEncodeRPCRequest::test_encode_list_notebooks

# Run e2e tests (requires authentication, marked @pytest.mark.e2e)
pytest tests/e2e -m e2e

# Run with specific timeout (override global 60s)
pytest tests/unit --timeout=120

# Run with verbose output
pytest -v

# Run with detailed failure output
pytest -vv

# Run tests marked as 'variants' (parameter variant tests, quota-intensive)
pytest -m variants
```

## Test File Organization

**Location:** Co-located with source code — standard Python package layout
- Source: `src/notebooklm/`
- Tests: `tests/unit/` and `tests/e2e/`
- Mirrors source structure: `tests/unit/cli/` mirrors `src/notebooklm/cli/`

**Naming:**
- Test files: `test_*.py`
- Test classes: `Test*` (e.g., `TestEncodeRPCRequest`, `TestLoginCommand`)
- Test functions: `test_*` (e.g., `test_encode_list_notebooks`, `test_login_help_message`)

**Structure:**
```
tests/
├── unit/
│   ├── test_encoder.py          # RPC encoding tests
│   ├── test_decoder.py          # RPC decoding tests
│   ├── test_exceptions.py       # Exception behavior
│   ├── test_auth.py             # Authentication tests
│   ├── test_chat_history.py     # Chat functionality
│   ├── cli/                     # CLI tests
│   │   ├── conftest.py          # CLI fixtures and mocks
│   │   ├── test_session.py      # login, use, status, clear
│   │   ├── test_notebook.py     # list, create, delete, rename
│   │   ├── test_artifact.py     # artifact commands
│   │   └── test_chat.py         # ask, history, configure
│   └── conftest.py              # Shared unit test fixtures
└── e2e/
    ├── test_notebooks.py        # Real API tests (requires auth)
    ├── test_sources.py
    └── test_artifacts.py
```

## Test Structure

**Suite Organization:**
```python
# test_encoder.py
"""Unit tests for RPC request encoder."""

import json
from notebooklm.rpc.encoder import build_request_body, encode_rpc_request
from notebooklm.rpc.types import RPCMethod


class TestEncodeRPCRequest:
    """Tests for encode_rpc_request function."""

    def test_encode_list_notebooks(self):
        """Test encoding list notebooks request."""
        params = [None, 1, None, [2]]
        result = encode_rpc_request(RPCMethod.LIST_NOTEBOOKS, params)

        assert isinstance(result, list)
        assert len(result) == 1
        assert len(result[0]) == 1

        inner = result[0][0]
        assert inner[0] == RPCMethod.LIST_NOTEBOOKS.value
        assert inner[2] is None
        assert inner[3] == "generic"

        decoded_params = json.loads(inner[1])
        assert decoded_params == [None, 1, None, [2]]
```

**Patterns:**

1. **Single assertion per behavior** — Each test asserts one specific behavior
   ```python
   def test_params_json_no_spaces(self):
       """Ensure params are JSON-encoded without spaces (compact)."""
       params = [{"key": "value"}, [1, 2, 3]]
       result = encode_rpc_request(RPCMethod.LIST_NOTEBOOKS, params)
       json_str = result[0][0][1]
       assert ": " not in json_str
       assert ", " not in json_str
   ```

2. **Setup pattern — Arrange, Act, Assert (AAA)**
   ```python
   def test_build_request_body(self):
       # Arrange
       rpc_request = [[[RPCMethod.LIST_NOTEBOOKS.value, "[]", None, "generic"]]]
       csrf_token = "test_token_123"
       
       # Act
       body = build_request_body(rpc_request, csrf_token)
       
       # Assert
       assert "f.req=" in body
       assert "at=test_token_123" in body
   ```

3. **CLI tests use Click's CliRunner**
   ```python
   from click.testing import CliRunner
   from notebooklm.notebooklm_cli import cli

   @pytest.fixture
   def runner():
       return CliRunner()

   def test_login_help_message(self, runner):
       result = runner.invoke(cli, ["login", "--help"])
       assert result.exit_code == 0
       assert "Log in to NotebookLM" in result.output
   ```

4. **Async test pattern — automatic with pytest-asyncio**
   ```python
   class TestAsyncClient:
       async def test_list_notebooks(self, mock_client):
           """Async test automatically handled by pytest-asyncio."""
           result = await mock_client.notebooks.list()
           assert isinstance(result, list)
   ```

## Mocking

**Framework:** Python's built-in `unittest.mock` (MagicMock, AsyncMock, patch)

**Mocking patterns:**

1. **Mock client setup** (`tests/unit/cli/conftest.py`):
   ```python
   def create_mock_client():
       """Create a properly configured mock client."""
       mock_client = MagicMock()
       mock_client.__aenter__ = AsyncMock(return_value=mock_client)
       mock_client.__aexit__ = AsyncMock(return_value=None)
       
       # Pre-create namespace mocks
       mock_client.notebooks = MagicMock()
       mock_client.sources = MagicMock()
       mock_client.artifacts = MagicMock()
       
       # Set default list implementations
       mock_client.notebooks.list = AsyncMock(
           side_effect=make_notebook_list
       )
       return mock_client
   ```

2. **Patching modules:**
   ```python
   def test_login_import_error(self, runner):
       """Test graceful handling of missing dependency."""
       with patch.dict("sys.modules", {"playwright": None}):
           result = runner.invoke(cli, ["login"])
           assert result.exit_code == 1
           assert "Playwright not installed" in result.output
   ```

3. **Patching object methods:**
   ```python
   with patch("notebooklm.cli.helpers.load_auth_from_storage") as mock:
       mock.return_value = {"SID": "test", ...}
       # Run test code
   ```

4. **Async mock for async functions:**
   ```python
   with patch("notebooklm.cli.helpers.fetch_tokens", new_callable=AsyncMock) as mock:
       mock.return_value = ("csrf_token", "session_id")
       # Run test code
   ```

5. **VCR.py for recording HTTP responses** (cassettes):
   ```python
   @pytest.mark.vcr
   async def test_with_recorded_response(self):
       """Test with pre-recorded HTTP response (VCR cassette)."""
       # HTTP call automatically replayed from tests/cassettes/test_*.yaml
       result = await client.notebooks.list()
   ```
   - Record: `NOTEBOOKLM_VCR_RECORD=1 pytest tests/unit/test_*.py`
   - Replays from cassette files automatically

**What to Mock:**
- External HTTP calls (via httpx)
- File system operations (paths, storage)
- Authentication tokens/storage
- Playwright browser automation
- Click commands (test command logic, not CLI framework)

**What NOT to Mock:**
- RPC encoding/decoding (these are low-level and important)
- Exception creation (verify real exceptions are raised)
- Type objects (dataclasses, enums)
- Pure computation functions

## Fixtures and Factories

**Test Data:**
```python
# Fixture-based (reusable across tests)
@pytest.fixture
def mock_notebook():
    """Provide a mock notebook object."""
    return MockNotebook(id="nb_123", title="Test Notebook")

# Factory-based (generate multiple variants)
class MockNotebook:
    def __init__(self, id: str, title: str = "Mock Notebook"):
        self.id = id
        self.title = title

def make_notebook_list():
    """Factory that returns a list of notebooks."""
    return [
        MockNotebook("nb_123", "Test Notebook"),
        MockNotebook("nb_456", "Another Notebook"),
    ]
```

**Location:**
- Shared fixtures: `tests/unit/conftest.py` (top level) and `tests/unit/cli/conftest.py` (for CLI tests)
- Local fixtures: in the test file where they're used
- Mock helpers: in `conftest.py` as factory functions

**CLI Fixtures** (`tests/unit/cli/conftest.py`):
```python
@pytest.fixture
def mock_auth():
    """Mock authentication from storage."""
    with patch("notebooklm.cli.helpers.load_auth_from_storage") as mock:
        mock.return_value = {
            "SID": "test", "HSID": "test", "SSID": "test",
            "APISID": "test", "SAPISID": "test",
        }
        yield mock

@pytest.fixture
def mock_context_file(tmp_path):
    """Provide a temporary context file for context commands."""
    context_file = tmp_path / "context.json"
    with patch("notebooklm.cli.helpers.get_context_path", return_value=context_file):
        yield context_file

@pytest.fixture
def runner():
    """Provide a Click test runner."""
    return CliRunner()
```

## Coverage

**Requirements:** 90% branch coverage enforced
- Configuration: `pyproject.toml` [tool.coverage.report] with `fail_under = 90`
- Branch coverage: tracks both if/else branches

**View Coverage:**
```bash
# Generate coverage report
pytest --cov --cov-report=html

# View in browser
open htmlcov/index.html

# Show missing lines
pytest --cov --cov-report=term-missing
```

**Coverage Target Hierarchy:**
1. Core RPC layer (encoding, decoding) — ~95% (critical path)
2. Client APIs — ~90% (normal code)
3. CLI commands — ~85% (UI layer, harder to test)
4. E2E tests — not subject to coverage requirement (real API)

## Test Types

**Unit Tests** (`tests/unit/`):
- Scope: Individual functions, classes, modules in isolation
- Dependencies: Fully mocked (no network, no file system)
- Speed: Fast (< 100ms per test typically)
- Coverage: Every code path tested
- Examples: `test_encoder.py`, `test_decoder.py`, `test_exceptions.py`

**Integration Tests** (`tests/unit/cli/`):
- Scope: CLI commands with mocked client
- Dependencies: HTTP mocked via patches, client calls tested
- Speed: Fast (Click is synchronous, minimal async overhead)
- Examples: `test_session.py::TestLoginCommand`, `test_artifact.py::TestGenerateAudio`

**E2E Tests** (`tests/e2e/`):
- Scope: Real API calls against Google NotebookLM
- Dependencies: Real authentication, real network
- Speed: Slow (30+ seconds per test)
- Markers: `@pytest.mark.e2e` (excluded by default, run with `pytest -m e2e`)
- Requires: Valid Google account, NOTEBOOKLM_AUTH_JSON set
- Examples: `test_notebooks.py::test_create_notebook_e2e`

## Pytest Configuration

**From `pyproject.toml`:**
```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
asyncio_mode = "auto"  # auto-detect async tests
asyncio_default_fixture_loop_scope = "function"  # per-function event loop
addopts = "--ignore=tests/e2e"  # exclude e2e by default
timeout = 60  # global timeout per test
markers = [
    "e2e: end-to-end tests",
    "variants: parameter variant tests (quota-intensive)",
    "readonly: tests against user's test notebook",
    "vcr: tests using VCR cassettes"
]
```

**Global Timeout Safety Net:**
- Default: 60 seconds per test (prevents hanging tests in CI)
- Override: `@pytest.mark.timeout(120)` for specific tests needing longer

**Async Test Auto-Detection:**
- `asyncio_mode = "auto"`: automatically wraps async test functions
- No need for explicit `@pytest.mark.asyncio` marker
- Event loop created per function (new loop for each test)

## Common Patterns

**Async Testing:**
```python
class TestAsyncAPI:
    async def test_list_notebooks(self):
        """Async test - pytest-asyncio handles event loop."""
        async with mock_client() as client:
            notebooks = await client.notebooks.list()
            assert isinstance(notebooks, list)
    
    async def test_source_timeout(self):
        """Test timeout handling."""
        with pytest.raises(SourceTimeoutError) as exc_info:
            await client.sources.wait_for_ready("src_123", timeout=0.1)
        assert exc_info.value.source_id == "src_123"
        assert exc_info.value.timeout == 0.1
```

**Error Testing:**
```python
class TestErrorHandling:
    def test_source_add_error_with_cause(self):
        """Test SourceAddError includes cause chain."""
        cause = ValueError("Invalid URL")
        error = SourceAddError(
            url="http://invalid",
            cause=cause,
        )
        assert error.url == "http://invalid"
        assert error.cause is cause

    def test_rpc_error_truncates_response(self):
        """Test RPCError truncates long responses."""
        long_response = "x" * 1000
        error = RPCError(
            message="Failed",
            raw_response=long_response,
        )
        assert len(error.raw_response) == 500  # truncated
```

**Parametrized Tests:**
```python
import pytest

class TestEncoderVariants:
    @pytest.mark.parametrize("method,params,expected", [
        (RPCMethod.LIST_NOTEBOOKS, [None, 1, None, [2]], "list"),
        (RPCMethod.CREATE_NOTEBOOK, ["Test", None, None, [2], [1]], "create"),
    ])
    @pytest.mark.variants  # Skip by default (saves quota)
    def test_rpc_methods(self, method, params, expected):
        """Test various RPC method encodings."""
        result = encode_rpc_request(method, params)
        assert result[0][0][0] == method.value
```

**CLI Test with Fixtures:**
```python
class TestArtifactCommands:
    def test_download_audio(self, runner, mock_auth, mock_context_file):
        """Test artifact download command."""
        with patch_main_cli_client() as mock_cls:
            mock_client = create_mock_client()
            mock_client.artifacts.download_audio = AsyncMock(
                return_value=b"audio data"
            )
            mock_cls.return_value = mock_client
            
            result = runner.invoke(cli, ["download", "audio", "art_1"])
            assert result.exit_code == 0
            assert "Downloaded" in result.output
```

**Testing Deprecation Warnings:**
```python
def test_deprecated_attribute(self):
    """Test deprecated attribute emits warning."""
    with pytest.warns(DeprecationWarning, match="old_attribute is deprecated"):
        value = client.old_attribute
    assert value == client.new_attribute
```

## Test Markers

```bash
# Run only e2e tests
pytest tests/e2e -m e2e

# Skip variant tests (quota-intensive)
pytest -m "not variants"

# Run readonly tests (against user's notebook)
pytest -m readonly

# Run with VCR cassettes
pytest -m vcr
```

---

*Testing analysis: 2026-04-18*
