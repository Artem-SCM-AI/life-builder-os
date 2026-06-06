---
name: claude-autonomous-agent
description: Use when building a new autonomous multi-agent system, adapting an existing orchestrator for a new client or use case, or adding a new agent to a running system. Trigger phrases: "autonomous agent", "crontab agent", "daily workflow", "runs every morning", "scheduled agents", "SC orchestrator", "job search orchestrator", "build me a system that runs automatically"
---

# Autonomous Claude Agent Builder

Build autonomous multi-agent systems: macOS crontab + Claude Code CLI (non-interactive) + file handoffs + Notion + Telegram.

## Quick Reference

```
New system:    Section 2 → 5 → 4 → 3 → 8
New agent:     Section 3 → 4 → 6
New client:    Section 7 → 5 → test → deploy
```

**Do NOT invoke for:** one-off scripts, interactive Claude sessions, tasks with no schedule.
**macOS only.** Windows Task Scheduler is out of scope.

---

## Section 1 — Architecture

```
macOS crontab
  │
  ├── [HH:MM] worker_1  → data/agent1_latest.md
  ├── [HH:MM] worker_2  → data/agent2_latest.md   (+4 min offset between agents)
  ├── [HH:MM] worker_N  → data/agentN_latest.md
  │
  └── [HH:MM + 20-30 min buffer] orchestrator
        1. reads config.env (Notion UUIDs, Telegram creds)
        2. reads data/profile.md
        3. reads data/*_latest.md + checks timestamp of each
        4. creates Notion briefing page via MCP
        5. creates tasks in Notion Tasks DB via MCP
        6. archives Done tasks from previous days
        7. sends Telegram notification via curl
        8. prints ORCHESTRATOR COMPLETE to log
```

**Fixed principles:**
1. Agents do not know about each other — communication through files only
2. Orchestrator runs after ALL workers + minimum 20 min buffer
3. `setup.sh` (interactive, runs once) → builds `data/profile.md`

---

## Section 2 — The 4 Critical `claude -p` Rules

All 4 required. Non-obvious. Absent from official docs.

### Rule 1 — `bypassPermissions` mandatory for file writes

`claude -p` blocks Write to paths outside project dir. `bypassPermissions` bypasses the permission UI; `--allowedTools` remains as security filter.

```bash
claude \
  --allowedTools "WebSearch Write Read Bash mcp__plugin_marketing_notion__*" \
  --permission-mode bypassPermissions \
  -p "$(cat "$PROMPT_FILE")"
```

### Rule 2 — Context injection at top of every agent prompt

```
Read `config.env` to get credentials.
Read `data/profile.md` to understand the user context.
```

Without `config.env`: agent cannot authenticate to Notion or Telegram and fails silently.
Without `profile.md`: agent produces generic output not tailored to the user's goals or exclusions.

### Rule 3 — Explicit output directive in every agent prompt

```
Write ALL results to `data/[agent]_latest.md` in this exact format:
# [Agent Name] — YYYY-MM-DD HH:MM
[structured content]
```

Without this, the orchestrator finds no file to read and silently uses stale data from the previous run.

### Rule 4 — Graceful failure in every agent prompt

```
If no results found or any error occurs, still write:
# [Agent Name] — YYYY-MM-DD HH:MM
NO_RESULTS: [brief reason]
```

Without this, the orchestrator reads yesterday's file and cannot detect a crash.

### Full Example — `news_agent.md`

```
Read `config.env` to get credentials.
Read `data/profile.md` to understand the user context.

Search the web for top 5 SC + AI + Amazon news published in the last 24 hours.
Queries:
  - "supply chain disruption OR tariffs OR freight" (last 24h)
  - "Amazon FBA policy OR seller central update" (last 24h)
  - "AI supply chain OR inventory automation" (last 24h)

For each result include: headline, source, URL, one sentence why it matters to the user.

Write ALL results to `data/news_latest.md` in this exact format:
# News Agent — YYYY-MM-DD HH:MM
## Item 1
Title: ...
Source: ...
URL: ...
Why it matters: ...

If no results found or any error occurs, still write:
# News Agent — YYYY-MM-DD HH:MM
NO_RESULTS: [brief reason]
```

---

## Section 3 — File Structure and `run_agent.sh`

```
~/.claude/scripts/
├── run_agent.sh          # Universal launcher — only executable
├── config.env            # Notion UUIDs + Telegram token/chat_id
├── agents/
│   ├── [name]_agent.md   # Worker agent prompt
│   └── orchestrator.md   # Orchestrator prompt
└── data/
    ├── profile.md        # User profile (written once by setup.sh)
    ├── [name]_latest.md  # Agent output (overwritten each run)
    └── [name].log        # Run log per agent
```

**`run_agent.sh` — do not change without reason:**

```bash
#!/bin/bash
export PATH="/Users/$USER/.local/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

AGENT="$1"
AGENTS_DIR="$HOME/.claude/scripts/agents"
LOG="$HOME/.claude/scripts/data/${AGENT}.log"
PROMPT_FILE="$AGENTS_DIR/${AGENT}_agent.md"
[ "$AGENT" = "orchestrator" ] && PROMPT_FILE="$AGENTS_DIR/orchestrator.md"

echo "=== [$AGENT] $(date '+%Y-%m-%d %H:%M:%S') ===" >> "$LOG"
(cd "$HOME/.claude/scripts" && claude \
  --allowedTools "WebSearch Write Read Bash mcp__plugin_marketing_notion__*" \
  --permission-mode bypassPermissions \
  -p "$(cat "$PROMPT_FILE")") >> "$LOG" 2>&1
echo "=== done (exit:$?) $(date '+%H:%M:%S') ===" >> "$LOG"
```

---

## Section 4 — Profile.md Schema

`setup.sh` builds this interactively. Required fields for any system:

```markdown
# Profile
Name: [Full name]
Role: [Current/target role]
Primary goal: [What the system does for this person]
Search targets: [What agents look for — job titles / pain signals / topics]
Exclusions: [What to ignore]
Notion briefing parent: [UUID of parent page for daily briefings]
Notion tasks DB: [UUID of tasks database]
Notion archive DB: [UUID of archive database]
Telegram chat_id: [chat_id]
```

Add use-case fields below (e.g. `Salary range:` for job search, `SKU list:` for SC alerts).

---

## Section 5 — Crontab Template

```cron
PATH=/usr/local/bin:/usr/bin:/bin:/Users/[USERNAME]/.local/bin

# Workers (4 min offset between agents)
3  8 * * 1-5  /Users/[USERNAME]/.claude/scripts/run_agent.sh agent1
7  8 * * 1-5  /Users/[USERNAME]/.claude/scripts/run_agent.sh agent2
11 8 * * 1-5  /Users/[USERNAME]/.claude/scripts/run_agent.sh agent3

# Orchestrator (minimum 20 min after last worker)
30 8 * * 1-5  /Users/[USERNAME]/.claude/scripts/run_agent.sh orchestrator

# Evening reminder
0 16 * * *    /Users/[USERNAME]/.claude/scripts/run_agent.sh reminder
```

**Rules:**
1. `PATH` line required — crontab does not inherit shell PATH, `claude` won't be found without it
2. Absolute paths everywhere — no `~/` — crontab runs in a minimal shell where `~` is not expanded; `~/scripts/run_agent.sh` resolves to the literal string and the command is not found
3. Replace `[USERNAME]` with output of `whoami`

---

## Section 6 — Orchestrator Prompt Template

Copy into `orchestrator.md` and adapt per system:

```
STEP 1 — READ CONFIG
Read `config.env`. Extract: NOTION_PARENT_ID, NOTION_TASKS_DB,
NOTION_ARCHIVE_DB, TELEGRAM_TOKEN, TELEGRAM_CHAT_ID.
Read `data/profile.md`.

STEP 2 — CHECK DATA FRESHNESS
Read each data/*_latest.md file.
For each: check if the timestamp in the first line matches today's date.
If a file's timestamp is older than 3 hours or from a previous day,
mark that section as "⚠️ STALE — data may be outdated" in the briefing.

STEP 3 — CREATE BRIEFING PAGE
Use notion-create-pages with parent.page_id = NOTION_PARENT_ID.
Title: "📋 Briefing — [today's date YYYY-MM-DD]"
Content: compile all agent outputs into structured markdown.

STEP 4 — CREATE TASKS
Use notion-create-pages with parent.database_id = NOTION_TASKS_DB.
One page per action item. Fields:
  - title: task description
  - Status: "To Do"
  - Дата: today's date in ISO format (YYYY-MM-DD)

STEP 5 — ARCHIVE DONE TASKS
Use notion-search to find pages in NOTION_TASKS_DB
where Status = "Done" and Дата is not today.
For each result: use notion-update-page to set Status = "🗃️ Архів".

STEP 6 — TELEGRAM NOTIFICATION
Use Bash to run (substitute actual values from config.env — not shell variables):
curl -s -X POST "https://api.telegram.org/bot[TELEGRAM_TOKEN]/sendMessage" \
  -d chat_id="[TELEGRAM_CHAT_ID]" \
  -d text="☀️ Briefing ready — [one-line summary]"

STEP 7 — PRINT SUMMARY
Output: "ORCHESTRATOR COMPLETE — [timestamp] | Tasks: N | Archived: N"
```

**Notion UUID:** MCP accepts only 36-char UUID (`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`), not browser URL.

---

## Section 7 — Onboarding a New Use Case

Before writing any code — answer 4 questions (ask the client or yourself):

| Question | Determines |
|----------|-----------|
| What data to collect daily? | Worker agents list |
| What to do with that data? | Orchestrator logic + Notion structure |
| Who receives results and when? | Telegram setup + crontab timing |
| What is in the user profile? | Fields in `profile.md` |

Then: write `profile.md` → write agent prompts → test manually → deploy crontab.

---

## Section 8 — Testing Checklist (Required Before Crontab)

Do not deploy crontab until steps 1–3 pass without errors.

```
□ 1. bash ~/.claude/scripts/run_agent.sh [worker1]
      → cat data/worker1_latest.md
      → Content present? Today's timestamp? Not NO_RESULTS?

□ 2. Repeat for every worker agent

□ 3. bash ~/.claude/scripts/run_agent.sh orchestrator
      → Notion: new Briefing page appeared?
      → Notion: tasks appeared in Tasks DB?
      → Telegram: message received?

□ 4. crontab -e → paste all lines (PATH line first)

□ 5. Next morning: check data/*.log for errors
```

---

## Known Issues (Do Not Repeat)

| Problem | Cause | Fix |
|---------|-------|-----|
| Agent files not written | `claude -p` blocks Write outside project dir | `--permission-mode bypassPermissions` |
| crontab wiped | `sed` escape error | Edit crontab only via `crontab -e` |
| Notion MCP error | Passed URL instead of UUID | Use 36-char UUID only |
| CronCreate disappears | In-session tool, not system cron | Use macOS `crontab`, not CronCreate |
| Duplicate Notion tasks | Orchestrator ran twice | Add date to task title for idempotency |
| Stale data silently used | No timestamp check | STEP 2 stale detection is required |

---

## Benchmarks (Sonnet 4.6)

| | Runtime | Typical output | Cost |
|--|---------|---------------|------|
| Worker agent | ~90–270 sec | 3–10 items | — |
| Orchestrator | ~100–210 sec | Notion + Telegram | — |
| Full morning cycle | ~11 min | 5 tasks + briefing | ~$0.08–0.15 |
