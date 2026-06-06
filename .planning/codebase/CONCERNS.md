# Codebase Concerns

**Analysis Date:** 2026-04-18

## Overview

This workspace is a **multi-project monorepo** containing Artem's professional tools, documentation, and active projects. The primary concerns revolve around data integrity, project organization, configuration security, and abandoned/orphaned code patterns.

---

## Tech Debt

**Large Binary Files in Repository:**
- File: `conversations.json` (21MB)
- File: `04.16.2026 Claude export data` (3.7MB)
- Issue: These are monolithic data exports from Claude.ai that contain full conversation history and project snapshots. They are committed to git, making the repo difficult to clone and maintain.
- Impact: Repository bloat; slow clone times; difficult collaborative workflows; these files should never need git version control
- Fix approach: Add to `.gitignore` immediately. Migrate to `.planning/` directory with documentation about how to regenerate from Claude.ai exports if needed

**Untracked Files Accumulation:**
- Files: `.agents/`, `.claude/`, `skills/`, `node_modules/` (34MB), `.DS_Store`, `conversations.json`, `projects.json`, `memories.json`
- Issue: 40+ untracked files in root showing inconsistent `.gitignore` configuration. Many are generated or OS-specific and should never be committed
- Impact: Repository state is ambiguous. Future developers cannot tell what's intentional vs. accidental
- Fix approach: Strengthen `.gitignore` to explicitly exclude: `*.json` (project exports), `node_modules/`, `.DS_Store`, `.claude/`, `.agents/`, `skills/`, `conversations.json`, `projects.json`, `memories.json`, `users.json`

**Deleted Planning Files Not Removed:**
- Files: Multiple deletions show in `git status --short`: `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/config.json`, `.planning/phases/01-accuracy-validation/01-RESEARCH.md`, `.planning/research/*`
- Issue: These deletions are unstaged — the files are deleted from working directory but still in git index. This creates confusion about what's the source of truth
- Impact: Unclear which planning documents are active; potential for loss of important planning context
- Fix approach: Run `git add -A` to stage all deletions, then commit with message: "clean: remove orphaned planning files". Then establish clear planning file ownership strategy

---

## Missing Critical Configuration

**Incomplete Environment Setup Documentation:**
- File: `.env.example` exists in `notebooklm-py/` but no `.env` template in root workspace
- Issue: Workspace has multiple runtime contexts (Node.js for `ai-codex`, Python for `notebooklm-py`, documentation for `website-project`) but no unified environment configuration guide
- Impact: New contributors cannot quickly understand what environment variables are needed across the workspace
- Fix approach: Create `/root/.env.example` documenting required vars for each project section

**MCP Configuration Minimal:**
- File: `.mcp.json`
- Current state: Only one MCP server configured (`chrome-devtools`), likely incomplete
- Impact: Other MCP integrations may be missing, limiting Claude Code capabilities
- Fix approach: Document all MCP servers used across projects and ensure all are configured

---

## Security Considerations

**Secrets in JSON Exports:**
- Files: `conversations.json` (21MB), `projects.json` (1MB), `memories.json`
- Risk: Claude.ai export files may contain API keys, authentication tokens, or sensitive business information from conversations
- Current mitigation: Files are untracked in `.gitignore` (implied by git status showing them as `??`), but they are checked into git history if they were ever committed
- Recommendations: 
  1. Verify these files were never committed: `git log --all --name-only | grep "conversations.json"`
  2. If found, use `git filter-branch` to purge from history
  3. Add explicit gitignore rules: `.env.example` should never contain real credentials; use placeholders only

**Undocumented Sensitive Data Locations:**
- Issue: Artem's profile data (`artem_profile.md`, `memories.json`) contains personal identifiable information (phone number +380984812039, email eco.stepanenko@gmail.com, specific location details)
- Risk: Committed PII makes the repo a phishing/social engineering target
- Recommendations:
  1. Move sensitive personal data to `.env` or private password manager
  2. Keep only necessary professional information in committed files
  3. Document in README: "This workspace contains public professional information only; sensitive data is stored separately"

---

## Fragile Areas

**Multiple Project Guideline Documents Without Single Source of Truth:**
- Files: 
  - `/CLAUDE.md` (root, 147 lines) — workspace-wide guidance
  - `/website-project/CLAUDE.md` (428 lines) — identical to root, but different last update
  - `/website-project/ENGINEERING_GUIDE.md` (428 lines) — specific engineering standards
  - `/website-project/DESIGN_SYSTEM.md` — design standards
  - `notebooklm-py/CLAUDE.md` (175 lines) — project-specific guidance
- Issue: Three different `CLAUDE.md` files with overlapping scope. Unclear which applies when
- Impact: Developers may follow wrong guidance; changes to one are not reflected in others; confusing to determine what rules apply globally vs. per-project
- Safe modification: Establish hierarchy:
  - `/CLAUDE.md` → root workspace rules only
  - `/website-project/CLAUDE.md` → project-specific overrides + links to root
  - `notebooklm-py/CLAUDE.md` → project-specific (already correct structure)

**Abandoned Project in Version Control:**
- Directories: `GWS/` (empty), `.ai-codex/` (likely generated)
- Issue: These directories exist but are never mentioned in any documentation or referenced in any active workflow
- Impact: Orphaned code complicates understanding of active scope
- Fix approach: Document what these are or delete if truly abandoned

**NotebookLM-Py Integration Uncertainty:**
- File: `notebooklm-py/` (64MB) is a Git submodule or full copy
- Issue: CLAUDE.md mentions "RPC method IDs in `src/notebooklm/rpc/types.py` are undocumented and subject to breakage" — this is a critical fragility point that Google can break at any time
- Impact: Any automation relying on this library (including Artem's SC automation tools) could break with Google service updates
- Mitigation: Document fallback strategies and monitoring for RPC ID changes; add alerts if new NotebookLM RPC calls start failing
- Safe modification: Add `notebooklm-py/CONCERNS.md` documenting this specific risk

---

## Missing Critical Features

**No Unified Testing Strategy Across Projects:**
- Project 1: `website-project/` — has ENGINEERING_GUIDE.md with testing standards but no test files visible
- Project 2: `notebooklm-py/` — has comprehensive test suite (`tests/` directory with unit, integration, e2e)
- Project 3: Artem's SC automation tools — not found in repo yet (mentioned in CLAUDE.md as in-progress)
- Issue: Inconsistent testing culture; new projects may not follow same rigor
- Impact: Quality varies by project; integration risks
- Priority: **High** — Testing discipline is Artem's stated principle (rule 2: inventory control first, rule 3: no manual data entry)

**No CI/CD Pipeline Configured:**
- Files: `.github/workflows/` not found (checked in `notebooklm-py/`)
- Issue: Workspace has no GitHub Actions or CI configuration visible
- Impact: Pull requests cannot be automatically validated; manual testing burden
- Fix approach: Set up GitHub Actions for:
  1. Python tests (for `notebooklm-py/`)
  2. Linting/formatting (ruff, prettier)
  3. Pre-commit hook validation

**No Deployment or Release Strategy:**
- File: `notebooklm-py/CHANGELOG.md` exists but no release automation
- Issue: Manual version bumping and release process
- Impact: Slow iteration cycles; potential for human error in releases
- Fix approach: Use semantic versioning + automated GitHub release workflow

---

## Test Coverage Gaps

**Website Project Missing Tests:**
- Files: `website-project/` contains DESIGN_SYSTEM.md, ENGINEERING_GUIDE.md, CLAUDE.md but no actual code
- Issue: This appears to be documentation-only with no source code, or the source code is not in version control
- Impact: Cannot verify design/engineering guidelines are being followed
- Fix approach: Clarify scope — is this a template? An in-progress project? Add source code or document that it's template-only

**NotebookLM-Py E2E Tests May Be Fragile:**
- File: `notebooklm-py/docs/rpc-development.md` mentions RPC IDs can change
- Issue: E2E tests rely on undocumented Google internal APIs that can break without warning
- Impact: CI pipeline could suddenly fail when Google updates their RPC protocol
- Priority: **High**
- Recommendations:
  1. Add monitoring for RPC failures
  2. Document known breaking points in CONCERNS.md
  3. Create isolated test suite for RPC ID validation that fails gracefully if IDs change

---

## Performance Bottlenecks

**Large JSON Files in Memory:**
- Files: `conversations.json` (21MB), `projects.json` (1MB)
- Issue: When using `jq` or other JSON tooling on these files (as documented in CLAUDE.md: "use jq for efficient filtering"), parsing 21MB into memory can be slow on resource-constrained systems
- Impact: Slow CLI operations; potential out-of-memory errors on lower-spec machines
- Improvement path:
  1. Consider switching to jsonl (JSON lines) format for `conversations.json` to enable streaming
  2. Or export from Claude.ai in chunks rather than monolithic exports

---

## Scaling Limits

**Repository Size at Practical Limits:**
- Current: ~60MB (excluding node_modules at 34MB)
- Issue: Monolithic workspace is difficult to navigate; many unrelated projects in single repo
- Impact: 
  - Slow git operations (`git status`, `git diff`)
  - Cognitive overload — hard to understand scope
  - Difficult to assign access controls per project
- Scaling path:
  1. Consider splitting into separate repos:
     - `artem/notebooklm-py` → keep as-is
     - `artem/website-project` → new repo or remove if template-only
     - `artem/claude-workspace` → root config and guidelines
     - `artem/sc-automation-tools` → when it becomes actual code
  2. Use monorepo only if projects share dependencies/CI

**Skill Library Size:**
- Directory: `.agents/skills/` contains 200+ skill definitions (each with SKILL.md + rules/)
- Issue: This is a massive collection that is never used by Artem's own projects
- Impact: Repository bloat; distraction during navigation
- Fix approach: Move to `.gitignore` or document why it's needed. If it's a shared library, establish ownership and update frequency

---

## Dependencies at Risk

**ai-codex GitHub Dependency:**
- Package: `github:skibidiskib/ai-codex` in `package.json`
- Risk: This is a third-party package from GitHub (not npm registry)
- Impact: 
  - Dependency on individual's GitHub account (if they disappear, package is lost)
  - No version pinning (will pull latest `main` branch, breaking changes possible)
  - Unclear what this package does or why it's needed
- Migration plan:
  1. Document why `ai-codex` is needed
  2. Pin to specific commit if it's critical
  3. Evaluate switching to equivalent npm package
  4. Or vendor the code directly if it's small

**Google NotebookLM RPC Protocol Dependency:**
- Risk: Entire `notebooklm-py` library depends on undocumented, unsupported internal RPC APIs
- Impact: Library can break at any time with Google API changes
- Current mitigation: Documentation acknowledges this; E2E tests can catch breakage
- Long-term strategy: Monitor for RPC changes; maintain fallback strategies; consider if better alternative exists (official API if Google releases one)

---

## Known Bugs

**None explicitly documented**, but patterns suggest:

1. **Planned SC Automation Tools Not Implemented:**
   - Referenced in `artem_profile.md` and `CLAUDE.md` section 4 (new April 2026)
   - List: Invoice Checker, FBA Fee Auditor, Stockout Risk Alerter, etc.
   - Status: "in progress" but no code found in repo
   - Impact: Could derail timeline if work is lost or forgotten
   - Workaround: Code may be in separate private repo or Claude.ai projects, not in git

2. **Planning Files Deleted Without Clear Reason:**
   - Status: `git status` shows deleted `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, etc.
   - Impact: Loss of requirements/architecture from earlier phases
   - Workaround: Check git log to recover if needed

---

## Architecture Concerns

**Monolithic Workspace Layout Without Clear Separation:**
```
/Users/artem/Claude v 1.0/
├── CLAUDE.md                    # Global guidance
├── website-project/             # Next.js/frontend project (docs only?)
├── notebooklm-py/               # Python library (submodule or copy?)
├── .agents/skills/              # 200+ skill definitions (unused?)
├── .claude/                      # Claude IDE configuration
├── conversations.json           # 21MB Claude export (should not be here)
├── projects.json                # 1MB Claude export (should not be here)
├── memories.json                # Personal data (should not be here)
├── artem_profile.md             # PII-laden personal profile
└── skills/                       # Symlink to .agents/skills/?
```

- Issue: No clear separation between projects; data exports mixed with source code; unclear what's active vs. archived
- Impact: Difficult to understand scope; confusing for new contributors; risk of accidentally modifying wrong files
- Recommendation: Establish clear structure:
  ```
  /claude-workspace/
  ├── .planning/                  # Global planning docs
  ├── projects/
  │   ├── website/
  │   ├── sc-automation/
  │   └── ...
  ├── tools/
  │   ├── notebooklm-py/          # As git submodule
  │   └── ...
  ├── docs/
  │   ├── CLAUDE.md               # Global
  │   ├── ENGINEERING_GUIDE.md    # Global
  │   └── artem-profile.md        # Public professional info only
  └── .gitignore                  # Strict: no .DS_Store, no exports, no node_modules
  ```

---

## Unresolved Dependencies

**ai-codex Package Documentation Missing:**
- Package is in `package.json` but purpose is not documented
- Impact: Cannot determine if it's critical or legacy
- Action: Document or remove

**Missing Integration Between .agents/ Skills and Active Projects:**
- Issue: `.agents/skills/` contains 200+ predefined skills but none are referenced in `CLAUDE.md`, `ENGINEERING_GUIDE.md`, or project code
- Impact: Unclear if these are:
  - A shared library meant to be used?
  - Archived reference material?
  - Dependencies from a larger system?
- Action: Document their purpose and update `.gitignore` if not needed locally

---

## Recommendations by Priority

### 🔴 Critical (Do First)

1. **Clean `.gitignore` immediately** — Add explicit rules for `conversations.json`, `projects.json`, `node_modules/`, `.DS_Store`, `.claude/`, `skills/`
2. **Recover deleted planning files** — Run `git checkout` to restore `.planning/PROJECT.md`, etc. or document why they were deleted
3. **Remove 21MB `conversations.json` from git history** (if ever committed) — Use `git filter-branch` or `git-filter-repo`
4. **Establish guidelines for workspace structure** — Document what goes where; approve all new top-level directories

### 🟡 High (This Month)

5. **Add CI/CD pipeline** — GitHub Actions for linting, testing, pre-commit validation
6. **Consolidate CLAUDE.md files** — One source of truth for workspace-wide guidance
7. **Document ai-codex dependency** — Why it's needed; if not, remove
8. **Verify no secrets in history** — `git log --all | grep -i "password\|secret\|key\|token"`

### 🟢 Medium (Next Sprint)

9. **Move PII to private storage** — Remove phone number, specific location details from committed files
10. **Document SC automation tools plan** — Clarify status and location (private repo? In progress?)
11. **Set up RPC monitoring** — Alert if NotebookLM E2E tests fail due to Google API changes
12. **Consider monorepo split** — If 3+ independent projects, evaluate separate repos

---

*Concerns audit: 2026-04-18*
