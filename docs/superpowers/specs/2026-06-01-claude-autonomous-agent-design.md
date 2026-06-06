# Skill Design: `claude-autonomous-agent`

**Date:** 2026-06-01
**Status:** Approved for implementation
**Origin:** Distilled from Job Search Orchestrator built May 2026

---

## Purpose

This skill teaches Claude how to design, build, and adapt autonomous multi-agent systems using the proven pattern: macOS crontab + Claude Code CLI (non-interactive) + file-based handoffs + Notion + Telegram.

Use this skill for new builds, client adaptations, and adding agents to running systems.

---

## Quick Reference

```
New system:      Section 2 → 5 → 4 → 3 → 9
New agent:       Section 3 → 4 → 6
New client:      Section 8 → 5 → test → deploy
```

---

## Section 1 — Triggers

**Invoke when:**
- Building a new autonomous system (job search, SC alerts, lead monitoring, any daily workflow)
- Adapting an existing system for a new client or use case
- Adding a new agent to a running system

**Do not invoke when:** one-off script, interactive Claude session, task with no schedule.

**macOS only.** Windows Task Scheduler has different syntax and is out of scope for this skill.

---

## Section 2 — Canonical Architecture

```
macOS crontab
  │
  ├── [HH:MM] worker_1  → data/agent1_latest.md
  ├── [HH:MM] worker_2  → data/agent2_latest.md   (+4 min offset between agents)
  ├── [HH:MM] worker_N  → data/agentN_latest.md
  │
  └── [HH:MM + 20-30 min buffer] orchestrator.md
        1. reads config.env (Notion IDs, Telegram creds)
        2. reads data/profile.md
        3. reads data/*_latest.md + checks timestamp of each
        4. creates Notion briefing page via MCP
        5. creates tasks in Notion DB via MCP
        6. archives Done tasks from previous days
        7. sends Telegram via curl
        8. prints ORCHESTRATOR COMPLETE to log
```

**Three fixed principles:**
1. Agents do not know about each other — communication only through files
2. Orchestrator runs after ALL workers + 20 min buffer minimum
3. `setup.sh` (interactive) runs once → builds `data/profile.md`

---

## Section 3 — The 4 Critical `claude -p` Rules

These rules are non-obvious and absent from official documentation. All 4 are required.

### Rule 1 — `bypassPermissions` is mandatory for file writes

`claude -p` blocks Write to paths outside the current project dir. `bypassPermissions` bypasses the permission UI; `--allowedTools` remains as the security filter.

```bash
claude \
  --allowedTools "WebSearch Write Read Bash mcp__plugin_marketing_notion__*" \
  --permission-mode bypassPermissions \
  -p "$(cat "$PROMPT_FILE")"
```

### Rule 2 — Context injection at the top of every prompt

Every agent prompt starts by reading credentials and user profile:
```
Read `config.env` to get credentials.
Read `data/profile.md` to understand the user context.
```

### Rule 3 — Explicit output directive

The prompt must specify the exact output file, path, and format:
```
Write ALL results to `data/[agent]_latest.md` in this exact format:
# [Agent Name] — YYYY-MM-DD HH:MM
[structured content]
```

### Rule 4 — Graceful failure

If no results or any error — still write the output file with a `NO_RESULTS:` line.
Without this, the orchestrator reads yesterday's file and cannot detect a crash.
```
If no results found or any error occurs, still write:
# [Agent Name] — YYYY-MM-DD HH:MM
NO_RESULTS: [brief reason]
```

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

## Section 4 — File Structure and `run_agent.sh`

```
~/.claude/scripts/
├── run_agent.sh          # Universal launcher — the only executable
├── config.env            # Notion UUIDs, Telegram token + chat_id
├── agents/
│   ├── [name]_agent.md   # Prompt for each worker agent
│   └── orchestrator.md   # Orchestrator prompt
└── data/
    ├── profile.md        # User profile (written once by setup.sh)
    ├── [name]_latest.md  # Agent output (overwritten each run)
    └── [name].log        # Run log for each agent
```

**`run_agent.sh` — proven version (do not change without reason):**

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

## Section 5 — Profile.md Schema

`setup.sh` builds this file interactively. Required fields for all systems:

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

Use-case-specific fields are appended below (e.g., salary range for job search, SKU list for SC alerts).

---

## Section 6 — Crontab Template

```cron
PATH=/usr/local/bin:/usr/bin:/bin:/Users/[USERNAME]/.local/bin

# Workers (4 min offset between agents to avoid conflicts)
3  8 * * 1-5  /Users/[USERNAME]/.claude/scripts/run_agent.sh agent1
7  8 * * 1-5  /Users/[USERNAME]/.claude/scripts/run_agent.sh agent2
11 8 * * 1-5  /Users/[USERNAME]/.claude/scripts/run_agent.sh agent3

# Orchestrator (minimum 20 min after last worker)
30 8 * * 1-5  /Users/[USERNAME]/.claude/scripts/run_agent.sh orchestrator

# Evening reminder
0 16 * * *    /Users/[USERNAME]/.claude/scripts/run_agent.sh reminder
```

**Three crontab rules:**
1. `PATH` line is required — crontab does not inherit shell PATH, `claude` won't be found without it
2. Absolute paths everywhere — no `~/` in crontab
3. Replace `[USERNAME]` with real username (`whoami` in terminal)

---

## Section 7 — Orchestrator Prompt Template

This is the full STEP structure for `orchestrator.md`. Copy and adapt per system.

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
Use Bash to run (substitute actual values you read from config.env — not shell variables):
curl -s -X POST "https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage" \
  -d chat_id="{TELEGRAM_CHAT_ID}" \
  -d text="☀️ Briefing ready — [one-line summary of today's results]"

STEP 7 — PRINT SUMMARY
Output to terminal: "ORCHESTRATOR COMPLETE — [timestamp] | Tasks: N | Archived: N"
```

**Notion UUID note:** MCP accepts only the 36-character UUID (`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`), not the browser URL.

---

## Section 8 — Onboarding a New Use Case

Before writing any code — answer these 4 questions (ask the client or yourself):

| Question | Determines |
|----------|-----------|
| What data to collect daily? | List of worker agents |
| What to do with that data? | Orchestrator logic + Notion structure |
| Who receives the result and when? | Telegram setup + crontab timing |
| What does the user profile contain? | Fields in `profile.md` |

Then: write `profile.md` → write agent prompts → test manually → deploy crontab.

---

## Section 9 — Testing Checklist (Required Before Crontab)

Run each step manually. Do not set up crontab until steps 1–3 pass without errors.

```
□ 1. bash ~/.claude/scripts/run_agent.sh [worker1]
      → cat data/worker1_latest.md
      → Is there content? Not empty? Has today's timestamp?

□ 2. Repeat for every worker agent

□ 3. bash ~/.claude/scripts/run_agent.sh orchestrator
      → Notion: did a new Briefing page appear?
      → Notion: did tasks appear in Tasks DB?
      → Telegram: did the message arrive?

□ 4. crontab -e → paste all lines (PATH line first)

□ 5. Next morning: check data/*.log for errors
```

---

## Known Issues and Solutions

From the May 2026 build — do not repeat these mistakes:

| Problem | Root Cause | Solution |
|---------|-----------|----------|
| Files not written by agents | `claude -p` blocks Write outside project dir | `--permission-mode bypassPermissions` |
| crontab wiped by `sed` | Incorrect escape in sed command | Edit crontab only via `crontab -e` |
| Notion MCP error on fetch | Passed URL instead of UUID | Use 36-char UUID only |
| CronCreate schedules disappear | In-session tool, not system cron | Use macOS `crontab`, not CronCreate |
| Duplicate tasks in Notion | Orchestrator ran twice same day | Add idempotency check (date in task title) |
| Stale data silently used | No timestamp check in orchestrator | STEP 2 stale detection is required |

---

## Real Performance Benchmarks (Sonnet 4.6)

| Agent | Runtime | Typical output |
|-------|---------|---------------|
| Worker agent (web search) | ~90–270 sec | 3–10 items |
| Orchestrator | ~100–210 sec | Notion + Telegram |
| Full morning cycle (4 workers + orchestrator) | ~11 min | 5 tasks + briefing |
| Cost per full cycle | ~$0.08–0.15 | — |
