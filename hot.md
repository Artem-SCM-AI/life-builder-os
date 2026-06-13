---
last_updated: 2026-06-13 (session 17)
---

## Current Focus
- **artem.org.ua сайт**: ✅ Design spec готовий і апрувнутий — `docs/superpowers/specs/2026-06-13-artem-org-ua-website-design.md`. Наступний крок: `/gsd-plan-phase` для implementation plan. Стек: Astro + Vercel. Дизайн: White + Blue (#1d4ed8), Inter. Pending: Telegram channel link, Calendly URL confirm, Артем пише 5 кейсів.
- **Threads Client Finder tool**: ⛔ FROZEN — код готовий (Tasks 1-7 ✅, 25 tests), але `threads_keyword_search` глобальний пошук потребує Meta Tech Provider (верифікація бізнесу, тижні). Токен @artem.org.ua в .env, апка опублікована. Розморозити коли Meta спростить або з'явиться альтернатива.
- **@artem.org.ua контент**: 20 постів в Sheets, cron running 4x/day ✅
- **AI Automation Service**: funnel live, next — client search via Threads
- FlowerOS: Plan 1 ready — execution від понеділка (2026-06-15). Pre-launch аналіз: LMachine ✅ (друзі), CRM пілота ✅ (Tier 0, Flora24 cut). Unit econ v2: мережа 150 точок ≈ $69К/міс @ flat 7%; 🔴 магазин у прямому мінусі при uplift 2.0→2.5 (break-even 2.73) — продавати пакет: ~80 нових клієнтів/рік/точку (KPI) + закупівельний дайджест; Рішення: flat 7% GROSS всюди (вкл. Feia), без setup fee відкрито, кешбек згорає 12 міс після останньої покупки, ексклюзив = радіус (1км Київ/1.5км інші). Plan 1 amendments A1-A5 внесені. Нові доки: `ref-floweros-frequency-methodology.md`, `ref-floweros-consent-contract-clauses.md` (юрист!). G-26 ✅ lifetime-тири (дрейф до 13.3% прийнятий). §3.9 FlowerOS vs маркетинг (1.8×/клієнта за 3 роки; рекламу → на deep link бота). §7.4 віральні петлі: self-profile шеринг + fill request (Plan 3) + центральний роутер-бот з waitlist по містах (G-28, до вірального пушу). Roadmap: пілот LIVE ~6–12 липня; V2-гейт (конверсія >30%) — кінець вересня; перший найм PSM на ~10–15 точках; 150 точок = 24–30 міс через мережі — `plan-floweros-roadmap-team-infra.md`. Відкрито: Monobank merchant, юрист по consent — `2026-06-12-report-floweros-prelaunch-analysis.md`
- Claude Onboarding: відео запис — завтра (2026-06-13)

## Open Decisions
- LinkedIn bio: do NOT update to "The Life Builder" until job offer received

## Blockers
- **Threads Finder**: ⛔ заморожено — `threads_keyword_search` глобально потребує Meta Tech Provider статусу
- FlowerOS: `floweros/` directory does not exist — Plan 1 ready, start Monday 2026-06-15

## Recent Sessions
- 2026-06-13 (17): artem.org.ua website design — segment-first hub, White+Blue, Astro+Vercel. Spec written + approved: `docs/superpowers/specs/2026-06-13-artem-org-ua-website-design.md`. Наступне: implementation plan.
- 2026-06-13 (16): Claude Onboarding 404 fix — redirect `/claude-onboarding.html` → `/products/claude-onboarding.html` запушено на GitHub Pages. Лінка в біо оновлена.
- 2026-06-12 (15): FlowerOS pre-launch deep analysis — сценарії 3K/5K/8K юзерів × 150 точок (crit $92K / norm $153K / fant $244K на міс), знайдено: "normal" = 83% capture обороту пілота (нереально рік 1), 7 P0-блокерів, in-house ledger spec, CRM adapter tiers, QR-система. Report: `2026-06-12-report-floweros-prelaunch-analysis.md`
- 2026-06-12 (14): threads-finder повністю заморожено. Знайшли правильний endpoint (`/keyword_search`), опублікували апку, отримали токен @artem.org.ua. Але глобальний пошук вимагає Meta Tech Provider — вирішили заморозити (варіант C).
- 2026-06-12 (13): threads-finder Task 8 — .env заповнено, credentials.json, Sheets ✅. Токен @artem.org.ua отримано через OAuth.
- 2026-06-12 (12): threads-finder Tasks 5-7 — searcher.py fix (MIN_POST_LENGTH=40), setup_sheets.py, bot.py. 25/25 tests passing ✅.
- 2026-06-12 (11): threads-finder Tasks 1-4 — project setup, config, threads_client, sheets_client, claude_client. All tests passing ✅.
- 2026-06-12 (10): @artem.org.ua Claude project rebuild — ICP документ, нові хуки, resonant topics, системний промпт, em-dash fix в постері, artem-org-ua cron → 14 точних запусків до 18 червня.
- 2026-06-12 (9): Статус-ревʼю — Apps Script ✅, Products 2/4/5 відкладено, FlowerOS → понеділок, відео → завтра. AI Audit share: міняємо screenshot → текст для Threads.
- 2026-06-12 (8): Product links audit — зібрали всі живі посилання, створили Notion сторінку "🔗 Product Links & Files" під LBO HQ.
- 2026-06-11: built Claude Code First onboarding product v1.0, ZIP packaged for distribution
- 2026-06-10: FlowerOS architecture design spec + threads poster multi-account Sheets spec

## Quick Refs
- **artem.org.ua website spec**: `docs/superpowers/specs/2026-06-13-artem-org-ua-website-design.md`
- FlowerOS architecture spec: `docs/superpowers/specs/2026-06-10-floweros-architecture-design.md`
- Threads poster: `tool-threads-poster/poster.py`
- Threads finder: `tool-threads-finder/` (Tasks 1-7 ✅, Task 8 pending Meta outage)
- Memory dir: `~/.claude/projects/-Users-artem-Claude-v-1-0/memory/`
- Claude Onboarding Notion page (draft): https://app.notion.com/p/37dd4d2e2457818baf42efe8c75d71ca
- Product Links & Files (Notion): https://app.notion.com/p/37dd4d2e2457819ab1a4d4465da7ca41
