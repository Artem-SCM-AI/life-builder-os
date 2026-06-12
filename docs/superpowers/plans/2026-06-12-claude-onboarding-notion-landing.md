# Claude Onboarding Notion Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a public Notion landing page for the free "Claude Перше знайомство" workspace product — 8 content blocks matching the approved design spec.

**Architecture:** Single Notion page created under Life Builder OS HQ, populated block-by-block via Notion MCP. Page is shared publicly after build. All copy is final (from spec). Telegram channel button URL is the only open item — add as placeholder, fill in when channel handle is confirmed.

**Tech Stack:** Notion MCP (`mcp__plugin_marketing_notion__*`), Notion block API

**Spec:** `docs/superpowers/specs/2026-06-12-claude-onboarding-notion-landing-design.md`

---

## Pre-Flight Checklist

Before starting, verify:
- [ ] Telegram channel actual `t.me/` URL confirmed (dots not allowed in Telegram usernames — `@artem.org.ua` is not a valid handle). If not confirmed, use `https://t.me/PLACEHOLDER` and note it in the page.
- [ ] Notion MCP is connected (run `notion-fetch` on LBO HQ page ID `374d4d2e-2457-8105-b65b-cb4dc5fc5184` to verify access)

---

## Task 1: Create the page

**Goal:** Empty Notion page under LBO HQ with cover, icon, and title.

**Files:** Notion page — no local files.

- [ ] **Step 1: Create the page**

Call `notion-create-pages` with:
```json
{
  "parent": { "page_id": "374d4d2e-2457-8105-b65b-cb4dc5fc5184" },
  "icon": { "type": "emoji", "emoji": "⚡" },
  "cover": { "type": "external", "external": { "url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1500&q=80" } },
  "properties": {
    "title": [{ "text": { "content": "Claude. Налаштований під тебе." } }]
  }
}
```

Note: the cover URL is a dark tech photo from Unsplash — substitute with any dark solid-color image if preferred. Record the returned `page_id` for all subsequent steps.

- [ ] **Step 2: Verify**

Call `notion-fetch` on the new page ID. Confirm: title shows "Claude. Налаштований під тебе.", icon ⚡ visible, cover present.

- [ ] **Step 3: Commit page ID**

Save the new page URL to `hot.md` under Quick Refs:
```
- Claude Onboarding Notion page: [URL from step 1]
```

---

## Task 2: Hero text blocks

**Goal:** Eyebrow, subtitle, and two badge callouts below the cover.

- [ ] **Step 1: Add eyebrow + subtitle**

Call `notion-update-page` (append children) on the new page:
```json
{
  "children": [
    {
      "object": "block",
      "type": "paragraph",
      "paragraph": {
        "rich_text": [{ "type": "text", "text": { "content": "⚡ Claude · Безкоштовно" }, "annotations": { "bold": true, "color": "orange" } }]
      }
    },
    {
      "object": "block",
      "type": "paragraph",
      "paragraph": {
        "rich_text": [{ "type": "text", "text": { "content": "15 хвилин — і у тебе є персональний AI-асистент який знає хто ти, пам'ятає контекст, і вміє те що потрібно саме для твоєї роботи." }, "annotations": { "color": "gray" } }]
      }
    }
  ]
}
```

- [ ] **Step 2: Add two badge callouts**

Append two callout blocks:
```json
{
  "children": [
    {
      "object": "block",
      "type": "callout",
      "callout": {
        "icon": { "type": "emoji", "emoji": "🙌" },
        "color": "orange_background",
        "rich_text": [{ "type": "text", "text": { "content": "Без жодного IT досвіду" }, "annotations": { "bold": true } }]
      }
    },
    {
      "object": "block",
      "type": "callout",
      "callout": {
        "icon": { "type": "emoji", "emoji": "⏱" },
        "color": "default",
        "rich_text": [{ "type": "text", "text": { "content": "15 хв · одна команда" } }]
      }
    }
  ]
}
```

- [ ] **Step 3: Verify**

Fetch the page. Confirm eyebrow text in orange, subtitle in gray, two callout badges present.

---

## Task 3: Hook callouts

**Goal:** Two-callout main hook block (orange callout + gray callout).

- [ ] **Step 1: Add divider + two callouts**

```json
{
  "children": [
    { "object": "block", "type": "divider", "divider": {} },
    {
      "object": "block",
      "type": "callout",
      "callout": {
        "icon": { "type": "emoji", "emoji": "💡" },
        "color": "orange_background",
        "rich_text": [
          { "type": "text", "text": { "content": "Замість " } },
          { "type": "text", "text": { "content": "базового Клода" }, "annotations": { "bold": true } },
          { "type": "text", "text": { "content": " — " } },
          { "type": "text", "text": { "content": "прокачаний workspace" }, "annotations": { "bold": true } },
          { "type": "text", "text": { "content": " що знає хто ти, пам'ятає контекст між сесіями, і вміє те що потрібно саме для твоєї роботи." } }
        ]
      }
    },
    {
      "object": "block",
      "type": "callout",
      "callout": {
        "icon": { "type": "emoji", "emoji": "💰" },
        "color": "gray_background",
        "rich_text": [
          { "type": "text", "text": { "content": "І ще одне: правильний сетап " } },
          { "type": "text", "text": { "content": "економить токени" }, "annotations": { "bold": true } },
          { "type": "text", "text": { "content": ". Клод не витрачає їх щоразу на з'ясування хто ти і що тобі треба — ти витискаєш " } },
          { "type": "text", "text": { "content": "максимум з пакета на $20" }, "annotations": { "bold": true } },
          { "type": "text", "text": { "content": "." } }
        ]
      }
    }
  ]
}
```

- [ ] **Step 2: Verify**

Fetch page. Orange callout and gray callout both visible, bold text correct.

---

## Task 4: "Для кого це" — no-tech banner + role tags

**Goal:** H2 header, dark banner callout, role tags as inline-code paragraph.

- [ ] **Step 1: Add H2 + no-tech banner**

```json
{
  "children": [
    { "object": "block", "type": "divider", "divider": {} },
    {
      "object": "block",
      "type": "heading_2",
      "heading_2": {
        "rich_text": [{ "type": "text", "text": { "content": "Для кого це" } }]
      }
    },
    {
      "object": "block",
      "type": "callout",
      "callout": {
        "icon": { "type": "emoji", "emoji": "🙌" },
        "color": "gray_background",
        "rich_text": [
          { "type": "text", "text": { "content": "Жодного IT досвіду не потрібно\n" }, "annotations": { "bold": true } },
          { "type": "text", "text": { "content": "Якщо ти ніколи не чув слова \"термінал\" — " } },
          { "type": "text", "text": { "content": "це саме для тебе" }, "annotations": { "bold": true } },
          { "type": "text", "text": { "content": ". Весь процес — це розмова з Claude. Він запитує, ти відповідаєш, він налаштовує." } }
        ]
      }
    }
  ]
}
```

- [ ] **Step 2: Add role tags paragraph**

Each role as inline code, space-separated on one paragraph line:
```json
{
  "children": [
    {
      "object": "block",
      "type": "paragraph",
      "paragraph": {
        "rich_text": [
          { "type": "text", "text": { "content": "📣 SMM" }, "annotations": { "code": true } },
          { "type": "text", "text": { "content": "  " } },
          { "type": "text", "text": { "content": "📊 Маркетолог" }, "annotations": { "code": true } },
          { "type": "text", "text": { "content": "  " } },
          { "type": "text", "text": { "content": "💼 Продажник" }, "annotations": { "code": true } },
          { "type": "text", "text": { "content": "  " } },
          { "type": "text", "text": { "content": "🤝 Рекрутер" }, "annotations": { "code": true } },
          { "type": "text", "text": { "content": "  " } },
          { "type": "text", "text": { "content": "📦 SC менеджер" }, "annotations": { "code": true } },
          { "type": "text", "text": { "content": "  " } },
          { "type": "text", "text": { "content": "🛒 E-commerce" }, "annotations": { "code": true } },
          { "type": "text", "text": { "content": "  " } },
          { "type": "text", "text": { "content": "⚖️ Юрист" }, "annotations": { "code": true } },
          { "type": "text", "text": { "content": "  " } },
          { "type": "text", "text": { "content": "🏗️ Проєктний менеджер" }, "annotations": { "code": true } },
          { "type": "text", "text": { "content": "  " } },
          { "type": "text", "text": { "content": "🧾 Бухгалтер" }, "annotations": { "code": true } },
          { "type": "text", "text": { "content": "  " } },
          { "type": "text", "text": { "content": "🏪 Власник МСБ" }, "annotations": { "code": true } },
          { "type": "text", "text": { "content": "  " } },
          { "type": "text", "text": { "content": "✂️ Beauty & wellness" }, "annotations": { "code": true } },
          { "type": "text", "text": { "content": "  " } },
          { "type": "text", "text": { "content": "🍽️ HoReCa" }, "annotations": { "code": true } },
          { "type": "text", "text": { "content": "  " } },
          { "type": "text", "text": { "content": "💻 Фрілансер" }, "annotations": { "code": true } }
        ]
      }
    }
  ]
}
```

- [ ] **Step 3: Verify**

Fetch page. Gray banner with bold "Жодного IT досвіду не потрібно" visible. Role tags render as monospace chips.

---

## Task 5: "Що ти отримуєш" — feature grid

**Goal:** H2 + 2-column layout with 6 feature callouts (5 gray + 1 orange accent).

**Note:** Notion's `column_list` block wraps two `column` blocks. Each column contains 3 callout blocks.

- [ ] **Step 1: Add H2**

```json
{
  "children": [
    { "object": "block", "type": "divider", "divider": {} },
    {
      "object": "block",
      "type": "heading_2",
      "heading_2": {
        "rich_text": [{ "type": "text", "text": { "content": "Що ти отримуєш" } }]
      }
    }
  ]
}
```

- [ ] **Step 2: Add 2-column feature grid**

```json
{
  "children": [
    {
      "object": "block",
      "type": "column_list",
      "column_list": {
        "children": [
          {
            "object": "block",
            "type": "column",
            "column": {
              "children": [
                {
                  "type": "callout",
                  "callout": { "icon": { "type": "emoji", "emoji": "📄" }, "color": "gray_background",
                    "rich_text": [{ "type": "text", "text": { "content": "Персональний профіль\n" }, "annotations": { "bold": true } }, { "type": "text", "text": { "content": "Claude знає твоє ім'я, роль і поточну ціль — без пояснень щоразу" }, "annotations": { "color": "gray" } }] }
                },
                {
                  "type": "callout",
                  "callout": { "icon": { "type": "emoji", "emoji": "⚡" }, "color": "gray_background",
                    "rich_text": [{ "type": "text", "text": { "content": "Навички під твою роль\n" }, "annotations": { "bold": true } }, { "type": "text", "text": { "content": "SMM, маркетолог, рекрутер — кожен отримує свій набір навичок" }, "annotations": { "color": "gray" } }] }
                },
                {
                  "type": "callout",
                  "callout": { "icon": { "type": "emoji", "emoji": "🪝" }, "color": "gray_background",
                    "rich_text": [{ "type": "text", "text": { "content": "Автоматика\n" }, "annotations": { "bold": true } }, { "type": "text", "text": { "content": "Журнал сесій сам пишеться. PDF і Word читаються без конвертації" }, "annotations": { "color": "gray" } }] }
                }
              ]
            }
          },
          {
            "object": "block",
            "type": "column",
            "column": {
              "children": [
                {
                  "type": "callout",
                  "callout": { "icon": { "type": "emoji", "emoji": "🧠" }, "color": "gray_background",
                    "rich_text": [{ "type": "text", "text": { "content": "Пам'ять між сесіями\n" }, "annotations": { "bold": true } }, { "type": "text", "text": { "content": "Пам'ятає контекст між сесіями. Не треба повторювати хто ти" }, "annotations": { "color": "gray" } }] }
                },
                {
                  "type": "callout",
                  "callout": { "icon": { "type": "emoji", "emoji": "🔗" }, "color": "gray_background",
                    "rich_text": [{ "type": "text", "text": { "content": "Підключення Notion, Sheets, Telegram\n" }, "annotations": { "bold": true } }, { "type": "text", "text": { "content": "Claude читає таблиці і створює задачі прямо з розмови" }, "annotations": { "color": "gray" } }] }
                },
                {
                  "type": "callout",
                  "callout": { "icon": { "type": "emoji", "emoji": "🎯" }, "color": "orange_background",
                    "rich_text": [{ "type": "text", "text": { "content": "Перший результат одразу\n" }, "annotations": { "bold": true } }, { "type": "text", "text": { "content": "Демо під твою роль — прямо після налаштування" } }] }
                }
              ]
            }
          }
        ]
      }
    }
  ]
}
```

- [ ] **Step 3: Verify**

Fetch page. Two columns visible with 3 cards each. Last card (🎯) has orange background.

---

## Task 6: "Як це працює" — 3 steps

**Goal:** H2 + numbered list with 3 steps, italic video hint on step 2.

- [ ] **Step 1: Add H2 + 3 numbered items**

```json
{
  "children": [
    { "object": "block", "type": "divider", "divider": {} },
    {
      "object": "block", "type": "heading_2",
      "heading_2": { "rich_text": [{ "type": "text", "text": { "content": "Як це працює" } }] }
    },
    {
      "object": "block", "type": "numbered_list_item",
      "numbered_list_item": {
        "rich_text": [
          { "type": "text", "text": { "content": "Підпишись на Telegram-канал" }, "annotations": { "bold": true } },
          { "type": "text", "text": { "content": " — там у закріпленому пості лежить ZIP-архів з workspace" } }
        ]
      }
    },
    {
      "object": "block", "type": "numbered_list_item",
      "numbered_list_item": {
        "rich_text": [
          { "type": "text", "text": { "content": "Завантаж ZIP і відкрий у Claude" }, "annotations": { "bold": true } },
          { "type": "text", "text": { "content": " — розпакуй архів, відкрий папку в Claude." } }
        ],
        "children": [
          {
            "object": "block", "type": "paragraph",
            "paragraph": {
              "rich_text": [{ "type": "text", "text": { "content": "▶ відеоінструкція — у закріпленому пості каналу" }, "annotations": { "italic": true, "color": "gray" } }]
            }
          }
        ]
      }
    },
    {
      "object": "block", "type": "numbered_list_item",
      "numbered_list_item": {
        "rich_text": [
          { "type": "text", "text": { "content": "Напиши " }, "annotations": { "bold": true } },
          { "type": "text", "text": { "content": "/onboarding" }, "annotations": { "bold": true, "code": true } },
          { "type": "text", "text": { "content": " — Claude проведе тебе через 6 питань і налаштує все автоматично. ~15 хвилин." } }
        ]
      }
    }
  ]
}
```

- [ ] **Step 2: Verify**

Fetch page. Three numbered items. Step 2 has indented italic line below it.

---

## Task 7: Warning callout + CTA block

**Goal:** Yellow warning before CTA, then orange CTA callout with subscribe button.

- [ ] **Step 1: Add warning callout**

```json
{
  "children": [
    { "object": "block", "type": "divider", "divider": {} },
    {
      "object": "block", "type": "callout",
      "callout": {
        "icon": { "type": "emoji", "emoji": "⚠️" },
        "color": "yellow_background",
        "rich_text": [
          { "type": "text", "text": { "content": "Важливо перед стартом: " }, "annotations": { "bold": true } },
          { "type": "text", "text": { "content": "це працює тільки на платних тарифах Claude ($20/міс і вище). Безкоштовний план не підтримується. Якщо ти ще не підписаний — це перший крок." } }
        ]
      }
    }
  ]
}
```

- [ ] **Step 2: Add CTA callout**

```json
{
  "children": [
    {
      "object": "block", "type": "callout",
      "callout": {
        "icon": { "type": "emoji", "emoji": "⚡" },
        "color": "orange_background",
        "rich_text": [
          { "type": "text", "text": { "content": "Підпишись — і забирай\n" }, "annotations": { "bold": true } },
          { "type": "text", "text": { "content": "Підписуєшся на канал → відкриваєш закріплений пост → завантажуєш ZIP. Далі 15 хвилин і твій Claude знає хто ти.\n" } },
          { "type": "text", "text": { "content": "безкоштовно назавжди" }, "annotations": { "italic": true, "color": "gray" } }
        ]
      }
    }
  ]
}
```

- [ ] **Step 3: Add subscribe button**

```json
{
  "children": [
    {
      "object": "block",
      "type": "bookmark",
      "bookmark": {
        "url": "https://t.me/PLACEHOLDER",
        "caption": [{ "type": "text", "text": { "content": "👉 Підписатись на канал →" } }]
      }
    }
  ]
}
```

Replace `PLACEHOLDER` with the confirmed Telegram handle before publishing.

- [ ] **Step 4: Verify**

Fetch page. Yellow warning callout visible. Orange CTA callout below. Bookmark/button with Telegram link at bottom.

---

## Task 8: Publish + record URL

**Goal:** Make the page publicly accessible and record the URL.

- [ ] **Step 1: Share the page**

In Notion UI (MCP does not control sharing settings): open the page → Share → toggle "Share to web" → copy the public link.

- [ ] **Step 2: Update hot.md**

Edit `/Users/artem/Claude v 1.0/hot.md` — add to Quick Refs:
```
- Claude Onboarding landing page (Notion, public): [URL]
```

- [ ] **Step 3: Confirm Telegram URL**

If `PLACEHOLDER` is still in the button, note it as a blocker. The page should not be distributed until the button links to the real channel.

- [ ] **Step 4: Commit**

```bash
git add hot.md
git commit -m "docs: add Claude Onboarding Notion page URL to hot.md"
```
