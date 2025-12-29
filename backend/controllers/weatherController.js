const axios = require("axios");

// Get weather data from OpenWeatherMap API
const getWeather = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const apiKey =
      process.env.OPENWEATHERMAP_API_KEY || "demo_api_key_replace_with_actual";
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const weatherData = {
      city: response.data.name,
      temperature: response.data.main.temp,
      feelsLike: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      windSpeed: response.data.wind.speed,
      description: response.data.weather[0].description,
      cloudiness: response.data.clouds.all,
      sunrise: new Date(response.data.sys.sunrise * 1000),
      sunset: new Date(response.data.sys.sunset * 1000),
    };

    res.json(weatherData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching weather data", error: error.message });
  }
};

// Get weather forecast
const getWeatherForecast = async (req, res) => {
  try {
    const { city, days = 5 } = req.query;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const apiKey =
      process.env.OPENWEATHERMAP_API_KEY || "demo_api_key_replace_with_actual";
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    const forecastData = response.data.list.slice(0, days * 8).map((item) => ({
      date: new Date(item.dt * 1000),
      temperature: item.main.temp,
      humidity: item.main.humidity,
      description: item.weather[0].description,
      windSpeed: item.wind.speed,
      rainfall: item.rain ? item.rain["3h"] : 0,
    }));

    res.json({
      city: response.data.city.name,
      forecast: forecastData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching forecast", error: error.message });
  }
};

// Get weather alerts
const getWeatherAlerts = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    // Mock weather alerts data
    const alerts = [
      {
        type: "Heavy Rainfall",
        severity: "high",
        description: "Heavy rainfall expected for next 48 hours",
        recommendation: "Delay irrigation and protect crops",
      },
      {
        type: "Temperature Drop",
        severity: "medium",
        description: "Cold wave expected",
        recommendation: "Protect sensitive crops with mulching",
      },
    ];

    res.json(alerts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching alerts", error: error.message });
  }
};

module.exports = { getWeather, getWeatherForecast, getWeatherAlerts };
