const express = require("express");
const {
  addHottestCategory,
  getAllHottestCategories,
  getHottestCategoryById,
  updateHottestCategory,
  deleteHottestCategory,
  hottestCategoryUpload,
  getProductsByHottestCategory,
} = require("../controllers/HottestCategoryController");

const router = express.Router();

// Add a new hottest category
router.post(
  "/add-hottest-category",
  hottestCategoryUpload.single("hottestCategoryImage"),
  addHottestCategory
);

// Get all hottest categories
router.get("/all-hottest-categories", getAllHottestCategories);

// Get a single hottest category by ID
router.get("/single-hottest-category/:id", getHottestCategoryById);

// Update a hottest category
router.put(
  "/update-hottest-category/:id",
  hottestCategoryUpload.single("hottestCategoryImage"),
  updateHottestCategory
);

// Delete a hottest category
router.delete("/delete-hottest-category/:id", deleteHottestCategory);

// Fetch all products in the selected hottest category
router.get(
  "/products/hottest-category/:hottestCategoryId",
  getProductsByHottestCategory
);

module.exports = router;
