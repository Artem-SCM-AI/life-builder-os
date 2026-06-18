# Job Search Agent — Setup Guide
*By Artem Stepanenko | SCAIT*

---

## What you're setting up

An autonomous AI agent that runs on your Mac every morning and does this automatically:
1. Searches for new jobs matching your profile
2. Adds them to your Notion pipeline with analysis
3. Archives old listings you've already reviewed

After setup, your only job is to look at Notion and decide what to apply to.

**Total setup time: ~30 minutes.**
No coding required. Copy-paste setup throughout.

---

## What you need before starting

- **Mac** (macOS 12 or later)
- **Claude Code** — install at claude.ai/code (free plan works)
- **Notion account** — free at notion.so
- **Files from this download** — the 4 files included in this package

---

## Step 1 — Install Claude Code

If you already have Claude Code, skip to Step 2.

Open Terminal (press Cmd + Space, type "Terminal", press Enter) and run:

```
npm install -g @anthropic-ai/claude-code
```

Then run `claude --version` to confirm it installed. If you see a version number, you're good.

---

## Step 2 — Set up your Notion pipeline

1. Go to notion.so and sign in
2. Click **"+ New page"** in the left sidebar
3. Title it: **"Job Search Pipeline"**
4. Add a **Database** (type `/database` and select "Table")
5. Add these columns to the table:
   - **Company** (text)
   - **Role** (text)
   - **Location** (text)
   - **Status** (select: New / Reviewing / Applied / Interview / Rejected / Offer)
   - **Relevance** (select: High / Medium / Low)
   - **URL** (URL)
   - **Notes** (text)
   - **Date Added** (date)
6. Copy the page URL from your browser. The ID is the last part after the final `/` — 32 characters, looks like: `a1b2c3d4e5f6...`

Save this ID — you'll need it in Step 4.

---

## Step 3 — Fill out your ICP (Ideal Candidate Profile)

Open `icp-worksheet.md` from this download and fill in your answers. This is what the agent uses to search for you.

Key fields:
- **Target role(s):** e.g. "Head of Supply Chain, Director of Operations, VP Supply Chain"
- **Location preference:** Remote / Hybrid / On-site / Specific city
- **Seniority:** Entry / Mid / Senior / Director / VP / C-level
- **Target industries:** e.g. "e-commerce, Amazon FBA, consumer goods, retail"
- **Must-have keywords:** terms that should appear in the job description
- **Exclude keywords:** companies, roles, or terms to skip

Save the completed worksheet. The agent reads it every time it runs.

---

## Step 4 — Copy agent files to the right place

Open Terminal and run these commands one by one (copy-paste each line):

```bash
mkdir -p ~/.claude/scripts/agents
mkdir -p ~/.claude/scripts/data
```

Now copy the files from this download to the right locations:

- Copy `run_agent.sh` → `~/.claude/scripts/run_agent.sh`
- Copy `job_search_agent.md` → `~/.claude/scripts/agents/job_search_agent.md`
- Copy your completed `icp-worksheet.md` → `~/.claude/scripts/data/icp.md`

Make the launcher executable:
```bash
chmod +x ~/.claude/scripts/run_agent.sh
```

---

## Step 5 — Add your Notion page ID

Open `~/.claude/scripts/agents/job_search_agent.md` in any text editor (TextEdit works).

Find this line:
```
NOTION_PIPELINE_ID: [PASTE YOUR PAGE ID HERE]
```

Replace `[PASTE YOUR PAGE ID HERE]` with the 32-character ID you copied in Step 2.

Save the file.

---

## Step 6 — Run the deep search (first time)

This searches all jobs from the last 30 days and builds your full pipeline in Notion.

In Terminal:
```bash
bash ~/.claude/scripts/run_agent.sh job_search deep
```

This takes 3–8 minutes. Let it run. When it finishes, open Notion — you'll see your pipeline populated with jobs, each analyzed and tagged.

---

## Step 7 — Set up daily automation

This makes the agent run automatically every morning at 8:00 AM.

In Terminal:
```bash
crontab -e
```

This opens a text editor. Add this line at the bottom:

```
0 8 * * 1-5  /Users/YOUR_USERNAME/.claude/scripts/run_agent.sh job_search daily
```

Replace `YOUR_USERNAME` with your Mac username (run `whoami` in Terminal to find it).

Save and close (press Ctrl+X, then Y, then Enter if using nano).

That's it. The agent now runs every weekday morning at 8:00 AM.

---

## Step 8 — Use the resume template

Open `resume-template.md` from this download.

For each job you want to apply to:
1. Copy the job description
2. Open Claude.ai (or Claude Code)
3. Paste this prompt:

> "Here is my resume template: [paste resume-template.md content]. Here is the job description: [paste job description]. Adapt my resume for this specific role. Keep the structure, update the highlights and bullet points to match what this company is looking for."

Claude rewrites your resume for that specific role in under 2 minutes.

---

## How to read your Notion pipeline

After each daily run, new jobs appear in your pipeline with:
- **Relevance:** High / Medium / Low — start with High
- **Notes:** Brief analysis — what's good, what's a red flag
- **Status:** All new jobs start as "New" — change to "Reviewing" when you look at them, "Applied" when you send

Your workflow:
1. Open Notion in the morning
2. Filter by Status = "New"
3. Review High relevance first
4. Change status as you go

---

## Troubleshooting

**Agent didn't write anything to Notion**
Check that your Notion page ID is correct in the agent file. The ID must be 32 characters with no dashes.

**Command not found: claude**
Claude Code isn't in your PATH. Run: `export PATH="$HOME/.local/bin:$PATH"` then try again.

**No jobs found**
Your ICP keywords may be too narrow. Open `icp.md` and broaden the role titles or industries, then re-run.

**Crontab not running**
Make sure you gave Terminal permission to run in background: System Settings → Privacy & Security → Full Disk Access → add Terminal.

---

## What's in this download

| File | What it is |
|------|-----------|
| `job-search-agent-setup-guide.md` | This guide (PDF version) |
| `run_agent.sh` | The launcher script |
| `job_search_agent.md` | The agent prompt |
| `icp-worksheet.md` | Your profile template (fill this in) |
| `resume-template.md` | Resume template (Claude-adaptive) |

---

## Questions?

Email: eco.stepanenko@gmail.com
LinkedIn: linkedin.com/in/artem-stepanenko

---

*© 2026 Artem Stepanenko. For personal use only.*
