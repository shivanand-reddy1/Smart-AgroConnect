const mongoose = require("mongoose");

const marketPriceSchema = new mongoose.Schema({
  crop: {
    type: String,
    required: true,
  },
  variety: String,
  market: {
    name: String,
    city: String,
    state: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  minPrice: Number,
  maxPrice: Number,
  avgPrice: Number,
  unit: {
    type: String,
    default: "quintal",
  },
  trend: {
    type: String,
    enum: ["up", "down", "stable"],
  },
  volume: Number,
  quality: String,
  comparativeData: [
    {
      market: String,
      price: Number,
      date: Date,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MarketPrice", marketPriceSchema);
