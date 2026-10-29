const DELIVERY_OPTIONS = {
  standard: { label: 'Standard Delivery', price: 49, days: '5-7 business days' },
  express: { label: 'Express Delivery', price: 149, days: '1-2 business days' },
};

const FREE_SHIPPING_THRESHOLD = 999;
const TAX_RATE = 0.18;

const calculateShipping = (subtotal, deliveryOption = 'standard') => {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return DELIVERY_OPTIONS[deliveryOption]?.price ?? DELIVERY_OPTIONS.standard.price;
};

const validateAndApplyCoupon = async (code, subtotal, userId) => {
  if (!code) return { discount: 0, coupon: null };

  const Coupon = require('../models/Coupon');
  const Order = require('../models/Order');

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) throw new Error('Invalid coupon code');

  const now = new Date();
  if (coupon.validFrom && now < coupon.validFrom) throw new Error('Coupon is not yet active');
  if (coupon.validUntil && now > coupon.validUntil) throw new Error('Coupon has expired');
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new Error('Coupon usage limit reached');
  }
  if (subtotal < coupon.minOrderAmount) {
    throw new Error(`Minimum order amount of ₹${coupon.minOrderAmount} required`);
  }

  const userUsage = await Order.countDocuments({
    user: userId,
    couponCode: coupon.code,
    paymentStatus: { $in: ['paid', 'pending'] },
    orderStatus: { $ne: 'cancelled' },
  });
  if (userUsage >= coupon.perUserLimit) {
    throw new Error('You have already used this coupon');
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = coupon.discountValue;
  }
  discount = Math.min(discount, subtotal);

  return { discount, coupon };
};

const calculateOrderPricing = async ({
  items,
  deliveryOption = 'standard',
  couponCode,
  userId,
}) => {
  const itemsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const productDiscount = items.reduce(
    (sum, item) => sum + ((item.originalPrice || item.price) - item.price) * item.quantity,
    0
  );

  const { discount: couponDiscount, coupon } = await validateAndApplyCoupon(
    couponCode,
    itemsPrice,
    userId
  );

  const discountedSubtotal = itemsPrice - couponDiscount;
  const shippingPrice = calculateShipping(discountedSubtotal, deliveryOption);
  const taxPrice = Math.round(discountedSubtotal * TAX_RATE);
  const totalPrice = discountedSubtotal + shippingPrice + taxPrice;

  return {
    itemsPrice,
    productDiscount,
    discountPrice: couponDiscount,
    couponCode: coupon?.code || null,
    shippingPrice,
    taxPrice,
    totalPrice,
    deliveryEstimate: DELIVERY_OPTIONS[deliveryOption]?.days,
  };
};

const generateInvoiceNumber = () => {
  return `INV-${Date.now()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
};

module.exports = {
  DELIVERY_OPTIONS,
  FREE_SHIPPING_THRESHOLD,
  TAX_RATE,
  calculateShipping,
  validateAndApplyCoupon,
  calculateOrderPricing,
  generateInvoiceNumber,
};
