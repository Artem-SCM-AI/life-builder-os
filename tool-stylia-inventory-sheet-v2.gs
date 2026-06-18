// ================================================================
// STYLIA BEAUTY — INVENTORY MANAGEMENT SYSTEM v2
// Google Apps Script — May 2026
//
// Run: Extensions → Apps Script → createInventorySystem() → Run
//
// 8 tabs (left → right):
//   📊 Dashboard   — morning view: FBA health + weekly action
//   📦 FBA Stock   — inventory per SKU + velocity
//   🚢 Shipments   — weekly FW→FBA shipments + delivery windows
//   🗃️ Items       — SKU breakdown per shipment
//   🏭 Forwarder   — China forwarder stock + batch log
//   🏗️ Production  — manufacturing orders
//   📈 Forecast    — monthly sales forecast 6/9/12m rolling
//   ⚙️ Settings    — SKUs, lead times, targets, FBA locations
//
// Supply chain model:
//   Production (30d) → Forwarder WH China → Ocean (35d) →
//   Amazon Receiving (20d) → FBA
//   Weekly replenishment: ship = MAX(0, FBA_target − (FBA + in_transit))
//
// Colors:
//   🟡 #FFF9C4  manual input
//   🔵 #DBEAFE  formula / protected (read-only)
//   ⬛ #0F1629  headers
// ================================================================


// ── CONSTANTS ────────────────────────────────────────────────────

const SH = {
  DASHBOARD:  '📊 Dashboard',
  FBA:        '📦 FBA Stock',
  SHIPMENTS:  '🚢 Shipments',
  ITEMS:      '🗃️ Items',
  FORWARDER:  '🏭 Forwarder',
  PRODUCTION: '🏗️ Production',
  FORECAST:   '📈 Forecast',
  SETTINGS:   '⚙️ Settings',
};

const C = {
  navy:    '#0F1629',
  white:   '#FFFFFF',
  input:   '#FFF9C4',
  formula: '#DBEAFE',
  alt:     '#F8FAFC',
  actual:  '#F1F5F9',  // past months in Forecast
};

const LEAD = {
  production:  30,
  domestic:     3,   // factory → forwarder (China)
  ocean:        35,
  receiving:    20,
  pipeline:     55,  // ocean + receiving
  prodReorder:  33,  // production reorder trigger (30+3)
  fwWarn:       35,  // forwarder storage warning (days)
  fwCrit:       42,  // forwarder storage critical (days)
};

const DOS = {
  bestseller: 90,
  standard:   60,
  totalSC:    120,
  critical:   14,
  watch:      30,
};

const SKU_TYPES    = ['Bestseller', 'Standard', 'Dead'];
const SHIP_STATUS  = ['Planned', 'Label Sent', 'At Forwarder', 'In Transit',
                      'Delivered', 'Receiving', 'Closed', 'Cancelled'];
const PROD_STATUS  = ['Planned', 'In Production', 'Ready',
                      'Shipped to FW', 'At Forwarder', 'Cancelled'];

const SKU_ROWS = 15;   // max SKUs in Settings


// ── ENTRY POINT ──────────────────────────────────────────────────

function createInventorySystem() {
  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const ui  = SpreadsheetApp.getUi();

  const res = ui.alert(
    '🚀 Stylia Inventory v2',
    'Recreates all 8 tabs. Existing data will be lost. Continue?',
    ui.ButtonSet.YES_NO
  );
  if (res !== ui.Button.YES) return;

  // Temp sheet prevents "can't remove all sheets" error
  const tmp = ss.insertSheet('__tmp__');

  // Delete existing tabs
  Object.values(SH).forEach(name => {
    const s = ss.getSheetByName(name);
    if (s) ss.deleteSheet(s);
  });

  // Insert in reverse order (insertSheet at 0 → correct left-to-right order)
  [SH.SETTINGS, SH.FORECAST, SH.PRODUCTION, SH.FORWARDER,
   SH.ITEMS, SH.SHIPMENTS, SH.FBA, SH.DASHBOARD]
    .forEach(name => ss.insertSheet(name, 0));

  ss.deleteSheet(tmp);

  buildSettings(ss);
  buildForecast(ss);
  buildProduction(ss);
  buildForwarder(ss);
  buildItems(ss);
  buildShipments(ss);
  buildFBAStock(ss);
  buildDashboard(ss);

  ss.setActiveSheet(ss.getSheetByName(SH.DASHBOARD));
  SpreadsheetApp.flush();

  ui.alert(
    '✅ Done — Stylia Inventory v2',
    'Start here:\n\n' +
    '1. ⚙️ Settings   → fill 15 SKUs + FBA receiving locations\n' +
    '2. 📈 Forecast   → add monthly forecast (sales team)\n' +
    '3. 📦 FBA Stock  → import FBA inventory CSV\n' +
    '4. 🏭 Forwarder  → enter current forwarder stock\n' +
    '5. 📊 Dashboard  → check status and weekly action',
    ui.ButtonSet.OK
  );
}


// ── MENU & TRIGGERS ──────────────────────────────────────────────

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🚢 Stylia SC')
    .addItem('↻ Recreate All Tabs', 'createInventorySystem')
    .addSeparator()
    .addItem('📦 Import FBA Stock from Drive', 'importFBAStock')
    .addSeparator()
    .addItem('📊 Dashboard',         'goDashboard')
    .addItem('📦 FBA Stock',         'goFBA')
    .addItem('🚢 Shipments',         'goShipments')
    .addItem('🏭 Forwarder',         'goForwarder')
    .addItem('🏗️ Production',       'goProduction')
    .addItem('📈 Forecast',          'goForecast')
    .addItem('⚙️ Settings',         'goSettings')
    .addToUi();
}

function goDashboard()  { SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SH.DASHBOARD).activate(); }
function goFBA()        { SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SH.FBA).activate(); }
function goShipments()  { SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SH.SHIPMENTS).activate(); }
function goForwarder()  { SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SH.FORWARDER).activate(); }
function goProduction() { SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SH.PRODUCTION).activate(); }
function goForecast()   { SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SH.FORECAST).activate(); }
function goSettings()   { SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SH.SETTINGS).activate(); }

function onEdit(e) {
  const sh   = e.range.getSheet();
  const col  = e.range.getColumn();
  const row  = e.range.getRow();
  const name = sh.getName();

  // FBA Stock: edit col B (FBA Stock) → auto-timestamp col K
  if (name === SH.FBA && col === 2 && row >= 2 && row <= SKU_ROWS + 1) {
    sh.getRange(row, 11)
      .setValue(new Date())
      .setNumberFormat('dd MMM HH:mm');
    return;
  }

  // Shipments: edit col P (Status) → auto-timestamp col Q
  if (name === SH.SHIPMENTS && col === 16 && row >= 3) {
    sh.getRange(row, 17)
      .setValue(new Date())
      .setNumberFormat('dd MMM HH:mm');
    return;
  }
}


// ── HELPERS ──────────────────────────────────────────────────────

function hdr(sh, row, labels, bg, fg) {
  const r = sh.getRange(row, 1, 1, labels.length);
  r.setValues([labels])
   .setBackground(bg || C.navy)
   .setFontColor(fg || C.white)
   .setFontWeight('bold')
   .setHorizontalAlignment('center')
   .setVerticalAlignment('middle')
   .setWrap(true);
  sh.setRowHeight(row, 44);
  return r;
}

function banner(sh, row, col, span, text, bg) {
  const r = sh.getRange(row, col, 1, span);
  if (span > 1) r.merge();
  r.setValue(text)
   .setBackground(bg || '#334155')
   .setFontColor(C.white)
   .setFontWeight('bold')
   .setHorizontalAlignment('center')
   .setVerticalAlignment('middle');
  sh.setRowHeight(row, 24);
  return r;
}

function inp(sh, row, col, rows, cols) {
  sh.getRange(row, col, rows || 1, cols || 1).setBackground(C.input);
}

function fml(sh, row, col, rows, cols) {
  const r = sh.getRange(row, col, rows || 1, cols || 1);
  r.setBackground(C.formula);
  r.protect().setDescription('formula').setWarningOnly(true);
  return r;
}

function drop(sh, row, col, rows, values) {
  sh.getRange(row, col, rows, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(values, true)
      .setAllowInvalid(false)
      .build()
  );
}

function rangeDrop(sh, row, col, rows, srcRange) {
  sh.getRange(row, col, rows, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInRange(srcRange, true)
      .setAllowInvalid(true)
      .build()
  );
}

function dateFmt(sh, row, col, rows) {
  sh.getRange(row, col, rows, 1)
    .setNumberFormat('dd MMM yyyy')
    .setBackground(C.input);
}

function altRows(sh, startRow, numRows, numCols) {
  const a1s = [];
  for (let i = 1; i < numRows; i += 2) {
    a1s.push(`A${startRow + i}:${colLtr(numCols)}${startRow + i}`);
  }
  if (a1s.length) sh.getRangeList(a1s).setBackground(C.alt);
}

function colLtr(n) {
  let s = '';
  while (n > 0) {
    s = String.fromCharCode(64 + (n % 26 || 26)) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function setCf(sh, cfDefs) {
  // cfDefs: [{range, rules: [{type:'text'|'formula'|'gt'|'eq', val, bg, fg, bold}]}]
  const all = [];
  cfDefs.forEach(({ range, rules }) => {
    rules.forEach(r => {
      let b = SpreadsheetApp.newConditionalFormatRule();
      if (r.type === 'text')    b = b.whenTextEqualTo(r.val);
      if (r.type === 'formula') b = b.whenFormulaSatisfied(r.val);
      if (r.type === 'gt')      b = b.whenNumberGreaterThan(r.val);
      if (r.type === 'eq')      b = b.whenNumberEqualTo(r.val);
      if (r.type === 'lt')      b = b.whenNumberLessThan(r.val);
      b = b.setBackground(r.bg);
      if (r.fg)   b = b.setFontColor(r.fg);
      if (r.bold) b = b.setBold(true);
      all.push(b.setRanges([range]).build());
    });
  });
  sh.setConditionalFormatRules(all);
}

function batchFormulas(sh, startRow, col, formulas) {
  sh.getRange(startRow, col, formulas.length, 1)
    .setFormulas(formulas.map(f => [f]));
}


// ── ⚙️ SETTINGS ──────────────────────────────────────────────────
//
// Col:  A          B             C          D         E          F              G
//       SKU ID     Product Name  Category   SKU Type  Avg Price  FBA Target DOS Notes
//
// Sections:
//   Rows  1:    Title
//   Rows  3–19: SKU Master (15 rows)
//   Rows 22–29: Lead Times
//   Rows 32–40: FBA Inventory Targets
//   Rows 43–54: FBA Receiving Locations (10 rows)
//   Rows 57–61: Forwarder Details
//   Rows 64–68: Import Settings

function buildSettings(ss) {
  const sh = ss.getSheetByName(SH.SETTINGS);
  sh.setTabColor('#64748B');

  // Title
  sh.getRange(1, 1, 1, 7).merge()
    .setValue('⚙️ SETTINGS — STYLIA BEAUTY v2')
    .setBackground(C.navy).setFontColor(C.white)
    .setFontWeight('bold').setFontSize(12)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.setRowHeight(1, 32);

  // ── SKU Master ──────────────────────────────────────────────
  banner(sh, 2, 1, 7, '📦 SKU MASTER LIST', '#1E40AF');
  hdr(sh, 3, ['SKU ID', 'Product Name', 'Category', 'SKU Type', 'Avg Price ($)', 'FBA Target DOS', 'Notes'], '#1E293B');
  sh.setRowHeight(3, 32);

  inp(sh, 4, 1, SKU_ROWS, 3);                           // A-C: manual
  drop(sh, 4, 4, SKU_ROWS, SKU_TYPES);                  // D: SKU Type dropdown
  inp(sh, 4, 4, SKU_ROWS, 1);                           // D: also yellow

  sh.getRange(4, 5, SKU_ROWS, 1)
    .setNumberFormat('"$"#,##0.00')
    .setBackground(C.input);                             // E: Avg Price

  // F: FBA Target DOS — formula from SKU Type
  const tgtF = [];
  for (let i = 0; i < SKU_ROWS; i++) {
    const r = i + 4;
    tgtF.push([`=IF(D${r}="Bestseller",${DOS.bestseller},IF(D${r}="Standard",${DOS.standard},0))`]);
  }
  sh.getRange(4, 6, SKU_ROWS, 1).setFormulas(tgtF).setNumberFormat('0');
  fml(sh, 4, 6, SKU_ROWS, 1);

  inp(sh, 4, 7, SKU_ROWS, 1);                           // G: Notes
  altRows(sh, 4, SKU_ROWS, 7);
  sh.setFrozenRows(3);

  // ── Lead Times ──────────────────────────────────────────────
  banner(sh, 21, 1, 3, '⏱️ LEAD TIMES (days)', '#065F46');
  hdr(sh, 22, ['Parameter', 'Days', 'Notes'], '#1E293B');
  sh.setRowHeight(22, 28);

  const leadRows = [
    ['Production',                      LEAD.production,  'factory → goods ready'],
    ['China domestic (factory → FW WH)',LEAD.domestic,    'trucking to forwarder'],
    ['Ocean transit',                   LEAD.ocean,       'China port → USA port'],
    ['Amazon receiving',                LEAD.receiving,   'port → FBA shelf'],
    ['',                                '',               ''],
    ['Total FW→FBA pipeline',          `=${LEAD.ocean}+${LEAD.receiving}`, '= Ocean + Receiving'],
    ['Production reorder trigger',     `=${LEAD.production}+${LEAD.domestic}`, '= Production + Domestic'],
  ];
  sh.getRange(23, 1, leadRows.length, 3).setValues(leadRows);
  fml(sh, 28, 2, 1, 1);  // Total pipeline formula cell
  fml(sh, 29, 2, 1, 1);  // Reorder trigger formula cell
  sh.getRange(23, 2, leadRows.length, 1).setHorizontalAlignment('center').setFontWeight('bold');

  // ── Inventory Targets ────────────────────────────────────────
  banner(sh, 31, 1, 3, '🎯 INVENTORY TARGETS', '#7C3AED');
  hdr(sh, 32, ['Target', 'Value (DOS)', 'Description'], '#1E293B');
  sh.setRowHeight(32, 28);

  const tgtRows = [
    ['Bestseller FBA Target',    DOS.bestseller, 'TikTok spike buffer'],
    ['Standard FBA Target',      DOS.standard,   'regular SKUs'],
    ['Total SC Target (all loc)',DOS.totalSC,    'FBA + in transit + forwarder'],
    ['CRITICAL threshold',       DOS.critical,   'FBA DOS below this → red alert'],
    ['WATCH threshold',          DOS.watch,      'FBA DOS below this → yellow alert'],
    ['Forwarder WARNING',        LEAD.fwWarn,    'days stored → ⚠️ warning'],
    ['Forwarder CRITICAL',       LEAD.fwCrit,    'days stored → 🔴 critical'],
  ];
  sh.getRange(33, 1, tgtRows.length, 3).setValues(tgtRows);
  sh.getRange(33, 2, tgtRows.length, 1).setHorizontalAlignment('center').setFontWeight('bold');

  // ── FBA Receiving Locations ──────────────────────────────────
  banner(sh, 42, 1, 5, '📍 FBA RECEIVING LOCATIONS', '#92400E');
  hdr(sh, 43, ['Code', 'Warehouse Name', 'State', 'Port (WC/EC)', 'Avg Days from Port'], '#1E293B');
  sh.setRowHeight(43, 28);
  inp(sh, 44, 1, 10, 5);
  altRows(sh, 44, 10, 5);

  // ── Forwarder Details ────────────────────────────────────────
  banner(sh, 56, 1, 3, '🏭 FORWARDER DETAILS', '#0F4C75');
  hdr(sh, 57, ['Field', 'Value', 'Notes'], '#1E293B');
  sh.setRowHeight(57, 28);
  const fwRows = [
    ['Forwarder Name',    '', ''],
    ['Contact Person',    '', ''],
    ['Address',           '', ''],
    ['Max Storage (days)',LEAD.fwCrit, 'contractual, can extend'],
    ['Storage Cost',      '', '$/CBM/day'],
  ];
  sh.getRange(58, 1, fwRows.length, 3).setValues(fwRows);
  inp(sh, 58, 2, fwRows.length, 1);

  // ── Import Settings ──────────────────────────────────────────
  banner(sh, 65, 1, 3, '📥 CSV IMPORT SETTINGS', '#374151');
  hdr(sh, 66, ['Source', 'Google Drive URL or File ID', 'Notes'], '#1E293B');
  sh.setRowHeight(66, 28);
  const impRows = [
    ['FBA Inventory CSV',  '', 'Seller Central → FBA Manage Inventory → Download'],
    ['Sales Report CSV',   '', '(optional) for future automation'],
  ];
  sh.getRange(67, 1, impRows.length, 3).setValues(impRows);
  inp(sh, 67, 2, impRows.length, 1);

  // Column widths
  [130, 240, 130, 110, 100, 110, 200].forEach((w, i) => sh.setColumnWidth(i + 1, w));
}


// ── 📈 FORECAST ───────────────────────────────────────────────────
//
// Structure:
//   Rows 1:     Title
//   Row  2:     Column headers
//   Rows 3–17:  15 SKU rows
//   Row  18:    TOTAL row
//
// Cols:
//   A   SKU (formula from Settings)
//   B   Product (formula from Settings)
//   C   SKU Type (formula from Settings)
//   D–F Past 3 months — actuals (manual, grey)
//   G–R Future 12 months — forecast (manual, yellow)
//   S   Avg Monthly (formula, future months only)
//   T   Daily Velocity (formula = S/30)
//   U   6m Total
//   V   9m Total
//   W   12m Total

function buildForecast(ss) {
  const sh = ss.getSheetByName(SH.FORECAST);
  sh.setTabColor('#7C3AED');

  const tz    = Session.getScriptTimeZone();
  const today = new Date();

  const PAST        = 3;
  const FUTURE      = 12;
  const M_START_COL = 4;   // col D
  const AVG_COL     = M_START_COL + PAST + FUTURE;       // col S = 19
  const VEL_COL     = AVG_COL + 1;                       // T = 20
  const SUM6_COL    = VEL_COL + 1;                       // U = 21
  const SUM9_COL    = SUM6_COL + 1;                      // V = 22
  const SUM12_COL   = SUM9_COL + 1;                      // W = 23
  const TOTAL_COLS  = SUM12_COL;

  // Title — split at freeze boundary (col 3) to allow setFrozenColumns(3)
  sh.getRange(1, 1, 1, 3).merge()
    .setValue('📈 SALES FORECAST — STYLIA BEAUTY')
    .setBackground(C.navy).setFontColor(C.white)
    .setFontWeight('bold').setFontSize(12)
    .setHorizontalAlignment('left').setVerticalAlignment('middle');
  sh.getRange(1, 4, 1, TOTAL_COLS - 3).merge()
    .setBackground(C.navy);
  sh.setRowHeight(1, 32);

  // Month header labels
  const monthLabels = [];
  for (let i = -PAST; i < FUTURE; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    monthLabels.push(Utilities.formatDate(d, tz, 'MMM yyyy'));
  }

  const headers = ['SKU', 'Product', 'Type',
    ...monthLabels,
    'Avg\nMonthly', 'Daily\nVelocity', '6m\nTotal', '9m\nTotal', '12m\nTotal'];
  hdr(sh, 2, headers);

  // Mark current month column header
  sh.getRange(2, M_START_COL + PAST)
    .setBackground('#1E40AF')
    .setFontColor(C.white);

  sh.setFrozenRows(2);
  sh.setFrozenColumns(3);

  const DATA_START  = 3;
  const FUTURE_COL  = M_START_COL + PAST;  // col G = 7 (first future month)

  // SKU rows: A-C from Settings
  const aF = [], bF = [], cF = [];
  for (let i = 0; i < SKU_ROWS; i++) {
    const sr = i + 4;
    aF.push([`='⚙️ Settings'!A${sr}`]);
    bF.push([`='⚙️ Settings'!B${sr}`]);
    cF.push([`='⚙️ Settings'!D${sr}`]);
  }
  sh.getRange(DATA_START, 1, SKU_ROWS, 1).setFormulas(aF);
  sh.getRange(DATA_START, 2, SKU_ROWS, 1).setFormulas(bF);
  sh.getRange(DATA_START, 3, SKU_ROWS, 1).setFormulas(cF);
  fml(sh, DATA_START, 1, SKU_ROWS, 3);

  // Past 3 months: grey manual
  sh.getRange(DATA_START, M_START_COL, SKU_ROWS, PAST)
    .setBackground(C.actual)
    .setNumberFormat('#,##0');
  // Future 12 months: yellow manual
  sh.getRange(DATA_START, FUTURE_COL, SKU_ROWS, FUTURE)
    .setBackground(C.input)
    .setNumberFormat('#,##0');

  const futureLtr    = colLtr(FUTURE_COL);
  const futureEndLtr = colLtr(FUTURE_COL + FUTURE - 1);
  const fut6Ltr      = colLtr(FUTURE_COL + 5);
  const fut9Ltr      = colLtr(FUTURE_COL + 8);
  const avgLtr       = colLtr(AVG_COL);
  const velLtr       = colLtr(VEL_COL);
  const s6Ltr        = colLtr(SUM6_COL);
  const s9Ltr        = colLtr(SUM9_COL);
  const s12Ltr       = colLtr(SUM12_COL);

  const avgF=[], velF=[], s6F=[], s9F=[], s12F=[];
  for (let i = 0; i < SKU_ROWS; i++) {
    const r = i + DATA_START;
    avgF.push ([`=IFERROR(IF(COUNTA(${futureLtr}${r}:${futureEndLtr}${r})=0,"",AVERAGE(${futureLtr}${r}:${futureEndLtr}${r})),"")`]);
    velF.push ([`=IFERROR(IF(${avgLtr}${r}="","",ROUND(${avgLtr}${r}/30,1)),"")`]);
    s6F.push  ([`=IFERROR(SUM(${futureLtr}${r}:${fut6Ltr}${r}),"")`]);
    s9F.push  ([`=IFERROR(SUM(${futureLtr}${r}:${fut9Ltr}${r}),"")`]);
    s12F.push ([`=IFERROR(SUM(${futureLtr}${r}:${futureEndLtr}${r}),"")`]);
  }
  sh.getRange(DATA_START, AVG_COL,  SKU_ROWS, 1).setFormulas(avgF).setNumberFormat('#,##0');
  sh.getRange(DATA_START, VEL_COL,  SKU_ROWS, 1).setFormulas(velF).setNumberFormat('0.00');
  sh.getRange(DATA_START, SUM6_COL, SKU_ROWS, 1).setFormulas(s6F) .setNumberFormat('#,##0');
  sh.getRange(DATA_START, SUM9_COL, SKU_ROWS, 1).setFormulas(s9F) .setNumberFormat('#,##0');
  sh.getRange(DATA_START, SUM12_COL,SKU_ROWS, 1).setFormulas(s12F).setNumberFormat('#,##0');
  fml(sh, DATA_START, AVG_COL, SKU_ROWS, 5);

  // TOTAL row
  const TOT = DATA_START + SKU_ROWS;
  sh.getRange(TOT, 1).setValue('TOTAL').setFontWeight('bold');
  // Sum all month columns and summary cols
  for (let col = M_START_COL; col <= TOTAL_COLS; col++) {
    const ltr = colLtr(col);
    sh.getRange(TOT, col)
      .setFormula(`=IFERROR(SUM(${ltr}${DATA_START}:${ltr}${TOT-1}),"")`)
      .setFontWeight('bold')
      .setBackground(col < FUTURE_COL ? C.actual : col <= FUTURE_COL+FUTURE-1 ? C.input : C.formula);
  }

  altRows(sh, DATA_START, SKU_ROWS, TOTAL_COLS);

  // Column widths
  sh.setColumnWidth(1, 110);
  sh.setColumnWidth(2, 200);
  sh.setColumnWidth(3, 100);
  for (let i = M_START_COL; i <= FUTURE_COL + FUTURE - 1; i++) sh.setColumnWidth(i, 72);
  [AVG_COL, VEL_COL, SUM6_COL, SUM9_COL, SUM12_COL].forEach(c => sh.setColumnWidth(c, 80));
}


// ── 🏗️ PRODUCTION ────────────────────────────────────────────────
//
// Cols:
//   A  PO #         B  SKU            C  Product Name   D  Qty Ordered
//   E  Order Date   F  Expected Ready G  Actual Ready   H  Shipped to FW
//   I  Exp. at FW   J  Actual at FW   K  Forecast Month L  Status
//   M  Days Open    N  Notes

function buildProduction(ss) {
  const sh   = ss.getSheetByName(SH.PRODUCTION);
  const ROWS = 100;
  const COLS = 14;
  sh.setTabColor('#92400E');

  banner(sh, 1, 1, COLS,
    '🏗️ PRODUCTION ORDERS   |   Order → Production (30d) → Ready → Shipped to Forwarder (3d) → At Forwarder',
    '#92400E');

  hdr(sh, 2, [
    'PO #', 'SKU', 'Product Name', 'Qty\nOrdered',
    '📅 Order\nDate', '📅 Exp.\nReady', '📅 Actual\nReady', '📅 Shipped\nto FW',
    '📅 Exp.\nat FW', '📅 Actual\nat FW', 'Forecast\nMonth',
    'Status', 'Days\nOpen', 'Notes',
  ]);
  sh.setFrozenRows(2);

  const settingsSh = ss.getSheetByName(SH.SETTINGS);

  inp(sh, 3, 1, ROWS, 1);               // A: PO #
  rangeDrop(sh, 3, 2, ROWS, settingsSh.getRange('A4:A18'));  // B: SKU dropdown
  inp(sh, 3, 4, ROWS, 1);               // D: Qty
  dateFmt(sh, 3, 5, ROWS);              // E: Order Date
  dateFmt(sh, 3, 7, ROWS);              // G: Actual Ready
  dateFmt(sh, 3, 8, ROWS);              // H: Shipped to FW
  dateFmt(sh, 3, 10, ROWS);             // J: Actual at FW
  inp(sh, 3, 11, ROWS, 1);              // K: Forecast Month
  drop(sh, 3, 12, ROWS, PROD_STATUS);   // L: Status
  inp(sh, 3, 12, ROWS, 1);
  inp(sh, 3, 14, ROWS, 1);              // N: Notes

  // Formulas
  const cF=[], fF=[], iF=[], mF=[];
  for (let i = 0; i < ROWS; i++) {
    const r = i + 3;
    cF.push([`=IFERROR(IF(B${r}="","",VLOOKUP(B${r},'⚙️ Settings'!$A:$B,2,0)),"")`]);
    fF.push([`=IFERROR(IF(E${r}="","",E${r}+${LEAD.production}),"")`]);
    iF.push([`=IFERROR(IF(H${r}="","",H${r}+${LEAD.domestic}),"")`]);
    mF.push([`=IFERROR(IF(OR(L${r}="At Forwarder",L${r}="Cancelled",E${r}=""),"",TODAY()-E${r}),"")`]);
  }
  sh.getRange(3, 3, ROWS, 1).setFormulas(cF);   // C: Product Name
  sh.getRange(3, 6, ROWS, 1).setFormulas(fF).setNumberFormat('dd MMM yyyy');   // F: Exp. Ready
  sh.getRange(3, 9, ROWS, 1).setFormulas(iF).setNumberFormat('dd MMM yyyy');   // I: Exp. at FW
  sh.getRange(3, 13, ROWS, 1).setFormulas(mF).setNumberFormat('0');            // M: Days Open
  fml(sh, 3, 3, ROWS, 1);
  fml(sh, 3, 6, ROWS, 1);
  fml(sh, 3, 9, ROWS, 1);
  fml(sh, 3, 13, ROWS, 1);

  altRows(sh, 3, ROWS, COLS);

  // CF: Status column (L = col 12)
  setCf(sh, [{
    range: sh.getRange(3, 12, ROWS, 1),
    rules: [
      { type:'text', val:'Planned',       bg:'#F1F5F9', fg:'#475569' },
      { type:'text', val:'In Production', bg:'#FEF9C3', fg:'#854D0E' },
      { type:'text', val:'Ready',         bg:'#BBF7D0', fg:'#14532D' },
      { type:'text', val:'Shipped to FW', bg:'#FED7AA', fg:'#9A3412' },
      { type:'text', val:'At Forwarder',  bg:'#BFDBFE', fg:'#1E3A8A' },
      { type:'text', val:'Cancelled',     bg:'#E2E8F0', fg:'#475569' },
    ],
  }]);

  // CF: Days Open > 60 → orange, > 90 → red
  const doCf = sh.getConditionalFormatRules();
  doCf.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(90).setBackground('#FECACA').setFontColor('#991B1B')
      .setRanges([sh.getRange(3, 13, ROWS, 1)]).build()
  );
  doCf.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(60).setBackground('#FED7AA').setFontColor('#9A3412')
      .setRanges([sh.getRange(3, 13, ROWS, 1)]).build()
  );
  sh.setConditionalFormatRules(doCf);

  [100, 120, 200, 80, 105, 105, 105, 110, 105, 105, 115, 135, 75, 200]
    .forEach((w, i) => sh.setColumnWidth(i + 1, w));
}


// ── 🏭 FORWARDER ─────────────────────────────────────────────────
//
// Section A: SKU Balance (rows 3–17)
//   A  SKU   B  Product   C  ★ Forwarder Stock (manual)   D  Velocity
//   E  Forwarder DOS   F  Oldest Batch Age (days)   G  Storage Status
//   H  Next Production Arrival   I  Incoming Units   J  Last Sync   K  Notes
//
// Section B: Batch Arrival Log (rows 22+)
//   A  Batch ID   B  PO #   C  SKU   D  Units Arrived
//   E  Arrival Date   F  Days Stored   G  Storage Status   H  Notes

function buildForwarder(ss) {
  const sh = ss.getSheetByName(SH.FORWARDER);
  sh.setTabColor('#065F46');

  // ── Section A: SKU Balance ──
  banner(sh, 1, 1, 11,
    '🏭 FORWARDER WAREHOUSE — CHINA   |   Manual sync with forwarder (weekly)   |   ⚠️ 45-day storage limit',
    '#065F46');
  hdr(sh, 2, [
    'SKU', 'Product', '★ FW Stock\n(units)', 'Daily\nVelocity',
    'FW DOS', 'Oldest Batch\nAge (days)', 'Storage\nStatus',
    'Next Prod.\nArrival', 'Incoming\nUnits', 'Last\nSync', 'Notes',
  ]);
  sh.setFrozenRows(2);

  const settingsSh  = ss.getSheetByName(SH.SETTINGS);
  const productionSh = ss.getSheetByName(SH.PRODUCTION);

  // Col A: SKU from Settings, Col B: Product from Settings
  const aF=[], bF=[];
  for (let i = 0; i < SKU_ROWS; i++) {
    const sr = i + 4;
    aF.push([`='⚙️ Settings'!A${sr}`]);
    bF.push([`='⚙️ Settings'!B${sr}`]);
  }
  sh.getRange(3, 1, SKU_ROWS, 1).setFormulas(aF);
  sh.getRange(3, 2, SKU_ROWS, 1).setFormulas(bF);
  fml(sh, 3, 1, SKU_ROWS, 2);

  inp(sh, 3, 3, SKU_ROWS, 1);  // C: FW Stock — manual after weekly sync
  sh.getRange(3, 3, SKU_ROWS, 1).setNumberFormat('#,##0').setFontWeight('bold').setFontSize(11);

  // Formulas D–I
  const dF=[], eF=[], fF=[], gF=[], hF=[], iF=[];
  for (let i = 0; i < SKU_ROWS; i++) {
    const r = i + 3;
    // D: Velocity from Forecast tab (col T = 20)
    dF.push([`=IFERROR(IF(A${r}="","",VLOOKUP(A${r},'📈 Forecast'!$A:$T,20,0)),"")`]);
    // E: FW DOS = C/D
    eF.push([`=IFERROR(IF(OR(C${r}="",D${r}="",D${r}=0),"",ROUND(C${r}/D${r},0)),"")`]);
    // F: Oldest Batch Age — min of (TODAY - Arrival Date) for active batches of this SKU in Batch Log
    fF.push([`=IFERROR(IF(A${r}="","",MAXIFS($F$22:$F$200,$C$22:$C$200,A${r})),"")`]);
    // G: Storage Status
    gF.push([`=IFERROR(IF(F${r}="","",IF(F${r}>${LEAD.fwCrit},"🔴 CRITICAL",IF(F${r}>${LEAD.fwWarn},"⚠️ WARNING","✅ OK"))),"")`]);
    // H: Next Production Arrival — nearest Exp. at FW for this SKU
    hF.push([`=IFERROR(MINIFS('🏗️ Production'!$I$3:$I$103,'🏗️ Production'!$B$3:$B$103,A${r},'🏗️ Production'!$L$3:$L$103,"Shipped to FW"),"")`]);
    // I: Incoming Units
    iF.push([`=IFERROR(SUMPRODUCT(('🏗️ Production'!$B$3:$B$103=A${r})*('🏗️ Production'!$L$3:$L$103="Shipped to FW")*('🏗️ Production'!$D$3:$D$103)),"")`]);
  }
  sh.getRange(3, 4, SKU_ROWS, 1).setFormulas(dF).setNumberFormat('0.00');
  sh.getRange(3, 5, SKU_ROWS, 1).setFormulas(eF).setNumberFormat('0');
  sh.getRange(3, 6, SKU_ROWS, 1).setFormulas(fF).setNumberFormat('0');
  sh.getRange(3, 7, SKU_ROWS, 1).setFormulas(gF).setHorizontalAlignment('center');
  sh.getRange(3, 8, SKU_ROWS, 1).setFormulas(hF).setNumberFormat('dd MMM yyyy');
  sh.getRange(3, 9, SKU_ROWS, 1).setFormulas(iF).setNumberFormat('#,##0');
  fml(sh, 3, 4, SKU_ROWS, 2);  // D-E
  fml(sh, 3, 6, SKU_ROWS, 4);  // F-I

  inp(sh, 3, 10, SKU_ROWS, 1);  // J: Last Sync Date
  sh.getRange(3, 10, SKU_ROWS, 1).setNumberFormat('dd MMM yyyy');
  inp(sh, 3, 11, SKU_ROWS, 1);  // K: Notes

  altRows(sh, 3, SKU_ROWS, 11);

  // ── Section B: Batch Log ──
  banner(sh, 20, 1, 8,
    '📋 BATCH ARRIVAL LOG   |   One row per production batch received at forwarder   |   Days >' +
    LEAD.fwWarn + ' → ⚠️   Days >' + LEAD.fwCrit + ' → 🔴',
    '#1E293B');
  hdr(sh, 21, [
    'Batch ID', 'PO #', 'SKU', 'Units\nArrived',
    '📅 Arrival\nDate', 'Days\nStored', 'Storage\nStatus', 'Notes',
  ]);
  sh.setRowHeight(21, 40);

  const BATCH_ROWS = 100;
  inp(sh, 22, 1, BATCH_ROWS, 4);  // A-D: manual
  dateFmt(sh, 22, 5, BATCH_ROWS); // E: Arrival Date
  rangeDrop(sh, 22, 3, BATCH_ROWS, settingsSh.getRange('A4:A18'));  // C: SKU dropdown

  const bfF=[], bgF=[];
  for (let i = 0; i < BATCH_ROWS; i++) {
    const r = i + 22;
    bfF.push([`=IFERROR(IF(E${r}="","",TODAY()-E${r}),"")`]);
    bgF.push([`=IFERROR(IF(F${r}="","",IF(F${r}>${LEAD.fwCrit},"🔴 CRITICAL",IF(F${r}>${LEAD.fwWarn},"⚠️ WARNING","✅ OK"))),"")`]);
  }
  sh.getRange(22, 6, BATCH_ROWS, 1).setFormulas(bfF).setNumberFormat('0');
  sh.getRange(22, 7, BATCH_ROWS, 1).setFormulas(bgF).setHorizontalAlignment('center');
  fml(sh, 22, 6, BATCH_ROWS, 2);  // F-G

  inp(sh, 22, 8, BATCH_ROWS, 1);  // H: Notes
  altRows(sh, 22, BATCH_ROWS, 8);

  // CF: Storage Status in both sections
  const cfRanges = [
    sh.getRange(3, 7, SKU_ROWS, 1),
    sh.getRange(22, 7, BATCH_ROWS, 1),
  ];
  const allRules = [];
  cfRanges.forEach(range => {
    [
      { type:'text', val:'✅ OK',       bg:'#D1FAE5', fg:'#065F46' },
      { type:'text', val:'⚠️ WARNING',  bg:'#FEF9C3', fg:'#854D0E' },
      { type:'text', val:'🔴 CRITICAL', bg:'#FECACA', fg:'#991B1B' },
    ].forEach(r => {
      allRules.push(
        SpreadsheetApp.newConditionalFormatRule()
          .whenTextEqualTo(r.val).setBackground(r.bg).setFontColor(r.fg)
          .setRanges([range]).build()
      );
    });
  });
  sh.setConditionalFormatRules(allRules);

  [120, 100, 120, 90, 105, 80, 120, 80, 90, 105, 200]
    .forEach((w, i) => sh.setColumnWidth(i + 1, w));
}


// ── 🗃️ ITEMS ─────────────────────────────────────────────────────
//
// One row per SKU per shipment.
// Cols:
//   A  Shipment ID (dropdown → Shipments)
//   B  SKU (dropdown → Settings)
//   C  Qty (manual)
//   D  Status (formula: VLOOKUP from Shipments col 16)
//   E  ETA Port USA (formula: VLOOKUP from Shipments col 9)

function buildItems(ss) {
  const sh   = ss.getSheetByName(SH.ITEMS);
  const ROWS = 500;
  sh.setTabColor('#475569');

  sh.getRange(1, 1, 1, 5).merge()
    .setValue('🗃️ ITEMS — SKU breakdown per shipment (one row per SKU per shipment)')
    .setBackground(C.navy).setFontColor(C.white)
    .setFontWeight('bold').setHorizontalAlignment('center');
  sh.setRowHeight(1, 28);

  hdr(sh, 2, ['Shipment ID', 'SKU', 'Qty (units)', 'Status\n(auto)', 'ETA Port USA\n(auto)']);
  sh.setRowHeight(2, 44);
  sh.setFrozenRows(2);

  const settingsSh  = ss.getSheetByName(SH.SETTINGS);
  const shipmentsSh = ss.getSheetByName(SH.SHIPMENTS);

  inp(sh, 3, 1, ROWS, 1);  // A: Shipment ID — manual (or type from Shipments)
  rangeDrop(sh, 3, 2, ROWS, settingsSh.getRange('A4:A18'));  // B: SKU dropdown
  inp(sh, 3, 3, ROWS, 1);  // C: Qty
  sh.getRange(3, 3, ROWS, 1).setNumberFormat('#,##0');

  // D: Status — VLOOKUP Shipments col 16 (P)
  // E: ETA   — VLOOKUP Shipments col 9 (I)
  const dF=[], eF=[];
  for (let i = 0; i < ROWS; i++) {
    const r = i + 3;
    dF.push([`=IFERROR(IF(A${r}="","",VLOOKUP(A${r},'🚢 Shipments'!$A:$P,16,0)),"")`]);
    eF.push([`=IFERROR(IF(A${r}="","",VLOOKUP(A${r},'🚢 Shipments'!$A:$I,9,0)),"")`]);
  }
  sh.getRange(3, 4, ROWS, 1).setFormulas(dF);
  sh.getRange(3, 5, ROWS, 1).setFormulas(eF).setNumberFormat('dd MMM yyyy');
  fml(sh, 3, 4, ROWS, 2);

  altRows(sh, 3, ROWS, 5);

  // CF: Status (col D = 4)
  setCf(sh, [{
    range: sh.getRange(3, 4, ROWS, 1),
    rules: [
      { type:'text', val:'Planned',      bg:'#F1F5F9', fg:'#475569' },
      { type:'text', val:'Label Sent',   bg:'#FEF9C3', fg:'#854D0E' },
      { type:'text', val:'At Forwarder', bg:'#FEF3C7', fg:'#7C4D00' },
      { type:'text', val:'In Transit',   bg:'#FDE68A', fg:'#92400E' },
      { type:'text', val:'Delivered',    bg:'#BBF7D0', fg:'#14532D' },
      { type:'text', val:'Receiving',    bg:'#A7F3D0', fg:'#064E3B' },
      { type:'text', val:'Closed',       bg:'#D1FAE5', fg:'#065F46' },
      { type:'text', val:'Cancelled',    bg:'#E2E8F0', fg:'#475569' },
    ],
  }]);

  [160, 120, 90, 140, 120].forEach((w, i) => sh.setColumnWidth(i + 1, w));
}


// ── 🚢 SHIPMENTS ─────────────────────────────────────────────────
//
// One row per weekly shipment.
// Row 1: Section banners
// Row 2: Column headers
// Rows 3–202: Data
//
// Cols:
//   A  Shipment ID     B  Amazon FBA #    C  Created Date    D  FBA Destination
//   E  Total Units     F  Label Sent      G  FW Pickup       H  ETD China
//   I  ETA Port USA    J  Del. Window Strt K Del. Window End  L  Window Status
//   M  Delivered       N  Amazon Receiving O  Closed          P  Status
//   Q  Last Status Chg R  Transit Days     S  Notes

function buildShipments(ss) {
  const sh   = ss.getSheetByName(SH.SHIPMENTS);
  const ROWS = 200;
  const COLS = 19;
  sh.setTabColor('#1E40AF');

  // Row 1: section banners
  sh.getRange(1, 1, 1, 5).merge()
    .setValue('📦 SHIPMENT INFO')
    .setBackground('#334155').setFontColor(C.white)
    .setFontWeight('bold').setHorizontalAlignment('center');
  sh.getRange(1, 6, 1, 3).merge()
    .setValue('🏭 FORWARDER CYCLE   |   Label → Pickup → ETD → ETA')
    .setBackground('#1E40AF').setFontColor(C.white)
    .setFontWeight('bold').setHorizontalAlignment('center');
  sh.getRange(1, 9, 1, 5).merge()
    .setValue('📦 DELIVERY WINDOW   |   ETA vs Window — auto control')
    .setBackground('#065F46').setFontColor(C.white)
    .setFontWeight('bold').setHorizontalAlignment('center');
  sh.getRange(1, 14, 1, 3).merge()
    .setValue('✅ FBA RECEIVING')
    .setBackground('#6B21A8').setFontColor(C.white)
    .setFontWeight('bold').setHorizontalAlignment('center');
  sh.getRange(1, 17, 1, 3).merge()
    .setValue('📋 STATUS')
    .setBackground(C.navy).setFontColor(C.white)
    .setFontWeight('bold').setHorizontalAlignment('center');
  sh.setRowHeight(1, 24);

  // Row 2: column headers
  hdr(sh, 2, [
    'Shipment ID', 'Amazon\nFBA #', 'Created\nDate', 'FBA\nDestination', 'Total\nUnits',
    '📅 Label\nSent', '📅 FW\nPickup', '📅 ETD\nChina',
    '📅 ETA\nPort USA', '📅 Window\nStart', '📅 Window\nEnd', 'Window\nStatus',
    '📅 Delivered', '📅 Amazon\nReceiving', '📅 Closed',
    'Status', '📅 Last Status\nChange', 'Transit\nDays', 'Notes',
  ]);
  sh.setFrozenRows(2);

  const settingsSh = ss.getSheetByName(SH.SETTINGS);

  // Col A: auto-generated Shipment ID → manual entry + auto-fill via script
  inp(sh, 3, 1, ROWS, 2);  // A-B: manual
  // C: Created Date — auto via onEdit or manual
  sh.getRange(3, 3, ROWS, 1).setBackground(C.formula).setNumberFormat('dd MMM yyyy');
  fml(sh, 3, 3, ROWS, 1);  // protected, filled by createShipment()
  rangeDrop(sh, 3, 4, ROWS, settingsSh.getRange('A44:A53'));  // D: FBA Destination
  inp(sh, 3, 4, ROWS, 1);
  inp(sh, 3, 5, ROWS, 1);  // E: Total Units
  sh.getRange(3, 5, ROWS, 1).setNumberFormat('#,##0');

  // F-H: dates (Label Sent, FW Pickup, ETD)
  [6, 7, 8].forEach(col => dateFmt(sh, 3, col, ROWS));

  // I: ETA Port USA = ETD + 35 (formula)
  const etaF=[], wstatF=[], ttF=[];
  for (let i = 0; i < ROWS; i++) {
    const r = i + 3;
    etaF.push  ([`=IFERROR(IF(H${r}="","",H${r}+${LEAD.ocean}),"")`]);
    wstatF.push([`=IFERROR(IF(OR(I${r}="",K${r}=""),"",IF(I${r}>K${r},"🔴 BREACH",IF(I${r}>K${r}-5,"⚠️ TIGHT","✅ ON TRACK"))),"")`]);
    ttF.push   ([`=IFERROR(IF(OR(H${r}="",M${r}=""),"",M${r}-H${r}),"")`]);
  }
  sh.getRange(3, 9, ROWS, 1).setFormulas(etaF).setNumberFormat('dd MMM yyyy');
  sh.getRange(3, 12, ROWS, 1).setFormulas(wstatF).setHorizontalAlignment('center').setFontWeight('bold');
  sh.getRange(3, 18, ROWS, 1).setFormulas(ttF).setNumberFormat('0');
  fml(sh, 3, 9, ROWS, 1);   // I: ETA
  fml(sh, 3, 12, ROWS, 1);  // L: Window Status
  fml(sh, 3, 18, ROWS, 1);  // R: Transit Days

  // J-K: Delivery Window dates
  dateFmt(sh, 3, 10, ROWS);  // J: Window Start
  dateFmt(sh, 3, 11, ROWS);  // K: Window End

  // M-O: FBA receiving dates
  [13, 14, 15].forEach(col => dateFmt(sh, 3, col, ROWS));

  // P: Status dropdown
  drop(sh, 3, 16, ROWS, SHIP_STATUS);
  inp(sh, 3, 16, ROWS, 1);

  // Q: Last Status Change — auto via onEdit
  sh.getRange(3, 17, ROWS, 1).setBackground(C.formula).setNumberFormat('dd MMM HH:mm');
  fml(sh, 3, 17, ROWS, 1);

  inp(sh, 3, 19, ROWS, 1);  // S: Notes

  altRows(sh, 3, ROWS, COLS);

  // CF: Status (col P = 16), Window Status (col L = 12)
  const allRules = [];
  const statusRange = sh.getRange(3, 16, ROWS, 1);
  [
    { type:'text', val:'Planned',      bg:'#F1F5F9', fg:'#475569' },
    { type:'text', val:'Label Sent',   bg:'#FEF9C3', fg:'#854D0E' },
    { type:'text', val:'At Forwarder', bg:'#FEF3C7', fg:'#7C4D00' },
    { type:'text', val:'In Transit',   bg:'#FDE68A', fg:'#92400E', bold:true },
    { type:'text', val:'Delivered',    bg:'#BBF7D0', fg:'#14532D' },
    { type:'text', val:'Receiving',    bg:'#A7F3D0', fg:'#064E3B' },
    { type:'text', val:'Closed',       bg:'#D1FAE5', fg:'#065F46' },
    { type:'text', val:'Cancelled',    bg:'#E2E8F0', fg:'#475569' },
  ].forEach(r => {
    let b = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(r.val).setBackground(r.bg).setFontColor(r.fg);
    if (r.bold) b = b.setBold(true);
    allRules.push(b.setRanges([statusRange]).build());
  });
  const wRange = sh.getRange(3, 12, ROWS, 1);
  [
    { type:'text', val:'✅ ON TRACK', bg:'#D1FAE5', fg:'#065F46' },
    { type:'text', val:'⚠️ TIGHT',   bg:'#FEF9C3', fg:'#854D0E' },
    { type:'text', val:'🔴 BREACH',  bg:'#FECACA', fg:'#991B1B' },
  ].forEach(r => {
    allRules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(r.val).setBackground(r.bg).setFontColor(r.fg)
        .setRanges([wRange]).build()
    );
  });
  sh.setConditionalFormatRules(allRules);

  [140, 120, 100, 160, 75, 100, 95, 100, 105, 110, 110, 105, 100, 110, 90, 140, 120, 80, 200]
    .forEach((w, i) => sh.setColumnWidth(i + 1, w));
}


// ── 📦 FBA STOCK ─────────────────────────────────────────────────
//
// One row per SKU (15 rows).
// Cols:
//   A  SKU               B  ★ FBA Stock (manual / CSV import)
//   C  Product Name      D  Week −1 Sales   E  Week −2   F  Week −3   G  Week −4
//   H  4-Week Avg/wk     I  ★ Daily Velocity  J  Spike Flag
//   K  Updated (auto)    L  Notes
//
// Import log starts at row 20.

function buildFBAStock(ss) {
  const sh = ss.getSheetByName(SH.FBA);
  sh.setTabColor('#DC2626');

  sh.getRange(1, 1, 1, 12).merge()
    .setValue('📦 FBA STOCK — SOURCE OF TRUTH   |   Update via CSV import or manual   |   Velocity = 4-week rolling average')
    .setBackground('#991B1B').setFontColor(C.white)
    .setFontWeight('bold').setHorizontalAlignment('center');
  sh.setRowHeight(1, 28);

  hdr(sh, 2, [
    'SKU', '★ FBA Stock\n(units)', 'Product Name',
    'Wk −1\nSales', 'Wk −2\nSales', 'Wk −3\nSales', 'Wk −4\nSales',
    '4-Wk Avg\n/week', '★ Daily\nVelocity', 'Spike\nFlag',
    'Updated', 'Notes',
  ]);
  sh.setFrozenRows(2);

  inp(sh, 3, 1, SKU_ROWS, 1);  // A: SKU — manual (match Settings)
  // B: FBA Stock — main input, large
  inp(sh, 3, 2, SKU_ROWS, 1);
  sh.getRange(3, 2, SKU_ROWS, 1)
    .setNumberFormat('#,##0')
    .setFontWeight('bold')
    .setFontSize(12)
    .setHorizontalAlignment('center');

  // D-G: weekly sales — manual
  inp(sh, 3, 4, SKU_ROWS, 4);
  sh.getRange(3, 4, SKU_ROWS, 4).setNumberFormat('#,##0');

  inp(sh, 3, 12, SKU_ROWS, 1);  // L: Notes

  // Formulas
  const cF=[], hF=[], iF=[], jF=[];
  for (let i = 0; i < SKU_ROWS; i++) {
    const r = i + 3;
    cF.push([`=IFERROR(IF(A${r}="","",VLOOKUP(A${r},'⚙️ Settings'!$A:$B,2,0)),"")`]);
    hF.push([`=IFERROR(IF(COUNTA(D${r}:G${r})=0,"",AVERAGE(D${r}:G${r})),"")`]);
    iF.push([`=IFERROR(IF(H${r}="","",ROUND(H${r}/7,2)),"")`]);
    jF.push([`=IFERROR(IF(OR(D${r}="",H${r}="",H${r}=0),"",IF(D${r}>H${r}*2,"🔴 SPIKE","✅ Normal")),"")`]);
  }
  sh.getRange(3, 3,  SKU_ROWS, 1).setFormulas(cF);
  sh.getRange(3, 8,  SKU_ROWS, 1).setFormulas(hF).setNumberFormat('#,##0.0');
  sh.getRange(3, 9,  SKU_ROWS, 1).setFormulas(iF).setNumberFormat('0.00');
  sh.getRange(3, 10, SKU_ROWS, 1).setFormulas(jF).setHorizontalAlignment('center').setFontWeight('bold');
  fml(sh, 3, 3,  SKU_ROWS, 1);
  fml(sh, 3, 8,  SKU_ROWS, 3);  // H, I, J

  // K: Updated — auto via onEdit
  sh.getRange(3, 11, SKU_ROWS, 1)
    .setBackground(C.formula)
    .setNumberFormat('dd MMM HH:mm')
    .setFontColor('#6B7280')
    .setHorizontalAlignment('center');
  fml(sh, 3, 11, SKU_ROWS, 1);

  altRows(sh, 3, SKU_ROWS, 12);

  // CF: Spike Flag (col J = 10)
  setCf(sh, [{
    range: sh.getRange(3, 10, SKU_ROWS, 1),
    rules: [
      { type:'text', val:'🔴 SPIKE',   bg:'#7C3AED', fg:'#FFFFFF', bold:true },
      { type:'text', val:'✅ Normal',  bg:'#D1FAE5', fg:'#065F46' },
    ],
  }]);

  // CF: FBA Stock = 0 → stockout red
  const stockRules = sh.getConditionalFormatRules();
  stockRules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberEqualTo(0)
      .setBackground('#7C3AED').setFontColor('#FFFFFF').setBold(true)
      .setRanges([sh.getRange(3, 2, SKU_ROWS, 1)]).build()
  );
  sh.setConditionalFormatRules(stockRules);

  // Import log section
  sh.getRange(20, 1, 1, 6).merge()
    .setValue('📥 IMPORT LOG')
    .setBackground('#1E293B').setFontColor(C.white)
    .setFontWeight('bold').setHorizontalAlignment('center');
  sh.setRowHeight(20, 24);
  hdr(sh, 21, ['Date', 'Type', 'Updated SKUs', 'Errors', 'Status', 'Details'], '#374151');
  sh.setRowHeight(21, 32);

  [110, 120, 200, 90, 80, 80, 100, 80, 100, 110, 110, 200]
    .forEach((w, i) => sh.setColumnWidth(i + 1, w));
}


// ── 📊 DASHBOARD ─────────────────────────────────────────────────
//
// Section A: Alert Banner          (rows 1–3)
// Section B: FBA Status            (rows 5–21)  — 15 SKU rows
// Section C: Weekly Action         (rows 23–39) — 15 SKU rows
// Section D: Pipeline Snapshot     (rows 41–47)
//
// FBA Status cols (A–L):
//   A  SKU   B  Product   C  ★FBA Stock   D  Velocity   E  FBA DOS   F  Target DOS
//   G  Δ vs Target   H  Forwarder Stock   I  In Transit   J  Total DOS
//   K  Next ETA   L  Status
//
// Weekly Action cols (A–I):
//   A  SKU   B  Product   C  Last Wk Sales   D  FBA Target Units
//   E  FBA Current   F  In Transit   G  FBA+Transit   H  ★Ship This Wk   I  Action

function buildDashboard(ss) {
  const sh = ss.getSheetByName(SH.DASHBOARD);
  sh.setTabColor('#059669');

  // ── Section A: Alert Banner ──
  sh.getRange(1, 1, 1, 12).merge()
    .setValue('📊 SC DASHBOARD — STYLIA BEAUTY v2')
    .setBackground(C.navy).setFontColor(C.white)
    .setFontWeight('bold').setFontSize(14)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.setRowHeight(1, 36);

  sh.getRange(2, 1, 1, 12).merge()
    .setFormula(
      `=IFERROR(IF(COUNTIF('📦 FBA Stock'!J3:J${SKU_ROWS+2},"🔴 SPIKE")>0,` +
      `"🔴 SPIKE DETECTED — check FBA Stock tab — sales > 2× rolling average",""),"")`
    )
    .setBackground('#FEF2F2').setFontColor('#991B1B')
    .setFontWeight('bold').setHorizontalAlignment('center');
  sh.setRowHeight(2, 28);

  sh.getRange(3, 1, 1, 12).merge()
    .setFormula(
      `=IFERROR(IF(COUNTIF('🚢 Shipments'!L3:L202,"🔴 BREACH")>0,` +
      `"⚠️ DELIVERY WINDOW BREACH — check Shipments tab: "&` +
      `TEXTJOIN(", ",TRUE,FILTER('🚢 Shipments'!A3:A202,'🚢 Shipments'!L3:L202="🔴 BREACH")),` +
      `"✅ All delivery windows on track"),"")`
    )
    .setBackground('#FFF7ED').setFontColor('#9A3412')
    .setHorizontalAlignment('center');
  sh.setRowHeight(3, 28);

  // ── Section B: FBA Status ──
  banner(sh, 4, 1, 12, '📦 FBA STOCK STATUS   |   🟡 = manual input on FBA Stock tab', '#1E293B');

  hdr(sh, 5, [
    'SKU', 'Product', '★ FBA\nStock', 'Daily\nVelocity',
    'FBA\nDOS', 'Target\nDOS', 'Δ vs\nTarget',
    'Forwarder\nStock', 'In\nTransit', 'Total\nDOS',
    'Next\nETA', 'Status',
  ]);

  const FBA_DATA = 6;  // first data row of FBA section

  const aF=[], bF=[], cF=[], dF=[], eF=[], fF=[], gF=[], hF=[], iF=[], jF=[], kF=[], lF=[];
  for (let i = 0; i < SKU_ROWS; i++) {
    const r  = i + FBA_DATA;
    const sr = i + 4;  // Settings row

    aF.push([`='⚙️ Settings'!A${sr}`]);
    bF.push([`='⚙️ Settings'!B${sr}`]);
    cF.push([`=IFERROR(IF(A${r}="","",VLOOKUP(A${r},'📦 FBA Stock'!$A:$B,2,0)),"")`]);
    dF.push([`=IFERROR(IF(A${r}="","",VLOOKUP(A${r},'📦 FBA Stock'!$A:$I,9,0)),"")`]);
    eF.push([`=IFERROR(IF(OR(C${r}="",D${r}="",D${r}=0),"",ROUND(C${r}/D${r},0)),"")`]);
    fF.push([`=IFERROR(IF(A${r}="","",VLOOKUP(A${r},'⚙️ Settings'!$A:$F,6,0)),"")`]);
    gF.push([`=IFERROR(IF(OR(E${r}="",F${r}=""),"",E${r}-F${r}),"")`]);
    hF.push([`=IFERROR(IF(A${r}="","",VLOOKUP(A${r},'🏭 Forwarder'!$A:$C,3,0)),"")`]);
    // In Transit: SUMPRODUCT from Items where status is active (Label Sent / At Forwarder / In Transit)
    iF.push([
      `=SUMPRODUCT(('🗃️ Items'!$B$3:$B$500=A${r})*` +
      `(('🗃️ Items'!$D$3:$D$500="Label Sent")+('🗃️ Items'!$D$3:$D$500="At Forwarder")+('🗃️ Items'!$D$3:$D$500="In Transit"))*` +
      `('🗃️ Items'!$C$3:$C$500))`
    ]);
    jF.push([`=IFERROR(IF(OR(C${r}="",D${r}="",D${r}=0),"",ROUND((C${r}+H${r}+I${r})/D${r},0)),"")`]);
    kF.push([
      `=IFERROR(MINIFS('🗃️ Items'!$E$3:$E$500,'🗃️ Items'!$B$3:$B$500,A${r},` +
      `'🗃️ Items'!$D$3:$D$500,"In Transit"),"")`
    ]);
    lF.push([
      `=IFERROR(IF(A${r}="","",IF(C${r}=0,"STOCKOUT",` +
      `IF(E${r}<${DOS.critical},"CRITICAL",IF(E${r}<${DOS.watch},"WATCH","HEALTHY")))),"")`
    ]);
  }

  sh.getRange(FBA_DATA, 1,  SKU_ROWS, 1).setFormulas(aF);
  sh.getRange(FBA_DATA, 2,  SKU_ROWS, 1).setFormulas(bF);
  sh.getRange(FBA_DATA, 3,  SKU_ROWS, 1).setFormulas(cF).setNumberFormat('#,##0');
  sh.getRange(FBA_DATA, 4,  SKU_ROWS, 1).setFormulas(dF).setNumberFormat('0.00');
  sh.getRange(FBA_DATA, 5,  SKU_ROWS, 1).setFormulas(eF).setNumberFormat('0');
  sh.getRange(FBA_DATA, 6,  SKU_ROWS, 1).setFormulas(fF).setNumberFormat('0');
  sh.getRange(FBA_DATA, 7,  SKU_ROWS, 1).setFormulas(gF).setNumberFormat('0');
  sh.getRange(FBA_DATA, 8,  SKU_ROWS, 1).setFormulas(hF).setNumberFormat('#,##0');
  sh.getRange(FBA_DATA, 9,  SKU_ROWS, 1).setFormulas(iF).setNumberFormat('#,##0');
  sh.getRange(FBA_DATA, 10, SKU_ROWS, 1).setFormulas(jF).setNumberFormat('0');
  sh.getRange(FBA_DATA, 11, SKU_ROWS, 1).setFormulas(kF).setNumberFormat('dd MMM yyyy');
  sh.getRange(FBA_DATA, 12, SKU_ROWS, 1).setFormulas(lF)
    .setHorizontalAlignment('center').setFontWeight('bold');

  fml(sh, FBA_DATA, 1, SKU_ROWS, 12);

  altRows(sh, FBA_DATA, SKU_ROWS, 12);

  // ── Section C: Weekly Action ──
  const ACT_START = FBA_DATA + SKU_ROWS + 1;  // row 22
  banner(sh, ACT_START, 1, 9,
    '🚢 WEEKLY ACTION — Ship this week from Forwarder to FBA   |   Formula: MAX(0, Target − (FBA + In Transit))',
    '#1E40AF');
  hdr(sh, ACT_START + 1, [
    'SKU', 'Product', '★ Last Wk\nSales', 'FBA\nTarget (units)',
    'FBA\nCurrent', 'In\nTransit', 'FBA +\nTransit',
    '★ SHIP\nThis Week', 'Action',
  ]);

  const ACT_DATA = ACT_START + 2;  // first data row of action section

  const wa=[], wb=[], wc=[], wd=[], we=[], wf=[], wg=[], wh=[], wi=[];
  for (let i = 0; i < SKU_ROWS; i++) {
    const r  = i + ACT_DATA;
    const dr = i + FBA_DATA;  // corresponding Dashboard FBA Status row

    wa.push([`=A${dr}`]);  // SKU from FBA Status section
    wb.push([`=B${dr}`]);  // Product
    // C: Last Week Sales — manual (user fills weekly)
    // D: FBA Target Units = Target DOS × Daily Velocity
    wd.push([`=IFERROR(IF(OR(F${dr}="",D${dr}=""),"",ROUND(F${dr}*D${dr},0)),"")`]);
    we.push([`=C${dr}`]);  // FBA Current
    wf.push([`=I${dr}`]);  // In Transit
    wg.push([`=IFERROR(IF(OR(E${r}="",F${r}=""),"",E${r}+F${r}),"")`]);
    // H: Ship This Week = MAX(0, Target − (FBA + In Transit))
    wh.push([`=IFERROR(IF(OR(D${r}="",G${r}=""),"",MAX(0,D${r}-G${r})),"")`]);
    // I: Action flag
    wi.push([
      `=IFERROR(IF(A${r}="","",` +
      `IF(H${r}=0,"✅ HOLD",` +
      `IF(H${r}>IFERROR(VLOOKUP(A${r},'🏭 Forwarder'!$A:$C,3,0),0),"⚠️ FW EMPTY","📦 SHIP "& TEXT(H${r},"#,##0")&" units"))),"")`
    ]);
  }

  sh.getRange(ACT_DATA, 1, SKU_ROWS, 1).setFormulas(wa);
  sh.getRange(ACT_DATA, 2, SKU_ROWS, 1).setFormulas(wb);
  inp(sh, ACT_DATA, 3, SKU_ROWS, 1);  // C: Last Wk Sales — manual
  sh.getRange(ACT_DATA, 3, SKU_ROWS, 1).setNumberFormat('#,##0');
  sh.getRange(ACT_DATA, 4, SKU_ROWS, 1).setFormulas(wd).setNumberFormat('#,##0');
  sh.getRange(ACT_DATA, 5, SKU_ROWS, 1).setFormulas(we).setNumberFormat('#,##0');
  sh.getRange(ACT_DATA, 6, SKU_ROWS, 1).setFormulas(wf).setNumberFormat('#,##0');
  sh.getRange(ACT_DATA, 7, SKU_ROWS, 1).setFormulas(wg).setNumberFormat('#,##0');
  sh.getRange(ACT_DATA, 8, SKU_ROWS, 1).setFormulas(wh)
    .setNumberFormat('#,##0').setFontWeight('bold').setFontSize(11);
  sh.getRange(ACT_DATA, 9, SKU_ROWS, 1).setFormulas(wi).setHorizontalAlignment('center');
  fml(sh, ACT_DATA, 1, SKU_ROWS, 2);   // A-B
  fml(sh, ACT_DATA, 4, SKU_ROWS, 6);   // D-I

  altRows(sh, ACT_DATA, SKU_ROWS, 9);

  // ── Section D: Pipeline Snapshot ──
  const PIPE_START = ACT_DATA + SKU_ROWS + 1;
  banner(sh, PIPE_START, 1, 9, '🔭 PIPELINE SNAPSHOT', '#374151');
  hdr(sh, PIPE_START + 1, [
    'Metric', 'Value', 'Detail', '', '', '', '', '', '',
  ], '#1E293B');
  sh.setRowHeight(PIPE_START + 1, 28);

  const pipeData = PIPE_START + 2;
  const pipeRows = [
    ['Active shipments (In Transit)',
     `=COUNTIF('🚢 Shipments'!P3:P202,"In Transit")`,
     `=IFERROR(TEXTJOIN(", ",TRUE,FILTER('🚢 Shipments'!A3:A202,'🚢 Shipments'!P3:P202="In Transit")),"—")`],
    ['Total units in transit',
     `=SUMPRODUCT(('🗃️ Items'!D3:D500="In Transit")*('🗃️ Items'!C3:C500))`,
     ''],
    ['Window breaches (🔴 BREACH)',
     `=COUNTIF('🚢 Shipments'!L3:L202,"🔴 BREACH")`,
     `=IFERROR(TEXTJOIN(", ",TRUE,FILTER('🚢 Shipments'!A3:A202,'🚢 Shipments'!L3:L202="🔴 BREACH")),"✅ None")`],
    ['Forwarder batches > '+ LEAD.fwWarn +'d',
     `=COUNTIF('🏭 Forwarder'!G22:G200,"⚠️ WARNING")+COUNTIF('🏭 Forwarder'!G22:G200,"🔴 CRITICAL")`,
     `=IFERROR(TEXTJOIN(", ",TRUE,FILTER('🏭 Forwarder'!A22:A200,('🏭 Forwarder'!F22:F200)>${LEAD.fwWarn})),"✅ None")`],
    ['Production orders active',
     `=COUNTIFS('🏗️ Production'!L3:L103,"<>Cancelled",'🏗️ Production'!L3:L103,"<>At Forwarder")`,
     `=IFERROR(TEXTJOIN(", ",TRUE,FILTER('🏗️ Production'!A3:A103,'🏗️ Production'!L3:L103="In Production")),"—")`],
    ['SKUs CRITICAL (DOS < '+ DOS.critical +')',
     `=COUNTIF(L${FBA_DATA}:L${FBA_DATA+SKU_ROWS-1},"CRITICAL")+COUNTIF(L${FBA_DATA}:L${FBA_DATA+SKU_ROWS-1},"STOCKOUT")`,
     `=IFERROR(TEXTJOIN(", ",TRUE,FILTER(A${FBA_DATA}:A${FBA_DATA+SKU_ROWS-1},(L${FBA_DATA}:L${FBA_DATA+SKU_ROWS-1}="CRITICAL")+(L${FBA_DATA}:L${FBA_DATA+SKU_ROWS-1}="STOCKOUT"))),"✅ None")`],
  ];

  pipeRows.forEach((rowData, i) => {
    const prow = pipeData + i;
    sh.getRange(prow, 1).setValue(rowData[0]);
    sh.getRange(prow, 2).setFormula(rowData[1]).setHorizontalAlignment('center').setFontWeight('bold');
    sh.getRange(prow, 3, 1, 7).merge().setFormula(rowData[2]).setWrap(true);
    fml(sh, prow, 2, 1, 1);
    fml(sh, prow, 3, 1, 7);
    if (i % 2 === 1) sh.getRange(prow, 1, 1, 9).setBackground(C.alt);
  });

  // ── Dashboard CF ──
  const allRules = [];

  // Status (col L = 12 in FBA Status section)
  const statusRange = sh.getRange(FBA_DATA, 12, SKU_ROWS, 1);
  [
    { val:'STOCKOUT', bg:'#7C3AED', fg:'#FFFFFF' },
    { val:'CRITICAL', bg:'#DC2626', fg:'#FFFFFF' },
    { val:'WATCH',    bg:'#F59E0B', fg:'#FFFFFF' },
    { val:'HEALTHY',  bg:'#10B981', fg:'#FFFFFF' },
  ].forEach(r => {
    allRules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(r.val).setBackground(r.bg).setFontColor(r.fg).setBold(true)
        .setRanges([statusRange]).build()
    );
  });

  // Δ vs Target (col G = 7): negative → red, positive → green
  const deltaRange = sh.getRange(FBA_DATA, 7, SKU_ROWS, 1);
  allRules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(0).setBackground('#FECACA').setFontColor('#991B1B')
      .setRanges([deltaRange]).build()
  );
  allRules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(0).setBackground('#D1FAE5').setFontColor('#065F46')
      .setRanges([deltaRange]).build()
  );

  // Action column (col I = 9 in Weekly Action)
  const actionRange = sh.getRange(ACT_DATA, 9, SKU_ROWS, 1);
  [
    { val:'✅ HOLD',     bg:'#D1FAE5', fg:'#065F46' },
    { val:'⚠️ FW EMPTY',bg:'#FECACA', fg:'#991B1B' },
  ].forEach(r => {
    allRules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(r.val).setBackground(r.bg).setFontColor(r.fg)
        .setRanges([actionRange]).build()
    );
  });
  allRules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('📦 SHIP').setBackground('#BFDBFE').setFontColor('#1E3A8A').setBold(true)
      .setRanges([actionRange]).build()
  );

  sh.setConditionalFormatRules(allRules);

  sh.setFrozenRows(5);

  [100, 210, 90, 80, 65, 65, 80, 80, 80, 80, 105, 110]
    .forEach((w, i) => sh.setColumnWidth(i + 1, w));
}


// ── CSV IMPORT ────────────────────────────────────────────────────

function importFBAStock() {
  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const imp = ss.getSheetByName(SH.SETTINGS);
  const fba = ss.getSheetByName(SH.FBA);

  // Drive URL stored in Settings row 67 col B
  const fileRef = ss.getSheetByName(SH.SETTINGS).getRange(67, 2).getValue();
  if (!fileRef) {
    SpreadsheetApp.getUi().alert('⚠️ No Drive URL found in ⚙️ Settings → Import Settings row 1.');
    return;
  }

  let csv, data;
  try {
    const match  = String(fileRef).match(/[-\w]{25,}/);
    const fileId = match ? match[0] : fileRef;
    csv  = DriveApp.getFileById(fileId).getBlob().getDataAsString();
    data = Utilities.parseCsv(csv);
  } catch (e) {
    logImport_(fba, 'FBA Stock', 0, `❌ File error: ${e.message}`);
    return;
  }

  const headers = data[0].map(h => h.toLowerCase().trim().replace(/[\s-]/g, '_'));
  const skuCol  = findCol_(headers, ['seller_sku', 'sku', 'msku']);
  const qtyCol  = findCol_(headers, ['afn_fulfillable_quantity', 'fulfillable_quantity', 'quantity', 'qty']);

  if (skuCol < 0 || qtyCol < 0) {
    logImport_(fba, 'FBA Stock', 0, '❌ SKU or Qty column not found in CSV');
    return;
  }

  // Build lookup: SKU → qty
  const csvMap = {};
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[skuCol]) continue;
    const sku = String(row[skuCol]).trim();
    const qty = parseInt(row[qtyCol], 10) || 0;
    csvMap[sku] = (csvMap[sku] || 0) + qty;
  }

  // Read FBA Stock tab SKUs (col A, rows 3-17)
  const fbaSkus = fba.getRange(3, 1, SKU_ROWS, 1).getValues().flat();
  let updated   = 0;
  let errors    = '';

  fbaSkus.forEach((sku, i) => {
    if (!sku) return;
    const skuStr = String(sku).trim();
    if (csvMap[skuStr] !== undefined) {
      fba.getRange(i + 3, 2).setValue(csvMap[skuStr]);
      updated++;
    } else {
      errors += (errors ? ', ' : '') + skuStr;
    }
  });

  const status = updated > 0 ? '✅ OK' : '⚠️ No matches';
  logImport_(fba, 'FBA Stock', updated,
    `${status}${errors ? ' | Not found: ' + errors : ''}`);

  SpreadsheetApp.getUi().alert(
    `✅ Import complete\n\nUpdated: ${updated} SKUs\n` +
    (errors ? `Not found in CSV: ${errors}` : 'All SKUs matched.')
  );
}

function findCol_(headers, candidates) {
  for (const c of candidates) {
    const idx = headers.indexOf(c);
    if (idx >= 0) return idx;
  }
  return -1;
}

function logImport_(sh, type, count, detail) {
  const lastRow = Math.max(sh.getLastRow(), 22);
  sh.getRange(lastRow + 1, 1, 1, 5).setValues([[
    new Date(), type, count, count > 0 ? '✅ OK' : '⚠️', detail,
  ]]);
  sh.getRange(lastRow + 1, 1).setNumberFormat('dd MMM yyyy HH:mm');
}


// ── SHIPMENT ID GENERATOR ─────────────────────────────────────────

function generateShipmentId() {
  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const sh  = ss.getSheetByName(SH.SHIPMENTS);
  const tz  = Session.getScriptTimeZone();
  const dt  = Utilities.formatDate(new Date(), tz, 'yyyyMMdd');
  const pfx = `SHP-${dt}-`;

  const lastRow = Math.max(sh.getLastRow(), 2);
  const ids     = sh.getRange(3, 1, lastRow - 2, 1).getValues().flat();
  const count   = ids.filter(v => String(v).startsWith(pfx)).length + 1;

  return `${pfx}${String(count).padStart(3, '0')}`;
}


// ── PHASE 2 STUB: Gmail Parser ────────────────────────────────────
// Reads Seller Central FBA shipment emails and updates Shipments tab.
// Run via time-based trigger (daily).

function syncShipmentStatusFromGmail() {
  const ss   = SpreadsheetApp.getActiveSpreadsheet();
  const sh   = ss.getSheetByName(SH.SHIPMENTS);
  const rows = sh.getLastRow() - 2;
  if (rows <= 0) return;

  const data = sh.getRange(3, 1, rows, 17).getValues();  // A through Q

  // Search Gmail for Seller Central shipment updates
  const threads = GmailApp.search(
    'from:shipment-tracking@amazon.com subject:FBA newer_than:7d', 0, 50
  );

  const statusMap = {};
  threads.forEach(thread => {
    thread.getMessages().forEach(msg => {
      const body = msg.getPlainBody();
      // Extract: Shipment ID + status — pattern varies, adjust regex to Seller Central format
      const idMatch  = body.match(/FBA[A-Z0-9]{8,}/);
      const stMatch  = body.match(/(Delivered|Receiving|Closed|In Transit)/i);
      if (idMatch && stMatch) {
        statusMap[idMatch[0]] = stMatch[1];
      }
    });
  });

  let updated = 0;
  data.forEach((row, i) => {
    const fbaNum    = String(row[1]).trim();   // col B: Amazon FBA #
    const newStatus = statusMap[fbaNum];
    if (!newStatus) return;

    const currentStatus = String(row[15]);     // col P: Status
    if (currentStatus === newStatus) return;

    sh.getRange(i + 3, 16).setValue(newStatus);   // P: Status
    sh.getRange(i + 3, 17).setValue(new Date())   // Q: Last Status Change
      .setNumberFormat('dd MMM HH:mm');
    updated++;
  });

  console.log(`Gmail sync: ${updated} shipments updated`);
}
