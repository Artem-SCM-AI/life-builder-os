# EMS SaaS — E-commerce Management System

## What This Is

A portfolio of 8 Claude-powered supply chain automation services delivered as a monthly subscription. Artem executes each workflow manually using Claude Skills and delivers structured outputs (reports, emails, alerts, validations) to Amazon brand owners. Clients pay a setup fee + monthly retainer; full automation is built only after manual delivery proves demand.

## Core Value

First paying customer for Supplier Communication AI within 15 days — proof that SC automation can be sold and delivered before any code is written.

## Requirements

### Validated

(None yet — ship to validate)

### Active

**Product 1: Supplier Communication AI (Priority — start here)**
- [ ] Workflow designed: inbound supplier email → Claude parsing → structured reply → tracking log
- [ ] Demo script and mockup built (Google Sheets + Claude output sample)
- [ ] 10 LinkedIn posts published targeting Amazon brand owners
- [ ] 50+ outbound outreach messages sent (LinkedIn DMs + email)
- [ ] 3 demo calls completed
- [ ] 1 paying customer signed ($300 setup + $49/mo) or pilot LOI

**Product 2: Exception Management System**
- [ ] Workflow designed: inventory + sales data → Claude analysis → ranked alert list
- [ ] Validation: 10 customer interviews completed

**Product 3: Demand vs Plan Deviation Monitor**
- [ ] Workflow designed: forecast vs actual comparison → Claude insights → deviation alerts
- [ ] Validation: 10 customer interviews completed

**Product 4: Supplier Invoice Validation**
- [ ] Workflow designed: PO + invoice + receipt → Claude 3-way match → discrepancy report
- [ ] Validation: 10 customer interviews completed

**Product 5: 3PL Invoice & Cost Validation**
- [ ] Workflow designed: 3PL invoice + contract rate card → Claude comparison → variance report
- [ ] Validation: 10 customer interviews completed

**Product 6: AI Inspection Report Processor**
- [ ] Workflow designed: supplier inspection emails → Claude extraction → Drive folder organization
- [ ] Validation: 10 customer interviews completed

**Product 7: AI Product Tech Spec & Inspection Agent**
- [ ] Workflow designed: product brief → Claude → spec doc + inspection checklist
- [ ] Validation: 10 customer interviews completed

**Product 8: AI Quality Inspection Validation**
- [ ] Workflow designed: inspection report + photos → Claude analysis → risk score + anomaly flags
- [ ] Validation: 10 customer interviews completed

### Out of Scope

- Full SaaS product build — no backend, no auth, no database until manual delivery is proven and paying customers exist
- Custom code or APIs in Phase 0–2 — Google Sheets + Claude Skills only
- All 8 products simultaneously — Supplier Communication AI ships first; others sequenced after validation

## Context

- **Builder:** Artem Stepanenko — Head of Supply Chain background (5+ years, Amazon/Jumpzylla), currently job searching with May 1 deadline; this project is a parallel revenue stream + proof of SC automation expertise
- **Execution model:** Understand → Validate → Sell → Manual Delivery → Automate. No code before paying customers.
- **Tech stack (service delivery):** Claude Code / Claude Skills for AI reasoning, Google Sheets as CRM + data backend, Gmail for outreach, Google Drive for deliverable storage
- **Business model:** $300 setup fee per product + $49/month per product; $350/month for full 8-product ecosystem
- **Target ICP:** Amazon brand owners managing China supplier relationships and 3PL operations
- **Content channels for acquisition:** LinkedIn (primary), YouTube (demos), Threads (reach)
- **Existing notebooklm-py codebase** in this repo — Python notebook tooling, separate from EMS SaaS; do not modify

## Constraints

- **Timeline:** First paying customer for Supplier Communication AI within 15 days (by ~May 3, 2026)
- **Budget:** $0 — organic acquisition only, no paid ads
- **Tech:** No backend/SaaS infrastructure until Phase 3+ (post manual delivery validation)
- **Capacity:** Artem is solo — job search active in parallel; execution must be time-efficient
- **Delivery:** Manual + Claude Skills first; automation only after workflow is proven and customer demand is confirmed

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Supplier Communication AI first | Easiest to demonstrate value with zero automation; supplier emails are universal pain point for Amazon sellers | — Pending |
| Manual delivery before product build | Validates demand and refines workflow requirements before investing in automation | — Pending |
| $49/mo pricing per product | Low enough to get quick yes; $350 ecosystem price creates upsell path | — Pending |
| Claude Skills as delivery engine | Artem already proficient; no new tooling required; positions him as SC automation expert | — Pending |
| All 8 products tracked in one GSD project | Portfolio coherence; phased by product validation sequence | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-18 after initialization*
