/**
 * Jello SC Ops Dashboard v2 — Formula-Driven
 * Run buildSCDashboard() from Apps Script editor.
 *
 * 🟡 Yellow cells = manual input (batch names, qty, prices, dates, status)
 * ⬜ White cells  = formulas — auto-update when yellow cells change
 * 🎨 Conditional formatting = live color coding on stock health
 *
 * Tabs:
 *   SalesPlan    — daily sales forecast (source of truth for demand)
 *   Inputs       — starting stock, transit times, payment terms (3 tranches)
 *   InboundPlan  — one row per shipment, price per batch, formula columns auto-calc
 *   StockModel   — formula-driven daily stock model, demand pulled from SalesPlan
 *   Cashflow     — payment schedule pulling live from InboundPlan
 */

// ─── STYLE CONSTANTS ─────────────────────────────────────────────────────────
const Y   = "#FFF9C4";   // yellow — user input
const HDR = "#1a1a2e";   // dark header background
const FG  = "#ffffff";   // header text
const BLU = "#e3f2fd";   // light blue — totals / summary rows
const GRY = "#f8f9fa";   // light gray — readonly/note rows

// ─── LAYOUT CONSTANTS ────────────────────────────────────────────────────────
// Inputs tab row positions
const IN = {
  JELLO_STOCK:  5,   // B5  — starting Jello stock
  MIXER_STOCK:  6,   // B6  — starting Mixer stock
  STRAW_STOCK:  7,   // B7  — starting Straw stock
  PHASE_START:  11,  // rows 11-15 — demand phase table (A:phase, B:date, C:J/day, D:M/day, E:S/day)
  SAFETY_DAYS:  18,  // B18 — safety stock target days
  AIR_TRANSIT:  19,  // B19 — air transit days
  TRAIN_TRANSIT:20,  // B20 — train transit days
  SEA_TRANSIT:  21,  // B21 — sea transit days
  PROD_LEAD:    22,  // B22 — production lead time (used in Reorder Point formula)
  PAY1_PCT:     23,  // B23 — payment 1 % (30, on order date — starts production)
  PAY2_PCT:     24,  // B24 — payment 2 % (40, at factory ready)
  PAY2_DAYS:    25,  // B25 — days after order date for payment 2 (30)
  PAY3_PCT:     26,  // B26 — payment 3 % (30, after departure)
  PAY3_DAYS:    27,  // B27 — days after departure for payment 3 (40)
  REORDER_DAYS: 28,  // B28 — reorder when IP drops below this many days
  TARGET_DAYS:  29,  // B29 — target IP days when placing a new order (refill to this level)
  JELLO_MOQ:    30,  // B30 — Jello min order unit: round qty UP to nearest multiple
  MIXER_MOQ:    31,  // B31 — Mixer min order unit
  STRAW_MOQ:    32,  // B32 — Straw min order unit
  ORDER_CYCLE:    33,  // B33 — how often to place orders (drives Target IP)
  RECEIVE_BUFFER:   34,  // B34 — days from Arrive DE to stock available (customs + FF inbound)
  // Row 35 = section header (PRICING & MARGIN) — no data in B35
  JELLO_SELL_EUR:    36,  // B36 — Jello selling price to end customer (EUR/unit, ex-VAT)
  FX_EUR_USD:        37,  // B37 — EUR/USD exchange rate (update monthly)
  JELLO_COST_PROD:   38,  // B38 — Standard production cost ($/unit, Train/Sea orders)
  AIR_FREIGHT_PU:    39,  // B39 — Air freight cost per Jello unit ($)
  TRAIN_FREIGHT_PU:  40,  // B40 — Train freight cost per Jello unit ($)
  SEA_FREIGHT_PU:    41,  // B41 — Sea freight cost per Jello unit ($)
  MIXER_SELL_EUR:    42,  // B42 — Mixer sell price (EUR/unit, ex-VAT)
  MIXER_COST_PROD:   43,  // B43 — Mixer production cost ($/unit)
  MIXER_TRAIN_FREIGHT: 44, // B44 — Mixer train freight ($/unit)
  MIXER_SEA_FREIGHT:   45, // B45 — Mixer sea freight ($/unit)
  STRAW_SELL_EUR:    46,  // B46 — Straw sell price (EUR/unit, ex-VAT)
  STRAW_COST_PROD:   47,  // B47 — Straw production cost ($/unit)
  STRAW_TRAIN_FREIGHT: 48, // B48 — Straw train freight ($/unit)
  STRAW_SEA_FREIGHT:   49, // B49 — Straw sea freight ($/unit)
  // Carton specs from GW invoice — Air: allocate by AirCW; Sea/Train: by CBM
  JELLO_CBM_PU:    58, // B58 — CBM per Jello unit
  JELLO_GW_PU:     59, // B59 — G.W. per Jello unit (kg)
  JELLO_AIRCW_PU:  60, // B60 — Air chargeable weight per Jello unit (kg)
  MIXER_CBM_PU:    61, // B61 — CBM per Mixer unit
  MIXER_GW_PU:     62, // B62 — G.W. per Mixer unit (kg)
  MIXER_AIRCW_PU:  63, // B63 — Air chargeable weight per Mixer unit (kg)
  STRAW_CBM_PU:    64, // B64 — CBM per Straw unit
  STRAW_GW_PU:     65, // B65 — G.W. per Straw unit (kg)
  STRAW_AIRCW_PU:  66, // B66 — Air chargeable weight per Straw unit (kg)
};

// InboundPlan data starts at row 5, ends at row 11 (7 batches)
const IP_DATA_ROW = 5;

// StockModel data starts at row 6
const SM_DATA_ROW = 6;

// ─── ENTRY POINT ─────────────────────────────────────────────────────────────

function buildSCDashboard() {
  const ss = SpreadsheetApp.create("Jello SC Ops — Jun–Dec 2026");

  const tabDash      = ss.insertSheet("Dashboard",    0);
  const tabOrders    = ss.insertSheet("Orders",       1);
  const tabSalesPlan = ss.insertSheet("SalesPlan",    2);
  const tabInputs    = ss.insertSheet("Inputs",       3);
  const tabInbound   = ss.insertSheet("InboundPlan",  4);
  const tabStock     = ss.insertSheet("StockModel",   5);
  const tabCash      = ss.insertSheet("Cashflow",     6);
  const tabActual    = ss.insertSheet("ActualSales",  7);

  const def = ss.getSheetByName("Sheet1");
  if (def) ss.deleteSheet(def);

  buildDashboardTab(tabDash);
  buildOrdersTab(tabOrders);
  buildSalesPlanTab(tabSalesPlan);
  buildInputsTab(tabInputs);
  buildInboundPlanTab(tabInbound);
  buildStockModelTab(tabStock);
  buildCashflowTab(tabCash);
  buildActualSalesTab(tabActual);

  ss.setActiveSheet(tabDash);
  const url = ss.getUrl();
  Logger.log("✅ Dashboard created: " + url);
}

// ─── TAB: DASHBOARD ──────────────────────────────────────────────────────────
//
// First tab — cockpit view. All formula-driven.
// Section 1: Stock at DE warehouse (today) — Jello / Mixer / Straw
// Section 2: Inbound pipeline — all 7 batches with auto-classified stage

function buildDashboardTab(sh) {
  sh.setTabColor("#e53935");
  pageTitle(sh, 1, 8, "📊 JELLO SC — TODAY'S SNAPSHOT");
  note(sh, 2, 8, "Live formulas — auto-refreshes on open. Stock = current DE warehouse. Pipeline = all inbound batches by stage.");

  // ── Stock at DE ──────────────────────────────────────────────────────────
  sectionHeader(sh, 4, 8, "STOCK AT WAREHOUSE DE — today");
  colHeaders(sh, 5, ["SKU", "Units in DE", "Days (DE)", "Days (IP)", "Signal", "Health", "", ""]);

  const skus = [
    { name: "Jello", stockCol: 6,  demandSPCol: 2, daysCol: 9,  ipCol: "E" },  // F=Stock, I=Stk d
    { name: "Mixer", stockCol: 13, demandSPCol: 3, daysCol: 16, ipCol: "F" },  // M=Stock, P=Stk d
    { name: "Straw", stockCol: 20, demandSPCol: 4, daysCol: 23, ipCol: "G" },  // T=Stock, W=Stk d
  ];

  skus.forEach(({ name, stockCol, demandSPCol, daysCol, ipCol }, i) => {
    const row = 6 + i;
    sh.getRange(row, 1).setValue(name).setFontWeight("bold");
    // col 2: Units in DE
    sh.getRange(row, 2)
      .setFormula(`=IFERROR(VLOOKUP(TODAY(),StockModel!$A:$Z,${stockCol},FALSE),"—")`)
      .setNumberFormat("#,##0");
    // col 3: Days cover — DE warehouse only (forward scan from StockModel)
    sh.getRange(row, 3)
      .setFormula(`=IFERROR(VLOOKUP(TODAY(),StockModel!$A:$Z,${daysCol},FALSE),"—")`)
      .setNumberFormat("0");
    // col 4: Days IP — total (DE stock + all inbound) / daily demand
    sh.getRange(row, 4)
      .setFormula(
        `=IFERROR(FLOOR((VLOOKUP(TODAY(),StockModel!$A:$Z,${stockCol},FALSE)` +
        `+SUMIF(InboundPlan!$D:$D,">"&TODAY(),InboundPlan!$${ipCol}:$${ipCol}))` +
        `/VLOOKUP(TODAY(),SalesPlan!$A:$D,${demandSPCol},FALSE),1),"—")`
      ).setNumberFormat("0");
    // col 5: Reorder signal based on IP Days
    sh.getRange(row, 5)
      .setFormula(`=IF(ISNUMBER(D${row}),IF(D${row}<Inputs!$B$${IN.REORDER_DAYS},"🔴 ORDER NOW","✅ OK"),"—")`);
    // col 6: Health based on DE Days
    sh.getRange(row, 6)
      .setFormula(
        `=IF(ISNUMBER(C${row}),` +
          `IF(C${row}<1,"🚨 STOCKOUT",` +
          `IF(C${row}<7,"🔴 CRITICAL",` +
          `IF(C${row}<Inputs!$B$${IN.SAFETY_DAYS},"⚠️ LOW","✅ OK"))),"—")`
      );
    sh.getRange(row, 1, 1, 6).setBackground(GRY);
  });

  const daysCoverDE = sh.getRange("C6:C8");
  const daysCoverIP = sh.getRange("D6:D8");
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(1).setBackground("#dc3545").setFontColor("#ffffff")
      .setRanges([daysCoverDE, daysCoverIP]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(14).setBackground("#f8d7da")
      .setRanges([daysCoverDE, daysCoverIP]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(14, 20).setBackground("#fff3cd")
      .setRanges([daysCoverDE, daysCoverIP]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(21).setBackground("#d4edda")
      .setRanges([daysCoverDE, daysCoverIP]).build(),
  ]);

  // ── Inbound pipeline ──────────────────────────────────────────────────────
  const PIPE_ROWS = 15;
  sectionHeader(sh, 10, 8, `INBOUND PIPELINE — first ${PIPE_ROWS} batches (add more in Orders tab)`);
  colHeaders(sh, 11, ["Batch", "Mode", "Stage", "Jello", "Mixer", "Straw", "ETA (Arrive DE)", "Status"]);

  const pipeBase = ["#e3f2fd","#e8eaf6","#e3f2fd","#e8eaf6","#e8f5e9","#fff8e1","#fce4ec"];
  const pipeColors = Array.from({ length: PIPE_ROWS }, (_, i) => pipeBase[i % pipeBase.length]);

  for (let i = 0; i < PIPE_ROWS; i++) {
    const pr  = IP_DATA_ROW + i;
    const row = 12 + i;

    sh.getRange(row, 1).setFormula(`=IF(InboundPlan!$A$${pr}<>"",InboundPlan!$A$${pr},"")`).setFontWeight("bold");
    sh.getRange(row, 2).setFormula(`=IF(InboundPlan!$A$${pr}<>"",InboundPlan!$B$${pr},"")`);

    // Stage: auto-classify based on Depart CN / Arrive DE / Order Date
    sh.getRange(row, 3).setFormula(
      `=IF(InboundPlan!$A$${pr}="","",` +
        `IF(InboundPlan!$D$${pr}="",` +
          `IF(InboundPlan!$T$${pr}<>"","🏭 Ordered","📋 Not Ordered"),` +
          `IF(InboundPlan!$D$${pr}<TODAY(),"✅ Arrived",` +
            `IF(OR(InboundPlan!$C$${pr}="",InboundPlan!$C$${pr}<=TODAY()),"🚢 In Transit","🏭 Pending Depart"))))`
    );

    sh.getRange(row, 4).setFormula(`=IF(InboundPlan!$E$${pr}>0,InboundPlan!$E$${pr},"")`).setNumberFormat("#,##0");
    sh.getRange(row, 5).setFormula(`=IF(InboundPlan!$F$${pr}>0,InboundPlan!$F$${pr},"")`).setNumberFormat("#,##0");
    sh.getRange(row, 6).setFormula(`=IF(InboundPlan!$G$${pr}>0,InboundPlan!$G$${pr},"")`).setNumberFormat("#,##0");
    sh.getRange(row, 7).setFormula(`=IFERROR(InboundPlan!$D$${pr},"")`).setNumberFormat("DD.MM.YYYY");
    sh.getRange(row, 8).setFormula(`=IFERROR(InboundPlan!$S$${pr},"")`);

    sh.getRange(row, 1, 1, 8).setBackground(pipeColors[i]);
  }

  // Total qty still in pipeline (ETA in the future) — uses full column SUMIF
  const totRow = 12 + PIPE_ROWS;
  const pipeLastDataRow = totRow - 1;
  sh.getRange(totRow, 1, 1, 3).merge().setValue("TOTAL NOT YET ARRIVED").setFontWeight("bold");
  ["D","E","F"].forEach(col => {
    const c = col.charCodeAt(0) - 64;
    sh.getRange(totRow, c)
      .setFormula(`=SUMIF(InboundPlan!$D:$D,">"&TODAY(),InboundPlan!$${col}:$${col})`)
      .setFontWeight("bold").setNumberFormat("#,##0");
  });
  sh.getRange(totRow, 1, 1, 8).setBackground(BLU);

  // ── Reorder signal ────────────────────────────────────────────────────────
  // All row positions are dynamic — derived from totRow so pipeline size can change freely.
  const ipSecRow  = totRow + 2;
  const ipHdrRow  = totRow + 3;
  const ipDataRow = totRow + 4;   // Jello=+4, Mixer=+5, Straw=+6
  const ipNoteRow = totRow + 7;

  sectionHeader(sh, ipSecRow, 8, "INVENTORY POSITION & REORDER SIGNAL  (IP = DE stock + in transit + in production)");
  colHeaders(sh, ipHdrRow, ["SKU", "IP Units", "IP Days", "Signal", "", "", "", ""]);

  const ipSkus = [
    { name: "Jello", smCol: 6,  spCol: 2, ipCol: "E" },  // F=Jello Stock
    { name: "Mixer", smCol: 13, spCol: 3, ipCol: "F" },  // M=Mixer Stock
    { name: "Straw", smCol: 20, spCol: 4, ipCol: "G" },  // T=Straw Stock
  ];
  ipSkus.forEach(({ name, smCol, spCol, ipCol }, i) => {
    const row = ipDataRow + i;
    sh.getRange(row, 1).setValue(name).setFontWeight("bold");
    sh.getRange(row, 2)
      .setFormula(
        `=IFERROR(VLOOKUP(TODAY(),StockModel!$A:$Z,${smCol},FALSE)` +
        `+SUMIF(InboundPlan!$D:$D,">"&TODAY(),InboundPlan!$${ipCol}:$${ipCol}),"—")`
      ).setNumberFormat("#,##0");
    sh.getRange(row, 3)
      .setFormula(`=IFERROR(FLOOR(B${row}/VLOOKUP(TODAY(),SalesPlan!$A:$D,${spCol},FALSE),1),"—")`)
      .setNumberFormat("0");
    sh.getRange(row, 4)
      .setFormula(`=IF(ISNUMBER(C${row}),IF(C${row}<Inputs!$B$${IN.REORDER_DAYS},"🔴 ORDER NOW","✅ OK"),"—")`);
    sh.getRange(row, 1, 1, 4).setBackground(GRY);
  });
  note(sh, ipNoteRow, 8, "Threshold = Inputs!B28 (default 95 days). Target = Inputs!B29 (default 150 days). MOQ = Inputs!B30-32.");

  // ── Order recommendation ──────────────────────────────────────────────────
  const recSecRow  = ipNoteRow + 2;
  const recHdrRow  = recSecRow + 1;
  const recDataRow = recHdrRow + 1;  // Jello=+0, Mixer=+1, Straw=+2
  const recNoteRow = recDataRow + 3;

  sectionHeader(sh, recSecRow, 8, "ORDER RECOMMENDATION — how much to order when signal fires");
  colHeaders(sh, recHdrRow, ["SKU", "IP Days", "Target Days", "Deficit Days", "Rec. Order Qty", "Order By (est.)", "", ""]);

  const recSkus = [
    { name: "Jello", ipRow: ipDataRow,     spCol: 2, moq: IN.JELLO_MOQ },
    { name: "Mixer", ipRow: ipDataRow + 1, spCol: 3, moq: IN.MIXER_MOQ },
    { name: "Straw", ipRow: ipDataRow + 2, spCol: 4, moq: IN.STRAW_MOQ },
  ];
  recSkus.forEach(({ name, ipRow, spCol, moq }, i) => {
    const row = recDataRow + i;
    sh.getRange(row, 1).setValue(name).setFontWeight("bold");
    sh.getRange(row, 2).setFormula(`=C${ipRow}`).setNumberFormat("0");
    sh.getRange(row, 3).setFormula(`=Inputs!$B$${IN.TARGET_DAYS}`).setNumberFormat("0");
    sh.getRange(row, 4).setFormula(`=MAX(0,C${row}-B${row})`).setNumberFormat("0");
    sh.getRange(row, 5)
      .setFormula(
        `=IF(D${row}>0,` +
          `CEILING(D${row}*VLOOKUP(TODAY(),SalesPlan!$A:$D,${spCol},FALSE),Inputs!$B$${moq}),` +
          `"—")`
      ).setNumberFormat("#,##0");
    sh.getRange(row, 6)
      .setFormula(
        `=IF(B${row}<Inputs!$B$${IN.REORDER_DAYS},"🔴 ORDER NOW",` +
          `TEXT(TODAY()+MAX(0,B${row}-Inputs!$B$${IN.REORDER_DAYS}),"DD.MM.YYYY"))`
      );
    sh.getRange(row, 1, 1, 6).setBackground(GRY);
  });
  note(sh, recNoteRow, 8, "Rec. Qty = deficit days × daily demand, rounded UP to MOQ (Inputs B30-32). 'Order By' is an estimate — shifts as new inbound arrives.");

  // ── Supply Coverage Gap ───────────────────────────────────────────────────
  // Answers: "Do I have enough supply for the next 30/60/90 days?"
  // Gap = DE stock now + confirmed inbound arriving in window − planned demand.
  // Positive = surplus going into that window. Negative = stockout risk.
  const gapSecRow  = recNoteRow + 2;
  const gapNoteRow = gapSecRow  + 1;
  const gapHdrRow  = gapNoteRow + 1;
  const gapDataRow = gapHdrRow  + 1;

  sectionHeader(sh, gapSecRow, 8, "SUPPLY COVERAGE GAP — 30 / 60 / 90 days");
  note(sh, gapNoteRow, 8, "Gap = (DE stock today + confirmed inbound arriving in window) − planned demand. Positive = surplus. Negative = stockout risk.");
  colHeaders(sh, gapHdrRow, ["SKU", "Gap 30d", "30d", "Gap 60d", "60d", "Gap 90d", "90d", ""]);

  const gapSkus = [
    { name: "Jello", smCol: 6,  ipCol: "E", spCol: "B", spColN: 2 },  // F=Jello Stock
    { name: "Mixer", smCol: 13, ipCol: "F", spCol: "C", spColN: 3 },  // M=Mixer Stock
    { name: "Straw", smCol: 20, ipCol: "G", spCol: "D", spColN: 4 },  // T=Straw Stock
  ];

  gapSkus.forEach(({ name, smCol, ipCol, spCol, spColN }, i) => {
    const row = gapDataRow + i;
    const stockF   = `IFERROR(VLOOKUP(TODAY(),StockModel!$A:$Z,${smCol},FALSE),0)`;
    const safetyF  = `(Inputs!$B$${IN.SAFETY_DAYS}*IFERROR(VLOOKUP(TODAY(),SalesPlan!$A:$D,${spColN},FALSE),0))`;

    sh.getRange(row, 1).setValue(name).setFontWeight("bold").setBackground(GRY);

    [30, 60, 90].forEach((d, j) => {
      // Inbound: include shipments whose Arrive DE + buffer falls within the window.
      // i.e., Arrive DE between (TODAY() - buffer) and (TODAY() + d - buffer).
      const buf = `Inputs!$B$${IN.RECEIVE_BUFFER}`;
      const inb = `IFERROR(SUMIFS(InboundPlan!$${ipCol}:$${ipCol},InboundPlan!$D:$D,">="&(TODAY()-${buf}),InboundPlan!$D:$D,"<="&(TODAY()+${d}-${buf})),0)`;
      const dem = `IFERROR(SUMIFS(SalesPlan!$${spCol}:$${spCol},SalesPlan!$A:$A,">="&TODAY(),SalesPlan!$A:$A,"<="&(TODAY()+${d})),0)`;
      const gap = `(${stockF}+${inb}-${dem})`;

      sh.getRange(row, 2 + j * 2)
        .setFormula(`=${gap}`)
        .setNumberFormat("+#,##0;[Red]-#,##0;0")
        .setBackground(GRY);
      sh.getRange(row, 3 + j * 2)
        .setFormula(`=IF(${gap}>=0,"✅",IF(${gap}>=-${safetyF},"⚠️","🔴"))`)
        .setHorizontalAlignment("center").setBackground(GRY);
    });
    sh.getRange(row, 8).setBackground(GRY);
  });

  // ── Phase Transition Warning ──────────────────────────────────────────────
  // Demand jumps at each phase boundary. Stock model assumes static daily demand.
  // This section shows how many days of cover exist AT each transition date.
  // If "Days Cover" is red, you must already have stock ordered — not just today.
  const phSecRow  = gapDataRow + 5;
  const phHdrRow  = phSecRow   + 1;
  const phDataRow = phHdrRow   + 1;
  const phNoteRow = phDataRow  + 4;

  sectionHeader(sh, phSecRow, 8, "PHASE TRANSITIONS — demand steps & stock cover on each jump date");
  colHeaders(sh, phHdrRow, ["Phase", "Date", "Days Away", "New Jello/day", "Jump", "Jello Stock on Date", "Days Cover", "Alert"]);

  const transitions = [
    { label: "P1→P2", date: new Date(2026,7,9),  jDem: 3888, jump: "+100%" },
    { label: "P2→P3", date: new Date(2026,7,20), jDem: 5832, jump: "+50%"  },
    { label: "P3→P4", date: new Date(2026,8,20), jDem: 6804, jump: "+17%"  },
    { label: "P4→P5", date: new Date(2026,9,16), jDem: 8748, jump: "+29%"  },
  ];

  const phColors = ["#e8f5e9","#fff8e1","#fce4ec","#e3f2fd"];

  transitions.forEach(({ label, date, jDem, jump }, i) => {
    const row = phDataRow + i;
    sh.getRange(row, 1).setValue(label).setFontWeight("bold");
    sh.getRange(row, 2).setValue(date).setNumberFormat("DD MMM YYYY");
    sh.getRange(row, 3)
      .setFormula(`=IF(B${row}<=TODAY(),"🟢 Active",TEXT(B${row}-TODAY(),"0")&"d")`)
      .setHorizontalAlignment("center");
    sh.getRange(row, 4).setValue(jDem).setNumberFormat("#,##0");
    sh.getRange(row, 5).setValue(jump).setHorizontalAlignment("center");
    // Stock on transition date — pulled directly from StockModel forward model
    sh.getRange(row, 6)
      .setFormula(`=IFERROR(IF(B${row}<=TODAY(),"—",VLOOKUP(B${row},StockModel!$A:$Z,6,FALSE)),"—")`)
      .setNumberFormat("#,##0");
    // Days of cover at that date under the NEW higher demand rate
    sh.getRange(row, 7)
      .setFormula(`=IFERROR(IF(ISNUMBER(F${row}),FLOOR(F${row}/D${row},1),"—"),"—")`)
      .setNumberFormat("0");
    // Alert: is cover sufficient at the moment demand steps up?
    sh.getRange(row, 8)
      .setFormula(
        `=IF(B${row}<=TODAY(),"Active",` +
          `IF(ISNUMBER(G${row}),` +
            `IF(G${row}>=Inputs!$B$${IN.SAFETY_DAYS},"✅",` +
            `IF(G${row}>=7,"⚠️ Watch","🔴 Order Now")),"—"))`
      );
    sh.getRange(row, 1, 1, 8).setBackground(phColors[i]);
  });

  note(sh, phNoteRow, 8,
    `Order lead time = Prod (Inputs B${IN.PROD_LEAD}) + Transit. Train total ≈52d, Sea ≈66d. ` +
    `Red = your StockModel predicts <7 days cover on that date — you need to order NOW or already have.`
  );

  // Extend conditional formatting to include gap columns
  const existingRules = sh.getConditionalFormatRules();
  sh.setConditionalFormatRules([
    ...existingRules,
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(0).setFontColor("#dc3545").setBold(true)
      .setRanges([
        sh.getRange(gapDataRow, 2, 3, 1),
        sh.getRange(gapDataRow, 4, 3, 1),
        sh.getRange(gapDataRow, 6, 3, 1),
      ]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(Infinity).setFontColor("#28a745")
      .setRanges([
        sh.getRange(gapDataRow, 2, 3, 1),
        sh.getRange(gapDataRow, 4, 3, 1),
        sh.getRange(gapDataRow, 6, 3, 1),
      ]).build(),
    // Days Cover at transition: red if <14, yellow if 14-20
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(7).setBackground("#f8d7da")
      .setRanges([sh.getRange(phDataRow, 7, 4, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(7, 20).setBackground("#fff3cd")
      .setRanges([sh.getRange(phDataRow, 7, 4, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(21).setBackground("#d4edda")
      .setRanges([sh.getRange(phDataRow, 7, 4, 1)]).build(),
  ]);

  [70, 90, 165, 90, 120, 130, 120, 165].forEach((w, i) => sh.setColumnWidth(i + 1, w));
  sh.setFrozenRows(2);
}

// ─── TAB: ORDERS ─────────────────────────────────────────────────────────────
//
// Register of new production orders placed with the factory (N-series).
// T-series (from existing 250k factory stock) are tracked in InboundPlan only.
// Add a new row here each time you place a new production order.

// ─── TAB: ORDERS — single source of truth ────────────────────────────────────
//
// One row = one shipment. Columns mirror InboundPlan exactly (22 cols).
// InboundPlan is a formula mirror of this tab — edit here only.
// StockModel and Cashflow read from InboundPlan which reads from here.
//
// Yellow cols (manual): A B C E F G H I J S T U
// Green cols (auto-calc): D K L M N O P Q R V

function buildOrdersTab(sh) {
  sh.setTabColor("#ff6f00");
  const COLS     = 22;
  const DATA_ROW = 5;   // must equal IP_DATA_ROW so InboundPlan mirror is 1:1
  const EMPTY    = 95;  // 5 confirmed + 95 empty = 100 rows total

  const OTIF_COL        = COLS + 1;  // W=23: Actual Arrive DE
  const MARGIN_COL      = COLS + 6;  // AB=28: Gross Margin %
  const CONFIRM_COL      = COLS + 7;  // AC=29: Factory Confirmed (date, manual)
  const CONFIRM_DAYS_COL = COLS + 8;  // AD=30: Confirm Time (d) (formula)
  const LANDED_M_COL     = COLS + 9;  // AE=31: Landed $/unit Mixer (formula)
  const LANDED_S_COL     = COLS + 10; // AF=32: Landed $/unit Straw (formula)
  pageTitle(sh, 1, COLS + 10, "📋 ORDERS — single source of truth. Feeds InboundPlan → StockModel + Cashflow.");
  note(sh, 2, COLS + 9, "🟡 Yellow = enter manually | 🟩 Green = auto-calc | One row = one shipment. Add future orders in empty rows below.");
  note(sh, 3, COLS + 9, "Pay1 30% on Order Date → Pay2 40% at factory ready (+30d) → Pay3 30% after departure (+40d). Arrive DE = Depart CN + transit (from Inputs).");

  colHeaders(sh, 4, [
    "Batch", "Mode", "Depart CN", "Arrive DE",
    "Jello qty", "Mixer qty", "Straw qty",
    "Jello $/unit", "Mixer $/unit", "Straw $/unit",
    "Transit days", "Jello Total $", "Mixer Total $", "Straw Total $",
    "Grand Total $", "Pay1 30%", "Pay2 40%", "Pay3 30%",
    "Status", "Order Date", "Freight €", "Landed $/unit J",
    // OTIF + Margin + Confirmation — not mirrored to InboundPlan
    "Actual Arrive DE", "Actual Jello Qty", "Arrive Δ (days)", "Jello Qty Δ", "OTIF",
    "Gross Margin %",
    "Factory Confirmed", "Confirm Time (d)",
    "Landed $/unit M", "Landed $/unit S",
  ]);

  // [batch, mode, depart, arrive_override, jQ, mQ, sQ, jP, mP, sP, status, orderDate]
  // arrive_override = null → formula (Depart CN + transit)
  const batches = [
    ["Air B1", "Air",   null,                  new Date(2026,5,30), 50000,      0,      0, 1.80, 0.00, 0.00, "✅ Confirmed",       null               ],
    ["T1",     "Train", new Date(2026,5,21),   null,               100000,   4630,  16200, 1.25, 0.80, 0.30, "🚨 Dispatch URGENT", new Date(2026,5,19)],
    ["T2",     "Train", new Date(2026,6, 1),   null,               100000,   4630,  16200, 1.25, 0.80, 0.30, "📦 Dispatch",        new Date(2026,5,25)],
    ["T3",     "Train", new Date(2026,6,12),   null,                50000,   2315,   8100, 1.25, 0.80, 0.30, "📦 Dispatch",        new Date(2026,6, 5)],
    ["N1",     "Train", new Date(2026,6,17),   null,               200000,   9259,  32407, 1.25, 0.80, 0.30, "🏭 In Production",   new Date(2026,5,19)],
  ];

  const lastData = DATA_ROW + batches.length + EMPTY - 1;

  // OTIF helper: Arrive Δ (Y=25), Qty Δ (Z=26), OTIF status (AA=27)
  const setOtifFormulas = (row) => {
    const GRN = "#e8f5e9";
    sh.getRange(row, OTIF_COL + 2)
      .setFormula(`=IFERROR(W${row}-D${row},"—")`).setNumberFormat("0").setBackground(GRN);
    sh.getRange(row, OTIF_COL + 3)
      .setFormula(`=IFERROR(IF(X${row}="","—",X${row}-E${row}),"—")`).setNumberFormat("#,##0").setBackground(GRN);
    sh.getRange(row, OTIF_COL + 4)
      .setFormula(
        `=IF(W${row}="","⏳",` +
          `IF(AND(W${row}<=D${row}+2,OR(X${row}="",X${row}>=E${row}*0.98)),"✅ OTIF",` +
          `IF(AND(W${row}>D${row}+2,NOT(OR(X${row}="",X${row}>=E${row}*0.98))),"🔴 Late+Short",` +
          `IF(W${row}>D${row}+2,"🔴 Late","⚠️ Short"))))`
      ).setBackground(GRN);
  };

  // Freight allocation by mode: Air → Air Chargeable Weight, Sea/Train → CBM
  const mkLanded = (r) => {
    const cwJ  = `Inputs!$B$${IN.JELLO_AIRCW_PU}`;
    const cwM  = `Inputs!$B$${IN.MIXER_AIRCW_PU}`;
    const cwS  = `Inputs!$B$${IN.STRAW_AIRCW_PU}`;
    const cbmJ = `Inputs!$B$${IN.JELLO_CBM_PU}`;
    const cbmM = `Inputs!$B$${IN.MIXER_CBM_PU}`;
    const cbmS = `Inputs!$B$${IN.STRAW_CBM_PU}`;
    const fx   = `Inputs!$B$${IN.FX_EUR_USD}`;
    const tAir = `(E${r}*${cwJ}+F${r}*${cwM}+G${r}*${cwS})`;
    const tCBM = `(E${r}*${cbmJ}+F${r}*${cbmM}+G${r}*${cbmS})`;
    const f = (qty, cAir, cCBM) =>
      `IF(B${r}="Air",U${r}*${qty}*${cAir}/IF(${tAir}=0,1,${tAir}),U${r}*${qty}*${cCBM}/IF(${tCBM}=0,1,${tCBM}))`;
    return {
      J: `=IFERROR(IF(E${r}=0,"—",(L${r}+(${f(`E${r}`, cwJ, cbmJ)})*${fx})/E${r}),"—")`,
      M: `=IFERROR(IF(F${r}=0,"—",(M${r}+(${f(`F${r}`, cwM, cbmM)})*${fx})/F${r}),"—")`,
      S: `=IFERROR(IF(G${r}=0,"—",(N${r}+(${f(`G${r}`, cwS, cbmS)})*${fx})/G${r}),"—")`,
    };
  };

  // helper: write formula columns (same for both confirmed and empty rows)
  const setFormulaCols = (row, hasArriveOverride) => {
    const GRN = "#e8f5e9";
    if (!hasArriveOverride) {
      sh.getRange(row, 4)
        .setFormula(`=IF(C${row}="","",C${row}+SWITCH(B${row},"Air",Inputs!$B$${IN.AIR_TRANSIT},"Train",Inputs!$B$${IN.TRAIN_TRANSIT},"Sea",Inputs!$B$${IN.SEA_TRANSIT},0))`)
        .setNumberFormat("DD.MM.YYYY").setBackground(GRN);
    }
    sh.getRange(row, 11).setFormula(`=IFERROR(D${row}-C${row},"—")`).setNumberFormat("0").setBackground(GRN);
    sh.getRange(row, 12).setFormula(`=IF(E${row}>0,E${row}*H${row},0)`).setNumberFormat("$#,##0").setBackground(GRN);
    sh.getRange(row, 13).setFormula(`=IF(F${row}>0,F${row}*I${row},0)`).setNumberFormat("$#,##0").setBackground(GRN);
    sh.getRange(row, 14).setFormula(`=IF(G${row}>0,G${row}*J${row},0)`).setNumberFormat("$#,##0").setBackground(GRN);
    sh.getRange(row, 15).setFormula(`=L${row}+M${row}+N${row}`).setNumberFormat("$#,##0").setBackground(GRN);
    sh.getRange(row, 16).setFormula(`=O${row}*Inputs!$B$${IN.PAY1_PCT}/100`).setNumberFormat("$#,##0").setBackground(GRN);
    sh.getRange(row, 17).setFormula(`=O${row}*Inputs!$B$${IN.PAY2_PCT}/100`).setNumberFormat("$#,##0").setBackground(GRN);
    sh.getRange(row, 18).setFormula(`=O${row}*Inputs!$B$${IN.PAY3_PCT}/100`).setNumberFormat("$#,##0").setBackground(GRN);
    const lnd = mkLanded(row);
    sh.getRange(row, 22)          .setFormula(lnd.J).setNumberFormat("$0.000").setBackground(GRN);
    sh.getRange(row, LANDED_M_COL).setFormula(lnd.M).setNumberFormat("$0.000").setBackground(GRN);
    sh.getRange(row, LANDED_S_COL).setFormula(lnd.S).setNumberFormat("$0.000").setBackground(GRN);
    const sellUsd = `Inputs!$B$${IN.JELLO_SELL_EUR}*Inputs!$B$${IN.FX_EUR_USD}`;
    sh.getRange(row, MARGIN_COL)
      .setFormula(`=IFERROR(IF(V${row}="","—",1-(V${row}/(${sellUsd}))),"—")`)
      .setNumberFormat("0.0%").setBackground(GRN);
  };

  // Confirmed batches
  batches.forEach((d, i) => {
    const row = DATA_ROW + i;
    const [batch, mode, dept, arr, jQ, mQ, sQ, jP, mP, sP, status, orderDate] = d;

    sh.getRange(row, 1, 1, COLS).setBackground(Y);

    sh.getRange(row, 1).setValue(batch).setFontWeight("bold");
    sh.getRange(row, 2).setValue(mode);
    if (dept)      sh.getRange(row, 3).setValue(dept).setNumberFormat("DD.MM.YYYY");
    if (arr)       sh.getRange(row, 4).setValue(arr).setNumberFormat("DD.MM.YYYY");
    sh.getRange(row, 5).setValue(jQ).setNumberFormat("#,##0");
    sh.getRange(row, 6).setValue(mQ).setNumberFormat("#,##0");
    sh.getRange(row, 7).setValue(sQ).setNumberFormat("#,##0");
    sh.getRange(row, 8).setValue(jP).setNumberFormat("$0.00");
    sh.getRange(row, 9).setValue(mP).setNumberFormat("$0.00");
    sh.getRange(row, 10).setValue(sP).setNumberFormat("$0.00");
    sh.getRange(row, 19).setValue(status);
    if (orderDate) sh.getRange(row, 20).setValue(orderDate).setNumberFormat("DD.MM.YYYY");
    sh.getRange(row, 21).setValue(0).setNumberFormat("€#,##0");

    setFormulaCols(row, !!arr);
    // OTIF cols (W=23, X=24): yellow manual input
    sh.getRange(row, OTIF_COL,     1, 2).setBackground(Y);
    sh.getRange(row, OTIF_COL).setNumberFormat("DD.MM.YYYY");
    sh.getRange(row, OTIF_COL + 1).setNumberFormat("#,##0");
    // Y=25: Arrive Δ, Z=26: Qty Δ, AA=27: OTIF status (auto-calc)
    setOtifFormulas(row);
    // AC=29: Factory Confirmed (yellow, manual); AD=30: Confirm Time (auto-calc)
    sh.getRange(row, CONFIRM_COL).setBackground(Y).setNumberFormat("DD.MM.YYYY");
    sh.getRange(row, CONFIRM_DAYS_COL)
      .setFormula(`=IFERROR(IF(T${row}="","—",IF(AC${row}="","⏳",AC${row}-T${row})),"—")`)
      .setNumberFormat("0").setBackground("#e8f5e9");
  });

  // Empty rows — batch writes to avoid 950 individual API calls
  const emptyStart = DATA_ROW + batches.length;
  sh.getRange(emptyStart, 1, EMPTY, 3).setBackground(Y);
  sh.getRange(emptyStart, 5, EMPTY, 6).setBackground(Y);
  sh.getRange(emptyStart, 19, EMPTY, 3).setBackground(Y);
  sh.getRange(emptyStart, 3,  EMPTY, 1).setNumberFormat("DD.MM.YYYY");
  sh.getRange(emptyStart, 5,  EMPTY, 3).setNumberFormat("#,##0");
  sh.getRange(emptyStart, 8,  EMPTY, 3).setNumberFormat("$0.00");
  sh.getRange(emptyStart, 20, EMPTY, 1).setNumberFormat("DD.MM.YYYY");
  sh.getRange(emptyStart, 21, EMPTY, 1).setNumberFormat("€#,##0");

  const GRN = "#e8f5e9";
  const fArrive=[], fTransit=[], fJT=[], fMT=[], fST=[], fGrand=[], fP1=[], fP2=[], fP3=[], fLandedJ=[], fLandedM=[], fLandedS=[], fMargin=[], fConfirmDays=[];
  const sellUsd = `Inputs!$B$${IN.JELLO_SELL_EUR}*Inputs!$B$${IN.FX_EUR_USD}`;
  for (let i = 0; i < EMPTY; i++) {
    const row = emptyStart + i;
    const lnd = mkLanded(row);
    fArrive      .push([`=IF(C${row}="","",C${row}+SWITCH(B${row},"Air",Inputs!$B$${IN.AIR_TRANSIT},"Train",Inputs!$B$${IN.TRAIN_TRANSIT},"Sea",Inputs!$B$${IN.SEA_TRANSIT},0))`]);
    fTransit     .push([`=IFERROR(D${row}-C${row},"—")`]);
    fJT          .push([`=IF(E${row}>0,E${row}*H${row},0)`]);
    fMT          .push([`=IF(F${row}>0,F${row}*I${row},0)`]);
    fST          .push([`=IF(G${row}>0,G${row}*J${row},0)`]);
    fGrand       .push([`=L${row}+M${row}+N${row}`]);
    fP1          .push([`=O${row}*Inputs!$B$${IN.PAY1_PCT}/100`]);
    fP2          .push([`=O${row}*Inputs!$B$${IN.PAY2_PCT}/100`]);
    fP3          .push([`=O${row}*Inputs!$B$${IN.PAY3_PCT}/100`]);
    fLandedJ     .push([lnd.J]);
    fLandedM     .push([lnd.M]);
    fLandedS     .push([lnd.S]);
    fMargin      .push([`=IFERROR(IF(V${row}="","—",1-(V${row}/(${sellUsd}))),"—")`]);
    fConfirmDays .push([`=IFERROR(IF(T${row}="","—",IF(AC${row}="","⏳",AC${row}-T${row})),"—")`]);
  }
  sh.getRange(emptyStart,  4, EMPTY, 1).setFormulas(fArrive)  .setNumberFormat("DD.MM.YYYY").setBackground(GRN);
  sh.getRange(emptyStart, 11, EMPTY, 1).setFormulas(fTransit) .setNumberFormat("0")          .setBackground(GRN);
  sh.getRange(emptyStart, 12, EMPTY, 1).setFormulas(fJT)      .setNumberFormat("$#,##0")     .setBackground(GRN);
  sh.getRange(emptyStart, 13, EMPTY, 1).setFormulas(fMT)      .setNumberFormat("$#,##0")     .setBackground(GRN);
  sh.getRange(emptyStart, 14, EMPTY, 1).setFormulas(fST)      .setNumberFormat("$#,##0")     .setBackground(GRN);
  sh.getRange(emptyStart, 15, EMPTY, 1).setFormulas(fGrand)   .setNumberFormat("$#,##0")     .setBackground(GRN);
  sh.getRange(emptyStart, 16, EMPTY, 1).setFormulas(fP1)      .setNumberFormat("$#,##0")     .setBackground(GRN);
  sh.getRange(emptyStart, 17, EMPTY, 1).setFormulas(fP2)      .setNumberFormat("$#,##0")     .setBackground(GRN);
  sh.getRange(emptyStart, 18, EMPTY, 1).setFormulas(fP3)      .setNumberFormat("$#,##0")     .setBackground(GRN);
  sh.getRange(emptyStart, 22, EMPTY, 1).setFormulas(fLandedJ) .setNumberFormat("$0.000")     .setBackground(GRN);
  sh.getRange(emptyStart, LANDED_M_COL, EMPTY, 1).setFormulas(fLandedM).setNumberFormat("$0.000").setBackground(GRN);
  sh.getRange(emptyStart, LANDED_S_COL, EMPTY, 1).setFormulas(fLandedS).setNumberFormat("$0.000").setBackground(GRN);

  // OTIF empty rows: yellow for Actual Arrive (W) + Actual Qty (X), formulas for Y-Z-AA
  sh.getRange(emptyStart, OTIF_COL,     EMPTY, 1).setBackground(Y).setNumberFormat("DD.MM.YYYY");
  sh.getRange(emptyStart, OTIF_COL + 1, EMPTY, 1).setBackground(Y).setNumberFormat("#,##0");
  const fArrDelta=[], fQtyDelta=[], fOtif=[];
  for (let i = 0; i < EMPTY; i++) {
    const row = emptyStart + i;
    fArrDelta.push([`=IFERROR(W${row}-D${row},"—")`]);
    fQtyDelta.push([`=IFERROR(IF(X${row}="","—",X${row}-E${row}),"—")`]);
    fOtif.push([
      `=IF(A${row}="","",IF(W${row}="","⏳",` +
        `IF(AND(W${row}<=D${row}+2,OR(X${row}="",X${row}>=E${row}*0.98)),"✅ OTIF",` +
        `IF(AND(W${row}>D${row}+2,NOT(OR(X${row}="",X${row}>=E${row}*0.98))),"🔴 Late+Short",` +
        `IF(W${row}>D${row}+2,"🔴 Late","⚠️ Short")))))`
    ]);
  }
  sh.getRange(emptyStart, OTIF_COL + 2, EMPTY, 1).setFormulas(fArrDelta).setNumberFormat("0").setBackground(GRN);
  sh.getRange(emptyStart, OTIF_COL + 3, EMPTY, 1).setFormulas(fQtyDelta).setNumberFormat("#,##0").setBackground(GRN);
  sh.getRange(emptyStart, OTIF_COL + 4, EMPTY, 1).setFormulas(fOtif).setBackground(GRN);
  sh.getRange(emptyStart, MARGIN_COL,       EMPTY, 1).setFormulas(fMargin)      .setNumberFormat("0.0%").setBackground(GRN);
  sh.getRange(emptyStart, CONFIRM_COL,      EMPTY, 1).setBackground(Y).setNumberFormat("DD.MM.YYYY");
  sh.getRange(emptyStart, CONFIRM_DAYS_COL, EMPTY, 1).setFormulas(fConfirmDays).setNumberFormat("0")   .setBackground(GRN);

  // Totals
  const totRow = lastData + 2;
  sh.getRange(totRow, 1, 1, 4).merge().setValue("TOTAL (all batches)").setFontWeight("bold");
  ["E","F","G","L","M","N","O","P","Q","R","U"].forEach(col => {
    sh.getRange(totRow, col.charCodeAt(0) - 64)
      .setFormula(`=SUM(${col}${DATA_ROW}:${col}${lastData})`)
      .setFontWeight("bold").setNumberFormat("$#,##0");
  });
  sh.getRange(totRow, 5, 1, 3).setNumberFormat("#,##0");
  sh.getRange(totRow, 21).setNumberFormat("€#,##0");  // U = Freight € override
  sh.getRange(totRow, 22)
    .setFormula(`=IFERROR((L${totRow}+U${totRow}*Inputs!$B$${IN.FX_EUR_USD})/E${totRow},"—")`)
    .setFontWeight("bold").setNumberFormat("$0.000");
  sh.getRange(totRow, 1, 1, COLS).setBackground(BLU);

  // Dropdowns
  const totalRows = batches.length + EMPTY;
  sh.getRange(DATA_ROW, 2, totalRows, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(["Air","Train","Sea"], true).setAllowInvalid(false).build()
  );
  sh.getRange(DATA_ROW, 19, totalRows, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(["✅ Confirmed","🚨 Dispatch URGENT","📦 Dispatch","🏭 In Production","✅ QC / Ready","🚢 Shipped","📋 Not Ordered","🔴 Order TODAY","🟡 Order Pending"], true)
      .setAllowInvalid(true).build()
  );

  [95,70,110,110,80,70,70,90,90,90,80,100,90,90,100,100,100,100,140,100,100,120,
   115,110,85,90,90,100,130,90,120,120]
    .forEach((w, i) => sh.setColumnWidth(i + 1, w));

  // Conditional formatting: OTIF (AA=27), Gross Margin % (AB=28), Confirm Time (AD=30)
  const totalDataRows    = batches.length + EMPTY;
  const otifRange        = sh.getRange(DATA_ROW, OTIF_COL + 4,    totalDataRows, 1);
  const marginRange      = sh.getRange(DATA_ROW, MARGIN_COL,       totalDataRows, 1);
  const confirmDaysRange = sh.getRange(DATA_ROW, CONFIRM_DAYS_COL, totalDataRows, 1);
  const otifRules = sh.getConditionalFormatRules();
  sh.setConditionalFormatRules([
    ...otifRules,
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("OTIF").setBackground("#d4edda").setRanges([otifRange]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("Late").setBackground("#f8d7da").setRanges([otifRange]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("Short").setBackground("#fff3cd").setRanges([otifRange]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(0.50).setBackground("#c8e6c9").setRanges([marginRange]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0.40, 0.50).setBackground("#fff9c4").setRanges([marginRange]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(0.40).setBackground("#f8d7da").setRanges([marginRange]).build(),
    // Confirm Time (d): ≤2=fast (green), 3-5=watch (yellow), >5=slow (red)
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThanOrEqualTo(2).setBackground("#c8e6c9").setRanges([confirmDaysRange]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(3, 5).setBackground("#fff9c4").setRanges([confirmDaysRange]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(5).setBackground("#f8d7da").setRanges([confirmDaysRange]).build(),
  ]);

  sh.setFrozenRows(4);
}

// ─── TAB: SALES PLAN ─────────────────────────────────────────────────────────
//
// Source of truth for daily demand. StockModel reads from here via VLOOKUP.
// Yellow cells = editable per day. Override any date to model a promo spike etc.
//
// Columns:
//   A  Date (auto-generated, white — do not edit)
//   B  Jello / day  [YELLOW]
//   C  Mixer / day  [YELLOW]
//   D  Straw / day  [YELLOW]

function buildSalesPlanTab(sh) {
  sh.setTabColor("#4caf50");
  pageTitle(sh, 1, 4, "📅 SALES PLAN — daily demand forecast (source of truth)");
  note(sh, 2, 4, "🟡 Override any cell to change demand for a specific day. StockModel reads this column live via VLOOKUP.");

  sh.getRange(3, 1, 1, 4).setValues([["Date", "Jello / day", "Mixer / day", "Straw / day"]])
    .setBackground(HDR).setFontColor(FG).setFontWeight("bold").setHorizontalAlignment("center");

  const startDate = new Date(2026, 5, 16);
  // 730 days = ~2 years. After P5 scaling, demand stays at P5 rate indefinitely.
  const endDate   = new Date(startDate.getTime() + 730 * 86400000);
  const days      = Math.round((endDate - startDate) / 86400000) + 1;

  const phases = [
    { start: new Date(2026, 5, 16), end: new Date(2026, 7, 8),  j: 1944, m: 90,  s: 315  },
    { start: new Date(2026, 7, 9),  end: new Date(2026, 7, 19), j: 3888, m: 180, s: 630  },
    { start: new Date(2026, 7, 20), end: new Date(2026, 8, 19), j: 5832, m: 270, s: 945  },
    { start: new Date(2026, 8, 20), end: new Date(2026, 9, 15), j: 6804, m: 315, s: 1103 },
    { start: new Date(2026, 9, 16), end: endDate,               j: 8748, m: 405, s: 1418 },
  ];

  function demandForDate(dt) {
    for (const p of phases) {
      if (dt >= p.start && dt <= p.end) return [p.j, p.m, p.s];
    }
    return [phases[phases.length - 1].j, phases[phases.length - 1].m, phases[phases.length - 1].s];
  }

  const dateVals   = [];
  const demandVals = [];
  for (let d = 0; d < days; d++) {
    const dt = new Date(startDate);
    dt.setDate(startDate.getDate() + d);
    dateVals.push([dt]);
    demandVals.push(demandForDate(dt));
  }

  const DATA_ROW = 4;
  sh.getRange(DATA_ROW, 1, days, 1).setValues(dateVals).setNumberFormat("DD.MM.YYYY");
  sh.getRange(DATA_ROW, 2, days, 3).setValues(demandVals).setBackground(Y).setNumberFormat("#,##0");

  [110, 100, 100, 100].forEach((w, i) => sh.setColumnWidth(i + 1, w));
  sh.setFrozenRows(3);
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function pageTitle(sh, row, cols, text) {
  sh.getRange(row, 1, 1, cols).merge().setValue(text)
    .setBackground(HDR).setFontColor(FG)
    .setFontSize(12).setFontWeight("bold").setHorizontalAlignment("center");
}

function sectionHeader(sh, row, cols, text) {
  sh.getRange(row, 1, 1, cols).merge().setValue(text)
    .setBackground("#37474f").setFontColor(FG)
    .setFontWeight("bold");
}

function colHeaders(sh, row, labels) {
  sh.getRange(row, 1, 1, labels.length).setValues([labels])
    .setBackground(HDR).setFontColor(FG)
    .setFontWeight("bold").setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(row, 40);
}

function note(sh, row, cols, text) {
  sh.getRange(row, 1, 1, cols).merge().setValue(text)
    .setBackground(GRY).setFontStyle("italic")
    .setFontColor("#6c757d").setHorizontalAlignment("center");
}

// ─── TAB: INPUTS ─────────────────────────────────────────────────────────────

function buildInputsTab(sh) {
  sh.setTabColor("#1565c0");
  const COLS = 5;

  pageTitle(sh, 1, COLS, "⚙️ INPUTS — edit yellow cells only");
  note(sh, 2, COLS, "🟡 Yellow = you edit freely | Changes here flow automatically to StockModel and Cashflow");

  // ── Starting stock ──────────────────────────────────────────────────────────
  sectionHeader(sh, 4, COLS, "STARTING POSITION  (update daily with live FF Germany stock)");
  [
    ["Jello (units)", -3888, "Negative = backlog (orders pending, no stock)"],
    ["Mixer (units)", -180,  "Negative = backlog"],
    ["Straw (units)", -630,  "Negative = backlog"],
  ].forEach(([lbl, val, hint], i) => {
    const row = IN.JELLO_STOCK + i;
    sh.getRange(row, 1).setValue(lbl).setFontWeight("bold");
    sh.getRange(row, 2).setValue(val).setBackground(Y).setNumberFormat("#,##0");
    sh.getRange(row, 3, 1, 2).merge().setValue(hint).setFontStyle("italic").setFontColor("#6c757d");
  });

  // ── Demand phases ───────────────────────────────────────────────────────────
  sectionHeader(sh, 9, COLS, "DEMAND PHASES  (reference only — SalesPlan tab is the source of truth for StockModel)");
  colHeaders(sh, IN.PHASE_START - 1, ["Phase", "Start Date", "Jello / day", "Mixer / day", "Straw / day"]);

  const phaseData = [
    ["P1", new Date(2026, 5, 16), 1944, 90, 315],
    ["P2", new Date(2026, 7, 9),  3888, 180, 630],
    ["P3", new Date(2026, 7, 20), 5832, 270, 945],
    ["P4", new Date(2026, 8, 20), 6804, 315, 1103],
    ["P5", new Date(2026, 9, 16), 8748, 405, 1418],
  ];
  phaseData.forEach((row, i) => {
    const r = IN.PHASE_START + i;
    sh.getRange(r, 1, 1, 5).setValues([row]).setBackground(GRY);
    sh.getRange(r, 2).setNumberFormat("DD.MM.YYYY");
    sh.getRange(r, 3, 1, 3).setNumberFormat("#,##0");
  });

  // ── Settings ────────────────────────────────────────────────────────────────
  sectionHeader(sh, 17, COLS, "SETTINGS");

  // Manual inputs (yellow) — rows 18–27
  [
    ["Safety stock target (days)",       14, "Alert turns yellow/red below this threshold"],
    ["Air transit CN→DE (days)",          5, "Used to auto-calculate Arrive DE from Depart CN"],
    ["Train transit CN→DE (days)",       24, ""],
    ["Sea transit CN→DE (days)",         38, ""],
    ["Production lead time (days)",      28, "From order date to factory ready-to-ship"],
    ["Payment 1 — % on order date",      30, "Deposit that starts production"],
    ["Payment 2 — % at factory ready",   40, "Paid when goods are finished"],
    ["Payment 2 — days after order",     30, "Adjust if factory confirms different lead time"],
    ["Payment 3 — % after departure",    30, "Balance paid after bulk leaves China"],
    ["Payment 3 — days after departure", 40, "Adjust per agreed payment terms with factory"],
  ].forEach(([lbl, val, hint], i) => {
    const row = IN.SAFETY_DAYS + i;
    sh.getRange(row, 1).setValue(lbl).setFontWeight("bold");
    sh.getRange(row, 2).setValue(val).setBackground(Y).setNumberFormat("0");
    sh.getRange(row, 3, 1, 2).merge().setValue(hint).setFontStyle("italic").setFontColor("#6c757d");
  });

  // Auto-calculated (light green) — rows 28–29
  const GRN = "#e8f5e9";
  [
    [IN.REORDER_DAYS, "Reorder Point  ← auto",
      `=B${IN.PROD_LEAD}+B${IN.SEA_TRANSIT}+B${IN.SAFETY_DAYS}`,
      "= Prod Lead + Sea Transit + Safety. Order when IP drops below this."],
    [IN.TARGET_DAYS, "Target IP  ← auto",
      `=B${IN.REORDER_DAYS}+B${IN.ORDER_CYCLE}`,
      "= Reorder Point + Order Cycle. Fill up to this level each time you order."],
  ].forEach(([row, lbl, formula, hint]) => {
    sh.getRange(row, 1).setValue(lbl).setFontWeight("bold");
    sh.getRange(row, 2).setFormula(formula).setBackground(GRN).setNumberFormat("0");
    sh.getRange(row, 3, 1, 2).merge().setValue(hint).setFontStyle("italic").setFontColor("#6c757d");
  });

  // MOQ + Order Cycle (yellow) — rows 30–33
  [
    [IN.JELLO_MOQ,   "Jello min order unit (MOQ)", 100000, "Round order UP to nearest multiple — 1×40HQ ≈ 100k units"],
    [IN.MIXER_MOQ,   "Mixer min order unit (MOQ)",   5000, "Adjust to factory MOQ"],
    [IN.STRAW_MOQ,   "Straw min order unit (MOQ)",  10000, "Adjust to factory MOQ"],
    [IN.ORDER_CYCLE,    "Order Cycle (days)",                 30, "How often to place orders — drives Target IP calculation"],
    [IN.RECEIVE_BUFFER, "Receiving buffer DE (days)",          3, "Customs + FF inbound delay after Arrive DE. StockModel credits stock this many days after arrival."],
  ].forEach(([row, lbl, val, hint]) => {
    sh.getRange(row, 1).setValue(lbl).setFontWeight("bold");
    sh.getRange(row, 2).setValue(val).setBackground(Y).setNumberFormat("0");
    sh.getRange(row, 3, 1, 2).merge().setValue(hint).setFontStyle("italic").setFontColor("#6c757d");
  });

  // ── Pricing & Margin inputs (yellow) — rows 35–49 ─────────────────────────────
  // Row 35 = section header; PRICING data starts at row 36 (IN.JELLO_SELL_EUR)
  sectionHeader(sh, IN.RECEIVE_BUFFER + 1, COLS, "PRICING & MARGIN  (update when prices change)");

  // Jello pricing (rows 36-41)
  [
    [IN.JELLO_SELL_EUR,   "Jello sell price (EUR/unit, ex-VAT)", 4.99,  "End-customer sell price. Used for margin analysis."],
    [IN.FX_EUR_USD,       "EUR/USD rate",                        1.08,  "Update monthly from ECB. Converts sell price → USD for comparison."],
    [IN.JELLO_COST_PROD,  "Jello production cost ($/unit)",      1.25,  "Standard unit cost from Lvmengkang. Air orders may differ — override in Orders."],
    [IN.AIR_FREIGHT_PU,   "Jello air freight (€/unit)",          0.18,  "GW invoice in EUR. Converted → USD in Landed Cost formula via FX rate."],
    [IN.TRAIN_FREIGHT_PU, "Jello train freight (€/unit)",        0.10,  "GW invoice in EUR."],
    [IN.SEA_FREIGHT_PU,   "Jello sea freight (€/unit)",          0.07,  "GW invoice in EUR."],
  ].forEach(([row, lbl, val, hint]) => {
    sh.getRange(row, 1).setValue(lbl).setFontWeight("bold");
    sh.getRange(row, 2).setValue(val).setBackground(Y);
    sh.getRange(row, 3, 1, 2).merge().setValue(hint).setFontStyle("italic").setFontColor("#6c757d");
  });
  sh.getRange(IN.JELLO_SELL_EUR,   2).setNumberFormat("€0.00");
  sh.getRange(IN.FX_EUR_USD,       2).setNumberFormat("0.000");
  sh.getRange(IN.JELLO_COST_PROD,  2).setNumberFormat("$0.000");
  sh.getRange(IN.AIR_FREIGHT_PU,   2).setNumberFormat("€0.000");
  sh.getRange(IN.TRAIN_FREIGHT_PU, 2).setNumberFormat("€0.000");
  sh.getRange(IN.SEA_FREIGHT_PU,   2).setNumberFormat("€0.000");

  // Mixer pricing (rows 42-45)
  [
    [IN.MIXER_SELL_EUR,      "Mixer sell price (EUR/unit, ex-VAT)", 0.00, "End-customer sell price for Mixer."],
    [IN.MIXER_COST_PROD,     "Mixer production cost ($/unit)",      0.80, "Per-unit cost from factory (confirm with supplier)."],
    [IN.MIXER_TRAIN_FREIGHT, "Mixer train freight (€/unit)",        0.05, "GW invoice in EUR."],
    [IN.MIXER_SEA_FREIGHT,   "Mixer sea freight (€/unit)",          0.03, "GW invoice in EUR."],
  ].forEach(([row, lbl, val, hint]) => {
    sh.getRange(row, 1).setValue(lbl).setFontWeight("bold");
    sh.getRange(row, 2).setValue(val).setBackground(Y);
    sh.getRange(row, 3, 1, 2).merge().setValue(hint).setFontStyle("italic").setFontColor("#6c757d");
  });
  sh.getRange(IN.MIXER_SELL_EUR,      2).setNumberFormat("€0.00");
  sh.getRange(IN.MIXER_COST_PROD,     2).setNumberFormat("$0.000");
  sh.getRange(IN.MIXER_TRAIN_FREIGHT, 2).setNumberFormat("€0.000");
  sh.getRange(IN.MIXER_SEA_FREIGHT,   2).setNumberFormat("€0.000");

  // Straw pricing (rows 46-49)
  [
    [IN.STRAW_SELL_EUR,      "Straw sell price (EUR/unit, ex-VAT)", 0.00, "End-customer sell price for Straw."],
    [IN.STRAW_COST_PROD,     "Straw production cost ($/unit)",      0.30, "Per-unit cost from factory (confirm with supplier)."],
    [IN.STRAW_TRAIN_FREIGHT, "Straw train freight (€/unit)",        0.02, "GW invoice in EUR."],
    [IN.STRAW_SEA_FREIGHT,   "Straw sea freight (€/unit)",          0.01, "GW invoice in EUR."],
  ].forEach(([row, lbl, val, hint]) => {
    sh.getRange(row, 1).setValue(lbl).setFontWeight("bold");
    sh.getRange(row, 2).setValue(val).setBackground(Y);
    sh.getRange(row, 3, 1, 2).merge().setValue(hint).setFontStyle("italic").setFontColor("#6c757d");
  });
  sh.getRange(IN.STRAW_SELL_EUR,      2).setNumberFormat("€0.00");
  sh.getRange(IN.STRAW_COST_PROD,     2).setNumberFormat("$0.000");
  sh.getRange(IN.STRAW_TRAIN_FREIGHT, 2).setNumberFormat("€0.000");
  sh.getRange(IN.STRAW_SEA_FREIGHT,   2).setNumberFormat("€0.000");

  // ── Mode Comparison (auto-calc) — rows 51–56 ─────────────────────────────────
  sectionHeader(sh, 51, COLS, "MODE COMPARISON  (auto-calc — changes when Pricing inputs above change)");
  colHeaders(sh, 52, ["Mode", "Landed $/unit J", "Sell Price (USD)", "Gross Margin %", "vs Sea Mode Δ"]);

  const sellUsd = `B${IN.JELLO_SELL_EUR}*B${IN.FX_EUR_USD}`;
  [
    ["Air",   `B${IN.JELLO_COST_PROD}+B${IN.AIR_FREIGHT_PU}*B${IN.FX_EUR_USD}`  ],
    ["Train", `B${IN.JELLO_COST_PROD}+B${IN.TRAIN_FREIGHT_PU}*B${IN.FX_EUR_USD}`],
    ["Sea",   `B${IN.JELLO_COST_PROD}+B${IN.SEA_FREIGHT_PU}*B${IN.FX_EUR_USD}`  ],
  ].forEach(([mode, landedF], i) => {
    const row    = 53 + i;
    const seaRow = 55;
    sh.getRange(row, 1).setValue(mode).setFontWeight("bold").setBackground(GRY);
    sh.getRange(row, 2).setFormula(`=${landedF}`).setNumberFormat("$0.000").setBackground(GRN);
    sh.getRange(row, 3).setFormula(`=${sellUsd}`).setNumberFormat("$0.000").setBackground(GRN);
    sh.getRange(row, 4).setFormula(`=IFERROR(1-(B${row}/C${row}),"—")`).setNumberFormat("0.0%").setBackground(GRN);
    if (i < 2) {
      sh.getRange(row, 5).setFormula(`=IFERROR(B${row}-B${seaRow},"—")`).setNumberFormat("+$0.000;-$0.000;$0").setBackground(GRN);
    } else {
      sh.getRange(row, 5).setValue("baseline").setFontColor("#6c757d").setBackground(GRY);
    }
  });

  // Conditional format Gross Margin %: green ≥50%, yellow 40-50%, red <40%
  const inRules = sh.getConditionalFormatRules();
  const marginRange = sh.getRange(53, 4, 3, 1);
  inRules.push(SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThanOrEqualTo(0.50).setBackground("#c8e6c9").setRanges([marginRange]).build());
  inRules.push(SpreadsheetApp.newConditionalFormatRule().whenNumberBetween(0.40, 0.50).setBackground("#fff9c4").setRanges([marginRange]).build());
  inRules.push(SpreadsheetApp.newConditionalFormatRule().whenNumberLessThan(0.40).setBackground("#f8d7da").setRanges([marginRange]).build());
  sh.setConditionalFormatRules(inRules);

  // ── Carton specs (from GW invoice — update when packaging changes) ───────────
  sectionHeader(sh, 57, COLS, "CARTON SPECS  (from GW invoice — update when box size changes)");
  [
    [IN.JELLO_CBM_PU,   "Jello CBM / unit",             0.000667, "33.360 CBM ÷ 50,000 units (invoice Jun 2026)"],
    [IN.JELLO_GW_PU,    "Jello G.W. / unit (kg)",       0.09842,  "4,921 kg ÷ 50,000 units"],
    [IN.JELLO_AIRCW_PU, "Jello Air Chg.W. / unit (kg)", 0.11142,  "5,571 kg ÷ 50,000 — volumetric premium vs G.W."],
    [IN.MIXER_CBM_PU,   "Mixer CBM / unit",             0.000326, "1.452 CBM ÷ 4,450 units"],
    [IN.MIXER_GW_PU,    "Mixer G.W. / unit (kg)",       0.07079,  "315 kg ÷ 4,450 units"],
    [IN.MIXER_AIRCW_PU, "Mixer Air Chg.W. / unit (kg)", 0.07079,  "315 kg ÷ 4,450 — no volumetric premium"],
    [IN.STRAW_CBM_PU,   "Straw CBM / unit",             0.000420, "4.872 CBM ÷ 11,600 units"],
    [IN.STRAW_GW_PU,    "Straw G.W. / unit (kg)",       0.08897,  "1,032 kg ÷ 11,600 units"],
    [IN.STRAW_AIRCW_PU, "Straw Air Chg.W. / unit (kg)", 0.08897,  "1,032 kg ÷ 11,600 — no volumetric premium"],
  ].forEach(([row, lbl, val, hint]) => {
    sh.getRange(row, 1).setValue(lbl).setFontWeight("bold");
    sh.getRange(row, 2).setValue(val).setBackground(Y).setNumberFormat("0.000000");
    sh.getRange(row, 3, 1, 2).merge().setValue(hint).setFontStyle("italic").setFontColor("#6c757d");
  });

  [180, 70, 300].forEach((w, i) => sh.setColumnWidth(i + 1, w));
}

// ─── TAB: INBOUND PLAN ───────────────────────────────────────────────────────
//
// Columns:
//   A  Batch name         [YELLOW — input]
//   B  Mode               [YELLOW — dropdown Air/Train/Sea]
//   C  Depart CN          [YELLOW — date]
//   D  Arrive DE          [formula: C + transit by mode]  ← override by typing if needed
//   E  Jello qty          [YELLOW]
//   F  Mixer qty          [YELLOW]
//   G  Straw qty          [YELLOW]
//   H  Jello $/unit       [YELLOW — per-batch price]
//   I  Mixer $/unit       [YELLOW — per-batch price]
//   J  Straw $/unit       [YELLOW — per-batch price]
//   K  Transit days       [formula]
//   L  Jello Total $      [formula]
//   M  Mixer Total $      [formula]
//   N  Straw Total $      [formula]
//   O  Grand Total $      [formula]
//   P  Payment 1 — 30%    [formula: O × PAY1_PCT%  — on order date]
//   Q  Payment 2 — 40%    [formula: O × PAY2_PCT%  — order + 30 days]
//   R  Payment 3 — 30%    [formula: O × PAY3_PCT%  — departure + 40 days]
//   S  Status             [YELLOW — text]
//   T  Order Date         [YELLOW — date, used for Pay1/Pay2 timing in Cashflow]
//   U  Freight $          [YELLOW — total freight (GW invoice), paid on arrival DE]
//   V  Landed $/unit J    [formula: (Jello Total $ + Freight $) / Jello qty]

// ─── TAB: INBOUND PLAN — formula mirror of Orders ────────────────────────────
//
// Read-only. Every cell = Orders!<col><row>.
// StockModel, Cashflow, Dashboard read from here — no changes needed in those tabs.
// IP_DATA_ROW (5) must match Orders DATA_ROW (5) for 1:1 mapping.

function buildInboundPlanTab(sh) {
  sh.setTabColor("#00796b");
  const COLS        = 22;
  const MIRROR_ROWS = 100;  // matches Orders (5 confirmed + 95 empty)

  pageTitle(sh, 1, COLS, "📋 INBOUND PLAN — auto-mirror of Orders tab (do not edit here)");
  note(sh, 2, COLS, "⬜ All data comes from Orders tab via formulas. Edit batches in Orders — this updates automatically.");
  note(sh, 3, COLS, "StockModel reads arrivals (col D + E/F/G) | Cashflow reads payments (cols P/Q/R, T) | Dashboard reads pipeline (cols A–G, S).");

  colHeaders(sh, 4, [
    "Batch", "Mode", "Depart CN", "Arrive DE",
    "Jello qty", "Mixer qty", "Straw qty",
    "Jello $/unit", "Mixer $/unit", "Straw $/unit",
    "Transit days", "Jello Total $", "Mixer Total $", "Straw Total $",
    "Grand Total $", "Pay1 30%", "Pay2 40%", "Pay3 30%",
    "Status", "Order Date", "Freight $", "Landed $/unit J",
  ]);

  // Build all mirror formulas in one batch call (100 rows × 22 cols = 2,200 formulas)
  const mirrorFormulas = [];
  for (let i = 0; i < MIRROR_ROWS; i++) {
    const ordRow = 5 + i;
    const row = [];
    for (let c = 1; c <= COLS; c++) {
      const col = String.fromCharCode(64 + c);
      row.push(`=IF(Orders!$A$${ordRow}<>"",Orders!${col}${ordRow},"")`);
    }
    mirrorFormulas.push(row);
  }
  sh.getRange(IP_DATA_ROW, 1, MIRROR_ROWS, COLS).setFormulas(mirrorFormulas);

  // Number formats (batch by column group)
  sh.getRange(IP_DATA_ROW, 3,  MIRROR_ROWS, 1).setNumberFormat("DD.MM.YYYY");
  sh.getRange(IP_DATA_ROW, 4,  MIRROR_ROWS, 1).setNumberFormat("DD.MM.YYYY");
  sh.getRange(IP_DATA_ROW, 5,  MIRROR_ROWS, 3).setNumberFormat("#,##0");
  sh.getRange(IP_DATA_ROW, 8,  MIRROR_ROWS, 3).setNumberFormat("$0.00");
  sh.getRange(IP_DATA_ROW, 11, MIRROR_ROWS, 1).setNumberFormat("0");
  sh.getRange(IP_DATA_ROW, 12, MIRROR_ROWS, 7).setNumberFormat("$#,##0");
  sh.getRange(IP_DATA_ROW, 20, MIRROR_ROWS, 1).setNumberFormat("DD.MM.YYYY");
  sh.getRange(IP_DATA_ROW, 21, MIRROR_ROWS, 1).setNumberFormat("€#,##0");
  sh.getRange(IP_DATA_ROW, 22, MIRROR_ROWS, 1).setNumberFormat("$0.000");

  // Totals (mirrors Orders totals row)
  const lastData = IP_DATA_ROW + MIRROR_ROWS - 1;
  const totRow   = lastData + 2;
  sh.getRange(totRow, 1, 1, 3).merge().setValue("TOTAL").setFontWeight("bold");
  ["E","F","G","L","M","N","O","P","Q","R","U"].forEach(colLetter => {
    const col = colLetter.charCodeAt(0) - 64;
    sh.getRange(totRow, col)
      .setFormula(`=SUM(${colLetter}${IP_DATA_ROW}:${colLetter}${lastData})`)
      .setFontWeight("bold");
  });
  sh.getRange(totRow, 22)
    .setFormula(`=IFERROR((L${totRow}+U${totRow})/E${totRow},"—")`)
    .setFontWeight("bold").setNumberFormat("$0.000");
  sh.getRange(totRow, 5, 1, 3).setNumberFormat("#,##0");
  sh.getRange(totRow, 12, 1, 7).setNumberFormat("$#,##0");
  sh.getRange(totRow, 21).setNumberFormat("€#,##0");
  sh.getRange(totRow, 1, 1, COLS).setBackground(BLU);

  [95,70,110,110,80,70,70,90,90,90,80,100,90,90,100,100,100,100,140,100,100,120]
    .forEach((w, i) => sh.setColumnWidth(i + 1, w));
  sh.setFrozenRows(4);
}

// ─── TAB: STOCK MODEL ────────────────────────────────────────────────────────
//
// All formulas. References Inputs (starting stock, demand phases)
// and InboundPlan (arrivals via SUMIF on arrive date).
//
// Columns:
//   A  Date
//   B  Phase
//   C  Jello IN (SUMIF)      D  Jello Demand    E  Jello Stock    F  Jello Days ▶
//   G  Mixer IN              H  Mixer Stock
//   I  Straw IN              J  Straw Stock
//   K  Event (batch names arriving today)
//   L  Status

function buildStockModelTab(sh) {
  sh.setTabColor("#1565c0");
  // Ensure sheet has enough columns before any getRange calls into cols 29+
  if (sh.getMaxColumns() < 35) sh.insertColumnsAfter(sh.getMaxColumns(), 35 - sh.getMaxColumns());
  pageTitle(sh, 1, 28, "📦 STOCK MODEL — Jun 16 2026 – Jun 16 2028 (730 days)");
  note(sh, 2, 28, "All cells are formulas — edit via InboundPlan or Inputs | 🟢 ≥21d OK | 🟡 14-20d LOW | 🔴 <14d CRITICAL | 🚨 0d STOCKOUT | 🟣 >30d OVERSTOCK | Stk d = actual DE warehouse days | Pipeline d = Stk+Transit+Prod");

  // Phase legend
  sh.getRange(3, 1).setValue("Phases:").setFontWeight("bold");
  [["P1","#e8f5e9"],["P2","#fff8e1"],["P3","#fce4ec"],["P4","#e3f2fd"],["P5","#f3e5f5"]]
    .forEach(([lbl, color], i) => sh.getRange(3, 2 + i).setValue(lbl).setBackground(color).setFontWeight("bold"));

  colHeaders(sh, 5, [
    "Date", "Phase",
    "Jello IN", "Batch", "Jello / day", "Jello Stock", "Jello Trans d", "Jello Prod d", "Jello Stk d", "Jello Pipeline d",
    "Mixer IN", "Mixer / day", "Mixer Stock", "Mixer Trans d", "Mixer Prod d", "Mixer Stk d", "Mixer Pipeline d",
    "Straw IN", "Straw / day", "Straw Stock", "Straw Trans d", "Straw Prod d", "Straw Stk d", "Straw Pipeline d",
    "Status",
    "Jello Actual", "Mixer Actual", "Straw Actual",
    "Jello Δ", "Mixer Δ", "Straw Δ",
  ]);

  // ── Sales vs Plan summary panel (cols 23-26 = W-Z, rows 1-5) ────────────────
  const wkMon = `TODAY()-WEEKDAY(TODAY(),2)+1`;
  const mo1st = `DATE(YEAR(TODAY()),MONTH(TODAY()),1)`;
  const sumActual = (colIdx, from, to) =>
    `SUMIFS(ActualSales!$${["","","B","C","D"][colIdx]}:$${["","","B","C","D"][colIdx]},ActualSales!$A:$A,">="&(${from}),ActualSales!$A:$A,"<="&(${to}))`;
  const sumPlan = (spCol, from, to) =>
    `SUMIFS(SalesPlan!$${["","","B","C","D"][spCol]}:$${["","","B","C","D"][spCol]},SalesPlan!$A:$A,">="&(${from}),SalesPlan!$A:$A,"<="&(${to}))`;

  // Summary panel at cols 32-35 (AF-AI) — outside the 31-col data area (A-AE).
  sh.getRange(1, 32, 1, 4).merge()
    .setValue("📊 SALES vs PLAN")
    .setBackground("#37474f").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");
  sh.getRange(2, 32, 1, 4).setValues([["", "Today Δ", "WTD Δ", "MTD Δ"]])
    .setBackground(HDR).setFontColor(FG).setFontWeight("bold").setHorizontalAlignment("center");

  [
    ["Jello", 2, 2],
    ["Mixer", 3, 3],
    ["Straw", 4, 4],
  ].forEach(([sku, acCol, spCol], i) => {
    const row = 3 + i;
    const todayActual = `IFERROR(VLOOKUP(TODAY(),ActualSales!$A:$D,${acCol},FALSE),0)`;
    const todayPlan   = `IFERROR(VLOOKUP(TODAY(),SalesPlan!$A:$D,${spCol},FALSE),0)`;
    sh.getRange(row, 32).setValue(sku).setFontWeight("bold").setBackground(GRY);
    sh.getRange(row, 33)
      .setFormula(`=IFERROR(${todayActual}-${todayPlan},"—")`)
      .setNumberFormat("+#,##0;-#,##0;—").setBackground(GRY);
    sh.getRange(row, 34)
      .setFormula(`=IFERROR(${sumActual(acCol, wkMon, "TODAY()")}-${sumPlan(spCol, wkMon, "TODAY()")},"—")`)
      .setNumberFormat("+#,##0;-#,##0;—").setBackground(GRY);
    sh.getRange(row, 35)
      .setFormula(`=IFERROR(${sumActual(acCol, mo1st, "TODAY()")}-${sumPlan(spCol, mo1st, "TODAY()")},"—")`)
      .setNumberFormat("+#,##0;-#,##0;—").setBackground(GRY);
  });

  // ── 7-Day Run Rate panel (rows 6-10, cols 32-35 = AF-AI) ────────────────────
  sh.getRange(6, 32, 1, 4).merge()
    .setValue("📈 7-DAY RUN RATE")
    .setBackground("#1565c0").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");
  sh.getRange(7, 32, 1, 4).setValues([["SKU", "Actual/day", "Plan/day", "Rate Δ%"]])
    .setBackground(HDR).setFontColor(FG).setFontWeight("bold").setHorizontalAlignment("center");

  [
    ["Jello", "B", "B"],
    ["Mixer", "C", "C"],
    ["Straw", "D", "D"],
  ].forEach(([sku, acLtr, spLtr], i) => {
    const row = 8 + i;
    const acF = `IFERROR(SUMIFS(ActualSales!$${acLtr}:$${acLtr},ActualSales!$A:$A,">="&(TODAY()-7),ActualSales!$A:$A,"<"&TODAY())/7,0)`;
    const spF = `IFERROR(SUMIFS(SalesPlan!$${spLtr}:$${spLtr},SalesPlan!$A:$A,">="&(TODAY()-7),SalesPlan!$A:$A,"<"&TODAY())/7,0)`;
    sh.getRange(row, 32).setValue(sku).setFontWeight("bold").setBackground(GRY);
    sh.getRange(row, 33).setFormula(`=${acF}`).setNumberFormat("#,##0.0").setBackground(GRY);
    sh.getRange(row, 34).setFormula(`=${spF}`).setNumberFormat("#,##0.0").setBackground(GRY);
    sh.getRange(row, 35)
      .setFormula(`=IFERROR(IF(AH${row}=0,"—",(AG${row}/AH${row})-1),"—")`)
      .setNumberFormat("+0.0%;-0.0%;—").setBackground(GRY);
  });

  const rateDeltaRange = sh.getRange(8, 35, 3, 1);
  const rateDeltaRules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(0).setBackground("#c8e6c9").setRanges([rateDeltaRange]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(0).setBackground("#f8d7da").setRanges([rateDeltaRange]).build(),
  ];

  // ── Inventory Coverage panel (rows 11-15, cols 32-35 = AF-AI) ───────────────
  {
    const buf  = `Inputs!$B$${IN.RECEIVE_BUFFER}`;
    const smA  = SM_DATA_ROW;
    const smZ  = SM_DATA_ROW + 730;

    sh.getRange(11, 32, 1, 4).merge()
      .setValue("📦 COVERAGE TODAY (sales-plan days)")
      .setBackground("#1b5e20").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");
    sh.getRange(12, 32, 1, 4).setValues([["", "Jello", "Mixer", "Straw"]])
      .setBackground(HDR).setFontColor(FG).setFontWeight("bold").setHorizontalAlignment("center");

    const covSkus = [
      { stock: "F", dem: "E", ipC: "E" },
      { stock: "M", dem: "L", ipC: "F" },
      { stock: "T", dem: "S", ipC: "G" },
    ];

    [
      ["🏢 DE Whse",    (s, d)         => `${s}/${d}`],
      ["🚢 Transit",    (_s, d, t)     => `${t}/${d}`],
      ["🏭 Production", (_s, d, t, a)  => `MAX(0,${a}-${t})/${d}`],
    ].forEach(([label, expr], tier) => {
      sh.getRange(13 + tier, 32).setValue(label).setFontWeight("bold").setBackground(GRY);
      covSkus.forEach(({ stock, dem, ipC }, si) => {
        const s = `IFERROR(INDEX(${stock}$${smA}:${stock}$${smZ},MATCH(TODAY(),A$${smA}:A$${smZ},0)),0)`;
        const d = `MAX(1,IFERROR(INDEX(${dem}$${smA}:${dem}$${smZ},MATCH(TODAY(),A$${smA}:A$${smZ},0)),1))`;
        const t = `IFERROR(SUMIFS(InboundPlan!$${ipC}:$${ipC},InboundPlan!$D:$D,">"&(TODAY()-${buf}),InboundPlan!$C:$C,"<="&TODAY(),InboundPlan!$C:$C,"<>"),0)`;
        const a = `IFERROR(SUMIF(InboundPlan!$D:$D,">"&(TODAY()-${buf}),InboundPlan!$${ipC}:$${ipC}),0)`;
        sh.getRange(13 + tier, 33 + si)
          .setFormula(`=IFERROR(FLOOR(${expr(s, d, t, a)},1),"—")`)
          .setNumberFormat("#,##0").setBackground(GRY);
      });
    });
  }
  const coveragePanelRange = sh.getRange(13, 33, 3, 3);
  const coverageRules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(1).setBackground("#dc3545").setFontColor("#ffffff")
      .setRanges([coveragePanelRange]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(14).setBackground("#f8d7da")
      .setRanges([coveragePanelRange]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(14, 20).setBackground("#fff3cd")
      .setRanges([coveragePanelRange]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(21).setBackground("#d4edda")
      .setRanges([coveragePanelRange]).build(),
  ];

  // Generate date series — 730 days (~2 years) from start
  const startDate = new Date(2026, 5, 16);
  const endDate   = new Date(startDate.getTime() + 730 * 86400000);
  const days      = Math.round((endDate - startDate) / 86400000) + 1;
  const DR        = SM_DATA_ROW;

  const dates = Array.from({ length: days }, (_, d) => {
    const dt = new Date(startDate);
    dt.setDate(startDate.getDate() + d);
    return [dt];
  });
  sh.getRange(DR, 1, days, 1).setValues(dates).setNumberFormat("DD.MM.YYYY");

  // Build all formula rows as 2D array for one setFormulas() call
  const formulas = dates.map((_, d) => {
    const row  = DR + d;
    const prev = row - 1;
    const isFirst = d === 0;

    const jelloStart = `Inputs!$B$${IN.JELLO_STOCK}`;
    const mixerStart = `Inputs!$B$${IN.MIXER_STOCK}`;
    const strawStart = `Inputs!$B$${IN.STRAW_STOCK}`;

    // Stock is credited RECEIVE_BUFFER days after Arrive DE (customs + FF inbound delay).
    const bufRef = `Inputs!$B$${IN.RECEIVE_BUFFER}`;
    const jIn = `IFERROR(SUMIF(InboundPlan!$D:$D,A${row}-${bufRef},InboundPlan!$E:$E),0)`;
    const mIn = `IFERROR(SUMIF(InboundPlan!$D:$D,A${row}-${bufRef},InboundPlan!$F:$F),0)`;
    const sIn = `IFERROR(SUMIF(InboundPlan!$D:$D,A${row}-${bufRef},InboundPlan!$G:$G),0)`;
    const jDem = `IFERROR(VLOOKUP(A${row},SalesPlan!$A:$D,2,FALSE),0)`;
    const mDem = `IFERROR(VLOOKUP(A${row},SalesPlan!$A:$D,3,FALSE),0)`;
    const sDem = `IFERROR(VLOOKUP(A${row},SalesPlan!$A:$D,4,FALSE),0)`;

    // Transit d = (total not-yet-credited − production) ÷ daily demand. Air B1 (null Depart CN) falls into transit automatically.
    const jTrans = `=IFERROR(FLOOR((SUMIF(InboundPlan!$D:$D,">"&(A${row}-${bufRef}),InboundPlan!$E:$E)-SUMIFS(InboundPlan!$E:$E,InboundPlan!$D:$D,">"&(A${row}-${bufRef}),InboundPlan!$C:$C,">"&A${row}))/MAX(1,E${row}),1),0)`;
    const jProd  = `=IFERROR(FLOOR(SUMIFS(InboundPlan!$E:$E,InboundPlan!$D:$D,">"&(A${row}-${bufRef}),InboundPlan!$C:$C,">"&A${row})/MAX(1,E${row}),1),0)`;
    const mTrans = `=IFERROR(FLOOR((SUMIF(InboundPlan!$D:$D,">"&(A${row}-${bufRef}),InboundPlan!$F:$F)-SUMIFS(InboundPlan!$F:$F,InboundPlan!$D:$D,">"&(A${row}-${bufRef}),InboundPlan!$C:$C,">"&A${row}))/MAX(1,L${row}),1),0)`;
    const mProd  = `=IFERROR(FLOOR(SUMIFS(InboundPlan!$F:$F,InboundPlan!$D:$D,">"&(A${row}-${bufRef}),InboundPlan!$C:$C,">"&A${row})/MAX(1,L${row}),1),0)`;
    const sTrans = `=IFERROR(FLOOR((SUMIF(InboundPlan!$D:$D,">"&(A${row}-${bufRef}),InboundPlan!$G:$G)-SUMIFS(InboundPlan!$G:$G,InboundPlan!$D:$D,">"&(A${row}-${bufRef}),InboundPlan!$C:$C,">"&A${row}))/MAX(1,S${row}),1),0)`;
    const sProd  = `=IFERROR(FLOOR(SUMIFS(InboundPlan!$G:$G,InboundPlan!$D:$D,">"&(A${row}-${bufRef}),InboundPlan!$C:$C,">"&A${row})/MAX(1,S${row}),1),0)`;

    return [
      // B: Phase
      `=IFERROR(INDEX(Inputs!$A$${IN.PHASE_START}:$A$${IN.PHASE_START+4},MATCH(A${row},Inputs!$B$${IN.PHASE_START}:$B$${IN.PHASE_START+4},1)),"")`,
      // C: Jello IN
      `=${jIn}`,
      // D: Batch — which shipment is credited today (first 200 rows only)
      d < 200
        ? `=IFERROR(TEXTJOIN(", ",TRUE,IF(InboundPlan!$D$${IP_DATA_ROW}:$D$${IP_DATA_ROW+99}=A${row}-Inputs!$B$${IN.RECEIVE_BUFFER},InboundPlan!$A$${IP_DATA_ROW}:$A$${IP_DATA_ROW+99},"")),"")`
        : `""`,
      // E: Jello / day
      `=${jDem}`,
      // F: Jello Stock (DE) — floored at 0; first row allows negative = starting backlog
      isFirst ? `=${jelloStart}+C${row}-E${row}` : `=MAX(0,F${prev}+C${row}-E${row})`,
      // G: Jello Trans d
      jTrans,
      // H: Jello Prod d
      jProd,
      // I: Jello Stk d — actual days of stock in DE warehouse (Stock ÷ Demand)
      `=MAX(0,IFERROR(ROUND(F${row}/MAX(1,E${row}),0),0))`,
      // J: Jello Pipeline d — total coverage: DE stock + transit + production
      `=I${row}+G${row}+H${row}`,
      // K: Mixer IN
      `=${mIn}`,
      // L: Mixer / day
      `=${mDem}`,
      // M: Mixer Stock (DE) — floored at 0; first row allows negative = starting backlog
      isFirst ? `=${mixerStart}+K${row}-L${row}` : `=MAX(0,M${prev}+K${row}-L${row})`,
      // N: Mixer Trans d
      mTrans,
      // O: Mixer Prod d
      mProd,
      // P: Mixer Stk d — actual days of stock in DE warehouse
      `=MAX(0,IFERROR(ROUND(M${row}/MAX(1,L${row}),0),0))`,
      // Q: Mixer Pipeline d — total coverage: DE stock + transit + production
      `=P${row}+N${row}+O${row}`,
      // R: Straw IN
      `=${sIn}`,
      // S: Straw / day
      `=${sDem}`,
      // T: Straw Stock (DE) — floored at 0; first row allows negative = starting backlog
      isFirst ? `=${strawStart}+R${row}-S${row}` : `=MAX(0,T${prev}+R${row}-S${row})`,
      // U: Straw Trans d
      sTrans,
      // V: Straw Prod d
      sProd,
      // W: Straw Stk d — actual days of stock in DE warehouse
      `=MAX(0,IFERROR(ROUND(T${row}/MAX(1,S${row}),0),0))`,
      // X: Straw Pipeline d — total coverage: DE stock + transit + production
      `=W${row}+U${row}+V${row}`,
      // Y: Status — weakest-link across all 3 SKUs; overstock when any SKU exceeds 30d
      `=IF(MIN(I${row},P${row},W${row})=0,"🚨 STOCKOUT",IF(MIN(I${row},P${row},W${row})<7,"🔴 CRITICAL",IF(MIN(I${row},P${row},W${row})<Inputs!$B$${IN.SAFETY_DAYS},"⚠️ LOW",IF(MAX(I${row},P${row},W${row})>30,"🟣 OVERSTOCK","✅ OK"))))`,
      // Z: Jello Actual
      `=IFERROR(VLOOKUP(A${row},ActualSales!$A:$D,2,FALSE),"")`,
      // AA: Mixer Actual
      `=IFERROR(VLOOKUP(A${row},ActualSales!$A:$D,3,FALSE),"")`,
      // AB: Straw Actual
      `=IFERROR(VLOOKUP(A${row},ActualSales!$A:$D,4,FALSE),"")`,
      // AC: Jello Δ
      `=IF(Z${row}<>"",Z${row}-E${row},"")`,
      // AD: Mixer Δ
      `=IF(AA${row}<>"",AA${row}-L${row},"")`,
      // AE: Straw Δ
      `=IF(AB${row}<>"",AB${row}-S${row},"")`,
    ];
  });

  sh.getRange(DR, 2, days, 30).setFormulas(formulas);

  // Number formats (skip col D = Batch text)
  const lastRow = DR + days - 1;
  sh.getRange(DR, 3,  days, 1).setNumberFormat("#,##0");   // C: Jello IN
  sh.getRange(DR, 5,  days, 6).setNumberFormat("#,##0");   // E-J: Jello /day, Stock, Trans d, Prod d, Stk d, Pipeline d
  sh.getRange(DR, 11, days, 1).setNumberFormat("#,##0");   // K: Mixer IN
  sh.getRange(DR, 12, days, 6).setNumberFormat("#,##0");   // L-Q: Mixer /day, Stock, Trans d, Prod d, Stk d, Pipeline d
  sh.getRange(DR, 18, days, 1).setNumberFormat("#,##0");   // R: Straw IN
  sh.getRange(DR, 19, days, 6).setNumberFormat("#,##0");   // S-X: Straw /day, Stock, Trans d, Prod d, Stk d, Pipeline d
  sh.getRange(DR, 26, days, 3).setNumberFormat("#,##0");   // Z-AB: actuals
  sh.getRange(DR, 29, days, 3).setNumberFormat("+#,##0;-#,##0;"); // AC-AE: delta

  // Conditional formatting — days columns (Trans d, Prod d, Stk d, Pipeline d): 🟣>30 | 🟢21-30 | 🟡14-20 | 🔴<14 | ⛔<1
  const jelloAllDays = sh.getRange(`G${DR}:J${lastRow}`);   // Jello: Trans d, Prod d, Stk d, Pipeline d
  const mixerAllDays = sh.getRange(`N${DR}:Q${lastRow}`);   // Mixer: Trans d, Prod d, Stk d, Pipeline d
  const strawAllDays = sh.getRange(`U${DR}:X${lastRow}`);   // Straw: Trans d, Prod d, Stk d, Pipeline d
  const deltaCol     = sh.getRange(`AC${DR}:AE${lastRow}`); // deltas
  sh.setConditionalFormatRules([
    ...rateDeltaRules,
    ...coverageRules,
    // Rules evaluated top-down; first match wins.
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(1).setBackground("#dc3545").setFontColor("#ffffff")
      .setRanges([jelloAllDays, mixerAllDays, strawAllDays]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(14).setBackground("#f8d7da")
      .setRanges([jelloAllDays, mixerAllDays, strawAllDays]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(14, 20).setBackground("#fff3cd")
      .setRanges([jelloAllDays, mixerAllDays, strawAllDays]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(30).setBackground("#e1bee7")  // overstock: light purple
      .setRanges([jelloAllDays, mixerAllDays, strawAllDays]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(21).setBackground("#d4edda")
      .setRanges([jelloAllDays, mixerAllDays, strawAllDays]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(0).setBackground("#28a745").setFontColor("#ffffff").setBold(true)
      .setRanges([sh.getRange(`C${DR}:C${lastRow}`), sh.getRange(`K${DR}:K${lastRow}`), sh.getRange(`R${DR}:R${lastRow}`)]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(0).setBackground("#d4edda")
      .setRanges([deltaCol]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(0).setBackground("#f8d7da")
      .setRanges([deltaCol]).build(),
  ]);

  // 35 cols: A-AE data (31) | AF-AI panels (4)
  const widths = [110, 40, 80, 90, 80, 90, 80, 80, 80, 80, 70, 80, 80, 80, 80, 80, 80, 70, 80, 80, 80, 80, 80, 80, 110, 90, 80, 80, 80, 80, 80, 70, 90, 90, 90];
  widths.forEach((w, i) => sh.setColumnWidth(i + 1, w));
  sh.setFrozenRows(5);
}

// ─── TAB: CASHFLOW ───────────────────────────────────────────────────────────

function buildCashflowTab(sh) {
  sh.setTabColor("#6a1b9a");
  pageTitle(sh, 1, 13, "💵 CASHFLOW — Production & Freight Payments");
  note(sh, 2, 13, "Production: 3 tranches — 30% on order / 40% at factory ready (+30d) / 30% after departure (+40d). Freight: paid on arrival at DE customs.");
  note(sh, 3, 13, "Amounts pull live from InboundPlan. Change qty/price or freight there → this tab updates automatically.");

  colHeaders(sh, 4, ["Payment Date", "PO", "Type", "Jello $", "Mixer $", "Straw $", "Total $",
                     "", "Metric", "Amount $", "Period / Notes", "", ""]);

  // ── Right-side outflow summary dashboard (cols I-K, rows 5-18) ───────────────
  sh.getRange(5, 9, 1, 4).merge()
    .setValue("💰 OUTFLOW SUMMARY")
    .setBackground("#37474f").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");

  const summaryRows = [
    ["Due this week (7d)",      `=SUMIFS(G:G,A:A,">="&TODAY(),A:A,"<="&(TODAY()+7))`,         "Payments due within 7 days"],
    ["Due next 30 days",        `=SUMIFS(G:G,A:A,">="&TODAY(),A:A,"<="&(TODAY()+30))`,        ""],
    ["Due 31–90 days",          `=SUMIFS(G:G,A:A,">"&(TODAY()+30),A:A,"<="&(TODAY()+90))`,   ""],
    ["Total committed (future)",`=SUMIF(A:A,">="&TODAY(),G:G)`,                               "All future scheduled payments"],
    ["Total paid to date",      `=SUMIF(A:A,"<"&TODAY(),G:G)`,                                ""],
    ["—", "", ""],
    ["Biggest upcoming payment",`=IFERROR(MAXIFS(G:G,A:A,">="&TODAY()),0)`,                   `=IFERROR(TEXT(INDEX(A:A,MATCH(MAXIFS(G:G,A:A,">="&TODAY()),G:G,0)),"DD.MM.YYYY"),"—")`],
    ["—", "", ""],
    ["Cash out next 30 days",   `=SUMIFS(G:G,A:A,">="&TODAY(),A:A,"<="&(TODAY()+30))`,        "Same as 'Due next 30d'"],
    ["Cash out next 60 days",   `=SUMIFS(G:G,A:A,">="&TODAY(),A:A,"<="&(TODAY()+60))`,        ""],
    ["Cash out next 90 days",   `=SUMIFS(G:G,A:A,">="&TODAY(),A:A,"<="&(TODAY()+90))`,        ""],
  ];

  summaryRows.forEach(([label, amtFormula, noteText], i) => {
    const row = 6 + i;
    if (label === "—") {
      sh.getRange(row, 9, 1, 4).merge().setValue("").setBackground("#f0f0f0");
      return;
    }
    const bg = i % 2 === 0 ? "#ffffff" : GRY;
    sh.getRange(row, 9).setValue(label).setFontWeight(i < 5 ? "normal" : "normal").setBackground(bg);
    if (amtFormula) {
      sh.getRange(row, 10).setFormula(amtFormula).setNumberFormat("$#,##0").setBackground(bg).setFontWeight("bold");
    }
    if (noteText && noteText.startsWith("=")) {
      sh.getRange(row, 11).setFormula(noteText).setBackground(bg);
    } else if (noteText) {
      sh.getRange(row, 11).setValue(noteText).setFontColor("#6c757d").setFontStyle("italic").setBackground(bg);
    }
  });

  // 20 PO slots: rows 9-28 of InboundPlan (planRow 9 = N1, onwards)
  const newPOs = Array.from({ length: 20 }, (_, i) => ({ planRow: 9 + i }));
  const slotColors = [
    ["#e8f5e9","#c8e6c9","#a5d6a7"],
    ["#fff8e1","#fff0b3","#ffe082"],
    ["#fce4ec","#f8bbd0","#f48fb1"],
    ["#e3f2fd","#bbdefb","#90caf9"],
    ["#f3e5f5","#e1bee7","#ce93d8"],
  ];

  // Fixed row positions — derived upfront so downstream sections don't need mutable r.
  const PROD_START   = 6;
  const PROD_ROWS    = 20 * 3;               // 20 POs × 3 payments = 60
  const PROD_TOT_ROW = PROD_START + PROD_ROWS;          // 66
  const FGHT_HDR_ROW = PROD_TOT_ROW + 2;               // 68
  const FGHT_START   = FGHT_HDR_ROW + 1;               // 69
  const FGHT_ROWS    = 25;
  const FGHT_TOT_ROW = FGHT_START + FGHT_ROWS;         // 94
  const GRAND_ROW    = FGHT_TOT_ROW + 2;               // 96
  const NOTE_ROW     = GRAND_ROW + 3;                  // 99

  sectionHeader(sh, 5, 7,
    "PRODUCTION PAYMENTS — N1+ only (T1/T2/T3 pre-paid from 250k factory stock, excluded here)");

  // ── Production payments — batch write (~5 API calls instead of 480+) ──────────
  const prodFmls = [], prodTypes = [], prodBgs = [], prodFmts = [];
  const dateFmt = "DD.MM.YYYY";
  const usdFmt  = "$#,##0";

  newPOs.forEach(({ planRow: pr }, idx) => {
    const [bg1, bg2, bg3] = slotColors[idx % slotColors.length];
    const nF = `=IFERROR(InboundPlan!$A$${pr},"")`;
    const p1 = `InboundPlan!$P$${pr}`, p2 = `InboundPlan!$Q$${pr}`, p3 = `InboundPlan!$R$${pr}`;
    const L = `InboundPlan!$L$${pr}`, M_ = `InboundPlan!$M$${pr}`, N_ = `InboundPlan!$N$${pr}`;
    const O_ = `InboundPlan!$O$${pr}`;

    prodFmls.push([`=IFERROR(InboundPlan!$T$${pr},"")`, nF, `=""`, `=IFERROR(${p1}*${L}/${O_},0)`, `=IFERROR(${p1}*${M_}/${O_},0)`, `=IFERROR(${p1}*${N_}/${O_},0)`, `=IFERROR(${p1},0)`]);
    prodTypes.push(["Pay1 — 30% on order (start production)"]);
    prodBgs  .push([bg1,bg1,bg1,bg1,bg1,bg1,bg1]);
    prodFmts .push([dateFmt,"@","@",usdFmt,usdFmt,usdFmt,usdFmt]);

    prodFmls.push([`=IFERROR(InboundPlan!$T$${pr}+Inputs!$B$${IN.PAY2_DAYS},"")`, nF, `=""`, `=IFERROR(${p2}*${L}/${O_},0)`, `=IFERROR(${p2}*${M_}/${O_},0)`, `=IFERROR(${p2}*${N_}/${O_},0)`, `=IFERROR(${p2},0)`]);
    prodTypes.push(["Pay2 — 40% at factory ready"]);
    prodBgs  .push([bg2,bg2,bg2,bg2,bg2,bg2,bg2]);
    prodFmts .push([dateFmt,"@","@",usdFmt,usdFmt,usdFmt,usdFmt]);

    prodFmls.push([`=IFERROR(InboundPlan!$C$${pr}+Inputs!$B$${IN.PAY3_DAYS},"")`, nF, `=""`, `=IFERROR(${p3}*${L}/${O_},0)`, `=IFERROR(${p3}*${M_}/${O_},0)`, `=IFERROR(${p3}*${N_}/${O_},0)`, `=IFERROR(${p3},0)`]);
    prodTypes.push(["Pay3 — 30% after departure"]);
    prodBgs  .push([bg3,bg3,bg3,bg3,bg3,bg3,bg3]);
    prodFmts .push([dateFmt,"@","@",usdFmt,usdFmt,usdFmt,usdFmt]);
  });

  const prodRng = sh.getRange(PROD_START, 1, PROD_ROWS, 7);
  prodRng.setFormulas(prodFmls);
  prodRng.setBackgrounds(prodBgs);
  prodRng.setNumberFormats(prodFmts);
  sh.getRange(PROD_START, 3, PROD_ROWS, 1).setValues(prodTypes);    // overwrite ="" with labels
  sh.getRange(PROD_START, 2, PROD_ROWS, 1).setFontWeight("bold");   // batch name bold

  // Production subtotal
  sh.getRange(PROD_TOT_ROW, 1, 1, 3).merge().setValue("PRODUCTION TOTAL").setFontWeight("bold");
  ["D","E","F","G"].forEach(col => {
    sh.getRange(PROD_TOT_ROW, col.charCodeAt(0) - 64)
      .setFormula(`=SUM(${col}${PROD_START}:${col}${PROD_TOT_ROW - 1})`)
      .setFontWeight("bold").setNumberFormat(usdFmt);
  });
  sh.getRange(PROD_TOT_ROW, 1, 1, 7).setBackground(BLU);

  // ── Freight / customs — batch write ──────────────────────────────────────────
  sectionHeader(sh, FGHT_HDR_ROW, 7, "FREIGHT & CUSTOMS  (paid on arrival at DE customs — GW invoice)");

  const fBase   = ["#e3f2fd","#e8eaf6","#e3f2fd","#e8eaf6","#e8f5e9"];
  const fghtFmls = [], fghtBgs = [], fghtFmts = [];
  for (let i = 0; i < FGHT_ROWS; i++) {
    const pr = IP_DATA_ROW + i;
    const bg = fBase[i % fBase.length];
    fghtFmls.push([`=IFERROR(InboundPlan!$D$${pr},"")`, `=IFERROR(InboundPlan!$A$${pr},"")`, `=""`, `=""`, `=""`, `=""`, `=IFERROR(InboundPlan!$U$${pr}*Inputs!$B$${IN.FX_EUR_USD},0)`]);
    fghtBgs .push([bg,bg,bg,bg,bg,bg,bg]);
    fghtFmts.push([dateFmt,"@","@","@","@","@",usdFmt]);
  }
  const fghtRng = sh.getRange(FGHT_START, 1, FGHT_ROWS, 7);
  fghtRng.setFormulas(fghtFmls);
  fghtRng.setBackgrounds(fghtBgs);
  fghtRng.setNumberFormats(fghtFmts);
  sh.getRange(FGHT_START, 3, FGHT_ROWS, 1).setValues(Array(FGHT_ROWS).fill(["Freight / customs on arrival DE"]));
  sh.getRange(FGHT_START, 2, FGHT_ROWS, 1).setFontWeight("bold");

  // Freight subtotal
  sh.getRange(FGHT_TOT_ROW, 1, 1, 3).merge().setValue("FREIGHT TOTAL (all shipments)").setFontWeight("bold");
  sh.getRange(FGHT_TOT_ROW, 7)
    .setFormula(`=SUM(G${FGHT_START}:G${FGHT_TOT_ROW - 1})`)
    .setFontWeight("bold").setNumberFormat(usdFmt);
  sh.getRange(FGHT_TOT_ROW, 1, 1, 7).setBackground(BLU);

  // Grand total
  sh.getRange(GRAND_ROW, 1, 1, 3).merge()
    .setValue("GRAND TOTAL  (production + freight)").setFontWeight("bold").setFontColor("#ffffff");
  sh.getRange(GRAND_ROW, 7)
    .setFormula(`=G${PROD_TOT_ROW}+G${FGHT_TOT_ROW}`)
    .setFontWeight("bold").setFontColor("#ffffff").setNumberFormat(usdFmt);
  sh.getRange(GRAND_ROW, 1, 1, 7).setBackground("#4527a0");

  note(sh, NOTE_ROW, 7, "💡 Live outflow summary → see cols I-K above. Enter Freight in EUR in Orders col U — converted to USD here via Inputs FX rate.");

  [130, 60, 200, 90, 80, 80, 110, 20, 200, 110, 160].forEach((w, i) => sh.setColumnWidth(i + 1, w));
  sh.setFrozenRows(4);
}

// ─── TAB: ACTUAL SALES ───────────────────────────────────────────────────────
//
// Manual daily sales log for DE market.
// StockModel reads this via VLOOKUP on Date column.
// Enter one row per day — StockModel Δ columns update automatically.
//
// Columns:
//   A  Date        [values, auto-generated — do not edit]
//   B  Jello       [YELLOW — actual units sold]
//   C  Mixer       [YELLOW]
//   D  Straw       [YELLOW]

function buildActualSalesTab(sh) {
  sh.setTabColor("#e91e63");
  pageTitle(sh, 1, 4, "📈 ACTUAL SALES — daily DE sales log");
  note(sh, 2, 4, "🟡 Enter actual units sold per day. StockModel Δ columns and Sales vs Plan summary update automatically.");

  sh.getRange(3, 1, 1, 4)
    .setValues([["Date", "Jello", "Mixer", "Straw"]])
    .setBackground(HDR).setFontColor(FG).setFontWeight("bold").setHorizontalAlignment("center");
  sh.setRowHeight(3, 40);

  const startDate = new Date(2026, 5, 16);
  const days = 731;
  const DATA_ROW = 4;

  const dateVals = Array.from({ length: days }, (_, d) => {
    const dt = new Date(startDate);
    dt.setDate(startDate.getDate() + d);
    return [dt];
  });

  sh.getRange(DATA_ROW, 1, days, 1).setValues(dateVals).setNumberFormat("DD.MM.YYYY");
  sh.getRange(DATA_ROW, 2, days, 3).setBackground(Y).setNumberFormat("#,##0");

  // Conditional formatting: highlight today's row
  const todayRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied(`$A${DATA_ROW}=TODAY()`)
    .setBackground("#fff9c4").setBold(true)
    .setRanges([sh.getRange(DATA_ROW, 1, days, 4)])
    .build();
  sh.setConditionalFormatRules([todayRule]);

  [110, 100, 100, 100].forEach((w, i) => sh.setColumnWidth(i + 1, w));
  sh.setFrozenRows(3);
}
