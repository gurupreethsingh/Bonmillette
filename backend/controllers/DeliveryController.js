const DeliveryTask = require("../models/DeliveryModel");
const User = require("../models/UserModel");
const Order = require("../models/OrderModel");
const Outlet = require("../models/OutletModel");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const assignOrderToDeliveryAgent = async (req, res) => {
  try {
    const { orderId, deliveryAgentId, outletId, message } = req.body;

    // Fetch order details with user populated
    const order = await Order.findOne({ orderId }).populate("user"); // Populating the `user` field
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Fetch outlet details
    const outlet = await Outlet.findById(outletId);
    if (!outlet) {
      return res.status(404).json({ message: "Outlet not found." });
    }

    // Fetch delivery agent details
    const deliveryAgent = await User.findById(deliveryAgentId);
    if (!deliveryAgent) {
      return res.status(404).json({ message: "Delivery agent not found." });
    }

    // Create a delivery task
    const deliveryTask = new DeliveryTask({
      orderId,
      deliveryAgent: deliveryAgentId,
      customer: order.user._id, // Use the populated user ID
      outlet: outlet._id,
      products: order.products.map((product) => ({
        product_name: product.product_name,
        quantity: product.quantity,
      })),
      deliveryStatus: "Assigned",
      deliveryNotes: message,
      statusTimings: { assignedAt: new Date() },
      history: [{ status: "Assigned", timestamp: new Date() }],
    });
    await deliveryTask.save();

    // Set up email notifications
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const emailRecipients = [
      { email: deliveryAgent.email, role: "Delivery Agent" },
      { email: outlet.outlet_email, role: "Outlet" },
      { email: process.env.SUPER_ADMIN_EMAIL, role: "Superadmin" },
    ];

    for (const recipient of emailRecipients) {
      const messageContent = `
            Hello ${recipient.role},
            
            A new delivery task has been assigned. Here are the details:
            
            Order ID: ${orderId}
            Customer: ${order.user.name} (${order.user.email})
            Customer Address: ${order.shipping_address.street}, ${
        order.shipping_address.city
      }, ${order.shipping_address.state}, ${
        order.shipping_address.postalCode
      }, ${order.shipping_address.country}
            Outlet Address: ${outlet.outlet_address.street}, ${
        outlet.outlet_address.city
      }, ${outlet.outlet_address.state}, ${outlet.outlet_address.zip_code}, ${
        outlet.outlet_address.country
      }
            Products:
            ${order.products
              .map(
                (product) =>
                  `${product.product_name} - Quantity: ${product.quantity}`
              )
              .join("\n")}
            
            Delivery Message: ${message}
          `;

      await transporter.sendMail({
        from: process.env.EMAIL,
        to: recipient.email,
        subject: "New Delivery Assignment",
        text: messageContent,
      });
    }

    res.status(200).json({
      message: "Order assigned and notifications sent successfully.",
    });
  } catch (error) {
    console.error("Error assigning order:", error.message);
    res.status(500).json({ message: "Server error. Unable to assign order." });
  }
};

// Count total deliveries
const countTotalDeliveries = async (req, res) => {
  try {
    const totalDeliveries = await DeliveryTask.countDocuments();
    res.status(200).json({ totalDeliveries });
  } catch (error) {
    console.error("Error counting deliveries:", error.message);
    res
      .status(500)
      .json({ message: "Server error. Unable to count deliveries." });
  }
};

// show or fetch all deliveries.
// Fetch all deliveries
const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await DeliveryTask.find().populate([
      "customer",
      "outlet",
      "deliveryAgent",
    ]);
    res.status(200).json(deliveries);
  } catch (error) {
    console.error("Error fetching deliveries:", error.message);
    res
      .status(500)
      .json({ message: "Server error. Unable to fetch deliveries." });
  }
};

// Delete a delivery
const deleteDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.params;

    const deletedDelivery = await DeliveryTask.findByIdAndDelete(deliveryId);

    if (!deletedDelivery) {
      return res.status(404).json({ message: "Delivery not found." });
    }

    res.status(200).json({ message: "Delivery deleted successfully." });
  } catch (error) {
    console.error("Error deleting delivery:", error.message);
    res
      .status(500)
      .json({ message: "Server error. Unable to delete delivery." });
  }
};

//

// Fetch a single delivery
const getSingleDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.params;

    const delivery = await DeliveryTask.findById(deliveryId).populate([
      "customer",
      "outlet",
      "deliveryAgent",
    ]);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found." });
    }

    res.status(200).json(delivery);
  } catch (error) {
    console.error("Error fetching delivery:", error.message);
    res
      .status(500)
      .json({ message: "Server error. Unable to fetch delivery." });
  }
};

// get the deliveries assigned to particular agent.
const getDeliveriesByAgent = async (req, res) => {
  try {
    const { id: deliveryAgentId } = req.params; // Ensure the parameter matches the route
    console.log("Delivery Agent ID:", deliveryAgentId);

    const deliveries = await DeliveryTask.find({
      deliveryAgent: deliveryAgentId,
    }).populate(["customer", "outlet"]);

    if (!deliveries || deliveries.length === 0) {
      return res
        .status(404)
        .json({ message: "No deliveries found for this agent." });
    }

    res.status(200).json(deliveries);
  } catch (error) {
    console.error("Error fetching deliveries:", error.message);
    res
      .status(500)
      .json({ message: "Server error. Unable to fetch deliveries." });
  }
};

// Count total assigned deliveries of particular agent.
const countAssignedDeliveries = async (req, res) => {
  try {
    const assignedDeliveries = await DeliveryTask.countDocuments({
      deliveryStatus: "Assigned",
    });
    res.status(200).json({ assignedDeliveries });
  } catch (error) {
    console.error("Error counting assigned deliveries:", error.message);
    res
      .status(500)
      .json({ message: "Server error. Unable to count assigned deliveries." });
  }
};

//

const getSingleAssignedDelivery = async (req, res) => {
  try {
    const { deliveryAgentId, deliveryId } = req.params;

    const delivery = await DeliveryTask.findOne({
      _id: deliveryId,
      deliveryAgent: deliveryAgentId,
    }).populate(["customer", "outlet", "deliveryAgent"]);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found." });
    }

    res.status(200).json(delivery);
  } catch (error) {
    console.error("Error fetching assigned delivery:", error.message);
    res
      .status(500)
      .json({ message: "Server error. Unable to fetch assigned delivery." });
  }
};

// utility function to synchronize the delivery status.

const synchronizeDeliveryStatus = async (orderId, newStatus, comments) => {
  try {
    const timingField = `${newStatus.replace(/ /g, "")}At`; // Convert status to camelCase field

    // Update DeliveryTask
    await DeliveryTask.updateOne(
      { orderId },
      {
        $set: {
          deliveryStatus: newStatus,
          [`statusTimings.${timingField}`]: new Date(),
        },
        $push: {
          history: { status: newStatus, timestamp: new Date() },
          ...(comments
            ? { remarksByAgent: { status: newStatus, remark: comments } }
            : {}),
        },
      }
    );

    // Update Order
    await Order.updateOne(
      { orderId },
      {
        $set: { delivery_status: newStatus },
        $push: {
          history: { status: newStatus, timestamp: new Date() },
        },
      }
    );
  } catch (error) {
    console.error("Error synchronizing delivery status:", error.message);
    throw new Error("Synchronization failed.");
  }
};

const updateDeliveryAndOrderStatus = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { status, comments } = req.body;

    // Validate the status
    const allowedStatuses = [
      "Pending",
      "Assigned",
      "Picked Up",
      "Out for Delivery",
      "Delivered",
      "Not Delivered",
      "Returned",
      "Cancelled",
    ];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed statuses are: ${allowedStatuses.join(
          ", "
        )}`,
      });
    }

    // Find the DeliveryTask
    const deliveryTask = await DeliveryTask.findById(deliveryId);
    if (!deliveryTask) {
      return res.status(404).json({ message: "Delivery task not found." });
    }

    // Call synchronizeDeliveryStatus to update both DeliveryTask and Order
    await synchronizeDeliveryStatus(deliveryTask.orderId, status, comments);

    // Fetch updated DeliveryTask for the response
    const updatedDeliveryTask = await DeliveryTask.findById(deliveryId);

    res.status(200).json({
      success: true,
      message: "Delivery and order statuses updated successfully.",
      deliveryTask: updatedDeliveryTask,
    });
  } catch (error) {
    console.error("Error updating delivery and order statuses:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update delivery and order statuses.",
    });
  }
};

//

// Send OTP for Delivery
const sendDeliveryOtp = async (req, res) => {
  try {
    const { deliveryId } = req.params;

    const deliveryTask = await DeliveryTask.findById(deliveryId).populate(
      "customer",
      "email"
    );
    if (!deliveryTask) {
      return res.status(404).json({ message: "Delivery task not found." });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    deliveryTask.receiverOtp = otp; // Store OTP in the delivery task
    await deliveryTask.save(); // Save the updated delivery task

    // Log the saved OTP for debugging
    console.log(`Generated OTP for Delivery ID ${deliveryId}: ${otp}`);

    // Send OTP to customer's email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const emailContent = `
      Hello,
      Your OTP for delivery verification is: ${otp}.
      Please provide this to the delivery agent for successful order delivery.
    `;

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: deliveryTask.customer.email,
      subject: "Delivery OTP - Your Order",
      text: emailContent,
    });

    res.status(200).json({ message: "Delivery OTP sent successfully." });
  } catch (error) {
    console.error("Error sending delivery OTP:", error.message);
    res.status(500).json({ message: "Failed to send delivery OTP." });
  }
};

// Send OTP for Cancellation
const sendCancellationOtp = async (req, res) => {
  try {
    const { deliveryId } = req.params;

    const deliveryTask = await DeliveryTask.findById(deliveryId).populate(
      "customer",
      "email"
    );
    if (!deliveryTask) {
      return res.status(404).json({ message: "Delivery task not found." });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    deliveryTask.receiverOtp = otp; // Store OTP in the delivery task
    await deliveryTask.save();

    // Send OTP to customer's email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const emailContent = `
      Hello,
      Your OTP for order cancellation is: ${otp}.
      Please provide this to the delivery agent if you wish to cancel the order.
    `;

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: deliveryTask.customer.email,
      subject: "Cancellation OTP - Your Order",
      text: emailContent,
    });

    res.status(200).json({ message: "Cancellation OTP sent successfully." });
  } catch (error) {
    console.error("Error sending cancellation OTP:", error.message);
    res.status(500).json({ message: "Failed to send cancellation OTP." });
  }
};

// Verify OTP and Update Status
const verifyOtp = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { otp, status } = req.body;

    console.log("Received Status:", status);
    console.log("Received OTP:", otp);

    const allowedStatuses = ["Delivered", "Cancelled", "Returned"];
    if (!allowedStatuses.includes(status)) {
      console.log("Invalid Status:", status);
      return res.status(400).json({ message: "Invalid status." });
    }

    const deliveryTask = await DeliveryTask.findById(deliveryId).exec();
    if (!deliveryTask) {
      return res.status(404).json({ message: "Delivery task not found." });
    }

    console.log("Expected OTP:", deliveryTask.receiverOtp);

    if (deliveryTask.receiverOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // Update delivery status
    await synchronizeDeliveryStatus(deliveryTask.orderId, status);
    deliveryTask.deliveryStatus = status;
    deliveryTask.receiverOtp = null; // Clear OTP after verification
    await deliveryTask.save();

    res.status(200).json({
      message: `Order successfully marked as ${status}.`,
      deliveryTask,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({ message: "Failed to verify OTP." });
  }
};

module.exports = {
  assignOrderToDeliveryAgent,
  countTotalDeliveries,
  countAssignedDeliveries,
  getAllDeliveries,
  deleteDelivery,
  getSingleDelivery,
  getDeliveriesByAgent,
  getSingleAssignedDelivery,
  updateDeliveryAndOrderStatus,
  sendDeliveryOtp,
  sendCancellationOtp,
  verifyOtp,
};
