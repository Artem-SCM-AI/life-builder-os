# Jello — SC Maturity Roadmap | Phase 2: Post-Transition

**Status:** Phase 1 transition closes June 30. This document is the supply chain architecture we build from day one after the handover. Nobody asked for this.

---

## Strategic Architecture

| Direction | What We Build | Outcome |
|---|---|---|
| Suppliers | Dual sourcing CN + EU all products + capacity tiers | One source down — system keeps running |
| Inventory | Total system trigger, 35-day model, growth scenarios | No frozen capital, no expired stock |
| Decisions | Auto-execute vs. approve framework | SC not dependent on one person |
| Forecasting | Marketing → SC pipeline, daily sensing | Demand change reflected in purchasing instantly |
| Quality | Multi-stage QC + SGS PSI + bilateral visibility | Defect caught before shipment, not after 102 days |
| Processes | SOP + triggers + template library | SC without manual decisions |
| Intelligence | Autonomous agents + SC chat + daily report | SC operates in real time |
| Memory | SC Journal + NotebookLM | Past, present, future — in one place |
| Continuity | BCP for 4 catastrophic scenarios | No single failure stops the business |
| Terms | Factory, forwarder, 3PL + currency hedge | Every contract cheaper and protected |

---

## §1. Supplier Development

### 1.1 Why Dual Sourcing

100% of volume with one factory is a systemic risk. One failure, one QC issue, one delay — the system stops for 95+ days at €24K daily revenue. As sales grow 50%+, concentration risk scales proportionally.

**Goal:** two qualified CN suppliers + EU for all products. Each backup covers 100% volume with 30 days notice. At significant growth — China ships containers at capacity, EU fills the delta.

---

### 1.2 China Backup — Process

**Search (July 1–20)**

RFQ package: 6–8 candidates via Alibaba Gold Supplier (3+ years, 100+ reviews), Global Sources, trade contacts. Request: price at 35K / 72K / 145K MOQ; ISO 22000, HACCP, EU food safety; payment terms; production lead time standard and rush; defect rate for 12 months.

**Golden Sample (August 1–25)**

Shortlist: 3 suppliers. Blind test vs. current product — pH, particle size, moisture, dissolution time. Confirmed samples stored: office + 3PL + QC lab. GS number stamped on all subsequent POs.

**Multi-Stage QC — mandatory for every PO**

Three control points instead of one:

| Stage | Who | Document | Timing |
|---|---|---|---|
| Raw materials | Factory (self-report) | Raw material CoA | Before production starts |
| 50% completion | Factory (self-report + photos) | In-process report | Day 15 of production |
| Pre-shipment | **SGS** (independent) | PSI report | 3–5 days before departure |

PSI by SGS — permanently for primary supplier, not just first 3 POs. For backup supplier — first 5 POs, then quarterly + one unannounced SGS audit per year. Written into supplier agreement.

If PSI fails — shipment stops. Escalation to factory within 4h. Resolution: rework + re-PSI, or activate backup supplier. Payments stop until resolved.

**Onboarding (September)**

NDA → contract → specification + GS → Pilot PO 10–20K → CoA → in-process → SGS PSI → shipment → QC at 3PL → decision. "Approved backup" status — only after full cycle with a real batch.

**Supplier Scorecard (monthly from October)**

| Metric | Weight | Target | Red Line |
|---|---|---|---|
| On-time production | 30% | ±3 days | >7 days |
| Quality (defect rate) | 30% | ≤0.5% | >2% |
| Price competitiveness | 20% | ±5% of benchmark | >10% above |
| Communication response | 10% | <24h | >48h |
| Document accuracy | 10% | 100% | Any error |

Below 70 — official warning. Below 60 two months in a row — replacement plan activated.

---

### 1.3 Production Reservation + Bilateral Forecast + Capacity Tiers

**What we provide (monthly, 1st of the month):**

6-month rolling forecast to supplier — structured document, not a table in an email:

| Month | Volume (units) | PO Value | Confidence | Driver |
|---|---|---|---|---|
| Month 1 (firm) | 72,500 | €78,300 | High ±5% | — |
| Month 2 (soft) | 72,500 | €78,300 | Medium ±15% | Campaign Q3 |
| Months 3–6 | TBD per forecast | TBD | Low ±25% | — |

Plus: **annual relationship value at current run rate** and **commercial consequences of non-performance.**

Positive in contract: "Cargo ready date met on time 6 months → negotiate deposit 30% → 20%."

Consequences in contract: "Delay cargo ready >7 days → next 2 POs go to backup supplier. >14 days without force majeure → official review and possible termination."

**What we receive from supplier (monthly):**

Mandatory capacity report as part of supplier agreement:
- Current production utilization (%)
- Available slots for Jello over next 90 days
- Key raw material stock levels
- Supply or capacity risks

Without this report we learn about problems when cargo ready date fails. With it — 60 days in advance.

**Capacity Tiers — pre-negotiated now:**

No calling every time to ask "can you do more" — we exercise an already-signed option:

| Tier | Volume / 35 days | Containers | Price/unit | Activation |
|---|---|---|---|---|
| Tier 1 (current) | 72,500 | 1 × 40'HC | €1.08 | Default |
| Tier 2 (+50%) | 108,750 | 1.5 × 40'HC | €1.05 | 30 days notice |
| Tier 3 (+100%) | 145,000 | 2 × 40'HC | €1.02 | 45 days notice |

Tier activated by written notice from SC Manager. Factory confirms within 48h or explains refusal. Refusal without valid reason = scorecard penalty.

---

### 1.4 Document & Template Library

All files live in one versioned repository. Format: v1.0, v1.1. Old version archived, not deleted.

- **Product Specifications (per SKU):** Name, SKU, HS code, exact composition with quantities, physical parameters (pH, particle size, moisture, dissolution time), storage conditions, shelf life, certification requirements, allergen declaration.
- **Packaging Specifications:** Inner packaging (material, dimensions, weld type, print files in Adobe AI/PDF), outer box (dimensions, weight, units per box, stacking, barcode position), pallet (configuration, max weight), labeling (batch number, expiry, EU importer address, country of origin), EAN-13 spec.
- **Golden Sample Checklist:** Sample receipt and condition, measurable criteria with acceptable ranges, comparison with previous GS, Pass/Conditional/Fail decision, signature and date, photo archive (minimum 6 photos: sample, packaging, labeling, texture), GS number and storage location.
- **SGS PSI Brief:** Factory address, specification reference, AQL 2.5 major / 4.0 minor, sample size per ANSI/ASQ Z1.4, inspection parameters, pass/fail criteria, report format requirements (photos + numbers + decision).
- **QC Checklist at 3PL (every batch):** 10% box sample, external condition, packaging integrity, labeling accuracy, count vs. packing list, comparison with GS, photos of deviations, Pass/Hold/Reject decision + signature.
- **Certification & Compliance:** EU food supplement checklist (Regulation EC 1925/2006), CoA requirements, HS code guide, ingredient declaration template, allergen declaration template.
- **Operational Templates:** Commercial Invoice, Packing List, Purchase Order (with embedded penalty clauses), Supplier Agreement, Golden Sample Certificate, Capacity Tier Activation Notice, Supplier Monthly Capacity Report template.

---

### 1.5 EU Manufacturing Track

**Economic model first — RFQ second.**

Before spending time sourcing EU manufacturers, answer three questions:
1. What is China factory's max capacity for our product? (from bilateral capacity report after production reservation agreement)
2. What is the sales growth trajectory? (from Marketing)
3. What is EU COGS? (from RFQ)

Then calculate the crossover:

```
EU units needed = projected_daily_demand - china_max_daily_capacity

COGS impact = EU_units_per_year × (EU_cogs - China_cogs)

Break-even: is the COGS premium justified?
  - Resilience value (≥ cost of one stockout)
  - Speed value: EU lead time 10–14d vs 92d = reduced working capital
  - Premium positioning: "Made in EU" on packaging
```

Only after this calculation — open the RFQ.

**Sourcing targets:**
- *Jello powder (2106.90):* Poland (most promising — EU food safety, lower COGS than DE, MOQ from 10K), Netherlands, Czech Republic. Vitafoods Europe (Geneva, May) — main EU supplement manufacturing exhibition.
- *Glass straws (7017.90):* Czech Republic (Bohemian glass, borosilicate, premium quality), Germany (Schott — maximum quality and price), Poland.
- *Mixing sticks (8509.40):* EU production expensive for this category. Priority — **Turkey** (EU customs union, 5–7 days transit, ~30–40% above China).

**China + EU model at growth:** China ships full containers at maximum capacity. EU fills the delta between China capacity and actual demand. EU simultaneously serves as 100% backup for any China disruption.

**Timeline (after economic modeling):**

| Action | Deadline |
|---|---|
| Bilateral capacity report from China factory | September 2026 |
| Economic model: China max / EU delta / COGS impact | October 2026 |
| EU RFQ launch (if model confirms need) | November 2026 |
| EU Golden Samples | January 2027 |
| Decision + pilot PO | Q2 2027 |
| EU as operational source | Q3 2027 |

---

## §2. Inventory Optimization — Total System Model

### 2.1 Concept

Inventory is not measured in the warehouse. It is measured across the entire system.

```
TOTAL SYSTEM STOCK =
  warehouse (available at 3PL)
+ inbound (3PL, not yet pickable)
+ in transit
+ at forwarder warehouse / loaded
+ PSI / awaiting inspection
+ in production at factory
```

If the trigger is tied to warehouse only — you're already 65+ days late.

---

### 2.2 Lead Time

| Stage | Now | After Production Reservation |
|---|---|---|
| Production | 30 days | 20 days |
| Transit (sea) | 65 days | 65 days |
| 3PL inbound | 7 days | 7 days |
| **Total lead time** | **102 days** | **92 days** |

---

### 2.3 Trigger and Math

**Target warehouse stock at new batch arrival:** 35 days = 71,085 Jello units

**Reorder Point:**

```
Total System Stock ≤ (102 + 35) × rolling_14d_avg_daily_demand
At current: 137 × 2,031 = 278,247 units
```

Dynamic trigger — mandatory. Demand growth automatically raises reorder point and accelerates next order.

---

### 2.4 Alert Levels (warehouse, daily)

| Level | Units | Days | Action |
|---|---|---|---|
| Normal | >71,085 | >35 | — |
| Watch | 56,742–71,085 | 28–35 | Check open PO status |
| Alert | 42,651–56,742 | 21–28 | Confirm ETA |
| Critical | 28,434–42,651 | 14–21 | Daily transit monitoring |
| Emergency | <28,434 | <14 | Air top-up. Calculate now. |

---

### 2.5 35-Day Cycle and Growth Scenarios

**Base (2,031/day):** 35 days × 2,031 = 72,500 units = 1 × 40'HC. 2–3 POs in system simultaneously.

**At growth — cycle stays 35 days, container size scales:**

| Scenario | Daily Demand | PO size / 35d | Containers | Reorder Point |
|---|---|---|---|---|
| Base | 2,031 | 72,500 | 1 × 40'HC | 278,247 |
| +50% | 3,046 | 106,610 | 2 × 40'HC | 417,302 |
| +100% | 4,062 | 142,170 | 2 × 40'HC | 556,494 |

At +50% and +100% — activate Tier 2 or Tier 3 capacity agreement. Pre-signed, activated by 30–45-day notice.

**Principle:** 35-day rhythm does not change. Volume changes. Operational process stays identical regardless of tier.

---

### 2.6 All Products Coordination

| Product | Daily Demand | 35-day PO | Reorder Point |
|---|---|---|---|
| Jello | 2,031 | 72,500 | 278,247 |
| Straw | 319 | 11,165 | 43,703 |
| Mixer | 68 | 2,380 | 9,316 |

Jello fills a full 40'HC. Straws + Mixers (5.51 CBM combined) — LCL or consolidated in one GW booking. When Straw and Mixer volumes grow — reassess separate container logistics.

---

### 2.7 FIFO Protocol

Every batch at 3PL receives a Lot Number: `JELLO-YYYYMMDD-XXX`. Fly Fulfillment WMS configured to pick from oldest lot first — written into the operating agreement as a technical requirement, not a request.

Expiry monitoring: alert 90 days before expiry on any lot with remaining stock. On alert: SC Manager + Marketing → decision: promotion / bundle / discount / disposal.

FIFO eliminates risk of expired product and is a mandatory EU food supplement compliance requirement.

---

### 2.8 Delay Resilience

| Delay | Stock at Arrival | After 7d Inbound | Result |
|---|---|---|---|
| 0 | 35 days | 28 days | ✅ Normal |
| 7 days | 28 days | 21 days | ✅ OK |
| 14 days | 21 days | 14 days | ✅ Tight, OK |
| 21 days | 14 days | 7 days | ⚠️ Air review |
| 28 days | 7 days | 0 | 🔴 Stockout without intervention |

35-day buffer + 2–3 POs in system simultaneously = any delay up to 35 days covered by adjacent PO.

---

### 2.9 Cash Impact and Finance Payment Calendar

| State | Total System | Capital Tied Up |
|---|---|---|
| First PO | ~300,000 units | €345,000 |
| Steady-state | ~278,247 units | €320,000 |
| After production reservation | ~257,937 units | **€297,000** |

**Finance Payment Calendar — auto-generated from PO schedule:**

SC generates 6-month payment calendar monthly and provides to Finance minimum 40 days before each transaction:

| Event | Amount | Date |
|---|---|---|
| Deposit PO#N (30%) | €11,800 | T+3 from placement |
| Pickup payment (20%) | €7,866 | Day cargo ready |
| Final payment (30%) | €11,800 | Net 40 from 3PL delivery |

With 10 POs/year — Finance always sees next 3–4 payment events in advance. No surprises.

---

## §3. Demand Forecasting & Purchase Plan Integration

### 3.1 Architecture

```
Marketing
  → Weekly forecast update (every Monday by 10:00)
  → Daily demand signal (Shopify → automated)
        ↓
  Forecast Change Detector (automated)
  → Delta calculation vs. prior week
  → Spike detection (daily)
        ↓
  SC Change Report (to SC chat automatically)
  → What changed, impact on Total System, recommended action
        ↓
  SC Manager — Review & Decision
        ↓
  Updated Purchase Plan → Supplier
```

---

### 3.2 Daily Demand Sensing

Daily Shopify snapshot — automated, no human involvement.

**Spike detection rules:**
- Any day exceeds +25% vs. rolling 14d average → immediate alert to SC + Marketing
- 3 consecutive days >+20% → forecast review next day (don't wait for Monday)
- 7 consecutive days >+15% → reorder point recalculated on new 14d average

Marketing doesn't need to predict every viral moment. The system must react within hours, not a week.

---

### 3.3 Automated Forecast Change Report

Every Monday after 10:00 the system compares new forecast vs. previous:

| Change | Action |
|---|---|
| <5% | Noise. Nothing. |
| 5–15% | SC report: review next PO size |
| 15–25% | SC report: consider air top-up + adjust 2 POs |
| >25% | Emergency review. SC Manager + leadership call. |

Report contains: what changed, current Total System, new projected days of coverage, gap (if any), recommended action.

---

### 3.4 Purchase Plan Adjustment Logic

**Demand increase:**
- 5–15%: increase next PO by delta. If increase <0.5 × 40'HC — add to next PO. If ≥0.5 × 40'HC — separate PO.
- 15–25%: air top-up calculation + increase next 2 POs + update supplier forecast. Check Capacity Tier activation.
- >25%: emergency protocol (§3.5) + assess Capacity Tier transition.

**Demand decrease:**
- -5–15%: reduce next PO. If remaining <0.5 × 40'HC — consider skipping one cycle.
- >-15%: assess inventory surplus. Options: delay next PO / promo activation / bundle push. Inform Marketing.

---

### 3.5 Emergency Stabilization Protocol

**Step 1 — Deficit calculation:**
```
deficit = (new_daily_demand × days_until_next_sea_available) - current_total_system_stock
```
If deficit > 0 → step 2.

**Step 2 — Air top-up:**
Volume: deficit + 10% buffer. GW contact within 24h — emergency air booking at pre-agreed rate. Simultaneously: notify factory of potential production slot.

**Step 3 — System update:**
After air shipment confirmed → update Total System. Verify: are open POs sufficient going forward?

**Step 4 — Cycle review:**
Cause: demand spike / delay / planning error? If systematic change — update 14d average, recalculate reorder point. Is higher Capacity Tier activation needed?

**Step 5 — Supplier update:**
Updated 6-month forecast with new numbers. If change >15% — discuss production acceleration. Log in SC Journal.

---

## §4. Auto-Execute vs. Approve Framework

### 4.1 Why

The entire plan cannot converge on one person. SC Manager sick, on vacation, overloaded on a crisis day — the system must not wait.

Apple distinguishes: what executes automatically, what requires human confirmation.

---

### 4.2 Auto-Execute — no human involvement

| Action | Condition | Who Is Notified |
|---|---|---|
| Draft PO to supplier | Total System ≤ reorder point | SC Manager + Finance (for confirmation) |
| Letter to SGS for PSI | Freight booking confirmed | SC Manager (FYI) |
| Email to GW for booking | PO confirmed by factory | SC Manager (FYI) |
| 3PL notification with ETA | Cargo departed | SC Manager (FYI) |
| Daily SC report | 08:00 daily | SC chat |
| Forecast delta report | Monday after 10:00 | SC chat |
| Spike alert | Demand >+25% vs 14d avg | SC chat + Marketing |
| Payment reminder | 3 days before any milestone | SC Manager + Finance |
| Expiry alert | 90 days to expiry with remaining stock | SC Manager + Marketing |
| FIFO lot assignment | Every receipt at 3PL | WMS automatically |

---

### 4.3 Require Approval — human decides

| Action | Approver | Deadline |
|---|---|---|
| Final PO placement | SC Manager | 24h from auto-draft |
| Emergency air top-up | SC Manager | 4h from alert |
| Capacity Tier activation | SC Manager + Finance | 30–45d notice to factory |
| Supplier change | SC Manager | After scorecard review |
| Any SOP deviation >15% | SC Manager | Immediately |
| BCP activation | SC Manager + CEO | Within 2h of trigger |

---

## §5. Process Documentation & Trigger System

### 5.1 Master SOP List

| SOP | Trigger |
|---|---|
| PO placement | Total System ≤ reorder point |
| Forecast submission to supplier | 1st of the month |
| Capacity report from supplier | 5th of the month |
| PSI request to SGS | Freight booked → PSI brief sent |
| Freight booking | PO confirmed |
| CI + PL preparation | 5 days before departure |
| 3PL notification | Cargo departed |
| QC + FIFO lot assignment | Goods available after inbound |
| Daily 3PL inbound status | During inbound window (days 1–7) |
| Shopify update | QC passed |
| Supplier payment | Invoice + milestone confirmed |
| Scorecard | 1st of the month |
| Demand review | Every Monday |
| SC Journal entry | After significant event or decision |
| Finance payment calendar update | 1st of the month |

---

### 5.2 Trigger Library

**Production:**
- Raw material CoA received → confirm spec compliance, give factory go-ahead
- Factory confirms cargo ready → GW booking within 24h
- PSI failed → stop shipment, escalate, stop payments
- Cargo departed → 3PL notification + ETA

**Inventory:**
- Total System ≤ reorder point → auto-draft PO
- Warehouse ≤ 21 days without confirmed transit → CRITICAL alert
- Lot expiry <90 days → alert Marketing + SC Manager
- Inbound day 4 without QC confirmation → alert + call to FF

**Forecasting:**
- Delta ≥ 5% → SC change report
- Delta ≥ 15% → air top-up calculation + draft adjustment
- Daily demand >+25% vs 14d avg → immediate alert
- 3 consecutive days >+20% → unscheduled forecast review

**Finance:**
- PO placed → deposit T+3
- Cargo pickup → second payment same day
- Delivery at 3PL → final payment net 40 from that date

---

### 5.3 Exception Handling

- Any delay >3 days at any stage → SC Manager, plan B
- QC failure → escalation within 4h, stop payments
- 3PL SLA breach → document, formal notice, penalty clause
- Supplier non-response >48h → parallel contact with backup supplier
- Forwarder SLA breach → document, compare with alternative forwarder

---

## §6. Automated Status Tracking — Gantt

### 6.1 PO Lifecycle Stages

```
ORDERED → CoA RECEIVED → PRODUCTION → IN-PROCESS QC → PSI SCHEDULED
→ PSI PASSED → FREIGHT BOOKED → DEPARTED → IN TRANSIT
→ ARRIVED → INBOUND D1 → INBOUND D3 → INBOUND D5
→ QC CHECK → AVAILABLE → DEPLETING → DEPLETED
```

### 6.2 3PL Inbound — Daily Status

FF provides daily status — required in operating contract:

| Day | Milestone | If Not Met |
|---|---|---|
| D1 | Received, count started | Alert if no confirmation |
| D3 | Count complete, QC in progress | Alert + call to FF |
| D5 | QC complete, available | Target — in contract |
| D7 | Hard deadline | €50/day penalty starts |

### 6.3 Gantt Trigger Map

| Stage | Automatic Action |
|---|---|
| PO placed | Milestone "CoA expected" (D+0), "cargo ready" (D+30) |
| CoA received | Spec compliance check. Go/No-go. |
| PSI scheduled | Letter to SGS + brief. Milestone "PSI result" (D+3) |
| PSI failed | STOP + alert. No subsequent actions without SC Manager |
| Departed | 3PL notification + ETA. Milestone "arrived" (D+65) |
| Arrived | Inbound timer starts. Daily status tracking. |
| Available | Update inventory. Close PO. Trigger demand review. |
| Total System ≤ reorder | Auto-draft next PO |

### 6.4 Tool

**Now:** Notion database — status property + date fields + Notion Automations.

**Q4 2026 (>3 people on team):** Monday.com or Airtable + Make.com with webhooks from 3PL and email parser for GW updates.

---

## §7. SC Intelligence Layer — Autonomous Agents

### 7.1 Architecture

```
DATA SOURCES
  Shopify → daily demand, inventory
  Fly Fulfillment → daily inventory export + inbound status
  GW → email ETAs + tracking milestones
  Supplier email → CoA, cargo ready, departure
  Finance calendar → payment milestones (from SC Journal)
        ↓
MONITORING AGENTS
  #1 Inventory Monitor → Total System + alert levels
  #2 PO Pipeline Monitor → status vs. plan + daily inbound
  #3 Transit Monitor → ETA parsing, delay detection
  #4 Supplier Comms Monitor → milestone confirmations
  #5 Forecast Change Detector → weekly delta + daily spike
  #6 Pattern Recognition → recurring risks (after 12 months of data)
        ↓
REPORT ASSEMBLER
  → Daily report 08:00
  → Instant alerts on critical trigger
        ↓
SC CHAT
  → Daily report + Instant alerts
  → Manual forward to general chat as needed
```

---

### 7.2 Data Sources & Integration

**Shopify:** API → daily pull: sold by SKU, rolling 14d average.

**Fly Fulfillment:** daily automated export at 07:00 (CSV or API). Written into contract: inventory levels by SKU + inbound status for all active shipments.

**GW:** email monitoring for keywords: "departed", "arrived", "ETA", "delay", "customs hold". Agent parses and updates PO status.

**Supplier:** WeChat — relationship and operational questions. Email — all formal milestone notifications. In contract: "CoA, cargo ready confirmation, departure notification and ETA updates sent to sc@jello.com within 24h of event. WeChat messages are not official confirmation."

**Finance calendar:** PO and payment milestones live in SC Journal (Notion). Agent reads and reminds 3 days in advance.

**Pattern Recognition (after 12 months):** weekly comparison of current week vs. same week last year. Recurring risk windows → proactive alert 3–4 weeks ahead. Example: "Last year GW transit extended by 8 days in weeks 28–32. Now week 26 — pre-position alert."

---

### 7.3 Daily SC Report Format

```
SC DAILY REPORT — 15 Jul 2026

━━━ INVENTORY ━━━
Jello:  48,231 units | 23.7d | [Watch]
Straw:   9,100 units | 28.5d | [OK]
Mixer:   2,200 units | 32.4d | [OK]
Total System: 241,500 | Reorder at 278,247

━━━ PO PIPELINE ━━━
PO#7: Production D+18/30 ✅ | CoA: received ✅
PO#6: Transit D+40/65 ✅ | ETA Aug 14 confirmed
PO#5: Inbound D+3 | QC in progress ✅ | Expected available Jul 18

━━━ FORECAST ━━━
No changes this week. Last update: Jul 14 ✅
14d avg demand: 2,031/day → baseline

━━━ ALERTS ━━━
[Watch] Jello: 23.7d. PO#5 arrives Jul 18 — OK.
[Action] GW: PO#6 departure not confirmed → follow up required TODAY.

━━━ ACTIONS TODAY ━━━
1. Call GW: PO#6 departure confirmation [SC Manager]
2. Monitor Jello: if <56,742 EOD → escalate [Auto-alert active]

━━━ PAYMENTS NEXT 14 DAYS ━━━
Jul 18: PO#7 pickup payment €7,866 [Finance]
Jul 28: PO#6 final payment €11,800 [Finance — net 40 from Jun 18]
```

Instant alerts arrive immediately on critical events — without waiting for morning report.

**Stack:** Make.com + Claude API (~€70–90/month). Make.com handles integrations (Shopify, email, Notion, Telegram). Claude API handles intelligence (parsing, analysis, report generation).

---

## §8. SC Journal — Institutional Memory

### 8.1 Concept

One place where all of SC lives: past, present, future. Not chat messages, not files on personal computers.

**Three horizons:**
- **Past:** all completed POs, incidents, decisions, QC results, negotiation outcomes
- **Present:** open POs, active risks, ongoing negotiations, open items
- **Future:** planned POs, forecast, planned negotiations, supplier pipeline

### 8.2 Entry Structure

| Field | Value |
|---|---|
| Date | Event date |
| Type | PO / Incident / Decision / Supplier / Forecast / Negotiation / Process / KPI |
| Product | Jello / Straw / Mixer / All |
| Entity | Supplier / GW / FF / Internal |
| Status | Completed / Active / Planned |
| Summary | 1–3 sentences: what, why, result |
| Outcome | Specific result or decision |
| Impact | Low / Medium / High |

Logging rule: entry after every significant event — PO, incident, decision, deviation from norm. Routine confirmations not logged.

### 8.3 Tool

**Notion** — operational journal (structured, queryable, real-time, team-shared).

**NotebookLM** — semantic search layer over accumulated history. Upload: quarterly SC reports, supplier reviews, key decisions, post-mortems. Use: "What issues have we had with GW over all time?" "Why did we choose the 35-day cycle?" "What was our negotiation position in January 2027?"

Notion = operations. NotebookLM = institutional memory. SC tool selection — to be decided later. Notion is the default.

---

## §9. Business Continuity Plan

Four catastrophic scenarios. For each: trigger → 24h actions → 7-day actions → communication.

---

**BCP-1: Primary Factory Down (>60 days)**

*Trigger:* fire, force majeure, factory announces inability to fulfill PO.

*24h:* activate backup CN supplier — Capacity Tier 1. Confirm they can take current PO. Calculate gap.

*7 days:* if backup CN cannot cover — EU track emergency activation. Air top-up from EU (10–14d lead time). In parallel: assess China alternatives.

*Communication:* Marketing knows supply constraint is possible. Prepare customer messaging if needed.

---

**BCP-2: Port / Transit Disruption (+14 days)**

*Trigger:* strike in Rotterdam/Hamburg, Red Sea closure, canal disruption.

*24h:* assess current Total System Stock. Calculate new projected stockout date. If gap >0 → air top-up decision.

*7 days:* alternate routing via GW (air, rail from China). Inform 3PL that arrival is delayed. Update all ETAs in system.

---

**BCP-3: Fly Fulfillment Failure**

*Trigger:* bankruptcy, system failure, inability to ship orders >48h.

*24h:* activate secondary 3PL (pre-qualified — Alaiko or Hive). Pause Shopify until new 3PL is ready. Inform GW where to redirect next shipment.

*7 days:* transfer inventory to new 3PL. Update Shopify routing. Assess impact on open orders.

---

**BCP-4: Forwarder (GW) Failure**

*Trigger:* GW cannot service shipment or rate spike >20%.

*24h:* activate alternative forwarder (pre-qualified — framework agreement signed in advance).

*7 days:* reprocess open bookings. Assess impact on ETAs.

---

BCP Review: tested once per year (tabletop exercise, not real drill). Each BCP updated after every real incident.

---

## §10. Term Optimization

### 10.1 Factory (January 2027)

| Term | Now | Target | Effect |
|---|---|---|---|
| Deposit | 50% (€23.5K) | 30% (€14.1K) | +€9.4K cash per PO |
| Net 40 start | From pickup | From 3PL delivery | +65 days float |
| Price (Tier 1) | €1.08/unit | €1.00/unit | -€5,800 per PO |
| Tier 2 price | — | €1.05/unit | Pre-agreed at +50% volume |
| Tier 3 price | — | €1.02/unit | Pre-agreed at +100% volume |
| Price lock | Spot | 12-month contract | Protection from fluctuations |

**Leverage:** two completed POs, on-time payments, two qualified alternatives. Factory knows you can leave.

### 10.2 Gebrüder Weiss (Q4 2026)

10–11 shipments/year = annual rate card. Target: -8–10% from current rate. Pre-agreed emergency air rate for top-up (<15K units), booking within 48h. Quarterly spot rate comparison with alternative forwarder — as leverage.

### 10.3 Alternative Forwarder — Pre-Qualification (Q3 2026)

Rhenus, DB Schenker or Kuehne+Nagel on China-Germany lane. Framework agreement with no volume commitment. Switch if: GW rate growth >15% vs. framework or any service failure.

### 10.4 Fly Fulfillment (October 2026)

Actual P&P vs. SLA — document. Penalty clause: €50/day for inbound >7 days. CH DDP clearance rate for 3 months — confirm before renewal.

### 10.5 Customs Broker

With 10–11 shipments: monthly retainer (~€400/month) vs. pay-per-entry (~€2,000+/year). Priority service, faster clearance.

### 10.6 Currency Hedge

Purchases in USD, revenue in EUR. 10% exchange rate movement = ±€58K/year. SC initiates conversation with Finance about forward contracts on USD for 6–12 month horizon. Finance executes, SC provides payment schedule.

---

## §11. Additional Optimizations

**Carton Engineering (August):** current Jello box — volumetric weight 10.78 kg > actual 7.0 kg. Redesign to ~38×32×32 cm → volumetric 6.49 kg < 7.0 kg → -35% on any air shipment. Cost: zero. Factory implements as standard tooling update.

**Returns Process (August):** 560 returns/month without process. Define: who pays shipping, what happens at 3PL (restock/destroy/QC), what triggers refund vs. replacement, how defects are tracked back to supplier.

**Cargo Insurance (July):** ~€125–210/shipment = all-risk coverage on €83K cargo. Not a decision — this is hygiene.

**Secondary 3PL (October):** Alaiko or Hive. Framework agreement with no commitment. 2–3 hours SC Manager time. Required for BCP-3.

---

## Master Timeline

| Initiative | Jul | Aug | Sep | Oct | Nov | Dec | Jan '27 |
|---|---|---|---|---|---|---|---|
| Cargo insurance | NOW | | | | | | |
| Finance payment calendar | NOW | | | | | | |
| SC Journal (Notion) launch | NOW | | | | | | |
| FIFO + 3PL daily inbound in contract | NOW | | | | | | |
| Template library — all documents | START | FINISH | | | | | |
| Total System model live | | NOW | | | | | |
| SOP documentation | START | FINISH | | | | | |
| Carton engineering brief | | NOW | | | | | |
| Returns process | | NOW | | | | | |
| Forecast pipeline (Marketing → SC) | | NOW | | | | | |
| Daily demand sensing live | | NOW | | | | | |
| CN Backup: RFQ + SGS engaged | NOW | | | | | | |
| CN Backup: Golden Samples + PSI | | NOW | | | | | |
| Production Reservation + Capacity Tiers | | | NOW | | | | |
| Bilateral forecast exchange | | | NOW | | | | |
| 6-month plan + stakes → supplier | | | NOW | | | | |
| CN Backup: Onboarding + Pilot PO | | | START | FINISH | | | |
| Alternative forwarder pre-qualified | | | NOW | | | | |
| Customs broker: retainer | | | NOW | | | | |
| NotebookLM setup | | | NOW | | | | |
| SC Intelligence agents (Make + Claude) | | | START | FINISH | | | |
| Auto-execute automation live | | | | NOW | | | |
| SC Chat live | | | | NOW | | | |
| BCP documents (all 4) | | | | NOW | | | |
| Secondary 3PL pre-qualified | | | | NOW | | | |
| EU economic model | | | | NOW | | | |
| Gantt automation | | | | | NOW | | |
| EU RFQ launch | | | | | NOW | | |
| GW annual rate card | | | | | START | FINISH | |
| FF SLA + penalty clause | | | | NOW | | | |
| Currency hedge (Finance) | | | | | NOW | | |
| Dual Sourcing CN live | | | | | | | ✅ |
| Factory terms renegotiation | | | | | | | NOW |

---

## Open Decisions

| Decision | Recommendation | Deadline |
|---|---|---|
| SC Chat platform | Telegram (simple API, free) | Jul 15 |
| SC operational tool | To be decided. Notion is default. | TBD |
| Automation stack | Make.com + Claude API | Aug 1 |
| Production reservation: commitment range | ±15% | September |
| Pilot PO split | 90/10 → 70/30 at full dual sourcing | October |
| EU scope | All products. Turkey priority for Mixers. | November |
| EU RFQ timing | After economic model (October) | November |
| BCP test frequency | Once per year, tabletop exercise | Q1 2027 |
