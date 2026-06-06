# 3PL Invoice & Cost Validation — Discovery→Demo→Offer Call Script

**Product:** Product 5 — 3PL Invoice & Cost Validation (3PLV-01)
**Workflow summary:** Client provides 3PL invoice + signed contract rate card → Claude compares line by line → variance report shows overcharges, unauthorized fees, and dollar impact per line

---

## Timing

| Block | Time | Focus |
|-------|------|-------|
| Opening | 1 min | Set agenda; establish peer framing |
| Discovery | 5–7 min | 4 questions to surface 3PL billing reconciliation pain |
| Demo | 4–5 min | Live Claude variance report from sample 3PL invoice + rate card |
| Offer + Close | 3 min | $300 setup + $49/mo; ROI anchor; close question |
| **Total** | **~15 min** | |

---

## Opening (1 minute)

Use the universal opening from INTERVIEW-MASTER-SCRIPT.md Section 2, inserting:

> [product topic] = "3PL invoice reconciliation"

Full line:

> "Thanks for making time. I'll be direct — I want to spend 5 minutes understanding how you currently handle 3PL invoice reconciliation, then show you a specific tool I've built, and you tell me if it's relevant. Sound good?"

---

## Discovery (5–7 minutes)

Ask these four questions in order. Listen, don't pitch.

**Question 1:**

"Do you manually check your 3PL invoices against your contract rates? How long does that take?"

*Listen for:* "Honestly, not every time," "my bookkeeper looks at it," "I spot-check occasionally," "it takes 30–45 minutes to go line by line." Any gap between invoice receipt and systematic verification is your opening.

---

**Question 2:**

"Has your 3PL ever charged you for something that wasn't in the contract — extra handling fees, rounding up pallets, mystery line items?"

*Listen for:* A specific story — a "handling fee" that appeared without notice, pallet counts that don't match receiving records, rate increases that weren't communicated. This is the most emotionally resonant question; give them space to tell the story.

*If they say no:* "How confident are you in that? Have you ever done a line-by-line audit against your signed rate card?"

---

**Question 3:**

"How many 3PL invoices do you process per month, and what's the average dollar value?"

*Listen for:* Dollar volume. Even $3,000/month with a 3% overcharge rate = $90/month in recoverable charges. The math sells itself. Let them tell you the number, then do the math together.

---

**Question 4:**

"If you knew exactly which line items were overbilled before you paid, what's the first thing you'd do?"

*Listen for:* "I'd dispute it immediately," "I'd deduct it from the next payment," "I'd renegotiate the contract." This tells you what outcome to anchor the offer to.

---

## Demo (4–5 minutes)

**Setup:** Before opening screen share, confirm DEMO-PREP-GUIDE.md 3PLV section is ready — sample 3PL invoice + rate card in a text file, prompt ready to paste.

"Okay — let me show you what this looks like. Can you see my screen?"

[Share screen. Open Claude. Paste sample 3PL invoice + contract rate card + receiving record + 3PLV prompt from DEMO-PREP-GUIDE.md.]

"I've pasted a 3PL invoice, the signed contract rate card, and the receiving record for the same period. Watch what Claude finds."

[Wait for output. Show the variance report with line-by-line dollar impact.]

**Demo anchor line:**

> "Two discrepancies: $1.00/pallet overcharge on storage — that's $50 on the rate alone. And 8 extra pallets billed that don't appear on your receiving record — another $108. Total overcharge on one invoice: $158. Across a year that's nearly $2,000. Claude catches it in 60 seconds."

Point out two specific things:
1. The rate variance — "your contract says $13.50/pallet; they charged $14.50; that's a rate increase they invoiced but never negotiated"
2. The phantom pallets — "50 pallets billed, 42 received; those 8 pallets don't exist on your receiving record; you'd be paying for storage that never happened"

---

## Offer (3 minutes)

Use the universal close from INTERVIEW-MASTER-SCRIPT.md Section 3, then add the 3PLV ROI anchor:

> "Here's how it works: $300 setup — that's where I map your data sources and configure everything for your specific SKUs, suppliers, and 3PLs. Then $49/month for weekly delivery. If I save you 2 hours per week, you've paid for the month in day one. Want to move forward?"

**3PLV ROI anchor** (use before or after the close question if needed):

> "I've seen 3PL overbilling rates of 3–8% on mid-sized brands. On a $5,000/month 3PL bill, that's $150–$400 per month in recoverable charges. This service pays for itself in the first invoice it audits."

**For objections:** Use the universal objection responses from INTERVIEW-MASTER-SCRIPT.md Section 4.

**3PLV-specific objection** — "My 3PL is trustworthy":

> "I'm not saying they're dishonest — most overbilling is billing system errors, not fraud. Pallet counts rounded up, rate tables not updated after a contract renewal. A monthly audit keeps the relationship clean and gives you data to negotiate with at renewal time."

---

## Call Log

Use the template from INTERVIEW-MASTER-SCRIPT.md Section 5.

For this product, note in "Pain confirmed" field whether they described a specific 3PL billing dispute or confirmed they don't systematically audit invoices. Either is strong validation for 3PLV.
