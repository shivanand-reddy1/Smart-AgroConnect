import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useLanguage } from "../contexts/LanguageContext";
import {
  FaBars,
  FaTimes,
  FaLeaf,
  FaCloud,
  FaRupeeSign,
  FaShoppingCart,
  FaComments,
  FaRobot,
  FaBug,
  FaBook,
  FaHome,
  FaSignOutAlt,
  FaChevronDown,
  FaUser,
  FaCog,
  FaUserCircle,
  FaLanguage,
} from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { language, switchLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    setProfileOpen(false);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const featureItems = [
    { name: "Weather", icon: <FaCloud />, path: "/weather" },
    { name: "Market Prices", icon: <FaRupeeSign />, path: "/market-prices" },
    { name: "Fertilizer Alerts", icon: <FaLeaf />, path: "/fertilizer-alerts" },
    { name: "Marketplace", icon: <FaShoppingCart />, path: "/marketplace" },
    { name: "Government Schemes", icon: <FaBook />, path: "/schemes" },
    { name: "Pest Detection", icon: <FaBug />, path: "/pest-detection" },
  ];

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Community Forum", icon: <FaComments />, path: "/forum" },
    { name: "Chatbot", icon: <FaRobot />, path: "/chatbot" },
    { name: "Knowledge Hub", icon: <FaBook />, path: "/knowledge-hub" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`sticky top-0 z-50 text-white transition-all duration-500 glass-nav ${
        scrolled ? "shadow-glow-gradient" : "shadow-glass"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <Link
            to="/dashboard"
            className="text-xl sm:text-2xl font-bold flex items-center gap-3 hover:scale-105 transition-all duration-250 icon-glow"
          >
            <FaLeaf className="text-2xl sm:text-3xl text-gradient" />
            <span className="text-gradient">{t("Smart AgroConnect")}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-button transition-all duration-250 relative group icon-glow ${
                isActive("/dashboard")
                  ? "bg-gradient-primary text-white font-semibold shadow-glow-purple"
                  : "hover:bg-glass-light"
              }`}
            >
              <FaHome /> {t("Dashboard")}
              <span
                className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-primary rounded transition-all duration-250 ${
                  isActive("/dashboard")
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              ></span>
            </Link>

            {/* Features Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setFeaturesOpen(!featuresOpen);
                  setProfileOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-button transition-all duration-250 relative group hover:bg-glass-light icon-glow"
              >
                {t("Features")}{" "}
                <FaChevronDown
                  className={`transition-transform duration-250 ${
                    featuresOpen ? "rotate-180" : ""
                  }`}
                />
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-primary rounded transition-all duration-250 scale-x-0 group-hover:scale-x-100"></span>
              </button>
              {featuresOpen && (
                <div
                  className="absolute top-full mt-2 py-2 min-w-[240px] animate-fadeIn shadow-glow-gradient"
                  style={{
                    background: "rgba(17, 24, 39, 0.95)",
                    border: "1px solid rgba(171, 71, 255, 0.3)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    borderRadius: "12px",
                  }}
                >
                  {featureItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setFeaturesOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 transition-all duration-250 icon-glow rounded-lg mx-2 ${
                        isActive(item.path)
                          ? "bg-gradient-primary text-white font-semibold shadow-glow-purple"
                          : "text-white hover:bg-gradient-primary hover:shadow-glow-purple"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{t(item.name)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/forum"
              className={`flex items-center gap-2 px-4 py-2 rounded-button transition-all duration-250 relative group icon-glow ${
                isActive("/forum")
                  ? "bg-gradient-primary text-white font-semibold shadow-glow-purple"
                  : "hover:bg-glass-light"
              }`}
            >
              <FaComments /> {t("Community Forum")}
              <span
                className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-primary rounded transition-all duration-250 ${
                  isActive("/forum")
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              ></span>
            </Link>

            <Link
              to="/chatbot"
              className={`flex items-center gap-2 px-4 py-2 rounded-button transition-all duration-250 relative group icon-glow ${
                isActive("/chatbot")
                  ? "bg-gradient-primary text-white font-semibold shadow-glow-purple"
                  : "hover:bg-glass-light"
              }`}
            >
              <FaRobot /> {t("Chatbot")}
              <span
                className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-primary rounded transition-all duration-250 ${
                  isActive("/chatbot")
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              ></span>
            </Link>

            <Link
              to="/knowledge-hub"
              className={`flex items-center gap-2 px-4 py-2 rounded-button transition-all duration-250 relative group icon-glow ${
                isActive("/knowledge-hub")
                  ? "bg-gradient-primary text-white font-semibold shadow-glow-purple"
                  : "hover:bg-glass-light"
              }`}
            >
              <FaBook /> {t("Knowledge Hub")}
              <span
                className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-primary rounded transition-all duration-250 ${
                  isActive("/knowledge-hub")
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              ></span>
            </Link>

            {/* Language Switcher Dropdown */}
            <div className="relative ml-2">
              <button
                onClick={() => {
                  setLanguageOpen(!languageOpen);
                  setProfileOpen(false);
                  setFeaturesOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-button transition-all duration-250 hover:bg-glass-light icon-glow"
              >
                <FaLanguage />
                <span>{language === "kannada" ? "ಕನ್ನಡ" : "English"}</span>
                <FaChevronDown
                  className={`transition-transform duration-250 ${
                    languageOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {languageOpen && (
                <div
                  className="absolute right-0 top-full mt-2 py-2 min-w-[160px] animate-fadeIn shadow-glow-gradient"
                  style={{
                    background: "rgba(17, 24, 39, 0.95)",
                    border: "1px solid rgba(171, 71, 255, 0.3)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    borderRadius: "12px",
                  }}
                >
                  <button
                    onClick={() => {
                      switchLanguage("english");
                      setLanguageOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 transition-all duration-250 rounded-lg mx-2 ${
                      language === "english"
                        ? "bg-gradient-primary text-white font-semibold shadow-glow-purple"
                        : "text-white hover:bg-gradient-primary hover:shadow-glow-purple"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      switchLanguage("kannada");
                      setLanguageOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 transition-all duration-250 rounded-lg mx-2 ${
                      language === "kannada"
                        ? "bg-gradient-primary text-white font-semibold shadow-glow-purple"
                        : "text-white hover:bg-gradient-primary hover:shadow-glow-purple"
                    }`}
                    style={{ fontFamily: "Noto Sans Kannada, sans-serif" }}
                  >
                    ಕನ್ನಡ
                  </button>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative ml-4 pl-4 border-l border-glass-border">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setFeaturesOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-full hover:scale-105 transition-all duration-250 shadow-glow-purple icon-glow"
              >
                <FaUserCircle className="text-2xl" />
              </button>
              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-3 py-2 min-w-[200px] animate-fadeIn shadow-glow-gradient"
                  style={{
                    background: "rgba(17, 24, 39, 0.95)",
                    border: "1px solid rgba(171, 71, 255, 0.3)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    borderRadius: "12px",
                  }}
                >
                  <div className="px-4 py-2 border-b border-purple-500 border-opacity-30 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Account
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 transition-all duration-250 icon-glow rounded-lg mx-2 text-white hover:bg-gradient-primary hover:shadow-glow-purple"
                  >
                    <FaUser /> {t("Profile")}
                  </Link>
                  <hr className="my-2 border-purple-500 border-opacity-30 mx-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 transition-all duration-250 icon-glow rounded-lg mx-2 w-full text-left font-medium text-white hover:bg-gradient-primary hover:shadow-glow-purple"
                  >
                    <FaSignOutAlt /> {t("Logout")}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-2xl p-2 hover:bg-glass-light rounded-lg transition-all duration-250 icon-glow"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`${
            menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } lg:hidden overflow-hidden transition-all duration-350 mt-4`}
        >
          <div className="flex flex-col gap-2 pb-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-card transition-all duration-250 icon-glow ${
                  isActive(item.path)
                    ? "bg-gradient-primary text-white font-semibold shadow-glow-purple"
                    : "hover:bg-glass-light"
                }`}
              >
                {item.icon}
                <span>{t(item.name)}</span>
              </Link>
            ))}

            {/* Mobile Features Section */}
            <div className="border-t border-glass-border pt-3 mt-3">
              <p className="text-xs uppercase text-text-secondary px-4 mb-2 font-semibold tracking-wide">
                {t("Features")}
              </p>
              {featureItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-card transition-all duration-250 icon-glow ${
                    isActive(item.path)
                      ? "bg-gradient-primary text-white font-semibold shadow-glow-purple"
                      : "hover:bg-glass-light"
                  }`}
                >
                  {item.icon}
                  <span>{t(item.name)}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Profile Actions */}
            <div className="border-t border-glass-border pt-3 mt-3">
              <p className="text-xs uppercase text-text-secondary px-4 mb-2 font-semibold tracking-wide">
                Account
              </p>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-card hover:bg-glass-light transition-all duration-250 icon-glow"
              >
                <FaUser /> {t("Profile")}
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-card hover:bg-glass-light transition-all duration-250 icon-glow"
              >
                <FaCog /> {t("Settings")}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-card bg-gradient-primary hover:scale-103 transition-all duration-250 w-full text-left mt-2 font-medium shadow-glow-purple"
              >
                <FaSignOutAlt /> {t("Logout")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
