const mongoose = require("mongoose");

const advertisementSchema = new mongoose.Schema({
  advertisement_name: { type: String, required: true },
  advertisement_description: { type: String, required: true },
  advertisement_image: { type: String, required: true },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to Product model
    },
  ],
  isActive: { type: Boolean, default: true }, // To indicate if the advertisement is active
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update the `updatedAt` field
advertisementSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure products are populated when querying
advertisementSchema.pre(/^find/, function (next) {
  this.populate("products"); // Automatically populate product data
  next();
});

const Advertisement = mongoose.model("Advertisement", advertisementSchema);

module.exports = Advertisement;
