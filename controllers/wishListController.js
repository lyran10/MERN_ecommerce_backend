const Wishlist = require('../models/wishList');

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    res.json({ 
      wishlist: wishlist || { products: [] }, 
      message: 'Wishlist fetched successfully', 
      status: 'success' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', status: 'error' });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
      return res.json({ 
        wishlist, 
        message: 'Product added to wishlist successfully!', 
        status: 'success' 
      });
    }

    // Product already in wishlist
    res.json({ 
      wishlist, 
      message: 'Product is already in wishlist', 
      status: 'info' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', status: 'error' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found', status: 'error' });

    wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
    await wishlist.save();

    res.json({ 
      wishlist, 
      message: 'Product removed from wishlist successfully!', 
      status: 'success' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', status: 'error' });
  }
};
