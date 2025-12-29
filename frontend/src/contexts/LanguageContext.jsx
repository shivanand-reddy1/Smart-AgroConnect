import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Always default to English
  const [language, setLanguage] = useState("english");
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchTranslations = async (lang) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/translations?language=${lang}`);
      setTranslations(response.data || {});
      setLanguage(lang);
      localStorage.setItem("language", lang);
      toast.success(
        `${
          lang === "kannada" ? "ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ" : "Switched to English"
        }`
      );
    } catch (error) {
      console.error("Error fetching translations:", error);
      toast.error("Error switching language");
    } finally {
      setLoading(false);
    }
  };

  // Initialize with English as default
  useEffect(() => {
    // Clear any stored language and set to English
    localStorage.setItem("language", "english");
    setLanguage("english");
    setTranslations({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchLanguage = (lang) => {
    if (lang === "english") {
      setLanguage("english");
      setTranslations({});
      localStorage.setItem("language", "english");
      toast.success("Switched to English");
    } else {
      fetchTranslations(lang);
    }
  };

  // Translation function
  const t = (text) => {
    if (language === "english") return text;
    return translations[text] || text;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        switchLanguage,
        t,
        translations,
        loading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
