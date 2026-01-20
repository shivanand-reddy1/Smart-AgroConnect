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
  const [loading, setLoading] = useState(false);
  const [topCrops, setTopCrops] = useState([]);

  // ---------------- FETCH CURRENT WEATHER ----------------
  const getWeather = async () => {
    if (!city) {
      toast.error(t("Please enter city/area"));
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
      recommendTopCrops(response.data);
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

  // ---------------- COMPREHENSIVE CITY TO CROPS DATABASE ----------------
  const cityToCropsMap = {
    // Karnataka Cities
    bidar: ["pulses", "soybean", "cotton", "maize", "wheat"],
    bangalore: ["vegetables", "maize", "pulses", "flowers", "fruits"],
    bengaluru: ["vegetables", "maize", "pulses", "flowers", "fruits"],
    mysore: ["rice", "sugarcane", "maize", "vegetables", "fruits"],
    mysuru: ["rice", "sugarcane", "maize", "vegetables", "fruits"],
    hubli: ["cotton", "maize", "pulses", "wheat", "soybean"],
    mangalore: ["rice", "coconut", "areca nut", "vegetables", "cashew"],
    belgaum: ["sugarcane", "wheat", "cotton", "maize", "pulses"],
    belagavi: ["sugarcane", "wheat", "cotton", "maize", "pulses"],
    davangere: ["cotton", "maize", "sugarcane", "pulses", "wheat"],
    bellary: ["cotton", "maize", "rice", "pulses", "wheat"],
    ballari: ["cotton", "maize", "rice", "pulses", "wheat"],
    gulbarga: ["pulses", "cotton", "soybean", "wheat", "maize"],
    kalaburagi: ["pulses", "cotton", "soybean", "wheat", "maize"],
    raichur: ["cotton", "rice", "pulses", "maize", "wheat"],
    shimoga: ["rice", "sugarcane", "areca nut", "coffee", "maize"],
    shivamogga: ["rice", "sugarcane", "areca nut", "coffee", "maize"],
    tumkur: ["maize", "pulses", "coconut", "vegetables", "cotton"],
    tumakuru: ["maize", "pulses", "coconut", "vegetables", "cotton"],
    vijayapura: ["cotton", "wheat", "pulses", "maize", "soybean"],
    bagalkot: ["cotton", "wheat", "pulses", "maize", "soybean"],
    yadgir: ["cotton", "pulses", "soybean", "maize", "wheat"],
    mandya: ["rice", "sugarcane", "maize", "pulses", "vegetables"],
    hassan: ["maize", "coffee", "vegetables", "pulses", "coconut"],
    dharwad: ["wheat", "cotton", "maize", "pulses", "vegetables"],
    chitradurga: ["maize", "cotton", "pulses", "vegetables", "wheat"],
    kolar: ["maize", "vegetables", "pulses", "tomato", "flowers"],
    gadag: ["cotton", "wheat", "maize", "pulses", "soybean"],
    haveri: ["cotton", "wheat", "maize", "pulses", "vegetables"],
    udupi: ["rice", "coconut", "areca nut", "cashew", "vegetables"],
    chikkaballapur: ["maize", "vegetables", "pulses", "fruits", "tomato"],

    // Tamil Nadu Cities
    chennai: ["vegetables", "flowers", "fruits", "pulses", "maize"],
    coimbatore: ["cotton", "sugarcane", "maize", "vegetables", "turmeric"],
    madurai: ["cotton", "maize", "pulses", "vegetables", "flowers"],
    tiruchirappalli: ["rice", "cotton", "maize", "pulses", "vegetables"],
    trichy: ["rice", "cotton", "maize", "pulses", "vegetables"],
    salem: ["maize", "cotton", "sugarcane", "wheat", "turmeric"],
    tirunelveli: ["rice", "cotton", "maize", "pulses", "vegetables"],
    erode: ["turmeric", "cotton", "sugarcane", "maize", "vegetables"],
    vellore: ["rice", "maize", "pulses", "vegetables", "groundnut"],
    thanjavur: ["rice", "sugarcane", "pulses", "cotton", "maize"],
    dindigul: ["cotton", "maize", "vegetables", "fruits", "flowers"],
    tiruppur: ["cotton", "turmeric", "maize", "vegetables", "pulses"],
    kanchipuram: ["rice", "vegetables", "pulses", "maize", "groundnut"],
    nagapattinam: ["rice", "pulses", "cotton", "maize", "vegetables"],
    cuddalore: ["rice", "sugarcane", "cashew", "casuarina", "pulses"],
    tiruvarur: ["rice", "pulses", "maize", "vegetables", "cotton"],
    krishnagiri: ["maize", "vegetables", "mango", "pulses", "cotton"],
    dharmapuri: ["maize", "wheat", "pulses", "vegetables", "mango"],
    namakkal: ["maize", "cotton", "sugarcane", "vegetables", "pulses"],
    karur: ["cotton", "maize", "pulses", "vegetables", "banana"],
    perambalur: ["maize", "pulses", "cotton", "vegetables", "rice"],
    ariyalur: ["maize", "pulses", "cotton", "vegetables", "rice"],
    villupuram: ["rice", "sugarcane", "pulses", "groundnut", "maize"],
    tiruvannamalai: ["maize", "groundnut", "sugarcane", "pulses", "vegetables"],

    // Andhra Pradesh Cities
    visakhapatnam: ["rice", "pulses", "cashew", "vegetables", "maize"],
    vijayawada: ["rice", "cotton", "maize", "pulses", "vegetables"],
    guntur: ["cotton", "rice", "chili", "tobacco", "turmeric"],
    nellore: ["rice", "maize", "pulses", "aquaculture", "vegetables"],
    kurnool: ["cotton", "wheat", "maize", "pulses", "rice"],
    kakinada: ["rice", "coconut", "pulses", "sugarcane", "maize"],
    rajahmundry: ["rice", "coconut", "pulses", "sugarcane", "maize"],
    tirupati: ["rice", "maize", "pulses", "vegetables", "groundnut"],
    anantapur: ["groundnut", "cotton", "maize", "pulses", "wheat"],
    kadapa: ["maize", "cotton", "pulses", "rice", "wheat"],
    vizianagaram: ["rice", "pulses", "cashew", "maize", "vegetables"],
    srikakulam: ["rice", "pulses", "cashew", "maize", "vegetables"],
    krishna: ["rice", "cotton", "maize", "pulses", "tobacco"],
    prakasam: ["cotton", "maize", "rice", "pulses", "tobacco"],
    chittoor: ["groundnut", "maize", "rice", "pulses", "sugarcane"],
    "east godavari": ["rice", "coconut", "sugarcane", "maize", "pulses"],
    "west godavari": ["rice", "coconut", "sugarcane", "maize", "pulses"],

    // Maharashtra Cities
    mumbai: ["vegetables", "flowers", "fruits", "pulses", "rice"],
    pune: ["sugarcane", "vegetables", "wheat", "maize", "pulses"],
    nagpur: ["cotton", "soybean", "wheat", "pulses", "vegetables"],
    nashik: ["grapes", "vegetables", "wheat", "maize", "pulses"],
    aurangabad: ["cotton", "soybean", "wheat", "maize", "pulses"],
    solapur: ["cotton", "sugarcane", "wheat", "pulses", "maize"],
    kolhapur: ["sugarcane", "maize", "wheat", "vegetables", "pulses"],

    // Other Major Cities
    delhi: ["wheat", "vegetables", "fruits", "rice", "pulses"],
    hyderabad: ["rice", "maize", "cotton", "pulses", "vegetables"],
    ahmedabad: ["cotton", "wheat", "tobacco", "vegetables", "pulses"],
    jaipur: ["wheat", "maize", "pulses", "bajra", "vegetables"],
    lucknow: ["wheat", "rice", "sugarcane", "vegetables", "pulses"],
    kanpur: ["wheat", "rice", "maize", "vegetables", "pulses"],
    indore: ["wheat", "soybean", "cotton", "maize", "pulses"],
    bhopal: ["wheat", "soybean", "maize", "pulses", "vegetables"],
    patna: ["rice", "wheat", "maize", "pulses", "vegetables"],
    kolkata: ["rice", "vegetables", "jute", "pulses", "maize"],
    surat: ["cotton", "sugarcane", "vegetables", "maize", "pulses"],
    ranchi: ["rice", "maize", "pulses", "vegetables", "oilseeds"],
  };

  // Crop display information
  const cropInfo = {
    rice: { fullName: "Rice", icon: "🌾" },
    wheat: { fullName: "Wheat", icon: "🌾" },
    cotton: { fullName: "Cotton", icon: "🌿" },
    maize: { fullName: "Maize", icon: "🌽" },
    sugarcane: { fullName: "Sugarcane", icon: "🎋" },
    pulses: { fullName: "Pulses (Tur/Gram)", icon: "🫘" },
    soybean: { fullName: "Soybean", icon: "🫘" },
    vegetables: { fullName: "Vegetables", icon: "🥬" },
    fruits: { fullName: "Fruits", icon: "🍎" },
    groundnut: { fullName: "Groundnut", icon: "🥜" },
    coconut: { fullName: "Coconut", icon: "🥥" },
    turmeric: { fullName: "Turmeric", icon: "🌱" },
    chili: { fullName: "Chili", icon: "🌶️" },
    coffee: { fullName: "Coffee", icon: "☕" },
    tobacco: { fullName: "Tobacco", icon: "🌿" },
    flowers: { fullName: "Flowers", icon: "🌺" },
    "areca nut": { fullName: "Areca Nut", icon: "🌴" },
    cashew: { fullName: "Cashew", icon: "🌰" },
    grapes: { fullName: "Grapes", icon: "🍇" },
    tomato: { fullName: "Tomato", icon: "🍅" },
    banana: { fullName: "Banana", icon: "🍌" },
    mango: { fullName: "Mango", icon: "🥭" },
    jute: { fullName: "Jute", icon: "🌿" },
    oilseeds: { fullName: "Oilseeds", icon: "🌻" },
    bajra: { fullName: "Bajra (Pearl Millet)", icon: "🌾" },
    aquaculture: { fullName: "Aquaculture/Fishery", icon: "🐟" },
    casuarina: { fullName: "Casuarina", icon: "🌲" },
  };

  // ---------------- RECOMMEND TOP 5 CROPS BASED ON LOCATION & WEATHER ----------------
  const recommendTopCrops = (weatherData) => {
    const { temperature, humidity } = weatherData;
    const cityName = city.toLowerCase().trim();

    // Get crops for this specific city
    const cityCrops = cityToCropsMap[cityName];

    if (cityCrops && cityCrops.length > 0) {
      // City found in database - show crops specific to this city
      const recommendedCrops = cityCrops.slice(0, 5).map((cropKey, index) => {
        const crop = cropInfo[cropKey] || { fullName: cropKey, icon: "🌱" };

        // Calculate suitability based on position (first crops are more suitable)
        const baseSuitability = 95 - index * 3;

        // Get weather-appropriate reason
        let reason = `Major crop in ${city} - Highly recommended for your area`;
        if (index === 0) {
          reason = `#1 recommended crop for ${city} - Excellent choice`;
        } else if (index === 1) {
          reason = `Very popular in ${city} - Proven success`;
        }

        return {
          name: crop.fullName,
          icon: crop.icon,
          suitability: baseSuitability,
          reason: reason,
          isLocalCrop: true,
        };
      });

      setTopCrops(recommendedCrops);
    } else {
      // City not in database - provide general recommendations based on weather
      const crops = [];

      // Rice - Best for warm, humid conditions
      if (temperature >= 20 && temperature <= 35 && humidity >= 60) {
        crops.push({
          name: "Rice",
          icon: "🌾",
          suitability: 85,
          reason: "Good weather conditions for rice cultivation",
          isLocalCrop: false,
        });
      }

      // Wheat - Best for cooler conditions
      if (temperature >= 10 && temperature <= 25 && humidity >= 40) {
        crops.push({
          name: "Wheat",
          icon: "🌾",
          suitability: 80,
          reason: "Suitable temperature range for wheat growth",
          isLocalCrop: false,
        });
      }

      // Maize - Versatile, moderate conditions
      if (temperature >= 18 && temperature <= 32 && humidity >= 45) {
        crops.push({
          name: "Maize",
          icon: "🌽",
          suitability: 82,
          reason: "Good conditions for maize cultivation",
          isLocalCrop: false,
        });
      }

      // Cotton - Warm, moderate humidity
      if (
        temperature >= 21 &&
        temperature <= 35 &&
        humidity >= 30 &&
        humidity <= 70
      ) {
        crops.push({
          name: "Cotton",
          icon: "🌿",
          suitability: 78,
          reason: "Suitable warm climate for cotton",
          isLocalCrop: false,
        });
      }

      // Vegetables - General
      crops.push({
        name: "Vegetables",
        icon: "🥬",
        suitability: 75,
        reason:
          "General recommendation - Consult local agricultural department",
        isLocalCrop: false,
      });

      // Sort by suitability and take top 5
      crops.sort((a, b) => b.suitability - a.suitability);
      setTopCrops(crops.slice(0, 5));
    }
  };

  return (
    <div className="glass-card rounded-card shadow-glow-gradient p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gradient mb-4">
        {t("Smart Agro Weather & Crop Advisor")}
      </h2>

      {/* INPUT FIELDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t("Enter area / city")}
          className="px-4 py-2 glass-input rounded-button outline-none"
        />

        <button
          onClick={() => {
            getWeather();
            getForecast();
          }}
          disabled={loading}
          className="bg-gradient-primary text-white px-6 py-2 rounded-button disabled:opacity-50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
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

      {/* TOP 5 RECOMMENDED CROPS */}
      {topCrops.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gradient mb-4 flex items-center gap-2">
            <FaSeedling />
            {t("Top 5 Recommended Crops for")} {city}
          </h3>

          <div className="space-y-4">
            {topCrops.map((crop, index) => (
              <div
                key={index}
                className="glass-card rounded-card p-5 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:transform hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-gradient">
                      #{index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{crop.icon || "🌱"}</span>
                      <div>
                        <h4 className="text-lg font-bold text-white">
                          {t(crop.name)}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {t(crop.reason)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-primary px-3 py-1 rounded-full">
                    <FaChartPie className="text-white" />
                    <span className="text-white font-bold">
                      {crop.suitability}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
