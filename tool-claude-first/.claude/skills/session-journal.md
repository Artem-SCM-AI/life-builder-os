---
name: session-journal
description: Write a dated journal entry for this session. Run at session end.
---

# Session Journal

Write a dated entry to `journal/YYYY-MM.md` (create file if month doesn't exist).

## Format

```
## YYYY-MM-DD — [short topic 3-5 words]

**Topic:** [one sentence]

**What we did:**
- [bullet per major action]

**Key decisions:**
- [bullet per decision made]

**Pending:**
- [what's left or next step, or "Nothing."]
```

## Rules

- Date: today's date
- Topic: what this session was actually about — not "Claude Code session"
- "What we did" — actions taken, not intentions
- "Key decisions" — things decided that affect future work
- "Pending" — concrete next action or "Nothing."
- English only
- If file for current month doesn't exist: create it with `# Journal — YYYY-MM` as header
- Append to end of file, do not overwrite existing entries
