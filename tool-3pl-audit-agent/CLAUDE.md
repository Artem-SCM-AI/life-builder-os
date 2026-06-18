@~/.claude/shared/coding-style.md
@~/.claude/shared/testing.md
@~/.claude/shared/security.md
@~/.claude/shared/code-review.md
@~/.claude/shared/development-workflow.md

# tool-3pl-audit-agent

Claude Code-powered agent that audits 3PL invoices against the rate card and flags overcharges.

## Run

```bash
bash run_agent.sh
```

Before first run:
```bash
bash setup.sh   # saves rate card, configures Telegram, sets up crontab (optional)
```

## Input

Place invoice CSV in `invoices/` folder before running. Agent picks up the latest file automatically.

## Output (in `data/`)

| File | Contents |
|---|---|
| `audit_full_YYYY-MM.md` | Every line: VALID / REVIEW / DISPUTE |
| `audit_disputes_YYYY-MM.md` | Flagged lines + total variance |
| `audit_summary_YYYY-MM.md` | Summary: amounts, categories, top disputes |

## Key files

| File | Purpose |
|---|---|
| `run_agent.sh` | Entry point — launches Claude Code agent |
| `setup.sh` | One-time setup: rate card, Telegram, crontab |
| `data/rate_card.md` | Your 3PL contract rates (edit when rates change) |
| `agents/` | Agent prompt definitions |

## Rate card

Stored in `data/rate_card.md`. Edit directly when the 3PL updates rates.

## Automation

Optional crontab runs on the 1st of each month at 09:00. Drop the invoice CSV in `invoices/` before then.

## Troubleshooting

- **"No invoice file found"** → CSV must be in `invoices/`
- **No output files** → `chmod +x run_agent.sh`
- **Wrong flags** → update `data/rate_card.md`
