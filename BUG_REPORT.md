# NOVA MART – QA Bug Classification & Resolution Report

**Document Version:** 1.0  
**Status:** All Identified Bugs Have Been Fixed & Retested  

---

## Bug Summary Dashboard

| Severity | Total Found | Resolved | Open |
| :--- | :---: | :---: | :---: |
| **Critical** | 2 | 2 | 0 |
| **High** | 3 | 3 | 0 |
| **Medium** | 2 | 2 | 0 |
| **Low** | 1 | 1 | 0 |
| **Total** | **8** | **8** | **0** |

---

## Detailed Bug Reports

### BUG-01: `Cannot read properties of undefined (reading 'role')` on Login/Registration
- **Severity:** **Critical**
- **Affected File:** `frontend/src/context/AuthContext.jsx`, `frontend/src/pages/LoginPage.jsx`
- **Steps to Reproduce:**
  1. Open `/login` or `/register` on the live deployment.
  2. Enter credentials or click "Send OTP".
- **Expected Result:** User is authenticated and redirected to `/home` or `/admin`.
- **Actual Result:** Red error toast popped up: `Cannot read properties of undefined (reading 'role')` because mock login returned an empty array instead of a user envelope.
- **Root Cause:** Direct property access `result.role` when `result` was `undefined`.
- **Fix Implemented:** Added fallback user creation envelope in `AuthContext.jsx`, supported optional chaining `result?.role`, and returned proper mock user payloads.
- **Retest Status:** **VERIFIED FIXED (Pass)**

---

### BUG-02: `ReferenceError: localStorage is not defined` during SSR & Automated Testing
- **Severity:** **Critical**
- **Affected File:** `frontend/src/services/mockFallback.js`
- **Steps to Reproduce:**
  1. Run unit or API integration tests using Node.js test runner (`node --test`).
  2. Invoke `getMockResponse('/auth/login')`.
- **Expected Result:** Function executes smoothly in both client browser and server/Node environments.
- **Actual Result:** Uncaught exception: `ReferenceError: localStorage is not defined`.
- **Root Cause:** Direct unshielded calls to `localStorage.getItem('nova_user_email')` without checking `typeof localStorage !== 'undefined'`.
- **Fix Implemented:** Built an isomorphic `safeStorage` wrapper with an in-memory fallback store (`memoryStore`) that automatically works in Node.js, SSR, and browsers with disabled cookies.
- **Retest Status:** **VERIFIED FIXED (Pass)**

---

### BUG-03: `related.map is not a function` Crash on Product Details Page
- **Severity:** **High**
- **Affected File:** `frontend/src/services/mockFallback.js`, `frontend/src/pages/ProductDetailsPage.jsx`
- **Steps to Reproduce:**
  1. Navigate to `/product/nova-soundpro-wireless-earbuds`.
  2. Page calls `productService.getRelated(slug)`.
- **Expected Result:** Displays Related Products carousel at the bottom of the page.
- **Actual Result:** Crashed with TypeError because the mock endpoint `/products/slug/:slug/related` matched the prefix `/products/slug/` and returned a single product object instead of an array.
- **Fix Implemented:** Added explicit handlers in `mockFallback.js` for `/related` and `/frequently-bought` returning array slices of `FALLBACK_PRODUCTS`.
- **Retest Status:** **VERIFIED FIXED (Pass)**

---

### BUG-04: Category Page Failing to Load Filtered Products
- **Severity:** **High**
- **Affected File:** `frontend/src/pages/CategoryPage.jsx`, `frontend/src/services/mockFallback.js`
- **Steps to Reproduce:**
  1. Click any category card from homepage (e.g. `/category/electronics`).
  2. Page calls `categoryService.getBySlug('electronics')`.
- **Expected Result:** Displays the Category Banner and products filtered by that category.
- **Actual Result:** Returned the entire categories array, causing `catRes.data.data._id` to be undefined.
- **Fix Implemented:** Added route handler for `/categories/:slug` returning the individual matching category object with `name`, `slug`, and `_id`.
- **Retest Status:** **VERIFIED FIXED (Pass)**

---

### BUG-05: Missing Address Edit Functionality on Profile Page
- **Severity:** **Medium**
- **Affected File:** `frontend/src/pages/ProfilePage.jsx`
- **Steps to Reproduce:**
  1. Open `/profile`.
  2. Scroll down to "Saved Addresses".
- **Expected Result:** User can edit existing addresses to update PIN code, street, or toggle default address.
- **Actual Result:** Only a trash delete icon was rendered. No option existed to edit an existing address.
- **Fix Implemented:** Added an interactive `✏️ Edit` button on each address card opening a pre-filled editor form with in-place updates.
- **Retest Status:** **VERIFIED FIXED (Pass)**

---

### BUG-06: Address `_id` Collision During Rapid Consecutive Creation
- **Severity:** **Medium**
- **Affected File:** `frontend/src/pages/ProfilePage.jsx`
- **Steps to Reproduce:**
  1. Programmatically or rapidly create multiple addresses within 1 millisecond.
- **Expected Result:** Each address has a unique identifier.
- **Actual Result:** `_id: 'addr_' + Date.now()` assigned the same ID to multiple addresses, causing address edits to overwrite all sibling addresses simultaneously.
- **Fix Implemented:** Enhanced ID generator: `_id: 'addr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)`.
- **Retest Status:** **VERIFIED FIXED (Pass)**

---

### BUG-07: Vercel SPA Direct Route Refresh 404 Error
- **Severity:** **High**
- **Affected File:** `frontend/vercel.json`
- **Steps to Reproduce:**
  1. Navigate to `/shop?bestsellers=true` or `/orders` or `/login`.
  2. Press hard-refresh (`F5` or `Ctrl + R`).
- **Expected Result:** The page reloads and displays the requested route.
- **Actual Result:** Vercel returned 404 Not Found because single-page client-side routes were not redirected to `index.html`.
- **Fix Implemented:** Created `frontend/vercel.json` with SPA rewrite rule: `{"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]}`.
- **Retest Status:** **VERIFIED FIXED (Pass)**

---

### BUG-08: Locked / Disabled Email Field in Profile Page
- **Severity:** **Low**
- **Affected File:** `frontend/src/pages/ProfilePage.jsx`
- **Steps to Reproduce:**
  1. Navigate to `/profile`.
  2. Try to change the default placeholder email to a real email address.
- **Expected Result:** Email field is editable.
- **Actual Result:** Input field had `disabled` attribute.
- **Fix Implemented:** Unlocked email input field and wired it to `react-hook-form` so changes persist to storage upon clicking "Save Changes".
- **Retest Status:** **VERIFIED FIXED (Pass)**
