# ТЗ: Welcome Sequence — 3 листи

**Статус:** Ready to execute  
**Чат:** окремий

---

## Контекст

Life Builder OS — цифровий продуктовий бізнес для English-speaking professionals (28–45), non-technical.
- Бренд: "Artem | The Life Builder"
- Tone of voice: mentor + peer. ~80% coach, 20% experienced colleague. Simple English (B1–B2).
- Засновник: Artem Stepanenko — 5 years Head of SC, learned English at 32, top 1% income at 36. Zero tech background.
- Tagline: "You don't need to be technical. You just need a system."

**Email flow на сьогодні:**
- Лід заповнює форму на Product 1 або Product 5
- Apps Script одразу надсилає **Roadmap Email** (персоналізований під product + quiz results)
- Після цього — тиша. Welcome sequence не існує.

**Задача:** написати 3 листи welcome sequence, які йдуть ПІСЛЯ roadmap email.

---

## Технічна реалізація (для довідки)

Поточний стек: Apps Script (не Beehiiv). Листи будуть надсилатись через time-based triggers в Apps Script або вручну на першому етапі. Писати під Apps Script / GmailApp.sendEmail().

Дані про ліда доступні в Google Sheets (Spreadsheet ID: `1APc2nOr8y9hQfOTITs7eW8yIulTAOQG34LJxltRMHfk`):
- `first_name`, `email`, `product`, `category` (P1), `tier_label` (P5), `hours_wasted` (P1), `score` (P5)

---

## Структура sequence

| Лист | Затримка | Тема | Мета |
|------|----------|------|------|
| 0 | Одразу | Roadmap email | ✅ Вже є в Apps Script |
| 1 | Day 2 | Welcome | Знайомство з Artem. Без продажу. |
| 2 | Day 4 | Value tip | Одна конкретна порада яку можна застосувати сьогодні. М'який згадка про $9 продукти. |
| 3 | Day 7 | Offer | CTA на Job Search Agent ($47) або $9 продукти. Urgency опційна. |

---

## Лист 1 — Day 2: Welcome

**Subject варіанти (обери кращий або запропонуй свій):**
- `A quick note from Artem`
- `Why I built this (and what's coming next)`
- `The system behind the results`

**Що має бути в листі:**
- Короткий особистий intro: хто такий Artem, чому він будує ці інструменти
- Core story: learned English at 32, reached top 1% income at 36, zero coding background
- Що Life Builder OS — це і є та система, яку він використовував
- Що чекає підписника далі (конкретно: ще 2 листи з корисним контентом, без спаму)
- Без CTA на продажу в цьому листі. Тільки довіра.

---

## Лист 2 — Day 4: Value Tip

**Subject варіанти:**
- `The one AI habit that changed everything`
- `What I do every Monday morning (takes 8 minutes)`
- `A simple system I use every week`

**Що має бути:**
- Одна конкретна AI / automation порада з реального досвіду Artem
- Формат: "Here's exactly what I do" — step by step, коротко
- Наприкінці: м'який soft mention про $9 тести (P1 або P5) без hard sell
- Тон: "This helped me — maybe it helps you too"

**Ідеї для поради (обери або запропонуй):**
- Weekly AI planning session (8 min Monday morning з ChatGPT/Claude)
- "Tell Claude your job + ask it to find what you waste time on" — персональний аудит
- How to use AI for the most annoying task in your week

---

## Лист 3 — Day 7: Offer

**Subject варіанти:**
- `Ready to go further?`
- `The next step (if you want it)`
- `Here's what helped me most`

**Що має бути:**
- Короткий recap що вже отримав підписник (roadmap + tip)
- Primary CTA: **Job Search Agent ($47)** — якщо product = P1 або загальний
- Secondary CTA: інший $9 тест (якщо вже використовував P1 → запропонувати P5, і навпаки)
- Urgency: опціонально. Можна без нього — якість продукту сама продає.
- Тон: "no pressure, here's what I have if you need it"

---

## Email HTML шаблон

Використовувати той самий формат що в `tool-life-builder-leads.gs` функція `buildEmailHtml()`:
- Dark header `#0d0d0d` з "Life Builder OS"
- White body, Inter font
- Orange CTA button `#ff6d3b`
- Footer з unsubscribe

---

## Deliverable

Файл: `ref-welcome-sequence-emails.md`

Містить:
1. Фінальний subject для кожного листа
2. HTML body для кожного листа (готовий до вставки в Apps Script)
3. Короткий коментар по кожному листу (що саме і чому)

Після написання — Apps Script код для time-based triggers додати в `tool-life-builder-leads.gs` як окрему секцію.
