# FlowerOS — Architecture Design Spec

**Date:** 2026-06-10  
**Status:** Approved — ready for implementation planning  
**Pilot:** Dnipro, flower shop (600K UAH/month turnover, avg check 1,200 UAH)

---

## 1. Product Overview

FlowerOS is a B2B SaaS loyalty platform for flower shops. The platform operates as a Telegram bot that runs on behalf of the shop — clients see it as the shop's own loyalty program. FlowerOS owns the customer base; the shop is an execution partner.

**Core value loop:**
- Client registers → provides important dates and flower preferences
- Bot reminds client 2 days before each date, shows real-time stock
- Client confirms budget → manager selects photo → client pays → order fulfilled
- Every purchase feeds the loyalty system → client comes back more often

**Revenue model:** 7% commission on all orders processed through the loyalty system. No setup fee at current stage.

**Target economics (Dnipro pilot):**
- Shop base: ~3,000 unique customers/year (500 tx/month ÷ 2 purchases/year)
- Platform target: 50% registration = 1,500 active users
- Platform revenue: ~47,000 UAH/month from one shop
- Path to $10K/month: 9 shops × 1,500 active users

---

## 2. Architecture Decisions

### 2.1 Multi-Tenancy: One Service, Separate Bot Tokens

Each shop gets its own Telegram bot (separate token = separate name, e.g. `@flora_dnipro_bot`). All bots run from a single Python service on one server. Per-shop configuration lives in `shops/shop_N.yaml`.

**Rationale:** Custom branding per shop, single deployment for all updates, isolated data (separate Airtable base per shop). Adding a new shop = one config file.

### 2.2 Manager Interface: Telegram + Airtable Hybrid

Managers interact exclusively via Telegram (their shop's manager chat group). All actions (photo upload, cash payment confirmation, escalation response) happen in Telegram. All data syncs automatically to Airtable for analytics and owner visibility.

**Rationale:** Zero onboarding friction for shop staff. Managers already live in Telegram.

### 2.3 Flora24 Integration: Full Bidirectional

The platform reads stock availability before sending reminders (shows only available flowers) and writes pre-orders to Flora24 when a client confirms budget.

**Rationale:** This is the core SC value proposition — manager knows exactly what will sell before buying from the market.

### 2.4 Loyalty Backend: LMachine API

All loyalty logic (cashback calculation, tier management, referral tracking, redemption limits) is delegated to LMachine.io via API. The bot owns the UI; LMachine owns the math.

**Rationale:** Avoids building and maintaining complex loyalty accounting in-house.

### 2.5 Payment Methods: Three Options

- **Online (Monobank ekvayring):** Payment link sent via bot → Monobank webhook confirms → auto-recorded.
- **Cash at shop:** +3% bonus cashback (financed by acquiring fee savings) → manager confirms with one button tap.
- **Terminal at shop:** Same flow as cash, no bonus cashback.

All three methods record a transaction in LMachine and Airtable.

### 2.6 Profile Sharing: Gender-Neutral Deep Links

Any user can share any profile via a Telegram deep link. The recipient chooses a free-text label (no gender assumptions). This creates a viral acquisition loop — people share their own preferences so others remember their dates.

### 2.7 AI Support Agent: Claude Haiku

When a client taps "Ask florist" or "Support", a Claude-powered agent responds using shop-specific FAQ, client profile context, and real-time stock/balance data. The agent escalates to the human manager when uncertain.

---

## 3. System Components

### Bot Engine
- **Language:** Python 3.11+
- **Library:** python-telegram-bot 20+ (async)
- **Web framework:** FastAPI (for Telegram webhooks and Monobank webhooks)
- **Pattern:** One bot application per shop token, instantiated from shared codebase at startup
- **Conversation states:** `ONBOARDING`, `IDLE`, `REMINDER_FLOW`, `ORDER_FLOW`, `PAYMENT_FLOW`, `SUPPORT_MODE`, `PROFILE_SHARE`

### Scheduler
- **Library:** APScheduler (async)
- **Jobs:**
  - Daily at 09:00: scan Profiles for dates within 2 days → trigger reminders
  - Daily at 09:05: check seasonal campaign schedule → send broadcasts
  - On order creation: set 2-hour payment timeout
  - Annual: re-engagement scan for inactive users

### Config Manager
- One YAML file per shop: `shops/shop_001.yaml`
- Fields: `bot_token`, `airtable_base_id`, `lmachine_shop_id`, `manager_chat_id`, `shop_name`, `city`, `commission_pct`
- Loaded at service startup; all bot instances share the same config loader

### LMachine Client
API wrapper with retry logic and error handling.

| Operation | Method | When called |
|---|---|---|
| Register user | `POST /users` | On onboarding completion |
| Record purchase | `POST /transactions` | On payment confirmed (any method) |
| Record referral | `POST /referrals` | When referred user completes first purchase |
| Redeem cashback | `POST /redeem` | When client chooses to apply cashback |
| Get balance | `GET /balance` | Before sending reminder; on /card command |
| Get user stats | `GET /user/stats` | On /card command (tier, progress) |
| Get referral link | `GET /referral-link` | On /card command |

### Flora24 Client
API wrapper with 5-minute in-memory cache for stock data and retry logic.

| Operation | Method | When called |
|---|---|---|
| Check stock | `GET /stock` | Before sending reminder |
| Create pre-order | `POST /preorders` | When client confirms budget |
| Get calendar | `GET /calendar` | Seasonal campaign planning |

### Payment Handler
FastAPI route `POST /payment/confirm` receives Monobank webhook. Validates signature, updates order status in Airtable, calls LMachine to record transaction, notifies manager and client.

### Profile Share Engine
Generates Telegram deep links: `t.me/{bot_username}?start=p_{profile_id}`. When a new user opens the link, the bot fetches the profile from Airtable, displays it with flower preferences and dates (anonymized — no last name), and offers to add it with a custom label.

### AI Support Agent
- **Model:** `claude-haiku-4-5-20251001`
- **System prompt:** Florist persona + shop FAQ + policies + current seasonal flowers
- **User context injected per session:** client profile (preferences, past orders)
- **Tools:**
  - `get_stock(flower_types[])` → Flora24 API
  - `get_cashback_balance(user_id)` → LMachine API
  - `get_order_status(user_id)` → Airtable
  - `escalate_to_manager(reason, context)` → sends summary to manager chat
- **Escalation trigger:** agent confidence below threshold OR client explicitly requests human
- **Cost estimate:** ~$0.001/conversation → ~$15–30/month at 1,500 active users

---

## 4. Data Model (Airtable — one base per shop)

### Shops
`id`, `name`, `city`, `bot_token_ref`, `manager_chat_id`, `lmachine_shop_id`, `commission_pct`, `active`

### Users
`tg_id` (PK), `shop_id`, `name`, `phone`, `lmachine_user_id`, `referrer_tg_id`, `joined_at`
> Cashback balance and tier live in LMachine. `lmachine_user_id` is the foreign key.

### Profiles
`id`, `user_id`, `relation_label` (free text, user-defined), `dates[]` (array of {label, date}), `flowers[]`, `vase_height_cm`, `forbidden_flowers[]`, `preferred_colors[]`, `delivery_address`, `notify_preference` (bot/call), `is_shared` (bool), `source_user_id` (nullable — set when profile was imported via share link)

### Orders
`id`, `user_id`, `profile_id`, `status` (pending_photo / pending_payment / paid / fulfilled / cancelled), `budget`, `photo_url`, `flora24_preorder_ref`, `payment_method` (online/cash/terminal), `delivery_address`, `delivery_time`, `created_at`

### Transactions
`id`, `order_id`, `amount`, `commission_amt`, `payment_method`, `mono_invoice_id` (nullable), `lmachine_tx_id`, `cashback_awarded`, `paid_at`

### Campaigns
`id`, `shop_id`, `flower_type`, `campaign_type` (seasonal/custom), `sent_at`, `sent_count`, `opened_count`, `converted_count`

### ShopKnowledge
`id`, `shop_id`, `category`, `question`, `answer` — FAQ fed into AI agent system prompt per session

### SupportChats
`id`, `user_id`, `started_at`, `messages_json`, `escalated` (bool), `resolved_by`, `resolved_at`

---

## 5. Key Flows

### Registration
1. Client opens bot → `/start` (or deep link)
2. Onboarding survey: name, phone, important dates, flower preferences, vase size, forbidden flowers, notify preference
3. `POST /users` to LMachine (with referrer_id if applicable)
4. Create record in Airtable Users
5. Client receives loyalty card ID and welcome message

### Reminder
1. Scheduler scans Profiles daily for dates within 2 days
2. For each match: `GET /stock` from Flora24 filtered by client's preferred flowers
3. `GET /balance` from LMachine
4. Send reminder: "2 days until [occasion]. [Flowers] are available. Your cashback: X UAH. What's your budget?"
5. Client responds → enter ORDER_FLOW

### Order Flow
1. Client sets budget
2. `POST /preorders` to Flora24
3. Create Order in Airtable (status: pending_photo)
4. Notify manager: client name + profile (preferences, vase size, budget)
5. Manager sends photo → bot forwards to client
6. Client approves → choose delivery or pickup → choose payment method
7. Enter PAYMENT_FLOW

### Payment Flow
- **Online:** Generate Monobank invoice → send link → webhook confirms → `POST /transactions` to LMachine → notify manager → notify client with cashback earned
- **Cash (+3% cashback):** Notify client of bonus → notify manager → manager taps ✅ after receiving payment → same LMachine + Airtable recording
- **Terminal:** Same as cash, no bonus cashback

### Profile Share
1. User: `/share` → bot generates deep link with profile_id token
2. Recipient opens link → bot shows profile preview (preferences only, no personal data)
3. Recipient taps "Add" → enters free-text label → profile saved with `is_shared=true`, `source_user_id` set
4. Scheduler now includes this profile in recipient's reminder scans

### Loyalty Card (`/card`)
1. `GET /user/stats` from LMachine → balance, tier, progress to next tier
2. `GET /referral-link` from LMachine
3. Display: digital card with QR (loyalty ID), cashback balance, tier badge, referral link

### AI Support
1. Client taps "Ask florist"
2. Agent receives: ShopKnowledge rows + client profile summary + last 3 orders
3. Agent responds in florist persona
4. If `escalate_to_manager()` called: manager receives conversation summary + client context; client is told "Florist will respond by [time]"

---

## 6. Infrastructure

| Component | Service | Cost |
|---|---|---|
| Bot + scheduler + webhooks | Hetzner CX11 VPS | ~$5/month |
| Database | Airtable Team (1 seat) | $20/month |
| AI agent | Claude API (Haiku) | ~$15–30/month |
| Domain | .ua or .com.ua | ~$1/month |
| Monitoring | UptimeRobot free | $0 |
| **Total** | | **~$41–56/month** |

Scales to 15 shops with no infrastructure changes.

---

## 7. Out of Scope (MVP)

- AI photo selection — manager chooses manually
- Automated revenue tracking dashboard — Airtable views suffice
- Multi-shop owner dashboard
- Automatic Flora24 calendar sync for campaign scheduling — manual trigger
- White-label licensing
- Vertical integration with flower farms

---

## 8. Open Questions

- Flora24 API authentication method and rate limits — confirm with client before build
- LMachine API exact endpoint names and auth — confirm with lmachine.io before build
- Monobank ekvayring: does the shop already have a merchant account, or does it need setup?
- Cash payment +3% cashback: confirm this is financed by the shop (consistent with existing cashback model)
