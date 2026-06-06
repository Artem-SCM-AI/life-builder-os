# File Naming Methodology — Design Spec
**Date:** 2026-06-01  
**Scope:** `~/Claude v 1.0/`  
**Status:** Approved

---

## Goal

Single naming convention for all user-created files in `~/Claude v 1.0/`. Names carry enough context that Claude can understand file purpose without opening it. New files are named correctly by default — no interruptions, no confirmation requests.

---

## Format

```
[type]-[topic]-[description].ext          # standard
YYYY-MM-DD-[type]-[topic].ext             # for export/* and report/* only
```

**Rules:**
- Lowercase only
- Hyphens `-` as separators only — no spaces, underscores, `—`, `+`, or special characters
- No non-ASCII characters (Cyrillic → transliterate or translate to English)
- Max ~60 characters
- Version suffix only when genuinely needed: `-draft`, `-v2`, `-final`

---

## Types

| Type | What goes here |
|------|----------------|
| `course` | Course content, lessons, modules |
| `outreach` | LinkedIn/email scripts, playbooks, cold outreach |
| `script` | Loom scripts, video scripts |
| `report` | Analysis, build logs, summaries (+ date prefix) |
| `data` | CSV, XLSX, raw data files |
| `ref` | Guides, reference docs, profiles, presentations |
| `plan` | Roadmaps, strategies, orchestrators |
| `notes` | Brainstorming, scratch work, drafts |
| `case` | Case studies, client work |
| `copy` | Marketing copy, landing pages, sales scripts |
| `tool` | Code files: `.py`, `.js`, `.gs` |
| `export` | App data exports (+ date prefix) |

---

## Date Prefix Rule

Only for `export-*` and `report-*` files where the date is meaningful:

```
2026-04-16-export-claude-conversations.json
2026-06-01-report-jumpzylla-cogs-analysis.xlsx
```

For all other types — no date in the name.

---

## Rename Manifest (Existing Files)

Files to rename in `~/Claude v 1.0/`:

| Current name | New name |
|---|---|
| `GUMROAD_COPY.md` | `copy-gumroad-sales-page.md` |
| `JOB_SEARCH_ORCHESTRATOR.md` | `plan-job-search-orchestrator.md` |
| `LOOM_SCRIPT_SC_COMMAND_CENTER.md` | `script-loom-sc-command-center.md` |
| `Artem-Afina-CaseStudy.md` | `case-afina-supply-chain-demo.md` |
| `ICP-Mainpain-Bestmodule-Suggestedpricing-Salesmoti.csv` | `data-icp-amazon-brand-owners.csv` |
| `ROADMAP.md` | `plan-scait-product-roadmap.md` |
| `Bravario_Inventory_Dashboard.xlsx` | `data-bravario-inventory-dashboard.xlsx` |
| `n8n — автоматизація аутрічу _ Gamma.pdf` | `ref-n8n-outreach-automation-slides.pdf` |
| `AI LinkedIn Outreach _ Gamma.pdf` | `ref-ai-linkedin-outreach-slides.pdf` |
| `AI Email Outreach — персоналізація на масштабі _ Gamma.pdf` | `ref-ai-email-outreach-personalization-slides.pdf` |
| `AI Apollo — старт аутрічу _ Gamma.pdf` | `ref-ai-apollo-outreach-start-slides.pdf` |
| `CRM + AI Analytics _ Gamma.pdf` | `ref-crm-ai-analytics-slides.pdf` |
| `scrape_all.py` | `tool-scraper-all-sites.py` |
| `scrape_hypergrowth.py` | `tool-scraper-hypergrowth.py` |
| `stylia-inventory.gs` | `tool-stylia-inventory-sheet.gs` |
| `stylia-pipeline.gs` | `tool-stylia-pipeline-sheet.gs` |
| `Me.md` | `ref-artem-profile-bio.md` |
| `artem_profile.md` | `ref-artem-profile-extended.md` |
| `ARTEM_KNOWLEDGE_BASE.md` | `ref-artem-knowledge-base.md` |
| `Agents.md` | `ref-claude-agents-guide.md` |
| `SC_ORCHESTRATOR_BUILD_LOG.md` | `report-sc-orchestrator-build-log.md` |
| `SC_NOTION_SYSTEM_BACKLOG.md` | `plan-sc-notion-system-backlog.md` |
| `Comment-to-Call-Playbook.md` | `outreach-linkedin-comment-to-call-playbook.md` |
| `LINKEDIN_POST_LAUNCH.md` | `outreach-linkedin-post-launch.md` |
| `LinkedIn_Plan_Kateryna.md` | `plan-linkedin-kateryna.md` |
| `Book ECommerce_Supply_Chain_Fundamentals_BOOK.docx` | `course-ecommerce-sc-fundamentals-book.docx` |
| `ECommerce_Supply_Chain_Fundamentals_Complete_Course.docx` | `course-ecommerce-sc-fundamentals-complete.docx` |
| `Udemy_Course_Descriptions.docx` | `copy-udemy-course-descriptions.docx` |
| `Промти епізод 41.docx` | `notes-prompts-episode-41.docx` |
| `build-stylia.md` | `plan-stylia-build-guide.md` |
| `scait-landing.md` | `copy-scait-landing-page.md` |
| `scait-icp.md` | `ref-scait-icp-profile.md` |
| `hypergrowth-skill-instructions.md` | `ref-hypergrowth-skill-instructions.md` |
| `news_latest.md` | `report-news-latest.md` |
| `skills_catalog.csv` | `data-claude-skills-catalog.csv` |

**Not renamed (system/reserved files):**
- `CLAUDE.md` (system expects this name)
- `package.json`, `package-lock.json`
- `.gitignore`, `.mcp.json`, `.DS_Store`
- `conversations.json`, `projects.json`, `memories.json`, `users.json`
- `skills-lock.json`
- Everything inside `.planning/` and `.claude/`

---

## Automation Rule (for CLAUDE.md)

Claude knows the convention and applies it silently:

- When creating any new file in `~/Claude v 1.0/` — use the correct name directly, no announcement
- When the type is genuinely ambiguous (2 plausible options, not 5) — ask once, concisely
- Never name files with spaces, underscores, or non-ASCII characters
- Apply date prefix automatically for `export-*` and `report-*` types

---

## What This Changes for Claude

| Scenario | Before | After |
|----------|--------|-------|
| Find all outreach files | `ls` + read everything | `ls outreach-*` |
| Understand file purpose | Open file | Read name |
| Create a new doc | User specifies whatever name | Claude names it correctly by default |
| Rename old files | Manual chaos | One-time script, done |
