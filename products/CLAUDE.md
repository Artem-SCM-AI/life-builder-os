# Life Builder OS — Products

HTML quiz products for thelifebuilder.gumroad.com funnel. Served via GitHub Pages.

## Live URLs

| Product | File | Status | URL |
|---|---|---|---|
| P1 — Why Start AI Now? | `product-1-why-start-ai.html` | ✅ LIVE | https://artem-scm-ai.github.io/life-builder-os/products/product-1-why-start-ai.html |
| P3 — AI Audit UA | `product-ai-audit-ua.html` | ✅ LIVE | https://artem-scm-ai.github.io/life-builder-os/products/product-ai-audit-ua.html |
| P5 — AI or Automation? | `product-5-ai-or-automation.html` | ⚠️ email capture missing | — |

## Deploy flow (Product 1)

```bash
# 1. Edit source HTML here
#    /Users/artem/Claude v 1.0/products/product-1-why-start-ai.html

# 2. Copy to GitHub Pages repo
cp products/product-1-why-start-ai.html /tmp/life-builder-os/products/

# 3. Commit and push
cd /tmp/life-builder-os
git add . && git commit -m "update product 1" && git push
```

GitHub repo: https://github.com/Artem-SCM-AI/life-builder-os (branch: main, served from root)

## Email capture (Product 1)

Apps Script Web App: `https://script.google.com/macros/s/AKfycbzfBe87y7FsxcCEm_4OU_RG0u7SsVKhKtsmWb1wthedrL5dW86637Duyb-6-WlMopkflw/exec`

Script source: `../tool-life-builder-leads.gs`
Leads sheet: "Life Builder OS — Leads" (Google Drive), Sheet ID: `1APc2nOr8y9hQfOTITs7eW8yIulTAOQG34LJxltRMHfk`
Tabs: `P1 — Why Start AI` · `All`

To update Apps Script: edit `tool-life-builder-leads.gs` → paste into script.google.com editor → Deploy → new version.

## Product 1 — quiz structure

5 screens: category → pain selection → pain tagging → results + email capture

4 categories: `job-search` · `experts` · `sales-procurement` · `freelancer`
Each category has 8 pains defined in `PAIN_DATA`. Color scale: 0=red, 1=orange, 2=yellow, 3=lime, 4=green.

Form fields captured: `first_name`, `email`, `job_title`, `main_task`, `linkedin_url` (optional) + quiz state + UTM params.

## Product 5 — pending

File exists: `product-5-ai-or-automation.html`. Email capture placeholder (`FORM_LINK_HERE`) not yet replaced. Do not publish until fixed.

## UTM tracking

Append to shared links: `?utm_source=threads&utm_medium=post&utm_campaign=launch`

## Pending

- [ ] Convert Products 2, 4 from `.md` to HTML (source files in workspace root)
- [ ] Fix Product 5 email capture
- [ ] Create Gumroad pages for all products
