const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { updateProductRating } = require('../services/reviewService');

const getProductReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) throw new ApiError(404, 'Product not found');

  const filter = { product: product._id, isApproved: true };

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('user', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments(filter),
  ]);

  const ratingBreakdown = await Review.aggregate([
    { $match: { product: product._id, isApproved: true } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } },
  ]);

  res.json({
    success: true,
    data: reviews,
    summary: {
      averageRating: product.rating,
      totalReviews: product.numReviews,
      breakdown: ratingBreakdown,
    },
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, title, comment } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  const existing = await Review.findOne({ user: req.user._id, product: productId });
  if (existing) throw new ApiError(400, 'You have already reviewed this product');

  const hasPurchased = await Order.findOne({
    user: req.user._id,
    'items.product': productId,
    orderStatus: { $in: ['delivered', 'shipped', 'out_for_delivery', 'confirmed', 'packed'] },
  });

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    order: hasPurchased?._id,
    rating,
    title,
    comment,
    isVerifiedPurchase: !!hasPurchased,
  });

  await updateProductRating(productId);
  await review.populate('user', 'firstName lastName avatar');

  res.status(201).json({ success: true, message: 'Review submitted', data: review });
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }

  const productId = review.product;
  await review.deleteOne();
  await updateProductRating(productId);

  res.json({ success: true, message: 'Review deleted' });
});

module.exports = { getProductReviews, createReview, deleteReview };
