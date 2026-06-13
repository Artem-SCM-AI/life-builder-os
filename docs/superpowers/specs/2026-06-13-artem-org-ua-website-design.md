# artem.org.ua — Website Design Spec

**Date:** 2026-06-13
**Status:** Spec approved — ready for implementation plan
**Domain:** artem.org.ua
**Audience:** Ukrainian market — 5 ICP segments
**Language:** Ukrainian (site content); English slugs for all URLs

---

## Goal

A segment-first hub that ICP visitors want to use and share with colleagues. Two success signals:
1. Visitor uses a free tool (quiz/audit) — AI Audit UA captures email at gate
2. Visitor shares a specific case page with a colleague ("це про тебе")

Primary conversion: Telegram channel subscription. Secondary: consultation booking (`/automation`).

---

## ICP

5 segments from `ref-artem-org-ua-icp-segments.md`:

| Segment | Pain hook | Primary tool |
|---|---|---|
| Продажі / Маркетинг | Ліди, звіти, контент — вручну | Why Start AI quiz |
| Операції / Фінанси | Інвойси, склад, виписки — вручну | AI Audit UA |
| HR / Підтримка | Рекрутинг, тікети, договори — вручну | AI Audit UA |
| Власники МСБ | Усе одразу — вручну | AI or Automation quiz |
| Шукаю роботу | CV, пошук, підготовка — вручну | AI Audit UA (has jobsearch category) |

Universal hook: **"Скільки годин на тиждень ти витрачаєш на роботу яку міг би не робити?"**

---

## Site Architecture

### URL Structure (English slugs, Ukrainian display)

| URL | Display name | Purpose |
|---|---|---|
| `/` | Головна | Hub — personal intro → hook → segments → tools → cases → Telegram → service teaser |
| `/tools` | Інструменти | Free tools: quizzes + audits. Tagged by segment. |
| `/products` | Продукти | Paid: Claude Onboarding, Job Search Agent. |
| `/cases` | Кейси | Case list with segment filter. |
| `/cases/[slug]` | — | Individual case page — shareable unit. |
| `/automation` | Автоматизація | AI service: problem → solution → numbers → Calendly. |
| `/about` | Про мене | Origin story + Telegram CTA. |

### Navigation (header)

```
artem.org.ua  |  Інструменти  |  Продукти  |  Кейси  |  Про мене  |  [Автоматизація →]
```

Note: "Продукти" added to nav — paid products were previously unreachable.

### Footer

```
© 2026 Артем Степаненко  ·  Threads  ·  Telegram  ·  LinkedIn  ·  eco.stepanenko@gmail.com
```

---

## Responsive Breakpoints

Three layouts: mobile, tablet/half-desktop (Mac), full desktop.

### Mobile — < 768px (default / base)
- Single column throughout
- Max content width: 390px, centered
- Buttons: full width
- Segment cards: 2-column grid (5th spans full)
- Tools: 2-column grid
- Nav: logo + CTA button only (hamburger or simplified)

### Tablet / Half-desktop — 768px–1199px (MacBook 13/14" at half screen)
- Max content width: 720px, centered
- Hero: centered text, max-width 600px
- Segment cards: 3-column grid
- Tools: 3-column grid
- Cases: 2-column grid
- Nav: full horizontal links visible

### Full desktop — ≥ 1200px (MacBook full, external monitor)
- Max content width: 1000px, centered
- Hero: centered text, max-width 680px
- Personal intro: horizontal layout (photo left, text right)
- Segment cards: 5-column single row
- Tools: 4-column grid
- Cases: 3-column grid
- Nav: full, with generous spacing

All sections use `max-width` container centered with `margin: 0 auto` and `padding: 0 20px` on mobile scaling to `padding: 0 40px` on desktop.

---

## Home Page — Section Flow

### 1. Personal intro
- Avatar / photo
- Name: Артем Степаненко
- Bio: "Будую AI-автоматизацію для тих хто не технар. [N]+ кейсів з українськими спеціалістами та бізнесом." — Artem fills in N.
- Social links: Threads, Telegram, LinkedIn

### 2. Hero
- H1: **"Скільки годин на тиждень ти витрачаєш на роботу яку міг би не робити?"**
- Sub: "Автоматизація та AI закривають це повністю. Без коду. Без технічного бекграунду."
- Primary CTA: "Пройти аудит — безкоштовно →" → `/tools` (shows AI Audit UA prominently)
- Secondary CTA: "Переглянути кейси" → `/cases`

### 3. Segment filter
- Label: "Обери свою ситуацію — покажу що підходить саме тобі"
- 5 cards (see breakpoints above for layout per screen size)
- **Default state:** show 2 featured tools + 2 featured cases unfiltered, with prompt "Обери сегмент щоб побачити своє"
- On click: filters sections 4 and 5; selected card highlighted in accent color
- URL anchor: `/#sales`, `/#ops`, `/#hr`, `/#owners`, `/#jobs`

### 4. Free tools (filtered by segment)
- Section title: "Інструменти · [Назва сегменту]" in accent
- Default (no segment): 2 featured tools
- Card: tool name, meta (тип · тривалість · безкоштовно), CTA "Пройти →"
- "Всі інструменти →" link to `/tools`

### 5. Cases (filtered by segment)
- Section title: "Кейси · [Назва сегменту]"
- Default (no segment): 2 featured cases
- Card: title, role tag, result number, "читати →"
- Each links to `/cases/[slug]`
- "Всі кейси →" link to `/cases`

### 6. Telegram CTA (replaces newsletter)
- Centered block with Telegram icon
- H: "Кейс автоматизації — щотижня в Telegram"
- Sub: "Конкретно, з числами, без жаргону. Підпишись і отримуй першим."
- CTA: "Підписатись на канал →" → Telegram channel link
- No email capture here — Telegram replaces newsletter entirely

### 7. Service teaser
- Dark card with accent border
- "Хочеш розібрати свій конкретний кейс?"
- Sub: "45 хв — розбираємо твої задачі. Йдеш з готовим планом автоматизації."
- CTA: "Записатись на дзвінок →" → Calendly (`calendly.com/artem-org-ua/30min` — confirm before launch)

---

## Case Page — `/cases/[slug]`

Primary shareable unit. Slug format: `[role]-[task]-[outcome]` in English/transliteration.
Example: `/cases/sdr-lead-collection`

### Structure

1. **Segment tag** — pill (e.g. "📊 Продажі / B2B")
2. **Title** — "[Роль] [робила X]. Тепер — [результат]."
3. **Result block** — 3 metrics: Зекономлено (години), Термін впровадження, Інструменти
4. **Ситуація** — 2–3 речення про стан "до"
5. **Цитата** — пряма мова від клієнта
6. **Що зробили** — 3 кроки, без жаргону
7. **Результат** — 1 абзац про стан "після"
8. **Share bar** — Telegram, Threads, Copy link
9. **CTA block** — "Схожа ситуація?" → primary: AI Audit UA, secondary: дзвінок

### Case title format
`[Роль] витрачав [X год/тиж] на [задачу]. Тепер — [новий час].`

### Content — Artem writes 5 cases (1 per segment) before launch.
Format: real or composite. First-person quote required. Specific numbers required.

---

## `/about` Page

- Origin story (ref: `ref-artem-origin-story.md`)
- Social links: Threads, Telegram, LinkedIn
- CTA at bottom: "Хочеш побудувати щось разом? Підпишись на Telegram →" + Calendly link

---

## Visual Design

### Color palette — ✅ White + Blue

| Token | Value |
|---|---|
| Background | `#ffffff` |
| Surface light | `#f8fafc`, `#f0f6ff` |
| Accent primary | `#1d4ed8` (blue) |
| Accent hover | `#1e3a8a` |
| Accent light bg | `#eff6ff`, `#dbeafe` |
| Text primary | `#0f172a` |
| Text secondary | `#475569` |
| Text muted | `#64748b` |
| Borders | `#e2e8f0`, `#cbd5e1` |
| Card shadow | `0 1px 4px rgba(0,0,0,.05)` |

### Typography — ✅ Inter
- Font: Inter (system fallback: -apple-system, BlinkMacSystemFont)
- Practical, clean, excellent Ukrainian support
- No decorative heading font

### Animations — ✅ Minimal (fade-in on scroll only)
- Fade-in on scroll for sections — subtle, doesn't distract
- Hover: border-color transition on cards
- No counter animations, no scale effects
- Priority: functional and comfortable to use

### Button alignment rule — ✅
All cards with buttons use `display: flex; flex-direction: column` with `margin-top: auto` on the button — ensures buttons align horizontally across card rows regardless of text length.

### Confirmed tokens (from approved mockup)
- Background: `#080808`
- Surface layers: `#0d0d0d` / `#111` / `#141414` / `#1a1a1a`
- Text primary: `#ffffff`
- Text secondary: `#888` / `#666` / `#555`
- Borders: `#1a1a1a` / `#2a2a2a`
- Border-radius cards: 10px
- Border-radius buttons: 8–10px
- Body font: 15px, line-height 1.6–1.7
- Labels: 11–12px uppercase, letter-spacing 0.07em

---

## Content — Existing Assets

### Free tools → `/tools`
| Tool | Segment | Type | Status |
|---|---|---|---|
| Why Start AI | Продажі, Загальне | Quiz 5 min | Live |
| AI or Automation | Власники, Загальне | Quiz 7 min | Live |
| AI Audit UA | Операції, HR, Шукаю роботу, Загальне | Audit 7 min | Live — has all 5 role categories incl. jobsearch |

### Paid products → `/products`
| Product | Segment | Status |
|---|---|---|
| Claude Onboarding | Загальне | Live |
| Job Search Agent | Шукаю роботу | Live |

### Cases
Minimum viable: 1 per segment = 5 cases. **Artem writes before launch.**

### Telegram channel
Replaces newsletter. Channel link TBD — add before launch.

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Astro | Static HTML, markdown cases, JS islands for segment filter, SEO |
| Hosting | Vercel | Free tier, auto-deploy from GitHub, custom domain |
| Domain | artem.org.ua | Owned, consistent with brand |
| Email capture | Existing Google Apps Script | Quizzes already send to Sheets — no changes needed |
| Email delivery | GmailApp (current) → Mailchimp at >150 subs | Hard limit 100 emails/day on free Gmail |
| Calendly | `calendly.com/artem-org-ua/30min` | Confirm URL before launch |
| Cases | Markdown files `/src/content/cases/` | Add new cases without touching code |
| Segment filter | Vanilla JS | Simple class toggle, no framework |
| Analytics | None at launch | Add when traffic warrants |

---

## Launch Scope (MVP)

**In scope:**
- All 7 home page sections
- `/tools`, `/products`, `/cases`, `/cases/[slug]` × 5, `/automation`, `/about`
- Responsive: mobile + tablet + desktop
- Segment filter (JS)
- Telegram channel CTA
- 5 cases (Artem writes content)

**Out of scope for v1:**
- Search
- CMS admin panel
- Analytics
- SEO content strategy (meta tags only)
- Blog / articles

---

## Open Items Before Implementation

- [x] Color palette: White + Blue (`#1d4ed8`)
- [x] Font: Inter
- [x] Animations: fade-in on scroll only
- [ ] Telegram channel link
- [ ] Calendly URL confirmation
- [ ] Artem writes 5 cases
- [ ] Actual photo for avatar
- [ ] Count [N] for "N+ кейсів" in bio

---

## Resolved Decisions

- ✅ Brand: Artem as personal brand, Life Builder OS products inside
- ✅ Primary conversion: Telegram channel (not email newsletter)
- ✅ Segment model: filter/anchor on home page, English URL anchors
- ✅ Default state: 2 featured tools + 2 featured cases, prompt to pick segment
- ✅ Cases: individual pages, English slugs
- ✅ "Автоматизація" not "Консультація"
- ✅ HR segment → AI Audit UA (not Claude Onboarding)
- ✅ Шукаю роботу → AI Audit UA (has built-in jobsearch category)
- ✅ /about CTA → Telegram channel
- ✅ URL slugs: English throughout, Ukrainian display labels only
- ✅ Responsive: 3 breakpoints specified
