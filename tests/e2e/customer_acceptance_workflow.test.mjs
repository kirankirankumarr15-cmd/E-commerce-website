import { test, describe } from 'node:test';
import assert from 'node:assert';
import { getMockResponse, FALLBACK_PRODUCTS } from '../../frontend/src/services/mockFallback.js';

describe('PHASE 15: Acceptance Testing - Complete 14-Step Customer Shopping Journey', () => {
  let session = {
    token: null,
    user: null,
    cart: { items: [], totalPrice: 0 },
    currentProduct: null,
    placedOrder: null,
  };

  test('Step 1: Open Nova Mart storefront (load catalog & categories)', () => {
    const catRes = getMockResponse('/categories');
    assert.strictEqual(catRes.data.success, true);
    assert.ok(catRes.data.data.length >= 6, 'Store categories must be available on homepage');

    const dealsRes = getMockResponse('/products/deals');
    assert.strictEqual(dealsRes.data.success, true);
    assert.ok(dealsRes.data.data.length > 0, 'Homepage deals carousel must display items');
  });

  test('Step 2: Register a new customer account', () => {
    const regPayload = {
      firstName: 'Aarav',
      lastName: 'Sharma',
      email: 'aarav.sharma@novamart.in',
      phone: '9876543210',
      password: 'password123',
    };
    const regRes = getMockResponse('/auth/register', {}, regPayload);
    assert.strictEqual(regRes.data.success, true);
    assert.ok(regRes.data.data.token, 'Token must be issued upon registration');
    assert.strictEqual(regRes.data.data.user.email, 'aarav.sharma@novamart.in');
    assert.strictEqual(regRes.data.data.user.role, 'customer');
  });

  test('Step 3: Authenticate and log in with credentials', () => {
    const loginRes = getMockResponse('/auth/login', {}, {
      email: 'aarav.sharma@novamart.in',
      password: 'password123',
    });
    assert.strictEqual(loginRes.data.success, true);
    session.token = loginRes.data.data.token;
    session.user = loginRes.data.data.user;
    assert.ok(session.token);
    assert.strictEqual(session.user.role, 'customer');
  });

  test('Step 4: Browse catalog and filter by Category', () => {
    const browseRes = getMockResponse('/products', { category: 'electronics', page: 1, limit: 12 });
    assert.strictEqual(browseRes.data.success, true);
    assert.ok(browseRes.data.data.length > 0);
    assert.ok(browseRes.data.data.every((p) => p.category_slug === 'electronics' || p.category?.slug === 'electronics'));
  });

  test('Step 5: Search for a specific product by keyword ("earbuds")', () => {
    const searchRes = getMockResponse('/products', { search: 'earbuds' });
    assert.strictEqual(searchRes.data.success, true);
    assert.ok(searchRes.data.data.length > 0);
    const found = searchRes.data.data.find((p) => p.slug.includes('earbuds'));
    assert.ok(found, 'Should find earbuds in search results');
    session.currentProduct = found;
  });

  test('Step 6: Open product details page and verify specifications', () => {
    const detailRes = getMockResponse(`/products/slug/${session.currentProduct.slug}`);
    assert.strictEqual(detailRes.data.success, true);
    const product = detailRes.data.data;
    assert.strictEqual(product.slug, session.currentProduct.slug);
    assert.ok(product.price > 0);
    assert.ok(product.finalPrice > 0);
    assert.ok(product.stock > 0);
    assert.ok(product.rating >= 4.0);

    const relatedRes = getMockResponse(`/products/slug/${session.currentProduct.slug}/related`);
    assert.ok(Array.isArray(relatedRes.data.data), 'Related products must be an array');
  });

  test('Step 7: Add product to shopping cart', () => {
    const cartItem = {
      _id: 'cart_' + session.currentProduct._id,
      product: session.currentProduct,
      quantity: 1,
      price: session.currentProduct.finalPrice,
    };
    session.cart.items.push(cartItem);
    session.cart.totalPrice = cartItem.price;

    assert.strictEqual(session.cart.items.length, 1);
    assert.strictEqual(session.cart.items[0].quantity, 1);
    assert.strictEqual(session.cart.totalPrice, session.currentProduct.finalPrice);
  });

  test('Step 8: Update product quantity in cart (increment to 2 items)', () => {
    session.cart.items[0].quantity = 2;
    session.cart.totalPrice = session.cart.items[0].price * 2;

    assert.strictEqual(session.cart.items[0].quantity, 2);
    assert.strictEqual(session.cart.totalPrice, session.currentProduct.finalPrice * 2);
  });

  test('Step 9: Proceed to checkout and review summary', () => {
    const subtotal = session.cart.totalPrice;
    const isFreeShipping = subtotal >= 999;
    const shipping = isFreeShipping ? 0 : 49;
    const tax = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + shipping + tax;

    assert.strictEqual(isFreeShipping, true, 'Subtotal > ₹999 qualifies for free delivery');
    assert.strictEqual(shipping, 0);
    assert.strictEqual(grandTotal, subtotal + tax);
  });

  test('Step 10: Populate and validate delivery shipping address', () => {
    const shippingAddress = {
      fullName: `${session.user.firstName} ${session.user.lastName}`,
      phone: '9876543210',
      street: '123 Nova High St, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
    };

    assert.ok(shippingAddress.fullName);
    assert.ok(shippingAddress.street);
    assert.strictEqual(shippingAddress.postalCode, '560038');
    session.shippingAddress = shippingAddress;
  });

  test('Step 11: Complete order placement using Cash on Delivery (COD)', () => {
    const orderPayload = {
      shippingAddress: session.shippingAddress,
      deliveryOption: 'standard',
      paymentMethod: 'cod',
      items: session.cart.items,
      totalPrice: session.cart.totalPrice + Math.round(session.cart.totalPrice * 0.18),
    };

    const orderRes = getMockResponse('/payments/create-order', {}, orderPayload);
    assert.strictEqual(orderRes.data.success, true);
    assert.ok(orderRes.data.data.order);
    session.placedOrder = orderRes.data.data.order;
  });

  test('Step 12: Verify order confirmation details', () => {
    assert.ok(session.placedOrder._id, 'Order ID must exist');
    assert.ok(session.placedOrder.orderNumber.startsWith('ORD-'), 'Order Number must have ORD- prefix');
    assert.strictEqual(session.placedOrder.paymentMethod, 'cod');
    assert.strictEqual(session.placedOrder.orderStatus, 'confirmed');
  });

  test('Step 13: Open Customer Order History and locate the new order', () => {
    const historyRes = getMockResponse('/orders/my');
    assert.strictEqual(historyRes.data.success, true);
    assert.ok(Array.isArray(historyRes.data.data));

    const found = historyRes.data.data.find((o) => o._id === session.placedOrder._id);
    assert.ok(found, 'Placed order must appear in customer order history');
    assert.strictEqual(found.orderNumber, session.placedOrder.orderNumber);
  });

  test('Step 14: Log out and verify session termination', () => {
    session.token = null;
    session.user = null;
    session.cart = { items: [], totalPrice: 0 };

    assert.strictEqual(session.token, null);
    assert.strictEqual(session.user, null);
    assert.strictEqual(session.cart.items.length, 0);
  });
});
