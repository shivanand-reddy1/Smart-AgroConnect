import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  FaLightbulb,
  FaCloudSun,
  FaChartLine,
  FaShoppingBasket,
} from "react-icons/fa";

const FeatureHoverSection = () => {
  const [hovered, setHovered] = useState(null);
  const { t } = useLanguage();

  const features = [
    {
      name: "Smart Recommendations",
      icon: <FaLightbulb className="text-5xl text-gradient" />,
      description: "AI-powered guidance to improve farming decisions",
    },
    {
      name: "Weather Intelligence",
      icon: <FaCloudSun className="text-5xl text-gradient" />,
      description: "Real-time weather insights and forecasts",
    },
    {
      name: "Market Insights",
      icon: <FaChartLine className="text-5xl text-gradient" />,
      description: "Daily mandi price analytics and trends",
    },
    {
      name: "Digital Marketplace",
      icon: <FaShoppingBasket className="text-5xl text-gradient" />,
      description: "Buy and sell crops directly",
    },
  ];

  return (
    <section className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-10 animate-slideUp">
          <h3 className="text-2xl sm:text-3xl font-bold text-gradient">
            {t("Our Key Smart Features")}
          </h3>
          <div className="h-1 bg-gradient-primary rounded-full w-16 mx-auto mt-3 shadow-glow-purple"></div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {features.map((feature, idx) => (
            <div
              key={feature.name}
              className={`relative glass-card neon-card rounded-card shadow-card p-8 flex flex-col items-center justify-center transition-all duration-250 cursor-pointer min-h-80 transform ${
                hovered === idx
                  ? "scale-105 z-10"
                  : "scale-100 z-0 hover:scale-104"
              } animate-slideUp`}
              style={{ animationDelay: `${idx * 50}ms` }}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Icon and Title (Always visible) */}
              <div
                className={`flex flex-col items-center justify-center transition-all duration-250 ${
                  hovered === idx
                    ? "opacity-0 scale-95 absolute"
                    : "opacity-100 scale-100 relative"
                }`}
              >
                <div className="mb-4 icon-glow">{feature.icon}</div>
                <h3 className="text-lg font-bold text-text-primary text-center">
                  {t(feature.name)}
                </h3>
              </div>

              {/* Description (Appears on hover) */}
              <div
                className={`flex items-center justify-center transition-all duration-250 ease-out ${
                  hovered === idx
                    ? "opacity-100 scale-100 absolute"
                    : "opacity-0 scale-95 absolute"
                }`}
              >
                <p className="text-text-secondary text-center text-base font-medium leading-relaxed px-4">
                  {t(feature.description)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHoverSection;
