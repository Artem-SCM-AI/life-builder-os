// ================================================================
// STYLIA BEAUTY — SC PIPELINE TRACKER
// Google Apps Script — v2.0 May 2026
//
// Run: Extensions → Apps Script → createSystem() → Run
// ================================================================
//
// 5 TABS (left → right):
//   📦 Stock      — MAIN: FBA stock + sales plan 7/15/30/45/60/90/120/180d
//   📊 Pipeline   — dashboard: cycle status counts + alerts
//   ⚙️ Settings   — 15 SKUs + 5 FBA receiving locations
//   🏭 Production — Cycle 1: Supplier milestones
//   🚢 Shipments  — Cycle 2 (Forwarder China) + Cycle 3 (FBA)
//
// FBA = one stock pool. Multiple receiving locations = routing only (placement fee).
//
// COLORS:
//   🟡 #FFF9C4 — manual input
//   🔵 #DBEAFE — formula (read-only, protected)
// ================================================================

const TABS = {
  STOCK:      '📦 Stock',
  DASHBOARD:  '📊 Pipeline',
  SETTINGS:   '⚙️ Settings',
  PRODUCTION: '🏭 Production',
  SHIPMENTS:  '🚢 Shipments',
};

const CLR = {
  navyBg:  '#0F1629',
  navyFg:  '#FFFFFF',
  input:   '#FFF9C4',
  formula: '#DBEAFE',
  alt:     '#F8FAFC',
};

const PROD_STATUS = [
  'In Production', 'Goods Ready', 'Inspected', 'Pickup Agreed', 'Picked Up', 'Cancelled',
];

const SHIP_STATUS = [
  'Pending Pickup', 'At Forwarder WH', 'Labels Applied', 'Dispatched',
  'In Transit', 'Window Check Needed', 'Delivered', 'Check-In',
  'Receiving', 'Closed', 'Reconciled', 'Cancelled',
];

const INSP_RESULT = ['Pending', 'Pass', 'Fail', 'Re-inspection'];


// ================================================================
// MAIN
// ================================================================

function createSystem() {
  const ui  = SpreadsheetApp.getUi();
  const res = ui.alert(
    '⚡ Create SC Pipeline Tracker',
    'All 5 tabs will be recreated. Existing data will be lost. Continue?',
    ui.ButtonSet.YES_NO
  );
  if (res !== ui.Button.YES) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.values(TABS).forEach(name => {
    const sh = ss.getSheetByName(name);
    if (sh) ss.deleteSheet(sh);
  });

  const shStock = ss.insertSheet(TABS.STOCK,      0);
  const shDash  = ss.insertSheet(TABS.DASHBOARD,  1);
  const shSet   = ss.insertSheet(TABS.SETTINGS,   2);
  const shProd  = ss.insertSheet(TABS.PRODUCTION, 3);
  const shShip  = ss.insertSheet(TABS.SHIPMENTS,  4);

  buildSettings(shSet);
  buildProduction(shProd);
  buildShipments(shShip);
  buildStock(shStock);
  buildDashboard(shDash);

  ss.setActiveSheet(shStock);
  SpreadsheetApp.flush();

  ui.alert(
    '✅ Done',
    'SC Pipeline Tracker is ready.\n\n' +
    '1. ⚙️ Settings   → fill 15 SKUs + 5 FBA receiving locations\n' +
    '2. 📦 Stock      → fill FBA Stock + Sales Plan per SKU  ← START HERE\n' +
    '3. 🏭 Production → add active POs\n' +
    '4. 🚢 Shipments  → track shipments through cycles\n' +
    '5. 📊 Pipeline   → auto-updates',
    ui.ButtonSet.OK
  );
}


// ================================================================
// HELPERS
// ================================================================

function makeHeader(sh, row, labels, bg, fg) {
  const r = sh.getRange(row, 1, 1, labels.length);
  r.setValues([labels])
   .setBackground(bg || CLR.navyBg)
   .setFontColor(fg || CLR.navyFg)
   .setFontWeight('bold')
   .setHorizontalAlignment('center')
   .setVerticalAlignment('middle')
   .setWrap(true);
}

function sectionBanner(sh, row, col, span, label, bg, fg) {
  const r = sh.getRange(row, col, 1, span);
  if (span > 1) r.merge();
  r.setValue(label)
   .setBackground(bg || '#334155')
   .setFontColor(fg || '#FFFFFF')
   .setFontWeight('bold')
   .setHorizontalAlignment('center')
   .setVerticalAlignment('middle');
  sh.setRowHeight(row, 22);
}

function markInput(sh, row, col, rows, cols) {
  sh.getRange(row, col, rows || 1, cols || 1).setBackground(CLR.input);
}

function markFormula(sh, row, col, rows, cols) {
  const range = sh.getRange(row, col, rows || 1, cols || 1);
  range.setBackground(CLR.formula);
  range.protect().setDescription('formula').setWarningOnly(true);
}

function addListDropdown(sh, row, col, rows, values) {
  sh.getRange(row, col, rows, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(values, true)
      .setAllowInvalid(false)
      .build()
  );
}

function addRangeDropdown(sh, row, col, rows, sourceRange) {
  sh.getRange(row, col, rows, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInRange(sourceRange, true)
      .setAllowInvalid(true)
      .build()
  );
}

function setDateFmt(sh, row, col, rows) {
  sh.getRange(row, col, rows, 1)
    .setNumberFormat('dd MMM yyyy')
    .setBackground(CLR.input);
}

function stripedRows(sh, startRow, numRows, numCols) {
  for (let i = 1; i < numRows; i += 2) {
    sh.getRange(startRow + i, 1, 1, numCols).setBackground(CLR.alt);
  }
}

function applyCf(sh, range, defs) {
  sh.setConditionalFormatRules(
    defs.map(d =>
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(d.text)
        .setBackground(d.bg)
        .setFontColor(d.fg || '#000000')
        .setRanges([range])
        .build()
    )
  );
}


// ================================================================
// ⚙️ SETTINGS
// ================================================================

function buildSettings(sh) {
  sh.setTabColor('#64748B');

  sh.getRange(1, 1, 1, 5).merge()
    .setValue('⚙️ SETTINGS — STYLIA SC PIPELINE TRACKER')
    .setBackground(CLR.navyBg).setFontColor(CLR.navyFg)
    .setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  sh.setRowHeight(1, 32);

  sectionBanner(sh, 2, 1, 5, '📦 SKU MASTER LIST — 15 SKUs', '#1E40AF');
  makeHeader(sh, 3, ['SKU ID', 'Product Name', 'Category', 'Supplier', 'Notes'], '#1E293B');
  sh.setRowHeight(3, 28);
  markInput(sh, 4, 1, 15, 5);
  stripedRows(sh, 4, 15, 5);
  sh.setFrozenRows(3);

  sectionBanner(sh, 20, 1, 3, '📍 FBA RECEIVING LOCATIONS — 5 Fixed (routing only, one stock pool)', '#065F46');
  makeHeader(sh, 21, ['Location Code', 'Warehouse / Carrier', 'State'], '#1E293B');
  sh.setRowHeight(21, 28);
  markInput(sh, 22, 1, 5, 3);
  stripedRows(sh, 22, 5, 3);

  sh.getRange(28, 1)
    .setValue('🟡 Yellow = manual input   |   🔵 Blue = auto-calculated (do not edit)   |   FBA = one stock pool, locations are for receiving/routing only')
    .setFontStyle('italic').setFontColor('#64748B').setWrap(true);
  sh.setRowHeight(28, 32);

  [130, 220, 120, 180, 200].forEach((w, i) => sh.setColumnWidth(i + 1, w));
}


// ================================================================
// 📦 STOCK — ГОЛОВНИЙ ПОКАЗНИК
// FBA Stock (один пул) + Sales Plan 7/15/30/45/60/90/120/180d
// ================================================================

function buildStock(sh) {
  const ROWS = 15;
  const COLS = 17;
  sh.setTabColor('#DC2626');

  sectionBanner(
    sh, 1, 1, COLS,
    '📦 FBA STOCK — ГОЛОВНИЙ ПОКАЗНИК   |   Стік в юнітах + Плани продажів (юніти) на 7 / 15 / 30 / 45 / 60 / 90 / 120 / 180 днів',
    '#991B1B'
  );
  sh.setRowHeight(1, 26);

  const headers = [
    'SKU', 'Product',
    '★ FBA Stock\n(units)', 'Updated',
    'Plan\n7d', 'Plan\n15d', 'Plan\n30d', 'Plan\n45d',
    'Plan\n60d', 'Plan\n90d', 'Plan\n120d', 'Plan\n180d',
    'Daily\nVelocity', 'DOS\n(days)', 'Status',
    'In Transit\n(units)', 'Notes',
  ];
  makeHeader(sh, 2, headers);
  sh.setRowHeight(2, 46);
  sh.setFrozenRows(2);

  [110, 200, 105, 92, 65, 65, 68, 65, 65, 65, 72, 72, 78, 65, 108, 92, 150]
    .forEach((w, i) => sh.setColumnWidth(i + 1, w));

  // A: SKU, B: Product — formula from Settings A4:B18
  const aF = [], bF = [];
  for (let i = 0; i < ROWS; i++) {
    const sr = i + 4;
    aF.push([`='⚙️ Settings'!A${sr}`]);
    bF.push([`='⚙️ Settings'!B${sr}`]);
  }
  sh.getRange(3, 1, ROWS, 1).setFormulas(aF);
  sh.getRange(3, 2, ROWS, 1).setFormulas(bF);
  markFormula(sh, 3, 1, ROWS, 1);
  markFormula(sh, 3, 2, ROWS, 1);

  // C: FBA Stock — MAIN INPUT
  markInput(sh, 3, 3, ROWS, 1);
  sh.getRange(3, 3, ROWS, 1)
    .setNumberFormat('#,##0')
    .setFontWeight('bold')
    .setFontSize(12)
    .setHorizontalAlignment('center');

  // D: Updated — auto-timestamp via onEdit, formula-protected
  sh.getRange(3, 4, ROWS, 1)
    .setBackground(CLR.formula)
    .setNumberFormat('dd MMM HH:mm')
    .setFontColor('#6B7280')
    .setHorizontalAlignment('center')
    .protect().setDescription('auto-timestamp').setWarningOnly(true);

  // E-L: Sales Plan (7/15/30/45/60/90/120/180 days) — manual, units
  // cols 5-12
  markInput(sh, 3, 5, ROWS, 8);
  sh.getRange(3, 5, ROWS, 8).setNumberFormat('#,##0').setHorizontalAlignment('center');

  // M: Daily Velocity = Plan 30d (col G=7) / 30
  // N: DOS = FBA Stock (col C=3) / Daily Velocity
  // O: Status
  const mF = [], nF = [], oF = [];
  for (let i = 0; i < ROWS; i++) {
    const r = i + 3;
    mF.push([`=IFERROR(IF(G${r}="","",ROUND(G${r}/30,1)),"")`]);
    nF.push([`=IFERROR(IF(OR(C${r}="",M${r}="",M${r}=0),"",ROUND(C${r}/M${r},0)),"")`]);
    oF.push([`=IFERROR(IF(C${r}="","",IF(C${r}=0,"STOCKOUT",IF(N${r}<30,"CRITICAL",IF(N${r}<46,"WATCH","HEALTHY")))),"")` ]);
  }
  sh.getRange(3, 13, ROWS, 1).setFormulas(mF).setNumberFormat('0.0');
  sh.getRange(3, 14, ROWS, 1).setFormulas(nF).setNumberFormat('0');
  sh.getRange(3, 15, ROWS, 1).setFormulas(oF)
    .setHorizontalAlignment('center').setFontWeight('bold');
  markFormula(sh, 3, 13, ROWS, 2); // M + N
  markFormula(sh, 3, 15, ROWS, 1); // O

  // P: In Transit — manual (units inbound from Shipments)
  markInput(sh, 3, 16, ROWS, 1);
  sh.getRange(3, 16, ROWS, 1).setNumberFormat('#,##0').setHorizontalAlignment('center');

  // Q: Notes
  markInput(sh, 3, 17, ROWS, 1);

  sh.setRowHeights(3, ROWS, 26);
  stripedRows(sh, 3, ROWS, COLS);

  // CF: Status (col O = 15)
  applyCf(sh, sh.getRange(3, 15, ROWS, 1), [
    { text: 'STOCKOUT', bg: '#7C3AED', fg: '#FFFFFF' },
    { text: 'CRITICAL', bg: '#DC2626', fg: '#FFFFFF' },
    { text: 'WATCH',    bg: '#F59E0B', fg: '#FFFFFF' },
    { text: 'HEALTHY',  bg: '#10B981', fg: '#FFFFFF' },
  ]);

  // CF: FBA Stock = 0 → purple
  const rules = sh.getConditionalFormatRules();
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberEqualTo(0)
      .setBackground('#7C3AED').setFontColor('#FFFFFF').setFontWeight('bold')
      .setRanges([sh.getRange(3, 3, ROWS, 1)]).build()
  );
  sh.setConditionalFormatRules(rules);
}


// ================================================================
// 🏭 PRODUCTION — Cycle 1: Supplier
// Start (Init Payment) → Goods Ready → Inspected → Pickup Agreed
// ================================================================

function buildProduction(sh) {
  const ROWS = 100;
  const COLS = 15;
  sh.setTabColor('#92400E');

  sectionBanner(
    sh, 1, 1, COLS,
    '🏭 CYCLE 1 — SUPPLIER   |   Production Start (Init Payment)  →  Goods Ready  →  Inspected  →  Pickup Agreed',
    '#92400E'
  );

  const headers = [
    'PO #', 'SKU', 'Product Name', 'Supplier', 'Qty\nOrdered',
    '📅 Production\nStart', 'Init\nPayment $',
    '📅 Goods\nReady', '📅 Inspection\nDate', 'Inspection\nResult',
    '📅 Pickup\nAgreed', 'Status', 'Linked\nShipment ID', 'Days\nOpen', 'Notes',
  ];
  makeHeader(sh, 2, headers);
  sh.setRowHeight(2, 46);
  sh.setFrozenRows(2);

  [120, 110, 200, 160, 65, 115, 100, 115, 115, 100, 115, 135, 115, 70, 200]
    .forEach((w, i) => sh.setColumnWidth(i + 1, w));

  markInput(sh, 3, 1, ROWS, 1);   // A: PO #
  markInput(sh, 3, 2, ROWS, 1);   // B: SKU
  markInput(sh, 3, 5, ROWS, 1);   // E: Qty
  setDateFmt(sh, 3, 6, ROWS);     // F: Production Start
  markInput(sh, 3, 7, ROWS, 1);   // G: Init Payment $
  sh.getRange(3, 7, ROWS, 1).setNumberFormat('"$"#,##0.00');
  setDateFmt(sh, 3, 8, ROWS);     // H: Goods Ready
  setDateFmt(sh, 3, 9, ROWS);     // I: Inspection Date
  markInput(sh, 3, 10, ROWS, 1);  // J: Inspection Result
  setDateFmt(sh, 3, 11, ROWS);    // K: Pickup Agreed
  markInput(sh, 3, 12, ROWS, 1);  // L: Status
  markInput(sh, 3, 13, ROWS, 1);  // M: Linked Shipment
  markInput(sh, 3, 15, ROWS, 1);  // O: Notes

  addListDropdown(sh, 3, 10, ROWS, INSP_RESULT);
  addListDropdown(sh, 3, 12, ROWS, PROD_STATUS);

  const settingsSh = sh.getParent().getSheetByName(TABS.SETTINGS);
  addRangeDropdown(sh, 3, 2, ROWS, settingsSh.getRange('A4:A18'));

  const cF = [], dF = [], nF = [];
  for (let i = 0; i < ROWS; i++) {
    const r = i + 3;
    cF.push([`=IFERROR(IF(B${r}="","",VLOOKUP(B${r},'⚙️ Settings'!$A$4:$E$18,2,0)),"")`]);
    dF.push([`=IFERROR(IF(B${r}="","",VLOOKUP(B${r},'⚙️ Settings'!$A$4:$E$18,4,0)),"")`]);
    nF.push([`=IFERROR(IF(OR(L${r}="Picked Up",L${r}="Cancelled",F${r}=""),"",TODAY()-F${r}),"")`]);
  }
  sh.getRange(3, 3, ROWS, 1).setFormulas(cF);
  sh.getRange(3, 4, ROWS, 1).setFormulas(dF);
  sh.getRange(3, 14, ROWS, 1).setFormulas(nF).setNumberFormat('0');
  markFormula(sh, 3, 3, ROWS, 1);
  markFormula(sh, 3, 4, ROWS, 1);
  markFormula(sh, 3, 14, ROWS, 1);

  stripedRows(sh, 3, ROWS, COLS);

  applyCf(sh, sh.getRange(3, 12, ROWS, 1), [
    { text: 'In Production', bg: '#FEF9C3', fg: '#854D0E' },
    { text: 'Goods Ready',   bg: '#FED7AA', fg: '#9A3412' },
    { text: 'Inspected',     bg: '#BBF7D0', fg: '#14532D' },
    { text: 'Pickup Agreed', bg: '#BFDBFE', fg: '#1E3A8A' },
    { text: 'Picked Up',     bg: '#D1FAE5', fg: '#064E3B' },
    { text: 'Cancelled',     bg: '#E2E8F0', fg: '#475569' },
  ]);

  // Days Open > 90 → red
  const existingRules = sh.getConditionalFormatRules();
  existingRules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(90)
      .setBackground('#FECACA').setFontColor('#991B1B')
      .setRanges([sh.getRange(3, 14, ROWS, 1)]).build()
  );
  sh.setConditionalFormatRules(existingRules);
}


// ================================================================
// 🚢 SHIPMENTS — Cycle 2 (Forwarder China) + Cycle 3 (FBA)
//
// CYCLE 2 — FORWARDER (cols E–H):
//   Pickup from Factory → Arrived FW WH → Labels Applied → Dispatched to FBA
//
// CYCLE 3 — FBA (cols I–U):
//   Shipment Created → In Transit → Delivery Window Check → (Correction) →
//   Delivered → Check-In → Receiving → Closed → Reconciled
//   + FBA Stock Received (actual units in stock after reconcile)
//
// Col V: Status  |  Col W: Notes
// ================================================================

function buildShipments(sh) {
  const ROWS = 200;
  const COLS = 23;
  sh.setTabColor('#1E40AF');

  // Row 1: section banners
  sh.getRange(1, 1, 1, 4).merge()
    .setValue('📦 SHIPMENT INFO')
    .setBackground('#334155').setFontColor('#FFFFFF')
    .setFontWeight('bold').setHorizontalAlignment('center');

  sh.getRange(1, 5, 1, 4).merge()
    .setValue('🏭 CYCLE 2 — FORWARDER CHINA   |   Pickup → FW WH → Labels → Dispatch')
    .setBackground('#6D28D9').setFontColor('#FFFFFF')
    .setFontWeight('bold').setHorizontalAlignment('center');

  sh.getRange(1, 9, 1, 13).merge()
    .setValue('📦 CYCLE 3 — FBA   |   Created → Transit → Window → Delivered → Check-In → Receiving → Closed → Reconciled → Stock Received')
    .setBackground('#065F46').setFontColor('#FFFFFF')
    .setFontWeight('bold').setHorizontalAlignment('center');

  sh.getRange(1, 22, 1, 2).merge()
    .setValue('📋').setBackground(CLR.navyBg).setFontColor('#FFFFFF')
    .setHorizontalAlignment('center');
  sh.setRowHeight(1, 26);

  // Row 2: column headers
  const headers = [
    // Shipment Info (A-D)
    'Shipment ID', 'PO #', 'FBA\nReceiving Loc.', 'Units',
    // Cycle 2 — Forwarder (E-H)
    '📅 Pickup\nfrom Factory', '📅 Arrived\nFW WH', '📅 Labels\nApplied', '📅 Dispatched\nto FBA',
    // Cycle 3 — FBA (I-U)
    'FBA\nShipment #', '📅 Created\nin SC', '📅 In\nTransit',
    '📅 Del. Window\nStart', '📅 Del. Window\nEnd', 'Window\nCorrected?', '📅 New\nWindow End',
    '📅 Delivered', '📅 Check-In', '📅 Receiving', '📅 Closed', '📅 Reconciled',
    'FBA Stock\nReceived (units)',
    // Status + Notes (V-W)
    'Status', 'Notes',
  ];
  makeHeader(sh, 2, headers);
  sh.setRowHeight(2, 50);
  sh.setFrozenRows(2);

  [
    135, 110, 165, 65,
    110, 110, 100, 115,
    135, 110, 100,
    110, 110, 85, 110,
    100, 90, 100, 90, 110,
    100,
    150, 200,
  ].forEach((w, i) => sh.setColumnWidth(i + 1, w));

  // A, B: manual
  markInput(sh, 3, 1, ROWS, 2);

  // C: FBA Receiving Location — dropdown → Settings A22:A26
  markInput(sh, 3, 3, ROWS, 1);
  const settingsSh = sh.getParent().getSheetByName(TABS.SETTINGS);
  addRangeDropdown(sh, 3, 3, ROWS, settingsSh.getRange('A22:A26'));

  // D: Units
  markInput(sh, 3, 4, ROWS, 1);
  sh.getRange(3, 4, ROWS, 1).setNumberFormat('#,##0');

  // E-H: Forwarder dates (cols 5-8)
  [5, 6, 7, 8].forEach(col => setDateFmt(sh, 3, col, ROWS));

  // I: FBA Shipment # (col 9)
  markInput(sh, 3, 9, ROWS, 1);

  // J-T: FBA milestone dates (cols 10-20), except N (col 14) = checkbox
  for (let col = 10; col <= 20; col++) {
    if (col === 14) {
      sh.getRange(3, col, ROWS, 1)
        .insertCheckboxes()
        .setHorizontalAlignment('center')
        .setBackground(CLR.input);
    } else {
      setDateFmt(sh, 3, col, ROWS);
    }
  }

  // U: FBA Stock Received (col 21) — units after reconcile
  markInput(sh, 3, 21, ROWS, 1);
  sh.getRange(3, 21, ROWS, 1).setNumberFormat('#,##0').setHorizontalAlignment('center').setFontWeight('bold');

  // V: Status (col 22)
  markInput(sh, 3, 22, ROWS, 1);
  addListDropdown(sh, 3, 22, ROWS, SHIP_STATUS);

  // W: Notes (col 23)
  markInput(sh, 3, 23, ROWS, 1);

  stripedRows(sh, 3, ROWS, COLS);

  applyCf(sh, sh.getRange(3, 22, ROWS, 1), [
    { text: 'Pending Pickup',      bg: '#F1F5F9', fg: '#475569' },
    { text: 'At Forwarder WH',     bg: '#FEF9C3', fg: '#854D0E' },
    { text: 'Labels Applied',      bg: '#FEF3C7', fg: '#7C4D00' },
    { text: 'Dispatched',          bg: '#FED7AA', fg: '#9A3412' },
    { text: 'In Transit',          bg: '#FDE68A', fg: '#92400E' },
    { text: 'Window Check Needed', bg: '#FECACA', fg: '#991B1B' },
    { text: 'Delivered',           bg: '#BBF7D0', fg: '#14532D' },
    { text: 'Check-In',            bg: '#A7F3D0', fg: '#064E3B' },
    { text: 'Receiving',           bg: '#6EE7B7', fg: '#064E3B' },
    { text: 'Closed',              bg: '#D1FAE5', fg: '#065F46' },
    { text: 'Reconciled',          bg: '#ECFDF5', fg: '#022C22' },
    { text: 'Cancelled',           bg: '#E2E8F0', fg: '#475569' },
  ]);
}


// ================================================================
// 📊 PIPELINE DASHBOARD
// ================================================================

function buildDashboard(sh) {
  sh.setTabColor('#059669');

  sh.getRange(1, 1, 1, 8).merge()
    .setValue('📊 SC PIPELINE — STYLIA BEAUTY')
    .setBackground(CLR.navyBg).setFontColor('#FFFFFF')
    .setFontWeight('bold').setFontSize(14)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.setRowHeight(1, 42);

  [160, 55, 260, 24, 160, 55, 260, 24].forEach((w, i) => sh.setColumnWidth(i + 1, w));

  // ---- Production status ----
  sectionBanner(sh, 3, 1, 3, '🏭 CYCLE 1 — PRODUCTION STATUS', '#92400E');
  sh.getRange(4, 1, 1, 3).setValues([['Status', '#', 'PO Numbers']])
    .setBackground('#1E293B').setFontColor('#FFFFFF').setFontWeight('bold');

  const prodDefs = [
    { text: 'In Production', bg: '#FEF9C3', fg: '#854D0E' },
    { text: 'Goods Ready',   bg: '#FED7AA', fg: '#9A3412' },
    { text: 'Inspected',     bg: '#BBF7D0', fg: '#14532D' },
    { text: 'Pickup Agreed', bg: '#BFDBFE', fg: '#1E3A8A' },
    { text: 'Picked Up',     bg: '#D1FAE5', fg: '#064E3B' },
    { text: 'Cancelled',     bg: '#E2E8F0', fg: '#475569' },
  ];
  prodDefs.forEach((d, i) => {
    const row = 5 + i;
    sh.getRange(row, 1).setValue(d.text).setBackground(d.bg).setFontColor(d.fg).setFontWeight('bold');
    sh.getRange(row, 2)
      .setFormula(`=COUNTIF('🏭 Production'!L$3:L$102,"${d.text}")`)
      .setBackground(CLR.formula).setHorizontalAlignment('center').setFontWeight('bold');
    sh.getRange(row, 3)
      .setFormula(`=IFERROR(TEXTJOIN(", ",TRUE,FILTER('🏭 Production'!A$3:A$102,'🏭 Production'!L$3:L$102="${d.text}")),"—")`)
      .setBackground(CLR.formula);
  });
  markFormula(sh, 5, 2, 6, 1);
  markFormula(sh, 5, 3, 6, 1);

  // ---- Shipment status ----
  sectionBanner(sh, 3, 5, 3, '🚢 CYCLE 2+3 — SHIPMENT STATUS', '#1E40AF');
  sh.getRange(4, 5, 1, 3).setValues([['Status', '#', 'Shipment IDs']])
    .setBackground('#1E293B').setFontColor('#FFFFFF').setFontWeight('bold');

  const shipDefs = [
    { text: 'Pending Pickup',      bg: '#F1F5F9', fg: '#475569' },
    { text: 'At Forwarder WH',     bg: '#FEF9C3', fg: '#854D0E' },
    { text: 'Labels Applied',      bg: '#FEF3C7', fg: '#7C4D00' },
    { text: 'Dispatched',          bg: '#FED7AA', fg: '#9A3412' },
    { text: 'In Transit',          bg: '#FDE68A', fg: '#92400E' },
    { text: 'Window Check Needed', bg: '#FECACA', fg: '#991B1B' },
    { text: 'Delivered',           bg: '#BBF7D0', fg: '#14532D' },
    { text: 'Check-In',            bg: '#A7F3D0', fg: '#064E3B' },
    { text: 'Receiving',           bg: '#6EE7B7', fg: '#064E3B' },
    { text: 'Closed',              bg: '#D1FAE5', fg: '#065F46' },
    { text: 'Reconciled',          bg: '#ECFDF5', fg: '#022C22' },
    { text: 'Cancelled',           bg: '#E2E8F0', fg: '#475569' },
  ];
  shipDefs.forEach((d, i) => {
    const row = 5 + i;
    sh.getRange(row, 5).setValue(d.text).setBackground(d.bg).setFontColor(d.fg).setFontWeight('bold');
    sh.getRange(row, 6)
      .setFormula(`=COUNTIF('🚢 Shipments'!V$3:V$202,"${d.text}")`)
      .setBackground(CLR.formula).setHorizontalAlignment('center').setFontWeight('bold');
    sh.getRange(row, 7)
      .setFormula(`=IFERROR(TEXTJOIN(", ",TRUE,FILTER('🚢 Shipments'!A$3:A$202,'🚢 Shipments'!V$3:V$202="${d.text}")),"—")`)
      .setBackground(CLR.formula);
  });
  markFormula(sh, 5, 6, 12, 1);
  markFormula(sh, 5, 7, 12, 1);

  // ---- Alerts ----
  sh.getRange(18, 1, 1, 7).merge()
    .setValue('🔴  ATTENTION — Window Check Needed:')
    .setBackground('#FEE2E2').setFontColor('#991B1B').setFontWeight('bold');
  sh.setRowHeight(18, 28);

  sh.getRange(19, 1, 1, 7).merge()
    .setFormula(`=IFERROR(TEXTJOIN(", ",TRUE,FILTER('🚢 Shipments'!A$3:A$202,'🚢 Shipments'!V$3:V$202="Window Check Needed")),"✅ None")`)
    .setBackground(CLR.formula);
  markFormula(sh, 19, 1, 1, 7);
  sh.setRowHeight(19, 28);

  // ---- Legend ----
  sh.getRange(21, 1, 1, 7).merge()
    .setValue('🟡 Yellow = manual input   |   🔵 Blue = auto-calculated   |   📦 Stock tab is the main metric — update FBA Stock after every Seller Central sync')
    .setFontStyle('italic').setFontColor('#64748B').setWrap(true);
  sh.setRowHeight(21, 32);
}


// ================================================================
// MENU
// ================================================================

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🚢 Stylia SC')
    .addItem('↻ Recreate All Tabs', 'createSystem')
    .addSeparator()
    .addItem('📦 Stock (main)', 'goStock')
    .addItem('📊 Pipeline Dashboard', 'goPipeline')
    .addItem('🏭 Production (Cycle 1)', 'goProduction')
    .addItem('🚢 Shipments (Cycle 2+3)', 'goShipments')
    .addSeparator()
    .addItem('⚙️ Settings', 'goSettings')
    .addToUi();
}

function goStock()      { SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TABS.STOCK).activate(); }
function goPipeline()   { SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TABS.DASHBOARD).activate(); }
function goProduction() { SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TABS.PRODUCTION).activate(); }
function goShipments()  { SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TABS.SHIPMENTS).activate(); }
function goSettings()   { SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TABS.SETTINGS).activate(); }


// ================================================================
// onEdit TRIGGERS
//
// 1. 📦 Stock (col C = FBA Stock) → auto-timestamp col D (Updated)
// 2. 🚢 Shipments (col H = Dispatched) → auto-fill col K (In Transit)
// ================================================================

function onEdit(e) {
  const sh  = e.range.getSheet();
  const row = e.range.getRow();
  const col = e.range.getColumn();
  const name = sh.getName();

  // Stock tab: col C (FBA Stock, col 3) → timestamp col D (col 4)
  if (name === TABS.STOCK && col === 3 && row >= 3 && row <= 17) {
    sh.getRange(row, 4)
      .setValue(new Date())
      .setNumberFormat('dd MMM HH:mm');
    return;
  }

  // Shipments tab: col H (Dispatched, col 8) → auto-fill col K (In Transit, col 11)
  if (name === TABS.SHIPMENTS && col === 8 && row >= 3 && e.value) {
    const kCell = sh.getRange(row, 11);
    if (!kCell.getValue()) {
      kCell.setValue(new Date(e.value)).setNumberFormat('dd MMM yyyy');
    }
  }
}
