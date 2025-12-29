const express = require("express");
const {
  getAllArticles,
  getArticleDetails,
  getCategories,
  getPesticideGuidelines,
  getOrganicTips,
  getCropGuides,
} = require("../controllers/knowledgeHubController");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/articles", auth, getAllArticles);
router.get("/articles/:articleId", auth, getArticleDetails);
router.get("/categories", auth, getCategories);
router.get("/guidelines/pesticide", auth, getPesticideGuidelines);
router.get("/tips/organic", auth, getOrganicTips);
router.get("/guides/crop", auth, getCropGuides);

module.exports = router;
