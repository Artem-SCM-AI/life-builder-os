# Is Your Business Ready for AI? — Product Dev Log
**Product code:** AIRT-25Q
**Price:** $9
**Platform:** Gumroad
**Status:** HTML built, pending hosting + Gumroad listing

---

## What This Product Is

A 25-question interactive assessment that tells operations leaders and e-commerce founders exactly where their business stands before investing in AI. Delivered as a single self-contained `.html` file — opens in any browser on any device, no apps or accounts required.

**Positioning:** Not a checklist. A diagnostic tool — not a verdict, not a ranking. Its job is to give an accurate picture of current readiness so the next decision is based on reality, not optimism.

---

## Format Decision

**Chosen format: HTML (interactive web page)**

Considered: PDF, PDF + Google Sheet, Notion template.
Rejected in favor of HTML because:
- PDF has no interactivity — user calculates score manually
- Google Sheets on mobile requires the app and a Google account
- HTML: opens in browser on any device, zero friction, calculates score automatically, shareable via link

---

## Files

| File | Purpose |
|------|---------|
| `tool-ai-readiness-test-25q.html` | The actual product — interactive assessment |
| `tool-ai-readiness-test-25q.md` | Original markdown version (source content) |
| `copy-gumroad-ai-readiness-listing.md` | Gumroad listing copy (product name, description, price, cover brief) |
| Gumroad profile | monetizerbiz.gumroad.com |
| `copy-gumroad-ai-readiness-assessment.md` | Full assessment content in markdown format |

---

## What's Built (HTML)

### Structure
- 8 question blocks, 25 questions total, 0–4 scoring per question, max 100 points
- 5 result tiers: Critical Gaps (0–25), Early Stage (26–44), Developing (45–64), Ready (65–79), Leader (80–100)

### UI/UX
- **Header:** dark navy, Artem Stepanenko name + tagline + LinkedIn/Threads/Instagram links
- **Progress bar:** fills as questions are answered (top of page, under header)
- **Personal foreword:** signed by Artem, sets expectation of honesty and frames the tool as a diagnostic, not a judgment
- **Scoring scale:** single-row chips (0–4), horizontally scrollable on mobile
- **Question cards:** grouped by block with icon + block name. Each question has "Doesn't exist" / "Fully in place" labels on the scale
- **Sticky footer:** live score (0–100) + answered count (X/25) — always visible while scrolling
- **Score buttons:** full-width, tap-friendly (48px height), highlight orange on select

### Results (shown after all 25 answered)
1. **Result card** — score, level badge, title, description, 3 numbered action steps
2. **CTAs** — 1–2 CTAs specific to the score level (see below)
3. **Subscribe** — dark navy card, email input, "Get weekly SC automation insights"
4. **Share** — pre-generated Threads-ready text + "Copy text" and "Share on Threads" buttons
5. **Score by block** — horizontal bar chart, 8 rows (block name / bar / score/max)
6. **Why this matters** — 5 stats from McKinsey/MIT/Gartner/Pertama
7. **Sources** — 10 clickable links to source articles
8. **Start over** — resets everything, clears URL hash

### CTAs by Level

| Level | CTA 1 | CTA 2 |
|-------|-------|-------|
| 0–25 Critical Gaps | Book a Free 30-min Diagnostic Call | Get AI Decision Framework — $9 |
| 26–44 Early Stage | Book a Strategy Session | Get AI Decision Framework — $9 |
| 45–64 Developing | Book a Consultation | Get AI Decision Framework — $9 |
| 65–79 Ready | Book a Session — Build Your AI Roadmap | — |
| 80–100 Leader | Book an AI Governance Audit | — |

All consultation CTAs: `mailto:eco.stepanenko@gmail.com` with pre-filled subject line.

### Share Functionality
- On result show: URL hash updated with `#score=X&level=Title`
- Share text auto-generated: score, result title, weakest block name, page URL, `@monetizer_biz`
- "Copy text" button: copies to clipboard, shows "Copied!" confirmation
- "Share on Threads": opens `threads.net/intent/post` with pre-filled text

### Technical
- Zero dependencies — single self-contained `.html` file
- No external CDN, no backend required
- Mobile-first, tested on narrow screens
- System font stack (`-apple-system`, `Segoe UI`, etc.)
- Print-friendly: sticky footer hidden on print

---

## Design

| Element | Value |
|---------|-------|
| Background | `#F5F7FA` (light gray) |
| Cards | `#FFFFFF` |
| Primary accent | `#FF6B35` (orange) |
| Navy (header, footer, subscribe) | `#0D1B2A` |
| Body text | `#1A2B3C` |
| Secondary text | `#64748B` |
| Borders | `#E2E8F0` |
| Font | System stack (Inter-like on macOS/iOS) |

---

## Pending — Required Before Launch

- [ ] **Update `PAGE_URL`** in script (top of `<script>` block) — replace with hosted URL of this page
- [ ] **Update `PRODUCT_URL`** — replace with actual Gumroad link for AI Decision Framework
- [ ] **Host the page** — GitHub Pages, Netlify, or Cloudflare Pages (all free). URL goes into `PAGE_URL`
- [ ] **Set up real email subscription** — mailto is a placeholder. Replace with ConvertKit / Substack / Mailchimp form URL
- [ ] **Create Gumroad listing** — copy is ready in `copy-gumroad-ai-readiness-listing.md`
- [ ] **Design cover image** — brief is in listing file: dark navy, "Is Your Business Ready for AI?", 15 Questions / Score / Clear Next Step, orange accent, SCAIT byline

---

## Source Research

Assessment questions and result tiers informed by:
1. Pertama Partners — AI Project Failure Rate 2026 (80% fail stat)
2. MIT / Fortune — 95% of GenAI pilots never reach production
3. Harvard Business Review — AI initiatives framework (5-part)
4. Gartner — AI maturity survey 2025
5. The Thinking Company — 8-dimension AI readiness framework
6. Larridin — AI maturity guide (McKinsey framework)
7. Perceptyx — leadership and AI culture adoption
8. Verticomm — enterprise AI infrastructure requirements
9. OvalEdge — AI readiness framework
10. AWS — AI readiness checklist for SMBs

---

## Funnel Position

```
Gumroad listing → $9 purchase → HTML assessment → Score result
                                                        ↓
                                    CTA: Book Consultation (mailto)
                                    CTA: Get AI Decision Framework ($9)
                                    CTA: Subscribe (weekly insights)
                                    CTA: Share on Threads (viral loop)
```

This product sits at the top of the funnel. Its job is to qualify the reader and route them to the right next step — consultation, another $9 product, or the email list.
