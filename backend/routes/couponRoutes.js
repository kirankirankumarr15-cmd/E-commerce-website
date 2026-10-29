const express = require('express');
const { validateCoupon, removeCoupon, getActiveCoupons } = require('../controllers/couponController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getActiveCoupons);
router.post('/validate', protect, validateCoupon);
router.delete('/', protect, removeCoupon);

module.exports = router;
