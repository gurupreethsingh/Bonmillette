const mongoose = require("mongoose");

// Define Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true, // Product ID must be present
  },
  quantity: {
    type: Number,
    required: true,
    default: 1, // Default quantity is 1 if not provided
  },
  priceAtPurchase: {
    type: Number,
    required: true, // Capture the price at the time the item was added to the cart
  },
  addedAt: {
    type: Date,
    default: Date.now, // Timestamp when the product was added to the cart
  },
});

// Define the Cart Schema
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // User ID must be present
  },
  items: [cartItemSchema], // Array of cart items
  totalPrice: {
    type: Number,
    default: 0, // Total price of the items in the cart
  },
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp when the cart was created
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Timestamp when the cart was last updated
  },
});

// Pre-save middleware to calculate total price and update 'updatedAt' timestamp
cartSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  this.totalPrice = this.items.reduce(
    (acc, item) => acc + item.priceAtPurchase * item.quantity,
    0
  );
  next();
});

// Method to add an item to the cart
cartSchema.methods.addItemToCart = async function (productId, priceAtPurchase) {
  const product = await mongoose.model("Product").findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const cartItemIndex = this.items.findIndex((item) =>
    item.product.equals(productId)
  );

  if (cartItemIndex > -1) {
    // Product already exists in the cart, increment the quantity
    this.items[cartItemIndex].quantity += 1;
  } else {
    // Product does not exist in the cart, add new item
    this.items.push({ product: productId, quantity: 1, priceAtPurchase });
  }

  return this.save();
};

// Method to remove an item from the cart
cartSchema.methods.removeItemFromCart = async function (productId) {
  this.items = this.items.filter((item) => !item.product.equals(productId));
  return this.save();
};

// Method to clear the cart
cartSchema.methods.clearCart = async function () {
  this.items = [];
  this.totalPrice = 0;
  return this.save();
};

// Export the Cart model
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
