# SCAIT — Master Knowledge Base
*Last compiled: April 30, 2026. Single source of truth for all 9 products.*

---

## TABLE OF CONTENTS

1. [Company Overview](#1-company-overview)
2. [Target ICP](#2-target-icp)
3. [Product Portfolio — 9 Products](#3-product-portfolio--9-products)
4. [Pricing & Packaging](#4-pricing--packaging)
5. [Sales System (SCAI — повністю розроблений)](#5-sales-system)
6. [Delivery System (SCAI)](#6-delivery-system)
7. [GTM & Acquisition](#7-gtm--acquisition)
8. [Verified Numbers & Claims](#8-verified-numbers--claims)

---

## 1. COMPANY OVERVIEW

**Назва:** SCAIT — Supply Chain AI Tools  
**Сайт:** scait.space  
**Засновник / CEO:** Artem Stepanenko  
**Статус:** Pre-revenue; manual delivery phase (April 2026)

### Що таке SCAIT

Портфель з 9 AI-інструментів для supply chain, які автоматизують рутинні процеси Amazon brand owners: комунікацію з постачальниками, перевірку інвойсів, контроль якості, відстеження відвантажень, девіації прогнозів. Кожен інструмент вирішує конкретну больову точку, яку SC-команди сьогодні вирішують вручну — або не вирішують взагалі.

### Execution Philosophy

**Зрозуміти → Валідувати → Продати → Доставити вручну → Автоматизувати**

- Жодного коду до першого платного клієнта
- Claude + Google Sheets = delivery engine на старті
- Автоматизація будується тільки після того, як workflow доведено і попит підтверджено
- Artem виконує роботу вручну і є living proof of concept

### Бізнес-модель

| Компонент | Деталі |
|-----------|--------|
| Setup fee | $300 на продукт (покриває onboarding call + перший тиждень налаштування) |
| Monthly retainer | $49/місяць на продукт |
| Ecosystem bundle | $350/місяць за всі 9 продуктів |
| Enterprise range | $500–$10,000+/місяць (великі бренди, кілька продуктів) |
| Revenue targets | $1,000 MRR → $3,500 MRR (~10 ecosystem subscribers) |

### Tech Stack (Service Delivery)

- **Claude / Claude Code** — AI reasoning engine для всіх workflow
- **Google Sheets** — CRM + data backend для клієнтів і внутрішнє відстеження
- **Gmail** — прийом forwarded emails + доставка результатів
- **Google Drive** — зберігання deliverables (inspection reports, specs тощо)
- **WhatsApp** — ескалаційні алерти для клієнтів
- **Жодного custom backend** до Phase 3+

---

## 2. TARGET ICP

### Primary ICP

**Amazon brand owner, 20–200 employees, 5–50 активних постачальників.**

Типовий профіль:
- Управляє фізичними продуктами на Amazon (private label або branded)
- Основний sourcing — Китай; часто 3–10 постачальників паралельно
- Команда SC: або сам засновник, або 1–2 SC менеджери
- Операційний обсяг: $1M–$20M річного обороту
- Не має ERP або має щось базове; живе в email + Excel
- Ухвалює рішення швидко; час = гроші; платить за рішення, не за процес

### Ролі, які купують

| Роль | Продукт | Що болить |
|------|---------|-----------|
| Founder / CEO | SCAI, EMS, 3PLV | "Я сам читаю всі листи постачальників і ніколи не встигаю" |
| Head of Operations / COO | 3PLV, EMS, DEVMON | "Я не знаю де ми втрачаємо гроші поки не отримую звіт" |
| Head of Supply Chain | SCAI, SINV, QIV, FWAI | "Ми постійно пропускаємо важливі деталі в комунікації" |
| Finance / CFO | SINV, 3PLV | "Ми платимо більше ніж мали б — але не знаємо скільки" |
| QA / Procurement Manager | SPEC, QIV, INSP | "Кожен інспектор здає звіти по-своєму" |

### Сильні сигнали (купують охоче)

- Постав запитання в LinkedIn / Reddit про supplier проблеми в останні 30 днів
- 3+ постачальники з Китаю
- $1M+ річний оборот (команда, склад, реклама — видно в профілі)
- Активний на LinkedIn (постить регулярно)
- Вже щось автоматизував або цікавиться AI-інструментами

### Дискваліфікатори

- Працюють в Amazon.com (а не Amazon seller)
- Консультант, коуч або агентство (продають послуги, не товари)
- Wholesale distributor (не private label)
- Оборот нижче $500K (замалий для $49/місяць ROI)
- Дропшиппінг (немає реальних постачальників і інвойсів)

---

## 3. PRODUCT PORTFOLIO — 9 PRODUCTS

### Архітектура: 4 шари

| Layer | Назва | Продукти |
|-------|-------|---------|
| Layer 1 | Planning & Analytics | DEVMON, EMS |
| Layer 2 | Procurement & Quality | SCAI, SPEC, QIV, INSP |
| Layer 3 | Logistics & Tracking | FWAI |
| Layer 4 | Financial Audit | SINV, 3PLV |

---

### PRODUCT 1: Supplier Communication AI (SCAI)
**Layer:** Procurement & Quality | **Phase:** 1 — Active Sprint | **Priority:** #1

#### Яку проблему вирішує

Кожен email від постачальника — це 10–15 хвилин роботи: прочитати, знайти всі важливі деталі, перевірити чи є зміни від останнього разу, скласти відповідь, занести дані кудись. При 5+ постачальниках і 10–15 листах на тиждень це 2–3 години щотижня — і ці години йдуть на механічну роботу, не на прийняття рішень.

Конкретні проблеми:
- **Пропущені цінові зміни.** Постачальник пише про зростання ціни в третьому абзаці — поряд зі звітом про виробництво. Brand owner читає по діагоналі і пропускає. Наступне замовлення йде за старою моделлю COGS.
- **Пропущені зсуви lead time.** "Production is slightly delayed" = +14 днів, що означає stockout ризик. Без систематичного відстеження — дізнаєшся коли вже пізно.
- **Відсутність єдиної бази даних.** Через 6 місяців неможливо відповісти на запитання "Коли FunPro вперше підняв ціну?" — все розкидано по email threads.
- **Повільні відповіді.** На складання правильного reply іде 20+ хвилин — перевірити тон, перевірити факти, не образити постачальника, не згодитися на невигідні умови.
- **Платіжні дедлайни.** T/T payments buried в листах. Пропустив — production зупиняється або платиш штраф.
- **Мовний бар'єр.** Китайський постачальник пише "Chinglish" — половина листа незрозуміло, intent unclear, невідомо чи треба ескалювати.

#### Як працює (workflow)

1. Клієнт пересилає email постачальника на Gmail Artem'а
2. Artem відкриває Claude, вставляє email + supplier context (з Google Sheet)
3. Claude витягує structured data: lead time, ціна, MOQ, production status, ETD/ETA, payment terms, флаги
4. Claude ідентифікує Key Alerts: зміна ціни >5%, зсув lead time >7 днів, якість, форс-мажор
5. Claude генерує reply draft (макс. 150 слів, у тоні клієнта — formal або friendly)
6. Якщо є алерти — Artem WhatsApp-ить клієнта до доставки результату
7. Artem оновлює рядок у Google Sheet (Email Log): всі 8 полів + suggested reply + статус
8. Клієнт отримує reply draft + лінк на sheet; переглядає, відправляє або просить корекцію

**SLA:** 4 business hours від отримання email.

#### Key Stats / ROI

| Метрика | Значення |
|---------|----------|
| Реальний кейс | $47,000 замовлення; 6.2% цінове зростання = **$2,914 overcharge** |
| ROI | Один спійманий price change покриває **5 років сервісу** (3.3× annual cost) |
| Break-even | Менше 2% цінова зміна на одному замовленні |
| Швидкість | 30 сек parsing vs 10–15 хв вручну |
| Reply | 118 слів, 2 хв review vs 20 хв написання |
| Price change в демо | $89.00 → $94.50/unit (+$5.50) на 500 units = +$2,750 COGS |

#### ICP fit

E-commerce brand, 20–200 employees, 5–50 suppliers. Особливо гострий біль у Founder / CEO, які самі читають листи постачальників.

#### Pricing

| Tier | Price |
|------|-------|
| Setup fee | $300 |
| Monthly | $49/mo |
| Annual service cost | $888/year |
| Enterprise range | $700–$2,500/mo |

#### Sales motion

Founder-led outbound до Ops / Procurement. 2-тижневий pilot. Demo-call 15 хвилин на реальному email.

---

### PRODUCT 2: Exception Management System (EMS)
**Layer:** Planning & Analytics | **Phase:** 2 | **Priority:** #2

#### Яку проблему вирішує

У brand owner немає єдиного місця де видно всі проблеми одночасно. Інвентарний рівень — в одній таблиці. Швидкість продажів — в Amazon Seller Central. Lead time від постачальника — в email. Затримки відвантаження — в листах freight forwarder'а. Жоден з цих сигналів не з'єднаний між собою автоматично.

Конкретні проблеми:
- **Stockout сюрприз.** Команда дізнається про нестачу товару коли він вже закінчується — а не за 2–3 тижні до цього.
- **Відсутність пріоритизації.** Є 10 "проблем" одночасно — яку вирішувати першою? Без P&L-impact ranking команда витрачає час на дрібниці і пропускає критичне.
- **Ручна агрегація.** SC менеджер збирає дані по понеділках — займає 3–4 години. Все що сталося в п'ятницю після обіду — стає відомо в понеділок вранці.
- **Немає сигнального шару.** Ніхто не контролює velocity shifts, supplier lead time зміни, і рівень інвентаря одночасно. Кожен дивиться у свою частину — ніхто не бачить цілу картину.
- **Пізня реакція.** Коли exception вже видна в даних — часто вже пізно для дешевого рішення. Air freight замість ocean, rush order з premium — це наслідок відсутності раннього сигналу.

#### Як працює (workflow)

1. Клієнт надає: inventory levels, sales velocity, supplier lead times (з таблиць або Seller Central export)
2. Claude аналізує всі дані разом, шукає аномалії та невідповідності
3. Генерує ranked alert list з severity scores (P&L impact based)
4. Кожна exception: опис + root cause signal + рекомендована дія
5. Клієнт отримує пріоритизований список що треба зробити сьогодні

**Key stat:** Stockout сигнали видні за 14 днів до події у вже існуючих даних — просто їх ніхто не з'єднував.

#### ICP fit

Mid-market brand з high SKU count. Гострий біль у Head of Operations / Supply Chain Lead.

#### Pricing

| Tier | Price |
|------|-------|
| Setup fee | $300 |
| Monthly | $49/mo |
| Enterprise range | $500–$1,500/mo |

#### Sales motion

ROI demo з live даними клієнта. Продається Supply Chain / Ops lead. Показати: "ось що ми знайшли у ваших даних за 10 хвилин."

---

### PRODUCT 3: Demand vs Plan Deviation Monitor (DEVMON)
**Layer:** Planning & Analytics | **Phase:** 2 | **Priority:** #3

#### Яку проблему вирішує

Прогноз складається раз на місяць або раз на квартал — і потім живе своїм життям. Реальні продажі відхиляються, але ніхто систематично не порівнює plan vs actual поки не настає кінець місяця. До того моменту замовлення вже розміщені, виробництво вже запущено, і змінити що-небудь — дорого.

Конкретні проблеми:
- **Невидиме відхилення.** 5–10% deviation від плану здається дрібницею — але на $500K замовленні це $25–50K зайвого або браклого інвентаря.
- **Відсутність root cause.** Прогноз відхилився — але чому? Промо-акція Amazon? Сезонний спайк? Competitor out of stock? Без сигналу причини — команда не знає що робити.
- **Пізня корекція репленішменту.** Якщо deviation виявили на тижні 4 — наступне замовлення вже в дорозі. Якби знали на тижні 1–2 — ще можна було б скоригувати.
- **Ручний моніторинг.** SC менеджер робить порівняння вручну в Excel раз на тиждень — якщо взагалі робить. Немає автоматичного тригера при відхиленні.
- **Немає алертингу по threshold.** Не налаштований поріг "якщо actual відхилилось на X% — автоматично флагнути."

#### Як працює (workflow)

1. Клієнт надає: forecast (plan) + actual sales data за поточний/минулий период
2. Claude порівнює план vs факт по SKU, категорії, часовому відрізку
3. Ідентифікує відхилення >5% (налаштовується) — і додає root cause signal
4. Генерує deviation report: які SKU overperform, які underperform, і можливі причини
5. Якщо відхилення критичне — рекомендує конкретні дії (adjust next PO qty, expedite, cancel)

#### ICP fit

Brand з плановим forecasting процесом, що хоче автоматизувати моніторинг. Зазвичай $2M+ бренд.

#### Pricing

| Tier | Price |
|------|-------|
| Setup fee | $300 |
| Monthly | $49/mo |

#### Sales motion

Show the gap: "Скільки часу минає між тим як deviation з'являється в даних і тим як ви про неї дізнаєтесь?" Демо на їхніх власних числах.

---

### PRODUCT 4: Supplier Invoice Validation (SINV)
**Layer:** Financial Audit | **Phase:** 2 | **Priority:** #4

#### Яку проблему вирішує

Supplier invoice перевіряється вручну, наспіх, між іншими задачами. PO десь в email, invoice прийшов PDF, receiving report у когось в таблиці. Щоб зробити правильний 3-way match — треба 30–45 хвилин на інвойс. При великому об'ємі замовлень — це або не робиться, або робиться частково.

Конкретні проблеми:
- **Несанкціоновані цінові зміни.** Постачальник виставляє інвойс за новою ціною, яку "погодили" в листуванні — але в PO стоїть стара. Без перевірки — платиш більше.
- **Помилки в кількості.** Invoiced 500 units, received 487. Без match — різниця губиться.
- **Дублікати.** Один і той самий інвойс виставляється двічі — особливо якщо payments проходять через різних людей або банки.
- **Прихований перерахунок.** Додаткові рядки у invoice — "handling fee", "rush surcharge", "material adjustment" — які не були в PO.
- **Відсутність dispute documentation.** Навіть якщо помітили — немає автоматично сформованого документа щоб оспорити. Пишуть email вручну, втрачають час.
- **Ручний процес catch ~50% помилок.** За оцінкою: при 40-рядкових інвойсах вручну помічається приблизно половина невідповідностей.

#### Як працює (workflow)

1. Клієнт надає: PO (purchase order) + supplier invoice + receiving report
2. Claude виконує 3-way match: порівнює кількість, ціну, умови по кожному рядку
3. Флагує всі невідповідності з точними сумами variance
4. Генерує dispute documentation — готовий лист постачальнику з переліком розбіжностей

#### ICP fit

Brand з PO/invoice volume — $5M+. Finance + Procurement co-sell. Compliance і audit angle.

#### Pricing

| Tier | Price |
|------|-------|
| Setup fee | $300 |
| Monthly | $49/mo |
| Enterprise range | $800–$3,000/mo |

#### Sales motion

Finance + Procurement co-sell. Audit/compliance angle. "Скільки ви сплатили понад PO за минулий рік?"

---

### PRODUCT 5: 3PL Invoice & Cost Validation System (3PLV)
**Layer:** Financial Audit | **Phase:** 2 | **Priority:** #5

#### Яку проблему вирішує

3PL invoice — це 40+ рядків: зберігання, handling, receiving, labeling, parcel shipping, order processing. Кожна послуга має свою ставку в контракті. Вручну порівнювати invoice рядок за рядком з rate card — 45 хвилин мінімум. Тому більшість компаній або не перевіряють взагалі, або перевіряють тільки велику суму внизу.

Конкретні проблеми:
- **Zone billing errors.** 3PL виставляє рахунок за Zone 6 замість Zone 4 — за тим самим SKU. Різниця в ставці множиться на сотні відвантажень і накопичується місяцями без виявлення.
- **Unauthorized rate increases.** В контракті стоїть annual increase cap (наприклад, max(4%, ECI)). 3PL підвищує більше або підвищує раніше терміну.
- **Неправильна категоризація.** Standard pallet виставляється як oversized. Parcel <10 lb виставляється за ставкою 10–100 lb.
- **Кредити не застосовуються.** 3PL обіцяв credit за помилковий receiving — але він не з'явився в інвойсі.
- **Прихована double-billing.** Один і той самий rework charge виставлений двічі в різних рядках.
- **Неможливо відстежити тренд.** Без автоматичного логування — не видно, що overcharges почалися після ротації менеджера або після зміни тарифної сітки.

#### Як працює (workflow)

1. Клієнт надає: 3PL invoice (PDF або CSV) + contract rate card
2. Claude порівнює кожен рядок invoice з відповідною ставкою в контракті
3. Флагує всі невідповідності: зона, ставка, категорія — з точним dollar variance
4. Генерує recovery report: загальна сума overcharge + по категоріях + рекомендовані дії

#### Key Stats / ROI

| Метрика | Значення |
|---------|----------|
| Реальний кейс | **$91,800 in overcharges** — Zone 6 виставлявся замість Zone 4, 8 місяців |
| Ручний процес | 45 хв/invoice; catch rate ~50% помилок |
| Annual recovery ($5M brand) | **$270K–$370K/year** |
| Annual service cost (3 tools) | $2,664 |
| Year 1 net recovery (приклад) | **$91,650** |

#### ICP fit

E-commerce company з кількома 3PL. Гострий біль у COO / Finance. Margin-savings story.

#### Pricing

| Tier | Price |
|------|-------|
| Setup fee | $300 |
| Monthly | $49/mo |
| Enterprise range | $800–$3,500/mo |

#### Sales motion

Margin-savings story для COO / Finance. "Ваш 3PL contract — давайте перевіримо останній інвойс прямо зараз."

---

### PRODUCT 6: AI Inspection Report Processor (INSP)
**Layer:** Procurement & Quality | **Phase:** 3 | **Priority:** #6

#### Яку проблему вирішує

Кожна партія товару — це inspection report від третьостороннього інспектора або власної команди. Ці звіти приходять у форматі PDF, email, фото або таблиць. Стандарту немає — кожен інспектор форматує по-своєму. Через 6 місяців неможливо знайти старий звіт або порівняти результати між партіями.

Конкретні проблеми:
- **Хаос зберігання.** Звіти розкидані по email threads, WhatsApp, Google Drive без структури. Пошук конкретного звіту — 15–45 хвилин.
- **Немає стандартизації.** Один інспектор пише "Minor cosmetic defect", інший "Surface scratch" — це одне й те саме, але не порівнювано.
- **Ручне введення даних.** Щоб завести звіт у будь-яку систему — треба вручну копіювати дані. Це не відбувається або відбувається з помилками.
- **Невидимі дефектні тренди.** "Тільки 2 defects у цій партії" — але якщо це вже п'ята партія з цим самим типом дефекту від того ж постачальника — це патерн, а не одиночний випадок. Без агрегації — патерн невидимий.
- **Немає cross-reference з tech spec.** Інспектор флагнув дефект — але чи це справді порушення специфікації або просто різна інтерпретація? Без автоматичного cross-check — питання відкрите.

#### Як працює (workflow)

1. Клієнт пересилає inspection reports (PDF, email, фото)
2. Claude витягує structured data: постачальник, SKU, тип інспекції, дата, результат, дефекти
3. Стандартизує формат незалежно від джерела
4. Організовує у Google Drive: папки по SKU → постачальнику → типу інспекції
5. Будує searchable log; surfаces defect trends across batches

**Key stat:** 45 хвилин → 10 секунд щоб знайти будь-який звіт.

#### ICP fit

Importer / private-label operator з частими QC інспекціями. QA/Ops champion.

#### Pricing

| Tier | Price |
|------|-------|
| Setup fee | $300 |
| Monthly | $49/mo |
| Enterprise range | $400–$1,500/mo |

#### Sales motion

Ops/QA champion. Show time saved + data standardization. "Скільки часу ви витрачаєте щоб знайти конкретний звіт за минулий рік?"

---

### PRODUCT 7: AI Product Spec & Inspection Generator (SPEC)
**Layer:** Procurement & Quality | **Phase:** 3 | **Priority:** #7

#### Яку проблему вирішує

Технічна специфікація — основа відносин з постачальником і основа для інспекції. Але написати її правильно — 3–4 години роботи SC або Product Manager'а: розміри, матеріали, допуски, маркування, пакування, AQL стандарти. Більшість брендів або не мають повноцінних tech packs, або мають застарілі версії, або у кожного постачальника своя версія.

Конкретні проблеми:
- **Відсутність документованих специфікацій.** Вимоги передаються усно або в листах — немає единого документа, на який можна посилатися при суперечці.
- **Непослідовні inspection checklist.** Кожна інспекція перевіряє різне залежно від інспектора. Без прив'язки до tech spec — немає стандарту.
- **Час на написання.** 3–4 години на один tech pack — це нереально при запуску 5+ SKU на рік.
- **Помилки у специфікаціях.** Ручне написання = пропущені параметри, суперечливі допуски, неправильні AQL рівні.
- **Постачальник не розуміє вимоги.** Непрофесійно складений brief → постачальник інтерпретує по-своєму → defects → відносини псуються.
- **Немає template для нових продуктів.** Кожного разу починають з нуля.

#### Як працює (workflow)

1. Клієнт надає: product brief (навіть грубий — тип продукту, матеріал, ключові параметри)
2. Claude генерує повний tech pack: розміри, матеріали, tolerances, маркування, пакування
3. Генерує supplier-ready inspection checklist з AQL стандартами
4. Клієнт reviewує і коригує — 15 хвилин замість 3–4 годин написання

**Time reduction:** 3–4 години → 15 хвилин review.

#### ICP fit

Brand що часто запускає нові продукти (5+ SKU/рік). Product / Sourcing / QA team. Легкий entry add-on до основного продукту.

#### Pricing

| Tier | Price |
|------|-------|
| Setup fee | $300 |
| Monthly | $49/mo |
| Enterprise range | $300–$1,200/mo |

#### Sales motion

Product / sourcing / QA team. Easy entry add-on. "Скільки нових SKU ви запускаєте на рік і скільки годин іде на кожен tech pack?"

---

### PRODUCT 8: AI Quality Inspection Validation System (QIV)
**Layer:** Procurement & Quality | **Phase:** 3 | **Priority:** #8

#### Яку проблему вирішує

Inspection report приходить від третьосторонньої компанії — і бренд сприймає результат як істину. Але інспектори теж помиляються: класифікують defects неправильно, пропускають порушення tech spec, або занижують severity щоб уникнути конфліктів з фабрикою. Крім того, один і той самий дефект може бути записаний як "minor" одним інспектором і "major" іншим.

Конкретні проблеми:
- **Неправильна класифікація defects.** "Minor" cosmetic defect може бути "Major" якщо торкається функціональності або safety — але інспектор не завжди правильно розрізняє.
- **Inconsistent scoring across batches.** Партія A отримала 2.1% defect rate, партія B — 1.8%. Але чи дійсно B краща? Або просто інший інспектор застосовував інший threshold?
- **Невідповідність tech spec.** Інспектор дивиться на фізичний продукт — але не завжди має під рукою технічну специфікацію або не перевіряє кожен пункт.
- **Пропущені системні проблеми.** Окремий звіт виглядає нормально — але при аналізі 10 звітів підряд видно: один тип дефекту повторюється у 7 з них. Це проблема виробничого процесу, а не партії.
- **Supplier disputes без доказів.** Є підозра що якість погана — але немає структурованих доказів. Складно оспорити у постачальника без задокументованої аномалії.

#### Як працює (workflow)

1. Клієнт надає: inspection report + tech spec для цього SKU
2. Claude cross-checks report проти tech spec — чи всі параметри перевірено?
3. Аналізує класифікацію defects — чи правильно категоризовано?
4. Порівнює з попередніми звітами по цьому SKU / постачальнику — шукає патерни
5. Генерує risk score: **green / yellow / red** per batch
6. Флагує аномалії, inconsistencies, і рекомендує дію (accept / conditional accept / reject)

#### ICP fit

Company з frequent QA disputes і підозрами на underreporting від інспекторів. Quality manager.

#### Pricing

| Tier | Price |
|------|-------|
| Setup fee | $300 |
| Monthly | $49/mo |
| Enterprise range | $600–$2,000/mo |

#### Sales motion

Quality manager. Position as risk reduction. "Чи довіряєте ви кожному inspection report який отримуєте?"

---

### PRODUCT 9: Forwarder Communication & Shipment Tracker AI (FWAI)
**Layer:** Logistics & Tracking | **Phase:** 2 | **Priority:** #9 (але сильний ROI)

#### Яку проблему вирішує

Freight forwarder оновлює статус вантажу через email — раз на кілька днів або по запиту. Ці листи містять критичну інформацію: зміна ETA, затримка в порту, customs hold, ризик demurrage. Але brand owner читає їх між іншими задачами, без системного відстеження.

Конкретні проблеми:
- **Pізниця між отриманням інформації та реакцією.** Forwarder повідомив про ризик demurrage в середу — brand owner прочитав у п'ятницю. Контейнер простоює з четверга. 2 дні = $350–$500 зайвих витрат.
- **Demurrage сюрприз.** Клієнт дізнається про demurrage коли вже отримує invoice — а не коли є час щось зробити.
- **Customs holds без ескалації.** Hold на 2–3 дні — нормально. Hold на 5+ днів без дії — катастрофа для in-stock рівня.
- **ETA drift without action.** ETA змінилась з June 3 на June 10 — це 7 днів, що може означати stockout. Але поки хтось не порахував що це = stockout ризик — ніхто не реагує.
- **Паралельні відвантаження.** 3–5 контейнерів одночасно в різних портах. Відстежувати всі через email — нереально.
- **Немає timeline.** Після доставки неможливо відновити хронологію: коли був ETA, коли змінився, скільки часу пройшло від повідомлення до дії.

#### Як працює (workflow)

1. Клієнт пересилає листи від freight forwarder або дає доступ до email thread
2. Claude парсить кожен апдейт: ETA/ETD, port status, customs, demurrage triggers
3. Логує в structured tracking table: по контейнеру, по milestone
4. Видає real-time alert при будь-якому критичному статусі — не очікує наступного weekly email read
5. Порівнює original vs current ETA — флагує drift і імпакт на inventory

**Key stats:**
- $1,400 в demurrage від 8-денної затримки виявлення (реальний кейс)
- $1,200–$2,000 заощаджено на контейнер при спійманому demurrage trigger

#### ICP fit

Importer з регулярними ocean shipments, особливо multi-container (3+ containers/рік).

#### Pricing

| Tier | Price |
|------|-------|
| Setup fee | $300 |
| Monthly | $49/mo |
| Enterprise range | входить в Full Ecosystem Bundle |

#### Sales motion

Ops / Logistics lead. "Ваш останній demurrage invoice — скільки це коштувало? Коли ви про це дізналися?"

---

## 4. PRICING & PACKAGING

### Per-Product Pricing

| Продукт | Setup Fee | Monthly | Annual (без setup) |
|---------|-----------|---------|-------------------|
| SCAI | $300 | $49 | $588 |
| EMS | $300 | $49 | $588 |
| DEVMON | $300 | $49 | $588 |
| SINV | $300 | $49 | $588 |
| 3PLV | $300 | $49 | $588 |
| INSP | $300 | $49 | $588 |
| SPEC | $300 | $49 | $588 |
| QIV | $300 | $49 | $588 |
| FWAI | $300 | $49 | $588 |

### Ecosystem Bundle

- **$350/month** — всі 9 продуктів
- Annual: $4,200 (vs $5,292 якщо купувати окремо — economy $1,092/рік)

### Enterprise Pricing (з ICP CSV)

| Продукт | Enterprise Range |
|---------|-----------------|
| SCAI | $700–$2,500/mo |
| EMS | $500–$1,500/mo |
| SINV | $800–$3,000/mo |
| 3PLV | $800–$3,500/mo |
| INSP | $400–$1,500/mo |
| SPEC | $300–$1,200/mo |
| QIV | $600–$2,000/mo |
| Full Ecosystem Bundle | $4,000–$10,000+/mo |

### Upsell Logic

```
Entry point: один продукт ($49/mo)
    → Expand: додати суміжний продукт (наприклад, SCAI + SINV)
    → Bundle: 3+ продуктів → pitch ecosystem ($350/mo)
    → Enterprise: при $5M+ бренді → custom annual contract
```

### Upsell натуральні комбо

- **SCAI + SINV** — бачу листи і перевіряю інвойси від того ж постачальника
- **SINV + 3PLV** — повний фінансовий аудит (suppliers + 3PL)
- **SPEC + QIV + INSP** — повний QA стек
- **EMS + DEVMON** — повний planning стек
- **Всі 9 → Ecosystem Bundle**

---

## 5. SALES SYSTEM

*(Детально розроблений для SCAI — перший продукт. Логіка масштабується на інші.)*

### 5.1 Pre-Call Setup (2 хв до дзвінка)

Відкрити перед тим як клієнт підключиться:
- SCAI-DEMO-EMAIL-THREAD.md (Section 2 і Section 4 для screen share)
- Blank Google Sheet з Email Log headers
- Цей скрипт на другому моніторі або телефоні

Перевірити:
- Ім'я і компанія prospect'а (з LinkedIn або outreach thread)
- LinkedIn або Amazon storefront — продуктова категорія, розмір бізнесу

**Mindset:** Ти консультант, не продавець. Показуєш інструмент який побудував для себе.

---

### 5.2 15-хвилинний Call Script

**Хвилини 0–2: Opening**

> "Hi [Name], thanks for making the time. Quick agenda: two minutes of context, then I'll show you a live example — about five minutes. Then we'll figure out together if this makes sense for you. Sound good?"

Background pitch:
> "I spent 5 years as Head of Supply Chain for a US brand selling on Amazon. The bulk of that job was managing China suppliers. The thing that kept burning us: important information buried in long supplier emails that we'd miss or catch too late. A price change in paragraph 3. A lead time extension mentioned casually at the end. So I built a system using AI to process supplier emails — extract the data, flag anything important, draft the reply, and log everything in a shared sheet. I now offer that as a service to Amazon brand owners. The goal: you never miss a supplier update again."

**Хвилини 2–4: Qualification**

Три питання:
1. "How many active suppliers are you managing right now?"
   - 1–2: ROI нижче, але proceed
   - 3–10: sweet spot
   - 10+: strong pain, high interest

2. "Roughly how many supplier emails per week — ballpark?"
   - <5/week: якість > кількість
   - 10+: clear use case

3. "When's the last time a supplier email caused a real problem for you?"
   - **Пауза. Не перебивати. Не заповнювати тишу.**
   - Це найважливіше питання — вони скажуть свій exact pain

**Хвилини 4–9: Demo (screen share)**

1. Показати raw email (Section 2 SCAI-DEMO-EMAIL-THREAD.md — Linda Chen email)
   > "Here's a real supplier email — sanitized, but representative. 250 words. Give it a quick skim — 30 seconds."
   > "What did you notice?"
   - Wait. Більшість помітять одне-два; рідко — всі три проблеми.

2. Показати Extracted Data table (Section 4)
   > "Three things in this email: a 14-day production delay that shifts ETA to late June, a 6.2% price increase on future orders — $2,750 more in COGS on a 500-unit order — and $32,900 payment due in 8 days."

3. Показати Key Alerts section
   > "These are the flags. Automatically identified. Each one noted with what the client needs to do."

4. Показати Suggested Reply
   > "And here's the reply draft. 118 words. You review it, maybe tweak one line, and send. Two minutes instead of twenty."

5. Показати Google Sheet або screenshot
   > "And every field is logged in one row. Six months from now when you ask 'when did this supplier first raise prices?' — you open the sheet. It's there."

**Хвилини 9–11: ROI Narrative**

> "Let me put this in numbers. If Mike misses the price increase and places his next 500-unit order without updating his COGS model, he's paying $2,750 more than he budgeted. One order. One missed paragraph."

> "This service is $49 a month. $588 a year. One caught price change pays for the service for almost 5 years."

> "And that's only COGS. What's a stockout worth to your business? If you miss a 14-day production delay and your inventory runs out before the shipment arrives — what does that cost you in lost sales, BSR drop, lost reviews?"

*Пауза. Дай їм порахувати. Не заповнювати тишу.*

> "I'm not selling you software. I'm offering you a supply chain analyst who reads every supplier email and flags anything that matters — for less than the cost of a business lunch per month."

**Хвилини 11–13: Close / Next Step**

> "Based on what you told me about [reference їхній specific pain з хвилини 2–4] — does this look like it solves a real problem for you?"

**Якщо YES:**
> "Here's how we start: $300 setup fee covers our onboarding call — 30 minutes where I collect your supplier list and set up your tracking sheet. Then $49 a month from Month 2. I can send you the invoice today and we book the setup call this week. Does that work?"

**Якщо MAYBE / NOT SURE:**
> "What would make this a clear yes for you?"
- Ціна: "What if we started with just your top 2 suppliers for the first month?"
- Довіра: "Want me to process one email for free before you commit?"

**Якщо NO:**
> "That's fair. What would need to be different about the service for it to make sense?"
- Зафіксувати feedback. Подякувати. Залогувати в CRM.

---

### 5.3 Objection Handling

**Заперечення 1: "I'm not sure my supplier emails are that complex."**

> "That's what most brand owners say before we look at their inbox together. The complexity isn't the supplier — it's the volume and the stakes. When you're managing five suppliers and each sends two or three emails a week, that's 10–15 emails you're processing manually. Each one has at least three data points you need to track. That's 30–45 data points a week you're holding in your head — or in a disorganized inbox. We just make it systematic, so nothing falls through."

**Заперечення 2: "Can I just use ChatGPT myself?"**

> "You can, absolutely. The question is: will you? Every time. For every email. And will you log the results in a structured format you can reference six months later? The value isn't the AI — it's that I do it consistently for you, on a four-hour turnaround, with the output already formatted in your tracking sheet. You get the result without the habit. That's what you're paying for."

**Заперечення 3: "What if my suppliers find out I'm using AI to respond?"**

> "The reply draft is yours to review and send. I draft it — you read it, maybe adjust a line, and it goes out from your email address, signed with your name. Suppliers see an email from you, in your voice. I've managed supplier relationships for five years. The goal is to make your replies faster and more professional, not robotic. Most clients tell me their suppliers actually respond faster after we started because the replies are cleaner and cover all the points."

---

### 5.4 ROI Calculator (використовувати під час демо)

```
PROSPECT ROI ESTIMATE
=====================
Active suppliers: ___
Avg order value per supplier: $___
Supplier emails per week: ___

Annual service cost: $300 (setup) + $49 × 12 = $888/year

Break-even calculation:
One missed price change to break even = $888 ÷ avg_order_value = ___%

Example: $47,000 order → $888 ÷ $47,000 = 1.9% price change on one order

Real example from demo:
- Missed price increase: 6.2% × $47,000 = $2,914
- Annual service cost: $888
- ROI on one catch: 3.3× annual cost
```

> "For most brand owners, the break-even is a price change of less than 2% on a single order. That's smaller than typical Q2 steel price adjustments."

---

### 5.5 Demo Scenario (TrampolineKing / Shenzhen FunPro)

| Field | Value |
|-------|-------|
| Fictional brand | TrampolineKing ($2M/yr revenue, Amazon seller) |
| Supplier | Shenzhen FunPro Co., Ltd. |
| Product | 10FT Trampoline |
| Contact | Linda Chen, Sales Manager |
| Relationship | 18 months |
| Last order | March 2026 — 500 units, $47,000 |

**3 речі в демо-email що brand owner пропускає:**
1. Production delay +14 днів (ETA зсувається на late June)
2. Price increase +6.2% ($89.00 → $94.50) на майбутні замовлення
3. T/T payment $32,900 due in 8 days

**Claude output:**
- Extracted Data table (8 полів)
- 3 Key Alerts з recommended actions
- Suggested Reply (118 слів)
- Internal Note (що клієнт має зробити)

---

### 5.6 Post-Call Checklist (протягом 30 хвилин)

- [ ] Оновити Pipeline: статус → Demo Done / Proposal Sent / Won / Lost
- [ ] Notes: 2–3 речення про їхній pain
- [ ] Next Action: що робиш далі + конкретна дата
- [ ] **Якщо зацікавлені:** відправити invoice $300 протягом 1 години
- [ ] **Якщо зацікавлені:** запропонувати setup call booking (2–3 конкретних часи або Calendly)
- [ ] **Якщо відмова:** залогувати причину, Status = Lost

---

## 6. DELIVERY SYSTEM

*(SCAI — повністю задокументований)*

### 6.1 SLA та якісні стандарти

| Стандарт | Ціль |
|----------|------|
| Processing time per email | Менше 4 business hours від отримання |
| Reply draft length | Макс. 150 слів |
| Alert response time | Негайно (до доставки reply) |
| Data completeness | Всі 8 полів заповнені або явно позначені як відсутні |
| Monthly review call | 15 хвилин, без підготовки з боку клієнта |
| Missed alerts | Zero tolerance |

### 6.2 Step-by-Step Workflow (6 кроків)

**Step 1 — Receive and Log**
- Відкрити forwarded email у Gmail
- Копіювати full email body (включно з headers: From, Date, Subject)
- Google Sheets → SCAI — [ClientName] → Email Log → новий рядок
- Поля: Date Received, Supplier Name, Subject, Raw Email, Status = "Processing"

**Step 2 — Run Claude Parsing Prompt**

```
You are a supply chain analyst processing a supplier email for an Amazon FBA brand.
Extract all operational data and draft a professional reply.

SUPPLIER EMAIL:
[PASTE FULL EMAIL — including From, Date, Subject, Body]

SUPPLIER CONTEXT:
- Supplier name: [NAME]
- Product / SKU: [PRODUCT/SKU]
- Relationship length: [X months / X years]
- Last order: [DATE, QTY, VALUE if known]
- Client reply tone: [FORMAL / FRIENDLY]

OUTPUT FORMAT:
## Extracted Data
| Field | Value | Change from Last |
[Lead Time, Unit Price, MOQ, Production Status, ETD, ETA, Payment Terms, Issues/Flags]

## Key Alerts
[price change >5%, lead time >7 days, quality, cancellation — або "None"]

## Suggested Reply
[Max 150 words, specified tone]

## Internal Note
[1–2 sentences: що клієнт має зробити]
```

**Step 3 — Review Claude Output**
- Перевірити Extracted Data: blank = re-read email, не просто "N/A"
- Перевірити Key Alerts: є → Step 3a
- Перевірити Suggested Reply: тон, точність, під 150 слів
- Max 5 хвилин на редагування

**Step 3a — Escalation (якщо є alerts)**
- WhatsApp клієнту: "Alert: [Supplier Name] — [brief issue]. I'm drafting the reply now but wanted you to know first."
- Потім продовжувати Steps 4–5 звично

**Step 4 — Update Google Sheets**

| Колонка | Дія |
|---------|-----|
| F–L | Extracted data fields |
| M (Flags) | Key Alerts text |
| N (Suggested Reply) | Full reply draft |
| E (Status) | "Processed" або "ALERT — Review Needed" |

ALERT = highlight рядка RED (conditional formatting)

**Step 5 — Deliver to Client**

```
Subject: SCAI Reply Ready — [Supplier Name] — [YYYY-MM-DD]

Hi [Client Name],

Your supplier reply is ready. Review and send as-is, or let me know if you'd like adjustments.

---
[SUGGESTED REPLY]
---

Full data log updated in your sheet: [link]

Artem
```

**Step 6 — Close the Loop**
- Column O (Delivered At): timestamp
- Status → "Delivered"
- Коли клієнт підтвердив відправку (або через 24h без змін) → Status → "Closed" (рядок зеленіє)

### 6.3 Escalation Rules

| Умова | Дія |
|-------|-----|
| Цінове зростання >5% | WhatsApp клієнту негайно |
| Lead time зсув >7 днів | WhatsApp клієнту негайно |
| Будь-яка згадка про якість | WhatsApp клієнту негайно |
| Постачальник згадує скасування, суперечку, форс-мажор | WhatsApp + пропонувати дзвінок |
| Email китайською / незрозуміло | Примітка в Internal Note; запитати клієнта перед написанням reply |

### 6.4 Tools

| Інструмент | Призначення |
|-----------|-------------|
| claude.ai | Email parsing + reply drafting (Step 2) |
| Google Sheets — SCAI CRM Master | Pipeline, clients, MRR tracking (тільки Artem) |
| Google Sheets — SCAI — [Client Name] | Per-client email log + supplier directory (shared з клієнтом) |
| Gmail | Прийом forwarded emails + доставка результатів |
| WhatsApp | Ескалаційні алерти |

### 6.5 Onboarding System

**Pricing confirmation:**
- $300 setup fee (покриває setup call + перший тиждень)
- $49/місяць від 2-го місяця
- Відправити invoice одразу після дзвінка

**Pre-call email (за 48h):**
Попросити підготувати:
1. Список активних постачальників (ім'я, контакт, email)
2. Топ 3–5 SKU що генерують найбільше листів
3. Зразок листа постачальника
4. Tone preference: formal / friendly

**Setup Call Agenda (30 хвилин):**
- 0–5: Welcome + what you're getting (підтвердити pricing)
- 5–15: Supplier data collection (заповнити Supplier Directory)
- 15–20: Email forwarding setup + escalation thresholds
- 20–25: Show output format
- 25–30: Next steps (invoice, перший email, Day 7 check-in)

**First Delivery Checklist (протягом 48h після setup):**
- [ ] Дублювати template sheet → SCAI — [Brand Name]
- [ ] Заповнити Supplier Directory
- [ ] Налаштувати conditional formatting
- [ ] Поділитися sheet з клієнтом (view + comment)
- [ ] Обробити перший forwarded email → доставити протягом 4 годин
- [ ] Запланувати Day 7 check-in

**Day 7 Check-in Agenda (15 хвилин):**
- Review: скільки оброблено, які alerts, чи відправляють reply as-is
- Feedback: формат, що хотіли б бачити ще
- Month 2: підтвердити $49, відправити invoice
- Referral ask: "Чи є в тебе знайомі Amazon brand owners з тією ж проблемою?"

---

## 7. GTM & ACQUISITION

### 7.1 Канали

| Канал | Роль | Cadence |
|-------|------|---------|
| LinkedIn | Primary — direct decision-makers | 2 posts/тиждень мінімум |
| YouTube | Longer-form demos, tutorials | 5 shorts для Phase 3 milestone |
| Threads | Supplementary reach / awareness | За можливістю |

### 7.2 LinkedIn Content Strategy

**Тематичні напрями:**
- Реальні SC помилки і що їх спричинило
- До/після автоматизації (конкретні числа)
- Supplier communication кейси
- 3PL billing кейси
- Demurrage кейси
- "Ось що я знайшов у цьому інвойсі"

**Tone:** Artem як SC practitioner — не vendor. "Я сам через це пройшов і побудував рішення."

**Content rotation:** Rotating по всіх 9 продуктах після Phase 1.

### 7.3 Outreach System (LinkedIn DM)

**Target:** 50+ personalized messages за 5 тижнів. Перші demo calls — Week 3.

**Prospect sourcing:**
1. LinkedIn search: `"Amazon FBA" "China supplier"`, `"Amazon brand" "supply chain"`, `"private label" "sourcing"`
2. LinkedIn Groups: "Amazon FBA Sellers", "Private Label Sellers", "E-commerce Supply Chain Professionals"
3. Communities: Reddit r/FulfillmentByAmazon, Facebook "Amazon FBA Sellers", Helium10 community
4. Podcast guest lists: Serious Sellers, Amazing Seller, Seller Sessions, My Amazon Guy
5. Apollo.io (free tier: 50 email credits/mo; paid: $49/mo = unlimited)

**Qualification criteria (2+ з наступних):**
- Headline: Amazon, FBA, brand owner, e-commerce, founder
- Recent posts про: suppliers, China, supply chain, inventory, sourcing
- Physical products company (не software / agency)
- 3+ years in Amazon/e-commerce

**Дискваліфікація:**
- Працюють в Amazon.com
- Консультанти / агентства
- Wholesale distributors
- Revenue <$500K

**DM Templates:**

Template A — "Supplier Pain Reference" (є свіжий пост про supplier проблему):
```
Step 1 (connection request):
Hi [Name] — saw your post about [specific thing]. That's something I dealt with 
constantly in 5 years of supply chain. Would love to connect with another operator 
in this space.

Step 2 (2–3 дні після accept):
Hi [Name],
Thanks for connecting.
Noticed you mentioned [specific detail]. That's exactly the problem I've been solving.
I offer a service called Supplier Communication AI. I process supplier emails using AI —
extract key data (price changes, lead time shifts, payment windows), draft the reply, 
and log everything in a shared Google Sheet. 4-hour turnaround. $49/month.
Most brand owners catch at least one missed price change in the first 30 days.
Would a 15-minute call make sense? I can show you what the output looks like on a real email.
— Artem
```

Template B — "General Amazon Brand Owner" (немає конкретного поста):
```
Step 1:
Hi [Name] — managing Amazon sourcing and China suppliers is a specific skill set. 
Saw your background and wanted to connect with another operator in this space.

Step 2:
Hi [Name],
Quick question — how do you currently track supplier email data? Price changes, 
lead time updates, payment windows?
[...pitch SCAI...]
— Artem
```

Template C — "Referral / Warm Introduction":
```
Hi [Name],
[Mutual connection name] suggested I reach out — said you're running [brand] on Amazon.
[...pitch tailored to their specific pain...]
— Artem
```

**Weekly targets:**
| Week | Дія | Ціль |
|------|-----|------|
| Week 1 | Connection requests | 10 |
| Week 2 | Follow-ups + 10 нових | 20 |
| Week 3 | Follow-ups + 10 нових + відповіді | Book 2+ demo calls |
| Week 4 | Messages + demo calls | 3+ demo calls |
| Week 5 | Close cycle | First sale |

**Response handling:**
- Interest → "Happy to show you — 15 minutes on a call. Here's my availability: [Option 1] or [Option 2]."
- Question → Відповісти 2–3 реченнями, потім pivot на call
- No response 7 днів → один follow-up: "...reply 'example' and I'll send it over."
- Not interested → "Out of curiosity — is it the format, the price, or just not a priority right now?"

### 7.4 Revenue Milestones

| Milestone | Ціль |
|-----------|------|
| GTM-04 | $1,000 MRR |
| GTM-05 | $3,500 MRR (~10 ecosystem subscribers) |

---

## 8. VERIFIED NUMBERS & CLAIMS

*Тільки числа підтверджені на scait.space або в реальних кейсах.*

### Реальні кейси

| Кейс | Продукт | Число |
|------|---------|-------|
| Zone billing error, 8 місяців | 3PLV | **$91,800** overcharges |
| Price change missed on $47K order | SCAI | **$2,914** overcharge |
| Demurrage from 8-day detection delay | FWAI | **$1,400** lost |
| Caught demurrage trigger (per container) | FWAI | **$1,200–$2,000** saved |
| Annual recovery ($5M brand) | 3PLV | **$270K–$370K/year** |
| Annual service cost (3 tools) | 3PLV | **$2,664** |
| Year 1 net recovery example | 3PLV | **$91,650** |
| ROI on SCAI | SCAI | **3.3× annual cost** (one catch) |
| Break-even | SCAI | **<2% price change** on one order |
| Inspection report search | INSP | 45 хв → **10 секунд** |
| Tech spec writing time | SPEC | 3–4 год → **15 хвилин** review |
| Stockout signal visibility | EMS | **14 днів** до події в existing data |

### Загальні Claims (від scait.space)

| Claim | Значення |
|-------|----------|
| Manual communication reduction | **80%** |
| Financial transaction audit coverage | **100%** |
| Ecosystem price | **~$350/mo** для всіх 9 інструментів |

### Числа для Sales Conversations

- Один спійманий price change → 5 років сервісу SCAI
- 3PLV: 40-рядковий invoice вручну catch rate ~50% помилок
- SINV: 45 хв на invoice вручну vs хвилини з Claude
- SPEC: 3–4 год написання tech pack → 15 хв review

---

*Документ зібрано з усіх project files: REQUIREMENTS.md, ROADMAP.md, PROJECT.md, SCAI-WORKFLOW.md, SCAI-SALES-SCRIPT.md, SCAI-DEMO-EMAIL-THREAD.md, SCAI-ONBOARDING-TEMPLATE.md, OUTREACH-SYSTEM.md, PROSPECT-LIST.md, ICP-Mainpain-Bestmodule-Suggestedpricing-Salesmoti.csv, ARTEM_KNOWLEDGE_BASE.md, memory/project_scait_products.md*

*Last compiled: April 30, 2026*
