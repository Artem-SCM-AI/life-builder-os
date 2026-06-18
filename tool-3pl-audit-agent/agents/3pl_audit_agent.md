Read `data/rate_card.md` to get the 3PL name, warehouse location, all rates, and the dispute threshold.

Find the most recent CSV file in the `invoices/` folder (by filename or modification date).
Read that file completely.

---

You are a 3PL invoice auditor. Your job is to analyze the invoice line by line and detect overcharges.

## Step 1 — Parse the invoice

For each line item in the CSV, extract:
- Date
- Charge description
- Category (map to one of: Storage / Receiving / Pick & Pack / Special Handling / Parcel / Other)
- Units (quantity billed)
- Unit rate (rate billed)
- Total billed amount

## Step 2 — Validate each line

Compare each line against the rate card from `data/rate_card.md`.

Flag a line item if ANY of the following is true:
1. Unit rate billed does NOT match the rate in the rate card for that category
2. The same charge (same description + same date) appears more than once → duplicate
3. The charge description does not correspond to any service in the rate card → unauthorized charge
4. The variance (billed - expected) exceeds DISPUTE_THRESHOLD

For each flagged line, calculate:
- Expected amount = units × correct rate from rate card
- Variance = billed amount - expected amount
- Flag reason: WRONG_RATE / DUPLICATE / UNAUTHORIZED / THRESHOLD_EXCEEDED

## Step 3 — Assign Status to every line

Every line gets one of three statuses:
- VALID — matches rate card exactly, no issues
- REVIEW — minor discrepancy or unclear mapping, needs manual check
- DISPUTE — clear overcharge, variance > threshold, or duplicate/unauthorized

## Step 4 — Write output files

### File 1: Full audit CSV
Write to `data/audit_full_YYYY-MM.md` (use actual year-month from invoice dates):

Format — comma-separated, include header row:
```
Date,Description,Category,Units,Rate Billed,Rate Expected,Total Billed,Total Expected,Variance,Status,Flag Reason,Notes
```

Include ALL lines from the original invoice. Status column contains: VALID / REVIEW / DISPUTE.

### File 2: Dispute CSV
Write to `data/audit_disputes_YYYY-MM.md`:

Same format, but include ONLY lines where Status = DISPUTE or REVIEW.
Add a summary row at the bottom:
```
TOTAL DISPUTES,,,,,,,,[sum of variances],,,[count] items flagged
```

## Step 5 — Write audit summary

Write to `data/audit_summary_YYYY-MM.md`:

```
# 3PL Audit Summary — [3PL Name] — [YYYY-MM]
Audit date: [today's date]
Invoice file: [filename]
Warehouse: [from rate card]

## Results
Total lines analyzed: [N]
Lines flagged: [N]
Total billed: $[amount]
Total expected: $[amount]
Total variance: $[amount]

## Breakdown by category
| Category | Billed | Expected | Variance | Items flagged |
|---|---|---|---|---|
[one row per category]

## Top disputes
[top 5 flagged items by variance, with description and amount]

## Recommended next step
Send dispute email to [3PL_NAME] referencing [count] items totaling $[variance].
Attach: audit_disputes_YYYY-MM.csv
```

## Step 6 — Send macOS notification and print completion

Use Bash to send a macOS system notification:
```bash
osascript -e 'display notification "[N] items flagged — $[variance] in potential overcharges. Open data/audit_disputes_YYYY-MM.md to review." with title "3PL Audit Complete" sound name "Glass"'
```
Substitute actual values for [N], [variance], and [YYYY-MM].

Then print to console:
```
✅ AUDIT COMPLETE — [YYYY-MM]
   Invoice: [filename]
   Lines analyzed: [N]
   Flagged: [N] items
   Total variance: $[amount]
   
   Files written:
   → data/audit_full_YYYY-MM.md
   → data/audit_disputes_YYYY-MM.md
   → data/audit_summary_YYYY-MM.md
```

---

If no CSV file is found in invoices/ folder, write to `data/audit_latest.md`:
```
# Audit Agent — [YYYY-MM-DD HH:MM]
NO_RESULTS: No invoice file found in invoices/ folder. Please place the 3PL invoice CSV in the invoices/ directory and run again.
```
