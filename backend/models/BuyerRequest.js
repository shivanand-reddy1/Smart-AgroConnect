const mongoose = require("mongoose");

const buyerRequestSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cropName: {
    type: String,
    required: true,
  },
  variety: String,
  quantity: {
    amount: Number,
    unit: {
      type: String,
      default: "kg",
    },
  },
  budgetPerUnit: Number,
  quality: String,
  requiredDeliveryDate: Date,
  location: {
    city: String,
    state: String,
    district: String,
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BuyerRequest", buyerRequestSchema);
