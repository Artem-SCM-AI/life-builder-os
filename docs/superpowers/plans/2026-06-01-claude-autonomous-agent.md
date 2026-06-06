# claude-autonomous-agent Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a personal Claude skill at `~/.claude/skills/claude-autonomous-agent/SKILL.md` that guides any Claude instance to correctly build autonomous multi-agent systems using crontab + Claude Code CLI + file handoffs + Notion + Telegram.

**Architecture:** Single SKILL.md with a concise reference guide (9 sections distilled from the design spec). Validated via RED baseline (run test prompt without skill, document default failures) then GREEN verification (with skill, check compliance checklist).

**Tech Stack:** Markdown (skill format), Claude Code CLI `claude -p`, macOS crontab

**Spec:** `docs/superpowers/specs/2026-06-01-claude-autonomous-agent-design.md`

---

### Task 1: Create SKILL.md

**Files:**
- Create: `~/.claude/skills/claude-autonomous-agent/SKILL.md`

- [ ] **Step 1: Create directory**

```bash
mkdir -p ~/.claude/skills/claude-autonomous-agent
```

Expected: no output, no error.

- [ ] **Step 2: Write SKILL.md**

```bash
cat > ~/.claude/skills/claude-autonomous-agent/SKILL.md << 'SKILLEOF'
---
name: claude-autonomous-agent
description: Use when building a new autonomous multi-agent system, adapting an existing orchestrator for a new client or use case, or adding a new agent to a running system. Trigger phrases: "autonomous agent", "crontab agent", "daily workflow", "runs every morning", "scheduled agents", "SC orchestrator", "job search orchestrator", "build me a system that runs automatically"
---

# Autonomous Claude Agent Builder

Build autonomous multi-agent systems: macOS crontab + Claude Code CLI (non-interactive) + file handoffs + Notion + Telegram.

## Quick Reference

```
New system:    Section 2 → 5 → 4 → 3 → 9
New agent:     Section 3 → 4 → 6
New client:    Section 8 → 5 → test → deploy
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

### Rule 3 — Explicit output directive in every agent prompt

```
Write ALL results to `data/[agent]_latest.md` in this exact format:
# [Agent Name] — YYYY-MM-DD HH:MM
[structured content]
```

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
1. `PATH` line required — crontab does not inherit shell PATH
2. Absolute paths everywhere — no `~/`
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
curl -s -X POST "https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage" \
  -d chat_id="{TELEGRAM_CHAT_ID}" \
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

| | Runtime | Cost |
|--|---------|------|
| Worker agent | ~90–270 sec | — |
| Orchestrator | ~100–210 sec | — |
| Full morning cycle | ~11 min | ~$0.08–0.15 |
SKILLEOF
```

- [ ] **Step 3: Verify file**

```bash
wc -l ~/.claude/skills/claude-autonomous-agent/SKILL.md
head -6 ~/.claude/skills/claude-autonomous-agent/SKILL.md
```

Expected output:
```
     190 /Users/[you]/.claude/skills/claude-autonomous-agent/SKILL.md
---
name: claude-autonomous-agent
description: Use when building a new autonomous...
---
```

---

### Task 2: Baseline Test (RED)

Документуємо що Claude робить БЕЗ skill — щоб знати що потрібно виправляти.

**Files:** none created

- [ ] **Step 1: Open a fresh Claude session (new conversation)**

Do not invoke the skill. Run this prompt verbatim:

> "Build me an autonomous macOS system that runs every morning, searches LinkedIn for Director of Supply Chain jobs, and sends me a Telegram message with results. Store the daily briefing in Notion."

- [ ] **Step 2: Check output against compliance checklist**

Mark each as PRESENT ✅ or MISSING ❌:

```
□ Universal run_agent.sh launcher created
□ --permission-mode bypassPermissions in claude command
□ --allowedTools specified
□ Read config.env at top of agent prompts
□ Read data/profile.md at top of agent prompts
□ Write directive to data/*_latest.md with format
□ NO_RESULTS: graceful failure in agent prompts
□ PATH= line in crontab
□ Absolute paths in crontab (no ~/)
□ Orchestrator reads config.env in STEP 1
□ Orchestrator has stale data check (STEP 2)
□ Notion UUID note mentioned
```

Expected: most items are MISSING. This is the RED state. Record which items are missing — these are the loopholes the skill must close.

---

### Task 3: Skill Test (GREEN)

- [ ] **Step 1: Open a fresh Claude session**

Invoke the skill first:

```
Use the claude-autonomous-agent skill.
Then build me an autonomous macOS system that runs every morning, searches LinkedIn for Director of Supply Chain jobs, and sends me a Telegram message with results. Store the daily briefing in Notion.
```

- [ ] **Step 2: Run the same compliance checklist**

All 12 items from Task 2 should now be PRESENT ✅.

- [ ] **Step 3: If any items still MISSING — add a rule to SKILL.md**

For each missing item, find which section should cover it and add an explicit directive. Example: if `PATH=` in crontab is still missing, add to Section 5:

```bash
# In SKILL.md, Section 5, add after "Rules:" list:
# CRITICAL: Without PATH line, crontab cannot find the `claude` binary and silently fails.
```

Re-run Step 1–2 until all 12 items pass.

---

### Task 4: Commit

- [ ] **Step 1: Commit the skill file**

```bash
cd ~/.claude
git add skills/claude-autonomous-agent/SKILL.md
git status
git commit -m "feat: add claude-autonomous-agent personal skill

Distilled from Job Search Orchestrator built May 2026.
Covers 4 critical claude -p rules, run_agent.sh template,
orchestrator prompt, crontab setup, and known issues."
```

Expected:
```
[main xxxxxxx] feat: add claude-autonomous-agent personal skill
 1 file changed, 190 insertions(+)
 create mode 100644 skills/claude-autonomous-agent/SKILL.md
```

- [ ] **Step 2: Verify skill is available in next session**

Open a new Claude session. Check that `claude-autonomous-agent` appears in the available skills list in the system-reminder.

---

## Self-Review

**Spec coverage check:**

| Design spec section | Covered in plan |
|--------------------|----------------|
| Section 1 (Triggers) | ✅ SKILL.md intro + Quick Reference |
| Section 2 (Architecture) | ✅ SKILL.md Section 1 |
| Section 3 (4 rules + example) | ✅ SKILL.md Section 2 |
| Section 4 (File structure + run_agent.sh) | ✅ SKILL.md Section 3 |
| Section 5 (Profile schema) | ✅ SKILL.md Section 4 |
| Section 6 (Crontab) | ✅ SKILL.md Section 5 |
| Section 7 (Orchestrator template) | ✅ SKILL.md Section 6 |
| Section 8 (Onboarding Q&A) | ✅ SKILL.md Section 7 |
| Section 9 (Testing checklist) | ✅ SKILL.md Section 8 |
| Known issues table | ✅ SKILL.md Known Issues |
| Benchmarks | ✅ SKILL.md Benchmarks |

**Placeholder scan:** No TBD, TODO, or "similar to above" found. All code blocks contain complete content.

**Type consistency:** `data/*_latest.md` naming consistent throughout. `run_agent.sh` usage consistent in all references.
