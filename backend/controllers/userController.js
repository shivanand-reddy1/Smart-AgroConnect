const User = require("../models/User");

// Get current user's profile (using JWT)
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

// Update current user's profile (restricted fields)
const updateMyProfile = async (req, res) => {
  try {
    const allowed = ["name", "phone", "location"];
    const updates = {};

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

// Get user profile by id (admin/self)
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.userId !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, location, profile, bankDetails } = req.body;

    if (req.user.userId !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        phone,
        location,
        profile,
        bankDetails,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

// Get all users (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { role, verified } = req.query;

    let query = {};
    if (role) query.role = role;
    if (verified !== undefined) query.isVerified = verified === "true";

    const users = await User.find(query).select("-password");

    res.json({
      total: users.length,
      users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// Verify user (Admin)
const verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    ).select("-password");

    res.json({ message: "User verified", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying user", error: error.message });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  verifyUser,
};
