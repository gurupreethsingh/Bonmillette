const mongoose = require("mongoose");

const DeliveryTaskSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    deliveryAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencing User model for delivery agents
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencing User model for customers
      required: true,
    },
    outlet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Outlet", // Referencing Outlet model
      required: true,
    },
    products: [
      {
        product_name: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    deliveryStatus: {
      type: String,
      enum: [
        "Pending",
        "Assigned",
        "Picked Up",
        "Out for Delivery",
        "Delivered",
        "Not Delivered",
        "Returned",
        "Cancelled",
      ],
      default: "Pending",
    },
    statusTimings: {
      pendingAt: { type: Date, default: Date.now }, // Timestamp for when the task is created
      assignedAt: { type: Date }, // Timestamp for "Assigned" status
      pickedUpAt: { type: Date }, // Timestamp for "Picked Up" status
      outForDeliveryAt: { type: Date }, // Timestamp for "Out for Delivery" status
      deliveredAt: { type: Date }, // Timestamp for "Delivered" status
      notDeliveredAt: { type: Date }, // Timestamp for "Not Delivered" status
      returnedAt: { type: Date }, // Timestamp for "Returned" status
      cancelledAt: { type: Date }, // Timestamp for "Cancelled" status
    },
    remarksByAgent: [
      {
        status: {
          type: String,
          enum: [
            "Pending",
            "Assigned",
            "Picked Up",
            "Out for Delivery",
            "Delivered",
            "Not Delivered",
            "Returned",
            "Cancelled",
          ],
        },
        remark: { type: String }, // Remark about the status
        timestamp: { type: Date, default: Date.now }, // Timestamp when the remark was added
      },
    ],
    deliveryNotes: { type: String }, // General notes about the delivery
    history: [
      {
        status: {
          type: String,
          enum: [
            "Pending",
            "Assigned",
            "Picked Up",
            "Out for Delivery",
            "Delivered",
            "Not Delivered",
            "Returned",
            "Cancelled",
          ],
        },
        timestamp: { type: Date, default: Date.now }, // Timestamp for each status change
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliveryTask", DeliveryTaskSchema);
