# FlowerOS — Frequency Uplift Measurement Methodology (Pilot Kill-Metric)

> Date: 2026-06-12
> Why this exists: shop break-even is at **2.73 purchases/year** (report §3.7). The difference between measuring 2.4 and 2.8 is the difference between a product and a cashback bonfire. Methodology must be fixed BEFORE launch — retrofitted metrics are negotiable metrics.

---

## 1. The metric

**f = attributed purchases per active user per year** (rolling 12 months; annualized during the pilot).

- Active user = registered AND ≥1 attributed purchase in the window
- Baseline f₀ = **2.0** (owner data: ~6,000 tx/year ÷ ~3,000 unique customers)
- Target f = **2.5**; shop P&L break-even f = **2.73**

## 2. Data sources

| Source | What it gives | Status |
|---|---|---|
| Platform transactions (bot orders + card scans) | per-user purchase counts, amounts, dates | built into Plan 1/2 |
| Owner's monthly turnover totals (Excel, ≥12 months back) | market/seasonality control | request from owner BEFORE launch — one-time ask |
| Onboarding question "Чи купували ви у нас раніше?" + florist tag | new vs transferred customer flag | add to onboarding (1 question, button yes/no) |

The shop has no per-customer history (Excel/notebooks), so the baseline is aggregate-level only. That is enough: f₀ comes from totals ÷ unique customers, and the uplift is measured within the platform's own cohorts.

## 3. Method

**Primary — registration cohort curves.** Group users by registration month. For each cohort, compute purchases/user in months 1–6 vs months 7–12 after registration, annualized. Frequency uplift = mature-cohort annualized f vs f₀ = 2.0.

**Control — shop totals year-over-year.** Compare the shop's total monthly turnover vs the same months last year (owner's Excel). If platform-attributed volume grows while total turnover doesn't beat last year's trend, the program is shifting sales, not adding them — this is the cannibalization detector.

**Segmentation — new vs transferred.** New customers (flagged at onboarding) are 100% incremental by definition; their volume counts toward the new-customer KPI (≥7/month/point), not the frequency uplift. Never mix the two — each lever has its own target.

## 4. Decision gates

| Checkpoint | f (annualized, mature cohorts) | Action |
|---|---|---|
| Month 6 and Month 9 | **≥ 2.75** | Model works standalone — scale aggressively |
| | **2.3 – 2.75** | Optimize: reminder copy/timing, cashback prompts, seasonal campaigns; re-measure at +3 months |
| | **< 2.3** | Frequency lever is dead — the program survives only on new-customer acquisition + procurement value; rebuild the pitch and the shop P&L around those |

Secondary gates (concept doc targets, still valid): reminder→order conversion >30% validates the core mechanic; % attributing of registered ≥50–70%; new customers ≥7/month/point.

## 5. Pitfalls (pre-committed answers)

- **Survivorship:** denominators include inactive registered users when reporting registration→activation, but f is computed on active users only. Report both numbers, never blend them.
- **Seasonality:** compare year-over-year, never month-over-month. Flower demand is a sawtooth.
- **March 8 / Feb 14 distortion:** annualize cohort frequency using full-cycle windows; flag any window containing a peak.
- **Small numbers:** with <150 active users per cohort, show confidence ranges, not point estimates; do not fire a gate decision off one cohort.
- **Goodhart risk:** florists incentivized on registrations will register ghost users — activation rate per florist is the audit metric.
