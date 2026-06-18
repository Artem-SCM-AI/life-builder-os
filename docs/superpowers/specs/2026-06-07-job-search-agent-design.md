# Job Search Agent — Design Spec
**Date:** 2026-06-07
**Product:** Job Search Agent
**Price:** $47
**Platform:** Mac (local execution, Claude Code CLI)
**Distribution:** Gumroad zip

---

## 1. Product Vision

A $47 Gumroad product that automates daily job search for any Mac user. Every weekday morning, 3 data sources are scraped, jobs are scored against the user's profile and hard no's, and results land in a clean Notion pipeline — without the user doing anything.

The onboarding is designed as a one-time deep intake that makes the agent smarter: the more the user shares, the better the filtering.

---

## 2. Architecture Overview

```
START HERE.command (double-click)
    → auto-installs Node.js, Claude Code CLI, logs in
    → runs setup.sh (gamified onboarding)
    → generates keyword list for alert subscriptions
    → user subscribes to LinkedIn/site alerts manually
    → technical setup (Apify, Gmail, Notion)
    → crontab installed automatically

Daily run (8:00 AM Mon–Fri):
    ┌─────────────┬──────────────────┬─────────────────┐
    │ Apify        │ WebSearch        │ Gmail IMAP       │
    │ (LinkedIn)   │ (other sites)    │ (email alerts)   │
    └──────┬───────┴────────┬─────────┴────────┬────────┘
           └────────────────┼──────────────────┘
                            ↓
                    [jobs_agent.md]
                    filter by hard no's
                    score 1–10
                    deduplicate (seen_jobs.md)
                    push to Notion Pipeline
                    write jobs_latest.md
                            ↓
                 [orchestrator_agent.md] (8:15 AM)
                 update "Daily Briefing" page in Notion
```

---

## 3. File Structure

```
jobsearch-agent/
├── START HERE.command        ← double-click installer
├── setup.sh                  ← gamified onboarding (8 sections)
├── run_agent.sh              ← universal agent runner
├── README.md
├── agents/
│   ├── jobs_agent.md            ← 3 sources → score → Notion
│   ├── orchestrator_agent.md   ← Daily Briefing in Notion
│   ├── setup_notion_agent.md   ← creates pipeline DB on first run
│   └── jobs_analysis_agent.md  ← analyzes 3 ideal jobs during onboarding
├── templates/
│   ├── resume_prompt.md      ← copy-paste resume tailoring prompt
│   └── keywords_guide.md     ← how to subscribe to alerts on each site
└── data/
    └── .gitkeep              ← seen_jobs.md and logs created at runtime
```

**Install location:** `~/.jobsearch/`

---

## 4. Smart Installer (START HERE.command)

Mac `.command` file auto-opens Terminal on double-click. No user command needed.

**Flow:**
```
🚀 Job Search Agent — Installer

Checking Node.js...     not found → installing...   ✓
Checking Claude Code... not found → installing...   ✓
Logging you in...       → opens browser             ✓ Logged in

Copying files to ~/.jobsearch/...                   ✓

──────────────────────────────────────────────────
Press Enter to start setup...
──────────────────────────────────────────────────
[auto-runs setup.sh]
```

**What it installs:**
- Node.js (via official .pkg or Homebrew if present)
- Claude Code CLI (`npm install -g @anthropic/claude-code`)
- Runs `claude login` (browser OAuth)
- Copies all product files to `~/.jobsearch/`

---

## 5. Gamified Onboarding (setup.sh)

8 sections + 1 bonus task. Visual progress header per section. Motivational context before hard sections.

### Section 1 — Who you are
1. Full name
2. Current/last job title
3. Years of experience in this field
4. Current status: employed / between jobs / freelance

### Section 2 — Your wins
5. Top 3 achievements — each with a number
   *(example shown: "Cut logistics costs 35% ($2M/yr), built 3PL network from 0, led team of 8")*
6. The one thing you fixed or built that you're most proud of (2–3 sentences)

### Section 3 — What you want
7. Target job titles (up to 5, comma-separated)
8. Target industries
9. Company stage: [1] Early startup [2] Growth Series A–C [3] Scale-up/public [4] No preference
10. Location preference
11. Minimum salary (optional)

### Section 4 — Hard NO's: roles
12. Industries to exclude (or 'none')
13. Role types to exclude (e.g. IC-only, sales, night ops)
14. Reporting structure you don't want (e.g. no team, matrix org, direct to board)

### Section 5 — Hard NO's: companies & conditions
15. Company size to exclude: [1] <20 people [2] 500+ people [3] Both [4] No preference
16. Work conditions that are dealbreakers (e.g. relocation, travel >30%, unpaid trials)
17. Culture/environment to avoid (e.g. micromanagement, no strategy involvement)

### Section 6 — Your real skills
18. Tools & systems you use regularly (e.g. NetSuite, Flexport, Excel, Power BI)
19. What do colleagues come to you for? (not your title — the actual thing)
20. Certifications, languages, education (or 'none')

### Section 7 — Your search so far
21. Companies you've already applied to (avoid duplicates)
22. What patterns have you noticed — what's not working?

### Section 8 — Your resume
23. Paste full resume as plain text. Type END on new line when done.

---

### Bonus Task — 3 Ideal Jobs Analysis

After Section 8, user pauses and finds 3 real job listings they'd genuinely apply to.

```
══════════════════════════════════════════════════════
 🎯 BONUS TASK — Your 3 ideal jobs
   Most important step. Watch video section 3 first.
══════════════════════════════════════════════════════

Go to LinkedIn (or any job site). Find 3 jobs where
you think: "I could do this. This is me."

For each: copy the full job description → paste below.

⏸  Take your time. This makes everything sharper.
   Press Enter when ready to paste job #1...
```

Claude runs automatically via `claude --allowedTools "Bash,Read,Write" -p "$(cat ~/.jobsearch/agents/jobs_analysis_agent.md)"` and produces:

```
✅ Analysis complete.

 📊 What these 3 jobs have in common:
   → Required: inventory management, supplier negotiation, team lead
   → Context: remote-first, Series B–D, e-commerce or DTC
   → Implied salary: $110K–$150K

 ⚠️  Gaps to be aware of:
   → 2 of 3 mention ERP (NetSuite/SAP) — add if you have it
   → All 3 mention "cross-functional leadership" — reflect in resume

 🔍 Your LinkedIn alert keywords:
   → "Head of Supply Chain" remote e-commerce
   → "Director of Operations" DTC remote
   → "VP Supply Chain" Series B remote

 📄 Full analysis saved → data/job_analysis.md
```

`job_analysis.md` is read by the jobs agent on every run to calibrate scoring.

---

### Post-Onboarding: Alert Subscriptions

System prints ready-to-use keyword strings per site. User subscribes manually. `keywords_guide.md` shows exactly where to click on LinkedIn, Indeed, Wellfound, Greenhouse, and Remotive.

```
⏸  Subscribe to alerts now. Press Enter when done.
```

---

### Technical Setup (final step)

Prompted one at a time with video timestamps (timestamps added after recording):
- Apify API key
- Gmail App Password
- Notion integration token + parent page ID
- Daily run time (default: 8:00 AM)

Crontab installed silently. No crontab commands shown to user.

---

## 6. Data Sources (jobs_agent.md)

Three parallel sources, all processed in one agent run:

| Source | Method | Sites |
|---|---|---|
| LinkedIn | Apify LinkedIn Jobs Scraper, actor: `curious_coder/linkedin-jobs-scraper` (free tier: $5/mo covers ~1500 results) | LinkedIn only |
| Other sites | Claude WebSearch tool | Wellfound, Greenhouse, Remotive (reliable); Indeed, Lever, ZipRecruiter (partial — bot detection, graceful fallback) |
| Email alerts | Gmail IMAP via Python `imaplib` using App Password. Reads unread emails from job alert senders, parses subject + body HTML | LinkedIn alerts + any subscribed site alert |

**Processing pipeline:**
1. Fetch from all 3 sources
2. Normalize to common format (title, company, url, location, posted_date, source)
3. Apply hard NO filters (excluded industries, company size, role types, conditions)
4. Score 1–10 against profile + job_analysis.md patterns
5. Deduplicate against `seen_jobs.md`
6. Push score ≥5 to Notion Pipeline
7. Append all seen URLs to `seen_jobs.md`
8. Write summary to `jobs_latest.md`

**Scoring signals (1–10):**

| Signal | Points |
|---|---|
| Role title matches target | +2 |
| Seniority matches | +2 |
| Location matches | +2 |
| Industry matches | +1 |
| Matches job_analysis.md patterns | +1 |
| Company stage matches preference | +1 |
| Salary visible and above minimum | +1 |

Score ≥7 → **TOP** (pushed to Notion, high priority)
Score 5–6 → **REVIEW** (pushed to Notion, lower priority)
Score <5 → **SKIP** (logged to jobs_latest.md only)

---

## 7. Notion Database Schema

**Database name:** Job Search Pipeline
**Created by:** setup_notion_agent.md on first run

### Columns

**Agent fills automatically:**

| Column | Type | Notes |
|---|---|---|
| Job Title | Title | Vacancy name |
| Company | Text | Company name |
| Location | Text | City or Remote |
| URL | URL | Direct link to vacancy |
| Score | Number | 1–10 |
| Why This Job | Text | 1–2 lines — agent's reasoning |
| Source | Select | LinkedIn / Indeed / Email Alert / Wellfound / Greenhouse / Lever / Remotive / Other |
| Posted Date | Date | When job was posted |
| Date Found | Date | When agent found it |

**User fills manually:**

| Column | Type | Notes |
|---|---|---|
| Status | Select | Pipeline stage (see below) |
| Contact | Text | Recruiter name + email |
| Applied Date | Date | Date application submitted |
| Salary | Text | Range or offered amount |
| Follow-up Date | Date | User sets manually |
| Company Notes | Text | Research, culture, red flags |
| Job Notes | Text | Interview prep, questions to ask |
| Notes | Text | Personal notes |
| Stage Log | Text | Manual history: "Jun 7 → Applied \| Jun 9 → HR Screen" |

**Calculated:**

| Column | Type | Notes |
|---|---|---|
| Stage # | Formula | Current pipeline depth (1–9). Note: ⏳ Waiting = 5 regardless of actual stage depth — use Stage Log for full history. |

**Stage # formula:**
```
if(prop("Status") == "📥 To Review", 1,
if(prop("Status") == "👀 Interested", 2,
if(prop("Status") == "✏️ Preparing", 3,
if(prop("Status") == "📤 Applied", 4,
if(prop("Status") == "📞 HR Screen", 5,
if(prop("Status") == "⏳ Waiting", 5,
if(prop("Status") == "📝 Test Task", 6,
if(prop("Status") == "🛠️ Technical", 7,
if(prop("Status") == "🏁 Final Round", 8,
if(prop("Status") == "🤝 Offer", 9, 0))))))))))
```

**Total: 19 columns**

### Status Pipeline

**Active:**
📥 To Review → 👀 Interested → ✏️ Preparing → 📤 Applied → 📞 HR Screen → ⏳ Waiting → 📝 Test Task → 🛠️ Technical → 🏁 Final Round → 🤝 Offer

**Archive:**
❌ Rejected · 🚫 Declined · 🔒 Closed

### Views

**View 1 — Active Pipeline** (default)
All 19 columns. Filter: Status not in [Rejected, Declined, Closed]. Sort: Score ↓ → Date Found ↓.

**View 2 — Archive**
Filter: Status in [Rejected, Declined, Closed]. Sort: Date Found ↓.

---

## 8. Orchestrator Agent (orchestrator_agent.md)

Runs at 8:15 AM, 15 minutes after jobs agent completes.

**Steps:**
1. Read `jobs_latest.md`
2. Source `config.env` to get `NOTION_PIPELINE_DB_ID`
3. Query Notion pipeline DB for entries where Follow-up Date = today → action items list
4. Query Notion pipeline DB for count of active entries (not Rejected/Declined/Closed) → pipeline size
5. Find or create "📋 Daily Briefing" page in Notion (child of `NOTION_PARENT_PAGE_ID`)
6. Overwrite page content with:
   - Jobs summary: TOP jobs (score ≥7) with title, company, score
   - Action items: follow-ups due today (job title + contact + stage)
   - Stats: N new jobs found, N total active in pipeline
7. Print summary to log

**Computer off at 8 AM:** Cron only runs when Mac is awake. If missed, user runs manually: `bash ~/.jobsearch/run_agent.sh jobs`. README documents this.

---

## 9. run_agent.sh — Universal Runner

Called by crontab. Accepts one argument: `jobs` or `orchestrator`.

```bash
#!/bin/bash
AGENT=$1
source ~/.jobsearch/config.env
LOG_FILE=~/.jobsearch/data/${AGENT}.log

claude \
  --allowedTools "Bash,Read,Write,WebSearch,mcp__plugin_marketing_notion__*" \
  --permission-mode bypassPermissions \
  -p "$(cat ~/.jobsearch/agents/${AGENT}_agent.md)" \
  >> "$LOG_FILE" 2>&1
```

---

## 10. Crontab (auto-installed, hidden from user)

```
PATH=/usr/local/bin:/usr/bin:/bin

0  8 * * 1-5  ~/.jobsearch/run_agent.sh jobs
15 8 * * 1-5  ~/.jobsearch/run_agent.sh orchestrator
```

---

## 10. Required Claude Code Capabilities

### MCP Plugin (must install manually)

| Plugin | How to install | Used by |
|---|---|---|
| **Notion** | Claude Code → `/mcp` → search "Notion" → Install → authorize | All agents that write to Notion |

Setup video walks through this step-by-step. Without Notion MCP, no agent can write to the pipeline.

### Built-in Claude Code Tools (available by default, no setup needed)

| Tool | Used for |
|---|---|
| `Bash` | Running Python IMAP script, sourcing config.env, calling Apify API via curl, writing logs |
| `Read` | Reading my_profile.md, job_analysis.md, seen_jobs.md, jobs_latest.md |
| `Write` | Writing jobs_latest.md, seen_jobs.md, job_analysis.md |
| `WebSearch` | Searching Wellfound, Greenhouse, Remotive and other job sites |

### Permissions (set automatically by run_agent.sh)

`run_agent.sh` passes `--permission-mode bypassPermissions` so agents run without prompting the user for every tool call. The user never sees permission dialogs during scheduled runs.

The explicit `--allowedTools` per agent:

| Agent | allowedTools |
|---|---|
| `jobs_agent` | `Bash,Read,Write,WebSearch,mcp__plugin_marketing_notion__*` |
| `orchestrator_agent` | `Bash,Read,mcp__plugin_marketing_notion__*` |
| `setup_notion_agent` | `mcp__plugin_marketing_notion__*` |
| `jobs_analysis_agent` | `Bash,Read,Write` |

### Claude Plan Required

**Claude Pro ($20/mo) or higher** — Claude Code CLI uses the Pro subscription. No separate API key needed if the user has Pro. API credits are an alternative but Pro is simpler for non-technical users.

---

## 11. Config File (~/.jobsearch/config.env)

```bash
# Job Search Agent — Configuration
USER_NAME=""
APIFY_API_KEY=""
GMAIL_ADDRESS=""
GMAIL_APP_PASSWORD=""
NOTION_TOKEN=""
NOTION_PARENT_PAGE_ID=""
NOTION_PIPELINE_DB_ID=""   # filled automatically by setup_notion_agent
DAILY_RUN_HOUR="8"
DAILY_RUN_MINUTE="0"
```

---

## 11. 3-Day Build Plan

**Day 1**
- `START HERE.command` (installer script)
- `setup.sh` (8 sections + bonus task + keyword generation)
- `setup_notion_agent.md` (creates 19-column DB + 2 views)
- `config.env` template
- `README.md`

**Day 2**
- `jobs_agent.md` (Apify + WebSearch + Gmail IMAP → filter → score → Notion)
- `run_agent.sh` (universal runner)
- Deduplication logic (`seen_jobs.md`)
- `keywords_guide.md`

**Day 3**
- `orchestrator_agent.md` (Daily Briefing + follow-up query in Notion)
- `resume_prompt.md` (copy-paste prompt)
- `keywords_guide.md` (moved from Day 2, finalized here)
- End-to-end testing: full run from double-click to Notion results

**Day 4 (buffer / Gumroad)**
- Fix issues found during testing
- Gumroad listing copy + product packaging + zip
- Record setup video

---

## 12. What's NOT in v1 (deferred to v2)

| Feature | Reason |
|---|---|
| Telegram notifications | Reduces setup friction for v1 |
| Follow-up automation | User manages Follow-up Date manually |
| News digest agent | Not core to job finding |
| Windows support | Mac only for v1 |
| Apify upgrade beyond free tier | Free tier sufficient for daily runs |
