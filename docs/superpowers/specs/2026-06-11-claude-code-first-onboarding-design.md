# Design Spec — Claude Code Перше знайомство

**Date:** 2026-06-11
**Status:** Approved
**Author:** Artem Stepanenko

---

## Overview

A Ukrainian-market product that takes a non-technical or semi-technical person from zero to a personalized Claude Code workspace in ~15 minutes. The core mechanic is a live onboarding skill: the user types `/onboarding`, Claude conducts an interview (6–7 questions), and produces a workspace configured to their role, goals, and tools.

**Promised outcome:** "Після цього у тебе є setup на рівні Артема — той самий рівень з якого він будує все."

The experience is conversational, not form-like. Each answer shapes the next question. The user never selects skills from a list — Claude selects and explains.

---

## Prerequisites

Before running `/onboarding` the user must have:

1. **Claude Code desktop app installed** — download at claude.ai/code
2. **The repo cloned or ZIP extracted** to a local folder

The README covers this in 3 steps. No other setup required before onboarding.

---

## Product Architecture

### Two components

**Component 1 — One-time product ($9)**
A ZIP/repo with a workspace skeleton. The centerpiece is the `onboarding` skill. Clone repo → open Claude Code → type `/onboarding` → Claude handles the rest.

**Component 2 — Subscription ($5/month via Tribute)**
A private Telegram channel. Biweekly: 1 Claude Code feature + 1 practical use case on that feature. Content generated via Claude pipeline (Artem selects topic, Claude drafts, Artem approves, posts). Tribute handles payment, invite links, and automatic removal on expiry.

### Customer journey

```
Telegram post (@artem.org.ua)
  → payment $9 (WayForPay or Gumroad — see Open Decisions)
  → ZIP delivered by email
  → prerequisites check → clone repo → Claude Code → /onboarding (~15 min)
  → personalized workspace ready
  → digest subscription offer at end of onboarding
  → Tribute → $5/month → private Telegram channel
```

---

## Target Audience

**Primary (A):** Non-technical — managers, entrepreneurs, freelancers who have never used a terminal.

**Secondary (B):** Semi-technical — people who can install software and know what a terminal is but are not comfortable in it.

Both Ukrainian-speaking. Not part of the Life Builder OS / English funnel.

---

## Skill Architecture

Skills split into two layers: **universal** (everyone gets them) and **role bundle** (assigned by profession).

### Universal skills (all users)

| Type | Skill | What it does |
|------|-------|-------------|
| Workflow | `using-superpowers` | Meta-skill — activates the system |
| Workflow | `brainstorming` | Structures any creative or build task before Claude starts |
| Workflow | `writing-plans` | Breaks multi-step projects into ordered tasks |
| Workflow | `verification-before-completion` | Claude checks output before marking done |
| Workflow | `writing-skills` | User can create custom skills for their own recurring tasks |
| Content | `draft-content` | Drafts any text — emails, reports, posts, proposals |
| Research | `deep-research` | Deep research on any topic |
| Hook | `session-journal` *(custom)* | **Stop hook** — auto-writes journal entry when session ends |
| Hook | `markitdown` *(custom)* | **PreToolUse hook** — auto-converts PDF/Word/Excel to Markdown before Claude reads |

The two hooks are not skills invoked by the user — they run automatically via `.claude/settings.json`.

### Role bundles (assigned by profession at Q2)

**Bundle A — Content & Brand**
*For: Продажник, Digital маркетолог, SMM, Інфобізнесмен, Ріелтор, Beauty & wellness, HoReCa, Фрілансер/консультант*

`brand-voice` · `content-creation` · `email-sequence`

**Bundle B — Strategy & Analysis**
*For: Закупівельник, SC менеджер, Проєктний менеджер, E-commerce власник, Amazon seller, Власник МСБ*

`competitive-brief` · `campaign-plan`

**Bundle C — Operations**
*For: Логіст/диспетчер, Бухгалтер, Рекрутер, HR менеджер, Керівник підтримки, Юрист*

`systematic-debugging`

Some roles span two bundles. Assignment:

| Role | Bundles |
|------|---------|
| Продажник | A |
| Digital маркетолог | A + B |
| SMM / контент-менеджер | A |
| Інфобізнесмен | A + B |
| Ріелтор | A + B |
| Закупівельник | B + C |
| Логіст / диспетчер | C |
| SC менеджер | B + C |
| Бухгалтер | C |
| Проєктний менеджер | B + C |
| Рекрутер | A + C |
| HR менеджер | A + C |
| Керівник підтримки | C |
| Юрист | B + C |
| E-commerce власник | B |
| Amazon seller | A + B |
| Власник МСБ | A + B |
| HoReCa / ресторан | A |
| Beauty & wellness | A |
| Фрілансер / консультант | A + B |

---

## MCP Services

Four services. GitHub is conditional — only offered if relevant to role. Each has a **skip option** — skipped items go to `setup-todo.md`.

| Service | Condition | What it enables |
|---------|-----------|----------------|
| **Notion** | Always | Claude creates tasks and pages directly from conversation |
| **Google Workspace** | Always | Claude reads/writes Sheets, Docs, Gmail |
| **Telegram** | Always | Claude reads/sends Telegram messages |
| **GitHub** | Only if role involves projects, code, or file management | Version control and cloud storage for projects |

Each guide includes: what this enables specifically for your role, where to get the token (3 steps max), one verification command.

---

## Onboarding Skill — Flow

**Total: 6 phases, 7 questions (1 language + 6 content). ~15 minutes.**

### Phase 0 — Language (1 question, always first)

> "Привіт! Я налаштую твій персональний Claude Code workspace — займе ~15 хвилин. Якою мовою спілкуватись — **українська** чи **англійська**?"

All subsequent communication in the chosen language.

---

### Phase 1 — Identity (2 questions)

| # | Question | Output |
|---|----------|--------|
| Q1 | Як тебе звати? | `name` → CLAUDE.md + memory/user_profile.md |
| Q2 | Яка твоя роль? *(numbered list of 20 roles in 4 groups, or free text)* | `profession` → selects role bundle + determines GitHub offer + selects demo task |

---

### Phase 2 — Goals & Use Cases (2 questions)

| # | Question | Output |
|---|----------|--------|
| Q3 | Яка твоя головна ціль на найближчі 3 місяці? | `current_goal` → memory/user_profile.md |
| Q4 | Ось топ-7 задач для **[role]** — обери що актуально. *(role-specific list generated from role bundles)* | `use_cases` → memory/user_profile.md, narrows demo task |

Q4 does not re-confirm the skill bundle — that is already fixed by Q2. Q4 populates memory with specific context and narrows which demo task Claude picks in Phase 5.

---

### Phase 3 — Tools (1–2 questions)

| # | Question | Condition | Output |
|---|----------|-----------|--------|
| Q5 | Що з цього вже використовуєш? *(Notion / Google Sheets / Google Docs / Telegram / нічого)* | Always | MCP priority list (GitHub excluded here — see Q6) |
| Q6 | Є публічні профілі? *(LinkedIn, Instagram, Telegram channel — лінки якщо є)* | Only if role is in Bundle A | brand context in memory/user_profile.md |

---

### Phase 4 — Automatic setup (no questions)

Claude announces and executes in sequence:

```
✓ Генерую CLAUDE.md (мова, ім'я, роль, ціль, правила)
✓ Створюю memory/user_profile.md
✓ Встановлюю universal скіли: [list]
✓ Встановлюю [Bundle A/B/C] скіли для [role]: [list]
✓ Налаштовую session-journal Stop hook
✓ Налаштовую MarkItDown PreToolUse hook
```

Then MCP — one at a time, with skip option:

> "Підключаємо Notion. Claude зможе створювати задачі і сторінки прямо з нашої розмови. Готовий підключити зараз? **[Так]** / **[Пропустити — зроблю пізніше]**"

- **Так** → step-by-step instructions (token location → paste → verify)
- **Пропустити** → appends to `setup-todo.md` with link to relevant guide

GitHub offered only if role bundle includes it (see MCP table above).

If /onboarding is run a second time: Claude detects existing CLAUDE.md and memory, asks "Оновити налаштування чи почати з нуля?" — does not overwrite without confirmation.

---

### Phase 5 — Demo (scoped by role)

Claude does not ask "give me any task." It picks a specific 2-minute demo task based on role and confirmed use cases from Q4:

| Role | Demo task |
|------|-----------|
| Продажник | Draft a cold outreach email for one prospect |
| Digital маркетолог | Build a 1-week content calendar for one channel |
| SMM / контент-менеджер | Write one post in the user's tone of voice |
| Інфобізнесмен | Outline a 5-email welcome sequence |
| Ріелтор | Write a property listing description |
| Закупівельник | Create a supplier comparison template |
| Логіст / диспетчер | Draft a shipment delay notification |
| SC менеджер | Build a vendor scorecard template |
| Бухгалтер | Structure a monthly expense summary |
| Проєктний менеджер | Create a project kickoff checklist |
| Рекрутер | Write a job description for one role |
| HR менеджер | Draft an onboarding checklist for new hires |
| Керівник підтримки | Create an FAQ template for top 5 questions |
| Юрист | Summarize key clauses from a contract (uses MarkItDown) |
| E-commerce власник | Generate a reorder alert template for top SKUs |
| Amazon seller | Write A+ content bullet points for one product |
| Власник МСБ | Draft a one-page business summary |
| HoReCa / ресторан | Write 3 Instagram captions for this week |
| Beauty & wellness | Write a client follow-up message after appointment |
| Фрілансер / консультант | Draft a project proposal for one service |

> "Зараз покажу як це все працює. Ось задача на 2 хвилини під твою роль: **[task]**. Підтвердь або дай свій варіант."

---

### Phase 6 — Finish + offer

```
Твій workspace готовий:
→ CLAUDE.md персоналізований під тебе
→ memory/ з профілем і ціллю
→ [N] скілів встановлено
→ [N] MCP підключено / [N] у setup-todo.md

Раз на 2 тижні — нова фіча Claude Code + реальний кейс.
$5/міс → [Tribute link]
```

---

## Adaptation Logic

```
Q2 (role) → role bundle → skills installed
Q2 (role) → whether GitHub is offered
Q2 (role) → whether Q6 (brand profiles) is asked
Q2 (role) → demo task pool (Phase 5)
Q4 (use cases) → narrows demo task within pool
Q5 (tools) → MCP setup order and which services appear
```

---

## ZIP Repository Structure

```
claude-first/
│
├── README.md                    # Prerequisites + 3-step start
├── CLAUDE.md                    # Base template (onboarding personalizes)
│
├── .claude/
│   ├── settings.json            # Stop hook + PreToolUse hook + base permissions
│   └── skills/
│       ├── onboarding.md        # Main product skill — all 6 phases + adaptation logic
│       └── session-journal.md   # Custom end-of-session journal skill
│
├── memory/
│   ├── MEMORY.md                # Empty index (onboarding fills)
│   └── user_profile.md          # Template (onboarding fills via interview)
│
├── journal/
│   └── .gitkeep
│
├── mcp-guides/
│   ├── notion.md
│   ├── github.md
│   ├── telegram.md
│   └── google-workspace.md
│
├── .mcp.json                    # Template with commented blocks per service
└── setup-todo.md                # Template for skipped MCP items
```

### Repo design decisions

**Superpowers plugin not in ZIP.** Commercial, not for redistribution. The onboarding skill installs it via one command during Phase 4.

**`session-journal` and `onboarding` are custom skills** — simplified, Ukrainian-first, no superpowers workflow overhead. They live in `.claude/skills/` as `.md` files.

**Hooks live in `.claude/settings.json`**, not in skill files. `session-journal` is a Stop hook. `markitdown` is a PreToolUse hook. Both pre-configured in the template settings.json.

**`CLAUDE.md`** has two sections: immutable rules (file naming, no comments, journal rule, security) and a `## Profile` block with placeholders that onboarding replaces.

**`setup-todo.md`** is empty on clone. Onboarding appends to it when user skips an MCP. Format: checkbox + service name + link to guide.

---

## Digest (Subscription)

**Cadence:** Every 2 weeks
**Format:** 1 Claude Code feature + 1 real use case (on that feature when possible)
**Production:** Claude pipeline — Artem picks topic, Claude drafts, Artem approves, posts
**Platform:** Private Telegram channel via Tribute
**Removal:** Automatic on expiry (Tribute)

---

## Out of Scope

- English version (separate product if built)
- Video walkthroughs (text-only for v1)
- Community / group chat (consider after 50 subscribers)
- Automated ZIP delivery (manual for first 20 sales, then automate)
- Usage analytics post-purchase

---

## Open Decisions (resolve before build)

| Decision | Options |
|----------|---------|
| Payment & ZIP delivery | Gumroad (UA cards via Stripe) vs WayForPay + email automation |
| Pricing test strategy | Start $9, raise to $19 after 10 sales, or A/B test from day 1 |
| Superpowers install command | Confirm exact CLI command before writing Phase 4 of onboarding skill |
