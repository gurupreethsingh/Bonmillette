const express = require("express");
const {
  addFeaturedProduct,
  getAllFeaturedProducts,
  getFeaturedProductById,
  updateFeaturedProduct,
  deleteFeaturedProduct,
  featuredproductUpload,
  getProductsByFeaturedProduct,
} = require("../controllers/FeaturedProductController");

const router = express.Router();

// Add a new featured product
router.post(
  "/add-featured-product",
  featuredproductUpload.single("featuredImage"),
  addFeaturedProduct
);

// Get all featured products
router.get("/all-featured-products", getAllFeaturedProducts);

// Get a single featured product by ID
router.get("/single-featured-product/:id", getFeaturedProductById);

// Update a featured product
router.put(
  "/update-featured-product/:id",
  featuredproductUpload.single("featuredImage"),
  updateFeaturedProduct
);

// Delete a featured product
router.delete("/delete-featured-product/:id", deleteFeaturedProduct);

// fetcing all the products in the selected. featured product.
// get all the products in the selected. featured product.
router.get(
  "/products/featured/:featuredProductId",
  getProductsByFeaturedProduct
);

module.exports = router;
