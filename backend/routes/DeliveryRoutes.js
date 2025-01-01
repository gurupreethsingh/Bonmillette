const express = require("express");
const router = express.Router();
const {
  assignOrderToDeliveryAgent,
  countTotalDeliveries,
  countAssignedDeliveries,
  getAllDeliveries,
  deleteDelivery,
  getSingleDelivery,
  getDeliveriesByAgent,
  getSingleAssignedDelivery,
  updateDeliveryAndOrderStatus,
  updateDeliveryTaskStatus,
  sendDeliveryOtp,
  sendCancellationOtp,
  verifyOtp,
} = require("../controllers/DeliveryController");
const authenticateToken = require("../authMiddleware");

// Assign Order to Delivery Agent
router.post(
  "/assign-order-for-delivery",
  authenticateToken,
  assignOrderToDeliveryAgent
);

router.get(
  "/count-total-deliveries-count",
  authenticateToken,
  countTotalDeliveries
);

// route to fetch all the deliveries.
router.get("/get-all-deliveries", authenticateToken, getAllDeliveries);

router.get(
  "/single-delivery/:deliveryId",
  authenticateToken,
  getSingleDelivery
);

router.delete(
  "/delete-delivery/:deliveryId",
  authenticateToken,
  deleteDelivery
);

// total number of deliveries assigned to particular user
router.get(
  "/count-assigned-deliveries",
  authenticateToken,
  countAssignedDeliveries
);

// Fetch deliveries assigned to a specific delivery agent
router.get("/deliveries-by-agent/:id", authenticateToken, getDeliveriesByAgent);

// Fetch a single delivery assigned to a delivery agent
router.get(
  "/delivery-agent/:deliveryAgentId/delivery/:deliveryId",
  authenticateToken,
  getSingleAssignedDelivery
);

//updating the delivery status by delivery agent.
router.patch(
  "/delivery-agent/:deliveryAgentId/update-delivery/:deliveryId",
  authenticateToken,
  updateDeliveryAndOrderStatus
);

// Route to send delivery OTP
router.post("/delivery/:deliveryId/send-delivery-otp", sendDeliveryOtp);

// Route to send cancellation OTP
router.post("/delivery/:deliveryId/send-cancellation-otp", sendCancellationOtp);

// Route to verify OTP
router.post("/delivery/:deliveryId/verify-otp", verifyOtp);

module.exports = router;
