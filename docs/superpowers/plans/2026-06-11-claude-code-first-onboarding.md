# Claude Code Перше знайомство — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a ZIP/repo product that takes a non-technical Ukrainian user from zero to a personalized Claude Code workspace in ~15 minutes via a single `/onboarding` command.

**Architecture:** Single directory `tool-claude-first/` containing a repo skeleton (templates, hooks, MCP guides) and two custom skills (`onboarding.md` driving a 7-question interview that generates CLAUDE.md + memory files + plugin install + MCP config, and `session-journal.md` as a Stop hook). No backend, no server — purely Claude Code skill files and config.

**Tech Stack:** Claude Code skills (Markdown), JSON config, Bash hooks, MarkItDown (pre-installed), `claude` CLI for plugin install

---

## File Map

| File | Responsibility |
|------|---------------|
| `tool-claude-first/README.md` | Prerequisites + 3-step start |
| `tool-claude-first/CLAUDE.md` | Base rules template with `## Profile` placeholders |
| `tool-claude-first/.claude/settings.json` | Stop hook (session-journal) + PreToolUse hook (markitdown) + base permissions |
| `tool-claude-first/.claude/skills/onboarding.md` | Main product skill — 6 phases, 7 questions, adaptation logic, file generation |
| `tool-claude-first/.claude/skills/session-journal.md` | Custom end-of-session journal skill |
| `tool-claude-first/memory/MEMORY.md` | Empty index template |
| `tool-claude-first/memory/user_profile.md` | Profile template (filled by onboarding) |
| `tool-claude-first/journal/.gitkeep` | Keeps folder in git before first session |
| `tool-claude-first/.mcp.json` | MCP config template with commented blocks |
| `tool-claude-first/setup-todo.md` | Template for skipped MCP items |
| `tool-claude-first/mcp-guides/notion.md` | Notion token guide |
| `tool-claude-first/mcp-guides/google-workspace.md` | Google Workspace OAuth guide |
| `tool-claude-first/mcp-guides/telegram.md` | Telegram bot token guide |
| `tool-claude-first/mcp-guides/github.md` | GitHub PAT guide |

---

## Task 1: Repo skeleton

**Files:**
- Create: `tool-claude-first/` directory tree
- Create: `tool-claude-first/journal/.gitkeep`
- Create: `tool-claude-first/setup-todo.md`
- Create: `tool-claude-first/memory/MEMORY.md`

- [ ] **Step 1: Create directories**

```bash
mkdir -p "tool-claude-first/.claude/skills"
mkdir -p "tool-claude-first/memory"
mkdir -p "tool-claude-first/journal"
mkdir -p "tool-claude-first/mcp-guides"
touch "tool-claude-first/journal/.gitkeep"
```

- [ ] **Step 2: Create setup-todo.md template**

Create `tool-claude-first/setup-todo.md`:

```markdown
# Setup Todo

Items skipped during onboarding. Complete when ready.

<!-- Onboarding appends items here in this format:
- [ ] Notion — підключити → [mcp-guides/notion.md](mcp-guides/notion.md)
-->
```

- [ ] **Step 3: Create empty memory index**

Create `tool-claude-first/memory/MEMORY.md`:

```markdown
# Memory Index

<!-- Onboarding fills this automatically. -->
```

- [ ] **Step 4: Verify structure**

```bash
find tool-claude-first -type f -o -type d | sort
```

Expected output:
```
tool-claude-first
tool-claude-first/.claude
tool-claude-first/.claude/skills
tool-claude-first/journal
tool-claude-first/journal/.gitkeep
tool-claude-first/memory
tool-claude-first/memory/MEMORY.md
tool-claude-first/mcp-guides
tool-claude-first/setup-todo.md
```

- [ ] **Step 5: Commit**

```bash
git add tool-claude-first/
git commit -m "feat: scaffold tool-claude-first repo skeleton"
```

---

## Task 2: CLAUDE.md template

**Files:**
- Create: `tool-claude-first/CLAUDE.md`

- [ ] **Step 1: Create CLAUDE.md**

Create `tool-claude-first/CLAUDE.md`:

```markdown
# CLAUDE.md

## Language
- Conversation: {{LANG}}
- All written output (files, docs, code comments): English only

## Behavior
- Lead with substance. No preamble, no filler.
- Bash commands: execute without asking for permission.

## Profile
- Name: {{NAME}}
- Role: {{ROLE}}
- Goal (next 3 months): {{GOAL}}
- Use cases: {{USE_CASES}}
- Social profiles: {{SOCIAL_LINKS}}

## Memory System
At session start, check `memory/MEMORY.md` for context.
Read individual memory files when relevant.
Update them when context changes.

## Code & Docs Quality
- No comments unless the WHY is non-obvious.
- No mutations — always return new objects/values.
- Handle errors explicitly; never silently swallow them.
- No hardcoded secrets — use environment variables.

## File Naming
- Lowercase, hyphens as separators, no spaces or underscores
- No non-ASCII characters
- Format: `[type]-[description].ext`
- Types: `notes` · `ref` · `plan` · `report` · `data` · `copy` · `tool` · `export`

## Journal
Write a dated entry to `journal/YYYY-MM.md` at the end of every session.
Format: topic, what we did, decisions, pending.
```

- [ ] **Step 2: Verify placeholders present**

```bash
grep "{{" tool-claude-first/CLAUDE.md
```

Expected: 5 lines with `{{NAME}}`, `{{ROLE}}`, `{{GOAL}}`, `{{USE_CASES}}`, `{{LANG}}`, `{{SOCIAL_LINKS}}`

- [ ] **Step 3: Commit**

```bash
git add tool-claude-first/CLAUDE.md
git commit -m "feat: CLAUDE.md template with profile placeholders"
```

---

## Task 3: memory/user_profile.md template

**Files:**
- Create: `tool-claude-first/memory/user_profile.md`

- [ ] **Step 1: Create user_profile.md**

Create `tool-claude-first/memory/user_profile.md`:

```markdown
---
name: user-profile
description: Who the user is — role, goals, use cases, social profiles
metadata:
  type: user
---

**Name:** {{NAME}}
**Role:** {{ROLE}}
**Current goal (next 3 months):** {{GOAL}}
**Primary use cases with Claude Code:** {{USE_CASES}}
**Social profiles:** {{SOCIAL_LINKS}}

**Why:** Collected during onboarding to personalize Claude's behavior and suggestions.
**How to apply:** Reference when making recommendations, writing content, or framing explanations.
```

- [ ] **Step 2: Update MEMORY.md index**

Edit `tool-claude-first/memory/MEMORY.md`:

```markdown
# Memory Index

- [user_profile.md](user_profile.md) — Who the user is: role, goals, use cases, social profiles
```

- [ ] **Step 3: Commit**

```bash
git add tool-claude-first/memory/
git commit -m "feat: memory templates for user profile"
```

---

## Task 4: .mcp.json template

**Files:**
- Create: `tool-claude-first/.mcp.json`

- [ ] **Step 1: Create .mcp.json with commented blocks**

Create `tool-claude-first/.mcp.json`:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-notion"],
      "env": {
        "NOTION_API_KEY": "REPLACE_WITH_YOUR_NOTION_TOKEN"
      }
    },
    "google-workspace": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gdrive"],
      "env": {
        "GDRIVE_CREDENTIALS_FILE": "REPLACE_WITH_PATH_TO_credentials.json"
      }
    },
    "telegram": {
      "command": "npx",
      "args": ["-y", "mcp-telegram"],
      "env": {
        "TELEGRAM_BOT_TOKEN": "REPLACE_WITH_YOUR_BOT_TOKEN"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "REPLACE_WITH_YOUR_PAT"
      }
    }
  }
}
```

Note: onboarding fills in token values and removes unused service blocks during Phase 4.

- [ ] **Step 2: Verify JSON is valid**

```bash
python3 -m json.tool tool-claude-first/.mcp.json > /dev/null && echo "valid"
```

Expected: `valid`

- [ ] **Step 3: Commit**

```bash
git add tool-claude-first/.mcp.json
git commit -m "feat: .mcp.json template with four service blocks"
```

---

## Task 5: settings.json

**Files:**
- Create: `tool-claude-first/.claude/settings.json`

- [ ] **Step 1: Create settings.json**

Create `tool-claude-first/.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(find:*)",
      "Bash(ls:*)",
      "Bash(cat:*)",
      "Bash(grep:*)",
      "Bash(mkdir:*)",
      "Bash(touch:*)",
      "Bash(python3:*)",
      "Bash(markitdown:*)"
    ],
    "defaultMode": "auto"
  },
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Session ended — run /session-journal to log this session'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Read",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'f=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; ext=\"${f##*.}\"; if [[ \"$ext\" =~ ^(pdf|docx|xlsx|pptx|doc|xls)$ ]]; then markitdown \"$f\" 2>/dev/null && exit 2; fi; exit 0'"
          }
        ]
      }
    ]
  }
}
```

Note on MarkItDown hook: exit code 2 signals Claude Code to use the hook output instead of reading the file directly. Exit 0 means proceed normally.

Note on session-journal Stop hook: Claude Code Stop hooks execute shell commands only — they cannot invoke Claude skills directly. The hook echoes a reminder message. The actual journal entry is written when the user (or Claude) runs `/session-journal` manually. This is the correct architecture — do not try to auto-invoke the skill from the hook.

- [ ] **Step 2: Verify JSON is valid**

```bash
python3 -m json.tool "tool-claude-first/.claude/settings.json" > /dev/null && echo "valid"
```

Expected: `valid`

- [ ] **Step 3: Commit**

```bash
git add "tool-claude-first/.claude/settings.json"
git commit -m "feat: settings.json with Stop hook reminder and MarkItDown PreToolUse hook"
```

---

## Task 6: session-journal.md skill

**Files:**
- Create: `tool-claude-first/.claude/skills/session-journal.md`

- [ ] **Step 1: Create session-journal skill**

Create `tool-claude-first/.claude/skills/session-journal.md`:

````markdown
---
name: session-journal
description: Write a dated journal entry for this session. Run at session end.
---

# Session Journal

Write a dated entry to `journal/YYYY-MM.md` (create file if month doesn't exist).

## Format

```
## YYYY-MM-DD — [short topic 3-5 words]

**Topic:** [one sentence]

**What we did:**
- [bullet per major action]

**Key decisions:**
- [bullet per decision made]

**Pending:**
- [what's left or next step, or "Nothing."]
```

## Rules

- Date: today's date
- Topic: what this session was actually about — not "Claude Code session"
- "What we did" — actions taken, not intentions
- "Key decisions" — things decided that affect future work
- "Pending" — concrete next action or "Nothing."
- English only
- If file for current month doesn't exist: create it with `# Journal — YYYY-MM` as header
- Append to end of file, do not overwrite existing entries
````

- [ ] **Step 2: Verify file created**

```bash
cat "tool-claude-first/.claude/skills/session-journal.md" | head -5
```

Expected: frontmatter with `name: session-journal`

- [ ] **Step 3: Commit**

```bash
git add "tool-claude-first/.claude/skills/session-journal.md"
git commit -m "feat: session-journal custom skill for end-of-session logging"
```

---

## Task 7: MCP guides

**Files:**
- Create: `tool-claude-first/mcp-guides/notion.md`
- Create: `tool-claude-first/mcp-guides/google-workspace.md`
- Create: `tool-claude-first/mcp-guides/telegram.md`
- Create: `tool-claude-first/mcp-guides/github.md`

- [ ] **Step 1: Create notion.md**

Create `tool-claude-first/mcp-guides/notion.md`:

```markdown
# Notion MCP Setup

**What this enables:** Claude can create pages, databases, tasks, and read your Notion workspace directly from conversation.

## Steps

1. Open notion.com → Settings → Connections → Develop or manage integrations
2. Click **New integration** → give it a name (e.g. "Claude") → Submit
3. Copy the **Internal Integration Token** (starts with `secret_`)
4. Open `.mcp.json` in your repo
5. Replace `REPLACE_WITH_YOUR_NOTION_TOKEN` with your token
6. In each Notion page/database you want Claude to access: open page menu → **Add connections** → select your integration

## Verify

Open VS Code → Claude Code → type:
```
Search my Notion for "test"
```
Claude should respond with search results (or "nothing found").

## Troubleshoot

- "Not authorized": check that you added the integration to specific pages (step 6)
- "Invalid token": re-copy from Notion settings, no extra spaces
```

- [ ] **Step 2: Create google-workspace.md**

Create `tool-claude-first/mcp-guides/google-workspace.md`:

```markdown
# Google Workspace MCP Setup

**What this enables:** Claude can read and write Google Sheets, Docs, and search Drive.

## Steps

1. Go to console.cloud.google.com → Create a new project (or use existing)
2. Enable **Google Drive API** and **Google Sheets API**
3. Go to **Credentials** → Create credentials → **OAuth 2.0 Client ID** → Desktop app
4. Download the JSON credentials file → save as `credentials.json` in your repo root
5. Open `.mcp.json` → replace `REPLACE_WITH_PATH_TO_credentials.json` with `credentials.json`
6. First run will open a browser for OAuth consent — approve access

## Verify

Open VS Code → Claude Code → type:
```
List my recent Google Drive files
```

## Troubleshoot

- OAuth popup doesn't appear: run `npx @modelcontextprotocol/server-gdrive` in terminal manually
- "credentials.json not found": check the path matches exactly
```

- [ ] **Step 3: Create telegram.md**

Create `tool-claude-first/mcp-guides/telegram.md`:

```markdown
# Telegram MCP Setup

**What this enables:** Claude can send messages, read chats, and interact with Telegram on your behalf.

## Steps

1. Open Telegram → search for **@BotFather**
2. Send `/newbot` → follow prompts → get your bot token (format: `123456789:ABCdef...`)
3. Open `.mcp.json` → replace `REPLACE_WITH_YOUR_BOT_TOKEN` with your token
4. Add your bot to any chat/channel where you want Claude to operate

## Verify

Open VS Code → Claude Code → type:
```
Send "test" to my bot chat
```

## Troubleshoot

- Bot not responding: make sure you started a conversation with the bot first (send it `/start`)
- "Chat not found": bot must be a member of the target chat
```

- [ ] **Step 4: Create github.md**

Create `tool-claude-first/mcp-guides/github.md`:

```markdown
# GitHub MCP Setup

**What this enables:** Claude can read/write files in your GitHub repos, create issues, and manage code.

## Steps

1. Open github.com → Settings → Developer settings → Personal access tokens → **Tokens (classic)**
2. Generate new token → select scopes: `repo`, `read:org`
3. Copy the token (shown once — save it)
4. Open `.mcp.json` → replace `REPLACE_WITH_YOUR_PAT` with your token

## Verify

Open VS Code → Claude Code → type:
```
List my GitHub repositories
```

## Troubleshoot

- "Bad credentials": token may have expired — generate a new one
- Repos not showing: check that `repo` scope was selected
```

- [ ] **Step 5: Verify all 4 files exist**

```bash
ls tool-claude-first/mcp-guides/
```

Expected: `github.md  google-workspace.md  notion.md  telegram.md`

- [ ] **Step 6: Commit**

```bash
git add tool-claude-first/mcp-guides/
git commit -m "feat: MCP setup guides for Notion, Google Workspace, Telegram, GitHub"
```

---

## Task 8: README.md

**Files:**
- Create: `tool-claude-first/README.md`

- [ ] **Step 1: Create README**

Create `tool-claude-first/README.md`:

```markdown
# Claude Code Перше знайомство

Персональний Claude Code workspace — готовий за 15 хвилин.

## Що потрібно спочатку

1. **Claude Code** — встанови на claude.ai/code
2. **VS Code** — встанови на code.visualstudio.com
3. **Claude Code розширення** — встанови в VS Code (Extensions → пошук "Claude Code")

## Старт

1. Скачай ZIP і розпакуй (або склонуй цей репо)
2. Відкрий папку у VS Code: `File → Open Folder`
3. Відкрий Claude Code і напиши: `/onboarding`

Все інше Claude зробить сам.
```

- [ ] **Step 2: Verify**

```bash
wc -l tool-claude-first/README.md
```

Expected: ~15 lines

- [ ] **Step 3: Commit**

```bash
git add tool-claude-first/README.md
git commit -m "feat: README with prerequisites and 3-step start"
```

---

## Task 9: onboarding.md — Phases 0–3 (Interview)

**Files:**
- Create: `tool-claude-first/.claude/skills/onboarding.md` (phases 0–3 only, continued in Tasks 10–11)

- [ ] **Step 1: Create onboarding.md with header and Phases 0–3**

Create `tool-claude-first/.claude/skills/onboarding.md`:

````markdown
---
name: onboarding
description: Personalized Claude Code workspace setup. 7 questions → CLAUDE.md + memory + skills + MCP. Run once to set up, re-run to update.
---

# Onboarding — Claude Code Перше знайомство

You are setting up a personalized Claude Code workspace. Follow each phase in order. Ask one question at a time. Do not skip questions or combine phases.

## Re-run Detection (check FIRST, before Phase 0)

Check if `CLAUDE.md` already contains a filled `## Profile` section (i.e., no `{{` placeholders remaining).

If yes — existing setup detected. Say:
"Я бачу що workspace вже налаштований. Що хочеш зробити?
**1.** Оновити профіль (повторити питання)
**2.** Додати MCP сервіс
**3.** Почати з нуля"

Handle each choice:
- **1** → Skip Phase 0 (keep language), run Phases 1–3, regenerate CLAUDE.md and memory
- **2** → Jump directly to Phase 4.6 (MCP setup only)
- **3** → Delete CLAUDE.md Profile section and memory/user_profile.md, run full onboarding from Phase 0

If no existing setup — proceed to Phase 0 normally.

Track these variables as you collect answers:
- `LANG` — chosen language (uk / en)
- `NAME` — user's name
- `ROLE` — user's profession
- `BUNDLE` — derived from ROLE (see mapping table)
- `GOAL` — 3-month goal
- `USE_CASES` — selected tasks from Q4
- `DEMO_TASK` — selected from role table, narrowed by USE_CASES
- `TOOLS` — selected MCP services
- `SOCIAL_LINKS` — public profiles (Bundle A only)

---

## Phase 0 — Language

Say exactly:
> "Привіт! Я налаштую твій персональний Claude Code workspace — займе ~15 хвилин. Якою мовою спілкуватись — **українська** чи **англійська**?"

Set LANG = "uk" if Ukrainian chosen, "en" if English.
All subsequent messages must be in the chosen language.

---

## Phase 1 — Identity

### Q1 — Name
Ask: "Як тебе звати?" (uk) / "What's your name?" (en)
Set NAME = answer.

### Q2 — Role
Ask: "Яка твоя роль?" (uk) / "What's your role?" (en)
Present this numbered list:

**Продажі та маркетинг:**
1. Продажник
2. Digital маркетолог
3. SMM / контент-менеджер
4. Інфобізнесмен
5. Ріелтор

**Операції та фінанси:**
6. Закупівельник
7. Логіст / диспетчер
8. SC менеджер
9. Бухгалтер
10. Проєктний менеджер

**HR, підтримка, право:**
11. Рекрутер
12. HR менеджер
13. Керівник підтримки
14. Юрист

**Власники та самозайняті:**
15. E-commerce власник
16. Amazon seller
17. Власник МСБ
18. HoReCa / ресторан
19. Beauty & wellness майстер
20. Фрілансер / консультант

"Або напиши свою роль."

Set ROLE = selected role name.
Set BUNDLE using this mapping:

| Role | Bundle |
|------|--------|
| Продажник | A |
| Digital маркетолог | A+B |
| SMM / контент-менеджер | A |
| Інфобізнесмен | A+B |
| Ріелтор | A+B |
| Закупівельник | B+C |
| Логіст / диспетчер | C |
| SC менеджер | B+C |
| Бухгалтер | C |
| Проєктний менеджер | B+C |
| Рекрутер | A+C |
| HR менеджер | A+C |
| Керівник підтримки | C |
| Юрист | B+C |
| E-commerce власник | B |
| Amazon seller | A+B |
| Власник МСБ | A+B |
| HoReCa / ресторан | A |
| Beauty & wellness майстер | A |
| Фрілансер / консультант | A+B |

If role is free text (not in list): set BUNDLE = A+B (default).

---

## Phase 2 — Goals & Use Cases

### Q3 — Goal
Ask: "Яка твоя головна ціль на найближчі 3 місяці?" (uk) / "What's your main goal for the next 3 months?" (en)
Set GOAL = answer.

### Q4 — Use Cases
Select the task list for ROLE from this table:

| Role | Top-7 task list |
|------|----------------|
| Продажник | Писати холодні листи · Готувати комерційні пропозиції · Вести CRM нотатки · Аналізувати клієнтів · Готувати скрипти дзвінків · Досліджувати конкурентів · Автоматизувати follow-up |
| Digital маркетолог | Планувати контент-календар · Писати рекламні тексти · Аналізувати конкурентів · Готувати звіти · Планувати кампанії · Досліджувати ринок · SEO-оптимізація |
| SMM / контент-менеджер | Писати пости · Планувати контент · Генерувати ідеї · Готувати stories-сценарії · Відповідати на коментарі · Аналізувати тренди · Писати рекламні тексти |
| Інфобізнесмен | Писати email-ланцюжки · Планувати запуски · Готувати продаючі сторінки · Писати контент · Готувати скрипти вебінарів · Аналізувати аудиторію · Автоматизувати воронку |
| Ріелтор | Писати описи об'єктів · Готувати комерційні пропозиції · Вести комунікацію з клієнтами · Досліджувати ринок · Готувати порівняльний аналіз · Писати пости · Автоматизувати follow-up |
| Закупівельник | Порівнювати постачальників · Готувати RFP · Аналізувати прайс-листи · Вести переговорні записи · Контролювати умови договорів · Досліджувати ринок · Готувати звіти |
| Логіст / диспетчер | Готувати повідомлення про затримки · Вести маршрутні записи · Комунікувати з перевізниками · Документувати інциденти · Аналізувати витрати · Готувати шаблони документів · Автоматизувати звіти |
| SC менеджер | Оцінювати постачальників · Аналізувати ризики ланцюга · Планувати закупівлі · Готувати KPI-звіти · Досліджувати альтернативи · Вести переговорну документацію · Будувати шаблони процесів |
| Бухгалтер | Структурувати звіти · Перевіряти документи · Готувати зведення витрат · Аналізувати PDF-виписки · Документувати рішення · Готувати листи для контрагентів · Автоматизувати рутинні звіти |
| Проєктний менеджер | Планувати проект · Готувати чеклисти · Писати статус-звіти · Готувати agenda зустрічей · Документувати рішення · Управляти ризиками · Готувати комунікації для команди |
| Рекрутер | Писати job descriptions · Готувати питання для інтерв'ю · Парсити CV · Писати повідомлення кандидатам · Готувати офер-листи · Аналізувати ринок зарплат · Вести комунікацію |
| HR менеджер | Писати HR-політики · Готувати онбординг-матеріали · Планувати HR-ініціативи · Готувати опитування · Писати комунікації для команди · Аналізувати бенчмарки · Документувати процеси |
| Керівник підтримки | Писати шаблони відповідей · Готувати FAQ · Документувати процеси · Аналізувати звернення · Готувати навчальні матеріали · Писати внутрішні комунікації · Будувати checklist якості |
| Юрист | Аналізувати контракти · Готувати меморандуми · Досліджувати прецеденти · Структурувати справи · Писати листи · Перевіряти документи · Готувати шаблони договорів |
| E-commerce власник | Керувати асортиментом · Аналізувати постачальників · Готувати описи товарів · Планувати закупівлі · Готувати звіти по залишках · Аналізувати конкурентів · Вести комунікацію |
| Amazon seller | Писати listing-контент · Планувати PPC · Досліджувати ключові слова · Аналізувати конкурентів · Готувати A+ content · Аналізувати відгуки · Планувати запуск нових товарів |
| Власник МСБ | Приймати бізнес-рішення · Готувати стратегію · Планувати маркетинг · Вести фінансовий аналіз · Комунікувати з командою · Досліджувати ринок · Автоматизувати операції |
| HoReCa / ресторан | Писати пости для соцмереж · Відповідати на відгуки · Готувати меню-описи · Планувати акції · Вести комунікацію з постачальниками · Аналізувати прайс-листи · Готувати івент-матеріали |
| Beauty & wellness майстер | Писати пости · Готувати follow-up повідомлення клієнтам · Планувати контент · Писати описи послуг · Готувати цінові пропозиції · Відповідати на запити · Планувати акції |
| Фрілансер / консультант | Готувати пропозиції клієнтам · Писати звіти · Вести комунікацію · Досліджувати клієнтів · Готувати презентації · Планувати проекти · Будувати особистий бренд |

Ask: "Ось топ-7 задач для [ROLE] — обери що актуально (можна кілька):"
Present the list for ROLE.
Set USE_CASES = selected items.
Set DEMO_TASK based on ROLE (see Phase 5 table).

---

## Phase 3 — Tools

### Q5 — Tools
Ask: "Що з цього вже використовуєш? (можна кілька або 'нічого')"
Options: Notion · Google Sheets · Google Docs · Telegram · нічого

Set TOOLS = selected services.
Build MCP_LIST:
- Always include services from TOOLS
- Add GitHub to MCP_LIST only if BUNDLE contains B

### Q6 — Social profiles (conditional)
Ask ONLY if BUNDLE contains A:
"Є публічні профілі? Дай лінки якщо є — LinkedIn, Instagram, Telegram-канал. Або пропусти."
Set SOCIAL_LINKS = provided links (or empty if skipped).

---

## Phase 4 — Automatic Setup

[Continued in next section of this file]

## Phase 5 — Demo

[Continued in next section of this file]

## Phase 6 — Finish

[Continued in next section of this file]
````

- [ ] **Step 2: Verify file created and phases 0-3 present**

```bash
grep "## Phase" "tool-claude-first/.claude/skills/onboarding.md"
```

Expected:
```
## Phase 0 — Language
## Phase 1 — Identity
## Phase 2 — Goals & Use Cases
## Phase 3 — Tools
## Phase 4 — Automatic Setup
## Phase 5 — Demo
## Phase 6 — Finish
```

- [ ] **Step 3: Commit**

```bash
git add "tool-claude-first/.claude/skills/onboarding.md"
git commit -m "feat: onboarding skill phases 0-3 (interview questions + role mapping)"
```

---

## Task 10: onboarding.md — Phase 4 (Automatic Setup)

**Files:**
- Modify: `tool-claude-first/.claude/skills/onboarding.md` — replace `[Continued in next section...]` placeholder for Phase 4

- [ ] **Step 1: Replace Phase 4 placeholder with full content**

Find this text in `tool-claude-first/.claude/skills/onboarding.md`:
```
## Phase 4 — Automatic Setup

[Continued in next section of this file]
```

Replace with:

````markdown
## Phase 4 — Automatic Setup

Announce: "Чудово! Тепер налаштую твій workspace. Слідкуй за прогресом."

Execute each step below and announce with ✓ when done.

### 4.1 — Generate CLAUDE.md

Write `CLAUDE.md` in the project root. Replace all placeholders:
- `{{NAME}}` → NAME
- `{{ROLE}}` → ROLE
- `{{GOAL}}` → GOAL
- `{{USE_CASES}}` → comma-separated list of USE_CASES
- `{{LANG}}` → "Ukrainian" if LANG=uk, "English" if LANG=en
- `{{SOCIAL_LINKS}}` → SOCIAL_LINKS if present, otherwise remove that line

Announce: "✓ CLAUDE.md персоналізовано"

### 4.2 — Generate memory/user_profile.md

Write `memory/user_profile.md`. Replace placeholders same as above.

Update `memory/MEMORY.md` — add entry:
```
- [user_profile.md](user_profile.md) — Who [NAME] is: [ROLE], goals, use cases
```

Announce: "✓ memory/ з твоїм профілем створено"

### 4.3 — Install Superpowers plugin

Say:
"Встановлюємо базові скіли. Виконай цю команду в терміналі VS Code (Terminal → New Terminal):"

```bash
claude plugin install superpowers@claude-plugins-official
```

Wait for user to confirm it ran.
Announce: "✓ Базові скіли встановлено (brainstorming, writing-plans, verification)"

### 4.4 — Install role bundle skills

If BUNDLE contains A:
Say: "Встановлюємо скіли для контенту:"
```bash
claude plugin install marketing@knowledge-work-plugins
```
Announce: "✓ Скіли контенту і маркетингу встановлено"

If BUNDLE contains B or C only (no A):
Skip marketing plugin. Announce: "✓ Базових скілів достатньо для твоєї ролі"

### 4.5 — Confirm hooks

Say: "✓ Stop hook для журналу сесій — активний (налаштований у .claude/settings.json)"
Say: "✓ MarkItDown hook — активний (PDF/Word/Excel → Markdown автоматично)"

### 4.6 — MCP setup

For each service in MCP_LIST, in order (Notion first if present, then Google Workspace, then Telegram, then GitHub):

Say:
"Підключаємо [SERVICE]. [One sentence what it enables for this specific role].
Готовий підключити зараз? **Так** / **Пропустити — зроблю пізніше**"

If "Так":
- Guide through the relevant mcp-guide (tell user to open `mcp-guides/[service].md`)
- After token entered: edit `.mcp.json` together — fill in the token value
- Announce: "✓ [SERVICE] підключено"

If "Пропустити":
- Append to `setup-todo.md`:
  `- [ ] [SERVICE] — підключити → [mcp-guides/[service].md](mcp-guides/[service].md)`
- Announce: "Записав у setup-todo.md — повернешся коли буде час"

After all MCP items processed: announce "✓ MCP налаштування завершено"
````

- [ ] **Step 2: Verify placeholder replaced**

```bash
grep -c "Continued in next section" "tool-claude-first/.claude/skills/onboarding.md"
```

Expected: `1` (Phase 5 and 6 placeholders still remain)

- [ ] **Step 3: Commit**

```bash
git add "tool-claude-first/.claude/skills/onboarding.md"
git commit -m "feat: onboarding skill phase 4 — auto-setup with plugin install and MCP flow"
```

---

## Task 11: onboarding.md — Phases 5–6 (Demo + Close)

**Files:**
- Modify: `tool-claude-first/.claude/skills/onboarding.md` — replace Phase 5 and 6 placeholders

- [ ] **Step 1: Replace Phase 5 placeholder**

Find: `## Phase 5 — Demo\n\n[Continued in next section of this file]`

Replace with:

````markdown
## Phase 5 — Demo

Select DEMO_TASK from this table using ROLE. If USE_CASES narrows it further, pick the most relevant variant.

| Role | Demo task |
|------|-----------|
| Продажник | Draft a cold outreach email for one prospect — ask for prospect name/company |
| Digital маркетолог | Build a 1-week content calendar for one channel — ask which channel |
| SMM / контент-менеджер | Write one post in their tone of voice — ask for topic |
| Інфобізнесмен | Outline a 5-email welcome sequence — ask for product/offer name |
| Ріелтор | Write a property listing description — ask for 3 key facts about the property |
| Закупівельник | Create a supplier comparison template — ask for 3 criteria that matter most |
| Логіст / диспетчер | Draft a shipment delay notification — ask for carrier and estimated delay |
| SC менеджер | Build a vendor scorecard template — ask for top 4 evaluation criteria |
| Бухгалтер | Structure a monthly expense summary template — ask for main cost categories |
| Проєктний менеджер | Create a project kickoff checklist — ask for project type |
| Рекрутер | Write a job description for one role — ask for role title and 3 key requirements |
| HR менеджер | Draft an onboarding checklist for new hires — ask for team/department |
| Керівник підтримки | Create an FAQ template for top 5 questions — ask for product/service type |
| Юрист | Summarize key clauses from a contract — ask user to paste or upload a sample contract |
| E-commerce власник | Generate a reorder alert template for top SKUs — ask for product category |
| Amazon seller | Write A+ content bullet points for one product — ask for product name and key benefit |
| Власник МСБ | Draft a one-page business summary — ask for business name and what it does |
| HoReCa / ресторан | Write 3 Instagram captions for this week — ask for this week's special or event |
| Beauty & wellness майстер | Write a client follow-up message after appointment — ask for service type |
| Фрілансер / консультант | Draft a project proposal for one service — ask for service name and target client |

Say:
"Зараз покажу як це все працює разом. Ось задача на 2 хвилини під твою роль: **[DEMO_TASK description]**. Підтвердь або дай свій варіант."

Execute the demo task using the installed skills and workspace context.
````

- [ ] **Step 2: Replace Phase 6 placeholder**

Find: `## Phase 6 — Finish\n\n[Continued in next section of this file]`

Replace with:

````markdown
## Phase 6 — Finish

Count: N_SKILLS = number of skills installed. N_MCP_DONE = MCP services connected. N_MCP_TODO = MCP services in setup-todo.md.

Say:

"Твій workspace готовий:
→ CLAUDE.md персоналізований під [NAME]
→ memory/ з профілем і ціллю
→ [N_SKILLS] скілів встановлено
→ [N_MCP_DONE] MCP підключено[, [N_MCP_TODO] у setup-todo.md] якщо є

Тепер у кожній новій сесії Claude знає хто ти, що ти будуєш і для чого.
Команди які ти матимеш: /brainstorming · /writing-plans · /session-journal · та інші.

---

Раз на 2 тижні — нова фіча Claude Code + реальний кейс як її використати.
$5/міс → [Tribute link]"

If user asks what to do next: suggest running `/brainstorming` on their Q3 goal.
````

- [ ] **Step 3: Verify no more placeholders remain**

```bash
grep "Continued in next section" "tool-claude-first/.claude/skills/onboarding.md"
```

Expected: no output (all placeholders replaced)

- [ ] **Step 4: Verify all 20 demo tasks present**

```bash
grep -c "| " "tool-claude-first/.claude/skills/onboarding.md" | head -1
```

- [ ] **Step 5: Commit**

```bash
git add "tool-claude-first/.claude/skills/onboarding.md"
git commit -m "feat: onboarding skill phases 5-6 — demo tasks (all 20 roles) and close"
```

---

## Task 12: End-to-end verification

**No new files. Verify behavior with two test personas.**

- [ ] **Step 1: Open tool-claude-first in VS Code**

```bash
code "tool-claude-first/"
```

- [ ] **Step 2: Run Persona A — SMM менеджер**

In Claude Code, type `/onboarding`. Simulate answers:
- Language: українська
- Name: Тест
- Role: 3 (SMM / контент-менеджер)
- Goal: Набрати 1000 підписників в Instagram за 3 місяці
- Use cases: Писати пости, Планувати контент, Генерувати ідеї
- Tools: нічого
- Social links: instagram.com/test_account

After onboarding completes, verify:

```bash
grep "Тест" "tool-claude-first/CLAUDE.md" && echo "NAME ok"
grep "SMM" "tool-claude-first/CLAUDE.md" && echo "ROLE ok"
grep "Instagram" "tool-claude-first/CLAUDE.md" && echo "GOAL ok"
cat "tool-claude-first/memory/user_profile.md" | grep "instagram.com" && echo "SOCIAL ok"
```

- [ ] **Step 3: Verify Bundle A skills announced**

During Persona A onboarding, confirm Claude announced installing `marketing@knowledge-work-plugins` (Bundle A) — check conversation output.

- [ ] **Step 4: Verify demo task was SMM-specific**

Confirm Claude suggested Instagram post writing (not a generic task).

- [ ] **Step 5: Reset for Persona B**

```bash
git checkout -- "tool-claude-first/CLAUDE.md" "tool-claude-first/memory/"
```

- [ ] **Step 6: Run Persona B — SC менеджер**

In Claude Code, type `/onboarding`. Simulate answers:
- Language: English
- Name: Test
- Role: 8 (SC менеджер)
- Goal: Reduce supplier costs by 15%
- Use cases: Evaluate vendors, Analyze supply chain risks
- Tools: Notion, Google Sheets
- (No Q6 — Bundle B+C, no A)

After onboarding completes, verify:

```bash
grep "Test" "tool-claude-first/CLAUDE.md" && echo "NAME ok"
grep "SC" "tool-claude-first/CLAUDE.md" && echo "ROLE ok"
grep "English" "tool-claude-first/CLAUDE.md" && echo "LANG ok"
```

- [ ] **Step 7: Verify no brand question was asked**

Confirm Claude did NOT ask about social profiles (SC менеджер is Bundle B+C, no A).

- [ ] **Step 8: Verify Notion MCP offered**

Confirm Claude offered Notion and Google Sheets MCP connections (both in TOOLS selection).

- [ ] **Step 9: Verify re-run detection**

Run `/onboarding` again (without resetting). Confirm Claude asks:
"Оновити налаштування чи почати з нуля?"

- [ ] **Step 10: Commit verification notes**

```bash
git add -A && git commit -m "test: end-to-end onboarding verified for SMM and SC manager personas"
```

---

## Task 13: Package as ZIP

- [ ] **Step 1: Verify complete file structure**

```bash
find tool-claude-first -not -path "*/\.*" -type f | sort
```

Expected files (13 total):
```
tool-claude-first/CLAUDE.md
tool-claude-first/README.md
tool-claude-first/mcp-guides/github.md
tool-claude-first/mcp-guides/google-workspace.md
tool-claude-first/mcp-guides/notion.md
tool-claude-first/mcp-guides/telegram.md
tool-claude-first/setup-todo.md
```

Plus hidden:
```
tool-claude-first/.claude/settings.json
tool-claude-first/.claude/skills/onboarding.md
tool-claude-first/.claude/skills/session-journal.md
tool-claude-first/.mcp.json
tool-claude-first/journal/.gitkeep
tool-claude-first/memory/MEMORY.md
tool-claude-first/memory/user_profile.md
```

- [ ] **Step 2: Create ZIP**

```bash
cd .. && zip -r "claude-code-pershe-znayomstvo-v1.0.zip" "tool-claude-first/" -x "*/\.*" && mv "claude-code-pershe-znayomstvo-v1.0.zip" "Claude v 1.0/" && cd "Claude v 1.0"
```

Note: `-x "*/\.*"` excludes hidden files. Adjust if `.claude/` and `.mcp.json` should be included (they should — re-run without exclusion or adjust pattern).

Correct command (includes hidden files, excludes only .git):

```bash
zip -r "claude-code-pershe-znayomstvo-v1.0.zip" "tool-claude-first/" -x "tool-claude-first/.git/*"
```

- [ ] **Step 3: Verify ZIP contents**

```bash
unzip -l "claude-code-pershe-znayomstvo-v1.0.zip" | grep -v "/$" | wc -l
```

Expected: 14 files (13 + 1 for zip manifest)

- [ ] **Step 4: Final commit**

```bash
git add tool-claude-first/
git commit -m "feat: claude-code-first v1.0 — ready for distribution"
```

---

## Open Decisions (resolve before Task 9)

| Decision | Action needed |
|----------|--------------|
| Superpowers plugin install path | Confirm `/Users/artem/.local/bin/claude` is correct on end-user machines or use `claude` if it's in PATH |
| Tribute link | Create Tribute subscription page and get URL before Task 11 |
| Payment + ZIP delivery | Choose Gumroad or WayForPay + automation before launch (not a blocker for building) |
