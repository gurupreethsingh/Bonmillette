const express = require("express");
const authenticateToken = require("../authMiddleware");
const {
  createOrder,
  getUserOrders,
  updateOrder,
  getAllOrders,
  getTotalOrderCount,
  getMyOrders,
  getOrderDetailsByOrderId,
  getOrderAnalysis,
  getSalesAnalysis,
  getPendingOrdersCount,
  getShippedOrdersCount,
  getReturnedOrdersCount,
  getCanceledOrdersCount,
  getUnresolvedIssuesCount,
  getResolvedIssuesCount,
  getOrdersAwaitingApproval,
  getHighValueOrdersCount,
  getLowValueOrdersCount,
  getOrdersByRegion,
  getProductSalesInYear,
  getProductSalesInYearRange,
  getProductSalesInMonthRange,
  generateDeliveryOtp,
  verifyDeliveryOtp,
  getDispatchStatusOptions,
  updateDispatchStatus,
  updateDeliveryStatus,
  getDeliveryStatusCounts,
  getAssignedOrdersCount,
  getPickedUpOrdersCount,
  getOutForDeliveryOrdersCount,
  getOrderDetailsByOrderIdCustom,
  synchronizeDeliveryStatus,
} = require("../controllers/OrderController");

const router = express.Router();

// Middleware to check if the user is an admin or super admin
const requireAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role === "admin" || role === "superadmin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

// Routes
router.post("/create-order", authenticateToken, createOrder);
router.get("/all-user-orders/:id", authenticateToken, getUserOrders);
router.get("/get-all-orders", authenticateToken, getAllOrders);
router.put("/update-order/:id", authenticateToken, updateOrder);

// Route to get total order count
router.get("/get-total-order-count", authenticateToken, getTotalOrderCount);

// Get the logged-in user's orders by user ID
router.get("/get-my-orders", authenticateToken, getMyOrders);

// Get order details by order ID
router.get(
  "/get-order-details-by-orderid/:id",
  authenticateToken,
  getOrderDetailsByOrderId
);

// Order analysis
router.get("/get-order-analysis", authenticateToken, getOrderAnalysis);

// Sales analysis
router.get("/get-sales-analysis", authenticateToken, getSalesAnalysis);

// Count routes
router.get(
  "/get-pending-orders-count",
  authenticateToken,
  getPendingOrdersCount
);
router.get(
  "/get-shipped-orders-count",
  authenticateToken,
  getShippedOrdersCount
);
router.get(
  "/get-returned-orders-count",
  authenticateToken,
  getReturnedOrdersCount
);
router.get(
  "/get-canceled-orders-count",
  authenticateToken,
  getCanceledOrdersCount
);
router.get(
  "/get-unresolved-issues-count",
  authenticateToken,
  getUnresolvedIssuesCount
);
router.get(
  "/get-resolved-issues-count",
  authenticateToken,
  getResolvedIssuesCount
);
router.get(
  "/get-orders-awaiting-approval",
  authenticateToken,
  getOrdersAwaitingApproval
);
router.get(
  "/get-high-value-orders-count",
  authenticateToken,
  getHighValueOrdersCount
);
router.get(
  "/get-low-value-orders-count",
  authenticateToken,
  getLowValueOrdersCount
);

// Regional orders
router.get("/get-orders-by-region", authenticateToken, getOrdersByRegion);

// Product sales routes
router.get(
  "/get-product-sales-in-year",
  authenticateToken,
  getProductSalesInYear
);
router.get(
  "/get-product-sales-in-year-range",
  authenticateToken,
  getProductSalesInYearRange
);
router.get(
  "/get-product-sales-in-month-range",
  authenticateToken,
  getProductSalesInMonthRange
);

// order verify otp
router.post("/generate-otp", generateDeliveryOtp);

router.post("/verify-otp", verifyDeliveryOtp);

router.get("/get-dispatch-status-options", getDispatchStatusOptions);

// Update Dispatch Status
router.put("/orders/:id/update-dispatch-status", updateDispatchStatus);

// Update Delivery Status
router.put("/orders/:id/update-delivery-status", updateDeliveryStatus);

// Route to fetch delivery status counts
router.get("/get-delivery-status-counts", getDeliveryStatusCounts);

router.get(
  "/get-assigned-orders-count",
  authenticateToken,
  getAssignedOrdersCount
);
router.get(
  "/get-picked-up-orders-count",
  authenticateToken,
  getPickedUpOrdersCount
);
router.get(
  "/get-out-for-delivery-orders-count",
  authenticateToken,
  getOutForDeliveryOrdersCount
);

router.get(
  "/get-order-details-custom/:orderId",
  authenticateToken,
  getOrderDetailsByOrderIdCustom
);

// Update delivery status
router.put("/orders/update-delivery-status", updateDeliveryStatus);

module.exports = router;
