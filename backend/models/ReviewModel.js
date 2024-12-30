// models/ReviewModel.js
const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "productType",
  }, // Dynamic reference
  productType: {
    type: String,
    required: true,
    enum: ["Product", "ProductInFeatured"], // Allowed models
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  adminResponse: { type: String }, // Optional response from admin/seller
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
