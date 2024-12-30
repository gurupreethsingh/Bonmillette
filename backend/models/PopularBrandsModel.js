const mongoose = require("mongoose");

const popularBrandSchema = new mongoose.Schema({
  brand_name: { type: String, required: true }, // Name of the brand
  brand_description: { type: String, required: true }, // Description of the brand
  brand_image: { type: String, required: true }, // Image representing the brand
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to Product model
    },
  ],
  isActive: { type: Boolean, default: true }, // To indicate if the brand is active
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update the `updatedAt` field
popularBrandSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure products are populated when querying
popularBrandSchema.pre(/^find/, function (next) {
  this.populate("products"); // Automatically populate product data
  next();
});

const PopularBrand = mongoose.model("PopularBrand", popularBrandSchema);

module.exports = PopularBrand;
