const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  product_image: { type: String, required: true },
  all_product_images: [{ type: String }],

  description: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  stock: { type: Number, required: true }, // Total stock of the product
  total_products_sold: { type: Number, default: 0 }, // Tracks total products sold
  outlet: [
    {
      outlet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Outlet", // Reference to Outlet
      },
      products: [
        {
          volume: { type: String, required: true }, // Volume of the product
          selling_price: { type: Number, required: true }, // Selling price for the volume
          display_price: { type: Number, required: true },
        },
      ],
    },
  ],
  brand: { type: String, required: true },
  SKU: { type: String, unique: true },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
  },
  color: { type: String },
  material: { type: String },
  ratings: { type: Number, default: 0 },
  tags: [{ type: String }],
  availability_status: { type: Boolean, default: true },
  discount: { type: Number, default: 0 },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor", // Reference to Vendor
    required: true, // Assuming every product must have an associated vendor
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  returns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Return" }],
  wishlist_users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update 'updatedAt' field automatically
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if the product is linked to a user
productSchema.methods.isLinkedToUser = function (userId) {
  const userInWishlist = this.wishlist_users.some(
    (user) => user.toString() === userId.toString()
  );
  const userInOrders = this.orders.some(
    (order) => order.user && order.user.toString() === userId.toString()
  );
  const userInPurchases = this.purchases.some(
    (user) => user.toString() === userId.toString()
  );
  return userInWishlist || userInOrders || userInPurchases;
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
