const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "fertilizer",
      "weather",
      "scheme_deadline",
      "market_price",
      "buyer_request",
      "pest_alert",
      "forum_reply",
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  relatedData: {
    crop: String,
    price: Number,
    schemeId: mongoose.Schema.Types.ObjectId,
    pestName: String,
    buyerId: mongoose.Schema.Types.ObjectId,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  channel: {
    type: String,
    enum: ["email", "sms", "in-app", "push"],
    default: "in-app",
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  readAt: Date,
});

module.exports = mongoose.model("Notification", notificationSchema);
