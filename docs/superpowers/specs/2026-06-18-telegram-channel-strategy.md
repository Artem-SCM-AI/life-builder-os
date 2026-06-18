# Spec — Telegram Channel Strategy: Claude Onboarding

**Date:** 2026-06-18
**Status:** Approved
**Author:** Artem Stepanenko

---

## Overview

A free warm-up Telegram channel for the Claude Code onboarding product. Current state: 45 subscribers, ~70 views/post, one file posted (the onboarding ZIP). No paid product available yet.

**Goal:** Keep the existing audience alive, grow organically via Threads, and build trust so that when a paid product launches, the audience is ready to buy.

---

## Channel Role in the Funnel

```
@artem.org.ua (Threads) — posts drive traffic
  → Telegram channel (free, public) — builds trust
  → Future: paid product ($9 ZIP or digest subscription)
```

The channel is not a sales channel yet. It is a relationship channel.

---

## Content Strategy

### Type A — Weekly Tips

**Cadence:** 2 posts per week (first 8 weeks to build habit), then drop to 1x/week if load is high.

- **Tuesday:** Main tip post (~150 words, full format below)
- **Friday:** Short format — one observation or screenshot, 3–4 sentences, no structure required

**Main tip format (Tuesday):**
```
Hook — 1 line (problem or surprising result, NOT a feature name)
What to do — 2–3 lines, specific and actionable
Example — concrete output or screenshot
Teaser — 1 line announcing next week's topic
```

**Short format (Friday):** No template. One thing Artem noticed, used, or tried. Raw and fast.

No CTA until a paid product exists. Optional soft engagement: "а ти вже пробував?"

The Tuesday teaser is mandatory — it gives subscribers a reason not to unsubscribe before the next post.

**Topic source:** The onboarding product's own skill bundles and MCP integrations. Topics framed through the audience's problem, not the feature name. Each tip previews what the product delivers — audience warms up without explicit promotion.

**Topic backlog (first 8 weeks):**

| Week | Topic (problem-framed) |
|------|------------------------|
| 1 | Як зробити щоб Claude знав контекст твого бізнесу з першого запиту |
| 2 | Пишу один рядок — Claude видає пост у моєму стилі |
| 3 | Ставлю задачу — Claude записує в Notion сам |
| 4 | Скидаю PDF постачальника — Claude робить порівняння за 10 секунд |
| 5 | Як Claude готує шаблон оцінки постачальника за 2 хвилини |
| 6 | Автоматичний щоденник: Claude сам записує що ми зробили за сесію |
| 7 | Google Sheets + Claude: аналіз таблиці без формул |
| 8 | Один промпт — і у мене готовий план на тиждень |

### Type B — Announcements

Posted when there is something concrete to announce:
- New version of the ZIP
- Product going on sale
- Testimonial from a user
- Milestone (e.g., "100 subscribers")

No fixed cadence. Post by event.

---

## Production Pipeline

1. Artem picks topic from backlog (or ad-hoc)
2. Claude drafts post in Artem's TOV
3. Artem reviews and approves
4. Post goes to Telegram channel
5. Shortened version posted to Threads → drives new subscribers to channel

~15 minutes per week total.

---

## Cross-posting Rule

Every Telegram tip → also becomes a Threads post (shorter, no example block). Threads is the acquisition channel; Telegram is the depth channel. Same content, different format.

---

## Growth Mechanics

- Threads bio link stays pointing to the channel (current setup)
- Each Threads tip post ends with a soft mention: "детальніше — у каналі"
- No paid growth for now

---

## Monetization Roadmap

Three options in order of readiness:

**1. ZIP product launch ($9) — first**
Warm up with 3–4 tips → announce product with deadline ("перші 20 — $9, далі $19"). At 10% conversion from 45 subscribers = 4–5 sales. Higher likely given existing warmth.

**2. AI Automation Service ($200–500) — parallel**
Channel audience is the exact ICP for a personal setup/consulting service. One post per month positions Artem as available for 1-on-1 help. One client = 40+ ZIP sales equivalent.

**3. Paid workshop ($29–49) — after 100 subscribers**
"Налаштуй Claude під свій бізнес за 1 годину" — live or recorded. Natural middle tier: free channel → workshop → service.

---

## Audience Feedback Methods

**Telegram polls (monthly):** Concrete topic questions — "Що складніше: встановити чи придумати як використати?" Gives quantitative signal and boosts engagement simultaneously.

**Reactions as votes:** Enable reactions. Define meaning once in a post: 👍 = хочу більше таких / 🔥 = вже спробував. After 4 weeks, pattern of which content resonates is visible with zero effort.

**View tracker in Sheets:** Date, topic, format, views, reactions — one row per post. After 8 posts, clear picture of what outperforms average. This becomes the content strategy for next quarter.

**Direct message to new subscribers:** While channel is under 200 — Artem personally messages each new subscriber: "Привіт! Що намагаєшся автоматизувати?" 30–40% reply rate. Better customer research than any survey.

---

## What This Is Not

- Not a community or group chat (consider after 200 subscribers)
- Not a paid digest (build it when 100+ subscribers in this channel)
- Not a daily posting channel

---

## Success Criteria (3 months)

- Subscribers: 150+
- Views per post: 200+ (absolute, not ratio — ratio is misleading at small scale)
- Content quality signal: >50% of posts exceed channel average views
- At least one announcement post with a paid CTA

---

## Next Steps

1. Create content pipeline (Claude drafts from topic backlog)
2. Post first tip this week
3. Add Threads version of each tip to the existing Sheets → poster pipeline (same cron, new row per week)
4. Add "детальніше — у каналі" as a standard closing line in the Threads tip template
