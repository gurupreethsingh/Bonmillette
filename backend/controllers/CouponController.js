// controllers/CouponController.js

const mongoose = require("mongoose");
const { Coupon, CouponHistory } = require("../models/CouponModel");

// Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      discount,
      maxDiscountAmount,
      expirationDate,
      usageLimit,
      applicableProducts,
      minCartValue,
    } = req.body;

    const newCoupon = new Coupon({
      code,
      discount,
      maxDiscountAmount,
      expirationDate,
      usageLimit,
      applicableProducts,
      minCartValue,
    });

    await newCoupon.save();
    res
      .status(201)
      .json({ message: "Coupon created successfully", coupon: newCoupon });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch all coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get coupon by ID
exports.getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json(coupon);
  } catch (error) {
    console.error("Error fetching coupon:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update coupon details
exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res
      .status(200)
      .json({ message: "Coupon updated successfully", coupon: updatedCoupon });
  } catch (error) {
    console.error("Error updating coupon:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Count total number of coupons
exports.getTotalCoupons = async (req, res) => {
  try {
    const count = await Coupon.countDocuments();
    res.status(200).json({ totalCoupons: count });
  } catch (error) {
    console.error("Error counting coupons:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Apply a coupon
exports.applyCoupon = async (req, res) => {
  try {
    const { code, cartValue } = req.body;

    // Ensure user ID is available
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID missing." });
    }

    const coupon = await Coupon.findOne({ code, isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found or inactive" });
    }

    if (new Date() > new Date(coupon.expirationDate)) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit exceeded" });
    }

    if (cartValue < coupon.minCartValue) {
      return res.status(400).json({
        message: `Minimum cart value of ₹${coupon.minCartValue} required to use this coupon`,
      });
    }

    const discount = Math.min(
      (coupon.discount / 100) * cartValue,
      coupon.maxDiscountAmount || Infinity
    );

    coupon.usedCount += 1;
    await coupon.save();

    // Log coupon usage in history
    const historyEntry = new CouponHistory({
      coupon: coupon._id,
      userId: req.user.id, // Now req.user.id is guaranteed to exist
      discountApplied: discount,
    });
    await historyEntry.save();

    res.status(200).json({ message: "Coupon applied successfully", discount });
  } catch (error) {
    console.error("Error applying coupon:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get coupon usage history
// Get coupon usage history
exports.getCouponHistory = async (req, res) => {
  try {
    const { id } = req.params; // Coupon ID
    const history = await CouponHistory.find({ coupon: id }).populate(
      "userId",
      "name email"
    ); // Populate user details only

    if (!history || history.length === 0) {
      return res
        .status(404)
        .json({ message: "No history found for this coupon" });
    }

    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching coupon history:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
