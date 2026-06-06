# Product 1 — Gumroad Deploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish Product 1 ("Why Start AI Now?") on Gumroad as a free product with cover image and approved copy, ready to share with UTM links.

**Architecture:** Generate cover PNG from approved HTML mockup using Chrome headless → commit assets → follow step-by-step Gumroad UI setup with the approved copy pasted in.

**Tech Stack:** Chrome headless (screenshot), Git, Gumroad web UI

---

## Files

| Action | Path | Purpose |
|--------|------|---------|
| Create | `products/assets/gumroad-cover-product-1.png` | Cover image 1280×720 for Gumroad |
| Create | `.gitignore` | Exclude `.superpowers/` from git |
| Modify | `docs/superpowers/specs/2026-06-04-product1-gumroad-listing-design.md` | Already exists — no changes |

---

### Task 1: Generate cover image PNG

**Files:**
- Create: `products/assets/gumroad-cover-product-1.png`

- [ ] **Step 1: Create the assets folder**

```bash
mkdir -p "/Users/artem/Claude v 1.0/products/assets"
```

- [ ] **Step 2: Screenshot the cover HTML with Chrome headless**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new \
  --screenshot="/Users/artem/Claude v 1.0/products/assets/gumroad-cover-product-1.png" \
  --window-size=1280,720 \
  --hide-scrollbars \
  --disable-gpu \
  "file:///Users/artem/Claude%20v%201.0/.superpowers/brainstorm/15233-1780576076/content/cover-final-v3.html"
```

Expected: Chrome exits, file appears at `products/assets/gumroad-cover-product-1.png`

- [ ] **Step 3: Verify the file was created and is the right size**

```bash
ls -lh "/Users/artem/Claude v 1.0/products/assets/gumroad-cover-product-1.png"
```

Expected: file exists, size > 50KB

- [ ] **Step 4: Open and visually verify the image**

```bash
open "/Users/artem/Claude v 1.0/products/assets/gumroad-cover-product-1.png"
```

Expected: Dark background, orange accent bar on left, "The average person loses / 16 hrs", FREE badge top-right, "Life Builder OS" bottom-right. No scrollbars. No white edges.

If white edges appear or layout is broken, run:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new \
  --screenshot="/Users/artem/Claude v 1.0/products/assets/gumroad-cover-product-1.png" \
  --window-size=1280,720 \
  --hide-scrollbars \
  --disable-gpu \
  --force-device-scale-factor=1 \
  "file:///Users/artem/Claude%20v%201.0/.superpowers/brainstorm/15233-1780576076/content/cover-final-v3.html"
```

---

### Task 2: Create .gitignore and commit

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Create .gitignore**

Create `/Users/artem/Claude v 1.0/.gitignore` with this content:

```
.superpowers/
.DS_Store
```

- [ ] **Step 2: Commit everything**

```bash
cd "/Users/artem/Claude v 1.0" && \
git add .gitignore \
  products/assets/gumroad-cover-product-1.png \
  "docs/superpowers/specs/2026-06-04-product1-gumroad-listing-design.md" \
  "docs/superpowers/plans/2026-06-04-product1-gumroad-deploy.md" && \
git commit -m "feat: product 1 gumroad cover image and listing design docs"
```

---

### Task 3: Gumroad product setup (manual UI steps)

This task is done in the browser at **gumroad.com** — logged in as `thelifebuilder`.

- [ ] **Step 1: Create new product**

Go to: https://app.gumroad.com/products/new

Select product type: **Link**

- [ ] **Step 2: Set basic info**

| Field | Value |
|-------|-------|
| Name | `Why Start AI Now?` |
| Price | `$0` (click "I want this to be free") |
| URL slug | `why-start-ai` (or leave auto-generated) |

- [ ] **Step 3: Upload cover image**

Upload: `products/assets/gumroad-cover-product-1.png`

Gumroad will show a preview. Verify it looks correct (no cropping issues).

- [ ] **Step 4: Set the delivered URL**

In the "Content" section, paste the link that buyers receive:

```
https://artem-scm-ai.github.io/life-builder-os/products/product-1-why-start-ai.html
```

- [ ] **Step 5: Paste the description**

In the "Description" field, paste this exactly:

---

A free 5-minute audit. Find out exactly how many hours AI can give you back — this week.

---

The average person loses **16 hours a week** to tasks AI handles in minutes.

Most of those hours feel like part of the job. A weekly report. Email chains. Data entered by hand — again.

This audit makes them visible. Calculates your exact number. Tells you which tasks to target first.

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

- [ ] **Step 6: Add a summary/tagline (shown in Gumroad search)**

In the "Summary" field (short description, ~160 chars):

```
Free 5-min audit. Find out how many hours AI can give you back this week. 40+ professions. No login. No tech skills needed.
```

- [ ] **Step 7: Publish**

Click **Publish** (or "Save and publish").

Copy the product URL — it will look like:
`https://thelifebuilder.gumroad.com/l/why-start-ai`

---

### Task 4: End-to-end verification

- [ ] **Step 1: Open the Gumroad product page in incognito**

Open a new incognito window, go to the product URL, verify:
- Cover image loads correctly
- Title: "Why Start AI Now?"
- Price shows FREE
- Description renders with bold text, numbered list, table

- [ ] **Step 2: Complete the purchase flow**

Click "I want this!" → enter a test email → click "Get"

Expected: Gumroad shows the delivered URL link

- [ ] **Step 3: Follow the delivered link**

Click the link. Expected: opens the live tool at `artem-scm-ai.github.io/life-builder-os/...`

Tool should load correctly: Screen 1 visible, no errors in browser console.

- [ ] **Step 4: Build the UTM share link**

The link to share on LinkedIn:

```
https://thelifebuilder.gumroad.com/l/why-start-ai?utm_source=linkedin&utm_medium=post&utm_campaign=launch
```

Save this — it's the link that goes into the first LinkedIn post.

---

### Task 5: Add video preview (async — do after recording)

Do this after recording the 45–60 sec walkthrough video.

- [ ] **Step 1: Upload video to YouTube (unlisted is fine)**

- [ ] **Step 2: Add video to Gumroad product**

Go to: product edit page → "Media" section → paste YouTube URL into the video preview field.

Gumroad will embed it above the description automatically.

- [ ] **Step 3: Verify video shows on product page**

Open the product page in incognito — video thumbnail should appear between cover image and the CTA button.
