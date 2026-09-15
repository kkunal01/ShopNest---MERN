const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  // New accounts must prove they control the email address before receiving a token.
  // Keeping this undefined for older records preserves access for existing users.
  emailVerified: { type: Boolean },
  emailVerificationOtpHash: { type: String, select: false },
  emailVerificationOtpExpiresAt: { type: Date, select: false },
  phone: { type: String, trim: true },
  avatarUrl: { type: String, trim: true },
  addresses: [{
    label: { type: String, default: 'Home' }, fullName: { type: String, required: true }, phone: { type: String, required: true },
    street: { type: String, required: true }, city: { type: String, required: true }, state: { type: String }, postalCode: { type: String, required: true }, country: { type: String, default: 'India' }, landmark: { type: String }, isDefault: { type: Boolean, default: false }
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  passwordResetOtpHash: { type: String, select: false },
  passwordResetOtpExpiresAt: { type: Date, select: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
