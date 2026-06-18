# hot.md Session Context System — Design Spec
*2026-06-12*

## Problem

Claude Code starts every session cold. `MEMORY.md` auto-loads as an index, but there is no snapshot of "what happened last session and what is most urgent right now." This forces re-explanation overhead at session start and missed continuity across work streaks.

## Goal

A self-maintaining session context file (`hot.md`) that lives in the Obsidian vault, is read automatically at session start, and is updated automatically at session end — with zero manual effort from Artem.

## Scope

- Create `hot.md` in vault root
- Update `CLAUDE.md` (project-level) with session protocol
- Update `HOME.md` with wikilink to `hot.md`
- Update `feedback_journal_rule.md` memory to include hot.md update as mandatory end-of-session step

## Out of Scope

- Migrating `~/.claude/projects/memory/` files into the vault
- MCP server setup for Obsidian
- Changes to `MEMORY.md` structure or existing memory files

---

## hot.md Structure

```markdown
---
last_updated: YYYY-MM-DD
---

## Current Focus
[1-2 active projects with their exact current status — one line each]

## Open Decisions
[Unresolved questions that need an answer before work can continue]

## Blockers
[What is blocked, and why]

## Recent Sessions
- YYYY-MM-DD: [one-line summary of what was done]
- YYYY-MM-DD: [one-line summary]
- YYYY-MM-DD: [one-line summary]

## Quick Refs
[File paths or Notion page IDs currently in play]
```

**Constraints:**
- Max ~500 words total
- `last_updated` frontmatter is mandatory — used to detect staleness
- Recent Sessions: keep last 3 entries, drop older ones
- Quick Refs: only files/pages actively referenced in current work

---

## Session Protocol (CLAUDE.md addition)

### Session Start

**FIRST ACTION in every session, before any response or tool use:**

1. Read `/Users/artem/Claude v 1.0/hot.md` using the Read tool. If the file does not exist, create it from `MEMORY.md` + most recent `journal/YYYY-MM.md` entry before proceeding.
2. If `last_updated` is more than 3 days ago — rebuild `hot.md` from `MEMORY.md` + most recent `journal/YYYY-MM.md` entry (current or previous month) before using it as context.
3. Proceed with work informed by the snapshot.

### Session End

**At every natural stopping point in conversation, or when Artem signals end of session:**

1. Update `/Users/artem/Claude v 1.0/hot.md`: refresh Current Focus, add new Recent Sessions entry (dated), update Open Decisions and Blockers to reflect session outcome.
2. Write dated entry to `journal/YYYY-MM.md` (existing rule, reinforced here).

Do not wait for an explicit "goodbye" — update whenever a task or topic reaches a clear conclusion. If the session ends abruptly, the next session's staleness check recovers automatically.

---

## Relationship to Existing Memory System

`hot.md` and `~/.claude/projects/memory/` serve different purposes and do not replace each other:

| | `hot.md` | `MEMORY.md` + files |
|---|---|---|
| Location | Vault root (`~/Claude v 1.0/`) | `~/.claude/projects/memory/` |
| Loaded | Explicit Read at session start | Auto-loaded via system-reminder |
| Content | Temporal: current focus, recent work | Persistent: preferences, project refs, feedback |
| Updated | Every session end | When context changes |
| Authoritative for | "What are we doing right now?" | "What do we know about X?" |

When the two conflict, flag the contradiction at session start — do not silently overwrite memory files. Artem decides which is correct; then the stale file is updated.

---

## Seeding

`hot.md` is created during implementation (not left for first use). It is seeded with current project state derived from `project_current.md` and recent journal entries — so the first session after setup benefits immediately.

---

## HOME.md Update

Add to the Claude / AI Tools section:

```
- [[hot]] — current session snapshot (updated each session)
```

---

## Success Criteria

- Session start: Claude reads `hot.md` without being asked
- Session end: `hot.md` is updated and journal entry is written
- After 5 sessions: `hot.md` accurately reflects current work without manual edits from Artem
- Obsidian Graph View: `hot.md` visible as connected node from `HOME.md`
