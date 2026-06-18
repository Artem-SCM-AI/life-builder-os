# SCAIT — Supply Chain AI Technology

## Product Architecture

| Layer | # | Product | Focus |
|-------|---|---------|-------|
| Layer 0 — Foundation | 0 | SC Data Map | Data structuring |
| Layer 1 — Engine (Stock Control) | 1 | SC Stock Radar | Inventory monitoring |
| Layer 1 — Engine (Stock Control) | 2 | SC Delta | Plan vs. actual deviation |
| Layer 2 — Savings (Invoice Validation) | 3 | SC Supplier Guard | Supplier invoice validation |
| Layer 2 — Savings (Invoice Validation) | 4 | SC 3PL Guard | 3PL invoice & cost validation |
| Layer 3 — Communication | 5 | SC Supplier Desk | Supplier communication AI |
| Layer 3 — Communication | 6 | SC Forwarder Desk | Forwarder communication AI |
| Layer 4 — Quality & Structuring | 7 | VERIX | Inspection report processor |
| Layer 4 — Quality & Structuring | 8 | SPECTRA | Product tech spec agent |
| Layer 4 — Quality & Structuring | 9 | INSPEX | Inspection brief generator |

---

## Product 0 — SC Data Map
**Layer: 0 — Foundation**

### Concept
An AI agent that connects to Google Workspace, scans existing files, and automatically builds a structured supply chain database tailored to the business.

### Headline
Your supply chain data — structured, live, and ready to work.

### The Problem
Most e-commerce brands run their supply chain across scattered spreadsheets, emails, and shared drives. No one knows where the real data is. Every report takes hours to assemble. Every decision is made on incomplete information.

### What It Does
Within 48 hours the client gets:
- A custom SC dashboard built for their product catalog and operations
- Every data point auto-filled from existing files
- A **Confidence Score** on each cell — so they know exactly what to trust
- A **SC Health Score** — one number showing how complete the data foundation is
- A **live sync agent** that keeps the dashboard updated as the business evolves

No manual data entry. No consultants. No starting from scratch.

### Result
A single source of truth for the supply chain — always current, always structured, ready to plug into reporting, forecasting, and automation stack.

SC Data Map is the foundation layer of the SCAIT ecosystem. Every product added on top works better because of it.

### Pricing

| | Starter | Growth | Scale | Enterprise |
|--|---------|--------|-------|------------|
| SKUs | 1–50 | 51–200 | 201–2,000 | 2,000+ |
| Units/month | Up to 2,000 | 2,000–10,000 | 10,000–50,000 | 50,000+ |
| Setup | $200 | $400 | $700 | Custom |
| Monthly | $99 | $200 | $350 | Custom |

> Tier is determined by whichever parameter — SKUs or monthly units — places you higher.

---

## Product 1 — SC Stock Radar
**Layer: 1 — Engine (Stock Control)**

### Concept
A daily AI monitoring agent that pulls inventory data from every stock location, calculates risk per SKU, and delivers one structured report every morning — before problems become crises.

### How It Works
1. Pulls stock data from all locations: FBA, 3PL, Prep warehouse, In Transit, In Production
2. Accepts data via SC Data Map, existing spreadsheets, API, report upload, or email
3. Tracks ETD for incoming shipments (supplier + forwarder)
4. Analyzes historical sales velocity per SKU
5. Calculates Days of Stock, stockout risk, and overstock flags
6. Delivers daily structured report

### Key Features

**Days of Stock (DOS)**
Core metric per SKU — not units, but how many days stock will last at current velocity.

**Traffic Light System**
- 🔴 Under 30 days — critical
- 🟡 30–60 days — warning
- 🟢 60–90 days — healthy
- 🔵 90+ days — overstock

**Stockout Prediction Date**
"SKU X will stock out on June 18 if current velocity continues."

**Reorder Alert**
Instant notification when DOS hits the reorder threshold — no waiting for the next report.

**ETD Reliability Engine**
Tracks promised ETD vs. actual delivery history per supplier and forwarder. When planning the next order, client sees two numbers: what the supplier promises and what history says to actually expect. Reliability score per partner builds automatically over time.

**SKU Categorization**

| Category | Logic | Alert Priority |
|----------|-------|----------------|
| 🏆 Bestseller | Top velocity, core revenue | Critical — stockout unacceptable |
| 📦 Mid-performer | Stable, average contribution | Important |
| 🔖 Assortment keeper | Low velocity, kept for catalog | Low — higher DOS tolerance |
| 🏷️ Clearance | Being phased out | Sell-through tracking only — no reorder alerts |

**FBA IPI Impact Flag**
Overstock items flagged for IPI score impact and storage limit risk.

**Multi-Location Bottom-Up Analysis**
For clients with 2+ warehouse locations:
- Analyzes historical order geography per warehouse
- Automatically determines natural service zones based on warehouse location + customer geography
- Calculates DOS and stockout risk per warehouse independently
- Flags regional stockouts even when total stock appears sufficient
- Recommends inter-warehouse transfers before triggering new orders

### Business Description
Most Amazon brands find out about a stockout after it happens. By then, BSR is dropping, PPC is wasted, and you're scrambling to expedite a shipment at 3x the cost. The data was always there — scattered across FBA reports, 3PL emails, and supplier updates. Nobody connected the dots.

SC Stock Radar is a daily AI monitoring agent that pulls inventory data from every location and delivers one clear report every morning.

Every day the client sees:
- Total stock by SKU across every location
- Days of Stock with traffic light status
- Predicted stockout date per SKU
- SKU performance category
- ETD for incoming shipments with supplier reliability score
- Overstock flags with FBA IPI impact warnings

Over time, the system learns how accurate suppliers and forwarders really are. When planning the next order, the client sees two numbers: what they promised — and what history says to actually expect.

SC Stock Radar connects directly to SC Data Map and feeds into the full SCAIT ecosystem.

### Pricing

| | Starter | Growth | Scale | Enterprise |
|--|---------|--------|-------|------------|
| SKUs | 1–50 | 51–200 | 201–2,000 | 2,000+ |
| Units/month | Up to 2,000 | 2,000–10,000 | 10,000–50,000 | 50,000+ |
| Setup | $700 | $1,500 | $2,500 | Custom |
| Monthly (1 location) | $444 | $777 | $999 | Custom |

**Multi-Location Multiplier** (compound, applied from 2nd location):

| Locations | Multiplier | Starter | Growth | Scale |
|-----------|-----------|---------|--------|-------|
| 1 | 1.0x | $444 | $777 | $999 |
| 2 | 1.2x | $533 | $932 | $1,199 |
| 3 | 1.44x | $639 | $1,119 | $1,439 |
| 4 | 1.73x | $768 | $1,344 | $1,729 |
| 5 | 2.07x | $919 | $1,609 | $2,069 |

---

## Product 2 — SC Delta
**Layer: 1 — Engine (Stock Control)**

### Concept
A daily AI monitoring agent that tracks the gap between planned and actual sales — per SKU, every 24 hours. Turns the sales plan into a live early-warning system for stockouts and overstock.

### How It Works
1. Client uploads sales plan — or SC Delta takes last 12 months of actuals as baseline forecast
2. System pulls actual daily sales data automatically
3. Calculates deviation in units and $ per SKU
4. Flags deviations based on client-defined thresholds
5. Delivers daily alert report

### Key Features

**Daily Plan vs Actual Comparison**
Deviation calculated per SKU every 24 hours — in units and in $.

**Client-Defined Thresholds**
Client sets their own alert level — e.g. ±10% = warning, ±25% = critical.

**Positive Deviation Alert — Primary SC Signal**
Selling above plan = heading for a stockout. Most important reorder trigger in the system.

**Negative Deviation Alert**
Selling below plan = overstock and cash flow risk building up.

**Cumulative View**
Not just daily delta — rolling deviation for the week and month vs. plan.

**Auto Baseline**
No sales plan? SC Delta copies last 12 months of sales as forecast and starts monitoring immediately.

**SC Stock Radar Integration**
When sales exceed plan, Days of Stock recalculates automatically — reorder alert fires earlier.

### Business Description
Most brands check their sales performance weekly — or worse, monthly. By then, two weeks of demand signal have already been missed. A product flying above plan means heading for a stockout. A product falling below plan means capital is sitting in overstock.

SC Delta monitors the gap between sales plan and actual sales — every 24 hours, per SKU.

Every day the client sees:
- Actual vs. planned sales by SKU — in units and in $
- Deviation % with client-defined alert thresholds
- Cumulative deviation for the week and month
- Positive deviation alerts — the most important reorder signal
- Negative deviation alerts — overstock and cash flow risk

No sales plan? No problem. SC Delta takes the last 12 months of sales data and builds a baseline forecast automatically.

SC Delta integrates directly with SC Stock Radar — when sales exceed plan, Days of Stock recalculates automatically.

### Pricing

| | Starter | Growth | Scale | Enterprise |
|--|---------|--------|-------|------------|
| SKUs | 1–50 | 51–200 | 201–2,000 | 2,000+ |
| Units/month | Up to 2,000 | 2,000–10,000 | 10,000–50,000 | 50,000+ |
| Setup | $300 | $600 | $1,000 | Custom |
| Monthly | $149 | $299 | $449 | Custom |

> No location multiplier — deviation is tracked at business level, not warehouse level.

---

## Product 3 — SC Supplier Guard
**Layer: 2 — Savings (Invoice Validation)**

### Concept
An AI agent that reads every supplier invoice, compares it against contract terms and purchase orders, and flags every discrepancy — before payment.

### How It Works
1. Client uploads supplier contract data — prices per SKU, MOQ, payment terms
2. Supplier sends invoice in any format — PDF, Excel, email, image
3. System reads and recognizes the invoice automatically
4. Runs 3-way match: invoice vs. contract vs. PO
5. Flags every discrepancy with severity rating
6. Delivers validation report before payment is approved

### Key Features

**Multi-Format Invoice Recognition**
Reads invoices in any format — PDF, Excel, email, image. Supports English and Chinese.

**3-Way Match**
Invoice vs. contract price vs. PO quantity. Catches errors at every level.

**Discrepancy Severity Rating**
- 🔴 Critical — significant overcharge
- 🟡 Warning — price or quantity mismatch
- ℹ️ Info — minor rounding or formatting issue

**Running Savings Tracker**
Total amount caught and saved since day one. Primary KPI for the client — and the strongest renewal argument.

**Auto-Draft Dispute**
When a discrepancy is found, system prepares a ready-to-send response to the supplier. Integrates with SC Supplier Desk.

**Live Contract Database**
Prices change, new SKUs get added. Contract terms stay current and active.

### Business Description
Invoice errors are more common than most brands realize — wrong unit prices, incorrect quantities, missing discounts, unauthorized fees. Most go unnoticed because checking manually takes hours and happens after payment is already approved.

SC Supplier Guard reads every invoice suppliers send, cross-references it against contract terms and purchase orders, and reports exactly what's wrong — before payment.

Every invoice goes through:
- Automatic recognition in any format — PDF, Excel, email, or image
- Full 3-way match against contract price, PO quantity, and agreed terms
- Discrepancy report with severity rating — Critical, Warning, or Info
- Running total of every dollar caught and saved

When an error is found, SC Supplier Guard drafts the supplier response — ready to send in one click.

SC Supplier Guard integrates with SC Supplier Desk to close the loop from detection to dispute automatically.

### Pricing

| | Starter | Growth | Scale | Enterprise |
|--|---------|--------|-------|------------|
| Invoices/month | 1–10 | 11–30 | 31–100 | 100+ |
| SKUs per invoice | Up to 20 | Up to 50 | Up to 150 | Unlimited |
| Setup | $400 | $800 | $1,500 | Custom |
| Monthly | $199 | $299 | $449 | Custom |

---

## Product 4 — SC 3PL Guard
**Layer: 2 — Savings (Invoice Validation)**

### Concept
An AI agent that audits every 3PL invoice against contracted rates, catches overbilling on zones, weight, surcharges, and storage — and delivers a ready-to-send dispute report before payment is approved.

### How It Works
1. Client uploads 3PL contract and carrier rate card
2. Client provides warehouse ZIP codes and order data
3. System receives 3PL invoice in any format
4. Cross-references every line item against contract terms
5. Calculates correct shipping zones using warehouse ZIP + customer ZIP
6. Delivers Savings Report + Dispute Draft

### Key Features

**Zone Validation — Core Feature**
Origin ZIP (warehouse) + Destination ZIP (customer) = correct shipping zone. System calculates the zone that should have been applied and compares against what was billed. FedEx Zone 5 billed — Zone 3 is correct = caught.

**Weight & DIM Validation**
Actual weight vs. dimensional weight — billing should apply whichever is higher. Wrong DIM factor = over-billing. System catches it every time.

**Wrong Warehouse Flag**
Order should have shipped from Dallas (Zone 3) — shipped from New York (Zone 6). Not just an error — a direct financial loss. Flagged and added to dispute.

**Surcharge Validation**
Every surcharge cross-referenced against contract and eligibility criteria:
- AHS (Additional Handling Surcharge) — does the product actually qualify?
- Residential Surcharge — is the address truly residential?
- Delivery Area Surcharge (DAS) — is the ZIP code in a DAS zone?
- Fuel Surcharge — correct rate for the billing period?

**Storage Fee Validation** *(Only with Product 0 subscription)*
Pallet count, storage duration, and contracted rate cross-referenced against what was billed.

**Savings Report**
All discrepancies consolidated in one report — broken down by category: zones, weight, surcharges, storage.

**Dispute Draft**
Everything that needs to be disputed goes into a separate ready-to-send letter to the 3PL — itemized, referenced, and professional.

### Business Description
Zone errors, weight overbilling, incorrect surcharges, wrong warehouse routing — these mistakes happen on almost every invoice. They're small enough to go unnoticed individually. They add up to thousands of dollars a year.

SC 3PL Guard audits every 3PL invoice against contracted rates and catches every discrepancy before payment.

Every invoice goes through:
- Zone validation — correct zone calculated from warehouse ZIP to customer ZIP
- Weight and DIM check — billed weight vs. actual and dimensional weight
- Surcharge audit — AHS, Residential, DAS, Fuel — every charge verified against eligibility
- Wrong warehouse detection — flagged when routing increased shipping cost
- Storage fee verification — pallet count, duration, and rate cross-referenced against contract

Two outputs delivered:
1. **Savings Report** — every discrepancy found, broken down by category, total amount overbilled
2. **Dispute Draft** — a ready-to-send letter with every item itemized and ready to dispute

### Pricing

| | Starter | Growth | Scale | Enterprise |
|--|---------|--------|-------|------------|
| Shipments/month | 1–200 | 201–1,000 | 1,001–5,000 | 5,000+ |
| Setup | $500 | $1,000 | $2,000 | Custom |
| Monthly | $249 | $449 | $749 | Custom |

---

## Product 5 — SC Supplier Desk
**Layer: 3 — Communication**

### Concept
An AI agent that manages all supplier communication through Gmail — with full supplier context, automated production checks, bilingual outreach, and a complete backlog of every conversation. Starts in draft mode, scales to full autonomy.

### How It Works
1. All supplier communication routed through Gmail
2. Agent builds a knowledge base per supplier — terms, prices, payment conditions, lead times, contacts, history
3. Client defines autonomy level — what the agent can decide independently and what requires approval
4. Agent manages all outgoing and incoming communication
5. Starts with draft approval — graduates to full autonomy when client is ready

### Key Features

**Supplier Knowledge Base**
Complete profile per supplier — contract terms, pricing, MOQ, payment conditions, lead times, contacts, communication history. Built from client input or extracted automatically from email history.

**Monday Production Check**
Every Monday at 8:00 AM China time, agent sends a production status request for every active PO — per invoice, per SKU. When the supplier responds, agent prepares a structured report for the team.

**Automated Follow-Up**
Supplier promised to send something tomorrow — agent follows up automatically the next afternoon. No missed promises. No manual reminders.

**Holiday Calendar**
Full calendar of Chinese national holidays and other relevant dates. Agent adjusts communication timing automatically and flags upcoming gaps in supplier availability.

**Inspection Coordination**
When an inspection is required, agent drafts and sends the inspection request to the factory — scheduling, requirements, and confirmation handled automatically.

**Bilingual Outreach**
Every email sent in English and Chinese simultaneously. Client sees exactly what was sent. Factory receives it in their language. No translation errors. No ambiguity.

**Attachment Handling**
- Invoice received → forwarded automatically to SC Supplier Guard for processing
- Any other attachment → manager notified immediately

**Sentiment Detection**
Agent reads between the lines. Evasive answers, vague timelines, unusual phrasing — flagged to the team before a problem becomes a crisis.

**Escalation Rules**
Client defines triggers for immediate human escalation:
- Price change request
- Delay beyond X days
- Quality issue raised
- Force majeure or production stop

**Supplier Performance Tracking**
Average response time, on-time communication rate, promise fulfillment rate — tracked per supplier over time.

**Draft Approval Workflow**
Every draft presented for review before sending. One-click Approve / Edit / Reject. Full control before transitioning to autonomous mode.

**Communication Backlog**
Complete searchable log of every conversation — organized by supplier, PO, and topic.

### Business Description
Every week, hours are lost chasing suppliers. Most of those hours produce the same three outcomes — no reply, a vague answer, or a promise that gets forgotten.

SC Supplier Desk takes over entire supplier communication — through Gmail, in the client's name, in both English and Chinese.

Every week it runs automatically:
- Monday 8:00 AM China time — production status check sent to every factory with an active order, per PO, per SKU
- Supplier responds — structured report prepared for the team within the hour
- Supplier promises a document tomorrow — follow-up sent automatically the next afternoon
- Invoice arrives — forwarded directly to SC Supplier Guard for validation
- Inspection needed — factory contacted, logistics confirmed, confirmation tracked

SC Supplier Desk starts in draft mode — every email reviewed and approved before it sends. When ready, it runs fully autonomously.

Integrates with SC Supplier Guard — invoices received from suppliers are automatically routed for validation.

### Pricing

| | Starter | Growth | Scale | Enterprise |
|--|---------|--------|-------|------------|
| Suppliers | 1–3 | 3–10 | 10–25 | 25+ |
| Setup | $500 | $1,000 | $2,000 | Custom |
| Monthly | $299 | $499 | $899 | Custom |

---

## Product 6 — SC Forwarder Desk
**Layer: 3 — Communication**

### Concept
An AI agent that manages all freight forwarder communication through Gmail — tracking every shipment from booking to delivery, preventing demurrage, automating document follow-ups, and feeding ETD updates directly into SC Stock Radar.

### How It Works
1. All forwarder communication routed through Gmail
2. Agent builds a knowledge base per forwarder — rates, lanes, contacts, performance history
3. Client defines autonomy level — what the agent handles independently and what requires approval
4. Agent manages all outgoing and incoming communication across all active shipments
5. Starts in draft mode — graduates to full autonomy when client is ready

### Key Features

**Weekly Shipment Status Check**
Automatic status request sent for every active shipment — current location, ETD confirmed, any delays or exceptions.

**ETD Feed → SC Stock Radar**
When a forwarder updates an ETD, SC Stock Radar automatically recalculates Days of Stock per affected SKU. No manual entry. No lag.

**Document Tracker**
Per-shipment checklist of required documents — Bill of Lading, Commercial Invoice, Packing List, Certificate of Origin, customs docs. If a document is overdue, agent follows up with the forwarder automatically.

**Demurrage Prevention**
Agent tracks free time at the destination port per shipment. X days before free time expires — alert sent to the team and the forwarder. Demurrage stopped before it starts.

**Booking Request Automation**
When production is confirmed via SC Supplier Desk — agent prepares the booking request to the forwarder automatically.

**Exception Handling**
Customs delay, port congestion, documentation issue, vessel change — agent flags the team immediately with full details and prepares the forwarder response.

**Bilingual Outreach**
Every email sent in English and Chinese simultaneously. Full visibility for the client. No translation errors.

**Forwarder Performance Tracking**
On-time rate, average ETD vs. ETA variance, response time — tracked per forwarder over time.

**Draft Approval Workflow**
Every email reviewed before sending. One-click Approve / Edit / Reject. Full control before transitioning to autonomous mode.

**Communication Backlog**
Complete searchable log of every conversation — organized by forwarder, shipment, and document type.

### Business Description
ETDs change without warning. Documents arrive late. Free time runs out while the team is chasing other fires. By the time demurrage shows up on an invoice, it's already too late.

SC Forwarder Desk manages the entire forwarder relationship — through Gmail, across every active shipment, from booking request to final delivery.

Every week it runs automatically:
- Status check sent to every forwarder with an active shipment
- ETD updates received → Days of Stock recalculated in SC Stock Radar instantly
- Missing document detected → forwarder followed up automatically
- Free time running low → demurrage alert sent to team and forwarder before it costs money
- Production confirmed → booking request prepared and sent without manual input

Starts in draft mode — every email reviewed before it sends. When ready, runs fully autonomously.

Integrates with SC Stock Radar — ETD updates flow directly into Days of Stock calculations. Integrates with SC Supplier Desk — production confirmation triggers booking requests automatically.

### Pricing

| | Starter | Growth | Scale | Enterprise |
|--|---------|--------|-------|------------|
| Shipments/month | 1–25 | 25–100 | 100–500 | 500+ |
| Setup | $500 | $1,000 | $2,000 | Custom |
| Monthly | $299 | $499 | $899 | Custom |

---

## Product 7 — VERIX
**Layer: 4 — Quality & Structuring**

### Concept
An AI agent that processes every inspection report the moment it arrives by email — determines Pass, Fail, or Conditional, notifies the right people instantly, and organizes all files automatically. Zero manual sorting. Zero missed failures.

### How It Works
1. Inspector sends report by email
2. Agent reads the report and determines the result
3. If Fail: notifies manager in chat + prepares supplier draft
4. If Pass: moves all files to the correct folder, creates report artifact, sorts photos into two folders
5. If Conditional: escalates to manager with full details for decision

### Key Features

**Multi-Format Recognition**
Reads inspection reports from any company — QIMA, SGS, Bureau Veritas, Asia Inspection, and others — automatically, regardless of format.

**Instant Fail Alert**
Batch failed inspection — manager notified in chat immediately. No delay. No missed emails.

**Supplier Draft on Fail**
When a batch fails, agent prepares a ready-to-send letter to the supplier with inspection findings. Sent via VERIX or routed through SC Supplier Desk.

**Conditional Pass Escalation**
Third result state — manager notified with full details and context to make the final call.

**Automatic File Organization on Pass**
All files from the inspection email moved to the correct folder automatically:
- 📄 Report artifact — structured summary including AQL summary, defect count by category, sample size
- 📦 Packaging photos folder — product and packaging images
- 📷 Inspection photos folder — all remaining inspection images

**AQL Summary Extraction**
Even on a Pass — key numbers extracted and saved: sample size, defects found by category (Critical / Major / Minor), overall AQL result.

**SC Data Map Integration**
Inspection result automatically added to the supplier and SKU profile in SC Data Map.

### Business Description
Every inspection generates an email with a report, dozens of photos, and a result that determines whether a shipment moves or stops. Most teams read the subject line, check Pass or Fail, and move on. The files pile up. The details get lost. The history disappears.

VERIX processes every inspection report the moment it arrives.

**If the batch passes:**
- All files organized automatically — report, packaging photos, inspection photos in separate folders
- Structured report artifact created with AQL summary and defect counts
- Result logged to supplier and SKU history

**If the batch fails:**
- Manager notified in chat instantly
- Supplier draft prepared and ready to send

**If the result is conditional:**
- Manager escalated with full inspection details for final decision

Integrates with SC Supplier Desk — supplier letters on failed inspections are routed automatically. Integrates with SC Data Map — inspection history stored per supplier and SKU.

### Pricing

| | Starter | Growth | Scale | Enterprise |
|--|---------|--------|-------|------------|
| Inspections/month | 1–5 | 6–20 | 21–50 | 50+ |
| Setup | $300 | $600 | $1,200 | Custom |
| Monthly | $149 | $299 | $499 | Custom |

---

## Product 8 — SPECTRA
**Layer: 4 — Quality & Structuring**

### Concept
An AI agent that analyzes existing product specifications and listing descriptions, builds a complete universal tech card for every SKU, identifies every possible characteristic per component, and delivers a structured template for client and supplier to complete together. Every spec gets a unique number. Every invoice references it.

### How It Works
1. Agent analyzes existing specs, documentation, and Amazon listing descriptions
2. Builds a universal tech card structure for the company
3. Auto-populates all known data from existing sources
4. Analyzes each product component — part by part
5. Identifies all possible characteristics per component — steel grade, Pantone color, wall thickness, diameter, strength class, and more
6. Delivers a structured template — client and supplier complete the remaining fields together
7. Every finalized spec receives a unique number
8. Every invoice references the spec number next to each product

### Key Features

**AI Component Analysis**
Agent breaks the product down component by component and identifies every characteristic that should be specified — even ones the brand has never formally documented. Nothing left unspecified by default.

**Universal Tech Card**
One standardized format for the entire company. Every product, every supplier, every order — same structure.

**Collaborative Template**
Agent delivers what it knows — client and supplier fill in the rest together. Structured, clear, and built for real-world supplier workflows.

**Strict Spec Numbering**
Every finalized specification receives a unique number. Referenced in every PO, every invoice, every communication. No ambiguity about which version of a product was ordered.

**Version Control**
Every change creates a new version — v1.0, v1.1, v2.0 — with a full changelog. Especially valuable for brands that periodically update materials, components, or packaging.

**Change Highlight**
New version differs from previous — agent highlights every change. Critical when switching suppliers or updating production standards.

**Spec Completeness Score**
Shows what percentage of possible characteristics are filled in per SKU. Spec stays open until completeness meets the minimum threshold.

**VERIX Integration**
Finalized spec automatically generates an inspection checklist for the inspector — based on the exact characteristics defined in SPECTRA.

**SC Supplier Desk Integration**
Spec number automatically included in every PO and supplier communication.

### Business Description
Most brands have product specs somewhere — a PDF from three years ago, notes in a supplier email, measurements buried in a listing description. When something changes — a new supplier, a material update, a packaging revision — the spec rarely gets updated. Nobody knows what version is currently in production.

SPECTRA builds a complete product specification system from scratch. It analyzes everything the client already has, builds a universal tech card for each SKU, then breaks each product down component by component — identifying every characteristic that should be documented — and delivers a structured template to complete together with the supplier.

Once finalized, every spec receives a unique number. That number appears on every PO, every invoice, every inspection request. No ambiguity. No wrong versions.

When something changes, SPECTRA creates a new version with a full changelog.

Integrates with VERIX — every finalized spec generates an inspection checklist automatically. Integrates with SC Supplier Desk — spec numbers referenced in every PO and supplier communication.

### Pricing

| | Starter | Growth | Scale | Enterprise |
|--|---------|--------|-------|------------|
| SKUs | 1–10 | 11–50 | 51–200 | 200+ |
| Setup | $600 | $1,200 | $2,500 | Custom |
| Monthly | $199 | $399 | $699 | Custom |

---

## Product 9 — INSPEX
**Layer: 4 — Quality & Structuring**

### Concept
An AI agent that transforms technical specifications into a precise, step-by-step inspection brief for every inspector — based on SPECTRA specs or uploaded documentation. Every inspection standardized. Every check defined. No interpretation required.

### How It Works
1. Agent pulls technical specifications from SPECTRA or accepts manual upload
2. Analyzes each product component and its defined characteristics
3. Generates a step-by-step inspection brief
4. Defines exactly what to check, in what order, with what tolerances
5. Sets Pass/Fail criteria per checkpoint
6. Includes AQL sampling instructions
7. Brief delivered to inspector before every inspection

### Key Features

**Component-by-Component Checklist**
Every product broken down into individual components. Every component gets its own inspection steps — steel grade check, Pantone color match, wall thickness measurement, thread class verification, surface treatment assessment.

**Pass/Fail Criteria Per Checkpoint**
Every step has a clear threshold. Inspector knows exactly when to pass and when to fail — no judgment calls, no interpretation.

**AQL Sampling Instructions**
Correct sample size calculated automatically based on shipment quantity and AQL level. Inspector arrives knowing exactly how many units to inspect.

**Step-by-Step Format**
Not a list of specs — a sequential workflow. Inspector follows steps in order. Nothing skipped. Nothing missed.

**Spec Number Reference**
Every brief references the SPECTRA spec number and version. Inspector, client, and supplier all know exactly which specification was used.

**VERIX Integration**
Brief generated by INSPEX defines exactly what VERIX will look for when processing the inspection report. Consistent input. Consistent output.

**Standardized Across All Inspectors**
QIMA today, Asia Inspection tomorrow — same brief, same checklist, same criteria. Inspection quality no longer depends on who shows up.

### Business Description
Most inspection briefs are vague — "check quality," "verify dimensions," "confirm packaging." Different inspectors interpret them differently. Critical checks get missed. Defects slip through.

INSPEX turns technical specifications into a precise, step-by-step inspection guide — built specifically for the inspector, for this product, for this shipment.

Every brief includes:
- Component-by-component checklist with exact measurement tolerances
- Clear Pass/Fail criteria for every checkpoint
- AQL sampling instructions with correct sample size calculated automatically
- Sequential workflow — no skipped steps, no guesswork
- Spec number and version reference for full traceability

When the inspection is complete, VERIX processes the report against the same criteria INSPEX defined — closing the quality loop automatically.

Integrates with SPECTRA — specs flow directly into inspection briefs automatically. Integrates with VERIX — inspection criteria defined by INSPEX are used to validate the incoming report.

### Pricing

| | Starter | Growth | Scale | Enterprise |
|--|---------|--------|-------|------------|
| Briefs/month | 1–5 | 6–20 | 21–50 | 50+ |
| Setup | $300 | $600 | $1,000 | Custom |
| Monthly | $99 | $199 | $349 | Custom |

---

## Competitive Analysis

### SCAIT vs. Inventory Management Tools

| Tool | Focus | Monthly (150 SKUs) | What It Does |
|------|-------|-------------------|--------------|
| SoStocked | Amazon restock | $299–$399 | Reorder alerts, basic forecasting |
| Inventory Planner | Forecasting | $299–$499 | Demand forecasting, reorder planning |
| Linnworks | Multi-channel | $449 | Stock sync, order management |
| Cin7 Omni | Full inventory | $349–$999 | Warehouse, orders, B2B |
| Brightpearl | Retail ops | $375–$1,500 | Full retail operations platform |
| **SCAIT (3 products)** | **AI SC agents** | **$1,618** | 👇 |

### Why SCAIT Costs More — And Why That's the Point

Competitors sell dashboards. SCAIT delivers AI agents that do the work.

| Feature | Competitors | SCAIT |
|---------|------------|-------|
| Basic reorder alerts | ✅ | ✅ |
| Multi-warehouse support | ✅ | ✅ |
| ETD reliability engine | ❌ | ✅ |
| Supplier accuracy tracking | ❌ | ✅ |
| Regional demand mapping | ❌ | ✅ |
| SKU performance categorization | ❌ | ✅ |
| Daily plan vs. actual monitoring | ❌ | ✅ |
| Full SC data foundation | ❌ | ✅ |

### The Right Comparison

SCAIT doesn't compete with $299/month tools. SCAIT competes with people:

| Alternative | Cost per Month |
|-------------|---------------|
| Junior SC Analyst | $3,000–$5,000 |
| Senior SC Manager | $6,000–$10,000 |
| SC Consulting Firm | $10,000–$25,000 |
| **SCAIT (3 products)** | **$1,618** |

**The Bottom Line:** For $1,618/month, the client gets what used to cost $5,000–$10,000 in headcount — running 24/7, with no sick days, no turnover, and no learning curve.

---

### SCAIT vs. Closest Alternatives

| Tool | Focus | Pricing | The Gap |
|------|-------|---------|---------|
| Fabrikatör | AI inventory for Amazon/Shopify | $99–$499/mo | Forecasting only — no full SC stack |
| Cogsy | AI demand planning for DTC | $500–$2,000/mo | DTC-focused, not Amazon-specific |
| Anvyl | Supplier collaboration | $1,000–$3,000/mo | Supplier side only — no stock monitoring |
| Streamline | AI inventory optimization | $299–$999/mo | Forecasting only — no ETD engine, no SC agents |

### Why There Are No True Direct Competitors

The market is split into two extremes:

**Cheap simple tools ($99–$499/month)**
Basic dashboards. No AI agents. No ETD reliability tracking. No integrated SC stack.

**Enterprise platforms ($5,000–$25,000/month)**
o9 Solutions, project44, Kinaxis — built for billion-dollar corporations. Too complex and too expensive for an Amazon brand.

**The middle is empty.**

### Where SCAIT Lives

```
$99–$499/mo           SCAIT           $5,000+/mo
Simple tools   ←   $444–$1,618   →   Enterprise
No AI               AI-native         Too complex
                    Full SC stack
                    Amazon-specific
```

SCAIT owns the white space — AI-native supply chain automation built specifically for Amazon brands doing $1M–$20M in revenue.

**No one else is here yet.**
