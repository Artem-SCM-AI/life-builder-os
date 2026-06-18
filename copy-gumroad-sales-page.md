# GumRoad Product Page — Job Search Orchestrator
**Language:** English  
**Price:** $79 / $129 with setup call  
**Status:** Draft v1.0

---

## PRODUCT TITLE

**Job Search Orchestrator — AI Agent System for Remote Professionals**

---

## TAGLINE (under title)

*Your AI-powered job search runs every morning while you focus on what matters.*

---

## HERO SECTION

### The problem you know too well

You wake up. Open LinkedIn. Scroll through irrelevant posts. Check Greenhouse. Check Indeed. Copy-paste a job into a Google Doc. Rewrite your resume. Forget to follow up on the application you sent 9 days ago.

**That's 90 minutes of your morning — every single day — gone.**

And you're still missing jobs. Still sending generic resumes. Still losing track of where you applied.

---

## WHAT IT IS

**Job Search Orchestrator** is a set of AI agents that run automatically on your computer every morning.

No SaaS. No subscription. No third-party data. Just your own Claude AI doing the work — while you sleep.

Every weekday at 8:00 AM, the system:

- **Searches 6 job platforms** for roles matching your exact criteria
- **Scores each job** against your profile (Strong / Partial / Weak match)
- **Writes a tailored, ATS-optimized resume** for every job you want to apply to
- **Tracks your applications** in Notion with full pipeline visibility
- **Drafts follow-up messages** when it's time to check in — with smart timing logic
- **Delivers a professional news digest** relevant to your industry

You open Notion. Everything is already done.

---

## HOW IT WORKS

### Step 1 — One-time setup (15 minutes)
Run `setup.sh`. The AI asks you 12 questions about your experience, target roles, and preferences. It builds your profile and creates your Notion workspace automatically.

### Step 2 — Add 5 lines to your scheduler
Copy-paste the provided crontab entries. The system schedules itself.

### Step 3 — Wake up to results
Every morning, your Notion shows:
- New jobs found today (with match scores)
- Resumes ready for jobs you flagged
- Follow-ups due today (with drafted messages)
- Industry news digest

**That's it. You review. You act. The grunt work is handled.**

---

## WHAT'S INCLUDED

```
✅ 5 AI agent prompt files (jobs, resume, news, follow-up, orchestrator)
✅ setup.sh — interactive onboarding script
✅ run_agent.sh — universal agent launcher
✅ Notion workspace template (Jobs Pipeline + Profile + Daily Briefing)
✅ config.env template
✅ README with step-by-step setup guide
✅ Crontab entries (copy-paste ready)
✅ Windows Task Scheduler version
```

---

## WHAT THE AGENTS DO

**Jobs Agent**
Searches LinkedIn, Greenhouse, Lever, Indeed, Wellfound, and Remotive daily. First run pulls the last 1–2 weeks (you choose). After that: 10 new jobs every morning, filtered and scored against your profile.

**Resume Agent**
When you mark a job "To Apply" in Notion, the resume agent generates a tailored resume overnight — keywords matched to the job description, bullet points rewritten in the language of that specific JD. Changes status to "CV Sent" automatically.

**Follow-up Agent**
Tracks every application. If no response in 7 days — drafts a follow-up message. If a recruiter gave you a date ("we'll get back to you Friday") — you enter it in Notion, and the agent calculates the exact right day to follow up (Tuesday if they said Friday, Thursday if they said Tuesday). Draft ready in Notion. Telegram reminder on your phone.

**News Agent**
Pulls professional news relevant to your function and industry — derived automatically from your profile. Whatever matters for your career, delivered in your Notion briefing every morning.

**Orchestrator**
Ties everything together. Creates your daily briefing in Notion. Sends a Telegram message with the summary. Runs at 8:30 AM after all other agents complete.

---

## YOUR NOTION PIPELINE

```
📥 New → 👀 Reviewing → 📝 To Apply → ✉️ CV Sent
→ 📞 Interview Scheduled → 🎯 Interview Done
→ 💰 Offer → ✅ Accepted / ❌ Rejected
```

Every job has: title, company, match score, source, URL, date posted, promised response date, follow-up date, notes, and a linked resume sub-page.

---

## WHO THIS IS FOR

✅ Any professional in active search for a remote role  
✅ Mid-to-senior level: Manager, Director, Head of, VP, COO — any function  
✅ Industries: e-commerce, operations, logistics, marketing, finance, product, HR, and more  
✅ People who are serious about the search but can't spend 2 hours daily on it  

❌ Not for: entry-level job seekers, people looking for on-site only roles

---

## WHAT YOU NEED

- **Claude Code CLI** (free to install, ~$5–10/month in API usage — your own account)
- **Notion** (free plan works)
- **Telegram** (for notifications)
- **macOS** (or Windows — Task Scheduler instructions included)

That's it. No other subscriptions. No recurring fees for this product.

---

## REAL NUMBERS

| What | How much |
|------|----------|
| Jobs found on first run | ~30 (last 1–2 weeks) |
| Jobs added daily | ~10 new per morning |
| Time to setup | ~15 minutes |
| Morning cycle duration | ~15–20 minutes (runs in background) |
| Your daily time to review | ~10 minutes in Notion |
| API cost per day | ~$0.15–0.25 |

---

## PRICING

### $79 — Standard
Everything listed above. Digital download. Immediate access.

### $129 — With Setup Call
Everything above + 30-minute 1:1 call where we set it up together on your machine (Loom or Zoom).

---

## FAQ

**Do I need to know how to code?**
No. You copy-paste 5 lines into your terminal and run one script. The README walks you through every step with screenshots.

**What is Claude Code CLI?**
It's Anthropic's official command-line tool for running Claude AI locally. Free to install. You pay for API usage (~$5–10/month based on your usage). This product uses Claude Sonnet — the best coding model available.

**Does it actually submit my applications?**
No. The agent generates your tailored resume and tracks the pipeline. You review and submit. This keeps you in control of what goes out under your name.

**What if I'm on Windows?**
Windows instructions using Task Scheduler are included. Same setup, different scheduler syntax.

**What if an agent fails to run?**
Logs are saved locally. If a job fails, it's logged and the next run picks up normally. Error notifications via Telegram are on the roadmap.

**Can I customize the job filters?**
Yes — through your profile. During setup, you define your target roles, industries, location, salary range, and exclusions. All agents read from this profile.

**What if I get a job and don't need it anymore?**
Turn it off with two commands: `crontab -r` removes the schedule. Or just remove the specific lines for agents you don't need.

---

## ABOUT THE CREATOR

Built by Artem Stepanenko — Head of Supply Chain with 5+ years in e-commerce (Amazon FBA, China sourcing, 3PL management). I built this system for my own job search after leaving my last role. It runs on my machine every morning.

*"I was spending 90 minutes every morning on job boards. Now I spend 10 minutes reviewing what the system found. The follow-up agent alone has saved me from at least 6 missed opportunities."*

---

## FINAL CTA

**Stop doing manually what AI can do overnight.**

[**Get Job Search Orchestrator — $79**]

or

[**Get with Setup Call — $129**]

*Instant download. Works on macOS and Windows.*

---
*Last updated: May 2026*
