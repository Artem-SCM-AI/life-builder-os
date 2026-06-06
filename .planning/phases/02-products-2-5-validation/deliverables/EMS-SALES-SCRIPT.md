# Exception Management System — Discovery→Demo→Offer Call Script

**Product:** Product 2 — Exception Management System (EMS-01)
**Workflow summary:** Client provides inventory + sales data → Claude analyzes → ranked issue list with stockout/overstock/delay severity scores → delivered as Google Sheet or doc

---

## Timing

| Block | Time | Focus |
|-------|------|-------|
| Opening | 1 min | Set agenda; establish peer framing |
| Discovery | 5–7 min | 4 questions to surface inventory monitoring pain |
| Demo | 4–5 min | Live Claude exception ranking from sample inventory data |
| Offer + Close | 3 min | $300 setup + $49/mo; ROI anchor; close question |
| **Total** | **~15 min** | |

---

## Opening (1 minute)

Use the universal opening from INTERVIEW-MASTER-SCRIPT.md Section 2, inserting:

> [product topic] = "exception monitoring — stockouts, overstock, delays"

Full line:

> "Thanks for making time. I'll be direct — I want to spend 5 minutes understanding how you currently handle exception monitoring — stockouts, overstock, delays — then show you a specific tool I've built, and you tell me if it's relevant. Sound good?"

---

## Discovery (5–7 minutes)

Ask these four questions in order. Listen, don't pitch.

**Question 1:**

"How do you currently know when a SKU is heading toward a stockout? Walk me through what you check."

*Listen for:* Seller Central reports, manual spreadsheet reviews, "I check once a week," VA doing it, someone noticing it's already out. Any manual step is your signal.

---

**Question 2:**

"How many times last year did you actually run out of stock on a fast-moving SKU? What did it cost you?"

*Listen for:* Any number above zero. Even one stockout story reveals that the current system fails. Let them calculate the cost — don't do it for them yet.

*If they say zero:* "That's impressive — is that because you have an alert system, or because you got lucky and caught it in time?"

---

**Question 3:**

"Do you have a threshold system right now — like, do you get alerts when inventory drops below X days?"

*Listen for:* No system (most common), Seller Central notifications only (reactive, not predictive), spreadsheet with manual thresholds (works until it doesn't). If they have a system, ask: "When did it last fire and what happened?"

---

**Question 4:**

"If you had a ranked list every Monday morning showing your 3 highest-risk SKUs — what you're about to run out of, what's piling up — what would you do with it?"

*Listen for:* "I'd reorder faster," "I'd stop promoting that SKU," "I'd know what to prioritize." This tells you what outcome to anchor the offer to.

---

## Demo (4–5 minutes)

**Setup:** Before opening screen share, confirm DEMO-PREP-GUIDE.md EMS section is ready — sample data in a text file, prompt ready to paste.

"Okay — let me show you what this looks like. Can you see my screen?"

[Share screen. Open Claude. Paste sample data + EMS analysis prompt from DEMO-PREP-GUIDE.md.]

"I just pasted five SKUs with inventory levels and sales velocity. Watch what Claude does with it."

[Wait for output. Show the ranked exception list.]

**Demo anchor line:**

> "This ranked list — Critical / Warning / OK — took 45 seconds. You were doing this manually in pivot tables, or not doing it at all. TRAMP-12FT is one day from a stockout. TRAMP-14FT has six months of stock sitting in a warehouse costing you fees. Both of those are in the report automatically."

Point out two specific things:
1. The Critical SKU with days_of_stock < 7 — "this is where you'd normally find out at 2am when someone leaves a bad review"
2. The overstock SKU — "this is dead capital earning FBA storage fees instead of being liquidated or repriced"

---

## Offer (3 minutes)

Use the universal close from INTERVIEW-MASTER-SCRIPT.md Section 3, then add the EMS ROI anchor:

> "Here's how it works: $300 setup — that's where I map your data sources and configure everything for your specific SKUs, suppliers, and 3PLs. Then $49/month for weekly delivery. If I save you 2 hours per week, you've paid for the month in day one. Want to move forward?"

**EMS ROI anchor** (use before or after the close question if needed):

> "One stockout on a $30 product selling 50/day is $1,500 in lost revenue per day. Catching it 5 days earlier pays for this service for 2+ years."

**For objections:** Use the universal objection responses from INTERVIEW-MASTER-SCRIPT.md Section 4.

---

## Call Log

Use the template from INTERVIEW-MASTER-SCRIPT.md Section 5.

For this product, note in "Pain confirmed" field whether they described a real stockout or overstock event — that's the strongest validation signal for EMS.
