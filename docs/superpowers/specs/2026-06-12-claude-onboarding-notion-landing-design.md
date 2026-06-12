# Design Spec — Claude Onboarding Notion Landing Page

**Date:** 2026-06-12
**Status:** Approved
**Author:** Artem Stepanenko

---

## Overview

A Notion page that serves as a landing page for the "Claude Code Перше знайомство" product. Target: cold/new Ukrainian-speaking audience (managers, marketers, SMM, freelancers). Distribution model: free lead magnet — subscribe to Telegram channel → get ZIP from pinned post.

**Promised outcome:** людина підписується на канал, завантажує ZIP, запускає `/onboarding` і за 15 хв отримує прокачаний Claude workspace.

---

## Distribution Model

- **Price:** Free
- **Gate:** Subscribe to Telegram channel `@artem.org.ua`
- **Delivery:** ZIP file in pinned post of the channel
- **Video guide:** also in pinned post (referenced on the landing page)

---

## Page Structure — 6 Sections

### 1. Hero Block
Dark (`#0d0d0d`) full-width cover block.

- **Eyebrow:** `⚡ Claude Code · Безкоштовно`
- **Title:** `Claude Code. Налаштований під тебе.`
- **Subtitle:** `15 хвилин — і у тебе є персональний AI-асистент який знає хто ти, пам'ятає контекст, і вміє те що потрібно саме для твоєї роботи.`
- **Badge:** `⏱ 15 хв · одна команда · безкоштовно`
- Orange accent color: `#ff6d3b`

### 2. Callout — Main Hook
Orange left-border callout block (`#fff3ee` background).

**Text:**
> Замість **базового Клода** — **прокачаний workspace** що знає хто ти, пам'ятає контекст між сесіями, і вміє те що потрібно саме для твоєї роботи. Маркетолог, рекрутер, фрілансер — кожен отримує своє.

**Token note** (separated by internal divider):
> І ще одне: правильний сетап **економить токени**. Клод не витрачає їх щоразу на з'ясування хто ти і що тобі треба — ти витискаєш **максимум з пакета на $20**.

### 3. Feature Grid — "Що ти отримуєш"
2-column dark card grid (`#0d0d0d` cards). 6 cards total — last one orange accent (`#ff6d3b`).

| Emoji | Title | Description |
|-------|-------|-------------|
| 📄 | Персональний CLAUDE.md | Клод знає твоє ім'я, роль і поточну ціль — без пояснень щоразу |
| 🧠 | Memory-профіль | Пам'ятає контекст між сесіями. Не треба повторювати хто ти |
| ⚡ | Skills під твою роль | SMM, маркетолог, рекрутер — кожен отримує свій набір навичок |
| 🔗 | MCP: Notion, Sheets, Telegram | Клод читає таблиці і створює задачі прямо з розмови |
| 🪝 | Автоматичні хуки | Журнал сесій сам пишеться. PDF і Word читаються без конвертації |
| 🎯 | Демо під твою роль *(accent)* | Перший реальний результат — одразу після налаштування |

### 4. Steps — "Як це працює"
3 numbered steps, divider between each.

1. **Підпишись на Telegram-канал** — там у закріпленому пості лежить ZIP-архів з workspace
2. **Завантаж ZIP і відкрий у Claude Code** — розпакуй архів, відкрий папку в Claude Code. + grey pill: `▶ відеоінструкція — у закріпленому пості каналу`
3. **Напиши `/onboarding`** — Claude проведе тебе через 6 питань і налаштує все автоматично. ~15 хвилин.

**Note:** No mention of VS Code. Installation = Claude Code desktop app (claude.ai/code).

### 5. Role Tags — "Для кого це"
Pill tags, wrapping row. 13 roles:

📣 SMM / контент-менеджер · 📊 Digital маркетолог · 💼 Продажник · 🤝 Рекрутер · 📦 SC менеджер · 🛒 E-commerce власник · ⚖️ Юрист · 🏗️ Проєктний менеджер · 🧾 Бухгалтер · 🏪 Власник МСБ · ✂️ Beauty & wellness · 🍽️ HoReCa · 💻 Фрілансер

### 6. CTA Block
Dark block (`#0d0d0d`), centered.

- **Eyebrow:** `Безкоштовно · ZIP у закріпленому пості`
- **Title:** `Підпишись — і забирай`
- **Subtitle:** `Підписуєшся на канал → відкриваєш закріплений пост → завантажуєш ZIP. Далі 15 хвилин і твій Claude знає хто ти.`
- **Button:** `Підписатись на канал →` (orange, links to Telegram channel)
- **Note:** `@artem.org.ua · безкоштовно назавжди`

---

## Notion Implementation Notes

- **Hero:** Notion page cover (full-width dark image or solid color) + H1 title with page icon ⚡
- **Feature grid:** 2-column layout with callout blocks styled dark (Notion has limited dark styling — use dark gray background callouts)
- **Step numbers:** Numbered list with bold titles + plain text description
- **Role tags:** Comma-separated text or small callout chips — Notion doesn't have pill tags natively; use inline code formatting as workaround
- **CTA:** Callout block with button-style bookmark embed or styled link

---

## ZIP Contents

The ZIP file linked in the pinned Telegram post = `tool-claude-first/` directory:

```
claude-first/
├── README.md
├── CLAUDE.md
├── .claude/
│   ├── settings.json
│   └── skills/
│       ├── onboarding.md
│       └── session-journal.md
├── memory/
│   ├── MEMORY.md
│   └── user_profile.md
├── journal/
├── mcp-guides/
├── .mcp.json
└── setup-todo.md
```

---

## Open Items Before Build

| Item | Status |
|------|--------|
| Telegram channel link for CTA button | Need to confirm @artem.org.ua link |
| ZIP uploaded to Telegram pinned post | To do |
| Video guide recorded | To do |
| Notion page created | To do (this spec → implementation) |
