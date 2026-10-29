const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  saveForLater,
  moveToCart,
  clearCart,
  getPriceSummary,
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.get('/summary', getPriceSummary);
router.post('/items', addToCart);
router.put('/items/:itemId', updateCartItem);
router.delete('/items/:itemId', removeFromCart);
router.post('/items/:itemId/save-for-later', saveForLater);
router.post('/saved/:itemId/move-to-cart', moveToCart);
router.delete('/', clearCart);

module.exports = router;
