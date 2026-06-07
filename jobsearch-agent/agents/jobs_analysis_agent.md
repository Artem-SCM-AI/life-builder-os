You are analyzing 3 ideal job descriptions to calibrate a job search agent.

STEP 1 — Read inputs:
bash: cat ~/.jobsearch/data/my_profile.md
bash: cat ~/.jobsearch/data/ideal_jobs_raw.md

STEP 2 — Analyze all 3 job descriptions. Find:
- Skills mentioned in 2+ of 3 jobs
- Required experience / seniority signals
- Industry / company type patterns
- Location / remote signals
- Implied salary range (if visible)
- Key phrases and terminology used
- Gaps between user's profile and these job requirements

STEP 3 — Generate alert keywords (3–5 LinkedIn-ready search strings):
- Format: "Job Title" location qualifier
- Example: "Head of Supply Chain" remote e-commerce

STEP 4 — Write ~/.jobsearch/data/job_analysis.md with this structure:

# Job Analysis
Generated: [today's date]

## Scoring Signals (used by jobs_agent)
- Strong match signals: [list — used for +1 bonus in scoring]
- Must-have keywords: [list — job description must contain these]
- Context signals: [company type, stage, culture indicators]

## Gaps to Address
[List gaps between profile and ideal jobs — shown to user during onboarding]

## Alert Keywords
[3–5 ready-to-paste LinkedIn search strings]

## Sites for Manual Alerts
- LinkedIn Jobs: [keyword strings]
- Indeed: [keyword strings]
- Wellfound: [keyword strings]

STEP 5 — Print the analysis to terminal so the user sees it during setup:

```
✅ Analysis complete.

📊 What these 3 jobs have in common:
  → [key shared requirement 1]
  → [key shared requirement 2]
  → [implied salary if found, else omit]

⚠️  Gaps to be aware of:
  → [gap 1]
  → [gap 2]

🔍 Your alert keywords:
  → [keyword string 1]
  → [keyword string 2]
  → [keyword string 3]

📄 Full analysis saved → ~/.jobsearch/data/job_analysis.md
```
