const Review = require('../models/review');
const Product = require('../models/product');

exports.addReview = async (req, res) => {
  try {
    const { rating, text } = req.body;
    const productId = req.params.productId;

    const review = new Review({
      user: req.user._id,   // from auth middleware
      product: productId,
      rating,
      text
    });

    await review.save();

    // also push review into product.reviews
    const product = await Product.findById(productId);
    product.reviews.push(review._id);
    await product.save();

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
