import React, { useState } from "react";
import axios from "axios";
import { useLanguage } from "../contexts/LanguageContext";

const Forum = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState("role"); // role, form, success
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    // Farmer fields
    crops: "",
    location: "",
    problemsNeeds: "",
    // Buyer fields
    productsRequired: "",
    buyerLocation: "",
    // Expert fields
    qualification: "",
    specialization: "",
  });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData({ ...formData, role });
    setStep("form");
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      // Validate role-specific fields
      if (selectedRole === "farmer") {
        if (!formData.crops || !formData.location || !formData.problemsNeeds) {
          setError("Please fill in all farmer-specific fields");
          setLoading(false);
          return;
        }
      } else if (selectedRole === "buyer") {
        if (!formData.productsRequired || !formData.buyerLocation) {
          setError("Please fill in all buyer-specific fields");
          setLoading(false);
          return;
        }
      } else if (selectedRole === "expert") {
        if (!formData.qualification || !formData.specialization) {
          setError("Please fill in all expert-specific fields");
          setLoading(false);
          return;
        }
      }

      // Send registration data
      const response = await axios.post(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:4000"
        }/api/forum/register`,
        formData
      );

      if (response.status === 201 || response.status === 200) {
        setStep("success");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("role");
    setSelectedRole("");
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      crops: "",
      location: "",
      problemsNeeds: "",
      productsRequired: "",
      buyerLocation: "",
      qualification: "",
      specialization: "",
    });
    setError("");
  };

  // Role Selection Step
  if (step === "role") {
    return (
      <div className="glass-card rounded-card p-8 max-w-4xl mx-auto animate-fadeIn">
        <h2 className="text-3xl font-bold text-gradient mb-2">
          {t("Join AgroConnect Community")}
        </h2>
        <p className="text-text-secondary mb-8">
          {t("Select your role to get started and connect with our community")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Farmer Card */}
          <button
            onClick={() => handleRoleSelect("farmer")}
            className="p-6 glass-card rounded-card hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-300 text-left group icon-glow"
          >
            <div className="text-4xl mb-4">👨‍🌾</div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white">
              {t("Farmer")}
            </h3>
            <p className="text-text-secondary text-sm group-hover:text-white">
              {t(
                "Grow your knowledge and connect with experts and buyers. Get advice on crops, pest detection, and market prices."
              )}
            </p>
          </button>

          {/* Buyer Card */}
          <button
            onClick={() => handleRoleSelect("buyer")}
            className="p-6 glass-card rounded-card hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-300 text-left group icon-glow"
          >
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white">
              {t("Buyer")}
            </h3>
            <p className="text-text-secondary text-sm group-hover:text-white">
              {t(
                "Find quality agricultural products directly from farmers. Get best prices and reliable suppliers."
              )}
            </p>
          </button>

          {/* Expert Card */}
          <button
            onClick={() => handleRoleSelect("expert")}
            className="p-6 glass-card rounded-card hover:bg-gradient-primary hover:shadow-glow-purple transition-all duration-300 text-left group icon-glow"
          >
            <div className="text-4xl mb-4">👨‍💼</div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white">
              {t("Expert")}
            </h3>
            <p className="text-text-secondary text-sm group-hover:text-white">
              {t(
                "Share your expertise with the community. Help farmers solve problems and build trust."
              )}
            </p>
          </button>
        </div>
      </div>
    );
  }

  // Registration Form Step
  if (step === "form") {
    return (
      <div className="glass-card rounded-card p-8 max-w-2xl mx-auto animate-fadeIn">
        <button
          onClick={() => setStep("role")}
          className="mb-6 text-gradient hover:opacity-80 flex items-center gap-2 font-medium transition-all duration-250"
        >
          ← {t("Change Role")}
        </button>

        <h2 className="text-2xl font-bold text-gradient mb-6">
          {selectedRole === "farmer"
            ? `🌾 ${t("Farmer Registration")}`
            : selectedRole === "buyer"
            ? `🛒 ${t("Buyer Registration")}`
            : `👨‍💼 ${t("Expert Registration")}`}
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 text-red-300 rounded-card">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Common Fields */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              {t("Full Name")} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-250"
              placeholder={t("Enter your full name")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              {t("Email")} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-250"
              placeholder={t("Enter your email")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              {t("Phone")} *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-250"
              placeholder={t("Enter your phone number")}
              required
            />
          </div>

          {/* Farmer Specific Fields */}
          {selectedRole === "farmer" && (
            <>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t("Crops")} *
                </label>
                <input
                  type="text"
                  name="crops"
                  value={formData.crops}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-250"
                  placeholder={t("e.g., Rice, Wheat, Corn (comma separated)")}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t("Location")} *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-250"
                  placeholder={t("e.g., District, State")}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t("Problems/Needs")} *
                </label>
                <textarea
                  name="problemsNeeds"
                  value={formData.problemsNeeds}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-250"
                  placeholder={t("Describe your farming problems or needs")}
                  rows="4"
                  required
                />
              </div>
            </>
          )}

          {/* Buyer Specific Fields */}
          {selectedRole === "buyer" && (
            <>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t("Products Required")} *
                </label>
                <textarea
                  name="productsRequired"
                  value={formData.productsRequired}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-250"
                  placeholder={t(
                    "List the agricultural products you are looking for"
                  )}
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t("Location")} *
                </label>
                <input
                  type="text"
                  name="buyerLocation"
                  value={formData.buyerLocation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-250"
                  placeholder={t("e.g., City, State")}
                  required
                />
              </div>
            </>
          )}

          {/* Expert Specific Fields */}
          {selectedRole === "expert" && (
            <>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t("Qualification")} *
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-250"
                  placeholder={t("e.g., B.Sc Agriculture, M.Tech Soil Science")}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {t("Specialization")} *
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-250"
                  placeholder={t(
                    "e.g., Organic Farming, Pest Management, Irrigation"
                  )}
                  required
                />
              </div>
            </>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setStep("role")}
              className="flex-1 px-6 py-2 glass-card rounded-button hover:bg-glass-light font-medium text-white transition-all duration-250 hover:scale-103"
            >
              {t("Back")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2 bg-gradient-primary text-white rounded-button hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-glow-purple transition-all duration-250"
            >
              {loading ? t("Registering...") : t("Register")}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Success Step
  if (step === "success") {
    return (
      <div className="glass-card rounded-card p-8 max-w-2xl mx-auto text-center animate-fadeIn">
        <div className="text-6xl mb-6 animate-scaleIn">✅</div>
        <h2 className="text-2xl font-bold text-gradient mb-3">
          Registration Successful!
        </h2>
        <p className="text-white mb-2">Welcome to the AgroConnect community!</p>
        <p className="text-text-secondary mb-8">
          A confirmation email has been sent to{" "}
          <span className="font-semibold text-gradient">{formData.email}</span>
        </p>

        <div className="glass-card rounded-card p-6 mb-8 text-left border border-purple-500 border-opacity-30">
          <h3 className="font-bold text-white mb-3">
            Your Registration Details:
          </h3>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>
              <span className="font-medium text-white">Name:</span>{" "}
              {formData.name}
            </p>
            <p>
              <span className="font-medium text-white">Email:</span>{" "}
              {formData.email}
            </p>
            <p>
              <span className="font-medium text-white">Phone:</span>{" "}
              {formData.phone}
            </p>
            <p>
              <span className="font-medium text-white">Role:</span>{" "}
              {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
            </p>
            {selectedRole === "farmer" && (
              <>
                <p>
                  <span className="font-medium text-white">Crops:</span>{" "}
                  {formData.crops}
                </p>
                <p>
                  <span className="font-medium text-white">Location:</span>{" "}
                  {formData.location}
                </p>
              </>
            )}
            {selectedRole === "buyer" && (
              <p>
                <span className="font-medium text-white">Location:</span>{" "}
                {formData.buyerLocation}
              </p>
            )}
            {selectedRole === "expert" && (
              <p>
                <span className="font-medium text-white">Specialization:</span>{" "}
                {formData.specialization}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gradient-primary text-white rounded-button hover:scale-105 font-medium shadow-glow-purple transition-all duration-250"
        >
          Register Another User
        </button>
      </div>
    );
  }
};

export default Forum;
