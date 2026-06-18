# Jello SC — Phase 0: Foundation & Audit

> **For agentic workers:** Use superpowers:executing-plans to run this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish full picture of what exists in Jello's supply chain — contracts, specs, inventory, team responsibilities, tech — and produce a master gap list + Phase 1 plan.

**Output artifacts:** 7 audit docs + master gap list + SC Journal (Notion) + stakeholder report + Phase 1 plan

**Duration:** 2 weeks (June 16–30, 2026)

**Context:** `jello-sc/PROJECT.md` has full company/vendor/team context. `plan-jello-sc-phase2-roadmap.md` is the strategic target state.

---

## Task 1: Fly Fulfillment Contract Audit

**Output:** `jello-sc/audit/fly-fulfillment.md`

- [ ] Request current signed FF contract from Clemens or admin
- [ ] Check against this list — mark each ✅ exists / ❌ missing / ⚠️ needs update:
  - Inbound SLA: D5 standard, D7 hard deadline
  - D7 penalty: €50/day for inbound exceeding 7 days
  - FIFO: oldest lot picked first (WMS configured)
  - Daily inventory export at 07:00 (CSV or API by SKU)
  - P&P rate per order
  - DHL DE rate per parcel
  - DHL AT rate per parcel
  - DHL CH DDP rate per parcel
  - Storage rate (€/pallet/month)
  - Returns: P&P + what happens to returned units (restock/destroy/QC)
  - Go-live date: June 22 written
  - Shopify integration: confirmed live
  - Peak capacity commitment (2× current ~1,200 orders/day)
- [ ] Write summary: what's covered, what's missing, what's at risk
- [ ] Save to `jello-sc/audit/fly-fulfillment.md`

---

## Task 2: Gebrüder Weiss Audit

**Output:** `jello-sc/audit/gebrüder-weiss.md`

- [ ] Collect from email/files: all GW quotes and correspondence
- [ ] Check against this list — mark ✅ / ❌ / ⚠️:
  - Current rate card: sea, air, rail (China → Germany, per CBM or per kg)
  - Chargeable weight rule for air (volumetric at 166 divisor confirmed?)
  - Does quote include customs clearance or billed separately?
  - Emergency air rate pre-agreed (<15K units, booking within 48h)
  - Import customs clearance coverage (IOR/EORI/HS codes/VAT)
  - Cargo insurance: included or separate?
  - Primary contact: name, email, phone (Shenzhen + Germany office)
  - Current open shipments: B1, B2, B3 — ETA confirmed in writing?
- [ ] Document each open shipment: mode, units per SKU, departure date, ETA Germany, ETA confirmed Y/N
- [ ] Save to `jello-sc/audit/gebrüder-weiss.md`

---

## Task 3: Factory Agreement Audit

**Output:** `jello-sc/audit/factory-agreement.md`

Do this for each active factory (Jello factory + Straw factory + Mixer factory separately if different).

- [ ] Does a written agreement exist for each factory? (✅ / ❌)
- [ ] For each factory, check — mark ✅ / ❌ / ⚠️:
  - Payment terms in writing: deposit % / pickup % / net X days
  - Net X days: counted from pickup or from 3PL delivery? (critical)
  - Cargo ready date SLA: what's the standard lead time in writing?
  - Delay penalty: any clause for late cargo ready?
  - Backup/escalation: what happens if they can't fulfill?
  - QC responsibility: who is responsible for defects found at 3PL?
  - Communication channel: WeChat (informal) vs email (formal) — documented?
  - Product specification: attached to agreement or separate?
  - GS (Golden Sample) reference: is it referenced in agreement?
- [ ] Note verbal agreements that aren't written — these are risks
- [ ] Save to `jello-sc/audit/factory-agreement.md`

---

## Task 4: Product Specifications Audit

**Output:** `jello-sc/audit/product-specs.md`

For each SKU (Jello, Straw, Mixer):

- [ ] Check what spec documents exist — mark ✅ / ❌ / ⚠️:

  **Jello powder (HS 2106.90):**
  - Exact composition with quantities (ingredients + amounts)
  - Physical parameters: pH, particle size, moisture %, dissolution time
  - Storage conditions + shelf life
  - EU food supplement compliance (Regulation EC 1925/2006)
  - Allergen declaration
  - CoA format (Certificate of Analysis — does factory know what to provide?)
  - Golden sample: where stored, reference number, date
  - Lab test results: what exists, where stored

  **Glass straw (HS 7017.90 — verify):**
  - Material: borosilicate confirmed?
  - Dimensions: length, diameter, wall thickness
  - Weight per unit
  - HS code: 7017.90 or 7010/3924 — confirm with customs broker
  - Golden sample: location, reference

  **Mixing stick (HS 8509.40 — verify):**
  - Material
  - Dimensions + weight
  - HS code: 8509.40 or 8510 — confirm with customs broker
  - Golden sample: location, reference

  **Packaging specs (each SKU):**
  - Inner packaging: material, dimensions, print file
  - Outer carton: dimensions, weight, units/carton, stacking limit
  - Pallet config: units/pallet, max weight
  - Barcode: EAN-13 active + validated?
  - EU importer address on label: correct?

- [ ] Save to `jello-sc/audit/product-specs.md`

---

## Task 5: Current Inventory Snapshot

**Output:** `jello-sc/audit/inventory-snapshot-2026-06-16.md`

- [ ] Request from FF: current available inventory by SKU (Jello, Straw, Mixer — units)
- [ ] Pull B1, B2, B3 pipeline from ClickUp (already extracted June 16):

  ```
  B1: Bulk inspection in progress (June 16) → freight next → Germany
  B2: Bulk inspection due June 20
  B3: Bulk inspection due June 30
  ```

- [ ] For each batch in transit, document:
  - Units per SKU (confirm with GW or Ziyao)
  - Freight mode (air/rail/sea)
  - Departure date (actual or planned)
  - ETA Germany (confirmed or estimated)
  - Status as of today

- [ ] Calculate Total System Stock:
  ```
  TOTAL = FF available + B1 units + B2 units + B3 units
  Days of coverage = TOTAL ÷ 2,031 (Jello daily demand)
  Reorder Point = 137 × 2,031 = 278,247 units
  ```

- [ ] Flag: is Total System above or below reorder point?
- [ ] Save to `jello-sc/audit/inventory-snapshot-2026-06-16.md`

---

## Task 6: Ziyao Luo Responsibilities

**Output:** `jello-sc/audit/team-responsibilities.md`

- [ ] List what Ziyao currently does (from ClickUp tasks + conversation with her):
  - Factory communication (WeChat, production updates)
  - Production tracking (progress at 0% / 50% / 100%)
  - Pre-shipment confirmation tasks (B1/B2/B3)
  - Bulk inspection coordination (SGS or internal?)
  - Document preparation (CI, PL, CoO)
  - Freight coordination with GW

- [ ] Define clean responsibility split (propose, confirm with Ziyao + Clemens):

  | Task | Ziyao (China) | Artem (SC Manager) |
  |---|---|---|
  | Factory WeChat daily contact | ✅ | — |
  | Production progress tracking | ✅ | — |
  | In-process QC (factory self-report) | ✅ | — |
  | Departure confirmation + tracking | ✅ | — |
  | PO placement decision | — | ✅ |
  | SGS PSI coordination | — | ✅ |
  | GW booking + freight | — | ✅ |
  | FF coordination | — | ✅ |
  | Finance calendar | — | ✅ |
  | Supplier scorecard | — | ✅ |
  | Supplier negotiations | — | ✅ |
  | CI + PL preparation | joint | — |

- [ ] Define communication protocol:
  - Frequency: daily WeChat standup? (proposed: daily update from Ziyao by 09:00 HK time)
  - Format: what information, what format
  - Escalation: what triggers immediate call vs daily update

- [ ] Save to `jello-sc/audit/team-responsibilities.md`

---

## Task 7: Tech Stack Audit

**Output:** `jello-sc/audit/tech-stack.md`

- [ ] Document every tool currently in use — mark ✅ active / ❌ not set up / ⚠️ partial:

  | Tool | Purpose | Status | Data it holds |
  |---|---|---|---|
  | Shopify | Orders, customer data | ✅ | Sales, SKU-level demand |
  | ClickUp | Project management | ✅ (just added) | PO tasks, B1/B2/B3 |
  | Notion | SC Journal | ⚠️ (13 pages, not operational) | Phase 2 roadmap only |
  | FF portal | 3PL inventory | ❓ | Daily inventory levels |
  | GW tracking | Shipment ETAs | ❓ | Transit status |
  | WeChat | Factory comms | ✅ | Informal only |
  | Email | Formal vendor comms | ✅ | GW, SGS, formal |
  | Milanote | Historical reference | ✅ | COGS, specs, demand data |

- [ ] Answer these questions:
  - Does Shopify export daily sales by SKU automatically anywhere?
  - Does FF send daily inventory export? (check contract)
  - Is there any existing SC reporting (daily/weekly)?
  - Is there a shared folder (Google Drive / Dropbox / Notion) with SC documents?
  - Are factory WhatsApp/WeChat chats backed up anywhere?
  - Where do CI + PL files live currently?

- [ ] List what's missing (data flows needed for Phase 3 agents):
  - Shopify → automated daily SKU pull
  - FF → daily inventory CSV at 07:00
  - GW → ETA email monitoring
  - Factory → formal email confirmation of milestones

- [ ] Save to `jello-sc/audit/tech-stack.md`

---

## Task 8: Master Gap Analysis

**Output:** `jello-sc/audit/gap-analysis-master.md`

Run after Tasks 1–7 are complete.

- [ ] Consolidate all ❌ and ⚠️ items from all 7 audits
- [ ] Categorize each gap:
  - **Type:** Contract / Specification / Process / Data / Tool
  - **Risk if unresolved:** High / Medium / Low
  - **Effort to fix:** Days / Weeks / Months

- [ ] Priority matrix format:

  | Gap | Type | Risk | Effort | Owner | Target |
  |---|---|---|---|---|---|
  | FF: no D7 penalty clause | Contract | High | Days | Artem | Jul 15 |
  | Jello: no written product spec | Specification | High | Weeks | Artem+Ziyao | Jul 31 |
  | No Total System model | Data | High | Weeks | Artem | Aug 1 |
  | ... | | | | | |

- [ ] Top 5 highest-risk gaps → go into Phase 1 plan immediately
- [ ] Save to `jello-sc/audit/gap-analysis-master.md`

---

## Task 9: SC Journal Setup in Notion

**Output:** Notion database live at existing Notion workspace

- [ ] Open Notion SC workspace (https://app.notion.com/p/380d4d2e245781cfbb73ca1830929701)
- [ ] Create database "SC Journal" with these properties:
  - Date (date)
  - Type (select): PO / Incident / Decision / Supplier / Forecast / Negotiation / Process / KPI
  - Product (select): Jello / Straw / Mixer / All
  - Entity (select): Factory / GW / FF / Internal / SGS
  - Status (select): Completed / Active / Planned
  - Summary (text, 1–3 sentences)
  - Outcome (text)
  - Impact (select): Low / Medium / High

- [ ] Create first 5 entries:
  1. Type=Decision | Phase 1 transition completed | Jun 30 | Impact=High
  2. Type=PO | B1 status (units, mode, ETA) | Active
  3. Type=PO | B2 status | Active
  4. Type=PO | B3 status | Active
  5. Type=Decision | Artem joins as SC Manager | Jun 16 | Impact=High

- [ ] Verify: database is shared with Clemens + Andrei view access

---

## Task 10: Phase 1 Plan Draft

**Output:** `docs/superpowers/plans/2026-07-01-jello-sc-phase1-infrastructure.md`

Run after Task 8 (gap analysis) is complete.

- [ ] Take top-risk gaps from gap-analysis-master.md
- [ ] Take July deliverables from `jello-sc/ROADMAP.md` Phase 1 section
- [ ] Write Phase 1 plan with same format as this document:
  - Tasks sorted by risk/dependency
  - Each task: output artifact, checklist steps, owner
  - Deadline for each task within July

---

## Task 11: Stakeholder Report

**Output:** `jello-sc/reports/2026-06-30-sc-state-report.md`

- [ ] Write 2-page report for Clemens + Andrei covering:

  **Section 1 — Current SC State (what we inherited)**
  - Vendor stack: who we work with, what's live
  - Inventory: current Total System, days of coverage
  - PO pipeline: B1/B2/B3 status and ETAs

  **Section 2 — Top 5 Risks Identified**
  List from gap-analysis-master.md, highest risk first. For each:
  - What the risk is
  - What happens if unresolved
  - What we're doing about it

  **Section 3 — 90-Day Plan (Phase 1)**
  - July: what gets done
  - August–September: what gets done
  - Decision needed from leadership (anything requiring CEO/CFO approval)

  **Section 4 — One Question for Leadership**
  - Is there any existing supplier agreement / factory contract that Artem hasn't seen yet?
  - Any financial constraints on Phase 1 spend (cargo insurance, SGS PSI, customs broker retainer)?

- [ ] Save to `jello-sc/reports/2026-06-30-sc-state-report.md`

---

## Checkpoint: Phase 0 Complete

All tasks done when:

- [ ] 7 audit documents saved in `jello-sc/audit/`
- [ ] `jello-sc/audit/gap-analysis-master.md` has full priority list
- [ ] SC Journal live in Notion with ≥5 entries
- [ ] Phase 1 plan draft saved
- [ ] Stakeholder report saved
- [ ] Report shared with Clemens + Andrei

**Next:** Execute Phase 1 using `docs/superpowers/plans/2026-07-01-jello-sc-phase1-infrastructure.md`
