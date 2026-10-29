const { generateInvoiceNumber } = require('../utils/pricing');

const buildInvoiceData = (order, user, payment) => ({
  company: {
    name: 'NOVA MART',
    tagline: 'Everything You Need. One Smart Store.',
    email: 'support@novamart.com',
    phone: '+91 98765 43210',
    address: 'Mumbai, Maharashtra, India',
    gstin: 'GSTIN-PLACEHOLDER',
  },
  invoiceNumber: order.invoiceNumber,
  orderNumber: order.orderNumber,
  orderId: order._id,
  date: order.paidAt || order.createdAt,
  customer: {
    name: order.shippingAddress?.fullName || `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: order.shippingAddress?.phone || user.phone,
    address: [
      order.shippingAddress?.street,
      order.shippingAddress?.city,
      order.shippingAddress?.state,
      order.shippingAddress?.postalCode,
      order.shippingAddress?.country,
    ]
      .filter(Boolean)
      .join(', '),
  },
  items: order.items.map((item) => ({
    name: item.name,
    sku: item.sku,
    quantity: item.quantity,
    price: item.price,
    total: item.price * item.quantity,
  })),
  pricing: {
    subtotal: order.itemsPrice,
    discount: order.discountPrice,
    couponCode: order.couponCode,
    tax: order.taxPrice,
    delivery: order.shippingPrice,
    deliveryOption: order.deliveryOption,
    total: order.totalPrice,
  },
  payment: {
    method: order.paymentMethod,
    status: order.paymentStatus,
    reference: order.paymentReference || payment?.razorpayPaymentId,
    paidAt: order.paidAt,
  },
});

const assignInvoiceNumber = (order) => {
  if (!order.invoiceNumber) {
    order.invoiceNumber = generateInvoiceNumber();
  }
  return order;
};

module.exports = { buildInvoiceData, assignInvoiceNumber };
