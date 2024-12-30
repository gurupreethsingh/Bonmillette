const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const IssueController = require("../controllers/IssueController");

const router = express.Router();

// Ensure the folder exists
const ensureFolderExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/issues_images");
    ensureFolderExists(uploadPath); // Ensure folder exists before storing
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// Multer upload instance
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

router.post(
  "/add-issue",
  upload.array("issue_images", 5), // Allow up to 5 images per issue
  IssueController.createIssue
);

router.get("/get-all-issues", IssueController.getAllIssues);
router.get("/single-issue/:id", IssueController.getIssueById);
router.put(
  "/update-issues/:id",
  upload.array("issue_images", 5), // Allow up to 5 new images to be added
  IssueController.updateIssue
);

router.delete("/delete-issue/:id", IssueController.deleteIssue);
router.get("/issues/status/:status", IssueController.countIssuesByStatus);
router.get("/issues/status-counts", IssueController.getAllStatusCounts);

router.get("/issues/assigned/:userId", IssueController.getAssignedIssues);

router.get("/issues/count", IssueController.getTotalIssuesCount);

// get all the issues raised by the customer. based on customer id.
router.get("/issues/customer/:userId", IssueController.getIssuesByCustomer);

router.get("/issues/unresolved", IssueController.countUnresolvedIssues);

module.exports = router;
