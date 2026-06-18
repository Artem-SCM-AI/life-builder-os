# AI Аудит Профілю — Design Spec (v2, Ukrainian)

**Date:** 2026-06-11  
**Product:** product-ai-audit-ua.html  
**Brand:** Life Builder OS / @artem.org.ua  
**Language:** Ukrainian  

---

## Overview

Interactive quiz that identifies AI automation opportunities for a user's specific role.
Replaces the English product-1-why-start-ai.html with a Ukrainian, role-specific, expanded version.

---

## Flow — 13 Questions

| Step | Screen | Content |
|------|--------|---------|
| Q1 | screen-q1 | Category selection (4 tiles) |
| Q2 | screen-q2 | Role selection (5-6 dynamic per category) |
| Q3 | screen-q3 | Hours on routine per week |
| Q4 | screen-q4 | Where data is stored |
| Q5 | screen-q5 | Team size |
| Q6–Q12 | screen-pain (dynamic) | 7 role-specific pain points, one per screen |
| Q13 | screen-q13 | AI tools in use (multi-select) |
| — | screen-results | Score + top 3 automations + email capture |

Escape hatch after Q2: "Не знайшов свою роль?" → email + profession → confirmation.

---

## Categories & Roles (20 total)

### Продажі та маркетинг (5)
- Менеджер з продажів / SDR
- Digital маркетолог / Медіабаєр
- SMM / Контент-менеджер
- Інфобізнесмен / EdTech
- Ріелтор / Агент нерухомості

### Операції та фінанси (5)
- Закупівельник / Procurement manager
- Логіст / Диспетчер
- SC менеджер / Head of Supply Chain
- Бухгалтер / Фінансовий менеджер
- Проєктний менеджер

### HR, підтримка, право (4)
- Рекрутер / TA specialist
- HR менеджер / People Ops
- Керівник підтримки / Customer support lead
- Юрист / Legal assistant

### Власники та самозайняті (6)
- Власник e-commerce магазину
- Amazon seller / FBA brand owner
- Власник малого бізнесу (МСБ)
- HoReCa — ресторан, кафе, бар
- Beauty & wellness майстер
- Фрілансер / Консультант

---

## Pain Scoring

- Ненавиджу це = 2 pts
- Рутина, але терплю = 1 pt
- Не проблема = 0 pts

Max score: 14 pts (7 pains × 2).

Results show top 3 automations for the role, sorted by which pains scored highest.

---

## Email Capture

Same Apps Script endpoint as Product 1.
Product field = "P-AI-Audit-UA".
Fields: name, email, role, category, total_score, top_pain_1, top_pain_2.

---

## Design System

Inherits from product-1: dark theme (#0d0d0d bg, #ff6d3b accent, Inter font).
New component: single-question pain screen with 3 large rating buttons.
