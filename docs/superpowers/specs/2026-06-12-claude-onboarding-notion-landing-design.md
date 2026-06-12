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
- **Gate:** Subscribe to Telegram channel (handle TBD — confirm actual `t.me/` URL, dots not allowed in Telegram usernames)
- **Delivery:** ZIP file in pinned post of the channel
- **Video guide:** also in pinned post (referenced in Step 2 on the landing page)

---

## Page Structure — 6 Sections

### 1. Hero Block

Notion implementation: dark full-width **page cover** (solid dark color or dark image) + page icon `⚡` + page title as H1. The cover sits at the top; text blocks sit below it in the standard Notion layout — there is no text overlay on the cover.

- **Page icon:** ⚡
- **Page cover:** solid dark (`#0d0d0d` equivalent — use a dark image or Notion's darkest cover option)
- **H1 title:** `Claude Code. Налаштований під тебе.`
- **Eyebrow** (small text above H1, styled as a callout or colored text block): `⚡ Claude Code · Безкоштовно`
- **Subtitle** (paragraph below H1): `15 хвилин — і у тебе є персональний AI-асистент який знає хто ти, пам'ятає контекст, і вміє те що потрібно саме для твоєї роботи.`
- **Badge** (inline callout or bold paragraph): `⏱ 15 хв · одна команда`

### 2. Callout — Main Hook

Two consecutive callout blocks (Notion doesn't support dividers inside a single callout).

**Callout 1** — orange background:
> Замість **базового Клода** — **прокачаний workspace** що знає хто ти, пам'ятає контекст між сесіями, і вміє те що потрібно саме для твоєї роботи.

**Callout 2** — default/light background, smaller feel:
> І ще одне: правильний сетап **економить токени**. Клод не витрачає їх щоразу на з'ясування хто ти і що тобі треба — ти витискаєш **максимум з пакета на $20**.

### 3. Feature Grid — "Що ти отримуєш"

**H2:** `Що ти отримуєш`

2-column layout (Notion columns). Each column contains 3 callout blocks. Notion's darkest native callout background is "Gray" — use that for the dark card effect. Last card uses "Orange" background as accent.

| Emoji | Title | Description |
|-------|-------|-------------|
| 📄 | Персональний CLAUDE.md | Клод знає твоє ім'я, роль і поточну ціль — без пояснень щоразу |
| 🧠 | Memory-профіль | Пам'ятає контекст між сесіями. Не треба повторювати хто ти |
| ⚡ | Skills під твою роль | SMM, маркетолог, рекрутер — кожен отримує свій набір навичок |
| 🔗 | MCP: Notion, Sheets, Telegram | Клод читає таблиці і створює задачі прямо з розмови |
| 🪝 | Автоматичні хуки | Журнал сесій сам пишеться. PDF і Word читаються без конвертації |
| 🎯 *(orange accent)* | Демо під твою роль | Перший реальний результат — одразу після налаштування |

### 4. Steps — "Як це працює"

**H2:** `Як це працює`

Numbered list. Each item: bold title + plain text description on next line.

1. **Підпишись на Telegram-канал** — там у закріпленому пості лежить ZIP-архів з workspace
2. **Завантаж ZIP і відкрий у Claude Code** — розпакуй архів, відкрий папку в Claude Code. *(окремий рядок курсивом:* `▶ відеоінструкція — у закріпленому пості каналу`*)*
3. **Напиши `/onboarding`** — Claude проведе тебе через 6 питань і налаштує все автоматично. ~15 хвилин.

### 5. Role Tags — "Для кого це"

**H2:** `Для кого це`

Notion doesn't have pill tags natively. Implementation: use `inline code` formatting for each role on a single paragraph line — renders as monospace chips with gray background.

13 roles: `📣 SMM` `📊 Маркетолог` `💼 Продажник` `🤝 Рекрутер` `📦 SC менеджер` `🛒 E-commerce` `⚖️ Юрист` `🏗️ PM` `🧾 Бухгалтер` `🏪 МСБ` `✂️ Beauty` `🍽️ HoReCa` `💻 Фрілансер`

### 6. CTA Block

**H2:** (none — let the callout speak)

Large callout block, orange background, centered text (use a Notion callout with orange color).

- **Title line (bold):** `Підпишись — і забирай`
- **Body:** `Підписуєшся на канал → відкриваєш закріплений пост → завантажуєш ZIP. Далі 15 хвилин і твій Claude знає хто ти.`
- **Button:** Notion button block → links to Telegram channel. Label: `Підписатись на канал →`
- **Footer line (small/italic):** `безкоштовно назавжди`

---

## Notion Constraints Summary

| Design intent | Notion reality | Workaround |
|--------------|----------------|------------|
| `#0d0d0d` dark cards | No custom hex colors | Use "Gray" callout background |
| Orange accent card | ✓ Native | "Orange" callout background |
| Dark hero with text overlay | Not possible | Page cover + text blocks below |
| Pill/tag chips | No native tags | `inline code` formatting |
| Divider inside callout | Not supported | Two separate callout blocks |
| Custom button styling | Limited | Notion button block (available in 2024+) |

---

## Open Items Before Build

| Item | Action needed |
|------|---------------|
| Telegram channel URL | Confirm actual `t.me/` handle — dots not allowed in Telegram usernames |
| ZIP uploaded to pinned post | Upload `tool-claude-first/` as ZIP after confirming channel |
| Video guide | Record before publishing the page |
| ZIP product spec | See `docs/superpowers/specs/2026-06-11-claude-code-first-onboarding-design.md` |
