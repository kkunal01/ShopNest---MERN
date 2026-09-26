const express = require('express');
const rateLimit = require('express-rate-limit');
const ContactMessage = require('../models/ContactMessage');
const sendEmail = require('../utils/sendEmail');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const router = express.Router();

// Submit a new contact/support message
router.post(
  '/',
  protect,
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  }),
  async (req, res) => {
    try {
      const { name, email, subject, orderNumber, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Please complete all required fields' });
      }

      const ticket = await ContactMessage.create({
        name,
        email,
        subject,
        orderNumber,
        message,
      });

      await sendEmail({
        email: process.env.SUPPORT_EMAIL || process.env.GMAIL_USER,
        subject: `[ShopNest Support] ${subject}`,
        message: `
          <p>From: ${name} (${email})</p>
          <p>Order: ${orderNumber || 'Not provided'}</p>
          <p>${message}</p>
        `,
      });

      res.status(201).json({
        message: 'Thanks — your message has been sent.',
        ticketId: ticket._id,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get all support messages (Admin Only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
