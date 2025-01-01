const Order = require("../models/OrderModel");
const User = require("../models/UserModel"); // Import your User model
const Product = require("../models/ProductModel");
const mongoose = require("mongoose");

const nodemailer = require("nodemailer");

// Helper to send email
const sendEmail = (email, subject, htmlMessage) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    html: htmlMessage,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error(err);
    else console.log("Email sent: " + info.response);
  });
};

exports.createOrder = async (req, res) => {
  try {
    const {
      orderId = `ORD-${Date.now()}`,
      products,
      billing_address,
      shipping_address,
      payment_method,
      subtotal,
      shipping_cost = 0,
      total_cost,
      additional_notes = "No additional notes provided",
    } = req.body;

    const userId = req.user.id;

    // Debugging logs to verify addresses
    console.log("Billing Address in Backend:", billing_address);
    console.log("Shipping Address in Backend:", shipping_address);

    // Validate addresses
    if (
      !billing_address ||
      !billing_address.street ||
      !billing_address.city ||
      !billing_address.state ||
      !billing_address.postalCode ||
      !billing_address.country
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete billing address is required.",
      });
    }

    if (
      !shipping_address ||
      !shipping_address.street ||
      !shipping_address.city ||
      !shipping_address.state ||
      !shipping_address.postalCode ||
      !shipping_address.country
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required.",
      });
    }

    // Fetch user details from the database
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const userEmail = user.email;
    const userName = user.name || "Valued Customer";

    // Validate products
    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Products are required." });
    }

    // Map products and update stock
    const formattedProducts = [];
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product_name} not found.`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.product_name}.`,
        });
      }

      // Update stock
      product.stock -= item.quantity;
      await product.save();

      formattedProducts.push({
        product: product._id,
        product_name: product.product_name,
        quantity: item.quantity,
        price_per_unit: item.price_per_unit || product.selling_price,
        total_price: item.total_price || product.selling_price * item.quantity,
        sku: product.SKU || "N/A", // Ensure SKU is fetched from the database
      });
    }

    // Create the order
    const newOrder = new Order({
      orderId,
      user: userId,
      products: formattedProducts,
      billing_address,
      shipping_address,
      payment_method,
      subtotal,
      shipping_cost,
      total_cost,
      additional_notes,
    });

    const savedOrder = await newOrder.save();

    // Prepare product details for email
    const productDetails = formattedProducts
      .map(
        (item) =>
          `<tr>
            <td>${item.product_name}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price_per_unit.toFixed(2)}</td>
            <td>₹${item.total_price.toFixed(2)}</td>
            <td>${item.sku}</td>
          </tr>`
      )
      .join("");

    // Customer email
    const customerEmailContent = `
      <h1>Order Confirmation - Bon Millette</h1>
      <p>Dear ${userName},</p>
      <p>Thank you for shopping with Bon Millette. Your order has been confirmed. Below are your order details:</p>
      <h2>Order ID: ${orderId}</h2>
      <h3>Billing Address:</h3>
      <p>${billing_address.street}, ${billing_address.city}, ${
      billing_address.state
    }, ${billing_address.postalCode}, ${billing_address.country}</p>
      <h3>Shipping Address:</h3>
      <p>${shipping_address.street}, ${shipping_address.city}, ${
      shipping_address.state
    }, ${shipping_address.postalCode}, ${shipping_address.country}</p>
      <h3>Order Details:</h3>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; text-align: left;">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price per Unit</th>
            <th>Total Price</th>
            <th>SKU</th>
          </tr>
        </thead>
        <tbody>${productDetails}</tbody>
      </table>
      <h3>Order Summary:</h3>
      <p>Subtotal: ₹${subtotal.toFixed(2)}</p>
      <p>Shipping Cost: ₹${shipping_cost.toFixed(2)}</p>
      <p><strong>Total Cost: ₹${total_cost.toFixed(2)}</strong></p>
      <p>Thank you for choosing Bon Millette!</p>
    `;

    sendEmail(
      userEmail,
      "Your Order Confirmation - Bon Millette",
      customerEmailContent
    );

    // Super admin email
    const superAdminEmail = "igurumaheshwar@gmail.com";
    const superAdminContent = `
      <h1>New Order Notification</h1>
      <p>Dear Super Admin,</p>
      <p>A new order has been placed on Bon Millette. Here are the details:</p>
      <h3>Order ID: ${orderId}</h3>
      <h3>Order Details:</h3>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; text-align: left;">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price per Unit</th>
            <th>Total Price</th>
            <th>SKU</th>
          </tr>
        </thead>
        <tbody>${productDetails}</tbody>
      </table>
    `;
    sendEmail(
      superAdminEmail,
      `New Order Received - ${orderId}`,
      superAdminContent
    );

    //     // Outlet email
    const outletEmail = "igururajsingh@gmail.com";
    const outletContent = `
      <h1>Order Notification</h1>
      <p>New order details:</p>
      <h3>Order ID: ${orderId}</h3>
      <h3>Billing Address:</h3>
      <p>${billing_address.street}, ${billing_address.city}, ${
      billing_address.state
    }, ${billing_address.postalCode}, ${billing_address.country}</p>
      <h3>Shipping Address:</h3>
      <p>${shipping_address.street}, ${shipping_address.city}, ${
      shipping_address.state
    }, ${shipping_address.postalCode}, ${shipping_address.country}</p>
      <h3>Order Details:</h3>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; text-align: left;">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price per Unit</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>${productDetails}</tbody>
      </table>
      <p><strong>Total Cost: ₹${total_cost.toFixed(2)}</strong></p>
    `;
    sendEmail(outletEmail, `Order Notification - ${orderId}`, outletContent);

    res.status(201).json({
      success: true,
      message: "Order created successfully. Emails sent to all parties.",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({
      success: false,
      message: "Error creating order. Please check the details.",
      error: error.message,
    });
  }
};

//

//
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email") // Populate user details like name and email
      .populate("products.product", "product_name sku") // Populate product details like name and SKU
      .sort({ createdAt: -1 }); // Sort by latest orders first

    res.status(200).json({
      success: true,
      message: "All orders fetched successfully.",
      orders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching all orders.",
      error: error.message,
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { id } = req.params; // User ID from route params

    const orders = await Order.find({ user: id })
      .populate("products.product", "product_name sku")
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User's orders fetched successfully.",
      orders,
    });
  } catch (error) {
    console.error("Error fetching user's orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user's orders.",
      error: error.message,
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from route params

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required." });
    }

    const orders = await Order.find({ user: id })
      .populate("products.product", "product_name sku") // Populate product details
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User's orders fetched successfully.",
      orders,
    });
  } catch (error) {
    console.error("Error fetching user's orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user's orders.",
      error: error.message,
    });
  }
};

//

exports.getMyOrders = async (req, res) => {
  try {
    // Fetch logged-in user's ID from `req.user`
    const userId = req.user.id;

    // Verify that the user exists in the database
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Fetch orders for the logged-in user
    const orders = await Order.find({ user: userId })
      .populate("products.product", "product_name sku") // Populate product details
      .sort({ createdAt: -1 });

    // Check if the user has no orders
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user.",
      });
    }

    // Respond with the user's orders
    res.status(200).json({
      success: true,
      message: "User's orders fetched successfully.",
      orders,
    });
  } catch (error) {
    console.error("Error fetching user's orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user's orders.",
      error: error.message,
    });
  }
};

// get order details by order id
// exports.getOrderDetailsByOrderId = async (req, res) => {
//   try {
//     const { id } = req.params; // Order ID from route params

//     if (!id) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Order ID is required." });
//     }

//     // Find the order by ID and populate user and product details
//     const order = await Order.findById(id)
//       .populate(
//         "user",
//         "name email phone address shipping_addresses" // Populate user fields including billing and shipping addresses
//       )
//       .populate("products.product", "product_name description price sku"); // Populate product details

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found.",
//       });
//     }

//     // Extract the billing address and the first shipping address if multiple exist
//     const billingAddress = order.user.address || null;
//     const shippingAddress =
//       order.user.shipping_addresses && order.user.shipping_addresses.length > 0
//         ? order.user.shipping_addresses[0]
//         : null;

//     // Construct the response to ensure both addresses are properly included
//     const response = {
//       orderId: order.orderId,
//       user: {
//         name: order.user.name,
//         email: order.user.email,
//         phone: order.user.phone || "Not provided",
//       },
//       billing_address: billingAddress
//         ? {
//             street: billingAddress.street || "Not provided",
//             city: billingAddress.city || "Not provided",
//             state: billingAddress.state || "Not provided",
//             postalCode: billingAddress.postalCode || "Not provided",
//             country: billingAddress.country || "Not provided",
//           }
//         : "Not provided",
//       shipping_address: shippingAddress
//         ? {
//             street: shippingAddress.street || "Not provided",
//             city: shippingAddress.city || "Not provided",
//             state: shippingAddress.state || "Not provided",
//             postalCode: shippingAddress.postalCode || "Not provided",
//             country: shippingAddress.country || "Not provided",
//           }
//         : "Not provided",
//       products: order.products.map((product) => ({
//         name: product.product?.product_name,
//         description: product.product?.description,
//         price: product.product?.price,
//         sku: product.product?.sku,
//         quantity: product.quantity,
//         total_price: product.total_price,
//       })),
//       total_cost: order.total_cost,
//       createdAt: order.createdAt,
//       status: order.status || "Pending",
//     };

//     res.status(200).json({
//       success: true,
//       message: "Order details fetched successfully.",
//       order: response,
//     });
//   } catch (error) {
//     console.error("Error fetching order details:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching order details.",
//       error: error.message,
//     });
//   }
// };

exports.getOrderDetailsByOrderId = async (req, res) => {
  try {
    const { id } = req.params; // Order ID or _id from route params

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID or _id is required." });
    }

    // Determine if the provided ID is a valid ObjectId
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    // Query using either _id or orderId
    const query = isObjectId ? { _id: id } : { orderId: id };

    const order = await Order.findOne(query)
      .populate("user", "name email phone address shipping_addresses")
      .populate("products.product", "product_name description price sku");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const billingAddress = order.user.address || null;
    const shippingAddress =
      order.user.shipping_addresses?.length > 0
        ? order.user.shipping_addresses[0]
        : null;

    const response = {
      orderId: order.orderId,
      user: {
        name: order.user.name,
        email: order.user.email,
        phone: order.user.phone || "Not provided",
      },
      billing_address: billingAddress
        ? {
            street: billingAddress.street || "Not provided",
            city: billingAddress.city || "Not provided",
            state: billingAddress.state || "Not provided",
            postalCode: billingAddress.postalCode || "Not provided",
            country: billingAddress.country || "Not provided",
          }
        : "Not provided",
      shipping_address: shippingAddress
        ? {
            street: shippingAddress.street || "Not provided",
            city: shippingAddress.city || "Not provided",
            state: shippingAddress.state || "Not provided",
            postalCode: shippingAddress.postalCode || "Not provided",
            country: shippingAddress.country || "Not provided",
          }
        : "Not provided",
      products: order.products.map((product) => ({
        name: product.product?.product_name,
        description: product.product?.description,
        price: product.product?.price,
        sku: product.product?.sku,
        quantity: product.quantity,
        total_price: product.total_price,
      })),
      total_cost: order.total_cost,
      createdAt: order.createdAt,
      status: order.status || "Pending",
    };

    res.status(200).json({
      success: true,
      message: "Order details fetched successfully.",
      order: response,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order details.",
      error: error.message,
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params; // Order ID
    const { products } = req.body;

    const order = await Order.findById(id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Extract previous order details
    const previousOrderDetails = order.products.map((p) => ({
      product_name: p.product_name,
      quantity: p.quantity,
      price_per_unit: p.price_per_unit,
      total_price: p.total_price,
    }));

    // Update product details
    const updatedProducts = products.map((product, index) => ({
      product: product.product || order.products[index]?.product._id,
      sku: product.sku,
      product_name: product.product_name,
      quantity: product.quantity || 1,
      price_per_unit:
        product.price_per_unit || order.products[index]?.price_per_unit,
      total_price:
        (product.quantity || 1) *
        (product.price_per_unit || order.products[index]?.price_per_unit),
    }));

    const subtotal = updatedProducts.reduce((sum, p) => sum + p.total_price, 0);
    const totalCost = subtotal + (order.shipping_cost || 0);

    // Update the order object
    order.products = updatedProducts;
    order.subtotal = subtotal;
    order.total_cost = totalCost;
    order.updatedAt = Date.now();

    const updatedOrder = await order.save();

    // Prepare email details
    const orderId = order._id;
    const previousDetailsHTML = previousOrderDetails
      .map(
        (p) =>
          `<li>${p.product_name}: ${p.quantity} x ₹${p.price_per_unit.toFixed(
            2
          )} = ₹${p.total_price.toFixed(2)}</li>`
      )
      .join("");
    const updatedDetailsHTML = updatedProducts
      .map(
        (p) =>
          `<li>${p.product_name}: ${p.quantity} x ₹${p.price_per_unit.toFixed(
            2
          )} = ₹${p.total_price.toFixed(2)}</li>`
      )
      .join("");

    // Customer email
    const emailCustomerMessage = `
      <h1>Order Update - Bon Millette</h1>
      <p>Dear ${order.user.name || "Customer"},</p>
      <p>Your order has been updated. Here are the details:</p>
      <h3>Order ID: ${orderId}</h3>
      <h4>Previous Details:</h4>
      <ul>${previousDetailsHTML}</ul>
      <h4>Updated Details:</h4>
      <ul>${updatedDetailsHTML}</ul>
      <p><strong>Total Cost: ₹${totalCost.toFixed(2)}</strong></p>
    `;

    sendEmail(order.user.email, "Order Updated", emailCustomerMessage);

    // Outlet email
    const outletEmail = "igururajsingh@gmail.com";
    const outletMessage = `
      <h1>Order Update Notification</h1>
      <p>Dear Outlet,</p>
      <p>An order has been updated. Here are the details:</p>
      <h3>Order ID: ${orderId}</h3>
      <h4>Previous Details:</h4>
      <ul>${previousDetailsHTML}</ul>
      <h4>Updated Details:</h4>
      <ul>${updatedDetailsHTML}</ul>
      <p><strong>Total Cost: ₹${totalCost.toFixed(2)}</strong></p>
    `;

    sendEmail(outletEmail, "Order Updated Notification", outletMessage);

    res.status(200).json({
      success: true,
      message: "Order updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update order.",
    });
  }
};

// order analysis.
exports.getOrderAnalysis = async (req, res) => {
  try {
    const { filter } = req.query; // Expecting "weekly", "monthly", or "yearly" as a query parameter
    let filterCondition = {};

    const now = new Date();
    if (filter === "weekly") {
      filterCondition = {
        createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) },
      };
    } else if (filter === "monthly") {
      filterCondition = {
        createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) },
      };
    } else if (filter === "yearly") {
      filterCondition = {
        createdAt: { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) },
      };
    }

    // Fetch orders based on the filter condition
    const orders = await Order.find(filterCondition)
      .populate("user", "name email") // Include user details
      .populate("products.product", "product_name sku price") // Include product details
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Order analysis data fetched successfully.",
      orders,
    });
  } catch (error) {
    console.error("Error fetching order analysis data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order analysis data.",
      error: error.message,
    });
  }
};

exports.getProductSalesInMonth = async (req, res) => {
  try {
    const { productId, month, year } = req.query;

    // Validate query parameters
    if (!productId || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "Product ID, month, and year are required.",
      });
    }

    // Convert month and year to a date range
    const startDate = new Date(year, month - 1, 1); // Start of the month
    const endDate = new Date(year, month, 0); // End of the month

    // Find orders containing the specified product within the date range
    const orders = await Order.find({
      "products.product": productId,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Calculate total sales of the product
    const totalSales = orders.reduce((sum, order) => {
      const product = order.products.find(
        (p) => p.product.toString() === productId
      );
      return sum + (product ? product.quantity : 0);
    }, 0);

    res.status(200).json({
      success: true,
      message: "Product sales count fetched successfully.",
      productId,
      month,
      year,
      totalSales,
    });
  } catch (error) {
    console.error("Error fetching product sales count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product sales count.",
      error: error.message,
    });
  }
};

// get sales analysis.
exports.getSalesAnalysis = async (req, res) => {
  try {
    const { filter, startDate, endDate } = req.query;
    let filterCondition = {};
    const now = new Date();

    // Define filter conditions
    if (filter === "weekly") {
      filterCondition = {
        createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) },
      };
    } else if (filter === "monthly") {
      filterCondition = {
        createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) },
      };
    } else if (filter === "yearly") {
      filterCondition = {
        createdAt: { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) },
      };
    } else if (filter === "custom" && startDate && endDate) {
      filterCondition = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    // Fetch filtered orders
    const orders = await Order.find(filterCondition)
      .populate("user", "name email address")
      .populate("products.product", "product_name price category")
      .sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No sales data found for the selected period.",
      });
    }

    // Initialize metrics
    let totalSales = 0;
    let categorySales = {};
    let monthlySales = Array(12).fill(0);
    let salesByLocation = [];

    // Iterate through orders to calculate metrics
    orders.forEach((order) => {
      totalSales += order.total_cost;

      // Calculate sales by category
      order.products.forEach((product) => {
        const productDetails = product.product;
        if (productDetails) {
          const category = productDetails.category || "Uncategorized";
          if (!categorySales[category]) categorySales[category] = 0;
          categorySales[category] +=
            (product.quantity || 0) * (productDetails.price || 0);
        }
      });

      // Calculate monthly sales
      const orderMonth = new Date(order.createdAt).getMonth();
      monthlySales[orderMonth] += order.total_cost;

      // Collect location-based sales data
      if (order.user && order.user.address) {
        salesByLocation.push({
          latitude: order.user.address.latitude || 0,
          longitude: order.user.address.longitude || 0,
          sales: order.total_cost,
        });
      }
    });

    // Prepare response data
    const salesAnalysis = {
      totalSales,
      categorySales,
      monthlySales,
      salesByLocation,
      ordersCount: orders.length,
    };

    res.status(200).json({
      success: true,
      message: "Sales analysis data fetched successfully.",
      salesAnalysis,
    });
  } catch (error) {
    console.error("Error fetching sales analysis data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching sales analysis data.",
      error: error.message,
    });
  }
};

// Helper function for date filtering
const getDateFilter = (filter) => {
  const now = new Date();
  if (filter === "weekly") {
    return { createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
  } else if (filter === "monthly") {
    return { createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) } };
  } else if (filter === "yearly") {
    return {
      createdAt: { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) },
    };
  }
  return {};
};

// Get total order count
exports.getTotalOrderCount = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.status(200).json({
      success: true,
      message: "Total order count fetched successfully.",
      totalOrders,
    });
  } catch (error) {
    console.error("Error fetching total order count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching total order count.",
      error: error.message,
    });
  }
};

// Get total pending orders
exports.getPendingOrdersCount = async (req, res) => {
  try {
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    res.status(200).json({
      success: true,
      message: "Pending order count fetched successfully.",
      pendingOrders,
    });
  } catch (error) {
    console.error("Error fetching pending orders count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching pending orders count.",
      error: error.message,
    });
  }
};

// Get total shipped orders
exports.getShippedOrdersCount = async (req, res) => {
  try {
    const shippedOrders = await Order.countDocuments({ status: "Shipped" });
    res.status(200).json({
      success: true,
      message: "Shipped order count fetched successfully.",
      shippedOrders,
    });
  } catch (error) {
    console.error("Error fetching shipped orders count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching shipped orders count.",
      error: error.message,
    });
  }
};

// Get total returned orders
exports.getReturnedOrdersCount = async (req, res) => {
  try {
    const returnedOrders = await Order.countDocuments({ status: "Returned" });
    res.status(200).json({
      success: true,
      message: "Returned order count fetched successfully.",
      returnedOrders,
    });
  } catch (error) {
    console.error("Error fetching returned orders count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching returned orders count.",
      error: error.message,
    });
  }
};

// Get total canceled orders
exports.getCanceledOrdersCount = async (req, res) => {
  try {
    const canceledOrders = await Order.countDocuments({ status: "Canceled" });
    res.status(200).json({
      success: true,
      message: "Canceled order count fetched successfully.",
      canceledOrders,
    });
  } catch (error) {
    console.error("Error fetching canceled orders count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching canceled orders count.",
      error: error.message,
    });
  }
};

// Get total unresolved issues
exports.getUnresolvedIssuesCount = async (req, res) => {
  try {
    const unresolvedIssues = await Order.countDocuments({
      issue_status: "Pending",
    });
    res.status(200).json({
      success: true,
      message: "Unresolved issues count fetched successfully.",
      unresolvedIssues,
    });
  } catch (error) {
    console.error("Error fetching unresolved issues count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching unresolved issues count.",
      error: error.message,
    });
  }
};

// Get total resolved issues
exports.getResolvedIssuesCount = async (req, res) => {
  try {
    const resolvedIssues = await Order.countDocuments({
      issue_status: "Resolved",
    });
    res.status(200).json({
      success: true,
      message: "Resolved issues count fetched successfully.",
      resolvedIssues,
    });
  } catch (error) {
    console.error("Error fetching resolved issues count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching resolved issues count.",
      error: error.message,
    });
  }
};

// Get orders awaiting approval
exports.getOrdersAwaitingApproval = async (req, res) => {
  try {
    const awaitingApprovalOrders = await Order.countDocuments({
      status: "Awaiting Approval",
    });
    res.status(200).json({
      success: true,
      message: "Orders awaiting approval fetched successfully.",
      awaitingApprovalOrders,
    });
  } catch (error) {
    console.error("Error fetching orders awaiting approval:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders awaiting approval.",
      error: error.message,
    });
  }
};

// Get high-value orders
exports.getHighValueOrdersCount = async (req, res) => {
  try {
    const highValueOrders = await Order.countDocuments({
      total_cost: { $gte: 5000 },
    });
    res.status(200).json({
      success: true,
      message: "High-value orders count fetched successfully.",
      highValueOrders,
    });
  } catch (error) {
    console.error("Error fetching high-value orders count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching high-value orders count.",
      error: error.message,
    });
  }
};

// Get low-value orders
exports.getLowValueOrdersCount = async (req, res) => {
  try {
    const lowValueOrders = await Order.countDocuments({
      total_cost: { $lt: 5000 },
    });
    res.status(200).json({
      success: true,
      message: "Low-value orders count fetched successfully.",
      lowValueOrders,
    });
  } catch (error) {
    console.error("Error fetching low-value orders count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching low-value orders count.",
      error: error.message,
    });
  }
};

// Get orders by region
exports.getOrdersByRegion = async (req, res) => {
  try {
    const ordersByRegion = await Order.aggregate([
      { $group: { _id: "$shipping_address.region", totalOrders: { $sum: 1 } } },
    ]);
    res.status(200).json({
      success: true,
      message: "Orders by region fetched successfully.",
      ordersByRegion,
    });
  } catch (error) {
    console.error("Error fetching orders by region:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders by region.",
      error: error.message,
    });
  }
};

exports.getProductSalesInYear = async (req, res) => {
  try {
    const { productId, year } = req.query;

    // Validate query parameters
    if (!productId || !year) {
      return res.status(400).json({
        success: false,
        message: "Product ID and year are required.",
      });
    }

    // Calculate start and end date for the year
    const startDate = new Date(year, 0, 1); // January 1st
    const endDate = new Date(year, 11, 31, 23, 59, 59); // December 31st

    // Find orders containing the specified product within the year
    const orders = await Order.find({
      "products.product": productId,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Calculate total sales of the product
    const totalSales = orders.reduce((sum, order) => {
      const product = order.products.find(
        (p) => p.product.toString() === productId
      );
      return sum + (product ? product.quantity : 0);
    }, 0);

    res.status(200).json({
      success: true,
      message: "Product sales count for the year fetched successfully.",
      productId,
      year,
      totalSales,
    });
  } catch (error) {
    console.error("Error fetching product sales count for the year:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product sales count for the year.",
      error: error.message,
    });
  }
};

exports.getProductSalesInYearRange = async (req, res) => {
  try {
    const { productId, startYear, endYear } = req.query;

    // Validate query parameters
    if (!productId || !startYear || !endYear) {
      return res.status(400).json({
        success: false,
        message: "Product ID, start year, and end year are required.",
      });
    }

    // Calculate start and end date for the range of years
    const startDate = new Date(startYear, 0, 1); // Start of start year
    const endDate = new Date(endYear, 11, 31, 23, 59, 59); // End of end year

    // Find orders containing the specified product within the year range
    const orders = await Order.find({
      "products.product": productId,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Calculate total sales of the product
    const totalSales = orders.reduce((sum, order) => {
      const product = order.products.find(
        (p) => p.product.toString() === productId
      );
      return sum + (product ? product.quantity : 0);
    }, 0);

    res.status(200).json({
      success: true,
      message: "Product sales count for the year range fetched successfully.",
      productId,
      startYear,
      endYear,
      totalSales,
    });
  } catch (error) {
    console.error(
      "Error fetching product sales count for the year range:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Error fetching product sales count for the year range.",
      error: error.message,
    });
  }
};

//

exports.getProductSalesInMonthRange = async (req, res) => {
  try {
    const { productId, startMonth, endMonth, year } = req.query;

    // Validate query parameters
    if (!productId || !startMonth || !endMonth || !year) {
      return res.status(400).json({
        success: false,
        message: "Product ID, start month, end month, and year are required.",
      });
    }

    // Calculate start and end date for the range of months in the given year
    const startDate = new Date(year, startMonth - 1, 1); // Start of start month
    const endDate = new Date(year, endMonth, 0, 23, 59, 59); // End of end month

    // Find orders containing the specified product within the month range
    const orders = await Order.find({
      "products.product": productId,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Calculate total sales of the product
    const totalSales = orders.reduce((sum, order) => {
      const product = order.products.find(
        (p) => p.product.toString() === productId
      );
      return sum + (product ? product.quantity : 0);
    }, 0);

    res.status(200).json({
      success: true,
      message: "Product sales count for the month range fetched successfully.",
      productId,
      startMonth,
      endMonth,
      year,
      totalSales,
    });
  } catch (error) {
    console.error(
      "Error fetching product sales count for the month range:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Error fetching product sales count for the month range.",
      error: error.message,
    });
  }
};

// generating delivery otp
exports.generateDeliveryOtp = async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: "Order not found." });

    const otp = order.generateOtp();
    await order.save();

    // TODO: Add email service logic here to send OTP to the customer
    res
      .status(200)
      .json({ message: "OTP generated and sent to customer.", otp });
  } catch (error) {
    console.error("Error generating OTP:", error);
    res.status(500).json({ message: "Failed to generate OTP." });
  }
};

// verify the delivery otp.

exports.verifyDeliveryOtp = async (req, res) => {
  const { orderId, otp } = req.body;
  try {
    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: "Order not found." });

    await order.verifyAndUpdateDelivery(otp);
    await order.save();

    // TODO: Add email service logic here to send delivery confirmation email
    res.status(200).json({ message: "Order marked as delivered." });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(400).json({ message: error.message });
  }
};

//

exports.getDispatchStatusOptions = async (req, res) => {
  try {
    const dispatchStatusOptions = [
      "Pending",
      "Shipped",
      "In Transit",
      "Delivered",
    ];
    res.status(200).json(dispatchStatusOptions);
  } catch (error) {
    console.error("Error fetching dispatch status options:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching dispatch status options." });
  }
};

// update dispatch status
exports.updateDispatchStatus = async (req, res) => {
  try {
    const { id } = req.params; // Order ID
    const { dispatchStatus } = req.body; // New Dispatch Status

    if (!dispatchStatus) {
      return res.status(400).json({
        success: false,
        message: "Dispatch status is required.",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.dispatchStatus = dispatchStatus;
    order.updatedAt = Date.now(); // Update the last modified date
    await order.save();

    res.status(200).json({
      success: true,
      message: "Dispatch status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Error updating dispatch status:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update dispatch status.",
    });
  }
};

// update delivery status.
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params; // Order ID
    const { delivery_status } = req.body; // Use delivery_status

    if (!delivery_status) {
      return res.status(400).json({
        success: false,
        message: "Delivery status is required.",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.delivery_status = delivery_status; // Update the order
    order.updatedAt = Date.now(); // Update the last modified date
    await order.save();

    res.status(200).json({
      success: true,
      message: "Delivery status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Error updating delivery status:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update delivery status.",
    });
  }
};

// delivery status count.

// Controller to fetch counts of each delivery status
exports.getDeliveryStatusCounts = async (req, res) => {
  try {
    const statuses = [
      "Assigned",
      "Picked Up",
      "Out for Delivery",
      "Pending",
      "Shipped",
      "Delivered",
      "Not Delivered",
      "Returned",
      "Cancelled",
    ];

    const statusCounts = {};
    for (const status of statuses) {
      const count = await Order.countDocuments({ delivery_status: status });
      statusCounts[status] = count;
    }

    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      success: true,
      message: "Counts fetched successfully.",
      totalOrders,
      statusCounts,
    });
  } catch (error) {
    console.error("Error fetching delivery status counts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching delivery status counts.",
      error: error.message,
    });
  }
};

// Get total assigned orders count
exports.getAssignedOrdersCount = async (req, res) => {
  try {
    const assignedOrders = await Order.countDocuments({ status: "Assigned" });
    res.status(200).json({
      success: true,
      message: "Assigned orders count fetched successfully.",
      assignedOrders,
    });
  } catch (error) {
    console.error("Error fetching assigned orders count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching assigned orders count.",
      error: error.message,
    });
  }
};

// Get total picked up orders count
exports.getPickedUpOrdersCount = async (req, res) => {
  try {
    const pickedUpOrders = await Order.countDocuments({ status: "Picked Up" });
    res.status(200).json({
      success: true,
      message: "Picked up orders count fetched successfully.",
      pickedUpOrders,
    });
  } catch (error) {
    console.error("Error fetching picked up orders count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching picked up orders count.",
      error: error.message,
    });
  }
};

// Get total out for delivery orders count
exports.getOutForDeliveryOrdersCount = async (req, res) => {
  try {
    const outForDeliveryOrders = await Order.countDocuments({
      status: "Out for Delivery",
    });
    res.status(200).json({
      success: true,
      message: "Out for delivery orders count fetched successfully.",
      outForDeliveryOrders,
    });
  } catch (error) {
    console.error("Error fetching out for delivery orders count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching out for delivery orders count.",
      error: error.message,
    });
  }
};

// fetching order by custome id.
exports.getOrderDetailsByOrderIdCustom = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId }) // Find order by `orderId`
      .populate("user", "name email phone billing_address shipping_address") // Populate user details if referenced
      .populate("products.product", "name selling_price"); // Populate product details if referenced

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details by custom orderId:", error);
    res.status(500).json({ message: "Failed to fetch order details." });
  }
};

// Utility function to synchronize delivery status
exports.synchronizeDeliveryStatus = async (orderId, newStatus) => {
  try {
    // Update DeliveryTask
    await DeliveryTask.updateOne(
      { orderId },
      { $set: { deliveryStatus: newStatus } }
    );

    // Update Order
    await Order.updateOne(
      { orderId },
      { $set: { delivery_status: newStatus } }
    );
  } catch (error) {
    console.error("Error synchronizing delivery status:", error.message);
    throw new Error("Synchronization failed.");
  }
};

exports.synchronizeDeliveryStatus = async (
  orderId,
  newStatus,
  comments = ""
) => {
  try {
    // Update DeliveryTask
    const deliveryTaskUpdate = await DeliveryTask.updateOne(
      { orderId },
      {
        $set: { deliveryStatus: newStatus },
        $push: {
          history: { status: newStatus, timestamp: new Date(), comments },
        },
      }
    );

    // Update Order
    const orderUpdate = await Order.updateOne(
      { orderId },
      {
        $set: { delivery_status: newStatus },
        $push: {
          history: { status: newStatus, timestamp: new Date(), comments },
        },
      }
    );

    if (
      deliveryTaskUpdate.modifiedCount === 0 &&
      orderUpdate.modifiedCount === 0
    ) {
      throw new Error("No records were updated for synchronization.");
    }
  } catch (error) {
    console.error("Error synchronizing delivery status:", error.message);
    throw new Error("Synchronization failed.");
  }
};

exports.updateDeliveryTaskStatus = async (req, res) => {
  try {
    const { id } = req.params; // DeliveryTask ID
    const { deliveryStatus, comments } = req.body; // New status and optional comments

    if (!deliveryStatus) {
      return res.status(400).json({
        success: false,
        message: "Delivery status is required.",
      });
    }

    const deliveryTask = await DeliveryTask.findById(id);
    if (!deliveryTask) {
      return res
        .status(404)
        .json({ success: false, message: "Delivery task not found." });
    }

    // Synchronize delivery status
    await exports.synchronizeDeliveryStatus(
      deliveryTask.orderId,
      deliveryStatus,
      comments
    );

    res.status(200).json({
      success: true,
      message: "Delivery task status updated and synchronized successfully.",
    });
  } catch (error) {
    console.error("Error updating delivery task status:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update delivery task status.",
      error: error.message,
    });
  }
};
