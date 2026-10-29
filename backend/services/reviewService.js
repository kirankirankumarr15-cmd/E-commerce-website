const Review = require('../models/Review');
const Product = require('../models/Product');

const updateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  const rating = stats[0]?.avgRating ? Math.round(stats[0].avgRating * 10) / 10 : 0;
  const numReviews = stats[0]?.count || 0;

  await Product.findByIdAndUpdate(productId, { rating, numReviews });
};

module.exports = { updateProductRating };
