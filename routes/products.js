const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/productController');
const auth = require('../middleware/auth');
const multer = require('multer');

// multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, Date.now() + '.' + ext);
  }
});
const upload = multer({ storage });

// GET products
router.get('/', productCtrl.list);
router.get('/:id', productCtrl.get);

// CREATE product with image upload
router.post('/', upload.single("image"), productCtrl.create);

// UPDATE product with image upload
router.put('/:id', upload.single("image"), productCtrl.update);

// DELETE product
router.delete('/:id', auth, productCtrl.remove);

module.exports = router;
