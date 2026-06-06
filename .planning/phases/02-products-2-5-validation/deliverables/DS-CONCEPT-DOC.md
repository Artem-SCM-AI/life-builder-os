# Data Structurer Assistant — Product 0 Concept Document

## Section 1: What It Does

Supply chain data from Amazon Seller Central, 3PL portals, and supplier emails arrives in a dozen inconsistent formats — copy-pasted spreadsheet rows, email excerpts, manual notes. Product 0 takes that messy raw input and outputs a single, normalized, field-complete table in 90 seconds using Claude.

It is the data foundation layer. Every other EMS product (Exception Management, Demand Monitor, Invoice Validation) requires clean structured data to function. Product 0 produces that clean data on demand.

---

## Section 2: Six SC Data Field Categories

### 1. SKUs

| Field Name | Data Type | Example Value |
|------------|-----------|---------------|
| ASIN | String (alphanumeric, 10 chars) | B08XYZ1234 |
| SKU Code | String | JUMP-10FT-BLK-US |
| Product Name | String | 10ft Round Trampoline Black |
| Unit Cost (COGS) | Decimal (USD) | 47.80 |
| Dimensions (L x W x H) | String (inches) | 48 x 24 x 18 |
| Weight | Decimal (lbs) | 62.5 |

### 2. Inventory

| Field Name | Data Type | Example Value |
|------------|-----------|---------------|
| Warehouse Location | String | FBA US-EAST / 3PL Haslet TX |
| On-Hand Qty | Integer (units) | 342 |
| Reserved Qty | Integer (units) | 87 |
| Available Qty | Integer (units) | 255 |
| Days of Stock | Integer (days) | 38 |
| Last Updated | Date (YYYY-MM-DD) | 2026-04-30 |

### 3. Orders (Purchase Orders)

| Field Name | Data Type | Example Value |
|------------|-----------|---------------|
| PO Number | String | PO-2026-0412 |
| Supplier | String | Guangzhou Jumping Co. |
| Order Date | Date (YYYY-MM-DD) | 2026-03-15 |
| Expected Delivery | Date (YYYY-MM-DD) | 2026-05-20 |
| Status | Enum | In Transit / Pending / Received |
| Qty Ordered | Integer (units) | 500 |
| Qty Received | Integer (units) | 0 |

### 4. Forecasts

| Field Name | Data Type | Example Value |
|------------|-----------|---------------|
| SKU | String | JUMP-10FT-BLK-US |
| Forecast Period | String (YYYY-MM) | 2026-06 |
| Forecasted Units | Integer | 420 |
| Basis | Enum | manual / algorithm / blended |
| Last Updated | Date (YYYY-MM-DD) | 2026-04-28 |
| Confidence Level | Enum | low / medium / high |

### 5. Supplier Data

| Field Name | Data Type | Example Value |
|------------|-----------|---------------|
| Supplier Name | String | Guangzhou Jumping Co. |
| Primary Contact | String | Lisa Chen (lisa@gzjump.cn) |
| Lead Time (days) | Integer | 45 |
| MOQ | Integer (units) | 200 |
| Payment Terms | String | 30% deposit, 70% before shipment |
| Status | Enum | active / inactive / on-hold |

### 6. 3PL Activity

| Field Name | Data Type | Example Value |
|------------|-----------|---------------|
| 3PL Name | String | Smart Ship Network — Haslet TX |
| Inbound Date | Date (YYYY-MM-DD) | 2026-04-10 |
| Outbound Date | Date (YYYY-MM-DD) | 2026-04-22 |
| Pallet Count | Integer | 12 |
| Charges (USD) | Decimal | 456.00 |
| Billing Period | String (YYYY-MM) | 2026-04 |

---

## Section 3: Data Flow

```
RAW INPUTS (messy, multi-format)
        │
        ├─ Copy-pasted Seller Central rows (inconsistent column names, blank cells)
        ├─ Supplier email excerpts (lead times, prices buried in prose)
        ├─ 3PL portal exports (CSV with non-standard headers)
        ├─ Manual notes / WhatsApp messages
        └─ Spreadsheet dumps (merged cells, multiple header rows)
        │
        ▼
   [DS-CLAUDE-TEMPLATE.md Prompt]
   Claude identifies category → extracts fields → flags missing → normalizes
        │
        ▼
STRUCTURED OUTPUT (one normalized table per category)
        │
        ├─ Inventory table (Status: ✓ complete / ⚠ missing / ? unclear)
        ├─ Supplier Data table
        ├─ 3PL Activity table
        ├─ Orders table
        ├─ SKUs table
        └─ Forecasts table
        │
        ▼
DOWNSTREAM EMS PRODUCTS
        ├─ Exception Management: reads clean inventory + orders
        ├─ Demand Monitor: reads clean forecasts + inventory
        ├─ Supplier Invoice Validation: reads clean POs + supplier data
        └─ 3PL Invoice Validation: reads clean 3PL activity + rates
```

---

## Section 4: Value Proposition

- **Eliminate manual re-entry time.** Structuring one data set manually (Seller Central + supplier + 3PL) takes 20–30 minutes per session, multiple times per week. Product 0 reduces this to 90 seconds per data dump.

- **Enable every downstream EMS product to run on clean data.** Exception Management, Demand Monitor, and Invoice Validation all require normalized field-complete data. Product 0 is the prerequisite that makes all of them possible without custom data engineering.

- **Catch missing fields before they cause stockouts or billing errors.** The Status column (✓ / ⚠ / ?) surfaces missing lead times, unconfirmed delivery dates, and blank quantities at the moment of input — not three weeks later when the damage is done.
