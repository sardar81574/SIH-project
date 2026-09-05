import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const baseDictionary = {
  hi: {
    dashboard: "डैशबोर्ड",
    cropDoctor: "फसल डॉक्टर",
    marketplace: "मंडी व दवाइयां",
    sellCrop: "फसल बेचें",
    weather: "मौसम",
    community: "किसान चौपाल",
    aiAssistant: "AI सहायक",
    profile: "प्रोफ़ाइल",
    settings: "सेटिंग्स",
    logout: "लॉगआउट",
    orders: "मेरे ऑर्डर",
    crops: "मेरी फसलें",
    notifications: "सूचनाएं",
    search: "खोजें...",
    submit: "जमा करें",
    save: "सुरक्षित करें",
    cancel: "रद्द करें",
    back: "वापस जाएं",
    loading: "लोड हो रहा है...",
    viewAll: "सभी देखें"
  },
  en: {
    dashboard: "Dashboard",
    cropDoctor: "Crop Doctor",
    marketplace: "Marketplace",
    sellCrop: "Sell Crop",
    weather: "Weather",
    community: "Community",
    aiAssistant: "AI Assistant",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    orders: "My Orders",
    crops: "My Crops",
    notifications: "Alerts",
    search: "Search...",
    submit: "Submit",
    save: "Save",
    cancel: "Cancel",
    back: "Back",
    loading: "Loading...",
    viewAll: "View All"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("agri_lang") || "hi";
  });

  const toggleLanguage = () => {
    const next = lang === "hi" ? "en" : "hi";
    setLang(next);
    localStorage.setItem("agri_lang", next);
  };

  /**
   * Smart Translate function:
   * 1. t("dashboard") -> string key dictionary se nikalega
   * 2. t({ hi: "गेहूं", en: "Wheat" }) -> direct object se language ke hisab se dega
   */
  const t = (input) => {
    if (!input) return "";

    // Agar direct object pass kiya ho: t({ hi: "...", en: "..." })
    if (typeof input === "object") {
      return input[lang] || input["en"] || "";
    }

    // Agar key string ho: t("dashboard")
    if (baseDictionary[lang] && baseDictionary[lang][input]) {
      return baseDictionary[lang][input];
    }

    return input;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);