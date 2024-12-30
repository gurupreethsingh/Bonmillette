const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  addComment,
} = require("../controllers/TicketController");

// Configure Multer storage for ticket images
const ticketStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/ticket_images";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Ensure directory exists
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

// Multer middleware for uploading ticket images (up to 5 images per ticket)
const ticketUpload = multer({
  storage: ticketStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB per image
}).array("ticketImages", 5); // Allow up to 5 images

// Create a ticket with up to 5 images
router.post("/", authenticateToken, ticketUpload, createTicket);

// Get all tickets
router.get("/", authenticateToken, getAllTickets);

// Get a single ticket by ID
router.get("/:id", authenticateToken, getTicketById);

// Update a ticket
router.put("/:id", authenticateToken, updateTicket);

// Delete a ticket
router.delete("/:id", authenticateToken, deleteTicket);

// Add a comment to a ticket
router.post("/:id/comments", authenticateToken, addComment);

module.exports = router;
