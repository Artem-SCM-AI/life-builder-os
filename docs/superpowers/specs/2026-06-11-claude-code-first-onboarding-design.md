# Design Spec — Claude Code Перше знайомство

**Date:** 2026-06-11
**Status:** Approved
**Author:** Artem Stepanenko

---

## Overview

A Ukrainian-market product that takes a non-technical or semi-technical person from zero to a fully personalized Claude Code workspace in ~15 minutes. The core mechanic is a gamified onboarding skill: the user types `/onboarding`, Claude conducts a live interview, and the result is a workspace configured to their role, goals, and tools — at approximately Artem's setup level.

**Promised outcome:** "Після цього у тебе є setup на рівні Артема — той самий рівень з якого він будує все."

---

## Product Architecture

### Two components

**Component 1 — One-time product ($9)**
A ZIP/repo with a ready-made Claude Code workspace skeleton. The centerpiece is the `onboarding` skill. User clones the repo, opens VS Code, types `/onboarding` — Claude handles the rest.

**Component 2 — Subscription ($5/month via Tribute)**
A private Telegram channel. Biweekly digest: 1 new Claude Code feature + 1 practical use case. Content generated via Claude pipeline (Telegram Content Bot). Artem is the filter and translator for non-technical readers.

### Customer journey

```
Telegram post (@artem.org.ua)
  → payment $9 (WayForPay or Gumroad — to decide)
  → automated delivery of ZIP by email
  → clone repo → open VS Code → /onboarding (15 min)
  → personalized workspace ready
  → offer: digest subscription at end of onboarding
  → Tribute → $5/month → private Telegram channel
```

### Payment & delivery (deferred decision)
Options: Gumroad (supports UA Visa/MC via Stripe), WayForPay + Zapier/n8n (sends ZIP by email), SendOwl. Not a design blocker — decide before launch.

---

## Target Audience

**Primary:** Non-technical (A) — managers, entrepreneurs, freelancers who have never used a terminal. Core message: "you can do this, even without code."

**Secondary:** Semi-technical (B) — people who can install apps and know what a terminal is but are afraid of it.

Both audiences are Ukrainian-speaking. The product is not part of the Life Builder OS / English funnel.

---

## Skill Tiers

Skills are assigned automatically based on profession. The user does not pick from a list.

### Tier 1 — Universal (everyone)

| Skill | Purpose |
|-------|---------|
| `using-superpowers` | Meta-skill — activates the entire system |
| `brainstorming` | Structures any creative task before execution |
| `writing-plans` | Breaks complex projects into steps |
| `verification-before-completion` | Claude verifies output before saying "done" |
| `session-journal` *(custom)* | Stop hook — writes journal entry at session end |

### Tier 2 — Content & Marketing
*For: Продажник, Digital маркетолог, SMM, Інфобізнесмен, Ріелтор, Beauty & wellness, HoReCa*

`brand-voice` · `content-creation` · `draft-content` · `email-sequence`

### Tier 3 — Research & Analysis
*For: Закупівельник, SC менеджер, Проєктний менеджер, E-commerce, Amazon seller, Власник МСБ*

`competitive-brief` · `campaign-plan` · `deep-research`

### Tier 4 — Operations
*For: Логіст, Бухгалтер, Рекрутер, HR, Керівник підтримки, Юрист*

`draft-content` · `systematic-debugging`

*(`writing-plans` already in Tier 1 — no duplication needed)*

### Tier 5 — Power users (all roles)
`writing-skills` — creating custom skills for their specific tasks

### Automation layer (all users, silent)
**MarkItDown PreToolUse hook** — auto-converts PDF/Word/Excel to Markdown before Claude reads them. No user action required. Installed for everyone.

---

## MCP Services

Four services. Each has a skip option during onboarding — skipped items are saved to `setup-todo.md`.

| Service | Why it matters |
|---------|---------------|
| **Notion** | Claude creates tasks and pages directly from conversation |
| **GitHub** | Version control for projects and files |
| **Telegram** | Claude can read/send messages in Telegram |
| **Google Workspace** | Claude reads and writes Sheets, Docs, Gmail |

Each MCP connection includes: what it enables, where to get the token (step-by-step), one verification command.

---

## Onboarding Skill — Flow

**Total: 6 phases, 6–7 questions. ~15 minutes.**

### Phase 0 — Welcome (1 question, always first)

> "Привіт! Я налаштую твій персональний Claude Code workspace — займе ~15 хвилин. Якою мовою спілкуватись — **українська** чи **англійська**?"

All subsequent communication in the chosen language.

### Phase 1 — Identity (2 questions)

| # | Question | Output |
|---|----------|--------|
| 1 | Як тебе звати? | `name` → CLAUDE.md + memory |
| 2 | Яка твоя роль? *(list of 20 roles in 4 categories, or free text)* | `profession` → determines skill tier + whether to ask brand question |

### Phase 2 — Goals & Tasks (2 questions)

| # | Question | Output |
|---|----------|--------|
| 3 | Яка твоя головна ціль на найближчі 3 місяці? | `current_goal` → memory |
| 4 | Ось топ-7 задач для **[role]** — обери що актуально. *(role-specific list, not generic)* | Confirms skill tier, scopes demo task |

### Phase 3 — Tools (1–2 questions)

| # | Question | Condition | Output |
|---|----------|-----------|--------|
| 5 | Що з цього вже використовуєш? *(Notion / Google Sheets / Google Docs / Telegram / GitHub / нічого)* | Always | MCP priority list |
| 6 | Є публічні профілі? *(LinkedIn, Instagram, Telegram channel — дай лінки)* | Only if role = content/brand/sales/entrepreneur | brand context in memory |

### Phase 4 — Automatic setup (no questions)

Claude announces and executes:

```
✓ Генерую CLAUDE.md під тебе
✓ Створюю memory/ (user_profile + project_context)
✓ Встановлюю Tier 1 скіли: [list]
✓ Встановлюю [Tier name] скіли для [role]: [list]
✓ Встановлюю writing-skills (створення власних скілів)
✓ Налаштовую MarkItDown hook (автоконвертація документів)
✓ Налаштовую Stop hook для журналу сесій
```

Then MCP — one by one with skip option:

> "Підключаємо Notion. Claude зможе створювати задачі і сторінки прямо з розмови. Готовий підключити зараз? [Так / Пропустити — зроблю пізніше]"

- **Yes** → step-by-step instructions with token location
- **Skip** → records in `setup-todo.md` as pending

### Phase 5 — Demo (scoped, not open-ended)

Claude suggests a role-specific 2-minute task — does not ask "give me any task":

- SMM: write one post in their tone of voice
- SC manager: supplier comparison template
- Recruiter: draft a job description
- Accountant: structure a monthly expense report
- etc.

> "Зараз покажу як це працює. Ось задача на 2 хвилини під твою роль: [specific task]. Підтвердь або дай свій варіант."

### Phase 6 — Finish + offer

```
Твій workspace готовий:
→ CLAUDE.md персоналізований
→ memory/ з профілем і ціллю
→ [N] скілів встановлено
→ [N] MCP підключено / [N] у setup-todo.md
→ Журнал сесій активний

Раз на 2 тижні — нова фіча Claude Code + реальний кейс.
$5/міс → [Tribute link]
```

---

## Adaptation Logic

Role answer (Q2) drives all downstream decisions:

```
role → skill tier (automatic)
role → whether to ask Q6 (brand profiles)
role → demo task suggestion (Phase 5)
selected tools (Q5) → MCP setup order
Q5 answers → whether MCP sections appear
```

The user never picks from a skills menu. Claude selects and explains.

---

## ZIP Repository Structure

```
claude-first/
│
├── README.md                    # 5 lines: clone → VS Code → /onboarding
├── CLAUDE.md                    # Base template with placeholders
│
├── .claude/
│   ├── settings.json            # Stop hook + base permissions pre-configured
│   └── skills/
│       ├── onboarding.md        # Main product skill (all 6 phases)
│       └── session-journal.md   # End-of-session journal (custom, UA-focused)
│
├── memory/
│   ├── MEMORY.md                # Empty index (onboarding fills it)
│   └── user_profile.md          # Template (onboarding fills via interview)
│
├── journal/
│   └── .gitkeep                 # Ready to receive session entries
│
├── mcp-guides/
│   ├── notion.md                # Step-by-step: where to get token, how to connect
│   ├── github.md
│   ├── telegram.md
│   └── google-workspace.md
│
├── .mcp.json                    # Config template with commented-out blocks
└── setup-todo.md                # Template for skipped MCP items
```

### Key decisions on repo contents

**Superpowers plugin is NOT in the ZIP.** It is commercial and not for redistribution. The onboarding skill contains a one-command install instruction. Tier 1 skills come from the plugin.

**`session-journal` and `onboarding` are custom skills** written for this product. Simplified, Ukrainian-first, without superpowers workflow overhead.

**`setup-todo.md`** is populated during onboarding when user skips an MCP. On next session open, they see exactly what's pending with a link to the relevant guide.

**`CLAUDE.md`** contains immutable base rules (file naming, no comments, journal rule, security) and placeholders that onboarding replaces (name, language, role, goals, social profiles).

---

## Digest Content (Subscription)

**Cadence:** Every 2 weeks
**Format:** 1 Claude Code feature of the week + 1 real use case (optionally on that feature)
**Production:** Generated via Claude pipeline (Telegram Content Bot) — Artem selects topic, Claude drafts, Artem approves, posts to channel
**Platform:** Private Telegram channel managed via Tribute
**Removal:** Automatic on subscription expiry (Tribute handles this)

---

## Professions Covered (20 roles, 4 categories)

| Category | Roles |
|----------|-------|
| Sales & Marketing | Продажник, Digital маркетолог, SMM/контент-менеджер, Інфобізнесмен, Ріелтор |
| Operations & Finance | Закупівельник, Логіст/диспетчер, SC менеджер, Бухгалтер, Проєктний менеджер |
| HR, Support, Law | Рекрутер, HR менеджер, Керівник підтримки, Юрист |
| Owners & Self-employed | E-commerce власник, Amazon seller, Власник МСБ, HoReCa/ресторан, Beauty & wellness, Фрілансер/консультант |

Each role has a pre-defined top-5 skill set and a pre-defined demo task for Phase 5.

---

## Out of Scope

- English-language version (separate product if built)
- Video walkthroughs (text-only for v1)
- Community / group chat (consider after 50 subscribers)
- Automated delivery system (manual send for first 20 sales, then automate)
- Analytics / tracking user progress after purchase

---

## Open Decisions (pre-launch)

| Decision | Options | Deadline |
|----------|---------|----------|
| Payment & ZIP delivery | Gumroad vs WayForPay + email automation | Before launch |
| Pricing test | Start $9, test $19 after 10 sales | At launch |
| Superpowers plugin install method | One command in onboarding vs pre-bundle workaround | During build |
| Which demo tasks per role | Define all 20 role-specific tasks | During build |
