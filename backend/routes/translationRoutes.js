const express = require("express");
const {
  getTranslations,
  translateText,
  getAllTranslations,
} = require("../controllers/translationController");

const router = express.Router();

router.get("/", getTranslations);
router.post("/translate", translateText);
router.get("/all", getAllTranslations);

module.exports = router;
