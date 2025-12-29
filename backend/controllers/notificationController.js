const Notification = require("../models/Notification");
const GovernmentScheme = require("../models/GovernmentScheme");
const nodemailer = require("nodemailer");

const getMailer = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

// create notification and optionally email
const createAndDispatchNotification = async ({
  userId,
  type,
  title,
  message,
  channel = "in-app",
  priority = "medium",
  severity = "medium",
  relatedData = {},
  tags = [],
  email,
}) => {
  const notification = new Notification({
    userId,
    type,
    title,
    message,
    channel,
    priority,
    severity,
    relatedData,
    tags,
  });

  await notification.save();

  if (channel === "email") {
    const transporter = getMailer();
    const fromAddress =
      process.env.SMTP_FROM || `AgroConnect Alerts <${process.env.SMTP_USER}>`;

    await transporter.sendMail({
      from: fromAddress,
      to: email || process.env.ALERT_FALLBACK_EMAIL || undefined,
      bcc: process.env.ALERT_BCC || undefined,
      subject: title,
      html: `<p>${message}</p>`,
    });
  }

  return notification;
};

// Send notification
const sendNotification = async (req, res) => {
  try {
    const notification = await createAndDispatchNotification({
      userId: req.body.userId,
      type: req.body.type,
      title: req.body.title,
      message: req.body.message,
      channel: req.body.channel || "in-app",
      priority: req.body.priority || "medium",
      severity: req.body.severity || "medium",
      relatedData: req.body.relatedData || {},
      tags: req.body.tags || [],
    });

    res.status(201).json({ message: "Notification sent", notification });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending notification", error: error.message });
  }
};

// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, skip = 0 } = req.query;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    res.json({
      total: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: error.message });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    res.json(notification);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking notification", error: error.message });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    await Notification.findByIdAndDelete(notificationId);

    res.json({ message: "Notification deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting notification", error: error.message });
  }
};

// Schedule fertilizer alerts
const scheduleFertilizerAlert = async (req, res) => {
  try {
    const { userId, cropName, stage, date } = req.body;

    const notification = await createAndDispatchNotification({
      userId,
      type: "fertilizer",
      title: `Fertilizer Alert for ${cropName}`,
      message: `Time to apply fertilizer for ${cropName} at ${stage} stage`,
      priority: "high",
      severity: "high",
      relatedData: { crop: cropName, stage, date },
    });

    res.status(201).json({
      message: "Fertilizer alert scheduled",
      notification,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error scheduling alert", error: error.message });
  }
};

// Weather alert (extreme conditions)
const sendWeatherAlert = async (req, res) => {
  try {
    const {
      userId,
      city,
      alertType,
      severity = "high",
      recommendation,
    } = req.body;

    const title = `Weather Alert: ${alertType || "Extreme Condition"}`;
    const message = `${alertType || "Alert"} expected in ${city}. ${
      recommendation || "Please take necessary precautions."
    }`;

    const notification = await createAndDispatchNotification({
      userId,
      type: "weather",
      title,
      message,
      priority: severity === "high" ? "high" : "medium",
      severity,
      relatedData: { city, alertType },
      tags: ["weather", city].filter(Boolean),
      channel: req.body.channel || "in-app",
    });

    res.status(201).json({ message: "Weather alert sent", notification });
  } catch (error) {
    res.status(500).json({
      message: "Error sending weather alert",
      error: error.message,
    });
  }
};

// Government scheme deadline reminders
const sendSchemeDeadlineAlerts = async (req, res) => {
  try {
    const { userIds = [], daysAhead = 7, channel = "in-app" } = req.body;

    const upcoming = await GovernmentScheme.find({
      isActive: true,
      applicationDeadline: {
        $gte: new Date(),
        $lte: new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000),
      },
    }).select("name applicationDeadline category");

    const results = [];
    for (const userId of userIds) {
      for (const scheme of upcoming) {
        const daysLeft = Math.ceil(
          (scheme.applicationDeadline - new Date()) / (1000 * 60 * 60 * 24)
        );
        const notification = await createAndDispatchNotification({
          userId,
          type: "scheme_deadline",
          title: `Scheme Deadline: ${scheme.name}`,
          message: `${scheme.name} closes in ${daysLeft} days. Category: ${scheme.category}`,
          priority: daysLeft <= 3 ? "high" : "medium",
          severity: daysLeft <= 3 ? "high" : "medium",
          relatedData: {
            schemeId: scheme._id,
            deadline: scheme.applicationDeadline,
            category: scheme.category,
          },
          tags: ["scheme", scheme.category].filter(Boolean),
          channel,
        });
        results.push(notification);
      }
    }

    res.status(201).json({
      message: "Scheme deadline alerts sent",
      count: results.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error sending scheme deadline alerts",
      error: error.message,
    });
  }
};

// Market price/trend alerts
const sendMarketPriceAlert = async (req, res) => {
  try {
    const {
      userId,
      crop,
      city,
      trend,
      priceChange,
      channel = "in-app",
    } = req.body;

    const title = `Market Alert: ${crop || "Crop"} prices ${trend || "move"}`;
    const message = `${crop || "Crop"} in ${city || "your city"} is ${
      trend || "changing"
    } (${priceChange || "latest trend"}).`;

    const notification = await createAndDispatchNotification({
      userId,
      type: "market_price",
      title,
      message,
      priority: "medium",
      severity: trend === "up" || trend === "down" ? "medium" : "low",
      relatedData: { crop, city, trend, priceChange },
      tags: ["market", crop, city].filter(Boolean),
      channel,
    });

    res.status(201).json({ message: "Market alert sent", notification });
  } catch (error) {
    res.status(500).json({
      message: "Error sending market alert",
      error: error.message,
    });
  }
};

// Buyer request alerts
const sendBuyerRequestAlert = async (req, res) => {
  try {
    const { userId, crop, buyerName, quantity, channel = "in-app" } = req.body;

    const notification = await createAndDispatchNotification({
      userId,
      type: "buyer_request",
      title: `Buyer Request for ${crop}`,
      message: `${buyerName || "A buyer"} requested ${
        quantity || "produce"
      } of ${crop}.`,
      priority: "medium",
      relatedData: { crop, buyerName, quantity },
      tags: ["buyer", crop].filter(Boolean),
      channel,
    });

    res.status(201).json({ message: "Buyer request alert sent", notification });
  } catch (error) {
    res.status(500).json({
      message: "Error sending buyer request alert",
      error: error.message,
    });
  }
};

module.exports = {
  sendNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
  scheduleFertilizerAlert,
  sendWeatherAlert,
  sendSchemeDeadlineAlerts,
  sendMarketPriceAlert,
  sendBuyerRequestAlert,
};
