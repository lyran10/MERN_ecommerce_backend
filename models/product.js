// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, index: true, unique: true },
  description: String,
  price: Number,
  images: [String],
  category: String,
  brand: String,
  stock: Number,
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
}, { timestamps: true });

// Text index for search (title, description, brand, category)
productSchema.index({ title: "text", description: "text", brand: "text", category: "text" });

// Generate slug automatically from title if not provided
productSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // replace spaces & special chars
      .replace(/^-+|-+$/g, "")     // trim hyphens
      + "-" + Date.now();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
