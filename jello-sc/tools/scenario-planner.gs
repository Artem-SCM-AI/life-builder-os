/**
 * Jello SC — Order Scenario Planner
 * Run createJelloScenarioPlanner() to generate the spreadsheet.
 *
 * INPUTS  : Yellow cells  (#FFF9C4) — user edits freely
 * INPUTS  : Blue cells    (#E3F2FD) — secondary inputs (rates, TBD)
 * OUTPUTS : White cells   — locked formula cells
 *
 * HOW TO USE:
 * 1. Open any Google Sheet
 * 2. Extensions → Apps Script
 * 3. Paste this file, Save
 * 4. Run → createJelloScenarioPlanner
 * 5. Approve permissions → link logged in Execution Log
 */

// ─── REF tab row numbers (column B = value column) ──────────────────────────
var R = {
  JELLO_CTN:       4,   // units/CTN
  JELLO_CBM_CTN:   5,   // CBM/CTN
  JELLO_KG_CTN:    6,   // kg gross/CTN
  JELLO_CBM_UNIT:  7,   // derived
  JELLO_KG_UNIT:   8,   // derived
  MIXER_CTN:      10,
  MIXER_CBM_CTN:  11,
  MIXER_KG_CTN:   12,
  MIXER_CBM_UNIT: 13,
  MIXER_KG_UNIT:  14,
  STRAW_CTN:      16,
  STRAW_CBM_CTN:  17,
  STRAW_KG_CTN:   18,
  STRAW_CBM_UNIT: 19,
  STRAW_KG_UNIT:  20,
  HQ_CBM:         23,   // 40HQ practical CBM
  HQ_KG:          24,   // 40HQ max payload
  LEAD_TIME:      27,   // production lead days
  ETD_BUF:        28,   // ETD buffer days
  TRAIN_DAYS:     29,
  SEA_DAYS:       30,
  JELLO_COST:     33,   // USD EXW
  MIXER_COST:     34,   // USD EXW (TBD)
  STRAW_COST:     35,   // USD EXW (TBD)
  SEA_RATE:       38,   // EUR/CBM (TBD)
  TRAIN_RATE:     39,   // EUR/CBM (TBD)
  DUTY:           42,   // decimal
  DEP_PCT:        45,   // 0.5
  PICK_PCT:       46,   // 0.2
  NET40_PCT:      47,   // 0.3
};

// ─── SCENARIOS tab row numbers ───────────────────────────────────────────────
var S = {
  TITLE:         1,
  UPDATED:       2,
  //
  HDR_INFO:      5,
  SCEN_NAME:     6,
  ORDER_DATE:    7,
  //
  HDR_INPUTS:    9,
  JELLO_QTY:    10,
  MIXER_QTY:    11,
  STRAW_QTY:    12,
  MODE:         13,
  EUR_USD:      14,
  //
  HDR_CTR:      16,
  JELLO_CBM:    17,
  ACC_CBM:      18,
  TOTAL_CBM:    19,
  CTR_A:        20,   // Container A (Jello only)
  CTR_B:        21,   // Container B (mixed)
  UTIL_A:       22,
  WEIGHT:       23,
  WEIGHT_CHK:   24,
  //
  HDR_COST:     26,
  J_USD:        27,
  J_EUR:        28,
  M_USD:        29,
  M_EUR:        30,
  ST_USD:       31,
  ST_EUR:       32,
  TOTAL_COST:   34,
  //
  HDR_CASH:     36,
  DEP_EUR:      37,
  DEP_DATE:     38,
  PICK_EUR:     39,
  PICK_DATE:    40,
  NET_EUR:      41,
  NET_DATE:     42,
  PEAK:         44,
  //
  HDR_FRT:      46,
  RATE_CBM:     47,
  FRT_TOTAL:    48,
  FRT_PER_U:    49,
  //
  HDR_LAND:     51,
  L_PRODUCT:    52,
  L_FREIGHT:    53,
  L_DUTY:       54,
  LANDED:       56,
  PER_UNIT:     57,
  //
  HDR_TL:       59,
  TL_ORDER:     60,
  TL_PROD:      61,
  TL_ETD:       62,
  TL_ETA:       63,
  TL_DAYS:      64,
  //
  HDR_FCST:     66,   // FORECAST CONTEXT
  FC_STOCK:     67,   // current Jello stock (yellow input)
  FC_SALES:     68,   // daily sales rate (yellow input)
  FC_DAYS:      69,   // days of stock remaining
  FC_STKO:      70,   // projected stockout date
  FC_ETA_STK:   71,   // stock remaining on ETA
  FC_POST:      72,   // total stock post-delivery
  FC_COVER:     73,   // coverage days post-delivery
  FC_REORD:     74,   // next reorder needed by
  FC_RISK:      75,   // stockout risk flag
  //
  HDR_OPCF:     77,   // OPERATIONAL CASHFLOW
  OC_D_CUM:     78,   // T+0   deposit (cumulative out)
  OC_D_DT:      79,
  OC_P_CUM:     80,   // T+42  after pickup
  OC_P_DT:      81,
  OC_N_CUM:     82,   // T+82  after net40
  OC_N_DT:      83,
  OC_F_CUM:     84,   // T+ETA after freight
  OC_F_DT:      85,
  OC_TOTAL:     87,   // total cash commitment
  OC_PEAK:      88,   // = OC_TOTAL (cleaner label)
  OC_PER_U:     89,   // cash per Jello unit committed
  //
  HDR_COMP:     91,   // COMPARISON
  VS_BASE:      92,   // landed cost vs Conservative (%)
};

// ─── COLORS ──────────────────────────────────────────────────────────────────
var C = {
  HDR:       "#263238",  // section header bg
  HDR_TXT:   "#FFFFFF",
  INPUT_YEL: "#FFF9C4",  // primary inputs
  INPUT_BLU: "#E3F2FD",  // secondary inputs (rates, TBD)
  FORMULA:   "#FAFAFA",  // locked formula cells
  KEY_ROW:   "#ECEFF1",  // total / key output rows
  GREEN:     "#E8F5E9",
  YELLOW:    "#FFF9C4",
  RED:       "#FFEBEE",
};

// ════════════════════════════════════════════════════════════════════════════
// ENTRY POINT
// ════════════════════════════════════════════════════════════════════════════
function createJelloScenarioPlanner() {
  var ss = SpreadsheetApp.create("Jello SC — Order Scenario Planner");

  var scenSheet = ss.getSheets()[0];
  scenSheet.setName("SCENARIOS");
  var refSheet = ss.insertSheet("REF");

  buildRefTab(refSheet);
  buildScenariosTab(scenSheet, ss);

  ss.setActiveSheet(scenSheet);

  var url = ss.getUrl();
  Logger.log("✅ Created: " + url);
  SpreadsheetApp.getUi().alert("✅ Done!\n\nOpen your new planner:\n" + url);
}

// ════════════════════════════════════════════════════════════════════════════
// REF TAB
// ════════════════════════════════════════════════════════════════════════════
function buildRefTab(s) {
  s.clearContents();
  s.setColumnWidth(1, 290);
  s.setColumnWidth(2, 140);
  s.setColumnWidth(3, 260);

  // [label, value_or_formula, source, row_type]
  // row_type: "h"=section header, "d"=derived, "tbd"=TBD input, "val"=static value
  var rows = [
    ["JELLO SC — REFERENCE CONSTANTS", null, null, "title"],             // 1
    ["Parameter", "Value", "Source", "h"],                                // 2
    ["── CARTON SPECS ──────────────────────", null, null, "sub"],        // 3
    ["Jello: units / CTN",   120,    "Delivery Order Jun 16", "val"],     // 4
    ["Jello: CBM / CTN",     0.0816, "34 CBM / 417 CTN",      "val"],     // 5
    ["Jello: kg gross / CTN",11.85,  "4942 kg / 417 CTN",     "val"],     // 6
    ["Jello: CBM / unit",   "=B5/B4","derived",                "d"],      // 7
    ["Jello: kg gross / unit","=B6/B4","derived",              "d"],      // 8
    [null, null, null, "empty"],                                           // 9
    ["Mixer: units / CTN",   300,    "Packing List Chengli",   "val"],    // 10
    ["Mixer: CBM / CTN",     0.0968, "48×48×42 cm",            "val"],    // 11
    ["Mixer: kg gross / CTN",21.0,   "Packing List Chengli",   "val"],    // 12
    ["Mixer: CBM / unit",   "=B11/B10","derived",              "d"],      // 13
    ["Mixer: kg gross / unit","=B12/B10","derived",            "d"],      // 14
    [null, null, null, "empty"],                                           // 15
    ["Straws: units / CTN",  100,    "Packing List Rikang",    "val"],    // 16
    ["Straws: CBM / CTN",    0.0425, "4.93 CBM / 116 CTN",     "val"],    // 17
    ["Straws: kg gross / CTN",8.9,   "1032.4 kg / 116 CTN",    "val"],    // 18
    ["Straws: CBM / unit",  "=B17/B16","derived",              "d"],      // 19
    ["Straws: kg gross / unit","=B18/B16","derived",           "d"],      // 20
    [null, null, null, "empty"],                                           // 21
    ["── CONTAINER ─────────────────────────", null, null, "sub"],        // 22
    ["40HQ practical volume (CBM)", 70,    "92% of 76 CBM gross", "val"], // 23
    ["40HQ max payload (kg)",    26500,    "Standard 40HQ",         "val"],// 24
    [null, null, null, "empty"],                                           // 25
    ["── LEAD TIMES ────────────────────────", null, null, "sub"],        // 26
    ["Production lead time (days)", 42,    "30 working days",       "val"],// 27
    ["ETD buffer — factory to port (days)", 7, "Estimate",           "val"],// 28
    ["Train transit China → DE (days)", 25, "Estimate",              "val"],// 29
    ["Sea transit China → DE (days)",   35, "Estimate",              "val"],// 30
    [null, null, null, "empty"],                                           // 31
    ["── UNIT COSTS (EXW USD) ──────────────", null, null, "sub"],        // 32
    ["Jello unit cost EXW (USD)", 1.25, "Contract Lvmengkang-20260511-1","val"], // 33
    ["Mixer unit cost EXW (USD)", null, "⚠ TBD — ask Ziyao",       "tbd"],// 34
    ["Straw unit cost EXW (USD)", null, "⚠ TBD — ask Ziyao",       "tbd"],// 35
    [null, null, null, "empty"],                                           // 36
    ["── FREIGHT RATES ─────────────────────", null, null, "sub"],        // 37
    ["Sea freight rate (EUR / CBM)",   null, "⚠ TBD — Tab 6 Malcolm","tbd"],// 38
    ["Train freight rate (EUR / CBM)", null, "⚠ TBD — Tab 6 Malcolm","tbd"],// 39
    [null, null, null, "empty"],                                           // 40
    ["── CUSTOMS & TAX ─────────────────────", null, null, "sub"],        // 41
    ["Duty rate DE (food supplement)",  0,  "EU — confirm with broker","val"],// 42
    [null, null, null, "empty"],                                           // 43
    ["── PAYMENT TERMS ─────────────────────", null, null, "sub"],        // 44
    ["Payment: deposit %",     0.5, "Contract Lvmengkang",       "val"],  // 45
    ["Payment: on pickup %",   0.2, "Contract Lvmengkang",       "val"],  // 46
    ["Payment: Net 40 %",      0.3, "Contract Lvmengkang",       "val"],  // 47
  ];

  rows.forEach(function(row, i) {
    var r = i + 1;
    var label = row[0], val = row[1], src = row[2], type = row[3];

    if (label !== null) s.getRange(r, 1).setValue(label);
    if (val !== null) {
      if (typeof val === "string" && val.charAt(0) === "=") {
        s.getRange(r, 2).setFormula(val);
      } else {
        s.getRange(r, 2).setValue(val);
      }
    }
    if (src !== null) s.getRange(r, 3).setValue(src);

    // Row-type formatting
    if (type === "title") {
      s.getRange(r, 1).setFontSize(13).setFontWeight("bold");
    } else if (type === "h") {
      s.getRange(r, 1, 1, 3).setBackground(C.HDR).setFontColor(C.HDR_TXT).setFontWeight("bold");
    } else if (type === "sub") {
      s.getRange(r, 1).setFontColor("#607D8B").setFontStyle("italic");
    } else if (type === "d") {
      s.getRange(r, 1, 1, 3).setBackground(C.FORMULA).setFontColor("#9E9E9E");
    } else if (type === "tbd") {
      s.getRange(r, 2).setBackground(C.INPUT_BLU);
      s.getRange(r, 3).setFontColor("#E65100").setFontWeight("bold");
    }
  });

  // Number formats
  s.getRange("B4").setNumberFormat("0");
  s.getRange("B5:B8").setNumberFormat("0.000000");
  s.getRange("B10").setNumberFormat("0");
  s.getRange("B11:B14").setNumberFormat("0.000000");
  s.getRange("B16").setNumberFormat("0");
  s.getRange("B17:B20").setNumberFormat("0.000000");
  s.getRange("B23:B24").setNumberFormat("#,##0");
  s.getRange("B27:B30").setNumberFormat("0");
  s.getRange("B33").setNumberFormat("$#,##0.00");
  s.getRange("B42").setNumberFormat("0.0%");
  s.getRange("B45:B47").setNumberFormat("0%");

  // Lock non-TBD cells — protect everything except B34, B35, B38, B39
  var protection = s.protect().setDescription("REF — do not edit (except TBD cells)");
  protection.setUnprotectedRanges([
    s.getRange("B34"), s.getRange("B35"),
    s.getRange("B38"), s.getRange("B39"),
  ]);
}

// ════════════════════════════════════════════════════════════════════════════
// SCENARIOS TAB
// ════════════════════════════════════════════════════════════════════════════
function buildScenariosTab(s, ss) {
  s.clearContents();

  // Column widths
  s.setColumnWidth(1, 270);  // A: labels
  s.setColumnWidth(2, 185);  // B: Conservative
  s.setColumnWidth(3, 185);  // C: Base
  s.setColumnWidth(4, 185);  // D: Aggressive

  // ── Column A labels ──────────────────────────────────────────────────────
  var labels = {};
  labels[S.TITLE]      = "JELLO SC — ORDER SCENARIO PLANNER";
  labels[S.UPDATED]    = "Last updated: " + Utilities.formatDate(new Date(), "Europe/Berlin", "dd MMM yyyy");
  labels[S.HDR_INFO]   = "  SCENARIO SETUP";
  labels[S.SCEN_NAME]  = "  Scenario name";
  labels[S.ORDER_DATE] = "  Order date";
  labels[S.HDR_INPUTS] = "  INPUTS";
  labels[S.JELLO_QTY]  = "  Jello qty (units)";
  labels[S.MIXER_QTY]  = "  Mixer qty (units)";
  labels[S.STRAW_QTY]  = "  Straws qty (units)";
  labels[S.MODE]       = "  Shipping mode";
  labels[S.EUR_USD]    = "  EUR / USD rate";
  labels[S.HDR_CTR]    = "  CONTAINER PLAN";
  labels[S.JELLO_CBM]  = "  Jello CBM";
  labels[S.ACC_CBM]    = "  Accessories CBM";
  labels[S.TOTAL_CBM]  = "  Total CBM";
  labels[S.CTR_A]      = "  Container A  (Jello only × 40HQ)";
  labels[S.CTR_B]      = "  Container B  (mixed × 40HQ)";
  labels[S.UTIL_A]     = "  Utilization % — Container A";
  labels[S.WEIGHT]     = "  Total gross weight (kg)";
  labels[S.WEIGHT_CHK] = "  Weight status";
  labels[S.HDR_COST]   = "  PRODUCT COST (EXW)";
  labels[S.J_USD]      = "  Jello EXW (USD)";
  labels[S.J_EUR]      = "  Jello EXW (EUR)";
  labels[S.M_USD]      = "  Mixer EXW (USD)";
  labels[S.M_EUR]      = "  Mixer EXW (EUR)";
  labels[S.ST_USD]     = "  Straws EXW (USD)";
  labels[S.ST_EUR]     = "  Straws EXW (EUR)";
  labels[S.TOTAL_COST] = "▶ TOTAL product cost (EUR)";
  labels[S.HDR_CASH]   = "  CASHFLOW SCHEDULE";
  labels[S.DEP_EUR]    = "  Deposit 50% (EUR)";
  labels[S.DEP_DATE]   = "  Deposit date";
  labels[S.PICK_EUR]   = "  On pickup 20% (EUR)";
  labels[S.PICK_DATE]  = "  Pickup date";
  labels[S.NET_EUR]    = "  Net 40  30% (EUR)";
  labels[S.NET_DATE]   = "  Net 40 date";
  labels[S.PEAK]       = "▶ Peak cash exposure (EUR)";
  labels[S.HDR_FRT]    = "  FREIGHT ESTIMATE";
  labels[S.RATE_CBM]   = "  Rate per CBM (EUR)";
  labels[S.FRT_TOTAL]  = "  Total freight (EUR)";
  labels[S.FRT_PER_U]  = "  Freight per Jello unit (EUR)";
  labels[S.HDR_LAND]   = "  LANDED COST";
  labels[S.L_PRODUCT]  = "  Product EXW (EUR)";
  labels[S.L_FREIGHT]  = "  Freight (EUR)";
  labels[S.L_DUTY]     = "  Duty (EUR)";
  labels[S.LANDED]     = "▶ TOTAL landed (EUR)";
  labels[S.PER_UNIT]   = "▶ Per Jello unit landed (EUR)";
  labels[S.HDR_TL]     = "  DELIVERY TIMELINE";
  labels[S.TL_ORDER]   = "  Order placed";
  labels[S.TL_PROD]    = "  Production ready";
  labels[S.TL_ETD]     = "  ETD (departure from China)";
  labels[S.TL_ETA]     = "  ETA (arrival Germany)";
  labels[S.TL_DAYS]    = "  Days until arrival (from today)";
  // Forecast Context
  labels[S.HDR_FCST]   = "  FORECAST CONTEXT";
  labels[S.FC_STOCK]   = "  Current Jello stock (units)";
  labels[S.FC_SALES]   = "  Current daily sales rate (units/day)";
  labels[S.FC_DAYS]    = "  Days of stock remaining";
  labels[S.FC_STKO]    = "  Projected stockout date";
  labels[S.FC_ETA_STK] = "  Stock remaining on ETA";
  labels[S.FC_POST]    = "  Total stock post-delivery";
  labels[S.FC_COVER]   = "  Coverage days post-delivery";
  labels[S.FC_REORD]   = "  Next reorder needed by";
  labels[S.FC_RISK]    = "  Stockout risk";
  // Operational Cashflow
  labels[S.HDR_OPCF]   = "  OPERATIONAL CASHFLOW";
  labels[S.OC_D_CUM]   = "  T+0     Deposit paid (cumul.)";
  labels[S.OC_D_DT]    = "  Date";
  labels[S.OC_P_CUM]   = "  T+42d   + On pickup (cumul.)";
  labels[S.OC_P_DT]    = "  Date";
  labels[S.OC_N_CUM]   = "  T+82d   + Net 40 (cumul.)";
  labels[S.OC_N_DT]    = "  Date";
  labels[S.OC_F_CUM]   = "  T+ETA   + Freight (total out)";
  labels[S.OC_F_DT]    = "  Freight due (ETA)";
  labels[S.OC_TOTAL]   = "▶ Total cash commitment (EUR)";
  labels[S.OC_PEAK]    = "▶ Peak outflow (EUR)";
  labels[S.OC_PER_U]   = "  Cash per Jello unit committed (EUR)";
  // Comparison
  labels[S.HDR_COMP]   = "  SCENARIO COMPARISON";
  labels[S.VS_BASE]    = "  Landed cost vs Conservative";

  for (var row in labels) {
    s.getRange(parseInt(row), 1).setValue(labels[row]);
  }

  // ── Section header formatting ────────────────────────────────────────────
  var sectionRows = [S.HDR_INFO, S.HDR_INPUTS, S.HDR_CTR, S.HDR_COST,
                     S.HDR_CASH, S.HDR_FRT, S.HDR_LAND, S.HDR_TL,
                     S.HDR_FCST, S.HDR_OPCF, S.HDR_COMP];
  sectionRows.forEach(function(r) {
    s.getRange(r, 1, 1, 4).setBackground(C.HDR).setFontColor(C.HDR_TXT).setFontWeight("bold");
  });

  // Key output rows
  [S.TOTAL_COST, S.PEAK, S.LANDED, S.PER_UNIT,
   S.OC_TOTAL, S.OC_PEAK].forEach(function(r) {
    s.getRange(r, 1, 1, 4).setBackground(C.KEY_ROW).setFontWeight("bold");
  });

  // Title
  s.getRange(S.TITLE, 1).setFontSize(14).setFontWeight("bold");
  s.getRange(S.UPDATED, 1).setFontColor("#9E9E9E").setFontSize(9);

  // ── Build 3 scenario columns ─────────────────────────────────────────────
  var scenarios = [
    { col: 2, letter: "B", name: "CONSERVATIVE",
      jello: 100000, mixer: 0,    straw: 0,     mode: "Train" },
    { col: 3, letter: "C", name: "BASE",
      jello: 100000, mixer: 3500, straw: 20000, mode: "Train" },
    { col: 4, letter: "D", name: "AGGRESSIVE",
      jello: 300000, mixer: 10000,straw: 60000, mode: "Sea"   },
  ];

  // Scenario name headers (row 4)
  var headerColors = ["#1565C0", "#2E7D32", "#E65100"];
  scenarios.forEach(function(sc, i) {
    s.getRange(4, sc.col)
      .setValue(sc.name)
      .setFontWeight("bold")
      .setFontSize(11)
      .setFontColor(headerColors[i])
      .setHorizontalAlignment("center");
  });
  s.getRange(4, 1, 1, 4).setBackground("#ECEFF1");

  scenarios.forEach(function(sc) {
    buildScenarioColumn(s, sc);
  });

  // ── Freeze & finalize ────────────────────────────────────────────────────
  s.setFrozenRows(4);
  s.setFrozenColumns(1);

  // Lock all formula cells (protect sheet, unprotect input cells)
  lockScenarioSheet(s, scenarios);
}

// ════════════════════════════════════════════════════════════════════════════
// BUILD ONE SCENARIO COLUMN
// ════════════════════════════════════════════════════════════════════════════
function buildScenarioColumn(s, sc) {
  var col   = sc.col;
  var cl    = sc.letter;   // column letter: B, C, or D
  var today = new Date();

  // ── Helper: set formula, replacing COL with actual column letter ──
  function f(row, formula) {
    s.getRange(row, col).setFormula(formula.replace(/COL/g, cl));
  }

  // ── Default input values ──────────────────────────────────────────────────
  s.getRange(S.SCEN_NAME,  col).setValue(sc.name);
  s.getRange(S.ORDER_DATE, col).setValue(today).setNumberFormat("DD MMM YYYY");
  s.getRange(S.JELLO_QTY,  col).setValue(sc.jello).setNumberFormat("#,##0");
  s.getRange(S.MIXER_QTY,  col).setValue(sc.mixer).setNumberFormat("#,##0");
  s.getRange(S.STRAW_QTY,  col).setValue(sc.straw).setNumberFormat("#,##0");
  s.getRange(S.MODE,       col).setValue(sc.mode);
  s.getRange(S.EUR_USD,    col).setValue(1.08).setNumberFormat("0.00");

  // Dropdown: Sea / Train
  var modeVal = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Train", "Sea"], true)
    .setAllowInvalid(false).build();
  s.getRange(S.MODE, col).setDataValidation(modeVal);

  // Yellow for primary inputs
  [S.SCEN_NAME, S.ORDER_DATE, S.JELLO_QTY, S.MIXER_QTY, S.STRAW_QTY,
   S.MODE, S.EUR_USD].forEach(function(r) {
    s.getRange(r, col).setBackground(C.INPUT_YEL);
  });

  // ── Container Plan ────────────────────────────────────────────────────────
  f(S.JELLO_CBM,  "=COL"+S.JELLO_QTY+"*REF!$B$"+R.JELLO_CBM_UNIT);
  f(S.ACC_CBM,    "=COL"+S.MIXER_QTY+"*REF!$B$"+R.MIXER_CBM_UNIT+"+COL"+S.STRAW_QTY+"*REF!$B$"+R.STRAW_CBM_UNIT);
  f(S.TOTAL_CBM,  "=COL"+S.JELLO_CBM+"+COL"+S.ACC_CBM);
  f(S.CTR_A,      "=CEILING(COL"+S.JELLO_CBM+"/REF!$B$"+R.HQ_CBM+",1)");
  f(S.CTR_B,      "=CEILING(COL"+S.TOTAL_CBM+"/REF!$B$"+R.HQ_CBM+",1)");
  f(S.UTIL_A,     "=IF(COL"+S.CTR_A+">0,COL"+S.JELLO_CBM+"/(COL"+S.CTR_A+"*REF!$B$"+R.HQ_CBM+"),0)");
  f(S.WEIGHT,     "=COL"+S.JELLO_QTY+"*REF!$B$"+R.JELLO_KG_UNIT+"+COL"+S.MIXER_QTY+"*REF!$B$"+R.MIXER_KG_UNIT+"+COL"+S.STRAW_QTY+"*REF!$B$"+R.STRAW_KG_UNIT);
  f(S.WEIGHT_CHK, "=IF(COL"+S.CTR_A+">0,IF(COL"+S.WEIGHT+"/COL"+S.CTR_A+">REF!$B$"+R.HQ_KG+",\"CHECK WEIGHT\",\"OK\"),\"\")");

  // ── Product Cost ──────────────────────────────────────────────────────────
  f(S.J_USD, "=COL"+S.JELLO_QTY+"*REF!$B$"+R.JELLO_COST);
  f(S.J_EUR, "=COL"+S.J_USD+"/COL"+S.EUR_USD);
  f(S.M_USD, "=IF(COL"+S.MIXER_QTY+"=0,0,IF(REF!$B$"+R.MIXER_COST+"<>\"\",COL"+S.MIXER_QTY+"*REF!$B$"+R.MIXER_COST+",\"TBD\"))");
  f(S.M_EUR, "=IF(ISNUMBER(COL"+S.M_USD+"),COL"+S.M_USD+"/COL"+S.EUR_USD+",\"\")");
  f(S.ST_USD,"=IF(COL"+S.STRAW_QTY+"=0,0,IF(REF!$B$"+R.STRAW_COST+"<>\"\",COL"+S.STRAW_QTY+"*REF!$B$"+R.STRAW_COST+",\"TBD\"))");
  f(S.ST_EUR,"=IF(ISNUMBER(COL"+S.ST_USD+"),COL"+S.ST_USD+"/COL"+S.EUR_USD+",\"\")");
  f(S.TOTAL_COST,"=COL"+S.J_EUR+"+IF(ISNUMBER(COL"+S.M_EUR+"),COL"+S.M_EUR+",0)+IF(ISNUMBER(COL"+S.ST_EUR+"),COL"+S.ST_EUR+",0)");

  // ── Cashflow ──────────────────────────────────────────────────────────────
  f(S.DEP_EUR,  "=COL"+S.TOTAL_COST+"*REF!$B$"+R.DEP_PCT);
  f(S.DEP_DATE, "=COL"+S.ORDER_DATE);
  f(S.PICK_EUR, "=COL"+S.TOTAL_COST+"*REF!$B$"+R.PICK_PCT);
  f(S.PICK_DATE,"=IF(ISNUMBER(COL"+S.ORDER_DATE+"),COL"+S.ORDER_DATE+"+REF!$B$"+R.LEAD_TIME+",\"\")");
  f(S.NET_EUR,  "=COL"+S.TOTAL_COST+"*REF!$B$"+R.NET40_PCT);
  f(S.NET_DATE, "=IF(ISNUMBER(COL"+S.PICK_DATE+"),COL"+S.PICK_DATE+"+40,\"\")");
  f(S.PEAK,     "=COL"+S.DEP_EUR);

  // ── Freight ───────────────────────────────────────────────────────────────
  f(S.RATE_CBM, "=IF(COL"+S.MODE+"=\"Train\",IF(REF!$B$"+R.TRAIN_RATE+"<>\"\",REF!$B$"+R.TRAIN_RATE+",\"\"),IF(REF!$B$"+R.SEA_RATE+"<>\"\",REF!$B$"+R.SEA_RATE+",\"\"))");
  f(S.FRT_TOTAL,"=IF(ISNUMBER(COL"+S.RATE_CBM+"),COL"+S.TOTAL_CBM+"*COL"+S.RATE_CBM+",\"TBD\")");
  f(S.FRT_PER_U,"=IF(AND(ISNUMBER(COL"+S.FRT_TOTAL+"),COL"+S.JELLO_QTY+">0),COL"+S.FRT_TOTAL+"/COL"+S.JELLO_QTY+",\"\")");

  // ── Landed Cost ───────────────────────────────────────────────────────────
  f(S.L_PRODUCT,"=COL"+S.TOTAL_COST);
  f(S.L_FREIGHT,"=IF(ISNUMBER(COL"+S.FRT_TOTAL+"),COL"+S.FRT_TOTAL+",\"TBD\")");
  f(S.L_DUTY,   "=IF(AND(ISNUMBER(COL"+S.L_PRODUCT+"),ISNUMBER(COL"+S.L_FREIGHT+")),(COL"+S.L_PRODUCT+"+COL"+S.L_FREIGHT+")*REF!$B$"+R.DUTY+",\"\")");
  f(S.LANDED,   "=IFERROR(COL"+S.L_PRODUCT+"+IF(ISNUMBER(COL"+S.L_FREIGHT+"),COL"+S.L_FREIGHT+",0)+IF(ISNUMBER(COL"+S.L_DUTY+"),COL"+S.L_DUTY+",0),\"TBD\")");
  f(S.PER_UNIT, "=IF(AND(ISNUMBER(COL"+S.LANDED+"),COL"+S.JELLO_QTY+">0),COL"+S.LANDED+"/COL"+S.JELLO_QTY+",\"\")");

  // ── Delivery Timeline ─────────────────────────────────────────────────────
  f(S.TL_ORDER,"=COL"+S.ORDER_DATE);
  f(S.TL_PROD, "=IF(ISNUMBER(COL"+S.ORDER_DATE+"),COL"+S.ORDER_DATE+"+REF!$B$"+R.LEAD_TIME+",\"\")");
  f(S.TL_ETD,  "=IF(ISNUMBER(COL"+S.TL_PROD+"),COL"+S.TL_PROD+"+REF!$B$"+R.ETD_BUF+",\"\")");
  f(S.TL_ETA,  "=IF(ISNUMBER(COL"+S.TL_ETD+"),COL"+S.TL_ETD+"+IF(COL"+S.MODE+"=\"Train\",REF!$B$"+R.TRAIN_DAYS+",REF!$B$"+R.SEA_DAYS+"),\"\")");
  f(S.TL_DAYS, "=IF(ISNUMBER(COL"+S.TL_ETA+"),MAX(0,ROUND(COL"+S.TL_ETA+"-TODAY(),0)),\"\")");

  // ── Forecast Context ──────────────────────────────────────────────────────
  // Inputs: FC_STOCK and FC_SALES are yellow — defaults from today's forecast model
  s.getRange(S.FC_STOCK, col).setValue(9900).setNumberFormat("#,##0").setBackground(C.INPUT_YEL);
  s.getRange(S.FC_SALES, col).setValue(1944).setNumberFormat("#,##0").setBackground(C.INPUT_YEL);

  f(S.FC_DAYS,    "=IF(COL"+S.FC_SALES+">0,ROUND(COL"+S.FC_STOCK+"/COL"+S.FC_SALES+",1),\"\")");
  f(S.FC_STKO,    "=IF(ISNUMBER(COL"+S.FC_DAYS+"),TODAY()+COL"+S.FC_DAYS+",\"\")");
  f(S.FC_ETA_STK, "=IF(ISNUMBER(COL"+S.TL_ETA+"),MAX(0,COL"+S.FC_STOCK+"-(COL"+S.TL_ETA+"-TODAY())*COL"+S.FC_SALES+"),\"\")");
  f(S.FC_POST,    "=IF(ISNUMBER(COL"+S.FC_ETA_STK+"),COL"+S.FC_ETA_STK+"+COL"+S.JELLO_QTY+",\"\")");
  f(S.FC_COVER,   "=IF(AND(ISNUMBER(COL"+S.FC_POST+"),COL"+S.FC_SALES+">0),ROUND(COL"+S.FC_POST+"/COL"+S.FC_SALES+",0),\"\")");
  f(S.FC_REORD,   "=IF(ISNUMBER(COL"+S.TL_ETA+"),COL"+S.TL_ETA+"+COL"+S.FC_COVER+"-(REF!$B$"+R.LEAD_TIME+"+REF!$B$"+R.ETD_BUF+"+REF!$B$"+R.TRAIN_DAYS+"),\"\")");
  f(S.FC_RISK,    "=IF(ISNUMBER(COL"+S.FC_STKO+"),IF(COL"+S.FC_STKO+"<COL"+S.TL_ETA+",\"STOCKOUT RISK\",\"OK — covered\"),\"\")");

  // ── Operational Cashflow (cumulative view) ────────────────────────────────
  f(S.OC_D_CUM,  "=COL"+S.DEP_EUR);
  f(S.OC_D_DT,   "=COL"+S.DEP_DATE);
  f(S.OC_P_CUM,  "=COL"+S.OC_D_CUM+"+COL"+S.PICK_EUR);
  f(S.OC_P_DT,   "=COL"+S.PICK_DATE);
  f(S.OC_N_CUM,  "=COL"+S.OC_P_CUM+"+COL"+S.NET_EUR);
  f(S.OC_N_DT,   "=COL"+S.NET_DATE);
  f(S.OC_F_CUM,  "=COL"+S.OC_N_CUM+"+IF(ISNUMBER(COL"+S.FRT_TOTAL+"),COL"+S.FRT_TOTAL+",0)");
  f(S.OC_F_DT,   "=COL"+S.TL_ETA);   // freight due on arrival
  f(S.OC_TOTAL,  "=COL"+S.LANDED);
  f(S.OC_PEAK,   "=COL"+S.OC_F_CUM);
  f(S.OC_PER_U,  "=IF(COL"+S.JELLO_QTY+">0,COL"+S.OC_PEAK+"/COL"+S.JELLO_QTY+",\"\")");

  // ── Comparison vs Conservative (col B = baseline) ─────────────────────────
  if (col === 2) {
    // Conservative is the baseline
    s.getRange(S.VS_BASE, col).setValue("baseline").setHorizontalAlignment("center").setFontColor("#9E9E9E");
  } else {
    f(S.VS_BASE, "=IF(AND(ISNUMBER(COL"+S.PER_UNIT+"),ISNUMBER($B$"+S.PER_UNIT+")),COL"+S.PER_UNIT+"/$B$"+S.PER_UNIT+"-1,\"\")");
    s.getRange(S.VS_BASE, col).setNumberFormat("+0.0%;-0.0%;0%");
  }

  // ── Number formats ────────────────────────────────────────────────────────
  [S.JELLO_CBM, S.ACC_CBM, S.TOTAL_CBM].forEach(function(r) {
    s.getRange(r, col).setNumberFormat("0.0");
  });
  [S.CTR_A, S.CTR_B].forEach(function(r) {
    s.getRange(r, col).setNumberFormat("0");
  });
  s.getRange(S.UTIL_A,  col).setNumberFormat("0.0%");
  s.getRange(S.WEIGHT,  col).setNumberFormat("#,##0");

  var eurRows = [S.J_EUR, S.M_EUR, S.ST_EUR, S.TOTAL_COST,
                 S.DEP_EUR, S.PICK_EUR, S.NET_EUR, S.PEAK,
                 S.FRT_TOTAL, S.FRT_PER_U,
                 S.L_PRODUCT, S.L_FREIGHT, S.L_DUTY, S.LANDED, S.PER_UNIT];
  eurRows.forEach(function(r) {
    s.getRange(r, col).setNumberFormat("€#,##0");
  });

  var usdRows = [S.J_USD, S.M_USD, S.ST_USD];
  usdRows.forEach(function(r) {
    s.getRange(r, col).setNumberFormat("$#,##0");
  });

  var dateRows = [S.DEP_DATE, S.PICK_DATE, S.NET_DATE,
                  S.TL_ORDER, S.TL_PROD, S.TL_ETD, S.TL_ETA];
  dateRows.forEach(function(r) {
    s.getRange(r, col).setNumberFormat("DD MMM YYYY");
  });

  s.getRange(S.TL_DAYS, col).setNumberFormat("0 \"days\"");
  s.getRange(S.RATE_CBM, col).setNumberFormat("€#,##0.00");

  // Forecast Context formats
  s.getRange(S.FC_DAYS,    col).setNumberFormat("0.0 \"days\"");
  s.getRange(S.FC_STKO,    col).setNumberFormat("DD MMM YYYY");
  s.getRange(S.FC_ETA_STK, col).setNumberFormat("#,##0");
  s.getRange(S.FC_POST,    col).setNumberFormat("#,##0");
  s.getRange(S.FC_COVER,   col).setNumberFormat("0 \"days\"");
  s.getRange(S.FC_REORD,   col).setNumberFormat("DD MMM YYYY");

  // Operational Cashflow formats
  [S.OC_D_CUM, S.OC_P_CUM, S.OC_N_CUM, S.OC_F_CUM, S.OC_TOTAL, S.OC_PEAK].forEach(function(r) {
    s.getRange(r, col).setNumberFormat("€#,##0");
  });
  [S.OC_D_DT, S.OC_P_DT, S.OC_N_DT, S.OC_F_DT].forEach(function(r) {
    s.getRange(r, col).setNumberFormat("DD MMM YYYY");
  });
  s.getRange(S.OC_PER_U, col).setNumberFormat("€#,##0.00");

  // ── Conditional formatting ────────────────────────────────────────────────
  var rules = s.getConditionalFormatRules();

  // Utilization: green 85-100%, yellow 70-84%, red <70%
  var utilR = s.getRange(S.UTIL_A, col);
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(0.85, 1.0).setBackground(C.GREEN).setRanges([utilR]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(0.70, 0.849).setBackground(C.YELLOW).setRanges([utilR]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(0.70).setBackground(C.RED).setRanges([utilR]).build());

  // Weight check: red if "CHECK", green if "OK"
  var wR = s.getRange(S.WEIGHT_CHK, col);
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("CHECK").setBackground(C.RED).setFontColor("#C62828").setRanges([wR]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("OK").setBackground(C.GREEN).setFontColor("#2E7D32").setRanges([wR]).build());

  // Days until arrival: red if <14
  var dR = s.getRange(S.TL_DAYS, col);
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(14).setBackground(C.RED).setFontColor("#C62828").setRanges([dR]).build());

  // Stockout risk flag
  var riskR = s.getRange(S.FC_RISK, col);
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("STOCKOUT").setBackground(C.RED).setFontColor("#C62828").setRanges([riskR]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("OK").setBackground(C.GREEN).setFontColor("#2E7D32").setRanges([riskR]).build());

  // Peak cash outflow: amber highlight to draw attention
  var peakR = s.getRange(S.OC_PEAK, col);
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThan(0).setBackground("#FFF3E0").setFontColor("#E65100").setRanges([peakR]).build());

  s.setConditionalFormatRules(rules);
}

// ════════════════════════════════════════════════════════════════════════════
// SHEET PROTECTION — lock formulas, leave inputs editable
// ════════════════════════════════════════════════════════════════════════════
function lockScenarioSheet(s, scenarios) {
  var inputRows = [S.SCEN_NAME, S.ORDER_DATE, S.JELLO_QTY,
                   S.MIXER_QTY, S.STRAW_QTY, S.MODE, S.EUR_USD,
                   S.FC_STOCK, S.FC_SALES];

  var freeRanges = [];
  scenarios.forEach(function(sc) {
    inputRows.forEach(function(r) {
      freeRanges.push(s.getRange(r, sc.col));
    });
  });

  var protection = s.protect().setDescription("SCENARIOS — formula cells locked");
  protection.setUnprotectedRanges(freeRanges);
}
