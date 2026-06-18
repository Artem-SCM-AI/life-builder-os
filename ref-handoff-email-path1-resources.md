# ТЗ: Email Path 1 — Персоналізовані ресурси

**Статус:** Ready to execute  
**Чат:** окремий

---

## Контекст

Life Builder OS. Apps Script надсилає roadmap email після кожного lead capture.

Email містить 3 path cards:
- 📚 **Path 1 — DIY (Free)** ← ЗАДАЧА: зробити персоналізованим
- 🎥 Path 2 — Watch me ($19-39, coming soon)
- ⚡ Path 3 — DFY (Calendly)

**Поточний стан Path 1 в email:**
Показує generic текст: "Start with the free resources I've curated for your situation. Takes a few hours — but you'll own the skill forever."

**Що треба:** замінити на персоналізований список відео + статей залежно від того що юзер отримав у квізі.

---

## Apps Script файл

`/Users/artem/Claude v 1.0/tool-life-builder-leads.gs`

Деплой URL: `https://script.google.com/macros/s/AKfycbzfBe87y7FsxcCEm_4OU_RG0u7SsVKhKtsmWb1wthedrL5dW86637Duyb-6-WlMopkflw/exec`
Spreadsheet ID: `1APc2nOr8y9hQfOTITs7eW8yIulTAOQG34LJxltRMHfk`
Поточна версія: v4

Функції що стосуються задачі:
- `sendProduct1Email()` — email для P1
- `sendProduct5Email()` — email для P5
- `buildPathsHtml()` — будує 3 path cards
- `buildEmailHtml()` — HTML шаблон

---

## Product 5 — ресурси per tier

### Дані доступні в email
`data.tier_label` приходить в payload. Можливі значення:
- `"Classic Automation"` (score 76–100)
- `"Automation-First + Light AI"` (score 56–75)
- `"Intelligent Automation"` (score 36–55)
- `"AI-First"` (score 0–35)

### Потрібно додати `TIER_RESOURCES` константу

Для кожного tier:
- `time` — estimated learning + build time (вже є в P5 HTML)
- `tools` — рекомендовані інструменти (вже є в P5 HTML)
- `videos` — масив `{ title, url, duration }` — 3-4 відео
- `articles` — масив `{ title, url }` — 2-3 статті

**Референс з Product 5 HTML (вже є там):**
```
tier-automation: Zapier, Make.com, Power Automate
tier-automation-first: Make.com + OpenAI, n8n + Claude
tier-intelligent: n8n, Claude API, LangChain
tier-ai: Claude API, OpenAI Assistants, LangGraph
```

YouTube URLs в P5 HTML вже є (як search query URLs). Взяти їх як основу, додати ще 1-2 відео і 2-3 статті.

---

## Product 1 — ресурси per category

### Дані доступні в email
`data.category` приходить в payload. Можливі значення (з `products/product-1-outcomes.json`):
- `"Freelancer / Solo Professional"`
- `"Team Lead / Manager"`
- `"Sales / Business Development"`
- `"Operations / Supply Chain"`
- `"Content Creator / Marketer"`
- `"HR / Recruiter"`
- `"Finance / Analyst"`
- `"Other"`

### Ресурси per category

Для кожної категорії — підібрати 3-4 відео і 2 статті про те як AI допомагає саме в цій ролі.

Приклад для Operations:
- Videos: inventory automation, supply chain AI, Make.com + spreadsheets
- Articles: AI in supply chain, automation for ops managers

Приклад для Sales:
- Videos: AI for sales prospecting, CRM automation, follow-up sequences
- Articles: AI sales tools review, cold outreach automation

---

## Технічна реалізація

### 1. Додати в Apps Script

```javascript
const TIER_RESOURCES = {
  'Classic Automation': {
    time: '⏱ ~4–6 hrs to learn · ~2–4 hrs to build',
    tools: 'Zapier · Make.com · Power Automate',
    videos: [ ... ],
    articles: [ ... ],
  },
  // ... інші тири
};

const CATEGORY_RESOURCES = {
  'Operations / Supply Chain': {
    videos: [ ... ],
    articles: [ ... ],
  },
  // ... інші категорії
};
```

### 2. Нова функція `buildDiyResourcesHtml(resources)`

Рендерить список відео (з VIDEO бейджем, посиланням, тривалістю) і статей (з READ бейджем) у вигляді HTML таблиці для email.

### 3. Оновити `buildPathsHtml(diyHtml)`

Приймає опціональний `diyHtml` параметр. Якщо є — показує персоналізований контент. Якщо ні — generic текст.

### 4. Оновити `sendProduct5Email` і `sendProduct1Email`

```javascript
// P5
const tierRes = TIER_RESOURCES[tierLabel];
paths: buildPathsHtml(buildDiyResourcesHtml(tierRes)),

// P1
const catRes = CATEGORY_RESOURCES[category];
paths: buildPathsHtml(buildDiyResourcesHtml(catRes)),
```

### 5. Задеплоїти як v5

Deploy → Manage deployments → Edit → New version → Save

---

## Deliverable

1. Оновлений `tool-life-builder-leads.gs` з:
   - `TIER_RESOURCES` (всі 4 тири, по 3-4 відео + 2-3 статті)
   - `CATEGORY_RESOURCES` (всі 8 категорій, по 3 відео + 2 статті)
   - `buildDiyResourcesHtml()` функція
   - Оновлені `sendProduct1Email` і `sendProduct5Email`
2. Задеплоїти в Apps Script як v5
3. Тест: зробити сабміт на P5 → перевірити email що в Path 1 є ресурси під tier
