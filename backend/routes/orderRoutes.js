const express = require('express');
const {
  getMyOrders,
  getOrderById,
  getInvoice,
  cancelOrder,
  reorder,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/my', getMyOrders);
router.get('/stats', authorize('admin'), getDashboardStats);
router.get('/all', authorize('admin'), getAllOrders);
router.get('/:id/invoice', getInvoice);
router.post('/:id/cancel', cancelOrder);
router.post('/:id/reorder', reorder);
router.get('/:id', getOrderById);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router;
