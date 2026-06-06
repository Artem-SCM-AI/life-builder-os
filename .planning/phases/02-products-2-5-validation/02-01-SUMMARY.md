---
phase: 02-products-2-5-validation
plan: "01"
subsystem: product-content
tags: [product-0, data-structurer, sales-materials, claude-template, demo]
dependency_graph:
  requires: []
  provides:
    - DS-CONCEPT-DOC.md (Product 0 data taxonomy and value proposition)
    - DS-CLAUDE-TEMPLATE.md (copy-paste Claude prompt for SC data structuring)
    - DS-DEMO-OUTPUT.md (live demo artifact with before/after SC data)
    - DS-SALES-SCRIPT.md (15-min call script with exact spoken lines)
  affects:
    - 02-03-PLAN.md (adapts this sales script pattern for each of Products 2–5)
    - 02-02-PLAN.md (uses DS-CONCEPT-DOC.md as data layer definition for Exception Management)
tech_stack:
  added: []
  patterns:
    - Claude prompt template pattern (context block + processing instructions + structured output format)
    - Before/after demo artifact pattern (raw input → structured table for live screen-share)
    - Discovery/Demo/Offer 15-min call script pattern
key_files:
  created:
    - .planning/phases/02-products-2-5-validation/deliverables/DS-CONCEPT-DOC.md
    - .planning/phases/02-products-2-5-validation/deliverables/DS-CLAUDE-TEMPLATE.md
    - .planning/phases/02-products-2-5-validation/deliverables/DS-DEMO-OUTPUT.md
    - .planning/phases/02-products-2-5-validation/deliverables/DS-SALES-SCRIPT.md
  modified: []
decisions:
  - "Six SC data categories chosen: SKUs, Inventory, Orders, Forecasts, Supplier Data, 3PL Activity — covers full Amazon FBA + China sourcing + 3PL operational surface"
  - "Demo data is fully sanitized/invented — threat model T-02-01-01 complied with; header note added to DS-DEMO-OUTPUT.md"
  - "Lead time stored as range (40–45 days) flagged as ? not ⚠ — preserves actual supplier email fidelity while surfacing ambiguity for resolution"
  - "Sales script tone set to peer-to-peer practitioner (former Head of SC) not vendor — matches Artem's actual background for credibility"
  - "Three objection responses included in Offer block: ROI math / send demo output / VA use case — covers the most common Amazon brand owner hesitations"
metrics:
  duration_minutes: 4
  tasks_completed: 2
  tasks_total: 2
  files_created: 4
  files_modified: 0
  completed_date: "2026-05-03"
---

# Phase 02 Plan 01: Data Structurer Assistant (Product 0) — Launch Materials Summary

**One-liner:** Four-file Product 0 launch package — SC data taxonomy, Claude structuring prompt, before/after demo with three data types, and 15-min peer-to-peer sales script with exact spoken lines.

---

## What Was Built

| File | Description |
|------|-------------|
| DS-CONCEPT-DOC.md | Product 0 concept: 6 SC data field categories (SKUs, Inventory, Orders, Forecasts, Supplier Data, 3PL Activity), each with field names, types, and example values; data flow diagram from raw inputs → structured tables → downstream EMS products; 3-bullet value proposition |
| DS-CLAUDE-TEMPLATE.md | Copy-paste Claude prompt: SC data analyst context block, 6-category detection logic, field extraction with Status column (✓ / ⚠ / ?), structured Markdown table output, edge case handling for multi-category and unknown inputs |
| DS-DEMO-OUTPUT.md | Live demo artifact: 3 messy real-format inputs (Seller Central row, supplier email, 3PL invoice line), the Claude prompt applied to them, 3 structured output tables (Inventory, Supplier Data, 3PL Activity) with Status columns, "what this enables" section linking to downstream products |
| DS-SALES-SCRIPT.md | 15-min Discovery/Demo/Offer call script: 4 blocks with exact spoken language, 4 discovery questions with listen-for signals, live demo instructions with screen-share steps, $300 setup + $49/mo offer with 3 objection responses |

---

## Key Decisions Made

1. **Six SC data categories** — covers the full Amazon FBA operator data surface: product identity (SKUs), stock state (Inventory), procurement (Orders), planning (Forecasts), sourcing (Supplier Data), and logistics costs (3PL Activity). All downstream EMS products consume from one or more of these.

2. **Illustrative demo data only** — no real Jumpzylla ASINs, supplier names, or actual invoice data used in DS-DEMO-OUTPUT.md. Threat model T-02-01-01 complied with. File header states "All data is illustrative."

3. **Status column: ✓ / ⚠ / ?** — three-state field status distinguishes between confirmed present (✓), confirmed missing (⚠), and ambiguous/needs clarification (?). This was chosen over binary present/missing because SC data is frequently ambiguous rather than absent.

4. **Peer-to-peer practitioner tone** — sales script positioned as a former Head of SC sharing a tool he built for his own problems, not a vendor pitch. Specific lines include "I built this because I was doing this exact thing manually myself for five years." Matches Artem's authentic background.

5. **Three objection responses in Offer block** — ROI math ("2 hours a week at $25/hr = $200/month"), send the demo output ("you've lost nothing"), and VA use case ("they use the tool instead of doing it manually"). Covers the most common Amazon brand owner hesitations without adding length to the main pitch.

---

## Reuse Notes for Downstream Plans

- **02-03-PLAN.md (Products 2–5 sales scripts):** The Discovery/Demo/Offer structure and the peer-to-peer tone from DS-SALES-SCRIPT.md are the template pattern. Each product's script should follow the same 4-block structure (Opening / Discovery 4 questions / Demo live / Offer $300+$49) but swap in product-specific discovery questions and demo artifacts.

- **02-02-PLAN.md and beyond (Exception Management, Demand Monitor, etc.):** DS-CONCEPT-DOC.md defines the 6 data categories that all downstream products consume. When writing Exception Management workflows, reference "Inventory" and "Orders" categories from that taxonomy. When writing 3PL Invoice Validation, reference "3PL Activity" category.

- **DS-CLAUDE-TEMPLATE.md prompt pattern:** The structure (context block → input instructions → processing rules → output format → edge cases) is the reusable pattern for all EMS Claude prompts. Products 2–5 prompts should follow this format.

---

## Deviations from Plan

None — plan executed exactly as written.

Both files in Task 1 and both files in Task 2 delivered to spec. All 6 data categories present with 4+ fields each. Demo has 3 input types and 3 output tables. Sales script has all 4 blocks with exact spoken lines.

---

## Self-Check: PASSED

Files verified to exist:
- FOUND: .planning/phases/02-products-2-5-validation/deliverables/DS-CONCEPT-DOC.md
- FOUND: .planning/phases/02-products-2-5-validation/deliverables/DS-CLAUDE-TEMPLATE.md
- FOUND: .planning/phases/02-products-2-5-validation/deliverables/DS-DEMO-OUTPUT.md
- FOUND: .planning/phases/02-products-2-5-validation/deliverables/DS-SALES-SCRIPT.md

Commits verified:
- d73dcdc — feat(02-01): add DS-CONCEPT-DOC and DS-CLAUDE-TEMPLATE for Product 0
- 714c6fd — feat(02-01): add DS-DEMO-OUTPUT and DS-SALES-SCRIPT for Product 0 launch

All 6 data categories present in DS-CONCEPT-DOC.md: SKUs, Inventory, Orders, Forecasts, Supplier Data, 3PL Activity.
DS-DEMO-OUTPUT.md illustrative data note confirmed present.
DS-SALES-SCRIPT.md all 4 blocks confirmed present with exact spoken lines.
No stub patterns found in any deliverable file.
