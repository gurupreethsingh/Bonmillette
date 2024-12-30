const Ticket = require("../models/TicketModel");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Create a new ticket
exports.createTicket = async (req, res) => {
  try {
    const { product, issueDescription } = req.body;
    const customer = req.user.id; // Logged-in user

    if (!product || !issueDescription) {
      return res
        .status(400)
        .json({ message: "Product and issue description are required" });
    }

    // Collect uploaded file paths
    const ticketImages = req.files ? req.files.map((file) => file.path) : [];

    const ticket = new Ticket({
      customer,
      product,
      issueDescription,
      productImage: ticketImages, // Store array of image paths
    });

    await ticket.save();

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Failed to create ticket" });
  }
};

// Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("customer", "name email") // Populate customer details
      .populate("product", "product_name"); // Populate product details

    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Error fetching tickets" });
  }
};

// Get a single ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id)
      .populate("customer", "name email")
      .populate("product", "product_name");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Error fetching ticket" });
  }
};

// Update ticket status or details
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedEmployee } = req.body;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (status) ticket.status = status;
    if (assignedEmployee) ticket.assignedEmployee = assignedEmployee;

    await ticket.save();

    res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ message: "Error updating ticket" });
  }
};

// Delete a ticket and its associated images
exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Delete associated images from the file system
    if (ticket.productImage && ticket.productImage.length > 0) {
      ticket.productImage.forEach((imagePath) => {
        const fullPath = path.join(__dirname, "..", imagePath);
        fs.unlink(fullPath, (err) => {
          if (err) console.error("Error deleting image:", err);
        });
      });
    }

    await Ticket.findByIdAndDelete(id);

    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ message: "Error deleting ticket" });
  }
};

// Add a comment to a ticket
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const user = req.user.id; // Logged-in user

    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.comments.push({ user, comment });
    await ticket.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      ticket,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment" });
  }
};
