const Razorpay = require('razorpay');
const crypto = require('crypto');
const Product = require('../models/Product');
const Order = require('../models/Order');

const calculateItems = async (items) => {
  if (!Array.isArray(items) || !items.length) throw new Error('Your cart is empty');
  const products = await Product.find({ _id: { $in: items.map(item => item.productId) } });
  if (products.length !== items.length) throw new Error('One or more products are unavailable');
  return items.map(item => {
    const product = products.find(p => p._id.toString() === item.productId);
    const qty = Number(item.qty);
    if (!Number.isInteger(qty) || qty < 1 || product.stock < qty) throw new Error(`${product.name} is out of stock`);
    return { productId: product._id, qty, price: product.price };
  });
};

const createOrder = async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return res.status(503).json({ message: 'Payments are temporarily unavailable. Contact support if the problem continues.' });
    const items = await calculateItems(req.body.items);
    const amount = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    
    // Razorpay accepts amount in paise
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
    };
    
    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Some error occured");
    res.json({ ...order, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(500).send(error);
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, address } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const verifiedItems = await calculateItems(items);
      if (!address?.fullName || !address?.street || !address?.city || !address?.postalCode || !address?.phone) return res.status(400).json({ message: 'A complete delivery address is required' });
      const order = await Order.create({ userId: req.user._id, items: verifiedItems, totalAmount: verifiedItems.reduce((sum, item) => sum + item.price * item.qty, 0), address, paymentId: razorpay_payment_id, razorpayOrderId: razorpay_order_id, status: 'Paid' });
      await Promise.all(verifiedItems.map(item => Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.qty } })));
      return res.status(201).json({ message: 'Payment verified successfully', order });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createOrder, verifyPayment };
