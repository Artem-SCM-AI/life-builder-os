# HTML Assessment — Format Guide
*Reference for building future interactive tests in this style*

---

## What This Format Is

A single self-contained `.html` file. No backend, no CDN, no dependencies. Opens in any browser on any device. Buyer downloads one file from Gumroad and uses it immediately.

**When to use:** Any product where the user answers questions and gets a scored result. Readiness assessments, self-audits, diagnostic tools, maturity models.

---

## File Naming

```
tool-[topic]-[question-count]q.html
```

Examples:
- `tool-ai-readiness-test-25q.html`
- `tool-3pl-readiness-audit-20q.html`
- `tool-hiring-readiness-check-15q.html`

---

## Design System (Fixed — Use Every Time)

### Colors
```css
--navy:          #0D1B2A   /* header, footer, subscribe card, dark accents */
--orange:        #FF6B35   /* primary CTA, selected state, highlights */
--orange-light:  #FFF0EA   /* block icon backgrounds, hover states */
--bg:            #F5F7FA   /* page background */
--card:          #FFFFFF   /* question cards, result cards */
--border:        #E2E8F0   /* card borders, dividers */
--text:          #1A2B3C   /* body text */
--text-secondary:#64748B   /* supporting text */
--text-hint:     #94A3B8   /* labels, captions */
```

### Typography
- Font: system stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif`)
- No Google Fonts — keeps file self-contained
- Heading scale: 32px (H1) → 24px (result title) → 16px (card headers) → 15px (body) → 13px (sub) → 12px/11px (labels)

### Layout
- Max content width: `680px`, centered, `padding: 0 16px`
- Card border-radius: `12px` (standard), `16px` (result card)
- Card shadow: `0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)`

---

## Page Structure (In Order)

```
1. Header (dark navy)
   └── Author name + tagline + social links
   └── Product title (H1)
   └── Subtitle (question count + estimated time)

2. Progress bar (dark navy strip under header)
   └── Thin orange line that fills as questions are answered

3. Intro card (white)
   └── 3–4 paragraphs — personal foreword from Artem
   └── Signed: Artem Stepanenko · [role]
   └── Scoring scale chips

4. Question blocks (white cards)
   └── Block header: icon + block name + question range
   └── Questions: number label → question text → 0–4 button row → scale endpoint labels (product-dependent)

5. ── RESULT (shown after all questions answered) ──

6. Result card (white card, dark navy header section)
   └── Level badge (e.g. "Level 2 of 5")
   └── Score (large)
   └── Level title
   └── Description paragraph
   └── 3 numbered action steps

7. CTAs card (white)
   └── 1–2 CTAs specific to the score level
   └── Primary button (orange) + description
   └── Secondary button (outline) + description

8. Subscribe card (dark navy)
   └── Headline + one-line description
   └── Email input + Submit button

9. Share card (white)
   └── Pre-generated text (score + level + weakest block + link + @monetizer_biz)
   └── "Copy text" + "Share on Threads" buttons

10. Score by block (white card)
    └── Name / progress bar / score/max for each block

11. Why this matters (dark navy)
    └── 4–5 stats with sources in parentheses

12. Sources (white card)
    └── Numbered list of clickable links

13. Start over button
    └── Outline button, full width

14. Sticky footer (dark navy, always visible)
    └── Live score (large orange number) + answered count
```

---

## Content Variables (Change Per Product)

### 1. Header
```
Product title:     "Is Your Business Ready for AI?"
Subtitle:          "25-question assessment · ~8 minutes"
```
Time estimate: roughly 20 seconds per question.

### 2. Scoring Scale
Always 0–4. Labels depend on product type:

**Readiness / maturity assessments** — rate how built-out something is:
```
0 — Doesn't exist / we have no idea
1 — We've discussed it but nothing is in place
2 — Partially exists, inconsistently
3 — Exists and works, but has gaps
4 — Exists, systematic, measurable
```
Scale endpoint labels in questions: `"Doesn't exist" / "Fully in place"`

**Decision / direction tests** — rate how true a statement is about a specific task:
```
0 — Not true at all
1 — Slightly true
2 — Somewhat true
3 — Mostly true
4 — Always true
```
Scale endpoint labels in questions: `"Not true at all" / "Always true"`

Add a note in the intro card: "higher score = [Automation / more mature / etc.]" so the direction is clear before the user starts.

### 3. Question Blocks
Structure per block:
```javascript
{
  icon: "🎯",           // emoji, one per block — visual anchor
  name: "Strategy & Vision",
  range: "Questions 1–4",
  max: 16,              // questions × 4
  questions: [
    "Question text here?",
    ...
  ]
}
```
Typical structure: 6–8 blocks, 3–5 questions each, total 20–30 questions.

### 4. Result Tiers
Typically 4–5 tiers. Match the number to the conceptual model of the product — don't force 5 if the topic has 4 natural outcomes. Adjust score ranges to match max possible score and expected distribution (not equal splits):
```javascript
{
  range: [0, 25],
  badge: "Level 1 of 4",   // or "of 5" — match actual tier count
  title: "Critical Gaps",
  description: "...",   // 2–3 sentences, honest, not discouraging
  steps: [              // exactly 3 — concrete, actionable, no vague advice
    "Step 1...",
    "Step 2...",
    "Step 3..."
  ],
  ctas: [...]           // see CTA rules below
}
```

### 5. CTAs Per Level
Rule: lower tiers get two CTAs (consultation + cross-sell product), top tier gets one (consultation only).

For 5-tier products: levels 1–3 = two CTAs, levels 4–5 = one CTA.
For 4-tier products: levels 1–3 = two CTAs, level 4 = one CTA.

Never add "— Free" or a price to a CTA label. Price belongs on the Gumroad listing, not in the tool.

CTA object:
```javascript
{
  label: "Book a 30-min Diagnostic Call",
  sub:   "One sentence describing what they get. No pitch language.",
  href:  () => `mailto:${CONSULT_EMAIL}?subject=...`,
  style: "primary"   // or "outline" for secondary CTA
}
```

### 6. Share Text Template
```
I scored [X]/100 on the [Assessment Name].

Result: [Level Title]
Weakest area: [Block Name]

Where does your business stand?
👉 [PAGE_URL]

Assessment by @monetizer_biz
```

### 7. Constants (Top of Script — Update Before Launch)
```javascript
const PAGE_URL      = 'https://...';           // URL where this file is hosted
const PRODUCT_URL   = 'https://...';           // Gumroad product link (cross-sell)
const CONSULT_EMAIL = 'eco.stepanenko@gmail.com';
```

---

## Content Rules

**Questions:**
- Each question must be a yes/no-style rating — "do you have X" or "is this true of your task"
- No compound questions (one thing per question)
- Positive framing by default: rate the presence of something good, not the absence of something bad
- Exception: decision/direction tests may use negative framing intentionally when a block measures absence (e.g., "This task does NOT require…"). Use sparingly — group negatively framed questions in one block, don't mix.
- Reading level: plain English, B2–C1. No jargon without explanation.

**Result descriptions:**
- Honest, not consoling. Don't soften a bad score.
- Acknowledge that the result is common (removes shame, increases trust)
- Never blame the reader

**Action steps:**
- Exactly 3 per tier
- Each step is one concrete action, not a category of actions
- Include a time estimate where possible ("takes 2–3 weeks")
- No "explore", "consider", "think about" — verbs only

**CTAs:**
- Primary: consultation. Always mailto with pre-filled subject.
- Secondary: cross-sell to another product in the catalog. Only for lower tiers.
- Never include price or "Free" in the CTA label — belongs on the Gumroad listing.
- Sub-text under each CTA: what they specifically get, in one sentence.

---

## Process: Building a New Assessment

1. **Define the topic and audience** — who is rating themselves on what
2. **List 6–8 evaluation dimensions** — these become blocks
3. **Write 3–5 questions per block** — start from the most important
4. **Define 4–5 result tiers** — match the count to the conceptual model; set score ranges based on expected distribution, not equal splits
5. **Write descriptions and steps** — be specific, use real numbers if available
6. **Write CTAs** — one primary (consultation), one secondary ($9 product) for lower tiers
7. **Copy the base HTML** from `tool-ai-readiness-test-25q.html`
8. **Replace the `blocks` and `results` arrays** — everything else reuses unchanged
9. **Update constants** (`PAGE_URL`, `PRODUCT_URL`, `CONSULT_EMAIL`)
10. **Update header** (title, subtitle, time estimate)
11. **Update intro foreword** — rewrite for the new topic
12. **Test locally** — answer all questions, verify all result tiers render correctly
13. **Host** — GitHub Pages or Netlify (free). Update `PAGE_URL`.
14. **Create Gumroad listing** — product name, description, cover image, upload HTML

---

## Hosting (Free Options)

**GitHub Pages:**
1. Create a repo, add the `.html` file as `index.html`
2. Settings → Pages → Deploy from main branch
3. URL: `username.github.io/repo-name`

**Netlify:**
1. Drag and drop the `.html` file at app.netlify.com
2. URL: `random-name.netlify.app` (or set custom domain)

**Cloudflare Pages:** Same drag-and-drop, same result.

Once hosted, update `PAGE_URL` in the file, re-upload.

---

## Subscription — Pending Setup

Currently: `mailto:` placeholder. Replace with a real form URL when subscription platform is chosen (ConvertKit, Substack, or Mailchimp). Replace `handleSubscribe()` function with a form submit or redirect to the platform's hosted form.

---

## What Not to Change Between Products

- Color system (all CSS variables)
- Sticky footer structure
- Progress bar logic
- Share button behavior
- Score/block rendering logic
- Mobile responsiveness rules
- Print styles

The only things that change: question data, result data, constants, header text, and intro copy.
