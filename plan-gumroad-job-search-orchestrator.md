# Job Search Orchestrator — Product Brief (Gumroad)

**Context:** I have a working personal Claude-based job search automation system
(Mac + Terminal + Notion + LaunchAgents). I want to strip it down and package a
simplified version to sell on Gumroad at **$9**, bundled with a setup video.

**Target buyer:** Job seekers on Mac who are comfortable with Terminal.
Any role, any location (supports remote filter or region filter).
No coding skills required — just ability to follow a video.

---

## What the product delivers — 5 components

### 1. Onboarding — `setup.sh` + video

Interactive bash script that:
- Asks: name, target role, seniority level, location preference (remote / country / city),
  target industries, salary range
- Asks for Anthropic API key (video shows where to get it)
- Asks for Notion API token + parent page ID where the pipeline should live
  (video shows how to get both)
- Writes everything to `~/.jobsearch/config.env`
- Triggers `setup_notion_agent.md` — Claude creates the full Job Search Pipeline
  database in Notion automatically (all columns, select options, both views)
  and saves the returned DB ID back to config.env
- Installs the LaunchAgent for the daily job agent at user-chosen time
- Prints a "you're ready" confirmation

**Video covers:** buying the product → installing claude CLI → running setup.sh →
what to expect tomorrow morning. (~15 min screen recording)

---

### 2. One-time deep scan — `initial_scan_agent.md`

Runs once manually after setup. Claude agent that:
- Reads ICP from `config.env`
- Searches LinkedIn Jobs, Indeed, and 1–2 user-specified boards for jobs
  from the past 30 days matching the ICP
- Scores each job (1–10: role match, seniority, location, company, freshness)
- Creates Notion cards for TOP (score ≥7) and REVIEW (score 5–6) jobs in the pipeline DB
- Prints summary: "Found N jobs — X added to Notion"

---

### 3. Daily job agent — `daily_jobs_agent.md` + LaunchAgent plist

Runs automatically every weekday morning at user-configured time. Claude agent that:
- Reads ICP from `config.env`
- Searches for jobs posted in the last 24–48h
- Deduplicates against `~/.jobsearch/data/seen_jobs.md` (list of already-seen URLs)
- Adds new matches to Notion pipeline (Status: "To Review")
- Appends new URLs to `seen_jobs.md`
- Writes results to `~/.jobsearch/data/jobs_latest.md`

---

### 4. Resume template — `resume_prompt.md`

A ready-to-use Claude prompt (not an agent — copy-paste into any Claude chat).
User pastes the job description + their current resume → gets a tailored resume
and cover letter. ATS-friendly output. Includes usage instructions.

---

### 5. Motivational speech — `motivation_agent.md`

One-shot Claude agent the user can run anytime. Reads their ICP + counts jobs
applied so far from Notion → delivers a personalized pep talk using their actual
role, location, and progress numbers. Not generic.

---

## Onboarding flow — step by step

### Prerequisites
- Mac (macOS 12+)
- Terminal (built-in)
- Anthropic account (~$5 top-up lasts months)
- Notion account (free plan is enough)
- 20 minutes

### Step 1 — Install claude CLI
```bash
npm install -g @anthropic-ai/claude-code
```
If npm not installed:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node
```

### Step 2 — Get Anthropic API key
1. Go to console.anthropic.com
2. Billing → top up $5
3. API Keys → Create Key → copy (`sk-ant-...`)

### Step 3 — Prepare Notion
**3a. Create integration:**
1. Go to notion.so/my-integrations
2. "New integration" → name it "Job Search Agent"
3. Copy Internal Integration Secret (`secret_...`)

**3b. Prepare the parent page:**
1. Create or choose a Notion page where the pipeline will live
2. Open that page → ⋯ → Connections → connect "Job Search Agent"
3. Copy the page ID from the URL (`notion.so/Page-Title-**abc123**`)

> Skipping the Connections step is the most common mistake — Claude won't be
> able to write to Notion without it.

### Step 4 — Run setup.sh
```bash
cd ~/Downloads && unzip jobsearch-orchestrator.zip && cd jobsearch-orchestrator
bash setup.sh
```

Script prompts one question at a time:
```
👋 What's your name?                    → Artem
🎯 Target role?                         → Head of Supply Chain
📊 Seniority?                           → Director / Head / VP
🌍 Location preference?                 → Remote
🏭 Target industries?                   → E-commerce, Retail, Consumer Goods
💰 Minimum salary (USD, optional)?      → 90000
🔑 Anthropic API key?                   → sk-ant-...
📓 Notion token?                        → secret_...
📄 Notion parent page ID?               → abc123...
⏰ Daily run time (HH:MM)?              → 08:30
```

After the last answer, setup.sh automatically:

**4a.** Writes `~/.jobsearch/config.env`

**4b.** Runs `setup_notion_agent` — Claude builds the full pipeline DB in Notion:
```
⚙️  Setting up your Notion pipeline...
✅  Created "Job Search Pipeline" database (11 columns, 13 statuses, 2 views)
✅  Saved DB ID to config.env
```

**4c.** Installs LaunchAgent:
```
⏰  Daily agent scheduled: weekdays at 08:30
✅  LaunchAgent installed
```

### Step 5 — Run initial scan (one-time)
```bash
bash run_agent.sh initial_scan
```
Takes 3–7 minutes:
```
🔍 Scanning LinkedIn Jobs...
🔍 Scanning Indeed...
📊 Scoring 63 matches...
✅ 31 jobs added to Notion (9 TOP · 22 REVIEW · 32 skipped)
```

### Step 6 — Done
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  SETUP COMPLETE

Your pipeline: 31 jobs ready to review
  → 9 TOP matches (score 7–10)
  → 22 REVIEW matches (score 5–6)

Daily agent: runs weekdays at 08:30
Next run: tomorrow, Jun 3 at 08:30
New jobs from the last 24h will be added automatically.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Timeline from zero

| Time | What happens |
|------|-------------|
| 0:00 | Downloaded zip, opened Terminal |
| 0:03 | Installed claude CLI |
| 0:06 | Got API key at console.anthropic.com |
| 0:10 | Created Notion integration, connected to page |
| 0:13 | Ran setup.sh, answered 10 questions |
| 0:15 | Claude built pipeline DB in Notion automatically |
| 0:16 | LaunchAgent installed, schedule set |
| 0:17 | Ran initial_scan |
| 0:22 | 31 jobs in Notion, pipeline ready |
| 0:23 | Terminal confirmed: tomorrow at 08:30 — next batch |
| **next day 08:30** | **Agent ran automatically, new jobs added** |

---

## Notion pipeline schema

Claude creates this automatically from `setup_notion_agent.md`.
No template duplication needed — the agent builds it fresh in the user's workspace.

Database name: **Job Search Pipeline**

### Columns

| Column | Type | Who fills it |
|--------|------|-------------|
| Job Title | title | Claude |
| Company | text | Claude |
| URL | url | Claude |
| Score | number | Claude (1–10) |
| Status | select | Claude → user |
| Location | text | Claude |
| Source | select | Claude |
| Date Found | date | Claude |
| Why This Job | text | Claude (reason for score) |
| Applied Date | date | User |
| Notes | text | User |

### Status values

**Active (visible in Active Pipeline view):**

| Status | Emoji | Meaning |
|--------|-------|---------|
| To Review | 🔵 | Agent added it, user hasn't looked yet |
| Interested | 👀 | User wants to apply |
| Preparing | ✏️ | Writing resume / cover letter |
| Applied | 📤 | Application submitted |
| HR Screen | 📞 | Screening call scheduled or done |
| Waiting | ⏳ | Ball is in their court (after any stage) |
| Test Task | 📝 | Received test assignment |
| Technical Interview | 🛠️ | Technical round |
| Final Interview | 🏁 | Final round |
| Offer | 🤝 | Received an offer |

**Archive (visible in Archive view only):**

| Status | Emoji | Meaning |
|--------|-------|---------|
| Rejected | ❌ | They said no / ghosted |
| Declined | 🚫 | User decided not to proceed |
| Closed | 🔒 | Job expired / irrelevant before applying |

### Typical status flow

```
Applied → HR Screen → ⏳ Waiting → Test Task → ⏳ Waiting
       → Technical Interview → ⏳ Waiting → Final Interview → ⏳ Waiting
       → Offer  or  Rejected
```

`⏳ Waiting` is one universal "their turn" status used after every stage.
Notes field records context: `"Waiting: feedback after test task. Sent Jun 3."`

### Notion views

Both are Table views (free plan, no Kanban needed).

**View 1 — "Active Pipeline"** (Table)
Filter: Status not in [Rejected, Declined, Closed].
Sorted by Score desc, then Date Found desc.
Default view — what the user opens every morning.

**View 2 — "Archive"** (Table)
Filter: Status in [Rejected, Declined, Closed].
Sorted by Date Found desc.
For spotting patterns: which companies reject most, which roles close fast.

### How the pipeline works day-to-day

Every morning new cards appear at the top of Active Pipeline (Status: To Review,
sorted by Score). The user reviews each card, clicks the URL, decides:
- Worth applying → move to Interested, then Preparing, then Applied
- Not relevant → move to Closed

**What the agent never does:**
- Never changes status of cards the user already moved
- Never adds duplicates (deduplication via seen_jobs.md)
- Never deletes anything

### What a single card looks like

```
┌─────────────────────────────────────────────────┐
│ 🏢 Head of Supply Chain @ Spreetail             │
├─────────────────────────────────────────────────┤
│ Score:      8/10                                │
│ Status:     🔵 To Review                        │
│ Location:   Remote (US)                         │
│ Source:     LinkedIn                            │
│ Date Found: Jun 2, 2026                         │
│ URL:        → linkedin.com/jobs/view/123456     │
├─────────────────────────────────────────────────┤
│ Why This Job:                                   │
│ Remote Director-level, e-commerce, $115–140K    │
│ visible. Amazon FBA ops. Growing brand (Series  │
│ B, 2024). Matches 8/10 signals.                 │
├─────────────────────────────────────────────────┤
│ Applied Date: [user fills]                      │
│ Notes:        [user fills]                      │
└─────────────────────────────────────────────────┘
```

---

## Technical stack

- **Mac only** — macOS LaunchAgents for scheduling
- **claude CLI** (Anthropic Claude Code) — agents run as
  `claude --permission-mode bypassPermissions -p "$(cat agent.md)"`
- **Notion** — mandatory, free plan is sufficient. DB created automatically via API.
- No Telegram. No Kanban. Everything in Notion Table views.

---

## File structure

```
jobsearch-orchestrator/
├── README.md
├── setup.sh                              # interactive onboarding
├── run_agent.sh                          # universal agent runner
├── agents/
│   ├── setup_notion_agent.md            # creates Notion DB during onboarding
│   ├── initial_scan_agent.md            # one-time 30-day deep scan
│   ├── daily_jobs_agent.md              # daily new job search
│   └── motivation_agent.md              # pep talk agent
├── templates/
│   ├── resume_prompt.md                 # copy-paste resume tailoring prompt
│   └── config.env.example               # all variables with comments
├── plists/
│   └── com.jobsearch.daily.plist.template   # __HOUR__ / __MINUTE__ filled by setup.sh
└── data/
    └── .gitkeep                         # seen_jobs.md created here at runtime
```

---

## `config.env` variables

```bash
USER_NAME="Your Name"
TARGET_ROLE="Head of Supply Chain"
SENIORITY="Senior / Director / Head"
LOCATION_PREF="Remote"          # or "Kyiv, Ukraine" or "Germany"
INDUSTRIES="E-commerce, Retail, Consumer Goods"
SALARY_MIN="80000"
SALARY_CURRENCY="USD"
ANTHROPIC_API_KEY="sk-ant-..."
NOTION_TOKEN="secret_..."
NOTION_PARENT_PAGE_ID="..."     # page where the pipeline DB will be created
NOTION_PIPELINE_DB_ID=""        # filled automatically by setup_notion_agent
DAILY_RUN_HOUR="8"
DAILY_RUN_MINUTE="30"
```

---

## Scoring logic (daily_jobs_agent)

Score 1–10. Skip if <5.

| Signal | Points |
|--------|--------|
| Role title matches target role | +2 |
| Seniority matches | +2 |
| Location matches (remote or region) | +2 |
| Industry matches | +1 |
| Company is growing / funded / scaling | +1 |
| Salary visible and above minimum | +1 |
| Job posted ≤48h ago | +1 |

- **TOP** = score ≥7 → push to Notion
- **REVIEW** = score 5–6 → push to Notion, lower priority
- **SKIP** = score <5 → log only

---

## Simplified vs my personal system

| My system | This product |
|-----------|-------------|
| 7 agents | 4 agents (setup_notion, initial scan, daily jobs, motivation) |
| SCAIT B2B lead gen layer | Removed |
| LinkedIn Gmail IMAP alerts | Removed |
| Archive agent + Company Intel DB | Removed |
| Telegram notifications | Removed — Notion only |
| Notion MCP OAuth | Notion API token (simpler for buyers) |
| 12-point scoring | Simplified 10-point scoring |
| Morning orchestrator | No orchestrator — daily agent is standalone |
| Notion template (manual duplicate) | Claude builds DB automatically via API |
| Kanban board view | Table views only (free plan, simpler) |

---

## Gumroad packaging

- **Price:** $9 one-time
- **Deliverable:** zip file with all files listed above
- **Video:** ~15 min screen recording, full setup from zero to first morning run
- **No ongoing costs** except Anthropic API usage (~$0.10–0.30/day)

---

## What to build (task list for the implementing chat)

1. `setup.sh` — interactive, validates all inputs, writes config.env,
   triggers setup_notion_agent, installs plist with user-chosen time,
   prints step-by-step instructions
2. `run_agent.sh` — sources config.env, runs claude with --allowedTools
   (WebSearch Read Write Bash + Notion API tools), logs to data/agent.log
3. `setup_notion_agent.md` — creates Job Search Pipeline DB in Notion with all
   11 columns, 13 statuses, 2 table views; saves DB ID to config.env
4. `initial_scan_agent.md` — 30-day deep scan, ICP-based scoring, Notion push
5. `daily_jobs_agent.md` — daily agent: search, dedup via seen_jobs.md, Notion push
6. `motivation_agent.md` — reads ICP + Notion applied count, delivers pep talk
7. `resume_prompt.md` — structured copy-paste prompt for resume tailoring
8. `README.md` — prerequisites, step-by-step setup, troubleshooting section
9. `com.jobsearch.daily.plist.template` — LaunchAgent with `__HOUR__` / `__MINUTE__`
   placeholders filled by setup.sh
10. `config.env.example` — all variables with inline comments

**Start by asking any clarifying questions, then build all 10 files.**
