import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  addAddress: (data) => api.post('/auth/addresses', data),
  updateAddress: (id, data) => api.put(`/auth/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}`),
};

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  getById: (id) => api.get(`/products/${id}`),
  getSearchSuggestions: (q) => api.get('/products/search/suggestions', { params: { q } }),
  getBrands: () => api.get('/products/brands'),
  getRelated: (slug) => api.get(`/products/slug/${slug}/related`),
  getFrequentlyBought: (slug) => api.get(`/products/slug/${slug}/frequently-bought`),
  getFeatured: () => api.get('/products/featured'),
  getTrending: () => api.get('/products/trending'),
  getBestSellers: () => api.get('/products/best-sellers'),
  getNewArrivals: () => api.get('/products/new-arrivals'),
  getDeals: () => api.get('/products/deals'),
};

export const categoryService = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
};

export const cartService = {
  get: () => api.get('/cart'),
  getSummary: (params) => api.get('/cart/summary', { params }),
  addItem: (productId, quantity = 1) => api.post('/cart/items', { productId, quantity }),
  updateItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  saveForLater: (itemId) => api.post(`/cart/items/${itemId}/save-for-later`),
  moveToCart: (itemId) => api.post(`/cart/saved/${itemId}/move-to-cart`),
  clear: () => api.delete('/cart'),
};

export const wishlistService = {
  get: () => api.get('/wishlist'),
  add: (productId) => api.post('/wishlist', { productId }),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
  moveToCart: (productId) => api.post('/wishlist/move-to-cart', { productId }),
};

export const orderService = {
  getMyOrders: () => api.get('/orders/my'),
  getById: (id) => api.get(`/orders/${id}`),
  getInvoice: (id) => api.get(`/orders/${id}/invoice`),
  cancel: (id, reason) => api.post(`/orders/${id}/cancel`, { reason }),
  reorder: (id) => api.post(`/orders/${id}/reorder`),
  getAll: () => api.get('/orders/all'),
  updateStatus: (id, orderStatus) => api.put(`/orders/${id}/status`, { orderStatus }),
  getStats: () => api.get('/orders/stats'),
};

export const paymentService = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verify: (data) => api.post('/payments/verify', data),
  getByOrder: (orderId) => api.get(`/payments/order/${orderId}`),
};

export const reviewService = {
  getByProduct: (slug, params) => api.get(`/reviews/product/${slug}`, { params }),
  create: (data) => api.post('/reviews', data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const couponService = {
  getActive: () => api.get('/coupons'),
  validate: (code) => api.post('/coupons/validate', { code }),
  remove: () => api.delete('/coupons'),
};
