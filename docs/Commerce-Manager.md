# Commerce Manager

## Purpose
The admin layer over merch, print-on-demand, vinyl, and digital bundles — sits above the Direct-to-Fan portal's fan-facing store and Distribution's POD pipeline (Section 44.D). Where D2F is "what the fan sees," Commerce Manager is "how the label configures and reconciles it."

## Users & Roles
- Super Admin / Platform Operator (payment-rail config, global pricing rules)
- Label/Artist Manager (own storefront, own products)
- Accountant (order reconciliation, payouts)

## Navigation
Sidebar: Products · Orders · Storefront · Payments · Promotions

## Dashboard
Revenue this period, pending orders, refund/dispute queue, low-stock/fulfillment alerts (POD).

## Sidebar
Product Catalog · Orders & Fulfillment · Storefront Config · Payment Rails · Promo Codes · Tax/Compliance

## Core Entities
`Product`, `Order`, `Payout`, `Organization`

## Features
- Storefront product-catalog admin (merch, POD, vinyl, digital bundles)
- Order management, refunds, dispute handling
- Payment-rail configuration per region
- Pricing rules, promo codes, bundle configuration
- Tax/compliance settings per territory

## Workflows
1. Admin creates a `Product` (POD, physical, or digital bundle) and attaches pricing.
2. Fan purchases via D2F storefront → `Order` created.
3. Commerce Manager routes fulfillment (POD pipeline for physical, instant delivery for digital).
4. Payout reconciles against the shared Payments/Payout rail (Section 45), same rail used by Touring and Royalty disbursement.

## Database Models Used
`Product`, `Order`, `Payout`, `Organization`, `Membership`

## API Endpoints
- `POST /api/commerce/products`
- `GET /api/commerce/orders`
- `POST /api/commerce/orders/:id/refund`
- `PATCH /api/commerce/payment-rails`

## Permissions
`commerce.product.write`, `commerce.order.manage`, `commerce.payments.configure` (Super Admin only for the last).

## Integrations
Shares the Payments/Payout rail with Touring (`Settlement`) and Royalty disbursement (Section 45). Storefront rendering reuses the Public-Facing Page Renderer (shared with Website Manager/Catalog).

## Notifications
New order, refund requested, payout failed.

## Reports
Revenue by product/channel, refund rate, POD fulfillment SLA.

## Future Roadmap
Subscription/bundle tiers tied to D2F access-point perks; multi-currency storefront pricing.
