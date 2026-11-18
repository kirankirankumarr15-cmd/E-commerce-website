# NOVA MART – Master Test Execution Results Log

**Execution Date:** November 18, 2026  
**Node.js Version:** v24.15.0  
**Test Command:** `npm test`  
**Execution Time:** 519.1 ms  
**Total Tests:** 63  
**Passed:** 63 (100%)  
**Failed:** 0 (0%)  

---

## 1. Executive Test Execution Summary

```text
▶ PHASE 1: Unit Testing - Validation & Calculations
  ▶ Email & Password Validation
    ✔ accepts valid email addresses (1.55ms)
    ✔ rejects invalid email formats (1.52ms)
    ✔ validates password minimum length of 6 characters (0.31ms)
    ✔ validates registration form correctly (0.43ms)
  ✔ Email & Password Validation (5.22ms)
  ▶ Pricing & Discount Calculations
    ✔ calculates correct discounted price with percentages (0.38ms)
    ✔ formats Indian Rupee (INR) currency correctly (23.76ms)
    ✔ truncates strings properly with ellipsis (0.28ms)
  ✔ Pricing & Discount Calculations (24.84ms)
  ▶ Cart & Checkout Calculations
    ✔ calculates cart totals with shipping fee below ₹999 threshold (0.41ms)
    ✔ applies free shipping for orders at or above ₹999 (0.17ms)
    ✔ applies promotional coupon code discount correctly (0.24ms)
  ✔ Cart & Checkout Calculations (1.07ms)
  ▶ Search Functionality
    ✔ matches query case-insensitively (0.43ms)
    ✔ matches query across product brand name (0.17ms)
    ✔ filters search results by category (0.22ms)
  ✔ Search Functionality (1.04ms)
✔ PHASE 1: Unit Testing - Validation & Calculations (33.31ms)

▶ PHASE 2: Integration Testing - Authentication & Profile Management
  ✔ registers new customer account and persists session (2.06ms)
  ✔ registers admin account based on email context (0.77ms)
  ✔ updates profile personal details (name, email, phone) (0.90ms)
  ✔ manages addresses: Add, Edit, and Delete with default address flag exclusivity (2.67ms)
  ✔ toggles role mode seamlessly between Customer and Admin (0.72ms)
  ✔ logs out and cleans up session tokens (0.48ms)
✔ PHASE 2: Integration Testing - Authentication & Profile Management (10.97ms)

▶ PHASE 7 & 8: Performance, Load & Stress Testing
  ▶ Phase 7: Concurrent User Load Simulation
    ✔ Scenario 1: Handles 10 concurrent requests with zero error rate and < 50ms latency (5.91ms)
    ✔ Scenario 2: Handles 50 concurrent requests across mixed endpoints (0.95ms)
    ✔ Scenario 3: Handles 100 concurrent requests smoothly (1.69ms)
  ✔ Phase 7: Concurrent User Load Simulation (10.12ms)
  ▶ Phase 8: Stress Testing & Graceful Degradation
    ✔ Handles extreme burst of 200 concurrent order creation requests without memory corruption (252.40ms)
    ✔ Recovers gracefully from corrupted, null, and empty parameter inputs (2.46ms)
  ✔ Phase 8: Stress Testing & Graceful Degradation (255.39ms)
✔ PHASE 7 & 8: Performance, Load & Stress Testing (266.76ms)

▶ PHASE 9: Security Testing - Application Security & Hardening
  ▶ Input Sanitization & Injection Defense
    ✔ handles SQL Injection payloads in search query safely (2.33ms)
    ✔ handles XSS injection attempts in search without reflecting unescaped tags (0.30ms)
    ✔ handles malicious payloads in order address input without crash (0.46ms)
  ✔ Input Sanitization & Injection Defense (4.03ms)
  ▶ Authorization & Role Boundaries
    ✔ strictly enforces admin role verification (0.38ms)
    ✔ blocks unauthenticated access from accessing admin dashboard data (0.95ms)
  ✔ Authorization & Role Boundaries (1.53ms)
  ▶ Sensitive Information & Credential Exposure
    ✔ ensures user profile response does NOT leak raw passwords or secrets (0.38ms)
    ✔ ensures orders list does NOT expose other customers private payment cards (0.25ms)
  ✔ Sensitive Information & Credential Exposure (0.88ms)
✔ PHASE 9: Security Testing - Application Security & Hardening (8.06ms)

▶ PHASE 13: API Testing - Endpoints & Data Contracts
  ▶ Categories Endpoints
    ✔ GET /categories returns full list of categories (1.71ms)
    ✔ GET /categories/:slug returns single matching category object (0.52ms)
  ✔ Categories Endpoints (3.27ms)
  ▶ Products Endpoints
    ✔ GET /products returns paginated list of catalog products (0.75ms)
    ✔ GET /products?deals=true filters by deals (0.62ms)
    ✔ GET /products?bestsellers=true filters by bestsellers (0.49ms)
    ✔ GET /products/slug/:slug returns single product with full specifications (0.39ms)
    ✔ GET /products/slug/:slug/related returns array of related products (0.32ms)
    ✔ GET /products/slug/:slug/frequently-bought returns array of complementary items (0.51ms)
  ✔ Products Endpoints (3.89ms)
  ▶ Auth Endpoints
    ✔ POST /auth/login returns user session with JWT token and customer role (0.55ms)
    ✔ POST /auth/login with admin email returns admin role (0.33ms)
    ✔ POST /auth/register creates new account payload (0.22ms)
  ✔ Auth Endpoints (3.00ms)
  ▶ Orders & Admin Endpoints
    ✔ GET /orders/stats returns admin operational KPI metrics (0.45ms)
    ✔ GET /orders/all returns array of all store orders for admin (0.28ms)
    ✔ GET /orders/:id returns detailed order info with payment details (0.30ms)
    ✔ PUT /orders/:id/status updates order status (0.23ms)
    ✔ GET /orders/:id/invoice returns generated invoice data (31.92ms)
  ✔ Orders & Admin Endpoints (33.52ms)
  ▶ Payment & Coupon Endpoints
    ✔ POST /payments/create-order generates new order record (0.40ms)
    ✔ GET /coupons returns available discount coupon code (0.39ms)
  ✔ Payment & Coupon Endpoints (0.98ms)
✔ PHASE 13: API Testing - Endpoints & Data Contracts (45.92ms)

▶ PHASE 15: Acceptance Testing - Complete 14-Step Customer Shopping Journey
  ✔ Step 1: Open Nova Mart storefront (load catalog & categories) (3.66ms)
  ✔ Step 2: Register a new customer account (0.48ms)
  ✔ Step 3: Authenticate and log in with credentials (0.40ms)
  ✔ Step 4: Browse catalog and filter by Category (0.32ms)
  ✔ Step 5: Search for a specific product by keyword ("earbuds") (0.31ms)
  ✔ Step 6: Open product details page and verify specifications (0.40ms)
  ✔ Step 7: Add product to shopping cart (0.23ms)
  ✔ Step 8: Update product quantity in cart (increment to 2 items) (0.32ms)
  ✔ Step 9: Proceed to checkout and review summary (0.34ms)
  ✔ Step 10: Populate and validate delivery shipping address (0.43ms)
  ✔ Step 11: Complete order placement using Cash on Delivery (COD) (0.79ms)
  ✔ Step 12: Verify order confirmation details (0.24ms)
  ✔ Step 13: Open Customer Order History and locate the new order (0.52ms)
  ✔ Step 14: Log out and verify session termination (0.19ms)
✔ PHASE 15: Acceptance Testing - Complete 14-Step Customer Shopping Journey (11.85ms)

=======================================================
Master Execution Totals:
  Suites:   20 passed, 20 total
  Tests:    63 passed, 63 total
  Failed:   0
  Skipped:  0
  Duration: 519.14 ms
=======================================================
```

---

## 2. How to Re-Run the Automated Tests Anytime

From the project root directory, execute:

```bash
npm test
```

This runs all 63 unit, integration, security, API, and end-to-end tests across all suites with instant real-time results.
