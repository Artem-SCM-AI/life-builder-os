# Data Structurer Assistant — 15-Minute Sales Call Script

**Product:** Product 0 — Data Structurer Assistant
**Format:** Discovery → Demo → Offer
**Total time:** 15 minutes
**Tone:** Peer-to-peer. Former Head of SC who solved this problem himself — not a vendor pitch.

---

## Call Structure

| Block | Time | Focus |
|-------|------|-------|
| Opening | 2 min | Set the agenda; establish peer framing |
| Discovery | 5 min | 4 questions to surface the data pain |
| Demo | 5 min | Live Claude demo with messy real-format data |
| Offer | 3 min | Specific price, scope, and objection response |

---

## Block 1: Opening (2 minutes)

**Goal:** Establish that this is a focused conversation about one specific problem, not a sales call.

---

"Hey [Name], thanks for making time. I'll keep this tight — 15 minutes.

I want to show you one specific problem that every Amazon brand I've worked with has, and how I'm solving it using AI now. It's not a big pitch — I'm going to show you something live, and you tell me if it's relevant to your operation.

Does that work?"

[Wait for yes. If they ask what it's about:]

"It's about data. Specifically, the 20 minutes you lose every time you try to pull together your inventory, supplier, and 3PL data into something you can actually make a decision from. Sound familiar?"

---

## Block 2: Discovery (5 minutes)

**Goal:** Get them talking about their current data workflow. Four questions — ask them in order, listen for specific pain signals.

---

**Question 1:**

"How do you currently pull together your inventory data, supplier updates, and 3PL activity when you need to make a decision — like whether to reorder or whether your 3PL billed you correctly?"

*Listen for:* multiple tabs open, copy-paste, Excel formulas, VA doing it manually, takes a while, happens weekly.

---

**Question 2:**

"How long does that typically take you — start to finish, from pulling the data to having something you can act on?"

*Listen for:* any answer over 15 minutes is your signal. Even "20–30 minutes" is a strong hook.

*If they say it's fast:* "Is that because you've got a system, or because you're just used to doing it fast and haven't stopped to measure?"

---

**Question 3:**

"What's the worst thing that's happened when that data was wrong or missing — a stockout, an overbilling, a supplier issue you caught too late?"

*Listen for:* stockout story, 3PL billing dispute, supplier lead time miscommunication, wrong reorder quantity.

*This is the most important question. Give them space to tell the story.*

---

**Question 4:**

"If you had clean, structured data from all three sources — Seller Central, your supplier, your 3PL — ready in under 2 minutes, what would you do with it first?"

*Listen for:* "catch problems earlier," "reorder faster," "stop chasing my VA," "trust the numbers." This tells you what outcome to anchor the offer to.

---

## Block 3: Demo (5 minutes)

**Goal:** Show Claude turning messy real-format data into a structured table in real time. No slides. No screenshots. Live.

---

"Okay, let me show you what I built. Can you see my screen?"

[Share screen. Open Claude.]

"This is Claude — you've probably seen it. What I've done is write a specific prompt that turns any messy SC data — Seller Central rows, supplier emails, 3PL invoices — into a clean structured table with one paste.

Watch."

[Paste the DS-CLAUDE-TEMPLATE.md prompt into Claude followed by the three raw examples from DS-DEMO-OUTPUT.md Section 1.]

"I just pasted three different data formats — a Seller Central row, a supplier email, and a 3PL invoice line. All messy. Different formats. Let's see what it does."

[Wait for Claude to respond. Show the output — the structured tables with Status column.]

"Look at this. Three inputs, three clean tables, 90 seconds. It even flagged the fields that are missing — Days of Stock blank, 3PL name not in the excerpt. That's a data quality catch you'd normally miss until it caused a problem.

Manually, mapping these three data sources into one coherent view takes 20–30 minutes — minimum. Every. Single. Time.

This is what I mean by the data foundation. Every other workflow I'm building — exception management, invoice validation — they all need this layer to work. And right now, most people are doing this by hand."

---

## Block 4: Offer (3 minutes)

**Goal:** Give a clear, specific offer with a price, a scope, and one objection response ready.

---

"So here's what I'm offering.

**$300 setup fee.** That covers one session where I map your exact data sources — your Seller Central export format, your main supplier's email style, your 3PL's invoice format — and configure this template specifically for your SKUs and suppliers. Not a generic template — yours.

**$49 per month.** That gets you a weekly structured data report delivered to your Google Drive. Every week, your inventory, supplier status, and 3PL activity — cleaned, normalized, ready to use. No copy-paste, no VA hours, no chasing.

That's it. No contract. Cancel anytime."

[Pause. Let them respond.]

---

**If they ask "is it worth it?":**

"Here's the math I use: if I save you 2 hours a week in data prep time, and your time is worth even $25 an hour, that's $200 a month in recovered time. You've paid for this service in the first week. And that's before we count the cost of one stockout or one 3PL overbilling that clean data would have caught."

---

**If they say "I need to think about it":**

"Totally fair. Here's what I'd suggest: let me send you the output from what we just built — the structured tables from your actual data format — so you can look at it yourself and show it to whoever else needs to see it. If it's useful, we move forward. If not, you've lost nothing."

---

**If they say "I already have a VA doing this":**

"That's actually the best use case for this. Your VA can use this tool instead of doing it manually — same output, 90 seconds instead of 30 minutes. They get freed up for higher-value work. You get faster data. Same cost."

---

**Closing line:**

"Look, I built this because I was doing this exact thing manually myself for five years as a Head of Supply Chain. It's a solved problem. I just want to make sure Amazon sellers aren't still solving it the hard way."
