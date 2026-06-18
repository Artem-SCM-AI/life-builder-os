# NeonPanel — Requirements & Fit Assessment

**From:** Artem Stepanenko, Supply Chain Manager @ Accommerce GmbH
**Re:** Evaluating NeonPanel for Jello brand SC operations

---

## Business Context

We are the supply chain team behind Jello, a consumer brand selling on Shopify in the DACH market (Germany, Austria, Switzerland) with ~€1.3M net revenue/month. We are actively scaling: our primary SKU demand is expected to grow 4.5× by Q4 2026, which means our supply chain needs to get serious now.

We have three SKUs: a hero product (Jello) running at ~1,944 units/day, and two accessories (Mixer, Straws) at lower volumes.

I joined as SC Manager in June 2026. My immediate task: build visibility and control over procurement before the scale-up. We are starting from scratch — no SC ops system in place, currently managing everything manually.

---

## Supply Chain Model

```
China factories
     │
     ▼  Production: ~42 days + QC inspection + lab + certification
     │  + ETD buffer: ~7 days
     ▼
  [Forwarder — single DDP price covers all of the below]
     │  Port of origin → export customs → freight (Train ~25d / Sea ~35d)
     │  → import customs DE → delivery to warehouse
     ▼
  3PL Warehouse (Germany — Fly Fulfillment)
     │  Inbound fee per unit
     ▼
  Stock (FIFO per batch — each batch has its own unit cost)
     │
     ▼  Shopify order → bundle picked & shipped
  Customer
```

**Order pattern:** large batches (container-level), placed per SKU independently. Multiple shipments may be in-flight simultaneously at different stages (In Production / In Transit / Arrived).

**Total replenishment lead time:** 74–84 days depending on shipping mode.

**Reorder logic:** trigger when stock covers < 21 days at current sales velocity.

### Two-Layer COGS Model

**Layer 1 — Landed cost per SKU/unit (per batch, FIFO):**
- EXW unit cost (manufacturer)
- QC inspection + lab + certification (per batch)
- Forwarder DDP: one invoice covering factory pickup → export customs → freight → import customs → warehouse delivery
- 3PL inbound fee (per unit)

Each incoming batch has its own landed cost/unit. Units from different batches carry different costs. Batches are consumed FIFO.

**Layer 2 — Bundle COGS at point of sale:**
We sell predominantly in bundles (17+ Shopify product variants — e.g. "4x Jello + 1x Handmixer + 1x Gratis Geschenk"). Each order's COGS = sum of FIFO costs for each SKU in the bundle + bundle-specific fulfillment:
- Pick fee (per unit in bundle)
- Pack fee (per bundle type)
- Ship fee (per bundle type — varies by weight/dimensions)

Bundle fulfillment costs vary significantly across the 17+ bundle types and cannot be averaged.

---

## Required Capabilities

| Capability | Why We Need It | NeonPanel Feature |
|---|---|---|
| Real-time stock visibility | Know exactly what's on shelf at 3PL | Inventory sync via Shopify + 3PL |
| In-transit shipment tracking | Multiple batches per SKU in-flight | Inbound shipment monitoring |
| Reorder point alerts | 74–84 day lead time requires early signal | Forecasting + reorder calc |
| FIFO batch-level landed cost | Each batch has different unit cost | Batch-level COGS + FIFO |
| Bundle COGS at sale | 17+ bundle types with different fulfillment costs | **To confirm** |
| Multi-SKU FIFO per bundle | Bundle contains multiple SKUs, each from own FIFO batch | **To confirm** |
| Per-bundle fulfillment cost | Pick/pack/ship varies per bundle type | **To confirm** |
| 52-week rolling forecast | Planning scale-up 3–6 months out | Forecasting module |
| Marketing-input forecast | Demand driven by planned campaigns, not just history | **To confirm** |
| Cash flow planning | Procurement outflows mapped to PO payment schedule | **To confirm** |
| Multi-mode shipping lead times | Train vs Sea with different transit times | Configurable lead time per PO |

---

## Questions for the NeonPanel Team

**1. 3PL Integration Depth**
We use Fly Fulfillment (Germany) as our 3PL. Does NeonPanel have a direct integration with them, or would it require manual stock entry? Specifically: does NeonPanel receive inbound receipts automatically when a shipment arrives at the 3PL?

**2. Landed Cost Components**
Our landed cost per batch has these layers: manufacturer EXW cost + QC/lab/certification + a single DDP invoice from our forwarder (covering factory pickup → export customs → freight → import customs → warehouse delivery) + 3PL inbound fee. Can NeonPanel accept a single forwarder invoice and allocate it per unit across the batch? Does it support custom cost component labels, or is it fixed to a standard set?

**3. Concurrent Shipment Pipeline**
At any given time we may have 3–5 shipments per SKU at different stages (In Production / In Transit / Arrived). Can NeonPanel handle this level of granularity — individual shipments with distinct ETAs and status tracking?

**4. Forecast Horizon**
Our replenishment lead time is 74–84 days, and we're planning through Q4. Can the forecasting module be configured for a 52-week rolling horizon (not just 90 days)?

**5. Shipping Mode Lead Times**
We use two modes per supplier: Train (~25 days) and Sea (~35 days). Can we define per-PO shipping mode, and will ETA auto-calculate based on the mode selected?

**6. Reorder Point Configuration**
Our reorder trigger: stock ÷ daily sales rate < 21 days of cover. Can this threshold be configured per SKU, and does NeonPanel surface a clear "reorder now" signal in the dashboard?

**7. Pricing & Trial**
Can we access a trial of the Professional plan + Forecasting add-on to validate the fit before committing? What is the current pricing for both?

**11. Marketing-Planned Forecast**
Our demand is actively shaped by marketing campaigns, not just historical trends. When the marketing team plans a campaign for a specific week or period (expected +X% volume), can we input that as a manual demand override in the forecast? We need the ability to plan procurement based on forward-looking marketing plans — not a rear-view mirror extrapolation. Does NeonPanel support manual demand adjustments per week/period on top of the algorithmic forecast?

**12. Cash Flow Planning from PO Schedule**
When I place a purchase order, it triggers a payment schedule: a deposit at the time of order, a second payment at production completion, and a final installment at delivery. Freight is paid separately at arrival. Can NeonPanel generate a forward-looking cash outflow timeline based on planned POs — showing when each payment is due and what the total committed cash is at any given point? This is the SC Manager's primary input into the company's cash flow planning.

---

### Bundle COGS — The Critical Questions

These three are the make-or-break capability for our use case. We sell ~90% of revenue in multi-SKU bundles, and COGS accuracy at bundle level directly drives margin visibility.

**8. Bundle-level COGS tracking**
Can NeonPanel calculate and report COGS at the Shopify product variant (bundle) level — not just at the raw SKU level? We have 17+ bundle configurations. The tool needs to know that "4x Jello + 1x Handmixer" is a different product with a different total cost than "2x Jello".

**9. Multi-SKU FIFO across bundle components**
When an order contains 4x Jello + 1x Handmixer, does NeonPanel pull the current FIFO cost for each SKU independently and sum them into a correct bundle COGS? Or does it work on a pre-averaged unit cost that ignores which batch each SKU came from?

**10. Per-bundle fulfillment cost configuration**
Can fulfillment costs (pick per unit, pack per bundle, shipping per bundle) be configured separately per bundle type? Our shipping cost varies significantly across bundles because weight and dimensions differ. A flat per-unit fulfillment rate would materially distort our margin reporting.

---

## What We're Looking For

A 30-minute call or trial access to validate these 12 points. The critical ones: Q8–10 (bundle COGS) and Q11–12 (marketing forecast + cash flow planning). If NeonPanel covers them, we're ready to move fast — the scale-up is happening in Q3 and we need the system in place by end of July.

---

*Artem Stepanenko — Supply Chain Manager, Accommerce GmbH*
*eco.stepanenko@gmail.com*
