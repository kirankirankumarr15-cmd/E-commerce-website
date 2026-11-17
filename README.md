# Nova Mart: Amazon-Style Store with Signature Scheduled Delivery

> **Next.js 14 App Router · TypeScript · Tailwind CSS · Supabase · Resend**

A complete Amazon-style e-commerce web application featuring atomic 2-hour scheduled delivery, 4-digit handover code verification, customer tracking, delivery partner app, and an operations admin portal.

---

## Key Features

### 1. Signature Scheduled Delivery Module
- **Customer Choice**: Choose an exact delivery date and 2-hour window (`09:00–11:00`, `11:00–13:00`, `14:00–16:00`, `16:00–18:00`, `18:00–20:00` IST) based on delivery pincode.
- **Atomic Booking**: Slot capacity reservations are atomized inside the `book_slot` PostgreSQL function to eliminate race conditions.
- **4-Digit Secret Code**: An OTP is generated and visible exclusively to the customer. Delivery partners never see the code in advance.
- **Partner Handover**: The delivery partner taps "I'm on my way" (starting 30 min before the window) and must enter the customer's 4-digit code to complete the drop.
- **Missed Handover Logic**:
  - 1st miss: Customer can reschedule (up to 2 reschedules) or collect from the nearest NovaMart Pickup Point.
  - 2nd miss: The parcel is marked for return to warehouse.
- **Lead Time Rule**: Enforces a minimum 2-hour lead time from current IST time.

### 2. Amazon-Style Customer Storefront
- **Navigation & Departments**: Amazon navy header (`#131921`), department search with auto-suggest, delivery location selector, returns & orders, and real-time cart count badge.
- **Home Page**: Hero carousel with high-contrast text and non-overlapping CTA, 4-quad deal tiles, lightning deals with countdown timer, best sellers grid, and trust badges.
- **Search & Category Listing**: Sidebar filters (categories, price brackets, customer ratings, deals, 2-hour scheduled delivery badge), sort controls, and responsive grid.
- **Product Details Page (PDP)**: 3-column desktop layout, image gallery with thumbnails, offer cards, specifications table, reviews breakdown, and the signature **Amazon Buy Box** (Add to Cart, Buy Now, stock status, delivery promise).
- **Shopping Cart**: Free delivery progress meter, item quantity selectors, delete, save for later, and subtotal sidebar.
- **Checkout Flow**: 4-step accordion (Delivery Address, 2-Hour SlotPicker, Payment with Cash on Delivery or Razorpay Test Mode, and Order Review).
- **Your Orders**: Amazon-style tracking timeline (Placed -> Scheduled -> On the Way -> Delivered), 4-digit handover OTP card, reschedule slot modal, and cancel order options.

### 3. Delivery Partner Portal (`/delivery`)
- Mobile-first interface for field delivery executives.
- Today's drops grouped by 2-hour window.
- One-tap **Call Customer** (`tel:`) and **Google Maps** navigation links.
- 60-second auto-refresh countdown timer with manual refresh button.
- "I'm on my way" trigger, 4-digit OTP input with tamper-lock, and "Customer not available" handling.

### 4. Operations & Admin Console (`/admin`)
- **Dashboard**: Real-time sales metrics, revenue, active drops today, and recent orders.
- **Products Catalog (`/admin/products`)**: Add new products with image URLs, adjust prices and stock levels inline, filter and delete.
- **Orders & Shipments (`/admin/orders`)**: View customer orders, filter by status, check OTP verification status, and manual overrides.
- **Fleet & Partners (`/admin/partners`)**: Add new delivery partners, assign 6-digit pincodes, and toggle active status.
- **Slots & Capacity (`/admin/slots`)**: Configure quota per 2-hour window per pincode, view 7-day live bookings, and block holiday/weather dates.

---

## Project Structure

```
├── app/
│   ├── layout.tsx                     # Root layout with Auth & Cart providers
│   ├── page.tsx                       # Amazon Home with Hero Carousel & 4-Quad Cards
│   ├── search/page.tsx                # Catalog search with filters & sort
│   ├── category/[slug]/page.tsx       # Category listing page
│   ├── products/[slug]/page.tsx       # 3-column PDP with Amazon Buy Box
│   ├── cart/page.tsx                  # Shopping cart with save-for-later
│   ├── checkout/page.tsx              # 4-step checkout with embedded SlotPicker
│   ├── orders/page.tsx                # Customer orders list
│   ├── orders/[id]/page.tsx           # Order details with 4-digit OTP & timeline
│   ├── orders/[id]/schedule/page.tsx  # Dedicated reschedule slot page
│   ├── delivery/page.tsx              # Delivery partner portal (map, call, OTP)
│   ├── admin/                         # Admin operations console
│   │   ├── page.tsx                   # Operations metrics
│   │   ├── products/page.tsx          # Products CRUD
│   │   ├── orders/page.tsx            # Order management
│   │   ├── partners/page.tsx          # Delivery fleet management
│   │   └── slots/page.tsx             # Slot capacity & date blocking
│   └── api/                           # Scheduled delivery & notification routes
│       ├── slots/route.ts             # Pincode slot availability query
│       ├── orders/[id]/schedule/      # Slot booking endpoint
│       ├── delivery/today/            # Today's partner drops
│       ├── delivery/[id]/             # Partner action endpoint (start, deliver, miss)
│       └── cron/notifications/        # Outbox notification queue worker
├── components/
│   ├── Navbar.tsx                     # Amazon 2-tier navigation & persona switcher
│   ├── Footer.tsx                     # Amazon 4-column directory & region
│   ├── HeroCarousel.tsx               # Auto-sliding hero banner with gradient fade
│   ├── ProductCard.tsx                # Product card with Prime & rating badges
│   ├── SearchContent.tsx              # Dynamic search filter & sort client
│   └── SlotPicker.tsx                 # Signature 2-hour window slot picker
├── lib/
│   ├── config.ts                      # Scheduled delivery rules & IST time utils
│   ├── authContext.tsx                # User session, saved addresses & demo switcher
│   ├── cartContext.tsx                # Persistent cart, prices & save-for-later
│   ├── orders.ts                      # Order creation, UUID generation & local store
│   ├── products.ts                    # Search query engine & category filters
│   ├── seedData.ts                    # 30 realistic products across 6 categories
│   ├── notify.ts                      # Resend email & SMS provider dispatch
│   └── supabaseAdmin.ts               # Server-only Supabase service-role client
├── supabase/
│   ├── migrations/
│   │   ├── 001_scheduled_delivery.sql # Orders, slots, partners, procedures & RLS
│   │   └── 002_catalog_cart_orders.sql# Catalog, addresses, reviews, slot blocks
│   └── seed.sql                       # Initial categories and products SQL
└── tests/
    └── config.test.ts                 # Vitest test suite for delivery rules
```

---

## Setup & Local Development

### 1. Prerequisites
- Node.js 18+ (Node 20 recommended)
- A Supabase project (or local Supabase CLI)
- A Resend API key for transactional emails

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your credentials:
```ini
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

APP_URL=http://localhost:3000
CRON_SECRET=your_random_secret_token
RESEND_API_KEY=re_your_resend_api_key
MAIL_FROM="Nova Mart <orders@your-domain.com>"
```

### 3. Database Migration
Run the SQL migrations in your Supabase SQL Editor:
1. `supabase/migrations/001_scheduled_delivery.sql` (Creates orders, slots, partners, RLS policies, and stored procedures `book_slot`, `start_trip`, `complete_delivery`, `mark_failed_attempt`).
2. `supabase/migrations/002_catalog_cart_orders.sql` (Creates categories, products, user addresses, reviews, and slot blocks).
3. `supabase/seed.sql` (Inserts realistic categories and products).

### 4. Install Dependencies & Run
```bash
# Install dependencies
npm install

# Run Vitest test suite
npm test

# Run TypeScript type check
npm run typecheck

# Build for production
npm run build

# Start development server
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## Adding a Delivery Partner

To add a delivery partner into the system:

### Option A: Using the Admin Console
1. Navigate to `http://localhost:3000/admin/partners`.
2. Click **+ Add Delivery Partner**.
3. Enter Name, Phone, Vehicle Number, and coverage pincodes (e.g. `560103, 560037`).
4. Click **Add Partner**.

### Option B: Supabase SQL Editor
```sql
insert into delivery_partners (user_id, name, pincodes, active)
values (
  'auth-user-uuid-here',
  'Rajesh Kumar',
  array['560103', '560037'],
  true
);
```

---

## Notification Scheduler (Cron)

Messages are queued in the `notifications` outbox table. To dispatch them automatically:

Make a `GET` request every 1 to 5 minutes to:
```
GET /api/cron/notifications
Authorization: Bearer <CRON_SECRET>
```
You can configure this using:
- [cron-job.org](https://cron-job.org) (free, set URL and Authorization header)
- Supabase `pg_cron` + `pg_net`
- Vercel Cron

---

## Verification & Self-Fixing Matrix

- **Unit Tests**: `npm test` runs 6 unit tests covering `lib/config.ts` (lead time, IST calculation, window validity, UUID checking).
- **Type Checking**: `npx tsc --noEmit` verifies strict TypeScript compilation with zero errors.
- **Linting**: `npm run lint` enforces Next.js core web vitals and accessible JSX.
- **Production Build**: `npm run build` verifies full static site generation and dynamic server routes.
