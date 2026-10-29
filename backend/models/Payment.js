const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    razorpayOrderId: { type: String, sparse: true, index: true },
    razorpayPaymentId: { type: String, sparse: true, index: true },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    method: {
      type: String,
      enum: ['cod', 'card', 'upi', 'netbanking', 'wallet', 'emi'],
      default: 'cod',
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled', 'refunded'],
      default: 'pending',
    },
    failureReason: { type: String },
    refundId: { type: String },
    refundAmount: { type: Number },
    metadata: { type: Map, of: String, default: {} },
    verifiedAt: { type: Date },
    webhookReceived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
