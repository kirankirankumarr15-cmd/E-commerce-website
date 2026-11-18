# NOVA MART – Master QA Test Cases Specification

**Document Version:** 1.0  
**Test Suite Coverage:** Unit, Integration, Functional, Security, API, Performance, Acceptance  
**Total Test Cases:** 63 Automated Test Cases  

---

## 1. Unit Testing Test Cases (`tests/unit/validation.test.js`)

| TC ID | Test Case Title | Input Data / Pre-condition | Expected Result | Actual Result | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC-U01** | Valid Email Syntax Verification | `customer@novamart.com`, `admin+ops@novamart.in` | `validateEmail()` returns `true` | Returned `true` | **PASS** |
| **TC-U02** | Invalid Email Format Rejection | `""`, `"invalid-email"`, `"missing@domain"` | `validateEmail()` returns `false` | Returned `false` | **PASS** |
| **TC-U03** | Password Length Validation | Minimum 6 characters (`123456`, `admin123!`) | Returns `true` for $\ge 6$, `false` for $< 6$ | Validated accurately | **PASS** |
| **TC-U04** | Registration Form Validation | Mismatched password vs confirm password | Returns `isValid: false`, lists error message | Validation caught mismatch | **PASS** |
| **TC-U05** | Discount Calculation Precision | ₹4,999 with 25% discount | Computes `₹3,749` after integer rounding | Computed `3749` | **PASS** |
| **TC-U06** | Indian Rupee (INR) Formatting | Number `3749` | Formats as `₹3,749` using `en-IN` locale | Output contained `₹` & `3,749` | **PASS** |
| **TC-U07** | Text Truncation with Ellipsis | Long product description (> 20 chars) | Shortened with trailing `...` | Truncated properly | **PASS** |
| **TC-U08** | Cart Total Below Shipping Threshold | Subtotal ₹499 (< ₹999) | Adds standard delivery fee of ₹49 + 18% GST | Computed `₹638` | **PASS** |
| **TC-U09** | Free Delivery Threshold Eligibility | Subtotal ₹1,299 ($\ge$ ₹999) | Delivery fee is ₹0, `isFreeShipping: true` | `shippingPrice === 0` | **PASS** |
| **TC-U10** | Promotional Coupon Deduction | Subtotal ₹2,000, Coupon ₹200 | Taxable base reduced to ₹1,800 + 18% GST | Computed `₹2,124` | **PASS** |
| **TC-U11** | Case-Insensitive Product Search | Query `"soundpro"`, `"SOUNDPRO"`, `"earbuds"` | Matches product title regardless of casing | Found 1 matching item | **PASS** |
| **TC-U12** | Multi-attribute Brand Query Search | Query `"Apex Tech"`, `"VoltStream"` | Matches product brand attributes | Matched expected brands | **PASS** |
| **TC-U13** | Category Filtered Search Results | Query `""`, category filter `"electronics"` | Filters exclusively within specified category | Returned 3 items | **PASS** |

---

## 2. Integration Testing Test Cases (`tests/integration/auth_and_profile.test.js`)

| TC ID | Test Case Title | Scenario | Expected Result | Actual Result | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC-I01** | Customer Registration & Storage | Submit new user details | Token stored in storage, role set to `customer` | Verified in storage | **PASS** |
| **TC-I02** | Admin Account Provisioning | Register with `admin@novamart.com` | Role initialized as `admin` | Initialized as `admin` | **PASS** |
| **TC-I03** | Personal Info Profile Mutation | Update First Name, Email, and Phone | Persists updates to state and local storage | Stored and restored | **PASS** |
| **TC-I04** | Address Addition & Default Flag Exclusivity | Add 2 addresses, both marked as default | Most recent address becomes default; prior is unset | Default flag preserved | **PASS** |
| **TC-I05** | Address In-Place Field Editing | Edit Street name and toggle default | Updates target address without duplicate records | Updated accurately | **PASS** |
| **TC-I06** | Address Removal | Delete saved address by `_id` | Address removed from user array | Array length decremented | **PASS** |
| **TC-I07** | Role Mode Seamless Switching | Toggle between Customer and Admin mode | Switches role flag without terminating session | Toggled successfully | **PASS** |
| **TC-I08** | User Logout Session Cleanup | Trigger `logout()` | Clears JWT token and user state | Tokens deleted | **PASS** |

---

## 3. API Contract Test Cases (`tests/api/api_endpoints.test.mjs`)

| TC ID | Endpoint | Method | Expected Output | Status |
| :---: | :--- | :---: | :--- | :---: |
| **TC-A01** | `/categories` | `GET` | Array of 6 category items with slug and image | **PASS** |
| **TC-A02** | `/categories/:slug` | `GET` | Single category object matching parameter slug | **PASS** |
| **TC-A03** | `/products` | `GET` | Paginated catalog array with page/limit metadata | **PASS** |
| **TC-A04** | `/products?deals=true` | `GET` | Filtered array where `isDeal === true` | **PASS** |
| **TC-A05** | `/products?bestsellers=true` | `GET` | Filtered array where `isBestSeller === true` | **PASS** |
| **TC-A06** | `/products/slug/:slug` | `GET` | Full product specification object | **PASS** |
| **TC-A07** | `/products/slug/:slug/related` | `GET` | Array of 4 related product recommendations | **PASS** |
| **TC-A08** | `/products/slug/:slug/frequently-bought` | `GET` | Array of complementary product recommendations | **PASS** |
| **TC-A09** | `/auth/login` | `POST` | User object + bearer token with customer role | **PASS** |
| **TC-A10** | `/auth/login` (Admin) | `POST` | User object + bearer token with admin role | **PASS** |
| **TC-A11** | `/auth/register` | `POST` | New user record + bearer token | **PASS** |
| **TC-A12** | `/orders/stats` | `GET` | Operational KPIs: totalOrders, revenue, pendingOrders | **PASS** |
| **TC-A13** | `/orders/all` | `GET` | Complete list of all store orders for admin | **PASS** |
| **TC-A14** | `/orders/:id` | `GET` | Specific order details and associated payment status | **PASS** |
| **TC-A15** | `/orders/:id/status` | `PUT` | Updates order status string and confirms success | **PASS** |
| **TC-A16** | `/orders/:id/invoice` | `GET` | Invoice record with invoice number, GSTIN, items | **PASS** |
| **TC-A17** | `/payments/create-order` | `POST` | New order with unique `_id` and `ORD-` prefix | **PASS** |
| **TC-A18** | `/coupons` | `GET` | Active promotional coupon code and discount | **PASS** |

---

## 4. Security Test Cases (`tests/security/security_audit.test.mjs`)

| TC ID | Category | Attack / Test Scenario | Expected Defense | Status |
| :---: | :--- | :--- | :--- | :---: |
| **TC-S01** | SQL Injection | `' OR '1'='1` in search query | Sanitized; returns 0 matches, no crash | **PASS** |
| **TC-S02** | SQL Injection | `'; DROP TABLE products; --` in parameters | Treated as string literal, no SQL executed | **PASS** |
| **TC-S03** | Stored XSS | `<script>alert('XSS')</script>` in search | Filtered safely; no unescaped DOM execution | **PASS** |
| **TC-S04** | Stored XSS | Malicious payload in shipping address | Stored as text string, never evaluated | **PASS** |
| **TC-S05** | Access Control | Customer role accessing admin routes | Blocked by role guard; redirected to login/home | **PASS** |
| **TC-S06** | Data Leakage | Inspect login response payload | Passwords, hashes, and salt keys absent | **PASS** |
| **TC-S07** | Privacy | Customer reading orders list | No payment card numbers (PAN) or CVVs exposed | **PASS** |

---

## 5. Performance, Load & Stress Test Cases (`tests/performance/load_and_stress.test.mjs`)

| TC ID | Test Scenario | Concurrency | Success Metric | Measured Duration | Status |
| :---: | :--- | :---: | :--- | :---: | :---: |
| **TC-P01** | Concurrent Catalog Fetch | 10 Users | 100% success, latency $< 100\text{ ms}$ | $5.9\text{ ms}$ | **PASS** |
| **TC-P02** | Mixed Endpoint Traffic | 50 Users | 100% success across 5 routes | $0.9\text{ ms}$ | **PASS** |
| **TC-P03** | High Search Traffic | 100 Users | 100% success, zero memory leaks | $1.7\text{ ms}$ | **PASS** |
| **TC-P04** | Order Creation Burst | 200 Users | Unique order IDs, $< 500\text{ ms}$ | $252.4\text{ ms}$ | **PASS** |
| **TC-P05** | Fault Injection & Corrupted Inputs | N/A | Graceful error fallback, no uncaught exceptions | $2.5\text{ ms}$ | **PASS** |

---

## 6. End-to-End Acceptance Test Cases (`tests/e2e/customer_acceptance_workflow.test.mjs`)

| Step # | User Journey Milestone | Action Executed | Verification Assertion | Status |
| :---: | :--- | :--- | :--- | :---: |
| **1** | Storefront Discovery | Visit Nova Mart Home | Categories $\ge 6$, Deals populated | **PASS** |
| **2** | Account Registration | Register as `Aarav Sharma` | Token returned, role `customer` | **PASS** |
| **3** | User Authentication | Log in with credentials | Session established | **PASS** |
| **4** | Catalog Navigation | Filter by Electronics category | All items match category | **PASS** |
| **5** | Product Search | Search for `"earbuds"` | Matching item located | **PASS** |
| **6** | Product Inspection | Open item detail view | Price, rating, and stock verified | **PASS** |
| **7** | Add to Cart | Add item to cart | Item added with quantity 1 | **PASS** |
| **8** | Quantity Stepper | Increment quantity to 2 | Subtotal doubles accurately | **PASS** |
| **9** | Checkout Initiation | Check free delivery threshold | Free shipping granted ($\ge$ ₹999) | **PASS** |
| **10** | Address Selection | Provide delivery address | Postal code and street verified | **PASS** |
| **11** | Order Placement | Choose COD payment | Order generated with `ORD-` prefix | **PASS** |
| **12** | Order Confirmation | Confirm order receipt | Status `confirmed`, payment `cod` | **PASS** |
| **13** | Order History Check | Open `/orders/my` | New order appears in order list | **PASS** |
| **14** | Session Termination | Trigger Logout | Token cleared, state reset to null | **PASS** |
