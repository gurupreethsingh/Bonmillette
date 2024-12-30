const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const PopularBrand = require("../models/PopularBrandsModel");
const Product = require("../models/ProductModel");

// Configure multer storage for popular brand images
const popularBrandStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/popular_brands";
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

// Multer middleware for uploading popular brand images
const popularBrandUpload = multer({ storage: popularBrandStorage });

// Add a new popular brand
const addPopularBrand = async (req, res) => {
  try {
    const { brand_name, brand_description, products } = req.body;

    // Handle popular brand image
    const brand_image = req.file ? req.file.path.replace(/\\/g, "/") : ""; // Store relative path of the image

    let parsedProducts = [];
    if (products) {
      try {
        parsedProducts = JSON.parse(products); // Parse products if provided
      } catch (err) {
        console.error("Error parsing products field:", err.message);
        return res.status(400).json({
          message: "Invalid products format. It should be a JSON array.",
        });
      }
    }

    // Create the new popular brand
    const newPopularBrand = new PopularBrand({
      brand_name,
      brand_description,
      brand_image,
      products: parsedProducts,
    });

    await newPopularBrand.save();

    res.status(201).json({
      message: "Popular Brand added successfully",
      brand: newPopularBrand,
    });
  } catch (error) {
    console.error("Error adding popular brand:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all popular brands
const getAllPopularBrands = async (req, res) => {
  try {
    const brands = await PopularBrand.find().populate("products");
    res.status(200).json(brands);
  } catch (error) {
    console.error("Error fetching popular brands:", error);
    res.status(500).json({ message: "Error fetching popular brands" });
  }
};

// Fetch a single popular brand by ID
const getPopularBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await PopularBrand.findById(id).populate({
      path: "products",
      populate: {
        path: "category subcategory vendor", // Populate nested references if needed
      },
    });

    if (!brand) {
      return res.status(404).json({ message: "Popular Brand not found" });
    }

    res.status(200).json(brand);
  } catch (error) {
    console.error("Error fetching popular brand:", error);
    res.status(500).json({ message: "Error fetching popular brand" });
  }
};

// Update a popular brand
const updatePopularBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { brand_name, brand_description, products } = req.body;

    const brand = await PopularBrand.findById(id);

    if (!brand) {
      return res.status(404).json({ message: "Popular Brand not found" });
    }

    // If a new image is uploaded, delete the old one
    if (req.file) {
      if (brand.brand_image) {
        const oldImagePath = path.resolve(__dirname, "..", brand.brand_image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      brand.brand_image = req.file.path.replace(/\\/g, "/");
    }

    brand.brand_name = brand_name || brand.brand_name;
    brand.brand_description = brand_description || brand.brand_description;
    brand.products = products ? JSON.parse(products) : brand.products;

    await brand.save();

    res.status(200).json({
      message: "Popular Brand updated successfully",
      brand,
    });
  } catch (error) {
    console.error("Error updating popular brand:", error);
    res.status(500).json({ message: "Error updating popular brand" });
  }
};

// Delete a popular brand
const deletePopularBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await PopularBrand.findByIdAndDelete(id);

    if (!brand) {
      return res.status(404).json({ message: "Popular Brand not found" });
    }

    // Delete the associated image
    if (brand.brand_image) {
      const imagePath = path.resolve(__dirname, "..", brand.brand_image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({ message: "Popular Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting popular brand:", error);
    res.status(500).json({ message: "Error deleting popular brand" });
  }
};

// Get products associated with a popular brand
const getProductsByPopularBrand = async (req, res) => {
  try {
    const { brandId } = req.params;

    if (!brandId) {
      return res.status(400).json({ message: "Brand ID is required." });
    }

    console.log("Fetching Popular Brand with ID:", brandId);

    // Fetch and populate products
    const brand = await PopularBrand.findById(brandId);

    if (!brand) {
      return res.status(404).json({ message: "Popular Brand not found." });
    }

    // Return the populated products
    return res.status(200).json(brand.products);
  } catch (error) {
    console.error("Error fetching products by popular brand:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addPopularBrand,
  getAllPopularBrands,
  getPopularBrandById,
  updatePopularBrand,
  deletePopularBrand,
  popularBrandUpload, // Export multer middleware for routes
  getProductsByPopularBrand,
};
