const express = require("express");
const {
  getMyProfile,
  updateMyProfile,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  verifyUser,
} = require("../controllers/userController");
const { auth, roleBasedAccess } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", auth, getMyProfile);
router.put("/me", auth, updateMyProfile);
router.get("/:userId", auth, getUserProfile);
router.put("/:userId", auth, updateUserProfile);
router.get("/", auth, roleBasedAccess(["admin"]), getAllUsers);
router.put("/:userId/verify", auth, roleBasedAccess(["admin"]), verifyUser);

module.exports = router;
