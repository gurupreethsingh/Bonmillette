const mongoose = require("mongoose");
const { Schema } = mongoose;

// Coupon Schema
const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    discount: {
      type: Number, // Discount percentage (e.g., 10 for 10%)
      required: true,
      min: 0,
      max: 100,
    },
    maxDiscountAmount: {
      type: Number, // Maximum discount amount in currency
      default: null,
    },
    expirationDate: {
      type: Date,
      required: true, // Coupon expiry date
    },
    usageLimit: {
      type: Number, // Maximum number of times the coupon can be used
      default: null,
    },
    usedCount: {
      type: Number,
      default: 0, // Tracks how many times the coupon has been used
    },
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to specific products the coupon is applicable for
      },
    ],
    minCartValue: {
      type: Number, // Minimum cart value to apply the coupon
      default: 0,
    },
    isActive: {
      type: Boolean, // Indicates if the coupon is active
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Static method to generate a random coupon code
CouponSchema.statics.generateCouponCode = function (length = 8) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Coupon History Schema
const CouponHistorySchema = new Schema(
  {
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    discountApplied: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("Coupon", CouponSchema);
const CouponHistory = mongoose.model("CouponHistory", CouponHistorySchema);

module.exports = { Coupon, CouponHistory };
