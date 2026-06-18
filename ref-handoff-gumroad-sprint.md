# Handoff: Life Builder OS — Gumroad Launch Sprint

**Оновлено:** 2026-06-04 (вечір)
**Контекст:** 30-денний план Life Builder OS. Документ оновлюється після кожного спринту.

---

## Проект

**Life Builder OS** — цифровий продуктовий бізнес для англомовних professionals (28–45), non-technical.

- **Магазин:** thelifebuilder.gumroad.com (LIVE)
- **GitHub Pages:** https://artem-scm-ai.github.io/life-builder-os/
- **Бренд:** "Artem | The Life Builder"
- **Засновник:** Artem Stepanenko — SC professional, Kyiv. Zero tech background. Learned English at 32, top 1% income at 36.
- **Стек:** Gumroad (стор) + GitHub Pages (hosting) + Apps Script (leads + email)
- **Бюджет:** $0

---

## Дизайн-система (актуальна)

| Токен | Значення |
|-------|----------|
| Font | Inter (Google Fonts) |
| Background | `#0d0d0d` |
| Accent | `#ff6d3b` (orange) |
| Accent hover | `#e85d2a` |
| Border | `#2a2a2a` |
| Text primary | `#f0f0f0` |
| Text secondary | `#888` |
| Green | `#22c55e` |

**UI патерни:**
- Sticky topbar з `backdrop-filter: blur`
- Картки з `::before` gradient line (top border, accent color)
- Scale dots 0–4: `#ef4444` → `#f97316` → `#eab308` → `#a3e635` → `#22c55e`
- Result screen: 3-tier path cards (DIY / Watch / DFY) — обов'язково для всіх продуктів

> ⚠️ Старий дизайн (`#0a0f1a` bg + `#6c63ff` purple) — застарів. Не використовувати.

---

## Продуктова лінійка

| # | Назва | Ціна | HTML файл | Gumroad | Статус |
|---|-------|------|-----------|---------|--------|
| 1 | Why Start AI Now? | FREE | `products/product-1-why-start-ai.html` | ✅ LIVE | ✅ Задеплоєно |
| 2 | Ideal Profession Finder | $9 | — | — | Тиждень 3 |
| 3 | Job Search Agent | $47 / $67 Pro | `tool-job-search-orchestrator/` | — | Готовий до продажу |
| 4 | What Can I Automate? | FREE | `tool-automation-opportunities-finder-25q.html` | — | Тиждень 2 |
| 5 | AI or Automation? | $9 | `products/product-5-ai-or-automation.html` | ✅ LIVE | ✅ Задеплоєно |

---

## Архітектурні рішення (затверджено)

### 1. Lead Data Rule — обов'язково для кожного продукту

Кожен продукт збирає:
- `timestamp`, `product` (явно, напр. `"product-5"`)
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` (парсяться з URL при завантаженні)
- Відповіді квізу у вигляді JSON (напр. `pains`, `tags` для P1; `answers`, `score`, `tier_label` для P5)
- Контактні дані: `first_name`, `email`, `job_title`, `point_a`, `point_b`, `timeline`, `linkedin_url`

Продукт-специфічні поля — у своєму PRODUCT_TABS конфіг блоці в Apps Script.

### 2. Google Sheets — 1 таблиця, окремий таб на продукт

```
Life Builder OS — Leads (Spreadsheet ID: 1APc2nOr8y9hQfOTITs7eW8yIulTAOQG34LJxltRMHfk)
├── All                    ← master: всі ліди, всі колонки
├── P1 — Why Start AI      ← тільки P1 ліди, тільки P1 колонки
└── P5 — AI or Automation  ← тільки P5 ліди, тільки P5 колонки
```

Новий продукт = один блок у `PRODUCT_TABS` в `tool-life-builder-leads.gs`.

### 3. Result Screen — 3-tier paths (обов'язково для всіх продуктів)

```
📚 Path 1: Learn & Build Yourself  — Free
🎥 Path 2: Watch How I Do It       — $19–39, coming soon
⚡ Path 3: Let Me Build It For You  — Custom, Calendly
```

Calendly: `https://calendly.com/artem-scait/30min`

### 4. Email Agent

Apps Script автоматично надсилає roadmap email після кожного сабміту форми.
- Шаблон персоналізується по `product` + quiz даних
- Відповідь: від `eco.stepanenko@gmail.com`, name: `Artem from Life Builder OS`
- Код: `tool-life-builder-leads.gs`

---

## Apps Script

| Параметр | Значення |
|----------|----------|
| URL | `https://script.google.com/macros/s/AKfycbzfBe87y7FsxcCEm_4OU_RG0u7SsVKhKtsmWb1wthedrL5dW86637Duyb-6-WlMopkflw/exec` |
| Spreadsheet ID | `1APc2nOr8y9hQfOTITs7eW8yIulTAOQG34LJxltRMHfk` |
| Версія | v3 (2026-06-04) |
| Код | `tool-life-builder-leads.gs` |

---

## UTM посилання

### Product 1

| Канал | URL |
|-------|-----|
| Threads | `...product-1-why-start-ai.html?utm_source=threads&utm_medium=social&utm_campaign=product-1&utm_content=threads-post` |
| LinkedIn | `...?utm_source=linkedin&utm_medium=social&utm_campaign=product-1&utm_content=linkedin-post` |
| YouTube | `...?utm_source=youtube&utm_medium=social&utm_campaign=product-1&utm_content=youtube-desc` |
| Direct/Bio | `...?utm_source=direct&utm_medium=direct&utm_campaign=product-1&utm_content=bio-link` |

### Product 5

| Канал | URL |
|-------|-----|
| Threads | `...product-5-ai-or-automation.html?utm_source=threads&utm_medium=social&utm_campaign=product-5&utm_content=threads-post` |
| LinkedIn | `...?utm_source=linkedin&utm_medium=social&utm_campaign=product-5&utm_content=linkedin-post` |
| YouTube | `...?utm_source=youtube&utm_medium=social&utm_campaign=product-5&utm_content=youtube-desc` |
| Direct/Bio | `...?utm_source=direct&utm_medium=direct&utm_campaign=product-5&utm_content=bio-link` |

---

## Що НЕ робити

- **LinkedIn bio** — НЕ міняти на "The Life Builder" поки йде job search
- **Shopify** — відкладено до $500 milestone
- **Community** — відкладено до $500 milestone
- **X.com** — відкладено до місяця 2
- **Telegram бот** — на паузі. Потрібно $5+ на Anthropic API (console.anthropic.com)
- **Beehiiv** — відкладено. Email поки йде через Apps Script напряму.

---

## Ключові файли

| Файл | Що містить |
|------|------------|
| `products/product-1-why-start-ai.html` | Product 1 — live |
| `products/product-5-ai-or-automation.html` | Product 5 — live |
| `tool-life-builder-leads.gs` | Apps Script: routing, email agent |
| `ref-product1-pain-content.md` | Pain blocks, 32 items, 4 категорії |
| `products/product-1-outcomes.json` | 8 profession categories + outcomes |
| `docs/superpowers/specs/2026-06-03-life-builder-os-strategy-design.md` | 30-денний план, revenue targets |
| `docs/superpowers/specs/2026-06-04-product1-gumroad-listing-design.md` | Gumroad copy + cover spec для P1 |
| `docs/superpowers/specs/2026-06-04-product5-gumroad-listing-design.md` | Gumroad copy + cover spec для P5 |

---

## Пріоритети — що далі

| # | Задача | Статус |
|---|--------|--------|
| 1 | Deploy P5 на GitHub Pages | ✅ Done |
| 2 | P1 result screen: 3-tier paths | ✅ Done |
| 3 | Apps Script: email agent + per-product tabs | ✅ Done |
| 4 | UTM посилання | ✅ Done |
| 5 | Опублікувати P5 на Gumroad | 🔄 Зараз |
| 6 | Welcome sequence — 3 листи | Наступний спринт |
| 7 | Product 3 (Job Search Agent) на Gumroad | Наступний спринт |
| 8 | Cover image для P5 (Canva) | Після публікації |
| 9 | Product 4 HTML | Тиждень 2 |
| 10 | Product 2 (Ideal Profession Finder) | Тиждень 3 |
