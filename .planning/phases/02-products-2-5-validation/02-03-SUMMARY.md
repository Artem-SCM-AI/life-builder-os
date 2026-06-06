---
phase: 02-products-2-5-validation
plan: "03"
subsystem: sales-operations
tags: [sales-scripts, interview-pipeline, demo-prep, products-2-5, ems, devmon, sinv, 3plv]
dependency_graph:
  requires:
    - 02-01 (DS-SALES-SCRIPT.md structure pattern)
    - 02-02 (call log template feeds into interview tracker)
  provides:
    - INTERVIEW-MASTER-SCRIPT.md (universal 15-min call structure for all 40 interviews)
    - DEMO-PREP-GUIDE.md (pre-call demo setup for all 4 products)
    - EMS-SALES-SCRIPT.md (Product 2 call script + workflow documentation)
    - DEVMON-SALES-SCRIPT.md (Product 3 call script + workflow documentation)
    - SINV-SALES-SCRIPT.md (Product 4 call script + workflow documentation)
    - 3PLV-SALES-SCRIPT.md (Product 5 call script + workflow documentation)
  affects:
    - 02-04-PLAN.md (uses these scripts on every call during 40-interview phase)
    - 02-02 tracker (call log template feeds the interview tracker built there)
tech_stack:
  added: []
  patterns:
    - Master script + product script composition pattern (universal wrapper + product-specific fill)
    - Discovery/Demo/Offer 15-min call script pattern (mirrored from DS-SALES-SCRIPT.md)
    - Illustrative-only demo data pattern (sample data with explicit labeling per threat model)
key_files:
  created:
    - .planning/phases/02-products-2-5-validation/deliverables/INTERVIEW-MASTER-SCRIPT.md
    - .planning/phases/02-products-2-5-validation/deliverables/DEMO-PREP-GUIDE.md
    - .planning/phases/02-products-2-5-validation/deliverables/EMS-SALES-SCRIPT.md
    - .planning/phases/02-products-2-5-validation/deliverables/DEVMON-SALES-SCRIPT.md
    - .planning/phases/02-products-2-5-validation/deliverables/SINV-SALES-SCRIPT.md
    - .planning/phases/02-products-2-5-validation/deliverables/3PLV-SALES-SCRIPT.md
  modified: []
decisions:
  - "Master script + product script composition: universal opening/close/objections in master; product-specific discovery and demo in product scripts — reduces duplication, keeps each product script self-contained for in-call use"
  - "Demo data uses invented trampoline SKUs (TRAMP-8FT etc.) — matches Jumpzylla domain knowledge without using real data; threat model T-02-03-02 complied with"
  - "3PLV-specific objection added beyond the universal four: 'My 3PL is trustworthy' — most common 3PLV-specific objection that the universal responses don't address"
  - "Call log Section 5 includes usage note linking to 02-02 tracker — ensures log output feeds the structured tracking system"
metrics:
  duration_minutes: 8
  tasks_completed: 2
  tasks_total: 2
  files_created: 6
  files_modified: 0
  completed_date: "2026-05-03"
---

# Phase 02 Plan 03: Interview-to-Sale Pipeline (Products 2–5) — Summary

**One-liner:** Six-file interview-to-sale pipeline — universal call structure, four product-specific sales scripts (EMS/DEVMON/SINV/3PLV), and a live demo prep guide that enables 2-minute call preparation for any product.

---

## What Was Built

| File | Description |
|------|-------------|
| INTERVIEW-MASTER-SCRIPT.md | Universal 15-min call wrapper: timing table, exact opening line, universal offer close ($300+$49), 4 objection responses with follow-up rules, call log template with 8 fields |
| DEMO-PREP-GUIDE.md | Pre-call setup guide for all 4 products: sample data (illustrative only), Claude prompt to paste, exact "what to say during demo" line for each product section |
| EMS-SALES-SCRIPT.md | Product 2 call script: inventory exception monitoring workflow, 4 discovery questions, stockout/overstock demo anchor, ROI anchor ($1,500/day lost revenue per stockout) |
| DEVMON-SALES-SCRIPT.md | Product 3 call script: forecast deviation workflow, 4 discovery questions, over/under forecast demo anchor, ROI anchor (2–3 week head start vs month-end detection) |
| SINV-SALES-SCRIPT.md | Product 4 call script: supplier 3-way match workflow, 4 discovery questions, $344 discrepancy demo anchor, ROI anchor ($10K–$25K on $500K annual spend) |
| 3PLV-SALES-SCRIPT.md | Product 5 call script: 3PL rate card audit workflow, 4 discovery questions, $158 invoice overcharge demo anchor, ROI anchor ($150–$400/month on $5K/mo 3PL bill) |

---

## Requirements Satisfied

The following requirements are satisfied by the workflow summaries embedded in each product sales script header:

| Requirement | Satisfied by | Workflow documented |
|-------------|-------------|---------------------|
| EMS-01 | EMS-SALES-SCRIPT.md | inventory + sales data → Claude → ranked issue list with severity scores → Google Sheet |
| DEVMON-01 | DEVMON-SALES-SCRIPT.md | forecast vs actual data → Claude → deviation report with variance %, direction, root-cause signals |
| SINV-01 | SINV-SALES-SCRIPT.md | PO + invoice + receiving record → Claude 3-way match → discrepancy report |
| 3PLV-01 | 3PLV-SALES-SCRIPT.md | 3PL invoice + contract rate card → Claude line-by-line compare → variance report with dollar impact |

---

## How the Pipeline Works Together

```
Before every call:
  → Open INTERVIEW-MASTER-SCRIPT.md (universal structure)
  → Open [PRODUCT]-SALES-SCRIPT.md (product-specific discovery + demo)
  → Open DEMO-PREP-GUIDE.md → [Product] section (sample data + prompt ready)

During call:
  → Opening: INTERVIEW-MASTER-SCRIPT.md Section 2 (exact words)
  → Discovery: [PRODUCT]-SALES-SCRIPT.md (4 questions)
  → Demo: paste data + prompt from DEMO-PREP-GUIDE.md → narrate anchor line from product script
  → Offer: INTERVIEW-MASTER-SCRIPT.md Section 3 (exact words) + product ROI anchor
  → Objections: INTERVIEW-MASTER-SCRIPT.md Section 4

After call:
  → Complete call log: INTERVIEW-MASTER-SCRIPT.md Section 5 template → paste into 02-02 tracker
```

---

## Reuse Notes for Downstream Plans

- **02-04 (40-interview execution):** These 6 files are the complete operational toolkit for every call. No additional scripts needed — just open the relevant product script + this guide before each call.
- **02-02 (interview tracker):** The call log template in INTERVIEW-MASTER-SCRIPT.md Section 5 maps directly to tracker columns. Log after every call into the Google Sheets tracker built in 02-02.
- **Future product scripts (Products 6–8):** Use the same master script + product script composition pattern. Only write new Discovery and Demo blocks — opening, offer, objections, and call log remain universal.

---

## Deviations from Plan

**1. [Rule 2 - Missing critical functionality] Added 3PLV-specific objection response**
- **Found during:** Task 2 (writing 3PLV-SALES-SCRIPT.md)
- **Issue:** The universal 4 objection responses in INTERVIEW-MASTER-SCRIPT.md don't address "My 3PL is trustworthy" — the most common 3PLV objection that deflects the entire premise
- **Fix:** Added a fifth objection response specific to 3PLV: "Most overbilling is billing system errors, not fraud..." — reframes the pitch from accusation to audit hygiene
- **Files modified:** 3PLV-SALES-SCRIPT.md

None other — plan executed as written.

---

## Known Stubs

None. All sample data in DEMO-PREP-GUIDE.md is clearly labeled "Sample / Illustrative Only." No real client data or real identifiers used. Threat model T-02-03-02 complied with.

---

## Self-Check: PASSED

Files verified to exist:
- FOUND: .planning/phases/02-products-2-5-validation/deliverables/INTERVIEW-MASTER-SCRIPT.md
- FOUND: .planning/phases/02-products-2-5-validation/deliverables/DEMO-PREP-GUIDE.md
- FOUND: .planning/phases/02-products-2-5-validation/deliverables/EMS-SALES-SCRIPT.md
- FOUND: .planning/phases/02-products-2-5-validation/deliverables/DEVMON-SALES-SCRIPT.md
- FOUND: .planning/phases/02-products-2-5-validation/deliverables/SINV-SALES-SCRIPT.md
- FOUND: .planning/phases/02-products-2-5-validation/deliverables/3PLV-SALES-SCRIPT.md

Commits verified:
- 282f7e7 — feat(02-03): add INTERVIEW-MASTER-SCRIPT and DEMO-PREP-GUIDE
- 80c3a52 — feat(02-03): add four product sales scripts (EMS, DEVMON, SINV, 3PLV)

Verification checks:
- 4 product scripts present (EMS, DEVMON, SINV, 3PLV): PASS
- 1 workflow summary per script: PASS
- 4 "What to Say During Demo" sections in DEMO-PREP-GUIDE: PASS
- All 8 call log fields in INTERVIEW-MASTER-SCRIPT Section 5: PASS
