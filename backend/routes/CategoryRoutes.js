const express = require("express");
const router = express.Router();
const {
  addCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  updateCategory,
  getCategoryCount,
  getCategoryProductCounts,
} = require("../controllers/CategoryController");

// Add a new category
router.post("/add-category", addCategory);

// Get all categories
router.get("/all-categories", getAllCategories);

// Get a category by ID
router.get("/single-category/:id", getCategoryById);

// Delete a category by ID
router.delete("/delete-category/:id", deleteCategory);

// Update a category by ID
router.put("/update-category/:id", updateCategory);

// Get the total count of categories
router.get("/category-count", getCategoryCount);

// Get product counts for all categories
router.get("/category-product-counts", getCategoryProductCounts);

module.exports = router;
