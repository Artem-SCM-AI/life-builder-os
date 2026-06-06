# File Naming Methodology — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply a consistent `[type]-[topic]-[description].ext` naming convention to all files in `~/Claude v 1.0/` and enforce it going forward via CLAUDE.md.

**Architecture:** Two parts — (1) one-time mass rename of 35 existing files using `mv`, (2) add naming rule to CLAUDE.md so Claude applies the convention silently on all future file creation. All target files are untracked by git, so plain `mv` is sufficient (no `git mv` needed).

**Tech Stack:** bash `mv`, `ls`, CLAUDE.md edit

---

## Context

- Scope: `~/Claude v 1.0/` root only
- All 35 target files are **untracked** by git — `mv` is correct, `git mv` is not needed
- System files excluded from rename: `CLAUDE.md` (edited, not renamed), `package.json`, `package-lock.json`, `.gitignore`, `.mcp.json`, `conversations.json`, `projects.json`, `memories.json`, `users.json`, `skills-lock.json`, `.planning/`, `.claude/`
- Full rename manifest in spec: `docs/superpowers/specs/2026-06-01-file-naming-methodology-design.md`

---

## Task 1: Add naming rule to CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` (append new section at end)

- [ ] **Step 1: Append the naming rule section to CLAUDE.md**

Add this block at the end of `/Users/artem/Claude v 1.0/CLAUDE.md`:

```markdown
---

## File Naming Convention

All files created in this directory follow `[type]-[topic]-[description].ext`.

**Rules:**
- Lowercase only, hyphens as separators, no spaces or underscores
- No non-ASCII characters (Cyrillic → translate to English)
- Max ~60 characters

**Types:** `course` · `outreach` · `script` · `report` · `data` · `ref` · `plan` · `notes` · `case` · `copy` · `tool` · `export`

**Date prefix** (YYYY-MM-DD-) only for `export-*` and `report-*` files where the date is meaningful.

**Enforcement:** Apply the correct name silently when creating new files. Ask only when the type is genuinely ambiguous (2 plausible options). Never ask for confirmation on obvious cases.

**Examples:**
- Marketing copy → `copy-gumroad-sales-page.md`
- LinkedIn script → `outreach-linkedin-cold-script.md`
- Code tool → `tool-scraper-all-sites.py`
- Dated export → `2026-04-16-export-claude-conversations.json`
```

- [ ] **Step 2: Verify the section was written**

```bash
tail -30 "/Users/artem/Claude v 1.0/CLAUDE.md"
```

Expected: the "File Naming Convention" section visible at the end.

---

## Task 2: Rename existing files

**Files:**
- Rename 35 files in `~/Claude v 1.0/`

- [ ] **Step 1: Verify source files exist before renaming**

```bash
ls "/Users/artem/Claude v 1.0/" | sort
```

Cross-reference with the manifest below. Any files not present — skip silently (do not error).

- [ ] **Step 2: Execute all renames**

Run each line individually (use the exact quoted paths — many have spaces and special characters):

```bash
DIR="/Users/artem/Claude v 1.0"

# copy/
mv "$DIR/GUMROAD_COPY.md"                                                    "$DIR/copy-gumroad-sales-page.md"
mv "$DIR/scait-landing.md"                                                   "$DIR/copy-scait-landing-page.md"
mv "$DIR/Udemy_Course_Descriptions.docx"                                     "$DIR/copy-udemy-course-descriptions.docx"

# course/
mv "$DIR/Book ECommerce_Supply_Chain_Fundamentals_BOOK.docx"                 "$DIR/course-ecommerce-sc-fundamentals-book.docx"
mv "$DIR/ECommerce_Supply_Chain_Fundamentals_Complete_Course.docx"           "$DIR/course-ecommerce-sc-fundamentals-complete.docx"

# outreach/
mv "$DIR/Comment-to-Call-Playbook.md"                                        "$DIR/outreach-linkedin-comment-to-call-playbook.md"
mv "$DIR/LINKEDIN_POST_LAUNCH.md"                                            "$DIR/outreach-linkedin-post-launch.md"

# plan/
mv "$DIR/JOB_SEARCH_ORCHESTRATOR.md"                                         "$DIR/plan-job-search-orchestrator.md"
mv "$DIR/ROADMAP.md"                                                         "$DIR/plan-scait-product-roadmap.md"
mv "$DIR/SC_NOTION_SYSTEM_BACKLOG.md"                                        "$DIR/plan-sc-notion-system-backlog.md"
mv "$DIR/LinkedIn_Plan_Kateryna.md"                                          "$DIR/plan-linkedin-kateryna.md"
mv "$DIR/build-stylia.md"                                                    "$DIR/plan-stylia-build-guide.md"

# ref/
mv "$DIR/Me.md"                                                              "$DIR/ref-artem-profile-bio.md"
mv "$DIR/artem_profile.md"                                                   "$DIR/ref-artem-profile-extended.md"
mv "$DIR/ARTEM_KNOWLEDGE_BASE.md"                                            "$DIR/ref-artem-knowledge-base.md"
mv "$DIR/Agents.md"                                                          "$DIR/ref-claude-agents-guide.md"
mv "$DIR/scait-icp.md"                                                       "$DIR/ref-scait-icp-profile.md"
mv "$DIR/hypergrowth-skill-instructions.md"                                  "$DIR/ref-hypergrowth-skill-instructions.md"
mv "$DIR/AI LinkedIn Outreach _ Gamma.pdf"                                   "$DIR/ref-ai-linkedin-outreach-slides.pdf"
mv "$DIR/AI Email Outreach — персоналізація на масштабі _ Gamma.pdf"        "$DIR/ref-ai-email-outreach-personalization-slides.pdf"
mv "$DIR/AI Apollo — старт аутрічу _ Gamma.pdf"                             "$DIR/ref-ai-apollo-outreach-start-slides.pdf"
mv "$DIR/CRM + AI Analytics _ Gamma.pdf"                                     "$DIR/ref-crm-ai-analytics-slides.pdf"
mv "$DIR/n8n — автоматизація аутрічу _ Gamma.pdf"                           "$DIR/ref-n8n-outreach-automation-slides.pdf"

# report/
mv "$DIR/SC_ORCHESTRATOR_BUILD_LOG.md"                                       "$DIR/report-sc-orchestrator-build-log.md"
mv "$DIR/news_latest.md"                                                     "$DIR/report-news-latest.md"

# script/
mv "$DIR/LOOM_SCRIPT_SC_COMMAND_CENTER.md"                                   "$DIR/script-loom-sc-command-center.md"

# data/
mv "$DIR/ICP-Mainpain-Bestmodule-Suggestedpricing-Salesmoti.csv"             "$DIR/data-icp-amazon-brand-owners.csv"
mv "$DIR/Bravario_Inventory_Dashboard.xlsx"                                  "$DIR/data-bravario-inventory-dashboard.xlsx"
mv "$DIR/skills_catalog.csv"                                                 "$DIR/data-claude-skills-catalog.csv"

# case/
mv "$DIR/Artem-Afina-CaseStudy.md"                                           "$DIR/case-afina-supply-chain-demo.md"

# tool/
mv "$DIR/scrape_all.py"                                                      "$DIR/tool-scraper-all-sites.py"
mv "$DIR/scrape_hypergrowth.py"                                              "$DIR/tool-scraper-hypergrowth.py"
mv "$DIR/stylia-inventory.gs"                                                "$DIR/tool-stylia-inventory-sheet.gs"
mv "$DIR/stylia-pipeline.gs"                                                 "$DIR/tool-stylia-pipeline-sheet.gs"

# notes/
mv "$DIR/Промти епізод 41.docx"                                              "$DIR/notes-prompts-episode-41.docx"
```

- [ ] **Step 3: Verify renames completed**

```bash
ls "/Users/artem/Claude v 1.0/" | sort
```

Expected: no old names visible, all new names present. Check for any `No such file or directory` errors in Step 2 output — those files simply didn't exist, not a problem.

- [ ] **Step 4: Commit CLAUDE.md change**

```bash
cd "/Users/artem/Claude v 1.0"
git add CLAUDE.md
git status
```

If `CLAUDE.md` shows as untracked (new file) or modified — proceed:

```bash
git commit -m "docs: add file naming convention rule to CLAUDE.md"
```

If git says "nothing to commit" (CLAUDE.md not tracked and not staged) — skip, the file was edited and is ready for future tracking.

---

## Verification

- [ ] Run `ls "/Users/artem/Claude v 1.0/" | grep -E "^[A-Z]|_| "` — should return nothing (no CAPS, underscores, or spaces in filenames, except system files like `CLAUDE.md`)
- [ ] Run `ls "/Users/artem/Claude v 1.0/" | grep -v "^[a-z0-9\.]" | grep -v "^CLAUDE"` — should return nothing unexpected
