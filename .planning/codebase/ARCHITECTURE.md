# Architecture

**Analysis Date:** 2026-04-18

## Pattern Overview

**Overall:** Layered API client architecture with namespace-driven sub-client pattern

**Key Characteristics:**
- Async-first design using Python's `asyncio`
- RPC-based communication with Google's internal batchexecute protocol
- Namespaced sub-client APIs (notebooks, sources, artifacts, chat, etc.)
- Separation of concerns across RPC, core, and domain API layers
- Credential-based authentication with token storage

## Layers

**RPC Layer:**
- Purpose: Encode requests and decode responses for Google's undocumented batchexecute protocol
- Location: `src/notebooklm/rpc/`
- Contains: Method ID enums, request encoding, response parsing
- Depends on: None (standalone protocol layer)
- Used by: Core layer for all API communication

**Core Layer:**
- Purpose: HTTP client lifecycle, RPC call abstraction, authentication headers, conversation caching
- Location: `src/notebooklm/_core.py`
- Contains: `ClientCore` class managing HTTP sessions, RPC call routing, auth error detection
- Depends on: RPC layer, httpx for HTTP
- Used by: All domain APIs (NotebooksAPI, ArtifactsAPI, etc.)

**Client Layer (Domain APIs):**
- Purpose: High-level API abstractions organized by domain
- Location: `src/notebooklm/` with files named `_<domain>.py` (e.g., `_notebooks.py`, `_artifacts.py`, `_chat.py`)
- Contains: Domain-specific API classes (NotebooksAPI, SourcesAPI, ArtifactsAPI, ChatAPI, ResearchAPI, NotesAPI, SettingsAPI, SharingAPI)
- Depends on: Core layer for RPC execution
- Used by: Main client and CLI layer

**Main Client:**
- Purpose: Entry point that aggregates all domain APIs under namespaces
- Location: `src/notebooklm/client.py`
- Contains: `NotebookLMClient` class with properties for each API namespace
- Depends on: All domain API modules
- Used by: Public API consumers and CLI layer

**CLI Layer:**
- Purpose: Command-line interface wrapping the Python API
- Location: `src/notebooklm/cli/`
- Contains: Click command groups for notebooks, sources, artifacts, chat, research, notes, downloads, etc.
- Depends on: Main client layer, helpers for formatting/output
- Used by: End users via `notebooklm` command

## Data Flow

**Notebook Creation Flow:**

1. User calls `client.notebooks.create(name)`
2. `NotebooksAPI._create()` builds RPC params for `CREATE_NOTEBOOK` method
3. `ClientCore.rpc_call()` routes to RPC layer
4. `rpc.encoder.encode_rpc_request()` serializes request payload
5. `httpx` sends POST to `https://notebooklm.google.com/_/LabsTailwindUi/data/batchexecute`
6. Google API responds with batchexecute format
7. `rpc.decoder.decode_response()` parses response
8. `NotebooksAPI` wraps result in dataclass and returns

**Chat Query Flow:**

1. User calls `client.chat.ask(notebook_id, question)`
2. `ChatAPI.ask()` calls `ClientCore.stream_rpc_call()` to stream responses
3. `QUERY_URL` endpoint returns streaming JSON chunks
4. `rpc.decoder.decode_stream()` parses incremental chunks
5. Yields message content as it arrives
6. Final response wrapped in `ChatResponse` dataclass

**State Management:**

- **Auth State:** Stored in `AuthTokens` (cookies, CSRF token, session ID)
- **Conversation Cache:** `ClientCore` maintains OrderedDict of `(notebook_id, conversation_id)` pairs with FIFO eviction (max 100)
- **Session State:** HTTP session lifecycle managed by `ClientCore.__aenter__` / `__aexit__`
- **User Settings:** Retrieved per-session via `GET_USER_SETTINGS` RPC call

## Key Abstractions

**NotebookLMClient:**
- Purpose: Main facade providing namespaced access to all APIs
- Examples: `client/client.py`
- Pattern: Composition of domain API instances as properties

**AuthTokens:**
- Purpose: Encapsulates Google authentication credentials
- Examples: `src/notebooklm/auth.py`
- Pattern: Dataclass storing cookies, CSRF token, session ID with serialization methods

**RPC Method Enums:**
- Purpose: Central registry of obfuscated Google API method IDs
- Examples: `src/notebooklm/rpc/types.py` (RPCMethod enum with LIST_NOTEBOOKS, CREATE_NOTEBOOK, etc.)
- Pattern: String enum allowing import of method names with automatic value mapping

**Domain API Classes:**
- Purpose: Namespace-specific API implementations
- Examples: `NotebooksAPI`, `SourcesAPI`, `ArtifactsAPI`, `ChatAPI`
- Pattern: Each takes `ClientCore` in constructor, exposes public methods calling `rpc_call()` or `stream_rpc_call()`

**Response Dataclasses:**
- Purpose: Type-safe response objects
- Examples: `Notebook`, `Source`, `Artifact`, `ChatResponse` in `src/notebooklm/types.py`
- Pattern: Frozen dataclasses with field validation

## Entry Points

**Python API:**
- Location: `src/notebooklm/client.py`
- Triggers: `NotebookLMClient.from_storage()` or `NotebookLMClient(auth)`
- Responsibilities: Initialize client, manage HTTP session, provide namespace APIs

**CLI Entry Point:**
- Location: `src/notebooklm/notebooklm_cli.py`
- Triggers: `notebooklm` command invocation
- Responsibilities: Parse commands, route to Click command groups, format output

**Authentication:**
- Location: `src/notebooklm/auth.py` and `src/notebooklm/cli/session.py`
- Triggers: `notebooklm login` command or `AuthTokens.from_storage()`
- Responsibilities: Browser-based OAuth flow, token storage, credential refresh

## Error Handling

**Strategy:** Hierarchical exception types with context-specific handling

**Patterns:**

- `RPCError` base class with subclasses: `AuthError`, `NetworkError`, `RateLimitError`, `ServerError`, `ClientError`, `RPCTimeoutError`
- Example `AuthError` detection in `src/notebooklm/_core.py:is_auth_error()` checking patterns like "authentication", "expired", "unauthorized"
- Rate limit detection via `429` HTTP status code with exponential backoff retry logic
- Network errors wrapped with timeout context (connection vs. request timeout)
- All CLI commands wrapped in try/catch with human-friendly error messages via `src/notebooklm/cli/error_handler.py`

## Cross-Cutting Concerns

**Logging:** Python logging configured via `src/notebooklm/_logging.py`, module-level loggers in each class

**Validation:** 
- Request params validated before RPC call (e.g., notebook_id format checks)
- Response parsing validates required fields in dataclass initialization
- Source URL validation in `_url_utils.py`

**Authentication:**
- Automatic auth error detection and callback for token refresh
- `ClientCore` supports refresh_callback for re-authentication flows
- Session ID and CSRF token sent in all batch execute requests

**Conversation Caching:**
- `ClientCore.conversation_cache` implements LRU cache (max 100 entries)
- Used to avoid redundant `GET_LAST_CONVERSATION_ID` calls
- Evicted on overflow using OrderedDict

---

*Architecture analysis: 2026-04-18*
