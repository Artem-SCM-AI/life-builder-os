# Requirements: Invoice Validator

**Defined:** 2026-04-17
**Core Value:** Show users exactly how much money is being overcharged in their invoices — in under 60 seconds — so they can dispute it before they pay.

---

## v1 Requirements

### Authentication & Access

- [ ] **AUTH-01**: User can create account with email and password
- [ ] **AUTH-02**: User session persists across browser refresh
- [ ] **AUTH-03**: User can access product for 14 days without payment (free trial)
- [ ] **AUTH-04**: User is paywalled after trial expires until Stripe subscription activated

### Document Ingestion

- [ ] **DOC-01**: User can upload a PDF invoice and receive parsed line items
- [ ] **DOC-02**: User can upload an Excel or CSV invoice and receive parsed line items
- [ ] **DOC-03**: User can upload a contract PDF and have AI extract their negotiated rate card automatically (eliminates manual rate entry)
- [ ] **DOC-04**: User sees a "parsed preview" of extracted data before validation runs (can catch parsing failures before acting)
- [ ] **DOC-05**: User sees a confidence indicator per extracted field (high/low confidence flagged)

### Contract Rate Management

- [ ] **RATE-01**: User can store their negotiated rate card (per-pallet storage, handling, parcel tiers, surcharges) linked to a vendor
- [ ] **RATE-02**: User can select from pre-built rate templates for ShipBob, Flexport/Deliverr, ShipMonk (eliminates blank-slate rate entry)
- [ ] **RATE-03**: User can edit and save a rate card for any vendor

### Validation Engine

- [ ] **VAL-01**: System compares each invoice line item against the corresponding contracted rate and flags discrepancies
- [ ] **VAL-02**: System validates carrier surcharges (FedEx/UPS) against published tariff rates (fuel surcharge %, residential, accessorial fees)
- [ ] **VAL-03**: Each flagged discrepancy shows: what was billed, what the contract says, and the dollar difference (line-item "show your work")
- [ ] **VAL-04**: Total overcharge summary shown as headline number before detail view

### Output & Export

- [ ] **OUT-01**: User can export discrepancy report as PDF (formatted for sending to 3PL or carrier)
- [ ] **OUT-02**: User can export discrepancy report as CSV (for internal tracking)
- [ ] **OUT-03**: User can generate a pre-filled dispute letter (to vendor/carrier) from a validation result via Claude

### Trust & Feedback

- [ ] **TRUST-01**: User can give thumbs up / thumbs down per individual discrepancy flag (accuracy feedback loop)
- [ ] **TRUST-02**: User can view invoice history — list of all past validation runs with dates and totals
- [ ] **TRUST-03**: User can re-open any past validation run and review results

### Go-to-Market

- [ ] **GTM-01**: 10 LinkedIn posts written and scheduled — hooks based on real billing error discovery stories ("I found $X in overcharges...")
- [ ] **GTM-02**: Cold/warm outreach script written for SC/Ops contacts (Kevin/SmartWarehousing, Mark/Green Wave, Josh/Spreetail, PawChamp/SKELAR)
- [ ] **GTM-03**: Pricing page live at $49/month with Stripe Checkout, 14-day trial, no credit card, clear ROI statement
- [ ] **GTM-04**: 15 YouTube Shorts scripted — quick demos showing Invoice Validator catching real overcharges (30–60 sec each, hook in first 3 sec)
- [ ] **GTM-05**: 2 YouTube videos (5–7 min each) explaining how Invoice Validator simplifies supply chain billing: one for 3PL validation, one for carrier surcharge auditing

---

## v2 Requirements

### Advanced Validation

- **VAL-V2-01**: PO-to-supplier invoice matching (upload PO + supplier invoice, verify quantities, prices, no unauthorized items)
- **VAL-V2-02**: Amazon FBA fee anomaly detection (validate FBA fee reports against Amazon's published fee schedule)
- **VAL-V2-03**: Recurring error pattern detection (flag vendor that has overbilled same item 3+ months running)

### Distribution

- **GTM-V2-01**: Referral program (at 20+ customers, activate referral link rewards)
- **GTM-V2-02**: Amazon seller community presence (r/FulfillmentByAmazon, Facebook groups)
- **GTM-V2-03**: YouTube demo video ("I found $2,000 in billing errors in 60 seconds")

### Product Expansion

- **PROD-V2-01**: Rate negotiation benchmarks ("your storage rate is 12% above median for East Coast 3PLs")
- **PROD-V2-02**: Email report delivery (automatically email dispute report to vendor)

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Payment processing / AP automation | Different product (Bill.com/Tipalti territory); tool validates, user pays via existing system |
| ERP integration (SAP, Oracle, QuickBooks) | Months to build; wrong segment for v1; CSV export is sufficient |
| Multi-user approval workflows | Enterprise feature; v1 customer is solo SC manager or founder |
| Mobile app | Desktop workflow; no one audits freight invoices on a phone |
| Multi-currency / international invoices | US/USD first; expand to UK/EU when demand exists |
| Email inbox auto-ingestion | High complexity; manual upload sufficient for v1 |
| Custom OCR model training | Claude handles document understanding at this scale; custom models add months |
| Vendor portal / supplier self-service | Reverses the product dynamic |
| Freemium tier | No viral/network component; paid trial converts better for B2B workflow tool |

---

## Traceability

Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01–04 | TBD | Pending |
| DOC-01–05 | TBD | Pending |
| RATE-01–03 | TBD | Pending |
| VAL-01–04 | TBD | Pending |
| OUT-01–03 | TBD | Pending |
| TRUST-01–03 | TBD | Pending |
| GTM-01–05 | TBD | Pending |

**Coverage:**
- v1 requirements: 27 total
- Mapped to phases: 0 (pending roadmap)
- Unmapped: 27 ⚠️ (will be resolved by roadmapper)

---
*Requirements defined: 2026-04-17*
*Last updated: 2026-04-17 after initial definition*
