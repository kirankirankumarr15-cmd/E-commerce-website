const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { buildInvoiceData } = require('../services/invoiceService');
const { restoreStock } = require('../services/stockService');

const CANCELLABLE = ['pending', 'confirmed', 'packed'];

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('items.product', 'name slug images');
  res.json({ success: true, data: orders });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'items.product',
    'name slug images sku'
  );

  if (!order) throw new ApiError(404, 'Order not found');
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to view this order');
  }

  const payment = await Payment.findOne({ order: order._id });

  res.json({ success: true, data: { order, payment } });
});

const getInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }
  if (!order.invoiceNumber && order.paymentStatus !== 'paid' && order.paymentMethod !== 'cod') {
    throw new ApiError(400, 'Invoice not available for this order');
  }

  const user = await User.findById(order.user);
  const payment = await Payment.findOne({ order: order._id });
  const invoice = buildInvoiceData(order, user, payment);

  res.json({ success: true, data: invoice });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }
  if (!CANCELLABLE.includes(order.orderStatus)) {
    throw new ApiError(400, `Cannot cancel an order that is ${order.orderStatus.replace(/_/g, ' ')}`);
  }

  order.orderStatus = 'cancelled';
  order.cancelledAt = new Date();
  order.cancelReason = req.body.reason || 'Cancelled by customer';

  if (order.paymentStatus === 'pending' && order.paymentMethod !== 'cod') {
    order.paymentStatus = 'cancelled';
  }

  if (order.stockDeducted) {
    await restoreStock(order.items);
    order.stockDeducted = false;
  }

  await order.save();

  await Payment.findOneAndUpdate(
    { order: order._id, status: 'pending' },
    { status: 'cancelled' }
  );

  res.json({ success: true, message: 'Order cancelled', data: order });
});

const reorder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const added = [];
  const skipped = [];

  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive || product.stock < 1) {
      skipped.push(item.name);
      continue;
    }
    const qty = Math.min(item.quantity, product.stock);
    const existing = cart.items.find((i) => i.product.toString() === product._id.toString());
    if (existing) {
      existing.quantity = Math.min(existing.quantity + qty, product.stock);
      existing.price = product.finalPrice;
    } else {
      cart.items.push({ product: product._id, quantity: qty, price: product.finalPrice });
    }
    added.push(product.name);
  }

  cart.calculateTotals();
  await cart.save();
  await cart.populate('items.product', 'name slug images finalPrice price discount stock sku brand');

  res.json({
    success: true,
    message: added.length
      ? `${added.length} item(s) added to cart`
      : 'No items could be added to cart',
    data: { cart, added, skipped },
  });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate('user', 'firstName lastName email')
    .populate('items.product', 'name slug');
  res.json({ success: true, data: orders });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  const validStatuses = [
    'pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled',
  ];
  if (!validStatuses.includes(orderStatus)) {
    throw new ApiError(400, 'Invalid order status');
  }

  order.orderStatus = orderStatus;
  if (orderStatus === 'delivered') order.deliveredAt = new Date();
  if (orderStatus === 'cancelled') {
    order.cancelledAt = new Date();
    if (order.stockDeducted) {
      await restoreStock(order.items);
      order.stockDeducted = false;
    }
  }
  await order.save();

  res.json({ success: true, message: 'Order status updated', data: order });
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalOrders, totalRevenue, pendingOrders, totalProducts] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: { $in: ['paid', 'pending'] }, orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Order.countDocuments({ orderStatus: 'pending' }),
    Product.countDocuments({ isActive: true }),
  ]);

  res.json({
    success: true,
    data: {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      totalProducts,
    },
  });
});

module.exports = {
  getMyOrders,
  getOrderById,
  getInvoice,
  cancelOrder,
  reorder,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
};
