import { test, describe } from 'node:test';
import assert from 'node:assert';
import { getMockResponse, FALLBACK_CATEGORIES, FALLBACK_PRODUCTS, FALLBACK_ORDERS } from '../../frontend/src/services/mockFallback.js';

describe('PHASE 13: API Testing - Endpoints & Data Contracts', () => {
  describe('Categories Endpoints', () => {
    test('GET /categories returns full list of categories', () => {
      const res = getMockResponse('/categories');
      assert.strictEqual(res.data.success, true);
      assert.ok(Array.isArray(res.data.data));
      assert.strictEqual(res.data.data.length, FALLBACK_CATEGORIES.length);
      assert.ok(res.data.data.every((c) => c.slug && c.name));
    });

    test('GET /categories/:slug returns single matching category object', () => {
      const res = getMockResponse('/categories/electronics');
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.slug, 'electronics');
      assert.strictEqual(res.data.data.name, 'Electronics');
    });
  });

  describe('Products Endpoints', () => {
    test('GET /products returns paginated list of catalog products', () => {
      const res = getMockResponse('/products', { page: 1, limit: 12 });
      assert.strictEqual(res.data.success, true);
      assert.ok(Array.isArray(res.data.data));
      assert.ok(res.data.data.length > 0);
      assert.ok(res.data.pagination);
      assert.strictEqual(res.data.pagination.page, 1);
      assert.strictEqual(res.data.pagination.limit, 12);
    });

    test('GET /products?deals=true filters by deals', () => {
      const res = getMockResponse('/products', { deals: 'true' });
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.every((p) => p.isDeal === true));
    });

    test('GET /products?bestsellers=true filters by bestsellers', () => {
      const res = getMockResponse('/products', { bestsellers: 'true' });
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.every((p) => p.isBestSeller === true));
    });

    test('GET /products/slug/:slug returns single product with full specifications', () => {
      const res = getMockResponse('/products/slug/nova-soundpro-wireless-earbuds');
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.slug, 'nova-soundpro-wireless-earbuds');
      assert.ok(res.data.data.price > 0);
      assert.ok(res.data.data.stock > 0);
      assert.ok(Array.isArray(res.data.data.images));
    });

    test('GET /products/slug/:slug/related returns array of related products', () => {
      const res = getMockResponse('/products/slug/nova-soundpro-wireless-earbuds/related');
      assert.strictEqual(res.data.success, true);
      assert.ok(Array.isArray(res.data.data));
      assert.ok(res.data.data.length > 0);
    });

    test('GET /products/slug/:slug/frequently-bought returns array of complementary items', () => {
      const res = getMockResponse('/products/slug/nova-soundpro-wireless-earbuds/frequently-bought');
      assert.strictEqual(res.data.success, true);
      assert.ok(Array.isArray(res.data.data));
      assert.ok(res.data.data.length > 0);
    });
  });

  describe('Auth Endpoints', () => {
    test('POST /auth/login returns user session with JWT token and customer role', () => {
      const res = getMockResponse('/auth/login', {}, { email: 'customer@novamart.com', password: 'password123' });
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.token);
      assert.strictEqual(res.data.data.user.role, 'customer');
      assert.strictEqual(res.data.data.user.email, 'customer@novamart.com');
    });

    test('POST /auth/login with admin email returns admin role', () => {
      const res = getMockResponse('/auth/login', {}, { email: 'admin@novamart.com', password: 'password123' });
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.user.role, 'admin');
    });

    test('POST /auth/register creates new account payload', () => {
      const res = getMockResponse('/auth/register', {}, {
        firstName: 'Vikram',
        lastName: 'Singh',
        email: 'vikram@example.com',
      });
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.token);
      assert.strictEqual(res.data.data.user.email, 'vikram@example.com');
    });
  });

  describe('Orders & Admin Endpoints', () => {
    test('GET /orders/stats returns admin operational KPI metrics', () => {
      const res = getMockResponse('/orders/stats');
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(typeof res.data.data.totalOrders, 'number');
      assert.strictEqual(typeof res.data.data.totalRevenue, 'number');
      assert.strictEqual(typeof res.data.data.pendingOrders, 'number');
      assert.strictEqual(typeof res.data.data.totalProducts, 'number');
      assert.ok(res.data.data.totalRevenue > 0);
    });

    test('GET /orders/all returns array of all store orders for admin', () => {
      const res = getMockResponse('/orders/all');
      assert.strictEqual(res.data.success, true);
      assert.ok(Array.isArray(res.data.data));
      assert.ok(res.data.data.length >= 3);
      assert.ok(res.data.data[0].orderNumber);
      assert.ok(res.data.data[0].totalPrice > 0);
    });

    test('GET /orders/:id returns detailed order info with payment details', () => {
      const res = getMockResponse('/orders/ord_101');
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.order._id, 'ord_101');
      assert.strictEqual(res.data.data.order.orderNumber, 'ORD-948123');
      assert.ok(res.data.data.payment);
      assert.ok(Array.isArray(res.data.data.order.items));
    });

    test('PUT /orders/:id/status updates order status', () => {
      const res = getMockResponse('/orders/ord_101/status', {}, { orderStatus: 'shipped' });
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.message.includes('updated'));
    });

    test('GET /orders/:id/invoice returns generated invoice data', () => {
      const res = getMockResponse('/orders/ord_101/invoice');
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.invoiceNumber.startsWith('INV-'));
      assert.ok(res.data.data.gstin);
      assert.ok(Array.isArray(res.data.data.items));
    });
  });

  describe('Payment & Coupon Endpoints', () => {
    test('POST /payments/create-order generates new order record', () => {
      const res = getMockResponse('/payments/create-order', {}, {
        paymentMethod: 'cod',
        totalPrice: 2799,
        shippingAddress: {
          fullName: 'Test User',
          phone: '9999999999',
          street: '1 Test Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
        },
      });
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.order);
      assert.ok(res.data.data.order.orderNumber.startsWith('ORD-'));
      assert.strictEqual(res.data.data.order.totalPrice, 2799);
      assert.strictEqual(res.data.data.order.paymentMethod, 'cod');
    });

    test('GET /coupons returns available discount coupon code', () => {
      const res = getMockResponse('/coupons');
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.code, 'NOVA50');
      assert.strictEqual(res.data.data.discount, 50);
    });
  });
});
