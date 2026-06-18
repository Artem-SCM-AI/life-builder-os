# Claude Code + Notion SC Orchestrator — Build Log
**Дата:** 26 травня 2026  
**Автор:** Artem Stepanenko  
**Статус:** v1.0 working prototype

---

## ЩО МИ ПОБУДУВАЛИ

Автономна multi-agent система на базі **Claude Code CLI** + **Notion** + **Telegram**, яка щодня без участі людини:
- Шукає вакансії
- Знаходить SCAIT ліди
- Збирає новини SC/AI
- Перевіряє коментарі в LinkedIn
- Компілює щоденний бріфінг у Notion
- Створює задачі дня в Notion
- Архівує виконані задачі
- Надсилає Telegram нагадування

Нічого зовнішнього. Ніяких підписок. Тільки Claude Code + macOS crontab.

---

## АРХІТЕКТУРА

```
macOS crontab (system-level cron)
        │
        ├── 08:03  jobs_agent     → data/jobs_latest.md
        ├── 08:07  leads_agent    → data/leads_latest.md
        ├── 08:11  news_agent     → data/news_latest.md
        ├── 09:00  comments_agent → data/comments_latest.md
        │
        ├── 08:30  orchestrator ──→ Reads all 4 files
        │                          → Creates Notion Briefing page
        │                          → Creates tasks in "Задачі дня" DB
        │                          → Archives old Done tasks to Backlog
        │                          → Sends Telegram notification
        │
        ├── 14:11  news_agent (afternoon refresh)
        ├── 13:00  comments_agent
        ├── 17:00  comments_agent
        ├── 20:00  comments_agent
        │
        └── 16:00  reminder_agent → Checks Notion for uncompleted tasks
                                   → Sends Telegram reminder
```

### Принцип роботи
- Кожен агент — окремий `claude -p` процес
- Агенти не знають один про одного
- Комунікація через файли (`~/.claude/scripts/data/*.md`)
- Оркестратор читає всі файли і діє як conductor
- Notion — джерело правди для задач і архіву
- Telegram — канал сповіщень

---

## ФАЙЛОВА СТРУКТУРА

```
~/.claude/scripts/
├── run_agent.sh              # Універсальний лаунчер агентів
├── config.env                # Всі ID: Notion, Telegram
├── agents/
│   ├── jobs_agent.md         # Промпт: пошук вакансій
│   ├── leads_agent.md        # Промпт: SCAIT ліди
│   ├── news_agent.md         # Промпт: SC/AI новини
│   ├── comments_agent.md     # Промпт: LinkedIn коментарі
│   ├── orchestrator.md       # Промпт: оркестратор
│   └── reminder_agent.md     # Промпт: вечірнє нагадування
└── data/
    ├── jobs_latest.md        # Output jobs агента
    ├── leads_latest.md       # Output leads агента
    ├── news_latest.md        # Output news агента
    ├── comments_latest.md    # Output comments агента
    ├── my_posts.md           # URLs постів для моніторингу
    └── *.log                 # Логи кожного агента
```

---

## NOTION СТРУКТУРА

```
🗂️ Моє життя  (page_id: 36cd4d2e-2457-818a-9255-fdeeaec20936)
├── 📋 Briefing — [дата]      ← Щоденний звіт (створюється оркестратором)
├── ✅ Задачі дня             (DB: a6bdb253-aa17-479c-9bf3-f9bb85ea3ab2)
│   Fields: Задача | Статус (To Do/In Progress/Done) | Категорія | Дата | Посилання | Нотатки
└── 📋 Backlog & Archive      (DB: 810473dd-b0b0-47f6-9a2c-316c9c67f08b)
    Fields: Назва | Статус (💡Ідея/📋Заплановано/🔄В роботі/✅Виконано/🗃️Архів) | Категорія | Пріоритет | Дата | Посилання | Нотатки
```

---

## АГЕНТИ — ДЕТАЛЬНИЙ ОПИС

### 1. Jobs Agent (`jobs_agent.md`)
**Задача:** Знаходить вакансії Director/Head of SC/Operations за останні 24 год  
**Джерела:** LinkedIn (пріоритет), Greenhouse.io, Lever.co, RemotivateJobs  
**Фільтри:**
- Посади: Director SC, Head of SC, VP SC, COO, Director Operations, Head of Operations, COO, Head of Growth, Director of Ecommerce
- Тільки remote worldwide
- Тільки ecommerce / Amazon / DTC / consumer goods
- Виключити: pharma, healthcare, IT, construction
- Топ 10 результатів, опубліковані за останні 24г
**Output:** `data/jobs_latest.md` з полями: title | company | location | source | URL | чому підходить

### 2. Leads Agent (`leads_agent.md`)
**Задача:** Знаходить SCAIT ліди — Amazon brand owners з болями в SC  
**Джерела:** LinkedIn posts/comments, Reddit r/FulfillmentByAmazon  
**LPR фільтр:** Founder, CEO, Owner, Co-founder, President, Director, Head of, VP, COO — тільки якщо посада видна в сніпеті  
**Виключити:** Consultant, Coach, Agency, Freelancer, Employee без ownership  
**Пропускати:** Open to Work статус  
**Pain priority:** Stock → Operations → Cost  
**Output:** `data/leads_latest.md` з LPR ✅/❌ та pain signal

### 3. News Agent (`news_agent.md`)
**Задача:** Топ новини SC + AI за останні 24–48 год  
**Запити:**
1. Global SC: disruption / logistics / tariffs / trade / freight / China sourcing
2. Amazon/Ecomm SC: FBA / ecommerce SC / DTC logistics / 3PL
3. AI + SC: AI supply chain / SC automation / AI logistics / AI inventory
**Per item:** чому важливо для Артема + ідея для LinkedIn поста  
**Output:** `data/news_latest.md` + топ-3 пости дня

### 4. Comments Agent (`comments_agent.md`)
**Задача:** Перевіряє пости Артема в LinkedIn, пропонує відповіді  
**Читає:** `data/my_posts.md` (4 URL-и)  
**Проблема:** LinkedIn не індексує коментарі публічно — агент надає готові шаблони відповідей  
**Output:** `data/comments_latest.md` з templates + список постів для ручної перевірки

### 5. Orchestrator (`orchestrator.md`)
**Запускається:** 08:30, після всіх агентів  
**STEP 1:** Читає всі 4 файли, перевіряє timestamp (⚠️ STALE якщо >3г)  
**STEP 2:** Визначає LinkedIn дію (пн/чт = POST DUE, інакше — наступна дата)  
**STEP 3:** Створює сторінку "📋 Briefing — [дата]" в Notion  
**STEP 4:** Створює задачі в "Задачі дня" (топ-3 вакансії + LPR ліди + коментарі + пост якщо потрібен)  
**STEP 5:** Архівує Done задачі з попередніх днів в Backlog & Archive (🗃️ Архів)  
**STEP 6:** Надсилає Telegram: "☀️ SC Briefing готовий — N вакансій, N лідів, N новин"  
**STEP 7:** Виводить: "ORCHESTRATOR COMPLETE — timestamp | Jobs:N Leads:N News:N Tasks:N Archived:N"

### 6. Reminder Agent (`reminder_agent.md`)
**Запускається:** 16:00 щодня  
**Задача:** Знаходить невиконані задачі в "Задачі дня" (Статус ≠ Done, Дата = сьогодні)  
**Telegram якщо є невиконані:**
```
⚠️ [N] задач не виконано:
💼 Вакансії: ...
🎯 SCAIT Ліди: ...
📝 LinkedIn: ...
```
**Telegram якщо всі Done:** "✅ Всі задачі виконано сьогодні. Відмінна робота!"

---

## RUN_AGENT.SH — ФІНАЛЬНА ВЕРСІЯ

```bash
#!/bin/bash
export PATH="/Users/artem/.local/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

AGENT="$1"
AGENTS_DIR="$HOME/.claude/scripts/agents"
LOG="$HOME/.claude/scripts/data/${AGENT}.log"

PROMPT_FILE="$AGENTS_DIR/${AGENT}_agent.md"
[ "$AGENT" = "orchestrator" ] && PROMPT_FILE="$AGENTS_DIR/orchestrator.md"
[ "$AGENT" = "reminder" ]     && PROMPT_FILE="$AGENTS_DIR/reminder_agent.md"

echo "=== [$AGENT] $(date '+%Y-%m-%d %H:%M:%S') ===" >> "$LOG"

(cd "$HOME/.claude/scripts" && claude \
  --allowedTools "WebSearch Write Read Bash mcp__plugin_marketing_notion__*" \
  --permission-mode bypassPermissions \
  -p "$(cat "$PROMPT_FILE")") >> "$LOG" 2>&1

echo "=== done (exit:$?) $(date '+%H:%M:%S') ===" >> "$LOG"
```

---

## CRONTAB (SYSTEM-LEVEL)

```cron
PATH=/Users/artem/.local/bin:/usr/local/bin:/usr/bin:/bin

# Morning agents (паралельно, 7 хвилин до оркестратора)
3  8 * * 1-5  /Users/artem/.claude/scripts/run_agent.sh jobs
7  8 * * 1-5  /Users/artem/.claude/scripts/run_agent.sh leads
11 8 * * 1-5  /Users/artem/.claude/scripts/run_agent.sh news

# Orchestrator (читає всі дані, пише в Notion, надсилає Telegram)
30 8 * * 1-5  /Users/artem/.claude/scripts/run_agent.sh orchestrator

# Comments monitoring (4 рази на день)
0  9 * * *    /Users/artem/.claude/scripts/run_agent.sh comments
0 13 * * *    /Users/artem/.claude/scripts/run_agent.sh comments
0 17 * * *    /Users/artem/.claude/scripts/run_agent.sh comments
0 20 * * *    /Users/artem/.claude/scripts/run_agent.sh comments

# Afternoon news refresh
11 14 * * 1-5 /Users/artem/.claude/scripts/run_agent.sh news

# Evening reminder (Telegram якщо є невиконані задачі)
0 16 * * *    /Users/artem/.claude/scripts/run_agent.sh reminder
```

---

## ПРОБЛЕМИ І РІШЕННЯ

### Проблема 1: CronCreate не зберігається між сесіями
**Симптом:** Крони, створені через Claude Code skill, зникали після закриття сесії  
**Причина:** `CronCreate` — це in-session scheduled loop, не system cron  
**Рішення:** Перейшли на системний `crontab` через `crontab -e` + `claude -p` CLI

### Проблема 2: sed команда затерла весь crontab
**Симптом:** Після спроби додати запис через `sed`, весь crontab став порожнім  
**Причина:** Неправильний escape символів у sed команді  
**Рішення:** Повне ручне відновлення crontab через `crontab -e` з усіма записами

### Проблема 3: Notion MCP — параметр `id` vs URL
**Симптом:** `notion-fetch` повертав помилку  
**Причина:** Передавали URL сторінки замість UUID  
**Рішення:** Використовувати тільки UUID (36-символьний ідентифікатор)

### Проблема 4: Агенти не записують файли
**Симптом:** Агенти генерували правильний контент але файли `data/*.md` не з'являлись  
**Перша спроба:** Додали `--add-dir ~/.claude/scripts` → не допомогло  
**Друга спроба:** Запуск через `cd ~/.claude/scripts` → не допомогло  
**Третя спроба:** Змінили промпт на `tee` heredoc → ускладнення без результату  
**Root cause:** `claude -p` в non-interactive режимі блокує Write до шляхів що не належать поточній project dir. Модель інтерпретує `.claude/` як "system path" і відмовляється писати  
**Рішення:** `--permission-mode bypassPermissions` — обходить permission UI, залишає `--allowedTools` фільтр

### Проблема 5: gsd-read-guard хук
**Симптом:** Хук видавав "READ-BEFORE-EDIT REMINDER" перед кожним Edit  
**Причина:** Хук advisory (не блокує), але спрацьовував для кожного файлу  
**Рішення:** Не проблема — хук не блокував операції, тільки нагадував

### Проблема 6: Токен-лічильник показував неправильні значення
**Симптом:** Input tokens = 11-14 для складних агентів  
**Причина:** `--output-format json` рахує тільки фінальний turn, не враховуючи tool calls  
**Реальне споживання:** ~5-10x більше за рахунок web search, file reads, MCP calls

---

## ТЕХНІЧНІ КЛЮЧІ

```env
# config.env
NOTION_MY_LIFE_PAGE_ID="36cd4d2e-2457-818a-9255-fdeeaec20936"
NOTION_TASKS_DB_ID="a6bdb253-aa17-479c-9bf3-f9bb85ea3ab2"
NOTION_BACKLOG_DB_ID="810473dd-b0b0-47f6-9a2c-316c9c67f08b"
TELEGRAM_TOKEN="[bot token від @BotFather]"
TELEGRAM_CHAT_ID="[твій chat ID]"
```

---

## ПРОДУКТИВНІСТЬ (РЕАЛЬНІ ВИМІРИ)

| Агент | Час виконання | Output |
|-------|--------------|--------|
| jobs | ~94 сек | 4 вакансії |
| leads | ~265 сек | 3 ліди |
| news | ~122 сек | 9 новин |
| comments | ~73 сек | templates |
| orchestrator | ~102–212 сек | Notion + Telegram |
| **Повний цикл** | **~11 хвилин** | **5 задач + бріфінг** |

**Вартість:** ~$0.08–0.15 за повний ранковий цикл (Sonnet 4.6)

---

## ОБМЕЖЕННЯ ПОТОЧНОЇ ВЕРСІЇ

1. **LinkedIn коментарі** — публічне API не дає доступу до comment threads. Агент надає шаблони, не реальні коментарі. Вирішення: LinkedIn MCP або email forwarding
2. **Reddit** — веб-пошук не індексує Reddit контент в реальному часі. Ліди з Reddit = 0. Вирішення: Reddit API або спеціальний MCP
3. **Дублювання задач** — якщо оркестратор запускається двічі в один день, задачі дублюються. Потрібен idempotency check
4. **Stale detection** — якщо агент не запустився (зупинка комп'ютера), оркестратор позначає дані як ⚠️ STALE але все одно продовжує

---

## ЯК ВІДТВОРИТИ З НУЛЯ (CHECKLIST)

- [ ] Встановити Claude Code CLI: `npm install -g @anthropic/claude-cli`
- [ ] Налаштувати Notion MCP plugin (Knowledge Work Plugins)
- [ ] Створити Notion page "Моє життя" + 2 бази даних (Задачі дня + Backlog)
- [ ] Скопіювати IDs баз даних в config.env
- [ ] Створити Telegram бота через @BotFather, зберегти token
- [ ] Отримати свій chat_id (написати боту, перевірити через getUpdates)
- [ ] Скопіювати всі файли в `~/.claude/scripts/`
- [ ] `chmod +x ~/.claude/scripts/run_agent.sh`
- [ ] Додати crontab записи через `crontab -e`
- [ ] Тест: `bash ~/.claude/scripts/run_agent.sh news` → перевірити `data/news_latest.md`
- [ ] Тест: `bash ~/.claude/scripts/run_agent.sh orchestrator` → перевірити Notion + Telegram

---

## МОДУЛЬНІСТЬ — ЩО ЛЕГКО ЗАМІНИТИ

Система розроблена так, що кожен агент — незалежний промпт-файл:

**Вимкнути job search** (після офферу): видалити рядки jobs з crontab  
**Додати агента** (інвентаризація, відвантаження, продукт): написати новий `*_agent.md`, додати в crontab і в STEP 1 оркестратора  
**Змінити канал сповіщень** (email, Slack): замінити curl команди в оркестраторі та reminder  
**Змінити модель** (Haiku для швидкості): додати `--model claude-haiku-4-5-20251001` в run_agent.sh

---

---

## ОНОВЛЕННЯ v1.1 — 26 травня 2026 (afternoon)

### Технічний фікс: --permission-mode bypassPermissions
**Проблема:** Агенти стабільно відмовлялись писати файли в `~/.claude/scripts/data/`  
**Root cause:** `claude -p` в non-interactive режимі обмежує Write до поточної project dir. `.claude/` шляхи модель інтерпретує як system paths і відмовляється писати навіть якщо Write є в `--allowedTools`  
**Спроби що не спрацювали:**
- `--add-dir ~/.claude/scripts` → дає доступ для читання, не для запису
- `cd ~/.claude/scripts` перед запуском → не змінює permission scope
- Heredoc через `tee` в промпті → модель не генерує правильний heredoc
**Рішення:** `--permission-mode bypassPermissions` в run_agent.sh — обходить permission UI повністю, `--allowedTools` фільтр залишається активним  
**Статус:** ✅ Підтверджено тестом — `news_latest.md` записується

### Додано в run_agent.sh
- `--permission-mode bypassPermissions`
- Повний список Notion tools: fetch, update-page, update-data-source
- `cd "$HOME/.claude/scripts"` перед запуском (захист на майбутнє)

### Додано в orchestrator.md
- STEP 5 — ARCHIVE COMPLETED TASKS: архівує Done задачі з попередніх днів в Backlog & Archive (🗃️ Архів)
- ID Backlog & Archive DB додано в header
- STEP нумерація оновлена (6 → Telegram, 7 → Print Summary)

---

## ПРОДУКТОВА СТРАТЕГІЯ — GumRoad

### ICP (фінальний)
**Хто:** Amazon brand owner або COO e-com компанії, 1–10 людей, макс 4 в SC  
**Revenue:** $500K–5M (платоспроможні, не корпорація)  
**Біль:** 90 хвилин ранкового ручного збору інформації, пропущені FBA policy зміни, хаотичний supplier follow-up  
**НЕ хто:** Корпоративний SC директор, технічний розробник, найманий менеджер без P&L відповідальності

---

### ШАБЛОН 1 — Job Search Orchestrator

**Для кого:** SC/Operations спеціаліст в активному пошуку роботи  
**Одноразова оплата** — не підписка

**Як працює:**
1. Покупець заповнює **briefing файл** (одноразово):
   - Цільові посади, рівень, географія
   - Виключені галузі
   - Поточне резюме (посилання або текст)
   - Бажаний рівень активності (div нижче)
2. Система запускається автоматично щодня

**Два рівні активності (покупець обирає при налаштуванні):**

| Режим | Агенти | Що робить |
|-------|--------|-----------|
| **Passive** | jobs + orchestrator | Знаходить вакансії, створює задачі "подати заявку", відправляє в Telegram |
| **Active** | + linkedin_content + comments | Додає задачі для LinkedIn постів, моніторить реакції, пропонує коментарі до чужих постів |

**Агенти:**
- `jobs_agent` — пошук вакансій за параметрами з briefing файлу
- `resume_match_agent` — порівнює JD з резюме, підсвічує gaps, пропонує tweaks до cover letter
- `linkedin_content_agent` (Active only) — генерує ідеї постів на основі досвіду + news
- `orchestrator` → Notion задачі + Telegram

**Ціна:** $47 Passive / $79 Active  
**Ключовий хук:** "Поки ти спиш — система вже знайшла 4 вакансії і написала тебе cover letter."

---

### ШАБЛОН 2 — SC Morning Command Center (Core продукт)

**Для кого:** Amazon brand owner / COO, 1–10 людей  
**Одноразова оплата**

**Що реально працює з першого дня (без підключення до зовнішніх API):**
1. **News briefing** — SC + Amazon policy + tariffs + AI tools, щоранку в Notion
2. **Задачі дня** — автоматично з бріфінгу, з категоріями і пріоритетами
3. **Telegram** — вранці summary, ввечері reminder про невиконані
4. **Supplier follow-up templates** — власник вносить список очікувань в Notion, агент готує draft повідомлень

**Агенти:**
- `news_agent` — SC/Amazon/AI news щодня
- `supplier_agent` — читає Notion "Supplier Tracker", готує follow-up drafts для прострочених
- `orchestrator` → Notion briefing + задачі + Telegram
- `reminder_agent` → 16:00 Telegram якщо є невиконані

**Чесне обмеження (вказати в описі):**  
Система не підключається до Seller Central або 3PL. Inventory дані — вручну або через Zapier CSV export. Агент аналізує те що ти даєш.

**Ціна:** $79–97  
**Ключовий хук:** "Замість 90 хвилин ранкового хаосу — 5 хвилин на Notion."

---

### ЦІНОВА МОДЕЛЬ — ЗА КІЛЬКІСТЮ АГЕНТІВ

**Ідея: так, це працює.** Логіка зрозуміла покупцю — більше агентів = більше автоматизації = вища ціна.

| Tier | Агенти | Ціна | Позиціювання |
|------|--------|------|--------------|
| **Starter** | 2 агенти (news + orchestrator) | $47 | Новини + Notion. Спробуй систему. |
| **Core** | 4 агенти (+ supplier + reminder) | $79 | Повний ранковий ритуал |
| **Pro** | 6 агентів (+ inventory snapshot + linkedin) | $127 | Командний центр |

**Переваги моделі:**
- Проста логіка для покупця ("скільки агентів мені потрібно?")
- Природний upsell ("хочеш LinkedIn контент агента — апгрейд до Pro")
- Не потрібна підписка — покупець платить раз за рівень

**Важлива деталь:** Всередині кожен tier — ті самі файли, просто більше або менше агентів активовано в crontab. Технічно це trivial, але сприймається як "більший продукт."

---

### МОНЕТИЗАЦІЯ — ПОВНА МОДЕЛЬ

```
One-time purchases (GumRoad):
  Job Search Starter:   $47
  Job Search Active:    $79
  SC Core:              $79–97
  SC Pro:               $127

Recurring:
  Community ($29/міс):  Discord/Notion — нові агенти щомісяця, Q&A, кейси
  
Services:
  Setup call ($150):    60 хв персонального налаштування
  Custom agent ($200):  Один кастомний агент під специфіку бізнесу

V2 (6+ місяців):
  SC Pro + SP-API:      $297 (окремий продукт з реальними inventory даними)
```

**Realistic Month 1–2 target:** $2,000–4,000 через LinkedIn аудиторію  
**Month 3+ recurring:** $580–1,200/міс через community

---

## БЕКЛОГ — НАСТУПНІ КРОКИ

### P0 — Треба для першого продажу
- [ ] Замінити `jobs_agent` на `supplier_agent` в SC Core шаблоні
- [ ] Написати briefing template файл для Job Search (покупець заповнює)
- [ ] `setup.sh` — один скрипт що питає tokens і робить все сам
- [ ] Loom відео: install Claude Code (3 хв) + setup (10 хв) + перший запуск (5 хв)
- [ ] Windows setup інструкція (Task Scheduler замість crontab)
- [ ] Idempotency check в оркестраторі (не дублювати задачі якщо запустився двічі)

### P1 — Покращення після перших продажів
- [ ] `resume_match_agent` для Job Search шаблону
- [ ] `inventory_snapshot_agent` (читає CSV, аналізує days-of-stock)
- [ ] Error notification — якщо агент впав, Telegram alert
- [ ] FAQ документ (покриває 90% support питань)
- [ ] Lite версія (news + Telegram, 10 хв setup, безкоштовно як lead magnet)

### P2 — Community і upsell
- [ ] Discord/Notion community setup ($29/міс)
- [ ] Перший "місячний агент" для community учасників
- [ ] Кейс-стаді після перших 5 покупців

### P3 — V2
- [ ] Amazon SP-API integration (inventory реальні дані)
- [ ] Multi-user setup (для команд 3–5 людей)

---

*Останнє оновлення: 26 травня 2026 | v1.1*
