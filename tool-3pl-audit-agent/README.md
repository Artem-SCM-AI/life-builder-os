# 3PL Invoice Audit Agent

Autonomous Claude-powered agent that audits your 3PL invoices and flags overcharges automatically.

**What it does:**
- Reads your 3PL invoice CSV
- Compares every line against your rate card
- Flags wrong rates, duplicates, and unauthorized charges
- Outputs two files: full audit + dispute list
- Sends a macOS notification when done
- Runs automatically every month (optional)

---

## Setup (one time, 5 minutes)

**Requirements:**
- Claude Code CLI installed (`claude --version` to check)
- Your 3PL rate card (from your contract)

**Steps:**
```bash
bash setup.sh
```

Follow the prompts. The script will:
1. Save your rate card
2. Configure Telegram notifications (optional)
3. Set up automatic monthly crontab (optional)

---

## Running the audit

**Manually:**
1. Download your invoice from the 3PL portal as CSV
2. Place it in the `invoices/` folder
3. Run:
```bash
bash run_agent.sh
```

**Automatically:** If you set up crontab during setup, the agent runs on the 1st of each month at 09:00. Just drop the invoice CSV in `invoices/` before then.

---

## Output files (in `data/` folder)

| File | Contents |
|---|---|
| `audit_full_YYYY-MM.md` | Every invoice line + Status (VALID / REVIEW / DISPUTE) |
| `audit_disputes_YYYY-MM.md` | Only flagged lines + total variance |
| `audit_summary_YYYY-MM.md` | Summary: amounts, categories, top disputes |

---

## Importing results into Google Sheets

1. Open [3PL Audit Template](link-to-sheet) — make a copy
2. File → Import → Upload `audit_full_YYYY-MM.md`
3. Color coding applies automatically (DISPUTE = red, REVIEW = yellow, VALID = green)
4. The Disputes tab auto-filters from the full audit

---

## Rate card

Your rates are stored in `data/rate_card.md`. Edit this file anytime your 3PL updates their rates.

---

## Troubleshooting

**"No invoice file found"** → Make sure the CSV is in the `invoices/` folder.

**Agent doesn't write output files** → Run `chmod +x run_agent.sh` then try again.

**Wrong amounts flagged** → Check `data/rate_card.md` — rates may need updating.
