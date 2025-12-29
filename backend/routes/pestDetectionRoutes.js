const express = require("express");
const multer = require("multer");
const {
  detectPestFromImage,
  getDetectionHistory,
  getDetectionDetails,
} = require("../controllers/pestDetectionController");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

// Configure multer for image upload
const upload = multer({ storage: multer.memoryStorage() });

router.post("/detect", auth, upload.single("image"), detectPestFromImage);
router.get("/history/:userId", auth, getDetectionHistory);
router.get("/:detectionId", auth, getDetectionDetails);

module.exports = router;
