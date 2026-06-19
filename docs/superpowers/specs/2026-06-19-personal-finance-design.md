# Personal Finance System — Design Spec
Date: 2026-06-19

## Overview

Two independent components:

1. **Morning briefing module** — passive daily summary of upcoming bills and tax deadlines, injected into existing Telegram briefing
2. **Income allocation skill** — on-demand calculator; triggered when income arrives, splits money across debt / living / investment buckets and recommends instruments

---

## Component 1 — Morning Briefing Module

### Architecture

New file `tool-morning-briefing/personal_finance_client.py` reads Google Sheets "Personal Finance" and returns a formatted block injected into the daily briefing.

### Google Sheets: "Personal Finance"

**Tab 1: Bills** — obligations with specific due dates

Pre-populated at setup with known recurring bills:

| Name | Amount (UAH) | Due day | Season | Notes |
|---|---|---|---|---|
| Оренда | 28,000 | 1 | all | |
| Комунальні + мобільний + інтернет + YouTube | 5,000 | 10 | summer (Apr–Oct) | |
| Комунальні + мобільний + інтернет + YouTube | 6,500 | 10 | winter (Nov–Mar) | з опаленням |
| Психолог | 300 EUR→UAH | 1 | every 2 months | |

Artem adds/edits rows as bills change. Season column: `all` / `summer` / `winter`. Client skips winter bills in summer months and vice versa.

---

**Tab 2: Budget** — discretionary spending log (manual entry throughout month)

| Date | Category | Amount (UAH) | Notes |
|---|---|---|---|
| 2026-06-19 | їжа | 2,400 | АТБ |
| 2026-06-19 | барбер | 800 | |

Categories: `їжа` / `дім` / `барбер` / `собака` / `одяг` / `інше`

Budget ceiling = 26,000 UAH/month (food + household allocation from income split).  
Briefing shows spending-to-date vs. ceiling.

---

**Tab 3: Taxes** — static ФОП calendar, no manual entry

| Tax | Q1 | Q2 | Q3 | Q4 |
|---|---|---|---|---|
| ЄСВ | Jan 20 | Apr 20 | Jul 20 | Oct 20 |
| Єдиний податок (3 група) | Jan 20 | Apr 20 | Jul 20 | Oct 20 |

---

### Briefing Section Output

```
🏠 ДОМАШНІ СПРАВИ

🔴 СЬОГОДНІ: Інтернет + Комунальні — 5,000 грн
🟡 ЦЕЙ ТИЖДЕНЬ: Оренда — 28,000 грн (вт 1 лип)

📊 БЮДЖЕТ ЧЕРВНЯ: 11,400 / 26,000 грн (44%)

🧾 ПОДАТКИ: ЄСВ — через 31 день (20 лип)
```

**Rules:**
- 🔴 = due today or overdue
- 🟡 = due within 7 days
- If no 🔴/🟡 → show only nearest bill + budget + tax
- If 🔴 present → move 🏠 block to TOP of briefing, above ClickUp section

---

## Component 2 — Income Allocation Skill

### Location: `~/.claude/skills/personal-finance.md`

**Trigger:** Artem says "прийшло X грн" or "прийшло X EUR" in any Claude session.  
Claude detects the trigger, loads the skill, fetches live EUR/UAH rate, computes allocation, outputs the breakdown.

### Allocation Rules

**Step 1 — Taxes (first, always)**

| Tax | Rate / Amount | Notes |
|---|---|---|
| Єдиний податок | 6.5% of gross | ФОП group 3 rate |
| ЄСВ | 1,760 UAH/month | Amortized monthly; paid quarterly Jan/Apr/Jul/Oct 20 |

**Step 2 — Debt: 20% of gross income (fixed rule)**

Total outstanding debt: $100,000 USD.  
20% of gross, every time, no exceptions. Displayed in UAH and USD equivalent.

**Step 3 — Fixed monthly living expenses**

Auto-detected by season (current month).

| Expense | Amount | Season |
|---|---|---|
| Квартира | 28,000 UAH | all |
| Комунальні + мобільний + інтернет + YouTube | 5,000 UAH | Apr–Oct |
| Комунальні + мобільний + інтернет + YouTube | 6,500 UAH | Nov–Mar |
| Їжа + все для дому | 26,000 UAH | all |
| Психолог | 150 EUR → UAH | all (300 EUR / 2 міс) |
| Барбер | 1,600 UAH | all |
| Собачий корм та смаколики | 2,500 UAH | all |
| Дитина (кишенькові) | 1,733 UAH | all (~400/тиж) |
| Дружина | 1,600 UAH | all |
| Артем особисто | 2,000 UAH | all |

Summer total: ~76,158 UAH · Winter total: ~77,658 UAH

**Step 4 — Investable remainder (= gross − taxes − debt − living)**

| Bucket | Share | Instrument |
|---|---|---|
| 💵 Валюта готівка | 40% | Купити EUR або USD, тримати готівкою |
| 📦 Короткий термін (3–6 міс) | 30% | ОВДП 3–6 міс / Mono депозит |
| 🌱 Довгий термін (1–2 роки) | 30% | ОВДП 1–2 роки |

### Output Format (example — June, income 2,600 EUR)

```
💰 РОЗПОДІЛ ДОХОДУ

Прийшло: 2,600 EUR = 133,900 грн (курс EUR/UAH: 51.5)

🏛 Податки:           −10,464 грн
  Єдиний податок 6.5%: 8,704 · ЄСВ: 1,760

💸 Борг (20%):        −26,780 грн (~$519 USD) → переказати сьогодні

Витрати на життя:     −76,158 грн
  Квартира 28,000 · Комунальні 5,000 · Їжа 26,000
  Психолог 7,725 · Барбер 1,600 · Собака 2,500
  Дитина 1,733 · Дружина 1,600 · Артем 2,000

💼 На інвестиції: 20,498 грн

  💵 Валюта готівка (40%):   8,199 грн → купити EUR або USD
  📦 Короткий термін (30%):  6,149 грн → ОВДП 3-6 міс
  🌱 Довгий термін (30%):    6,149 грн → ОВДП 1-2 роки
```

### Currency handling

- EUR/UAH fetched live via WebSearch at calculation time
- Income in EUR → converted to UAH for all calculations
- Psychologist expense converted at live EUR/UAH rate
- Debt shown in UAH paid + USD equivalent for tracking

---

## Constraints

- No automated triggers — both components run on-demand (briefing = daily cron, skill = manual)
- No bank integrations — all data entered manually by Artem
- Sheets are read-only for the briefing client; Artem edits them directly

---

## Implementation Scope

**This plan:**
- Create Google Sheets "Personal Finance" (Bills pre-populated, Budget + Taxes tabs empty)
- Build `personal_finance_client.py`, wire into `briefing.py`
- Write `~/.claude/skills/personal-finance.md` with full allocation logic

**Out of scope:**
- Investment portfolio tracking
- Bank statement import / automated expense categorization
