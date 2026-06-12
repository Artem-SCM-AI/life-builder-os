# Design Spec — Claude Onboarding Notion Landing Page

**Date:** 2026-06-12
**Status:** Approved
**Author:** Artem Stepanenko

---

## Overview

A Notion page that serves as a landing page for the "Claude Перше знайомство" product. Target: cold/new Ukrainian-speaking audience (managers, marketers, SMM, freelancers) — **zero IT experience assumed**. Distribution model: free lead magnet — subscribe to Telegram channel → get ZIP from pinned post.

**Promised outcome:** людина підписується на канал, завантажує ZIP, запускає `/onboarding` і за 15 хв отримує прокачаний Claude workspace.

**Key positioning rules:**
- Never say "Claude Code" — always "Claude". "Code" alienates non-technical users.
- No technical jargon in user-facing copy: no "CLAUDE.md", "memory", "hooks", "skills", "MCP" — use plain Ukrainian equivalents.

---

## Distribution Model

- **Price:** Free
- **Gate:** Subscribe to Telegram channel (handle TBD — confirm actual `t.me/` URL, dots not allowed in Telegram usernames)
- **Delivery:** ZIP file in pinned post of the channel
- **Video guide:** also in pinned post (referenced in Step 2 on the landing page)
- **Requirement:** Paid Claude plan ($20/month+) — free plan not supported. Surfaced prominently before CTA.

---

## Page Structure — 8 Blocks

### 1. Hero Block

Notion implementation: dark full-width **page cover** + page icon `⚡` + H1 title. Text blocks sit below the cover — no text overlay on the cover image.

- **Page icon:** ⚡
- **Page cover:** solid dark image (Notion's darkest cover option)
- **Eyebrow** (small colored text above H1): `⚡ Claude · Безкоштовно`
- **H1 title:** `Claude. Налаштований під тебе.`
- **Subtitle:** `15 хвилин — і у тебе є персональний AI-асистент який знає хто ти, пам'ятає контекст, і вміє те що потрібно саме для твоєї роботи.`
- **Badges (two inline callouts):**
  - `🙌 Без жодного IT досвіду` — orange-tinted background
  - `⏱ 15 хв · одна команда` — default background

### 2. Callout — Main Hook (two consecutive blocks)

**Callout 1** — orange background (`#fff3ee`, orange left border):
> Замість **базового Клода** — **прокачаний workspace** що знає хто ти, пам'ятає контекст між сесіями, і вміє те що потрібно саме для твоєї роботи.

**Callout 2** — gray/default background (smaller feel, secondary point):
> І ще одне: правильний сетап **економить токени**. Клод не витрачає їх щоразу на з'ясування хто ти і що тобі треба — ти витискаєш **максимум з пакета на $20**.

### 3. "Для кого це" — No-Tech Banner + Role Tags

**H2:** `Для кого це`

**Dark banner block** (callout with dark/gray background, full width) — comes first, before the role tags:

> 🙌 **Жодного IT досвіду не потрібно**
> Якщо ти ніколи не чув слова "термінал" — **це саме для тебе**. Весь процес — це розмова з Claude. Він запитує, ти відповідаєш, він налаштовує.

**Role tags** (below the banner). Notion workaround: `inline code` formatting for each role on a single wrapping paragraph.

13 roles: `📣 SMM` `📊 Маркетолог` `💼 Продажник` `🤝 Рекрутер` `📦 SC менеджер` `🛒 E-commerce` `⚖️ Юрист` `🏗️ Проєктний менеджер` `🧾 Бухгалтер` `🏪 Власник МСБ` `✂️ Beauty & wellness` `🍽️ HoReCa` `💻 Фрілансер`

### 4. "Що ти отримуєш" — Feature Grid

**H2:** `Що ти отримуєш`

2-column layout (Notion columns). 3 callout blocks per column. Notion native backgrounds: "Gray" for dark cards, "Orange" for accent card.

| Emoji | Title | Description |
|-------|-------|-------------|
| 📄 | Персональний профіль | Claude знає твоє ім'я, роль і поточну ціль — без пояснень щоразу |
| 🧠 | Пам'ять між сесіями | Пам'ятає контекст між сесіями. Не треба повторювати хто ти |
| ⚡ | Навички під твою роль | SMM, маркетолог, рекрутер — кожен отримує свій набір навичок |
| 🔗 | Підключення Notion, Sheets, Telegram | Claude читає таблиці і створює задачі прямо з розмови |
| 🪝 | Автоматика | Журнал сесій сам пишеться. PDF і Word читаються без конвертації |
| 🎯 *(orange accent)* | Перший результат одразу | Демо під твою роль — прямо після налаштування |

### 5. "Як це працює" — 3 Steps

**H2:** `Як це працює`

Numbered list. Bold title + plain text on next line.

1. **Підпишись на Telegram-канал** — там у закріпленому пості лежить ZIP-архів з workspace
2. **Завантаж ZIP і відкрий у Claude** — розпакуй архів, відкрий папку в Claude.
   *(italic line below:* `▶ відеоінструкція — у закріпленому пості каналу`*)*
3. **Напиши `/onboarding`** — Claude проведе тебе через 6 питань і налаштує все автоматично. ~15 хвилин.

**Note:** Never mention "Claude Code" — just "Claude". Installation = Claude desktop app (claude.ai/code), explained in the video guide.

### 6. Warning Callout — Paid Plan Required

Yellow callout block (`#fef9c3` background, yellow left border). Placed **between steps and CTA** — cannot be missed before clicking subscribe.

> ⚠️ **Важливо перед стартом:** це працює тільки на платних тарифах Claude ($20/міс і вище). Безкоштовний план не підтримується. Якщо ти ще не підписаний — це перший крок.

### 7. CTA Block

Large callout, orange background, centered.

- **Bold title:** `Підпишись — і забирай`
- **Body:** `Підписуєшся на канал → відкриваєш закріплений пост → завантажуєш ZIP. Далі 15 хвилин і твій Claude знає хто ти.`
- **Button:** Notion button block → Telegram channel link. Label: `Підписатись на канал →`
- **Footer (italic):** `безкоштовно назавжди`

---

## Notion Constraints Summary

| Design intent | Notion reality | Workaround |
|--------------|----------------|------------|
| `#0d0d0d` dark cards | No custom hex colors | "Gray" callout background |
| Orange accent card | ✓ Native | "Orange" callout background |
| Dark hero with text overlay | Not possible | Page cover + text blocks below |
| Pill/tag chips | No native tags | `inline code` formatting |
| Divider inside callout | Not supported | Two separate callout blocks |
| Custom button styling | Limited | Notion button block (2024+) |

---

## Open Items Before Build

| Item | Action needed |
|------|---------------|
| Telegram channel URL | Confirm actual `t.me/` handle — dots not allowed in Telegram usernames |
| ZIP uploaded to pinned post | Upload `tool-claude-first/` as ZIP after confirming channel |
| Video guide | Record before publishing the page |
| ZIP product spec | See `docs/superpowers/specs/2026-06-11-claude-code-first-onboarding-design.md` |
