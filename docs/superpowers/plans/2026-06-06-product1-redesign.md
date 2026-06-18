# Product 1 Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all category/pain content in `products/product-1-why-start-ai.html` with 4 new categories (job-search, experts, sales-procurement, freelancer), update the profession map, and improve Screen 5 CTAs: update the email form copy + add a job-search teaser block above the form (no second form — one working form for everyone).

**Architecture:** Single self-contained HTML file — no build system, no external dependencies. All changes are data and copy replacements inside the existing JS functions. The rendering logic, CSS, GA4, Apps Script URL, and Calendly link are untouched.

**Tech Stack:** Vanilla HTML/CSS/JS. No npm, no bundler. Verify in browser by opening the file directly.

**Spec:** `docs/superpowers/specs/2026-06-06-product1-redesign.md`

---

## File Map

| File | Action | What changes |
|---|---|---|
| `products/product-1-why-start-ai.html` | Modify | Categories in `renderScreen2()`, entire `PAIN_DATA` object, `PROFESSION_MAP` + `ALL_PROFESSIONS`, email CTA copy in `renderS5Rest()`, new `renderJobSearchTeaser()` function (text only, no second form) |

---

### Task 1: Update category definitions in renderScreen2()

**Files:**
- Modify: `products/product-1-why-start-ai.html` — `renderScreen2()` function, the `categories` array

- [ ] **Step 1: Find and replace the categories array**

Find this block inside `renderScreen2()`:
```js
const categories = [
  { key: 'self-employed', emoji: '🧑‍💼', title: 'Self-Employed', sub: 'Freelancer, consultant, or running your own clients' },
  { key: 'in-a-team',     emoji: '🏢', title: 'In a Team',     sub: 'Specialist or manager at a company' },
  { key: 'sales',         emoji: '📈', title: 'Sales',          sub: 'Closing deals, managing pipeline, hitting quota' },
  { key: 'creative',      emoji: '🎨', title: 'Creative / Media', sub: 'Content, design, journalism, video' }
];
```

Replace with:
```js
const categories = [
  { key: 'job-search',        emoji: '🔍', title: 'Actively Job Searching',  sub: 'Looking for a new role — any level, any industry' },
  { key: 'experts',           emoji: '🎓', title: 'Education / Experts',      sub: 'Doctor, lawyer, therapist, teacher, coach' },
  { key: 'sales-procurement', emoji: '📈', title: 'Sales / Procurement',      sub: 'Closing deals, managing pipeline, sourcing vendors' },
  { key: 'freelancer',        emoji: '💼', title: 'Freelancer / Own Business', sub: 'You do the work and run the business' }
];
```

- [ ] **Step 2: Verify in browser**

Open `products/product-1-why-start-ai.html` in a browser. Click "Find my time wasters →". Screen 2 should show 4 new category cards with the correct labels and emojis. No JS errors in console.

- [ ] **Step 3: Commit**

```bash
git add products/product-1-why-start-ai.html
git commit -m "feat: update category definitions to new 4-category structure"
```

---

### Task 2: Replace PAIN_DATA — full replacement

**Files:**
- Modify: `products/product-1-why-start-ai.html` — the entire `PAIN_DATA` const

- [ ] **Step 1: Replace the entire PAIN_DATA object**

Find the line:
```js
const PAIN_DATA = {
```
...and replace the entire object (ends with the closing `};` after the `'creative'` block) with:

```js
const PAIN_DATA = {

  'job-search': [
    {
      id: 'js-job-boards',
      title: 'Manually checking job boards every day',
      description: 'LinkedIn, Indeed, Glassdoor — same 20 listings, checked one tab at a time.',
      hoursWasted: 2, hoursWithAI: 0.1,
      routine: 'Open LinkedIn. Scroll. Same roles as yesterday. Open Indeed. Same roles. Close. Repeat tomorrow. It\'s not searching — it\'s checking, and checking, and checking again.',
      hate: 'You know the good roles go fast. But checking five platforms manually every morning feels like a part-time job you don\'t get paid for.',
      steps: [
        'Set up a job search agent (Claude Code, free) that scans LinkedIn, Indeed, and ZipRecruiter every morning',
        'Agent scores each role 1–10 against your profile: title, seniority, location, salary, industry',
        'You wake up to a ranked list in Notion — only new roles, no duplicates, no manual searching'
      ],
      result: '2 hrs/day of manual checking → 5 minutes reviewing your ranked list',
      diy: 'Claude Code (free) + Notion (free) — ~30 min setup, then runs automatically every morning',
      buyName: 'Job Search Agent', buyPrice: 9, buyUrl: '#'
    },
    {
      id: 'js-cover-letter',
      title: 'Writing a cover letter for every application',
      description: 'Each role is different. Each letter takes 30–60 minutes. Most get no response.',
      hoursWasted: 3, hoursWithAI: 0.3,
      routine: 'Open the job description. Stare at the blank page. Write something. Rewrite it. Wonder if it even gets read. It takes an hour for a role that might not reply.',
      hate: 'You know cover letters matter. But writing a fresh one every time — knowing most go unread — is demoralizing.',
      steps: [
        'Paste the job description + your resume into Claude — it writes a targeted cover letter in 2 minutes',
        'Claude adapts tone for each company: startup vs. corporate, technical vs. creative',
        'You edit the final paragraph to make it personal — everything else is done'
      ],
      result: '45–60 min per letter → 5–10 min (edit and personal touch only)',
      diy: 'Claude free tier or Pro ($20/mo) — works immediately, no setup',
      buyName: 'Cover Letter Template Pack', buyPrice: 9, buyUrl: '#'
    },
    {
      id: 'js-tracking',
      title: 'Tracking applications in your head or a messy spreadsheet',
      description: 'Which resume did you send? Did you follow up? When?',
      hoursWasted: 1.5, hoursWithAI: 0.1,
      routine: 'You applied to 20 roles. Some got calls. Most didn\'t. You\'re not sure which resume went to which company, or whether you followed up on the ones that went quiet.',
      hate: 'You applied to that role three weeks ago and have no idea what happened to it. Tracking 20+ open applications is exhausting on top of everything else.',
      steps: [
        'Set up a Notion pipeline: company, role, status, application date, resume version, follow-up date',
        'Agent auto-fills new entries every morning after the job search runs',
        'You see the full pipeline at a glance — what needs follow-up today, what\'s active, what\'s closed'
      ],
      result: 'Mental overhead of 20+ applications → one clean pipeline, 30 seconds to review',
      diy: 'Notion (free) + template — 1 hr one-time setup',
      buyName: 'Job Search Pipeline Template', buyPrice: 9, buyUrl: '#'
    },
    {
      id: 'js-company-research',
      title: 'Researching companies before interviews',
      description: 'Every interview requires 1–2 hours of prep just to understand where you\'re going.',
      hoursWasted: 2, hoursWithAI: 0.3,
      routine: 'Interview tomorrow. Open their website. Read the About page. Check LinkedIn. Google Glassdoor. Look at recent news. Write a few notes. It\'s 90 minutes of reading before you can think about your answers.',
      hate: 'You go in knowing the basics but never feel fully prepared. There\'s always something you missed.',
      steps: [
        'Paste the company name and job description into Claude — ask for a structured research brief',
        'In 3 minutes: mission, recent news, culture signals, likely interview questions, what to ask them',
        'Add your own notes on top — the research is done, you focus on preparation'
      ],
      result: '90 min of research → 15 min reviewing a ready brief',
      diy: 'Claude free tier + Perplexity (free) — works immediately',
      buyName: 'Interview Research Prompt Pack', buyPrice: 9, buyUrl: '#'
    },
    {
      id: 'js-follow-up',
      title: 'Writing follow-up emails after interviews',
      description: 'You know you should send one. Writing something that doesn\'t sound generic takes 30–45 min.',
      hoursWasted: 1, hoursWithAI: 0.1,
      routine: 'The interview ended well. Now write a follow-up. Open a blank doc. You don\'t want to sound desperate. You don\'t want to sound cold. Thirty minutes later you have three paragraphs that feel wrong.',
      hate: 'The follow-up is the one email that actually matters after the interview — and it\'s the hardest to write because the stakes feel real.',
      steps: [
        'Right after the interview: paste your notes into Claude with the job description',
        'Claude writes a follow-up: specific, warm, references something from the actual conversation',
        'You edit one sentence to make it yours — done in 5 minutes while the interview is still fresh'
      ],
      result: '30–45 min of painful drafting → 5 min review and send',
      diy: 'Claude free tier — works immediately, no setup',
      buyName: 'Follow-Up Email Templates', buyPrice: 9, buyUrl: '#'
    },
    {
      id: 'js-interview-prep',
      title: 'Preparing for interviews (answering likely questions)',
      description: 'Every interview needs prep. Most people wing it or spend 3 hours on generic tips.',
      hoursWasted: 3, hoursWithAI: 0.5,
      routine: 'Interview in two days. You look up "most common interview questions." Read 40 generic answers. None fit your actual experience. You try to memorize something. Walk in uncertain.',
      hate: 'You know your experience well. Getting it into confident, coherent answers for a stranger in 45 minutes is a different skill — and you never feel ready enough.',
      steps: [
        'Paste the job description + your resume into Claude — ask for the 10 most likely questions for this specific role',
        'Claude generates tailored questions + STAR-format answer frameworks based on your actual background',
        'Run a mock interview: you answer out loud, Claude gives feedback on clarity and relevance'
      ],
      result: '3 hrs of anxious prep → 45 min of targeted practice with real feedback',
      diy: 'Claude Pro ($20/mo) — works immediately',
      buyName: 'Interview Prep Prompt System', buyPrice: 9, buyUrl: '#'
    },
    {
      id: 'js-resume',
      title: 'Tailoring your resume for every role',
      description: 'One base resume doesn\'t land interviews. Tailoring takes 45–60 min per application.',
      hoursWasted: 2, hoursWithAI: 0.2,
      routine: 'Open your resume. Open the job description. Start editing. Move bullets around. Add keywords. Wonder if the ATS will catch it. An hour before you even apply.',
      hate: 'You\'ve rewritten the same experience ten different ways. Each version feels like the same document with words shuffled — and you still don\'t know if it works.',
      steps: [
        'Keep one master resume with everything — every role, achievement, and skill',
        'Paste it + the job description into Claude: "Tailor this resume for this role, keep it honest"',
        'Claude rearranges emphasis, adjusts language, highlights the most relevant points in 2 minutes'
      ],
      result: '45–60 min per tailored resume → 5–10 min review and adjust',
      diy: 'Claude free tier — works immediately',
      buyName: 'Resume Tailoring Prompt Pack', buyPrice: 9, buyUrl: '#'
    },
    {
      id: 'js-linkedin',
      title: 'LinkedIn outreach to recruiters',
      description: 'Your profile isn\'t working hard enough. Reaching out manually is slow and uncomfortable.',
      hoursWasted: 2, hoursWithAI: 0.3,
      routine: 'You know you should reach out to recruiters. You open a profile. Stare at the message box. Write something. Delete it. Write it again. Send 3 messages in 45 minutes. Three days later — silence.',
      hate: 'Reaching out to strangers on LinkedIn feels like cold-calling your own future. You don\'t know what to say, and the fear of sounding desperate is paralyzing.',
      steps: [
        'Paste your About section into Claude: "What\'s weak and what should change?" — fix in 15 min',
        'For outreach: give Claude the recruiter\'s profile + the role you want — personalized message in 30 seconds',
        'Build a 10-message batch in 15 minutes instead of one message in 30'
      ],
      result: '2 hrs of uncomfortable outreach → 20 min writing and sending 10 targeted messages',
      diy: 'Claude free tier — works immediately',
      buyName: 'LinkedIn Outreach Message Templates', buyPrice: 9, buyUrl: '#'
    }
  ],

  'experts': [
    {
      id: 'exp-session-notes',
      title: 'Session notes and documentation after appointments',
      description: 'After every session: write what happened, what was decided, what\'s next.',
      hoursWasted: 3, hoursWithAI: 0.2,
      routine: 'Session ends. Open the notes doc. Write what you discussed, what emerged, what the next step is. 20–30 minutes per client, every day, after you\'re already mentally drained.',
      hate: 'You became a therapist / doctor / lawyer to help people — not to spend a third of your day writing about helping people.',
      steps: [
        'Record a 2-minute audio memo right after the session (phone voice memos)',
        'Transcribe with Otter.ai or Whisper (free) — spoken notes become text instantly',
        'Paste into Claude: "Format this as session notes with key themes, decisions, and next steps"'
      ],
      result: '20–30 min of post-session writing → 5 min reviewing auto-generated notes',
      diy: 'Otter.ai (free tier) + Claude (free tier) — works immediately',
      buyName: 'Session Notes Automation', buyPrice: 47, buyUrl: '#'
    },
    {
      id: 'exp-client-reports',
      title: 'Writing client-facing reports and progress summaries',
      description: 'Progress reports, case summaries, briefs — each takes hours to draft from scratch.',
      hoursWasted: 2, hoursWithAI: 0.2,
      routine: 'Client asks for a progress summary. You open a blank doc and rebuild the last three months from memory, notes, and email threads. Two hours later you have something you\'re not proud of.',
      hate: 'You know exactly what the client needs to hear. Getting it from your head onto paper in a professional format takes longer than it should every single time.',
      steps: [
        'Keep structured session notes (from pain 1) — they become source material for every report',
        'Tell Claude: "Write a progress report for this client type covering these sessions — focus on outcomes"',
        'You review, add nuance, and send — your expertise shapes it, AI does the drafting'
      ],
      result: '2 hrs of report writing → 20 min review and polish',
      diy: 'Claude Pro ($20/mo) — works immediately once you have structured notes',
      buyName: 'Client Report Template Pack', buyPrice: 47, buyUrl: '#'
    },
    {
      id: 'exp-faq',
      title: 'Answering the same client questions over and over',
      description: '"How long does this take?" "What should I bring?" "How do I prepare?" — every day.',
      hoursWasted: 3, hoursWithAI: 0.3,
      routine: 'Same questions. Same answers. Different people. You\'ve written "the first session typically lasts..." fifty times this year. You still write it fresh each time because you want to seem personal.',
      hate: 'You want every client to feel heard. But copy-pasting the same response — or rewriting it every time — both feel wrong.',
      steps: [
        'Build a personal FAQ doc: your 15 most common questions and your best answers',
        'Set up a Telegram bot or Instagram auto-reply that handles these 24/7',
        'Uncommon questions get flagged to you — routine ones never reach your inbox'
      ],
      result: '45 min/day on DMs and emails → 5 min reviewing only the unusual questions',
      diy: 'ManyChat ($15/mo) or Telegram bot (free) — 3–4 hrs initial setup',
      buyName: 'FAQ Bot Setup', buyPrice: 47, buyUrl: '#'
    },
    {
      id: 'exp-invoicing',
      title: 'Invoices and payment reminders',
      description: 'Create invoice, send, wait, follow up, remind again. Every month, every client.',
      hoursWasted: 1, hoursWithAI: 0.1,
      routine: 'Session done. Write the invoice. Email it. Three days — nothing. Write a polite reminder. Wait. Write a firmer one. It\'s a negotiation you didn\'t sign up for.',
      hate: 'Asking a person you just helped for money feels uncomfortable. Doing it twice is worse. Every client, every month.',
      steps: [
        'Set up Invoice Ninja or Wave (both free) — invoice auto-generates from a template',
        'Zapier (free tier): payment reminder goes out automatically at day 3 and day 7',
        'Client pays → automatic receipt. You never touch it.'
      ],
      result: '3–5 hrs/month chasing payments → 10 min reviewing who paid',
      diy: 'Invoice Ninja (free) + Zapier free tier — 2–3 hrs one-time setup',
      buyName: 'Payment Autopilot Setup', buyPrice: 47, buyUrl: '#'
    },
    {
      id: 'exp-scheduling',
      title: 'Scheduling and booking management',
      description: '"When are you free?" — and the 5-message thread to find a time.',
      hoursWasted: 1.5, hoursWithAI: 0.1,
      routine: 'Client wants to book. You ask for availability. They send times. Two don\'t work. You send alternatives. One works. You create the event. You send confirmation. That\'s 6–8 messages for a 50-minute session.',
      hate: 'You\'re a professional with expertise that took years to build. Spending 15 minutes per booking on logistics is beneath what you should be doing with your time.',
      steps: [
        'Set up Calendly (free) with your availability, session types, and intake questions',
        'Client gets a link — they book, pay if required, receive auto-confirmation and reminders',
        'You get one notification: booked, client name, session type. Done.'
      ],
      result: '6–8 message booking threads → zero — clients book themselves',
      diy: 'Calendly free plan — 30 min one-time setup',
      buyName: 'Booking Automation Setup', buyPrice: 47, buyUrl: '#'
    },
    {
      id: 'exp-session-prep',
      title: 'Preparing context before each session',
      description: 'Each client needs review: what did we discuss last time? What was left open?',
      hoursWasted: 2, hoursWithAI: 0.5,
      routine: 'Session in 10 minutes. Open last session\'s notes. Scan. Try to remember where things stood. Add context from before. You\'re still catching up when the client walks in.',
      hate: 'You don\'t want to ask "so where were we?" — it breaks trust. But remembering the full arc of 20 active clients is humanly impossible.',
      steps: [
        'Keep structured notes after every session (see pain 1)',
        'Before each session: ask Claude to summarize the last 3 sessions and flag unresolved threads',
        'You walk in with a 5-bullet brief — context loaded, attention on the person, not the paperwork'
      ],
      result: '15–20 min of pre-session scrambling → 3 min reading a clean brief',
      diy: 'Claude free tier + your existing notes — works immediately',
      buyName: 'Client Context System', buyPrice: 47, buyUrl: '#'
    },
    {
      id: 'exp-proposals',
      title: 'Writing service proposals',
      description: 'Every prospect gets a custom proposal. Each takes 1–2 hours to write.',
      hoursWasted: 2, hoursWithAI: 0.3,
      routine: 'Discovery call ends. Now write the proposal. Describe your approach, pricing, process, why you\'re the right fit. You do this from scratch every time because every client feels different.',
      hate: 'You\'re an expert at what you do — not at writing about what you do. The proposal never captures it the way you explained it on the call.',
      steps: [
        'Right after the discovery call: paste your notes into Claude and say "write a proposal for this client"',
        'Claude drafts: problem statement, your approach, what\'s included, investment, next step',
        'You add personal language and send within the hour — while the conversation is still warm'
      ],
      result: '1–2 hrs per proposal → 20 min review and personalize',
      diy: 'Claude Pro ($20/mo) — works immediately after a 30-min template setup',
      buyName: 'Proposal Template System', buyPrice: 47, buyUrl: '#'
    },
    {
      id: 'exp-admin',
      title: 'Administrative reporting and compliance documentation',
      description: 'Logs, hours, outcomes, regulatory requirements — the paperwork that never ends.',
      hoursWasted: 2, hoursWithAI: 0.1,
      routine: 'End of week: fill out the logs. Count sessions. Write summaries for the insurance board, licensing body, or your own records. Not complex — just slow and draining.',
      hate: 'Admin exists so you don\'t lose your license or miss a billing cycle. It doesn\'t make you better at your work. You just have to do it.',
      steps: [
        'Structured session notes become source material — admin is extraction, not creation',
        'Ask Claude: "From these session notes, generate a weekly summary in [required format]"',
        'What took 90 minutes becomes 10 minutes of reviewing and signing off'
      ],
      result: '90 min/week of admin → 10 min reviewing and approving',
      diy: 'Claude free tier + your session notes — works once notes are structured',
      buyName: 'Admin Reporting Template Pack', buyPrice: 47, buyUrl: '#'
    }
  ],

  'sales-procurement': [
    {
      id: 'sp-cold-outreach',
      title: 'Writing cold outreach messages',
      description: '50 messages a day, each slightly different. Best case: 5% reply.',
      hoursWasted: 4, hoursWithAI: 0.5,
      routine: 'Open the list. Open a blank message. Try to personalize. Write something. Delete it. Write something shorter. Send. Move to the next. An hour for 10 messages that probably won\'t get replies.',
      hate: 'Cold messages feel like asking strangers for a favor. Writing them with energy when most will be ignored is draining.',
      steps: [
        'Give Claude your offer, your ICP, and one specific signal about the prospect — it generates 5 message variants',
        'Test 2–3 versions to find what resonates with your specific audience',
        'Personalization tokens (name, company, signal) fill automatically from your contact list'
      ],
      result: '4 hrs writing 50 messages → 45 min reviewing and sending 50 personalized messages',
      diy: 'Claude free tier + your existing contact list — works immediately',
      buyName: 'Cold Outreach Message Library', buyPrice: 47, buyUrl: '#'
    },
    {
      id: 'sp-followup',
      title: 'Following up with leads and suppliers',
      description: 'Without a system, half your leads go cold. Manual follow-up is inconsistent.',
      hoursWasted: 2, hoursWithAI: 0.3,
      routine: 'You reached out last Thursday. You meant to follow up Monday. It\'s Wednesday and you still haven\'t — because you have 30 others to track, no system, and follow-up feels awkward.',
      hate: 'Reaching out a second time feels like bothering someone. You never know if silence means "not interested" or "just busy."',
      steps: [
        'Add a "Follow-up date" column to your lead/vendor list — one column, no new software',
        'Zapier sends you a Telegram reminder when the date hits — no relying on memory',
        'AI drafts the follow-up based on stage: first touch, second touch, "last try" — you send in one click'
      ],
      result: 'Inconsistent follow-up → 100% of leads and vendors touched at the right time, 10 min/day',
      diy: 'Google Sheets + Zapier (free tier) + Claude — 2–3 hrs setup',
      buyName: 'Lead Follow-Up Automation', buyPrice: 47, buyUrl: '#'
    },
    {
      id: 'sp-proposals',
      title: 'Writing proposals and commercial offers',
      description: 'Every proposal: 2–3 hours. And there\'s a real chance they won\'t even reply.',
      hoursWasted: 3, hoursWithAI: 0.5,
      routine: 'Discovery call ends. Now write the proposal. Research the client. Build the price table. Write the narrative. Format it. Proofread it. A half-day for something that may get a "not now."',
      hate: 'The client wanted it today. You\'re already behind. And every proposal is different enough that you can\'t just copy the last one.',
      steps: [
        'Build a proposal template with sections: problem, solution, scope, investment, next step',
        'After the discovery call: paste your notes into Claude — it fills 80% of the proposal in 3 minutes',
        'You personalize the intro and investment section — structured and professional in under an hour'
      ],
      result: '2–3 hrs per proposal → 30–45 min (personalize and review only)',
      diy: 'Claude Pro ($20/mo) + Canva (free) — 2–3 hrs to build the template once',
      buyName: 'Proposal Template System', buyPrice: 97, buyUrl: '#'
    },
    {
      id: 'sp-quote-comparison',
      title: 'Comparing supplier quotes and tracking prices',
      description: 'Three suppliers, different formats. Building a real comparison takes hours.',
      hoursWasted: 2, hoursWithAI: 0.2,
      routine: 'Three quotes arrive as PDFs in different formats. You build a spreadsheet. Copy numbers. Try to compare like-for-like. Something\'s always missing or named differently. Two hours, and you\'re still not sure it\'s right.',
      hate: 'You\'re supposed to be sourcing, not building comparison tables. But no one else will do it — so you do it every time, for every RFQ.',
      steps: [
        'Paste all three quotes into Claude: "Extract line items, quantities, unit prices, and totals into a comparison table"',
        'In 2 minutes: structured table with like-for-like comparison, price gaps flagged automatically',
        'You focus on the vendor decision — AI did the extraction'
      ],
      result: '2 hrs of manual comparison → 15 min reviewing a ready table',
      diy: 'Claude Pro ($20/mo) — works immediately for text-based PDFs',
      buyName: 'Procurement Comparison Templates', buyPrice: 47, buyUrl: '#'
    },
    {
      id: 'sp-research',
      title: 'Researching prospects or suppliers before calls',
      description: 'Every important call needs context: who are they, what do they care about, what are the risks?',
      hoursWasted: 2, hoursWithAI: 0.3,
      routine: 'Call in an hour. Open their website. LinkedIn. Google their news. Check reviews. Scan for red flags. You arrive with enough context to not embarrass yourself — but rarely enough to lead.',
      hate: 'You\'re always one Google rabbit hole away from being late for the call you were supposed to be preparing for.',
      steps: [
        'Give Claude the company name, their LinkedIn URL, and the purpose of the call',
        'In 5 minutes: overview, recent news, likely priorities, potential objections, questions to ask',
        'You add your own context on top — the research is done'
      ],
      result: '60–90 min of research → 15 min reviewing a ready brief',
      diy: 'Perplexity (free) + Claude free tier — works immediately',
      buyName: 'Pre-Call Research Prompts', buyPrice: 47, buyUrl: '#'
    },
    {
      id: 'sp-pipeline',
      title: 'Managing your pipeline or vendor list manually',
      description: 'Status updates, next steps, last contact — tracking it all eats time every week.',
      hoursWasted: 2, hoursWithAI: 0.1,
      routine: 'You have 30 active deals or 40 vendors. Each at a different stage. Some haven\'t been touched in two weeks. You open the CRM, realize everything is out of date, spend an hour just getting back to current.',
      hate: 'You should be selling or sourcing — not doing CRM data entry. But if you don\'t enter it, you lose track.',
      steps: [
        'Use a Google Sheet or Notion as your pipeline: last contact, status, next step, due date',
        'After every call: paste your notes into Claude — it extracts and formats the update in the right columns',
        'Weekly: AI generates a pipeline status brief — who needs action, who\'s stalled, what\'s at risk'
      ],
      result: '2 hrs of weekly CRM maintenance → 20 min review and update',
      diy: 'Notion (free) + Claude free tier — 2 hrs initial setup',
      buyName: 'Pipeline Management Templates', buyPrice: 47, buyUrl: '#'
    },
    {
      id: 'sp-reporting',
      title: 'Reporting on sales or procurement results',
      description: 'Same data, different format, every week or month.',
      hoursWasted: 1.5, hoursWithAI: 0.1,
      routine: 'End of week or month: pull data from the CRM, check emails, count deals or POs. Build the table. Write the summary. Send to the manager. Repeat.',
      hate: 'The report exists so leadership can see what you\'re doing. You know what you\'re doing. Writing it down every week is the tax you pay for having a boss.',
      steps: [
        'Keep a running log in Google Sheets — one row per deal or PO, updated after each interaction',
        'End of week: Claude reads the sheet and writes the summary in your standard format',
        'You review and send — 10 minutes instead of 90'
      ],
      result: '90 min/week of reporting → 10 min review and send',
      diy: 'Google Sheets + Claude free tier — works immediately once data is structured',
      buyName: 'Sales/Procurement Report Templates', buyPrice: 47, buyUrl: '#'
    },
    {
      id: 'sp-negotiation',
      title: 'Preparing for negotiations',
      description: 'Every important negotiation needs prep. Most people walk in underprepared.',
      hoursWasted: 2, hoursWithAI: 0.3,
      routine: 'Meeting tomorrow. You review what you know about them. Try to anticipate their position. Write a few notes on your BATNA. Walk in hoping you covered the right things.',
      hate: 'Prepare for everything — then get blindsided by something you didn\'t expect. Feels worse than not preparing at all.',
      steps: [
        'Give Claude the deal context: what you want, what they want, what\'s been discussed so far',
        'Claude generates: their likely positions, your best counters, scenarios, what to concede, what to protect',
        'You walk in with a negotiation playbook instead of a gut feeling'
      ],
      result: '2 hrs of prep → 20 min reviewing a structured negotiation brief',
      diy: 'Claude Pro ($20/mo) — works immediately',
      buyName: 'Negotiation Prep Templates', buyPrice: 47, buyUrl: '#'
    }
  ],

  'freelancer': [
    {
      id: 'fl-client-comms',
      title: 'Back-and-forth with clients (approvals, questions, revisions)',
      description: 'Every project has 30–50 messages before anything gets done. Most are logistics.',
      hoursWasted: 3, hoursWithAI: 0.3,
      routine: 'Client asks a question. You answer. They have a follow-up. You answer again. They confirm with their team. You wait. They come back with a different question. It\'s not work — it\'s coordination.',
      hate: 'By the time the back-and-forth is done, you\'ve spent more time on logistics than on the actual work. And you still have to do the actual work.',
      steps: [
        'Build a client onboarding doc: answers to the 15 most common questions, timeline, process, what you need',
        'AI drafts responses to client messages in seconds — you review and send',
        'For status updates: a template + Claude fills in project specifics — professional and fast'
      ],
      result: '3 hrs/week of client back-and-forth → 30 min reviewing and sending drafted replies',
      diy: 'Notion (free) + Claude free tier — 2–3 hrs to build the templates',
      buyName: 'Client Communication System', buyPrice: 47, buyUrl: '#'
    },
    {
      id: 'fl-proposals',
      title: 'Writing proposals and quotes',
      description: 'Every project starts with a proposal. Each takes 1–2 hours and might not convert.',
      hoursWasted: 2, hoursWithAI: 0.2,
      routine: 'Discovery call ends. Now write the proposal. Describe what you\'ll do, how long it takes, what it costs. You want it to sound good. You write it from scratch because each client feels different.',
      hate: 'You\'ve written "my approach to this project" fifty times. You know what you do. Making the document feel worthy of what you\'re charging is a different problem every time.',
      steps: [
        'Build a master proposal template: problem, solution, deliverables, timeline, investment, next step',
        'After the call: paste your notes into Claude — it fills the template for this specific client in 3 minutes',
        'You edit the tone and add a personal paragraph — done in 20 minutes while the call is still fresh'
      ],
      result: '1–2 hrs per proposal → 20 min to review and personalize',
      diy: 'Claude free tier + Google Docs template — 1–2 hrs one-time setup',
      buyName: 'Freelance Proposal Templates', buyPrice: 47, buyUrl: '#'
    },
    {
      id: 'fl-invoicing',
      title: 'Invoicing and chasing late payments',
      description: 'Write, send, wait, remind, remind again. Every project, every client.',
      hoursWasted: 1, hoursWithAI: 0.1,
      routine: 'Project delivered. Send the invoice. Three days — nothing. Write a polite reminder. Another week. Write a less polite one. You know who it\'s from. You don\'t want to ruin the relationship.',
      hate: 'Getting paid for work you already did should be the easy part. Chasing your own money is humiliating — especially from clients who seemed happy with the work.',
      steps: [
        'Invoice Ninja or Wave (both free) — invoice auto-generates from a template in 2 minutes',
        'Automatic reminders go out at day 3, day 7, day 14 — no intervention from you',
        'Client pays → auto-receipt sent, your tracker updates, you get a Telegram notification'
      ],
      result: '1–2 hrs/month chasing payments → 10 min reviewing who paid and who didn\'t',
      diy: 'Invoice Ninja (free) + Zapier free tier — 2 hrs one-time setup',
      buyName: 'Payment Autopilot Setup', buyPrice: 47, buyUrl: '#'
    },
    {
      id: 'fl-content',
      title: 'Creating content to promote your work',
      description: 'You finished a great project. You should post. Writing about yourself takes forever.',
      hoursWasted: 3, hoursWithAI: 0.3,
      routine: 'Great project done. You know you should post about it. Open Instagram. Stare at the blank caption. Write three versions. None feel right. You don\'t post. The project disappears.',
      hate: 'You\'re good at your craft. Writing about being good at your craft is a completely different skill that you never signed up to learn.',
      steps: [
        'Right after each project: write 3 bullet points — what you did and what the client got',
        'Give them to Claude: "Write an Instagram caption and a LinkedIn post from these notes, in my voice"',
        'Review, adjust tone, post — 15 minutes instead of an hour, every time'
      ],
      result: 'Projects you never posted about → consistent presence without the blank-page paralysis',
      diy: 'Claude free tier — works immediately',
      buyName: 'Content Creation Prompt Pack', buyPrice: 47, buyUrl: '#'
    },
    {
      id: 'fl-scheduling',
      title: 'Scheduling calls and managing your calendar',
      description: '"When are you free?" — and the 5-message thread that follows.',
      hoursWasted: 1.5, hoursWithAI: 0.1,
      routine: 'Prospect wants to talk. You ask for their availability. They suggest times. You\'re busy then. You counter. They confirm. You create the event. You send an invite. 15 minutes of logistics for a 30-minute call.',
      hate: 'You run your own business. Spending 15 minutes on scheduling admin per meeting is death by a thousand cuts.',
      steps: [
        'Calendly free plan — set your availability once, share a link with every inquiry',
        'Client books themselves, gets auto-confirmation and reminder, pays upfront if required',
        'You get one notification: who booked, when, what type of session. Nothing else to do.'
      ],
      result: 'Per-meeting scheduling threads → zero — everyone books themselves',
      diy: 'Calendly (free) — 30 min setup',
      buyName: 'Booking Automation Setup', buyPrice: 47, buyUrl: '#'
    },
    {
      id: 'fl-followup',
      title: 'Following up after projects — reviews and repeat business',
      description: 'Most repeat clients and referrals come from a follow-up you never sent.',
      hoursWasted: 0.5, hoursWithAI: 0,
      routine: 'Project delivered. Client happy. You move on. Two months later you wonder why you\'re not getting referrals. The relationship went cold because no one maintained it.',
      hate: 'Asking for a review feels like asking for a favor right after you\'ve already done a favor. You know you should do it. You almost never do.',
      steps: [
        'Set up a simple post-project flow: 3 days after delivery, automatic message goes out via email',
        'Message: thanks + ask for feedback + ask if they\'d like to continue + referral ask',
        'AI personalizes the name and project details — you review the batch once a week'
      ],
      result: '0 follow-ups sent → 100% of clients touched 3 days post-delivery, automatically',
      diy: 'Make.com (free tier) + Claude — 2–3 hrs one-time setup',
      buyName: 'Client Retention Automation', buyPrice: 47, buyUrl: '#'
    },
    {
      id: 'fl-notes',
      title: 'Keeping client and project notes organized',
      description: 'What did they want? What did I promise? What\'s the login for their tool?',
      hoursWasted: 1, hoursWithAI: 0.1,
      routine: 'New message from a client you worked with two months ago. You need to find your notes. They\'re in an email. And a Slack thread. And a notebook. 20 minutes to piece together the context.',
      hate: 'You know there was a folder. You think it was named something. You\'re pretty sure that\'s the final version. Managing your own files shouldn\'t take this long.',
      steps: [
        'One Notion workspace: one page per client — brief, deliverables, decisions, files, access',
        'After every call: paste key points into Claude — it structures and adds them to the right section',
        'Search anything across all client pages in 5 seconds'
      ],
      result: 'Scattered notes across 5 apps → one searchable system, 30 seconds to find anything',
      diy: 'Notion (free) + template — 1–2 hrs setup',
      buyName: 'Freelance Client CRM Template', buyPrice: 47, buyUrl: '#'
    },
    {
      id: 'fl-faq',
      title: 'Answering the same questions from every new client',
      description: '"What\'s your process?" "How long?" "Do you do X?" — every inquiry, every time.',
      hoursWasted: 2, hoursWithAI: 0.2,
      routine: 'New lead in the inbox. They want to know your process, timeline, whether you\'ve done their industry, what\'s included. You write it all out. Again. Like the last 20 times.',
      hate: 'You want every new client to feel like you wrote this specifically for them. But it\'s the same email, rewritten for the 40th time, and it shows.',
      steps: [
        'Write your master FAQ: every question you\'ve ever been asked + your best answer',
        'Paste the client\'s inquiry into Claude: "Answer their specific questions using my FAQ, warm and direct tone"',
        'Review and send — consistent, personal, done in 3 minutes'
      ],
      result: '20–30 min per new inquiry response → 3 min review and send',
      diy: 'Claude free tier + your FAQ doc — works immediately',
      buyName: 'Client Inquiry Response System', buyPrice: 47, buyUrl: '#'
    }
  ]

};
```

- [ ] **Step 2: Verify in browser**

Open the file. Go through the full flow: pick any category → select 3–5 pains → tag them → click "Show my roadmap". Results screen should show correct pain titles and hours. Expand one pain — all 3 steps, result, and DIY path should show. No JS errors.

- [ ] **Step 3: Commit**

```bash
git add products/product-1-why-start-ai.html
git commit -m "feat: replace PAIN_DATA with 4 new categories and 32 new pains"
```

---

### Task 3: Replace PROFESSION_MAP and ALL_PROFESSIONS

**Files:**
- Modify: `products/product-1-why-start-ai.html` — `PROFESSION_MAP` object and `ALL_PROFESSIONS` array

- [ ] **Step 1: Replace PROFESSION_MAP**

Find the `const PROFESSION_MAP = {` block and replace entirely:

```js
const PROFESSION_MAP = {
  // job-search
  'Job Seeker': 'job-search', 'Career Changer': 'job-search',

  // experts
  'Therapist': 'experts', 'Psychologist': 'experts', 'Psychiatrist': 'experts',
  'Doctor': 'experts', 'Physician': 'experts', 'Family Doctor': 'experts',
  'Dentist': 'experts', 'Dermatologist': 'experts', 'Physical Therapist': 'experts',
  'Pharmacist': 'experts', 'Nurse': 'experts',
  'Lawyer': 'experts', 'Attorney': 'experts', 'Paralegal': 'experts',
  'Teacher': 'experts', 'Professor': 'experts', 'Tutor': 'experts',
  'Coach': 'experts', 'Trainer': 'experts', 'Instructor': 'experts',
  'Financial Advisor': 'experts', 'Accountant': 'experts', 'Consultant': 'experts',

  // sales-procurement
  'Sales Manager': 'sales-procurement', 'Account Manager': 'sales-procurement',
  'Account Executive': 'sales-procurement', 'Business Development Manager': 'sales-procurement',
  'Sales Rep': 'sales-procurement', 'Realtor': 'sales-procurement',
  'Real Estate Agent': 'sales-procurement', 'Insurance Agent': 'sales-procurement',
  'Procurement Manager': 'sales-procurement', 'Buyer': 'sales-procurement',
  'Purchasing Manager': 'sales-procurement', 'Supply Chain Manager': 'sales-procurement',
  'Logistics Manager': 'sales-procurement',

  // freelancer
  'Photographer': 'freelancer', 'Videographer': 'freelancer', 'Video Editor': 'freelancer',
  'Graphic Designer': 'freelancer', 'Web Designer': 'freelancer', 'UI/UX Designer': 'freelancer',
  'Interior Designer': 'freelancer', 'Illustrator': 'freelancer', 'Motion Designer': 'freelancer',
  'Copywriter': 'freelancer', 'Content Writer': 'freelancer', 'Journalist': 'freelancer',
  'Social Media Manager': 'freelancer', 'Marketing Consultant': 'freelancer',
  'Web Developer': 'freelancer', 'Freelance Developer': 'freelancer',
  'Hair Stylist': 'freelancer', 'Makeup Artist': 'freelancer', 'Aesthetician': 'freelancer',
  'Massage Therapist': 'freelancer', 'Nutritionist': 'freelancer', 'Florist': 'freelancer',
  'Personal Trainer': 'freelancer', 'Event Planner': 'freelancer',
  'Virtual Assistant': 'freelancer'
};

const ALL_PROFESSIONS = Object.keys(PROFESSION_MAP);
```

- [ ] **Step 2: Verify in browser**

Go to Screen 2. Type "photo" in the search box — "Photographer" should appear in dropdown and map to Freelancer category. Type "law" — "Lawyer" should map to Experts. Type "sales" — "Sales Manager" should map to Sales / Procurement. No JS errors.

- [ ] **Step 3: Commit**

```bash
git add products/product-1-why-start-ai.html
git commit -m "feat: update profession map to match new 4 categories"
```

---

### Task 4: Update email form CTA + add job-search teaser in renderS5Rest()

**Files:**
- Modify: `products/product-1-why-start-ai.html` — `renderS5Rest()` function, email section HTML

Two CTAs, one form: for job-search, a teaser block appears ABOVE the email form ("I'm building a tool for exactly this — leave your email below"). The email form itself is the same for everyone (same Apps Script, same fields). No second form, no second submit handler.

- [ ] **Step 1: Add renderJobSearchTeaser() function**

Add this function just before `renderS5Rest()`:

```js
function renderJobSearchTeaser() {
  return `
    <div class="card" style="margin-bottom:20px;border-color:#ff6d3b22">
      <div class="brand-label" style="margin-bottom:10px">Coming Soon</div>
      <p style="font-size:15px;font-weight:700;color:var(--text1);margin-bottom:8px">Searching for a job right now?</p>
      <p style="font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:0">
        I'm building a tool that handles most of what's on your list automatically — finds roles, scores them, tracks your pipeline, drafts follow-ups. Every morning, without you touching it.<br><br>
        <span style="color:var(--text3)">Leave your email below — I'll reach out personally when it's ready.</span>
      </p>
    </div>
  `;
}
```

- [ ] **Step 2: Call renderJobSearchTeaser() conditionally in renderS5Rest()**

Inside `renderS5Rest()`, in the template string that sets `s5-rest` innerHTML, find the line just before the email form section and prepend:

```js
  document.getElementById('s5-rest').innerHTML = `
    ${quizState.category === 'job-search' ? renderJobSearchTeaser() : ''}

    <div class="share-block">
    ...
```

- [ ] **Step 3: Update email form heading, subtitle, and fields**

Inside the same `renderS5Rest()` template, replace the entire `<div class="email-section" ...>` block (from the opening tag through its closing `</div>`) with:

```js
    <div class="email-section" id="email-section">
      <h2>Ready to stop doing this yourself?</h2>
      <p class="email-sub">Tell us what's eating your time — we'll put together a personal plan to move your routine tasks and the work you hate off your plate and onto AI. Free, within 24 hours.</p>

      <div id="email-form-wrap">
        <div class="form-row">
          <div class="form-field">
            <label class="form-label">First name</label>
            <input type="text" class="form-input" id="f-name" placeholder="Alex">
          </div>
          <div class="form-field">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" id="f-email" placeholder="you@email.com">
          </div>
        </div>
        <div class="form-field">
          <label class="form-label">Job title / field</label>
          <input type="text" class="form-input" id="f-jobtitle" placeholder="e.g. Marketing Manager, Florist, Sales Rep">
        </div>
        <div class="form-field">
          <label class="form-label">What's the one task you'd most want off your plate?</label>
          <textarea class="form-textarea" id="f-maintask" placeholder="e.g. Writing follow-up emails after every meeting"></textarea>
        </div>
        <div class="form-field">
          <label class="form-label">LinkedIn URL <span class="optional-label">optional</span></label>
          <input type="text" class="form-input" id="f-linkedin" placeholder="linkedin.com/in/yourname">
        </div>
        <div id="form-error" class="submit-error" style="display:none"></div>
        <button class="btn" style="margin-top:6px" onclick="submitForm()">Get my AI transition plan →</button>
        <span class="skip-link" onclick="skipForm()">Skip for now — just save the results</span>
        <p style="font-size:12px;color:var(--text3);text-align:center;margin-top:8px">We'll send your plan within 24 hours. No spam.</p>
      </div>
    </div>
```

- [ ] **Step 4: Update submitForm() validation and payload**

Find the `submitForm()` function and replace its validation and payload sections:

```js
function submitForm() {
  const name     = document.getElementById('f-name').value.trim();
  const email    = document.getElementById('f-email').value.trim();
  const title    = document.getElementById('f-jobtitle').value.trim();
  const mainTask = document.getElementById('f-maintask').value.trim();
  const errorEl  = document.getElementById('form-error');

  if (!name || !email || !title || !mainTask) {
    errorEl.textContent = 'Please fill in all required fields.';
    errorEl.style.display = 'block';
    return;
  }
```

And update the payload object inside the same function (find the `const payload = {` block and replace):

```js
  const linkedin = document.getElementById('f-linkedin').value.trim();

  const payload = {
    product: 'product-1',
    timestamp: new Date().toISOString(),
    name, email, title,
    mainTask,
    linkedin,
    category: quizState.category,
    pains: quizState.pains.join(', '),
    ...quizState.utmParams
  };
```

- [ ] **Step 5: Update success state in showSubmitSuccess()**

Find the `showSubmitSuccess` function body and replace the inner HTML:
```js
  document.getElementById('email-form-wrap').innerHTML = `
    <div class="submit-success">
      <div class="success-icon">✅</div>
      <h2>Your plan is on the way, ${name}!</h2>
      <p>Check your inbox within 24 hours.<br><br>
      <strong>While you wait — pick the #1 pain from your list and try the DIY step right now.</strong><br>
      It takes less time than you think.</p>
    </div>
  `;
```

- [ ] **Step 6: Verify in browser**

Run job-search flow → results screen must show the teaser card above the share buttons, then the email form below. Run any other category flow → teaser card must NOT appear. Submit the form (test email) — success state shows new copy. Check Apps Script spreadsheet — row appears. No JS errors.

- [ ] **Step 7: Commit**

```bash
git add products/product-1-why-start-ai.html
git commit -m "feat: update email CTA copy and add job-search teaser block"
```
```

---

### Task 5: Final verification and push

- [ ] **Step 1: Full end-to-end test — all 4 categories**

Open the file in browser. Run through each category:
1. Job Search → pick 3 pains → tag → results → verify teaser block visible above share buttons → email form below → expand 1 pain → 3 paths show
2. Experts → pick 3 pains → tag → results → verify NO teaser block → email form shows → expand 1 pain
3. Sales / Procurement → same
4. Freelancer → same

Check: pain titles match spec, hours match spec, DIY text shows, no JS errors.

- [ ] **Step 2: Test profession search**

On Screen 2, search: "photo" → Photographer → clicks → goes to Freelancer pains. Search "teach" → Teacher → Experts pains. Search "sales" → Sales Manager → Sales/Procurement pains.

- [ ] **Step 3: Push to GitHub**

```bash
git push origin main
```
