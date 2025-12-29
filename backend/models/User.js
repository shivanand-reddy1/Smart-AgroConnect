const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["farmer", "buyer", "expert", "admin"],
      required: true,
    },
    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      district: { type: String, trim: true },
      latitude: Number,
      longitude: Number,
    },
    profile: {
      farmSize: String,
      cropTypes: [String],
      experience: String,
      certifications: [String],
      profileImage: String,
      bio: String,
    },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      accountHolder: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
