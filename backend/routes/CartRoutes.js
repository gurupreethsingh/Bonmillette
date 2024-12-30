const express = require("express");
const jwt = require("jsonwebtoken");
const {
  addItemToCart,
  getCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
  getCartItemCount,
  getCheckoutDetails,
  deleteEverythingFromCart,
} = require("../controllers/CartController"); // Import controller methods
// const authenticateToken = require("../authMiddleware"); // Import middleware

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.error("No Authorization header provided.");
    return res
      .status(401)
      .json({ message: "No token provided in Authorization header" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.error("Token missing in Authorization header.");
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    console.log("Token received:", token);
    const decoded = jwt.verify(token, "ecoders_jwt_secret");
    console.log("Decoded token:", decoded);
    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};

const router = express.Router();

// Debug logs
console.log({
  addItemToCart,
  getCart,
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
});
console.log("authenticateToken:", authenticateToken);

// Add item to cart
router.post("/cart", authenticateToken, addItemToCart);

// Get cart for the logged-in user
router.get("/cart", authenticateToken, getCart);

// Remove an item from the cart
router.delete("/cart/item", authenticateToken, removeItemFromCart);

// Update item quantity in the cart
router.put("/cart/item", authenticateToken, updateItemQuantity);

// Clear the cart
router.delete("/cart", authenticateToken, clearCart);

// Get the total count of items in the cart
router.get("/cart/count", authenticateToken, getCartItemCount);

router.get("/cart/checkout-details", authenticateToken, getCheckoutDetails);

// remove every ting from the cart all at ones.
router.delete(
  "/delete-everything-from-cart",
  authenticateToken,
  deleteEverythingFromCart
);

module.exports = router;
