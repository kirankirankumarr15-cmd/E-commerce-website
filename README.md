# NOVA MART — Phase 1

**Everything You Need. One Smart Store.**

Production-quality e-commerce foundation built with React, Node.js, Express, and MongoDB.

---

## 1. Folder Structure

```
nova-mart/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── index.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── wishlistController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── models/
│   │   ├── Cart.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── User.js
│   │   └── Wishlist.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── wishlistRoutes.js
│   ├── services/          (Phase 2)
│   ├── validators/
│   │   └── authValidator.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── asyncHandler.js
│   │   ├── generateToken.js
│   │   └── seed.js
│   ├── webhooks/
│   │   └── index.js       (Phase 2 payment webhooks)
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── CategoryCard.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductSection.jsx
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── SearchBar.jsx
│   │   │   ├── home/
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── Newsletter.jsx
│   │   │   │   ├── Reviews.jsx
│   │   │   │   ├── WhatsAppCTA.jsx
│   │   │   │   └── WhyChooseUs.jsx
│   │   │   └── ui/
│   │   │       ├── Badge.jsx
│   │   │       ├── Button.jsx
│   │   │       ├── Dropdown.jsx
│   │   │       ├── EmptyState.jsx
│   │   │       ├── ErrorState.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Pagination.jsx
│   │   │       ├── Skeleton.jsx
│   │   │       └── Toast.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   ├── ToastContext.jsx
│   │   │   └── WishlistContext.jsx
│   │   ├── hooks/
│   │   │   └── useDebounce.js
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CategoryPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── ProductDetailsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ShopPage.jsx
│   │   │   └── WishlistPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── index.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 2. Database Schema

### Users
| Field | Type | Description |
|-------|------|-------------|
| firstName | String | Required |
| lastName | String | Required |
| email | String | Unique, required |
| password | String | Hashed (bcrypt) |
| phone | String | Optional |
| avatar | String | Profile image URL |
| role | Enum | `customer` \| `admin` |
| addresses | Array | Embedded address subdocuments |
| isActive | Boolean | Account status |
| timestamps | Date | createdAt, updatedAt |

### Products
| Field | Type | Description |
|-------|------|-------------|
| name | String | Required |
| slug | String | Auto-generated |
| description | String | Required |
| shortDescription | String | Optional |
| price | Number | Original price |
| discount | Number | Percentage (0-100) |
| finalPrice | Number | Auto-calculated |
| category | ObjectId | Ref: Category |
| brand | String | Default: NOVA MART |
| images | Array | url, alt, type (main/front/side/back/detail) |
| stock | Number | Inventory count |
| sku | String | Unique product code |
| rating | Number | 0-5 |
| numReviews | Number | Review count |
| specifications | Map | Key-value pairs |
| tags | Array | Search tags |
| isFeatured/isTrending/isBestSeller/isNewArrival/isDeal | Boolean | Flags |
| isActive | Boolean | Visibility |
| timestamps | Date | createdAt, updatedAt |

### Categories
| Field | Type | Description |
|-------|------|-------------|
| name | String | Unique, required |
| slug | String | Auto-generated |
| description | String | Optional |
| image | String | Category image URL |
| parent | ObjectId | Ref: Category (nested) |
| isActive | Boolean | Visibility |
| sortOrder | Number | Display order |

### Carts
| Field | Type | Description |
|-------|------|-------------|
| user | ObjectId | Ref: User (unique) |
| items | Array | product, quantity, price |
| totalItems | Number | Auto-calculated |
| totalPrice | Number | Auto-calculated |

### Wishlists
| Field | Type | Description |
|-------|------|-------------|
| user | ObjectId | Ref: User (unique) |
| products | Array | Ref: Product |

### Orders
| Field | Type | Description |
|-------|------|-------------|
| user | ObjectId | Ref: User |
| orderNumber | String | Auto-generated |
| items | Array | product snapshot |
| shippingAddress | Object | Delivery details |
| paymentMethod | Enum | cod \| card \| upi \| wallet |
| paymentStatus | Enum | pending \| paid \| failed \| refunded |
| orderStatus | Enum | pending \| confirmed \| processing \| shipped \| delivered \| cancelled |
| itemsPrice/shippingPrice/taxPrice/totalPrice | Number | Pricing |
| timestamps | Date | createdAt, updatedAt |

---

## 3. Components Created

### UI Components
- **Button** — Variants (primary, secondary, outline, ghost, danger), sizes, loading state, Framer Motion feedback
- **Badge** — Status and label badges
- **Modal** — Animated dialog with backdrop
- **Toast** — Notification system with success/error/warning/info
- **Skeleton** — Loading placeholders (card, grid)
- **EmptyState** — Empty data states with CTA
- **ErrorState** — Error display with retry
- **Pagination** — Page navigation
- **Dropdown** — Menu and select dropdowns

### Common Components
- **Navbar** — Desktop + mobile navigation, search, cart/wishlist badges
- **Footer** — Links, contact, social
- **SearchBar** — Product search with navigation
- **ProductCard** — Image zoom, wishlist/cart actions, pricing
- **CategoryCard** — Category image cards
- **ProductSection** — Reusable section wrapper
- **ProtectedRoute** — Auth and admin guards

### Home Sections
- Hero, WhyChooseUs, Reviews, WhatsAppCTA, Newsletter

---

## 4. API Routes

### Auth — `/api/auth`
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | /register | Public | Create account |
| POST | /login | Public | Sign in |
| POST | /forgot-password | Public | Password reset (Phase 2) |
| GET | /profile | Protected | Get profile |
| PUT | /profile | Protected | Update profile |
| POST | /addresses | Protected | Add address |
| PUT | /addresses/:id | Protected | Update address |
| DELETE | /addresses/:id | Protected | Delete address |

### Products — `/api/products`
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | / | Public | List products (filter, sort, paginate) |
| GET | /featured | Public | Featured products |
| GET | /trending | Public | Trending products |
| GET | /best-sellers | Public | Best sellers |
| GET | /new-arrivals | Public | New arrivals |
| GET | /deals | Public | Deal products |
| GET | /slug/:slug | Public | Product by slug |
| GET | /:id | Public | Product by ID |

### Categories — `/api/categories`
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | / | Public | All categories |
| GET | /:slug | Public | Category by slug |

### Cart — `/api/cart`
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | / | Protected | Get cart |
| POST | /items | Protected | Add item |
| PUT | /items/:id | Protected | Update quantity |
| DELETE | /items/:id | Protected | Remove item |
| DELETE | / | Protected | Clear cart |

### Wishlist — `/api/wishlist`
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | / | Protected | Get wishlist |
| POST | / | Protected | Add product |
| DELETE | /:productId | Protected | Remove product |

### Orders — `/api/orders`
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | / | Protected | Place order |
| GET | /my | Protected | User orders |
| GET | /:id | Protected | Order details |
| GET | /stats | Admin | Dashboard stats |
| GET | /all | Admin | All orders |
| PUT | /:id/status | Admin | Update status |

### Health — `/api/health`
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | / | Public | API health check |

---

## 5. Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nova-mart
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
WHATSAPP_NUMBER=919876543210
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=/api
```

---

## 6. Installation Commands

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Setup

```bash
# Clone / navigate to project
cd "E-commerce website"

# Backend setup
cd backend
npm install
cp .env.example .env    # Edit with your values
npm run seed            # Seed database with sample data
npm run dev             # Start on http://localhost:5000

# Frontend setup (new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev             # Start on http://localhost:5173
```

### Seed Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@novamart.com | admin123 |
| Customer | customer@novamart.com | customer123 |

---

## 7. Testing Instructions

### Manual Testing Checklist

1. **Home Page** — Verify hero, categories, product sections, reviews, newsletter
2. **Shop** — Browse products, sort, filter, pagination, search
3. **Category** — Click a category, verify filtered products
4. **Product Details** — Image gallery, add to cart, wishlist, specs
5. **Register** — Create new account with validation
6. **Login** — Sign in with seed accounts
7. **Profile** — Update info, manage addresses
8. **Wishlist** — Add/remove products
9. **Cart** — Add items, update quantity, remove
10. **Checkout** — 3-step flow (Shipping → Payment → Review), place COD order
11. **Orders** — View order history
12. **Admin** — Login as admin, view dashboard stats, update order status
13. **404** — Visit invalid URL
14. **Responsive** — Test on mobile, tablet, desktop
15. **Accessibility** — Tab navigation, screen reader labels

### API Testing (curl)

```bash
# Health check
curl http://localhost:5000/api/health

# Get products
curl http://localhost:5000/api/products

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@novamart.com","password":"customer123"}'
```

---

## 8. Phase 1 Completion Checklist

- [x] Project structure (frontend/ + backend/)
- [x] Design system (colors, typography, spacing, shadows)
- [x] Reusable UI components (Button, Card, Modal, Toast, etc.)
- [x] Navbar (desktop + mobile, no Payment link)
- [x] Footer with links and contact
- [x] Home page (all 13 sections)
- [x] Shop page with filters, sort, pagination
- [x] Category page
- [x] Product details with image gallery
- [x] Authentication (register, login, logout, forgot password foundation)
- [x] Protected routes (customer + admin)
- [x] Profile with address management
- [x] Wishlist
- [x] Cart
- [x] Checkout (3-step: Shipping → Payment → Review)
- [x] Orders
- [x] Admin dashboard
- [x] 404 page
- [x] MongoDB models (users, products, categories, carts, wishlists, orders)
- [x] JWT + bcrypt authentication
- [x] API routes with validation and error handling
- [x] Framer Motion animations (respects prefers-reduced-motion)
- [x] Responsive design (mobile, tablet, laptop, desktop)
- [x] Loading, skeleton, empty, and error states
- [x] Accessibility (semantic HTML, labels, focus, contrast)
- [x] Seed data with 12 products and 6 categories
- [x] Environment configuration
- [x] Payment gateway (Phase 2 — Razorpay + COD)
- [ ] Email notifications (Phase 3)
- [ ] Production deployment (Phase 3)

---

## 9. Phase 2 — Complete Shopping Journey

### Payment Architecture

- **Gateway:** Razorpay (India) — UPI, Cards, Net Banking, Wallets via Checkout
- **COD:** Cash on Delivery with pending payment status
- **Security:** No card/CVV/UPI PIN stored; backend signature verification; webhook HMAC; duplicate-payment guard (`payment.status === 'paid'`)
- **Cart lifecycle:** Online orders keep cart until verify/webhook success; COD clears cart on place order

### Payment Flow

1. Checkout → address → delivery → payment method  
2. `POST /api/payments/create-order` creates Order + Payment (+ Razorpay order if online)  
3. Customer pays in Razorpay Checkout (sandbox)  
4. `POST /api/payments/verify` validates signature + fetches payment from Razorpay  
5. Webhook `payment.captured` / `payment.failed` as backup  
6. Stock deducted, invoice number assigned, cart cleared, order confirmed  

### Database Changes (Phase 2)

| Model | Additions |
|-------|-----------|
| Order | invoiceNumber, deliveryOption, couponCode, discountPrice, stockDeducted, paymentReference, packed/out_for_delivery statuses |
| Payment | razorpayOrderId, razorpayPaymentId, signature, webhookReceived, failureReason |
| Review | rating, comment, verified purchase |
| Coupon | code, type (percent/flat), value, limits |
| Product | salesCount |
| Cart | couponCode, savedForLater |

### Phase 2 APIs

| Method | Route | Access |
|--------|-------|--------|
| POST | /api/payments/create-order | Protected |
| POST | /api/payments/verify | Protected |
| POST | /api/payments/webhook | Public (signed) |
| GET | /api/payments/order/:orderId | Protected |
| GET/POST/DELETE | /api/reviews… | Mixed |
| GET/POST/DELETE | /api/coupons… | Protected |
| POST | /api/orders/:id/cancel | Protected |
| POST | /api/orders/:id/reorder | Protected |
| GET | /api/orders/:id/invoice | Protected |

### Environment Variables (Phase 2)

```env
# Backend additions
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx
```

### Test Cases

1. Browse → filter/sort/search → product gallery/zoom → add to cart / buy now / wishlist  
2. Cart qty, save for later, apply/remove coupon (`WELCOME10`, `FLAT100`, `NOVA20`)  
3. Checkout address (save to profile) → standard/express → COD → confirmation + invoice  
4. Online payment (Razorpay test mode) → verify → stock down → invoice download  
5. Cancel payment mid-checkout → cart retained  
6. Orders: tracking timeline, cancel (pending/confirmed/packed), reorder  
7. Product reviews (verified purchase after delivered order)  
8. Admin: dashboard stats + update order status  

### Phase 2 Completion Checklist

- [x] Product listing, filters, sort, pagination, search suggestions  
- [x] Product page (gallery, zoom, related, FBT, recently viewed)  
- [x] Cart + coupons + save for later  
- [x] Wishlist → move to cart  
- [x] Checkout (address, delivery, payment)  
- [x] Razorpay sandbox + COD  
- [x] Payment verify + webhook signature (raw body)  
- [x] Orders, invoice download, cancel, reorder, status tracker  
- [x] Reviews + coupons  
- [ ] Email notifications (deferred)  
- [ ] Admin product CRUD (deferred)  
- [ ] Production deployment (deferred)  

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, React Router, Tailwind CSS v4 |
| Animation | Framer Motion |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Payments | Razorpay (India) |

---

**Phase 2 is complete** for the customer shopping journey (catalog → cart → checkout → pay → order → invoice). Email and full admin catalog CRUD remain for a later phase.
