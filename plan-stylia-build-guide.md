# Stylia Beauty — SC Pipeline Tracker
## Build Reference v3
> Google Sheets + Apps Script. Run once: `createSystem()` → 4 tabs.
> Script file: `stylia-pipeline.gs`

---

## Project Context

**Brand:** Stylia Beauty (PMU/Beauty, Amazon FBA)
**Goal:** Track full SC pipeline across 3 cycles — Supplier → Forwarder → FBA — with 15 SKUs and 5 fixed FBA locations.
**Run:** Extensions → Apps Script → select `createSystem` → Run

---

## Color System

| Color | Hex | Meaning |
|-------|-----|---------|
| 🟡 Yellow | `#FFF9C4` | Manual input — user fills |
| 🔵 Blue | `#DBEAFE` | Formula — read-only, protected |
| ⬛ Dark navy | `#0F1629` | Tab headers |
| ⬜ Near-white | `#F8FAFC` | Alternating rows |

---

## Architecture: 4 Tabs

| # | Tab | Type | Purpose |
|---|-----|------|---------|
| 1 | 📊 Pipeline | formula | Dashboard: status counts + alerts |
| 2 | ⚙️ Settings | manual | 15 SKUs + 5 FBA locations |
| 3 | 🏭 Production | mixed | Cycle 1: Supplier milestones |
| 4 | 🚢 Shipments | mixed | Cycle 2 (Forwarder) + Cycle 3 (FBA) |

---

## Three Cycles

### Cycle 1 — Supplier (🏭 Production tab)

```
Production Start (Init Payment) → Goods Ready → Inspected → Pickup Agreed
```

Tracked as milestone dates. Status dropdown drives Pipeline dashboard.

### Cycle 2 — Forwarder China (🚢 Shipments tab, cols E–H)

```
Pickup from Factory → Arrived FW WH → Labels Applied → Dispatched to FBA
```

### Cycle 3 — FBA (🚢 Shipments tab, cols I–U)

```
FBA Shipment Created → In Transit → Delivery Window Check →
(Window Correction if needed) → Delivered → Check-In →
Receiving → Closed → Reconciled → FBA Stock Received (units)
```

---

## Tab Columns

### ⚙️ Settings

**Section 1: SKU Master List** (rows 4–18, 15 SKUs)

| Col | Field |
|-----|-------|
| A | SKU ID |
| B | Product Name |
| C | Category |
| D | Supplier |
| E | Notes |

**Section 2: FBA Locations** (rows 22–26, 5 locations)

| Col | Field |
|-----|-------|
| A | Location Code |
| B | Warehouse / Carrier |
| C | State |

---

### 🏭 Production (100 data rows, starting row 3)

| Col | Field | Type |
|-----|-------|------|
| A | PO # | 🟡 manual |
| B | SKU | 🟡 dropdown → Settings A4:A18 |
| C | Product Name | 🔵 VLOOKUP from Settings |
| D | Supplier | 🔵 VLOOKUP from Settings |
| E | Qty Ordered | 🟡 manual |
| F | Production Start Date | 🟡 manual date (= Init Payment date) |
| G | Init Payment $ | 🟡 manual |
| H | Goods Ready Date | 🟡 manual date |
| I | Inspection Date | 🟡 manual date |
| J | Inspection Result | 🟡 dropdown: Pending / Pass / Fail / Re-inspection |
| K | Pickup Agreed Date | 🟡 manual date |
| L | Status | 🟡 dropdown (see Production Statuses) |
| M | Linked Shipment ID | 🟡 manual |
| N | Days Open | 🔵 formula = TODAY() − F (stops at Picked Up/Cancelled) |
| O | Notes | 🟡 manual |

**Production Statuses:**
`In Production` → `Goods Ready` → `Inspected` → `Pickup Agreed` → `Picked Up` → `Cancelled`

**Conditional formatting (col L):**
| Status | Background |
|--------|-----------|
| In Production | 🟡 yellow |
| Goods Ready | 🟠 orange |
| Inspected | 🟢 green |
| Pickup Agreed | 🔵 blue |
| Picked Up | 🟢 dark green |
| Cancelled | ⬜ gray |

---

### 🚢 Shipments (200 data rows, starting row 3)

Row 1 = section banners (Shipment Info / Cycle 2 / Cycle 3 / Status+Notes)
Row 2 = column headers

**Section: Shipment Info (A–D)**

| Col | Field | Type |
|-----|-------|------|
| A | Shipment ID | 🟡 manual |
| B | PO # | 🟡 manual |
| C | FBA Destination | 🟡 dropdown → Settings A22:A26 |
| D | Units | 🟡 manual |

**Section: Cycle 2 — Forwarder China (E–H)**

| Col | Field | Type |
|-----|-------|------|
| E | Pickup from Factory | 🟡 date |
| F | Arrived FW WH | 🟡 date |
| G | Labels Applied | 🟡 date |
| H | Dispatched to FBA | 🟡 date |

**Section: Cycle 3 — FBA (I–U)**

| Col | Field | Type |
|-----|-------|------|
| I | FBA Shipment # | 🟡 manual |
| J | Created in SC | 🟡 date |
| K | In Transit | 🟡 date (auto-filled = H when H entered) |
| L | Delivery Window Start | 🟡 date |
| M | Delivery Window End | 🟡 date |
| N | Window Corrected? | 🟡 checkbox |
| O | New Window End | 🟡 date |
| P | Delivered | 🟡 date |
| Q | Check-In | 🟡 date |
| R | Receiving | 🟡 date |
| S | Closed | 🟡 date |
| T | Reconciled | 🟡 date |
| U | FBA Stock Received (units) | 🟡 manual — actual units after reconcile |

**Status + Notes (V–W)**

| Col | Field | Type |
|-----|-------|------|
| V | Status | 🟡 dropdown (see Shipment Statuses) |
| W | Notes | 🟡 manual |

**Shipment Statuses:**
`Pending Pickup` → `At Forwarder WH` → `Labels Applied` → `Dispatched` → `In Transit` → `Window Check Needed` → `Delivered` → `Check-In` → `Receiving` → `Closed` → `Reconciled` → `Cancelled`

---

### 📊 Pipeline Dashboard

| Section | Cols | Content |
|---------|------|---------|
| Production Status | A–C | COUNTIF per status + PO list (TEXTJOIN+FILTER) |
| Shipment Status | E–G | COUNTIF per status + Shipment ID list |
| Alert | A–G (row 18–19) | Shipments with "Window Check Needed" status |

---

## Key Automation

### onEdit trigger
When col H (Dispatched to FBA) is filled on 🚢 Shipments → auto-fills col K (In Transit) with the same date if K is empty.

### Days Open (Production)
`=IFERROR(IF(OR(Status="Picked Up", Status="Cancelled", StartDate=""), "", TODAY()-StartDate), "")`
Highlights red when > 90 days.

---

## Startup Sequence

```
1. ⚙️ Settings    → fill 15 SKUs (A4:E18) + 5 FBA locations (A22:C26)
2. 🏭 Production  → add active POs with milestone dates
3. 🚢 Shipments   → add active shipments, fill cycle dates as they happen
4. 📊 Pipeline    → auto-updates, check Window Check Needed alert
```

---

## GCP Project
- Project: **Claude** | Number: **699690525350** | ID: **claude-493620**
- Test user: `eco.stepanenko@gmail.com`

---

*Version: v3. Rebuilt: May 2026. Script: `stylia-pipeline.gs`*
