const mongoose = require("mongoose");

const pestDetectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  imageUrl: {
    type: String,
    required: true,
  },
  cropName: String,
  leafOrPest: {
    type: String,
    enum: ["leaf_disease", "pest"],
    required: true,
  },
  detectedIssue: String,
  confidence: Number,
  description: String,
  symptoms: [String],
  prevention: [String],
  treatment: [
    {
      type: String,
      method: String,
      duration: String,
    },
  ],
  organicAlternatives: [String],
  recommendedProducts: [String],
  modelUsed: {
    type: String,
    default: "CNN",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PestDetection", pestDetectionSchema);
