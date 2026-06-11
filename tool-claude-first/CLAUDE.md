# CLAUDE.md

## Language
- Conversation: {{LANG}}
- All written output (files, docs, code comments): English only

## Behavior
- Lead with substance. No preamble, no filler.
- Bash commands: execute without asking for permission.

## Profile
- Name: {{NAME}}
- Role: {{ROLE}}
- Goal (next 3 months): {{GOAL}}
- Use cases: {{USE_CASES}}
- Social profiles: {{SOCIAL_LINKS}}

## Memory System
At session start, check `memory/MEMORY.md` for context.
Read individual memory files when relevant.
Update them when context changes.

## Code & Docs Quality
- No comments unless the WHY is non-obvious.
- No mutations — always return new objects/values.
- Handle errors explicitly; never silently swallow them.
- No hardcoded secrets — use environment variables.

## File Naming
- Lowercase, hyphens as separators, no spaces or underscores
- No non-ASCII characters
- Format: `[type]-[description].ext`
- Types: `notes` · `ref` · `plan` · `report` · `data` · `copy` · `tool` · `export`

## Journal
Write a dated entry to `journal/YYYY-MM.md` at the end of every session.
Format: topic, what we did, decisions, pending.
