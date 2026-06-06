# Product #1 — AI Pain Audit: Design Spec

**Date:** 2026-06-04
**Product:** Free lead-gen tool for Life Builder OS
**File:** `products/product-1-why-start-ai.html` (replaces current version)

---

## Goal

A standalone, single-file interactive quiz that helps US professionals identify which of their daily tasks AI can automate. The product delivers a personalized results report, collects qualified lead data, and funnels high-intent users toward paid products ($47–$199) or a booking call with Artem.

**Primary outcome for user:** Know exactly which tasks AI can handle, how much time they'd save, and what it costs to do it themselves vs. hire.

**Primary outcome for Artem:** Qualified lead with email + job title + Point A/B + LinkedIn. Event data on which pains and products drive highest intent.

---

## Target Audience

US professionals. English only. No Ukrainian text anywhere in the product.

Four work contexts:
- **Self-Employed** — run their own client relationships and schedule
- **In a Team** — specialist or manager employed in an organization
- **Sales** — KPI-driven, deals and pipeline
- **Creative / Media** — content, design, journalism, video

---

## Architecture

### Delivery
Single standalone HTML file. No server, no backend, no build step. Opens in any browser, works offline after load. Distributed via Gumroad (free download).

### Data Flow
```
User completes quiz
       ↓
JS collects: category, profession, pains[], tags{}, form fields
       ↓
fetch() POST → Google Apps Script Web App URL
       ↓
Apps Script writes row to Google Sheet:
  timestamp | source (UTM) | category | profession | pains | email
  | job_title | point_a | point_b | linkedin_url | timeline
       ↓
Artem gets notified (email digest or Telegram bot)
```

### Analytics
GA4 tag embedded in `<head>`. Events fired via `gtag('event', ...)`:

| Event | When |
|---|---|
| `quiz_started` | Screen 1 CTA clicked |
| `category_selected` | Category card clicked on Screen 2 |
| `pain_selected` | Each checkbox selected (pain name as param) |
| `pain_tag_set` | Each routine/hate tag set |
| `results_viewed` | Screen 5 rendered |
| `buy_clicked` | Any Buy CTA clicked (pain name + price as params) |
| `email_submitted` | Form submit on Screen 5 |
| `share_clicked` | Share CTA clicked |

### UTM Tracking
On page load, JS reads UTM params from URL (`utm_source`, `utm_medium`, `utm_campaign`) and stores them in memory. Included in the Apps Script POST payload alongside the form data.

---

## Screen Flow (5 Screens)

```
Screen 1: Intro
    ↓
Screen 2: Category + Profession Search
    ↓
Screen 3: Pain Selection (up to 5, + add own)
    ↓
Screen 4: Pain Tagging (routine / hate per selected pain)
    ↓
Screen 5: Results + Email Capture
```

Progress bar shown on Screens 2–4: Step 1/3, 2/3, 3/3.

---

## Screen 1 — Intro

### Headline
> You're probably wasting 10+ hours a week on work AI can handle. Let's find out.

### Subheadline
> Pick your biggest daily pains — get a specific roadmap: which tool, how long to set up, how many hours you get back every week.

### Stats Row (3 blocks)
| Number | Label |
|---|---|
| 56% | higher salary for professionals with AI skills |
| 8 hrs/week | average time lost to AI-automatable tasks (McKinsey) |
| $0 | cost to set up most of these automations |

### Promise Box
- The specific pains where AI helps most — for your type of work
- A concrete roadmap: how it works, which tool, step by step
- DIY vs. done-for-you — time and cost of both paths

### Author Note
> Built by someone with no tech background who reached the top 1% of salaries in 4 years. This is what I wish I'd known on day one.

### CTA
Primary button: **"Find my time wasters →"**

---

## Screen 2 — Category + Profession Search

### Headline
> What's your work context?

### Subheadline
> Choose the closest match — your results will be tailored to your role.

### Layout
Search input at top: placeholder "Search your job title (e.g. Accountant, Florist...)"

Below search: 4 large category cards in a 2×2 grid.

### Category Cards

| Emoji | Title | Subtitle |
|---|---|---|
| 🧑‍💼 | Self-Employed | Freelancer, consultant, or running your own clients |
| 🏢 | In a Team | Specialist or manager at a company |
| 📈 | Sales | Closing deals, managing pipeline, hitting quota |
| 🎨 | Creative / Media | Content, design, journalism, video |

### Profession List (for search + category association)

**Self-Employed:** Aesthetician · Makeup Artist · Hair Stylist · Massage Therapist · Nutritionist · Photographer · Florist · Therapist · Veterinarian · Consultant · Private Tutor

**In a Team:** Accountant · Auditor · Financial Analyst · Lawyer · Attorney · HR Manager · Logistics Manager · Project Manager · Business Analyst · Marketing Specialist · Brand Manager · Economist · Architect · Teacher · Translator · Pharmacist · Psychiatrist · Dentist · Dermatologist · Family Doctor · Physical Therapist · Hotel Manager · Restaurant Manager · Procurement Manager

**Sales:** Sales Manager · Realtor · Insurance Agent · Notary

**Creative / Media:** Journalist · Copywriter · Social Media Manager · Graphic Designer · Interior Designer · Illustrator · Video Editor · Motion Designer · Writer · Film Director

### Behavior
- Typing in search filters all professions across categories, highlights matches
- Clicking a category card selects it (highlights with accent border)
- Clicking a profession from search auto-selects its parent category
- Selected profession name is stored for personalization in Screen 5
- If no profession selected, card header on Screen 5 uses category name

### CTA
**"Continue →"**

---

## Screen 3 — Pain Selection

### Headline
> What's eating your time or energy the most?

### Subheadline
> Pick up to 5 — we'll break down each one.

### Hint Banner
> ⚠ Maximum 5. Forced prioritization — intentional.

### Pain List
8 pains shown per category. Each pain item: checkbox + title (bold) + one-line description.

Pain content sourced from `ref-product1-pain-content.md` — category determines which 8 pains are shown.

### Behavior
- Max 5 selectable. At 5: remaining unselected items dim (opacity 0.4), further clicks blocked
- "+ This isn't on the list — add mine" at bottom: text input that accepts custom pain, adds it as a selected item
- Custom pain text is stored and sent to Google Sheets as a separate field
- Custom pain in results table shows a generic card: title = the user's typed text, solution = "AI can likely handle this. Here's the universal starting point:" with 3 generic steps (ChatGPT prompt → identify the repetitive pattern → build the automation). No DIY/Buy pricing shown for custom pains.

### CTAs
Back (ghost) + **"Continue →"** (primary, disabled until ≥1 pain selected)

---

## Screen 4 — Pain Tagging

### Headline
> One more thing about each pain

### Explainer Box
> 💡 This changes the solution. Routine tasks → we automate completely. Things you hate → we remove them from your day entirely.

### Layout
One row per selected pain. Each row shows:
- Pain title
- Two toggle buttons: **"⏰ Routine — eats time"** and **"😤 I hate doing this"**

### Behavior
- One tag required per pain before Continue is enabled
- Active routine: blue tint. Active hate: red tint.
- Default: no selection (user must actively choose)

### CTAs
Back (ghost) + **"Show my roadmap →"** (primary, disabled until all pains tagged)

---

## Screen 5 — Results

### Header
Personalized headline using stored profession + total time calculation:

> **[Profession]'s AI Audit — you're spending [X] hrs/week on work AI can handle.**
> With the right setup: [Y] hrs/week. That's **[Z] hours back — every single week.**

Where X = sum of `hoursWasted` for selected pains, Y = sum of `hoursWithAI`, Z = X - Y.

If no specific profession was selected, use category name: "Your AI Audit as a Sales Professional..."

### Time Calculator Summary Block
Prominent card above the table:

```
┌─────────────────────────────────────────────────┐
│  RIGHT NOW          →    WITH AI                │
│  X hrs/week              Y hrs/week             │
│                                                 │
│  You're leaving [Z] hours on the table          │
│  every single week.                             │
└─────────────────────────────────────────────────┘
```

### Results Table
Columns: Pain | Tag | Time saved/week | DIY setup time | Expand

Each row is expandable. Expand shows a card with:

1. **Cost framing** — routine or hate version depending on tag selected in Screen 4
2. **How AI solves this** — 3 steps specific to this pain
3. **Result line** — "4 hrs/week → 15 min"
4. **Two paths:**
   - DIY block (green tint): tool + setup time + monthly cost
   - Buy block (orange tint): product name + price + **"Fix this — $[price] →"** CTA

### Buy CTA Pricing Logic
| Pain complexity | Price |
|---|---|
| Simple single-step (FAQ bot, invoice autopilot) | $47 |
| Medium (CRM + follow-up, pipeline dashboard) | $97 |
| Complex multi-component system | $147–$199 |

### Share CTA
Below the table, before email capture:

> **"Found out I'm wasting [Z] hours/week. What's yours?"**
> [Share on LinkedIn] [Share on Threads] [Copy link]

Pre-filled share text: "Just found out I'm wasting [Z] hours/week on work AI can handle. Free audit → [URL]"

### Email Capture Form
Shown below Share CTA. Heading:

> **Your roadmap is ready.**
> Leave your details — we'll send a personalized step-by-step action plan for your #1 pain. Free.

**Form fields:**

| Field | Type | Required |
|---|---|---|
| First name | text | yes |
| Email | email | yes |
| Your job title | text | yes |
| Where are you now? (Point A) | textarea | yes |
| Where do you want to be in 90 days? (Point B) | textarea | yes |
| LinkedIn profile URL | text | no — "optional, for deeper personalization" |
| Timeline | select: 30 days / 60 days / 90 days / 6 months | yes |

**Primary CTA:** `"Send my AI roadmap →"`

**Sub-copy:** "We'll review your answers and send a personalized roadmap within 24 hours. No spam."

**Skip link:** Small text below: "Skip for now — just save the results" → hides the form entirely, the results table remains fully visible, no roadmap promise shown. The Book a Call CTA remains visible.

### Post-Submit State
After "Send my AI roadmap →" is clicked and fetch() succeeds:
- Form replaced with success message: **"You're in. Check your inbox within 24 hours."**
- Sub-copy: "While you wait — here's your first action: [name of #1 pain's DIY tool] takes 15 minutes to set up."
- Results table remains fully visible above
- Book a Call CTA appears below the success message

If fetch() fails (network error): show inline error "Something went wrong — email us directly at [Artem's email]" — form stays editable.

### Book a Call CTA
Below the email form (or after submit confirmation):

> **Want to talk through your specific situation?**
> [Book a free 20-min call with Artem →] — Calendly link

Shown to all users. High-intent signal = they're at the bottom of Screen 5.

---

## Design System

Based on n8n.io aesthetic.

### Colors
```css
--bg:      #0d0d0d   /* page background */
--bg2:     #141414   /* card background */
--bg3:     #1c1c1c   /* elevated element */
--border:  #2a2a2a   /* all borders */
--accent:  #FF6D3B   /* coral/orange — primary actions */
--accent2: #7c3aed   /* purple — secondary accents */
--text:    #ffffff   /* primary text */
--text2:   #a0a0a0   /* secondary text (descriptions, subtitles) */
--text3:   #888888   /* tertiary (labels, hints, metadata) */
--green:   #22c55e   /* DIY path, positive results */
--red:     #ef4444   /* hate tag */
--blue:    #3b82f6   /* routine tag */
```

### Typography
- Font: Inter (Google Fonts)
- H1: 30px / 900 weight / letter-spacing -0.6px
- H2: 17px / 700
- H3: 14px / 600
- Body: 14–15px / 400–500
- Labels/hints: 12–13px / --text3

### Key Components
- **Cards:** bg2 background, 1px border, 10px border-radius, gradient glow top border (transparent → accent → transparent)
- **Buttons:** 12px padding vertical, 24px horizontal, 8px radius, 15px/700 font
- **Progress bar:** 3px height, accent color fill, 0 0 8px accent glow shadow
- **Checkboxes:** 18×18px, 4px radius, fills with accent on select
- **Tag pills:** min-width 90px, centered text, color-coded blue/red

### Layout
Single-page app. All 5 screens render as JS-controlled sections (one visible at a time). No page reloads.

### Topbar
Fixed at top. Shows: **"Life Builder OS"** (accent color, uppercase) · separator · **"AI Pain Audit"** (white, normal case).

### Mobile Responsiveness
Fully responsive. Breakpoint at 768px:
- Single column layout (no side-by-side grids)
- Category cards: 2×2 grid on mobile, same as desktop
- Pain items: full width
- Path blocks (DIY/Buy): stack vertically on mobile
- Results table: horizontal scroll allowed, or collapse to card-per-row on mobile
- Font sizes scale down by ~10% below 480px

---

## Data Storage

### Google Sheets Schema
Each form submission = one row:

| Column | Source |
|---|---|
| timestamp | JS Date.now() |
| utm_source | URL param |
| utm_medium | URL param |
| utm_campaign | URL param |
| category | Screen 2 selection |
| profession | Screen 2 search/selection |
| pains | JSON array of selected pain titles |
| tags | JSON object {pain: "routine"/"hate"} |
| custom_pain | Text from "+ add own" field |
| email | Form field |
| first_name | Form field |
| job_title | Form field |
| point_a | Form field |
| point_b | Form field |
| linkedin_url | Form field |
| timeline | Form field |
| buy_clicks | JSON array of {pain, price} for each Buy CTA clicked |
| hours_wasted | Calculated total X |
| hours_with_ai | Calculated total Y |

### Transport
`fetch()` POST to Google Apps Script Web App URL (deployed as "Anyone can access").
Apps Script appends row to Google Sheet named "Product1-Leads".

---

## Content References

All pain content sourced from: `ref-product1-pain-content.md`

Each pain block contains:
- `hoursWasted` and `hoursWithAI` (numeric, for calculator)
- `routine` and `hate` framing text (changes based on Screen 4 tag)
- 3-step AI solution
- Result line
- DIY path (tool + setup time + cost)
- Buy path (product name + price tier)

Content is embedded directly in the HTML as a JavaScript data object. No external fetch required.

---

## Configuration Required (implementer must get from Artem)

| Item | Used in |
|---|---|
| GA4 Measurement ID | `<head>` tag, all gtag() calls |
| Google Apps Script Web App URL | fetch() POST for form submissions |
| Calendly URL | "Book a call" CTA on Screen 5 |
| Gumroad product URLs per pain | Buy CTA buttons (one URL per product tier: $47 / $97 / $147 / $199) |

---

## Out of Scope

- Backend server or database
- User accounts or saved sessions
- Multi-language support (English only)
- Mobile app version
- Payment processing (Buy CTAs link to Gumroad product pages)
- Real-time AI generation (all content pre-written)
