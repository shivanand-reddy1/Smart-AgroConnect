const mongoose = require("mongoose");

const forumPostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "crop_disease",
      "farming_technique",
      "market_advice",
      "equipment",
      "weather",
      "general",
    ],
    required: true,
  },
  images: [String],
  tags: [String],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  replies: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      content: String,
      isExpertAnswer: Boolean,
      likes: [mongoose.Schema.Types.ObjectId],
      createdAt: Date,
    },
  ],
  views: {
    type: Number,
    default: 0,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ForumPost", forumPostSchema);
