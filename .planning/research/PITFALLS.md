# Pitfalls Research — Invoice Validator

**Domain:** AI-powered document processing / invoice validation SaaS
**Researched:** 2026-04-17
**Confidence:** HIGH on technical and GTM pitfalls; MEDIUM on legal/liability

---

## Critical Pitfalls

### 1. AI Extraction Hallucination on Structured Numeric Data [HIGH]

**What goes wrong:** Claude reads a PDF and returns extracted line items — but some numbers are transposed. $1,350 becomes $1,530. User files a false dispute, damages vendor relationship. Or a real overcharge is missed.

**Warning signs:** Extracted value differs from visual inspection; users report "tool flagged something but invoice was correct"; false-positive rate above 5% of line items.

**Prevention:**
- Always show the raw extracted value alongside the interpreted value
- Cross-check arithmetic: if line items sum to X but invoice total shows Y, flag before displaying results
- Bias toward uncertainty — "we read $1,530 but this may be $1,350 — please verify"
- Mandatory "review before dispute" UX step

**Phase:** Phase 1 (cannot be patched after trust is broken)

---

### 2. PDF Parsing Hell — Format Diversity Kills Reliability [HIGH]

**What goes wrong:** Tool works on development sample. Fails silently on scanned PDFs, multi-column tables, password-protected files, merged cells. Users say "it doesn't work" and churn.

**Warning signs:** Extracted line count differs from visible; users say "it missed some charges"; pilot formats failing during internal testing.

**Prevention:**
- Detect PDF type before extraction (text-layer vs. image-only)
- Integrate explicit OCR preprocessing for scanned PDFs (Tesseract) — don't rely on Claude vision as substitute
- Show users a "parsed preview" so they catch parsing failures before validation runs
- Catalog real invoice formats from pilot customers and solve those 10 before expanding

**Phase:** Phase 1 (document ingestion layer — build before validation logic)

---

### 3. Over-Engineering Before Validating Core Value [HIGH]

**What goes wrong:** 6 weeks building onboarding, dashboards, and rate editors — then discovery that extraction accuracy is 70% on real invoices. Product needs rebuilding. First paying customer delayed months.

**Warning signs:** Building UI before testing extraction on real invoices; more than 2 weeks elapsed without real invoice processed end-to-end.

**Prevention:**
- Week 1 test: take 5 real invoices (Artem has Jumpzylla data), run through Claude API prompt in a notebook, measure accuracy manually
- MVP scope enforced: upload → extract → discrepancy flags → export. Nothing else.
- Every feature beyond that is deferred until 3 paying customers confirm the core works

**Phase:** Phase 1 scope definition

---

### 4. Wrong Pricing Structure for the Use Case [HIGH]

**What goes wrong:** $29/month flat rate creates mismatch — low-volume users question value, high-volume users under-pay. $29 signals "toy" to an SC Head managing $5M in logistics spend.

**Warning signs:** Customers asking "do I pay even if I don't use it this month?"; month 1–2 churn with no stated reason.

**Prevention:**
- Don't set public pricing page until 5 pilot customers have paid
- Ask pilots: "How many invoices per month? What would you pay if we saved $500 on one?"
- Test usage-based or hybrid model: base fee + per-invoice beyond threshold
- Consider $49/month over $29 — same acquisition effort, 69% more MRR, stronger signal

**Phase:** Pre-launch / pilot validation

---

### 5. Trust Gap — "Why Would I Trust an AI With My Billing Disputes?" [HIGH]

**What goes wrong:** Tool finds a $2,000 overcharge. User re-checks manually. Tool was right — but they still don't dispute it because they're not sure. Low activation, shallow engagement, eventual churn.

**Warning signs:** Activation rate below 50% (signed up, never uploaded); users uploading but never exporting dispute report; support questions "how do I know this is correct?"

**Prevention:**
- Show your work: "We saw $27.00/pallet on line 14. Your contract says $22.00/pallet. Difference: $5.00 × 40 pallets = $200.00"
- Confidence indicators: distinguish "high confidence" flags from "needs review" flags
- Lead with Artem's personal story: $618K–$916K in overcharges identified at Jumpzylla
- Trust-building onboarding: let users upload an invoice they've already reviewed manually — show the tool finds the same things (or more)
- Never auto-file a dispute — generate templates the user sends under their own name

**Phase:** Phase 1 (results UX design) and Phase 2 (onboarding trust flow)

---

## Moderate Pitfalls

### 6. ICP Scope Creep — Too Many Invoice Types Too Early

After 3PL invoices work, pilots request freight, customs, PO matching. Each has different structure and validation logic. Product becomes generalist with mediocre accuracy everywhere.

**Prevention:** Strict priority order: 3PL invoices → PO matching → freight/customs. New invoice type requires 3+ customer requests before building. Build extraction as modular "document type handlers."

**Phase:** Phase 1 scoping

---

### 7. Claude API Cost Blowout on Large Invoice Documents

200-page monthly 3PL invoice costs $1.80/run. At $29/month, unit economics go negative at 17 runs. High-volume customers cost the founder money.

**Prevention:** Log every API call's token count + cost during pilot. Implement document chunking — extract only relevant sections (charge tables, not audit logs) before sending to AI. Hard token limit per document in MVP (50 pages, with warning). Target: cost per invoice processed < 20% of revenue per invoice.

**Phase:** Phase 1 architecture

---

### 8. GTM Stalls After Initial Network Exhaustion (~15 customers)

Warm-audience LinkedIn effect dissipates after 6–8 weeks. New followers convert at cold-audience rates (1–2%). Growth flatlines.

**Prevention:** Build distribution into the product (subtle "Generated by InvoiceValidator" on reports). Activate Amazon seller communities starting month 2. After 10 customers: ask each for one referral. YouTube demo videos have 18-month discoverability vs LinkedIn's 48-hour window.

**Phase:** Phase 2 GTM

---

### 9. No Feedback Loop → Silent Accuracy Degradation

Incorrect flags generate no complaint — users stop using the feature silently. By the time churn happens, root cause is invisible.

**Prevention:** Per-flag thumbs up/down from day one. Weekly manual review of negative flags. Log: "invoice processed but no report exported" = probable false positive.

**Phase:** Phase 1 (build into results UX — do not defer)

---

## Minor Pitfalls

### 10. Legal Exposure From Missed Errors and False Positives

User relies on tool, pays overcharged invoice, later discovers error. Or files a dispute based on wrong flag — damages vendor relationship.

**Prevention:** ToS with liability disclaimer before first customer pays (not after). "Helps you find" not "guarantees you find." Do not store raw invoices beyond processing. Generate dispute templates, not official documents.

**Phase:** Pre-launch gate — non-optional

---

### 11. Onboarding Drop-Off at Contract Rate Setup

3PL contracts have 15–30 line items. Users abandon onboarding at rate setup and never see a discrepancy report.

**Prevention:** Allow contract PDF upload as alternative to manual entry — let AI extract contracted rates from the contract document automatically. If manual entry required, bulk CSV paste interface. Track drop-off: if >30% abandon at rate setup, redesign before scaling.

**Phase:** Phase 1 MVP onboarding design

---

### 12. Excel/CSV Column Name Brittleness

"Unit Rate" vs "Rate Per Unit" vs "$/Unit" — different 3PLs name columns differently. Tool silently misreads.

**Prevention:** AI-based column mapping (ask Claude to identify which columns represent which data). Column mapping confirmation step — one-time setup per vendor, stored for future runs.

**Phase:** Phase 1 CSV/Excel ingestion module

---

## Phase-Specific Warnings Summary

| Phase | Pitfall | Mitigation |
|-------|---------|------------|
| Phase 1: Extraction | Silent numeric hallucination | Show raw extracted value + cross-check sums |
| Phase 1: Ingestion | PDF format diversity | OCR fallback; test 10 real formats before other features |
| Phase 1: Architecture | Token cost blowout | Chunking + per-run cost logging before pilot |
| Phase 1: Scope | Over-engineering | Enforce: extract + compare + export only |
| Phase 1: Onboarding | Rate setup abandonment | Contract PDF upload as alternative |
| Phase 1: Legal | Liability exposure | ToS + disclaimers = pre-launch gate |
| Phase 2: Pricing | Flat rate mismatch | Usage-based pilot test before hard-coding |
| Phase 2: Trust | Low activation | "Show your work" display from day one |
| Phase 2: GTM | Network exhaustion | Community + product-led distribution activated early |
| Phase 2: Feedback | Silent degradation | Per-flag rating + weekly review |

---

## Key Findings for Roadmap

1. **Extraction accuracy is the entire Phase 1 bet.** Week 1 must include manual accuracy test on real documents before writing any application code.
2. **Trust is a UX problem, not a marketing problem.** Results must show raw extracted value + contract value + math. Non-negotiable design requirement.
3. **Legal protection before first paying customer.** ToS with disclaimers is a launch gate, not a cleanup task.
4. **Model unit economics on real documents before setting prices.** Token costs per invoice must be measured during pilot.
5. **Rate setup friction will kill activation.** Contract PDF upload as alternative to manual entry is a Phase 1 architectural decision.
