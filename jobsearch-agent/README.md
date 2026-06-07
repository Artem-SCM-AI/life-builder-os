# Job Search Agent

AI agents that find, score, and track jobs for you — every weekday morning.

**What happens every morning at 8 AM:**
- Searches LinkedIn (via Apify), Wellfound, Greenhouse, Remotive, and your email alerts
- Scores each job against your profile and hard filters
- Pushes only relevant matches to your Notion pipeline
- Updates your Daily Briefing page with a summary

**You open Notion. Everything is already there.**

---

## Prerequisites

| What | Cost | Notes |
|---|---|---|
| Claude Pro | $20/mo | Required. claude.ai/pricing |
| Notion | Free | notion.so |
| Apify | Free tier | apify.com — $5 free credits/month is enough |
| Gmail | Free | For receiving job alert emails |
| Mac | — | macOS 12 or later |

---

## Installation

1. Download and unzip the product
2. Double-click **START HERE.command**
3. Terminal opens — approve any permission prompts
4. Follow the setup (15–20 minutes)
5. Done — agent runs tomorrow morning at 8 AM

**Video walkthroughs** for each step are in the product bundle.

---

## What the setup asks

- Your professional background (role, experience, wins)
- What you want (target roles, industries, location)
- Hard NO's (what to filter out)
- 3 ideal job descriptions (paste them — calibrates scoring)
- Gmail App Password (to read job alert emails)
- Apify API key (for LinkedIn scraping)
- Notion token (to write to your pipeline)

---

## Running manually

If your Mac was off at 8 AM, run the agents manually:

```bash
~/.jobsearch/run_agent.sh jobs
~/.jobsearch/run_agent.sh orchestrator
```

---

## Viewing logs

```bash
tail -20 ~/.jobsearch/data/jobs.log
tail -20 ~/.jobsearch/data/orchestrator.log
```

---

## Updating your profile

Edit `~/.jobsearch/data/my_profile.md` in any text editor.
Changes take effect on the next run.

---

## Troubleshooting

**"claude: command not found"**
→ Close Terminal and reopen. If still missing: re-run START HERE.command.

**0 jobs found**
→ Your filters may be too narrow. Edit `~/.jobsearch/data/my_profile.md` and loosen the Hard NO's section.

**Gmail read fails**
→ Verify App Password: Google Account → Security → App Passwords. 2-Step Verification must be ON.

**Notion pages not created**
→ Open Claude Code → type `/mcp` → verify Notion is connected and authorized.

**Apify returns 0 results**
→ Check your APIFY_API_KEY in `~/.jobsearch/config.env`. Verify at apify.com → Settings → API.

---

## Support

DM on LinkedIn: linkedin.com/in/artem-stepanenko
Response within 24 hours.
