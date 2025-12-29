const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT Token
const generateToken = (userId, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || "1h"; // shorter-lived tokens so restarts require re-login

  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, location } = req.body;

    // Input validation
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Normalize inputs
    const normalizedEmail = email.toLowerCase();
    const normalizedPhone = String(phone).replace(/\D/g, "");

    // Check if user already exists by email or phone
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone: normalizedPhone }],
    });
    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        return res.status(409).json({
          success: false,
          message: "Email already registered. Please login instead.",
        });
      }
      if (existingUser.phone === normalizedPhone) {
        return res.status(409).json({
          success: false,
          message: "Phone number already registered. Please login instead.",
        });
      }
      // Fallback
      return res.status(409).json({
        success: false,
        message: "User already registered. Please login instead.",
      });
    }

    // Create new user
    const user = new User({
      name,
      email: normalizedEmail,
      phone: normalizedPhone,
      password, // Will be hashed by pre-save hook
      role,
      location: location || {},
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "Registration successful! Welcome to Smart AgroConnect.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);

    // Handle MongoDB duplicate key error (robust)
    if (error.code === 11000) {
      const dupField =
        (error.keyPattern && Object.keys(error.keyPattern)[0]) ||
        Object.keys(error.keyValue || {})[0];
      let message = "Duplicate key error";
      if (dupField === "email") message = "Email already registered. Please login instead.";
      else if (dupField === "phone") message = "Phone number already registered. Please login instead.";
      else message = `Duplicate value for field: ${dupField || "unknown"}`;

      return res.status(409).json({
        success: false,
        message,
        field: dupField,
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(". "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please check your email or register.",
      });
    }

    // Compare passwords
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password. Please try again.",
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful! Welcome back.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("❌ Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { register, login, getMe, generateToken };
