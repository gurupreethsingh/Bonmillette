const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");
const Outlet = require("../models/OutletModel");

exports.addItemToCart = async (req, res) => {
  const userId = req.user.id; // User ID from authenticated user
  const { productId, priceAtPurchase, quantity = 1 } = req.body; // Default quantity to 1

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    // Find the cart for the user
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      // Create a new cart if none exists
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the product is already in the cart
    const existingItemIndex = cart.items.findIndex((item) =>
      item.product.equals(productId)
    );

    if (existingItemIndex > -1) {
      // Update the quantity for an existing product
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add a new product to the cart
      cart.items.push({ product: productId, quantity, priceAtPurchase });
    }

    // Recalculate the total price of the cart
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * item.priceAtPurchase,
      0
    );

    // Save the updated cart
    await cart.save();

    return res.status(200).json({
      success: true,
      message: `${quantity} item(s) added to cart successfully!`,
      cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get the cart of the logged-in user
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from JWT

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      populate: {
        path: "outlet.outlet", // Include outlet details
      },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

// Remove an item from the cart
exports.removeItemFromCart = async (req, res) => {
  const userId = req.user.id; // Fixed to use `req.user.id`
  const { productId } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove the item from the cart
    cart.items = cart.items.filter((item) => !item.product.equals(productId));

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Item removed successfully", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the quantity of an item in the cart
exports.updateItemQuantity = async (req, res) => {
  const userId = req.user.id; // Fixed to use `req.user.id`
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) =>
      item.product.equals(productId)
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update the item quantity
    cart.items[itemIndex].quantity = quantity;

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Quantity updated", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear the cart
exports.clearCart = async (req, res) => {
  const userId = req.user.id; // Fixed to use `req.user.id`

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Clear the cart items
    cart.items = [];

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get the total count of items in the cart
exports.getCartItemCount = async (req, res) => {
  const userId = req.user.id; // Use the user ID from the decoded token

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(200).json({ count: 0 }); // Return 0 if the cart does not exist
    }

    // Calculate the total count of items in the cart
    const totalCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    res.status(200).json({ count: totalCount });
  } catch (error) {
    console.error("Error fetching cart item count:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Function to fetch cart details for the checkout page
exports.getCheckoutDetails = async (req, res) => {
  try {
    const userId = req.user.id; // Logged-in user's ID

    // Fetch the cart for the user and populate product details
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res
        .status(200)
        .json({ message: "Your cart is empty.", items: [], totalPrice: 0 });
    }

    // Extract product details, quantity, and calculate subtotals
    const items = cart.items.map((item) => ({
      productName: item.product.name,
      quantity: item.quantity,
      priceAtPurchase: item.product.price,
      subtotal: item.quantity * item.product.price,
    }));

    // Calculate total price of all items in the cart
    const totalPrice = items.reduce((acc, item) => acc + item.subtotal, 0);

    // Return the cart details and total price
    res.status(200).json({ items, totalPrice });
  } catch (error) {
    console.error("Error fetching checkout details:", error.message);
    res.status(500).json({ message: "Failed to fetch checkout details." });
  }
};

exports.deleteEverythingFromCart = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` is populated by `authenticateUser`
    await Cart.deleteMany({ user: userId }); // Clear all items associated with the user
    return res.json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to clear cart" });
  }
};
