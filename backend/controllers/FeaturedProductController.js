const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const FeaturedProduct = require("../models/FeaturedProductModel");
const Product = require("../models/ProductModel");

// Configure multer storage for featured products
const featuredproductStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/featured_products";
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

// Multer middleware for uploading featured product images
const featuredproductUpload = multer({ storage: featuredproductStorage });

// Add a new featured product
const addFeaturedProduct = async (req, res) => {
  try {
    const { featured_product_name, featured_product_description, products } =
      req.body;

    // Handle featured product image
    const featured_product_image = req.file
      ? req.file.path.replace(/\\/g, "/")
      : ""; // Store relative path of the image

    let parsedProducts = [];
    if (products) {
      try {
        // Parse products only if it's provided
        parsedProducts = JSON.parse(products); // Ensure products is an array of ObjectIds
      } catch (err) {
        console.error("Error parsing products field:", err.message);
        return res.status(400).json({
          message: "Invalid products format. It should be a JSON array.",
        });
      }
    }

    // Create the new featured product
    const newFeaturedProduct = new FeaturedProduct({
      featured_product_name,
      featured_product_description,
      featured_product_image,
      products: parsedProducts,
    });

    await newFeaturedProduct.save();

    res.status(201).json({
      message: "Featured Product added successfully",
      featuredProduct: newFeaturedProduct,
    });
  } catch (error) {
    console.error("Error adding Featured Product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all featured products
const getAllFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await FeaturedProduct.find().populate("products");
    res.status(200).json(featuredProducts);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ message: "Error fetching featured products" });
  }
};

// Fetch a single featured product by ID
const getFeaturedProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const featuredProduct = await FeaturedProduct.findById(id).populate(
      "products"
    );

    if (!featuredProduct) {
      return res.status(404).json({ message: "Featured Product not found" });
    }

    res.status(200).json(featuredProduct);
  } catch (error) {
    console.error("Error fetching featured product:", error);
    res.status(500).json({ message: "Error fetching featured product" });
  }
};

// Update a featured product
const updateFeaturedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { featured_product_name, featured_product_description, products } =
      req.body;

    const featuredProduct = await FeaturedProduct.findById(id);

    if (!featuredProduct) {
      return res.status(404).json({ message: "Featured Product not found" });
    }

    // If a new image is uploaded, delete the old one
    if (req.file) {
      if (featuredProduct.featured_product_image) {
        const oldImagePath = path.resolve(
          __dirname,
          "..",
          featuredProduct.featured_product_image
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      featuredProduct.featured_product_image = req.file.path.replace(
        /\\/g,
        "/"
      );
    }

    featuredProduct.featured_product_name =
      featured_product_name || featuredProduct.featured_product_name;
    featuredProduct.featured_product_description =
      featured_product_description ||
      featuredProduct.featured_product_description;
    featuredProduct.products = products
      ? JSON.parse(products)
      : featuredProduct.products;

    await featuredProduct.save();

    res.status(200).json({
      message: "Featured Product updated successfully",
      featuredProduct,
    });
  } catch (error) {
    console.error("Error updating featured product:", error);
    res.status(500).json({ message: "Error updating featured product" });
  }
};

// Delete a featured product
const deleteFeaturedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const featuredProduct = await FeaturedProduct.findByIdAndDelete(id);

    if (!featuredProduct) {
      return res.status(404).json({ message: "Featured Product not found" });
    }

    // Delete the associated image
    if (featuredProduct.featured_product_image) {
      const imagePath = path.resolve(
        __dirname,
        "..",
        featuredProduct.featured_product_image
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({ message: "Featured Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting featured product:", error);
    res.status(500).json({ message: "Error deleting featured product" });
  }
};

const getProductsByFeaturedProduct = async (req, res) => {
  try {
    const { featuredProductId } = req.params;

    if (!featuredProductId) {
      return res
        .status(400)
        .json({ message: "Featured Product ID is required." });
    }

    console.log("Fetching Featured Product with ID:", featuredProductId);

    // Fetch and populate products
    const featuredProduct = await FeaturedProduct.findById(featuredProductId);

    if (!featuredProduct) {
      return res.status(404).json({ message: "Featured Product not found." });
    }

    // Return the populated products
    return res.status(200).json(featuredProduct.products);
  } catch (error) {
    console.error("Error fetching products by featured product:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addFeaturedProduct,
  getAllFeaturedProducts,
  getFeaturedProductById,
  updateFeaturedProduct,
  deleteFeaturedProduct,
  featuredproductUpload, // Export multer middleware for routes
  getProductsByFeaturedProduct,
};
