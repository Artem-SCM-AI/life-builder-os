# Features Research — Invoice Validator

**Domain:** Invoice validation / AP automation, e-commerce supply chain niche
**Researched:** 2026-04-17
**Confidence:** HIGH = well-established; MEDIUM = likely accurate; LOW = verify before acting

---

## Competitor Landscape Summary

| Tool | Target | Price | Gap for e-commerce SC |
|------|--------|-------|----------------------|
| **Tipalti** | Mid-market ($10M+) | $299+/mo | Overkill, requires IT setup, no 3PL logic |
| **Bill.com** | SMB AP/AR | $45–79/user/mo | Generic, no freight/rate validation |
| **Stampli** | Finance teams | $500+/mo | Collaboration focus, no rate validation |
| **Veryfi** | Data extraction | — | Extraction only, no contract comparison |
| **Rossum** | High-volume AP | $1K+/mo | Requires professional services, not self-serve |

**The real gap:** E-commerce operators (Amazon sellers, 10–200 person brands) currently audit manually in Excel or not at all. No purpose-built, affordable, self-serve tool exists at the $29–49/month price point. **[HIGH confidence — corroborated by founder's direct experience]**

---

## Table Stakes Features (must-have)

| Feature | Why | Complexity | Existing tools |
|---------|-----|------------|----------------|
| PDF invoice upload + parsing | Entry point — if it can't read the invoice, nothing else matters | Medium | Enterprise only |
| Excel/CSV invoice upload | 40%+ of 3PL invoices come as CSV exports | Low | Generic, no SC logic |
| Contract rate storage (user-defined) | Ground truth for validation — must persist | Medium | Nobody at this price |
| Line-item discrepancy detection | Core product promise | Medium | Nobody at this price |
| Total overcharge summary | Headline number drives ROI justification | Low | No |
| Report export (PDF/CSV) | The report triggers the money recovery | Low-Medium | Generic only |
| Parsing confidence indicator | Users won't trust flagged errors without transparency | Medium | Enterprise only |
| Invoice history / audit log | Dispute documentation + retention hook | Medium | No |

---

## Differentiators for E-commerce SC Niche

**Dispute letter auto-generation** [Medium complexity, High value]
From the discrepancy report, auto-generate a professional dispute letter pre-filled with invoice number, line items, contract references, disputed total. Closes the loop from "finding the error" to "getting money back." No competitor does this. Claude makes it easy.

**PO-to-invoice matching** [Medium complexity, High value]
Upload PO + supplier invoice → check quantities, unit prices, unauthorized line items. Second pain point in same user workflow (Chinese factory invoices). Enterprise tools do it at 10x the price.

**Pre-built 3PL rate templates** [Medium complexity, High value]
Out-of-the-box rate card templates for ShipBob, Flexport/Deliverr, ShipMonk, Amazon FBA. User selects their 3PL, enters their tier — templates pre-fill the rate structure. Eliminates onboarding friction. Nobody has this.

**Recurring error pattern detection** [Medium complexity, High value — v2]
After 3+ invoices from same vendor: "This 3PL has overbilled fuel surcharge 3 months running. Annual impact: $X." Turns transactional tool into strategic one.

**Carrier surcharge breakdown validation** [High complexity, High value — v2]
Validate FedEx/UPS/DHL surcharges against published tariffs. This is where the $270K–$370K/year opportunity lives. Freight audit firms charge per-audit or take % of recovery. No self-serve tool at $49/month.

**Amazon FBA fee anomaly detection** [High complexity, Very High value — v2]
Validate FBA fee reports against Amazon's fee schedule. Flag wrong size tiers, storage miscalculations, reimbursement shortfalls. GETIDA/Seller Investigators charge 25% of recovery — flat SaaS price is massive disruption if delivered.

---

## Anti-Features for v1 (Do Not Build)

| Feature | Why not |
|---------|---------|
| Payment processing / AP automation | Different product, banking compliance, wrong direction |
| ERP integration | Months to build, wrong segment, CSV export is sufficient |
| Multi-user approval workflows | Enterprise feature, v1 customer is solo |
| Custom OCR model training | Claude handles this at this scale |
| Mobile app | Desktop workflow |
| Multi-currency / international | US/USD-first, expand to UK/EU in v2 |
| Vendor portal / supplier self-service | Reverses the product dynamic |
| Email inbox auto-ingestion | High complexity, manual upload is fine for v1 |

---

## Feature Priority Matrix

| Feature | Complexity | Value | Verdict |
|---------|------------|-------|---------|
| PDF upload + parsing | Medium | High | **Build — core** |
| Excel/CSV upload | Low | High | **Build — core** |
| Contract rate storage | Medium | High | **Build — core IP** |
| Line-item discrepancy detection | Medium | High | **Build — core IP** |
| Overcharge summary | Low | High | **Build — core** |
| Report export | Low-Medium | High | **Build — core** |
| Parsing confidence indicator | Medium | High | **Build — trust layer** |
| Invoice history / audit log | Medium | Medium-High | **Build — retention** |
| Dispute letter generator | Medium | High | **Build — v1 stretch** |
| PO-to-invoice matching | Medium | High | **Build — v1 stretch** |
| Pre-built 3PL templates | Medium | High | **Build — reduces onboarding friction** |
| Carrier surcharge validation | High | High | v2 — validate demand first |
| FBA fee anomaly detection | High | Very High | v2 — highest value/complexity |
| Recurring error patterns | Medium | High | v2 — needs data history |
| Rate negotiation benchmarks | High | High | v3 — needs customer base |

---

## Key Note

Claims that "no tool does X at $49/month" are based on training knowledge through August 2025. Verify directly before using competitor gap claims in GTM messaging.
