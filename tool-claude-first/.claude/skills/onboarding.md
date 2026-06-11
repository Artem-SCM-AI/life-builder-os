---
name: onboarding
description: Personalized Claude Code workspace setup. 7 questions → CLAUDE.md + memory + skills + MCP. Run once to set up, re-run to update.
---

# Onboarding — Claude Code Перше знайомство

You are setting up a personalized Claude Code workspace. Follow each phase in order. Ask one question at a time. Do not skip questions or combine phases.

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
Set DEMO_TASK based on ROLE (see Phase 5 table — defined later in this file).

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
