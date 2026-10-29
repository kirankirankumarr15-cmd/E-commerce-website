const express = require('express');
const {
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
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts);
router.get('/search/suggestions', getSearchSuggestions);
router.get('/brands', getBrands);
router.get('/featured', getFeaturedProducts);
router.get('/trending', getTrendingProducts);
router.get('/best-sellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/deals', getDeals);
router.get('/slug/:slug/related', getRelatedProducts);
router.get('/slug/:slug/frequently-bought', getFrequentlyBoughtTogether);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

module.exports = router;
