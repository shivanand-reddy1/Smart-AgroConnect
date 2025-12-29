const express = require("express");
const {
  sendNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
  scheduleFertilizerAlert,
  sendWeatherAlert,
  sendSchemeDeadlineAlerts,
  sendMarketPriceAlert,
  sendBuyerRequestAlert,
} = require("../controllers/notificationController");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, sendNotification);
router.get("/user/:userId", auth, getUserNotifications);
router.put("/:notificationId/read", auth, markAsRead);
router.delete("/:notificationId", auth, deleteNotification);
router.post("/fertilizer/schedule", auth, scheduleFertilizerAlert);
router.post("/weather/alert", auth, sendWeatherAlert);
router.post("/schemes/deadlines", auth, sendSchemeDeadlineAlerts);
router.post("/market/alert", auth, sendMarketPriceAlert);
router.post("/buyer/alert", auth, sendBuyerRequestAlert);

module.exports = router;
