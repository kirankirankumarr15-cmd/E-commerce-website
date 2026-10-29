const mongoose = require('mongoose');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { calculateOrderPricing } = require('../utils/pricing');
const { deductStock, validateCartStock } = require('../services/stockService');
const { assignInvoiceNumber, buildInvoiceData } = require('../services/invoiceService');
const {
  isRazorpayConfigured,
  createRazorpayOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
  fetchPayment,
} = require('../services/razorpayService');

const populateOpts = 'name slug images finalPrice price discount stock sku';

const buildOrderItems = (cartItems) =>
  cartItems.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.images?.[0]?.url || '',
    sku: item.product.sku,
    quantity: item.quantity,
    price: item.product.finalPrice,
    discount: item.product.discount,
    originalPrice: item.product.price,
  }));

const clearUserCart = async (userId, session = null) => {
  const cart = await Cart.findOne({ user: userId }).session(session);
  if (!cart) return;
  cart.items = [];
  cart.couponCode = null;
  cart.calculateTotals();
  await cart.save({ session });
};

const confirmOrder = async (order, payment, session, { isCod = false } = {}) => {
  if (!order.stockDeducted) {
    await deductStock(order.items, session);
    order.stockDeducted = true;
  }
  order.orderStatus = 'confirmed';
  assignInvoiceNumber(order);

  if (isCod) {
    order.paymentStatus = 'pending';
    order.paymentReference = order.paymentReference || `COD-${order.orderNumber}`;
    if (payment) {
      payment.status = 'pending';
    }
  } else {
    order.paymentStatus = 'paid';
    order.paidAt = new Date();
    order.paymentReference = payment?.razorpayPaymentId || order.paymentReference;
    if (payment) {
      payment.status = 'paid';
      payment.verifiedAt = new Date();
    }
  }

  if (order.couponCode) {
    await Coupon.findOneAndUpdate(
      { code: order.couponCode },
      { $inc: { usedCount: 1 } },
      { session }
    );
  }

  if (payment) await payment.save({ session });
  await order.save({ session });
};

const createOrder = asyncHandler(async (req, res) => {
  const {
    shippingAddress,
    paymentMethod = 'cod',
    deliveryOption = 'standard',
    couponCode,
    notes,
  } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate(`items.product`, populateOpts);
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Your cart is empty');
  }

  await validateCartStock(cart.items);

  const orderItems = buildOrderItems(cart.items);
  const pricingItems = cart.items.map((item) => ({
    price: item.product.finalPrice,
    originalPrice: item.product.price,
    quantity: item.quantity,
  }));

  const pricing = await calculateOrderPricing({
    items: pricingItems,
    deliveryOption,
    couponCode: couponCode || cart.couponCode,
    userId: req.user._id,
  });

  const isOnlinePayment = paymentMethod !== 'cod';

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    deliveryOption,
    deliveryEstimate: pricing.deliveryEstimate,
    paymentMethod,
    paymentStatus: 'pending',
    orderStatus: 'pending',
    itemsPrice: pricing.itemsPrice,
    discountPrice: pricing.discountPrice,
    couponCode: pricing.couponCode,
    shippingPrice: pricing.shippingPrice,
    taxPrice: pricing.taxPrice,
    totalPrice: pricing.totalPrice,
    notes,
  });

  const payment = await Payment.create({
    order: order._id,
    user: req.user._id,
    amount: pricing.totalPrice,
    method: paymentMethod,
    status: 'pending',
  });

  if (isOnlinePayment) {
    if (!isRazorpayConfigured()) {
      throw new ApiError(503, 'Online payment is not configured. Use Cash on Delivery.');
    }

    const razorpayOrder = await createRazorpayOrder({
      amount: pricing.totalPrice,
      orderId: order._id,
      receipt: order.orderNumber,
    });

    payment.razorpayOrderId = razorpayOrder.id;
    await payment.save();

    // Keep cart until payment is verified — failed/cancelled checkout must not lose items
    return res.status(201).json({
      success: true,
      message: 'Order created. Complete payment to confirm.',
      data: {
        order,
        payment: {
          _id: payment._id,
          razorpayOrderId: razorpayOrder.id,
          amount: pricing.totalPrice,
          key: process.env.RAZORPAY_KEY_ID,
        },
      },
    });
  }

  await confirmOrder(order, payment, null, { isCod: true });
  await order.save();
  await payment.save();

  cart.items = [];
  cart.couponCode = null;
  cart.calculateTotals();
  await cart.save();

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: { order, payment },
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new ApiError(400, 'Missing payment verification data');
  }

  const isValid = verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature });
  if (!isValid) {
    throw new ApiError(400, 'Payment verification failed. Invalid signature.');
  }

  const payment = await Payment.findOne({ razorpayOrderId });
  if (!payment) throw new ApiError(404, 'Payment record not found');

  if (payment.status === 'paid') {
    const order = await Order.findById(payment.order);
    return res.json({ success: true, message: 'Payment already verified', data: { order, payment } });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(payment.order).session(session);
    if (!order) throw new ApiError(404, 'Order not found');
    if (order.user.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Not authorized');
    }

    const razorpayPayment = await fetchPayment(razorpayPaymentId);
    if (razorpayPayment.status !== 'captured' && razorpayPayment.status !== 'authorized') {
      throw new ApiError(400, 'Payment not completed');
    }

    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.method = razorpayPayment.method || order.paymentMethod;
    payment.status = 'paid';

    order.paymentStatus = 'paid';
    order.paymentReference = razorpayPaymentId;
    order.paymentMethod = razorpayPayment.method || order.paymentMethod;

    await confirmOrder(order, payment, session, { isCod: false });
    await clearUserCart(order.user, session);
    await session.commitTransaction();

    res.json({
      success: true,
      message: 'Payment successful! Your order is confirmed.',
      data: { order, payment },
    });
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});

const handleWebhook = async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const body = req.rawBody || JSON.stringify(req.body);

  if (!verifyWebhookSignature(body, signature)) {
    return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
  }

  const event = req.body.event;
  const payload = req.body.payload;

  try {
    if (event === 'payment.captured') {
      const paymentEntity = payload.payment.entity;
      const payment = await Payment.findOne({ razorpayOrderId: paymentEntity.order_id });

      if (payment && payment.status !== 'paid') {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
          const order = await Order.findById(payment.order).session(session);
          payment.razorpayPaymentId = paymentEntity.id;
          payment.webhookReceived = true;
          payment.method = paymentEntity.method;
          order.paymentStatus = 'paid';
          order.paymentReference = paymentEntity.id;
          order.paymentMethod = paymentEntity.method;
          await confirmOrder(order, payment, session, { isCod: false });
          await clearUserCart(order.user, session);
          await session.commitTransaction();
        } catch (err) {
          await session.abortTransaction();
          console.error('Webhook processing error:', err);
        } finally {
          session.endSession();
        }
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = payload.payment.entity;
      const payment = await Payment.findOne({ razorpayOrderId: paymentEntity.order_id });
      if (payment) {
        payment.status = 'failed';
        payment.failureReason = paymentEntity.error_description;
        payment.webhookReceived = true;
        await payment.save();

        await Order.findByIdAndUpdate(payment.order, {
          paymentStatus: 'failed',
          orderStatus: 'cancelled',
          cancelledAt: new Date(),
          cancelReason: 'Payment failed',
        });
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
  }

  res.json({ success: true });
};

const getPaymentByOrder = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({ order: req.params.orderId });
  if (!payment) throw new ApiError(404, 'Payment not found');
  if (payment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }
  res.json({ success: true, data: payment });
});

module.exports = {
  createOrder,
  verifyPayment,
  handleWebhook,
  getPaymentByOrder,
};
