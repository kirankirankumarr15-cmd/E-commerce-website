# Scheduled Delivery module (Next.js 14 + Supabase + Tailwind)

Customer picks a delivery date + 2-hour window. Delivery partner arrives in that window and hands over with a 4-digit code. No waiting, no missed handovers.

## Setup
1. Supabase SQL editor → run `supabase/schema.sql`.
2. Copy `.env.example` to `.env.local` and fill the keys.
3. `npm i @supabase/supabase-js` (Next.js 14, Tailwind, `@/*` path alias required).
4. Copy `app/`, `components/`, `lib/` into your project.
5. Add a partner: insert a row in `delivery_partners` (see bottom of schema.sql).
6. After checkout, redirect to `/orders/<orderId>/schedule`.

## Notifications
Messages are queued in the `notifications` table (booked, reminder 1h before, on my way, missed). Send them by calling
`GET /api/cron/notifications` every 1-5 minutes with header `Authorization: Bearer <CRON_SECRET>`
(cron-job.org, Supabase pg_cron + pg_net, or Vercel Cron on a paid plan).
Email works with Resend. For SMS/WhatsApp add your provider in `lib/notify.ts`.

## Flow
- Customer: `/orders/:id/schedule` → picks slot → sees handover code.
- Partner: `/delivery` → today's drops grouped by window → "I'm on my way" (from 30 min before the window; assigns the order to them and messages the customer) → enters code → delivered.
- Miss: "Customer not available" (only after slot starts). 1st miss → customer re-picks. 2nd miss → returned.

## Rules (edit in `lib/config.ts`)
Windows, capacity per window per pincode, 7-day horizon, 2h lead time, max 2 reschedules.
