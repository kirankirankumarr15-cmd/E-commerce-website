const nodemailer = require('nodemailer');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const config = require('../config');

const sendOtpEmail = async (email, otp) => {
  if (!config.smtpHost || !config.smtpUser || !config.smtpPass) {
    console.log(`\n[OTP LOGIN] Email: ${email}\nOTP: ${otp}\n`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpPort === 465,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });

  await transporter.sendMail({
    from: config.smtpFrom,
    to: email,
    subject: 'Your NOVA MART login OTP',
    text: `Your NOVA MART login OTP is ${otp}. It is valid for 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="margin-bottom: 16px; color: #1f2937;">NOVA MART Login OTP</h2>
        <p style="color: #4b5563;">Your verification code is:</p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 4px; margin: 20px 0; color: #4f46e5;">${otp}</div>
        <p style="color: #4b5563;">This code is valid for 5 minutes.</p>
      </div>
    `,
  });
};

const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(400, 'An account with this email already exists');
  }

  const user = await User.create({ firstName, lastName, email: normalizedEmail, password, phone });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: generateToken(user._id),
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated');
  }

  // Password-based login
  if (password) {
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    return res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
        },
        token: generateToken(user._id),
      },
    });
  }

  // OTP-based login (password omitted)
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.otp = otp;
  user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  await sendOtpEmail(user.email, otp);

  const hasSmtp = Boolean(config.smtpHost && config.smtpUser && config.smtpPass);

  res.json({
    success: true,
    message: hasSmtp
      ? 'OTP has been sent to your email. Please verify to continue.'
      : `OTP generated for demo/testing. (Dev OTP: ${otp})`,
    data: {
      requiresOtp: true,
      email: user.email,
      ...(!hasSmtp ? { devOtp: otp } : {}),
    },
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or OTP');
  }

  if (!user.otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    throw new ApiError(401, 'OTP expired. Please try logging in again.');
  }

  if (user.otp !== otp) {
    throw new ApiError(401, 'Invalid email or OTP');
  }

  user.otp = '';
  user.otpExpiresAt = null;
  await user.save();

  res.json({
    success: true,
    message: 'OTP verified successfully',
    data: {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
      token: generateToken(user._id),
    },
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, data: user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, avatar } = req.body;

  const user = await User.findById(req.user._id);
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phone !== undefined) user.phone = phone;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.json({
      success: true,
      message: 'If an account exists with that email, a reset link will be sent.',
    });
    return;
  }

  // Phase 2: Implement email sending
  res.json({
    success: true,
    message: 'Password reset functionality will be available in Phase 2.',
  });
});

const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  user.addresses.push(req.body);
  await user.save();

  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    data: user.addresses,
  });
});

const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) throw new ApiError(404, 'Address not found');

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  Object.assign(address, req.body);
  await user.save();

  res.json({
    success: true,
    message: 'Address updated successfully',
    data: user.addresses,
  });
});

const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) throw new ApiError(404, 'Address not found');

  address.deleteOne();
  await user.save();

  res.json({
    success: true,
    message: 'Address deleted successfully',
    data: user.addresses,
  });
});

module.exports = {
  register,
  login,
  verifyOtp,
  getProfile,
  updateProfile,
  forgotPassword,
  addAddress,
  updateAddress,
  deleteAddress,
};
