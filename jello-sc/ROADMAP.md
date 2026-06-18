# Jello SC — 1-Year Build Roadmap

**Mission:** Build a supply chain that runs on data, numbers, documented processes, and autonomous systems — not on individual memory or manual decisions.

**Timeline:** June 16, 2026 → January 2027

---

## Phase Overview

| Phase | Period | Theme | Key Deliverable |
|---|---|---|---|
| **Phase 0** | Jun 16–30 | Foundation & Audit | Master gap list + stakeholder report |
| **Phase 1** | July | Infrastructure | Cargo insurance, payment calendar, FIFO, template library, CN backup RFQ |
| **Phase 2** | Aug–Sep | Systems | Total System model, SOPs, forecasting pipeline, CN backup onboarded |
| **Phase 3** | Oct–Nov | Intelligence | SC agents live, BCP, secondary 3PL, EU economic model |
| **Phase 4** | Dec–Jan 27 | Optimization | Dual sourcing CN live, factory renegotiation, GW annual rate card |

---

## Phase 0 — Foundation & Audit (June 16–30)

**Goal:** Know exactly what exists, what's missing, and what's at risk.

### Week 1 (Jun 16–23): Audit
- [ ] Fly Fulfillment contract: what's signed vs what was agreed
- [ ] Gebrüder Weiss: rate card, contacts, open shipment ETAs
- [ ] Factory agreement: written terms vs verbal, payment schedule
- [ ] Product specs: Jello, Straw, Mixer — what's documented
- [ ] Current inventory snapshot: FF warehouse + in transit (B1/B2/B3)
- [ ] Ziyao Luo: map current responsibilities → define clean split
- [ ] Tech stack: what tools exist, what data flows, what's missing

### Week 2 (Jun 24–30): Gap Analysis + Planning
- [ ] Master gap list: contracts, docs, specs, data (prioritized by risk)
- [ ] SC Journal: set up Notion database (§8 structure)
- [ ] Phase 1 plan: July deliverables based on gap findings
- [ ] Stakeholder report: SC state + risks + 90-day plan → Clemens + Andrei

**Plan:** `docs/superpowers/plans/2026-06-16-jello-sc-phase0-foundation.md`

---

## Phase 1 — Infrastructure (July 2026)

**Goal:** Fill the critical gaps. SC runs without single points of failure on paper.

- Cargo insurance (€125–210/shipment, all-risk)
- Finance payment calendar (6-month rolling, SC → Finance)
- FIFO protocol in FF contract + WMS configuration
- FF daily inventory export at 07:00 in contract
- D7 inbound SLA + €50/day penalty in FF contract
- Template library: CI, PL, PO, PSI Brief, GS Checklist, QC Checklist (all 7)
- CN Backup: RFQ to 6–8 Alibaba Gold Supplier factories
- Total System model: first live calculation
- Forecast model integration: get edit access to existing Google Sheets 360-day model (Clemens/Andrei), align PO decisions with it, define ownership going forward
- Shopify → Forecast sync: validate that model demand numbers match Shopify actuals weekly

**Plan:** written at end of Phase 0 based on audit findings.

---

## Phase 2 — Systems (August–September 2026)

**Goal:** SC decisions driven by data, not memory.

- Total System model live (Shopify + FF daily pull)
- SOP documentation: all 15 triggers from roadmap §5
- Carton engineering brief to factory (−35% on air freight)
- Returns process defined
- Forecast pipeline: Marketing → SC (weekly + daily Shopify pull)
- Daily demand sensing + spike detection live
- CN Backup: 3 golden samples + PSI, pilot PO decision
- Production reservation agreement + bilateral forecast exchange
- Alternative forwarder pre-qualified (Rhenus / DB Schenker)
- Customs broker retainer (~€400/month)
- NotebookLM: SC institutional memory setup

---

## Phase 3 — Intelligence (October–November 2026)

**Goal:** SC operates without manual monitoring.

- SC intelligence agents live (Make.com + Claude API, ~€80/month)
  - Inventory monitor, PO pipeline monitor, transit monitor
  - Supplier comms monitor, forecast change detector
- Daily SC report at 08:00 → SC Telegram chat
- Auto-execute framework live (§4 of roadmap)
- SC Chat (Telegram) operational
- BCP documents: all 4 scenarios (factory down, transit, FF failure, GW failure)
- Secondary 3PL pre-qualified: Alaiko or Hive (framework agreement)
- EU economic model: China max capacity vs EU delta vs COGS impact
- FF SLA review + penalty clause enforcement
- Currency hedge: conversation with Finance on USD forward contracts

---

## Phase 4 — Optimization (December 2026–January 2027)

**Goal:** SC operating at full maturity. Terms optimized. Dual sourcing live.

- Gantt automation: Notion automations → Monday.com/Airtable assessment
- EU RFQ launch (if economic model confirms need)
- GW annual rate card: −8–10% from current, emergency air pre-agreed
- Dual sourcing CN: backup supplier "Approved backup" status
- Factory terms renegotiation: deposit 30% (from 50%), net60, €1.00/unit
- Pattern recognition: first 6-month data → recurring risk calendar

---

## Success Metrics

| Metric | Baseline | Target (Jan 2027) |
|---|---|---|
| Total System visibility | Manual | Daily automated |
| Stockout days/year | Unknown | 0 |
| PO cycle documentation | 0% | 100% SOPs |
| Supplier alternatives | 0 | 2 qualified CN + 1 EU track |
| Contract coverage | ~40% | 100% |
| SC report frequency | Ad hoc | Daily automated |
| Finance visibility | Reactive | 40-day advance calendar |
