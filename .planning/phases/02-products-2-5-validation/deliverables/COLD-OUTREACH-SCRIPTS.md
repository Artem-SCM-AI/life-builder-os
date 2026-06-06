# Cold Outreach Scripts

**Purpose:** Copy-paste-ready DM and email templates for cold leads — Amazon brand owners found via LinkedIn search who have no prior relationship with Artem.

**Usage rule:** Always personalize [Name] and [Company] before sending. All messages identify Artem by name and include eco.stepanenko@gmail.com — do not obscure sender identity.

**Volume target:** 10–15 cold DMs per day from the daily lead gen workflow (LEAD-GEN-SYSTEM.md, Step 4).

**Tracker instruction:** After sending each message, update the lead's row in the Lead Pipeline: set Column I (Status) to "Contacted", Column J (Date Contacted) to today's date, and Column G (Lead Source) to "Cold-LinkedIn" or "Cold-Email".

---

## Script 1: Cold LinkedIn DM (First Touch)

**Context:** Use for any qualified lead found via LinkedIn search who you have not spoken to before. Keep this message short — 3–4 sentences maximum. The goal is a reply, not a sale.

**When to use:**
- First contact with a cold lead via LinkedIn
- They are 2nd or 3rd degree connections
- You qualified them against the ICP criteria (sells on Amazon + has supply chain ops)

**The message (LinkedIn DM):**

---

Hey [Name] — I saw you're running [Company] on Amazon.

I'm building an SC automation service that structures supply chain data using AI — so brands like yours stop losing time on manual data cleanup and catch stockouts, invoice errors, and demand deviations faster.

Happy to show you in 15 minutes. Worth a look?

---

**Log in tracker as:**
- Column G (Lead Source): Cold-LinkedIn
- Column I (Status): Contacted
- Column J (Date Contacted): [today's date]

**Do not use if:** You have already sent this person a message before (even months ago). Use the follow-up script instead or skip.

---

## Script 2: Cold Email (If Email Found via LinkedIn or Hunter)

**Context:** Use when you have found or verified a direct email address for a qualified lead. Email allows slightly longer messages than LinkedIn DM but must remain concise. Include full sender identification — name, brand, and email.

**When to use:**
- You have a verified direct email address (not a generic info@ address)
- The lead did not respond to a LinkedIn DM after 3–4 days
- The lead's LinkedIn profile shows they are more likely to respond to email (e.g., email listed in their contact info)

**Subject line:**

```
Cut SC data cleanup time for [Company]
```

**Email body:**

---

Hi [Name],

I found your profile while researching Amazon brands with China-sourced supply chains.

I'm building SCAIT — a supply chain automation service that uses AI to structure messy SC data and catch operational issues (stockouts, invoice errors, demand deviations) before they become expensive.

Most brands I talk to spend 2–5 hours/week on data that AI can handle in minutes.

Would you be open to a 15-minute call this week?

— Artem Stepanenko | SCAIT | eco.stepanenko@gmail.com

---

**Log in tracker as:**
- Column G (Lead Source): Cold-Email
- Column I (Status): Contacted
- Column J (Date Contacted): [today's date]
- Column L (Notes): "Cold email sent to [email address used]"

**Do not use if:** You have not confirmed this is a direct inbox (avoid generic info@ addresses — low conversion and risks spam classification).

---

## Script 3: Follow-Up (Sent 3–4 Days After No Reply to Script 1 or 2)

**Context:** Use when a qualified lead did not reply to your first message (Script 1 or 2). Send once and once only. The goal is to lower the bar for response — offer a 90-second demo instead of a call.

**When to use:**
- Exactly 3–4 days after sending Script 1 or 2 with no reply
- Lead's Status in tracker is still "Contacted" (not "Replied", not "Closed Lost")
- You have not already sent a follow-up to this person

**The message (LinkedIn DM or email reply):**

---

Hey [Name] — just following up on my last message.

I know it's a lot of noise out there. Happy to share a 90-second demo instead — shows exactly what it does with real SC data. Just reply "show me" and I'll send it. No call needed.

---

**Log in tracker as:**
- Column I (Status): keep as "Contacted" (upgrade to "Replied" only if they respond)
- Column K (Date of Last Activity): [today's date]
- Column L (Notes): "Follow-up sent [date]"

**Do not use if:**
- They replied "not interested" or "no thanks" — respect the opt-out, update Status to "Closed Lost"
- You already sent a follow-up to this person (one follow-up maximum per contact)
- Fewer than 3 days have passed since your last message

---

## General Rules for Cold Outreach

1. **Personalize before sending** — replace all tokens in [brackets]. Do not send with placeholder text, especially [Name] and [Company].
2. **Sender identity is always clear** — all messages include "Artem Stepanenko" and eco.stepanenko@gmail.com in the message or sender profile. Never obscure who is reaching out.
3. **One follow-up maximum** — after Script 1 or 2, send Script 3 once. If no reply after the follow-up, move the lead to "Follow Up Later" and revisit in 30 days.
4. **Respect opt-outs immediately** — if anyone says not interested, update Status to "Closed Lost" and do not contact again.
5. **Do not pitch in the first message** — the goal of cold outreach is to earn a reply, not to close a sale. Keep it short. Save demos and pricing for calls.
6. **Batch follow-ups** — review the tracker daily during Step 6 (LEAD-GEN-SYSTEM.md) and send follow-ups to all leads where Date Contacted was 3–4 days ago and Status is still "Contacted".

---

## Message Sequence Summary

| Step | Script | Timing | Channel |
|------|--------|--------|---------|
| 1 | Cold LinkedIn DM | Day 0 | LinkedIn |
| 2 | Cold Email (optional) | Day 0 or after no reply | Email |
| 3 | Follow-Up | Day 3–4 (if no reply to Step 1 or 2) | Same channel as Step 1 |
| — | No further contact | After follow-up with no reply | Archive in tracker |
