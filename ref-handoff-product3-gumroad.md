# ТЗ: Product 3 — Job Search Agent на Gumroad

**Статус:** Ready to execute  
**Чат:** окремий

---

## Контекст

Life Builder OS — цифровий продуктовий бізнес для English-speaking professionals (28–45), non-technical.
- Магазин: thelifebuilder.gumroad.com (LIVE)
- Бренд: "Artem | The Life Builder"
- Засновник: Artem Stepanenko

**Продукт вже опубліковано:**
- Product 1 (FREE): https://thelifebuilder.gumroad.com/l/WhyStartAI
- Product 5 ($9): https://thelifebuilder.gumroad.com/l/AIorAutomation

---

## Product 3 — Job Search Agent

**Що це:** Автономний AI агент для job search. Щоранку о 8:00 шукає вакансії → ранжує TOP-3 → записує в Notion pipeline. Будується на Claude Code + Apify + Notion.

**Ціна:** $47 Basic / $67 Pro (два tier або два окремих продукти — вирішити при публікації)

**Basic ($47) включає:**
- Claude Code agent files (copy-paste, без кодингу)
- Step-by-step README (< 30 хв setup)
- ICP definition worksheet
- Notion pipeline template
- Resume template (Claude-adaptive)

**Pro ($67) додатково:**
- Notion template розширений
- 7-day email support від Artem

---

## Файли продукту

Всі файли в `/Users/artem/Claude v 1.0/job-search-orchestrator/`:
- `README.md`
- `LOOM_SCRIPT.md`
- `agents/`
- `data/`
- `scripts/`

Існуючий Gumroad copy (чернетка): `/Users/artem/Claude v 1.0/copy-gumroad-job-search-agent-listing.md`

**Увага:** існуючий copy написаний під $9 ціну — треба оновити під $47/$67.

---

## Задача

### 1. Gumroad listing copy

Написати фінальний copy у форматі як P1 і P5 (дивись `docs/superpowers/specs/2026-06-04-product1-gumroad-listing-design.md` як референс):

- **Title:** `Job Search Agent — Find Remote Jobs on Autopilot (Claude + Notion)`
- **Price:** $47
- **Tagline:** під 120 символів, конкретна вигода
- **Description:** повний текст — hook, how it works, what you get, who it's for, who built this
- **Tags:** job search, AI agent, Claude, Notion, automation, remote work, career

Tone: практичний, без хайпу. "Set it up once. Wake up to a ranked list." Real use case.

### 2. Cover image в Canva

**Стиль:** точна копія P1 і P5 (дивись `docs/superpowers/specs/2026-06-04-product5-gumroad-listing-design.md`):
- Фон: `#0d0d0d`
- Accent: `#ff6d3b` (orange)
- Ліва вертикальна смуга: градієнт orange → purple
- Inter font

**Текст на обкладинці:**
- Eyebrow: `AI JOB SEARCH AGENT`
- Назва: `Job Search Agent`
- Підзаголовок: `Wake up to a ranked job list. Every morning. Automatic.`
- Бейдж: `$47` — orange background
- Bottom: `Life Builder OS`

Використати Canva MCP для генерації + зберегти чорновик у акаунт.

### 3. Gumroad Settings

| Поле | Значення |
|------|----------|
| Product type | Digital file |
| Price | $47 |
| Files | ZIP з `job-search-orchestrator/` директорії |
| Cover | PNG 1280×720 з Canva |

### 4. Публікація

Опублікувати на thelifebuilder.gumroad.com. Дати посилання.

---

## Deliverable

1. `docs/superpowers/specs/2026-06-04-product3-gumroad-listing-design.md` — фінальний copy + cover spec
2. Canva чорновик — посилання
3. Gumroad продукт опублікований — посилання
