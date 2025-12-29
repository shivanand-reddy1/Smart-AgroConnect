import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const LanguageSwitcher = () => {
  const storedLang = localStorage.getItem("language") || "english";
  const [language, setLanguage] = useState(storedLang);
  const [translations, setTranslations] = useState({});

  const fetchTranslations = async (lang) => {
    try {
      const response = await axios.get(`/api/translations?language=${lang}`);
      setTranslations(response.data || {});
      setLanguage(lang);
      localStorage.setItem("language", lang);
      toast.success(
        `Language switched to ${lang === "kannada" ? "Kannada" : "English"}`
      );
    } catch (error) {
      toast.error("Error switching language");
    }
  };

  // On initial hook mount, fetch stored language translations
  React.useEffect(() => {
    if (language && language !== "english") {
      fetchTranslations(language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translate = (text) => {
    return translations[text] || text;
  };

  return {
    language,
    fetchTranslations,
    translate,
    translations,
  };
};

export default LanguageSwitcher;
