const express = require('express');
const router = express.Router();
const { addReview } = require('../controllers/reviewController');
const auth = require('../middleware/auth'); // your JWT/Firebase auth middleware

router.post('/:productId/reviews', auth, addReview);

module.exports = router;