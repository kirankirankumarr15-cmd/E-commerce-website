const Wishlist = require('../models/Wishlist');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    'products',
    'name slug images finalPrice price discount rating stock'
  );

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }

  res.json({ success: true, data: wishlist });
});

const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw new ApiError(404, 'Product not found');

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });

  if (wishlist.products.includes(productId)) {
    throw new ApiError(400, 'Product already in wishlist');
  }

  wishlist.products.push(productId);
  await wishlist.save();
  await wishlist.populate('products', 'name slug images finalPrice price discount rating stock');

  res.json({ success: true, message: 'Added to wishlist', data: wishlist });
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) throw new ApiError(404, 'Wishlist not found');

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== req.params.productId
  );
  await wishlist.save();
  await wishlist.populate('products', 'name slug images finalPrice price discount rating stock');

  res.json({ success: true, message: 'Removed from wishlist', data: wishlist });
});

const moveToCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) throw new ApiError(404, 'Wishlist not found');

  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw new ApiError(404, 'Product not found');
  if (product.stock < 1) throw new ApiError(400, 'Out of stock');

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [], savedForLater: [] });

  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (existing) {
    if (existing.quantity + 1 > product.stock) throw new ApiError(400, 'Insufficient stock');
    existing.quantity += 1;
  } else {
    cart.items.push({ product: productId, quantity: 1, price: product.finalPrice });
  }

  wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);

  cart.calculateTotals();
  await cart.save();
  await wishlist.save();
  await cart.populate('items.product', 'name slug images finalPrice price discount stock');
  await wishlist.populate('products', 'name slug images finalPrice price discount rating stock');

  res.json({ success: true, message: 'Moved to cart', data: { cart, wishlist } });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist, moveToCart };
