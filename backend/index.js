const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken"); // For token verification
const path = require("path");
const fs = require("fs");

//import user routes.
const userRoutes = require("./routes/UserRoutes");
const contactRoutes = require("./routes/ContactRoutes");
const categoryRoutes = require("./routes/CategoryRoutes");
const productRoutes = require("./routes/ProductRoutes");
const reviewRoutes = require("./routes/ReviewRoutes");
const cartRoutes = require("./routes/CartRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const issueRoutes = require("./routes/IssueRoutes");
const outletRoutes = require("./routes/OutletRoutes");
const vendorRoutes = require("./routes/VendorRoutes");
const rawMaterialRoutes = require("./routes/RawMaterialRoutes");
const couponRoutes = require("./routes/CouponRoutes");
const blogRoutes = require("./routes/BlogRoutes");
const deliveryRoutes = require("./routes/DeliveryRoutes");

dotenv.config();
const app = express();

// Middleware
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Replace with your frontend's URL
//     credentials: true, // Enable credentials
//   })
// );

app.use(
  cors({
    origin: "https://www.bonmillette.com", // Replace with your frontend's URL
    credentials: true, // Enable credentials
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", userRoutes);
app.use("/api", contactRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", reviewRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api", issueRoutes);
app.use("/api", outletRoutes);
app.use("/api", vendorRoutes);
app.use("/api", rawMaterialRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api", blogRoutes);
app.use("/api", deliveryRoutes);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const PORT = process.env.PORT || 3006;

mongoose
  .connect("mongodb://127.0.0.1:27017/bonmillette")
  .then(() => {
    console.log("Connected to mongodb.");
  })
  .catch((err) => {
    console.log("Connection to mongo db failed,", err);
  });

app.listen(PORT, () => {
  console.log(`Connected to server successfully at port number ${PORT}`);
});
