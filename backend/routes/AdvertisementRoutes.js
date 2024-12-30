const express = require("express");
const {
  addAdvertisement,
  getAllAdvertisements,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
  advertisementUpload,
  getProductsByAdvertisement,
} = require("../controllers/AdvertismentController");

const router = express.Router();

// Add a new advertisement
router.post(
  "/add-advertisement",
  advertisementUpload.single("advertisementImage"),
  addAdvertisement
);

// Get all advertisements
router.get("/all-advertisements", getAllAdvertisements);

// Get a single advertisement by ID
router.get("/single-advertisement/:id", getAdvertisementById);

// Update an advertisement
router.put(
  "/update-advertisement/:id",
  advertisementUpload.single("advertisementImage"),
  updateAdvertisement
);

// Delete an advertisement
router.delete("/delete-advertisement/:id", deleteAdvertisement);

// Fetch all products in the selected advertisement
router.get(
  "/products/advertisement/:advertisementId",
  getProductsByAdvertisement
);

module.exports = router;
