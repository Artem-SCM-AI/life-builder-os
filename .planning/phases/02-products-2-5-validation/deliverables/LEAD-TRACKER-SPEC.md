# Lead Tracker — Google Sheets Specification

**Purpose:** Single source of truth for all outreach, interview, and deal tracking across SCAIT Products 2–5 validation.

**Build time:** Under 30 minutes.

**Share with:** eco.stepanenko@gmail.com — bookmark the sheet once created.

---

## Tab 1: "Lead Pipeline"

**Description:** One row per lead. All outreach status and deal stage tracked here.

**Columns A through L:**

| Column | Header | Type | Notes |
|--------|--------|------|-------|
| A | Lead ID | Text (auto) | Format: LEAD-001, LEAD-002, LEAD-003... Increment manually |
| B | Full Name | Text | First and last name |
| C | LinkedIn URL | URL | Full profile URL (e.g., linkedin.com/in/username) |
| D | Company | Text | Company name as shown on LinkedIn |
| E | Title | Text | Job title as shown on LinkedIn |
| F | ICP Signal | Text | Brief note on why they qualify (e.g., "posts about 3PL issues", "FBA brand, ~12 SKUs") |
| G | Lead Source | Dropdown | Values: Warm-Colleague / Warm-Connection / Warm-SCAI / Cold-LinkedIn / Cold-Email |
| H | Product Interest | Dropdown | Which product to pitch first: DS / EMS / DEVMON / SINV / 3PLV |
| I | Status | Dropdown | See Status Values table below |
| J | Date Contacted | Date | Date of first outreach message sent (DD/MM/YYYY) |
| K | Date of Last Activity | Date | Date of most recent action on this lead (DD/MM/YYYY) |
| L | Notes | Text | Free text — call notes, objections, follow-up actions |

### Product Interest Codes (Column H)

| Code | Product |
|------|---------|
| DS | Data Structuring (Product 0 / Foundation) |
| EMS | Exception Management System (Product 2) |
| DEVMON | Demand vs Plan Deviation Monitor (Product 3) |
| SINV | Supplier Invoice Validation (Product 4) |
| 3PLV | 3PL Invoice & Cost Validation (Product 5) |

### Status Values (Column I — Dropdown)

Set up as a data validation dropdown in Google Sheets. Values in order:

1. **New** — Lead added, not yet contacted
2. **Contacted** — Message sent, no reply yet
3. **Replied** — They responded (any response)
4. **Call Booked** — Meeting confirmed in calendar
5. **Demo Done** — Call/demo completed
6. **Offer Made** — Pricing/proposal shared
7. **Closed Won** — Paid customer or signed LOI
8. **Closed Lost** — Passed or no fit
9. **Follow Up Later** — Not ready now, check back in 30–60 days

### Google Sheets Setup Instructions for Tab 1

1. Create a new Google Sheet named "SCAIT Lead Tracker"
2. Rename Sheet1 to "Lead Pipeline"
3. Row 1: Bold headers as defined in the table above (A1 = "Lead ID", B1 = "Full Name", etc.)
4. Freeze Row 1 (View → Freeze → 1 row)
5. Set Column G data validation: List from items → Warm-Colleague, Warm-Connection, Warm-SCAI, Cold-LinkedIn, Cold-Email
6. Set Column H data validation: List from items → DS, EMS, DEVMON, SINV, 3PLV
7. Set Column I data validation: List from items → New, Contacted, Replied, Call Booked, Demo Done, Offer Made, Closed Won, Closed Lost, Follow Up Later
8. Set Columns J and K as Date format
9. Apply alternating row colors (Format → Alternating colors) for readability

---

## Tab 2: "Interview Log"

**Description:** One row per completed call/interview. Linked to Tab 1 via Lead ID.

**Columns A through G:**

| Column | Header | Type | Notes |
|--------|--------|------|-------|
| A | Lead ID | Text | Must match Lead ID from Tab 1 (e.g., LEAD-007) |
| B | Call Date | Date | Date interview was completed (DD/MM/YYYY) |
| C | Product Demoed | Text | Which product was shown/discussed (use codes: EMS, DEVMON, SINV, 3PLV) |
| D | Key Pain Discovered | Text | The most important problem they described in their own words |
| E | Offer Made | Dropdown | Y / N |
| F | Outcome | Dropdown | Paid / LOI / Not Now / No Fit |
| G | Follow-up Action | Text | Next step and deadline (e.g., "Send proposal by May 10") |

### Outcome Values (Column F)

| Value | Meaning |
|-------|---------|
| Paid | Customer paid setup fee + first month |
| LOI | Letter of Intent / verbal commitment to purchase |
| Not Now | Interested but not ready (add to Follow Up Later in Tab 1) |
| No Fit | Not a match — wrong ICP, no budget, wrong product stage |

### Google Sheets Setup Instructions for Tab 2

1. Add a new sheet tab, rename to "Interview Log"
2. Row 1: Bold headers as defined above
3. Freeze Row 1
4. Set Column E data validation: Y / N
5. Set Column F data validation: Paid, LOI, Not Now, No Fit
6. Set Column B as Date format

---

## Tab 3: "MRR Dashboard"

**Description:** Summary view for tracking business metrics. Update manually or via formulas.

**Cell layout:**

| Cell | Label | Formula / Value |
|------|-------|----------------|
| A1 | Total leads in pipeline | `=COUNTA('Lead Pipeline'!B:B)-1` |
| A2 | Leads contacted (this week) | Manual count or filter |
| A3 | Calls booked (this week) | `=COUNTIF('Lead Pipeline'!I:I,"Call Booked")` |
| A4 | Calls completed (this month) | `=COUNTA('Interview Log'!B:B)-1` |
| A5 | Total paying customers | `=COUNTIF('Lead Pipeline'!I:I,"Closed Won")` |
| A6 | MRR ($) | `=COUNTIF('Lead Pipeline'!I:I,"Closed Won")*49` |
| A7 | Setup revenue ($) | `=COUNTIF('Lead Pipeline'!I:I,"Closed Won")*300` |
| A8 | Total revenue to date ($) | `=A6+A7` |

**MRR formula note:** Formula assumes $49/month per customer. Update the constant (49) if pricing changes. Setup revenue formula assumes $300 per customer.

### Google Sheets Setup Instructions for Tab 3

1. Add a new sheet tab, rename to "MRR Dashboard"
2. Column A: Labels (bold)
3. Column B: Values/Formulas as specified above
4. Format B6, B7, B8 as Currency ($)
5. Add a green highlight to B6 (MRR) for visibility

---

## Final Setup Checklist

- [ ] Google Sheet created and named "SCAIT Lead Tracker"
- [ ] Three tabs created: "Lead Pipeline", "Interview Log", "MRR Dashboard"
- [ ] Tab 1 has 12 columns (A–L) with correct headers
- [ ] Tab 1 data validation dropdowns set for columns G, H, and I
- [ ] Tab 2 has 7 columns (A–G) with correct headers
- [ ] Tab 3 formulas reference Tab 1 and Tab 2 correctly
- [ ] Row 1 frozen in all tabs
- [ ] Sheet shared with eco.stepanenko@gmail.com
- [ ] Sheet bookmarked in browser

**Cross-reference:** The daily workflow in LEAD-GEN-SYSTEM.md references the following columns from this tracker:
- Step 3 (add leads): Columns A–F of Tab 1
- Step 5 (log outreach): Column G (Lead Source), Column I (Status), Column J (Date Contacted) of Tab 1
- Step 6 (log replies): Column I (Status), Column K (Date of Last Activity), Column L (Notes) of Tab 1
- After each call: All columns of Tab 2 (Interview Log)
