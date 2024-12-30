const express = require("express");
const router = express.Router();
const {
  addPopularBrand,
  getAllPopularBrands,
  getPopularBrandById,
  updatePopularBrand,
  deletePopularBrand,
  popularBrandUpload,
  getProductsByPopularBrand,
} = require("../controllers/PopularBrandsController");

// Route to add a new popular brand
router.post(
  "/add-popular-brand",
  popularBrandUpload.single("brand_image"), // Middleware for image upload
  addPopularBrand
);

// Route to fetch all popular brands
router.get("/all-popular-brands", getAllPopularBrands);

// Route to fetch a single popular brand by ID
router.get("/single-popular-brand/:id", getPopularBrandById);

// Route to update a popular brand
router.put(
  "/update-popular-brand/:id",
  popularBrandUpload.single("brand_image"), // Middleware for image upload
  updatePopularBrand
);

// Route to delete a popular brand
router.delete("/delete-popular-brands/:id", deletePopularBrand);

// Route to fetch products associated with a popular brand
router.get(
  "/single-popular-brand/:brandId/products",
  getProductsByPopularBrand
);

module.exports = router;
