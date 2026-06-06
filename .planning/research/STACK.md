# Stack Research — Invoice Validator

**Project:** Invoice Validator SaaS (Claude-powered document processing)
**Researched:** 2026-04-17
**Note:** External tool access was unavailable. All findings from training knowledge (cutoff August 2025). Confidence levels noted per item.

---

## Recommended Stack

| Layer | Technology | Version | Rationale | Confidence |
|-------|------------|---------|-----------|------------|
| Backend framework | FastAPI (Python) | 0.111+ | Async-native, automatic OpenAPI docs, Pydantic-typed request/response, ideal for file upload endpoints | HIGH |
| PDF parsing (primary) | pdfplumber | 0.11+ | Best table extraction for structured invoice line items. MIT licensed, pure Python, no system deps | HIGH |
| PDF parsing (fallback) | PyMuPDF (fitz) | 1.24+ | For scanned/image-based PDFs — render page as image, pass to Claude vision. **VERIFY AGPL licensing before SaaS use** | MEDIUM |
| Excel/CSV processing | openpyxl + pandas | openpyxl 3.1+, pandas 2.2+ | openpyxl reads .xlsx natively; pandas for tabular normalization and comparison logic | HIGH |
| AI backbone | Anthropic Python SDK + claude-sonnet | anthropic 0.28+ | Use tool_use/structured outputs for typed JSON extraction — no brittle string parsing. Sonnet hits right cost/capability balance | HIGH |
| Database + Auth + Storage | Supabase | managed | Free tier: 500MB PostgreSQL + Auth + Storage. Replaces three separate services. No ops | HIGH |
| Frontend | Next.js (App Router) | 14+ | File upload UI, results dashboard, pricing page, auth — all in one repo. Zero-config Vercel deployment | HIGH |
| Payments | Stripe Billing + Checkout | current | Standard for $29–49/month SaaS. Checkout handles PCI compliance, card validation, 3DS | HIGH |
| Backend hosting | Railway | current | $5/month, Dockerfile deploy, warm containers. Least ops overhead for solo Python dev | MEDIUM |
| Frontend hosting | Vercel | free | Zero-config Next.js. Free tier handles 100 customers | HIGH |
| Transactional email | Resend | free tier | 3,000 emails/month free. Simpler DX than SendGrid | MEDIUM |
| Error monitoring | Sentry | free tier | 5K errors/month free. One-line integration for FastAPI + Next.js | MEDIUM |

---

## Key Tradeoffs

**PDF parsing:** pdfplumber over camelot-py (requires Ghostscript system dep, complicates Docker) and over raw pdfminer.six (pdfplumber wraps it cleanly). PyMuPDF for scanned PDFs only — AGPL license must be verified; safe alternative is pdf2image + pytesseract (both MIT/Apache).

**AI model:** Sonnet over Haiku (too weak for messy real-world invoices) and Opus (5x more expensive, no meaningful accuracy gain for structured extraction).

**Frontend:** Next.js over Bubble (can't integrate FastAPI pipeline) and over plain React (Next.js collocates Stripe webhooks + auth callbacks in one repo/deploy).

**Database:** Supabase over PlanetScale (dropped free tier 2024) and Neon (Supabase adds Auth + Storage at same price).

**Jobs:** No Celery/Redis for v1. FastAPI async handles Claude API wait synchronously. 5–15 second processing is acceptable with a progress indicator.

---

## Solo Founder Constraints

1. Managed services always — no self-hosted Postgres, no self-hosted auth
2. Collocate: one Supabase project = three services; one Next.js repo = frontend + webhooks + auth
3. Stripe Checkout not custom forms — handles PCI, 3DS, localization
4. No microservices until forced by real scaling problem with real users
5. One environment (dev + prod) until launch

---

## Cost at 100 Customers (~$3,500 MRR)

| Service | Cost/month | Notes |
|---------|------------|-------|
| Vercel | $0 | Hobby tier sufficient |
| Railway | $5 | FastAPI container |
| Supabase | $0 | Free tier sufficient at 100 customers |
| Claude API | ~$60 | 100 customers × 20 validations × ~$0.03/validation |
| Stripe | ~$105 | 2.9% + $0.30 on ~$3,500 MRR |
| Resend + Sentry | $0 | Free tiers |
| **Total** | **~$171/month** | ~5% infrastructure overhead |

**Key cost driver:** Claude API. Add usage caps per plan or per-validation pricing at scale.

---

## Open Questions (verify before build)

1. **PyMuPDF AGPL licensing** — confirm for SaaS use or switch to pdf2image + pytesseract
2. **Current Claude model IDs** — verify at docs.anthropic.com before hardcoding
3. **Anthropic Files API** — if GA, reduces per-request token cost for re-validation
4. **Supabase Storage adequacy** — 1GB free tier, typical invoice 100KB–2MB PDF

---

## Roadmap Implications

- **Phase 1:** Python-only engine — pdfplumber + pandas + Claude tool_use. No frontend, no auth. Validate extraction + comparison logic on real samples first.
- **Phase 2:** FastAPI wrapper + Supabase storage + file upload endpoints
- **Phase 3:** Next.js frontend + Supabase Auth
- **Phase 4:** Stripe Billing + paywall + launch
