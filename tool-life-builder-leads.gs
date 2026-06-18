// Life Builder OS — Lead Capture Script
// One spreadsheet, one tab per product + "All" master tab
// Apps Script URL: https://script.google.com/macros/s/AKfycbzfBe87y7FsxcCEm_4OU_RG0u7SsVKhKtsmWb1wthedrL5dW86637Duyb-6-WlMopkflw/exec

const SPREADSHEET_ID = '1APc2nOr8y9hQfOTITs7eW8yIulTAOQG34LJxltRMHfk';

// Per-product tab config: tab name + ordered columns for that product only
const PRODUCT_TABS = {
  'product-1': {
    name: 'P1 — Why Start AI',
    columns: [
      'timestamp', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content',
      'category',
      'pains', 'tags', 'custom_pain', 'buy_clicks',
      'hours_wasted', 'hours_with_ai',
      'first_name', 'email', 'job_title',
      'main_task', 'linkedin_url',
    ],
  },
  'product-5': {
    name: 'P5 — AI or Automation',
    columns: [
      'timestamp', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content',
      'score', 'tier_label', 'answers',
      'first_name', 'email', 'job_title',
      'point_a', 'point_b', 'timeline', 'linkedin_url',
    ],
  },
  'P-AI-Audit-UA': {
    name: 'P3 — AI Audit UA',
    columns: [
      'timestamp', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content',
      'category', 'role_id', 'job_title',
      'first_name', 'email', 'profession', 'comment',
      'score', 'hours_self', 'data_storage', 'team_size', 'ai_tools',
      'main_task', 'pain2',
      'pain_1', 'pain_1_score',
      'pain_2', 'pain_2_score',
      'pain_3', 'pain_3_score',
      'pain_4', 'pain_4_score',
      'pain_5', 'pain_5_score',
      'pain_6', 'pain_6_score',
      'pain_7', 'pain_7_score',
    ],
  },
};

// Master "All" tab — superset of all columns across all products
const ALL_TAB_NAME = 'All';
const ALL_COLUMNS = [
  'timestamp', 'product',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content',
  // P1-specific
  'category',
  'pains', 'tags', 'custom_pain', 'buy_clicks',
  'hours_wasted', 'hours_with_ai',
  // P5-specific
  'score', 'tier_label', 'answers',
  // Common
  'first_name', 'email', 'job_title',
  'main_task',
  'linkedin_url',
  // P3 — AI Audit UA
  'role_id', 'profession', 'comment',
  'hours_self', 'data_storage', 'team_size', 'ai_tools', 'pain2',
  'pain_1', 'pain_1_score',
  'pain_2', 'pain_2_score',
  'pain_3', 'pain_3_score',
  'pain_4', 'pain_4_score',
  'pain_5', 'pain_5_score',
  'pain_6', 'pain_6_score',
  'pain_7', 'pain_7_score',
];

// ── ENTRY POINTS ──────────────────────────────────────────────

function doPost(e) { return handleRequest(e); }
function doGet(e)  { return handleRequest(e); }

function handleRequest(e) {
  try {
    const data = parsePayload(e);
    appendLead(data);
    if (data.email) sendRoadmapEmail(data);
    return buildResponse({ status: 'ok' });
  } catch (err) {
    return buildResponse({ status: 'error', message: err.message });
  }
}

// ── PAYLOAD ───────────────────────────────────────────────────

function parsePayload(e) {
  if (e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (_) {}
  }
  return e.parameter || {};
}

// ── SHEET WRITING ─────────────────────────────────────────────

function appendLead(data) {
  const ss      = SpreadsheetApp.openById(SPREADSHEET_ID);
  const product = data.product || 'product-1';
  const tabCfg  = PRODUCT_TABS[product];

  // Write to product-specific tab (clean columns, no empty cells)
  if (tabCfg) {
    const sheet = getOrCreateSheet(ss, tabCfg.name, tabCfg.columns);
    sheet.appendRow(buildRow(data, tabCfg.columns));
  }

  // Always write to master "All" tab
  const allSheet = getOrCreateSheet(ss, ALL_TAB_NAME, ALL_COLUMNS);
  allSheet.appendRow(buildRow(data, ALL_COLUMNS));
}

function getOrCreateSheet(ss, name, columns) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(columns);
    sheet.getRange(1, 1, 1, columns.length)
      .setFontWeight('bold')
      .setBackground('#1a1a1a')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function buildRow(data, columns) {
  return columns.map(col => {
    if (col === 'timestamp') return data.timestamp || new Date().toISOString();
    if (col === 'product')   return data.product   || 'product-1';
    return data[col] !== undefined ? data[col] : '';
  });
}

// ── RESPONSE ──────────────────────────────────────────────────

function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── EMAIL AGENT ───────────────────────────────────────────────

function sendRoadmapEmail(data) {
  const to = data.email;
  if (!to || !to.includes('@')) return;

  const product = data.product || 'product-1';
  const name    = data.first_name ? data.first_name.trim() : 'there';

  if (product === 'P-AI-Audit-UA') {
    sendAuditUaEmail(to, name, data);
  } else if (product === 'product-5') {
    sendProduct5Email(to, name, data);
  } else {
    sendProduct1Email(to, name, data);
  }
}

function sendProduct1Email(to, name, data) {
  const category    = data.category    || 'professional';
  const hoursWasted = data.hours_wasted  ? parseFloat(data.hours_wasted).toFixed(1)  : null;
  const hoursBack   = data.hours_with_ai ? parseFloat(data.hours_with_ai).toFixed(1) : null;

  const hoursCopy = hoursWasted
    ? `Based on your answers, you're losing <strong>${hoursWasted} hours/week</strong> to tasks AI can handle.${hoursBack ? ` That's up to <strong>${hoursBack} hrs/week</strong> you can get back.` : ''}`
    : `Based on your answers, you have real automation potential right now.`;

  const subject = hoursWasted
    ? `Your AI roadmap — ${hoursWasted} hrs/week you can get back`
    : `Your AI roadmap is ready — here's where to start`;

  const body = buildEmailHtml({
    name,
    headline: `Here's your personalized roadmap, ${name}.`,
    intro: `You came in as a <strong>${category}</strong>. ${hoursCopy}`,
    bodyNote: `Below are three ways to move forward — pick the one that matches where you are right now.`,
    paths: buildPathsHtml(),
    footer: `Questions? Reply to this email — I read everything.`,
  });

  GmailApp.sendEmail(to, subject, '', {
    htmlBody: body,
    name: 'Artem from Life Builder OS',
    replyTo: 'eco.stepanenko@gmail.com',
  });
}

function sendProduct5Email(to, name, data) {
  const score     = data.score      ? parseInt(data.score) : null;
  const tierLabel = data.tier_label || 'Automation';

  const scoreCopy   = score !== null
    ? `Your score: <strong>${score}/100 — ${tierLabel}</strong>.`
    : `Your result: <strong>${tierLabel}</strong>.`;
  const tierInsight = getTierInsight(tierLabel);

  const subject = `Your result: ${tierLabel} — next steps inside`;

  const body = buildEmailHtml({
    name,
    headline: `Your AI vs Automation result is in.`,
    intro: `${scoreCopy} ${tierInsight}`,
    bodyNote: `Here's what to do next — three paths based on where you are.`,
    paths: buildPathsHtml(),
    footer: `Questions? Reply to this email — I read everything.`,
  });

  GmailApp.sendEmail(to, subject, '', {
    htmlBody: body,
    name: 'Artem from Life Builder OS',
    replyTo: 'eco.stepanenko@gmail.com',
  });
}

function getTierInsight(tierLabel) {
  const insights = {
    'Classic Automation':       'Your work is highly predictable — traditional automation tools will give you the biggest ROI with the least setup.',
    'Automation-First + Light AI': 'You have a strong automation base. A few AI layers on top can take you to the next level.',
    'Intelligent Automation':   'Your workflows mix structure with judgment calls. AI + automation together is the right answer here.',
    'AI-First':                 "Your work is dynamic and context-dependent — pure automation won't cut it. AI agents are where you get the real leverage.",
  };
  return insights[tierLabel] || 'You have clear automation and AI potential based on your workflow.';
}

function buildPathsHtml() {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin:20px 0;">
      <tr>
        <td style="background:#f9f9f9; border:1px solid #e5e5e5; border-radius:8px; padding:16px 18px;">
          <p style="margin:0 0 4px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#888;">Path 1 — Free</p>
          <p style="margin:0 0 8px; font-size:15px; font-weight:700; color:#111;">📚 Learn &amp; Build Yourself</p>
          <p style="margin:0; font-size:14px; color:#555; line-height:1.5;">Start with the free resources I've curated for your situation. Takes a few hours — but you'll own the skill forever.</p>
        </td>
      </tr>
      <tr><td style="height:10px;"></td></tr>
      <tr>
        <td style="background:#f9f9f9; border:1px solid #e5e5e5; border-radius:8px; padding:16px 18px;">
          <p style="margin:0 0 4px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#888;">Path 2 — $19–39</p>
          <p style="margin:0 0 8px; font-size:15px; font-weight:700; color:#111;">🎥 Watch How I Do It</p>
          <p style="margin:0 0 10px; font-size:14px; color:#555; line-height:1.5;">Under 30-min video where I build this automation from scratch — step by step. Includes setup file. <strong>Coming soon.</strong></p>
          <p style="margin:0; font-size:13px; color:#888;">You're already on the waitlist — I'll email you when it's live.</p>
        </td>
      </tr>
      <tr><td style="height:10px;"></td></tr>
      <tr>
        <td style="background:#fff3ee; border:1px solid #ffd5c0; border-radius:8px; padding:16px 18px;">
          <p style="margin:0 0 4px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#888;">Path 3 — Custom</p>
          <p style="margin:0 0 8px; font-size:15px; font-weight:700; color:#111;">⚡ Let Me Build It For You</p>
          <p style="margin:0 0 14px; font-size:14px; color:#555; line-height:1.5;">You describe the workflow. I build the automation or AI agent. You get a working setup + 30-min handoff call.</p>
          <a href="https://calendly.com/artem-scait/30min" style="display:inline-block; background:#ff6d3b; color:#fff; padding:11px 22px; border-radius:8px; font-size:14px; font-weight:700; text-decoration:none;">Book a Free Discovery Call →</a>
        </td>
      </tr>
    </table>`;
}

function buildEmailHtml(opts) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0; padding:0; background:#f5f5f5; font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5; padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e5e5;">
          <tr>
            <td style="background:#0d0d0d; padding:18px 24px;">
              <p style="margin:0; font-size:15px; font-weight:800; color:#ffffff; letter-spacing:-.2px;">Life Builder OS</p>
              <p style="margin:4px 0 0; font-size:12px; color:#888;">You don't need to be technical. You just need a system.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px;">
              <h1 style="margin:0 0 16px; font-size:20px; font-weight:800; color:#111; letter-spacing:-.3px; line-height:1.3;">${opts.headline}</h1>
              <p style="margin:0 0 14px; font-size:15px; color:#333; line-height:1.6;">Hi ${opts.name},</p>
              <p style="margin:0 0 14px; font-size:15px; color:#333; line-height:1.6;">${opts.intro}</p>
              <p style="margin:0; font-size:15px; color:#333; line-height:1.6;">${opts.bodyNote}</p>
              ${opts.paths}
              <p style="margin:24px 0 0; font-size:14px; color:#555; line-height:1.6;">${opts.footer}</p>
              <p style="margin:12px 0 0; font-size:14px; color:#333;">— Artem</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 28px; border-top:1px solid #f0f0f0;">
              <p style="margin:0; font-size:12px; color:#aaa; line-height:1.5;">
                You received this because you completed a Life Builder OS quiz.<br>
                <a href="mailto:eco.stepanenko@gmail.com?subject=Unsubscribe" style="color:#aaa;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function sendAuditUaEmail(to, name, data) {
  const role      = data.job_title || 'спеціаліст';
  const score     = data.score     ? parseFloat(data.score).toFixed(1) : '?';
  const mainTask  = data.main_task || '';
  const pain2     = data.pain2     || '';

  const subject = `${name}, результати аудиту — ${score} годин рутини щотижня`;

  const painBlock = [mainTask, pain2]
    .filter(Boolean)
    .map(p => `<li style="margin:0 0 6px; font-size:15px; color:#333; line-height:1.5;">${p}</li>`)
    .join('');

  const body = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0; padding:0; background:#f5f5f5; font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5; padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e5e5;">
          <tr>
            <td style="background:#0d0d0d; padding:18px 24px;">
              <p style="margin:0; font-size:15px; font-weight:800; color:#ffffff; letter-spacing:-.2px;">Life Builder OS</p>
              <p style="margin:4px 0 0; font-size:12px; color:#888;">Не потрібно бути технарем. Потрібна система.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px;">
              <p style="margin:0 0 6px; font-size:13px; color:#888;">${name} · ${role}</p>
              <h1 style="margin:0 0 20px; font-size:22px; font-weight:800; color:#111; letter-spacing:-.3px; line-height:1.3;">Аудит завершено.</h1>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9; border:1px solid #e5e5e5; border-radius:8px; margin:0 0 20px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 4px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#888;">Годин рутини на тиждень</p>
                    <p style="margin:0; font-size:28px; font-weight:800; color:#ff6d3b;">${score} год</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#888;">Найбільші втрати</p>
              <ul style="margin:0 0 24px; padding:0 0 0 18px;">
                ${painBlock}
              </ul>

              <p style="margin:0 0 20px; font-size:15px; color:#333; line-height:1.6;">Це задачі які AI закриває повністю або на 80%. Питання — як саме рухатись далі.</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin:0 0 20px;">
                <tr>
                  <td style="background:#f9f9f9; border:1px solid #e5e5e5; border-radius:8px; padding:16px 18px;">
                    <p style="margin:0 0 4px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#888;">Шлях перший — самостійно</p>
                    <p style="margin:0 0 10px; font-size:15px; font-weight:700; color:#111;">Розібратись самому</p>
                    <p style="margin:0 0 14px; font-size:14px; color:#555; line-height:1.5;">Реально. За посиланням ти знайдеш покроковий гайд з відео та статей — і за 3-4 тижні будеш на ти з Claude та базовими автоматизаціями. Це мій особистий плейлист. Те, по чому вчився я.</p>
                    <a href="https://cloudy-toad-ded.notion.site/AI-37cd4d2e2457811b9534c857acd7fca6" style="display:inline-block; background:#111; color:#fff; padding:10px 18px; border-radius:8px; font-size:14px; font-weight:700; text-decoration:none;">Відкрити підбірку →</a>
                  </td>
                </tr>
                <tr><td style="height:10px;"></td></tr>
                <tr>
                  <td style="background:#fff3ee; border:1px solid #ffd5c0; border-radius:8px; padding:16px 18px;">
                    <p style="margin:0 0 4px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#888;">Шлях другий — під твою специфіку</p>
                    <p style="margin:0 0 10px; font-size:15px; font-weight:700; color:#111;">Отримати рішення адаптоване під тебе</p>
                    <p style="margin:0 0 14px; font-size:14px; color:#555; line-height:1.5;">45 хвилин — розбираємо твої конкретні задачі. Йдеш з готовим планом: які агенти, яка інтеграція, з чого починати. Без продажів заради продажів.</p>
                    <p style="margin:0 0 14px;"><a href="https://cloudy-toad-ded.notion.site/AI-37cd4d2e24578146a0d0c0501dff5cf6" style="font-size:14px; color:#ff6d3b; font-weight:600; text-decoration:none;">Переглянути каталог агентів і тарифи →</a></p>
                    <a href="https://calendly.com/artem-org-ua/30min" style="display:inline-block; background:#ff6d3b; color:#fff; padding:11px 22px; border-radius:8px; font-size:14px; font-weight:700; text-decoration:none;">Записатись на дзвінок →</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0; font-size:14px; color:#333;">— Артем</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 28px; border-top:1px solid #f0f0f0;">
              <p style="margin:0; font-size:12px; color:#aaa; line-height:1.5;">
                Ти отримав цей лист тому що пройшов AI-аудит на Life Builder OS.<br>
                <a href="mailto:eco.stepanenko@gmail.com?subject=Unsubscribe" style="color:#aaa;">Відписатись</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  GmailApp.sendEmail(to, subject, '', {
    htmlBody: body,
    name: 'Артем | Life Builder OS',
    replyTo: 'eco.stepanenko@gmail.com',
  });
}

// ── SETUP (run once manually) ─────────────────────────────────

function setup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // Create all product tabs
  Object.values(PRODUCT_TABS).forEach(cfg => {
    getOrCreateSheet(ss, cfg.name, cfg.columns);
    Logger.log('Ready: ' + cfg.name);
  });

  // Create master All tab
  getOrCreateSheet(ss, ALL_TAB_NAME, ALL_COLUMNS);
  Logger.log('Ready: ' + ALL_TAB_NAME);

  Logger.log('Setup complete.');
}
