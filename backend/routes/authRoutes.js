const express = require('express');
const rateLimit = require('express-rate-limit');
const { registerUser, loginUser, verifyEmailOtp, resendEmailOtp, requestPasswordReset, resetPassword, getUsers, getProfile, updateProfile, uploadAvatar, saveAddress, deleteAddress } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/')) });

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts from this address. Please try again in 15 minutes.' }
});

const otpSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many verification codes requested. Please try again in 15 minutes.' }
});

router.post('/register', otpSendLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/verify-email', authLimiter, verifyEmailOtp);
router.post('/resend-verification', otpSendLimiter, resendEmailOtp);
router.post('/forgot-password', otpSendLimiter, requestPasswordReset);
router.post('/reset-password', authLimiter, resetPassword);
router.route('/profile').get(protect, getProfile).put(protect, updateProfile);
router.post('/profile/avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/addresses', protect, saveAddress);
router.delete('/addresses/:id', protect, deleteAddress);
router.get('/users', protect, admin, getUsers);

module.exports = router;
