# hot.md Session Context System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a self-maintaining `hot.md` session snapshot in the Obsidian vault, wired into the session start/end protocol via CLAUDE.md, so Claude never starts cold.

**Architecture:** `hot.md` lives at vault root (`~/Claude v 1.0/hot.md`), is read explicitly at session start per a new CLAUDE.md rule, and is updated at session end alongside the existing journal ritual. Existing `~/.claude/projects/memory/` files are unchanged.

**Tech Stack:** Plain Markdown, Claude Code file tools (Read/Write/Edit), git.

---

## Files

| Action | Path |
|--------|------|
| Create | `/Users/artem/Claude v 1.0/hot.md` |
| Modify | `/Users/artem/Claude v 1.0/CLAUDE.md` |
| Modify | `/Users/artem/Claude v 1.0/HOME.md` |
| Modify | `/Users/artem/.claude/projects/-Users-artem-Claude-v-1-0/memory/feedback_journal_rule.md` |

---

## Task 1: Create hot.md (seeded with current state)

**Files:**
- Create: `/Users/artem/Claude v 1.0/hot.md`

- [ ] **Step 1: Write hot.md with seeded content**

Write `/Users/artem/Claude v 1.0/hot.md`:

```markdown
---
last_updated: 2026-06-12
---

## Current Focus
- FlowerOS: architecture + Plan 1 done; `floweros/` codebase not yet created — execution is next
- Life Builder OS: Product 1 live on GitHub Pages; Products 2, 4, 5 need HTML conversion

## Open Decisions
- Telegram Content Bot: needs Anthropic API credits ($5 min at console.anthropic.com → Plans & Billing) to unblock
- Beehiiv email platform: planned, not set up yet
- LinkedIn bio: do NOT update to "The Life Builder" until job offer received

## Blockers
- FlowerOS: `floweros/` directory does not exist — Plan 1 ready, waiting for execution
- Telegram Content Bot: Anthropic API credits missing (all credentials in `.env` are already configured)

## Recent Sessions
- 2026-06-12: researched AI context/memory solutions (Obsidian, Spec-Kit, Mem0) → designed hot.md system → wrote spec and implementation plan
- 2026-06-11: built Claude Code First onboarding product v1.0, ZIP packaged for distribution
- 2026-06-10: FlowerOS architecture design spec + threads poster multi-account Sheets spec

## Quick Refs
- FlowerOS architecture spec: `docs/superpowers/specs/2026-06-10-floweros-architecture-design.md`
- hot.md design spec: `docs/superpowers/specs/2026-06-12-hot-md-session-context-design.md`
- Threads poster: `tool-threads-poster/poster.py`
- Memory dir: `~/.claude/projects/-Users-artem-Claude-v-1-0/memory/`
```

- [ ] **Step 2: Verify file**

Read `/Users/artem/Claude v 1.0/hot.md`. Confirm:
- `last_updated` frontmatter present
- All 5 sections present (Current Focus, Open Decisions, Blockers, Recent Sessions, Quick Refs)
- Under 500 words

- [ ] **Step 3: Commit**

```bash
git -C "/Users/artem/Claude v 1.0" add hot.md
git -C "/Users/artem/Claude v 1.0" commit -m "feat: add hot.md session context snapshot"
```

---

## Task 2: Add Session Protocol to CLAUDE.md

**Files:**
- Modify: `/Users/artem/Claude v 1.0/CLAUDE.md`

- [ ] **Step 1: Add Session Protocol section**

Insert after the `## GSD Workflow` section (after line 66) in `/Users/artem/Claude v 1.0/CLAUDE.md`:

```markdown

---

## Session Protocol

**FIRST ACTION in every session, before any response or tool use:**

1. Read `/Users/artem/Claude v 1.0/hot.md` using the Read tool.
   - If the file does not exist → create it from `MEMORY.md` + most recent `journal/YYYY-MM.md` entry.
   - If `last_updated` is more than 3 days ago → rebuild from `MEMORY.md` + most recent journal entry before treating it as current context.
2. Proceed with work informed by the snapshot.

**At every natural stopping point, or when Artem signals end of session:**

1. Update `/Users/artem/Claude v 1.0/hot.md`: refresh Current Focus, add a dated Recent Sessions entry, update Open Decisions and Blockers to reflect session outcome. Keep file under 500 words.
2. Write dated entry to `journal/YYYY-MM.md` (per feedback_journal_rule).

Do not wait for explicit "goodbye" — update at any clear task or topic conclusion.

If `hot.md` content contradicts a memory file in `~/.claude/projects/memory/` — flag it at session start. Do not silently overwrite memory files; Artem decides which is correct.
```

- [ ] **Step 2: Verify**

Read `/Users/artem/Claude v 1.0/CLAUDE.md`. Confirm Session Protocol section is present and the absolute path `/Users/artem/Claude v 1.0/hot.md` appears in both start and end instructions.

- [ ] **Step 3: Commit**

```bash
git -C "/Users/artem/Claude v 1.0" add CLAUDE.md
git -C "/Users/artem/Claude v 1.0" commit -m "feat: add session protocol to CLAUDE.md"
```

---

## Task 3: Add [[hot]] wikilink to HOME.md

**Files:**
- Modify: `/Users/artem/Claude v 1.0/HOME.md`

- [ ] **Step 1: Add wikilink**

In `/Users/artem/Claude v 1.0/HOME.md`, inside the `## Claude / AI Tools` section, add as the first item:

```markdown
- [[hot]] — current session snapshot (updated each session)
```

The section should look like:

```markdown
## Claude / AI Tools

- [[hot]] — current session snapshot (updated each session)
- [[ref-claude-agents-guide]]
- [[ref-claude-memory-optimization]]
- [[ref-hypergrowth-skill-instructions]]
```

- [ ] **Step 2: Verify**

Read `/Users/artem/Claude v 1.0/HOME.md`. Confirm `[[hot]]` appears in the Claude / AI Tools section.

- [ ] **Step 3: Commit**

```bash
git -C "/Users/artem/Claude v 1.0" add HOME.md
git -C "/Users/artem/Claude v 1.0" commit -m "docs: add hot.md wikilink to HOME.md"
```

---

## Task 4: Update feedback_journal_rule.md

**Files:**
- Modify: `/Users/artem/.claude/projects/-Users-artem-Claude-v-1-0/memory/feedback_journal_rule.md`

- [ ] **Step 1: Add hot.md update step**

In the **How to apply** section of `feedback_journal_rule.md`, add a new bullet before the existing "Trigger" line:

```markdown
- Before writing the journal entry, first update `/Users/artem/Claude v 1.0/hot.md`: refresh Current Focus, add a dated Recent Sessions line (keep last 3, drop older), update Open Decisions and Blockers. Keep under 500 words.
```

The How to apply section should read:

```markdown
**How to apply:**
- Before writing the journal entry, first update `/Users/artem/Claude v 1.0/hot.md`: refresh Current Focus, add a dated Recent Sessions line (keep last 3, drop older), update Open Decisions and Blockers. Keep under 500 words.
- Trigger: before ending any session where meaningful work was done
- File: `/Users/artem/Claude v 1.0/journal/YYYY-MM.md` (create file if month doesn't exist yet)
- Format:
  ```
  ## YYYY-MM-DD
  
  **Topic:** [1-line summary]
  
  **What we did:**
  - [bullet list of actions taken]
  
  **Key decisions:**
  - [any choices made, trade-offs, directions set]
  
  **Pending:**
  - [open questions or next steps]
  ```
- Keep each entry under 20 lines — compact, scannable
- Omit "Pending" section if nothing is open
```

- [ ] **Step 2: Verify**

Read `feedback_journal_rule.md`. Confirm the hot.md update step appears before the Trigger line and contains the absolute path.

- [ ] **Step 3: Note on commit**

`feedback_journal_rule.md` is at `~/.claude/` — outside the vault git repo. The file change takes effect immediately regardless of git. No commit needed for this file; Claude Code reads it by path, not by git state.

---

## Self-check after all tasks

- [ ] Open a new Claude Code session in `~/Claude v 1.0` — confirm Claude reads `hot.md` before responding
- [ ] Open Obsidian Graph View (`Cmd+G`) — confirm `hot` node appears connected to `HOME`
