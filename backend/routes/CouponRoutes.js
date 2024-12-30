const express = require("express");
const router = express.Router();
const authenticateUser = require("../authMiddleware");
const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  getTotalCoupons,
  applyCoupon,
  getCouponHistory,
} = require("../controllers/CouponController");

// Route to create a new coupon
router.post("/create-coupon", createCoupon);

// Route to fetch all coupons
router.get("/get-all-coupons", getAllCoupons);

// Route to get a single coupon by ID
router.get("/get-coupon-by-id/:id", getCouponById);

// Route to update coupon details by ID
router.put("/update-coupon/:id", updateCoupon);

// Route to delete a coupon by ID
router.delete("/delete-coupon/:id", deleteCoupon);

// Route to count total number of coupons
router.get("/get-total-coupon-count", getTotalCoupons);

// Route to apply a coupon
router.post("/apply-coupon", authenticateUser, applyCoupon);

// Route to get coupon usage history by coupon ID
router.get("/get-coupon-history/:id", getCouponHistory);

module.exports = router;
