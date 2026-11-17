# Implementation Plan: Amazon-Style Store with Scheduled Delivery

A complete, production-grade Amazon-style e-commerce web application built with **Next.js 14 App Router, TypeScript, Tailwind CSS, and Supabase**, powered by the signature **Scheduled Delivery module** (2-hour customer-chosen windows, 4-digit handover codes, delivery partner workflow, and background notification queue).

---

## Architecture & Technology Stack

- **Framework**: Next.js 14 (App Router, Server Components + Client Components)
- **Language**: TypeScript (`strict: true`, zero untyped code)
- **Styling**: Tailwind CSS (Amazon-inspired clean visual palette: `#131921` dark nav, `#232f3e` subnav, `#eaeded` body, `#ffd814` yellow primary buttons, `#ffa41c` orange CTA, `#febd69` search accents, `#007185` link blue, `#cc0c39` deal red)
- **Backend & Database**: Supabase (PostgreSQL with Row Level Security, pg_trgm for full-text search, stored procedures, Auth)
- **Scheduled Delivery Core**: Preserves all existing SQL functions (`book_slot`, `start_trip`, `complete_delivery`, `mark_failed_attempt`, `claim_notifications`) and rules (atomic slot capacity, IST time zone, 2h minimum lead time, max 2 reschedules, 2 misses return order, server-only secret keys).
- **Payment Modes**: Cash on Delivery (COD) + Razorpay Test Mode.

---

## Phased Implementation Plan

### Phase 1: Foundation, Tooling & Database Migrations
- Setup root `package.json` with Next.js 14, React 18, Supabase client, TypeScript, Tailwind, Lucide icons, Vitest/Jest for tests.
- Configure `tsconfig.json` (`@/*` alias), `tailwind.config.ts`, `postcss.config.js`, `next.config.js`.
- Create `supabase/migrations/`:
  - `001_scheduled_delivery.sql`: Initial base schema from `supabase/schema.sql`.
  - `002_catalog_cart_orders.sql`: Categories, Products (with full-text search index), Product Reviews, Carts, Cart Items, Wishlists, Customer Addresses, Delivery Partner enhancements, Admin slot management tables.
  - Setup RLS policies guaranteeing customer data isolation and partner-specific order visibility.
- Create seed data script (`supabase/seed.sql` & `lib/seedData.ts`) with 30 realistic products across 6 categories.
- Acceptance Checks: Dependencies install cleanly, Supabase types and schema compile, base configuration ready.

### Phase 2: Core Layout & Amazon-Style Navigation
- Create `app/layout.tsx` and `app/globals.css` with Amazon font stack and colors.
- Build Amazon Header (`components/Navbar.tsx`):
  - Top bar (`#131921`): Brand logo with smile accent, Delivery Location widget ("Deliver to [Name/City] [Pincode]"), Department Search Bar with category dropdown, Returns & Orders, Cart icon with live counter.
  - Sub-navigation bar (`#232f3e`): "All" hamburger menu, Categories, Today's Deals, Best Sellers, Customer Service, Scheduled Delivery.
  - Mobile bottom navigation bar for phone-screen experience.
- Build Amazon Footer (`components/Footer.tsx`) with "Back to top", 4-column directory, language/country badges.
- Acceptance Checks: Header, search input, location picker, and mobile nav render and respond properly.

### Phase 3: Home Page, Catalog & Full-Text Search
- Amazon Home Page (`app/page.tsx`):
  - Promotional carousel banner with gradient overlay into `#eaeded`.
  - 4-Quad Cards Grid (Electronics up to 60% off, Fashion trends, Home essentials, Personalized sign-in/account card).
  - Horizontal deal rails ("Today's Lightning Deals", "Best Sellers", "Top Categories").
  - Amazon Trust Badges (Free Delivery, 7-Day Replacement, Secure Checkout, 2-Hour Scheduled Slots).
- Search & Listing Page (`app/search/page.tsx` & `app/category/[slug]/page.tsx`):
  - Postgres Full-Text Search query parsing.
  - Filter sidebar: Category, Price range, Minimum star rating (4★ & up), Stock availability.
  - Sort options: Featured, Price Low to High, Price High to Low, Customer Reviews, Newest.
  - Product Card component with Prime badge, Deal badge, star ratings, and 1-click Add to Cart.
- Acceptance Checks: Searching "wireless" or filtering by category returns matching products with accurate pricing and Prime badges.

### Phase 4: Product Details Page & Cart Management
- Amazon 3-Column PDP (`app/products/[slug]/page.tsx`):
  - Column 1: Multi-image thumbnail gallery + high-res viewer.
  - Column 2: Brand store link, Title, Star ratings breakdown, "Nova's Choice" badge, Price box with discount, EMI calculation, Bank & Partner offers box, Specifications table.
  - Column 3 (The Iconic Amazon Buy Box): Live price, Free delivery date countdown ("FREE delivery Tomorrow, 2 PM. Order within 4 hrs"), Pincode delivery checker, Stock badge ("In Stock"), Quantity dropdown, Yellow "Add to Cart", Orange "Buy Now", Security guarantee, Ships from / Sold by info.
  - Customer Reviews section with 5-star distribution.
- Shopping Cart (`app/cart/page.tsx`):
  - Free delivery progress threshold indicator.
  - Item list with quantity selector, Delete, Save for Later.
  - Sidebar Subtotal box with "Proceed to Buy" button, gift option checkbox, and promo code entry.
- Acceptance Checks: Adding items updates cart counter instantly; Cart allows modifying quantity, moving to saved for later, and calculating subtotal accurately.

### Phase 5: Checkout & Scheduled Delivery Integration
- Multi-step Amazon Checkout (`app/checkout/page.tsx`):
  - Step 1: Delivery Address selection or new address form with validated 6-digit Indian pincode.
  - Step 2: **Signature Scheduled Delivery Slot Picker**:
    - Embedded `SlotPicker.tsx` dynamically loading slot availability for the selected address pincode.
    - Customer chooses date and 2-hour window (9-11 AM, 11 AM-1 PM, 2-4 PM, 4-6 PM, 6-8 PM).
    - Real-time lead time check (slot must start ≥ 2 hours ahead) and capacity verification.
  - Step 3: Payment Options:
    - Cash on Delivery (COD)
    - Online Payment (Razorpay Test Mode / Card / UPI simulation)
  - Step 4: Order Review & Placement:
    - Atomically calls `book_slot` stored procedure to reserve slot and generate 4-digit handover code.
    - Saves order and creates `booked` notification in queue.
- Acceptance Checks: Order placed with selected pincode reserves slot capacity atomically, clears cart, and redirects to Order Confirmation.

### Phase 6: Customer Orders & Handover Workflow
- Orders List & Detail (`app/orders/page.tsx` & `app/orders/[id]/page.tsx`):
  - Order card with status badge (`placed`, `scheduled`, `delivered`, `returned`).
  - Amazon-style Status Timeline (Ordered → Scheduled → On the Way → Delivered).
  - Prominent Handover Code Box: Shows the 4-digit code strictly to the customer with instructions ("Share this code only when you receive your parcel").
  - "Reschedule delivery" button (invoking `book_slot`, enforcing max 2 reschedules limit and 2h lead time rule).
  - Cancel order before slot starts.
  - Reorder button.
- Customer Delivery Scheduling page (`app/orders/[id]/schedule/page.tsx`).
- Acceptance Checks: Customer views order, sees the 4-digit handover code, can reschedule slot within limits, and sees live "On the way" status when partner dispatches.

### Phase 7: Delivery Partner Portal (`/delivery`)
- Partner Drops Dashboard (`app/delivery/page.tsx`):
  - Grouped by today's 2-hour windows in ascending time order.
  - Drop card showing address, pincode, delivery window.
  - "Call Customer" tel link button.
  - "Open in Maps" Google Maps directions link for customer address.
  - "I'm on my way" trigger: Enabled 30 minutes before window starts, assigns order to partner, transitions status, queues `on_my_way` notification.
  - 4-Digit Handover Verification: Partner inputs customer-provided OTP, verifies via `complete_delivery` stored procedure; marks Delivered.
  - "Customer not available": Enabled after slot starts via `mark_failed_attempt`; marks 1st miss (prompts customer reschedule / pickup-point fallback) or 2nd miss (returns order).
  - Auto-refresh drops every 60 seconds.
- Acceptance Checks: Partner sees assigned pincodes only; OTP handover completes delivery; wrong OTP locks after 5 tries; partner cannot view OTP.

### Phase 8: Admin Portal (`/admin`)
- Admin Navigation & Dashboard (`app/admin/page.tsx`):
  - Metrics: Total revenue, total orders, pending deliveries today, active partners.
- Admin Products Management (`app/admin/products/page.tsx`):
  - List, create, edit, delete products with title, category, price, discount, stock, image URL, specifications.
- Admin Orders Management (`app/admin/orders/page.tsx`):
  - View all orders, filter by status, view assigned delivery partner and slot.
- Admin Delivery Partners (`app/admin/partners/page.tsx`):
  - Manage partners, active status, and serviced pincodes list.
- Admin Slots & Capacity Control (`app/admin/slots/page.tsx`):
  - View bookings per window per pincode.
  - Adjust window capacity and block dates/windows for holidays or maintenance.
- Acceptance Checks: Admin can manage catalog, view slot utilization, update capacity, and monitor partner performance.

### Phase 9: Automated Verification, Tests & Final Documentation
- Unit tests (`tests/config.test.ts`):
  - Test `isTooSoon`, `isValidWindow`, `validDates`, `istDate`, `fmtTime`, `fmtDate`, `slotStartMs`.
- SQL tests (`tests/sql_functions.test.sql`):
  - Capacity limit testing (last spot concurrency).
  - Lead time enforcement (≥ 2 hours).
  - Reschedule limit (max 2).
  - 5 incorrect OTP attempts lockout.
  - 2 missed deliveries returns order.
- Complete execution of verification commands:
  - `npm run build`
  - `npx tsc --noEmit`
  - `npm run lint`
  - `npm test`
- Updated `README.md` with complete architecture guide, setup, env keys, cron configuration, and partner registration instructions.

---

## Acceptance Matrix

| Feature | Requirement | Verification Method |
|---|---|---|
| **Atomic Slot Booking** | `book_slot` handles capacity check & booking in SQL | Unit/SQL test + API test |
| **Handover Code Security** | 4-digit OTP visible only to customer, never returned to partner API | Verified in `app/api/delivery/today` |
| **Lead Time & Limits** | Slot starts ≥ 2h ahead, max 2 reschedules, 2 misses = returned | `lib/config.ts` + stored procedure |
| **Partner Operations** | "On the way" from 30 min before, OTP delivery, miss handling, 60s poll | Partner page UI + API test |
| **Amazon UI Fidelity** | Dark navbar, 4-quad cards, Buy Box, Prime tags, yellow/orange CTAs, mobile bottom nav | Visual & functional testing |
| **All Green Checks** | `build`, `tsc`, `lint`, and `test` exit with code 0 | CI/build commands |
