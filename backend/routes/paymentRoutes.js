const express = require('express');
const { createOrder, verifyPayment, getPaymentByOrder } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/order/:orderId', getPaymentByOrder);

module.exports = router;
