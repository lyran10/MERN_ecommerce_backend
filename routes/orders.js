// routes/orders.js
const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/', auth, orderCtrl.createOrder);
router.get('/me', auth, orderCtrl.myOrders);

module.exports = router;
