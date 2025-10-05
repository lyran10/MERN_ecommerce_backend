// controllers/productController.js
const Product = require('../models/product');

exports.get = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews");
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product, message: "Product fetched successfully" });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      // store the uploaded image path
      data.images = [`${process.env.SERVER_URL}/uploads/${req.file.filename}`]; 
    }

    const p = await Product.create(data);
    res.status(201).json({ product: p, message: "Product created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.images = [`${process.env.SERVER_URL}/uploads/${req.file.filename}`];
    }

    const p = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!p) return res.status(404).json({ message: "Product not found" });

    res.json({ product: p, message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

exports.remove = async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

exports.list = async (req, res) => {
  try {
    let { page = 1, limit = 12, search, category, brand, min, max, sort } = req.query;
    page = Number(page); 
    limit = Number(limit);

    const q = {};
    if (search) q.$text = { $search: search };
    if (category) q.category = { $regex: category, $options: 'i' };
    if (brand) q.brand = { $regex: brand, $options: 'i' };
    if (min || max) q.price = {};
    if (min) q.price.$gte = Number(min);
    if (max) q.price.$lte = Number(max);

    let cursor = Product.find(q);
    if (sort === 'price_asc') cursor = cursor.sort({ price: 1 });
    else if (sort === 'price_desc') cursor = cursor.sort({ price: -1 });

    const total = await Product.countDocuments(q);
    const products = await cursor.skip((page - 1) * limit).limit(limit);

    res.json({ products, total, page, limit, message: "Products fetched successfully" });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};
