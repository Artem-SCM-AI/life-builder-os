# Interview Master Script — Universal 15-Minute Call Structure

**Purpose:** Operational wrapper for all 40 validation interviews across Products 2–5.
**Usage:** Open this file before every call. Pair with the relevant product sales script for the Discovery and Demo blocks.

---

## Section 1: Timing Table

| Block | Time | What Happens |
|-------|------|--------------|
| Opening | 1 min | Thank them, state agenda: "I want to understand your current process, then show you something specific, then if it makes sense we can talk next steps" |
| Discovery | 5–7 min | Ask 3–4 product-specific questions (see each product script); listen, don't pitch |
| Demo | 4–5 min | Open Claude, paste demo prompt + sample data, show output live; 1–2 key observations |
| Offer | 2–3 min | State price, state what setup includes, ask close question |
| Close / Next | 1 min | Either get "yes" or book follow-up |
| **Total** | **~15 min** | |

---

## Section 2: Universal Opening Line

Use exactly these words to open every call:

> "Thanks for making time. I'll be direct — I want to spend 5 minutes understanding how you currently handle [product topic], then show you a specific tool I've built, and you tell me if it's relevant. Sound good?"

**[product topic] by product:**
- EMS: "exception monitoring — stockouts, overstock, delays"
- DEVMON: "demand forecast accuracy"
- SINV: "supplier invoice validation"
- 3PLV: "3PL invoice reconciliation"

**After opening, go directly into the product-specific Discovery block. See the relevant product sales script.**

---

## Section 3: Universal Offer Close

Use exactly these words after the Demo block:

> "Here's how it works: $300 setup — that's where I map your data sources and configure everything for your specific SKUs, suppliers, and 3PLs. Then $49/month for weekly delivery. If I save you 2 hours per week, you've paid for the month in day one. Want to move forward?"

**Pause after asking. Let them respond. Do not fill the silence.**

---

## Section 4: Objection Responses

| Objection | Response |
|-----------|----------|
| "I need to think about it." | "Totally fair. What's the main thing you'd need to be confident about?" (then address it directly) |
| "It's too expensive." | "What are you spending now on fixing data errors or chasing supplier info? This is probably less than one hour of your time per month." |
| "I have a system already." | "What does it do when the data is wrong or missing? That's the gap this fills." |
| "Not right now." | "When would be right? I'll follow up then. Can I send you a 90-second demo video in the meantime?" |

**Rule:** Answer one objection, then re-ask the close. If they give a second objection, answer it and book a follow-up — don't close on the same call after two objections.

---

## Section 5: Call Log Template

Copy this block for every completed call. Paste into the interview tracker built in 02-02.

```
Call Log — [Date] | [Prospect Name] | [Product Pitched]
Pain confirmed: [yes/no] | Exact pain stated: [quote]
Demo reaction: [positive/neutral/negative] | Specific comment: [quote]
Offer made: [yes/no] | Response: [accepted/declined/follow-up date]
Outcome: [Closed Won / LOI / Not Now / No Fit]
Follow-up action: [what, by when]
Interview number: [X of 10 for this product]
```

**Field definitions:**
- **Pain confirmed:** Did the prospect describe a real version of the problem this product solves? (yes = they named it; no = they denied it or deflected)
- **Exact pain stated:** Use a direct quote where possible — this is your validation data
- **Demo reaction:** Overall read of their response during the demo
- **Specific comment:** One quote from them during the demo
- **Offer made:** Did the conversation reach the Offer block?
- **Response:** Outcome of the Offer block
- **Outcome:** Final call classification for the tracker
- **Follow-up action:** One specific next step with a due date
- **Interview number:** Tracking progress toward 10/product target

---

## How This Fits the Product Scripts

```
INTERVIEW-MASTER-SCRIPT.md (this file)
├── Opening (Section 2) — same for all products
├── Discovery → See [PRODUCT]-SALES-SCRIPT.md
├── Demo → See [PRODUCT]-SALES-SCRIPT.md + DEMO-PREP-GUIDE.md
├── Offer (Section 3) — same for all products
├── Objections (Section 4) — same for all products
└── Call Log (Section 5) — same for all products
```

Product scripts fill the Discovery and Demo blocks. This master script handles everything else.
