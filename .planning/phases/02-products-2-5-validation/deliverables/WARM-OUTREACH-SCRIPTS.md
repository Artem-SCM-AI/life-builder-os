# Warm Outreach Scripts

**Purpose:** Copy-paste-ready DM and email templates for warm contacts — ex-colleagues, LinkedIn connections, and existing SCAI customers.

**Usage rule:** Always personalize [Name] before sending. Warm messages must not feel templated. Add one specific detail about the person (a shared experience, something from their profile, or their company name) to show it is not mass outreach.

**Tracker instruction:** After sending each message, update the lead's row in the Lead Pipeline (LEAD-TRACKER-SPEC.md, Tab 1): set Column I (Status) to "Contacted" and Column J (Date Contacted) to today's date.

---

## Script 1: Ex-Colleague / Ex-Jumpzylla Contact

**Context:** Use for people you worked with directly or indirectly at Jumpzylla or in a previous SC role. These people know your work and professional reputation. This is your highest-trust segment.

**When to use:**
- Former colleagues from Jumpzylla (SC managers, operations team, buyers)
- Industry contacts from past roles who have seen your work
- People who know you as a supply chain professional, not just a LinkedIn connection

**The message (LinkedIn DM or email):**

---

Hey [Name] — hope things are going well.

I've been building something since leaving Jumpzylla and I'd value your honest take. It's a supply chain automation service for Amazon brands — using Claude AI to do the messy data work: structuring SC data, catching invoice errors, flagging demand deviations.

Takes 15 minutes to show you. Would you have a quick call this week or next? No pitch, just want to see if this solves a real problem for someone who's been in the trenches.

---

**Log in tracker as:**
- Column G (Lead Source): Warm-Colleague
- Column I (Status): Contacted
- Column J (Date Contacted): [today's date]
- Column L (Notes): "Warm-Colleague script sent via [LinkedIn DM / email]"

---

## Script 2: LinkedIn Connection (SC/Amazon Background, Already Connected)

**Context:** Use for first-degree LinkedIn connections who have a supply chain or Amazon operations background. You are connected but may not have spoken recently. Reference something specific from their posts or profile to avoid feeling like mass outreach.

**When to use:**
- 1st-degree LinkedIn connections
- Their profile or activity shows SC/Amazon operations role
- You have not spoken recently (if you spoke recently, use a more direct opening)

**The message (LinkedIn DM):**

---

Hey [Name] — I've been following your posts on [topic / their recent post subject].

I'm building SC automation tools for Amazon brands using AI — specifically around [pick the most relevant pain based on their profile: data structuring / exception alerts / invoice validation]. I'd love to get your input as someone who runs this day-to-day.

15-minute call? I'll show you what it does and you tell me if it's actually useful.

---

**Personalization tokens:**
- [topic] — reference a specific post or area they write about (e.g., "your posts on FBA inventory management", "your recent post about 3PL challenges")
- [relevant pain] — choose one based on their role: "data structuring" for ops/SC managers, "invoice validation" for finance-adjacent roles, "exception alerts" for fast-moving brands

**Log in tracker as:**
- Column G (Lead Source): Warm-Connection
- Column I (Status): Contacted
- Column J (Date Contacted): [today's date]
- Column L (Notes): "Warm-Connection script sent, referenced [their post topic]"

---

## Script 3: SCAI Customer Upsell (Phase 1 Paying Customer)

**Context:** Use for existing paying customers from Phase 1 (Supplier Communication AI). These people are already paying for the service and trust the delivery quality. This is the highest-priority warm segment for Products 2–5 validation — a yes from them also validates upsell potential.

**When to use:**
- Current paying customers (SCAI / Product 1)
- After they have received at least one delivery from you
- Do not send during onboarding — wait until they have seen value first

**The message (LinkedIn DM or email):**

---

Hey [Name] — quick update on something I'm adding.

I've been building out the data foundation layer (Product 0) and three more modules: exception alerts, demand deviation tracking, and invoice validation. All extend what we're already doing for your supplier emails.

Worth a 15-minute call to see if any of these are relevant for you?

---

**Log in tracker as:**
- Column G (Lead Source): Warm-SCAI
- Column H (Product Interest): [the product most relevant to their operation — EMS, DEVMON, SINV, or 3PLV]
- Column I (Status): Contacted
- Column J (Date Contacted): [today's date]
- Column L (Notes): "SCAI upsell script sent, existing paying customer"

---

## General Rules for Warm Outreach

1. **Personalize before sending** — replace all tokens in [brackets]. Do not send with placeholder text.
2. **One message per person** — do not follow up within 5 days unless they start a reply chain.
3. **Keep it short** — resist the urge to explain more. The goal of the message is a yes/no to a call, not to explain the full product.
4. **No attachments on first touch** — do not send decks, one-pagers, or PDFs in the first message. Wait until they ask or until after the call.
5. **Log immediately** — update the tracker the same session you send the message. Do not batch logging.
