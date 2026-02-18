import React from "react";
import { Link } from "react-router-dom";
import FeatureHoverSection from "../components/FeatureHoverSection";
import { useLanguage } from "../contexts/LanguageContext";
import {
  FaLeaf,
  FaCloud,
  FaRupeeSign,
  FaShoppingCart,
  FaComments,
  FaRobot,
  FaBug,
  FaBook,
} from "react-icons/fa";

const Dashboard = () => {
  const { t } = useLanguage();

  const features = [
    {
      name: "Weather",
      icon: <FaCloud className="text-4xl text-blue-600" />,
      description: "Real-time weather data and forecasts",
      path: "/weather",
    },
    {
      name: "Market Prices",
      icon: <FaRupeeSign className="text-4xl text-yellow-600" />,
      description: "Daily mandi prices and price trends",
      path: "/market-prices",
    },
    {
      name: "Marketplace",
      icon: <FaShoppingCart className="text-4xl text-purple-600" />,
      description: "Buy and sell crops directly",
      path: "/marketplace",
    },
    {
      name: "Government Schemes",
      icon: <FaBook className="text-4xl text-orange-600" />,
      description: "Latest agricultural schemes and subsidies",
      path: "/schemes",
    },
    {
      name: "Community Forum",
      icon: <FaComments className="text-4xl text-pink-600" />,
      description: "Connect with experts and farmers",
      path: "/forum",
    },
    {
      name: "Farming Chatbot",
      icon: <FaRobot className="text-4xl text-indigo-600" />,
      description: "AI-powered farming advisor",
      path: "/chatbot",
    },
    {
      name: "Pest Detection",
      icon: <FaBug className="text-4xl text-red-600" />,
      description: "Detect pests and diseases using AI",
      path: "/pest-detection",
    },
    {
      name: "Knowledge Hub",
      icon: <FaBook className="text-4xl text-cyan-600" />,
      description: "Articles, videos, and farming guides",
      path: "/knowledge-hub",
    },
  ];

  return (
    <div className="min-h-screen bg-bg-dark">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section - Hero Style */}
        <div className="pt-10 pb-6 px-4 sm:px-6 lg:px-8 text-center animate-slideUp">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 tracking-tight leading-tight text-gradient">
            {t("Welcome to AI Smart AgroConnect")}
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            {t("Your complete agricultural advisory and marketplace platform")}
          </p>
        </div>

        {/* Feature Hover Section with Heading */}
        <FeatureHoverSection />

        {/* Soft Divider */}
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-glass-border to-transparent rounded-full"></div>
        </div>

        {/* Platform Services Section Heading */}
        <div className="pt-6 pb-8 px-4 sm:px-6 lg:px-8 text-center animate-slideUp">
          <h2 className="text-3xl sm:text-4xl font-bold text-gradient mb-3">
            {t("Our Platform Services")}
          </h2>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            {t(
              "These below are the primary services offered by AI Smart AgroConnect",
            )}
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {features.map((feature, idx) => (
              <Link
                key={feature.path}
                to={feature.path}
                className="group glass-card neon-card rounded-card shadow-card p-7 cursor-pointer flex flex-col items-center text-center transform hover:z-10 animate-slideUp"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="mb-3 icon-glow transition-transform duration-250 group-hover:scale-110">
                  {React.cloneElement(feature.icon, {
                    className: "text-4xl text-gradient",
                  })}
                </div>
                <h3 className="text-base font-bold text-text-primary mb-2">
                  {t(feature.name)}
                </h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  {t(feature.description)}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Soft Divider */}
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-glass-border to-transparent rounded-full"></div>
        </div>

        {/* Quick Stats Section */}
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gradient mb-10 text-center">
            {t("Quick Stats")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            <div className="glass-card neon-card rounded-card p-8 text-center shadow-card bg-gradient-to-br from-primary-purple/20 to-transparent border-2 border-primary-purple/30 animate-float">
              <p className="text-5xl font-bold mb-2 text-gradient">1000+</p>
              <p className="text-sm font-medium text-text-primary">
                {t("Active Farmers")}
              </p>
            </div>
            <div
              className="glass-card neon-card rounded-card p-8 text-center shadow-card bg-gradient-to-br from-primary-blue/20 to-transparent border-2 border-primary-blue/30 animate-float"
              style={{ animationDelay: "1s" }}
            >
              <p className="text-5xl font-bold mb-2 text-gradient">500+</p>
              <p className="text-sm font-medium text-text-primary">
                {t("Crop Listings")}
              </p>
            </div>
            <div
              className="glass-card neon-card rounded-card p-8 text-center shadow-card bg-gradient-to-br from-orange-500/20 to-transparent border-2 border-orange-500/30 animate-float"
              style={{ animationDelay: "2s" }}
            >
              <p className="text-5xl font-bold mb-2 text-gradient">100+</p>
              <p className="text-sm font-medium text-text-primary">
                {t("Market Prices Daily")}
              </p>
            </div>
            <div
              className="glass-card neon-card rounded-card p-8 text-center shadow-card bg-gradient-to-br from-pink-500/20 to-transparent border-2 border-pink-500/30 animate-float"
              style={{ animationDelay: "3s" }}
            >
              <p className="text-5xl font-bold mb-2 text-gradient">50+</p>
              <p className="text-sm font-medium text-text-primary">
                {t("Government Schemes")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
