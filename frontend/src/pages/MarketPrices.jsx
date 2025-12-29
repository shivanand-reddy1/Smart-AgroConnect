import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaRupeeSign,
  FaArrowUp,
  FaArrowDown,
  FaChartBar,
  FaInfoCircle,
} from "react-icons/fa";
import { useLanguage } from "../contexts/LanguageContext";

const MarketPrices = () => {
  const { t } = useLanguage();
  const [prices, setPrices] = useState(null);
  const [trends, setTrends] = useState([]);
  const [bestCrop, setBestCrop] = useState(null);
  const [cropName, setCropName] = useState("Rice");
  const [city, setCity] = useState("Bangalore");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const getMarketPrices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/market-prices", {
        params: { crop: cropName, city },
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrices(response.data);
      setLastUpdated(new Date());
      toast.success(t("Market prices loaded"));
    } catch (error) {
      toast.error(t("Error fetching prices"));
    } finally {
      setLoading(false);
    }
  };

  const getPriceTrends = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/market-prices/trends", {
        params: { crop: cropName, days: 30 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrends(response.data.trends);
    } catch (error) {
      toast.error(t("Error fetching trends"));
    }
  };

  const getBestCropToSell = async () => {
    try {
      const token = localStorage.getItem("token");
      // Pass the selected crop to show best price for that specific crop
      const response = await axios.get("/api/market-prices/best-crop", {
        params: { city, crop: cropName },
        headers: { Authorization: `Bearer ${token}` },
      });
      setBestCrop(response.data);
    } catch (error) {
      toast.error(t("Error fetching best crop"));
    }
  };

  useEffect(() => {
    getMarketPrices();
    getPriceTrends();
    getBestCropToSell();
  }, []);

  // Helper function to calculate trend based on moving averages
  const calculateTrendStatus = (
    currentPrice,
    yesterdayPrice,
    avg7Day,
    avg30Day
  ) => {
    if (!yesterdayPrice) {
      return {
        status: "NOT_ENOUGH_DATA",
        display: "Not enough data",
        icon: null,
      };
    }

    // Compare today vs yesterday
    const vs_yesterday = currentPrice - yesterdayPrice;
    const percent_change = ((vs_yesterday / yesterdayPrice) * 100).toFixed(2);

    if (vs_yesterday > 0) {
      return {
        status: "UP",
        display: `UP ${percent_change}%`,
        icon: "up",
        comparison: `Today vs Yesterday: ₹${yesterdayPrice} → ₹${currentPrice}`,
      };
    } else if (vs_yesterday < 0) {
      return {
        status: "DOWN",
        display: `DOWN ${percent_change}%`,
        icon: "down",
        comparison: `Today vs Yesterday: ₹${yesterdayPrice} → ₹${currentPrice}`,
      };
    } else {
      return {
        status: "STABLE",
        display: "STABLE",
        icon: null,
        comparison: `Today vs Yesterday: Both at ₹${currentPrice}`,
      };
    }
  };

  // Helper function to format date/time
  const formatDateTime = (date) => {
    if (!date) return t("Just now");
    const d = new Date(date);
    return (
      d.toLocaleDateString() +
      " " +
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="glass-card rounded-card shadow-glow-gradient p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gradient mb-6 flex items-center gap-2">
        <FaRupeeSign /> {t("Real-time Market Prices")}
      </h2>

      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="text"
          value={cropName}
          onChange={(e) => setCropName(e.target.value)}
          placeholder={t("Enter crop name")}
          className="flex-1 min-w-48 px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t("Enter city")}
          className="flex-1 min-w-48 px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
        />
        <button
          onClick={() => {
            getMarketPrices();
            getPriceTrends();
            getBestCropToSell();
          }}
          disabled={loading}
          className="bg-gradient-primary text-white px-6 py-2 rounded-button hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-purple transition-all duration-250 font-medium"
        >
          {loading ? t("Loading...") : t("Search")}
        </button>
      </div>

      {/* Best Crop to Sell Section - Now for selected crop */}
      {bestCrop && (
        <div className="glass-card rounded-card p-6 mb-6 border border-purple-500 border-opacity-30">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gradient">
              {bestCrop.type === "SELECTED_CROP"
                ? `${t("Best Price Trend")} - ${bestCrop.crop}`
                : bestCrop.label}
            </h3>
            <span className="text-xs bg-gradient-primary text-white px-3 py-1 rounded-button font-semibold">
              {bestCrop.type === "SELECTED_CROP"
                ? t("SELECTED CROP")
                : t("OVERALL MARKET")}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-card hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-250 group">
              <p className="text-sm text-gray-400 group-hover:!text-white transition-colors">
                {t("Crop")}
              </p>
              <p className="text-2xl font-bold text-white capitalize">
                {bestCrop.crop}
              </p>
            </div>
            <div className="glass-card p-4 rounded-card hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-250 group">
              <p className="text-sm text-gray-400 group-hover:!text-white transition-colors">
                {t("Today's Price")}
              </p>
              <p className="text-2xl font-bold text-purple-400 group-hover:!text-white transition-colors">
                ₹{bestCrop.todayPrice.toFixed(2)}
              </p>
            </div>
            <div className="glass-card p-4 rounded-card hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-250 group">
              <p className="text-sm text-gray-400 group-hover:!text-white transition-colors">
                {t("Yesterday's Price")}
              </p>
              <p className="text-2xl font-bold text-white">
                ₹{bestCrop.yesterdayPrice.toFixed(2)}
              </p>
            </div>
            <div
              className={`glass-card p-4 rounded-card hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-250 group ${
                bestCrop.profitChange > 0
                  ? "border-2 border-green-500"
                  : bestCrop.profitChange < 0
                  ? "border-2 border-red-500"
                  : "border-2 border-yellow-500"
              }`}
            >
              <p className="text-sm text-gray-400 group-hover:!text-white transition-colors">
                {t("Change")}
              </p>
              <p
                className={`text-2xl font-bold flex items-center gap-1 group-hover:!text-white transition-colors ${
                  bestCrop.profitChange > 0
                    ? "text-green-400"
                    : bestCrop.profitChange < 0
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {bestCrop.profitChange > 0 ? (
                  <FaArrowUp />
                ) : bestCrop.profitChange < 0 ? (
                  <FaArrowDown />
                ) : null}
                {bestCrop.percentChangeFormatted}
              </p>
            </div>
          </div>

          <p className="mt-4 p-3 bg-gradient-primary text-white rounded-card font-semibold">
            💡 {t("Recommendation:")} {bestCrop.recommendation}
          </p>

          <p className="mt-3 p-2 glass-card text-white text-sm rounded-card flex items-center gap-2">
            <FaInfoCircle /> {bestCrop.disclaimer}
          </p>

          <p className="mt-3 text-xs text-text-secondary">
            📍 {t("Based on")} {bestCrop.city} {t("Market | Updated:")}{" "}
            {formatDateTime(bestCrop.updatedAt)}
          </p>
        </div>
      )}

      {/* Current Market Price for Selected Crop */}
      {prices && (
        <div className="glass-card rounded-card p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white">
              {t("Current Market Price")} - {prices.crop.toUpperCase()}
            </h3>
            <span className="text-xs bg-gradient-primary text-white px-2 py-1 rounded-button font-semibold">
              {t("SELECTED CROP")}
            </span>
          </div>

          {/* Data Consistency Check */}
          {prices.dataConsistencyCheck && (
            <p className="mb-4 text-xs text-green-400 font-semibold">
              ✓ Data verified: {t("Minimum Price")} ₹{prices.minPrice} &lt;{" "}
              {t("Average Price")} ₹{prices.avgPrice} &lt; {t("Maximum Price")}{" "}
              ₹{prices.maxPrice}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-card hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-250 group">
              <p className="text-sm text-gray-400 group-hover:!text-white transition-colors">
                {t("Minimum Price")}
              </p>
              <p className="text-2xl font-bold text-red-400 group-hover:!text-white transition-colors">
                ₹{prices.minPrice.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400 mt-1 group-hover:!text-white transition-colors">
                {t("Lowest in market")}
              </p>
            </div>
            <div className="glass-card p-4 rounded-card hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-250 group">
              <p className="text-sm text-gray-400 group-hover:!text-white transition-colors">
                {t("Average Price")}
              </p>
              <p className="text-2xl font-bold text-green-400 group-hover:!text-white transition-colors">
                ₹{prices.avgPrice.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400 mt-1 group-hover:!text-white transition-colors">
                {t("Fair market rate")}
              </p>
            </div>
            <div className="glass-card p-4 rounded-card hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-250 group">
              <p className="text-sm text-gray-400 group-hover:!text-white transition-colors">
                {t("Maximum Price")}
              </p>
              <p className="text-2xl font-bold text-purple-400 group-hover:!text-white transition-colors">
                ₹{prices.maxPrice.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400 mt-1 group-hover:!text-white transition-colors">
                {t("Highest in market")}
              </p>
            </div>
            <div
              className={`glass-card p-4 rounded-card hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-250 group ${
                prices.trend === "up"
                  ? "border-l-4 border-green-500"
                  : prices.trend === "down"
                  ? "border-l-4 border-red-500"
                  : "border-l-4 border-yellow-500"
              }`}
            >
              <p className="text-sm text-gray-400 group-hover:!text-white transition-colors">
                {t("Price Trend")}
              </p>
              <p
                className={`text-lg font-bold flex items-center gap-2 mt-1 group-hover:!text-white transition-colors ${
                  prices.trend === "up"
                    ? "text-green-400"
                    : prices.trend === "down"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {prices.trend === "up" ? (
                  <FaArrowUp />
                ) : prices.trend === "down" ? (
                  <FaArrowDown />
                ) : null}
                {t(prices.trend.toUpperCase())}
              </p>
              <p className="text-xs text-white mt-2">{prices.percentChange}</p>
              <p className="text-xs text-gray-400 mt-1 group-hover:!text-white transition-colors">
                {t("vs Yesterday")}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-sm text-white">
              📊 <strong>{t("Unit:")}</strong> {prices.unit} |{" "}
              <strong>{t("Volume:")}</strong> {prices.volume}q
            </p>
            <p className="text-sm text-white">
              📍 <strong>{t("Market:")}</strong> {prices.market.name},{" "}
              {prices.market.city}, {prices.market.state}
            </p>
          </div>

          <p className="mt-3 text-xs text-text-secondary border-t border-glass-border pt-3">
            📅 {t("Data updated:")} {formatDateTime(prices.date)} | {t("Unit:")}{" "}
            {prices.unit}
          </p>
        </div>
      )}

      {/* Price Trends - Last 10 Days */}
      {trends.length > 0 && (
        <div className="glass-card rounded-card p-6">
          {/* Calculate actual date range */}
          {(() => {
            const displayedTrends = trends.slice(0, 10);
            const startDate = new Date(displayedTrends[0].date);
            const endDate = new Date(
              displayedTrends[displayedTrends.length - 1].date
            );
            const daysDifference = Math.ceil(
              (endDate - startDate) / (1000 * 60 * 60 * 24)
            );
            const minPrice = Math.min(
              ...displayedTrends.map((t) => t.avgPrice)
            );
            const maxPrice = Math.max(
              ...displayedTrends.map((t) => t.avgPrice)
            );
            const firstPrice = displayedTrends[0].avgPrice;
            const lastPrice =
              displayedTrends[displayedTrends.length - 1].avgPrice;
            const overallChange = (
              ((lastPrice - firstPrice) / firstPrice) *
              100
            ).toFixed(2);

            return (
              <>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-white">
                  <FaChartBar /> {t("Price History -")} {cropName.toUpperCase()}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  📅 {startDate.toLocaleDateString()} {t("to")}{" "}
                  {endDate.toLocaleDateString()} ({daysDifference} {t("days")})
                </p>

                {/* Farmer-Friendly Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="glass-card p-3 rounded-card hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-250 group text-center">
                    <p className="text-xs text-gray-400 mb-1 group-hover:!text-white transition-colors">
                      {t("Lowest Price")}
                    </p>
                    <p className="text-lg font-bold text-red-400 group-hover:!text-white transition-colors">
                      ₹{minPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="glass-card p-3 rounded-card hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-250 group text-center">
                    <p className="text-xs text-gray-400 mb-1 group-hover:!text-white transition-colors">
                      {t("Highest Price")}
                    </p>
                    <p className="text-lg font-bold text-blue-400 group-hover:!text-white transition-colors">
                      ₹{maxPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="glass-card p-3 rounded-card hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-250 group text-center">
                    <p className="text-xs text-gray-400 mb-1 group-hover:!text-white transition-colors">
                      {t("Price Swing")}
                    </p>
                    <p className="text-lg font-bold text-purple-400 group-hover:!text-white transition-colors">
                      ₹{(maxPrice - minPrice).toFixed(2)}
                    </p>
                  </div>
                  <div
                    className={`glass-card p-3 rounded-card hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-250 group text-center ${
                      overallChange > 0
                        ? "border-2 border-green-500"
                        : "border-2 border-red-500"
                    }`}
                  >
                    <p className="text-xs text-gray-400 mb-1 group-hover:!text-white transition-colors">
                      {t("Overall Trend")}
                    </p>
                    <p
                      className={`text-lg font-bold flex items-center justify-center gap-1 group-hover:!text-white transition-colors ${
                        overallChange > 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {overallChange > 0 ? <FaArrowUp /> : <FaArrowDown />}
                      {overallChange}%
                    </p>
                  </div>
                </div>

                {/* Recent Price History - Last 5 Days */}
                <div className="glass-card rounded-card p-4">
                  <p className="text-sm font-bold text-white mb-3">
                    📊 {t("Recent Prices (Last 5 Days)")}
                  </p>
                  <div className="space-y-2">
                    {displayedTrends
                      .slice(-5)
                      .reverse()
                      .map((trend, idx) => {
                        const prevPrice =
                          idx > 0
                            ? displayedTrends.slice(-5).reverse()[idx - 1]
                                .avgPrice
                            : null;
                        const priceChange = prevPrice
                          ? trend.avgPrice - prevPrice
                          : 0;
                        const changePercent = prevPrice
                          ? ((priceChange / prevPrice) * 100).toFixed(1)
                          : 0;
                        const isIncrease = priceChange > 0;

                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-card hover:bg-gradient-primary transition-all duration-250 group border border-gray-700"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-white">
                                {new Date(trend.date).toLocaleDateString([], {
                                  month: "short",
                                  day: "numeric",
                                  weekday: "short",
                                })}
                              </p>
                              <p className="text-xs text-gray-400 group-hover:!text-white transition-colors">
                                {t("Vol:")} {trend.volume}q
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-white">
                                ₹{trend.avgPrice.toFixed(2)}
                              </p>
                              {prevPrice && (
                                <p
                                  className={`text-sm font-semibold flex items-center justify-end gap-1 group-hover:!text-white transition-colors ${
                                    isIncrease
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {isIncrease ? <FaArrowUp /> : <FaArrowDown />}
                                  {Math.abs(changePercent)}%
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Key Insights */}
                <div className="mt-4 p-3 glass-card rounded-card border border-yellow-500 border-opacity-30">
                  <p className="text-sm font-semibold text-white flex items-center gap-2">
                    <FaInfoCircle className="text-yellow-400" />
                    {t("Price Insight")}
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    {overallChange > 0
                      ? `✅ ${t(
                          "Prices trending UP by"
                        )} ${overallChange}% - ${t(
                          "Good time to sell if you need immediate cash"
                        )}`
                      : overallChange < -2
                      ? `⚠️ ${t("Prices declining by")} ${Math.abs(
                          overallChange
                        )}% - ${t("Consider waiting for better prices")}`
                      : `➡️ ${t("Prices stable")} - ${t(
                          "Market is steady, sell when you're ready"
                        )}`}
                  </p>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default MarketPrices;
