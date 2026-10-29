const express = require('express');
const {
  register,
  login,
  verifyOtp,
  getProfile,
  updateProfile,
  forgotPassword,
  addAddress,
  updateAddress,
  deleteAddress,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  registerValidation,
  loginValidation,
  otpValidation,
  updateProfileValidation,
  addressValidation,
} = require('../validators/authValidator');

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/verify-otp', otpValidation, validate, verifyOtp);
router.post('/forgot-password', forgotPassword);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileValidation, validate, updateProfile);
router.post('/addresses', protect, addressValidation, validate, addAddress);
router.put('/addresses/:addressId', protect, addressValidation, validate, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

module.exports = router;
