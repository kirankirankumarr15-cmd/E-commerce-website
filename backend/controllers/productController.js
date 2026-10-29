const Product = require('../models/Product');
const Order = require('../models/Order');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const filter = { isActive: true };

  if (req.query.category) filter.category = req.query.category;
  if (req.query.brand) filter.brand = req.query.brand;
  if (req.query.isFeatured === 'true') filter.isFeatured = true;
  if (req.query.isTrending === 'true') filter.isTrending = true;
  if (req.query.isBestSeller === 'true') filter.isBestSeller = true;
  if (req.query.isNewArrival === 'true') filter.isNewArrival = true;
  if (req.query.isDeal === 'true') filter.isDeal = true;

  if (req.query.inStock === 'true') filter.stock = { $gt: 0 };
  if (req.query.inStock === 'false') filter.stock = 0;

  if (req.query.minRating) filter.rating = { $gte: parseFloat(req.query.minRating) };

  if (req.query.minPrice || req.query.maxPrice) {
    filter.finalPrice = {};
    if (req.query.minPrice) filter.finalPrice.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) filter.finalPrice.$lte = parseFloat(req.query.maxPrice);
  }

  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  let sort = { createdAt: -1 };
  if (req.query.sort === 'price-asc') sort = { finalPrice: 1 };
  if (req.query.sort === 'price-desc') sort = { finalPrice: -1 };
  if (req.query.sort === 'rating') sort = { rating: -1, numReviews: -1 };
  if (req.query.sort === 'popular') sort = { salesCount: -1 };
  if (req.query.sort === 'name') sort = { name: 1 };
  if (req.query.sort === 'newest') sort = { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

const getSearchSuggestions = asyncHandler(async (req, res) => {
  const q = req.query.q?.trim();
  if (!q || q.length < 2) return res.json({ success: true, data: [] });

  const products = await Product.find(
    { isActive: true, $text: { $search: q } },
    { score: { $meta: 'textScore' }, name: 1, slug: 1, images: 1, finalPrice: 1, brand: 1 }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(8);

  const brands = await Product.distinct('brand', {
    isActive: true,
    brand: { $regex: q, $options: 'i' },
  });

  res.json({
    success: true,
    data: {
      products: products.map((p) => ({
        _id: p._id,
        name: p.name,
        slug: p.slug,
        image: p.images?.[0]?.url,
        finalPrice: p.finalPrice,
        brand: p.brand,
      })),
      brands: brands.slice(0, 5),
    },
  });
});

const getBrands = asyncHandler(async (req, res) => {
  const brands = await Product.distinct('brand', { isActive: true });
  res.json({ success: true, data: brands.filter(Boolean).sort() });
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', 'name slug');

  if (!product) throw new ApiError(404, 'Product not found');

  res.json({ success: true, data: product });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, data: product });
});

const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) throw new ApiError(404, 'Product not found');

  const related = await Product.find({
    _id: { $ne: product._id },
    isActive: true,
    $or: [{ category: product.category }, { brand: product.brand }],
  })
    .populate('category', 'name slug')
    .limit(4);

  res.json({ success: true, data: related });
});

const getFrequentlyBoughtTogether = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) throw new ApiError(404, 'Product not found');

  const ordersWithProduct = await Order.find({
    'items.product': product._id,
    orderStatus: { $ne: 'cancelled' },
  }).limit(50);

  const productCounts = {};
  ordersWithProduct.forEach((order) => {
    order.items.forEach((item) => {
      const id = item.product.toString();
      if (id !== product._id.toString()) {
        productCounts[id] = (productCounts[id] || 0) + 1;
      }
    });
  });

  const topIds = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => id);

  const products = await Product.find({ _id: { $in: topIds }, isActive: true })
    .populate('category', 'name slug');

  if (products.length === 0) {
    const fallback = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true,
    }).limit(3);
    return res.json({ success: true, data: fallback });
  }

  res.json({ success: true, data: products });
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, isFeatured: true })
    .populate('category', 'name slug')
    .limit(8);
  res.json({ success: true, data: products });
});

const getTrendingProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, isTrending: true })
    .populate('category', 'name slug')
    .limit(8);
  res.json({ success: true, data: products });
});

const getBestSellers = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, isBestSeller: true })
    .populate('category', 'name slug')
    .limit(8);
  res.json({ success: true, data: products });
});

const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, isNewArrival: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(8);
  res.json({ success: true, data: products });
});

const getDeals = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, isDeal: true })
    .populate('category', 'name slug')
    .limit(8);
  res.json({ success: true, data: products });
});

module.exports = {
  getProducts,
  getSearchSuggestions,
  getBrands,
  getProductBySlug,
  getProductById,
  getRelatedProducts,
  getFrequentlyBoughtTogether,
  getFeaturedProducts,
  getTrendingProducts,
  getBestSellers,
  getNewArrivals,
  getDeals,
};
