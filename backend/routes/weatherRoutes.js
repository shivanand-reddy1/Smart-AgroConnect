const express = require("express");
const {
  getWeather,
  getWeatherForecast,
  getWeatherAlerts,
} = require("../controllers/weatherController");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/current", auth, getWeather);
router.get("/forecast", auth, getWeatherForecast);
router.get("/alerts", auth, getWeatherAlerts);

module.exports = router;
