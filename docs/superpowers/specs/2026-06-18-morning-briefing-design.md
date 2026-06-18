# Morning Briefing → Telegram: Design Spec

**Date:** 2026-06-18
**Status:** Approved (v2 — post self-review)

---

## Goal

Deliver a daily morning briefing to Artem's Telegram at 8:45 AM Mon–Fri.
One message. ~200 words. Answers: what's most important today, what's at risk, what decision to make before starting work.

No Obsidian. No n8n. No new services.

---

## Architecture

```
Mac crontab (8:45 AM Mon-Fri)
        ↓
tool-morning-briefing/run.sh  (activates venv)
        ↓
tool-morning-briefing/briefing.py
        ↓
  reads hot.md + project_current.md + user_profile.md
        ↓
  Claude API (claude-haiku-4-5-20251001)
        ↓
  Telegram sendMessage → CHAT_ID
```

---

## Files

```
tool-morning-briefing/
├── briefing.py          # main script
├── run.sh               # venv activation + python call (like Threads poster)
├── config.env           # secrets — NOT committed
├── config.env.template  # template — committed
├── requirements.txt     # anthropic, requests, python-dotenv
└── .gitignore           # ignores config.env
```

---

## briefing.py — logic

```
1. Parse args: --dry-run flag (print to stdout, skip Telegram)
2. Load config.env via python-dotenv
3. Read hot.md (full content)
4. Read project_current.md (active projects context)
5. Read user_profile.md (who Artem is — stable, low token cost)
6. Build prompt with labeled sections
7. Call Claude API → get briefing text
8. If --dry-run: print to stdout and exit
9. Send to Telegram via requests.post
10. On any exception: send error alert to Telegram (same bot)
```

Telegram is called inline (5-line `requests.post`) — no dependency on `tool-threads-poster/notifier.py`.

---

## config.env.template

```
TELEGRAM_TOKEN=
TELEGRAM_CHAT_ID=
ANTHROPIC_API_KEY=
HOT_MD_PATH=/Users/artem/Claude v 1.0/hot.md
PROJECT_CURRENT_PATH=/Users/artem/.claude/projects/-Users-artem-Claude-v-1-0/memory/project_current.md
USER_PROFILE_PATH=/Users/artem/.claude/projects/-Users-artem-Claude-v-1-0/memory/user_profile.md
```

`ANTHROPIC_API_KEY` lives only here — crontab does not inherit shell env, so `~/.zshenv` is not enough.

---

## run.sh

```bash
#!/bin/bash
cd "$(dirname "$0")"
source .venv/bin/activate
python briefing.py "$@"
```

`"$@"` passes `--dry-run` through when testing manually.

---

## Crontab entry

```cron
45 8 * * 1-5 "/Users/artem/Claude v 1.0/tool-morning-briefing/run.sh" >> /tmp/morning-briefing.log 2>&1
```

Log at `/tmp/morning-briefing.log`. Cleared on Mac reboot — acceptable.

---

## Prompt

```
You are Artem's morning assistant. Generate his daily briefing in Ukrainian.

[USER PROFILE]
{user_profile content}

[CURRENT PROJECTS & STATE — hot.md]
{hot.md content}

[ACTIVE PROJECTS DETAIL]
{project_current.md content}

Answer these 4 questions:
1. The ONE most important thing to do today
2. What needs action before noon and why  
3. What is at risk if ignored today
4. One open decision to make before starting work

Rules:
- Max 200 words
- Ukrainian language
- Start with most urgent item
- Plain text only — no markdown, no headers
- Do not repeat project names more than once each
```

---

## Error handling

- Any exception in the script → catch → send Telegram alert: `"Morning briefing failed: {error}"`
- If Telegram itself fails → write to log only (can't alert about alert failure)

---

## Testing

```bash
# Test without sending to Telegram:
cd tool-morning-briefing
source .venv/bin/activate
python briefing.py --dry-run

# Test full send:
python briefing.py
```

---

## Cost

| Item | Est. tokens |
|---|---|
| hot.md | ~800 |
| project_current.md | ~400 |
| user_profile.md | ~300 |
| System prompt | ~250 |
| **Total input** | **~1,750** |
| Output (briefing) | ~300 |

Haiku 4.5: ~$0.001/run → **~$0.02/month**.

---

## Dependencies

```
anthropic>=0.40.0
requests>=2.31.0
python-dotenv>=1.0.0
```

---

## What is NOT in scope

- Obsidian dashboard
- n8n workflows
- Weekend briefings (Mon–Fri only; manual `run.sh` available any day)
- Reading all memory files (only 3 targeted files)
- Vault maintenance or updates
