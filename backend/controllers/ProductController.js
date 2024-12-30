const Product = require("../models/ProductModel");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Review = require("../models/ReviewModel");
const FeaturedProduct = require("../models/FeaturedProductModel");
const Advertisement = require("../models/AdvertisementModel");
const HottestCategory = require("../models/HottestCategoryModel");
const PopularBrands = require("../models/PopularBrandsModel");
const Outlet = require("../models/OutletModel");
const Order = require("../models/OrderModel");

// Configure Multer storage for product images
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/product_images";
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

// Multer middleware for uploading product images
const productUpload = multer({ storage: productStorage });

// Controller function to add a new product with volume and prices
const addProduct = async (req, res) => {
  try {
    const {
      product_name,
      description,
      category,
      stock,
      outlet, // JSON string from frontend
      brand,
      SKU,
      color,
      material,
      tags,
      discount,
      availability_status,
      vendor, // New vendor field
    } = req.body;

    const dimensions = req.body.dimensions
      ? JSON.parse(req.body.dimensions)
      : {};
    const product_image = req.files?.["product_image"]?.[0]?.path || "";
    const all_product_images =
      req.files?.["all_product_images"]?.map((file) => file.path) || [];
    const parsedOutlets = outlet ? JSON.parse(outlet) : []; // Parse outlet JSON

    // Validate volumes
    for (const outletEntry of parsedOutlets) {
      if (!outletEntry.products || !Array.isArray(outletEntry.products)) {
        return res
          .status(400)
          .json({ message: "Invalid products structure in outlet." });
      }
      for (const product of outletEntry.products) {
        if (
          !product.volume ||
          !product.selling_price ||
          !product.display_price
        ) {
          return res.status(400).json({
            message: "Volume, selling_price, and display_price are required.",
          });
        }
      }
    }

    // Create a new product document
    const newProduct = new Product({
      product_name,
      product_image,
      all_product_images,
      description,
      category,
      stock,
      brand,
      SKU,
      dimensions,
      color,
      material,
      tags: tags ? tags.split(",") : [],
      discount,
      availability_status,
      outlet: parsedOutlets, // Store outlet with volumes
      vendor, // Link product to the vendor
    });

    // Save the product
    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product", error });
  }
};

// Controller function to update product volumes and prices
const updateProductVolumes = async (req, res) => {
  try {
    const { id } = req.params;
    const { outlet_id, volumes } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const outletEntry = product.outlet.find(
      (o) => o.outlet.toString() === outlet_id
    );
    if (!outletEntry) {
      return res.status(404).json({ message: "Outlet entry not found" });
    }

    outletEntry.products = JSON.parse(volumes); // Replace with new volumes
    await product.save();

    res.status(200).json({
      message: "Product volumes updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product volumes:", error);
    res.status(500).json({ message: "Error updating product volumes", error });
  }
};

// Internal helper function for linking products to outlets
const addProductToOutletInternal = async (outletId, productId, quantity) => {
  const outlet = await Outlet.findById(outletId);
  if (!outlet) {
    throw new Error("Outlet not found");
  }

  const existingProduct = outlet.products.find(
    (p) => p.product.toString() === productId
  );

  if (existingProduct) {
    existingProduct.quantity += quantity; // Update quantity if product already exists
  } else {
    outlet.products.push({ product: productId, quantity });
  }

  await outlet.save();

  // Update product outlet array as well
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found while linking to outlet");
  }

  product.outlet.push({ outlet: outletId, quantity });
  await product.save();
};

// Controller function to get all products
const getAllAddedProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category outlet.outlet");

    // Calculate the lowest price for each product
    const productsWithLowestPrice = products.map((product) => {
      let lowestPrice = Infinity;

      product.outlet.forEach((outlet) => {
        outlet.products.forEach((item) => {
          if (item.selling_price < lowestPrice) {
            lowestPrice = item.selling_price;
          }
        });
      });

      return {
        ...product.toObject(),
        lowestPrice: lowestPrice === Infinity ? 0 : lowestPrice, // If no prices are found, set to 0
      };
    });

    res.status(200).json(productsWithLowestPrice);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Controller function to get a product by ID
// const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findById(id).populate(
//       "category outlet.outlet"
//     );
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     res.status(200).json(product);
//   } catch (error) {
//     console.error("Error fetching product by ID:", error);
//     res.status(500).json({ message: "Error fetching product", error });
//   }
// };

//

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("vendor", "name");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Error fetching product", error });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // Product ID
    const { volumes, outlet_id } = req.body; // Volumes and outlet ID for updates
    const updatedData = { ...req.body }; // Clone req.body to avoid mutating

    // Handle product image updates
    if (req.files?.["product_image"]) {
      updatedData.product_image = req.files["product_image"][0].path.replace(
        /\\/g,
        "/"
      );
    }

    // Handle additional product images updates
    if (req.files?.["all_product_images"]) {
      updatedData.all_product_images = req.files["all_product_images"].map(
        (file) => file.path.replace(/\\/g, "/")
      );
    }

    // Find the product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update volumes if provided
    if (volumes && outlet_id) {
      const parsedVolumes = JSON.parse(volumes); // Parse volumes array from JSON string

      const outletEntry = product.outlet.find(
        (o) => o.outlet.toString() === outlet_id
      );

      if (outletEntry) {
        outletEntry.products = parsedVolumes; // Replace existing volumes
      } else {
        // If the outlet entry doesn't exist, create a new one
        product.outlet.push({
          outlet: outlet_id,
          products: parsedVolumes,
        });
      }
    }

    // Update other product details
    Object.assign(product, updatedData);

    // Save the updated product
    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error });
  }
};

// Controller function to delete a product by ID
// Controller function to delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Remove product from associated outlets
    for (const outletEntry of product.outlet) {
      const outlet = await Outlet.findById(outletEntry.outlet);
      if (outlet) {
        outlet.products = outlet.products.filter(
          (p) => p.product.toString() !== id
        );
        await outlet.save();
      }
    }

    // Remove product images
    if (product.product_image) {
      fs.unlinkSync(path.join(__dirname, "..", product.product_image));
    }
    product.all_product_images.forEach((image) =>
      fs.unlinkSync(path.join(__dirname, "..", image))
    );

    // Delete the product
    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error });
  }
};

// Controller function to update only the product image
const updateProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the old image if it exists
    if (product.product_image) {
      const oldImagePath = path.join(__dirname, "..", product.product_image);
      try {
        await fs.promises.unlink(oldImagePath);
      } catch (err) {
        console.error("Error deleting old product image:", err);
      }
    }

    // Update with the new image
    product.product_image = req.file.path.replace(/\\/g, "/"); // Normalize the path
    await product.save();

    res.status(200).json({
      message: "Product image updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product image:", error);
    res.status(500).json({ message: "Error updating product image" });
  }
};

// Controller function to update additional product images
const updateProductAdditionalImages = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Normalize and add the new images
    const newImages = req.files.map((file) => file.path.replace(/\\/g, "/"));
    product.all_product_images.push(...newImages);

    const updatedProduct = await product.save();
    res.status(200).json({
      message: "Additional images added successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error adding additional images:", error);
    res.status(500).json({ message: "Error adding additional images", error });
  }
};

// Controller function to delete a specific additional product image
const deleteProductAdditionalImage = async (req, res) => {
  try {
    const { id, index } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (index < 0 || index >= product.all_product_images.length) {
      return res.status(400).json({ message: "Invalid image index" });
    }

    // Remove the image and delete the file
    const deletedImage = product.all_product_images.splice(index, 1)[0];
    const imagePath = path.join(__dirname, "..", deletedImage);
    try {
      fs.unlinkSync(imagePath);
    } catch (error) {
      console.error("Error deleting image file:", error);
    }

    const updatedProduct = await product.save();
    res.status(200).json({
      message: "Additional image deleted successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error deleting additional image:", error);
    res.status(500).json({ message: "Error deleting additional image", error });
  }
};

const countAllProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting products:", error);
    res.status(500).json({ message: "Error counting products", error });
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 10; // Default threshold is 10
    const products = await Product.find({ stock: { $lte: threshold } });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    res
      .status(500)
      .json({ message: "Error fetching low stock products", error });
  }
};

const getProductsByOutlet = async (req, res) => {
  try {
    const { outletId } = req.params;
    const products = await Product.find({
      "outlet.outlet": outletId,
    }).populate("outlet.outlet");

    // Include only products relevant to the given outlet
    const filteredProducts = products.map((product) => {
      const outletData = product.outlet.find(
        (o) => o.outlet.toString() === outletId
      );
      return {
        ...product.toObject(),
        outlet: outletData ? [outletData] : [],
      };
    });

    res.status(200).json(filteredProducts);
  } catch (error) {
    console.error("Error fetching products by outlet:", error);
    res
      .status(500)
      .json({ message: "Error fetching products by outlet", error });
  }
};

// Controller function to fetch products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params; // Category ID
    const products = await Product.find({ category: id }).populate("category");
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res
      .status(500)
      .json({ message: "Error fetching products by category", error });
  }
};

// Decrease stock when an order is confirmed
const decreaseStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    product.stock -= quantity;
    await product.save();

    res.status(200).json({
      message: "Stock updated successfully after order confirmation",
      product,
    });
  } catch (error) {
    console.error("Error decreasing stock:", error);
    res.status(500).json({ message: "Error decreasing stock", error });
  }
};

// Fetch remaining stock for a product
const getRemainingStock = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      product_name: product.product_name,
      remaining_stock: product.stock,
    });
  } catch (error) {
    console.error("Error fetching remaining stock:", error);
    res.status(500).json({ message: "Error fetching remaining stock", error });
  }
};

// Controller function to update stock explicitly
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stockChange } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.stock = Math.max(0, product.stock + stockChange); // Ensure stock is not negative
    await product.save();

    res.status(200).json({ message: "Stock updated successfully", product });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ message: "Error updating stock", error });
  }
};

// Controller function to add a product to an outlet
const addProductToOutlet = async (req, res) => {
  try {
    const { outletId } = req.params;
    const { productId, volumes } = req.body;

    const outlet = await Outlet.findById(outletId);
    const product = await Product.findById(productId);

    if (!outlet || !product) {
      return res.status(404).json({ message: "Outlet or Product not found" });
    }

    // Parse volumes from request
    const parsedVolumes = volumes ? JSON.parse(volumes) : [];

    // Update outlet's product list
    const existingProduct = outlet.products.find(
      (p) => p.product.toString() === productId
    );
    if (existingProduct) {
      existingProduct.products.push(...parsedVolumes);
    } else {
      outlet.products.push({ product: productId, products: parsedVolumes });
    }
    await outlet.save();

    // Update product's outlet field
    const existingOutlet = product.outlet.find(
      (o) => o.outlet.toString() === outletId
    );
    if (existingOutlet) {
      existingOutlet.products.push(...parsedVolumes);
    } else {
      product.outlet.push({ outlet: outletId, products: parsedVolumes });
    }
    await product.save();

    res.status(200).json({ message: "Product linked to outlet successfully" });
  } catch (error) {
    console.error("Error linking product to outlet:", error);
    res.status(500).json({ message: "Error linking product to outlet", error });
  }
};

// Fetch all product names
const getAllProductNames = async (req, res) => {
  try {
    const products = await Product.find({}, "product_name");
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching product names:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching product names." });
  }
};

// Fetch product purchase history based on filters
// const getProductPurchaseHistory = async (req, res) => {
//   try {
//     const { productId, filter, startDate, endDate } = req.query;
//     const filterCondition = {};

//     if (filter === "weekly") {
//       const now = new Date();
//       filterCondition.createdAt = {
//         $gte: new Date(now.setDate(now.getDate() - 7)),
//       };
//     } else if (filter === "monthly") {
//       const now = new Date();
//       filterCondition.createdAt = {
//         $gte: new Date(now.setMonth(now.getMonth() - 1)),
//       };
//     } else if (filter === "halfYearly") {
//       const now = new Date();
//       filterCondition.createdAt = {
//         $gte: new Date(now.setMonth(now.getMonth() - 6)),
//       };
//     } else if (filter === "yearly") {
//       const now = new Date();
//       filterCondition.createdAt = {
//         $gte: new Date(now.setFullYear(now.getFullYear() - 1)),
//       };
//     } else if (startDate && endDate) {
//       filterCondition.createdAt = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       };
//     }

//     if (productId) {
//       filterCondition["products.product"] = productId;
//     }

//     const orders = await Order.find(filterCondition).populate(
//       "products.product",
//       "product_name"
//     );

//     if (!orders.length) {
//       return res
//         .status(404)
//         .json({ success: false, message: "No purchase history found." });
//     }

//     const productSales = {};
//     orders.forEach((order) => {
//       order.products.forEach((product) => {
//         const productName = product.product?.product_name || null; // Handle undefined product names
//         if (productName) {
//           if (!productSales[productName]) {
//             productSales[productName] = 0;
//           }
//           productSales[productName] += product.quantity;
//         }
//       });
//     });

//     res.status(200).json({
//       success: true,
//       message: "Purchase history fetched successfully.",
//       purchaseHistory: productSales,
//     });
//   } catch (error) {
//     console.error("Error fetching purchase history:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error fetching purchase history." });
//   }
// };

const getProductPurchaseHistory = async (req, res) => {
  try {
    const { productId, startDate, endDate } = req.query;
    const filterCondition = {};

    if (startDate && endDate) {
      filterCondition.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (productId) {
      filterCondition["products.product"] = productId;
    }

    const orders = await Order.find(filterCondition).populate(
      "products.product",
      "product_name"
    );

    if (!orders.length) {
      return res
        .status(404)
        .json({ success: false, message: "No purchase history found." });
    }

    const productSales = {};
    orders.forEach((order) => {
      order.products.forEach((product) => {
        if (!productId || product.product?._id.toString() === productId) {
          const productName = product.product?.product_name || null;
          if (productName) {
            if (!productSales[productName]) {
              productSales[productName] = 0;
            }
            productSales[productName] += product.quantity;
          }
        }
      });
    });

    res.status(200).json({
      success: true,
      message: "Purchase history fetched successfully.",
      purchaseHistory: productSales,
    });
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching purchase history." });
  }
};

// funciton to fetch random products.
// Controller function to get random products
const getRandomProducts = async (req, res) => {
  try {
    const count = parseInt(req.params.count, 10); // Number of random products to fetch
    const products = await Product.aggregate([{ $sample: { size: count } }]);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching random products:", error);
    res.status(500).json({ message: "Error fetching random products", error });
  }
};

module.exports = {
  productUpload,
  addProduct,
  updateProductVolumes,
  getAllAddedProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByOutlet,
  getProductsByCategory,
  updateStock,
  updateProductAdditionalImages,
  deleteProductAdditionalImage,
  countAllProducts,
  getLowStockProducts,
  updateProductImage,
  decreaseStock,
  getRemainingStock,
  updateStock,
  addProductToOutlet,
  getAllProductNames,
  getProductPurchaseHistory,
  getRandomProducts,
};
