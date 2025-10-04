// controllers/orderController.js
const Order = require('../models/order');

exports.createOrder = async (req,res) => {
  try {
    const { items, total, shippingAddress, paymentInfo } = req.body;
    const order = await Order.create({
      user: req.user._id,
      items, total, shippingAddress, paymentInfo
    });
    res.json(order);
  } catch (err) { console.error(err); res.status(500).json({ message:'Server error' }); }
};

exports.myOrders = async (req,res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    res.json(orders);
  } catch (err) { console.error(err); res.status(500).json({ message:'Server error' }); }
};
