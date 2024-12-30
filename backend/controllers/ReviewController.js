const Review = require("../models/ReviewModel");

exports.addReview = async (req, res) => {
  try {
    const { product, productType, rating, comment } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "User information is missing" });
    }

    const newReview = new Review({
      user: req.user.id, // Use user ID from decoded token
      product,
      productType,
      rating,
      comment,
    });

    const savedReview = await newReview.save();

    res.status(201).json({
      message: "Review added successfully",
      review: savedReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Server error while adding review" });
  }
};

exports.getReviewsByProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name") // Populate user details
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Server error while fetching reviews" });
  }
};
