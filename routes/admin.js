// routes/admin.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const productCtrl = require('../controllers/productController');
const analytics = require("../controllers/adminController")
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // e.g. .jpg
    const base = path.basename(file.originalname, ext); // e.g. myphoto
    cb(null, `${base}-${Date.now()}${ext}`); // myphoto-1723456789123.jpg
  }
});

const upload = multer({ storage });

// list products (admin check)
router.get('/products', auth, isAdmin, async (req, res) => {
  res.json({ message: 'admin products endpoint' });
});

// create product with image
router.post('/product', auth, isAdmin, upload.single("image"), productCtrl.create);

// update product with image
router.put('/product/:id', auth, isAdmin, upload.single("image"), productCtrl.update);

router.get("/analytics", auth, isAdmin, analytics.getAnalytics)

module.exports = router;
