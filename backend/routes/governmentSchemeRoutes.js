const express = require("express");
const {
  getAllSchemes,
  getSchemeDetails,
  checkEligibility,
  getSchemeDeadlines,
  createScheme,
} = require("../controllers/governmentSchemeController");
const { auth, roleBasedAccess } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, getAllSchemes);
router.get("/deadlines", auth, getSchemeDeadlines);
router.get("/:id", auth, getSchemeDetails);
router.post("/check-eligibility", auth, checkEligibility);
router.post("/", auth, roleBasedAccess(["admin"]), createScheme);

module.exports = router;
