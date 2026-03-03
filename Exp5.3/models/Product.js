const mongoose = require("mongoose");

// Variant Schema
const variantSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  color: String,
  price: Number,
  stock: Number
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  rating: { type: Number, min: 1, max: 5 },
  comment: String
});

// Main Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  variants: [variantSchema],
  reviews: [reviewSchema],
  avgRating: { type: Number, default: 0 }
});

// Index for performance
productSchema.index({ category: 1 });
productSchema.index({ "variants.sku": 1 });

// Calculate average rating before saving
productSchema.methods.calculateAvgRating = function () {
  if (this.reviews.length === 0) {
    this.avgRating = 0;
  } else {
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.avgRating = total / this.reviews.length;
  }
};

module.exports = mongoose.model("Product", productSchema);