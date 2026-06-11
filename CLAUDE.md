# CLAUDE.md

This file covers workspace-specific rules for this project directory.
Who Artem is, active projects, preferences, and reference data → see memory files.

---

## Workspace Files

This directory contains a Claude.ai data export (April 16, 2026) + active project workspace.

- `conversations.json` (~21MB) — full Claude chat history
- `projects.json` (~1MB) — Claude projects
- `memories.json` — personal and work context

**When querying large JSON files: use `jq` for filtering — never load the full file.**

---

## File Naming Convention

All files created in this directory: `[type]-[topic]-[description].ext`

**Rules:**
- Lowercase only, hyphens as separators, no spaces or underscores
- No non-ASCII characters (Cyrillic → translate to English)
- Max ~60 characters

**Types:** `course` · `outreach` · `script` · `report` · `data` · `ref` · `plan` · `notes` · `case` · `copy` · `tool` · `export`

**Date prefix** (YYYY-MM-DD-) only for `export-*` and `report-*` files where the date is meaningful.

**Enforcement:** Apply silently when creating new files. Ask only when type is genuinely ambiguous (2 plausible options).

**Content files — account slug required:**
Any file that is content, copy, voice/tone, strategy, reference, or knowledge base *for a specific Threads/social account* must include the account slug in the filename.

Account slugs:
- `monetizer-biz` → @monetizer_biz
- `artem-org-ua` → @artem.org.ua
- `hmelinka` → @hmelinka

Pattern: `[type]-[account-slug]-[description].ext`

Examples:
- TOV for Kateryna → `ref-hmelinka-tone-of-voice.md`
- Content plan for Artem → `plan-artem-org-ua-content-week1.md`
- KB for monetizer → `ref-monetizer-biz-knowledge-base.md`

**Examples (general):**
- Marketing copy → `copy-gumroad-sales-page.md`
- LinkedIn script → `outreach-linkedin-cold-script.md`
- Code tool → `tool-scraper-all-sites.py`
- Dated export → `2026-04-16-export-claude-conversations.json`

---

## GSD Workflow

Before using Edit, Write, or other file-changing tools, start work through a GSD command.

- `/gsd-quick` — small fixes, doc updates, ad-hoc tasks
- `/gsd-debug` — investigation and bug fixing
- `/gsd-execute-phase` — planned phase work

Do not make direct repo edits outside a GSD workflow unless explicitly asked to bypass it.

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

If `hot.md` content contradicts a memory file in `~/.claude/projects/-Users-artem-Claude-v-1-0/memory/` — flag it at session start. Do not silently overwrite memory files; Artem decides which is correct.

---

## Artem's Code of Honor

1. Know — don't just be confident. Verify before asserting.
2. Inventory control is the foundation of everything else.
3. No manual data entry — automate or eliminate.
4. Take ownership, don't just manage.
5. Delegate as the path to growing your own value.
6. Optimize processes before adding people.
7. Document decisions, not just outcomes.
8. Cutting costs and growing value are not opposites.
9. Speed matters — done and iterated beats perfect and delayed.
10. Build systems, not habits.
