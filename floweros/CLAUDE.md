# FlowerOS

## Project
B2B Telegram loyalty bot for flower shops. Artem builds as SaaS, bills commission on all orders through the system.

**Status: Plan 1 written, codebase NOT yet created. Next step = execute Plan 1.**

## Business Model (v2, 2026-06-15)
- Setup fee: $500/point (one-time)
- Shop-acquired users (shop's own QR): **1%** commission
- Platform-acquired (Artem's Threads, viral, router bot, billboard): **6% (orders 1–3) / 7% (orders 4+)**
- Holiday broadcast (Feb 14, Mar 8): **3% flat**
- All incentives (cashback, B2B cash referral) funded by shop — FlowerOS pays zero

## Pilot Shop
- Location: Dnipro
- Turnover: 600K UAH/month, avg check 1,200 UAH (~500 tx/month)
- CRM: none (Excel + notebooks) → FlowerOS is their first system of record
- Integration tier: Tier 0 (no stock reads, scan-first attribution)

## Architecture
- Multi-tenant Python service, one bot token per shop
- Config: `shops/shop_N.yaml` per shop
- DB: Airtable (1 base/shop, 8 tables: Users, Profiles, Orders, Transactions, Campaigns, ShopKnowledge, SupportChats, Shops)
- Loyalty: LMachine.io API (cashback, tiers, referrals)
- Payments: Monobank ekvayring + cash (+3% bonus) + terminal
- AI support: claude-haiku-4-5, tools: get_stock / get_cashback_balance / escalate_to_manager
- Flora24: CUT from Plan 2 (pilot shop has no CRM)

## Implementation Plans
- **Plan 1 (WRITTEN):** `docs/superpowers/plans/2026-06-10-floweros-bot.md` — Core bot, 11 tasks, ~45 tests, TDD. No external APIs. Creates the codebase from scratch.
- Plan 2 (not written): LMachine + Monobank integrations, manager photo forward
- Plan 3 (not written): Profile sharing, AI Support Agent, B2B corporate flow, seasonal campaigns

## Plan 1 Amendments (apply when executing)
- A1: points list in shop config
- A2: Order fields — point_id, format, mono_type, colors, size_band, same_day, description_text, photo_file_id
- A3: idempotent reminders
- A4: attribute-level order flow + escape hatches
- A5: flat 7% gross (now superseded by tiered v2 — use v2 in code)

## Key Files
- Spec: `docs/superpowers/specs/2026-06-10-floweros-architecture-design.md`
- Architecture diagram: `ref-floweros-architecture.html`
- Pre-launch analysis: `2026-06-12-report-floweros-prelaunch-analysis.md`
- Market density: memory `reference_floweros_market_density.md`
- Consent/contract clauses: `ref-floweros-consent-contract-clauses.md`

## Open Before Plan 2
1. Does Dnipro shop have Monobank merchant account?
2. Cash +3% cashback: confirm shop finances this (not FlowerOS)
3. B2B referral cash fee amount (TBD)
4. LMachine endpoint names/auth (hand them ledger spec §5.2 of pre-launch report)

## Blocker
- Threads keyword search frozen (requires Meta Tech Provider) → Dnipro business outreach = manual for now
