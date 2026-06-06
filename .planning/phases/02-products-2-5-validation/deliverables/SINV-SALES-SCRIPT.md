# Supplier Invoice Validation — Discovery→Demo→Offer Call Script

**Product:** Product 4 — Supplier Invoice Validation (SINV-01)
**Workflow summary:** Client provides PO + supplier invoice + receiving record → Claude runs 3-way match → discrepancy report shows price variances, quantity mismatches, and unauthorized charges

---

## Timing

| Block | Time | Focus |
|-------|------|-------|
| Opening | 1 min | Set agenda; establish peer framing |
| Discovery | 5–7 min | 4 questions to surface supplier AP reconciliation pain |
| Demo | 4–5 min | Live Claude 3-way match from sample PO + invoice + receiving record |
| Offer + Close | 3 min | $300 setup + $49/mo; ROI anchor; close question |
| **Total** | **~15 min** | |

---

## Opening (1 minute)

Use the universal opening from INTERVIEW-MASTER-SCRIPT.md Section 2, inserting:

> [product topic] = "supplier invoice validation"

Full line:

> "Thanks for making time. I'll be direct — I want to spend 5 minutes understanding how you currently handle supplier invoice validation, then show you a specific tool I've built, and you tell me if it's relevant. Sound good?"

---

## Discovery (5–7 minutes)

Ask these four questions in order. Listen, don't pitch.

**Question 1:**

"How do you verify that what your supplier charged you matches what you ordered and received?"

*Listen for:* "I check the invoice against the PO manually," "my bookkeeper does it," "honestly we just pay it if it looks right," "we compare line by line in Excel." Any manual step or admitted gap is your signal.

---

**Question 2:**

"Have you ever discovered a supplier invoice error after already paying? How did you handle it?"

*Listen for:* A specific story — overcharge discovered months later, dispute that took weeks, supplier credit that got ignored. The more specific the story, the stronger the validation.

*If they say never:* "Do you think that's because there have never been errors, or because there's no systematic check catching them?"

---

**Question 3:**

"How much time does your team spend on AP reconciliation each month — matching invoices to POs, checking quantities, verifying prices?"

*Listen for:* Any number above 30 minutes per invoice cycle. Even "an hour a month" is meaningful at $49/month pricing.

---

**Question 4:**

"If you could automatically flag any invoice that doesn't match the PO before payment — what's the first thing you'd do with that information?"

*Listen for:* "I'd dispute it immediately," "I'd stop paying until it's resolved," "I'd renegotiate with my supplier." This tells you what outcome to anchor the offer to.

---

## Demo (4–5 minutes)

**Setup:** Before opening screen share, confirm DEMO-PREP-GUIDE.md SINV section is ready — sample 3-way match data in a text file, prompt ready to paste.

"Okay — let me show you what this looks like. Can you see my screen?"

[Share screen. Open Claude. Paste sample PO + invoice + receiving record + SINV prompt from DEMO-PREP-GUIDE.md.]

"I've pasted a purchase order, the supplier invoice for that order, and the warehouse receiving record. Watch what Claude finds."

[Wait for output. Show the discrepancy report with dollar impact.]

**Demo anchor line:**

> "Found two issues in 20 seconds: a $0.40/unit price variance — that's $200 on this PO. And 12 units short on receipt — $144 worth of product you paid for but didn't receive. If you pay this invoice as-is, you're out $344 you shouldn't be. Most brands don't catch these until month-end, if at all."

Point out two specific things:
1. The price variance — "your supplier quoted $12.00 and invoiced $12.40; that's not a rounding error, that's a change they hoped you wouldn't notice"
2. The quantity shortfall — "you received 488 units, not 500; either they're going to ship the 12 or you're going to dispute it, but you can't do either if you don't know about it"

---

## Offer (3 minutes)

Use the universal close from INTERVIEW-MASTER-SCRIPT.md Section 3, then add the SINV ROI anchor:

> "Here's how it works: $300 setup — that's where I map your data sources and configure everything for your specific SKUs, suppliers, and 3PLs. Then $49/month for weekly delivery. If I save you 2 hours per week, you've paid for the month in day one. Want to move forward?"

**SINV ROI anchor** (use before or after the close question if needed):

> "Suppliers overbill by 2–5% on average when there's no systematic check. On $500K in annual supplier spend, that's $10,000–$25,000 in recoverable overcharges. This service pays for itself the first time it catches an invoice error."

**For objections:** Use the universal objection responses from INTERVIEW-MASTER-SCRIPT.md Section 4.

---

## Call Log

Use the template from INTERVIEW-MASTER-SCRIPT.md Section 5.

For this product, note in "Pain confirmed" field whether they described a specific supplier overbilling event or confirmed they have no systematic check. Either is strong validation for SINV.
