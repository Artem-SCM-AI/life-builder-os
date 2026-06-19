---
last_updated: 2026-06-19 (session 46)
---

## Current Focus
- **Jello SC Build** 🔥: SC Manager в Accommerce. Phase 0 аудит запущений. NeonPanel requirements doc відправлено засновникам — чекаємо відповідь (критичні Q8-10 bundle COGS). SC Ops Dashboard (Apps Script) — на паузі до NeonPanel відповіді. **Наступна задача: SC roadmap в draw.io (n8n-style) — генеруємо XML файл в наступній сесії.**
- **FlowerOS**: фінмодель v2 готова. `floweros/CLAUDE.md` ✅ створено. Plan 1 готовий до виконання.
- **artem.org.ua сайт**: два HTML-прототипи. Артем обирає версію → `/gsd-plan-phase` для Astro build.
- **@artem.org.ua контент**: 20 постів в Sheets, cron 4x/day ✅
- **TG канал "The Life Builder OS"**: 54 підписники. Стратегія готова. 8 вівторкових постів написані. Перший пост — 2026-06-24. Позиціонування: "перейди на Claude Code" (83% аудиторії вже платять за AI, лише 16% на Claude Code).

## Open Decisions
- LinkedIn bio: не оновлювати до "The Life Builder" поки є job offer
- FlowerOS B2B referral fee (TBD)
- Jello: Straw + Mixer PO — навмисно не розміщені чи пропустили?
- artem.org.ua: white+blue vs dark версія
- TG канал: reactions decoder пост + Sheets tracker ще не створені (ручні дії)

## Blockers
- **Threads Finder**: заморожено — `threads_keyword_search` потребує Meta Tech Provider

## Jello SC Ops Dashboard — Design Brief (next build)

**Tool:** Google Sheets + Apps Script (особистий акаунт Артема, шариться лінком)
**3 SKU:** Jello / Mixer / Straws
**4 вкладки:**

1. **Dashboard** — для кожного SKU: stock в DE (units + days, color: ≥21 green / 14-20 yellow / ≤13 red), in-transit batches (units + days + ETA, може бути кілька), in-production batches (units + days + ready date, може бути кілька)
2. **Landed Cost** — inputs: qty + всі вартості → output: landed cost/unit (вартість коли товар став на сток у FF)
3. **Shipping Plan** — per shipment: SKU, qty, order date, ETA, tracking number, status. Трекінг через email automation (майбутня інтеграція)
4. **Forecast** — горизонтальний, 360 днів, тижневі бакети. Підходить для Gantt діаграм

**Старий файл:** `jello-sc/tools/scenario-planner.gs` — скрапнутий (занадто складний, неюзабельний)
**Новий файл:** `jello-sc/tools/sc-ops-dashboard.gs` (ще не створений)

## Recent Sessions
- 2026-06-19 (46): @hmelinka analytics — підключили multi-account підтримку в analytics.py, завантажили 50 постів + 29 днів в analytics sheet. Топ: Єгипет 383K views, Чемпіон 34K (ER 14.65%), Брат мобілізований 27K. Висновок: особисті мікроісторії б'ють психологію в 10-100x. Файли: `ref-hmelinka-analytics-update-june2026.md` + промпт для 20 постів.
- 2026-06-19 (45): AI Audit UA email — фікс задеплоєно (Apps Script v12). `sendAuditUaEmail` не була в v6. Тест пройшов. Pending: видалити тестовий рядок зі Sheets.
- 2026-06-19 (44): book-to-skill встановлено (`~/.claude/skills/book-to-skill`). Активний в наступній сесії. Арtem має книги для конвертації — зробимо в наступній сесії.
- 2026-06-19 (43): Tool review (7 GitHub repos) + cost display в statusline. ccstatusline пропустили — вже є gsd-statusline.js. Додали cost до існуючого hook ($/сесію після context bar). claudekit — переглянути перед встановленням. Решта — пропустити.
- 2026-06-19 (42): Laptop + Notion cleanup. Downloads: 10GB→4GB (-9GB). Видалено всі CV, job search pipeline, interview prep, кеші. Job search → CLOSED у пам'яті. SC Company Intel: +8 SCAIT лідів (Pete Scratchley, Brandon Young та ін.). Notion: 17 сторінок для ручного видалення (список є). GSD Notion скіли — залишено на потім.
- 2026-06-19 (41): ClickUp інтеграція в брифінг — додано `clickup_client.py`: задачі на сьогодні / закриті вчора / поставлені вчора. Фільтрація на Python-side (API не фільтрує точно). Limits: 15/10/10. Завтра о 8:45 перший повний брифінг з ClickUp секцією.
- 2026-06-19 (40): Morning Briefing tool — збудовано `tool-morning-briefing/` (reader+sender+briefing, 8 тестів). Використовує Claude Code CLI (безкоштовно). Crontab о 8:45 пн-пт. Перший брифінг надіслано в Telegram ✅.
- 2026-06-19 (39): Jello Slack Bot — brainstorming+design+plan. Spec+план готові до виконання. `docs/superpowers/plans/2026-06-19-jello-slack-bot.md` (хендовер всередині).
- 2026-06-18 (38): Ponytail plugin — встановлено через `claude plugin` CLI і одразу вимкнено. Вмикати: `claude plugin enable ponytail`. Вимикати: `claude plugin disable ponytail`.
- 2026-06-18 (36): Jello SC Roadmap — шукали інструмент для n8n-style візуального SC roadmap. Milanote/Miro/Whimsical — немає MCP. HTML+JS — надто редагувати. ClickUp Whiteboard — платний. **Рішення: draw.io XML (diagrams.net, безкоштовний) — генеруємо в наступній сесії.**
- 2026-06-18 (35): Jello — Onboarding PDF + ClickUp "First Week" задача. Forecast: 2,100/day → 8,748/day Oct 16. SC планує в Jello units/day.
- 2026-06-18 (34): Jello — Working Capital bank document. Заповнили всі метрики (Inventory 30d, Production 25d, Shipping 35d, Supplier Terms 0, Shopify 3d, Purchase €123k, Reorder 14d). Supplier terms: 30%+40% до відправки = zero credit. 93-day cash cycle. Файл: `report-jello-working-capital-bank-plan.md`.
- 2026-06-18 (33): Life Builder OS AI Audit UA — баг з дублікатами імейлів (2-3 листи на користувача). Причина: подвійний клік на submit + відсутній флаг. Фікс: `state.submitted`, `btn.disabled`, задеплоєно на GitHub Pages.
- 2026-06-18 (31): Jello SC Ops Dashboard — scenario-planner.gs скрапнутий. Design brief визначений через інтерв'ю: 4 вкладки (Dashboard, Landed Cost, Shipping Plan, Forecast). Forecast горизонтальний 360d тижневі бакети. Dashboard кольорові пороги stock. Shipping Plan з трекінг номером + email automation в майбутньому.
- 2026-06-18 (30): TG канал стратегія — spec + план + 7 тасків виконано (8 постів, reactions decoder, tracker ref, DM шаблон). Перша статистика: 54 підписники, 83% "щось вміють", 66% платна версія AI, 16% Claude Code.
- 2026-06-18 (29): Claude optimization continued — `floweros/CLAUDE.md` створено, `jello-sc/.claude/settings.json` (ClickUp API auto-approve), rules trimmed (-21 рядок), hot.md Quick Refs скорочено.
- 2026-06-18 (28): Mutual Trade Union Credit Agreement M202606374539 — фінальний review, підписуємо як є. SIAC/Singapore ✅, interest 1.5%/mo ✅, SLA clauses ❌. Party B details + KYC docs pending.
- 2026-06-17 (27): Claude setup optimization — створено `jello-sc/CLAUDE.md` (instant context), CLAUDE.md прибраний (Code of Honor → memory), memory cleanup (видалено дублікат, оновлено jello memory, виправлено /tmp path), ClickUp токен → `$CLICKUP_TOKEN` env var, `~/.zshenv` створено.
- 2026-06-17 (26): Jello Forecast — виявили gap, знайшли Google Sheets 360-day model (Clemens/Andrei). Оновили PROJECT.md (Jello 2,100/day, scale 4.5x Oct), ROADMAP.md Phase 1 (інтеграція існуючої, не побудова), SSoT ClickUp. Snapshot: `jello-sc/audit/forecast-model-snapshot.md`. Stockout Jun 16–28, B1 Air прилітає Jun 28. Перший крок: отримати edit access від Clemens.
- 2026-06-17 (25): FF contract review — Basisvertrag підписаний 15.06, Anlage 4 SLA розібрана. DHL прайс (Paket €3.98, Kleinpaket €2.83). Anlage 1 FF (зберігання/фулфіллмент) відсутня. Slack до FF написаний. Expeditors: payment at customs + відстрочка по кешфлоу.
- 2026-06-17 (24): Jello ClickUp Phase 0 restructure — handover (130 tasks), теги 5 вимірів (130/130), папки Vendors/Products/SC Ops/Compliance+Quality, SSoT 28 записів з status:/doc: тегами. Custom fields — free plan не підтримує, workaround через опис + теги.
- 2026-06-17 (23): Jello — 3PL contract review (Mutual Trade Union Co., Yiwu). 10 критичних ризиків. Amendment letter (EN+ZH, 10 правок). ClickUp задача створена в Audit з повним логом. Summary для Malcolm готовий. Чекаємо його підтвердження → відправка листа.
- 2026-06-16 (22): Jello SC onboarding — ClickUp підключено, 192 задачі проаналізовано. GSD проект `jello-sc/` з ROADMAP (5 фаз) і Phase 0 plan. 12 типів аудитів, 129 задач задеплоєно англійською в ClickUp з датами. Розібрали стан до Артема: B1 горить сьогодні, FF контракт прострочений, процесів немає.
- 2026-06-16 (21): Threads Analytics — `analytics.py`, 22K views/день за тиждень.
- 2026-06-16 (20): FlowerOS фінмодель v2 — комісія 1%/6%/7%/3%, B2B канал, GTM Дніпро.
- 2026-06-15 (19): Jello SC Phase 2 Roadmap → Notion (13 сторінок).
- 2026-06-13 (18): artem.org.ua — два HTML-прототипи.

## Quick Refs
- Jello SC: `jello-sc/CLAUDE.md` (live context, ClickUp IDs, blockers)
- FlowerOS Plan 1: `docs/superpowers/plans/2026-06-10-floweros-bot.md`
- artem.org.ua spec: `docs/superpowers/specs/2026-06-13-artem-org-ua-website-design.md`
- Threads poster: `tool-threads-poster/poster.py`
- Memory dir: `~/.claude/projects/-Users-artem-Claude-v-1-0/memory/`
