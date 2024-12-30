const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const {
  addReview,
  getReviewsByProduct,
} = require("../controllers/ReviewController");

// Middleware to authenticate the logged-in user
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to req.user
    next();
  } catch (err) {
    console.error("Invalid token:", err.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Routes
router.post("/add-review", authenticateToken, addReview);
router.get("/get-all-reviews/:id", getReviewsByProduct);

module.exports = router;
