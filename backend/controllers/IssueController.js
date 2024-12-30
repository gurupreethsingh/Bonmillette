const mongoose = require("mongoose"); // Import mongoose
const Issue = require("../models/IssueModel");
const fs = require("fs");

// Helper to ensure the upload folder exists
const ensureFolderExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Helper to delete old images
const deleteOldImages = (imagePaths) => {
  imagePaths.forEach((imagePath) => {
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  });
};

// Create a new issue
exports.createIssue = async (req, res) => {
  try {
    console.log("Received Order ID:", req.body.order_id); // Debug log

    const { title, description, customer_id, order_id } = req.body;

    if (!customer_id || !order_id) {
      return res
        .status(400)
        .json({ message: "Customer ID and Order ID are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(order_id)) {
      return res.status(400).json({ message: "Invalid Order ID." });
    }

    const issue = new Issue({
      title,
      description,
      customer_id,
      order_id,
      issue_images: req.files?.map((file) => file.filename) || [],
    });

    await issue.save();
    res.status(201).json({ success: true, issue });
  } catch (error) {
    console.error("Error creating issue:", error.message);
    res.status(500).json({ message: "Failed to create issue.", error });
  }
};

// Get all issues
exports.getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("customer_id", "name email") // Populate customer details
      .populate("order_id", "orderId total_cost") // Populate order details
      .populate("assigned_to", "name email role")
      .populate("assigned_by", "name email");

    res.status(200).json({ success: true, issues });
  } catch (error) {
    console.error("Error fetching issues:", error.message);
    res.status(500).json({ message: "Failed to fetch issues.", error });
  }
};

// Get single issue by ID
exports.getIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id)
      .populate("customer_id", "name email")
      .populate("order_id", "orderId total_cost") // Populate order details
      .populate("assigned_to", "name email role")
      .populate("assigned_by", "name email")
      .populate("closed_by", "name email");

    if (!issue) {
      return res
        .status(404)
        .json({ success: false, message: "Issue not found." });
    }

    res.status(200).json({ success: true, issue });
  } catch (error) {
    console.error("Error fetching issue:", error.message);
    res.status(500).json({ message: "Failed to fetch issue.", error });
  }
};

// Update an issue
exports.updateIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      assigned_to,
      assigned_by,
      closed_by,
      order_id, // Optional order ID update
      assigned_date,
      fixed_date,
      re_opened_date,
      closed_date,
    } = req.body;

    const existingIssue = await Issue.findById(id);
    if (!existingIssue) {
      return res
        .status(404)
        .json({ success: false, message: "Issue not found." });
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.filename);
      existingIssue.issue_images = [
        ...existingIssue.issue_images,
        ...newImages,
      ];
    }

    if (status) existingIssue.status = status;
    if (order_id) existingIssue.order_id = order_id; // Update order ID
    if (assigned_to) existingIssue.assigned_to = assigned_to;
    if (assigned_by) existingIssue.assigned_by = assigned_by;
    if (closed_by) existingIssue.closed_by = closed_by;
    if (assigned_date) existingIssue.assigned_date = assigned_date;
    if (fixed_date) existingIssue.fixed_date = fixed_date;
    if (re_opened_date) existingIssue.re_opened_date = re_opened_date;
    if (closed_date) existingIssue.closed_date = closed_date;

    await existingIssue.save();

    res.status(200).json({
      success: true,
      message: "Issue updated successfully.",
      issue: existingIssue,
    });
  } catch (error) {
    console.error("Error updating issue:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to update issue.", error });
  }
};

// Delete an issue
exports.deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the existing issue
    const existingIssue = await Issue.findById(id);
    if (!existingIssue) {
      return res
        .status(404)
        .json({ success: false, message: "Issue not found." });
    }

    // Delete associated images
    deleteOldImages(existingIssue.issue_images);

    await Issue.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Issue deleted successfully." });
  } catch (error) {
    console.error("Error deleting issue:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error deleting issue.", error });
  }
};

// Get issues assigned to a specific user
exports.getAssignedIssues = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Assigned Issues Request for userId:", userId); // Debug log
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required." });
    }

    const issues = await Issue.find({ assigned_to: userId })
      .populate("customer_id", "name email")
      .populate("assigned_to", "name email role")
      .populate("assigned_by", "name email");

    res.status(200).json({ success: true, issues });
  } catch (error) {
    console.error("Error fetching assigned issues:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch assigned issues.",
      error,
    });
  }
};

// Count issues by status
exports.countIssuesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const count = await Issue.countDocuments({ status });
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Error counting issues by status:", error.message);
    res.status(500).json({
      success: false,
      message: "Error counting issues by status.",
      error,
    });
  }
};

// Get count of all statuses
exports.getAllStatusCounts = async (req, res) => {
  try {
    const statuses = ["open", "fixed", "pending", "canceled", "closed"];
    const counts = {};

    for (const status of statuses) {
      counts[status] = await Issue.countDocuments({ status });
    }

    res.status(200).json({ success: true, counts });
  } catch (error) {
    console.error("Error fetching status counts:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching status counts.",
      error,
    });
  }
};

// Get total count of all issues
exports.getTotalIssuesCount = async (req, res) => {
  try {
    const count = await Issue.countDocuments();
    res.status(200).json({ success: true, totalIssues: count });
  } catch (error) {
    console.error("Error fetching total issue count:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching total issue count.",
      error,
    });
  }
};

// Get issues raised by a specific user (customer_id)
exports.getIssuesByCustomer = async (req, res) => {
  try {
    const { userId } = req.params;
    const { orderId } = req.query;

    const query = { customer_id: userId };
    if (orderId) {
      query.order_id = orderId; // Filter by order ID if provided
    }

    const issues = await Issue.find(query)
      .populate("customer_id", "name email")
      .populate("order_id", "orderId total_cost");

    res.status(200).json({ success: true, issues });
  } catch (error) {
    console.error("Error fetching issues by customer:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch issues by customer.",
      error: error.message,
    });
  }
};

// In the controller
exports.countUnresolvedIssues = async (req, res) => {
  try {
    const unresolvedIssues = await Issue.countDocuments({
      status: { $nin: ["resolved", "fixed", "closed"] },
    });
    res.status(200).json({ success: true, unresolvedIssues });
  } catch (error) {
    console.error("Error fetching unresolved issues:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch unresolved issues.", error });
  }
};
