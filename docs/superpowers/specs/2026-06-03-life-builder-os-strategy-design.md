# Life Builder OS — Strategy Design Doc

**Date:** 2026-06-03  
**Author:** Artem Stepanenko  
**Scope:** 30-day launch strategy for digital product business  
**Version:** 2.0 — revised after critique

---

## Brand

| Layer | Name |
|---|---|
| Product brand | **Life Builder OS** |
| Personal brand | **Artem \| The Life Builder** |

**Positioning:** A non-technical professional who built a top 1% career using AI — now teaching others the same system. English-speaking professionals who want career growth and higher income. The core message: "You don't need to be technical to use AI. You just need a system."

**Proof points:** Learned English at 32. Built supply chain career to top 1% income in Ukraine within 4 years. Uses Claude Code and AI tools daily — zero coding background.

---

## Target Audience

**Who:** English-speaking professionals (28–45) who want career growth and higher salary.  
**Technical level:** Non-technical. The brand specifically debunks the myth that AI/automation is only for tech people.  
**Pain:** Stuck in career plateau, unclear path to more money, overwhelmed by AI hype, don't know where to start.  
**Content angle:** Artem's personal AI self-development journey — tools he uses, why, and how.

---

## Product Lineup

| # | Product | Price | Status | Platform |
|---|---|---|---|---|
| 1 | "Why Start AI Now?" — interactive article-test | FREE | Build in 48h* | Gumroad |
| 2 | "Ideal Profession Finder" — career roadmap for switchers | $9 | Build in Week 3 | Gumroad |
| 3 | Job Search Agent (Claude + Notion + Apify) | $47 / $67 Pro | Already built | Gumroad |
| 4 | "What Can I Automate?" — 25-question test | FREE | Exists, polish + deploy | Gumroad |
| 5 | "AI or Automation?" — decision test | $9 | Exists, deploy in 48h | Gumroad |

*Shopify removed as active channel — doubles operational overhead with no clear upside vs Gumroad. Revisit after $500 milestone if SEO or audience diversification becomes a reason.

### Product Details

**#1 — "Why Start AI Now?"**  
Interactive article-test. User answers questions about their job/situation → receives personalized outcome: specific financial and career benefits from AI. Widest possible audience — people who haven't started yet. Primary lead magnet, viral potential. Captures email → enters Beehiiv welcome sequence.

> ⚠️ **Pre-sprint challenge to resolve:** Personalized outcomes by profession is complex (thousands of professions). Solution before building: group into 5-7 broad categories (e.g. manager, specialist, freelancer, sales, ops, creative, educator) and map outcomes to categories, not individual professions.

**#2 — "Ideal Profession Finder"**  
Interactive tool for career switchers. Inputs: existing skills, interests, desired income, preferred conditions. Output: career roadmap for 1-3-5 years with specific steps and resources. $9 — low barrier, high perceived value.

**#3 — Job Search Agent**  
Already built. Cron at 8:00 → finds remote jobs → top 3 in Notion. Basic ($47): code + README + video. Pro ($67): + templates + 7-day support.

**#4 — "What Can I Automate?"**  
25-question test. Already built as .md. Convert to interactive HTML. Stays FREE as second funnel entry with different angle from #1.

**#5 — "AI or Automation?"**  
Practical decision tool: what specifically should YOU use — AI or automation? Already built as .md. Convert to interactive HTML. $9.

---

## Pricing Tiers

```
FREE  →  $9  →  $47/$67
  ↓         ↓         ↓
email   mass volume   core revenue
list    + trust       driver
```

Two free products (different angles) → Beehiiv email sequence → upsell to $9 tests → upsell to $47 agent.

---

## Email Platform: Beehiiv (free)

**Why Beehiiv:** Free up to 2,500 subscribers. Built for creators. Clean analytics. Direct integration possible via Google Forms → Zapier (free tier) → Beehiiv.

**Welcome sequence (3 emails) — triggered on free product download:**
1. **Day 0 — Welcome:** Who I am, my story, what to expect. No pitch.
2. **Day 2 — Value:** One concrete AI tip they can apply today. Soft mention of $9 products.
3. **Day 5 — Offer:** "Here's what helped me most" → CTA to Job Search Agent ($47). Urgency optional.

Every paid product launch → separate broadcast to full list.

---

## Platforms

- **Gumroad** — only storefront (no monthly fee, simple, sufficient)
- **Shopify** — deferred until post-$500 milestone with clear reason (SEO or audience)

---

## Community — Deferred

No community until $500 milestone is reached.

**$500 reinvestment plan:**
- $300 → paid advertising
- $100 → tools
- $100 → Skool ($99/mo community platform)

---

## Content Strategy

Sales come from content volume. This is the engine.

| Channel | Volume | Priority |
|---|---|---|
| **Threads** | 2 posts/day = 60/month | Month 1 revenue |
| **LinkedIn** | 5x/week = 20/month | Month 1 revenue |
| **Instagram** | Crosspost best Threads posts | Month 1 investment |
| **YouTube** | 2 videos/month | Long-term SEO |

X.com — dropped from Month 1. Too much noise for zero existing audience. Revisit Month 2.

**Content angle:** Artem's personal AI self-development journey.  
**Post types:**
- "I used [tool] to do X today — here's exactly how"
- "AI myth I used to believe (and what's actually true)"
- "Result I got this week using AI"
- "Non-technical person's guide to [tool]"
- "My story: English at 32, top 1% at 36 — the system behind it"

**Content batching system:** Every Sunday — write 14 Threads posts + 3 LinkedIn posts for the week ahead. Never write day-of. Batch in one 2-hour session.

---

## 30-Day Plan

### TODAY — Day 0
- [ ] First Threads post: brand intro + personal story hook
- [ ] Update LinkedIn bio: "Artem Stepanenko | The Life Builder"

### Pre-Sprint (before 48h build)
- [ ] Resolve Product #1 profession challenge: define 5-7 broad profession categories + outcome mapping

### 48-Hour Sprint (Days 1–2)
- [ ] Build Product #1 "Why Start AI Now?" — interactive HTML
- [ ] Convert Product #5 "AI or Automation?" to interactive HTML
- [ ] Create Gumroad pages for products #1, #3, #5
- [ ] Set up Beehiiv account + welcome sequence (3 emails)
- [ ] Set up Google Forms → Beehiiv connection for email capture
- [ ] Set up UTM links per channel (Threads, LinkedIn, YouTube) for analytics from day 1
- [ ] Deploy all 3 products live

### Week 1 (Days 1–7) — Foundation
- [ ] Set up all profiles: LinkedIn · Threads · Instagram · YouTube · Gumroad
- [ ] 3 products live on Gumroad
- [ ] Beehiiv + welcome sequence live
- [ ] Threads: 2 posts/day · LinkedIn: 5 posts
- [ ] YouTube: Video #1 — brand intro / personal story
- [ ] First Sunday batch: write 14 Threads + 3 LinkedIn posts

### Week 2 (Days 8–14) — Content + Build #4
- [ ] Convert Product #4 "What Can I Automate?" to HTML + deploy FREE
- [ ] YouTube: Video #2 — Job Search Agent demo
- [ ] Threads: 14 posts · LinkedIn: 5 posts
- [ ] Actively promote Job Search Agent ($47) via LinkedIn
- [ ] Mid-week check: Gumroad analytics — which product gets traction?

### Week 3 (Days 15–21) — Launch #2 + Analyze
- [ ] Build + launch Product #2 "Ideal Profession Finder" $9
- [ ] Analyze weeks 1-2: downloads · sales · which channel converts → double down on what works
- [ ] Threads: 14 posts · LinkedIn: 5 posts
- [ ] Launch content for Product #2 across all channels

### Week 4 (Days 22–30) — Full Analysis + System
- [ ] Threads: 14 posts · LinkedIn: 5 posts
- [ ] Full analytics review: every product, every channel, every price point
- [ ] What worked? What didn't? Document with actual numbers.
- [ ] Document launch checklist for future products
- [ ] Plan Month 2 based on data — not assumptions

---

## Revenue Targets (Revised — Realistic)

| Month | Target | Logic |
|---|---|---|
| Month 1 | **$200–250** | New accounts have low reach weeks 1-2. Traction builds end of month. |
| Month 2 | **$500** | Audience warmed up, content compounding, email list active. |
| Month 3+ | **$500+/month** | Paid ads ($300) amplify what's already working organically. |

**Month 1 math:**
- 2 × $47 (Job Search Agent via LinkedIn) = $94
- 15 × $9 ($9 products via Threads) = $135
- **Total: ~$229**

**Month 2 math (with compounding + email list):**
- 5 × $47 = $235
- 30 × $9 = $270
- **Total: ~$505**

---

## Launch System (repeatable)

For every new product:

1. **Resolve** — define outcome logic before building (learn from Product #1)
2. **Build** — interactive HTML (Claude Code)
3. **Deploy** — Gumroad page + Google Form + UTM links per channel
4. **Email** — add product to Beehiiv welcome sequence or broadcast
5. **Video** — demo + tutorial on YouTube
6. **Content launch** — batch-write launch posts for all channels
7. **Analyze** — 7-day stats: downloads, sales, conversion by channel
8. **Improve** — one specific change based on data, re-measure

---

## Success Metrics — Month 1

| Metric | Target |
|---|---|
| Products live | 5 on Gumroad |
| Profiles set up | 5 platforms |
| Threads posts | 60 |
| LinkedIn posts | 20 |
| YouTube videos | 2 |
| Email subscribers | 100+ |
| Revenue | $200–250 |
| Launch system documented | ✓ |
| "What worked / what didn't" analysis | ✓ |
