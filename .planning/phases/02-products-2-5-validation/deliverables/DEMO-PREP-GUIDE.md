# Demo Prep Guide — Live Claude Demo Instructions for Products 2–5

**Purpose:** Everything needed to run a live Claude demo on a call. Complete pre-call prep in 2 minutes.

> **Data notice:** All sample data in this guide is illustrative only. No real client invoices, PO numbers, or identifiable supplier names are used.

**Usage:** Before each call, go to the section for the product being pitched. Prepare the sample data in a text file. During the Demo block, paste sample data + prompt into Claude and narrate what you see.

---

## EMS — Exception Management System

### Pre-Call Prep (2 minutes before call)

Open a text file. Copy this sample inventory data table:

```
Sample / Illustrative Only — EMS Demo Data

SKU           | Inventory (units) | 7-Day Sales Velocity | Days of Stock | Reorder Point
-------------|-------------------|---------------------|---------------|---------------
TRAMP-8FT    | 24                | 8/day               | 3 days        | 14 days
TRAMP-10FT   | 110               | 3/day               | 37 days       | 14 days
TRAMP-12FT   | 8                 | 6/day               | 1 day         | 14 days
TRAMP-14FT   | 340               | 2/day               | 170 days      | 14 days
TRAMP-16FT   | 45                | 7/day               | 6 days        | 14 days
```

Note: TRAMP-8FT (3 days stock, below 14-day reorder) and TRAMP-12FT (1 day stock, critical) are the stockout risks. TRAMP-14FT (170 days stock = 12x reorder point) is the overstock case.

### Prompt to Paste Into Claude

After the sample data table, paste:

```
You are a supply chain exception analyst. Review the inventory data above.

For each SKU:
1. Calculate risk level: Critical (< 7 days), Warning (7–14 days), OK (> 14 days)
2. Flag overstock if Days of Stock > 3x Reorder Point
3. Output a ranked exception list — Critical first, then Warning, then OK

Format as a table with columns: SKU | Status | Days of Stock | Issue | Recommended Action
```

### What to Say During Demo

> "This ranked list — Critical / Warning / OK — took 45 seconds. You were doing this manually in pivot tables, or not doing it at all. TRAMP-12FT is one day from a stockout. TRAMP-14FT has six months of stock sitting in a warehouse costing you fees. Both of those are in the report automatically."

### Reference

See EMS-SALES-SCRIPT.md for the full Demo block context and ROI anchor line.

---

## DEVMON — Demand vs Plan Deviation Monitor

### Pre-Call Prep (2 minutes before call)

Open a text file. Copy this sample forecast vs actual table:

```
Sample / Illustrative Only — DEVMON Demo Data

SKU           | Week    | Forecasted Units | Actual Units Sold | Variance
-------------|---------|-----------------|------------------|----------
TRAMP-8FT    | Week 18 | 50              | 29               | -42%
TRAMP-10FT   | Week 18 | 80              | 83               | +4%
TRAMP-12FT   | Week 18 | 60              | 78               | +30%
TRAMP-14FT   | Week 18 | 40              | 41               | +3%
```

Note: TRAMP-8FT is 42% below forecast (overstock building, possible listing issue). TRAMP-12FT is 30% above forecast (stockout risk, may need expedited reorder).

### Prompt to Paste Into Claude

After the sample data table, paste:

```
You are a demand planning analyst. Review the forecast vs actual data above.

For each SKU:
1. Calculate variance percentage
2. Flag any SKU with variance > 15% (over or under)
3. For flagged SKUs, suggest the most likely root cause: stockout, promo lift, listing issue, seasonality
4. Output a deviation report ranked by absolute variance

Format as a table with columns: SKU | Variance % | Direction | Status | Likely Root Cause | Recommended Action
```

### What to Say During Demo

> "Two SKUs flagged: one sold 40% below forecast — that's overstock building. One sold 30% above — you're heading into a stockout. Both spotted in 30 seconds. It doesn't just show the gap — it surfaces the likely reason: was it a listing issue, a promo, a stockout? That's the part that takes you hours to diagnose manually."

### Reference

See DEVMON-SALES-SCRIPT.md for the full Demo block context and ROI anchor line.

---

## SINV — Supplier Invoice Validation

### Pre-Call Prep (2 minutes before call)

Open a text file. Copy this sample 3-way match data:

```
Sample / Illustrative Only — SINV Demo Data

PURCHASE ORDER (PO-2026-0482)
Supplier: Guangzhou Outdoor Co. (illustrative)
Item: TRAMP-12FT trampoline units
Qty ordered: 500 units
Unit price: $12.00
Total PO value: $6,000.00

SUPPLIER INVOICE (INV-GZ-2026-0317)
Item: TRAMP-12FT trampoline units
Qty billed: 500 units
Unit price: $12.40
Handling fee: $150.00
Total invoice: $6,350.00

RECEIVING RECORD (WH-RCPT-0991)
Item: TRAMP-12FT trampoline units
Qty received: 488 units
Date received: 2026-04-28
```

Note: Two discrepancies — $0.40/unit price variance ($200 total) and 12 units short on receipt (not billed or credited).

### Prompt to Paste Into Claude

After the sample data table, paste:

```
You are a supplier invoice auditor. Run a 3-way match on the PO, invoice, and receiving record above.

Check for:
1. Price variances (invoice unit price vs PO unit price)
2. Quantity mismatches (invoice qty vs received qty)
3. Unauthorized charges (any invoice line not in the PO)
4. Calculate total dollar impact of all discrepancies

Output a discrepancy report with columns: Issue | PO Value | Invoice Value | Variance | Dollar Impact | Recommended Action
```

### What to Say During Demo

> "Found two issues in 20 seconds: a $0.40/unit price variance — that's $200 on this PO. And 12 units short on receipt — $144 worth of product you paid for but didn't receive. If you pay this invoice as-is, you're out $344 you shouldn't be. Most brands don't catch these until month-end, if at all."

### Reference

See SINV-SALES-SCRIPT.md for the full Demo block context and ROI anchor line.

---

## 3PLV — 3PL Invoice & Cost Validation

### Pre-Call Prep (2 minutes before call)

Open a text file. Copy this sample 3PL invoice vs rate card data:

```
Sample / Illustrative Only — 3PLV Demo Data

3PL INVOICE (SmartShip-INV-2026-042)
Warehouse: Victorville, CA
Billing period: April 2026

Line 1: Pallet storage — 50 pallets × $14.50/pallet = $725.00
Line 2: Inbound receiving — 2 containers × $590.00 = $1,180.00
Line 3: Outbound pallet moves — 38 pallets × $10.00 = $380.00
Line 4: Labeling — 200 units × $0.45 = $90.00

Total invoice: $2,375.00

CONTRACT RATE CARD (signed 2026-01-15)
Victorville, CA:
- Pallet storage: $13.50/pallet/month
- Container unload (inbound): $590.00 per container
- Pallet in/out: $10.00 per move
- Labeling: $0.45 per unit

RECEIVING RECORD (April 2026)
Pallets received into storage: 42 pallets (not 50)
```

Note: Two discrepancies — $1.00/pallet overcharge on storage ($50 on invoice qty, but also 8 extra pallets billed = $13.50 × 8 = $108 unbilled pallets). Total overcharge: $50 rate variance + $108 phantom pallets = $158.

### Prompt to Paste Into Claude

After the sample data table, paste:

```
You are a 3PL invoice auditor. Compare the invoice line items against the contract rate card and receiving record.

Check for:
1. Rate variances (invoice rate vs contract rate per line)
2. Quantity discrepancies (invoice qty vs receiving record)
3. Unauthorized or unlisted charges
4. Calculate total dollar impact

Output a variance report with columns: Line Item | Contract Rate | Invoiced Rate | Qty Billed | Qty Received | Rate Variance | Qty Variance | Total Overcharge
```

### What to Say During Demo

> "Two discrepancies: $1.00/pallet overcharge on storage — that's $50 on the rate alone. And 8 extra pallets billed that don't appear on your receiving record — another $108. Total overcharge on one invoice: $158. Across a year that's nearly $2,000. Claude catches it in 60 seconds."

### Reference

See 3PLV-SALES-SCRIPT.md for the full Demo block context and ROI anchor line.
