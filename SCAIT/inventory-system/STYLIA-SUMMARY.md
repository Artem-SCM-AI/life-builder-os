# Stylia Beauty — Підготовка до співбесіди

## 1. Компанія

**Stylia Beauty** (Amazon seller з 2009)
- Спеціалізація: мікроблейдинг + beauty (face masks, eye patches)
- ~22,000+ відгуків, рейтинг продавця 5.0
- Кілька десятків SKU у 4+ категоріях
- Mid-7 figure → скейлиться до 8 figures

---

## 2. Каталог і velocity

| Категорія | Продукт | Velocity | Джерело |
|---|---|---|---|
| Face Masks | V-Line Mask 10-pack | ~333/день | 10K+ badge |
| Face Masks | V-Line Mask 7-pack | ~133/день | 4K+ badge |
| Face Masks | MaxiLift 10-pack | ~67/день | 2K+ badge |
| Face Masks | MaxiLift 5-pack | ~33/день | 1K+ badge |
| Eye Patches | 24K Gold / Retinol / Vitamin C | ~30/день | 2,645 відгуки |
| Eyebrow Products | Pencils multi-color | ~50/день | 3,256 відгуки |
| Practice Skins | 6PC Silicone | ~15/день | BSR #933 Eyebrow |
| PMU Machines | Gold / Silver Wireless | ~4–5/день | review count |

---

## 3. Знайдені проблеми (public data, травень 2026)

### 🔴 Активні stockouts

**White Eyeliner Pencil**
- Delivery: June 6 – July 9 (поки решта — May 20–22)
- FBA stock depleted, шипується з-за кордону
- Втрати: ~$800–1,500/тиждень

**20pc Microblading Pens Kit**
- Delivery: June 2–22 (решта пенів — May 21)
- Likely out of FBA stock

### 🟡 Ризик

**V-Line Mask 10-pack (bestseller)**
- 10K+ одиниць/місяць + знижка -31% активна
- Промо підвищує velocity на 40–60%
- Без DOS-моніторингу → stockout за 10 днів непомітно

---

## 4. Позиція — Supply Chain Manager

**JD highlights:**
- Mid-7 figure Amazon beauty brand → 8 figures
- Chin masks + eye masks (core product)
- Remote, UTC+2–3 preferred ✅ (Kyiv = UTC+3)
- $3,500–4,000/міс base + performance bonus від місяця 6
- Reports to Founder/CEO
- Manages 1 VA

**Ключові вимоги:**
- 3+ років Amazon FBA SC ✅ (Artem має 5+)
- China sourcing factory-direct ✅
- Inventory system BUILD experience (не просто operate) ✅
- FBA health: IPI, storage fees, stranded inventory ✅
- **AI proficiency IS NOT OPTIONAL — will test during hiring** ✅✅✅

**Success metrics (12 місяців):**
- In-stock rate 98%+, zero stockouts on top sellers
- 2+ backup suppliers per major SKU within 6 months
- COGS down 8–15%
- Landed shipping cost down 15–25%
- Inventory management system operational by day 90

---

## 5. Відкриття співбесіди (перші 60 секунд)

> "Перед нашою розмовою я переглянув ваш Amazon стор. Знайшов дві речі, які відбуваються прямо зараз: White Eyeliner і 20pc Pens Kit показують затримку доставки 3+ тижні, поки решта продуктів доставляється за 5 днів. Це активний FBA stockout. І ваш V-Line Mask — 10K+ одиниць/місяць зі знижкою -31% — без моніторингу DOS це ризик злетіти в нуль за 10 днів. Це саме та проблема, яку я будував системи вирішувати."

---

## 6. Відповіді під JD

| Питання | Відповідь |
|---|---|
| Inventory system by day 90 | Claude + Google Sheets, робоча версія на першому тижні, ітерую, фіналізую до дня 90 |
| AI test | Показую live: Claude для supplier emails, COGS аналіз, SOP-документація |
| COGS down 8–15% | У Jumpzylla — виявив $618K–$916K/рік потенційної економії через 3PL зонування, box optimization, container utilization |
| Stockout incident | Пішов після нього — знаю де система зламалась і що треба побудувати щоб це не повторилось |
| 3PL management | Оцінював Extensiv vs Cin7 Omni, знаю Smart Ship Network rates, маю досвід переходу між 3PL |

---

## 7. Питання які задаю на співбесіді

1. Який реальний in-stock rate по топ-10 SKU зараз?
2. Від якого з трьох 3PL відходите і чому?
3. Хто зараз робить inventory management — VA чи founder?
4. Як виглядає China supplier base — один постачальник чи кілька?
5. Коли останній раз були на air freight через stockout і скільки це коштувало?

---

## 8. Inventory Management System (будуємо)

### Архітектура
- **Google Sheets** — база даних (6 вкладок)
- **Google Apps Script** — автоматизація, triggers, email
- **Claude API (Haiku)** — генерація narrative для звітів
- **Gmail** — доставка звітів

### 6 вкладок

| Вкладка | Що містить |
|---|---|
| 📊 DASHBOARD | Всі SKU: FBA/Prep/Transit stock, DOS, RAG статус, reorder qty |
| 📈 SALES HISTORY | Продажі за 1/3/7/15/30/90/180/360 днів + avg + trend |
| 🔮 FORECAST | Прогноз 7/15/30/60/90/120/180/360 днів + seasonality + promo factor |
| ⏱ LEAD TIMES | По кожному постачальнику: виробництво → FBA check-in |
| 🛡 BUFFER SETTINGS | Буфер по категоріях + reorder trigger = LT + buffer |
| 🚢 SHIPMENT TRACKER | PO статуси через email-оновлення від форвардера |

### Buffer по категоріях

| Категорія | Buffer | Reorder Trigger (LT+Buffer) |
|---|---|---|
| Face Masks | 45 днів | ~110 днів |
| Eye Patches | 45 днів | ~110 днів |
| Eyebrow Products | 30 днів | ~95 днів |
| Practice Skins | 45 днів | ~104 днів |
| Microblading Pens | 60 днів | ~119 днів |
| PMU Machines | 90 днів | ~169 днів |

### Lead times (реалістично)

| Етап | Дні |
|---|---|
| Виробництво | 14–21 |
| China port loading | 3–5 |
| Ocean freight | 25–30 (WC) / 30–35 (EC) |
| US Customs | 3–7 |
| Drayage до Prep | 2–4 |
| Prep processing | 5–10 |
| Prep → FBA | 2–5 |
| FBA check-in | 1–3 |
| **TOTAL** | **55–90 днів** |

### Звіти

**🌅 Morning (8:00 Kyiv) → Artem**
- Operational, alerts-first
- Claude генерує 3-речення briefing
- Таблиця: critical / watch / healthy
- Список: що замовити сьогодні

**📊 Evening (19:00 Kyiv) → CEO**
- Executive summary, KPI-first
- In-stock rate % великим шрифтом
- Decisions needed від leadership
- Claude генерує 2-речення narrative

### Статус реалізації
- [x] Архітектура погоджена
- [x] Каталог продуктів зібраний
- [x] Buffer/Lead time логіка визначена
- [x] Формати звітів спроектовані
- [ ] `inventory-system.gs` — Apps Script (в процесі)
- [ ] Deploy в Google Sheets
- [ ] Claude API key налаштований
- [ ] Тестові звіти надіслані
- [ ] CEO email додано після отримання ролі
