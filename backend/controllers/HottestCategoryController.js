const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const HottestCategory = require("../models/HottestCategoryModel");
const Product = require("../models/ProductModel");

// Configure multer storage for hottest categories
const hottestCategoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/hottest_categories";
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

// Multer middleware for uploading hottest category images
const hottestCategoryUpload = multer({ storage: hottestCategoryStorage });

// Add a new hottest category
const addHottestCategory = async (req, res) => {
  try {
    const { hottest_category_name, hottest_category_description, products } =
      req.body;

    // Handle hottest category image
    const hottest_category_image = req.file
      ? req.file.path.replace(/\\/g, "/")
      : ""; // Store relative path of the image

    let parsedProducts = [];
    if (products) {
      try {
        parsedProducts = JSON.parse(products); // Ensure products is an array of ObjectIds
      } catch (err) {
        console.error("Error parsing products field:", err.message);
        return res.status(400).json({
          message: "Invalid products format. It should be a JSON array.",
        });
      }
    }

    // Create the new hottest category
    const newHottestCategory = new HottestCategory({
      hottest_category_name,
      hottest_category_description,
      hottest_category_image,
      products: parsedProducts,
    });

    await newHottestCategory.save();

    res.status(201).json({
      message: "Hottest category added successfully",
      hottestCategory: newHottestCategory,
    });
  } catch (error) {
    console.error("Error adding hottest category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all hottest categories
const getAllHottestCategories = async (req, res) => {
  try {
    const hottestCategories = await HottestCategory.find().populate("products");
    res.status(200).json(hottestCategories);
  } catch (error) {
    console.error("Error fetching hottest categories:", error);
    res.status(500).json({ message: "Error fetching hottest categories" });
  }
};

// Fetch a single hottest category by ID
const getHottestCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const hottestCategory = await HottestCategory.findById(id).populate(
      "products"
    );

    if (!hottestCategory) {
      return res.status(404).json({ message: "Hottest category not found" });
    }

    res.status(200).json(hottestCategory);
  } catch (error) {
    console.error("Error fetching hottest category:", error);
    res.status(500).json({ message: "Error fetching hottest category" });
  }
};

// Update a hottest category
const updateHottestCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { hottest_category_name, hottest_category_description, products } =
      req.body;

    const hottestCategory = await HottestCategory.findById(id);

    if (!hottestCategory) {
      return res.status(404).json({ message: "Hottest category not found" });
    }

    // If a new image is uploaded, delete the old one
    if (req.file) {
      if (hottestCategory.hottest_category_image) {
        const oldImagePath = path.resolve(
          __dirname,
          "..",
          hottestCategory.hottest_category_image
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      hottestCategory.hottest_category_image = req.file.path.replace(
        /\\/g,
        "/"
      );
    }

    hottestCategory.hottest_category_name =
      hottest_category_name || hottestCategory.hottest_category_name;
    hottestCategory.hottest_category_description =
      hottest_category_description ||
      hottestCategory.hottest_category_description;
    hottestCategory.products = products
      ? JSON.parse(products)
      : hottestCategory.products;

    await hottestCategory.save();

    res.status(200).json({
      message: "Hottest category updated successfully",
      hottestCategory,
    });
  } catch (error) {
    console.error("Error updating hottest category:", error);
    res.status(500).json({ message: "Error updating hottest category" });
  }
};

// Delete a hottest category
const deleteHottestCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const hottestCategory = await HottestCategory.findByIdAndDelete(id);

    if (!hottestCategory) {
      return res.status(404).json({ message: "Hottest category not found" });
    }

    // Delete the associated image
    if (hottestCategory.hottest_category_image) {
      const imagePath = path.resolve(
        __dirname,
        "..",
        hottestCategory.hottest_category_image
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({ message: "Hottest category deleted successfully" });
  } catch (error) {
    console.error("Error deleting hottest category:", error);
    res.status(500).json({ message: "Error deleting hottest category" });
  }
};

// Get products associated with a hottest category
const getProductsByHottestCategory = async (req, res) => {
  try {
    const { hottestCategoryId } = req.params;

    if (!hottestCategoryId) {
      return res
        .status(400)
        .json({ message: "Hottest category ID is required." });
    }

    // Fetch and populate products
    const hottestCategory = await HottestCategory.findById(hottestCategoryId);

    if (!hottestCategory) {
      return res.status(404).json({ message: "Hottest category not found." });
    }

    // Return the populated products
    return res.status(200).json(hottestCategory.products);
  } catch (error) {
    console.error("Error fetching products by hottest category:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addHottestCategory,
  getAllHottestCategories,
  getHottestCategoryById,
  updateHottestCategory,
  deleteHottestCategory,
  hottestCategoryUpload, // Export multer middleware for routes
  getProductsByHottestCategory,
};
