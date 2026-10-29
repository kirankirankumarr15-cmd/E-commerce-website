const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');

const deductStock = async (items, session = null) => {
  for (const item of items) {
    const product = await Product.findById(item.product).session(session);
    if (!product) throw new ApiError(404, `Product not found: ${item.name}`);
    if (product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${product.name}`);
    }
    product.stock -= item.quantity;
    product.salesCount = (product.salesCount || 0) + item.quantity;
    await product.save({ session });
  }
};

const restoreStock = async (items, session = null) => {
  for (const item of items) {
    const product = await Product.findById(item.product).session(session);
    if (product) {
      product.stock += item.quantity;
      product.salesCount = Math.max(0, (product.salesCount || 0) - item.quantity);
      await product.save({ session });
    }
  }
};

const validateCartStock = async (items) => {
  for (const item of items) {
    const product = await Product.findById(item.product?._id || item.product);
    if (!product || !product.isActive) {
      throw new ApiError(400, 'One or more products are no longer available');
    }
    if (product.stock < item.quantity) {
      throw new ApiError(400, `Only ${product.stock} units of ${product.name} available`);
    }
  }
};

module.exports = { deductStock, restoreStock, validateCartStock };
