# SCAIT — Products Offering

> Complete product portfolio with positioning, ROI, pricing, and sales motion.  
> Last updated: May 2026 | Source of truth for all client-facing product communication.

---

## Portfolio Overview

SCAIT is a portfolio of 10 AI-powered supply chain agents organized across 5 operational layers. Each agent solves a specific problem that e-commerce SC teams currently solve manually — or don't solve at all.

**Unifying insight:** The most expensive supply chain mistakes don't happen because of bad decisions. They happen because critical information was buried in an email, a spreadsheet, a PDF, or a forwarder update — and nobody connected the dots in time.

**The SCAIT promise:** Catch what manual review misses, before it becomes a cost.

---

## The 5-Layer Architecture

```
Layer 0 — FOUNDATION
  └── SC Data Map   — SC data structuring & live database

Layer 1 — ENGINE (Stock Control)
  ├── SC Stock Radar — Daily inventory monitoring & stockout prediction
  └── SC Delta       — Plan vs. actual sales deviation monitor

Layer 2 — SAVINGS (Invoice Validation)
  ├── SC Supplier Guard — Supplier invoice & contract validation
  └── SC 3PL Guard      — 3PL invoice & cost validation

Layer 3 — COMMUNICATION
  ├── SC Supplier Desk  — AI supplier communication management
  └── SC Forwarder Desk — AI forwarder communication & shipment tracking

Layer 4 — QUALITY & STRUCTURING
  ├── VERIX   — Inspection report processor
  ├── SPECTRA — Product tech spec agent
  └── INSPEX  — Inspection brief generator
```

---

## Product 0: SC Data Map

**Layer:** 0 — Foundation | **Status:** Foundation layer for entire ecosystem

### The Problem

Most e-commerce brands run their supply chain across scattered spreadsheets, emails, and shared drives. No one knows where the real data is. Every report takes hours to assemble. Every decision is made on incomplete information.

### What It Does

Within 48 hours the client gets:
- A custom SC dashboard built for their product catalog and operations
- Every data point auto-filled from existing files
- A **Confidence Score** on each cell — so they know exactly what to trust
- A **SC Health Score** — one number showing how complete the data foundation is
- A **live sync agent** that keeps the dashboard updated as the business evolves

No manual data entry. No consultants. No starting from scratch.

SC Data Map is the foundation of the SCAIT ecosystem. Every product added on top works better because of it.

### Pricing

| | Starter | Growth | Scale | Enterprise |
|--|---------|--------|-------|------------|
| SKUs | 1–50 | 51–200 | 201–2,000 | 2,000+ |
| Units/month | Up to 2,000 | 2,000–10,000 | 10,000–50,000 | 50,000+ |
| Setup | $200 | $400 | $700 | Custom |
| Monthly | $99 | $200 | $350 | Custom |

> Tier is determined by whichever parameter — SKUs or monthly units — places the client higher.

### Ideal Buyer

Any Amazon brand scaling beyond spreadsheets. Required foundation for SC Stock Radar and the full SCAIT ecosystem.

### First CTA

> "Share your current inventory setup. I'll show you what a structured SC foundation looks like on your data."

---

## Product 1: SC Stock Radar

**Layer:** 1 — Engine (Stock Control) | **Phase:** Active

### The Problem

Most Amazon brands find out about a stockout after it happens. By then, BSR is dropping, PPC is wasted, and you're scrambling to expedite at 3x the cost. The data was always there — scattered across FBA reports, 3PL emails, and supplier updates. Nobody connected the dots.

### What It Delivers

A daily AI monitoring agent that pulls inventory data from every stock location, calculates risk per SKU, and delivers one structured report every morning — before problems become crises.

**Every day the client sees:**
- Total stock by SKU across every location with Days of Stock score
- Traffic light status: 🔴 Under 30 days (critical) | 🟡 30–60 days (warning) | 🟢 60–90 days (healthy) | 🔵 90+ (overstock)
- Predicted stockout date per SKU: "SKU X will stock out on June 18"
- SKU performance category (Bestseller / Mid-performer / Assortment keeper / Clearance)
- ETD for incoming shipments with supplier reliability score
- Overstock flags with FBA IPI impact warnings

**ETD Reliability Engine:** Tracks promised ETD vs. actual delivery history per supplier and forwarder. When planning the next order, the client sees two numbers: what the supplier promises and what history says to actually expect.

**Multi-Location Analysis:** For clients with 2+ warehouses — analyzes historical order geography, determines natural service zones, flags regional stockouts even when total stock appears sufficient, recommends inter-warehouse transfers before triggering new orders.

### Key Numbers

| Metric | Value |
|--------|-------|
| Stockout signal visibility | 30+ days before the event |
| SKU categories tracked | 4 (Bestseller, Mid, Assortment, Clearance) |
| ETD reliability | Historical promise vs. actual per supplier |

### Pricing

| | Starter | Growth | Scale | Enterprise |
|--|---------|--------|-------|------------|
| SKUs | 1–50 | 51–200 | 201–2,000 | 2,000+ |
| Units/month | Up to 2,000 | 2,000–10,000 | 10,000–50,000 | 50,000+ |
| Setup | $700 | $1,500 | $2,500 | Custom |
| Monthly (1 location) | $444 | $777 | $999 | Custom |

**Multi-Location Multiplier** (compound, applied from 2nd location):

| Locations | Multiplier | Starter | Growth | Scale |
|-----------|-----------|---------|--------|-------|
| 1 | 1.0× | $444 | $777 | $999 |
| 2 | 1.2× | $533 | $932 | $1,199 |
| 3 | 1.44× | $639 | $1,119 | $1,439 |

### Ideal Buyer

Head of SC or COO at an Amazon brand with 20+ active SKUs. Any brand where a stockout on a bestseller has a measurable revenue cost.

### First CTA

> "Share 2 weeks of inventory and velocity data. I'll show you which SKUs are at risk right now."

---

## Product 2: SC Delta

**Layer:** 1 — Engine (Stock Control) | **Phase:** Active

### The Problem

Forecasts are built monthly or quarterly and then left alone. Actual sales drift. Nobody catches a 5–10% deviation until end of month — when it's already too late to adjust replenishment without paying a premium.

A product flying above plan means heading for a stockout. A product falling below plan means capital is sitting in overstock.

### What It Delivers

A daily AI monitoring agent that tracks the gap between planned and actual sales — per SKU, every 24 hours.

**Every day the client sees:**
- Actual vs. planned sales by SKU — in units and in $
- Deviation % with client-defined alert thresholds (e.g., ±10% = warning, ±25% = critical)
- Cumulative deviation for the week and month
- Positive deviation alerts — the most important reorder signal
- Negative deviation alerts — overstock and cash flow risk

**Auto Baseline:** No sales plan? SC Delta takes the last 12 months of sales data and builds a baseline forecast automatically.

**SC Stock Radar Integration:** When sales exceed plan, Days of Stock recalculates automatically — reorder alert fires earlier.

### Key Numbers

| Metric | Value |
|--------|-------|
| 5% deviation on $500K order | $25,000 in excess or missing inventory |
| Detection lag (without SC Delta) | End of month |
| Detection lag (with SC Delta) | Same day |

### Pricing

| | Starter | Growth | Scale | Enterprise |
|--|---------|--------|-------|------------|
| SKUs | 1–50 | 51–200 | 201–2,000 | 2,000+ |
| Units/month | Up to 2,000 | 2,000–10,000 | 10,000–50,000 | 50,000+ |
| Setup | $300 | $600 | $1,000 | Custom |
| Monthly | $149 | $299 | $449 | Custom |

### Ideal Buyer

Brand with a defined forecasting process, $2M+ revenue, looking to automate deviation monitoring.

### First CTA

> "Give me your sales plan and last 30 days of actuals. I'll show you where the gaps already are."

---

## Product 3: SC Supplier Guard

**Layer:** 2 — Savings (Invoice Validation) | **Phase:** Active

### The Problem

Invoice errors are more common than most brands realize — wrong unit prices, incorrect quantities, missing discounts, unauthorized fees. Most go unnoticed because checking manually takes hours and happens after payment is already approved.

Manual review catches approximately 50% of discrepancies on 40-line documents.

**Real case:** $47,000 order. Supplier raised unit price from $89.00 to $94.50 (+$5.50/unit × 500 units = +$2,750 COGS). Client placed next order without catching it.

### What It Delivers

An AI agent that reads every supplier invoice, compares it against contract terms and purchase orders, and flags every discrepancy — before payment.

- **Multi-format recognition:** Reads invoices in any format — PDF, Excel, email, image. Supports English and Chinese.
- **3-way match:** Invoice vs. contract price vs. PO quantity. Catches errors at every level.
- **Severity rating:** 🔴 Critical (significant overcharge) | 🟡 Warning (price or quantity mismatch) | ℹ Info (minor rounding)
- **Running savings tracker:** Total amount caught and saved since day one.
- **Auto-draft dispute:** Ready-to-send supplier response on every discrepancy found.

### Key Numbers

| Metric | Value |
|--------|-------|
| Real case caught | $2,914 overcharge on $47K order |
| Break-even | <2% price change on one order |
| ROI | One catch = 3.3× annual service cost |
| Manual catch rate | ~50% of errors in 40-line documents |

### Pricing

| | Starter | Growth | Scale | Enterprise |
|--|---------|--------|-------|------------|
| Invoices/month | 1–10 | 11–30 | 31–100 | 100+ |
| SKUs per invoice | Up to 20 | Up to 50 | Up to 150 | Unlimited |
| Setup | $400 | $800 | $1,500 | Custom |
| Monthly | $199 | $299 | $449 | Custom |

### Ideal Buyer

Founder / Head of SC / Finance at a brand with $500K+ in annual supplier orders. Any business that receives 10+ supplier invoices per month.

### First CTA

> "Send me a recent supplier invoice and the matching PO. I'll run the 3-way match and show you what it finds."

---

## Product 4: SC 3PL Guard

**Layer:** 2 — Savings (Invoice Validation) | **Phase:** Active

### The Problem

Zone errors, weight overbilling, incorrect surcharges, wrong warehouse routing — these mistakes happen on almost every invoice. They're small enough to go unnoticed individually. They add up to thousands of dollars a year.

**Real case:** Zone 6 being billed under a Zone 4 contract. Same SKU. Every shipment, for 8 months. Total: **$91,800 in overcharges.** Never detected because no one compared the rate card line by line.

### What It Delivers

An AI agent that audits every 3PL invoice against contracted rates, catches overbilling on zones, weight, surcharges, and storage — and delivers a ready-to-send dispute report before payment is approved.

**Zone Validation — Core Feature:**  
Origin ZIP (warehouse) + Destination ZIP (customer) = correct shipping zone. Calculates the zone that should have been applied and compares against what was billed.

**Weight & DIM Validation:** Billed weight vs. actual and dimensional weight — catches wrong DIM factor on every shipment.

**Wrong Warehouse Flag:** Order should have shipped from Dallas (Zone 3), shipped from New York (Zone 6) — not just an error, a direct financial loss.

**Surcharge Validation:** AHS, Residential, DAS, Fuel — every surcharge cross-referenced against contract and eligibility criteria.

**Two outputs delivered:**
1. **Savings Report** — every discrepancy found, broken down by category, total amount overbilled
2. **Dispute Draft** — a ready-to-send letter with every item itemized and ready to dispute

### Key Numbers

| Metric | Value |
|--------|-------|
| Real case | $91,800 in overcharges over 8 months |
| Manual catch rate | ~50% of errors in 40-line invoices |
| Annual recovery ($5M brand) | $270K–$370K/year |
| Year 1 net recovery example | $91,650 |

### Pricing

| | Starter | Growth | Scale | Enterprise |
|--|---------|--------|-------|------------|
| Shipments/month | 1–200 | 201–1,000 | 1,001–5,000 | 5,000+ |
| Setup | $500 | $1,000 | $2,000 | Custom |
| Monthly | $249 | $449 | $749 | Custom |

### Ideal Buyer

COO, Finance Director, or Head of Operations at a $3M+ brand using 1–3 3PL partners.

### First CTA

> "Send me your last 3PL invoice and your rate card. I'll find the discrepancies."

---

## Product 5: SC Supplier Desk

**Layer:** 3 — Communication | **Phase:** Active

### The Problem

Every week, hours are lost chasing suppliers. Most of those hours produce the same three outcomes — no reply, a vague answer, or a promise that gets forgotten. At 5+ suppliers and 10–15 emails/week, that's 2–3 hours of manual processing weekly — done diagonally.

Specific failures: price changes buried in paragraph 3, lead time extensions described as "slight delay," payment windows mentioned once and never followed up.

### What It Delivers

An AI agent that manages all supplier communication through Gmail — with full supplier context, automated production checks, bilingual outreach, and a complete backlog of every conversation. Starts in draft mode, scales to full autonomy.

**Every week it runs automatically:**
- Monday 8:00 AM China time — production status check sent to every factory with an active order, per PO, per SKU
- Supplier responds — structured report prepared for the team within the hour
- Supplier promises a document tomorrow — follow-up sent automatically the next afternoon
- Invoice arrives — forwarded directly to SC Supplier Guard for validation
- Inspection needed — factory contacted, logistics confirmed, confirmation tracked

**Key features:**
- Supplier knowledge base per partner (terms, pricing, lead times, history)
- Holiday calendar for China and other key markets
- Sentiment detection — evasive answers and vague timelines flagged before they become crises
- Escalation rules — client defines triggers (price change, delay >X days, quality flag, force majeure)
- Bilingual outreach — every email in English and Chinese simultaneously
- Draft approval workflow — one-click Approve / Edit / Reject; full control before autonomous mode
- Full communication backlog — searchable by supplier, PO, and topic

**Supplier Performance Tracking:** Average response time, on-time communication rate, promise fulfillment rate — tracked per supplier over time.

Starts in draft mode. When ready, runs fully autonomously.

### Pricing

| | Starter | Growth | Scale | Enterprise |
|--|---------|--------|-------|------------|
| Suppliers | 1–3 | 3–10 | 10–25 | 25+ |
| Setup | $500 | $1,000 | $2,000 | Custom |
| Monthly | $299 | $499 | $899 | Custom |

### Ideal Buyer

Founder / CEO who reads supplier emails personally. Head of SC managing 5+ suppliers. Any brand processing $500K+ in supplier orders per year.

### First CTA

> "Forward me one supplier email. I'll show you what SC Supplier Desk would have caught — and the reply it would have drafted."

---

## Product 6: SC Forwarder Desk

**Layer:** 3 — Communication | **Phase:** Active

### The Problem

ETDs change without warning. Documents arrive late. Free time runs out while the team is chasing other fires. By the time demurrage shows up on an invoice, it's already too late.

**Real case:** 8-day detection delay = $1,400 in demurrage. Forwarder notified. No action taken until invoice arrived.

### What It Delivers

An AI agent that manages all freight forwarder communication through Gmail — tracking every shipment from booking to delivery, preventing demurrage, automating document follow-ups, and feeding ETD updates directly into SC Stock Radar.

**Every week it runs automatically:**
- Status check sent to every forwarder with an active shipment
- ETD updates received — Days of Stock recalculated in SC Stock Radar instantly
- Missing document detected — forwarder followed up automatically
- Free time running low — demurrage alert sent to team and forwarder before it costs money
- Production confirmed — booking request prepared and sent without manual input

**Key features:**
- Document tracker per shipment (Bill of Lading, Commercial Invoice, Packing List, Certificate of Origin, customs docs)
- Demurrage prevention — alerts X days before free time expires at destination port
- Booking request automation — triggered when production confirmed via SC Supplier Desk
- Exception handling — customs delay, port congestion, vessel change flagged immediately
- Bilingual outreach — English and Chinese simultaneously
- Forwarder performance tracking — on-time rate, ETD variance, response time
- Complete communication backlog — searchable by forwarder, shipment, and document type

**ETD Feed to SC Stock Radar:** When a forwarder updates an ETD, SC Stock Radar automatically recalculates Days of Stock per affected SKU. No manual entry. No lag.

Starts in draft mode. When ready, runs fully autonomously.

### Key Numbers

| Metric | Value |
|--------|-------|
| Real case | $1,400 demurrage from 8-day detection delay |
| Saved per caught trigger | $1,200–$2,000/container |

### Pricing

| | Starter | Growth | Scale | Enterprise |
|--|---------|--------|-------|------------|
| Shipments/month | 1–25 | 25–100 | 100–500 | 500+ |
| Setup | $500 | $1,000 | $2,000 | Custom |
| Monthly | $299 | $499 | $899 | Custom |

### Ideal Buyer

Importer with 3+ ocean containers/year. Ops / Logistics Lead.

### First CTA

> "Share your last forwarder email thread. I'll show you what ETA shifts or demurrage triggers you may have missed."

---

## Product 7: VERIX

**Layer:** 4 — Quality & Structuring | **Phase:** Active

### The Problem

Every inspection generates an email with a report, dozens of photos, and a result that determines whether a shipment moves or stops. Most teams read the subject line, check Pass or Fail, and move on. The files pile up. The details get lost. The history disappears.

Inspection reports arrive in different formats from different companies — QIMA, SGS, Bureau Veritas, Asia Inspection — each formatted differently. Finding any specific report takes 15–45 minutes.

### What It Delivers

An AI agent that processes every inspection report the moment it arrives by email — determines Pass, Fail, or Conditional, notifies the right people instantly, and organizes all files automatically. Zero manual sorting. Zero missed failures.

**If the batch passes:**
- All files organized automatically — report, packaging photos, inspection photos in separate folders
- Structured report artifact created with AQL summary and defect counts by category (Critical / Major / Minor)
- Result logged to supplier and SKU history

**If the batch fails:**
- Manager notified in chat instantly
- Supplier draft prepared and ready to send

**If the result is conditional:**
- Manager escalated with full inspection details for final decision

**Multi-format recognition:** Reads inspection reports from any company, automatically, regardless of format.

Integrates with SC Supplier Desk — supplier letters on failed inspections are routed automatically.  
Integrates with SC Data Map — inspection history stored per supplier and SKU.

### Key Numbers

| Metric | Value |
|--------|-------|
| Inspection report search | 45 min → 10 seconds |
| Fail alert delivery | Instant (vs. next manual email read) |

### Pricing

| | Starter | Growth | Scale | Enterprise |
|--|---------|--------|-------|------------|
| Inspections/month | 1–5 | 6–20 | 21–50 | 50+ |
| Setup | $300 | $600 | $1,200 | Custom |
| Monthly | $149 | $299 | $499 | Custom |

### Ideal Buyer

QA Manager or Sourcing Lead at an importer/private label brand with frequent QC activity.

### First CTA

> "Forward me your last inspection report. I'll show you what VERIX would have done with it in the first 60 seconds."

---

## Product 8: SPECTRA

**Layer:** 4 — Quality & Structuring | **Phase:** Active

### The Problem

Most brands have product specs somewhere — a PDF from three years ago, notes in a supplier email, measurements buried in a listing description. When something changes — a new supplier, a material update, a packaging revision — the spec rarely gets updated. Nobody knows what version is currently in production.

Writing a complete tech pack takes 3–4 hours per SKU: dimensions, materials, tolerances, labeling, packaging, AQL standards. Most brands either skip it, have outdated versions, or write specs inconsistently across SKUs.

Without a proper tech spec, supplier disputes are unwinnable, inspections are inconsistent, and new product launches create unnecessary rework.

### What It Delivers

An AI agent that builds a complete product specification system from scratch — analyzes existing specs, documentation, and Amazon listing descriptions, builds a universal tech card for each SKU, breaks each product down component by component, and delivers a structured template to complete together with the supplier.

**Every finalized spec receives a unique number.** That number appears on every PO, every invoice, every inspection request. No ambiguity. No wrong versions.

**Key features:**
- AI component analysis — breaks product down component by component, identifies every characteristic that should be specified
- Universal tech card — one standardized format for the entire company
- Collaborative template — agent delivers what it knows; client and supplier fill in the rest together
- Strict spec numbering — unique number on every finalized spec, referenced in all POs and communications
- Version control — every change creates a new version (v1.0, v1.1, v2.0) with full changelog
- Spec completeness score — percentage of possible characteristics filled in per SKU
- INSPEX integration — finalized spec automatically generates an inspection checklist

### Key Numbers

| Metric | Value |
|--------|-------|
| Tech spec writing time | 3–4 hours → 15 minutes review |
| Version tracking | Full changelog per SKU |

### Pricing

| | Starter | Growth | Scale | Enterprise |
|--|---------|--------|-------|------------|
| SKUs | 1–10 | 11–50 | 51–200 | 200+ |
| Setup | $600 | $1,200 | $2,500 | Custom |
| Monthly | $199 | $399 | $699 | Custom |

### Ideal Buyer

Brand launching 5+ SKUs/year. Product, Sourcing, or QA team. Any brand switching suppliers or updating production standards.

### First CTA

> "Tell me about one product you're sourcing. I'll show you how SPECTRA would break down its specifications."

---

## Product 9: INSPEX

**Layer:** 4 — Quality & Structuring | **Phase:** Active

### The Problem

Most inspection briefs are vague — "check quality," "verify dimensions," "confirm packaging." Different inspectors interpret them differently. Critical checks get missed. Defects slip through. QIMA today, Asia Inspection tomorrow — same factory, completely different inspection depth.

### What It Delivers

An AI agent that transforms technical specifications into a precise, step-by-step inspection brief for every inspector — based on SPECTRA specs or uploaded documentation. Every inspection standardized. Every check defined. No interpretation required.

**Every brief includes:**
- Component-by-component checklist with exact measurement tolerances
- Clear Pass/Fail criteria for every checkpoint
- AQL sampling instructions with correct sample size calculated automatically
- Sequential workflow — no skipped steps, no guesswork
- Spec number and version reference for full traceability

**When the inspection is complete, VERIX processes the report against the same criteria INSPEX defined — closing the quality loop automatically.**

Integrates with SPECTRA — specs flow directly into inspection briefs automatically.  
Integrates with VERIX — inspection criteria defined by INSPEX are used to validate the incoming report.

### Pricing

| | Starter | Growth | Scale | Enterprise |
|--|---------|--------|-------|------------|
| Briefs/month | 1–5 | 6–20 | 21–50 | 50+ |
| Setup | $300 | $600 | $1,000 | Custom |
| Monthly | $99 | $199 | $349 | Custom |

### Ideal Buyer

QA Manager dealing with frequent inspector interpretation gaps or supplier disputes. Any brand using multiple inspection companies.

---

## Competitive Analysis

### SCAIT vs. Inventory Management Tools

| Tool | Monthly (150 SKUs) | What It Does |
|------|-------------------|--------------|
| SoStocked | $299–$399 | Reorder alerts, basic forecasting |
| Inventory Planner | $299–$499 | Demand forecasting, reorder planning |
| Linnworks | $449 | Stock sync, order management |
| Cin7 Omni | $349–$999 | Warehouse, orders, B2B |
| **SCAIT (3 products)** | **$991–$1,618** | AI agents that do the work |

**SCAIT doesn't compete with dashboards. SCAIT competes with people:**

| What brands usually hire instead | Monthly cost |
|----------------------------------|-------------|
| Junior SC Analyst | $3,000–$5,000 |
| Senior SC Manager | $6,000–$10,000 |
| SC Consulting Firm | $10,000–$25,000 |

---

## Natural Upsell Paths

| Entry Point | Next Step | Reason |
|-------------|-----------|--------|
| SC Data Map | + SC Stock Radar | Foundation → live monitoring |
| SC Stock Radar | + SC Delta | Full Layer 1 visibility |
| SC Supplier Guard | + SC Supplier Desk | Invoice validation + full communication |
| SC 3PL Guard | + SC Supplier Guard | Full financial audit (3PL + supplier) |
| SPECTRA | + INSPEX + VERIX | Full QA loop |
| Any 3+ products | → discuss ecosystem scope | Unit economics favor the bundle |

**Ascension path:**
```
Entry: one product (Starter tier)
    → Expand: add adjacent product or upgrade tier
    → Stack: 3+ products → full Layer coverage
    → Enterprise: $5M+ brand → custom annual contract
```

---

## ROI Quick Reference Card (for sales conversations)

| Scenario | Minimum Catch to Break Even |
|----------|-----------------------------|
| SC Supplier Guard on $20K avg order | 1% price change on one order |
| SC Supplier Guard on $47K avg order | <0.5% price change on one order |
| SC 3PL Guard at $5M brand | First zone error found (real case: $91,800 year 1) |
| SC Forwarder Desk — 3 containers/yr | 1 caught demurrage trigger ($1,200–$2,000) |

---

## Overall SCAIT Claims

| Claim | Source |
|-------|--------|
| 80% reduction in manual SC communication | scait.space |
| 100% audit coverage of financial transactions | scait.space |
| Stockout signals visible 30 days earlier | SC Stock Radar tracking |
