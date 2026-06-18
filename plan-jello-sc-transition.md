# Jello — Supply Chain Transition Plan
**Scenario date: June 3, 2026 | Role: Head of Supply Chain**

---

## Executive Summary

Jello operates entirely through Procware — a single middleman who sources, holds inventory, and ships direct from China to EU customers. On July 1, 2026 the EU introduces a flat €3 customs duty per product category on every non-EU direct parcel. This makes the current model commercially unviable overnight.

The goal: build an independent supply chain — direct factory relationships, own freight forwarding, and a German 3PL — that reliably serves DE, AT, and CH without interruption through the switch.

The PO is already placed (May 10). Air freight arrives around June 22, exactly when China stock depletes. The transition window is tight but executable. Every action this week is operational.

**Five actions required immediately:**
1. Contract Fly Fulfillment by June 4 — written go-live confirmation for June 22
2. Confirm Gebrüder Weiss air freight space for June 10–15 cargo
3. Get written confirmation from Procware: fulfill through June 30, hard stop
4. Increase rail allocation by 12,000 Jello units to cover mode-transition gaps
5. Shopify order routing switch tested and live by June 20

---

## Decision Table

| Area | Decision | Rationale |
|---|---|---|
| 3PL Germany | **Fly Fulfillment** | Germany-based, Shopify-native, DTC supplement experience, fastest onboarding |
| Procware 3PL | **Do not use** | Conflict of interest once sourcing ends; no leverage if dispute arises |
| DE routing | German 3PL → DHL Paket | Standard, 1–3 days, no complexity |
| AT routing | Same German 3PL → DHL International | EU country, no customs, minor shipping delta |
| CH routing | **DDP from German 3PL via DHL** | Non-EU; DDU creates customer experience issues; CH node not justified yet |
| CH node trigger | >150 CH orders/day for 3 months | Below that, DDP from Germany is operationally optimal |
| Freight forwarder | **Gebrüder Weiss** (Shenzhen) | Quotes received, tier-1 forwarder with DACH capability |
| China cutoff | **June 30 — hard stop** | €3 rule kicks in July 1; no scenario where continuing makes sense |
| Rail adjustment | **+12,000 Jello to rail allocation** | Eliminates two 2-day stockout windows in July and August |
| Next PO | **Sea only, place July 15** | 30d production + 30d sea = October arrival; steady-state cycle |

---

## 1. Context & Constraints

### Why we are leaving Procware
- **Reliability:** unreliable delivery and production scheduling
- **Quality:** products do not meet Jello's standards
- **Margin:** Procware charges a 58–194% markup over factory price across all three products
- **Independence:** zero supply chain visibility and no redundancy

### The €3 Rule — the hard deadline

From July 1, 2026, the EU abolishes the €150 de minimis customs exemption on direct non-EU parcels.

Replacement: **€3 flat duty per HS tariff category per parcel** entering the EU from a non-EU country.

| Bundle sent direct from China | Categories | Added duty per order | Monthly cost at March volume |
|---|---|---|---|
| 1+1 (Jello only) | 1 | +€3.00 | €26,415 (8,805 orders × €3) |
| 2+2 (Jello + Straw) | 2 | +€6.00 | ~€44,166 |
| 3+3 / 4+4 (all products) | 3 | +€9.00 | ~€15,939 |
| **Blended total** | **~1.8 avg** | **~€5.40 avg** | **~€100,000–112,000/month** |

From ~November 2026: additional €2 handling fee per declaration line → up to €5/category → costs worsen further.

**Conclusion:** continuing China-direct fulfillment past June 30 adds €1.2M+ per year in customs costs. Non-negotiable exit.

---

## 2. Demand & Inventory Analysis

### March 2026 actuals — units consumed per day

| Product | Monthly units | Daily rate (÷31) |
|---|---|---|
| Jello | 62,968 | **2,031** |
| Straw | 9,883 | **319** |
| Mixer | 2,109 | **68** |

*Source: Sales by Product report, Clemens March 2026*

### March 2026 actuals — revenue by market

| Market | Orders | Gross revenue | Discounts (BOGO) | Returns | Net revenue |
|---|---|---|---|---|---|
| Germany | 14,675 | €2,003,342 | −€1,001,776 | −€17,245 | **€984,322** |
| Switzerland | 2,540 | €407,268 | −€202,722 | −€2,108 | **€202,438** |
| Austria | 1,465 | €219,530 | −€110,213 | −€1,351 | **€107,966** |
| **Total DACH** | **18,680** | **€2,630,141** | **−€1,314,711** | **−€20,704** | **€1,294,726** |

*Note: Discounts ≈ 50% confirms BOGO model — customers pay 1× list price, receive 2× product*

### Return rate: 3% (confirmed on board)

### Stock as of June 3, 2026

| Location | Jello | Straw | Mixer | Days of Jello cover |
|---|---|---|---|---|
| Germany 3PL (Procware) | **0** | **0** | **0** | **0** |
| China 3PL (Procware) | **42,131** | **6,104** | **1,451** | **20.7 days** |

**China stock depletion date:** 42,131 ÷ 2,031 = 20.7 days → **June 23–24**

---

## 3. Shipment Plan — PO Placed May 10

### Product & carton specifications (from RFQ)

| Product | Total PO qty | Unit weight | Carton size (cm) | Units/carton | CBM/carton | Gross kg/carton |
|---|---|---|---|---|---|---|
| Jello powder | 300,000 | 0.100 kg | 55 × 28 × 42 | 70 | 0.06468 | 7.0 kg |
| Glass straws | 45,000 | 0.090 kg | 43 × 26 × 38 | 100 | 0.04248 | 9.0 kg |
| Mixing sticks | 15,000 | 0.120 kg | 48 × 48 × 42 | 300 | 0.09677 | 22.0 kg |

*Note: Jello and straw gross kg/carton are estimated from product net weight only. Final carton gross weight pending.*

### Planned shipment split (as submitted to Gebrüder Weiss)

| Mode | Jello | Straw | Mixer | Cartons | Gross kg | CBM | Est. pallets | Target arrival |
|---|---|---|---|---|---|---|---|---|
| Air | 56,630 | 9,000 | 2,100 | 906 | 6,627 kg | 56.83 | 74 | **~June 22** |
| Truck/Rail | 42,490 | 6,800 | 1,500 | 680 | 4,971 kg | 42.63 | 55 | **~July 22** |
| Sea | 200,900 | 29,200 | 11,400 | 3,200 | 23,554 kg | 201.71 | 260 | **~Aug 14** |
| **Total** | **300,020** | **45,000** | **15,000** | **4,786** | **35,152 kg** | **301.17** | **389** | |

*Cargo ready: June 10–15. PO confirmed with factory.*

### Stock coverage analysis — with 3PL inbound processing time

**Critical factor not previously accounted for:** when freight arrives at the German 3PL, the warehouse requires **3–5 business days** to receive, count, inspect, and make inventory available for picking. Transit arrival date ≠ stock available date.

Using **+4 days inbound processing** (midpoint):

| Mode | Transit arrives | + Inbound (4d) | Stock available | Daily demand | Depletes |
|---|---|---|---|---|---|
| China (Procware) | ongoing | 0 (already at 3PL) | Now | 2,031 | **June 23** |
| Air | June 22 | +4 days | **June 26** | 2,031 | **July 24** |
| Rail/Truck | July 22 | +4 days | **July 26** | 2,031 | **Aug 12** |
| Sea | Aug 14 | +4 days | **Aug 18** | 2,031 | **Nov 12** |

*Air depletion: 56,630 ÷ 2,031 = 27.9 days from June 26 = July 24*
*Rail depletion: 42,490 ÷ 2,031 = 20.9 days from July 26 = Aug 12*
*Sea depletion: 200,900 ÷ 2,031 = 98.9 days from Aug 18 = Nov 25*

**Three gaps identified (all new vs. prior analysis):**

| Gap | Window | Duration | Units short | Severity |
|---|---|---|---|---|
| **Gap 1** | June 23 → June 26 | **3 days** | **6,093 units** | 🔴 Critical |
| **Gap 2** | July 24 → July 26 | **2 days** | **4,062 units** | 🟠 High |
| **Gap 3** | Aug 12 → Aug 18 | **6 days** | **12,186 units** | 🟠 High |

*Gap 3 is now 6 days because inbound delays rail availability to July 26 and sea availability to Aug 18.*

### Recommended allocation adjustment

Move units from sea to air and rail to cover all three gaps:

| Mode | RFQ original | Revised | Change | Rationale |
|---|---|---|---|---|
| Air | 56,630 | **68,630** | **+12,000** | Covers Gap 2 (July 24–26) + buffer |
| Rail/Truck | 42,490 | **54,490** | **+12,000** | Covers Gap 3 (Aug 12–18) + buffer |
| Sea | 200,900 | **176,900** | **−24,000** | Bulk steady-state, still 87 days cover |
| **Total** | **300,020** | **300,020** | **0** | PO quantity unchanged |

**Revised coverage with adjusted allocation:**

| Mode | Available | Units | Covers until |
|---|---|---|---|
| China | Now | 42,131 | June 23 |
| Air (+12k) | June 26 | **68,630** | **July 30** (33.8 days) |
| Rail (+12k) | July 26 | **54,490** | **Aug 22** (26.8 days) |
| Sea (−24k) | Aug 18 | **176,900** | **Nov 12** (87 days) |

Gaps 2 and 3 closed ✓ — air covers to July 30 (rail available July 26, 4-day overlap), rail covers to Aug 22 (sea available Aug 18, 4-day overlap).

**Gap 1 (June 23–26) requires a separate fix — adding air units does NOT help because they all arrive June 22 regardless of quantity. The problem is inbound processing time, not volume.**

Gap 1 mitigation options (choose one or combine):

| Option | How | Cost |
|---|---|---|
| **A — Expedited inbound SLA** | Contract Fly Fulfillment for 24–48h priority receiving on first air shipment. Commit to pre-notifying with full packing list so they can staff and receive immediately. | Included in setup or small premium |
| **B — Extend Procware China by 3 days** | Procware China continues fulfilling June 23–25 (3 days, ~6,093 units from remaining stock). Hard stop June 26, not June 30. | Zero extra cost — pay per order as usual |
| **C — Split air: early batch** | If factory can have 20,000 units ready June 10 (earliest cargo ready date), ship separately June 10 → arrives June 17 → available June 21 (before China depletes). Main air batch ships June 13–15 as planned. | Small GW split-booking fee |

**Recommended: A + B combined.** Negotiate expedited 48h inbound with Fly Fulfillment (reduces gap to 1 day), and keep Procware China as backup through June 25.

### Additional freight cost

| Adjustment | Calculation | Cost |
|---|---|---|
| Air +12,000 Jello | 12,000 × ~€0.43 (air vs sea delta) | **~€5,160** |
| Rail +12,000 Jello | 12,000 × ~€0.11 (rail vs sea delta) | **~€1,320** |
| Expedited inbound SLA | Estimated flat fee with 3PL | **~€200–500** |
| **Total additional** | | **~€6,980** |

ROI: one stockout day costs 2,031 × €39.99 = **€81,199 in lost revenue**. The €6,980 additional freight covers 85× the daily downside.

### Demand sensitivity (revised allocation)

| Demand scenario | Daily rate | Air (68,630) covers until | Gap before rail (July 26)? |
|---|---|---|---|
| March baseline | 2,031 | **July 30** | 4-day overlap ✓ |
| +10% growth | 2,234 | **July 27** | 1-day overlap ✓ |
| +15% growth | 2,336 | **July 25** | 1-day gap ⚠ |
| +20% growth | 2,437 | **July 24** | 2-day gap ⚠ |

**Action trigger:** if weekly orders exceed +10% vs March pace, book contingency top-up air of 15,000 Jello immediately.

---

## 4. Freight Forwarder

**Selected: Gebrüder Weiss (China Limited, Shenzhen Branch)**

Quotes received for all three modes (sea, air, rail). Tier-1 forwarder with established DACH routes.

### Mode rationale

| Mode | Per-unit freight est. | Why this allocation |
|---|---|---|
| Air | ~€0.50/unit | Premium justified — every stockout day costs €81,199 in unserved revenue (2,031 orders × €39.99) |
| Rail/Truck | ~€0.18/unit | Mid-cost bridge, 35–37 day transit, covers July gap |
| Sea | ~€0.07/unit | Steady-state economics; main bulk |

### Confirm with Gebrüder Weiss before June 8

1. Air space confirmed and booked for June 10–15 cargo? (Requires written booking confirmation)
2. Chargeable weight rule for air — actual or volumetric (Jello: 55×28×42 cm, 70 units, 7 kg → volumetric at 166 divisor = 38.9 kg; actual = 7 kg → **volumetric applies**, rate basis is 38.9 kg/carton)
3. Does the quote include import customs clearance in Germany? Or billed separately?
4. Can GW update allocation: air +12,000 Jello (+171 cartons), rail +12,000 Jello (+171 cartons), sea −24,000 Jello (−343 cartons)?
5. Final warehouse ZIP code for Germany delivery (pending 3PL confirmation)

### Documents to prepare by June 8
- Commercial invoice (CI) and packing list (PL) for all 3 products
- HS codes confirmed:
  - Jello powder supplement: **HS 2106.90** (food preparations NEC)
  - Glass straws: **HS 7017.90** (glass laboratory/pharmacy ware — or check 7010/3924)
  - Mixing sticks: **HS 8509.40** (food grinders/mixers) or **8510** — confirm with broker
- Ingredient declaration for supplement (required for EU food import customs)

*Get one competitive air freight quote from DB Schenker or Scan Global for future rate benchmarking — not to delay this shipment.*

---

## 5. 3PL Selection

### Options evaluated

| Criterion | Procware 3PL | Fly Fulfillment | Omnipack |
|---|---|---|---|
| Location | Germany | Germany | Poland |
| Go-live by June 22 | Unknown | ✓ (to confirm) | ✗ (2–4 wk onboarding) |
| Shopify integration | Unknown | ✓ native | ✓ |
| DTC supplement experience | Unknown | ✓ | ✓ |
| DE/AT/CH routing | Unknown | Confirm | ✓ |
| Setup cost | None | €699 one-time | TBD |
| Monthly SLA fee | None | €74–122 | TBD |
| P&P per order | €1.95 | Confirm | TBD |
| DHL DE shipping | €3.25 | Confirm | TBD |
| Storage | €18.90/plt/month | Confirm | TBD |
| Returns | €2.50 | Confirm | TBD |
| **Verdict** | **❌ Reject** | **✅ Select** | **⏳ Q4 2026** |

**Why Procware 3PL is rejected:** We are terminating Procware as a sourcing partner. Using their warehousing arm after dropping them creates a direct conflict of interest — our orders will be lowest priority. No contractual leverage in a dispute. Price used as benchmark only.

**Why Omnipack is deferred:** Polish base adds 1–2 days to German customer delivery. Onboarding timeline (2–4 weeks) misses the June 22 deadline. Revisit when CH volume justifies a multi-country node.

### Fly Fulfillment — confirm before signing

| Question | Why it matters |
|---|---|
| Can you receive air freight and ship orders starting June 22? | Hard deadline — not negotiable |
| What is your P&P rate per order? | Need to benchmark vs €1.95 |
| DHL DE rate per package? | Benchmark: €3.25 |
| Do you offer DHL DDP to Switzerland? | Required for clean CH routing |
| DHL AT rate per package? | Benchmark: ~€3.90–4.50 |
| Shopify integration — how long to go live from contract signing? | Must be live by June 20 for testing |

---

## 6. DACH Routing Design

### Germany

```
Fly Fulfillment (Germany)
        ↓
  DHL Paket (domestic)
        ↓
   DE customer
   Transit: 1–3 business days
   Customs: none
```

### Austria

```
Fly Fulfillment (Germany)
        ↓
  DHL Paket International (DE → AT)
        ↓
   AT customer
   Transit: 2–4 business days
   Customs: none (EU)
   Cost delta vs DE: ~€0.67/parcel
```

### Switzerland — non-EU, deliberate setup required

Switzerland is outside the EU customs union. Every parcel crossing the DE→CH border requires a customs declaration and may incur Swiss import VAT.

**Swiss customs thresholds:**
- Below CHF 65 declared value: **no Swiss VAT due** (small consignment exemption)
- Above CHF 65: 8.1% standard VAT or 2.5% reduced (food/supplements — confirm classification)

**Pricing context:**
- 1+1 bundle (€39.99 ≈ CHF ~39): **below CHF 65 threshold** → no Swiss VAT
- 2+2 bundle (€79.98 ≈ CHF ~78): **above CHF 65** → VAT applies

**Options evaluated:**

| Option | Cost | Customer experience | Decision |
|---|---|---|---|
| DDU — customer pays at door | None added | Bad. Surprise fees, refusals, returns | ❌ Never |
| DDP via DHL (we declare and pre-pay) | +€3–5/parcel | Seamless | **✅ Now** |
| CH 3PL node (stock in Switzerland) | High fixed cost | Best | ⏳ Later |

**Routing: DDP from German 3PL via DHL for all CH orders.**

Monthly volume: 2,540 CH orders = **85 orders/day**
At this scale, a dedicated CH warehouse would cost more in fixed overhead than the DDP surcharge.

**CH 3PL trigger:** when CH orders consistently exceed **150/day for 3 consecutive months**, open RFP for Swiss 3PL node. Benefits at that scale: remove per-parcel DDP cost, local customs import in bulk, faster delivery.

---

## 7. Cost Analysis

### 7.1 Unit COGS: Procware vs. direct factory

| Product | Procware price | Factory direct | Sea freight add | Own SC landed | Savings/unit | Savings % |
|---|---|---|---|---|---|---|
| Jello (100k+ qty) | €1.71 | €1.08 | +€0.07 | **€1.15** | **€0.56** | **33%** |
| Straw (10k–20k qty) | €0.38 | €0.22 | +€0.02 | **€0.24** | **€0.14** | **37%** |
| Mixer (5k–10k qty) | €2.09 | €0.71 | +€0.04 | **€0.75** | **€1.34** | **64%** |

**Sea freight calculation (Jello):**
- Sea allocation: 188,900 Jello units (revised), 2,699 cartons, ~185 CBM
- ~2.5 × 40'HC containers at $2,800 = $7,000 sea freight
- Origin + destination charges + customs: ~$5,000
- Total: ~$12,000 ÷ 188,900 units = $0.063/unit ≈ **€0.07/unit** ✓

**Factory payment terms:**

| Product | Deposit | At pickup | Net 40 | Cash flow (300k Jello PO) |
|---|---|---|---|---|
| Jello | 50% | 20% | 30% | €162,000 now / €64,800 Jun 10 / €97,200 Aug 10 |
| Straw + Mixer | 30% | — | 70% at shipment | €6,165 now / €14,385 at ship |

**Total PO outlay: €344,550** spread over 3 months
**Equivalent Procware cost for same units:** 300,020 × €1.71 + 45,000 × €0.38 + 15,000 × €2.09 = **€513,034 + €17,100 + €31,350 = €561,484**

**Savings on this single PO:** €561,484 − (€344,550 + ~€55,000 freight) = **~€161,934**

### 7.2 Bundle cost comparison — Germany

Shipping/3PL assumption: same rates as Procware 3PL benchmark (P&P €1.95 + packaging + DHL).

| Bundle | Contains | Procware total cost | Own SC total cost | Savings | Margin gain |
|---|---|---|---|---|---|
| 1+1 | 2× Jello | €10.34 | €9.22 | **€1.12** | 2.8% |
| 2+2 | 4× Jello + 1× Straw | €18.93 | €16.57 | **€2.36** | 5.9% |
| 3+3 | 6× Jello + 1× Straw + 1× Mixer | €29.61 | €24.77 | **€4.84** | 16.3% |
| 4+4 | 8× Jello + 1× Straw + 1× Mixer | €35.39 | €29.43 | **€5.96** | 16.8% |

**Verification — Own SC 1+1 DE:**
2 × €1.15 (Jello) + €6.92 (same P&P + packaging + DHL benchmark) = **€9.22** ✓

**Verification — Own SC 3+3 DE:**
6 × €1.15 + €0.24 (straw) + €0.75 (mixer) + €16.88 (40g packaging + shipping) = **€24.77** ✓

### 7.3 Bundle cost comparison — Austria

| Bundle | Procware total cost | Own SC total cost | Savings |
|---|---|---|---|
| 1+1 | €11.18 | €10.06 | **€1.12** |
| 2+2 | €20.14 | €17.78 | **€2.36** |
| 3+3 | €31.22 | €26.38 | **€4.84** |
| 4+4 | €37.18 | €31.22 | **€5.96** |

*Savings are identical to DE — difference lies only in unit prices, not shipping (which remains constant relative to each other).*

### 7.4 Bundle cost comparison — Switzerland

| Bundle | Procware total cost | Own SC total cost | Savings |
|---|---|---|---|
| 1+1 | €12.33 | €11.21 | **€1.12** |
| 2+2 | €21.68 | €19.32 | **€2.36** |
| 3+3 | €33.16 | €28.32 | **€4.84** |
| 4+4 | €39.30 | €33.34 | **€5.96** |

*Caveat: if DE→CH DDP carrier rate exceeds China→CH rate by more than the unit savings, small bundles may be neutral or slightly negative. To be confirmed with Fly Fulfillment DHL CH rates before first CH shipment.*

### 7.5 Monthly and annual savings

**Bundle distribution (estimated from March combo ranking and average 3.37 Jello/order):**

| Bundle | Approx. share | Orders/month |
|---|---|---|
| 1+1 (2× Jello) | 45% | 8,406 |
| 2+2 (4× Jello + straw) | 40% | 7,472 |
| 3+3 (6× Jello + straw + mixer) | 10% | 1,868 |
| 4+4 (8× Jello + straw + mixer) | 5% | 934 |

*Verification: weighted avg Jello = 0.45×2 + 0.40×4 + 0.10×6 + 0.05×8 = 0.90 + 1.60 + 0.60 + 0.40 = **3.50** ≈ 3.37 actual ✓*

**Weighted savings per order (DE):**
0.45 × €1.12 + 0.40 × €2.36 + 0.10 × €4.84 + 0.05 × €5.96
= €0.504 + €0.944 + €0.484 + €0.298 = **€2.23/order**

| Market | Monthly orders | Weighted savings/order | Monthly savings |
|---|---|---|---|
| Germany | 14,675 | €2.23 | **€32,725** |
| Austria | 1,465 | €2.23 | **€3,267** |
| Switzerland | 2,540 | €2.23 (pending CH rate confirmation) | **€5,664** |
| **Total** | **18,680** | | **€41,656/month** |

**Annual savings: ~€499,872 ≈ €500,000/year at March scale**

*Conservative floor (unit savings only, excluding any shipping differences):*
- Jello: 62,968 × €0.56 = €35,262
- Straw: 9,883 × €0.14 = €1,384
- Mixer: 2,109 × €1.34 = €2,826
- **Guaranteed minimum: €39,472/month = €473,664/year**

### 7.6 Contribution margin — 1+1 bundle, DE

| | Procware model | Own SC |
|---|---|---|
| Net revenue per order | €39.99 | €39.99 |
| Total COGS (units + 3PL + ship) | €10.34 | €9.22 |
| **Gross contribution** | **€29.65 (74.1%)** | **€31.77 (79.4%)** |
| Margin improvement | | **+€2.12 / +5.3pp** |

---

## 8. Transition Timeline

### Phase 0 — Pre-transition (NOW → June 9)

| Date | Action | Priority |
|---|---|---|
| **Jun 3–4** | Contract Fly Fulfillment. Pay €699 setup. Get written go-live June 22 commitment. **Negotiate 24–48h expedited inbound SLA for first air shipment — add to contract.** | 🔴 Blocking |
| **Jun 3–4** | Confirm GW air freight: space booked, booking confirmation in writing. | 🔴 Blocking |
| **Jun 3–4** | Procware: written agreement — fulfill all DE/AT/CH orders through **June 25** (Gap 1 backup bridge). If Fly confirms 48h inbound, full stop can be June 25; otherwise extend to June 30. | 🔴 Blocking |
| **Jun 4–5** | Update GW RFQ: air **+12,000** Jello, rail **+12,000** Jello, sea **−24,000** Jello. Confirm feasibility of split air booking (early batch June 10, main batch June 13–15). | 🟠 High |
| **Jun 4–5** | Confirm HS codes with customs broker for supplement, straw, mixer (EU + CH). | 🟠 High |
| **Jun 5–6** | Fly Fulfillment Shopify integration: begin API connection, map product SKUs. | 🟠 High |
| **Jun 6–8** | Prepare CI + PL templates for GW (supplement ingredient declaration included). | 🟠 High |
| **Jun 8–9** | Confirm Fly Fulfillment receiving address and warehouse ZIP for GW delivery instructions. | 🟠 High |

### Phase 1 — Cargo in transit (June 10–21)

| Date | Action | Priority |
|---|---|---|
| **Jun 10–15** | Factory ships. GW picks up all 3 modes from China. Monitor daily. | Factory/GW |
| **Jun 10–15** | Finalize CI + PL. Submit to GW for export customs clearance. | SC Manager |
| **Jun 15** | Shopify order routing switch: build complete, ready for UAT. | Dev |
| **Jun 16–20** | UAT: route 5–10 test orders through Fly Fulfillment pipeline end-to-end. | SC + Dev |
| **Jun 18–21** | Track air shipment: daily status updates from GW. ETA confirmed June 22. | SC Manager |
| **Jun 20** | Shopify routing LIVE for production. All new orders queue to Fly Fulfillment. | Dev |
| **Jun 20** | Fly Fulfillment fully onboarded: inventory system ready, receiving dock scheduled. | 3PL |

### Phase 2 — Transition week (June 22–30)

| Date | Action |
|---|---|
| **Jun 22** | Air freight arrives Fly Fulfillment Germany. Receive and count all cartons. |
| **Jun 22** | **Quality check:** open and inspect first 10% of Jello cartons against written spec before releasing to pick queue. If any carton fails — escalate to factory immediately; 8 days remain before July 1 deadline. |
| **Jun 22** | First DE/AT/CH orders ship from Germany. Monitor tracking numbers and delivery times. |
| **Jun 22–30** | Procware China fulfills remaining backlog (depleting ~1,000 units of Jello, straws, mixers to zero). |
| **Jun 25** | Review first 3 days of German 3PL performance: order accuracy, ship time, packaging quality. |
| **Jun 28** | Final instruction to Procware China: all open orders must be in transit by June 30. |
| **Jun 30 23:59** | **HARD STOP on all China-direct fulfillment.** Zero orders to route from China after this moment. |

### Phase 3 — Own SC live (July 1 onwards)

| Date | Action |
|---|---|
| **Jul 1** | 100% of DE/AT/CH orders fulfilled from Fly Fulfillment Germany. €3 rule in effect — we are not impacted. |
| **Jul 5** | First performance review: order accuracy rate, average time-to-ship, carrier transit time, CH customs clearance status. |
| **Jul 15** | **Place next PO.** Sea only. 300,000 Jello + proportional straw/mixer. Target October arrival (30d production + 30d sea). Negotiate improved terms: 30% deposit (down from 50%), net 60 (up from net 40). |
| **Jul 20–22** | 🟠 Inventory watch: air stock depleting, rail arrives Jul 22. Monitor daily. No new orders from China to bridge — we have the +12k buffer. |
| **Jul 22** | Rail/truck arrives Fly Fulfillment. Receive and count: confirm 54,490 Jello, 6,800 straw, 1,500 mixer. |
| **Aug 5** | Review CH shipping rates and customer experience. If DDP surcharge creates returns or complaints → re-evaluate carrier or routing. |
| **Aug 12–14** | 🟠 Inventory watch: rail depletes Aug 14–18 (with buffer), sea arrives Aug 14. Monitor daily. |
| **Aug 14** | Sea freight arrives. Full steady-state inventory restored. |
| **Sep 1** | 90-day Fly Fulfillment performance review: order accuracy, cost per order, carrier SLA compliance. |
| **Sep 1** | CH volume review: if >100 CH orders/day for 3 months → open Omnipack RFP for CH node. |
| **Q4 2026** | Volume pricing renegotiation with factory: >300k Jello/PO target price €1.00/unit or below. |

---

## 9. Steady-State Operations Model

Once the transition completes (target: from September 2026):

### Inventory management

| Metric | Formula | Value at current demand |
|---|---|---|
| Daily demand (Jello) | — | 2,031 units |
| Production lead time | — | 30 days |
| Sea transit | — | 30 days |
| Total lead time (factory → 3PL) | Production + transit | 60 days |
| Safety stock (1 month buffer) | 30 × 2,031 | 60,930 units |
| Reorder point | Lead time demand + safety stock | 60 × 2,031 + 60,930 = **182,790 units on hand** |
| Minimum order frequency | Monthly | 1× PO per month |

### Monthly PO cycle (steady state)

```
Month N:     Place PO (300,000 Jello)
             ↓ 30 days production
Month N+1:  Cargo ready, sea departs
             ↓ 30 days sea transit  
Month N+2:  Arrives German 3PL
             Replenishes to safety stock level
```

### Key performance indicators to track

| KPI | Target | Frequency |
|---|---|---|
| Order accuracy rate (3PL) | ≥99.5% | Weekly |
| Time from order to ship | ≤24 hours | Weekly |
| DE carrier transit SLA (1–3 days) | ≥95% on time | Weekly |
| CH customs clearance rate | 100% (zero held parcels) | Weekly |
| Stock days on hand (Jello) | ≥30 days | Daily |
| COGS per Jello unit | ≤€1.15 (sea, steady state) | Per PO |
| Return rate | ≤3% | Monthly |

---

## 10. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **3PL inbound processing exceeds 5 days (Gap 1 worsens)** | Medium | Critical | Negotiate 24–48h priority receiving SLA in Fly Fulfillment contract for first air shipment. Pre-send full packing list so warehouse can staff and prepare. If SLA not confirmed → extend Procware China through June 27. |
| Air freight delayed past June 23 | Medium | Critical | China stock lasts to June 23–24. 1-day delay → China depletes before air arrives. Mitigation: keep Procware China active through June 25 regardless (Gap 1 bridge), and negotiate emergency hold of 3,000 units as absolute safety net. |
| Fly Fulfillment cannot go live June 22 | Low | Critical | Contract by June 4 with written go-live date. If they cannot commit → immediately evaluate Alaiko, byrd, or Hive (all Germany-based DTC 3PLs with Shopify integration, 5–10 day onboarding). |
| Product quality fails inspection at German 3PL | Low | High | Inspect 10% of air freight upon arrival before releasing to pick queue. Set written QC spec with factory before June 8 shipment. During the 3–5 day inbound window, this inspection can happen in parallel — no lost time. |
| Procware exits relationship before June 25 | Very Low | Critical | Get written agreement June 3–4. Procware earns per-order revenue — financially motivated to continue through June 25. Include SLA clause: 48-hour advance notice of any service change. |
| Demand spike (+15%) reduces air coverage window | Medium | High | At 2,336/day with 68,630 air: covers to July 25 (rail available July 26 → 1-day gap). Trigger: if week-over-week orders exceed +10% vs March, immediately book contingency top-up air of 15,000 Jello. Pre-negotiate this option with GW now. |
| Rail/truck inbound delayed (>5 days at 3PL) | Low | Medium | Rail (+12k adjustment) available July 26. If 3PL inbound takes 6 days → available July 28. Air (68,630) covers to July 30 → still 2-day overlap. Acceptable risk. |
| Sea freight delayed or 3PL inbound slow in August | Low | Medium | Rail covers to Aug 22. Sea available Aug 18 → 4-day overlap. Even if sea inbound takes 7 days (Aug 21) → 1-day gap only. Monitor sea ETA daily from Aug 1. |
| CH customs hold or classification error | Medium | Medium | Pre-confirm HS code and supplement ingredient list with Swiss customs broker before first CH shipment. DHL DDP handles clearance operationally but HS classification must be correct upfront. |
| German 3PL capacity issue at peak | Low | Medium | Include peak capacity commitment in Fly Fulfillment contract. Current pace: ~600 orders/day. Confirm they can handle 2× volume (1,200/day). |

---

## 11. Open Items — Resolve by June 6

| Item | Owner | Due | Blocking? |
|---|---|---|---|
| Fly Fulfillment: signed contract + written June 22 go-live | SC Manager | Jun 4 | ✅ Yes |
| GW: air freight space confirmation in writing | SC Manager | Jun 4 | ✅ Yes |
| Procware: written service agreement through June 25 (Gap 1 bridge) | SC Manager | Jun 4 | ✅ Yes |
| Fly Fulfillment: 24–48h expedited inbound SLA in contract for first air shipment | SC Manager | Jun 4 | ✅ Yes |
| GW: update allocation — air 68,630 / rail 54,490 / sea 176,900 Jello | SC Manager | Jun 5 | 🟠 High |
| HS codes confirmed with customs broker (EU + CH) | SC Manager | Jun 5 | 🟠 High |
| Shopify order routing: dev capacity confirmed June 5–20 | Dev Lead | Jun 5 | 🟠 High |
| Fly Fulfillment: DHL DDP CH rate confirmed per parcel | SC Manager | Jun 6 | 🟠 High |
| Fly Fulfillment: P&P rate, DHL DE rate, DHL AT rate | SC Manager | Jun 6 | 🟠 High |
| QC specification document sent to factory | SC Manager | Jun 8 | 🟠 High |
| CI + PL templates ready for GW | SC Manager | Jun 8 | 🟠 High |

---

## Appendix — Verified Input Data

### COGS and payment terms (source: Milanote board)
- Jello: €1.08/unit | 50% deposit / 20% pickup / 30% net 40
- Straw: €0.22/unit | 30% deposit / 70% at shipment
- Mixer: €0.71/unit | 30% deposit / 70% at shipment

### Procware landed prices (source: Milanote board)
- Jello >100k units: €1.71 | Straw 10k–20k: €0.38 | Mixer 5k–10k: €2.09

### 3PL pricing benchmark (Procware 3PL, source: Milanote board)
- Storage: €18.90/pallet/month | P&P: €1.95/order | DHL DE: €3.25/pkg | Returns: €2.50

### March 2026 product consumption (source: CSV — Sales by Product)
- Jello: 62,968 units | Straw: 9,883 units | Mixer: 2,109 units
- Jello/day: 62,968 ÷ 31 = **2,031** | Straw/day: **319** | Mixer/day: **68**

### Top combo products (source: Milanote board, Order Infos)
1. 2× Jello (most popular)
2. 4× Jello + 1× free gift (straw)
3. 1× Jello

### Return rate: 3% (source: Milanote board)

### RFQ details (source: PDF — China to Germany First-Leg Freight)
- Planning date: 2026-05-14 | PO placed: 2026-05-10
- Cargo ready: 2026-06-10 to 2026-06-15
- All totals and carton specs as shown in Section 3

### Lead times (source: Milanote board)
- Supplement: 30 days | Mixer/Straw: 20 days
