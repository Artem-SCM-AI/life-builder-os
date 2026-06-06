# Coding Conventions

**Analysis Date:** 2026-04-18

## Naming Patterns

**Files:**
- Modules: lowercase with underscores (`_sources.py`, `_artifacts.py`, `_core.py`)
- Private modules: leading underscore (`_logging.py`, `_version_check.py`)
- Test files: test_*.py (`test_encoder.py`, `test_session.py`)
- Package structure: `src/notebooklm/` is the main package, `tests/` contains tests

**Functions:**
- Snake case: `configure_logging()`, `build_request_body()`, `get_context_path()`
- Private functions: leading underscore (`_ensure_chromium_installed()`, `_sync_server_language_to_config()`)
- Async functions: same naming, clearly async context needed by callers
- Class methods: snake case (`add_source()`, `list_notebooks()`, `generate_audio()`)

**Variables:**
- Snake case: `csrf_token`, `source_id`, `notebook_id`, `mock_client`
- Constants: UPPER_CASE (`NOTEBOOKLM_URL`, `DEFAULT_TIMEOUT`, `LOGIN_MAX_RETRIES`)
- Private: leading underscore (`_core`, `_mocks`, `_primary`)

**Types:**
- Classes: PascalCase (`NotebookLMClient`, `NotebooksAPI`, `SourcesAPI`)
- Dataclasses: PascalCase (`Notebook`, `Source`, `Artifact`, `AuthTokens`)
- Enums: PascalCase (`SourceType`, `ArtifactType`, `RPCMethod`)
- Enum values: UPPER_CASE or lowercase depending on context (see below)

**Type Enum Values:**
- User-facing str enums (`.kind` property): lowercase_with_underscores (`"web_page"`, `"google_docs"`, `"pasted_text"`)
- RPC method IDs: UPPER_CASE constants (`LIST_NOTEBOOKS`, `CREATE_NOTEBOOK`, `ADD_SOURCE`)
- Status strings: lowercase_with_underscores (`"processing"`, `"ready"`, `"error"`)

## Code Style

**Formatting:**
- Tool: ruff format
- Quote style: double quotes (`"string"`)
- Indent: 4 spaces
- Line length: 100 characters (enforced by ruff)
- Configuration: `pyproject.toml` [tool.ruff] section

**Linting:**
- Tool: ruff check
- Rules: E (pycodestyle errors), W (warnings), F (pyflakes), I (isort), B (flake8-bugbear), C4 (comprehensions), UP (pyupgrade), SIM (simplify)
- Exceptions: E501 (line too long, handled by formatter), B008 (Click uses function calls in defaults), SIM102 (nested ifs kept for readability in complex parsing), SIM105 (explicit try/except clearer than contextlib.suppress for parsing)
- Per-file exclusions: E402 in `__init__.py` for version checks, `notebooklm_cli.py` for setup

**Import Organization:**
Order (enforced by ruff isort):
1. `from __future__ import` statements (absolute_import, annotations, etc.)
2. Standard library imports (json, logging, asyncio, pathlib, etc.)
3. Third-party imports (httpx, click, rich, pytest, etc.)
4. Local imports (from .auth, from ..types, etc.)

Path aliases (from `pyproject.toml`):
- `known-first-party = ["notebooklm"]` — imports from notebooklm package are recognized as first-party

**Example import block** (`src/notebooklm/client.py`):
```python
import logging
import re
from pathlib import Path

from ._artifacts import ArtifactsAPI
from ._chat import ChatAPI
from ._core import DEFAULT_TIMEOUT, ClientCore
from .auth import AuthTokens
```

## Error Handling

**Exception Hierarchy:** All exceptions inherit from `NotebookLMError` base class
- Location: `src/notebooklm/exceptions.py`
- Categories: ValidationError, ConfigurationError, NetworkError, RPCError (with subclasses), domain errors (NotebookError, SourceError, ArtifactError, ChatError)

**Raising Exceptions:**
```python
# With context
raise SourceAddError(
    url=url,
    cause=original_exception,
    message="Custom message if needed"
)

# With error codes for RPC
raise RPCError(
    message="Human-readable message",
    method_id=rpc_method_id,
    raw_response=response_preview,
    rpc_code=error_code,
    found_ids=detected_ids
)
```

**Catching Exceptions:**
```python
# Catch all library errors
try:
    await client.notebooks.list()
except NotebookLMError as e:
    handle_error(e)

# Catch specific domain error
try:
    await client.sources.add_url(nb_id, url)
except SourceAddError as e:
    print(f"Failed to add {e.url}: {e.cause}")
```

**Custom Exception Attributes:**
Domain exceptions include structured attributes for debugging:
- `SourceAddError`: `.url`, `.cause`
- `ArtifactDownloadError`: `.artifact_type`, `.artifact_id`, `.details`
- `RPCError`: `.method_id`, `.raw_response` (truncated to 500 chars), `.rpc_code`, `.found_ids`
- `RateLimitError`: inherits RPCError + `.retry_after` (seconds)
- `ServerError` / `ClientError`: `.status_code` (HTTP)

## Logging

**Framework:** Python's standard `logging` module with CLI output via `rich`

**Configuration:** `src/notebooklm/_logging.py`
- Environment variable: `NOTEBOOKLM_LOG_LEVEL` (DEBUG, INFO, WARNING default, ERROR)
- Legacy: `NOTEBOOKLM_DEBUG_RPC=1` sets DEBUG level
- Format: `"%(asctime)s %(levelname)s [%(name)s] %(message)s"` with time format `"%H:%M:%S"`
- Setup: Call `configure_logging()` once (idempotent) before logging

**Logger Naming:**
```python
logger = logging.getLogger(__name__)  # Module-level logger

# Examples:
# src/notebooklm/client.py → notebooklm.client
# src/notebooklm/cli/session.py → notebooklm.cli.session
# src/notebooklm/rpc/encoder.py → notebooklm.rpc.encoder
```

**Usage Pattern:**
```python
import logging

logger = logging.getLogger(__name__)

logger.debug("Low-level details, usually RPC payload")
logger.info("Important state changes, successful operations")
logger.warning("Recoverable issues, deprecations")
logger.error("Error with context (exception will be raised)")
```

**CLI Output:** Use `rich` console for user-facing output
```python
from .helpers import console

console.print("Success message", style="green")
console.print("[red]Error[/red]")
```

## Comments

**When to Comment:**
- Complex RPC parameter nesting (nested lists with varying depths)
- Non-obvious data transformations
- Known API quirks or Google-specific behaviors
- Why something is done a certain way (not what it does)

**Avoid Commenting:**
- Self-explanatory code
- Function names that describe the operation
- Type hints (they document intent)

**JSDoc/Docstrings:**
Use triple-quote docstrings on all public classes, functions, and modules.

**Module docstrings** (all source files):
```python
"""Brief module purpose.

Longer explanation if needed. Include usage examples for public APIs.

Example:
    from notebooklm import NotebookLMClient

    async with NotebookLMClient.from_storage() as client:
        notebooks = await client.notebooks.list()
"""
```

**Function/Method docstrings:**
```python
def add_source(notebook_id: str, url: str) -> Source:
    """Add a web source to a notebook.

    Args:
        notebook_id: The target notebook ID.
        url: The URL to add.

    Returns:
        The created Source object.

    Raises:
        SourceAddError: If URL is invalid or inaccessible.
    """
```

**Class docstrings:**
```python
class NotebookLMClient:
    """Async client for NotebookLM API.

    Provides namespaced access:
    - notebooks: Notebook operations
    - sources: Source management

    Usage:
        async with NotebookLMClient.from_storage() as client:
            notebooks = await client.notebooks.list()
    """
```

## Function Design

**Size:** Functions should be focused and testable, typically 20-50 lines
- Larger functions break down into smaller helpers
- Async functions may be longer if handling multiple states

**Parameters:**
- Use type hints on all parameters: `def func(x: str, y: int = 5) -> bool:`
- Default values only for optional parameters
- Keyword-only arguments for clarity: `def __init__(self, *, timeout: float = 30)`
- Dataclass instances preferred over multiple scalar parameters

**Return Values:**
- Always include return type hint: `-> Optional[Notebook]`, `-> list[Source]`
- Return dataclass instances from API methods (not dicts)
- Return None or raise exception, never return falsy values to indicate error

**Async Design:**
```python
# All client API methods are async
async def list(self) -> list[Notebook]:
    """List notebooks."""

# Use `async with` for resource management
async with NotebookLMClient.from_storage() as client:
    ...

# Don't mix sync and async unnecessarily
# CLI commands delegate to sync helpers that call async client methods
def sync_wrapper():
    """Sync CLI command that calls async client."""
    client = get_client()  # Handles async context
    result = run_async(client.api_method())
```

## Module Design

**Exports:**
All public APIs listed in `__all__`:
```python
__all__ = [
    "NotebookLMClient",
    "Notebook",
    "Source",
    "ArtifactError",
    # ... other public items
]
```

**Barrel Files (Package Exports):**
- `src/notebooklm/__init__.py`: Aggregates all public classes, exceptions, types
- `src/notebooklm/cli/__init__.py`: Aggregates click command groups

**Import Organization by Layer:**
1. **RPC Layer** (`rpc/`): Encoding, decoding, types — no client dependencies
2. **Core Layer** (`_core.py`): HTTP client, auth handling — depends on RPC layer
3. **API Layer** (`_sources.py`, `_artifacts.py`, etc.): Domain APIs — depend on core
4. **Client Layer** (`client.py`): Main client, composes APIs — depends on API layer
5. **CLI Layer** (`cli/`): Click commands — depends on client

**Namespace APIs:**
```python
class NotebookLMClient:
    def __init__(self, auth: AuthTokens, ...):
        self.notebooks = NotebooksAPI(self._core)
        self.sources = SourcesAPI(self._core)
        self.artifacts = ArtifactsAPI(self._core, ...)
        self.chat = ChatAPI(self._core)

# Usage: always via namespace
await client.notebooks.list()
await client.sources.add_url(nb_id, url)
```

## Deprecation Handling

**Deprecation Pattern:**
```python
import warnings

@property
def old_attribute(self):
    """Deprecated, use new_attribute instead."""
    warnings.warn(
        "old_attribute is deprecated, use new_attribute instead. "
        "Will be removed in v0.5.0.",
        DeprecationWarning,
        stacklevel=2
    )
    return self.new_attribute
```

**Deprecation Timeline:**
- Include removal version in message
- Maintain backward compat for at least 1-2 releases
- Update CHANGELOG when deprecating

## Type Hints

**Coverage:** All public APIs have complete type hints
- Parameters: always typed
- Return values: always typed
- Class attributes: typed with `attr: Type = default`

**Union Types:**
- Use `X | Y` (PEP 604) not `Union[X, Y]`
- Optional: `X | None` not `Optional[X]`
- Requires `from __future__ import annotations` at top of file

**Complex Types:**
```python
from collections.abc import Iterator
from typing import Any

def generator_fn() -> Iterator[str]:
    ...

def flexible_fn(data: Any) -> dict[str, Any]:
    ...
```

---

*Convention analysis: 2026-04-18*
