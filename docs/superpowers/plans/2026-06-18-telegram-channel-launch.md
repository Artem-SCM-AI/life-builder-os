# Telegram Channel — 8-Week Launch Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Launch the content system for the Claude onboarding Telegram channel — establish 2x/week posting rhythm, set up feedback mechanisms, and produce 8 weeks of ready-to-post content.

**Architecture:** Content pipeline (Claude drafts → Artem approves → posts to channel) + view tracker in Sheets + Threads cross-posting via existing Sheets/poster pipeline. No code required — all work in Telegram, Google Sheets, and markdown files.

**Tech Stack:** Telegram, Google Sheets, existing `tool-threads-poster/` Sheets pipeline

## Global Constraints

- Language: Ukrainian only in all posts
- Tone: direct, practical, slight humor — same voice as welcome post
- Tuesday posts: hook + action + example + teaser, ~150 words max
- Friday posts: 3–4 sentences, no template, spontaneous observation
- No CTA until paid product launches
- Teaser line at end of every Tuesday post is mandatory
- No feature names in hooks — always lead with the user's problem

---

### Task 1: Reactions decoder post

**Files:**
- Create: `copy-telegram-reactions-decoder.md`

**Interfaces:**
- Produces: Posted message in channel that establishes reaction vocabulary for all future posts

- [ ] **Step 1: Post the decoder message in the channel**

Post this exact text:

```
👍 = корисно, хочу більше таких
🔥 = вже спробував сам

Реакції допомагають мені розуміти що залишати, а що прибирати.
```

- [ ] **Step 2: Enable reactions in channel settings**

Telegram → Channel Settings → Reactions → enable all or select emoji set that includes 👍 and 🔥.

- [ ] **Step 3: Save to file**

Save posted text to `copy-telegram-reactions-decoder.md`.

---

### Task 2: View tracker in Google Sheets

**Files:**
- Create: Google Sheets "TG Channel Tracker" (external)
- Create: `ref-telegram-tracker-url.md`

**Interfaces:**
- Produces: Spreadsheet used after every post to log views and reactions. Referenced in weekly review.

- [ ] **Step 1: Create the spreadsheet**

Create a new Google Sheet titled "TG Channel Tracker". Add these columns in row 1:

| Date | Day | Week | Type | Topic | Views | 👍 | 🔥 | Notes |
|------|-----|------|------|-------|-------|----|-----|-------|

- [ ] **Step 2: Pre-fill 8 weeks of scheduled posts**

Add these rows (leave Views/Reactions empty — fill after posting):

| Date | Day | Week | Type | Topic |
|------|-----|------|------|-------|
| 2026-06-24 | Tue | 1 | Main | Як Claude знає контекст твого бізнесу з першого запиту |
| 2026-06-27 | Fri | 1 | Short | Спостереження тижня |
| 2026-07-01 | Tue | 2 | Main | Пишу один рядок — Claude видає пост у моєму стилі |
| 2026-07-04 | Fri | 2 | Short | Спостереження тижня |
| 2026-07-08 | Tue | 3 | Main | Ставлю задачу — Claude записує в Notion сам |
| 2026-07-11 | Fri | 3 | Short | Спостереження тижня |
| 2026-07-15 | Tue | 4 | Main | Скидаю PDF постачальника — Claude робить порівняння за 10 секунд |
| 2026-07-18 | Fri | 4 | Short | Спостереження тижня |
| 2026-07-22 | Tue | 5 | Main | Як Claude готує шаблон оцінки постачальника за 2 хвилини |
| 2026-07-25 | Fri | 5 | Short | Спостереження тижня |
| 2026-07-29 | Tue | 6 | Main | Автоматичний щоденник: Claude сам записує що ми зробили за сесію |
| 2026-08-01 | Fri | 6 | Short | Спостереження тижня |
| 2026-08-05 | Tue | 7 | Main | Google Sheets + Claude: аналіз таблиці без формул |
| 2026-08-08 | Fri | 7 | Short | Спостереження тижня |
| 2026-08-12 | Tue | 8 | Main | Один промпт — і у мене готовий план на тиждень |
| 2026-08-15 | Fri | 8 | Short | Спостереження тижня |

- [ ] **Step 3: Save tracker URL**

Copy Sheets URL → save to `ref-telegram-tracker-url.md`:
```
# TG Channel Tracker

[paste URL here]

Columns: Date | Day | Week | Type | Topic | Views | 👍 | 🔥 | Notes
Update views 24h after each post.
```

---

### Task 3: Week 1 Tuesday post

**Files:**
- Create: `copy-telegram-week1-tuesday.md`

**Interfaces:**
- Consumes: post format from spec (hook + action + example + teaser)
- Produces: first posted tip in channel + Threads version for cross-posting

- [ ] **Step 1: Review and approve the draft**

Draft (edit if needed before posting):

```
Щоразу пояснювати Клоду хто ти і чим займаєшся — це токени в смітник.

Рішення: memory-файли. Один раз описуєш себе — роль, цілі, ключові проекти — і Claude читає це автоматично на початку кожної сесії. Перший запит вже "в контексті", без зайвих пояснень.

Виглядає просто: папка memory/ → файл user_profile.md → 15-20 рядків про тебе. У готовому workspace із закріпленого поста це вже налаштовано.

Наступного вівторка — як Claude пише пост у моєму стилі за одним рядком.
```

- [ ] **Step 2: Post to Telegram channel**

Post the approved text. Note time posted.

- [ ] **Step 3: Log in tracker**

Open TG Channel Tracker Sheets → fill Date, Day, Week 1, Type: Main, Topic.

- [ ] **Step 4: Save to file**

Save posted text to `copy-telegram-week1-tuesday.md`.

- [ ] **Step 5: Write Threads cross-post version**

Shorter version for Threads (no example block, ends with channel mention):

```
Щоразу пояснювати Клоду хто ти — це токени в смітник.

Memory-файли вирішують це. Один раз описуєш себе — і Claude знає з першого запиту.

Детальніше — у каналі (лінк у біо).
```

Add this as a new row in the existing Threads poster Sheets (use same format as other rows in the sheet).

---

### Task 4: Week 1 Friday post

**Files:**
- Create: `copy-telegram-week1-friday.md`

**Interfaces:**
- Produces: first short post; sets tone for all future Friday posts

- [ ] **Step 1: Write a short observation from this week**

Template (replace with actual observation — this is a default if nothing stands out):

```
Сьогодні скинув PDF з двома офертами постачальників. Claude зробив порівняльну таблицю за 8 параметрів і написав висновок. 40 секунд. Раніше це була година в Excel і три каву.
```

- [ ] **Step 2: Post to Telegram channel**

Post the text. No teaser line needed for Friday posts.

- [ ] **Step 3: Log in tracker and save file**

Fill row in Sheets (Week 1, Fri, Short). Save to `copy-telegram-week1-friday.md`.

---

### Task 5: Weeks 2–4 Tuesday posts (content batch)

**Files:**
- Create: `copy-telegram-week2-tuesday.md`
- Create: `copy-telegram-week3-tuesday.md`
- Create: `copy-telegram-week4-tuesday.md`

**Interfaces:**
- Produces: three approved, ready-to-post drafts with Threads versions

Post these on their scheduled Tuesday dates. Each file contains the Telegram post + Threads cross-post version at the bottom.

- [ ] **Step 1: Save Week 2 Tuesday draft to file**

Telegram post:
```
Описую стиль свого голосу один раз. Далі — просто пишу: "зроби пост про X".

Claude не дає "загальний контент". Він враховує як я зазвичай починаю, що уникаю, який ритм речень. Виходить текст який мені не соромно підписати.

Це не магія — це brand-voice файл у memory/. Кілька прикладів твоїх постів і опис того що тобі не подобається. Все.

Наступного вівторка — як поставити задачу в Notion без відкриття браузера.
```

Threads version:
```
Описуєш свій стиль один раз — і Claude пише пости які звучать як ти.

Brand-voice файл у memory/. Кілька прикладів, кілька заборон. Далі просто: "зроби пост про X".

Детальніше — у каналі (лінк у біо).
```

- [ ] **Step 2: Save Week 3 Tuesday draft to file**

Telegram post:
```
"Записати в Notion" — це завжди три кліки і відкрита вкладка.

Я зупинив цей ритуал. Тепер пишу Клоду прямо в розмові: "Запиши задачу: перевірити рахунок від постачальника, дедлайн четвер." Claude через MCP відкриває Notion і створює задачу з потрібними полями.

Браузер не відкривався жодного разу.

Наступного вівторка — що відбувається коли скидаєш PDF договору прямо в розмову.
```

Threads version:
```
"Записати в Notion" — це завжди три кліки.

Тепер: пишу Клоду → він сам відкриває Notion і створює задачу. Без браузера.

Детальніше — у каналі (лінк у біо).
```

- [ ] **Step 3: Save Week 4 Tuesday draft to file**

Telegram post:
```
Отримав оферту від нового постачальника. PDF на 8 сторінок.

Скинув його в розмову з Claude. Запитав: "Порівняй з нашим поточним — ціна, терміни, умови повернення, штрафи." Отримав таблицю з 6 параметрів і коротким висновком.

Раніше я б витратив годину і все одно міг щось пропустити.

Наступного вівторка — як Claude оцінює постачальника за твоїми критеріями автоматично.
```

Threads version:
```
Скинув PDF оферти — запитав Claude порівняти з поточним постачальником.

Таблиця з 6 параметрів і висновок. 40 секунд.

Детальніше — у каналі (лінк у біо).
```

- [ ] **Step 4: Add all three Threads versions to poster Sheets**

Add rows for Weeks 2, 3, 4 Threads posts to the existing poster Sheets. Schedule for the corresponding Tuesday dates.

---

### Task 6: Weeks 5–8 Tuesday posts (content batch)

**Files:**
- Create: `copy-telegram-week5-tuesday.md`
- Create: `copy-telegram-week6-tuesday.md`
- Create: `copy-telegram-week7-tuesday.md`
- Create: `copy-telegram-week8-tuesday.md`

**Interfaces:**
- Produces: four approved, ready-to-post drafts with Threads versions

- [ ] **Step 1: Save Week 5 Tuesday draft to file**

Telegram post:
```
Кожного разу коли треба вибрати постачальника — одні й ті самі питання: надійність, ціна, терміни, якість комунікації.

Я зробив шаблон оцінки. Тепер Claude заповнює його сам — я тільки даю дані або PDF. На виході: картка постачальника з балами і рекомендацією.

5 хвилин замість години таблиць.

Наступного вівторка — як Claude веде щоденник кожної нашої сесії без мого втручання.
```

Threads version:
```
Шаблон оцінки постачальника — Claude заповнює сам по PDF або даних.

Картка з балами і рекомендацією. 5 хвилин замість години.

Детальніше — у каналі (лінк у біо).
```

- [ ] **Step 2: Save Week 6 Tuesday draft to file**

Telegram post:
```
Після кожної сесії я забував що саме вирішили. Доводилось відкривати переписку і шукати.

Вирішив просто: Stop hook. Коли Claude завершує роботу — він сам пише короткий запис у journal/: що зробили, які рішення прийняли, що залишилось. Наступна сесія починається з цим контекстом.

Більше не шукаю "а про що ми домовились минулого разу".

Наступного вівторка — Claude аналізує таблицю Sheets без жодної формули.
```

Threads version:
```
Stop hook: коли Claude закінчує роботу — він сам записує що зробили і що вирішили.

Наступна сесія знає з чого починати. Більше не шукаю що ми обговорювали.

Детальніше — у каналі (лінк у біо).
```

- [ ] **Step 3: Save Week 7 Tuesday draft to file**

Telegram post:
```
Таблиця зі 200 рядків. Треба знайти патерн, порахувати підсумки, зрозуміти де проблема.

Раніше: формули, пивот-таблиці, 40 хвилин.
Тепер: даю Claude доступ до Sheets через MCP і запитую звичайною мовою. "Знайди топ-5 постачальників за обсягом. Де найбільші затримки?" Відповідь за хвилину.

VLOOKUP більше не потрібен.

Наступного вівторка — як Claude будує план тижня за одним промптом.
```

Threads version:
```
Таблиця 200 рядків. Запитав Claude звичайною мовою — відповідь за хвилину.

VLOOKUP більше не потрібен.

Детальніше — у каналі (лінк у біо).
```

- [ ] **Step 4: Save Week 8 Tuesday draft to file**

Telegram post:
```
Понеділок. Купа задач, нема структури.

Пишу Claude: "Ось мої проекти і дедлайни на цьому тижні. Склади план — що робити і в якому порядку." Отримую список з пріоритетами і логікою чому саме так.

Не ідеально — але це вже не чиста аркуш. Є від чого відштовхнутись.

На наступних тижнях — оголошення. Готую щось для вас.
```

Threads version:
```
Один промпт — і Claude склав план тижня з пріоритетами і логікою.

Не ідеально, але не чистий аркуш.

Детальніше — у каналі (лінк у біо).
```

- [ ] **Step 5: Add all four Threads versions to poster Sheets**

Add rows for Weeks 5, 6, 7, 8 to existing Threads poster Sheets. Schedule for corresponding Tuesday dates.

---

### Task 7: New subscriber DM template

**Files:**
- Create: `copy-telegram-subscriber-dm.md`

**Interfaces:**
- Produces: reusable DM template; Artem sends manually to each new subscriber while channel is under 200 subs

- [ ] **Step 1: Save DM template to file**

```
Привіт! Дякую що підписався.

Одне питання: що намагаєшся автоматизувати або спростити у своїй роботі? 

Запитую бо хочу щоб контент у каналі був про реальні задачі, не теорію.
```

Save to `copy-telegram-subscriber-dm.md`.

- [ ] **Step 2: Set a weekly reminder**

Every Monday: check new subscribers in channel analytics → send DM to anyone who joined that week.

---

### Friday posts — Weeks 2–8

Friday posts are intentionally spontaneous — they capture a real observation from that week. Do not pre-draft them. Each Friday:

1. Think of one thing Claude did or helped with this week that was surprising or saved time.
2. Write 3–4 sentences. No template.
3. Post to channel. Log in tracker (Week N, Fri, Short).
4. No Threads cross-post for Friday posts — they're too short to repurpose.

If nothing stands out that week, skip the Friday post. Consistency matters more than frequency.

---

### Task 8: Monthly audience poll

**Files:** none (Telegram native poll)

**Interfaces:**
- Produces: quantitative signal on which topics/formats resonate. Run once per month.

- [ ] **Step 1: End of Week 4 — post first poll**

Create a Telegram poll (native feature → attachment icon → Poll):

```
Question: Що тобі важливіше у цьому каналі?

Options:
А) Практичні кейси — що я реально роблю з Claude
Б) Інструкції — як налаштувати і запустити
В) Порівняння інструментів — Claude vs інші
Г) Все одно, якщо конкретно і коротко
```

Allow multiple choice: No. Anonymous: Yes.

- [ ] **Step 2: Log result in tracker**

Add a "Poll" row in Sheets after results are in (48h after posting). Note winning answer in Notes column.

- [ ] **Step 3: Adjust topic backlog for weeks 5–8**

If А wins → add more personal story to posts. If Б wins → make steps more explicit. If В wins → add a comparison post to backlog.

---

### Task 9: Post-week-8 review

**Files:**
- Modify: `ref-telegram-tracker-url.md` (add review section)

**Interfaces:**
- Consumes: 8 weeks of data from TG Channel Tracker
- Produces: decision on whether to continue 2x/week or drop to 1x/week

- [ ] **Step 1: After Week 8, review tracker data**

Open TG Channel Tracker. Check:
- Which 3 Tuesday posts had highest views?
- Which topics got most 🔥 reactions?
- Subscriber growth: current count vs 45 at start

- [ ] **Step 2: Decide posting frequency**

If average Tuesday views ≥ 150 and subscriber growth ≥ 50 new subs: continue 2x/week.
If below: drop to 1x/week (Tuesday only), topics chosen from highest-performing category.

- [ ] **Step 3: Plan next 8 weeks**

Use same process: draft Tuesday batch → add Threads versions to Sheets → repeat.

At 100+ subscribers: plan the first paid workshop announcement post (separate plan).
