const mongoose = require("mongoose");

const hottestCategorySchema = new mongoose.Schema({
  hottest_category_name: { type: String, required: true },
  hottest_category_description: { type: String, required: true },
  hottest_category_image: { type: String, required: true },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to Product model
    },
  ],
  isActive: { type: Boolean, default: true }, // To indicate if the hottest category is active
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update the `updatedAt` field
hottestCategorySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure products are populated when querying
hottestCategorySchema.pre(/^find/, function (next) {
  this.populate("products"); // Automatically populate product data
  next();
});

const HottestCategory = mongoose.model(
  "HottestCategory",
  hottestCategorySchema
);

module.exports = HottestCategory;
