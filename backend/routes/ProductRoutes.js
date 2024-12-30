const express = require("express");
const router = express.Router();
const {
  productUpload,
  addProduct,
  updateProductVolumes,
  getAllAddedProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock,
  updateProductAdditionalImages,
  deleteProductAdditionalImage,
  countAllProducts,
  getLowStockProducts,
  updateProductImage,
  getProductsByCategory,
  getProductsByOutlet,
  decreaseStock,
  getRemainingStock,
  addProductToOutlet, // Added new function
  getAllProductNames,
  getProductPurchaseHistory,
  getRandomProducts,
} = require("../controllers/ProductController");

// Route to add a new product
router.post(
  "/add-product",
  productUpload.fields([
    { name: "product_image", maxCount: 1 },
    { name: "all_product_images", maxCount: 5 },
  ]),
  addProduct
);

// Route to link a product to an outlet
router.post("/add-product-to-outlet/:outletId", addProductToOutlet);

// Route to update the main product image
router.put(
  "/update-product-image/:id",
  productUpload.single("product_image"),
  updateProductImage
);

// Route to get all added products
router.get("/all-added-products", getAllAddedProducts);

// Route to get a single product by ID
router.get("/single-product/:id", getProductById);

// Route to update a product by ID
router.put("/update-product/:id", updateProduct);

// Route to delete a product by ID
router.delete("/delete-product/:id", deleteProduct);

// Route to update stock for a product
router.put("/update-stock/:id", updateStock);

// Route to add additional product images
router.put(
  "/product/add-images/:id",
  productUpload.array("all_product_images", 5),
  updateProductAdditionalImages
);

// Route to delete a specific additional product image
router.delete("/product/delete-image/:id/:index", deleteProductAdditionalImage);

// Route to count all products
router.get("/count-products", countAllProducts);

// Route to fetch low stock products
router.get("/low-stock", getLowStockProducts); // Query param: ?threshold=20

// Route to fetch products by category
router.get("/products-by-category/:id", getProductsByCategory);

// Route to fetch products by outlet
router.get("/products-by-outlet/:outletId", getProductsByOutlet);

// Route to decrease stock when an order is confirmed
router.put("/decrease-stock", decreaseStock);

// Route to fetch remaining stock for a product
router.get("/remaining-stock/:id", getRemainingStock);

router.get("/get-product-names", getAllProductNames);

router.get("/get-product-purchase-history", getProductPurchaseHistory);
// route to get some random products.
router.get("/get-random-products/:count", getRandomProducts);

module.exports = router;
