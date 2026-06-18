# Jello SC

## Project
- Company: Accommerce GmbH, Jello brand, DACH market, ~€1.3M net/month
- Role: Artem = SC Manager (started June 16, 2026)
- Key files: `PROJECT.md` (full context), `ROADMAP.md` (5-phase plan), `audit/` (Phase 0 output)

## Current Phase: Phase 0 — Audit & Foundation
Status: IN PROGRESS (started June 16)
- ClickUp: 129 audit tasks deployed, 5-dimension tags applied (130/130)
- SSoT: 28 vendor/supplier records, Phase 0 Audit list + SSoT list in ClickUp
- Forecast model: Clemens/Andrei Google Sheets 360-day model — need edit access from Clemens
- B1 stockout: Jun 16–28, air shipment arrives Jun 28
- Scale target: 4.5x in Oct → Jello demand ~2,100/day

## ClickUp
- Workspace: 90151316962
- Space "Supply Chain": 901510747838
- Phase 0 Audit list: 901523941835
- SSoT list: 901523950214
- Token: `$CLICKUP_TOKEN` env var (set in ~/.zshenv — never hardcode)

## Master Carton Specs (confirmed 2026-06-18)
- Jello: 120 units/CTN, 0.0816 CBM, 11.85 kg gross
- Mixer (CL-2900): 300 units/CTN, 0.0968 CBM, 21.0 kg gross (48×48×42 cm)
- Straws: 100 units/CTN, 0.0425 CBM, 8.9 kg gross
- 40HQ capacity: Jello ~103k units (volume-limited), 76 CBM / 26,500 kg payload
- Container A (Jello only): 100k units = ~68 CBM = 1×40HQ
- Container B (mixed): 100k Jello + 3.5k Mixer + 20k Straw = ~71 CBM = 1×40HQ
- **RULE: Orders placed independently per product. Container type (A or B) decided by timing alignment — not forced to bundle.**
- If Jello and accessories reorder points align → Container B. If not → Container A + LCL for accessories.

## Shipping & Order Strategy (confirmed 2026-06-18)
- Air shipping: REMOVED completely
- Train: fast buffer (3-4 weeks China→Germany)
- Sea: base bulk (5-6 weeks)
- FF gap rule: FF accepts orders without stock, creates labels, holds until shipment arrives
- Order strategy: 100k×3 preferred over 300k single order (cashflow + 1×40HQ per shipment)
- Unit cost PO1: $1.25 EXW USD (Lvmengkang, 300k reference)

## Active Blockers
- Forecast model: waiting on Clemens for Google Sheets edit access
- 3PL Amendment letter: waiting on Malcolm confirmation → send to Mutual Trade Union Co. (Yiwu)
- FF Anlage 1 ✅ received 18.06 — analyzed, key risk: ADSp storage liability cap €70K/year, no goods insurance yet
- Cashflow model: need Tab 6 shipping costs (sea/train per unit) from price comparison sheet

## Team
- Clemens Severin Büder (CEO), Andrei Oboukhov (co-founder)
- Malcolm (Fly Fulfillment contact)
- Raj (Fly Fulfillment, Anlage 1)
- Ziyao Luo (China-based, factory side)

## Key Vendors
- 3PL: Fly Fulfillment (Germany) — FF contract signed Jun 15; Anlage 1 missing
- Forwarder: Gebrüder Weiss
- Expeditors (customs/payment): pay duty at customs DE, deferred payment approved
- 3PL China: Mutual Trade Union Co., Yiwu (high-risk contract — amendment pending)
