const express = require('express');
const rateLimit = require('express-rate-limit');
const { registerUser, loginUser, verifyEmailOtp, resendEmailOtp, getUsers, getProfile, updateProfile, saveAddress, deleteAddress } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts from this address. Please try again in 15 minutes.' }
});

const otpSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many verification codes requested. Please try again in 15 minutes.' }
});

router.post('/register', otpSendLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/verify-email', authLimiter, verifyEmailOtp);
router.post('/resend-verification', otpSendLimiter, resendEmailOtp);
router.route('/profile').get(protect, getProfile).put(protect, updateProfile);
router.post('/addresses', protect, saveAddress);
router.delete('/addresses/:id', protect, deleteAddress);
router.get('/users', protect, admin, getUsers);

module.exports = router;