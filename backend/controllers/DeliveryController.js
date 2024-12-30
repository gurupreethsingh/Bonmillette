const DeliveryTask = require("../models/DeliveryModel");
const User = require("../models/UserModel");
const Order = require("../models/OrderModel");
const Outlet = require("../models/OutletModel");
const nodemailer = require("nodemailer");

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

module.exports = { assignOrderToDeliveryAgent };
