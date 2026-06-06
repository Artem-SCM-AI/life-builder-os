# Roadmap: EMS SaaS — E-commerce Management System

## Overview

Three phases from zero to $1K MRR: sell and manually deliver Supplier Communication AI within 15 days (Phase 1), validate and sell Products 0, 2–5 with 40+ customer interviews (Phase 2), validate and sell Products 6–9 while hitting $1K MRR milestone (Phase 3). No code is written until manual delivery is proven and paying customers exist.

**Product lineup: 10 products (0–9).** Product 0 (Data Structurer) is the foundation — launches first in Phase 2. Launch priority: 0 → Inventory Demand+Forecast → Sales Deviation Tracker → remaining by interview signal.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: First Sale** - Design workflow, build GTM system, and sign first paying customer for Supplier Communication AI within 15 days
- [ ] **Phase 2: Products 2–5 Validation** - Validate and sell Exception Management, Demand Monitor, Supplier Invoice Validation, and 3PL Invoice Validation
- [ ] **Phase 3: Products 6–8 + $1K MRR** - Validate and sell Inspection Processor, Tech Spec Agent, and Quality Inspection Validation; reach $1,000 MRR

## Phase Details

### Phase 1: First Sale
**Goal**: Artem has signed the first paying customer (or pilot LOI) for Supplier Communication AI, with a repeatable delivery system and acquisition engine running
**Depends on**: Nothing (first phase)
**Requirements**: SCAI-01, SCAI-02, SCAI-03, SCAI-04, SCAI-05, SCAI-06, SCAI-07, DEL-01, DEL-02, DEL-03, GTM-01, GTM-02
**Success Criteria** (what must be TRUE):
  1. Supplier Communication AI workflow is documented and can be delivered manually using Claude Skills in a repeatable way
  2. A prospect can be shown a live demo — Claude parsing a real supplier email and producing a structured reply — on a 15-minute call
  3. LinkedIn content is publishing on a cadence of 2 posts per week targeting Amazon brand owners
  4. Outbound outreach is tracked in Google Sheets with 50+ personalized messages sent
  5. At least 1 paying customer has signed ($300 setup + $49/mo) or a pilot LOI is in hand
**Plans**: 5 plans

Plans:
- [ ] 01-01-PLAN.md — Workflow & Delivery System (SCAI workflow doc, Google Sheets spec, onboarding template)
- [ ] 01-02-PLAN.md — Demo & Sales Materials (demo email thread, 15-min sales call script)
- [ ] 01-03-PLAN.md — GTM & Outreach (10 LinkedIn posts, outreach system with DM templates)
- [ ] 01-04-PLAN.md — First Sale Execution (demo call log, checkpoint: first customer signed)
- [ ] 01-05-PLAN.md — YouTube Launch (channel strategy, 11 video scripts, Nano Banana visual directions, CTA pipeline)

### Phase 2: Products 0 + 2–5 Validation
**Goal**: Product 0 (Data Structurer) concept + demo shipped; Products 2–5 each workflow-documented, interview-validated, and have a first customer or LOI. Launch order determined by interview signal.
**Depends on**: Phase 1
**Requirements**: DS-01, DS-02, DS-03, DS-04, EMS-01, EMS-02, EMS-03, DEVMON-01, DEVMON-02, DEVMON-03, SINV-01, SINV-02, SINV-03, 3PLV-01, 3PLV-02, 3PLV-03
**Success Criteria** (what must be TRUE):
  1. All four product workflows are documented and deliverable manually via Claude Skills
  2. 40 customer interviews completed (10 per product) confirming each is a paid pain point
  3. At least one paying customer or pilot LOI secured for each of the four products
  4. Learnings from interviews are captured and any invalidated requirements are moved out of scope
**Plans**: 4 plans

Plans:
- [ ] 02-01-PLAN.md — Product 0 Launch Materials (concept doc, Claude template, demo output, sales script)
- [ ] 02-02-PLAN.md — Lead Gen & Outreach System (20–30 leads/day playbook, warm+cold scripts, Google Sheets tracker spec)
- [ ] 02-03-PLAN.md — Interview-to-Sale Pipeline (master call script, 4 product sales scripts, demo prep guide)
- [ ] 02-04-PLAN.md — Products 2–5 Execution (adaptive sequencing guide, 40 interviews, 4 deals closed)

### Phase 3: Products 6–8 + $1K MRR
**Goal**: Products 6–8 (Inspection Report Processor, Tech Spec Agent, Quality Inspection Validation) are validated and sold; total MRR reaches $1,000 with YouTube demos live
**Depends on**: Phase 2
**Requirements**: INSP-01, INSP-02, INSP-03, SPEC-01, SPEC-02, SPEC-03, QIV-01, QIV-02, QIV-03, GTM-03, GTM-04, GTM-05
**Success Criteria** (what must be TRUE):
  1. All three product workflows are documented and deliverable manually via Claude Skills
  2. 30 customer interviews completed (10 per product) confirming each is a paid pain point
  3. At least one paying customer or pilot LOI secured for each of the three products
  4. 5 YouTube demo shorts are published showing Claude catching real supply chain issues
  5. Total MRR across all products reaches $1,000 (and a path to $3,500 is visible)
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. First Sale | 0/5 | Planned | - |
| 2. Products 2–5 Validation | 0/4 | Planned | - |
| 3. Products 6–8 + $1K MRR | 0/TBD | Not started | - |

## Backlog

### Phase 999.1: Growth & Operations — Sales, Marketing, Lead Gen, Content, SEO, Analytics, Dev (BACKLOG)

**Goal:** Captured for future planning — growth and operational tasks across 7 domains
**Requirements:** TBD
**Plans:** 0 plans

Plans:
- [ ] TBD (promote with /gsd-review-backlog when ready)

**Tasks by category:**

**Sales**
- [ ] Schedule 3 meetings this week (Wed–Thu–Fri) with warm contacts to present SCAIT
- [ ] Analyze LinkedIn contact base to select meeting candidates

**Marketing**
- [ ] Create a digital avatar for SCAIT advertising
- [ ] Record 10 videos (5 live + 5 with avatar) on the same topics
- [ ] A/B test: determine which format performs better

**Lead Generation**
- [ ] Set up system for 20–30 leads per day for SCAIT
- [ ] Set up LinkedIn + email workflow for cold outreach
- [ ] Develop affiliate/referral program (trippers recommend SCAIT to brands)

**Content**
- [ ] Learn how to extract data from RSS feed
- [ ] Develop content sorting system
- [ ] Build posting strategy
- [ ] Auto-posting: Twitter + LinkedIn
- [ ] YouTube — manually

**SEO**
- [ ] Review SEO video
- [ ] Run website through multiple AIs (check clarity/visibility)
- [ ] Write to Oleksiy for deployment of new SEO-optimized version of the site

**Analytics**
- [ ] Set up analytics across all content
- [ ] Track A/B test results for videos

**Development**
- [ ] Product Zero — Google Workspace + AI integration (automatic data extraction from spreadsheets)
- [ ] Develop referral/affiliate system technically
