# Personal Finance System — Design Spec
Date: 2026-06-19

## Overview

Two-component personal finance system:
1. **Morning briefing module** — passive daily overview of bills, budget, and tax deadlines (Google Sheets → Telegram)
2. **Income allocation skill** — on-demand calculator triggered when income arrives; splits money and recommends where to invest

---

## Component 1 — Morning Briefing Module

### New file: `tool-morning-briefing/personal_finance_client.py`

Reads Google Sheets "Personal Finance" and returns a formatted string injected into the daily briefing.

### Google Sheets: "Personal Finance"

Three tabs:

**Tab 1: Bills**

| Column | Description |
|---|---|
| Name | Bill name (e.g. "Інтернет Київстар") |
| Amount (UAH) | Monthly cost |
| Due day | Day of month (1–31) |
| Category | комунальні / оренда / підписки / інше |
| Season | all / summer (Apr–Oct) / winter (Nov–Mar) |
| Notes | Optional |

Seasonal bills auto-activate by current month.

**Tab 2: Budget**

Manual log of variable expenses during the month.

| Column | Description |
|---|---|
| Date | YYYY-MM-DD |
| Category | їжа / транспорт / одяг / інше |
| Amount (UAH) | Spent |
| Notes | Optional |

The briefing shows variable spending this month vs. the monthly variable budget target (food + personal items = ~31,833 UAH). Fixed bills are tracked separately in the Bills tab.

**Tab 3: Taxes (static — ФОП calendar)**

Pre-filled quarterly deadlines, no manual entry needed:

| Tax | Q1 | Q2 | Q3 | Q4 |
|---|---|---|---|---|
| ЄСВ | Jan 20 | Apr 20 | Jul 20 | Oct 20 |
| Єдиний податок (3 група) | Jan 20 | Apr 20 | Jul 20 | Oct 20 |

### Briefing Section Format

```
🏠 ДОМАШНІ СПРАВИ

🔴 СЬОГОДНІ: Інтернет — 200 грн
🟡 ЦЕЙ ТИЖДЕНЬ: Оренда — 28,000 грн (пт 20 чер)

📊 БЮДЖЕТ ЧЕРВНЯ: 18,200 / 63,100 грн витрачено (29%)

🧾 ПОДАТКИ: ЄСВ — через 31 день (20 лип)
```

**Priority rules:**
- 🔴 = due today or overdue
- 🟡 = due within 7 days
- If nothing urgent → show only budget status + nearest tax deadline
- If 🔴 present → move 🏠 section to TOP of briefing, above ClickUp

---

## Component 2 — Income Allocation Skill

### New skill: `personal-finance`

Triggered when Artem says "прийшло X грн" or "прийшло X EUR" in any Claude session.

Claude loads the skill, fetches live EUR/UAH rate, and calculates the full allocation.

### Allocation Rules (hardcoded in skill)

**Step 1 — Debt repayment: 20% of gross income**
Total debt: $100,000 USD. Fixed 20% rule, no exceptions.

**Step 2 — Fixed monthly expenses**

| Expense | Amount | Notes |
|---|---|---|
| Квартира | 28,000 UAH | Every month |
| Комунальні + інтернет + мобільний + YouTube | 5,000 UAH | Apr–Oct |
| Комунальні + інтернет + мобільний + YouTube | 6,500 UAH | Nov–Mar (heating) |
| Їжа + все для дому | 26,000 UAH | ~6,000/week × 4.33 |
| Психолог | 150 EUR → UAH | Every month (300 EUR / 2 months) |
| Барбер | 1,600 UAH | 2× 800 грн |
| Собачий корм та смаколики | 2,500 UAH | Every month |
| Дитина (кишенькові) | 1,733 UAH | ~400/week × 4.33 |
| Дружина | 1,600 UAH | Every month |
| Артем особисто | 2,000 UAH | Every month |

**Step 3 — Investable remainder split**

| Bucket | Share | Instrument |
|---|---|---|
| Валюта готівка | 40% | Купити EUR або USD, тримати готівкою |
| Короткий термін (3–6 міс) | 30% | ОВДП 3–6 міс / Mono депозит |
| Довгий термін (1–2 роки) | 30% | ОВДП 1–2 роки |

### Output Format

```
💰 РОЗПОДІЛ ДОХОДУ

Прийшло: 2,600 EUR = 133,900 грн (курс 51.5)

💸 Борг (20%):           −26,780 грн → відправити сьогодні

Фіксовані витрати:       −76,158 грн
  Квартира 28,000 · Комунальні 5,000 · Їжа 26,000
  Психолог 7,725 · Барбер 1,600 · Собака 2,500
  Дитина 1,733 · Дружина 1,600 · Артем 2,000

💼 На інвестиції:         30,962 грн

   💵 Валюта готівка (40%):   12,385 грн → купити EUR / USD
   📦 Короткий термін (30%):   9,289 грн → ОВДП 3-6 міс
   🌱 Довгий термін (30%):     9,289 грн → ОВДП 1-2 роки
```

### Currency handling

- EUR/UAH rate fetched live via WebSearch at time of calculation
- If income given in EUR → convert to UAH for all calculations
- Psychologist expense always converted at live rate
- Debt display in USD equivalent for tracking purposes

---

## What this is NOT

- Not an automated system — no scripts, no triggers
- The morning briefing module reads Sheets passively (read-only)
- The income skill runs only when Artem explicitly invokes it in a session
- No bank integrations — all data entered manually by Artem

---

## Implementation Scope

**Phase 1 (this plan):**
- Create Google Sheets "Personal Finance" with 3 tabs (Bills, Budget, Taxes)
- Build `personal_finance_client.py` and wire into morning briefing
- Create `personal-finance` skill with allocation logic

**Out of scope for Phase 1:**
- Investment tracking (portfolio balances, deposit maturity alerts)
- Automated expense categorization
- Bank statement import
