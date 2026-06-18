# FlowerOS — Onboarding Consent + Partner Contract Data Clauses (Draft)

> Date: 2026-06-12
> Status: DRAFT — requires one lawyer pass before use (UA personal data law: ЗУ «Про захист персональних даних»)
> Decisions baked in: flat 7% on GROSS; no setup fee (stated openly); cashback expires 12 months after last purchase; exclusivity zone per point (report §6.2b)

---

## Part A — Client onboarding consent (shown in the bot before data collection)

**What it must cover:** who processes the data (controller), what is collected, why, who sees it, how long it's kept, how to delete it.

### A.1 Ukrainian copy (bot message, shown with an "✅ Погоджуюсь" button before the survey)

> Натискаючи «Погоджуюсь», ви даєте згоду на обробку ваших персональних даних (ім'я, телефон, адреси доставки, важливі дати та вподобання) оператором програми лояльності — ФОП Степаненко Артем [реквізити].
>
> Навіщо нам ці дані:
> • нагадувати про важливі дати та допомагати із замовленням букетів
> • нараховувати кешбек і вести вашу картку лояльності
> • зрідка надсилати сезонні пропозиції (можна вимкнути будь-коли)
>
> Магазин-партнер бачить лише дані, потрібні для виконання вашого замовлення. Ми не передаємо ваші контакти третім особам.
>
> Видалити свої дані повністю: команда /delete — все стирається, незворотно.
>
> Кешбек діє, поки ви активні: якщо немає жодної покупки протягом 12 місяців, баланс згорає.

### A.2 Implementation requirements

- Consent button BEFORE the first survey question; refusal → polite exit, no data stored
- `/delete` command: erases User + Profiles + personal fields on Orders (order amounts stay, anonymized — needed for shop accounting); confirm with a two-tap "точно видалити?"
- Marketing opt-out separate from service messages: seasonal broadcasts honor an `opted_out_marketing` flag; reminders for the user's own saved dates are service messages
- Shared profiles (deep links): the profile preview shows preferences only, never phone/address; the consent text covers data the user enters about third parties ("дані про інших людей ви додаєте під свою відповідальність")
- Log consent: timestamp + consent text version on the User record

---

## Part B — Partner contract: data, money, and territory clauses

### B.1 Data ownership and access
1. The client base (contacts, profiles, dates, preferences, purchase history) is the **platform's asset**. The shop receives per-order fulfillment data only (name, what, when, where) and never exports contact lists.
2. Platform may migrate the client base to another fulfillment partner if this contract terminates or the shop breaches §B.4 KPIs. Clients are notified; the shop receives no copy of the base.
3. Bouquet confirmation photos created in order fulfillment may be reused by the platform in the shop's catalog and client-facing flows. Delivery photos and any imagery containing persons or addresses are excluded.
4. Platform audit right: monthly comparison of attributed turnover vs the shop's fiscal turnover trend; shop provides PRRO/turnover totals on request (trend level, not per-receipt).

### B.2 Commission and money
1. Commission: **7% flat** of the **gross order value** of every attributed transaction (bot orders and card-scan purchases). Cashback redeemed by the client does not reduce the commission base.
2. No setup fee at the current stage — stated in the contract explicitly (no hidden onboarding charges).
3. Monthly statement: itemized attributed transactions, commission due, outstanding cashback liability, projected redemptions for the next peak. Payment terms: 5 banking days. Late payment → reminder/campaign services pause.
4. Refunds/cancellations: reversal entries reduce the next statement.

### B.3 Loyalty economics (shop-financed, stated transparently)
1. Cashback accrual (3/5/7% by client tier), referral rewards (1/2/3%), activation bonuses, and the +3% cash-payment bonus are financed by the shop. The full expected stack (~12% of attributed turnover) is disclosed in the contract annex — no surprises at month 3.
2. Cashback expiry: a client's entire balance expires **12 months after their last purchase**. Expired liability is written off the shop's books in the monthly statement.
3. Earn-tier turnover window: [pending decision G-26 — recommended: rolling 12 months].

### B.4 Shop obligations and KPIs
1. Every cashier offers the loyalty program at every purchase; QR materials (care-packet stickers, tent cards, posters) displayed as agreed.
2. Florist morning checklist (mono types + colors out) filled daily by [time]; fill rate is a tracked KPI.
3. New-customer target: ≥7 genuinely new program customers/month/point (the metric that makes the shop's own P&L positive — report §3.7).
4. Freshness guarantee + 24-hour replacement per the platform standard; replacement arbitration via photo in the bot, abuse limits per concept rules (2–3% norm).

### B.5 Exclusivity (per report §6.2b)
1. Protection zone: radius **1,000 m (Kyiv / dense districts) / 1,500 m (other cities)** around each of the shop's points; a closed residential complex counts as a whole. Platform will not onboard a competing flower shop with a point inside the zone.
2. Performance condition: the zone holds while the point maintains ≥500 attributing users/year from month 9. Below threshold after written notice and a 60-day cure period, protection lapses.
3. Zones bind the platform's onboarding only — not delivery territory, not the shop's expansion. Overlap conflicts: first signed wins.

### B.6 Exit
1. Either party: 30-day notice. On exit: client base, profiles, loyalty balances stay with the platform; clients are notified of the partner change; shop settles the final statement including accrued cashback liability per annex rules.
