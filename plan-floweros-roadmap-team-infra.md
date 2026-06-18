# FlowerOS — Development Roadmap, Team Plan, Onboarding Velocity, Infrastructure

> Date: 2026-06-13
> Premise: Artem + Claude Code build everything until ~10 points. Code is NOT the bottleneck — sales, florist training, and founder attention are.
> Companion docs: `2026-06-12-report-floweros-prelaunch-analysis.md` (economics, gaps), Plan 1 + amendments A1–A5.

---

## 1. What we build together, and how long it takes

Estimates assume Claude Code with TDD (subagent-driven execution), Artem reviewing and making product calls. "Working days" = focused FlowerOS days, not calendar days — the honest schedule risk is founder attention split across LBO, Threads tools, and the job search, not code speed.

| Block | Contents | Effort | Calendar target |
|---|---|---|---|
| **Plan 1 — Core bot** (written ✅ + A1–A5) | onboarding, profiles, scheduler + idempotent reminders, attribute order flow with escape hatches, multi-tenant factory, deploy to VPS | **3–5 working days** | Week 1: Jun 15–21 |
| **Plan 2 — Integrations** (to write: 1 day) | LMachine client (real endpoints from friends), scan-first attribution (`attr_` flow in manager bot), florist daily checklist, cash/terminal confirm, manager photo forward, Monobank invoice + webhook*, transaction recording (7% gross) | **5–8 working days** | Weeks 2–3: Jun 22 – Jul 5 |
| **Launch kit** | QR generation tool + print PDFs (½ day), consent text in bot (done — wire in), shop config, Airtable base from template, florist training visit, first 50–100 registrations from shop's own base | **2–3 days** | Week 3–4 |
| **🚀 PILOT LIVE** | | | **~Jul 6–12, 2026** (3–4 weeks from start) |
| **Plan 3 — during pilot** | profile share + fill request, AI support agent (Haiku), seasonal campaigns, catalog tagging, monthly statement generator, re-engagement | ~2–3 weeks spread over Jul–Aug | incremental, priority by pilot feedback |
| **Router bot + waitlist** (G-28) | one national bot, city keyboard, waitlist table, handoff links | **2–3 days** | before any viral push (Aug–Sep) |
| **Postgres migration** | repository boundary already enforced; migrate + Airtable as owner dashboard | **~1 week** | at 3rd signed shop (~Sep–Oct) |
| **Catalog mode (peak)** | catalog-photo ordering per price band from accumulated photos | **3–4 days** | January 2027, before Feb 14 |

*Monobank depends on the shop's merchant account (open question). Cash + terminal attribution work without it — **launch does not wait for Mono**.

**Seasonal anchors:** pilot live mid-July → 6 quiet weeks to debug on birthdays/anniversaries → **Sep 1 (back-to-school flower mini-peak) = first stress test** → reminder→order conversion readable by late September → **Feb 14 / Mar 8, 2027 = first true peak**, catalog mode must be live by then.

---

## 2. Validation gates (what unlocks each scaling step)

| Gate | Metric | Read by | Unlocks |
|---|---|---|---|
| V1 | 50–100 registrations from shop base | Week 5–6 | mechanics work, staff cooperates |
| V2 | Reminder→order conversion >30% (concept threshold) | late Sep 2026 | sign Dnipro shops 2–3 |
| V3 | Activation ≥50% of registered; new customers ≥7/mo | Oct–Nov 2026 | Dnipro rollout to 5–8 points + chain pitch (Feia) |
| V4 | Frequency cohorts trending ≥2.5 (methodology doc) | Mar–Apr 2027 (needs 6–9 months) | full multi-city commitment |

Conversion 15–30% → optimize scripts, slow down signing. <15% → stop, rethink mechanics (concept's own rule).

---

## 3. Onboarding velocity: points per month, honestly

**Tech onboarding was never the constraint.** With the playbook + a setup script (config + base from template + BotFather + QR PDFs auto-generated): **~½ day tech + 1 training visit per point.** One person can technically onboard a point per day.

**The constraint is sales + training:**

| Stage | Who sells | Realistic velocity | Notes |
|---|---|---|---|
| Months 0–6 (pilot + Dnipro) | Artem solo | **1–3 points/month** | 5–8 parallel conversations max; sales cycle per independent shop 2–6 weeks; ~20–30% of pitched shops sign |
| Months 6–12 (+1 PSM hire) | Artem sells full-time, PSM runs operations | **3–5 points/month** | founder freed from training/support |
| Year 2 (+sales hire, chain-led) | 2 sellers + chains | **6–10/month + chain jumps** | **one chain = +6–8 points from ONE negotiation** (Feia Flora = 2–3 months of independent-shop sales in a single contract) |

**Chain strategy is the velocity lever.** 150 points ≈ 8–12 chains + 40–60 independents. Timeline to 150 points: **~24–30 months (end 2027 – mid 2028)** if chains convert; 36+ months on independents alone. The §3.7 maturity revenue ($69K/mo) lands ~month 30, after the last cohort's 6-month ramp.

**Network milestones (consistent with report §3.7 ramp):**

| When | Points | Run-rate |
|---|---|---|
| Oct 2026 | 3–5 (Dnipro) | ~40–70K UAH/mo |
| Mar 2027 | 10–15 (Dnipro full + first Kyiv chain) | ~200–350K UAH/mo |
| End 2027 | 40–70 (Kyiv scaling, Odesa start) | ~0.9–1.5M UAH/mo |
| Mid 2028 | 120–150 | →2.9M UAH/mo as ramps mature |

---

## 4. Team: who, when, triggered by what

Hires are triggered by point counts and revenue run-rate, not calendar dates. Salary ranges = UA market 2026.

| Trigger | Hire | Why | Cost |
|---|---|---|---|
| **~10–15 points** (≈ month 6–9, run-rate ≥150K UAH/mo) | **Partner Success Manager #1** | florist training, checklist/KPI monitoring, replacement disputes, statements — the work that eats founder days | 25–40K UAH/mo |
| **~20–25 points** (Kyiv entry) | **Sales/BD** (or Artem stays sales and PSM #2 instead) | parallel pipelines in 2 cities are beyond one founder | 30–50K + % |
| **~30 points** | **Bookkeeping + ФОП→ТОВ review** | commission invoicing volume, contracts | part-time/outsourced |
| **~50–60 points** | **PSM #2** (1 PSM per ~25–30 points) + support person (L1 beyond AI agent) | AI agent handles L1; humans handle escalations and partner care | 25–40K each |
| **~80–100 points** | **PSM #3, city lead (Odesa/Lviv), on-call dev** | founder exits daily ops; dev for incident response (LMachine friends ≠ your ops team) | per §3.5 |
| **150 points** | total team **8–10 people**, ~$8–15K/mo | matches report §3.5 cost block; revenue $69K/mo → ~80% margin holds | |

**What is never hired early:** developers. Artem + Claude Code carry all product work through ~30 points; the first dev hire is an on-call/ops role, not a builder. LMachine friends cover the loyalty-engine side.

**Founder time budget (the real risk line):** pilot needs ~3 focused weeks now, then ~1–2 days/week through August. If LBO/Threads/job-search claim those weeks, every date above slides 1:1. Decide the July priority explicitly.

---

## 5. Servers and infrastructure by stage

| Stage | Setup | Cost/mo |
|---|---|---|
| **Pilot (1–3 shops)** | 1 small Hetzner VPS (CX22-class), Airtable Team, UptimeRobot free, domain, webhook mode from day one | **~$30–50** |
| **3rd shop (~Sep–Oct 2026)** | + managed Postgres (Hetzner/Neon ~$25–50), Sentry free tier, daily DB backups, secrets via SOPS (not YAML), staging bot | **~$100** |
| **30+ points (2027)** | app VPS + worker VPS (scheduler/broadcasts), Postgres with replica, monitoring dashboards, log retention | **~$200–300** |
| **150 points** | same shape, bigger boxes — Telegram bots are computationally light; March 8 is a human bottleneck (catalog mode), not a server one | **~$300–500 + Claude API $1.5–3K** (support agent at full scale — the single biggest infra line) |

No Kubernetes, no microservices, no exotic infra at any stage. The architecture (one Python service, per-tenant bots, webhooks) holds to 150 points on two or three boxes.

---

## 6. Next 7 days (concrete)

1. **Mon Jun 15:** start Plan 1 execution (Tasks 1–4 + A1/A2)
2. **Tue–Wed:** Tasks 5–8 + A3; deploy skeleton to VPS, test bot token
3. **Thu–Fri:** Tasks 9–11 + A4/A5; manual smoke test end-to-end
4. **Parallel (Artem, non-code):** LMachine — hand over §5.2 requirements, get endpoint docs; ask shop owner about Monobank merchant; send consent draft to lawyer; confirm shop's florist for training week 3
5. **Weekend/next Mon:** write Plan 2 (1 day with Claude), start integration tasks
