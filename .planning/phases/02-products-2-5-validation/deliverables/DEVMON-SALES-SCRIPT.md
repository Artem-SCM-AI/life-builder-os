# Demand vs Plan Deviation Monitor — Discovery→Demo→Offer Call Script

**Product:** Product 3 — Demand vs Plan Deviation Monitor (DEVMON-01)
**Workflow summary:** Client provides forecast vs actual sales data by SKU and period → Claude compares and surfaces deviations → report shows variance %, direction (over/under), and root-cause signals

---

## Timing

| Block | Time | Focus |
|-------|------|-------|
| Opening | 1 min | Set agenda; establish peer framing |
| Discovery | 5–7 min | 4 questions to surface forecast accuracy pain |
| Demo | 4–5 min | Live Claude deviation report from sample forecast vs actual data |
| Offer + Close | 3 min | $300 setup + $49/mo; ROI anchor; close question |
| **Total** | **~15 min** | |

---

## Opening (1 minute)

Use the universal opening from INTERVIEW-MASTER-SCRIPT.md Section 2, inserting:

> [product topic] = "demand forecast accuracy"

Full line:

> "Thanks for making time. I'll be direct — I want to spend 5 minutes understanding how you currently handle demand forecast accuracy, then show you a specific tool I've built, and you tell me if it's relevant. Sound good?"

---

## Discovery (5–7 minutes)

Ask these four questions in order. Listen, don't pitch.

**Question 1:**

"Do you track demand forecasts for your SKUs? How are they set — gut feel, historical data, or something else?"

*Listen for:* No formal forecast (most small brands), Excel-based gut feel, Jungle Scout estimates, "we just reorder when it feels low." Any answer reveals how structured or unstructured their planning is.

*If they say they have a solid system:* "When it's off by 20% or more — how do you find out?"

---

**Question 2:**

"When actual sales are way off forecast, how do you find out — and how long does it take?"

*Listen for:* They notice it at reorder time (weeks late), a VA tells them, they check weekly (but still reactive), month-end reporting. The longer the lag, the bigger the opportunity.

---

**Question 3:**

"What decisions go wrong when your forecast is off? Think about inventory orders, promotions, production runs."

*Listen for:* Overordering before a slow period, running out during a promo, factory producing the wrong mix, 3PL space booked but not needed. Each of these is a real cost — let them name it.

---

**Question 4:**

"If you got a weekly report showing which SKUs deviated more than 10% from forecast and why, what would change?"

*Listen for:* "I'd catch reorder mistakes earlier," "I'd adjust my promotions," "I'd stop blaming the algorithm." This tells you what outcome to anchor the offer to.

---

## Demo (4–5 minutes)

**Setup:** Before opening screen share, confirm DEMO-PREP-GUIDE.md DEVMON section is ready — sample data in a text file, prompt ready to paste.

"Okay — let me show you what this looks like. Can you see my screen?"

[Share screen. Open Claude. Paste sample forecast vs actual data + DEVMON prompt from DEMO-PREP-GUIDE.md.]

"I just pasted four SKUs with their week 18 forecast and actual sales. Watch what Claude does with it."

[Wait for output. Show the deviation report with flagged SKUs and root-cause signals.]

**Demo anchor line:**

> "Two SKUs flagged: one sold 40% below forecast — that's overstock building. One sold 30% above — you're heading into a stockout. Both spotted in 30 seconds. It doesn't just show the gap — it surfaces the likely reason: was it a listing issue, a promo, a stockout? That's the part that takes you hours to diagnose manually."

Point out two specific things:
1. The over-forecast SKU — "you ordered for demand that didn't show up; capital is stuck"
2. The under-forecast SKU — "you're selling faster than expected; if you don't catch this in week 18, you're reordering emergency air freight in week 20"

---

## Offer (3 minutes)

Use the universal close from INTERVIEW-MASTER-SCRIPT.md Section 3, then add the DEVMON ROI anchor:

> "Here's how it works: $300 setup — that's where I map your data sources and configure everything for your specific SKUs, suppliers, and 3PLs. Then $49/month for weekly delivery. If I save you 2 hours per week, you've paid for the month in day one. Want to move forward?"

**DEVMON ROI anchor** (use before or after the close question if needed):

> "Most brands catch demand deviations at month-end, after the inventory decision is already wrong. This gives you a 2–3 week head start to adjust — before you're paying for emergency air freight or sitting on 6 months of dead stock."

**For objections:** Use the universal objection responses from INTERVIEW-MASTER-SCRIPT.md Section 4.

---

## Call Log

Use the template from INTERVIEW-MASTER-SCRIPT.md Section 5.

For this product, note in "Pain confirmed" field whether they described a specific instance of a forecast miss causing a downstream cost (overstock, stockout, wrong order quantity). That's the strongest validation signal for DEVMON.
