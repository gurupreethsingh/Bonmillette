const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Advertisement = require("../models/AdvertisementModel");
const Product = require("../models/ProductModel");

// Configure multer storage for advertisements
const advertisementStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/advertisements";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Multer middleware for uploading advertisement images
const advertisementUpload = multer({ storage: advertisementStorage });

// Add a new advertisement
const addAdvertisement = async (req, res) => {
  try {
    const { advertisement_name, advertisement_description, products } =
      req.body;

    // Handle advertisement image
    const advertisement_image = req.file
      ? req.file.path.replace(/\\/g, "/")
      : ""; // Store relative path of the image

    let parsedProducts = [];
    if (products) {
      try {
        // Parse products only if provided
        parsedProducts = JSON.parse(products); // Ensure products is an array of ObjectIds
      } catch (err) {
        console.error("Error parsing products field:", err.message);
        return res.status(400).json({
          message: "Invalid products format. It should be a JSON array.",
        });
      }
    }

    // Create the new advertisement
    const newAdvertisement = new Advertisement({
      advertisement_name,
      advertisement_description,
      advertisement_image,
      products: parsedProducts,
    });

    await newAdvertisement.save();

    res.status(201).json({
      message: "Advertisement added successfully",
      advertisement: newAdvertisement,
    });
  } catch (error) {
    console.error("Error adding advertisement:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all advertisements
const getAllAdvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.find().populate("products");
    res.status(200).json(advertisements);
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    res.status(500).json({ message: "Error fetching advertisements" });
  }
};

// Fetch a single advertisement by ID
const getAdvertisementById = async (req, res) => {
  try {
    const { id } = req.params;
    const advertisement = await Advertisement.findById(id).populate("products");

    if (!advertisement) {
      return res.status(404).json({ message: "Advertisement not found" });
    }

    res.status(200).json(advertisement);
  } catch (error) {
    console.error("Error fetching advertisement:", error);
    res.status(500).json({ message: "Error fetching advertisement" });
  }
};

// Update an advertisement
const updateAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const { advertisement_name, advertisement_description, products } =
      req.body;

    const advertisement = await Advertisement.findById(id);

    if (!advertisement) {
      return res.status(404).json({ message: "Advertisement not found" });
    }

    // If a new image is uploaded, delete the old one
    if (req.file) {
      if (advertisement.advertisement_image) {
        const oldImagePath = path.resolve(
          __dirname,
          "..",
          advertisement.advertisement_image
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      advertisement.advertisement_image = req.file.path.replace(/\\/g, "/");
    }

    advertisement.advertisement_name =
      advertisement_name || advertisement.advertisement_name;
    advertisement.advertisement_description =
      advertisement_description || advertisement.advertisement_description;
    advertisement.products = products
      ? JSON.parse(products)
      : advertisement.products;

    await advertisement.save();

    res.status(200).json({
      message: "Advertisement updated successfully",
      advertisement,
    });
  } catch (error) {
    console.error("Error updating advertisement:", error);
    res.status(500).json({ message: "Error updating advertisement" });
  }
};

// Delete an advertisement
const deleteAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const advertisement = await Advertisement.findByIdAndDelete(id);

    if (!advertisement) {
      return res.status(404).json({ message: "Advertisement not found" });
    }

    // Delete the associated image
    if (advertisement.advertisement_image) {
      const imagePath = path.resolve(
        __dirname,
        "..",
        advertisement.advertisement_image
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({ message: "Advertisement deleted successfully" });
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    res.status(500).json({ message: "Error deleting advertisement" });
  }
};

// Get products associated with an advertisement
const getProductsByAdvertisement = async (req, res) => {
  try {
    const { advertisementId } = req.params;

    if (!advertisementId) {
      return res.status(400).json({ message: "Advertisement ID is required." });
    }

    console.log("Fetching Advertisement with ID:", advertisementId);

    // Fetch and populate products
    const advertisement = await Advertisement.findById(advertisementId);

    if (!advertisement) {
      return res.status(404).json({ message: "Advertisement not found." });
    }

    // Return the populated products
    return res.status(200).json(advertisement.products);
  } catch (error) {
    console.error("Error fetching products by advertisement:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addAdvertisement,
  getAllAdvertisements,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
  advertisementUpload, // Export multer middleware for routes
  getProductsByAdvertisement,
};
