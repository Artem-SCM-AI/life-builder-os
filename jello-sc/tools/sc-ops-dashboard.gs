/**
 * Jello SC — Operations Dashboard
 * Run createSCOpsDashboard() to generate the spreadsheet.
 *
 * INPUTS : Yellow cells (#FFF9C4) — user edits freely
 * OUTPUTS: White cells — locked formula cells
 */

// ─── COLOR PALETTE ──────────────────────────────────────────────────────────
var C = {
  HDR:       "#263238",
  HDR_TXT:   "#FFFFFF",
  INPUT_YEL: "#FFF9C4",
  FORMULA:   "#FAFAFA",
  KEY_ROW:   "#ECEFF1",
  GREEN:     "#E8F5E9",
  GREEN_TXT: "#2E7D32",
  YELLOW:    "#FFF9C4",
  YELLOW_TXT:"#F57F17",
  RED:       "#FFEBEE",
  RED_TXT:   "#C62828",
  BLUE_ROW:  "#E3F2FD",
  AMBER_ROW: "#FFF8E1",
  GREY_ROW:  "#F5F5F5",
};

// ═════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═════════════════════════════════════════════════════════════════════════════

function columnLetter(n) {
  var s = "";
  while (n > 0) {
    n--;
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26);
  }
  return s;
}

function setSection(sheet, row, label, numCols) {
  var r = sheet.getRange(row, 1, 1, numCols);
  r.merge().setValue(label)
   .setBackground(C.HDR).setFontColor(C.HDR_TXT)
   .setFontWeight("bold").setFontSize(10);
}

function setInput(sheet, row, col) {
  sheet.getRange(row, col).setBackground(C.INPUT_YEL);
}

// ═════════════════════════════════════════════════════════════════════════════
// ENTRY POINT
// ═════════════════════════════════════════════════════════════════════════════

function createSCOpsDashboard() {
  var ss = SpreadsheetApp.create("Jello SC — Ops Dashboard");

  var refSheet = ss.getSheets()[0];
  refSheet.setName("REF");
  buildRefTab(refSheet);
  refSheet.hideSheet();

  var spSheet = ss.insertSheet("SHIPPING PLAN");
  var lcSheet = ss.insertSheet("LANDED COST");
  var dbSheet = ss.insertSheet("DASHBOARD");
  var fcSheet = ss.insertSheet("FORECAST");

  buildShippingPlanTab(spSheet);
  buildLandedCostTab(lcSheet);
  buildDashboardTab(dbSheet, ss);
  buildForecastTab(fcSheet);

  ss.setActiveSheet(dbSheet);

  var url = ss.getUrl();
  Logger.log("✅ Created: " + url);
  SpreadsheetApp.getUi().alert("✅ SC Ops Dashboard ready!\n\n" + url);
}

// ═════════════════════════════════════════════════════════════════════════════
// REF TAB
// ═════════════════════════════════════════════════════════════════════════════

function buildRefTab(s) {
  s.getRange(1, 1).setValue("REF — internal constants").setFontWeight("bold");

  var rows = [
    // [label, value, row]
    ["Jello units/CTN",       120,    3],
    ["Mixer units/CTN",       300,    4],
    ["Straws units/CTN",      100,    5],
    ["Production lead (days)", 42,    7],
    ["ETD buffer (days)",       7,    8],
    ["Train transit (days)",   25,    9],
    ["Sea transit (days)",     35,   10],
    ["Jello EXW USD/unit",   1.25,   12],
    ["Mixer EXW USD/unit",   null,   13],  // TBD
    ["Straws EXW USD/unit",  null,   14],  // TBD
    ["Reorder threshold (days)", 21,  16],
  ];

  rows.forEach(function(r) {
    s.getRange(r[2], 1).setValue(r[0]);
    if (r[1] !== null) s.getRange(r[2], 2).setValue(r[1]);
    else s.getRange(r[2], 2).setBackground(C.INPUT_YEL).setNote("TBD — update when known");
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// TAB STUBS (to be implemented in later tasks)
// ═════════════════════════════════════════════════════════════════════════════

function buildShippingPlanTab(s) {
  // Placeholder — implemented in Task 2
}

function buildLandedCostTab(s) {
  // Placeholder — implemented in Task 3
}

function buildDashboardTab(dbSheet, ss) {
  // Placeholder — implemented in Task 4
}

function buildForecastTab(s) {
  // Placeholder — implemented in Task 5
}
