const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String },
    sku: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderNumber: { type: String, unique: true },
    invoiceNumber: { type: String, unique: true, sparse: true },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    deliveryOption: {
      type: String,
      enum: ['standard', 'express'],
      default: 'standard',
    },
    deliveryEstimate: { type: String },
    paymentMethod: {
      type: String,
      enum: ['cod', 'card', 'upi', 'netbanking', 'wallet', 'emi'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled', 'refunded'],
      default: 'pending',
    },
    paymentReference: { type: String },
    orderStatus: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'packed',
        'shipped',
        'out_for_delivery',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },
    itemsPrice: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    couponCode: { type: String },
    shippingPrice: { type: Number, default: 0 },
    taxPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    notes: { type: String },
    stockDeducted: { type: Boolean, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    cancelReason: { type: String },
  },
  { timestamps: true }
);

orderSchema.pre('save', function () {
  if (!this.orderNumber) {
    this.orderNumber = `NM${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
});

module.exports = mongoose.model('Order', orderSchema);
