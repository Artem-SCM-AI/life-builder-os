# Research Summary — Invoice Validator

**Synthesized:** 2026-04-17
**Sources:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md, PROJECT.md

---

## Executive Summary

Invoice Validator is a narrow, high-ROI SaaS: upload a 3PL or supplier invoice, compare against stored contract rates, flag every line-item discrepancy, export a dispute report. The market gap is real — every incumbent either targets mid-market (Tipalti at $299+/month) or does extraction without validation (Veryfi). No self-serve tool exists at $29–49/month for e-commerce operators.

The technical approach is straightforward: FastAPI + pdfplumber + Claude tool_use + Supabase + Next.js. Entire stack runs at ~$171/month at 100 customers. The core risk is not architecture — it is extraction accuracy on real-world invoice formats. Validate this before writing any application code.

---

## Recommended Stack

| # | Technology | Rationale |
|---|------------|-----------|
| 1 | **FastAPI (Python)** | Async-native, Pydantic typing, ideal for file upload + Claude API |
| 2 | **pdfplumber + PyMuPDF** | pdfplumber for text-layer PDFs; PyMuPDF as scanned-PDF fallback (verify AGPL license) |
| 3 | **Claude Sonnet + tool_use** | Structured JSON extraction eliminates brittle string parsing. Haiku too weak; Opus too expensive. |
| 4 | **Supabase** | PostgreSQL + Auth + Storage on free tier. Zero ops for solo founder. |
| 5 | **Next.js (App Router) + Vercel** | Upload UI, results dashboard, auth, Stripe webhooks — one repo, free hosting |

**Supplementary:** Stripe Checkout, Railway ($5/month), Resend, Sentry.
**Do not add:** Celery/Redis, microservices, custom OCR models, self-hosted anything.

---

## Table Stakes Features (must ship in v1)

1. PDF invoice upload + parsing
2. Excel/CSV invoice upload (40%+ of 3PL invoices come as CSVs)
3. Contract rate storage (user-defined) — ground truth for all validation
4. Line-item discrepancy detection — the core product promise
5. Total overcharge summary — headline ROI number
6. Report export (PDF or CSV)
7. Parsing confidence indicator — users won't trust black-box flags
8. Invoice history / audit log
9. **"Show your work" display** — raw extracted value + contract value + math per line. Non-negotiable trust layer.
10. **ToS with liability disclaimer** — live before first paying customer

---

## Key Differentiators

**Dispute letter auto-generation (v1 stretch)**
Pre-filled dispute letter from discrepancy report. Closes loop from "found error" to "got money back." No competitor at any price does this self-serve.

**Pre-built 3PL rate templates**
Templates for ShipBob, Flexport, ShipMonk, Amazon FBA. Eliminates #1 onboarding drop-off (manual rate entry of 15–30 line items).

**PO-to-invoice matching (v1 stretch)**
Upload PO + supplier invoice → verify quantities, prices, unauthorized items. Enterprise tools charge 10x for this.

**Founder credibility**
Artem identified $618K–$916K/year in recoverable overcharges at Jumpzylla. Cannot be replicated by any competitor.

**v2 pipeline (validate demand first):** Carrier surcharge validation (FedEx/UPS), Amazon FBA fee anomaly detection (disrupts GETIDA's 25% model), recurring error pattern detection.

---

## GTM Priority Order

**Sales motion:** Demo → 14-day trial (no credit card) → invoice uploaded within 24h → paid. No freemium.
**Price: $49/month.** Same effort, 69% more MRR than $29. $29 signals side project.

| Priority | Channel | When | Expected |
|----------|---------|------|----------|
| 1 | Warm outreach (Kevin, Mark, Josh, PawChamp) | Week 1 | 3–8 customers in days |
| 2 | LinkedIn content (2x/week, dollar-amount hooks) | Week 1 | 30–50 over months 2–4 |
| 3 | Cold outreach (~50 DMs/month to SC/Ops directors) | Month 1 | 5–15 |
| 4 | Amazon seller communities (Reddit, FB groups) | Month 2 | 15–25 (after 3–4 weeks credibility-building) |
| 5 | YouTube demo content | Month 2 | 10–20 (18-month discoverability) |
| 6 | Referral program | Month 3 | 10–20 (activate at 20+ customers) |

**Content mix:** 40% proof of problem (real $ amounts), 35% proof of expertise (SC frameworks), 25% proof of tool (demos, results). No feature announcements.

**Timeline to 100 customers: 5–7 months** with consistent execution.

**Biggest GTM risk:** Content lapse while running parallel job search. LinkedIn algorithm resets after gaps.

---

## Critical Warnings

**1. Extraction accuracy is the entire Phase 1 bet.**
Test Claude API on 5 real invoices in a notebook before writing any application code. Numeric transpositions ($1,350 → $1,530) cause false disputes and destroyed vendor relationships. Below 90% accuracy = fix strategy before anything else.

**2. PDF format diversity kills reliability in production.**
Scanned PDFs, multi-column tables, password-protected files, merged cells — all fail silently. Detect PDF type first. Show "parsed preview" so users catch parsing failures before validation runs.

**3. Trust is a UX problem, not a marketing problem.**
"Show your work" display is non-negotiable. Without it, users won't act on findings even when correct. Low activation rate (signed up, never exported) = early churn signal.

**4. Validate core before building anything else.**
MVP scope: upload → extract → compare → export. If 2+ weeks elapsed without a real invoice processed end-to-end, scope has crept.

**5. Token costs must be measured before pricing is set.**
200-page invoice = ~$1.80/run. At $29/month with heavy users, unit economics go negative. Implement document chunking and cost logging before pilot.

---

## Build Order Recommendation

**Phase 0 — Accuracy Validation (Week 1, no app code)**
5 real invoices → Claude API in Jupyter notebook → measure accuracy manually. >90%: proceed. <90%: fix prompting first.

**Phase 1 — Extraction Engine (Weeks 1–2)**
Python pipeline: pdfplumber + pandas + Claude tool_use. PDF type detection. OCR fallback. Parsed preview. Token cost logging. Per-flag feedback rating. Test 10 real formats.

**Phase 2 — Core Backend (Weeks 2–3)**
FastAPI wrapper. Contract rate storage (Supabase). Comparison logic. Discrepancy flagging with "show your work." Overcharge summary. CSV export.

**Phase 3 — MVP Frontend (Weeks 3–4)**
Next.js: upload screen with data privacy statement, parsed preview, results display, export. Supabase Auth. Invoice history. Pre-built 3PL templates.

**Phase 4 — Monetization + Launch (Weeks 4–5)**
Stripe Checkout at $49/month. 14-day trial. ToS live. 10 pilot customers before public announcement.

**Phase 5 — Differentiators (post-launch)**
Dispute letter generator. PO matching. Referral program. Pricing model A/B test.

---

## Open Questions (verify before building)

1. **PyMuPDF AGPL license** — Confirm for SaaS use. Safe fallback: pdf2image + pytesseract.
2. **Extraction accuracy on real invoices** — Phase 0 test. Everything downstream depends on this.
3. **Token cost per real invoice** — Measure in Phase 0 before pricing finalized.
4. **Current Claude model IDs** — Verify at docs.anthropic.com before hardcoding.
5. **Anthropic Files API GA status** — Could reduce per-request costs significantly.
6. **Competitor landscape** — Search "3PL invoice audit tool" to verify no new entrant since Aug 2025.
7. **Pilot invoice formats** — Get real samples from Kevin/Mark/Josh before building ingestion module.
8. **Pricing validation** — Ask first 5 pilots: "How many invoices/month? What would you pay if we saved $500 on one?"
