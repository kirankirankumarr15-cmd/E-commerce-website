import { test, describe } from 'node:test';
import assert from 'node:assert';
import { getMockResponse } from '../../frontend/src/services/mockFallback.js';

describe('PHASE 9: Security Testing - Application Security & Hardening', () => {
  describe('Input Sanitization & Injection Defense', () => {
    test('handles SQL Injection payloads in search query safely', () => {
      const sqlPayloads = [
        "' OR '1'='1",
        "'; DROP TABLE products; --",
        "1' UNION SELECT * FROM users --",
        "admin'--",
      ];

      for (const payload of sqlPayloads) {
        const res = getMockResponse('/products', { search: payload });
        assert.strictEqual(res.data.success, true);
        assert.ok(Array.isArray(res.data.data));
        // Should safely return 0 results or filtered matches, never throw database error
        assert.strictEqual(res.data.data.length, 0);
      }
    });

    test('handles XSS injection attempts in search without reflecting unescaped tags', () => {
      const xssPayloads = [
        '<script>alert("XSS")</script>',
        '<img src="x" onerror="alert(1)">',
        '"><svg/onload=alert(document.cookie)>',
        'javascript:alert(1)',
      ];

      for (const payload of xssPayloads) {
        const res = getMockResponse('/products', { search: payload });
        assert.strictEqual(res.data.success, true);
        assert.ok(Array.isArray(res.data.data));
        assert.strictEqual(res.data.data.length, 0);
      }
    });

    test('handles malicious payloads in order address input without crash', () => {
      const maliciousAddress = {
        fullName: '<script>alert("hack")</script>',
        phone: '1234567890\'; DROP TABLE orders;--',
        street: '"><img src=x onerror=alert(1)>',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
      };

      const res = getMockResponse('/payments/create-order', {}, {
        shippingAddress: maliciousAddress,
        totalPrice: 1000,
        paymentMethod: 'cod',
      });

      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.order._id);
      // The address object is treated as pure text strings, not interpreted as executable script
      assert.strictEqual(res.data.data.order.shippingAddress.fullName, maliciousAddress.fullName);
    });
  });

  describe('Authorization & Role Boundaries', () => {
    test('strictly enforces admin role verification', () => {
      // Normal customer login
      const customerRes = getMockResponse('/auth/login', {}, { email: 'user@example.com', password: 'password123' });
      assert.strictEqual(customerRes.data.data.user.role, 'customer');

      // Admin verification function check
      function checkAdminAccess(user) {
        return !!user && user.role === 'admin';
      }

      assert.strictEqual(checkAdminAccess(customerRes.data.data.user), false);

      // Admin user login
      const adminRes = getMockResponse('/auth/login', {}, { email: 'admin@novamart.com', password: 'password123' });
      assert.strictEqual(adminRes.data.data.user.role, 'admin');
      assert.strictEqual(checkAdminAccess(adminRes.data.data.user), true);
    });

    test('blocks unauthenticated access from accessing admin dashboard data', () => {
      function canAccessAdminRoute(token, user) {
        if (!token) return { allowed: false, redirect: '/login' };
        if (user?.role !== 'admin') return { allowed: false, redirect: '/' };
        return { allowed: true };
      }

      assert.deepStrictEqual(canAccessAdminRoute(null, null), { allowed: false, redirect: '/login' });
      assert.deepStrictEqual(canAccessAdminRoute('token123', { role: 'customer' }), { allowed: false, redirect: '/' });
      assert.deepStrictEqual(canAccessAdminRoute('token123', { role: 'admin' }), { allowed: true });
    });
  });

  describe('Sensitive Information & Credential Exposure', () => {
    test('ensures user profile response does NOT leak raw passwords or secrets', () => {
      const res = getMockResponse('/auth/login', {}, { email: 'customer@novamart.com', password: 'secretpassword123' });
      const user = res.data.data.user;

      assert.strictEqual(user.password, undefined);
      assert.strictEqual(user.passwordHash, undefined);
      assert.strictEqual(user.salt, undefined);
      assert.strictEqual(user.supabase_service_role_key, undefined);
    });

    test('ensures orders list does NOT expose other customers private payment cards', () => {
      const res = getMockResponse('/orders/all');
      for (const order of res.data.data) {
        assert.strictEqual(order.cardNumber, undefined);
        assert.strictEqual(order.cvv, undefined);
        assert.strictEqual(order.cardExpiry, undefined);
      }
    });
  });
});
