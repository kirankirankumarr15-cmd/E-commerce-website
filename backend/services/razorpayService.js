const Razorpay = require('razorpay');
const crypto = require('crypto');
const config = require('../config');

let razorpayInstance = null;

const getRazorpay = () => {
  if (!razorpayInstance) {
    if (!config.razorpayKeyId || !config.razorpayKeySecret) {
      throw new Error('Razorpay credentials not configured');
    }
    razorpayInstance = new Razorpay({
      key_id: config.razorpayKeyId,
      key_secret: config.razorpayKeySecret,
    });
  }
  return razorpayInstance;
};

const isRazorpayConfigured = () => {
  return !!(config.razorpayKeyId && config.razorpayKeySecret);
};

const createRazorpayOrder = async ({ amount, orderId, receipt, notes = {} }) => {
  const razorpay = getRazorpay();
  const options = {
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt: receipt || `order_${orderId}`,
    notes: { orderId: orderId.toString(), ...notes },
  };
  return razorpay.orders.create(options);
};

const verifyPaymentSignature = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', config.razorpayKeySecret)
    .update(body)
    .digest('hex');
  return expectedSignature === razorpaySignature;
};

const verifyWebhookSignature = (body, signature) => {
  const expectedSignature = crypto
    .createHmac('sha256', config.razorpayWebhookSecret || config.razorpayKeySecret)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
};

const fetchPayment = async (paymentId) => {
  const razorpay = getRazorpay();
  return razorpay.payments.fetch(paymentId);
};

module.exports = {
  getRazorpay,
  isRazorpayConfigured,
  createRazorpayOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
  fetchPayment,
};
