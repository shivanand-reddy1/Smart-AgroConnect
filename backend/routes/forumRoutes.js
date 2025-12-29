const express = require("express");
const {
  registerUser,
  createPost,
  getAllPosts,
  getPostDetails,
  addReply,
  likePost,
} = require("../controllers/forumController");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

// Registration endpoint (no authentication required)
router.post("/register", registerUser);

// Forum endpoints (authentication required)
router.post("/", auth, createPost);
router.get("/", auth, getAllPosts);
router.get("/:postId", auth, getPostDetails);
router.post("/:postId/reply", auth, addReply);
router.post("/:postId/like", auth, likePost);

module.exports = router;
