import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useLanguage } from "../contexts/LanguageContext";
import {
  FaTemperatureHigh,
  FaTint,
  FaWind,
  FaSeedling,
  FaMapMarkedAlt,
  FaChartPie,
} from "react-icons/fa";

const Weather = () => {
  const { t } = useLanguage();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("");
  const [crop, setCrop] = useState("");
  const [loading, setLoading] = useState(false);
  const [cropInsights, setCropInsights] = useState(null);

  // ---------------- FETCH CURRENT WEATHER ----------------
  const getWeather = async () => {
    if (!city || !crop) {
      toast.error(t("Please enter both area and crop name"));
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("/api/weather/current", {
        params: { city },
        headers: { Authorization: `Bearer ${token}` },
      });

      setWeather(response.data);
      analyzeCropSuitability(response.data);
      toast.success(t("Weather & crop analysis completed"));
    } catch (error) {
      toast.error(t("Error fetching weather data"));
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FETCH FORECAST ----------------
  const getForecast = async () => {
    if (!city) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("/api/weather/forecast", {
        params: { city, days: 5 },
        headers: { Authorization: `Bearer ${token}` },
      });

      setForecast(response.data.forecast);
    } catch (error) {
      toast.error(t("Error fetching forecast data"));
    }
  };

  // ---------------- CROP → STATE → DISTRICT DATABASE ----------------
  const cropDistrictMap = {
    wheat: {
      Karnataka: [
        "Dharwad",
        "Belagavi",
        "Vijayapura",
        "Bagalkot",
        "Haveri",
        "Gadag",
      ],
      "Tamil Nadu": [
        "Salem",
        "Erode",
        "Coimbatore",
        "Namakkal",
        "Dharmapuri",
        "Karur",
      ],
      "Andhra Pradesh": [
        "Kurnool",
        "Anantapur",
        "Kadapa",
        "Prakasam",
        "Chittoor",
        "Guntur",
      ],
    },

    rice: {
      Karnataka: [
        "Mandya",
        "Mysuru",
        "Raichur",
        "Ballari",
        "Shivamogga",
        "Udupi",
      ],
      "Tamil Nadu": [
        "Thanjavur",
        "Nagapattinam",
        "Tiruvarur",
        "Cuddalore",
        "Villupuram",
        "Kanchipuram",
      ],
      "Andhra Pradesh": [
        "East Godavari",
        "West Godavari",
        "Krishna",
        "Guntur",
        "Srikakulam",
        "Vizianagaram",
      ],
    },

    maize: {
      Karnataka: [
        "Davangere",
        "Chitradurga",
        "Tumakuru",
        "Hassan",
        "Chikkaballapur",
        "Kolar",
      ],
      "Tamil Nadu": [
        "Perambalur",
        "Ariyalur",
        "Salem",
        "Dharmapuri",
        "Krishnagiri",
        "Tiruvannamalai",
      ],
      "Andhra Pradesh": [
        "Nellore",
        "Anantapur",
        "Kurnool",
        "Kadapa",
        "Chittoor",
        "Prakasam",
      ],
    },
  };

  // ---------------- WEATHER + CROP ANALYSIS ----------------
  const analyzeCropSuitability = (weatherData) => {
    const { temperature, humidity } = weatherData;
    const cropKey = crop.trim().toLowerCase();

    let suitability = 0;

    if (temperature >= 18 && temperature <= 28 && humidity >= 45) {
      suitability = 85;
    } else if (temperature >= 15 && temperature < 18) {
      suitability = 65;
    } else {
      suitability = 45;
    }

    const regions = cropDistrictMap[cropKey] || {
      Karnataka: [t("No data available")],
      "Tamil Nadu": [t("No data available")],
      "Andhra Pradesh": [t("No data available")],
    };

    setCropInsights({
      cropName: crop,
      area: city,
      suitability,
      regions,
    });
  };

  return (
    <div className="glass-card rounded-card shadow-glow-gradient p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gradient mb-4">
        {t("Smart Agro Weather & Crop Advisor")}
      </h2>

      {/* INPUT FIELDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t("Enter area / city")}
          className="px-4 py-2 glass-input rounded-button outline-none"
        />

        <input
          type="text"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          placeholder={t("Enter crop name (Wheat / Rice / Maize)")}
          className="px-4 py-2 glass-input rounded-button outline-none"
        />

        <button
          onClick={() => {
            getWeather();
            getForecast();
          }}
          disabled={loading}
          className="bg-gradient-primary text-white px-6 py-2 rounded-button disabled:opacity-50"
        >
          {loading ? t("Analyzing...") : t("Analyze Crop")}
        </button>
      </div>

      {/* WEATHER DISPLAY */}
      {weather && (
        <div className="glass-card rounded-card p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {t("Weather in")} {weather.city}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <WeatherBox
              title={t("Temperature")}
              value={`${weather.temperature}°C`}
              icon={<FaTemperatureHigh />}
              t={t}
            />
            <WeatherBox
              title={t("Humidity")}
              value={`${weather.humidity}%`}
              icon={<FaTint />}
              t={t}
            />
            <WeatherBox
              title={t("Wind Speed")}
              value={`${weather.windSpeed} m/s`}
              icon={<FaWind />}
              t={t}
            />
            <WeatherBox
              title={t("Conditions")}
              value={t(weather.description)}
              t={t}
            />
          </div>
        </div>
      )}

      {/* CROP INSIGHTS */}
      {cropInsights &&
        Object.entries(cropInsights.regions || {}).map(([state, districts]) => (
          <div
            key={state}
            className="glass-card rounded-card p-6 mb-4 border border-green-400"
          >
            <h4 className="text-lg font-semibold text-white mb-2">
              {t(state)}
            </h4>

            <div className="flex flex-wrap gap-2">
              {districts.map((district, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm"
                >
                  {index + 1}. {district}
                </span>
              ))}
            </div>
          </div>
        ))}

      {/* FORECAST */}
      {forecast.length > 0 && (
        <div className="glass-card rounded-card p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">
            {t("5-Day Weather Forecast")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <div
                key={index}
                className="glass-card p-4 rounded-card text-center"
              >
                <p className="text-sm text-gray-400">
                  {new Date(day.date).toLocaleDateString()}
                </p>
                <p className="text-xl font-bold text-purple-400 my-2">
                  {day.temperature}°C
                </p>
                <p className="text-sm capitalize text-white">
                  {t(day.description)}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {t("Humidity")}: {day.humidity}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------- WEATHER INFO BOX ----------------
const WeatherBox = ({ title, value, icon }) => (
  <div className="glass-card p-4 rounded-card">
    <div className="flex items-center justify-between text-white">
      <span className="font-medium">{title}</span>
      <span className="text-purple-400 text-xl">{icon}</span>
    </div>
    <p className="text-2xl font-bold text-purple-400 mt-2">{value}</p>
  </div>
);

export default Weather;
