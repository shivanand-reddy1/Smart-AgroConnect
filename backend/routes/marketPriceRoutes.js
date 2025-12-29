const express = require("express");
const {
  getMarketPrices,
  getComparativePrices,
  getPriceTrends,
  getBestCropToSell,
} = require("../controllers/marketPriceController");

// NOTE: Market price endpoints are intentionally public for now
// so frontend can fetch live/mock data without requiring authentication.
// In production, re-enable `auth` to protect sensitive endpoints.
const router = express.Router();

router.get("/", getMarketPrices);
router.get("/comparative", getComparativePrices);
router.get("/trends", getPriceTrends);
router.get("/best-crop", getBestCropToSell);

module.exports = router;
