# Jello SC — Project Context

## Company
**Accommerce** — DTC supplements brand, DACH market  
Brand: **Jello** (drink supplement powders + accessories)

## Products & Demand

Baseline from Forecast Model (Google Sheets, May 2026):

| SKU | Unit | Daily demand (baseline) | Scale target (Oct) |
|---|---|---|---|
| Jello powder | 100g sachet | 2,100 | ~8,748 (4.5x) |
| Glass straw | pc | 400 | ~1,418 (4.5x) |
| Mixing stick | pc | 75 | ~405 (4.5x) |

Planned scale events: 3.5x ~Sep 20, 4.5x ~Oct 16 (marketing-driven).
Note: earlier estimate of 2,031/day Jello was pre-model baseline — use 2,100 going forward.

## Markets

| Market | Orders/month | Net revenue | Share |
|---|---|---|---|
| Germany | 14,675 | €984K | 76% |
| Switzerland | 2,540 | €202K | 16% |
| Austria | 1,465 | €108K | 8% |
| **Total DACH** | **18,680** | **€1.29M** | |

BOGO model: customer pays 1× list, receives 2× product. Return rate: 3%.

## Team

| Person | Role | Location |
|---|---|---|
| Artem Stepanenko | SC Manager | — |
| Ziyao Luo | China Ops | China (Shenzhen) |
| Clemens Severin Büder | CEO / Founder | — |
| Andrei Oboukhov | Co-founder | — |

**Responsibility split:**
- Ziyao: factory WeChat, production tracking, in-process QC, departure confirmation
- Artem: PO decisions, SGS PSI, GW, FF, finance calendar, reporting, strategy

## Vendor Stack

| Vendor | Role | Status |
|---|---|---|
| Fly Fulfillment | 3PL Germany | Live since ~June 22 |
| Gebrüder Weiss | Freight forwarder (CN→DE) | Active |
| Factory (Jello) | China manufacturer | Active |
| Factory (Straw + Mixer) | China manufacturer | Active |
| SGS | Third-party inspector | Not contracted yet |

## Key Economics

- Jello COGS (sea): €1.15/unit (factory €1.08 + freight €0.07)
- Revenue per order (1+1 bundle): €39.99
- Gross contribution per order: ~€31.77 (79.4%)
- Annual savings vs Procware: ~€500K

## SC State as of June 16, 2026

- Phase 1 transition (Procware → own SC) complete as of June 30
- FF live but contracts not fully documented
- No SOPs, no SOP library, no QC specs, no FIFO protocol in contract
- No Total System inventory model
- Forecast model EXISTS in Google Sheets (owner: Clemens/Andrei) — 360-day rolling, tracks stock/arrivals/scale events. Not yet integrated into SC workflow.
- No automation
- ClickUp space "Supply Chain" set up, all tasks currently on Ziyao Luo
- Notion: 13-page SC Phase 2 roadmap exists (from June 15 session)

## Reference Files

- `plan-jello-sc-transition.md` — Phase 1 transition plan (executed)
- `plan-jello-sc-phase2-roadmap.md` — Phase 2 strategic roadmap (the build plan)
- ClickUp workspace: Accommerce / Space: Supply Chain
- Notion: https://app.notion.com/p/380d4d2e245781cfbb73ca1830929701
