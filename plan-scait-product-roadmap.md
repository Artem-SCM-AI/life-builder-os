# EMS — Execution Roadmap
### E-commerce Management System | Supply Chain Automation for Amazon Brand Owners

---

## The Big Picture

**What you're building:** A portfolio of 8 Claude-powered supply chain services delivered manually as a subscription. You are the AI — you process client data using Claude and deliver structured outputs. No code until customers pay.

**How you get there in 3 phases:**

```
Phase 1 → Phase 2 → Phase 3
First Sale   Validate   $1K MRR
(15 days)   Products   + YouTube
             2–5
```

**Revenue model:** $300 setup + $49/month per product. $350/month ecosystem bundle (all 8 products).

**Break-even to $1K MRR:** ~20 single-product clients or ~3 ecosystem clients.

---

## PHASE 1 — First Sale

**Deadline:** May 3, 2026 (15 days from April 18)
**Product:** Supplier Communication AI (SCAI)
**Goal:** One paying customer. $300 setup + $49/month. Or a signed pilot LOI.

**Status: EXECUTING — all materials ready, running outreach + calls**

---

### What's already done ✓

All 7 deliverables are built and in `.planning/phases/01-first-sale/deliverables/`:

| Deliverable | What it is |
|-------------|-----------|
| SCAI-WORKFLOW.md | How to process a supplier email, step by step, with the exact Claude prompt |
| SCAI-GOOGLE-SHEETS-SPEC.md | Full spec for the CRM Master + client tracking sheets |
| SCAI-ONBOARDING-TEMPLATE.md | 30-min setup call agenda, data collection form, first delivery checklist |
| SCAI-DEMO-EMAIL-THREAD.md | Realistic supplier email + full Claude output for live demo |
| SCAI-SALES-SCRIPT.md | Word-for-word 15-min demo call script with ROI + 3 objections |
| LINKEDIN-CONTENT-CALENDAR.md | 10 posts, copy-paste ready, publishing schedule starts April 22 |
| OUTREACH-SYSTEM.md | 3 DM templates, prospect sourcing method, 50-message weekly plan |

---

### What you do now — Week by Week

**WEEK 1 (April 21–25)**

- [ ] Build SCAI CRM Master in Google Sheets (use SCAI-GOOGLE-SHEETS-SPEC.md — takes 30 min)
- [ ] Publish Post 1 on LinkedIn (April 22) — text is in LINKEDIN-CONTENT-CALENDAR.md, copy-paste
- [ ] Add first comment within 30 min of posting (text is there too)
- [ ] Find 10 qualified prospects on LinkedIn (OUTREACH-SYSTEM.md Section 1)
- [ ] Send 10 connection requests (OUTREACH-SYSTEM.md Template A or B)
- [ ] Log all in CRM Master → Outreach Log tab
- [ ] Publish Post 2 (April 25)

**WEEK 2 (April 28 – May 2)**

- [ ] Send follow-up messages to Week 1 connections who accepted (Template A or B, Step 2)
- [ ] Send 10 new connection requests
- [ ] Publish Post 3 (April 28) and Post 4 (May 1)
- [ ] Book first demo call — target: at least 1 call this week
- [ ] Run demo call using SCAI-SALES-SCRIPT.md — log in DEMO-CALL-LOG.md

**WEEK 3 (May 3–9)**

- [ ] Run 2+ more demo calls — log each one
- [ ] After 3 calls: fill in DEMO-CALL-LOG.md Section 3 (Pattern Log)
- [ ] Close first sale — send $300 invoice immediately after call
- [ ] If won: run onboarding call (SCAI-ONBOARDING-TEMPLATE.md), set up client sheet
- [ ] If won: fill in FIRST-CUSTOMER-RECORD.md
- [ ] Publish Post 5 (May 5) and Post 6 (May 8)

**Signal completion:** When first sale is done, write `"won [client name]"` or `"loi [name]"` to continue.

---

### Key rules for Phase 1

1. **The demo is everything.** Show SCAI-DEMO-EMAIL-THREAD.md on every call. Don't describe it — show it.
2. **ROI anchor:** $49/month vs. one missed price change = $2,750. Say this on every call.
3. **Don't over-explain in DMs.** If someone shows interest — book a call, don't pitch in text.
4. **Post 3 adjustment:** Change "here's a situation I see" → "a brand I work with" after first client signs.
5. **Invoice within 1 hour of every won call.** Written record prevents disputes.

---

## PHASE 2 — Products 2–5 Validation

**Starts after:** First paying SCAI client
**Goal:** Validate 4 more products with real buyers. 40 interviews total. First sale or LOI for each.
**Pricing:** Same model — $300 setup + $49/month per product

---

### The 4 Products

**Product 2 — Exception Management System**
> Client provides inventory + sales data → Claude ranks issues by severity → client gets prioritized alert list
- Pain: Brand owner doesn't know what's on fire until it's too late
- Proof of value: One prevented stockout pays for a year of service

**Product 3 — Demand vs Plan Deviation Monitor**
> Client provides forecast vs actuals → Claude compares → deviation report with root-cause signals
- Pain: Realized sales diverged from forecast — no system to catch it early
- Proof of value: Catching a 20% demand drop 4 weeks early changes the reorder decision

**Product 4 — Supplier Invoice Validation**
> Client provides PO + invoice + receipt → Claude does 3-way match → discrepancy report
- Pain: Paying supplier invoices that don't match the PO or receiving report
- Proof of value: 3–5% invoice discrepancy rate is common at $500K+ sourcing volume

**Product 5 — 3PL Invoice & Cost Validation**
> Client provides 3PL invoice + contract rate card → Claude line-item comparison → variance report
- Pain: 3PL bills are complex and overbilling is common but hard to catch manually
- Proof of value: Artem's own analysis found $270K–$370K/year in recoverable 3PL overcharges

---

### How Phase 2 Works (per product)

For each of the 4 products, in sequence:

1. **Document the workflow** (same format as SCAI-WORKFLOW.md — 1–2 days)
2. **Run 10 customer interviews** — ask: "Is this a pain you'd pay to fix?" (2–3 weeks)
3. **Build demo output** — one realistic example showing Claude processing real data
4. **Run demo calls** — same script structure as SCAI-SALES-SCRIPT.md
5. **Close first sale or LOI**

**Interview questions to ask (use for all 4 products):**
- "How do you currently handle [X]?"
- "When did [X] last cause a real problem for you? What did it cost?"
- "If this problem was solved for you automatically, what would that be worth?"
- "Would you pay $49/month for that? Why or why not?"

**Output by end of Phase 2:**
- 4 workflow docs (one per product)
- 40 customer interviews logged
- 4 paying customers or LOIs
- MRR: ~$196–$245/month (4 clients × $49)

---

## PHASE 3 — Products 6–8 + $1K MRR

**Starts after:** Phase 2 complete (4 validated products)
**Goal:** 3 more products validated + sold. Total MRR hits $1,000. YouTube channel live.

---

### The 3 Products

**Product 6 — AI Inspection Report Processor**
> Client forwards inspection emails → Claude extracts data → structured Google Drive folder
- Pain: Inspection reports arrive as raw emails/PDFs, get lost, no structured history
- Proof of value: Finding an old inspection report takes 45 min manually → 10 sec with a log

**Product 7 — AI Product Tech Spec & Inspection Agent**
> Client provides product brief → Claude generates tech spec + supplier-ready inspection checklist
- Pain: Writing specs and checklists for new products takes hours and gets done inconsistently
- Proof of value: 1 hour of spec writing → 5 minutes with Claude

**Product 8 — AI Quality Inspection Validation**
> Client provides inspection report + photos → Claude analysis → risk score + anomaly flags
- Pain: QC reports arrive, brand owner doesn't know how to interpret them
- Proof of value: One missed quality flag that leads to a recall costs $10K–$100K

---

### The $1K MRR Path

| Scenario | Clients | MRR |
|----------|---------|-----|
| 20 single-product clients × $49 | 20 | $980 |
| 3 ecosystem clients × $350 | 3 | $1,050 |
| Mix: 10 single + 2 ecosystem | 12 | $1,190 |

**Ecosystem bundle ($350/month):** All 8 products. Offer this as an upsell to any client who asks "what else do you do?"

---

### YouTube — 5 Demo Shorts

Launch alongside Phase 3. Each video is 60–90 seconds:

1. "Watch Claude catch a hidden supplier price increase"
2. "3PL overbilling: Claude found $2,400 in 4 minutes"
3. "Exception management: ranking your supply chain fires"
4. "From inspection email to Google Drive in 30 seconds"
5. "How I manage 8 suppliers with $49/month and Claude"

Format: screen recording of Claude processing a real (sanitized) example. No face needed. No editing skills needed. Record, upload, done.

---

## Full Product Lineup

| # | Product | Pain | Price |
|---|---------|------|-------|
| 1 | Supplier Communication AI | Buried price changes, missed deadlines, slow replies | $300 + $49/mo |
| 2 | Exception Management | Don't know what's on fire until it's too late | $300 + $49/mo |
| 3 | Demand vs Plan Monitor | Sales diverge from forecast, no early warning | $300 + $49/mo |
| 4 | Supplier Invoice Validation | Paying invoices that don't match POs | $300 + $49/mo |
| 5 | 3PL Invoice Validation | 3PL overbilling buried in complex invoices | $300 + $49/mo |
| 6 | Inspection Report Processor | Inspection data scattered, no history | $300 + $49/mo |
| 7 | Tech Spec & Inspection Agent | Writing specs takes hours, done inconsistently | $300 + $49/mo |
| 8 | Quality Inspection Validation | Can't interpret QC reports, miss red flags | $300 + $49/mo |
| — | Ecosystem Bundle | All 8 products | $350/mo |

---

## Quick Reference — Files to Use

| Situation | File |
|-----------|------|
| Processing a supplier email for a client | SCAI-WORKFLOW.md |
| Building Google Sheets CRM | SCAI-GOOGLE-SHEETS-SPEC.md |
| Running a setup call with a new client | SCAI-ONBOARDING-TEMPLATE.md |
| Preparing for a demo call | SCAI-DEMO-EMAIL-THREAD.md + SCAI-SALES-SCRIPT.md |
| Posting on LinkedIn | LINKEDIN-CONTENT-CALENDAR.md |
| Sending outreach DMs | OUTREACH-SYSTEM.md |
| Logging demo calls | DEMO-CALL-LOG.md |
| Documenting first client | FIRST-CUSTOMER-RECORD.md |

All files: `.planning/phases/01-first-sale/deliverables/`

---

## Progress Tracker

| Phase | Status | Key Milestone |
|-------|--------|---------------|
| Phase 1 — First Sale | **Executing** — outreach + calls | First client by May 3 |
| Phase 2 — Products 2–5 | Not started | Starts after first SCAI client |
| Phase 3 — Products 6–8 + $1K MRR | Not started | Starts after Phase 2 |

**Today's focus:** Publish Post 1. Send first 10 connection requests. Book first demo call.

---

*Last updated: April 18, 2026*
