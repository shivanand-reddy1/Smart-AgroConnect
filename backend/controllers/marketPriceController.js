const MarketPrice = require("../models/MarketPrice");
const axios = require("axios");

// Get market prices for a crop
const getMarketPrices = async (req, res) => {
  try {
    const { crop, state, city } = req.query;

    if (!crop) {
      return res.status(400).json({ message: "Crop name is required" });
    }

    // Mock market prices - In production, integrate with real Mandi API
    // Generate prices with constraint: minPrice < avgPrice < maxPrice
    const minPrice = Math.floor(Math.random() * 1000) + 2000; // 2000-3000
    const maxPrice = Math.floor(Math.random() * 1500) + 5000; // 5000-6500
    const avgPrice =
      Math.floor((minPrice + maxPrice) / 2) + Math.floor(Math.random() * 500); // Between min and max

    // Get yesterday's price for trend calculation
    const yesterdayPrice = Math.floor(Math.random() * 1500) + 3500;

    // Calculate trend based on actual price comparison
    let trend = "stable";
    let percentChange = 0;

    if (avgPrice > yesterdayPrice) {
      trend = "up";
      percentChange = (
        ((avgPrice - yesterdayPrice) / yesterdayPrice) *
        100
      ).toFixed(2);
    } else if (avgPrice < yesterdayPrice) {
      trend = "down";
      percentChange = (
        ((avgPrice - yesterdayPrice) / yesterdayPrice) *
        100
      ).toFixed(2);
    }

    const priceData = {
      crop: crop.toLowerCase(),
      market: {
        name: "Mandi Market",
        city: city || "Bangalore",
        state: state || "Karnataka",
      },
      date: new Date(),
      minPrice,
      avgPrice,
      maxPrice,
      unit: "quintal",
      volume: Math.floor(Math.random() * 1000),
      trend,
      percentChange: `${percentChange}%`,
      yesterdayPrice,
      quality: "Good",
      dataConsistencyCheck: minPrice < avgPrice && avgPrice < maxPrice, // For validation
    };

    const price = new MarketPrice(priceData);
    await price.save();

    res.json(priceData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching market prices", error: error.message });
  }
};

// Get comparative market prices
const getComparativePrices = async (req, res) => {
  try {
    const { crop, states } = req.query;

    if (!crop) {
      return res.status(400).json({ message: "Crop name is required" });
    }

    const stateList = states
      ? states.split(",")
      : ["Karnataka", "Maharashtra", "Tamil Nadu"];

    const comparativeData = stateList.map((state) => ({
      state,
      city: "Major Market",
      avgPrice: Math.floor(Math.random() * 2000) + 4000,
      date: new Date(),
      trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)],
    }));

    res.json({
      crop,
      comparison: comparativeData,
      bestPrice: Math.max(...comparativeData.map((d) => d.avgPrice)),
      bestState: comparativeData.find(
        (d) =>
          d.avgPrice === Math.max(...comparativeData.map((d) => d.avgPrice)),
      ).state,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching comparative prices",
      error: error.message,
    });
  }
};

// Get price trends
const getPriceTrends = async (req, res) => {
  try {
    const { crop, days = 30 } = req.query;

    if (!crop) {
      return res.status(400).json({ message: "Crop name is required" });
    }

    const trends = [];
    let basePrice = Math.floor(Math.random() * 1000) + 4000;

    // Generate realistic trend data where each day has slight variation
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Add variance: price fluctuates ±10% day to day
      const variance = (Math.random() - 0.5) * 0.2; // ±10%
      basePrice = Math.floor(basePrice * (1 + variance));

      trends.push({
        date,
        avgPrice: basePrice,
        volume: Math.floor(Math.random() * 500),
      });
    }

    // Calculate high and low from actual trend data
    const prices = trends.map((t) => t.avgPrice);
    const highestPrice = Math.max(...prices);
    const lowestPrice = Math.min(...prices);

    // Calculate 7-day and 30-day moving averages
    const last7Days = trends.slice(-7);
    const avg7Day = (
      last7Days.reduce((sum, t) => sum + t.avgPrice, 0) / last7Days.length
    ).toFixed(2);

    const last30Days = trends.slice(-30);
    const avg30Day = (
      last30Days.reduce((sum, t) => sum + t.avgPrice, 0) / last30Days.length
    ).toFixed(2);

    res.json({
      crop,
      period: `${days} days`,
      trends,
      highestPrice,
      lowestPrice,
      avg7Day: parseFloat(avg7Day),
      avg30Day: parseFloat(avg30Day),
      currentPrice: trends[trends.length - 1].avgPrice,
      yesterdayPrice:
        trends.length > 1 ? trends[trends.length - 2].avgPrice : null,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching price trends", error: error.message });
  }
};

// Get best crop to sell today - Now includes selected crop if provided
const getBestCropToSell = async (req, res) => {
  try {
    const { city = "Bangalore", crop } = req.query;

    // Option A: If specific crop provided, show best price for that crop only
    if (crop) {
      const todayPrice = Math.floor(Math.random() * 1500) + 4000;
      const yesterdayPrice = Math.floor(Math.random() * 1500) + 3500;
      const profitChange = (
        ((todayPrice - yesterdayPrice) / yesterdayPrice) *
        100
      ).toFixed(2);

      return res.json({
        city,
        crop: crop.toLowerCase(),
        type: "SELECTED_CROP",
        label: `Best Price Trend for ${crop}`,
        todayPrice,
        yesterdayPrice,
        profitChange: parseFloat(profitChange),
        percentChangeFormatted: `${profitChange}%`,
        recommendation:
          parseFloat(profitChange) > 0
            ? "Good time to sell"
            : "Wait for better prices",
        updatedAt: new Date().toISOString(),
      });
    }

    // Option B: If no crop specified, show overall best crop in market
    const crops = ["Rice", "Wheat", "Corn", "Cotton", "Sugarcane"];
    const cropPrices = crops.map((c) => ({
      crop: c,
      todayPrice: Math.floor(Math.random() * 2000) + 4000,
      yesterdayPrice: Math.floor(Math.random() * 1500) + 3500,
    }));

    // Find crop with highest profit percentage
    const bestCropData = cropPrices.reduce((best, current) => {
      const currentProfit =
        ((current.todayPrice - current.yesterdayPrice) /
          current.yesterdayPrice) *
        100;
      const bestProfit =
        ((best.todayPrice - best.yesterdayPrice) / best.yesterdayPrice) * 100;
      return currentProfit > bestProfit ? current : best;
    });

    const profitChange = (
      ((bestCropData.todayPrice - bestCropData.yesterdayPrice) /
        bestCropData.yesterdayPrice) *
      100
    ).toFixed(2);

    res.json({
      city,
      crop: bestCropData.crop.toLowerCase(),
      type: "OVERALL_MARKET",
      label: "Best Crop to Sell Today (Overall Market)",
      todayPrice: bestCropData.todayPrice,
      yesterdayPrice: bestCropData.yesterdayPrice,
      profitChange: parseFloat(profitChange),
      percentChangeFormatted: `${profitChange}%`,
      recommendation:
        parseFloat(profitChange) > 0
          ? "Good time to sell"
          : "Wait for better prices",
      disclaimer:
        "This is advisory only. Market conditions may vary by location.",
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching best crop", error: error.message });
  }
};

module.exports = {
  getMarketPrices,
  getComparativePrices,
  getPriceTrends,
  getBestCropToSell,
};
