const mongoose = require("mongoose");
const crypto = require("crypto");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        product_name: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        price_per_unit: { type: Number, required: true },
        total_price: { type: Number, required: true },
        sku: { type: String, required: true },
      },
    ],
    shipping_address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    payment_method: {
      type: String,
      required: true,
      enum: [
        "Credit Card",
        "Debit Card",
        "UPI",
        "PayPal",
        "Net Banking",
        "Cash on Delivery",
      ],
    },
    payment_status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    order_status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled", "Returned"],
      default: "Processing",
    },
    delivery_status: {
      type: String,
      enum: [
        "Assigned",
        "Picked Up",
        "Out for Delivery",
        "Pending",
        "Shipped",
        "Delivered",
        "Not Delivered",
        "Returned",
        "Cancelled",
      ],
      default: "Pending",
    },
    dispatchStatus: {
      type: String,
      enum: ["Not Dispatched", "Dispatch", "Don't Dispatch"],
      default: "Not Dispatched",
    },
    dispatchDate: { type: Date },
    deliveredDate: { type: Date },
    receiverOtp: { type: String },
    history: [
      {
        status: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    subtotal: { type: Number, required: true },
    shipping_cost: { type: Number, required: true },
    total_cost: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    transaction_id: { type: String },
    additional_notes: { type: String, maxlength: 500 },
    tracking_id: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Middleware to track status changes
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  if (this.isModified("order_status") || this.isModified("delivery_status")) {
    this.history.push({
      status: `${this.order_status} | ${this.delivery_status}`,
    });
  }
  next();
});

// Method to generate OTP
orderSchema.methods.generateOtp = function () {
  const otp = crypto.randomInt(100000, 999999).toString();
  this.receiverOtp = otp;
  return otp;
};

// Method to verify OTP and update delivery status
orderSchema.methods.verifyAndUpdateDelivery = async function (enteredOtp) {
  if (enteredOtp !== this.receiverOtp) {
    throw new Error("Invalid OTP.");
  }
  this.delivery_status = "Delivered";
  this.deliveredDate = Date.now();
  this.history.push({ status: "Delivered" });
  this.receiverOtp = null; // Reset OTP after successful delivery
};

module.exports = mongoose.model("Order", orderSchema);
