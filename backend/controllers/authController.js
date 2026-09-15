const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const OTP_EXPIRY_MINUTES = 10;

const normaliseEmail = (email = '') => email.trim().toLowerCase();

const createAndSendVerificationOtp = async (user) => {
  const otp = crypto.randomInt(100000, 1000000).toString();
  user.emailVerificationOtpHash = await bcrypt.hash(otp, 10);
  user.emailVerificationOtpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  await user.save();

  await sendEmail({
    email: user.email,
    subject: 'Verify your ShopNest email',
    message: `
      <h2>Welcome to ShopNest, ${user.name}!</h2>
      <p>Enter this code to verify your email address:</p>
      <p style="font-size: 24px; letter-spacing: 4px;"><strong>${otp}</strong></p>
      <p>This code expires in ${OTP_EXPIRY_MINUTES} minutes. If you did not create this account, you can ignore this email.</p>
    `
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const cleanedEmail = normaliseEmail(email);
    if (!name?.trim() || !cleanedEmail || !password || password.length < 6) {
      return res.status(400).json({ message: 'Name, a valid email, and a password of at least 6 characters are required' });
    }
    
    const userExists = await User.findOne({ email: cleanedEmail });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name: name.trim(), email: cleanedEmail, password: hashedPassword, emailVerified: false });
    if (user) {
      await createAndSendVerificationOtp(user);
      res.status(201).json({
        email: user.email,
        message: 'Verification code sent. Check your email to finish creating your account.'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: normaliseEmail(email) });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.emailVerified === false) {
        return res.status(403).json({ message: 'Verify your email before logging in', requiresVerification: true, email: user.email });
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!/^\d{6}$/.test(otp || '')) {
      return res.status(400).json({ message: 'Enter the six-digit verification code' });
    }

    const user = await User.findOne({ email: normaliseEmail(email) }).select('+emailVerificationOtpHash +emailVerificationOtpExpiresAt');
    if (!user || user.emailVerified) {
      return res.status(400).json({ message: 'This verification request is no longer valid' });
    }
    if (!user.emailVerificationOtpHash || !user.emailVerificationOtpExpiresAt || user.emailVerificationOtpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'This code has expired. Request a new one.' });
    }
    if (!(await bcrypt.compare(otp, user.emailVerificationOtpHash))) {
      return res.status(400).json({ message: 'That verification code is incorrect' });
    }

    user.emailVerified = true;
    user.emailVerificationOtpHash = undefined;
    user.emailVerificationOtpExpiresAt = undefined;
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resendEmailOtp = async (req, res) => {
  try {
    const user = await User.findOne({ email: normaliseEmail(req.body.email) });
    // This response deliberately does not reveal whether an address is registered.
    if (!user || user.emailVerified) return res.json({ message: 'If an unverified account exists, a new code has been sent.' });
    await createAndSendVerificationOtp(user);
    res.json({ message: 'A new verification code has been sent.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const requestPasswordReset = async (req, res) => {
  try { const user = await User.findOne({ email: normaliseEmail(req.body.email) }); if (user) { const otp = crypto.randomInt(100000, 1000000).toString(); user.passwordResetOtpHash = await bcrypt.hash(otp, 10); user.passwordResetOtpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000); await user.save(); await sendEmail({ email: user.email, subject: 'Reset your ShopNest password', message: `<p>Your password reset code is <strong>${otp}</strong>. It expires in ${OTP_EXPIRY_MINUTES} minutes.</p>` }); } res.json({ message: 'If an account exists, a reset code has been sent.' }); } catch (error) { res.status(500).json({ message: error.message }); }
};
const resetPassword = async (req, res) => {
  try { const { email, otp, password } = req.body; if (!/^\d{6}$/.test(otp || '') || !password || password.length < 6) return res.status(400).json({ message: 'Enter a six-digit code and a password of at least 6 characters' }); const user = await User.findOne({ email: normaliseEmail(email) }).select('+passwordResetOtpHash +passwordResetOtpExpiresAt'); if (!user || !user.passwordResetOtpHash || user.passwordResetOtpExpiresAt < new Date() || !(await bcrypt.compare(otp, user.passwordResetOtpHash))) return res.status(400).json({ message: 'The reset code is invalid or expired' }); user.password = await bcrypt.hash(password, 10); user.passwordResetOtpHash = undefined; user.passwordResetOtpExpiresAt = undefined; await user.save(); res.json({ message: 'Password updated. You can now log in.' }); } catch (error) { res.status(500).json({ message: error.message }); }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => res.json(await User.findById(req.user._id).select('-password'));
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.name = req.body.name?.trim() || user.name;
    user.phone = req.body.phone?.trim() ?? user.phone;
    user.avatarUrl = req.body.avatarUrl?.trim() ?? user.avatarUrl;
    if (req.body.password) {
      if (req.body.password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, avatarUrl: user.avatarUrl, token: generateToken(user._id) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Choose an image file first' });
    const cloudinary = require('../config/cloudinary');
    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'shopnest/avatars', transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }] });
    const user = await User.findById(req.user._id); user.avatarUrl = result.secure_url; await user.save();
    res.json({ avatarUrl: user.avatarUrl });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const saveAddress = async (req, res) => {
  try {
    const address = req.body;
    if (!address.fullName || !address.phone || !address.street || !address.city || !address.postalCode) return res.status(400).json({ message: 'Please complete all required address fields' });
    const user = await User.findById(req.user._id);
    if (address.isDefault || !user.addresses.length) user.addresses.forEach(item => { item.isDefault = false; });
    user.addresses.push(address); await user.save(); res.status(201).json(user.addresses);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter(address => address._id.toString() !== req.params.id);
  if (user.addresses.length && !user.addresses.some(address => address.isDefault)) user.addresses[0].isDefault = true;
  await user.save(); res.json(user.addresses);
};

module.exports = { registerUser, loginUser, verifyEmailOtp, resendEmailOtp, requestPasswordReset, resetPassword, getUsers, getProfile, updateProfile, uploadAvatar, saveAddress, deleteAddress };
