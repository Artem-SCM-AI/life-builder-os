# Forecast Model — Snapshot & Analysis

**Source:** Google Sheets "Inventory_Forecast_360d — Forecast DE+AT" (Clemens/Andrei)  
**Captured:** June 17, 2026  
**Coverage:** May 15, 2026 – May 9, 2027 (360 days)

---

## Starting Values (May 15, 2026)

| SKU | Starting Stock |
|---|---|
| Jello | 18,319 |
| Mixer | **-1,200** (already negative!) |
| Straws | 2,984 |

## Baseline Daily Demand

| SKU | Units/day | Post-purchase note |
|---|---|---|
| Jello | 2,100 | 2,200 after post-purchase upsell |
| Straw | 400 | — |
| Mixer | 75 | — |

> Previous PROJECT.md used 2,031/day Jello — corrected to 2,100.

---

## Planned PO Schedule

| PO | Jello | Mixer | Straw | Ship Mode | Production Ready |
|---|---|---|---|---|---|
| PO1 (done) | 50,000 | — | — | Air | Done |
| PO1.1 | 48,000 | — | — | Air | Done |
| PO1.2 | 192,000 | — | — | Train/Sea | Done |
| PO2 | incl. | incl. | incl. | Train+Sea | Jun 21 |
| PO3 | 300,000 | 12,000 | 70,000 | Train+Sea | Aug 4 → arrives Oct 15–Nov 5 |
| PO4 | 360,000 | 16,500 | 44,000 | Train+Sea | Sep 9 → arrives Nov 18–Dec 8 |

Total on order: Jello ~290k+ | Mixer 14,340 | Straw 43,700

---

## Marketing Scale Events

| Date | Scale factor | Jello/day | Straw/day | Mixer/day |
|---|---|---|---|---|
| May 15 – Sep 19 | 1x | 2,100 | 400 | 75 |
| Sep 20 | **3.5x** | 6,804 | 1,103 | 315 |
| Oct 16 | **4.5x** | 8,748 | 1,418 | 405 |

> Scale events are marketing-driven. Model has them hardcoded — no formal handoff process to SC yet.

---

## Current State (June 17 = Day 34)

**STOCKOUT in progress:**
- Jello: -1,944 (FF warehouse depleted)
- Mixer: -90
- Straws: -315

**Root cause:** June 16 — China stock deducted from model ("Can't Ship from China anymore"). FF warehouse went to zero.

**Resolution:** B1 Air freight arrives **June 28** (Day 45): +50,000 Jello / +4,450 Mixer / +11,600 Straws.  
→ 11 days of negative stock. Orders being fulfilled from remaining physical stock or backlogged.

---

## Upcoming Key Dates

| Date | Event |
|---|---|
| Jun 28 | Air 1.0 arrives: 50k Jello + 4,450 Mixer + 11,600 Straw |
| Jul 4 | Air 2.0 arrives: 31k Jello + 300 Mixer + 1,500 Straw |
| Jul 30 | Train 2.0 arrives: 17k Jello + 1,500 Mixer + 8k Straw |
| Aug 9 | Train 3.0 arrives: 152k Jello + 5,500 Mixer + 21k Straw |
| Aug 29–30 | Sea 3.0 + PO2 Train arrive |
| Oct 15 | PO3 Train arrives: 100k Jello + 6k Mixer + 30k Straw |
| Nov 5 | PO3 Sea arrives: 200k Jello + 6k Mixer + 40k Straw |
| Nov 18 | PO4 Train arrives: 160k Jello + 10k Mixer + 6k Straw |
| Dec 8 | PO4 Sea arrives: 200k Jello + 6.5k Mixer + 38k Straw |

---

## Gaps Identified

1. **No SC ownership** — model lives with Clemens/Andrei, not with SC
2. **No Shopify validation** — demand numbers not verified against actual sales
3. **No alert triggers** — model doesn't flag when stock drops below reorder point
4. **Scale events not formally communicated** — Marketing bakes them into sheet, SC doesn't get advance notice
5. **Mixer structurally short** — was already -1,200 on Day 1; needs dedicated PO or supplier conversation

---

## Phase 1 Actions

- [ ] Get edit access to Google Sheets model
- [ ] Clarify owner: who updates it, on what cadence?
- [ ] Validate demand numbers vs Shopify actuals (last 30 days)
- [ ] Define SC ownership: Artem updates inbound columns going forward

## Phase 2 Actions

- [ ] Connect Shopify daily pull → auto-update demand column
- [ ] Add reorder point alert row (highlight when stock < 14-day cover)
- [ ] Formalize Marketing → SC scale event notification (Weekly Forecast Brief)
