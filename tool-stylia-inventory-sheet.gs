/**
 * Stylia Beauty — Inventory Management System v2
 * Google Apps Script — run createInventorySystem() once to build all sheets
 *
 * Tabs: ⚙️ Settings | 📦 Stock Report | 🏭 3PL Report | 🚢 Shipments | 🗃️ Items
 *       📝 New Shipment | 🏗️ Production | 📈 Forecast | 📋 PO | 🚛 Freight
 *       💰 Landed Cost | 📥 Import
 *
 * Color system:
 *   🟡 Yellow  #FFF9C4 — manual input
 *   🔵 Blue    #DBEAFE — formula / read-only (protected)
 *   ⬛ Navy    #0F1629 — headers
 */

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const SH = {
  SETTINGS:   '⚙️ Settings',
  STOCK:      '📦 Stock Report',
  THREE_PL:   '🏭 3PL Report',
  SHIPMENTS:  '🚢 Shipments',
  ITEMS:      '🗃️ Items',
  NEW_SHIP:   '📝 New Shipment',
  PRODUCTION: '🏗️ Production',
  FORECAST:   '📈 Forecast',
  PO:         '📋 PO',
  FREIGHT:    '🚛 Freight',
  LANDED:     '💰 Landed Cost',
  IMPORT:     '📥 Import',
};

const C = {
  headerBg:  '#0f1629',
  headerFg:  '#ffffff',
  inputBg:   '#fff9c4',   // 🟡 yellow — manual input
  formulaBg: '#dbeafe',   // 🔵 blue  — formula / read-only
  altRow:    '#f8fafc',
  btnBg:     '#1a73e8',
  btnFg:     '#ffffff',
};

// ─── ENTRY POINT ─────────────────────────────────────────────────────────────

function createInventorySystem() {
  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const ui  = SpreadsheetApp.getUi();

  const ok = ui.alert(
    'Create Inventory System v2',
    'Recreates all 12 inventory sheets.\nExisting data will be lost. Continue?',
    ui.ButtonSet.YES_NO
  );
  if (ok !== ui.Button.YES) return;

  Object.values(SH).forEach(name => {
    const s = ss.getSheetByName(name);
    if (s) ss.deleteSheet(s);
  });

  // Insert in reverse display order (insertSheet(0) pushes each to front)
  [SH.IMPORT, SH.LANDED, SH.FREIGHT, SH.PO, SH.FORECAST,
   SH.PRODUCTION, SH.NEW_SHIP, SH.ITEMS, SH.SHIPMENTS,
   SH.THREE_PL, SH.STOCK, SH.SETTINGS]
    .forEach(name => ss.insertSheet(name, 0));

  buildSettings(ss);
  buildStockReport(ss);
  build3PLReport(ss);
  buildShipments(ss);
  buildItems(ss);
  buildNewShipment(ss);
  buildProduction(ss);
  buildForecast(ss);
  buildPO(ss);
  buildFreight(ss);
  buildLandedCost(ss);
  buildImport(ss);

  ss.setActiveSheet(ss.getSheetByName(SH.STOCK));
  ui.alert(
    '✅ Done! 12 tabs created.\n\n' +
    'Порядок заповнення:\n' +
    '1. ⚙️ Settings — SKU, velocity, prices, lead times\n' +
    '2. 📥 Import   — завантажити FBA і 3PL stock CSV\n' +
    '3. 📝 New Shipment — ввести активні шипменти\n' +
    '4. 🏗️ Production — активні виробничі замовлення\n' +
    '5. 📋 PO / 🚛 Freight — інвойси\n' +
    '6. 💰 Landed Cost — ввести fees\n\n' +
    '🟡 Жовтий = вводь вручну\n' +
    '🔵 Блакитний = формула, не редагуй'
  );
}

// ─── MENU & TRIGGERS ─────────────────────────────────────────────────────────

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Stylia SC')
    .addItem('Recreate All Sheets', 'createInventorySystem')
    .addSeparator()
    .addItem('Save New Shipment', 'saveShipment')
    .addItem('Clear Shipment Form', 'clearShipmentForm')
    .addSeparator()
    .addItem('Import FBA Stock from Drive', 'importFBAStock')
    .addItem('Import 3PL Stock from Drive', 'import3PLStock')
    .addSeparator()
    .addItem('Rebuild Finance Tabs Only', 'addFinanceSheets')
    .addToUi();
}

function onEdit(e) {
  const sh  = e.range.getSheet();
  const col = e.range.getColumn();
  const row = e.range.getRow();

  // Auto-timestamp when FBA Stock (col B=2) is edited in Stock Report
  if (sh.getName() === SH.STOCK && col === 2 && row >= 2) {
    sh.getRange(row, 16)
      .setValue(new Date())
      .setNumberFormat('dd MMM HH:mm');
  }
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function hdr(sh, headers, rowHeight) {
  const r = sh.getRange(1, 1, 1, headers.length);
  r.setValues([headers])
   .setBackground(C.headerBg)
   .setFontColor(C.headerFg)
   .setFontWeight('bold')
   .setFontSize(10)
   .setVerticalAlignment('middle')
   .setWrap(true);
  sh.setRowHeight(1, rowHeight || 44);
  return r;
}

function yellow(sh, row, col, numRows, numCols) {
  sh.getRange(row, col, numRows || 1, numCols || 1).setBackground(C.inputBg);
}

function formulaCell(sh, row, col, numRows, numCols) {
  sh.getRange(row, col, numRows || 1, numCols || 1).setBackground(C.formulaBg);
}

function dropdown(sh, row, col, numRows, values) {
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(values, true)
    .setAllowInvalid(false)
    .build();
  sh.getRange(row, col, numRows, 1).setDataValidation(rule);
}

function colLetter(n) {
  let s = '';
  while (n > 0) {
    s = String.fromCharCode(64 + ((n - 1) % 26 + 1)) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

// VLOOKUP shortcut: look up A{row} in Settings col A → return col colNum
function vlu(row, colNum) {
  return `IFERROR(INDEX('${SH.SETTINGS}'!${colLetter(colNum)}:${colLetter(colNum)},` +
         `MATCH(A${row},'${SH.SETTINGS}'!A:A,0)),"")`;
}

function cfText(range, text, bg, fg) {
  const b = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo(text)
    .setBackground(bg);
  if (fg) b.setFontColor(fg).setBold(true);
  return b.setRanges([range]).build();
}

function cfFormula(range, formula, bg, fg) {
  const b = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied(formula)
    .setBackground(bg);
  if (fg) b.setFontColor(fg);
  return b.setRanges([range]).build();
}

// Protect formula ranges with warning (owner can still edit)
function setupProtection(sh, formulaRanges) {
  formulaRanges.forEach(range => {
    const p = range.protect();
    p.setDescription('Formula — do not edit');
    p.setWarningOnly(true);
  });
}

// Alternating row background via RangeList (batch, no loop)
function altRows(sh, startRow, count, numCols) {
  const a1s = [];
  for (let i = 1; i < count; i += 2) {
    a1s.push(`A${startRow + i}:${colLetter(numCols)}${startRow + i}`);
  }
  if (a1s.length) sh.getRangeList(a1s).setBackground(C.altRow);
}

// ─── ⚙️ SETTINGS ─────────────────────────────────────────────────────────────

function buildSettings(ss) {
  const sh = ss.getSheetByName(SH.SETTINGS);
  sh.clear();
  sh.setTabColor('#37474f');

  const headers = [
    'SKU ID', 'Product Name', 'Category', 'Velocity\n(u/day)', 'Avg Price\n($)',
    'Target FBA\nDays', 'Production\n(days)', 'Ocean WC\n(days)', 'Ocean EC\n(days)',
    'FBA Receiving\n(days)', 'Local Transit\n3PL→FBA (days)',
    'Lead Time\nWC', 'Lead Time\nEC', 'Reorder\nTrigger',
    'CRITICAL\nFBA days <', 'WATCH\nFBA days ≤', 'Min FBA\nUnits',
  ];
  hdr(sh, headers, 52);
  sh.setFrozenRows(1);
  sh.setFrozenColumns(2);

  const widths = [80,200,130,90,90, 90,90,90,90,110,110, 90,90,90, 100,90,100];
  widths.forEach((w, i) => sh.setColumnWidth(i + 1, w));

  const N = 30;
  const cats = ['Face Masks','Eye Patches','Eyebrow','Practice Skins','Microblading','PMU Machines'];

  // Batch defaults: F-K (cols 6-11)
  sh.getRange(2, 6, N, 6).setValues(Array(N).fill([30, 25, 35, 45, 21, 3]));
  // Batch defaults: O-P (cols 15-16)
  sh.getRange(2, 15, N, 2).setValues(Array(N).fill([28, 37]));

  // Batch formulas
  const fWC=[], fEC=[], fTrig=[], fMin=[];
  for (let i = 0; i < N; i++) {
    const r = i + 2;
    fWC.push([`=IF(A${r}="","",G${r}+H${r}+J${r})`]);
    fEC.push([`=IF(A${r}="","",G${r}+I${r}+J${r})`]);
    fTrig.push([`=IF(A${r}="","",ROUND((L${r}+M${r})/2+F${r},0))`]);
    fMin.push([`=IF(A${r}="","",D${r}*O${r})`]);
  }
  sh.getRange(2, 12, N, 1).setFormulas(fWC);
  sh.getRange(2, 13, N, 1).setFormulas(fEC);
  sh.getRange(2, 14, N, 1).setFormulas(fTrig);
  sh.getRange(2, 17, N, 1).setFormulas(fMin);

  yellow(sh, 2, 1, N, 11);       // A-K
  yellow(sh, 2, 15, N, 2);       // O-P
  formulaCell(sh, 2, 12, N, 3);  // L-N
  formulaCell(sh, 2, 17, N, 1);  // Q

  dropdown(sh, 2, 3, N, cats);
  sh.getRange(2, 5, N, 1).setNumberFormat('"$"#,##0.00');
  sh.getRange(2, 12, N, 3).setNumberFormat('0');
  sh.getRange(2, 17, N, 1).setNumberFormat('#,##0');

  altRows(sh, 1, N + 1, headers.length);

  setupProtection(sh, [
    sh.getRange(2, 12, N, 3),  // L-N
    sh.getRange(2, 17, N, 1),  // Q
  ]);
}

// ─── 📦 STOCK REPORT ─────────────────────────────────────────────────────────

function buildStockReport(ss) {
  const sh = ss.getSheetByName(SH.STOCK);
  sh.clear();
  sh.setTabColor('#c62828');

  // A  SKU           🟡 manual
  // B  ★ FBA Stock   🟡 manual  ← col 2 (moved from col 5)
  // C  Product       🔵 formula
  // D  Category      🔵 formula
  // E  Vel/day       🔵 formula
  // F  FBA Days      🔵 = B/E
  // G  FBA Inbound   🔵 SUMPRODUCT Items (3PL→FBA in transit)
  // H  Other Transit 🔵 SUMPRODUCT Items (China→x in transit)
  // I  Nearest ETA   🔵 MINIFS Items
  // J  In Production 🔵 SUMPRODUCT Production
  // K  Total Supply  🔵 = B+G+H+J
  // L  Total DOS     🔵 = K/E
  // M  Status        🔵 formula
  // N  Reorder Qty   🔵 formula
  // O  Rev Loss /wk  🔵 formula
  // P  Updated       🟡 auto (onEdit)
  // Q  Notes         🟡 manual

  const headers = [
    'SKU', '★ FBA Stock',
    'Product', 'Category', 'Vel/day',
    'FBA Days', 'FBA Inbound\n(3PL→FBA)', 'Other Transit\n(China→x)', 'Nearest ETA',
    'In Production', 'Total Supply', 'Total DOS',
    'Status', 'Reorder Qty', 'Rev Loss /wk',
    'Updated', 'Notes',
  ];
  hdr(sh, headers, 44);
  sh.setFrozenRows(1);
  sh.setFrozenColumns(2);

  const widths = [80,110, 200,120,80, 90,120,120,110, 120,110,90, 100,110,120, 110,200];
  widths.forEach((w, i) => sh.setColumnWidth(i + 1, w));

  const rows = 50;
  const I = SH.ITEMS;
  const P = SH.PRODUCTION;

  const fProd=[], fCat=[], fVel=[], fFBAd=[], fInb=[], fTrans=[], fETA=[], fProdQ=[], fSup=[], fDOS=[], fStat=[], fReord=[], fRevL=[];

  for (let i = 0; i < rows; i++) {
    const r = i + 2;

    fProd.push([`=${vlu(r, 2)}`]);
    fCat.push([`=${vlu(r, 3)}`]);
    fVel.push([`=${vlu(r, 4)}`]);

    // F: FBA Days = B/E
    fFBAd.push([`=IFERROR(IF(A${r}="","",B${r}/E${r}),"")`]);

    // G: FBA Inbound — Items where Type=3PL→FBA, Status≠Received/Cancelled
    fInb.push([
      `=IF(A${r}="","",SUMPRODUCT(` +
      `('${I}'!B$2:B$500=A${r})*` +
      `(('${I}'!E$2:E$500="3PL WC → FBA")+('${I}'!E$2:E$500="3PL EC → FBA"))*` +
      `('${I}'!F$2:F$500<>"Received")*('${I}'!F$2:F$500<>"Cancelled")*` +
      `('${I}'!D$2:D$500)))`
    ]);

    // H: Other Transit — Items where Type=China→x, Status=In Transit
    fTrans.push([
      `=IF(A${r}="","",SUMPRODUCT(` +
      `('${I}'!B$2:B$500=A${r})*` +
      `(('${I}'!E$2:E$500="China → FBA")+('${I}'!E$2:E$500="China → 3PL WC")+('${I}'!E$2:E$500="China → 3PL EC"))*` +
      `('${I}'!F$2:F$500="In Transit")*` +
      `('${I}'!D$2:D$500)))`
    ]);

    // I: Nearest ETA
    fETA.push([
      `=IFERROR(IF(A${r}="","",` +
      `MINIFS('${I}'!G$2:G$500,'${I}'!B$2:B$500,A${r},'${I}'!F$2:F$500,"In Transit")),"")`
    ]);

    // J: In Production
    fProdQ.push([
      `=IF(A${r}="","",SUMPRODUCT(` +
      `('${P}'!B$2:B$500=A${r})*` +
      `(('${P}'!I$2:I$500="In Production")+('${P}'!I$2:I$500="Ready")+('${P}'!I$2:I$500="Booked"))*` +
      `('${P}'!D$2:D$500)))`
    ]);

    // K: Total Supply
    fSup.push([`=IF(A${r}="","",B${r}+G${r}+H${r}+J${r})`]);

    // L: Total DOS
    fDOS.push([`=IFERROR(IF(A${r}="","",K${r}/E${r}),"")`]);

    // M: Status
    fStat.push([
      `=IF(A${r}="","",` +
      `IF(E${r}="","—",` +
      `IF(B${r}=0,"STOCKOUT",` +
      `IF(F${r}<${vlu(r, 15)},"CRITICAL",` +
      `IF(F${r}<=${vlu(r, 16)},"WATCH","HEALTHY")))))`
    ]);

    // N: Reorder Qty = MAX(0, Trigger×Vel − TotalSupply)
    fReord.push([`=IFERROR(IF(A${r}="","",MAX(0,${vlu(r, 14)}*E${r}-K${r})),"")`]);

    // O: Revenue Loss per week (stockout only)
    fRevL.push([`=IFERROR(IF(OR(A${r}="",B${r}>0),"",E${r}*7*${vlu(r, 5)}),"")`]);
  }

  sh.getRange(2, 3,  rows, 1).setFormulas(fProd);
  sh.getRange(2, 4,  rows, 1).setFormulas(fCat);
  sh.getRange(2, 5,  rows, 1).setFormulas(fVel);
  sh.getRange(2, 6,  rows, 1).setFormulas(fFBAd);
  sh.getRange(2, 7,  rows, 1).setFormulas(fInb);
  sh.getRange(2, 8,  rows, 1).setFormulas(fTrans);
  sh.getRange(2, 9,  rows, 1).setFormulas(fETA);
  sh.getRange(2, 10, rows, 1).setFormulas(fProdQ);
  sh.getRange(2, 11, rows, 1).setFormulas(fSup);
  sh.getRange(2, 12, rows, 1).setFormulas(fDOS);
  sh.getRange(2, 13, rows, 1).setFormulas(fStat);
  sh.getRange(2, 14, rows, 1).setFormulas(fReord);
  sh.getRange(2, 15, rows, 1).setFormulas(fRevL);

  yellow(sh, 2, 1,  rows, 2);       // A-B
  formulaCell(sh, 2, 3, rows, 13);  // C-O
  yellow(sh, 2, 16, rows, 2);       // P-Q

  sh.getRange(2, 6,  rows, 1).setNumberFormat('0.0');
  sh.getRange(2, 9,  rows, 1).setNumberFormat('dd MMM');
  sh.getRange(2, 12, rows, 1).setNumberFormat('0.0');
  sh.getRange(2, 15, rows, 1).setNumberFormat('"$"#,##0');
  sh.getRange(2, 16, rows, 1).setNumberFormat('dd MMM HH:mm');
  [2,7,8,10,11,14].forEach(c => sh.getRange(2, c, rows, 1).setNumberFormat('#,##0'));

  altRows(sh, 1, rows + 1, headers.length);

  const fullR   = sh.getRange(2, 1,  rows, headers.length);
  const statusR = sh.getRange(2, 13, rows, 1);
  const fbaDR   = sh.getRange(2, 6,  rows, 1);
  const revLR   = sh.getRange(2, 15, rows, 1);

  sh.setConditionalFormatRules([
    // Status badges (highest priority)
    cfText(statusR, 'STOCKOUT', '#7b1fa2', '#ffffff'),
    cfText(statusR, 'CRITICAL', '#c62828', '#ffffff'),
    cfText(statusR, 'WATCH',    '#e65100', '#ffffff'),
    cfText(statusR, 'HEALTHY',  '#2e7d32', '#ffffff'),
    // FBA Days gradient
    cfFormula(fbaDR, `=AND(F2<>"",F2<28)`,   '#ffcdd2'),
    cfFormula(fbaDR, `=AND(F2>=28,F2<=37)`,  '#fff3e0'),
    cfFormula(fbaDR, `=F2>37`,               '#c8e6c9'),
    // Rev Loss alert
    cfFormula(revLR, `=O2>0`, '#ffcdd2'),
    // Full-row highlights (lower priority)
    cfFormula(fullR, `=$M2="STOCKOUT"`, '#f3e5f5'),
    cfFormula(fullR, `=$M2="CRITICAL"`, '#ffcdd2'),
    cfFormula(fullR, `=$M2="WATCH"`,    '#fff9c4'),
  ]);

  setupProtection(sh, [sh.getRange(2, 3, rows, 13)]);  // C-O
}

// ─── 🏭 3PL REPORT ───────────────────────────────────────────────────────────

function build3PLReport(ss) {
  const sh = ss.getSheetByName(SH.THREE_PL);
  sh.clear();
  sh.setTabColor('#1565c0');

  const headers = [
    'SKU', 'Product',
    '3PL WC\nStock', '3PL EC\nStock', 'Total 3PL',
    'In Transit\n→ WC', 'In Transit\n→ EC', 'Total\nIn Transit',
    'Nearest ETA\nto WC', 'Nearest ETA\nto EC',
    'Total\nAvailable',
  ];
  hdr(sh, headers, 44);
  sh.setFrozenRows(1);
  sh.setFrozenColumns(2);

  const widths = [80,200, 100,100,100, 110,110,110, 120,120, 110];
  widths.forEach((w, i) => sh.setColumnWidth(i + 1, w));

  const rows = 50;
  const I = SH.ITEMS;

  const fProd=[], fTotal=[], fWCin=[], fECin=[], fTotalIn=[], fWCeta=[], fECeta=[], fAvail=[];
  for (let i = 0; i < rows; i++) {
    const r = i + 2;

    fProd.push([`=${vlu(r, 2)}`]);
    fTotal.push([`=IF(A${r}="","",C${r}+D${r})`]);

    fWCin.push([
      `=IF(A${r}="","",SUMPRODUCT(` +
      `('${I}'!B$2:B$500=A${r})*` +
      `('${I}'!E$2:E$500="China → 3PL WC")*` +
      `('${I}'!F$2:F$500="In Transit")*` +
      `('${I}'!D$2:D$500)))`
    ]);

    fECin.push([
      `=IF(A${r}="","",SUMPRODUCT(` +
      `('${I}'!B$2:B$500=A${r})*` +
      `('${I}'!E$2:E$500="China → 3PL EC")*` +
      `('${I}'!F$2:F$500="In Transit")*` +
      `('${I}'!D$2:D$500)))`
    ]);

    fTotalIn.push([`=IF(A${r}="","",F${r}+G${r})`]);

    fWCeta.push([
      `=IFERROR(IF(A${r}="","",MINIFS('${I}'!G$2:G$500,` +
      `'${I}'!B$2:B$500,A${r},'${I}'!E$2:E$500,"China → 3PL WC",'${I}'!F$2:F$500,"In Transit")),"")`
    ]);

    fECeta.push([
      `=IFERROR(IF(A${r}="","",MINIFS('${I}'!G$2:G$500,` +
      `'${I}'!B$2:B$500,A${r},'${I}'!E$2:E$500,"China → 3PL EC",'${I}'!F$2:F$500,"In Transit")),"")`
    ]);

    fAvail.push([`=IF(A${r}="","",E${r}+H${r})`]);
  }

  sh.getRange(2, 2,  rows, 1).setFormulas(fProd);
  sh.getRange(2, 5,  rows, 1).setFormulas(fTotal);
  sh.getRange(2, 6,  rows, 1).setFormulas(fWCin);
  sh.getRange(2, 7,  rows, 1).setFormulas(fECin);
  sh.getRange(2, 8,  rows, 1).setFormulas(fTotalIn);
  sh.getRange(2, 9,  rows, 1).setFormulas(fWCeta);
  sh.getRange(2, 10, rows, 1).setFormulas(fECeta);
  sh.getRange(2, 11, rows, 1).setFormulas(fAvail);

  sh.getRange(2, 3, rows, 2).setValues(Array(rows).fill([0, 0]));

  yellow(sh, 2, 1, rows, 1);       // A: SKU
  yellow(sh, 2, 3, rows, 2);       // C-D: 3PL stocks
  formulaCell(sh, 2, 2, rows, 1);  // B
  formulaCell(sh, 2, 5, rows, 7);  // E-K

  sh.getRange(2, 9, rows, 2).setNumberFormat('dd MMM');
  [3,4,5,6,7,8,11].forEach(c => sh.getRange(2, c, rows, 1).setNumberFormat('#,##0'));

  altRows(sh, 1, rows + 1, headers.length);

  setupProtection(sh, [
    sh.getRange(2, 2, rows, 1),
    sh.getRange(2, 5, rows, 7),
  ]);
}

// ─── 🚢 SHIPMENTS ────────────────────────────────────────────────────────────

function buildShipments(ss) {
  const sh = ss.getSheetByName(SH.SHIPMENTS);
  sh.clear();
  sh.setTabColor('#00695c');

  // A  Shipment ID      🟡
  // B  Carrier Inv #    🟡
  // C  FBA Shipment #   🟡
  // D  Type             🟡 dropdown
  // E  Origin           🔵 formula
  // F  Destination      🔵 formula
  // G  ETD              🟡
  // H  ETA              🟡
  // I  Status           🟡 dropdown
  // J  Days Left        🔵 formula
  // K  Last Status Change 🟡 (auto via P10 Gmail parser)
  // L  Tracking #       🟡
  // M  Notes            🟡

  const headers = [
    'Shipment ID', 'Carrier Inv #', 'FBA Shipment #',
    'Type', 'Origin', 'Destination',
    'ETD', 'ETA', 'Status',
    'Days Left', 'Last Status Change',
    'Tracking #', 'Notes',
  ];
  hdr(sh, headers, 44);
  sh.setFrozenRows(1);
  sh.setFrozenColumns(4);

  const widths = [120,140,140, 160,140,120, 110,110,110, 80,130, 160,220];
  widths.forEach((w, i) => sh.setColumnWidth(i + 1, w));

  const types    = ['China → FBA','China → 3PL WC','China → 3PL EC','3PL WC → FBA','3PL EC → FBA'];
  const statuses = ['Planned','In Transit','Arrived at 3PL','Received','Cancelled'];
  const rows = 300;

  dropdown(sh, 2, 4, rows, types);
  dropdown(sh, 2, 9, rows, statuses);

  const fOrigin=[], fDest=[], fDays=[];
  for (let i = 0; i < rows; i++) {
    const r = i + 2;

    fOrigin.push([
      `=IF(D${r}="","",IF(OR(D${r}="China → FBA",D${r}="China → 3PL WC",D${r}="China → 3PL EC"),` +
      `"China",IF(D${r}="3PL WC → FBA","3PL WC","3PL EC")))`
    ]);

    fDest.push([
      `=IF(D${r}="","",IF(D${r}="China → FBA","FBA",` +
      `IF(D${r}="China → 3PL WC","3PL WC",IF(D${r}="China → 3PL EC","3PL EC","FBA"))))`
    ]);

    fDays.push([
      `=IFERROR(IF(OR(H${r}="",I${r}="Received",I${r}="Cancelled"),"",MAX(0,H${r}-TODAY())),"")`
    ]);
  }

  sh.getRange(2, 5, rows, 1).setFormulas(fOrigin);
  sh.getRange(2, 6, rows, 1).setFormulas(fDest);
  sh.getRange(2, 10, rows, 1).setFormulas(fDays);

  yellow(sh, 2, 1, rows, 4);    // A-D
  yellow(sh, 2, 7, rows, 3);    // G-I (ETD, ETA, Status)
  yellow(sh, 2, 11, rows, 3);   // K-M (Last Status Change, Tracking, Notes)
  formulaCell(sh, 2, 5, rows, 2);  // E-F
  formulaCell(sh, 2, 10, rows, 1); // J

  sh.getRange(2, 7,  rows, 2).setNumberFormat('dd MMM yyyy');
  sh.getRange(2, 10, rows, 1).setNumberFormat('0');
  sh.getRange(2, 11, rows, 1).setNumberFormat('dd MMM HH:mm');

  const statusR = sh.getRange(2, 9,  rows, 1);
  const daysR   = sh.getRange(2, 10, rows, 1);
  sh.setConditionalFormatRules([
    cfText(statusR, 'In Transit',     '#e3f2fd', '#0d47a1'),
    cfText(statusR, 'Arrived at 3PL', '#fff3e0', '#e65100'),
    cfText(statusR, 'Received',       '#e8f5e9', '#1b5e20'),
    cfText(statusR, 'Cancelled',      '#f5f5f5', '#9e9e9e'),
    cfFormula(daysR, `=AND(J2<>"",J2<=7,I2="In Transit")`, '#ffcdd2'),
  ]);

  setupProtection(sh, [
    sh.getRange(2, 5, rows, 2),   // E-F
    sh.getRange(2, 10, rows, 1),  // J
  ]);
}

// ─── 🗃️ ITEMS ─────────────────────────────────────────────────────────────────

function buildItems(ss) {
  const sh = ss.getSheetByName(SH.ITEMS);
  sh.clear();
  sh.setTabColor('#4a148c');

  // A  Shipment ID  🟡 dropdown → Shipments
  // B  SKU          🟡 dropdown → Settings
  // C  Product      🔵 formula
  // D  Qty          🟡 manual
  // E  Type         🔵 VLOOKUP from Shipments col D (helper for SUMPRODUCT)
  // F  Status       🔵 VLOOKUP from Shipments col I
  // G  ETA          🔵 VLOOKUP from Shipments col H

  const headers = ['Shipment ID', 'SKU', 'Product', 'Qty', 'Type', 'Status', 'ETA'];
  hdr(sh, headers, 44);
  sh.setFrozenRows(1);
  sh.setFrozenColumns(2);

  const widths = [140, 100, 220, 90, 160, 110, 110];
  widths.forEach((w, i) => sh.setColumnWidth(i + 1, w));

  const rows = 500;
  const S = SH.SHIPMENTS;

  const fProd=[], fType=[], fStat=[], fETA=[];
  for (let i = 0; i < rows; i++) {
    const r = i + 2;

    fProd.push([
      `=IFERROR(IF(B${r}="","",INDEX('${SH.SETTINGS}'!B:B,MATCH(B${r},'${SH.SETTINGS}'!A:A,0))),"")`
    ]);

    // E: Type — VLOOKUP Shipments col D (4th col of A:D range)
    fType.push([
      `=IFERROR(IF(A${r}="","",VLOOKUP(A${r},'${S}'!$A:$D,4,0)),"")`
    ]);

    // F: Status — VLOOKUP Shipments col I (9th col of A:I range)
    fStat.push([
      `=IFERROR(IF(A${r}="","",VLOOKUP(A${r},'${S}'!$A:$I,9,0)),"")`
    ]);

    // G: ETA — VLOOKUP Shipments col H (8th col of A:H range)
    fETA.push([
      `=IFERROR(IF(A${r}="","",VLOOKUP(A${r},'${S}'!$A:$H,8,0)),"")`
    ]);
  }

  sh.getRange(2, 3, rows, 1).setFormulas(fProd);
  sh.getRange(2, 5, rows, 1).setFormulas(fType);
  sh.getRange(2, 6, rows, 1).setFormulas(fStat);
  sh.getRange(2, 7, rows, 1).setFormulas(fETA);

  yellow(sh, 2, 1, rows, 2);       // A-B
  yellow(sh, 2, 4, rows, 1);       // D: Qty
  formulaCell(sh, 2, 3, rows, 1);  // C
  formulaCell(sh, 2, 5, rows, 3);  // E-G

  // Shipment ID dropdown → Shipments col A
  const shipRule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(ss.getSheetByName(SH.SHIPMENTS).getRange('A2:A301'), true)
    .setAllowInvalid(true)
    .build();
  sh.getRange(2, 1, rows, 1).setDataValidation(shipRule);

  // SKU dropdown → Settings col A
  const skuRule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(ss.getSheetByName(SH.SETTINGS).getRange('A2:A31'), true)
    .setAllowInvalid(false)
    .build();
  sh.getRange(2, 2, rows, 1).setDataValidation(skuRule);

  sh.getRange(2, 4, rows, 1).setNumberFormat('#,##0');
  sh.getRange(2, 7, rows, 1).setNumberFormat('dd MMM yyyy');

  const statusR = sh.getRange(2, 6, rows, 1);
  sh.setConditionalFormatRules([
    cfText(statusR, 'In Transit',     '#e3f2fd', '#0d47a1'),
    cfText(statusR, 'Arrived at 3PL', '#fff3e0', '#e65100'),
    cfText(statusR, 'Received',       '#e8f5e9', '#1b5e20'),
    cfText(statusR, 'Cancelled',      '#f5f5f5', '#9e9e9e'),
  ]);

  setupProtection(sh, [
    sh.getRange(2, 3, rows, 1),   // C
    sh.getRange(2, 5, rows, 3),   // E-G
  ]);
}

// ─── 📝 NEW SHIPMENT FORM ────────────────────────────────────────────────────

function buildNewShipment(ss) {
  const sh = ss.getSheetByName(SH.NEW_SHIP);
  sh.clear();
  sh.setTabColor('#f57c00');

  sh.setColumnWidth(1, 20);
  sh.setColumnWidth(2, 180);
  sh.setColumnWidth(3, 260);
  sh.setColumnWidth(4, 20);
  sh.setColumnWidth(5, 180);
  sh.setColumnWidth(6, 260);
  sh.hideColumns(1);
  sh.hideColumns(4);

  // ── Title ──
  const titleR = sh.getRange('B1:F1');
  titleR.merge()
    .setValue('📝 New Shipment')
    .setBackground(C.headerBg)
    .setFontColor(C.headerFg)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sh.setRowHeight(1, 44);

  // ── Form fields: col B = label, col C = input, col E = label, col F = input ──
  const fields = [
    // [row, label1, label2]
    [3,  'Shipment ID (auto)',    'Type'],
    [4,  'ETD (departure)',       'ETA (arrival)'],
    [5,  'Status',                'Tracking #'],
    [6,  'Carrier Inv #',         'FBA Shipment #'],
    [7,  'Notes',                 ''],
  ];

  fields.forEach(([r, l1, l2]) => {
    sh.getRange(r, 2).setValue(l1).setFontWeight('bold').setFontColor('#374151');
    if (l2) sh.getRange(r, 5).setValue(l2).setFontWeight('bold').setFontColor('#374151');
    sh.setRowHeight(r, 36);
  });

  // Input cells (yellow)
  [[3,3],[3,6],[4,3],[4,6],[5,3],[5,6],[6,3],[6,6],[7,3]].forEach(([r,c]) =>
    sh.getRange(r, c).setBackground(C.inputBg).setBorder(true,true,true,true,false,false,'#d1d5db', SpreadsheetApp.BorderStyle.SOLID)
  );

  // Dropdowns on form
  const types    = ['China → FBA','China → 3PL WC','China → 3PL EC','3PL WC → FBA','3PL EC → FBA'];
  const statuses = ['Planned','In Transit','Arrived at 3PL','Received','Cancelled'];
  sh.getRange(3, 6).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(types, true).build()
  );
  sh.getRange(5, 3).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(statuses, true).setAllowInvalid(false).build()
  );

  // Date formats
  sh.getRange(4, 3).setNumberFormat('dd MMM yyyy');
  sh.getRange(4, 6).setNumberFormat('dd MMM yyyy');

  // Placeholder: Shipment ID auto-generated on save
  sh.getRange(3, 3).setValue('(auto)').setFontColor('#9ca3af').setFontStyle('italic');

  // ── SKU / Qty table ──
  const tableHdrRow = 9;
  sh.setRowHeight(tableHdrRow, 36);
  sh.getRange(tableHdrRow, 2, 1, 3)
    .setValues([['#', 'SKU', 'Qty']])
    .setBackground(C.headerBg)
    .setFontColor(C.headerFg)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  const skuRule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(ss.getSheetByName(SH.SETTINGS).getRange('A2:A31'), true)
    .setAllowInvalid(false)
    .build();

  const SKU_ROWS = 20;
  for (let i = 0; i < SKU_ROWS; i++) {
    const r = tableHdrRow + 1 + i;
    sh.setRowHeight(r, 30);
    sh.getRange(r, 2).setValue(i + 1).setHorizontalAlignment('center').setFontColor('#9ca3af');
    sh.getRange(r, 3).setBackground(C.inputBg).setDataValidation(skuRule);
    sh.getRange(r, 4).setBackground(C.inputBg).setNumberFormat('#,##0');
    if (i % 2 === 1) sh.getRange(r, 2, 1, 3).setBackground('#fef9eb');
  }
  // Fix: qty column is col 4 (D), not col 4 of sheet — re-map
  // Actually in this form: B=2(label/num), C=3(SKU), D=4(Qty) — let me fix:
  // C=SKU, D=Qty but D is col 4. Let me redo:
  sh.getRange(tableHdrRow, 2, 1, 3).setValues([['#', 'SKU', 'Qty']]);
  for (let i = 0; i < SKU_ROWS; i++) {
    const r = tableHdrRow + 1 + i;
    sh.getRange(r, 4).setBackground(C.inputBg).setNumberFormat('#,##0');
  }

  // ── Button row ──
  const btnRow = tableHdrRow + SKU_ROWS + 2;
  sh.setRowHeight(btnRow, 40);
  sh.getRange(btnRow, 2, 1, 2)
    .merge()
    .setValue('▶  ЗБЕРЕГТИ ШИПМЕНТ')
    .setBackground(C.btnBg)
    .setFontColor(C.btnFg)
    .setFontWeight('bold')
    .setFontSize(12)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  sh.getRange(btnRow, 5, 1, 2)
    .merge()
    .setValue('✕  ОЧИСТИТИ ФОРМУ')
    .setBackground('#6b7280')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setFontSize(12)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  // Instruction note
  sh.getRange(btnRow + 2, 2, 1, 5)
    .merge()
    .setValue('➜ Для збереження: Меню "Stylia SC" → Save New Shipment')
    .setFontColor('#6b7280')
    .setFontStyle('italic')
    .setFontSize(10);
}

// ─── SAVE SHIPMENT (form → Shipments + Items) ─────────────────────────────

function saveShipment() {
  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const ui  = SpreadsheetApp.getUi();
  const frm = ss.getSheetByName(SH.NEW_SHIP);
  const shp = ss.getSheetByName(SH.SHIPMENTS);
  const itm = ss.getSheetByName(SH.ITEMS);

  // Read form header
  let   shipId  = frm.getRange(3, 3).getValue();
  const type    = frm.getRange(3, 6).getValue();
  const etd     = frm.getRange(4, 3).getValue();
  const eta     = frm.getRange(4, 6).getValue();
  const status  = frm.getRange(5, 3).getValue();
  const track   = frm.getRange(5, 6).getValue();
  const carrier = frm.getRange(6, 3).getValue();
  const fbaNum  = frm.getRange(6, 6).getValue();
  const notes   = frm.getRange(7, 3).getValue();

  if (!type) { ui.alert('Вкажіть Type шипменту.'); return; }

  // Auto-generate Shipment ID if missing or placeholder
  if (!shipId || shipId === '(auto)') {
    shipId = generateShipmentId_(shp);
  }

  // Read SKU rows (table starts row 10, 20 rows)
  const skuData = frm.getRange(10, 3, 20, 2).getValues()
    .filter(([sku, qty]) => sku && qty > 0);

  if (!skuData.length) { ui.alert('Додайте хоча б один SKU.'); return; }

  // Write to Shipments tab
  const shpLastRow = Math.max(shp.getLastRow(), 1);
  shp.getRange(shpLastRow + 1, 1, 1, 13).setValues([[
    shipId, carrier, fbaNum, type, '', '', etd, eta, status, '', '', track, notes
  ]]);

  // Write to Items tab
  const itmLastRow = Math.max(itm.getLastRow(), 1);
  const itmRows = skuData.map(([sku, qty]) => [shipId, sku, '', qty, '', '', '']);
  itm.getRange(itmLastRow + 1, 1, itmRows.length, 7).setValues(itmRows);

  // Clear form inputs
  clearShipmentForm();

  ui.alert(`✅ Шипмент ${shipId} збережено!\n${skuData.length} SKU додано до Items.`);
}

function clearShipmentForm() {
  const frm = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SH.NEW_SHIP);
  frm.getRange(3, 3).setValue('(auto)').setFontColor('#9ca3af').setFontStyle('italic');
  frm.getRange(3, 6).clearContent();
  frm.getRange(4, 3).clearContent();
  frm.getRange(4, 6).clearContent();
  frm.getRange(5, 3).clearContent();
  frm.getRange(5, 6).clearContent();
  frm.getRange(6, 3).clearContent();
  frm.getRange(6, 6).clearContent();
  frm.getRange(7, 3).clearContent();
  frm.getRange(10, 3, 20, 2).clearContent();
}

function generateShipmentId_(shp) {
  const tz   = Session.getScriptTimeZone();
  const date = Utilities.formatDate(new Date(), tz, 'yyyyMMdd');
  const all  = shp.getLastRow() > 1
    ? shp.getRange(2, 1, shp.getLastRow() - 1, 1).getValues().flat().map(String)
    : [];
  const todayIds = all.filter(id => id.startsWith(`SHP-${date}`));
  const seq = String(todayIds.length + 1).padStart(3, '0');
  return `SHP-${date}-${seq}`;
}

// ─── 🏗️ PRODUCTION ───────────────────────────────────────────────────────────

function buildProduction(ss) {
  const sh = ss.getSheetByName(SH.PRODUCTION);
  sh.clear();
  sh.setTabColor('#4e342e');

  const headers = [
    'PO / Invoice #', 'SKU', 'Product',
    'Qty', 'Init Payment', 'Ready Date', 'Booking Date', 'Departure',
    'Status', 'Notes',
  ];
  hdr(sh, headers, 44);
  sh.setFrozenRows(1);
  sh.setFrozenColumns(3);

  const widths = [150,80,220, 90,120,120,120,120, 130,250];
  widths.forEach((w, i) => sh.setColumnWidth(i + 1, w));

  const statuses = ['In Production','Ready','Booked','Shipped','Cancelled'];
  const rows = 200;

  dropdown(sh, 2, 9, rows, statuses);

  const fProd = [];
  for (let i = 0; i < rows; i++) {
    const r = i + 2;
    fProd.push([
      `=IFERROR(IF(B${r}="","",INDEX('${SH.SETTINGS}'!B:B,MATCH(B${r},'${SH.SETTINGS}'!A:A,0))),"")`
    ]);
  }
  sh.getRange(2, 3, rows, 1).setFormulas(fProd);

  sh.getRange(2, 5, rows, 4).setNumberFormat('dd MMM yyyy');
  sh.getRange(2, 4, rows, 1).setNumberFormat('#,##0');

  yellow(sh, 2, 1, rows, 2);     // A-B
  yellow(sh, 2, 4, rows, 7);     // D-J
  formulaCell(sh, 2, 3, rows, 1); // C

  const statusR = sh.getRange(2, 9, rows, 1);
  const readyR  = sh.getRange(2, 6, rows, 1);
  sh.setConditionalFormatRules([
    cfText(statusR, 'In Production', '#e3f2fd', '#0d47a1'),
    cfText(statusR, 'Ready',         '#fff3e0', '#e65100'),
    cfText(statusR, 'Booked',        '#f3e5f5', '#6a1b9a'),
    cfText(statusR, 'Shipped',       '#e8f5e9', '#1b5e20'),
    cfText(statusR, 'Cancelled',     '#f5f5f5', '#9e9e9e'),
    cfFormula(readyR,
      `=AND(F2<>"",F2<TODAY(),I2<>"Shipped",I2<>"Cancelled")`, '#ffcdd2'),
  ]);

  setupProtection(sh, [sh.getRange(2, 3, rows, 1)]);
}

// ─── 📈 FORECAST ─────────────────────────────────────────────────────────────

function buildForecast(ss) {
  const sh = ss.getSheetByName(SH.FORECAST);
  sh.clear();
  sh.setTabColor('#2e7d32');

  const periods = [7,15,30,60,90,120,150,180,270,360];
  const headers = ['SKU','Product', ...periods.map(p => `${p}d`), 'Avg Daily\n(from 30d)'];
  hdr(sh, headers, 44);
  sh.setFrozenRows(1);
  sh.setFrozenColumns(2);

  const widths = [80,200,...periods.map(() => 90),110];
  widths.forEach((w, i) => sh.setColumnWidth(i + 1, w));

  const rows = 50;
  const col30d = colLetter(2 + periods.indexOf(30) + 1);

  const fProd=[], fAvg=[];
  for (let i = 0; i < rows; i++) {
    const r = i + 2;
    fProd.push([`=${vlu(r, 2)}`]);
    fAvg.push([`=IFERROR(IF(A${r}="","",${col30d}${r}/30),"")`]);
  }
  sh.getRange(2, 2, rows, 1).setFormulas(fProd);
  sh.getRange(2, 3 + periods.length, rows, 1).setFormulas(fAvg);

  yellow(sh, 2, 1, rows, 1);
  formulaCell(sh, 2, 2, rows, 1);
  yellow(sh, 2, 3, rows, periods.length);
  formulaCell(sh, 2, 3 + periods.length, rows, 1);

  sh.getRange(2, 3 + periods.length, rows, 1).setNumberFormat('0.0');
  sh.getRange(2, 3, rows, periods.length).setNumberFormat('#,##0');

  altRows(sh, 1, rows + 1, headers.length);

  setupProtection(sh, [
    sh.getRange(2, 2, rows, 1),
    sh.getRange(2, 3 + periods.length, rows, 1),
  ]);
}

// ─── 📋 PO ───────────────────────────────────────────────────────────────────

function buildPO(ss) {
  const sh = ss.getSheetByName(SH.PO);
  sh.clear();
  sh.setTabColor('#1a73e8');
  sh.setFrozenRows(1);
  sh.setFrozenColumns(1);

  const headers = [
    'PO #','Date Issued','Supplier','SKU','Product Name',
    'Units Ordered','Unit Price $','Total PO $','Currency',
    'Pay 1 Date','Pay 1 Amt $','Pay 1 %',
    'Pay 2 Date','Pay 2 Amt $','Pay 2 %',
    'Shipment ID','Prod PO #','Status','Notes',
  ];
  hdr(sh, headers, 44);

  const widths = [100,100,140,90,180, 90,90,110,70, 100,110,60, 100,110,60, 120,90,110,220];
  widths.forEach((w, i) => sh.setColumnWidth(i + 1, w));

  const ROWS = 200;
  const fProd=[], fTotal=[], fP1=[], fP2=[];
  for (let i = 0; i < ROWS; i++) {
    const r = i + 2;
    fProd.push([`=IFERROR(IF(D${r}="","",INDEX('${SH.SETTINGS}'!B:B,MATCH(D${r},'${SH.SETTINGS}'!A:A,0))),"")`]);
    fTotal.push([`=IF(OR(F${r}="",G${r}=""),"",F${r}*G${r})`]);
    fP1.push([`=IF(OR(H${r}="",H${r}=0),"",IFERROR(K${r}/H${r},""))`]);
    fP2.push([`=IF(OR(H${r}="",H${r}=0),"",IFERROR(N${r}/H${r},""))`]);
  }
  sh.getRange(2, 5,  ROWS, 1).setFormulas(fProd);
  sh.getRange(2, 8,  ROWS, 1).setFormulas(fTotal);
  sh.getRange(2, 12, ROWS, 1).setFormulas(fP1);
  sh.getRange(2, 15, ROWS, 1).setFormulas(fP2);

  yellow(sh, 2, 1,  ROWS, 4);   // A-D
  yellow(sh, 2, 6,  ROWS, 2);   // F-G
  yellow(sh, 2, 9,  ROWS, 3);   // I-K
  yellow(sh, 2, 13, ROWS, 2);   // M-N
  yellow(sh, 2, 16, ROWS, 4);   // P-S
  formulaCell(sh, 2, 5,  ROWS, 1);
  formulaCell(sh, 2, 8,  ROWS, 1);
  formulaCell(sh, 2, 12, ROWS, 1);
  formulaCell(sh, 2, 15, ROWS, 1);

  const skuRule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(ss.getSheetByName(SH.SETTINGS).getRange('A2:A31'), true)
    .setAllowInvalid(false).build();
  sh.getRange(2, 4, ROWS, 1).setDataValidation(skuRule);
  dropdown(sh, 2, 9,  ROWS, ['USD','CNY','EUR']);
  dropdown(sh, 2, 18, ROWS, ['Draft','Confirmed','Pay 1 Done','Pay 2 Done','Completed','Cancelled']);

  sh.getRange(2, 2,  ROWS, 1).setNumberFormat('yyyy-mm-dd');
  sh.getRange(2, 6,  ROWS, 1).setNumberFormat('#,##0');
  sh.getRange(2, 7,  ROWS, 2).setNumberFormat('$#,##0.00');
  sh.getRange(2, 10, ROWS, 1).setNumberFormat('yyyy-mm-dd');
  sh.getRange(2, 11, ROWS, 1).setNumberFormat('$#,##0.00');
  sh.getRange(2, 12, ROWS, 1).setNumberFormat('0%');
  sh.getRange(2, 13, ROWS, 1).setNumberFormat('yyyy-mm-dd');
  sh.getRange(2, 14, ROWS, 1).setNumberFormat('$#,##0.00');
  sh.getRange(2, 15, ROWS, 1).setNumberFormat('0%');

  const statusR = sh.getRange(2, 18, ROWS, 1);
  sh.setConditionalFormatRules([
    cfText(statusR, 'Completed',  '#e6f4ea', '#137333'),
    cfText(statusR, 'Pay 2 Done', '#e8f0fe', '#1a73e8'),
    cfText(statusR, 'Pay 1 Done', '#fce8b2', '#e37400'),
    cfText(statusR, 'Confirmed',  '#f3e8fd', '#7b1fa2'),
    cfText(statusR, 'Draft',      '#f5f5f5', '#5f6368'),
    cfText(statusR, 'Cancelled',  '#fce8e6', '#c5221f'),
  ]);

  setupProtection(sh, [
    sh.getRange(2, 5,  ROWS, 1),
    sh.getRange(2, 8,  ROWS, 1),
    sh.getRange(2, 12, ROWS, 1),
    sh.getRange(2, 15, ROWS, 1),
  ]);
}

// ─── 🚛 FREIGHT ──────────────────────────────────────────────────────────────

function buildFreight(ss) {
  const sh = ss.getSheetByName(SH.FREIGHT);
  sh.clear();
  sh.setTabColor('#e37400');
  sh.setFrozenRows(1);
  sh.setFrozenColumns(1);

  const headers = [
    'Invoice #','Forwarder','Invoice Date','Shipment ID','SKU','Units in Shipment',
    'Ocean Freight $','Local Delivery $','Customs / Duties $','Port Charges $','Insurance $','Other $',
    'Total Freight $','Cost / Unit $','Status','Notes',
  ];
  hdr(sh, headers, 44);

  const widths = [100,150,100,120,90,110, 110,110,110,100,90,90, 110,100, 100,220];
  widths.forEach((w, i) => sh.setColumnWidth(i + 1, w));

  const ROWS = 200;
  const I = SH.ITEMS;

  const fUnits=[], fTotal=[], fCPU=[];
  for (let i = 0; i < ROWS; i++) {
    const r = i + 2;
    // Units: match Shipment ID (Items col A) + SKU (Items col B) → sum Qty (Items col D)
    fUnits.push([
      `=IF(D${r}="","",IFERROR(SUMPRODUCT(` +
      `('${I}'!$A$2:$A$500=D${r})*('${I}'!$B$2:$B$500=E${r})*('${I}'!$D$2:$D$500)),0))`
    ]);
    fTotal.push([`=IF(D${r}="","",SUM(G${r}:L${r}))`]);
    fCPU.push([`=IF(OR(F${r}="",F${r}=0),"",IFERROR(M${r}/F${r},""))`]);
  }
  sh.getRange(2, 6,  ROWS, 1).setFormulas(fUnits);
  sh.getRange(2, 13, ROWS, 1).setFormulas(fTotal);
  sh.getRange(2, 14, ROWS, 1).setFormulas(fCPU);

  yellow(sh, 2, 1,  ROWS, 5);   // A-E
  yellow(sh, 2, 7,  ROWS, 6);   // G-L
  yellow(sh, 2, 15, ROWS, 2);   // O-P
  formulaCell(sh, 2, 6,  ROWS, 1);
  formulaCell(sh, 2, 13, ROWS, 2);

  const skuRule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(ss.getSheetByName(SH.SETTINGS).getRange('A2:A31'), true)
    .setAllowInvalid(false).build();
  sh.getRange(2, 5, ROWS, 1).setDataValidation(skuRule);
  dropdown(sh, 2, 15, ROWS, ['Pending','Invoiced','Paid','Disputed']);

  sh.getRange(2, 3,  ROWS, 1).setNumberFormat('yyyy-mm-dd');
  sh.getRange(2, 6,  ROWS, 1).setNumberFormat('#,##0');
  sh.getRange(2, 7,  ROWS, 8).setNumberFormat('$#,##0.00');

  const statusR = sh.getRange(2, 15, ROWS, 1);
  sh.setConditionalFormatRules([
    cfText(statusR, 'Paid',     '#e6f4ea', '#137333'),
    cfText(statusR, 'Invoiced', '#e8f0fe', '#1a73e8'),
    cfText(statusR, 'Pending',  '#fce8b2', '#e37400'),
    cfText(statusR, 'Disputed', '#fce8e6', '#c5221f'),
  ]);

  setupProtection(sh, [
    sh.getRange(2, 6,  ROWS, 1),
    sh.getRange(2, 13, ROWS, 2),
  ]);
}

// ─── 💰 LANDED COST ──────────────────────────────────────────────────────────

function buildLandedCost(ss) {
  const sh = ss.getSheetByName(SH.LANDED);
  sh.clear();
  sh.setTabColor('#137333');
  sh.setFrozenRows(1);
  sh.setFrozenColumns(2);

  const headers = [
    'SKU','Product Name',
    'Avg COGS $/unit','Avg Freight $/unit',
    'FBA Fee $','3PL Fee $','Referral Fee $','Other Costs $',
    'Total Landed Cost','Selling Price',
    'Gross Profit $','Gross Margin %','Break-even','Min Price (15%)',
  ];
  hdr(sh, headers, 50);

  const widths = [100,200, 120,130, 80,80,90,90, 130,110, 110,110,110,130];
  widths.forEach((w, i) => sh.setColumnWidth(i + 1, w));

  const ROWS = 30;

  const fName=[], fCOGS=[], fFrt=[], fTotal=[], fProfit=[], fMargin=[], fBreak=[], fMin=[];
  for (let i = 0; i < ROWS; i++) {
    const r = i + 2;

    fName.push([
      `=IFERROR(IF(A${r}="","",INDEX('${SH.SETTINGS}'!B:B,MATCH(A${r},'${SH.SETTINGS}'!A:A,0))),"")`
    ]);
    fCOGS.push([
      `=IF(A${r}="","",IFERROR(` +
      `SUMPRODUCT(('${SH.PO}'!$D$2:$D$500=A${r})*('${SH.PO}'!$F$2:$F$500)*('${SH.PO}'!$G$2:$G$500))/` +
      `SUMPRODUCT(('${SH.PO}'!$D$2:$D$500=A${r})*('${SH.PO}'!$F$2:$F$500)),0))`
    ]);
    fFrt.push([
      `=IF(A${r}="","",IFERROR(` +
      `SUMPRODUCT(('${SH.FREIGHT}'!$E$2:$E$500=A${r})*('${SH.FREIGHT}'!$F$2:$F$500)*('${SH.FREIGHT}'!$N$2:$N$500))/` +
      `SUMPRODUCT(('${SH.FREIGHT}'!$E$2:$E$500=A${r})*('${SH.FREIGHT}'!$F$2:$F$500)),0))`
    ]);
    fTotal.push([`=IF(A${r}="","",SUM(C${r}:H${r}))`]);
    fProfit.push([`=IF(OR(I${r}="",J${r}=""),"",J${r}-I${r})`]);
    fMargin.push([`=IF(OR(J${r}="",J${r}=0),"",IFERROR((J${r}-I${r})/J${r},""))`]);
    fBreak.push([`=IF(I${r}="","",I${r})`]);
    fMin.push([`=IF(I${r}="","",ROUND(I${r}/0.85,2))`]);
  }

  sh.getRange(2, 2,  ROWS, 1).setFormulas(fName);
  sh.getRange(2, 3,  ROWS, 1).setFormulas(fCOGS);
  sh.getRange(2, 4,  ROWS, 1).setFormulas(fFrt);
  sh.getRange(2, 9,  ROWS, 1).setFormulas(fTotal);
  sh.getRange(2, 11, ROWS, 1).setFormulas(fProfit);
  sh.getRange(2, 12, ROWS, 1).setFormulas(fMargin);
  sh.getRange(2, 13, ROWS, 1).setFormulas(fBreak);
  sh.getRange(2, 14, ROWS, 1).setFormulas(fMin);

  yellow(sh, 2, 1,  ROWS, 1);   // A
  yellow(sh, 2, 5,  ROWS, 4);   // E-H
  yellow(sh, 2, 10, ROWS, 1);   // J
  formulaCell(sh, 2, 2,  ROWS, 3);  // B-D
  formulaCell(sh, 2, 9,  ROWS, 1);  // I
  formulaCell(sh, 2, 11, ROWS, 4);  // K-N

  const skuRule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(ss.getSheetByName(SH.SETTINGS).getRange('A2:A31'), true)
    .setAllowInvalid(false).build();
  sh.getRange(2, 1, ROWS, 1).setDataValidation(skuRule);

  sh.getRange(2, 3,  ROWS, 7).setNumberFormat('$#,##0.00');
  sh.getRange(2, 10, ROWS, 1).setNumberFormat('$#,##0.00');
  sh.getRange(2, 11, ROWS, 1).setNumberFormat('$#,##0.00');
  sh.getRange(2, 12, ROWS, 1).setNumberFormat('0.0%');
  sh.getRange(2, 13, ROWS, 2).setNumberFormat('$#,##0.00');

  const marginR = sh.getRange(2, 12, ROWS, 1);
  sh.setConditionalFormatRules([
    cfFormula(marginR, `=AND(L2<>"",L2>=0.3)`,          '#e6f4ea'),
    cfFormula(marginR, `=AND(L2<>"",L2>=0.15,L2<0.3)`, '#fce8b2'),
    cfFormula(marginR, `=AND(L2<>"",L2<0.15)`,          '#fce8e6'),
  ]);

  setupProtection(sh, [
    sh.getRange(2, 2,  ROWS, 3),
    sh.getRange(2, 9,  ROWS, 1),
    sh.getRange(2, 11, ROWS, 4),
  ]);
}

// ─── 📥 IMPORT ───────────────────────────────────────────────────────────────

function buildImport(ss) {
  const sh = ss.getSheetByName(SH.IMPORT);
  sh.clear();
  sh.setTabColor('#0d47a1');

  sh.setColumnWidth(1, 20);
  sh.setColumnWidth(2, 200);
  sh.setColumnWidth(3, 400);
  sh.setColumnWidth(4, 200);
  sh.hideColumns(1);

  // Title
  sh.getRange('B1:D1').merge()
    .setValue('📥 Stock Import — CSV from Google Drive')
    .setBackground(C.headerBg).setFontColor(C.headerFg)
    .setFontWeight('bold').setFontSize(13)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.setRowHeight(1, 44);

  // ── FBA Stock section ──
  sh.getRange('B3').setValue('FBA STOCK').setFontWeight('bold').setFontSize(11);
  sh.getRange('B4').setValue('Google Drive File ID або URL:').setFontColor('#374151');
  sh.getRange('C4').setBackground(C.inputBg)
    .setBorder(true,true,true,true,false,false)
    .setNote('Вставте URL або File ID з Google Drive\nФормат CSV: колонки "sku" і "quantity" (або "afn-fulfillable-quantity")');
  sh.getRange('B5').setValue('Очікуваний формат:').setFontColor('#6b7280').setFontSize(9);
  sh.getRange('C5').setValue('sku, afn-fulfillable-quantity').setFontColor('#6b7280').setFontStyle('italic').setFontSize(9);

  sh.getRange('B7').setValue('▶  ОНОВИТИ FBA STOCK')
    .setBackground(C.btnBg).setFontColor(C.btnFg).setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setNote('Запустіть через Stylia SC → Import FBA Stock from Drive');
  sh.setRowHeight(7, 36);

  // ── 3PL Stock section ──
  sh.getRange('B10').setValue('3PL STOCK').setFontWeight('bold').setFontSize(11);
  sh.getRange('B11').setValue('Google Drive File ID або URL:').setFontColor('#374151');
  sh.getRange('C11').setBackground(C.inputBg)
    .setBorder(true,true,true,true,false,false)
    .setNote('Вставте URL або File ID з Google Drive\nФормат CSV: колонки "sku", "wc_qty", "ec_qty" (або адаптуйте до формату вашого 3PL)');
  sh.getRange('B12').setValue('Очікуваний формат:').setFontColor('#6b7280').setFontSize(9);
  sh.getRange('C12').setValue('sku, wc_qty, ec_qty').setFontColor('#6b7280').setFontStyle('italic').setFontSize(9);

  sh.getRange('B14').setValue('▶  ОНОВИТИ 3PL STOCK')
    .setBackground(C.btnBg).setFontColor(C.btnFg).setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setNote('Запустіть через Stylia SC → Import 3PL Stock from Drive');
  sh.setRowHeight(14, 36);

  // ── Import Log ──
  sh.getRange('B17').setValue('LOG ІМПОРТІВ').setFontWeight('bold').setFontSize(11);

  const logHeaders = ['Дата', 'Тип', 'Оновлено SKU', 'Статус', 'Деталі'];
  sh.getRange(18, 2, 1, logHeaders.length)
    .setValues([logHeaders])
    .setBackground(C.headerBg).setFontColor(C.headerFg).setFontWeight('bold');
  sh.setRowHeight(18, 32);

  [120,100,110,80,350].forEach((w, i) => sh.setColumnWidth(i + 2, w));

  // Protect log area (read-only — written by script)
  setupProtection(sh, [sh.getRange('C4'), sh.getRange('C11')]);
}

// ─── IMPORT LOGIC ─────────────────────────────────────────────────────────────

function importFBAStock() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const imp = ss.getSheetByName(SH.IMPORT);

  const fileRef = imp.getRange('C4').getValue().toString().trim();
  if (!fileRef) { ui.alert('Вставте Drive URL або File ID у клітинку C4.'); return; }

  try {
    const csv = getDriveFileContent_(fileRef);
    const data = parseCsv_(csv);

    if (!data.length) { ui.alert('CSV порожній або не вдалося розпарсити.'); return; }

    const headers = data[0].map(h => h.toLowerCase().trim());
    const skuCol  = findCol_(headers, ['sku','seller-sku','seller_sku']);
    const qtyCol  = findCol_(headers, ['afn-fulfillable-quantity','quantity','qty','fulfillable-quantity','afn_fulfillable_quantity']);

    if (skuCol < 0 || qtyCol < 0) {
      ui.alert(`Не знайдено потрібних колонок.\nЗнайдено: ${headers.join(', ')}\nПотрібно: sku + quantity`);
      return;
    }

    // Build lookup: SKU → qty
    const lookup = {};
    data.slice(1).forEach(row => {
      const sku = (row[skuCol] || '').toString().trim();
      const qty = parseInt(row[qtyCol], 10) || 0;
      if (sku) lookup[sku] = qty;
    });

    // Update Stock Report col B (FBA Stock)
    const stock = ss.getSheetByName(SH.STOCK);
    const skus  = stock.getRange(2, 1, 50, 1).getValues().flat();
    let updated = 0;

    skus.forEach((sku, i) => {
      if (sku && lookup[sku] !== undefined) {
        stock.getRange(i + 2, 2).setValue(lookup[sku]);
        updated++;
      }
    });

    // Log
    logImport_(imp, 'FBA Stock', updated, `Джерело: ${fileRef.substring(0, 40)}...`);
    ui.alert(`✅ FBA Stock оновлено!\n${updated} SKU з ${Object.keys(lookup).length} у файлі.`);

  } catch (err) {
    logImport_(imp, 'FBA Stock', 0, `ПОМИЛКА: ${err.message}`);
    ui.alert(`❌ Помилка імпорту:\n${err.message}`);
  }
}

function import3PLStock() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const imp = ss.getSheetByName(SH.IMPORT);

  const fileRef = imp.getRange('C11').getValue().toString().trim();
  if (!fileRef) { ui.alert('Вставте Drive URL або File ID у клітинку C11.'); return; }

  try {
    const csv = getDriveFileContent_(fileRef);
    const data = parseCsv_(csv);

    if (!data.length) { ui.alert('CSV порожній.'); return; }

    const headers = data[0].map(h => h.toLowerCase().trim());
    const skuCol  = findCol_(headers, ['sku','seller-sku']);
    const wcCol   = findCol_(headers, ['wc_qty','wc-qty','west-coast','wc']);
    const ecCol   = findCol_(headers, ['ec_qty','ec-qty','east-coast','ec']);

    if (skuCol < 0 || wcCol < 0 || ecCol < 0) {
      ui.alert(`Не знайдено потрібних колонок.\nЗнайдено: ${headers.join(', ')}\nПотрібно: sku, wc_qty, ec_qty`);
      return;
    }

    const lookup = {};
    data.slice(1).forEach(row => {
      const sku = (row[skuCol] || '').toString().trim();
      if (sku) lookup[sku] = {
        wc: parseInt(row[wcCol], 10) || 0,
        ec: parseInt(row[ecCol], 10) || 0,
      };
    });

    const tpl  = ss.getSheetByName(SH.THREE_PL);
    const skus = tpl.getRange(2, 1, 50, 1).getValues().flat();
    let updated = 0;

    skus.forEach((sku, i) => {
      if (sku && lookup[sku]) {
        tpl.getRange(i + 2, 3).setValue(lookup[sku].wc);
        tpl.getRange(i + 2, 4).setValue(lookup[sku].ec);
        updated++;
      }
    });

    logImport_(imp, '3PL Stock', updated, `Джерело: ${fileRef.substring(0, 40)}...`);
    ui.alert(`✅ 3PL Stock оновлено!\n${updated} SKU оновлено.`);

  } catch (err) {
    logImport_(imp, '3PL Stock', 0, `ПОМИЛКА: ${err.message}`);
    ui.alert(`❌ Помилка імпорту:\n${err.message}`);
  }
}

// ── Private helpers ──────────────────────────────────────────────────────────

function getDriveFileContent_(ref) {
  let fileId = ref;

  // Extract ID from URL if full URL was pasted
  const match = ref.match(/[-\w]{25,}/);
  if (match) fileId = match[0];

  const file = DriveApp.getFileById(fileId);
  return file.getBlob().getDataAsString();
}

function parseCsv_(csvText) {
  return Utilities.parseCsv(csvText);
}

function findCol_(headers, candidates) {
  for (const c of candidates) {
    const idx = headers.indexOf(c);
    if (idx >= 0) return idx;
  }
  return -1;
}

function logImport_(imp, type, count, details) {
  const logStart = 19; // first log data row
  const lastLog  = Math.max(imp.getLastRow(), logStart - 1);
  imp.getRange(lastLog + 1, 2, 1, 5).setValues([[
    new Date(), type, count, count > 0 ? '✅ OK' : '❌ Error', details
  ]]);
  imp.getRange(lastLog + 1, 2).setNumberFormat('dd MMM yyyy HH:mm');
}

// ─── FINANCE TABS REBUILD ────────────────────────────────────────────────────

function addFinanceSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const ok = ui.alert(
    'Rebuild Finance Tabs',
    'Recreates PO, Freight, and Landed Cost.\nExisting data will be lost. Continue?',
    ui.ButtonSet.YES_NO
  );
  if (ok !== ui.Button.YES) return;

  [SH.PO, SH.FREIGHT, SH.LANDED].forEach(name => {
    const s = ss.getSheetByName(name);
    if (s) ss.deleteSheet(s);
    ss.insertSheet(name);
  });

  buildPO(ss);
  buildFreight(ss);
  buildLandedCost(ss);

  SpreadsheetApp.flush();
  ui.alert('✅ Finance tabs rebuilt.');
}
