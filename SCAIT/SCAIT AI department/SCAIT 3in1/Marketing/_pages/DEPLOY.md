# SCAIT Landing Page — Deploy Instructions

## What you have
One file: `index.html` — fully self-contained. No build step. No Node.js. No dependencies to install.

---

## Step 1 — Add the Calendly link

Open `index.html` and find all occurrences of:
```
YOUR_CALENDLY_LINK
```

Replace each one with your actual Calendly URL, e.g.:
```
https://calendly.com/artem-stepanenko/scait-demo
```

There are **7 occurrences** (nav + 3 product CTAs + hero + final CTA).

---

## Step 2 — Deploy (pick one option)

### Option A — Netlify (recommended, free)
1. Go to https://netlify.com → sign up free
2. Drag and drop the `scait-landing/` folder into Netlify
3. Done — you get a live URL in 30 seconds
4. To use a custom domain: Netlify → Site settings → Domain management

### Option B — Vercel (free)
1. Go to https://vercel.com → sign up free
2. Click "Add New Project" → "Deploy from folder"
3. Upload the folder or connect GitHub repo
4. Done — live URL instantly

### Option C — GitHub Pages (free)
1. Create a new GitHub repo
2. Upload `index.html` into the repo root
3. Go to Settings → Pages → Source: main branch / root
4. Done — live at `https://yourusername.github.io/repo-name`

### Option D — Any traditional hosting (cPanel, etc.)
1. Connect via FTP or file manager
2. Upload `index.html` to the `public_html/` folder (or wherever the root is)
3. Done

---

## Step 3 — Custom domain (optional)

If you have a domain (e.g. `scait.io`):
- Point it to Netlify/Vercel via DNS settings
- Both platforms have step-by-step guides for this

---

## What's a placeholder (update before launch)

| What | Where | Replace with |
|------|-------|-------------|
| Calendly link | 5x `YOUR_CALENDLY_LINK` | Your actual Calendly URL |
| Logo mark | "SC" text in nav | Custom SVG logo (optional) |
| Footer name | "Artem Stepanenko" | As-is or update |

---

## Design update (later)

When Artem provides design examples:
- Colors are in CSS variables at the top of `<style>` (`:root { --orange: ... }`)
- Font is Inter via Google Fonts — swap the `<link>` tag to change
- No framework, no build step — edit CSS directly and redeploy

---

## File size
`index.html` is ~25KB. Loads in under 1 second on any connection.
