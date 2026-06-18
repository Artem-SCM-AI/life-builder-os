# Artem × Afina — Case Study: Full Chat Transcript

> This document contains the verbatim English transcript of the working session where Artem (Head of Supply Chain) worked through the Afina e-commerce case study together with Claude. Artem drove the analysis; Claude verified calculations and built on his reasoning.

---

## The Case Study (Original Text)

> This case study is designed to simulate real operational challenges at a fast-growing e-commerce company.
> Please answer concisely but clearly. We care more about your thought process and prioritization than perfect formatting.

**Company Context**

Afina sells consumer products through:
- Shopify (DTC website)
- Amazon FBA
- Amazon FBM

We source products from international suppliers and fulfill through a mix of Amazon warehouses and U.S.-based 3PLs. One of our top SKUs has gone viral and sales have accelerated significantly over the past 3 weeks.

**Current Situation**

Current Sellable Inventory:
- Amazon FBA: 2,400 units
- 3PL Warehouse: 1,600 units
- Total Available: 4,000 units

Current Daily Sales:
- Shopify: 55 units/day
- Amazon: 145 units/day
- Total: 200 units/day

Forecasted Growth: Marketing expects sales to increase by 30% within the next 14 days.

**Incoming Inventory**

Shipment A:
- 8,000 units
- Production completed
- Sea freight transit: 36 days
- Sea freight cost: $9,000

Shipment B (Optional Air Freight):
- Up to 2,500 units can be split into air freight
- Air transit: 8 days
- Air freight cost: $6.20 per unit

**Financial Data**
- Selling price per unit: $79
- Product cost per unit: $18
- Average blended fulfillment + marketplace fees: $21/unit
- Current ad spend allocation: 18% of revenue
- Gross margin target after logistics: 35%+

**Additional Operational Problems**
- Amazon storage fees increased by 22%
- The supplier is requesting a 15% deposit increase on the next PO
- The 3PL has had mis-picks increase to 3.5% of orders
- Customer support tickets are increasing due to delayed shipments
- Cash available for inventory/freight this month: $120,000

---

## Full Chat Transcript

---

**USER:**
Create an MD file from this text: [full case study text above]

**ASSISTANT:**
Saving the text to an MD file.

File saved: case-study-afina.md

Would you like me to write the answers to all the questions in this case study right away?

---

**USER:**
Not sure) I think I can do this better than you)

**ASSISTANT:**
Of course — you have 5+ years of real experience, I only have the text.

Go ahead. If you want to compare answers or polish the wording before submitting — just let me know.

---

**USER:**
- Selling price per unit: $79
- Product cost per unit: $18
- Average blended fulfillment + marketplace fees: $21/unit
- Current ad spend allocation: 18% of revenue

Calculate how much it comes to?

**ASSISTANT:**

| Item | Amount |
|---|---|
| Selling price | $79.00 |
| − Product cost | $18.00 |
| − Fulfillment + fees | $21.00 |
| − Ad spend (18% × $79) | $14.22 |
| **Contribution profit** | **$25.78** |
| **Margin** | **32.6%** |

Target is 35%+, here we get **32.6%** — below target by ~2.4 p.p.

---

**USER:**
So the projected profit is 25.78?

**ASSISTANT:**
Yes, **$25.78 per unit** — that's before air freight.

If you choose air freight (+$6.20/unit):

$25.78 − $6.20 = **$19.58/unit** (margin ~24.8%)

---

**USER:**
I think air is a great way not to run out of stock — and how much would we earn by the way? If we sent all 8,000 by air?)

**ASSISTANT:**
There's a limitation here — per the case conditions, **maximum 2,500 units** can be sent by air, not all 8,000.

But if we calculate hypothetically 8,000 by air:

$6.20 × 8,000 = **$49,600** just for freight

Plus the monthly budget is $120,000 for everything (inventory + logistics), so that would eat nearly half the cash.

Realistically per the case: **2,500 units air** = $6.20 × 2,500 = **$15,500** — this fits the budget.

---

**USER:**
No. We'll be out [of stock].

**ASSISTANT:**
Correct. Let's calculate why:

**Without air freight:**
- 4,000 units ÷ 200/day = **20 days**
- With 30% growth → ~230/day average → **~17 days**
- Sea freight arrives in **36 days** → **gap ~16-19 days without stock**

**With 2,500 air (day 8):**
- Day 1-8: −1,600 units → balance 2,400 + 2,500 = **4,900**
- Day 8-36: 260/day × 28 days = 7,280 needed
- We have 4,900 → **stockout ~day 27**
- Sea arrives day 36 → **gap ~9 days**

So even maximum air doesn't fully cover. Need either more air (but 2,500 cap) or negotiate with supplier to expedite the next PO.

---

**USER:**
There's no 2,500 limit. I see it here as an option and permission.
Calculate how many units we need to cover everything until the sea shipment arrives.
Note: if we ship by sea or air to Amazon FBA (not to 3PL), we need an additional 2 weeks for Amazon to receive the stock.

**ASSISTANT:**
OK, calculating with 14 days FBA processing.

**Effective time until sea batch is live on stock:**
- Sea transit: 36 days
- FBA processing: +14 days
- **Total: 50 days**

**Total demand over 50 days:**

| Period | Sales | Units |
|---|---|---|
| Days 1–14 | 200/day | 2,800 |
| Days 15–50 | 260/day (+30%) | 9,360 |
| **Total** | | **12,160** |

**How many needed by air:**
```
12,160 (demand) − 4,000 (current stock) = 8,160 units
```

**But the entire shipment is only 8,000 units.** So we need to send **everything by air**, and even then there's a deficit of ~160 units.

**Conclusion:** To avoid stockout — send all 8,000 by air. The ~160-unit shortfall is manageable (FBM from 3PL can bridge it).

---

**USER:**
Wait. Here are my thoughts:

Let's rebuild the whole document based on my reasoning.

Afina sells D2C, FBA and FBM.

Current Sellable Inventory:
- Amazon FBA: 2,400 units
- 3PL Warehouse: 1,600 units
- Total Available: 4,000 units

Current Daily Sales:
- Shopify: 55 units/day
- Amazon: 145 units/day
- Total: 200 units/day

Forecasted Growth: 30% within the next 14 days.

Here's what I think.

FBA inventory will last 16 days. With 30% growth over the next 14 days, we're already out 100%. Even believing air freight arrives and gets checked in within 12-13 days — I wouldn't trust that. Sounds unrealistic.

Replenishing 3PL to FBA will also be costly. Plus 3PL has 29 days of stock.

Even shipping from 3PL to FBA takes 10+ days of receiving.

But since the case doesn't provide FBM/FBA split data, I'll assume sales won't drop much with a channel change... which means our stock considering the 30% growth (let's say it'll really be 30% for 70% of the time — so 10 days) — using a formula gives us stock for 12 days (verify exactly).

But. If we do air freight to both FBA and 3PL in parallel (for FBM), we need more data about the FBA/FBM split for proper allocation.

So. I would allocate to 3PL enough for 25 × (200+30%) × days-of-stock (at least some weeks to guarantee covering FBA receiving time). That's already 6,500 units. Meaning the ready 8,000 units don't save us — they need to be sent air to 3PL.

Freight cost — $49,600.

And hopefully the next batch is already in production.

Moving forward.

- Gross margin target after logistics: 35%+ — so we're already at 32.6% before international logistics and the target is 35%? What an interesting problem)))

**ASSISTANT:**
First let me verify your 12-day figure:

**FBA stockout with 30% growth from day 1:**
2,400 ÷ (145 × 1.3) = 2,400 ÷ 188.5 = **12.7 days** ✓

Your 12 — correct. If growth is gradual (from day 5) — comes to ~14 days, but for conservative planning 12 is better.

**3PL check:**
1,600 ÷ 55 (Shopify only) = **29 days** ✓

---

Now I'm building the document. Tell me — do you want me to write the answers to all 7 questions in your style right away, or do you first add your thoughts on Parts 2-4, and then I compile everything together?

On margin — this is actually a great observation for the case: the company is **already below its own target before any additional costs**. Air freight kills another ~8 p.p. on top. This needs to be highlighted as a separate finding in the answer.

---

**USER:**
We haven't finished the first question yet.
Let's now forecast exactly how many we need to send to 3PL and how many to FBA. From 3PL we can sell both Shopify and Amazon FBM but from Amazon FBA we can't sell Shopify.

**ASSISTANT:**
Good question. Here's the problem:

**We don't know the FBA/FBM split within the 145 Amazon/day.**

This is critical data for the calculation. Without it — only assumptions.

**Formula for allocation:**

Let:
- `F` = FBA sales/day (unknown)
- `145 − F` = FBM sales/day
- With 30% growth: FBA → `F × 1.3`, FBM → `(145−F) × 1.3`

**How many needed at FBA** (coverage to day 50 = 36 transit + 14 FBA processing):
```
(F×14) + (F×1.3×36) − 2,400
= F × 60.8 − 2,400
```

**How many needed at 3PL** (coverage to day 36 = sea transit):
```
((55 + 145−F) × 14) + ((55 + 145−F) × 1.3 × 22) − 1,600
= (200−F) × 42.6 − 1,600
```

**Using typical 80/20 split (FBA = 116/day, FBM = 29/day):**

| Destination | Calculation | Units |
|---|---|---|
| FBA air | 116 × 60.8 − 2,400 | **4,653** |
| 3PL air | (200−116) × 42.6 − 1,600 | **1,978** |
| **Total** | | **~6,631** |

**Conclusion:** For an accurate calculation — we need the real FBA/FBM split. Without it we risk either overpaying for air or leaving FBA without stock.

What's your assumption on the split?

---

**USER:**
I think 70/30 FBA being bigger, but if there's no stock on FBA, it sells on FBM.

**ASSISTANT:**
Great. Then we calculate with the real split and the "FBA out → FBM absorbs" logic:

**Split 70/30:**
- FBA: 145 × 70% = **102/day** → with growth: **133/day**
- FBM: 145 × 30% = **43/day** → with growth: **56/day**
- Shopify: 55/day → with growth: **72/day**

**FBA stockout:**
- Days 1–14: 102/day × 14 = 1,428 → balance: 972
- Day 14+: 133/day → 972 ÷ 133 = 7.3 days
- **FBA out: day ~21–22**

**Problem with air freight to FBA:**

Air freight to FBA = 8 days transit + 14 days processing = **day 22**

FBA stockout — also day **~21–22**. Meaning air to FBA arrives exactly when FBA is already empty. Very risky — any delay and there's a gap.

**3PL dynamics:**

| Period | 3PL covers | /day |
|---|---|---|
| Days 1–21 | Shopify + FBM | 98 → 128 |
| Day 22+ | Shopify + FBM + FBA overflow | 260 |

3PL current stock: 1,600 ÷ 98 = **16 days** → stockout day ~16 without air.

**Conclusion:**

Sending air to FBA makes no sense. It arrives when FBA is already empty.

**Optimal strategy: all 8,000 by air to 3PL.**

- Arrives day 8: 3PL = 1,600 − (98×8) + 8,000 = **8,816 units**
- From day 22: covers all 260/day (FBM + Shopify + FBA overflow)
- Until day 36 (sea arrives): balance ~3,000+ units ✓

Cost: 8,000 × $6.20 = **$49,600**

---

**USER:**
But FBA means more sales (customers love it), let's factor that in?

**ASSISTANT:**
Correct. FBA = Prime badge + Buy Box. FBM doesn't absorb 100% — some customers simply won't buy.

**Typical estimate: FBM captures ~60-70% of FBA sales.**

Meaning if FBA stocks out:
- FBA was: 133/day (with growth)
- FBM absorbs: ~80/day (60%)
- **We lose: ~53 units/day**

In money: 53 × $25.78 = **~$1,366/day in lost contribution profit**

**This changes the strategy:**

Air to FBA arrives day 22, FBA stockout day ~21-22 → minimal gap, but FBA restocks.

**Distribution of 8,000 units:**

| Destination | Units | Logic |
|---|---|---|
| Air → FBA | ~3,700 | Covers FBA days 22–50 (28 days × 133/day) |
| Air → 3PL | ~4,300 | Covers Shopify + FBM days 8–36 |
| **Total** | **8,000** | |

**3PL check (4,300 units + 816 balance after day 8):**
- 5,116 units ÷ 128/day = **~40 days** ✓ covers until sea arrives

**FBA check (3,700 units from day 22):**
- 3,700 ÷ 133/day = **~28 days** → to day 50 ✓

**Total cost:** 8,000 × $6.20 = **$49,600** (unchanged)

**Without this split — we lose ~$1,366/day on FBA conversion. Over 28 days that's ~$38,000 in lost profit.** Air freight is justified.

---

**USER:**
Let's split 50/50 between FBA and 3PL?

**ASSISTANT:**
Checking if it's enough:

**FBA: 4,000 units (arrives day 22)**
- FBA stockout day 21-22 → air restocks immediately
- Coverage: 4,000 ÷ 133/day = **30 days** → to day 52
- Sea arrives FBA day 50 → balance ~266 units ✓

**3PL: 4,000 units (arrives day 8)**

| Period | Consumption | Balance |
|---|---|---|
| Day 0–8 (current stock) | 98/day × 8 = 784 | 816 |
| Day 8: air arrives | +4,000 | **4,816** |
| Day 9–14 | 98/day × 6 = 588 | 4,228 |
| Day 15–36 | 128/day × 22 = 2,816 | **1,412** |
| Sea arrives day 36 | | ✓ |

**Both channels covered. 50/50 split works.**

---

**USER:**
Let's calculate the minimum number of units we can send by air from these 8,000. And send the rest to 3PL by sea (36 days).

**ASSISTANT:**
Calculating the minimum. Key question — where does the air freight go: to 3PL, FBA, or split?

**Variant A: Air only to 3PL (accepting FBA stockout)**

3PL without air stockout: day ~16
Air arrives 3PL: day 8

3PL balance:
```
Day 8: 1,600 - (98×8) + X = 816 + X
Day 21: 816 + X - (98×6) - (128×7) = X - 668
Day 22-36: FBA out → 3PL takes ~65% FBA = 214/day × 15 = 3,210
X - 668 - 3,210 ≥ 0 → X ≥ 3,878
```

**Minimum by air: ~3,900 units to 3PL**
By sea to 3PL: 4,100 units (day 36) ✓

**Variant B: Split air (FBA + 3PL, preserving Buy Box)**

| Channel | Need | Logic |
|---|---|---|
| FBA air | 3,724 | Days 22–50 × 133/day |
| 3PL air | 2,588 | Bridge to day 36 |
| **Total air** | **6,312** | |
| Sea to 3PL | 1,688 | |

**Comparison:**

| | Variant A | Variant B |
|---|---|---|
| Air units | **3,900** | 6,312 |
| Air cost | **$24,180** | $39,134 |
| FBA preserved | No | Yes |
| Conversion loss (28 days) | ~$38,000 | $0 |

**Minimum by cost** — Variant A ($24,180 air).
**Minimum by losses** — Variant B ($39,134 air, but preserves ~$38,000 in conversion).

What do we choose?

---

**USER:**
Then Variant B. We'll save money.
But first critique this scenario and improve it.

**ASSISTANT:**
**Critique of Variant B:**

**1. FBA timing — biggest risk**
- We're calculating 14 days Amazon processing. In reality: **7–21 days** depending on warehouse load.
- FBA stockout: day 21–22. Air arrives: day 22 (best case).
- If processing takes 18 days → FBA empty **4–6 days** → Buy Box lost, rank drops, recovery takes weeks.

**2. 3PL air = zero buffer**
- Calculated at exactly "0" on day 36. Any growth above 30% → stockout before sea arrives.
- A viral product can grow 40–50%.

**3. 1,688 units by sea = LCL problem**
- Sea freight LCL (Less Than Container Load) costs disproportionately more per unit. 1,688 units is likely not enough for an FCL (Full Container Load). Need to verify LCL vs FCL pricing.

**4. FBA timing assumption is optimistic**
- 8-day air transit is also best case. If customs clearance or carrier delays add 2-3 days → FBA empty for 3+ days guaranteed.

**Improved version:**

Send **all 8,000 by air**, split 4,000/4,000 with master carton constraint.

Rationale:
- $39,134 (Variant B air) vs $49,600 (all air) = difference of only $10,466
- In exchange for $10,466 we get: zero FBA gap risk, 3PL buffer for unexpected demand, no LCL pricing headache
- Lost conversion on FBA = $1,366/day × even 2 days of unexpected delay = $2,732 → the "savings" of Variant B vanish instantly

---

**USER:**
Then all by air. Depending on units per master carton 4000/4000, and the number of master cartons going to FBA must be divisible by 5.

**ASSISTANT:**
Makes sense — Amazon receives better when the carton count is divisible by 5, fewer discrepancies during receiving.

For accurate calculation: **how many units per master carton?**

This determines:
- How many cartons go to FBA (must be divisible by 5)
- Exact unit count for FBA vs 3PL (may not be exactly 4,000/4,000)

---

**USER:**
We don't know that)

**ASSISTANT:**
Then here's the formula — plug it in when you find out:

**Formula:**
```
FBA cartons = floor(4,000 ÷ M) → round down to nearest multiple of 5
FBA units   = FBA cartons × M
3PL units   = 8,000 − FBA units
```

**Examples for most common carton sizes:**

| Units/carton (M) | FBA cartons | FBA units | 3PL units |
|---|---|---|---|
| 4 | 1,000 ÷ 5 = 200 ✓ | 4,000 | 4,000 |
| 6 | 666 → 665 ÷ 5 = 133 ✓ | 3,990 | 4,010 |
| 8 | 500 ÷ 5 = 100 ✓ | 4,000 | 4,000 |
| 10 | 400 ÷ 5 = 80 ✓ | 4,000 | 4,000 |
| 12 | 333 → 330 ÷ 5 = 66 ✓ | 3,960 | 4,040 |
| 24 | 166 → 165 ÷ 5 = 33 ✓ | 3,960 | 4,040 |

**Conclusion:** For most carton sizes the split stays ~4,000/4,000. Minor deviation (10–40 units) — not critical, difference goes to 3PL.

**Total cost:** 8,000 × $6.20 = **$49,600**

---

**USER:**
And we urgently need to reorder. Let's calculate how much we need to buy next time, keeping sales at the same level. But. We need to plan so the next shipment is sent both by air and sea. Production = 30 days. If needed — find an expedite option (based on current stock). And we're doing a full transition to sea. So the next sea shipment must cover the time until the next sea shipment.

**ASSISTANT:**
Calculating step by step.

**Step 1: Current stock (after all air freight)**

```
4,000 (now) + 8,000 (air) = 12,000 units
12,000 ÷ 260/day = stockout day ~46
```

**Step 2: Lead times for next PO (from today)**

| Route | Production | Transit | FBA processing | Total |
|---|---|---|---|---|
| Air → 3PL | 30 | 8 | — | **38 days** |
| Air → FBA | 30 | 8 | 14 | **52 days** |
| Sea → 3PL | 30 | 36 | — | **66 days** |
| Sea → FBA | 30 | 36 | 14 | **80 days** |

**Step 3: Buffers**

- 3PL stockout day 46, air arrives day 38 → **8 days buffer ✓**
- FBA stockout day ~52, air arrives day 52 → **0 days buffer ❌**

**→ FBA needs expedited production.** With 22-day production: FBA air arrives day 44, 8-day buffer ✓

**Step 4: Quantities**

**Sea portion** (covers full cycle to next sea shipment):
```
260/day × 66 days (production + transit) = 17,160
+ safety stock 14 days = 3,640
Sea: ~20,800 units
```

**Air portion** (bridge the gap):
```
3PL air: days 46–66 = 20 days × 128/day = 2,560
FBA air: days 52–80 = 28 days × 133/day = 3,724
Air: ~6,300 units
```

**Total PO:**

| | Units | Cost |
|---|---|---|
| Air | 6,300 | $39,060 |
| Sea | 20,800 | ~$9,000 (FCL) |
| **Total** | **27,100** | **~$48,000 freight** |

**Step 5: Order TODAY**

Every day of delay = minus 1 day of FBA buffer. With current zero buffer — order and expedite request goes out today.

---

**USER:**
So we need to order 27,000 units?)

**ASSISTANT:**
Yes, but let's break down why:

**27,100 units — this isn't "safety stock", it's lead time math:**

| Part | Units | Covers |
|---|---|---|
| Air (bridge) | 6,300 | Days 46–80 while sea is in transit |
| Sea | 20,800 | 80 days of sales after arrival |
| **Total** | **27,100** | |

**Sea logic:**
```
260/day × 66 days (production + transit) = 17,160 units minimum
+ safety stock 14 days = 3,640
= 20,800 units
```

If we order less, we eat into safety stock — and with a viral product any hiccup means stockout.

---

**USER:**
Let's do 25,000?)

**ASSISTANT:**
OK. Let's see what changes:

**25,000 units — new split:**

| | 27,100 (original) | 25,000 (new) |
|---|---|---|
| Air | 6,300 | 6,300 |
| Sea | 20,800 | **18,700** |

**What we lose:**
```
18,700 ÷ 260/day = 71.9 days coverage
Next sea shipment: 66 days lead time
Safety stock buffer: 71.9 - 66 = ~6 days
```

Was 14 days buffer → now **6 days.**

**Risk:** Any production or transit delay beyond 6 days — back in stockout.

Given we just survived a stockout on a viral product — 6-day buffer is very thin.

Difference between 25,000 and 27,100 = **2,100 units × $18 = $37,800** in product costs.

Worth keeping 27,100 for $37,800 and 8 extra days of buffer. But the decision is yours.

---

**USER:**
OK. 27,000.
PO at $18, how much is that?)

**ASSISTANT:**
27,000 × $18 = **$486,000**

---

**USER:**
How much cash do we have left for payment?)

**ASSISTANT:**
**Monthly budget: $120,000**

Already spent:
- Air freight (8,000 units): **$49,600**

Balance: **$70,400**

---

Needed for next PO:
- Product 27,000 × $18 = **$486,000**
- Air freight 6,300 × $6.20 = **$39,060**
- Sea freight ≈ **$9,000**
- **Total: ~$534,000**

**Gap: $534,000 − $70,400 = ~$463,600**

This is no longer a logistics question — it's a **cash flow / financing question.** Options:
- Credit line / invoice financing
- Customer prepayments (if B2B exists)
- Negotiate supplier deferred payment (Net 30/60)
- Split PO into two smaller ones to spread cash

---

**USER:**
We'll go a different route: we'll negotiate with the carrier on different terms for those 8,000 units we need to ship. We pay them $19,600 now and $30,000 a month after shipment. This frees up $30,000 for a month. And we'll find ways to lower logistics cost to at least $5.50/unit — save even more that way.

So we have $90,000 available.

And we need product for $486,000. Standard China payment terms = 30/70. If the factory is asking for a 15% deposit increase, that means 30+15%=35% of $486k.

Calculate how many units we can buy?

**ASSISTANT:**
Calculating:

**Deposit = 35% of order value**

```
$90,000 = 35% × (units × $18)
$90,000 = $6.30 × units
units = $90,000 ÷ $6.30 = 14,285 units
```

**We can buy: ~14,285 units**

| | Amount |
|---|---|
| Order (14,285 × $18) | $257,130 |
| Deposit 35% | **$90,000** |
| Balance 65% (later) | $167,130 |

**vs Need: 27,000 units**

Gap: 27,000 − 14,285 = **12,715 units short**

This covers only **53% of needs.** Not enough for a full cycle — need additional financing or split the order into two POs with different dates.

---

**USER:**
Split into 2 POs — one for 14,000 units and one for 13,000.

Here we go to the supplier and say: hey, we were ordering 8,000 units, and now we're tripling the order. Getting a better price is 100% necessary.

We need to talk with the supplier about how his production costs change (raw material + line setup etc.) with this volume increase we're making, and how to structure our order cycle to get a better price.

Given we're growing, I'd target for the first negotiations a price of $15.80-$16.50 per unit.

And here the negotiation strategy depends on the factory's response. They offer a better price — we agree to the increased deposit. Or we start the negotiation from ordering 15,000 and push up to 27,000 in exchange for price reduction + deposit concession.

And yes, we probably won't be able to lock in all 27,000 for $90,000. But we need exactly those to be super profitable.

And here. If we reduce product cost to $16.50. And switch to sea freight at $1.13 per unit — calculate what margin we get.

And only after squeezing everything out of the supplier first, would I go to the stakeholders and say that due to viral sales we need to add money to purchasing.

Also, calculate how much we'll earn on this product alone next month.

**ASSISTANT:**
**New margin: $16.50 product + $1.13 sea**

| Item | Amount |
|---|---|
| Selling price | $79.00 |
| − Product | $16.50 |
| − Sea freight | $1.13 |
| − Fulfillment + fees | $21.00 |
| − Ads (18%) | $14.22 |
| **Contribution profit** | **$26.15** |
| **Margin** | **33.1%** |

For comparison — at $15.80: **$26.85 / 34.0%**. To hit 35% target, product cost needs to be ~$15.00.

**Earnings next month (on this SKU):**

```
260/day × 30 days = 7,800 units
7,800 × $26.15 = $203,970
```

**~$204,000 contribution profit per month.**

**Summary of negotiation targets:**

| Product cost | Margin | Monthly profit |
|---|---|---|
| $18.00 (current) | 32.6% | $201,000 |
| $16.50 (target 1) | 33.1% | $204,000 |
| $15.80 (target 2) | 34.0% | $209,000 |
| $15.00 (35% target) | 35.0% | $215,000 |

Difference between $18 and $15 = **$14,000/month** or **$168,000/year** on one SKU. That's the argument for the stakeholders.

---

**USER:**
Now let's calculate exactly the freight costs for shipping the 27,000-unit batch to stock.
One third by air, rest by sea.
Air — $6 per unit.
Sea — $1.10.

Also account for the $30,000 debt from the urgent air freight.
And tell me how much cash we have left from what's been earned on this product ($203,970).

**ASSISTANT:**
**Freight for 27,000 units (1/3 air, 2/3 sea):**

| | Units | Rate | Cost |
|---|---|---|---|
| Air (1/3) | 9,000 | $6.00 | $54,000 |
| Sea (2/3) | 18,000 | $1.10 | $19,800 |
| **Freight total** | | | **$73,800** |

**Cash flow from monthly profit:**

| | |
|---|---|
| Contribution profit (month) | $203,970 |
| − Freight for 27k PO | −$73,800 |
| − Urgent air debt | −$30,000 |
| **Remaining** | **$100,170** |

From $100,170 we still need to cover the 27,000 unit deposit ($90,000).

```
$100,170 − $90,000 = $10,170 free cash
```

Very tight — but the math works out. Everything closes from one month of viral SKU sales.

---

**USER:**
You calculated wrong.
We have $120k and will have $204k.
We pay $39k (current freight, split in 2 payments). We need to buy for $486,000. (Also calculate the amount change for every $0.50 discount from $18.)
Don't factor in freight for the 27,000 yet, maybe we'll negotiate good terms with the carrier.

**ASSISTANT:**
**Total cash:**

```
$120,000 (now) + $204,000 (month) − $39,000 (freight) = $285,000
```

**Order amount change for 27,000 units per $0.50 discount:**

| Price | Order total | Deposit 35% | Cash balance |
|---|---|---|---|
| $18.00 | $486,000 | $170,100 | $114,900 |
| $17.50 | $472,500 | $165,375 | $119,625 |
| $17.00 | $459,000 | $160,650 | $124,350 |
| $16.50 | $445,500 | $155,925 | $129,075 |
| $16.00 | $432,000 | $151,200 | $133,800 |
| $15.50 | $418,500 | $146,475 | $138,525 |
| $15.00 | $405,000 | $141,750 | $143,250 |

**Every $0.50 discount = −$13,500 order total = −$4,725 deposit**

**Conclusion:** At any price from $18 to $15 — deposit is covered from $285,000. Even at $18 there's **$114,900 remaining** after the deposit — for operational costs and future payments.

---

**USER:**
No, deposit isn't covered.
Because these $204,000 we'll receive 50% in 14 days and 50% in those 14 more days...

**ASSISTANT:**
Correct. Cash arrives gradually:

**Cash flow timeline:**

| Day | Inflow | Cash available |
|---|---|---|
| Now | $120,000 − $19,500 (1st freight payment) | **$100,500** |
| Day 14 | +$102,000 (50% of sales) | **$202,500** |
| Day 28 | +$102,000 (another 50%) | **$304,500** |
| Day 30 | −$19,500 (2nd freight payment) | **$285,000** |

**Deposit 35% at $18 = $170,100 — not available right now.**

So the 2 PO strategy:

| | PO1 | PO2 |
|---|---|---|
| When to order | Today | Day 14 |
| Units | ~14,000 | ~13,000 |
| Deposit (35% × $18) | $88,200 | $81,900 |
| Cash available then | $100,500 ✓ | $202,500 ✓ |

Plus — 2 POs give leverage in negotiations: start with 14,000, then 13,000 "if the price works."

---

**USER:**
Day 30 −$19,500 (2nd freight payment) $285,000 — is our 2nd freight payment definitely $19,500? Not $30k?

**ASSISTANT:**
You're right, sorry. The second payment is $30,000 as agreed.

**Corrected cash flow:**

| Day | Movement | Cash available |
|---|---|---|
| Now | $120,000 − $19,600 (1st freight) | **$100,400** |
| Day 14 | +$102,000 | **$202,400** |
| Day 28 | +$102,000 | **$304,400** |
| Day 30 | −$30,000 (2nd freight) | **$274,400** |

**PO strategy unchanged:**

| | PO1 | PO2 |
|---|---|---|
| When | Today | Day 14 |
| Units | ~14,000 | ~13,000 |
| Deposit 35% | $88,200 | $81,900 |
| Cash at that point | $100,400 ✓ | $202,400 ✓ |

---

**USER:**
But. We'll need to pay the balance in a month?)
How much more will we need?
And calculate freight separately.
Even if we pay 50% upfront and 50% later, we still need to account for it.

**ASSISTANT:**
**Product 27,000 units @ $18:**

| | Amount |
|---|---|
| Total | $486,000 |
| Deposit 35% (already accounted for) | $170,100 |
| **Balance 65% — deferred payment** | **$315,900** |

PO1 (14,000 units): $163,800 — at shipment ~day 30
PO2 (13,000 units): $152,100 — at shipment ~day 44

---

**Freight for 27,000 units (1/3 air / 2/3 sea):**

| | Units | Rate | Total | 50% now | 50% later |
|---|---|---|---|---|---|
| Air | 9,000 | $6.00 | $54,000 | $27,000 | $27,000 |
| Sea | 18,000 | $1.10 | $19,800 | $9,900 | $9,900 |
| **Total** | | | **$73,800** | **$36,900** | **$36,900** |

---

**Full obligations schedule:**

| Payment | Amount | When |
|---|---|---|
| Deposit PO1 | $88,200 | Day 0 |
| Deposit PO2 | $81,900 | Day 14 |
| Freight 50% | $36,900 | Day ~30 |
| Urgent air 2nd payment | $30,000 | Day ~30 |
| PO1 balance (65%) | $163,800 | Day ~30 |
| PO2 balance (65%) | $152,100 | Day ~44 |
| Freight 50% remainder | $36,900 | Day ~66 |

**Day ~30 — critical: $230,700 due simultaneously.**

---

*— End of transcript —*

---

## Summary of Key Decisions Made

### Immediate Actions
1. **Send all 8,000 units by air** at $49,600 ($6.20/unit). Split 4,000 FBA / 4,000 3PL with master carton divisible by 5 constraint.
2. **Negotiate carrier terms**: pay $19,600 now + $30,000 deferred 30 days after shipment.
3. **Place 2 POs simultaneously**: PO1 = 14,000 units today, PO2 = 13,000 units on day 14.
4. **Open supplier price negotiations** immediately, targeting $15.80–$16.50/unit leverage: tripling order volume from 8,000 → 27,000 units.

### Key Numbers
| Metric | Value |
|---|---|
| FBA stockout (no air) | Day 12–13 |
| 3PL stockout (Shopify+FBM only) | Day 29 |
| Current margin | 32.6% (below 35% target) |
| Margin at $16.50 + sea $1.13 | 33.1% |
| Margin at $15.00 + sea $1.13 | 35.0% |
| Monthly contribution profit | $203,970 |
| Next PO total quantity | 27,000 units |
| Next PO product cost | $486,000 |
| Next PO freight (1/3 air, 2/3 sea) | $73,800 |
| Critical day ~30 obligations | $230,700 |
| Available at day 30 | ~$274,400 |
| **Day 30 gap (survivable?)** | **$274,400 > $230,700 ✓** |

### Supplier Negotiation Strategy
- **Anchor**: "We're tripling our order — let's talk about volume pricing."
- **Target price**: $15.80–$16.50 (open), $15.00 (stretch)
- **Concession logic**: Better price → we accept higher deposit. Hold at $15 → we agree to 35% deposit.
- **Sequence**: Extract best price first. Then take the funding gap to stakeholders with a month of viral sales data as proof.

---

## Formal Answers

---

### Part 1 — Inventory & Demand Planning

#### Question 1. Days until stockout / Is sea freight sufficient?

**Days until stockout**

All channels grow 30% from day 1: FBA 145 → 188.5/day, Shopify 55 → 71.5/day, total 260/day.

FBA channel (2,400 units, serving all Amazon demand):

```
2,400 ÷ (145 × 1.3) = 2,400 ÷ 188.5 = 12.7 days → FBA out day 13
```

3PL channel — two phases:

Phase 1 (Days 1–13): 3PL covers Shopify only. FBA is alive and handles all Amazon.

```
71.5/day × 13 = 930 units consumed
Balance at day 13: 1,600 − 930 = 670 units
```

Phase 2 (Day 13+): FBA empty → all Amazon demand (188.5/day) flips to FBM on 3PL.

```
3PL covers: Shopify (71.5) + Amazon FBM (188.5) = 260/day
670 ÷ 260 = 2.6 days → 3PL out day ~16
```

**Overall: FBA out day 13, full stockout day ~16.**

---

**Is sea freight alone sufficient?**

No. Here's why:

| Channel | Stockout | Sea arrives on stock | Gap |
|---|---|---|---|
| FBA | Day 13 | Day 50 (36 transit + 14 FBA processing) | **37 days** |
| 3PL | Day 16 | Day 36 (transit only) | **20 days** |

Sea freight alone leaves FBA empty for **37 days** — a viral SKU losing Buy Box for over a month. Not acceptable.

---

#### Question 2. Air, sea, or hybrid strategy?

**Strategy: All 8,000 units by air. Split 4,000 → FBA / 4,000 → 3PL.**

> **Cash constraint:** $120,000 available for inventory and freight this month. Air cost: 8,000 × $6.20 = **$49,600**. Remaining budget: **$70,400**. A larger air volume is not financially viable.

> **Key assumption:** Shipment A (8,000 units) is sent entirely by air — no concurrent sea shipment arrives at day 36. The next production order must be placed immediately. If production takes 3 weeks + air transit, the next batch arrives 3PL day 29 and FBA day 43 — before stockout. If production takes 4+ weeks, another bridging decision is needed.

---

**Why 50/50 — a budget-constrained decision**

The mathematically optimal split for matching each channel precisely to its replenishment point is 3,250 → 3PL / 4,750 → FBA. That split leaves both channels with near-zero buffer.

The budget made the decision: $120,000 available, $49,600 committed to air freight, $70,400 remaining. A different split offers no cash advantage — air cost is the same regardless of allocation. What 50/50 buys is operational simplicity: both channels run out at day 46–47, one unified deadline for the next order instead of two separate ones to track under financial pressure.

---

**3PL stockout model (4,000 units arrive day 8)**

| Period | Days | Rate | Consumed | Balance |
|---|---|---|---|---|
| Start | — | — | — | **1,600** |
| Days 0–8 (Shopify only, pre-air) | 8 | 71.5/day | 572 | **1,028** |
| Air arrives day 8 | — | — | +4,000 | **5,028** |
| Days 8–13 (FBA still alive) | 5 | 71.5/day | 358 | **4,670** |
| Days 13–25 (FBA empty → all Amazon on 3PL) | 12 | 260/day | 3,120 | **1,550** |
| Days 25–47 (FBA restocked, 3PL → Shopify only) | 21.7 | 71.5/day | 1,550 | **0** |

**3PL OUT: day ~47**

---

**FBA stockout model (4,000 units arrive day 25)**

| Period | Days | Rate | Consumed | Balance |
|---|---|---|---|---|
| Start | — | — | — | **2,400** |
| Days 0–13 | 12.7 | 188.5/day | 2,400 | **0** |
| ❌ FBA OUT day 13 — gap begins | — | — | — | 0 |
| Days 13–25 (12 days empty, absorbed by 3PL via FBM) | 12 | — | — | 0 |
| Air arrives day 25 | — | — | +4,000 | **4,000** |
| Days 25–46 | 21.2 | 188.5/day | 4,000 | **0** |

**FBA OUT: day ~46**

---

**Combined stockout timeline**

```
Day 13:  FBA first stockout (unavoidable — air to FBA takes 25 days total)
Day 13:  3PL absorbs all Amazon demand at 260/day
Day 25:  FBA restocked — Buy Box restored
Day 25:  3PL drops back to Shopify only (71.5/day)
Day 46:  FBA second stockout ← hard deadline for next batch at FBA
Day 47:  3PL stockout ← hard deadline for next batch at 3PL
```

The 50/50 split produces a symmetrical result: both channels empty at day 46–47.

---

**When next order must arrive**

| Production | Route | 3PL arrives | FBA arrives | Result |
|---|---|---|---|---|
| 3 weeks | Air | Day 29 | Day 43 | ✓ both covered |
| 4 weeks | Air | Day 36 | Day 50 | ✓ 3PL / ❌ FBA gap 4 days |
| 4 weeks | Sea | Day 66 | Day 80 | ❌ both stockout |

**The strategic conclusion: place the sea PO today.**

The 8,000 air units buy 46–47 days. Without a sea order placed now — 30 days production + 36 days transit = day 66 on 3PL shelves — the next stockout arrives on schedule. This is not a planning decision for next week. It is a day-1 action that determines whether air freight was a bridge or a loop.

---

**Financial tradeoff**

| Metric | Before air freight | After air freight |
|---|---|---|
| Contribution profit/unit | $25.78 | $19.58 |
| Margin | 32.6% | 24.8% |
| Monthly contribution (7,800 units) | $201,000 | $152,700 |

Air freight costs $49,600 and compresses margin by ~7.8 p.p. for this batch.

The correct comparison is not air cost vs the unavoidable 12-day FBA gap — it is air cost vs the full stockout scenario:

```
No air → FBA empty day 13, 3PL empty day 16
Days 16–36: both channels dry → $0 revenue for ~20 days
Lost contribution: 260/day × $25.78 × 20 days = ~$134,000
+ 37-day Buy Box loss + ranking damage on a viral SKU
```

$49,600 spent on air freight prevents ~$134,000 in direct contribution loss — before accounting for ranking and velocity recovery that can take months on a viral product.

---

### Part 2 — Financial & Operational Analysis

#### Question 3. Contribution profit per unit before / after air freight

| Item | Before air | After air |
|---|---|---|
| Selling price | $79.00 | $79.00 |
| − Product cost | $18.00 | $18.00 |
| − Fulfillment + fees | $21.00 | $21.00 |
| − Ad spend (18% × $79) | $14.22 | $14.22 |
| − Air freight (per unit) | — | $6.20 |
| **Contribution profit** | **$25.78** | **$19.58** |
| **Margin** | **32.6%** | **24.8%** |

Note: The company is **already below its 35% margin target before any additional logistics costs.** Air freight compresses margin by a further 7.8 p.p. This signals that COGS negotiation with the supplier is not optional — it is necessary to reach the target margin even on the standard sea freight cycle.

---

#### Question 4. Supplier deposit increase — negotiation approach

**Immediate response**

Don't say yes or no. Acknowledge the request and ask for time to review: *"We understand material costs are under pressure — before we respond, we need to understand the specifics. Can you share a cost breakdown?"*

This buys time and reframes the conversation from "will you pay more" to "show me the data."

---

**Data and questions to request**

- Full landed cost breakdown: raw materials, labor, overhead, margin
- Which specific materials increased and by how much (documentation)
- When the increase took effect and whether it applies to existing open POs
- Whether the increase is permanent or tied to a specific commodity cycle
- What their current capacity utilization looks like

Without this data, the 15% claim is unverifiable. In practice, most suppliers cite material costs as a blanket reason — the actual increase is often 4–8%, not 15%.

---

**Leverage points and compromise**

**Volume tripling is the primary lever.** We were ordering 8,000 units. We are now placing 27,000. Their unit economics — line setup, material buying power, production efficiency — all improve at this volume. A 3× order increase and a deposit increase is not a fair trade.

Negotiation sequence:

| Move | Logic |
|---|---|
| Start from 15,000 units, push to 27,000 in exchange for price reduction | Anchor low, let them earn the volume |
| Target price: $16.50 (opens at $15.80, max concession $17.00) | Every $0.50 = $13,500 on a 27,000-unit order |
| Offer: accept deposit increase to 35% in exchange for price at $16.50 or below | They get better cash flow, we get better margin |
| If they hold on price: split into 2 POs — 14,000 now, 13,000 conditional on hitting price target | Gives them certainty on PO1, pressure on PO2 |
| Last resort: mention backup supplier qualification is in progress | Never bluff — only use if true or in progress |

The sequence matters: extract the best possible price first. Only after that go to stakeholders to request additional capital. Walking into that conversation with a lower COGS makes the ask significantly easier.

**What not to do:** Don't reveal cash constraints. Don't agree to 45% deposit without a concession on price. Don't negotiate via email for the first round — a phone call changes the dynamic.

---

### Part 3 — Leadership & Prioritization

#### Question 5. Priority ranking

**PHASE 0 — Before ranking anything: diagnose ticket root cause**

Pull CS data: 15–30 minutes. One question — are tickets about delays or product quality? The answer determines everything below.

---

**Scenario A: Tickets = delays**

1. **Inventory stockout risk** — Revenue-critical, immediate. FBA — 13 days. Air freight decision goes out today.

2. **3PL mis-picks (3.5%)** — Operational problem generating delays and feeding tickets. 3.5% = 9 wrong orders per day at 260 units/day. Audit 3PL immediately.

3. **Rising customer support tickets** — Symptom, not cause. Temporary fix: response templates, proactive buyer communication. Resolves when #1 and #2 are addressed.

4. **Supplier deposit increase** — Negotiation task. Strategy already exists: 2 POs, volume leverage.

5. **Amazon storage fees** — Optimization. At 260 units/day turnover is fast — losses minimal. Address after stabilization.

---

**Scenario B: Tickets = quality**

1. **Rising customer support tickets** — Stop everything. Understand defect scope, how many units are in the field, whether Amazon suspension is a risk. Air freight decision is frozen until QC is complete.

2. **Inventory stockout risk** — Still critical but now conditional. Sending 8,000 units by air for $49,600 without knowing the product is safe is not possible. QC current stock first.

3. **3PL mis-picks (3.5%)** — Becomes even more important: mis-picks mask the real scale of the quality problem. Can't understand how many defective units reached customers if 9 orders per day are already going wrong.

4. **Supplier deposit increase** — Conversation changes significantly: price reduction is now paired with demand for QC accountability — AQL inspection, pre-shipment check, compensation discussion.

5. **Amazon storage fees** — Unchanged. Lowest priority in both scenarios.

**Key point:** The correct answer here is not just a list. It's demonstrating that an executive first asks the right question, then prioritizes. The right question is: *"What are those tickets actually about?"*

---

#### Question 6. KPIs for the executive meeting (15 minutes)

| # | Metric | Why |
|---|---|---|
| 1 | **Days of stock by channel** (FBA / 3PL) | Urgency — "13 days until FBA stockout" lands harder than "in-stock rate 94%" |
| 2 | **In-stock rate on best sellers** | Situation — leadership cares about where the money is, not aggregate inventory |
| 3 | **Contribution margin vs target** | Financial health — 32.6% actual vs 35% target opens the supplier negotiation conversation |
| 4 | **Cash available vs PO requirement** | The ask — $120k now, $486k needed, here is the timeline |
| 5 | **Revenue at risk (stockout scenario)** | Decision justification — $204k/month at stake makes the $49,600 air freight decision obvious |
| 6 | **Deviation from procurement plan** | Accountability — shows there is a plan and you know exactly where you deviated from it |

---

### Part 4 — Systems & Scale

#### Question 7. 90-day operational improvements

**Days 1–30**

- **Place sea PO for next batch today** — not a planning task. 30 days production + 36 days transit = day 66 on 3PL shelves. Every day of delay is a day closer to the day-47 stockout wall
- Reorder triggers per channel with full lead time math baked in: FBA = 55 days (30 production + 8 air/36 sea + 14 FBA processing), 3PL = 57–67 days depending on coast (30 production + 27–37 days inbound)
- Daily budget reconciliation — catches deviations before they become crises
- 3PL SLA scorecard: order accuracy, mis-pick rate, receiving time reported weekly. If you don't measure it, you don't manage it
- CS ticket categorization: separate "product quality" tag with automatic SC escalation — so Phase 0 from the prioritization framework is always active, not reactive

**Days 30–60**

- Bottom-up sales forecast by channel: FBA, FBM, and D2C separately, each with warehouse-level budget and FBA→FBM substitution rules. Aggregated forecasts hide problems
- Reverse Gantt for top SKUs: plan backwards from required on-stock date → transit → forwarder warehouse → production complete → PO placed. Most SC managers think "when to ship"; the right question is "when must it be on shelf, count backwards"
- Contribution margin tracker by SKU with weekly review — this crisis showed 32.6% vs 35% target was invisible until it mattered

**Days 60–90**

- Forwarder buffer warehouse in China for top SKUs: decouples production lead time from replenishment cycle. When a viral event happens, you replenish from the forwarder in days, not months
- Backup supplier qualification for top 3 SKUs: single-source dependency on a top SKU means the supplier owns your negotiation. This crisis demonstrated it
- Rolling 90-day cash flow forecast tied to PO schedule: updated weekly, shows funding gaps before they are emergencies rather than during them

---

### Question 8 — Beyond the Framework: How I Actually Think Through a Crisis Like This

*This section captures the reasoning and decisions that don't fit neatly into a structured answer — but reflect how I approach operational problems under real constraints.*

---

**The first thing I did was restructure the cash, not the shipment**

When I saw that air freight would cost $49,600 and the monthly budget was $120,000, my instinct wasn't to reduce the shipment size. Cutting units to save cash means a larger stockout — you solve a financial problem by creating an operational one. That's the wrong trade.

Instead, I went to the carrier. The proposal: $19,600 now, $30,000 in 30 days after shipment. This freed up $30,000 for a full month — exactly the window before the second tranche of monthly sales revenue arrived. At the same time, I targeted a rate reduction from $6.20 to $5.50 per unit. On 8,000 units that's $5,600 back, and it establishes a new benchmark for all future air negotiations.

Neither move is dramatic on its own. Together, they turned a cash flow constraint into a manageable timeline. That's usually how it works in supply chain — not one big decision, but several small ones that compound.

---

**The 50/50 split was a budget decision, not just a logistics one**

The math pointed toward a different split — roughly 3,250 to 3PL and 4,750 to FBA to perfectly match each channel's demand until replenishment. But I chose 50/50.

The reason: with a $70,400 remaining budget after air freight, I needed simplicity and symmetry. Both channels run out around day 46–47 with a 50/50 split, which means one clear deadline for the next order instead of two different ones to manage. Under financial pressure, operational simplicity has real value.

The 12-day FBA gap (days 13–25) is unavoidable regardless of split — air freight to FBA takes 25 days and FBA stocks out at day 13. That gap can't be closed with a smarter allocation. What I can control is making sure 3PL absorbs all Amazon demand during those 12 days without running dry, which 4,000 units comfortably covers.

---

**The transition to sea was planned from day one of the air decision**

Sending 8,000 units by air was the right call for this moment. But I knew immediately it couldn't be the business model. At $6.20/unit air vs $1.10/unit sea, a 27,000-unit batch costs $167,400 vs $29,700 — a $137,700 difference on a single PO. On a margin already sitting at 32.6% against a 35% target, that's not a logistics cost. It's a structural P&L problem.

The plan for the next order: 1/3 by air (9,000 units) to bridge the remaining gap, 2/3 by sea (18,000 units) to restart the normal replenishment cycle. The order after that — 100% sea. Air freight becomes what it should be: an emergency tool with a defined cost envelope, not a default mode of operation.

The full sea unit economics at a negotiated cost of $16.50 and sea freight of $1.10:

```
$79.00 − $16.50 − $1.10 − $21.00 − $14.22 = $26.18 contribution / 33.1% margin
```

Still below 35% target. Which means the real work is on COGS, not freight.

---

**The supplier negotiation was the highest-leverage action in the entire case**

I was ordering 8,000 units. I am now placing 27,000. That is a 3× volume increase — the kind that changes a supplier's production economics in ways that are very visible to them: longer runs, fewer changeovers, better raw material buying power, higher capacity utilization.

My target: $15.80–$16.50 per unit. Stretch target: $15.00 — the number that gets us to exactly 35% margin on sea freight. Every $0.50 reduction on a 27,000-unit order is $13,500 off the total and $4,725 off the deposit. The math is simple and the leverage is real.

The sequence mattered as much as the number. I split the order into two POs timed to cash flow — PO1 of 14,000 today when I have $100,400 available, PO2 of 13,000 on day 14 when another $102,000 of sales revenue hits. This gives the supplier visibility on a large committed order while giving me optionality: PO2 is conditional on hitting the price target.

I would extract every possible COGS reduction before going to stakeholders for additional capital. Walking into that conversation with a viral SKU generating $204,000/month in contribution, a negotiated COGS improvement of $2–3/unit, and a clear path to 35% margin is a fundamentally different ask than "we ran out of stock and need $400k."

The difference between $18.00 and $15.00 per unit is $168,000 per year on this one SKU alone. That is the argument for leadership, and it has nothing to do with the crisis. The crisis just made it visible.

---

**The crisis exposed a structural problem that existed before it**

The hardest part of working through this case was recognizing that 32.6% margin against a 35% target was not created by the stockout. It was already there, sitting below the surface in aggregated reporting, invisible until the moment it mattered most.

A supply chain that functions correctly shouldn't make a viral sales event into a cash flow emergency. It should make it into a revenue opportunity. This one didn't — because reorder points weren't built with real lead times, because FBA processing time wasn't factored into inventory calculations, because there was no buffer warehouse in China, and because a single SKU driving significant revenue was sourced from a single supplier with no backup qualification.

The 90-day plan closes all of those gaps. But the reason it matters is not process improvement for its own sake — it's that the next viral event should look completely different from the inside.
