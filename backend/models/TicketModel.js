const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user raising the ticket
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to the product associated with the ticket
      required: true,
    },
    issueDescription: {
      type: String,
      required: true,
      maxlength: 500, // Limiting the issue description length
    },
    productImage: {
      type: String, // Path to the uploaded product image
    },
    status: {
      type: String,
      enum: [
        "Raised", // When the ticket is created by the customer
        "Assigned", // When the ticket is assigned to an employee
        "In Progress", // When the employee is working on the issue
        "Completed", // When the employee marks the task as completed
        "Closed", // When the super admin closes the ticket
        "Reopened", // When the super admin reopens a closed ticket
      ],
      default: "Raised",
    },
    assignedEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", // Reference to the assigned employee
    },
    raisedAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // User who added the comment (customer, employee, or admin)
        },
        comment: {
          type: String,
          maxlength: 300, // Limiting comment length
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

ticketSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Ticket", ticketSchema);
