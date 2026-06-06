# Product 1 — Gumroad Listing Design

## What We're Building

A Gumroad product listing for Product 1 ("Why Start AI Now?") — a free interactive AI Pain Audit tool already live at GitHub Pages. The Gumroad listing acts as a discovery and email-capture layer: user clicks "Get it free", enters email on Gumroad, receives the link to the live tool.

## Gumroad Product Settings

| Field | Value |
|-------|-------|
| Product name | Why Start AI Now? |
| Price | $0 (free) |
| Product type | Link |
| Delivered URL | https://artem-scm-ai.github.io/life-builder-os/products/product-1-why-start-ai.html |

---

## Cover Image

**Design:** Minimal Statement layout + Bold Metric copy

**Spec:**
- Size: 1280×720 px
- Background: `#0d0d0d`
- Left accent bar: gradient `#ff6d3b → #ff9a6c → #7c3aed`
- Subtle radial glow behind text
- All text: white (no grey)
  - Eyebrow: `FREE AI AUDIT TOOL` — orange `#ff6d3b`, uppercase, 11px
  - Line 1: `The average person loses` — white, uppercase, 600 weight
  - Metric: `16 hrs` — orange gradient, ~96px, 900 weight
  - Line 2: `every week — to tasks AI handles in minutes.` — white, 600 weight
  - CTA: `Find out which ones. Get your AI roadmap. Free.` — white 70% opacity
- Top-right badge: `FREE` — green `#22c55e`
- Bottom-right: `Life Builder OS` — white 30% opacity

**Source HTML:** `.superpowers/brainstorm/15233-1780576076/content/cover-final-v3.html`

---

## Page Structure (approved order)

| # | Block | Purpose |
|---|-------|---------|
| 1 | Cover image | Visual hook |
| 2 | Title + Tagline + CTA | Orient and convert immediately |
| 3 | Hook copy | Pain + 16 hrs number. Stops the scroll. |
| 4 | Video (45–60 sec) | Artem walks through the audit. Trust builder. |
| 5 | How it works | 4 steps + stats row |
| 6 | Who built this | Artem's story + mission |
| 7 | Final line | Sign-off |

---

## Gumroad Copy (final, approved)

**Tagline:**
> A free 5-minute audit. Find out exactly how many hours AI can give you back — this week.

---

**Description:**

The average person loses **16 hours a week** to tasks AI handles in minutes.

Most of those hours feel like part of the job. A weekly report. Email chains. Data entered by hand — again.

This audit makes them visible. Calculates your exact number. Tells you which tasks to target first.

`[VIDEO — 60 sec walkthrough — insert YouTube/Vimeo URL when ready]`

**How it works**

1. Pick your profession — 40+ covered
2. Select the tasks eating your week
3. See your personal hours-lost calculation
4. Get a step-by-step AI roadmap — free

| | |
|---|---|
| **5 min** | To complete |
| **40+** | Professions covered |
| **Free** | No credit card |
| **0** | Tech skills needed |

**Who built this**

My name is Artem. I'm 39. No coding skills. No technical background.

For 5 years I ran supply chains for a $25M e-commerce brand. Then I discovered Claude Code — and a few other AI tools. In a few months, I built this audit. No developer. No agency. Just me.

**You're using it right now.**

My goal is to prove one thing: you don't need a technical background to use AI effectively. The tools I build work. They save time. They increase income. Anyone can use them.

No account. No pitch. No technical skills needed.
Just your numbers — and a clear place to start.

*Built with Claude Code · Artem Stepanenko · Life Builder OS*

---

## Implementation Steps

1. Screenshot cover HTML → export as PNG 1280×720
2. Create Gumroad product (type: Link, price: $0)
3. Upload cover PNG
4. Paste copy into description
5. Set delivered URL to live tool
6. Add video URL to description placeholder once recorded
7. Add `.superpowers/` to `.gitignore`
8. Test end-to-end: get product → receive URL → open tool
