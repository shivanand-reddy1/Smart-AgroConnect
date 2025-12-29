const express = require("express");
const {
  getAdvisory,
  getPestAdvice,
  getCropAdvice,
} = require("../controllers/chatbotController");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/advisory", auth, getAdvisory);
router.post("/pest-advice", auth, getPestAdvice);
router.post("/crop-advice", auth, getCropAdvice);

module.exports = router;
