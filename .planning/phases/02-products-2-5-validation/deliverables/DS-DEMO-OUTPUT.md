# Data Structurer Assistant — Live Demo Output

> **All data in this file is illustrative. No real client, supplier, or company data is included.**
> Use this file during sales calls: screen-share Section 3 after running Section 2 live in Claude.

---

## Section 1: Raw Input (what the client gives us)

### Example A — Copy-pasted Seller Central inventory row

```
B08XYZ1234	10ft Trampoline Black	FBA	342	87	255	 	$47.80	JUMP-10FT-BLK-US
(columns: ASIN | Title | Channel | OH | Res | Avail | DoS | Cost | SKU)
```

Note: the "Days of Stock" column is blank. Column headers are inconsistent with Seller Central standard export. Cost column has a dollar sign that breaks numeric parsing.

---

### Example B — Supplier email excerpt

```
Hi Artem,

Just to confirm the order details for the 10ft and 15ft models.
For 10ft (MOQ 200 units): $47.50 per unit, lead time is roughly 40-45 days from PO date.
Payment: 30% deposit, balance before loading.
Contact for quality questions: Lisa Chen, lisa@example-supplier.cn
We are active and ready to produce.

Best,
David
```

Note: No PO number mentioned. Lead time is a range, not a fixed value. Supplier name is in the email footer but not explicitly stated in the body.

---

### Example C — 3PL invoice line from email

```
April billing summary:
- Pallet storage (12 pallets x 13 days): $178.75
- Inbound handling (container unload, Apr 10): $590.00
- Parcel processing (47 orders, avg 8.2 lb): $82.25

Total due: $851.00 — Net-15 from April 30
```

Note: No 3PL name in this excerpt (it was in the email subject line). Outbound date not stated. Billing period is April but individual line dates vary.

---

## Section 2: Claude Prompt Used

The following is the DS-CLAUDE-TEMPLATE.md prompt applied to all three examples above. In a live demo, paste this into Claude and run it in real time.

---

You are a supply chain data analyst specializing in e-commerce operations (Amazon FBA, China sourcing, 3PL warehousing). Your job is to take messy, unformatted supply chain data and convert it into clean, structured tables that can be used immediately for decision-making.

---

**INPUT INSTRUCTIONS**

Below the line marked [RAW DATA START], I will paste raw supply chain data. It may be copy-pasted rows from Amazon Seller Central, a supplier email excerpt, a 3PL invoice line, a manual note, or a mix of the above.

**PROCESSING INSTRUCTIONS**

1. Identify which of these 6 SC data categories the input belongs to: SKUs, Inventory, Orders / Purchase Orders, Forecasts, Supplier Data, 3PL Activity.
2. If the input spans multiple categories, process each category separately.
3. Extract every recognizable field. Map values to standard field names.
4. Assign Status: ✓ present and clear / ⚠ missing but required / ? ambiguous.
5. Do not invent values. If missing, mark ⚠ and leave Value blank.

**OUTPUT FORMAT**

| Field | Value | Source | Status |
|-------|-------|--------|--------|

After each table: "Category: [name] — [X] of [Y] required fields complete. [Z] fields missing."

[RAW DATA START]

Example A:
B08XYZ1234	10ft Trampoline Black	FBA	342	87	255	 	$47.80	JUMP-10FT-BLK-US

Example B:
Just to confirm: 10ft MOQ 200 units, $47.50/unit, lead time 40-45 days, 30% deposit, Lisa Chen (lisa@example-supplier.cn), active.

Example C:
April billing: Pallet storage 12 pallets x 13 days = $178.75, Inbound Apr 10 = $590.00, Parcel 47 orders = $82.25. Total $851.00, Net-15 from April 30.

[RAW DATA END]

---

## Section 3: Structured Output (what Claude returns)

### Inventory Table (from Example A)

| Field | Value | Source | Status |
|-------|-------|--------|--------|
| ASIN | B08XYZ1234 | col 1 | ✓ |
| Product Name | 10ft Trampoline Black | col 2 | ✓ |
| SKU Code | JUMP-10FT-BLK-US | col 9 | ✓ |
| Warehouse Location | FBA | col 3 | ✓ |
| On-Hand Qty | 342 | col 4 | ✓ |
| Reserved Qty | 87 | col 5 | ✓ |
| Available Qty | 255 | col 6 | ✓ |
| Days of Stock | | col 7 (blank) | ⚠ |
| Unit Cost (COGS) | 47.80 | col 8 ($47.80) | ✓ |
| Last Updated | | not in input | ⚠ |

> Category: Inventory — 8 of 10 required fields complete. 2 fields missing (Days of Stock, Last Updated).

---

### Supplier Data Table (from Example B)

| Field | Value | Source | Status |
|-------|-------|--------|--------|
| Supplier Name | | not stated in body; check email sender/footer | ? |
| Primary Contact | Lisa Chen (lisa@example-supplier.cn) | email para 2 | ✓ |
| Lead Time (days) | 40–45 | email para 1 | ? |
| Note | Lead time is a range, not a fixed value. Confirm exact number for planning. | — | ? |
| MOQ | 200 | email para 1 | ✓ |
| Payment Terms | 30% deposit, balance before loading | email para 1 | ✓ |
| Status | active | email para 2 | ✓ |
| SKU Covered | 10ft model | email para 1 | ? |
| Note | SKU identified by description only. Confirm ASIN or SKU code. | — | ? |

> Category: Supplier Data — 4 of 6 required fields complete. 1 field missing (Supplier Name), 2 fields unclear (Lead Time range, SKU code).

---

### 3PL Activity Table (from Example C)

| Field | Value | Source | Status |
|-------|-------|--------|--------|
| 3PL Name | | not in excerpt; check email subject or sender | ⚠ |
| Inbound Date | 2026-04-10 | "Inbound Apr 10" | ✓ |
| Outbound Date | | not stated | ⚠ |
| Pallet Count | 12 | "12 pallets" | ✓ |
| Charges (USD) | 851.00 | "Total $851.00" | ✓ |
| Billing Period | 2026-04 | "April billing" | ✓ |
| Charge Breakdown | Storage $178.75 / Inbound $590.00 / Parcel $82.25 | lines 1–3 | ✓ |

> Category: 3PL Activity — 4 of 6 required fields complete. 2 fields missing (3PL Name, Outbound Date).

---

## Section 4: What This Enables

- **Exception Management** can now run: clean inventory data (on-hand, reserved, available) is the input for stockout and overstock alerts — no manual reformatting needed.

- **Demand Monitor** can compare structured forecasts against the clean inventory snapshot to flag deviations — impossible without normalized field names.

- **3PL Invoice Validation** can match the structured charge breakdown above against your contract rate card and flag the $178.75 storage charge automatically — requires the clean 3PL Activity table this demo just produced.
