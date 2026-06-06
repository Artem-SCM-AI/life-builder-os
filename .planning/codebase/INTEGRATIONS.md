# External Integrations

**Analysis Date:** 2026-04-18

## APIs & External Services

### Google NotebookLM (Primary Service)

**Purpose:** Main service for notebook automation, research, artifact generation
  - **API Type:** Undocumented RPC (batchexecute protocol)
  - **Endpoint:** `https://notebooklm.google.com/_/LabsTailwindUi/data/batchexecute`
  - **Streaming Endpoint:** `https://notebooklm.google.com/_/LabsTailwindUi/data/google.internal.labs.tailwind.orchestration.v1.LabsTailwindOrchestrationService/GenerateFreeFormStreamed`
  - **Upload Endpoint:** `https://notebooklm.google.com/upload/_/`
  - **Authentication:** CSRF token (SNlM0e) + Session token (FdrFJe)
  - **Client Library:** `src/notebooklm/client.py` (NotebookLMClient)
  - **RPC Method IDs:** `src/notebooklm/rpc/types.py` (obfuscated, subject to change)

**Supported Operations:**
  - Notebook management (list, create, rename, delete)
  - Source management (add URL/text/YouTube/PDF, delete, refresh)
  - AI queries (ask questions, summarize)
  - Artifact generation (audio, video, slides, report, quiz, mind map, infographic, data table)
  - Research (fast research, deep research, import)
  - Note-taking (create notes, mind maps)
  - Notebook sharing (set visibility, permissions)
  - User settings (output language configuration)

**Authentication Flow:**
  1. Browser login: `notebooklm login` → Launches Playwright browser
  2. Google OAuth: User authenticates with Google
  3. Cookie capture: Playwright saves session to `~/.notebooklm/auth/storage_state.json`
  4. Token extraction: Client fetches CSRF + session tokens on demand from homepage
  5. Token refresh: Auto-refresh on 401/403 errors

**Environment Variables:**
  - `NOTEBOOKLM_STORAGE_DIR` - Override default storage path
  - `NOTEBOOKLM_VCR_RECORD` - Record VCR cassettes (test mode)

**Risks:**
  - **Critical:** Google can change RPC method IDs at any time (undocumented API)
  - **Session expiry:** CSRF/session tokens expire after time window
  - **Rate limiting:** Bulk operations may trigger rate limits (add delays)
  - **Breakage:** API changes not backward-compatible

**Monitoring:**
  - Check network requests for new method IDs
  - Monitor test failures (cassettes may become invalid)

### Google Authentication (OAuth)

**Service:** Google OAuth 2.0
  - **Purpose:** Authenticate user for NotebookLM access
  - **Flow:** Browser-based (Playwright automation)
  - **Cookies Captured:**
    - `SID` (Session ID, minimum required)
    - Regional variants: `.google.com`, `.google.com.sg`, `.google.co.uk`, etc.
    - Domain variants: `.googleusercontent.com` (for media downloads)
  - **Supported Regional ccTLDs:** 30+ countries (see `auth.py:GOOGLE_REGIONAL_CCTLDS`)
  - **Token Validity:** Session-based (expires after inactivity)

### Google Content Servers (for Media Downloads)

**Service:** Google storage for generated media
  - **Purpose:** Download generated artifacts (audio, video, PDFs)
  - **Domain:** `.googleusercontent.com`
  - **Authentication:** Reuses session cookies from NotebookLM auth
  - **Client Library:** `httpx.AsyncClient` with `.googleusercontent.com` cookies
  - **Usage:** `src/notebooklm/cli/download_helpers.py` (video/audio/PDF download)

## Data Storage

**Databases:**
  - **None** - This is a client library only
  - No persistent data storage in the package
  - All state is server-side (Google NotebookLM)

**Local File Storage (Client-side):**
  - **Authentication State:** `~/.notebooklm/auth/storage_state.json`
    - Format: Playwright storage state (JSON, contains session cookies)
    - Sensitive: YES (contains session credentials)
  - **Configuration:** `~/.notebooklm/config/`
    - Downloaded artifact cache
    - CLI history (if stored)
  - **Path Management:** `src/notebooklm/paths.py` (handles home directory resolution)

**Caching:**
  - **Conversation Cache:** In-memory LRU cache (max 100 conversations)
  - **Location:** `src/notebooklm/_core.py:ClientCore` (OrderedDict-based)
  - **Purpose:** Avoid re-fetching conversation context

## Authentication & Identity

**Auth Provider:**
  - **Google OAuth 2.0** (via Playwright browser automation)
  - **Implementation:** `src/notebooklm/auth.py`
  - **Methods:**
    1. **Browser Login:** `notebooklm login` → Interactive browser
    2. **Storage State Load:** `AuthTokens.from_storage()` → Read saved cookies
    3. **Token Fetch:** `fetch_tokens(http_client)` → Extract CSRF + session from homepage

**Token Types:**
  - **CSRF Token (SNlM0e):** RPC request signing
  - **Session Token (FdrFJe):** Request authorization
  - **Session Cookies:** `SID`, regional variants, `.googleusercontent.com` cookies
  - **Extraction:** `src/notebooklm/auth.py:fetch_tokens()` → Regex parsing from HTML

**Security:**
  - Path traversal protection on all file operations
  - Storage state file permissions (restricted to user)
  - Token refresh on auth failures (401/403)

## Monitoring & Observability

**Error Tracking:**
  - **None configured** - No Sentry/Rollbar integration
  - Errors logged locally via Python logging

**Logging:**
  - **Framework:** Python `logging` module
  - **Configuration:** `src/notebooklm/_logging.py`
  - **Levels:** INFO (default), DEBUG (verbose), WARNING, ERROR
  - **Usage:** `logger = logging.getLogger(__name__)` throughout codebase
  - **CLI Logging:** Controlled by `--verbose` flag

**Debugging:**
  - **Network Traffic Capture:** Manual via browser DevTools or MCP chrome-devtools
  - **RPC Debugging:** `src/notebooklm/rpc/decoder.py` logs response structures
  - **Test Debugging:** VCR cassettes record/replay HTTP for reproducibility

## CI/CD & Deployment

**Hosting:**
  - **PyPI:** Package distribution (notebooklm-py)
  - **GitHub:** Source code (github.com/teng-lin/notebooklm-py)
  - **No deployment service:** Pure Python package

**CI Pipeline:**
  - **Status:** Configured (checks mentioned in CLAUDE.md)
  - **Tools:** GitHub Actions (inferred from `gh pr checks` commands in docs)
  - **Checks:**
    - Pytest (unit + integration tests)
    - Ruff linting and formatting
    - Mypy type checking
    - Coverage (90% minimum)
  - **E2E Tests:** Marked `@pytest.mark.e2e`, skipped by default (require auth)

**Test Categories:**
  - **Unit:** `tests/unit/` (encoding, decoding, no network)
  - **Integration:** `tests/integration/` (mocked HTTP via pytest-httpx)
  - **E2E:** `tests/e2e/` (real API, requires `notebooklm login`, skipped in CI)

## Environment Configuration

**Required Environment Variables:**
  - None mandatory (uses defaults)

**Optional Configuration:**
  - `NOTEBOOKLM_STORAGE_DIR` - Override `~/.notebooklm/` path
  - Test-specific:
    - `NOTEBOOKLM_VCR_RECORD=1` - Record HTTP cassettes (testing)
    - `PYTEST_TIMEOUT` - Override global test timeout

**Secrets Location:**
  - **Storage State:** `~/.notebooklm/auth/storage_state.json` (contains cookies)
  - **No .env file:** Credentials are browser-based, not env-based

**Configuration Files:**
  - `pyproject.toml` - Python/pytest/ruff/mypy config
  - `.pre-commit-config.yaml` - Pre-commit hooks
  - `.mcp.json` - MCP server (chrome-devtools)

## Webhooks & Callbacks

**Incoming Webhooks:**
  - **None** - This is a client-only library

**Outgoing Webhooks:**
  - **None** - No webhook publishing

**Callbacks:**
  - **Auth Refresh Callback:** Optional in `ClientCore.__init__()`
    - Purpose: Refresh tokens on 401/403 without blocking
    - Location: `src/notebooklm/_core.py:ClientCore.refresh_callback`

## CLI Integration

**External Service Calls:**
  - **Playwright Browser:** `src/notebooklm/cli/session.py:login()`
    - Launches browser for Google OAuth
    - Saves cookies to storage state
  - **HTTP Downloads:** `src/notebooklm/cli/download_helpers.py`
    - Downloads artifacts from Google CDN
    - Authentication via session cookies

**CLI Commands:**
  - `notebooklm login` - Authenticate with Google
  - `notebooklm use <notebook_id>` - Select active notebook
  - `notebooklm ask "question"` - Query selected notebook
  - `notebooklm generate audio` - Trigger artifact generation
  - `notebooklm download video <artifact_id>` - Download artifact

## Data Flow Summary

```
User → Browser (Playwright) → Google OAuth
                                  ↓
                          Save cookies locally
                                  ↓
        Python Client (httpx) ←—
                                  ↓
                      NotebookLM RPC API
                          (batchexecute)
                                  ↓
                    Generate artifacts, manage notebooks
```

## Breaking Change Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| RPC method ID change | All operations fail | Monitor network traffic, update `rpc/types.py` |
| Token structure change | Auth fails | Re-run `notebooklm login`, update `auth.py` |
| API response format change | Decoding fails | Update `rpc/decoder.py`, re-record VCR cassettes |
| Rate limit changes | API calls rejected | Implement exponential backoff, add delays |
| Google OAuth flow change | Login fails | Update Playwright navigation in `session.py` |

---

*Integration audit: 2026-04-18*
