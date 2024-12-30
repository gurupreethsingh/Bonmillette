const express = require("express");
const router = express.Router();
const {
  getAllVendors,
  addRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
  getAllRawMaterials,
  getRawMaterialById,
  getRawMaterialCount,
  getExpiringRawMaterials,
  sendReorderEmail,
  updateOrderedHistory,
  updateReorderHistory,
  updateRefillingHistory,
  updateStatusHistory,
  countAllRawMaterials,
} = require("../controllers/RawMaterialController");

// Routes for Raw Materials
router.get("/vendors", getAllVendors); // Fetch all vendors for dropdown
router.post("/add-raw-material", addRawMaterial); // Add a new raw material
router.put("/update-raw-material/:id", updateRawMaterial); // Update a raw material
router.delete("/delete-raw-material/:id", deleteRawMaterial); // Delete a raw material
router.get("/all-raw-materials", getAllRawMaterials); // View all raw materials
router.get("/raw-material/:id", getRawMaterialById); // View a single raw material
router.get("/raw-materials/count", getRawMaterialCount); // Count all raw materials
router.get("/raw-materials/expiring", getExpiringRawMaterials); // Get expiring raw materials
router.post("/send-reorder-email", sendReorderEmail); // send remail for reorder
// Routes to update raw material lifecycle events
router.put("/raw-material/:id/ordered-history", updateOrderedHistory);
router.put("/raw-material/:id/reorder-history", updateReorderHistory);
router.put("/raw-material/:id/refilling-history", updateRefillingHistory);
router.put("/raw-material/:id/status-history", updateStatusHistory);

router.get("/raw-materials/count-all", countAllRawMaterials);

module.exports = router;
