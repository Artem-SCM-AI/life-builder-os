---
name: hypergrowth-check
description: >-
  Evaluate any idea, project, or business against the AI Sales-Led Hypergrowth
  framework from Seva Ustinov's benchmark research (17 companies, $75B+ combined
  valuation). Scores against 6 Growth Laws and 6 Sales Laws, identifies archetype,
  surfaces critical gaps with specific fixes and verbatim evidence from real companies.
  Use when Artem wants to pressure-test an idea before building or pitching.
origin: Artem
---

# Hypergrowth Check

Evaluate an idea, project, or business against the patterns that produced the fastest-growing AI companies. Return a scored audit with archetype classification, specific gaps, and verbatim-backed fixes — not generic advice.

**Source:** Seva Ustinov — AI Sales-Led Hypergrowth Benchmark Research (17 companies, $75B+ valuation, $3B+ ARR). V3, April 2026.

---

## When to Activate

- Artem describes a new idea, offer, or business model
- Artem asks "is this a good idea?" or "what am I missing?"
- Artem is structuring a go-to-market, pricing, or sales approach
- Artem is evaluating whether to pursue or kill a project
- A project review or strategic pivot is being discussed

---

## Core Framework

The research shows variation only in **wedge selection, timing, and founder credibility** — not in the underlying playbook logic. The same structural patterns appear across all 17 companies regardless of category.

**Two layers:**
- **6 Growth Laws** — structural patterns (63–94% prevalence across 16 companies)
- **6 Sales Laws** — tactical commercial motions (63–88% prevalence)

**Critical finding:** Rare advantages (OpenAI Startup Fund for Harvey, Thiel pre-seed for Hebbia, COVID catalyst for Deel) compress the trust-building timeline from 18–24 months to 2–6 months — but do NOT eliminate the need for the systematic playbook. Companies without rare advantages still executed the same playbook at comparable growth trajectories, arriving 6–12 months later.

---

## Evaluation Protocol

### Step 1: Gather Context

Before scoring, extract:

1. **What is the product / offer?** One sentence.
2. **Who is the buyer?** Job title, company type, size.
3. **What problem does it solve?** Quantified if possible.
4. **What is the revenue model?** Subscription, usage, project, retainer.
5. **What stage?** Idea, MVP, early customers, scaling.
6. **Does the founder have domain background?** (crucial for archetype)

If any are missing, ask directly. Do not score with incomplete input.

---

### Step 2: Identify Archetype

Classify the idea into one of 6 archetypes — scoring modifiers apply per archetype.

| Archetype | Companies | Key Signal | GL-2 Weight |
|-----------|-----------|------------|-------------|
| **Vertical AI Expert** | Harvey, Hebbia, Abridge, Legora | Single high-stakes professional domain + domain-expert GTM + citation/verification architecture | HIGH — prestige-first mandatory |
| **AI Infrastructure Operator** | Deel, Ramp, Wiz | Infrastructure moat (not AI model); structural NRR; below-procurement-threshold entry price | LOW — trust via product infra, not logos |
| **Enterprise AI Platform** | Glean, Writer, Moveworks | Horizontal AI for enterprise; CIO/CISO buyer; compliance as GTM accelerant | MEDIUM — analyst validation path |
| **AI-Native CX Automation** | Sierra, Decagon, Intercom/Fin | Outcome-based pricing; 4–6 week paid pilots; fastest $100M trajectory in cohort | MEDIUM — reference customer matters |
| **Intelligence Layer / Analytics AI** | Gong, Listen Labs, Incident.io | Data-as-moat; category creation; content flywheel | HIGH — category creation takes 2–3 years |
| **Incumbent AI Transformation** | Intercom/Fin | $50M+ ARR installed base; AI product as upgrade not replacement | N/A — installed base is the trust |

**Archetype-specific warnings:**
- Vertical AI Expert: if no citation/verification architecture, trust won't form with professional buyers
- Enterprise AI Platform: requires 40+ design partners + SOC2 + compliance BEFORE enterprise GTM investment
- AI-Native CX Automation: outcome-based pricing eliminates "prove value before paying" — if pricing is seat-based, re-examine
- Intelligence Layer: category creation takes 2–3 years; only viable after product + customer base + content flywheel exist

---

### Step 3: Score Against 6 Growth Laws

Score each law: ✅ **Strong** / ⚠️ **Weak** / ❌ **Missing** / ❓ **Unknown**

---

#### GL-1: Wedge That Prints Value *(Prevalence: 94% — highest in cohort)*

> One workflow with immediate, quantifiable, transformational ROI. Not 20% better — 10x cheaper or 10x faster. Proven in the customer's environment in 4 weeks.

**The test:** Can the ROI be measured in dollars or hours saved within 30 days? Is it ONE workflow, not a platform?

**Benchmark examples:**
- Harvey: M&A document review for Big Law — not "legal AI." ROI visible in days at $1,000/hr billing rates.
- Sierra: Customer support containment rate — $13/contact human → <$1/contact AI. WeightWatchers: 70% containment in first week.
- Decagon: Replaced failed chatbot deployments with API-integrated resolution — Duolingo English Test: prior vendor failed for a year; Decagon live in 1 month with 80% deflection.
- Moveworks: IT helpdesk ticket deflection in Slack/Teams — 3 years of stealth to prove 25–40% autonomous resolution BEFORE public launch.

**Platform expansion always came after the wedge was proven** — never before or during. Harvey built Vault (25,000+ agents) only after Allen & Overy. Glean launched Agents only after $100M ARR.

**Red flags:**
- Launching with a platform narrative or "AI for X industry"
- Multiple use cases at launch
- Expanding scope during the sales cycle ("we can also do Y and Z")
- "20% more efficient" positioning instead of transformational ROI

---

#### GL-2: Win the Buyer the Market Follows *(Prevalence: 63%)*

> Trust cascades DOWNMARKET, not upmarket. Win the most authoritative name first — the one the rest of the market watches. Starting mid-market and trying to go upmarket has zero documented success cases in this cohort.

**Domain-sensitivity qualifier:** Applies most powerfully in markets with explicit status hierarchies (legal, healthcare, finance). In CX automation or horizontal enterprise software, the cascade effect is real but weaker.

**Benchmark examples:**
- Harvey: Allen & Overy (Magic Circle, UK) first. "If you earn the trust of a few of those firms, the rest of them will trust you." First 50 enterprise customers were all referrals. Own founder's firm was customer #200.
- Hebbia: 9 of 10 largest US PE megafunds in year one. ARR grew 11x ($900K→$10M) driven by word-of-mouth within tightly networked finance community.
- Abridge: UPMC as seed investor + first customer. Then Mayo Clinic, Kaiser, CVS as Series B investor-customers. "If Mayo Clinic trusts it enough to invest and use it, your legal department's objections are weaker."

**Trust shortcuts that worked (rare, non-replicable):**
- Harvey: OpenAI Startup Fund investment as trust signal
- Hebbia: Peter Thiel pre-seed check as credibility proxy in finance community
- Abridge: Epic "first Pal" partnership — reduced sales cycle from 18–24 months to 2 weeks

**Red flags:**
- Starting with whoever responds first
- Mid-market customers without cascade value
- No thought given to reference architecture of first customer

---

#### GL-3: Domain-Expert GTM Outperforms Generic Sales *(Prevalence: 75%)*

> Hire people who actually did the buyer's job. Lawyers selling to lawyers, bankers selling to banks. You can train domain experts on AI in weeks — you cannot train SaaS AEs on 20 years of domain knowledge.

**The structural asymmetry:** Domain experts close through peer credibility, not persuasion. They also create switching costs: customers rely on relationships with people who understand their work at a level a generic AE replacement cannot match.

**Benchmark examples:**
- Harvey: "Legal Engineers" — JD + 3+ years at Vault 50 firm required. Talent from White & Case, Latham, Skadden, Paul Weiss. They ran the demo, ran the pilot, owned post-sale.
- Hebbia: "AI Strategists" — ex-investment bankers and PE associates embedded post-sale. "AI takes operational change management. People naively believe they can roll out a chatbot and immediately drive enterprise value."
- Abridge: Physician-founder (Shiv Rao, practicing cardiologist) as GTM anchor. "Healthcare moves at the speed of trust."

**Fastest sales cycles** in cohort all had domain-expert AEs + hyper-personalized demos: Harvey (3–6 months at $500K+), Hebbia (3–6 months at $500K avg), Abridge (2 weeks via Epic), Sierra (6–12 weeks at $600K median).

**Red flags:**
- Founder with no domain background selling into specialized vertical
- Hiring generic enterprise SaaS AEs into regulated industries
- Generic CSM function when product requires deep workflow configuration

---

#### GL-4: Proof That Can't Be Argued With *(Prevalence: 88%)*

> Customer-confirmed, specific outcome data — not founder claims. Proof using the buyer's own data is the highest form.

**Evidence hierarchy (from research methodology):**
- L1 (weak): Founder-asserted — "our AI is 95% accurate"
- L2: Operator-confirmed — VP Sales or CS confirms the outcome
- L3: Customer-confirmed — named customer with specific metric
- L4 (strongest): Counterfactual — "if we hadn't done X, Y would have happened"

**Benchmark examples:**
- Sierra: 100% design partner conversion rate (6/6). Design partner conversion is a business quality signal — Sierra's program was structured correctly: paid, outcome-metricked, time-bounded, commercial pathway embedded.
- Gong: 11/12 alpha customers converted at trial close. "9 out of 10 complaints were 'how come you didn't even record this call?'" — users were angry when a call was missing.
- Moveworks: 3 years of stealth building proof on 250M+ IT issues before public launch. Announced Series A with paying enterprise customers already at 25–40% autonomous resolution. "Most AI companies launch to prove the concept. Moveworks is the single most important exception."

**Critical: proactive compliance = GTM accelerant; reactive compliance = procurement tax.**
Harvey and Abridge completed SOC2 + domain compliance BEFORE enterprise buyers asked. When the RFP arrived, the security questionnaire was already complete. Companies that treated compliance as a checkbox were disqualified while still completing certifications.

**Red flags:**
- "Our AI is accurate" without named customer data
- Generic benchmarks instead of customer-specific outcomes
- Design partner program without upfront payment and pre-agreed success metrics

---

#### GL-5: Price Against Labor Cost, Not Software *(Prevalence: 75%)*

> Anchor pricing to the human labor or agency cost being replaced, not to competing SaaS tools. "This replaces a $200K/yr analyst" lands differently than "cheaper than Salesforce."

**Critical distinction — budget source test (from Writer):** Operational budget vs. innovation budget. A CIO with innovation budget was NOT the ICP regardless of title. Operational budget access = real deal; innovation budget = exploratory.

**Benchmark examples:**
- Decagon: "Human labor is generally like an order of magnitude larger than software spend." $250K ACV delivers $800K+ ROI at Bilt (60K tickets/month, 70% AI-handled, "hundreds of thousands of dollars" monthly savings).
- Harvey: $1,200/lawyer/month = $14,400/yr. At $1,000–$1,500/hr billing rate, the tool pays for itself in days. ROI math takes under 60 seconds.
- Moveworks: $40–120/employee/year. Forrester TEI: 256% ROI, payback under 1 year for 30K-employee org. Sub-1-year payback made financial case trivially easy to approve.
- Hebbia: $10K/seat Professional tier — Bloomberg Terminal already budgeted at same price. Removed "there's no budget" objection entirely.

**Red flags:**
- Pricing compared to competitor tools ("cheaper than X")
- Monthly pricing without ROI framing
- Selling to innovation budget instead of operational budget
- Pricing so low it implies the problem isn't severe

---

#### GL-6: Expansion Built Into Product Logic *(Prevalence: 69%)*

> NRR > 120%. Two types: structural (automatic, no sales effort) vs. sales-motion (active upsell). Structural is more durable and capital-efficient.

**Structural NRR** (most durable): Revenue grows automatically as customer's business grows.
- Deel: more employees → more EOR/contractor revenue (automatic)
- Ramp: more transactions → more revenue (automatic)
- Sierra/Decagon: more support interactions → more per-conversation revenue (automatic)
- Wiz: more cloud workloads → more workload fees (automatic)

**Sales-motion NRR** (requires investment): Revenue expands through active upselling.
- Harvey: more seats + new practice areas + Vault workflows (requires CSM investment)
- Glean: department → org-wide + Agents add-on (requires CSM investment)
- Gong's 2023 NRR deceleration (SaaS hiring freeze) illustrates fragility of sales-motion NRR

**Three-phase product arc (75% of companies):** Wedge → Platform → Agents. Examples: Harvey: document tool → Vault/Workflows → 25K+ custom agents. Glean: search → knowledge graph → Agents. Abridge: scribe → voice → revenue cycle.

**Red flags:**
- Flat annual license, no expansion mechanism
- Expansion requires renegotiation
- No usage-based or seat-growth component

---

### Step 4: Score Against 6 Sales Laws

---

#### SL-1: Founders Sell Every Deal Until Motion Is Proven *(Prevalence: 88%)*

> Don't hire VP Sales until 2 people in the company are already closing independently. Founders must personally run the first deals — not to generate revenue, but to extract ICP definition, pricing anchor, and objection map.

**The hiring sequence that worked:**
1. Founders close first 5–20 customers personally
2. SDR hired only after 10+ out-of-network customers closed (not from founder's personal network)
3. AEs hired after SDR proves the model
4. VP Sales hired LAST — only when 2+ people are independently selling

**Benchmark examples:**
- Gong (Amit Bendov): "Don't hire a VP of Sales until two people in the company are selling successfully." Explicit rule, not timing heuristic. VP Sales Jameson Yung hired after AEs were closing independently.
- Harvey: Rob Saliterman joined VP Sales August 2023 — after B2C2B motion, legal engineer model, and deal structure were all proven through founder-run deals. First 50 customers were all referrals.
- Decagon: Evan Cassidy (VP Sales) hired near $10M ARR — unusually late by enterprise SaaS standards, deliberately so. "There's many AI tools out there, but Decagon is driving serious value already." He inherited a proven motion.
- Legora: Max Junestrand ran all sales personally for 18 months, $0 to ~$2M ARR. Cold LinkedIn DMs offering to pay lawyers their hourly rate for 30-minute interviews. After Series A, paused all sales for 4 months to fix reliability — decision only a founder could make against ARR pressure.

**Red flags:**
- "I'll hire a salesperson to do the selling"
- Hiring VP Sales at Series A before motion is validated
- Delegating first customer discovery to an AE

---

#### SL-2: Demo Against Their Own Work, Not Sample Data *(Prevalence: 75%)*

> Generic demos require the prospect to imagine. Remove the imaginative leap entirely — use their documents, their calls, their workflows. Either the model is right and the deal is done, or it's wrong and the meeting ends. No middle ground.

**Benchmark examples:**
- Harvey (PACER tactic): Before every call with a litigator, Weinberg downloaded their most recent federal court filing and ran prompts attacking their own brief. "They would instantly read the screen. It was risky because sometimes Harvey would hallucinate and then it would just be over. But the times that they got it right, it was over." — Weinberg verbatim.
- Hebbia: PE fund demos used prospect's actual deal documents. SVB crisis (March 2023): helped clients map portfolio banking exposure across thousands of documents in hours — word-of-mouth drove 11x ARR growth.
- Gong: Early demos played recordings from the prospect's own sales calls. Sales manager heard their own reps being coached in real time.
- Abridge: Live ambient recording demonstration — physician spoke a patient encounter aloud and system generated draft note in real time during the demo.

**Weinberg's standard:** "I don't think there is any excuse for someone who is building an AI product and trying to sell to not do hyper-personalized demos."

**Red flags:**
- Same demo for all prospects
- "Imagine if this were your data"
- Saving the custom demo for a follow-up meeting
- Demo environment with fictional company names

---

#### SL-3: WTP Is a Qualification Signal, Not Negotiation *(Prevalence: 75%)*

> Ask "how much would you pay?" directly and early. Real ICP buyers give a specific, large number immediately — they've already done the ROI math. Enthusiasm without price specificity is polite interest, not qualification.

**The gap that defines your ICP:**
- Decagon discovery: support leaders said "$150,000 immediately" (ICP). Sales/ops leaders said "maybe $1K/month, maybe next quarter" (not ICP). Not enthusiasm. Not use case fit. Not company size. WTP.
- Writer: "budget source test" — operational budget access vs. innovation budget. CIO with innovation budget = exploratory buyer regardless of title.
- Sierra: 10–20% of TCV required upfront before any product was built. Forces budget authority and urgency demonstration.

**Red flags:**
- Price discussed only at procurement (end of cycle)
- Fear of asking WTP directly in discovery
- Interpreting enthusiasm as qualification
- Discounting to close ICP-wrong deals

---

#### SL-4: Paid Pilots with Pre-Agreed Exit Conditions *(Prevalence: 88%)*

> Free pilots have no commercial gravity. Paid pilots create commercial pathways. The pilot structure converts successful execution into contract automatically — not into another negotiation.

**The 5 pre-agreed components (all must be set at kickoff):**
1. **Duration** — fixed, time-boxed (4 weeks Decagon; 90 days Glean; 2–6 months Sierra)
2. **Scope** — one workflow/department only, never horizontal deployment
3. **Success metric** — one primary metric (deflection rate, containment, adoption %, output quality)
4. **Baseline** — measured current state before pilot begins (so improvement is provable)
5. **Post-pilot pricing** — locked before pilot starts, no renegotiation after success

**Human-in-the-loop during pilot** (used where product replaces high-stakes decisions): Harvey (review-before-publish), Abridge (clinician review), Sierra/Decagon (human fallback always available). This is a risk control, not a permanent feature.

**Benchmark conversion rates:**
- Sierra: 6/6 design partners converted (100%)
- Gong: 11/12 alpha customers converted (92%)
- Glean: 40+ POCs, majority converted → $60K pilot → $300–500K+ company-wide within 9 months

**Red flags:**
- Free pilots ("to reduce buyer risk")
- No pre-agreed success metrics
- Endless pilot extensions
- Post-pilot price negotiation
- Treating pilot as a test rather than a structured demonstration of what already works

---

#### SL-5: Hardest Objector Is Best Potential Champion *(Prevalence: 63%)*

> The person pushing back hardest has the most at stake and the domain authority to evaluate the claim. Convert them and they become the most credible internal sponsor. Route around them and they kill the deal at legal or finance.

**Why objectors have more value than enthusiasts:** Hard objections signal domain authority and accountability. The managing partner who asks hardest questions about citation accuracy is the one whose name goes on briefs. They are NOT an obstacle — they are the target.

**Benchmark examples:**
- Harvey: Senior partners and litigators who objected to malpractice risk were primary conversion targets. Weinberg ran PACER tactic on their own filed briefs. When model identified real weaknesses in their drafting, the objector's professional judgment certified the result. Their previously stated skepticism made their conversion the most credible internal sponsorship.
- Legora: Managing partners most vocally opposing AI adoption were identified as primary conversion targets. "You burn that one shot with firms" — Legora identified these partners because their authority over practice standards made them the only sponsors that mattered.
- Gong: Sales managers objecting to "surveillance" became strongest product advocates once call data showed them performance gaps they already suspected. Objection was proxy for accountability, not resistance.

**Red flags:**
- Building a champion strategy around enthusiasts without authority
- "Routing around the skeptic" to find a faster path
- Treating objections as arguments to defeat rather than signals to investigate

---

#### SL-6: Sell to Practitioner First — Let Them Pull Procurement *(Prevalence: 63%)*

> B2C2B is not an accident — it's a strategy. Individual practitioners adopt for personal pain relief. When adoption reaches dependency, they pull enterprise procurement themselves. That deal arrives pre-sold.

**The structural advantage:** Enterprise buyer is not evaluating a vendor claim — they are responding to their own team's demonstrated dependency. Faster, more credible, stronger internal sponsor.

**Benchmark examples:**
- Harvey: "We had less friction actually in the beginning because we weren't pitching to firms. We were pitching to lawyers — individual lawyers. And so their pain was: I don't want to do this particular piece of my job." — Weinberg verbatim. Own firm was customer #200.
- Abridge: Physicians adopted for personal burnout relief (2+ hours/day of after-hours charting). UNC Health CMIO: physician who had written a resignation letter chose not to submit it after using Abridge. Health systems received inbound demand signal from their own clinical staff.
- Glean: Department teams at $60K budget. When 3+ departments were live with 80% DAU in 90 days, enterprise IT initiated company-wide consolidation as a rationalization event — deal arrived pre-sold.
- Cognition (Devin): Engineers tag Devin in Slack and Linear; usage grows organically. Itau Unibanco: waitlist of 1,000 developers formed within 5 months from practitioner pull.

**Red flags:**
- Only selling to C-suite; no practitioner adoption path
- Pricing that makes individual trial impossible
- Top-down mandate required before any use can begin
- Treating B2C2B as a workaround rather than a strategic choice

---

## Step 5: Cross-Insight Quick Checks

These patterns are confirmed across multiple companies and serve as diagnostic flags:

| Check | Signal | Implication |
|-------|--------|-------------|
| **Pricing model** | Outcome-based (per resolved interaction/task) → fastest $100M | If seat-based, re-examine whether outcome pricing is viable |
| **Fine-tuning as moat** | 10/13 companies tried and abandoned it | Application-layer differentiation (workflow config, context accumulation, trust architecture) compounds faster than model fine-tuning |
| **NRR type** | Structural vs. sales-motion | Structural NRR needs fewer expansion salespeople; sales-motion NRR is fragile to market downturns |
| **No-sell discipline** | Legora: "If we had continued to push, we would have just churned everything" | Churn in first 24 months is almost always ICP failure, not product failure |
| **Series B timing** | VP Sales hired between Series A and Series B — not before | Too early = VP inherits unvalidated motion; too late = growth left on table |
| **Compliance timing** | Proactive = GTM accelerant; reactive = procurement tax | In regulated industries, start compliance before first enterprise deal |
| **Trust direction** | Always downmarket (prestigious→easier), never upmarket | Starting mid-market and trying to cascade up has zero documented success in this cohort |

---

## Step 6: Output Format

Deliver results in this exact format:

---

### 🔍 Hypergrowth Check: [Project/Idea Name]

**Stage:** [Idea / MVP / Early customers / Scaling]
**Archetype:** [Vertical AI Expert / AI Infrastructure Operator / Enterprise AI Platform / AI-Native CX Automation / Intelligence Layer / Incumbent AI Transformation]
**Archetype note:** [1 sentence on why this archetype and what it implies for the scoring]

---

#### 📊 Growth Laws Score

| Law | Status | Gap / Strength |
|-----|--------|----------------|
| GL-1: Wedge That Prints Value | ✅/⚠️/❌/❓ | [1 sentence] |
| GL-2: Win Buyer Market Follows | ✅/⚠️/❌/❓ | [1 sentence] |
| GL-3: Domain-Expert GTM | ✅/⚠️/❌/❓ | [1 sentence] |
| GL-4: Irrefutable Proof | ✅/⚠️/❌/❓ | [1 sentence] |
| GL-5: Price Against Labor | ✅/⚠️/❌/❓ | [1 sentence] |
| GL-6: Expansion in Product | ✅/⚠️/❌/❓ | [1 sentence] |

**Growth Score: X/6**

---

#### 💼 Sales Laws Score

| Law | Status | Gap / Strength |
|-----|--------|----------------|
| SL-1: Founders Sell First | ✅/⚠️/❌/❓ | [1 sentence] |
| SL-2: Custom Demo | ✅/⚠️/❌/❓ | [1 sentence] |
| SL-3: WTP as Qualifier | ✅/⚠️/❌/❓ | [1 sentence] |
| SL-4: Paid Pilots | ✅/⚠️/❌/❓ | [1 sentence] |
| SL-5: Convert Objectors | ✅/⚠️/❌/❓ | [1 sentence] |
| SL-6: Practitioner-Led | ✅/⚠️/❌/❓ | [1 sentence] |

**Sales Score: X/6**

---

#### 🚨 Critical Gaps (fix these first)

List maximum 3 gaps that would kill growth fastest. For each:
- **Gap:** [What's missing — be specific, not generic]
- **Fix:** [Actionable step doable in next 7 days]
- **Benchmark:** [Company that solved this exact gap + how]

---

#### ✅ Strengths (don't break these)

List 1–3 things already aligned with the playbook.

---

#### 🎯 Hypergrowth Readiness Verdict

One of:
- **🟢 Aligned** — 9–12 laws covered. Structural playbook in place.
- **🟡 Fixable** — 6–8 laws covered. 2–3 specific changes needed.
- **🔴 Misaligned** — < 6 laws covered. Rethink before building.

**One-line verdict:** [The single most important thing to fix or double down on]

---

## Benchmark Reference

Use for Gap → Fix recommendations. Listed with archetype and key mechanism.

| Company | Archetype | Key Metric | Lesson |
|---------|-----------|------------|--------|
| Sierra | AI-Native CX | $0→$165M in 24 months | Fastest trajectory. Outcome-based pricing. 100% design partner conversion via 10–20% TCV upfront. |
| Harvey | Vertical AI Expert | $0→$195M in ~3 years | Lawyers selling to lawyers. PACER tactic. B2C2B. Own firm was customer #200. |
| Decagon | AI-Native CX | $1M→$50M in 15 months | 100+ pre-build interviews. WTP signal as ICP definition. VP Sales at $10M ARR. |
| Legora | Vertical AI Expert | $0→$23M+ in <18 months | No-sell discipline: "If we continued to push, we would have just churned everything." 4-month sales pause to fix reliability — founder decision no AE could make. |
| Hebbia | Vertical AI Expert | 11x ARR in 1 year | 9/10 largest PE megafunds in year one. SVB crisis as viral proof event. NRR >200%. |
| Deel | AI Infrastructure Operator | $0→$1B in <3 years | COVID exogenous catalyst. Below-procurement threshold entry. Structural NRR: more employees = more revenue automatically. |
| Glean | Enterprise AI Platform | $100M ARR in <3 years | 3+ years stealth building permission-aware infra. 40 design partners before public launch. Act One (search) → Act Two (Agents). |
| Gong | Intelligence Layer | $332M ARR | ICP pivot after 20–40 rejections: sales ops → CROs/VPs with budget authority. Category creation ("Revenue Intelligence") after 3 years + $30M ARR, not at launch. |
| Abridge | Vertical AI Expert | $100M+ ARR | Mayo/Kaiser/CVS as investor-customers — removed first-mover risk for later buyers. Epic "first Pal" collapsed sales cycle from 18–24 months to 2 weeks. |
| Moveworks | Enterprise AI Platform | Acquired $2.85B | 3 years stealth before launch with paying customers already at 25–40% resolution. Forrester TEI as purchase signal for 90% of enterprise buyers. |
| Wiz | AI Infrastructure Operator | $500M+ ARR | Agentless scanning showed real breaches in customer's environment in real time — irrefutable proof. |
| Cognition (Devin) | Intelligence Layer | $1M→$73M in 9 months | Consumption-metered ACU billing. Engineers tag Devin in Slack; usage grows without sales. 5x–10x contract expansions at successful accounts. |

---

## Tone Rules

- Be direct. Artem doesn't want validation — he wants truth.
- Name the specific gap. "Missing proof" is useless. "No named customer outcome after 3 paid pilots" is useful.
- Every fix must be actionable in the next 7 days.
- Every benchmark reference must name the company and what they specifically did — not what they represent.
- If something is genuinely strong, say so clearly. Don't soften strengths to seem balanced.
- Verbatim quotes from the research are more persuasive than summaries — use them when relevant.
