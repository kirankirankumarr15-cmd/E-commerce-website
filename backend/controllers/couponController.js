const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { validateAndApplyCoupon } = require('../utils/pricing');

const validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  const subtotal = cart?.totalPrice || 0;

  const { discount, coupon } = await validateAndApplyCoupon(code, subtotal, req.user._id);

  if (cart) {
    cart.couponCode = coupon.code;
    await cart.save();
  }

  res.json({
    success: true,
    message: 'Coupon applied successfully',
    data: {
      code: coupon.code,
      description: coupon.description,
      discount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    },
  });
});

const removeCoupon = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.couponCode = null;
    await cart.save();
  }
  res.json({ success: true, message: 'Coupon removed' });
});

const getActiveCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({
    isActive: true,
    $or: [{ validUntil: { $gte: new Date() } }, { validUntil: null }],
  }).select('code description discountType discountValue minOrderAmount');
  res.json({ success: true, data: coupons });
});

module.exports = { validateCoupon, removeCoupon, getActiveCoupons };
