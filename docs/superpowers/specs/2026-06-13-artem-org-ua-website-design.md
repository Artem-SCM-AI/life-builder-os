# artem.org.ua — Website Design Spec

**Date:** 2026-06-13
**Status:** Approved by Artem
**Domain:** artem.org.ua
**Audience:** Ukrainian market — 5 ICP segments

---

## Goal

A segment-first hub that ICP visitors want to use and share with colleagues. Two success signals:
1. Visitor uses a free tool (quiz/audit) — email captured
2. Visitor shares a specific case page with a colleague ("це про тебе")

Primary conversion: email list. Secondary: consultation booking (`/автоматизація`).

---

## ICP

5 segments from `ref-artem-org-ua-icp-segments.md`:

| Segment | Pain hook | Primary tool |
|---|---|---|
| Продажі / Маркетинг | Ліди, звіти, контент — вручну | Why Start AI quiz |
| Операції / Фінанси | Інвойси, склад, виписки — вручну | AI Audit UA |
| HR / Підтримка | Рекрутинг, тікети, договори — вручну | Claude Onboarding |
| Власники МСБ | Усе одразу — вручну | AI or Automation quiz |
| Шукаю роботу | CV, пошук, підготовка — вручну | Job Search Agent |

Universal hook: **"Скільки годин на тиждень ти витрачаєш на роботу яку міг би не робити?"**

---

## Site Architecture

### Pages

| URL | Purpose |
|---|---|
| `/` | Main hub — personal intro → hook → segment filters → tools → cases → newsletter → service teaser |
| `/інструменти` | Free tools only: quizzes + audits. Tagged by segment. |
| `/продукти` | Paid products: Claude Onboarding, Job Search Agent, others. |
| `/кейси` | Case list with segment filter. |
| `/кейси/[slug]` | Individual case page — shareable unit. |
| `/автоматизація` | AI Automation service: problem → solution → numbers → Calendly. |
| `/про` | Origin story + social links. Short. |

### Navigation (header)

```
artem.org.ua  |  Інструменти  |  Кейси  |  Про мене  |  [Автоматизація →]
```

CTA button is always visible. "Автоматизація" describes the outcome, not the process.

### Footer

```
© 2026 Артем Степаненко  ·  Threads  ·  Telegram  ·  LinkedIn  ·  eco.stepanenko@gmail.com
```

---

## Home Page — Section Flow

### 1. Personal intro (top)
- Avatar / photo
- Name: Артем Степаненко
- Bio (2 lines): "Будую AI-автоматизацію для тих хто не технар. [N]+ кейсів з українськими спеціалістами та бізнесом." — Artem fills in the real number.
- Social links: Threads, Telegram, LinkedIn

### 2. Hero
- H1: **"Скільки годин на тиждень ти витрачаєш на роботу яку міг би не робити?"**
- Sub: "AI закриває це повністю. Без коду. Без технічного бекграунду."
- Primary CTA: "Пройти аудит — безкоштовно →"
- Secondary CTA: "Переглянути кейси"

### 3. Segment filter
- Label: "Обери свою ситуацію — покажу що підходить саме тобі"
- 5 cards in 2-column grid (5th spans full width)
- Active segment highlighted in `#ff6d3b`
- On click: filters sections 4 and 5 below; URL anchor updates to `/#продажі` etc.
- Default: no segment selected (all tools/cases visible)

### 4. Free tools (filtered by segment)
- Section title: "Інструменти · [Segment]" in orange
- 2-column card grid
- Each card: tool name, meta (тип · тривалість · безкоштовно), CTA button "Пройти →"
- Link to `/інструменти` for full list

### 5. Cases (filtered by segment)
- Section title: "Кейси · [Segment]" in grey
- List of case cards: title, role tag, result number (e.g. "-8 год/тиж"), "читати →"
- Each links to `/кейси/[slug]`
- Link to `/кейси` for full list

### 6. Newsletter
- Centered block
- H: "1 кейс автоматизації щотижня"
- Sub: "Конкретно, з числами, без жаргону. Українською. Безкоштовно."
- Email input + "Підписатись безкоштовно" button
- On submit: POST to existing Apps Script URL with `{ product: 'newsletter', email, first_name }` — creates "Newsletter" tab in the same Google Sheet. No new infrastructure needed.

### 7. Service teaser
- Dark card with orange border
- "Хочеш розібрати свій конкретний кейс?"
- Sub: "45 хв — розбираємо твої задачі. Йдеш з готовим планом автоматизації."
- CTA: "Записатись на дзвінок →" → Calendly (URL: `calendly.com/artem-org-ua/30min` — confirm before launch)

---

## Case Page — `/кейси/[slug]`

The primary shareable unit. URL format: `/кейси/[role]-[task]-[outcome]`
Example: `/кейси/sdr-avtomatyzatsiya-lidiv`

### Structure

1. **Segment tag** — coloured pill (e.g. "📊 Продажі / B2B")
2. **Title** — "[Role] [did X]. Тепер — [result]."
3. **Result block** — 3 metrics: Зекономлено (hours), Термін впровадження, Інструменти
4. **Ситуація** — 2–3 sentences describing the before state
5. **Цитата** — first-person quote from the client
6. **Що зробили** — 3 numbered steps (plain language, no jargon)
7. **Результат** — 1 paragraph on the after state
8. **Share bar** — Telegram, Threads, Copy link
9. **CTA block** — "Схожа ситуація?" → primary: аудит, secondary: дзвінок

### Case title format
`[Role] витрачав [X год/тиж] на [task]. Тепер — [new time].`

---

## Visual Design

### Theme
- Background: `#080808` (near black)
- Surface: `#0d0d0d`, `#111`, `#141414`, `#1a1a1a`
- Accent: `#ff6d3b` (orange — consistent with Life Builder OS brand)
- Text primary: `#ffffff`
- Text secondary: `#888`, `#666`, `#555`
- Borders: `#1a1a1a`, `#2a2a2a`

### Typography
- Font: Inter (system fallback: -apple-system, BlinkMacSystemFont)
- H1 home: 24px, weight 800, letter-spacing -0.4px
- H1 case: 22px, weight 800
- Body: 15px, line-height 1.6–1.7
- Labels: 11–12px, uppercase, letter-spacing 0.07em, color #444
- Result numbers: 22px, weight 800, color #ff6d3b

### Components
- Buttons: 10px border-radius, 14px padding vertical, full width on mobile
- Cards: `#141414` background, `#1e1e1e` border, 10px border-radius
- Active segment: `#ff6d3b` background, white text
- Section label: 11px uppercase, `#444`

### Mobile-first
- Max content width: 390px (phone), scales up gracefully
- All tap targets: min 44px height
- Buttons: full width on mobile
- 2-column grid for segments and tools, degrades gracefully to 1-column

---

## Content — Existing Assets

### Free tools → `/інструменти`
| Tool | Segment | Type | Status |
|---|---|---|---|
| Why Start AI | Продажі, Загальне | Quiz 5 min | Live (Gumroad/GitHub Pages) |
| AI or Automation | Власники, Загальне | Quiz 7 min | Live |
| AI Audit UA | Операції, HR, Загальне | Audit 7 min | Live |

### Paid products → `/продукти`
| Product | Segment | Status |
|---|---|---|
| Claude Onboarding | HR, Загальне | Live |
| Job Search Agent | Пошук роботи | Live |

### Cases — to be written
Minimum viable: 1 case per segment = 5 cases at launch.
Format: real or composite, first-person quote, specific numbers required.

### Newsletter
Existing Google Apps Script captures email. Value prop: "1 кейс автоматизації щотижня".
Platform TBD (currently email via GmailApp — sufficient for early stage).

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Astro | Static HTML output, markdown-based cases, interactive JS islands for segment filter, excellent SEO |
| Hosting | Vercel | Free tier, auto-deploy from GitHub, custom domain support |
| Domain | artem.org.ua | Already owned, consistent with @artem.org.ua brand |
| Email capture | Existing Google Apps Script | Already built, already handles P1/P5/P3 products |
| Calendly | Existing link | calendly.com/artem-org-ua/30min |
| Cases | Markdown files in `/src/content/cases/` | Easy to add new cases without touching code |
| Segment filter | Vanilla JS | No framework needed — simple class toggle + filter |
| Analytics | None at launch | Add later when traffic warrants |

---

## Launch Scope (MVP)

**In scope:**
- Home page with all 7 sections
- `/інструменти` page
- `/продукти` page
- `/кейси` listing page + 5 case pages (1 per segment)
- `/автоматизація` service page
- `/про` page
- Mobile-responsive
- Segment filter (JS)
- Newsletter email capture (connect to existing Apps Script)

**Out of scope for v1:**
- Blog / articles
- Search
- CMS admin panel
- Ukrainian/Russian language toggle
- Analytics dashboard
- SEO optimization (meta tags only, no content strategy yet)

---

## Open Questions (resolved)

- ✅ Brand: hybrid — Artem as personal brand wrapper, Life Builder OS products inside
- ✅ Primary goal: email capture via free tools; secondary: consultation booking
- ✅ Segment model: filter/anchor on home page, not separate pages
- ✅ Cases: individual pages with shareable URLs
- ✅ Service page: named "Автоматизація" not "Консультація"
