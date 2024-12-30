const express = require("express");
const router = express.Router();
const {
  assignOrderToDeliveryAgent,
} = require("../controllers/DeliveryController");
const authenticateToken = require("../authMiddleware");

// Assign Order to Delivery Agent
router.post(
  "/assign-order-for-delivery",
  authenticateToken,
  assignOrderToDeliveryAgent
);

module.exports = router;
