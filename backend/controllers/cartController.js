const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { calculateOrderPricing } = require('../utils/pricing');

const populateOpts = 'name slug images finalPrice price discount stock sku brand';

const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate([
    { path: 'items.product', select: populateOpts },
    { path: 'savedForLater.product', select: populateOpts },
  ]);

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [], savedForLater: [] });
  }

  const pricing = await calculateOrderPricing({
    items: cart.items.map((i) => ({ price: i.price, quantity: i.quantity })),
    deliveryOption: 'standard',
    couponCode: cart.couponCode,
    userId: req.user._id,
  }).catch(() => null);

  res.json({ success: true, data: cart, pricing });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw new ApiError(404, 'Product not found');
  if (product.stock < quantity) throw new ApiError(400, 'Insufficient stock');

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [], savedForLater: [] });

  const existingItem = cart.items.find((item) => item.product.toString() === productId);
  if (existingItem) {
    const newQty = existingItem.quantity + quantity;
    if (product.stock < newQty) throw new ApiError(400, 'Insufficient stock');
    existingItem.quantity = newQty;
  } else {
    cart.items.push({ product: productId, quantity, price: product.finalPrice });
  }

  cart.savedForLater = cart.savedForLater.filter((item) => item.product.toString() !== productId);

  cart.calculateTotals();
  await cart.save();
  await cart.populate([
    { path: 'items.product', select: populateOpts },
    { path: 'savedForLater.product', select: populateOpts },
  ]);

  res.json({ success: true, message: 'Item added to cart', data: cart });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  const item = cart.items.id(req.params.itemId);
  if (!item) throw new ApiError(404, 'Cart item not found');

  const product = await Product.findById(item.product);
  if (quantity > product.stock) throw new ApiError(400, 'Insufficient stock');

  if (quantity < 1) {
    item.deleteOne();
  } else {
    item.quantity = quantity;
  }

  cart.calculateTotals();
  await cart.save();
  await cart.populate('items.product', populateOpts);

  res.json({ success: true, message: 'Cart updated', data: cart });
});

const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  const item = cart.items.id(req.params.itemId);
  if (!item) throw new ApiError(404, 'Cart item not found');

  item.deleteOne();
  cart.calculateTotals();
  await cart.save();
  await cart.populate('items.product', populateOpts);

  res.json({ success: true, message: 'Item removed from cart', data: cart });
});

const saveForLater = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  const item = cart.items.id(req.params.itemId);
  if (!item) throw new ApiError(404, 'Cart item not found');

  const existing = cart.savedForLater.find((s) => s.product.toString() === item.product.toString());
  if (!existing) {
    cart.savedForLater.push({ product: item.product, quantity: item.quantity, price: item.price });
  }
  item.deleteOne();

  cart.calculateTotals();
  await cart.save();
  await cart.populate([
    { path: 'items.product', select: populateOpts },
    { path: 'savedForLater.product', select: populateOpts },
  ]);

  res.json({ success: true, message: 'Item saved for later', data: cart });
});

const moveToCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  const item = cart.savedForLater.id(req.params.itemId);
  if (!item) throw new ApiError(404, 'Saved item not found');

  const product = await Product.findById(item.product);
  if (!product || !product.isActive) throw new ApiError(400, 'Product no longer available');
  if (product.stock < item.quantity) throw new ApiError(400, 'Insufficient stock');

  const existing = cart.items.find((i) => i.product.toString() === item.product.toString());
  if (existing) {
    existing.quantity += item.quantity;
    if (existing.quantity > product.stock) throw new ApiError(400, 'Insufficient stock');
  } else {
    cart.items.push({ product: item.product, quantity: item.quantity, price: product.finalPrice });
  }
  item.deleteOne();

  cart.calculateTotals();
  await cart.save();
  await cart.populate([
    { path: 'items.product', select: populateOpts },
    { path: 'savedForLater.product', select: populateOpts },
  ]);

  res.json({ success: true, message: 'Item moved to cart', data: cart });
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.items = [];
  cart.couponCode = null;
  cart.calculateTotals();
  await cart.save();

  res.json({ success: true, message: 'Cart cleared', data: cart });
});

const getPriceSummary = asyncHandler(async (req, res) => {
  const { deliveryOption = 'standard', couponCode } = req.query;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) throw new ApiError(400, 'Cart is empty');

  const pricing = await calculateOrderPricing({
    items: cart.items.map((i) => ({ price: i.price, quantity: i.quantity })),
    deliveryOption,
    couponCode: couponCode || cart.couponCode,
    userId: req.user._id,
  });

  res.json({ success: true, data: pricing });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  saveForLater,
  moveToCart,
  clearCart,
  getPriceSummary,
};
