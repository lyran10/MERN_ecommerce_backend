const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const wishlistCtrl = require('../controllers/wishListController');

router.get('/', auth, wishlistCtrl.getWishlist);
router.post('/', auth, wishlistCtrl.addToWishlist);
router.delete('/:productId', auth, wishlistCtrl.removeFromWishlist);

module.exports = router;
