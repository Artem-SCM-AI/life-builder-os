# FlowerOS — Pre-Development Analysis: Gaps, Scenarios, Architecture

> Date: 2026-06-12
> Status: Working version (passed 2 internal red-team cycles — see Appendix A)
> Inputs: architecture spec (2026-06-10), Plan 1 (floweros-bot), concept doc (2026-06-05), Feia Flora client profile, project memory
> Purpose: everything that must be resolved BEFORE `floweros/` development starts Monday 2026-06-15

---

## 1. Executive Summary

**Verdict: the product logic is sound, but development should not start until the remaining blockers are closed.** None of them are code — they are decisions and verifications. Starting Plan 1 without them risks building on a data model that cannot represent the actual expansion plan (no point/location dimension) and a revenue mechanism (offline attribution) that leaks the majority of commission. *(Blocker #1, LMachine, resolved 2026-06-12 — see below.)*

**Top 5 blockers (detail in §8):**

1. ~~**LMachine.io is unverified.**~~ **RESOLVED 2026-06-12:** LMachine is run by Artem's friends — committed partners who will support FlowerOS development. Residual action before Plan 2: hand them §5.2 as the requirements spec for the four custom mechanics (tiered earn, combined-turnover redemption caps, perpetual referral share, activation bonus) and get the actual endpoint names + auth so Plan 2 codes against real APIs, not the guessed ones in the spec.
2. **Offline attribution is the revenue model, and it is the weakest part of the design.** 7% commission is billable only on transactions the platform *sees*. The current flow (manager manually taps ✅) depends on partner honesty at the exact moment the partner pays for honesty. Needs POS-level integration or a scan-first flow (§6).
3. **The data model has no `point` (location) concept.** The expansion plan is 150 points, mostly chains (Feia Flora alone is 6–8 points). Spec and Plan 1 model one shop = one bot = one base. Retrofitting `point_id` after launch touches every table and every flow.
4. **Scenario math contradicts pilot shop capacity.** The "normal" scenario (5,000 users/point/year) implies more attributed turnover than the Dnipro pilot shop's *entire* turnover (§3.3). The scenarios are valid as steady-state targets only if the platform grows shop turnover — which must then be the explicit pitch and the explicit metric.
5. **Document inconsistencies that will surface in negotiations:** commission 7% (spec) vs 10% (Feia Flora profile); setup fee "cancelled" (concept) vs "$1,500/point, don't mention at first meeting" (Feia Flora profile); avg check 2,500 (concept) vs 1,200 (spec); pilot location Kyiv residential complex (concept) vs Dnipro (spec). One source of truth needed before any client-facing conversation.

**The numbers, if the scenarios hold (150 points, full rollout, base assumptions §3.1):**

| Scenario | Network GMV/year | Platform commission/month | ≈ USD/month |
|---|---|---|---|
| Critical (<3,000 users/pt/yr) | ≤660M UAH | ≤3.85M UAH | ≤$92K |
| Normal (5,000) | 1,100M UAH | 6.42M UAH | ~$153K |
| Fantastic (8,000) | 1,760M UAH | 10.27M UAH | ~$244K |

Even the critical scenario is a strong business at the cost structure involved (§3.5). The risk is not the steady state — it is whether any point ever reaches it (§3.4, ramp reality).

---

## 2. Source Inventory and Inconsistencies

**Sources analyzed:**

| Document | Date | Role |
|---|---|---|
| `plan-flower-loyalty-system-concept.md` | 2026-06-05 | Concept, loyalty math, unit economics, Kyiv ZhK origin |
| `docs/superpowers/specs/2026-06-10-floweros-architecture-design.md` | 2026-06-10 | Approved architecture, Dnipro pilot |
| `docs/superpowers/plans/2026-06-10-floweros-bot.md` | 2026-06-10 | Plan 1 — core bot, 11 tasks, TDD, no external APIs |
| `ref-client-feia-flora.md` | 2026-06-07 | Kyiv premium chain, 6–8 points, active negotiation |
| `ref-floweros-architecture.html` | 2026-06-10 | Diagram (presentation artifact) |
| Memory `project_floweros.md` | current | Canonical project state |

**Inconsistencies found (each one is a negotiation or planning landmine):**

| # | Topic | Conflict | Resolution needed |
|---|---|---|---|
| I-1 | Commission | 7% everywhere vs **10%** in Feia Flora profile | Decide per-segment pricing policy: is premium Kyiv 10% deliberate or stale? |
| I-2 | Setup fee | Concept: cancelled. Feia Flora profile: **$1,500/point** "don't mention at first meeting" | Pick one. Hiding a fee that appears later destroys trust with a chain owner |
| I-3 | Avg check | Concept: 2,500 UAH. Spec: 1,200 UAH. New plan: 1,200–1,800 by city | Use city-level checks from this document; archive the 2,500 assumption |
| I-4 | Purchases/year | Concept: 4.5/user. Spec: 2/customer (derived from real shop data) | 4.5 is unsupported by any observed data — drop it from all models |
| I-5 | Pilot identity | Concept: Kyiv closed residential complex. Spec: Dnipro shop. Memory: Dnipro | Confirm: is the Kyiv ZhK play dead, or a second motion? Affects QR channel design |
| I-6 | Scale claim | Spec: "scales to 15 shops with no infrastructure changes" | The actual plan is **150 points**. Infrastructure section must be rewritten (§4.4) |
| I-7 | "9 shops = $10K/month" | Memory/spec target | Inconsistent with the new 150-point scenario model; replace with §3 figures |

---

## 3. Business Model and Scenario Analysis

### 3.1 Scenario definition (explicit, because the ambiguity is dangerous)

"X users pass through the program per point per year" is modeled as: **X unique program users per point per year, each generating on average 1 attributed purchase per year at the city average check.** This is the conservative reading. Sensitivity: if engaged users average 2 purchases/year (matches the Dnipro shop's observed 2 purchases/customer/year), multiply all revenue figures by up to 2× — but note that higher frequency with the same user count also doubles the capture-rate problem in §3.3.

Base assumptions:
- Commission: flat 7% (progressive 7/9/11/13% tiers treated as upside, not base)
- Upsell commission (vases, balloons, 20%) excluded from base — additive upside
- FX: 42 UAH/USD (update at modeling time)
- "Other oblast centers" avg check assumed 1,200 UAH (Dnipro-like; not provided — **flagged assumption**)

### 3.2 Expansion plan model (150 points)

Per-point platform commission per month = `users × avg_check × 7% ÷ 12`:

| City | Points | Avg check | Critical (3,000) | Normal (5,000) | Fantastic (8,000) |
|---|---|---|---|---|---|
| Dnipro | 20 | 1,200 | 21.0K | 35.0K | 56.0K |
| Kyiv | 50 | 1,800 | 31.5K | 52.5K | 84.0K |
| Odesa | 30 | 1,400 | 24.5K | 40.8K | 65.3K |
| Lviv | 20 | 1,400 | 24.5K | 40.8K | 65.3K |
| Rivne, Uzhhorod, Khmelnytskyi | 3×10 | 1,200 | 21.0K | 35.0K | 56.0K |

*(UAH/month per point)*

Network totals (all 150 points at steady state):

| | Critical | Normal | Fantastic |
|---|---|---|---|
| Dnipro (20) | 420K | 700K | 1,120K |
| Kyiv (50) | 1,575K | 2,625K | 4,200K |
| Odesa (30) | 735K | 1,225K | 1,960K |
| Lviv (20) | 490K | 817K | 1,307K |
| Other 3 cities (30) | 630K | 1,050K | 1,680K |
| **Total UAH/month** | **3,850K** | **6,417K** | **10,267K** |
| **≈ USD/month** | **$92K** | **$153K** | **$244K** |

Kyiv alone is 41% of revenue in every scenario. **Strategic implication: Kyiv execution quality matters more than the other four regions combined, yet the plan starts in Dnipro.** That is fine for de-risking the product, but the Kyiv playbook (chains, premium segment, Feia Flora-type partners) is a different sales motion than single Dnipro shops — it should be treated as a second product validation, not a copy-paste.

### 3.3 Reality check: scenarios vs shop capacity (critical finding)

The Dnipro pilot shop: 600K UAH/month turnover, 1,200 avg check → ~500 transactions/month → **~6,000 transactions/year** total.

| Scenario | Attributed tx/year/point | Share of pilot shop's total volume |
|---|---|---|
| Critical (3,000) | 3,000 | **50% capture** |
| Normal (5,000) | 5,000 | **83% capture** |
| Fantastic (8,000) | 8,000 | **133% — impossible without growing the shop** |

Three consequences:

1. **"Critical" is not a floor — it is an ambitious target.** 50% transaction capture for an opt-in messenger loyalty program is the level of mature, POS-integrated programs. Realistic year-1 capture for this mechanic is 10–30%.
2. **"Fantastic" is only reachable if the platform grows the shop's total turnover.** This is actually the strongest pitch available ("we don't take a share of your pie, we grow the pie") — but then incremental turnover must be measured (baseline before launch, monthly comparison), and the contract should reference it.
3. **Per-point volumes differ.** A Feia Flora flagship in a mall does multiple Dnipro-pilot volumes; a Rivne kiosk does less. The scenario should eventually be parameterized per point class (flagship / standard / kiosk), not per city only.

### 3.4 Ramp reality and the year-1 picture

No point starts at steady state. Realistic ramp at 10–30% capture in year 1:

- Dnipro point, year 1: 600–1,800 attributed users → **4.2K–12.6K UAH/month commission per point** — *below* the "critical" scenario.
- 20 Dnipro points in year 1: ~84K–252K UAH/month total (~$2K–6K). Viable for a solo founder with near-zero costs; not viable with staff.

**Operational floor (kill threshold):** servicing a point costs roughly 2–4K UAH/month equivalent (support share, materials, partner management time). At 1,200 check that requires ≥~500 attributed users/point/year. Any point below ~500 users/year after a 6-month ramp should be exited or fixed — this metric belongs in the partner contract review cadence.

### 3.5 Platform cost structure at scale (was missing everywhere)

| Cost block | At pilot (1–3 shops) | At 150 points |
|---|---|---|
| Infra (VPS, DB, monitoring) | $5–20/mo | $150–300/mo |
| Claude API (support agent) | $15–30/mo | $1.5–3K/mo |
| Airtable → Postgres + BI | $20/mo | $100–200/mo |
| People (sales, partner success, support, dev) | $0 (founder) | $8–15K/mo (6–10 UA hires) |
| QR materials, print, onboarding kits | ~1–2K UAH/point one-time | ~capex per city launch |

Even in the critical scenario ($92K/mo revenue vs ~$12–18K/mo costs), margin is 80%+. **The constraint is not money — it is the partner acquisition and partner success headcount.** 150 points means ~30–60 owner negotiations; nothing in the current docs designs that team or pipeline.

### 3.6 Shop-side economics — the churn risk nobody computed

The shop's *full* cost stack on attributed turnover:

| Component | Cost to shop |
|---|---|
| Platform commission | 7% (up to 13% at progressive tiers) |
| Cashback funding | 3–7% (by client tier) |
| Referral passive income | +1–3% on referred clients' purchases |
| Cash payment bonus | +3% on cash transactions |
| Florist incentive | 125 UAH per activated referral |
| **Total** | **~11–17% of attributed GMV** |

At 45% gross margin, the shop nets ~28–34% on platform sales vs ~45% on organic. This is acceptable **only if sales are incremental**. The pitch currently shows the 7% line and hides the rest in separate sections. A competent chain owner (Feia Flora) will compute the full stack in the meeting. **Fix: present the full stack proactively, paired with the incrementality argument and the purchase-forecasting value (waste reduction on seasonal flowers is real money for them).** Otherwise the deal dies at due diligence or, worse, the shop signs and churns at month 3.

### 3.7 Unit economics v2 — capture-based model (added 2026-06-12, supersedes §3.2 for planning)

Inputs (Artem, 2026-06-12): per point — 600K UAH/month turnover at 1,200 check → 3,000 unique customers buying 2×/year; platform converts **30% of the base into attributing loyalty users** (bot orders or card scans at checkout); frequency uplift **2.0 → 2.5 purchases/year** from reminders + cashback; **6 months for a point to build its base**.

**Per point (Dnipro class):** 900 attributing users × 2.5 = 2,250 tx/year = 2.7M UAH/year attributed GMV (225K/month = 35% of point turnover — passes the §3.3 capacity check, unlike the 3K/5K/8K scenarios). Incremental slice (the +0.5 frequency): 450 tx/year = 45K UAH/month of new turnover.

**Platform, network at maturity (flat 7%, same 900-user base per point — Kyiv points are likely larger, unverified):**

| City | Points | Check | Commission/pt/mo | City/mo |
|---|---|---|---|---|
| Dnipro | 20 | 1,200 | 15.75K | 315K |
| Kyiv | 50 | 1,800 | 23.6K | 1,181K |
| Odesa | 30 | 1,400 | 18.4K | 551K |
| Lviv | 20 | 1,400 | 18.4K | 368K |
| Other 3 cities | 30 | 1,200 | 15.75K | 472K |
| **Network** | **150** | | | **≈2.89M UAH/mo ≈ $69K/mo** |

This is ~75% of the §3.2 "critical" scenario — and it is the internally consistent number. Annualized: ~34.7M UAH ≈ $825K/year against §3.5 costs of $12–18K/mo → ~80% margin at maturity.

**Ramp (6-month base build per point + staged city rollout: Dnipro months 1–4, Kyiv from month 7, Odesa/Lviv from month 12, others from month 16):** a point averages ~50% of steady state during its first 6 months (~7.9K/mo at 1,200 check). Indicative network run-rate: month 6 ≈ 250–300K UAH/mo; month 12 ≈ 900K/mo; month 18 ≈ 2.0M/mo; months 24–27 ≈ 2.9M/mo (full maturity).

**Shop-side P&L per point at steady state — the critical finding:**

| | UAH/mo |
|---|---|
| Incremental gross profit (45% × 45K new turnover) | **+20,250** |
| Commission 7% × 225K attributed | −15,750 |
| Cashback ~3.3% blended | −7,425 |
| Referral passive ~0.6% | −1,350 |
| Cash bonus ~0.8% net of acquiring savings | −1,800 |
| Florist incentives | −450 |
| **Direct P&L** | **−6,525/mo** |

**At 2.0→2.5 uplift the shop is direct-P&L negative.** It pays ~12% on ALL attributed GMV (80% of which is its own transferred base) while earning margin only on the incremental 20%. Break-even frequency: **2.73 purchases/year**. The ratios are check-independent — this holds in Kyiv as much as Dnipro. And the progressive 9/11/13% commission scale makes it dramatically worse exactly at the best-performing points (225K/mo lands in the 11% bracket). **DECIDED (Artem, 2026-06-12): flat 7%, progressive scale removed; premium monetization via a paid forecasting module. Commission base: GROSS order value regardless of cashback redeemed.**

**Levers — any single one closes the gap:**
1. **~80 genuinely NEW customers/year/point (~7/month)** via QR + referrals: each nets the shop ~+993 UAH/year (1,350 margin − 357 stack). This — not registrations — is the contractual KPI that matters.
2. **Waste reduction** via the procurement digest: flower write-offs run 15–25% of purchasing; cutting a third of that on attributed volume = +5–10K/mo. Forecasting is not a bonus feature — it is what makes the shop P&L positive.
3. Frequency ≥2.75 instead of 2.5.
4. Softer cashback (blended ≤1.5%).

**Honest pitch implication:** "reminders alone on your existing base" is a money-loser for the shop; "reminders + new-customer acquisition + demand-driven purchasing" is the package that works. Sell the package, contract the new-customer KPI, measure the frequency uplift.

**Measurement (pilot kill-metrics, define before launch):**
- Registration ≠ activation: 50–70% of registered loyalty users typically attribute purchases → to net 900 attributing users, target ~40–50% base registration.
- Frequency uplift cohort methodology (purchases/customer/year, pre vs post, same-cohort) fixed before launch — at 2.73 break-even, this measurement is existential. → Methodology: `ref-floweros-frequency-methodology.md`.

### 3.8 Five-year drift: referral "forever" income and cashback tier creep (added 2026-06-12)

The §3.7 stack (~12%) is a year-1 number. Two components grow over time:

**1. Cashback tier creep — only if tiers are keyed to lifetime turnover.** The concept says "особистий оборот" without a time window. If lifetime: an average Dnipro user (3,000 UAH/yr) crosses the 20K → 5% threshold around year 7 (slow), but heavy buyers (top ~10%, 12–14K/yr, generating ~30–35% of GMV) hit 5% in ~1.5 years and 7% by year 4. Blended cashback drifts ~3.2% → ~4.1% by year 5.

**2. Referral share growth.** Referred users grow from ~10% of actives (year 1) to ~30–40% (year 5); blended referral cost = share × ~1.2% → +0.4–0.5pp by year 5.

Combined: stack ~11.9% → ~13.3% by year 5 → per-point shop deficit deepens from −6.5K to ~−9.5K/mo at constant frequency, eating ~40% of the new-customer lever. Two structural dampers already decided soften this: referral income is paid in **cashback, not cash**, and the **12-month-inactivity expiry (decided 2026-06-12: balance expires 12 months after the client's last purchase)** wipes dormant balances — including dormant referrers' accruals.

**DECIDED (Artem, 2026-06-12): LIFETIME tiers stay.** The drift to ~13.3% by year 5 is accepted as the price of multi-year client loyalty — a client whose tier only ever grows has a compounding reason never to leave, and the clients who reach 5–7% are by definition the ones worth paying more for. The 12-month-inactivity expiry still caps the liability side. Consequence for partner materials: the contract annex stack disclosure shows the year-5 figure (~13%), not just year-1 (~12%) — the shop hears the real long-term number from us first.

### 3.9 FlowerOS vs classic marketing (added 2026-06-12)

The shop owner's real alternative to the ~12–13% stack is not "free" — it is an ad budget. Comparison against what a Ukrainian flower shop actually buys (cost figures are UA-2026 estimates, ranges):

| Channel | Cost | What you get | Retention |
|---|---|---|---|
| Instagram/Meta ads | CPC 3–10 UAH → **CAC 300–700/new customer** | a stranger's attention while they scroll | none — re-buy the same client every time |
| Google Search ads | CPC 10–30 UAH → CAC 300–600 | high-intent one-off order | none |
| SMM manager + content | 15–25K UAH/mo fixed | brand presence, murky attribution | weak |
| Marketplace aggregators (Flowwow-type) | **20–30% commission** | demand capture in a price-war environment; client belongs to the aggregator | negative — trains clients to compare prices |
| Discount promos | −10–15% margin on promoted sales | a spike | negative — trains clients to wait for discounts |
| **FlowerOS** | **~12% of attributed GMV (→~13% by y5), pay only on realized sales** | the client's *next* purchase, recurring | the product IS retention |

**Seven structural differences (the pitch ammunition):**

1. **Payment model:** ads are paid upfront for clicks whether or not anyone buys — the shop carries the risk. FlowerOS charges a % of a sale that already happened — the platform carries the risk.
2. **Moment of contact:** ads catch a person when *the algorithm* shows them; FlowerOS arrives **2 days before the date** — and gifting is a timing business, not an awareness business.
3. **No auction:** ad CPMs spike exactly around Feb 14 / Mar 8 — the auction is most expensive precisely when the shop needs it most. A reminder in the client's own Telegram costs the same 7% on March 8 as in July, and competes with nobody.
4. **Recurrence:** an ad-acquired client must be re-acquired for every purchase; a FlowerOS client returns on reminders + cashback with zero marginal acquisition cost.
5. **Data:** ads return aggregate dashboards; FlowerOS returns per-client dates, preferences, and history — which also feeds procurement forecasting. No ad channel reduces flower write-offs.
6. **Attribution:** last-click guesswork vs receipt-level certainty (the commission base doubles as a perfect ROI report).
7. **Compounding:** an ad budget evaporates on spend; the FlowerOS base is an asset that grows monthly.

**Three-year value of one client to the shop (Dnipro point, estimates):**

| | FlowerOS client | Ad-acquired, no loyalty layer |
|---|---|---|
| Frequency | 2.5/yr, retention supported | 2.0/yr, ~40–50% annual churn |
| 3-year GMV | 9,000 UAH | ~4,400 UAH |
| Gross margin (45%) | 4,050 | ~2,000 |
| Acquisition/platform cost | ~−1,125 (stack) | ~−400 (CAC) |
| **Net to shop** | **~+2,925** | **~+1,600** |

≈1.8× per client over three years — before counting forecasting savings and referral spillover.

**Where classic marketing honestly wins** (and FlowerOS shouldn't pretend otherwise):
- **Paid reach at speed:** ads scale tomorrow with budget; viral loops scale unpredictably
- **Brand awareness** beyond program members; one-off events (openings, collabs)
- **Ownership:** the shop owns its ad account and audience; the FlowerOS base belongs to the platform — from the shop's chair this is a cost, and the contract should not pretend it isn't

*(Correction 2026-06-13: an earlier draft listed "people who never walk in" as a classic-marketing edge. Wrong — profile-share loops (§7.4) acquire users with zero shop contact, and the share motivation sits with the flower recipient, which no ad channel can replicate.)*

**Synthesis — they are funnel layers, not substitutes.** Ads fill the top (optional); FlowerOS is the retention layer that makes every acquired client recurring. The compounding move: **point whatever ad budget exists at the bot deep link, not at the website** — then every paid click lands in registration and becomes a recurring asset instead of a one-off order. One line for the pitch: *"Ми не канал реклами. Ми робимо так, щоб одного разу куплений клієнт повертався сам — і ви платите тільки тоді, коли він повернувся."*

---

## 4. Structure and Architecture (revised for the real plan)

### 4.1 What stands as designed

- **One Python service, one bot token per tenant** — correct; keeps branding per brand and one deployment.
- **Telegram-only manager interface** — correct for zero-friction staff adoption.
- **FastAPI webhooks** (Telegram + payments) — correct; polling does not survive 150 bots.
- **AI support agent on Haiku with stock/balance/escalation tools** — correct scope, correct cost (~$0.001/conversation).

### 4.2 Tenancy model must change: brand ≠ point

Current model: shop = bot = Airtable base = manager chat. Real world: **tenant (brand) → points (locations)**. Feia Flora is one bot, one client base, 6–8 points with different stock, different manager teams, different QR codes.

Required changes (cheap now, expensive later):
- `Points` table: `point_id`, `shop_id`, `address`, `manager_chat_id`, `pos_ref`, `active`
- `Orders.point_id` — which location fulfills (chosen by delivery address or client pickup choice)
- QR payloads carry `point_id` (acquisition attribution per location — this is how you know which of 50 Kyiv points underperforms)
- Stock queries scoped per point where the CRM supports it
- Manager routing: order notification goes to the fulfilling point's chat, not a single brand chat

Config shape: `shops/feia_flora.yaml` with a `points:` list instead of one flat file per location.

### 4.3 Database: Airtable's ceiling is ~10 shops, not 150

Airtable limits that bite: 50K records/base on Team plan, 5 requests/second/base API limit, no transactions, no joins. A normal-scenario shop generates 5K users + orders + ledger entries per point per year; a 6-point chain blows the record cap in year 1 and the rate limit on March 7.

**Recommendation (preserves Monday start):** keep Airtable for the pilot exactly as Plan 1 specifies — speed wins (Code of Honor #9). But: `AirtableClient` already encapsulates all DB access; enforce that no `pyairtable` types leak outside `db/`, and treat it as a repository interface. **Migration to Postgres is scheduled at the 3rd signed shop, not "when it hurts."** Airtable can remain as a synced read-only owner dashboard if owners like it.

### 4.4 Infrastructure at scale (replaces spec §6 claim "scales to 15 shops")

| Stage | Setup |
|---|---|
| Pilot (1–3 shops) | 1 Hetzner VPS, Airtable, UptimeRobot — as specced |
| 10–30 points | Postgres (managed), 2 VPS (app + worker), secrets in Vault/SOPS not YAML, daily DB backups, error tracking (Sentry) |
| 150 points | Same architecture, bigger boxes + read replica. No exotic infra needed — Telegram bots are light. The March 8 problem is human, not compute (§4.5) |

Secrets gap: Plan 1 stores bot tokens via env-var substitution in YAML — fine for 1 token, unmanageable at 30+. Move to a secrets file/manager at Postgres-migration time.

### 4.5 The March 8 bottleneck is the manager, not the server

Ukrainian flower retail concentrates 10–20% of annual volume into the Feb 14 + Mar 8 windows. Normal scenario, one point: 5,000 attributed purchases/year → **~150–250 orders in a 3–4 day window**. The current order flow requires a manager to hand-pick a bouquet photo for every order. At 5 minutes per order that is 12–20 manager-hours per peak day per point. It will collapse, and it will collapse on the highest-revenue days.

**Fix (design now, build in Plan 3):** pre-approved catalog mode — per price band and flower type, the bot offers 3 catalog photos directly; manager photo-picking becomes the off-peak premium path. This also removes the single biggest latency in the client experience. The photo library builds itself: every fulfilled order's confirmation photo, tagged with price and attributes, becomes a catalog entry (§6.2, self-building catalog) — by the first March 8, months of real orders have already stocked it.

The compute side is fine: Telegram allows ~30 msg/sec per bot; a 5,000-user reminder broadcast takes ~3 minutes per bot, and each brand has its own bot/limit.

### 4.6 Plan 1 review (the only code-level gaps worth noting now)

Plan 1 is well-built (TDD, clean structure). Three things to adjust **before** execution, all cheap:
1. Add `point_id` to Orders and a minimal `Points` concept (even if pilot has 1 point) — per §4.2.
2. `get_upcoming_reminders()` fetches **all** profiles daily and filters in Python — fine for pilot, document it as a known O(n) scan to replace at Postgres migration.
3. Reminder dispatch must be idempotent per (profile, date, year) — a crashed 09:00 job that re-runs must not double-send. Add a `reminders_sent` log table/check.
4. Order flow captures only budget; the attribute-level mechanic (§6.2: mono/mix → mono type or colors + size band, custom budget input, "describe in words" escape to manager) is pure bot logic with no external dependency — extend the Plan 1 order-flow task with these keyboards and `Order` fields (`format`, `mono_type`, `colors[]`, `size_band`, `same_day`, `description_text`, `photo_file_id`). The `DailyAvailability` checklist and catalog reuse live in the manager bot / Plan 2–3 scope, but the *fields* must exist from day one so history is never lost.

---

## 5. Loyalty System Logic (specified, with the LMachine decision gate)

### 5.1 The LMachine question — RESOLVED

**Update 2026-06-12:** LMachine is run by Artem's friends — strong developers, committed to supporting FlowerOS. The vendor-risk gate is closed: capability and pricing are guaranteed at the level FlowerOS can pay.

What remains is coordination, not risk. The loyalty design is custom in exactly the places generic engines are rigid:
- Earn tiers keyed to **personal turnover** (3/5/7% at 0/20K/50K UAH)
- Redemption caps keyed to **combined turnover** (personal + referral: 25/50/75/100%)
- Referral **perpetual revenue share** (1/2/3% by referee's tier) with an annual-activity retention condition
- Activation bonus 250+250 UAH

**Action before Plan 2:** send LMachine §5.2 below as the requirements spec, and get back (a) confirmed endpoint names + auth (the spec's endpoint table is guessed), (b) which mechanics they implement vs which FlowerOS handles on its side, (c) webhook/event support for transaction confirmation, (d) data export format. Friendly vendor ≠ skip the API contract — Plan 2 tasks need real signatures.

### 5.2 Loyalty ledger spec (now the requirements doc to hand LMachine)

Event-sourced, append-only. Balances are sums, never stored mutable state.

**Tables:**
- `LedgerEntries`: `id`, `user_id`, `shop_id`, `type` (earn | redeem | referral_earn | activation_bonus | adjust | expire | reversal), `amount`, `order_id`, `related_user_id` (for referral entries), `idempotency_key` (unique), `created_at`
- `Referrals`: `referrer_id`, `referee_id`, `activated_at` (first purchase), `active` (annual-purchase condition)

**Derived values (computed, cacheable):**
- `balance(user)` = Σ entries
- `personal_turnover(user)` = Σ order amounts, rolling 12 months → earn tier (3/5/7%)
- `combined_turnover(user)` = personal + Σ referees' turnover → redemption cap (25/50/75/100%)

**Flows:**
- On confirmed transaction: write `earn` entry (tier %), then for the referrer write `referral_earn` (1/2/3% by referee's tier) — both with idempotency key derived from `order_id`.
- On redemption: validate cap against order amount and combined-turnover tier; write `redeem`; refuse on insufficient balance (no negative balances, no silent clamping — tell the client).
- On refund/cancellation: write `reversal` entries mirroring the originals. (Currently no document mentions refunds at all — they exist in flower retail: wilted delivery, wrong address.)
- Annual job: referrers with no own purchase in 365 days → `Referrals.active = false`, referral accrual stops (the documented retention condition; currently designed but had no enforcement mechanism).

**Two policies that are missing and must be decided (shop-facing, not code):**
1. **Cashback expiry.** Unbounded cashback is an unbounded liability on the shop's books. Recommend 12-month expiry per earn entry (write `expire` entries); disclose at onboarding.
2. **Liability reporting.** Outstanding cashback is the *shop's* debt. The monthly partner statement must show it, or the first owner who computes it will feel ambushed.

### 5.3 Anti-abuse (referral scheme is exploitable as designed)

A perpetual 1–3% revenue share invites self-referral farming (register relatives, route all purchases through a referee). Minimum controls: phone verification on registration, referral earnings only after referee's first *paid* purchase (already designed), cap referral income redeemable per order (the redemption cap helps), and a monthly anomaly report (one referrer with >N referees or referral income > personal spend → manual review). Don't over-build for the pilot; do log enough to detect it.

---

## 6. CRM / POS Integration (stock + cash register)

### 6.1 The actual integration landscape (Ukraine flower retail)

| System | Role | Integration reality |
|---|---|---|
| **Flora24** | Flower-niche CRM: stock by stems, deliveries | API exists; auth and rate limits unverified (open question since 06-10). **Does the Dnipro pilot actually run it? Unconfirmed.** |
| **Poster POS** | Most common UA retail POS | Solid public API + webhooks on receipts; loyalty-customer field on receipt |
| **Checkbox** | PRRO fiscalization | API for receipts; useful as ground truth for reconciliation |
| **1C/BAS, KeyCRM** | Larger chains' back office | Per-case integration, avoid at MVP |
| None / notebook | Many small shops | Manual tier only |

**RESOLVED for the pilot (2026-06-12, confirmed by owner):** the Dnipro shop runs on **Excel and notebooks — no CRM, no POS system**. They are only now starting CRM implementation, and FlowerOS will act as their guide through it.

Three consequences:
1. **Pilot launches at Tier 0.** The Flora24-bidirectional design in the spec is dead for the pilot — cut the Flora24 client from Plan 2 scope entirely. Reminders must not promise specific flower availability (preference-based copy only); pre-order push is replaced by the manager notification that Plan 1 already builds.
2. **FlowerOS becomes the shop's first system of record.** With no incumbent CRM, the platform's own Orders/Transactions data IS the shop's sales analytics for attributed volume. This deepens lock-in far beyond the loyalty base: leaving FlowerOS means losing their only structured data.
3. **The "guide" role is a strategic asset: FlowerOS picks the CRM.** When the shop adopts a CRM, FlowerOS recommends from its adapter-friendly list (Poster + Checkbox first). The integration gets designed-in rather than retrofitted, and the implementation help itself is billable or trades for contract terms. Rule: never let a partner adopt a CRM without FlowerOS in the conversation — a hostile or exotic CRM choice recreates the integration gap.

(Feia Flora's system remains unknown — keep question #6 on their list.)

### 6.2 Integration architecture: attribute-level ordering + attribution-centric integration

**Core mechanic (refined 2026-06-12): the bot sells attributes, not composition.** The bot initiates the choice: budget band, colors, bouquet size (height/volume), mono vs mix — informed by profile favorites and order history. Specific flowers appear in exactly one place: **mono-bouquets** (roses, peonies, chrysanthemums, …), where the flower IS the product. The florist assembles a mix within the attribute contract from whatever is freshest — fresher bouquets, less waste, and the photo-confirm step remains the final truth check before payment.

**Stock granularity this requires is deliberately coarse** — per point, per day: which mono types are available, which colors are out (~10 toggles). Coarse enough that it does not need a CRM:

- **Tier 0 source — florist morning checklist** in the manager bot (~30 sec/day): toggle today's available mono types + colors that are out → writes a `DailyAvailability` record (`point_id`, `date`, `mono_available[]`, `colors_out[]`).
- **Tier 1+ source — CRM/POS feed** auto-fills the same record. The ordering contract never changes; only the data source upgrades.

**Two ordering modes by lead time:**

| | Pre-planned (reminder-driven, ≥36–48h) | Same-day |
|---|---|---|
| Stock check | **None** — static seasonal calendar only | Today's `DailyAvailability` |
| Mono | filtered by season | filtered by checklist; **no fresh checklist → mono disabled** |
| Mix | always available | **never blocked** (an open shop can always assemble a mix; out-of-stock colors removed from the picker) |
| Shop receives | order = **procurement signal**: daily digest "Friday: 3 mono red roses, 2 white mix standard" | order to fulfill |

The pre-planned mode is the SC value proposition made concrete with zero integration: confirmed pre-orders don't *check* stock — they *create* it. The shop buys against committed demand; the procurement digest is generated from the platform's own order data.

Edge handling: working-hours guard on same-day orders (after closing → offer next morning); checklist editable any time mid-day (sold out white at 14:00 → one toggle); checklist fill rate is a partner discipline KPI; "mix never blocked" is the revenue-safe fallback when the florist forgets the checklist.

**Escape hatches (the button tree is never a cage):**
- Budget: bands + "enter your own amount" (free numeric input) at every budget step.
- "Describe in words" option at any ordering step → free text routed to the manager chat with the client's profile and order history attached; the manager takes over the order. This is the third human-escalation channel (alongside AI-support escalation and the photo-confirm step), and it triggers on the client's own request — the cheapest possible signal that a human is needed.

**Self-building catalog (every order feeds the next sale).** All attributed sales flow through the bot, so every fulfilled order leaves behind: the confirmation photo (the florist already sends it — zero extra work), final price, attributes (format, colors, size band, mono type), month/season, occasion, and the client's reaction (approved/declined — declines are negative training signal). Uses:
1. **Catalog mode source for peak days** — §4.5's March 8 fix gets its photo library organically, from the shop's own real work
2. **One-tap reorder** — "repeat last time's bouquet" with the actual photo
3. **In-flow examples** — "here's what we assembled for ~1,500" (2–3 real photos in the client's budget band) during ordering
4. Composition is an *optional* florist tag when sending the photo ("11 roses, eucalyptus") — never a required field; photo + price + attributes already carry the catalog

Implementation notes: store Telegram `file_id` per photo (free, instant re-send within the same bot; mirror to object storage at Postgres migration); only bouquet confirmation photos enter the catalog — never delivery photos (people, addresses = PII); partner contract gets a clause permitting photo reuse across the shop's clients.

**What CRM/POS integration is actually for — exactly two things:**
1. **Sales attribution** (commission protection) — receipt webhook from the POS
2. **Availability feed** (replacing the manual checklist) — convenience, not a dependency

Forecasting data needs no integration at all: the system of record for attributed demand is FlowerOS itself.

One narrow interface per concern; everything tenant-specific is an adapter chosen in shop config:

```
SalesProvider:        on_receipt(webhook) -> {amount, loyalty_code?, point_id}
AvailabilitySource:   get_today(point_id) -> {mono_available[], colors_out[]}
                      (Tier 0 impl: manager-bot checklist; Tier 1 impl: CRM feed)
```

| Tier | Sales attribution | Availability source | Who it fits |
|---|---|---|---|
| **Tier 0 — Manual** | scan-first flow (§6.3) | florist morning checklist | pilot, small shops, any shop on day 1 |
| **Tier 1 — POS/CRM** | receipt webhook (Poster/Checkbox) → auto-attribution | CRM feed auto-fills `DailyAvailability` | shops with a POS, steady-state target |

**Rollout scenarios per partner:**
- **No CRM (Dnipro pilot):** launch Tier 0 immediately; when the shop adopts a CRM (with FlowerOS as guide, §6.1), it lands at Tier 1 with attribution and availability designed in.
- **CRM implemented simultaneously with FlowerOS:** do NOT couple the launches. The bot ships first at Tier 0 and starts earning; the CRM project upgrades attribution/availability whenever it lands. CRM implementations slip — bot revenue must not wait on them.
- **CRM already exists:** one adapter (receipt webhook + loyalty field, availability feed if exposed), Tier 1 from launch.

This also corrects the spec's strategic mistake of making the hardest integration (Flora24 bidirectional, stem-level stock) a pilot prerequisite. **Ship Tier 0, upgrade to Tier 1, never block on stem-level stock.**

### 6.2b Exclusivity: radius around each point (decided 2026-06-12)

Exclusivity unit = **a protection zone around each partner point** (not per-city, not per-brand):

- **Default radius:** 1,000 m in Kyiv and dense districts; 1,500 m in other cities; a closed residential complex (ЖК) = the whole complex regardless of radius. Negotiable per contract.
- **What it binds:** FlowerOS commits not to onboard a *competing* flower shop with a point inside the zone. It does NOT restrict client delivery across zones, and does not restrict the partner's own expansion. A chain's protection = union of its points' zones.
- **Performance condition — exclusivity is earned, not granted forever:** zone protection holds while the point stays above the §3.4 kill threshold (≥500 attributing users/year by month 9). Below it, protection lapses and FlowerOS may sign a neighbor. Without this clause, one dead point blocks a city district indefinitely.
- **Conflict rules:** overlapping requests → first signed wins, second is offered the nearest free zone; partner B opening a new point inside partner A's zone gets onboarded only with A's consent, otherwise that point stays off-platform.
- **Geometry check (Kyiv capacity):** 50 points × ~3.14 km² (1 km radius) ≈ 157 km² of protected area vs ~300+ km² of urban Kyiv — feasible at 1,000 m, **infeasible at 2,000 m** (628 km²). The radius cap is what keeps the 50-point Kyiv plan geometrically possible.
- Tooling: a simple geo-check at signing (point coordinates vs existing zones) — spreadsheet-level for now, map view later.

### 6.3 Offline attribution — the design that protects revenue

The problem: client got the reminder, walked into the shop, paid cash. Without capture, the platform earns 0 and the data moat doesn't build.

**Mechanic (Tier 0, no POS needed):** client opens `/card` → bot shows a QR encoding a deep link `t.me/{manager_bot}?start=attr_{user_id}_{nonce}`. The florist scans it with their own phone (any camera app) → lands in the manager bot → enters the amount → done: transaction recorded, cashback accrued, commission attributed. Time cost: ~10 seconds. The client *wants* to show the card (cashback), so enforcement pressure comes from the customer, not the contract.

**Mechanic (Tier 1):** cashier scans the same QR with the POS scanner into the receipt's customer/comment field → Poster webhook → auto-attribution. Zero manual steps.

**Reconciliation (the honesty backstop):** monthly statement per shop comparing attributed turnover vs total fiscal turnover trend; contract grants audit right on PRRO data. Anomaly: registrations growing while attributed transactions stall → field check. The "we can move the client base to your competitor" lever already in the concept is the ultimate enforcement — but reconciliation is what tells you *when* to use it.

### 6.4 Money flow and billing (currently hand-waved as "weekly terminal report")

- Client money always goes **directly to the shop** (their Monobank acquiring, their cash drawer, their terminal). The platform never touches client funds — correct, keeps FlowerOS out of payment-institution licensing.
- Commission collection: auto-generated **monthly statement** from attributed transactions (itemized), invoice from Artem's ФОП, 5-day payment term, late = reminders pause (service lever, contractual). Weekly manual reporting does not survive 10 shops.
- Refund handling reduces the next statement (reversal entries from §5.2).
- Legal pre-launch items: ФОП КВЕДи for agency/IT services; partner contract template (commission, exclusivity radius, KPI, data ownership, audit right, exit terms); client-facing privacy consent at onboarding (UA personal data law) — names, phones, addresses, gift dates are personal data; the "client base belongs to the platform" claim is only as strong as the consent text and the contract.

---

## 7. QR Code System (generation and print)

### 7.1 Payload design

All registration QRs are Telegram deep links with a short, attributable payload (Telegram `start` payload: max 64 chars, `[A-Za-z0-9_-]`):

```
https://t.me/{brand_bot}?start=q_{point}_{channel}
e.g.  t.me/feia_concierge_bot?start=q_k03_pkg
```

- `QrCodes` registry table: `code`, `shop_id`, `point_id`, `channel`, `created_at`, `scans`, `registrations`. The bot logs every `/start` payload → per-point, per-channel funnel analytics (which of 50 Kyiv points converts, whether elevator posters beat care packets).
- Channels: `pkg` (care packet sticker — the strongest channel, every bouquet carries one), `pos` (cashier tent card), `pst` (poster/elevator), `prt` (partner venue), `ig` (Instagram bio/stories link, same payload as a plain URL).
- **Static codes only, self-hosted links.** No third-party QR redirect services (they rot, get paywalled, and add a tracking domain you don't control). Analytics come from the bot's own start-payload log, which is better data anyway.

### 7.2 Generation pipeline (a `tool-` script, ~half a day of work)

1. Input: CSV of points (`shop, point, channels[]`) → script registers codes in the DB and generates one QR per (point × channel).
2. Library: **`segno`** (pure Python, vector SVG/EPS/PDF output — print shops need vector, not PNG).
3. Error correction: **M** for plain codes; **H (30%)** only if a logo is overlaid on the code center.
4. Imposition: script composes print-ready PDFs via ReportLab:
   - **30×30 mm stickers**, A4 sheets (care packets) — short payload scans fine at this size
   - **A6 tent cards** (cash register)
   - **A4/A3 posters** (elevators, partner venues) — QR ≥ 5×5 cm; rule of thumb: QR side ≥ scan distance ÷ 10, elevator scan distance ~50 cm
5. Quiet zone ≥ 4 modules; dark-on-light only (inverted QRs fail on many readers); test print at actual size before a batch run.
6. Output naming: `qr_{shop}_{point}_{channel}.pdf` + one combined per-point onboarding kit PDF.

### 7.3 The loyalty-card QR (different code, different direction)

The `/card` QR (§6.3) is generated **dynamically by the bot** per display (user_id + nonce, refreshed to prevent screenshot reuse) and points at the *manager* bot. Keep the two QR families visually distinct (card QR rendered with the brand color header in the bot message) so florists never scan a registration code at checkout by mistake.

---

### 7.4 Beyond QR: viral share loops and the routing problem (added 2026-06-13)

Registration is NOT shop-bound. Three shop-free acquisition channels, in order of strength:

**1. "Filled and sent" (recipient-driven, direction A).** A woman fills a profile *about herself* — her dates, flowers, vase — and sends the deep link to her partner. He taps → the profile imports into his account → reminders run. The motivation sits with the person who *receives* flowers — the strongest motivation in the system, and one no ad channel can buy. (Already in the spec as PROFILE_SHARE; the "self-profile" framing should be explicit in the share UX: "Це профіль про мене — надіслати тому, хто дарує".)

**2. "Fill request" (buyer-driven, direction B — NEW, add to Plan 3).** A man sends a request: "заповни 60 секунд — і я більше ніколи не промахнусь з букетом". She fills her preferences → the completed profile lands in his account. Inverse of A; covers the case where she hasn't heard of the bot.

**3. Ads → bot deep link** (§3.9 synthesis): any paid click lands in registration, not a one-off order.

Social formats follow naturally: the self-profile is a shareable social object ("я заповнила свій квітковий профіль — у нього більше нема виправдань"), challenge mechanics, Reels/Threads-native. One viral hit brings registrations from the whole country —

**— which exposes an architecture gap: viral traffic is national, bots are per-shop.** A Reels viewer in Lviv lands in the Dnipro shop's bot. Fix: a **central FlowerOS router** — one national deep link for all viral mechanics → asks the user's city → hands off to the nearest partner's brand bot → where no partner exists, captures a **waitlist** entry (city + contact + profile draft).

The waitlist is a sales weapon and an expansion trigger:
- Partner pitch flips from cold to pre-sold: "у Львові 400 людей чекають програму — хто з львівських магазинів їх забере?"
- City-opening criterion (G-17) gets a demand-side trigger: open a city when its waitlist crosses a threshold, not just when sales capacity allows
- Router registrations carry source attribution like QR codes (§7.1 registry extends to `viral`/`share`/`ads` channels)

Scope: router bot + waitlist is small (one bot, one table, city keyboard) — P2, build before any deliberate viral push; fill-request flow → Plan 3 with the share engine.

---

## 8. Gap Register (close before Monday / before scale)

### P0 — Blockers: close before development starts (2026-06-15)

| # | Gap | Action | Effort |
|---|---|---|---|
| G-1 | ~~LMachine unverified~~ **RESOLVED** — friends, committed partners | Hand them §5.2 as requirements; get real endpoint names/auth before Plan 2 | 1 conversation |
| G-2 | ~~Pilot CRM unknown~~ **RESOLVED** — Excel/notebooks, no CRM; FlowerOS guides their CRM adoption | Pilot = Tier 0; cut Flora24 client from Plan 2; steer CRM choice to Poster/Checkbox (§6.1) | done |
| G-3 | No point/location dimension in data model | Add `Points` + `point_id` to Plan 1 Task 3/4 before execution | 2–3 hours |
| G-4 | Offline attribution flow undefined beyond "manager taps ✅" | Adopt scan-first flow §6.3; add manager-bot attr handler to Plan 2 scope | design done here |
| G-5 | ~~Pricing inconsistencies~~ **RESOLVED (Artem, 2026-06-12): 7% flat everywhere incl. Feia Flora; setup fee policy stated openly (none at current stage)** | Concept, pitch, Feia profile updated | done |
| G-6 | Reminder dispatch not idempotent | Add sent-log check to Plan 1 Task 9 | 1 hour |
| G-7 | No client consent text / data-ownership legal basis | Draft onboarding consent + partner contract data clauses | 0.5 day + lawyer pass |

### P1 — Before scaling past the pilot (3+ shops)

| # | Gap | Action |
|---|---|---|
| G-8 | Airtable ceiling (records, 5 rps, no transactions) | Postgres migration scheduled at 3rd signed shop; keep repository boundary clean now |
| G-9 | Billing is manual ("weekly terminal report") | Automated monthly statements + invoices from attributed transactions |
| G-10 | Reconciliation/anti-fraud absent | Monthly attributed-vs-fiscal trend report; contract audit right |
| G-11 | ~~Cashback expiry~~ **RESOLVED (Artem, 2026-06-12): balance expires 12 months after the client's last purchase** (activity-based, whole balance) | Liability line + projected redemption stay in the monthly partner statement |
| G-12 | Referral farming exploitable | Phone verification, anomaly report (§5.3) |
| G-13 | Secrets in YAML/env at 30+ tokens | Secrets manager at Postgres migration |
| G-14 | Shop full-cost stack (11–17%) not in pitch | Add transparent cost+incrementality slide before Feia Flora meeting |
| G-15 | Partner contract template doesn't exist | Commission, exclusivity, KPI, data ownership, audit, exit — one template |

### Added 2026-06-12 — from unit economics v2 (§3.7)

| # | Gap | Priority | Action |
|---|---|---|---|
| G-21 | ~~Commission base~~ **RESOLVED (Artem, 2026-06-12): commission on GROSS order value** — cashback redemption irrelevant to the base; a client with a large balance has already paid for itself | done | Write the gross-basis clause into the partner contract |
| G-22 | ~~Progressive commission~~ **RESOLVED (Artem, 2026-06-12): flat 7%, progressive 9/11/13% scale removed** | done | Update concept/pitch docs; premium monetization via paid forecasting module, not rate escalation |
| G-23 | Registration ≠ activation; 900 attributing users needs ~40–50% base registration | P1 | KPI defined on attributing-active users, not registrations |
| G-24 | Frequency uplift (2.0→2.5, break-even 2.73) unproven — the pilot kill-metric | P0 — methodology before launch | Cohort measurement design: purchases/customer/year pre vs post |
| G-25 | Cashback redemption spikes (Mar 8) hit shop cash flow | P1 | Liability line + projected-redemption forecast in monthly partner statement |
| G-26 | ~~Earn-tier window~~ **RESOLVED (Artem, 2026-06-12): LIFETIME** — 13.3% by year 5 accepted as the price of multi-year loyalty | done | Disclose the year-5 stack figure in the contract annex |
| G-27 | Exclusivity zone parameters in contract | P1 | §6.2b: radius defaults (1,000 m Kyiv / 1,500 m others / whole ЖК), performance condition, conflict rules → into contract template (G-15) |
| G-28 | Viral traffic is national, bots are per-shop (§7.4) | P2 — before any viral push | Central router bot: city ask → handoff to nearest partner bot → waitlist where no partner; waitlist threshold becomes the city-opening trigger (feeds G-17) |
| G-29 | "Fill request" share direction (buyer asks recipient to fill profile) missing from spec | P2 — Plan 3 | Add inverse share flow alongside PROFILE_SHARE |

### P2 — Before the multi-city rollout

| # | Gap | Action |
|---|---|---|
| G-16 | March 8 manager bottleneck | Catalog-photo mode (design §4.5) in Plan 3 |
| G-17 | No city-rollout gating criteria | Define: a city opens when previous city hits X attributed users/point and ≤Y% partner churn |
| G-18 | Kyiv = 41% of revenue but no chain-sales playbook | Treat first Kyiv chain as a second validation milestone, with chain-specific onboarding kit |
| G-19 | No partner-success function for 150 points | Headcount plan tied to point count (1 PSM per ~25–30 points) |
| G-20 | Per-point class volumes (flagship/standard/kiosk) not modeled | Re-cut §3.2 after first 10 points of real data |

---

## Appendix A — Red Team Log (critique cycles applied to this document)

**Cycle 1 findings → fixes:**

1. *Draft used the concept's 4.5 purchases/user/year in scenario math.* Rejected — unsupported by any observed data and double-counts with high user counts. Rebuilt on 1 purchase/user/year base + explicit sensitivity (§3.1).
2. *Draft presented scenario totals without checking them against shop capacity.* Added §3.3 — exposed that "normal" = 83% capture and "fantastic" exceeds pilot shop's entire volume. This reframed the scenarios from forecasts into capture/growth targets.
3. *Draft assumed LMachine works and specced Plan 2 around it.* Replaced with a decision gate + full in-house ledger spec, since the custom referral mechanics make vendor fit unlikely (§5).
4. *Draft kept Airtable to 150 points "with sharding."* Killed — 5 rps/base and 50K records make it a ~10-shop technology. Replaced with a staged migration that still protects the Monday start (§4.3).
5. *Draft treated attribution as a contract-enforcement problem.* Reframed: enforcement via the client's own cashback incentive (scan-first flow) is structurally stronger than policing the partner (§6.3).

**Cycle 2 findings → fixes:**

6. *Cycle-1 version recommended "Postgres from day one," contradicting the speed principle and discarding the already-written Plan 1.* Softened to: pilot on Airtable behind a clean repository boundary, migration scheduled at a concrete trigger (3rd shop), not a vibe.
7. *Scenario tables looked precise but hid the year-1 ramp.* Added §3.4 with the realistic 10–30% capture year-1 numbers and a per-point kill threshold (~500 users/year), so the model can't be mistaken for a launch-year forecast.
8. *Shop-side cost stack (11–17%) was computed but framed as "hide it better."* Inverted: present it proactively with the incrementality argument — a chain owner will compute it anyway, and being first to show it builds the trust the data-ownership clause will strain (§3.6).
9. *QR section recommended a third-party dynamic-QR service for analytics.* Removed — link rot and external dependency for data the bot already captures natively via start payloads (§7.1).
10. *March 8 was framed as an infrastructure risk.* Re-measured: compute is trivial; the human photo-selection step is the real bottleneck (12–20 manager-hours/day/point at normal scenario). Moved the fix to product design (catalog mode), not servers (§4.5).

**Cycle 3 findings → fixes (2026-06-12, capture-based unit economics):**

11. *All prior models priced the platform side and never ran the shop's full P&L at the target uplift.* Computed it (§3.7): at 2.0→2.5 frequency the shop is −6.5K UAH/mo direct — the program only works as a package (new customers + waste reduction), which changes both the pitch and the contractual KPI.
12. *Progressive commission (9/11/13%) survived two critique cycles unchallenged.* Killed by arithmetic: it punishes the best-performing partners into deep negative P&L. Replaced with flat 7% + paid forecasting module.
13. *Commission base under cashback redemption (gross vs net) was undefined in every document.* Added as G-21 — a contract landmine worth ~25% of revenue on redeemed orders.
14. *"30% of base" conflated registration with activation.* Split: ~40–50% registration needed to net 30% attributing users (G-23).

**Remaining known weaknesses (not fixable from the desk):** other-cities avg check (1,200) is a guess; capture-rate ranges are industry analogies, not flower-retail data; Flora24/Poster presence at actual partners unconfirmed; UAH/USD drift. All are flagged inline and all resolve with field data from the pilot.
