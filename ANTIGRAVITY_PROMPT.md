# Prompt for Antigravity

You are a senior full-stack engineer. This repo contains a **Scheduled Delivery** module for my e-commerce website (Next.js 14 App Router, TypeScript, Supabase, Tailwind). Read `README.md`, `supabase/schema.sql`, `lib/`, `app/api/`, `components/SlotPicker.tsx` first.

## Problem
Delivery partners wait at the door for a long time, or customers are busy and can't come to collect the parcel. Fix it: the customer chooses a date and time window, the partner arrives in that window, and handover is confirmed with a code.

## Your tasks
1. **Integrate** this module into the existing project. Match its existing auth, styling, layout and navigation. Do not rewrite what already works. Keep the Supabase function names and API contracts.
2. **Checkout**: after an order is placed, redirect to `/orders/[id]/schedule`. Add "Schedule / change delivery time" on the order details page and in the order list.
3. **Notifications**: the queue, message text (`lib/messages.ts`) and cron endpoint already exist. Plug in the real SMS/WhatsApp provider in `lib/notify.ts`, set up the scheduler (every 1-5 min) and store contact phone numbers at signup.
4. **Admin page** `/admin/slots`: set capacity per pincode and window, block dates, see bookings per window.
5. **Partner page**: add a call button for the customer, a map link for the address, and refresh every 60 seconds. ("I'm on my way" and order assignment already exist.)
6. **Pickup-point fallback**: after one missed attempt, offer "collect from the nearest pickup point" as an alternative to rescheduling.
7. **Tests**: unit tests for `lib/config.ts`; SQL tests for `book_slot` (capacity, reschedule limit, lead time, concurrent bookings), `complete_delivery` (wrong OTP lockout) and `mark_failed_attempt`.

## Rules that must not break
- Slot booking stays atomic in the `book_slot` SQL function. Never count capacity in app code.
- The handover OTP is visible only to the customer. Never return it from partner endpoints.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only. No service-role client in client components.
- All times are IST (Asia/Kolkata). Slot must start at least 2 hours ahead.
- Max 2 reschedules; 2nd missed attempt returns the order.
- Mobile-first, keyboard accessible, clear error messages that say how to fix the problem.

## Done when
- A customer can book, change, and see the code on a phone.
- Two people booking the last spot at the same moment: exactly one succeeds.
- A partner can see today's drops by window, confirm with the code, or mark "not available" after the window starts.
- `npm run build` and the tests pass.
