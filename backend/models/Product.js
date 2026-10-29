const mongoose = require('mongoose');
const slugify = require('slugify');

const productImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    type: {
      type: String,
      enum: ['main', 'front', 'side', 'back', 'detail'],
      default: 'main',
    },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    finalPrice: { type: Number, required: true, min: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    brand: { type: String, trim: true, default: 'NOVA MART' },
    images: [productImageSchema],
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, unique: true, sparse: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    specifications: { type: Map, of: String, default: {} },
    tags: [{ type: String, trim: true }],
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isDeal: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  if (this.isModified('price') || this.isModified('discount')) {
    this.finalPrice = this.price - (this.price * this.discount) / 100;
  }
});

productSchema.index({ name: 'text', description: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
