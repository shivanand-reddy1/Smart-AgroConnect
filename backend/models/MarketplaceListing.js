const mongoose = require("mongoose");

const marketplaceListingSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cropName: {
    type: String,
    required: true,
  },
  variety: String,
  description: String,
  quantity: {
    amount: Number,
    unit: {
      type: String,
      default: "kg",
    },
  },
  pricePerUnit: {
    type: Number,
    required: true,
  },
  quality: String,
  certifications: [String],
  harvestDate: Date,
  images: [String],
  location: {
    city: String,
    state: String,
    district: String,
  },
  availability: {
    type: String,
    enum: ["available", "sold", "pending"],
    default: "available",
  },
  minOrderQuantity: Number,
  deliveryOptions: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MarketplaceListing", marketplaceListingSchema);
