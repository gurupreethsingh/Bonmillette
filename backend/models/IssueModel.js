const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "open",
        "assigned",
        "re-assigned",
        "in-progress",
        "fixed",
        "closed",
      ],
      default: "open",
    },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, // Optional reference to Order model
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Assigned employee
    assigned_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Assigned by
    closed_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Closed by
    issue_images: [{ type: String }], // Array of image paths
    assigned_date: { type: Date }, // Date when the issue was assigned
    fixed_date: { type: Date }, // Date when the issue was fixed
    re_opened_date: { type: Date }, // Date when the issue was reopened
    closed_date: { type: Date }, // Date when the issue was closed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
