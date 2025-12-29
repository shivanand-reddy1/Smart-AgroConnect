const ForumPost = require("../models/ForumPost");
const { sendRegistrationEmail } = require("../utils/emailService");

// Community Registration with Email
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      role,
      crops,
      location,
      problemsNeeds,
      productsRequired,
      buyerLocation,
      qualification,
      specialization,
    } = req.body;

    // Validation
    if (!name || !email || !phone || !role) {
      return res.status(400).json({
        message: "Please provide name, email, phone, and role",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    // Validate role-specific fields
    if (role === "farmer") {
      if (!crops || !location || !problemsNeeds) {
        return res.status(400).json({
          message:
            "For farmer role, please provide crops, location, and problems/needs",
        });
      }
    } else if (role === "buyer") {
      if (!productsRequired || !buyerLocation) {
        return res.status(400).json({
          message:
            "For buyer role, please provide products required and location",
        });
      }
    } else if (role === "expert") {
      if (!qualification || !specialization) {
        return res.status(400).json({
          message:
            "For expert role, please provide qualification and specialization",
        });
      }
    } else {
      return res.status(400).json({
        message: "Invalid role. Choose from farmer, buyer, or expert",
      });
    }

    // Prepare registration data for email
    const registrationData = {
      name,
      email,
      phone,
      role,
      crops: role === "farmer" ? crops : undefined,
      location: role === "farmer" ? location : undefined,
      problemsNeeds: role === "farmer" ? problemsNeeds : undefined,
      productsRequired: role === "buyer" ? productsRequired : undefined,
      buyerLocation: role === "buyer" ? buyerLocation : undefined,
      qualification: role === "expert" ? qualification : undefined,
      specialization: role === "expert" ? specialization : undefined,
    };

    // Send registration email
    try {
      await sendRegistrationEmail(registrationData);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the registration if email fails, just log it
    }

    // Return success response
    res.status(201).json({
      message:
        "Registration successful! Confirmation email has been sent to your email address.",
      data: {
        name,
        email,
        role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Error processing registration",
      error: error.message,
    });
  }
};

// Create forum post
const createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const userId = req.user.userId;

    const post = new ForumPost({
      userId,
      title,
      content,
      category,
      tags,
    });

    await post.save();
    await post.populate("userId", "name profile");

    res.status(201).json({ message: "Post created", post });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const { category, searchTerm, page = 1, limit = 10 } = req.query;

    let query = {};
    if (category) query.category = category;
    if (searchTerm) {
      query.$or = [
        { title: new RegExp(searchTerm, "i") },
        { content: new RegExp(searchTerm, "i") },
      ];
    }

    const skip = (page - 1) * limit;

    const posts = await ForumPost.find(query)
      .populate("userId", "name email profile")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await ForumPost.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      posts,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};

// Get post details
const getPostDetails = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await ForumPost.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } },
      { new: true }
    ).populate([
      { path: "userId", select: "name email profile" },
      { path: "replies.userId", select: "name email profile" },
    ]);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching post", error: error.message });
  }
};

// Add reply to post
const addReply = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, isExpertAnswer } = req.body;
    const userId = req.user.userId;

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const reply = {
      userId,
      content,
      isExpertAnswer: isExpertAnswer || false,
      createdAt: new Date(),
    };

    post.replies.push(reply);
    await post.save();
    await post.populate("replies.userId", "name email profile");

    res.json({ message: "Reply added", post });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding reply", error: error.message });
  }
};

// Like post
const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({ message: "Post liked", likes: post.likes.length });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error liking post", error: error.message });
  }
};

module.exports = {
  registerUser,
  createPost,
  getAllPosts,
  getPostDetails,
  addReply,
  likePost,
};
