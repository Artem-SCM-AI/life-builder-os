# Codebase Structure

**Analysis Date:** 2026-04-18

## Directory Layout

```
/Users/artem/Claude v 1.0/
├── .agents/                      # Agent skill definitions (200+ skills)
├── .claude/                      # Claude Code workspace metadata
├── .planning/                    # Planning and codebase analysis docs
│   └── codebase/                # Architecture/structure documents
├── .git/                         # Git repository metadata
├── notebooklm-py/               # Main Python package (NotebookLM API client)
│   ├── src/notebooklm/          # Source code
│   │   ├── __init__.py          # Public API exports
│   │   ├── client.py            # Main NotebookLMClient
│   │   ├── auth.py              # Authentication handling
│   │   ├── types.py             # Response dataclasses
│   │   ├── _core.py             # Core HTTP/RPC infrastructure
│   │   ├── _notebooks.py        # NotebooksAPI
│   │   ├── _sources.py          # SourcesAPI
│   │   ├── _artifacts.py        # ArtifactsAPI
│   │   ├── _chat.py             # ChatAPI
│   │   ├── _research.py         # ResearchAPI
│   │   ├── _notes.py            # NotesAPI
│   │   ├── _settings.py         # SettingsAPI
│   │   ├── _sharing.py          # SharingAPI
│   │   ├── _url_utils.py        # URL validation helpers
│   │   ├── notebooklm_cli.py    # CLI entry point
│   │   ├── exceptions.py        # Custom exception classes
│   │   ├── rpc/                 # RPC protocol layer
│   │   │   ├── types.py         # Method IDs and enums
│   │   │   ├── encoder.py       # Request encoding
│   │   │   └── decoder.py       # Response parsing
│   │   └── cli/                 # CLI commands
│   │       ├── __init__.py      # Click group setup
│   │       ├── session.py       # login, use, status, clear commands
│   │       ├── notebook.py      # list, create, delete, rename commands
│   │       ├── source.py        # source add, list, delete commands
│   │       ├── artifact.py      # artifact list, delete commands
│   │       ├── generate.py      # generate audio/video/etc commands
│   │       ├── download.py      # download audio/video/etc commands
│   │       ├── chat.py          # ask, configure commands
│   │       ├── note.py          # note create, list, delete commands
│   │       ├── research.py      # research commands
│   │       ├── helpers.py       # Shared CLI utilities
│   │       └── error_handler.py # Error formatting
│   ├── tests/                   # Test suite
│   │   ├── unit/                # Unit tests (no network)
│   │   ├── integration/         # Integration tests (mocked HTTP)
│   │   └── e2e/                 # End-to-end tests (real API)
│   └── docs/                    # Documentation
├── website-project/             # Secondary project with DESIGN_SYSTEM.md + ENGINEERING_GUIDE.md
├── skills/                      # Custom Claude Code skills
│   └── notebooklm/             # NotebookLM skill wrapper
├── package.json                 # Root dependencies (ai-codex)
├── CLAUDE.md                    # Main project instructions
└── artem_profile.md            # User context and background
```

## Directory Purposes

**notebooklm-py:**
- Purpose: Complete Python client for Google NotebookLM automation
- Contains: Source code, tests, documentation
- Key files: `src/notebooklm/client.py` (entry point), `src/notebooklm/rpc/types.py` (RPC method registry)

**notebooklm-py/src/notebooklm:**
- Purpose: Main package source
- Contains: Client implementation, API layers, CLI, RPC protocol
- Key files: See layout above

**notebooklm-py/src/notebooklm/rpc:**
- Purpose: RPC protocol abstraction layer
- Contains: Google's batchexecute protocol encoding/decoding, method ID registry
- Key files: `types.py` (method IDs), `encoder.py` (request serialization), `decoder.py` (response parsing)

**notebooklm-py/src/notebooklm/cli:**
- Purpose: Command-line interface
- Contains: Click command groups organized by domain (notebooks, sources, artifacts, etc.)
- Key files: `session.py` (auth), `notebook.py` (CRUD), `generate.py` (artifact generation), `download.py` (file downloads)

**notebooklm-py/tests:**
- Purpose: Test suite
- Contains: Unit, integration, and end-to-end tests
- Organization: Mirrors source structure with `_test.py` suffix

**.agents/skills:**
- Purpose: Claude Code skill definitions (agent templates)
- Contains: 200+ skills for various programming domains
- Notable: Each skill has `SKILL.md` + optional `rules/` subdirectory

**.planning/codebase:**
- Purpose: Architecture and structure analysis documents
- Contains: ARCHITECTURE.md, STRUCTURE.md (this file)
- Created by: `/gsd-map-codebase` agent

**website-project:**
- Purpose: Secondary project with full documentation guides
- Contains: CLAUDE.md (workflow), DESIGN_SYSTEM.md (UI standards), ENGINEERING_GUIDE.md (code quality)

## Key File Locations

**Entry Points:**

- `notebooklm-py/src/notebooklm/client.py`: Main `NotebookLMClient` class — entry for Python API consumers
- `notebooklm-py/src/notebooklm/notebooklm_cli.py`: CLI entry point — invoked by `notebooklm` command
- `notebooklm-py/src/notebooklm/__init__.py`: Public API exports (NotebookLMClient, AuthTokens, exceptions)

**Configuration:**

- `notebooklm-py/src/notebooklm/auth.py`: Authentication storage paths and token management
- `notebooklm-py/src/notebooklm/paths.py`: Configuration directory resolution
- `notebooklm-py/pyproject.toml`: Package metadata, dependencies, version

**Core Logic:**

- `notebooklm-py/src/notebooklm/_core.py`: HTTP client, RPC call routing, auth error detection
- `notebooklm-py/src/notebooklm/rpc/types.py`: RPC method ID registry (source of truth for API)
- `notebooklm-py/src/notebooklm/rpc/encoder.py`: Request payload construction
- `notebooklm-py/src/notebooklm/rpc/decoder.py`: Response parsing and validation

**Testing:**

- `notebooklm-py/tests/unit/`: Unit tests for encoding/decoding, utilities
- `notebooklm-py/tests/integration/`: Mocked HTTP tests for API layer
- `notebooklm-py/tests/e2e/`: Real API tests (require authentication)
- `notebooklm-py/tests/conftest.py`: Pytest fixtures and configuration

## Naming Conventions

**Files:**

- `_<domain>.py`: Domain API modules (e.g., `_notebooks.py`, `_artifacts.py`)
- `*_test.py`: Test files mirror source structure
- `test_<module>.py`: Alternative test naming in some tests/
- `.md`: Documentation (uppercase titles: ARCHITECTURE.md, STRUCTURE.md)

**Directories:**

- lowercase-kebab: Documentation directories (`docs/`)
- lowercase-underscore: Python packages (`src/notebooklm/`)
- lowercase: Skill names (`.agents/skills/django-patterns/`)

**Classes:**

- PascalCase for API classes: `NotebookLMClient`, `NotebooksAPI`, `AuthTokens`
- Prefixed with underscore for internal: `ClientCore` (in `_core.py`)

**Functions/Methods:**

- snake_case for public methods: `from_storage()`, `create_notebook()`
- PascalCase for enum values: `CREATE_NOTEBOOK`, `LIST_ARTIFACTS` (in `RPCMethod`)

**Constants:**

- SCREAMING_SNAKE_CASE: `MAX_CONVERSATION_CACHE_SIZE`, `DEFAULT_TIMEOUT`
- Enum members: Match PascalCase (e.g., `RPCMethod.CREATE_NOTEBOOK`)

## Where to Add New Code

**New Feature (e.g., "Add notebook export"):**
- Primary code: Add method to domain API class (e.g., `NotebooksAPI.export()` in `src/notebooklm/_notebooks.py`)
- RPC layer: Add method ID to `RPCMethod` enum in `src/notebooklm/rpc/types.py`
- Response type: Add dataclass to `src/notebooklm/types.py`
- CLI: Add command to appropriate CLI module (e.g., `src/notebooklm/cli/notebook.py`)
- Tests: Add unit test in `tests/unit/test_notebooks.py`, integration test in `tests/integration/test_notebooks.py`, E2E in `tests/e2e/test_notebooks.py`

**New API Namespace (e.g., "Add template management"):**
- Create `src/notebooklm/_templates.py` with `TemplatesAPI` class
- Add class to `src/notebooklm/client.py` as property `self.templates = TemplatesAPI(self._core)`
- Export in `src/notebooklm/__init__.py`
- Create CLI module `src/notebooklm/cli/template.py` with Click commands
- Register in `src/notebooklm/cli/__init__.py`

**Utilities/Helpers:**

- Shared RPC helpers: `src/notebooklm/rpc/` (encoder/decoder)
- Shared CLI helpers: `src/notebooklm/cli/helpers.py`
- URL/string utilities: `src/notebooklm/_url_utils.py`

**New Exception Type:**

- Add to `src/notebooklm/exceptions.py` inheriting from appropriate base (RPCError, etc.)
- Export in `src/notebooklm/__init__.py`

## Special Directories

**rpc/:**
- Purpose: Encapsulates Google's undocumented batchexecute protocol
- Generated: No (hand-maintained)
- Committed: Yes
- Critical: Method IDs in `types.py` are reverse-engineered and subject to breakage

**cli/:**
- Purpose: Command-line interface layer
- Generated: No
- Committed: Yes
- Pattern: Each module corresponds to a Click command group

**.agents/skills/:**
- Purpose: Agent skill registry (not part of notebooklm-py package)
- Generated: No (community maintained)
- Committed: Yes
- Contains: 200+ skills for various programming patterns/domains

**tests/e2e/:**
- Purpose: End-to-end tests requiring real Google authentication
- Generated: No
- Committed: Yes (but marked with `@pytest.mark.e2e`)
- Note: Skipped by default pytest run, enabled with `pytest -m e2e`

---

*Structure analysis: 2026-04-18*
