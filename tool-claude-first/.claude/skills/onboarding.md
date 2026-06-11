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

[TO BE ADDED IN NEXT TASK]

## Phase 5 — Demo

[TO BE ADDED IN NEXT TASK]

## Phase 6 — Finish

[TO BE ADDED IN NEXT TASK]
