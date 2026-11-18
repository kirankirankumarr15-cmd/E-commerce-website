const { test, describe } = require('node:test');
const assert = require('node:assert');

// 1. Utility functions
function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

function calculateDiscount(price, discountPercent) {
  if (discountPercent <= 0) return price;
  if (discountPercent >= 100) return 0;
  return Math.round(price - (price * discountPercent) / 100);
}

function truncate(str, length = 100) {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
}

// 2. Validation Schemas logic
function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

function validatePassword(password) {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 6;
}

function validateRegistration({ firstName, lastName, email, password, confirmPassword }) {
  const errors = [];
  if (!firstName || !firstName.trim()) errors.push('First name is required');
  if (!lastName || !lastName.trim()) errors.push('Last name is required');
  if (!validateEmail(email)) errors.push('Invalid email format');
  if (!validatePassword(password)) errors.push('Password must be at least 6 characters');
  if (password !== confirmPassword) errors.push('Passwords do not match');
  return { isValid: errors.length === 0, errors };
}

// 3. Cart calculations
function calculateCartTotals(items = [], deliveryOption = 'standard', couponDiscount = 0) {
  const itemsPrice = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const isFreeShipping = itemsPrice >= 999;
  const shippingPrice = isFreeShipping ? 0 : (deliveryOption === 'express' ? 149 : 49);
  const discountPrice = Math.min(couponDiscount, itemsPrice);
  const taxableAmount = Math.max(0, itemsPrice - discountPrice);
  const taxPrice = Math.round(taxableAmount * 0.18);
  const totalPrice = taxableAmount + shippingPrice + taxPrice;

  return {
    itemsPrice,
    shippingPrice,
    discountPrice,
    taxPrice,
    totalPrice,
    isFreeShipping,
  };
}

describe('PHASE 1: Unit Testing - Validation & Calculations', () => {
  describe('Email & Password Validation', () => {
    test('accepts valid email addresses', () => {
      assert.strictEqual(validateEmail('customer@novamart.com'), true);
      assert.strictEqual(validateEmail('kiran.kumar@gmail.com'), true);
      assert.strictEqual(validateEmail('admin+ops@novamart.in'), true);
    });

    test('rejects invalid email formats', () => {
      assert.strictEqual(validateEmail(''), false);
      assert.strictEqual(validateEmail('invalid-email'), false);
      assert.strictEqual(validateEmail('missing@domain'), false);
      assert.strictEqual(validateEmail('spaces in@email.com'), false);
    });

    test('validates password minimum length of 6 characters', () => {
      assert.strictEqual(validatePassword('123456'), true);
      assert.strictEqual(validatePassword('admin123!'), true);
      assert.strictEqual(validatePassword('12345'), false);
      assert.strictEqual(validatePassword(''), false);
    });

    test('validates registration form correctly', () => {
      const valid = validateRegistration({
        firstName: 'Kiran',
        lastName: 'Kumar',
        email: 'kiran@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      assert.strictEqual(valid.isValid, true);
      assert.strictEqual(valid.errors.length, 0);

      const mismatch = validateRegistration({
        firstName: 'Kiran',
        lastName: 'Kumar',
        email: 'kiran@example.com',
        password: 'password123',
        confirmPassword: 'wrongpassword',
      });
      assert.strictEqual(mismatch.isValid, false);
      assert.ok(mismatch.errors.includes('Passwords do not match'));
    });
  });

  describe('Pricing & Discount Calculations', () => {
    test('calculates correct discounted price with percentages', () => {
      // ₹4999 with 25% discount = ₹3749.25 rounded to ₹3749
      assert.strictEqual(calculateDiscount(4999, 25), 3749);
      // ₹3999 with 30% discount = ₹2799.30 rounded to ₹2799
      assert.strictEqual(calculateDiscount(3999, 30), 2799);
      // 0% discount retains full price
      assert.strictEqual(calculateDiscount(1000, 0), 1000);
      // 100% discount results in 0
      assert.strictEqual(calculateDiscount(1000, 100), 0);
    });

    test('formats Indian Rupee (INR) currency correctly', () => {
      const formatted = formatPrice(3749);
      // Checks for ₹ symbol and proper number
      assert.ok(formatted.includes('3,749') || formatted.includes('3749'));
      assert.ok(formatted.includes('₹'));
    });

    test('truncates strings properly with ellipsis', () => {
      assert.strictEqual(truncate('Short text', 50), 'Short text');
      assert.strictEqual(truncate('This is a longer description that exceeds twenty characters', 20), 'This is a longer des...');
      assert.strictEqual(truncate('', 10), '');
    });
  });

  describe('Cart & Checkout Calculations', () => {
    test('calculates cart totals with shipping fee below ₹999 threshold', () => {
      const items = [{ price: 499, quantity: 1 }];
      const totals = calculateCartTotals(items, 'standard', 0);

      assert.strictEqual(totals.itemsPrice, 499);
      assert.strictEqual(totals.isFreeShipping, false);
      assert.strictEqual(totals.shippingPrice, 49);
      assert.strictEqual(totals.taxPrice, Math.round(499 * 0.18)); // ₹90
      assert.strictEqual(totals.totalPrice, 499 + 49 + 90); // ₹638
    });

    test('applies free shipping for orders at or above ₹999', () => {
      const items = [{ price: 1299, quantity: 1 }];
      const totals = calculateCartTotals(items, 'standard', 0);

      assert.strictEqual(totals.itemsPrice, 1299);
      assert.strictEqual(totals.isFreeShipping, true);
      assert.strictEqual(totals.shippingPrice, 0);
      assert.strictEqual(totals.totalPrice, 1299 + Math.round(1299 * 0.18));
    });

    test('applies promotional coupon code discount correctly', () => {
      const items = [{ price: 2000, quantity: 1 }];
      const totals = calculateCartTotals(items, 'standard', 200);

      assert.strictEqual(totals.itemsPrice, 2000);
      assert.strictEqual(totals.discountPrice, 200);
      // Taxable: 1800 -> Tax (18%): 324 -> Total: 1800 + 0 (free shipping) + 324 = 2124
      assert.strictEqual(totals.taxPrice, 324);
      assert.strictEqual(totals.totalPrice, 2124);
    });
  });

  describe('Search Functionality', () => {
    const products = [
      { id: '1', name: 'Nova SoundPro Wireless Earbuds', brand: 'Nova Audio', category: 'electronics' },
      { id: '2', name: 'Apex Pro AMOLED Smartwatch', brand: 'Apex Tech', category: 'electronics' },
      { id: '3', name: 'VoltStream 65W GaN Fast Charger', brand: 'VoltStream', category: 'electronics' },
      { id: '4', name: 'Aura Premium Cotton Relaxed T-Shirt', brand: 'Aura Cotton', category: 'fashion' },
    ];

    function searchProducts(query, categoryFilter) {
      const q = (query || '').toLowerCase().trim();
      return products.filter((p) => {
        const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
        const matchesCategory = !categoryFilter || p.category === categoryFilter;
        return matchesQuery && matchesCategory;
      });
    }

    test('matches query case-insensitively', () => {
      assert.strictEqual(searchProducts('soundpro').length, 1);
      assert.strictEqual(searchProducts('SOUNDPRO').length, 1);
      assert.strictEqual(searchProducts('earbuds').length, 1);
    });

    test('matches query across product brand name', () => {
      assert.strictEqual(searchProducts('Apex Tech').length, 1);
      assert.strictEqual(searchProducts('VoltStream').length, 1);
    });

    test('filters search results by category', () => {
      assert.strictEqual(searchProducts('', 'electronics').length, 3);
      assert.strictEqual(searchProducts('', 'fashion').length, 1);
      assert.strictEqual(searchProducts('Aura', 'electronics').length, 0);
    });
  });
});
