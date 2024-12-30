const mongoose = require("mongoose");

const featuredProductSchema = new mongoose.Schema({
  featured_product_name: { type: String, required: true },
  featured_product_description: { type: String, required: true },
  featured_product_image: { type: String, required: true },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to Product model
    },
  ],
  isFeatured: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update the `updatedAt` field
featuredProductSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure products are populated when querying
featuredProductSchema.pre(/^find/, function (next) {
  this.populate("products"); // Automatically populate product data
  next();
});

const FeaturedProduct = mongoose.model(
  "FeaturedProduct",
  featuredProductSchema
);

module.exports = FeaturedProduct;
