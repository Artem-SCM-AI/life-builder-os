---
phase: 02-products-2-5-validation
plan: "02"
subsystem: lead-generation
tags: [outreach, lead-gen, google-sheets, scripts, sales]
dependency_graph:
  requires: []
  provides:
    - LEAD-GEN-SYSTEM.md
    - LEAD-TRACKER-SPEC.md
    - WARM-OUTREACH-SCRIPTS.md
    - COLD-OUTREACH-SCRIPTS.md
  affects:
    - 02-03 (interview pipeline feeds from this lead gen system)
    - 02-04 (product-specific scripts adapt these templates)
tech_stack:
  added: []
  patterns:
    - LinkedIn search filter sequences for Amazon brand owner ICP
    - Warm-first outreach sequencing (tiers by trust level)
    - "show me" demo request mechanism for low-friction cold follow-up
key_files:
  created:
    - .planning/phases/02-products-2-5-validation/deliverables/LEAD-GEN-SYSTEM.md
    - .planning/phases/02-products-2-5-validation/deliverables/LEAD-TRACKER-SPEC.md
    - .planning/phases/02-products-2-5-validation/deliverables/WARM-OUTREACH-SCRIPTS.md
    - .planning/phases/02-products-2-5-validation/deliverables/COLD-OUTREACH-SCRIPTS.md
  modified: []
decisions:
  - "Warm contact tiers ordered by trust: Jumpzylla ex-colleagues > LinkedIn connections > SCAI customers; approach in order"
  - "Cold follow-up lowers the bar to a 90-second demo with 'show me' trigger — no call required to see the product"
  - "One follow-up maximum per cold lead; opt-outs marked Closed Lost immediately"
  - "Tracker uses Lead ID (LEAD-001 format) as join key between Tab 1 (pipeline) and Tab 2 (interview log)"
metrics:
  duration_minutes: 4
  tasks_completed: 2
  tasks_total: 2
  files_created: 4
  files_modified: 0
  completed_date: "2026-05-03"
---

# Phase 2 Plan 02: Lead Generation System Summary

**One-liner:** LinkedIn-first 20–30 leads/day playbook with warm-tiered outreach scripts and a Google Sheets tracker spec covering the full pipeline from cold contact to Closed Won.

## What Was Built

Four operational documents:

1. **LEAD-GEN-SYSTEM.md** — Daily lead generation playbook
   - ICP definition: Amazon brand owner, 5–50 SKUs, China-sourced, FBA + 3PL
   - LinkedIn search filters: exact title strings, industry, company size, geography, keyword filters
   - 6-step daily workflow executable in 15–20 minutes
   - Lead volume math: 20–30 leads/day → 2–3 calls/week minimum
   - Warm contact priority tiers (Tier 1: Jumpzylla ex-colleagues, Tier 2: LinkedIn connections, Tier 3: SCAI customers)

2. **LEAD-TRACKER-SPEC.md** — Google Sheets build specification
   - Tab 1 "Lead Pipeline": 12 columns (A–L) with dropdown specs for Lead Source, Product Interest, and Status
   - Tab 2 "Interview Log": 7 columns linked to Tab 1 via Lead ID
   - Tab 3 "MRR Dashboard": formulas for MRR ($49/mo) and setup revenue ($300) per customer
   - Full setup checklist and step-by-step build instructions
   - Buildable in under 30 minutes

3. **WARM-OUTREACH-SCRIPTS.md** — 3 warm scripts
   - Script 1: Ex-colleague / ex-Jumpzylla contact (highest trust, highest conversion)
   - Script 2: LinkedIn connection with SC/Amazon background
   - Script 3: SCAI customer upsell (existing paying customer from Phase 1)
   - Each script includes exact message text, context/when-to-use, and tracker log instruction

4. **COLD-OUTREACH-SCRIPTS.md** — 3 cold scripts
   - Script 1: Cold LinkedIn DM (first touch, 3–4 sentence limit)
   - Script 2: Cold email with subject line "Cut SC data cleanup time for [Company]"
   - Script 3: Follow-up with "show me" trigger (sends 90-second demo, no call required)
   - Opt-out and do-not-use guards on each script
   - Message sequence summary table: timing, channel, and next action

## Script Count

| Type | Count |
|------|-------|
| Warm scripts | 3 |
| Cold scripts (first touch) | 2 (LinkedIn DM + email) |
| Cold follow-up | 1 |
| Total scripts | 6 |

## Reuse Notes

- **02-03 (Interview Pipeline):** Calls booked via these scripts feed directly into the interview log (Tab 2 of tracker). Interview outcomes are recorded back in Tab 1 (Status: Demo Done → Offer Made → Closed Won).
- **02-04 (Product-Specific Validation):** Scripts are intentionally product-agnostic at this stage. When 02-04 executes, it will adapt these cold and warm templates per-product (e.g., EMS-specific cold DM, SINV-specific warm connection script). The base templates in this plan serve as the starting framework.

## Tracker Cross-Reference

LEAD-GEN-SYSTEM.md daily steps reference specific tracker columns:
- Step 3 → Tab 1 Columns A–F (add lead data)
- Step 5 → Tab 1 Columns G, I, J (log outreach)
- Step 6 → Tab 1 Columns I, K, L (log replies and moves)
- Post-call → Tab 2 all columns (log interview)

## Deviations from Plan

None — plan executed exactly as written. All 4 deliverables created with full content matching plan specifications.

## Self-Check

Files exist:

- [x] LEAD-GEN-SYSTEM.md — FOUND
- [x] LEAD-TRACKER-SPEC.md — FOUND
- [x] WARM-OUTREACH-SCRIPTS.md — FOUND
- [x] COLD-OUTREACH-SCRIPTS.md — FOUND

Commits exist:

- [x] c05b8ea — feat(02-02): write LEAD-GEN-SYSTEM.md and LEAD-TRACKER-SPEC.md
- [x] 3703019 — feat(02-02): write WARM-OUTREACH-SCRIPTS.md and COLD-OUTREACH-SCRIPTS.md

Verification checklist:
- [x] Section 3 daily workflow: exactly 6 numbered steps
- [x] Tab 1: 12 columns A–L with all names matching spec
- [x] Script 3 (follow-up) contains "show me" reply trigger
- [x] Warm scripts: exactly 3

## Self-Check: PASSED
