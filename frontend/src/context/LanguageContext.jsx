import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const baseDictionary = {
  hi: {
    // Nav & Common
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
    viewAll: "सभी देखें",

    // Tractor / Drone Rent Marketplace
    rentMarketTitle: "ट्रैक्टर, ड्रोन व उपकरण रेंट सेवा",
    rentSubTitle: "अपने खेत की जुताई, बुवाई व ड्रोन स्प्रे के लिए नजदीकी किसान साथी को सीधे कॉल करें।",
    addMachineBtn: "अपनी मशीन/ट्रैक्टर किराए पर जोड़ें",
    allEquipment: "सभी उपकरण",
    droneOnly: "केवल ड्रोन (दवा स्प्रे)",
    tractorRent: "ट्रैक्टर किराया",
    droneSprayRent: "ड्रोन स्प्रे किराया",
    perHour: "घंटा",
    perAcre: "एकड़",
    implementsIncluded: "साथ में उपलब्ध उपकरण (सामान):",
    callNow: "कॉल करें",
    whatsappChat: "व्हाट्सएप",
    viewMap: "मैप पर लोकेशन",
    farmerName: "किसान का पूरा नाम",
    mobileNumber: "मोबाइल नंबर (कॉलिंग)",
    villageTown: "गांव व तहसील",
    selectMachine: "मुख्य वाहन/मशीन",
    rentPerHour: "किराया दर (₹ प्रति घंटा)",
    hasDrone: "क्या आपके पास दवा छिड़काव वाला कृषि ड्रोन भी है?",
    liveGpsLocation: "खेत की लाइव GPS लोकेशन",
    getGpsBtn: "वर्तमान GPS लें",
    registerServiceBtn: "सेवा तुरंत लिस्ट करें",

    // IoT & Pest Radar
    iotTitle: "स्मार्ट कीट निगरानी, खेत टेलीमेट्री व लाइव कैमरा",
    solarBattery: "सोलर बैटरी",
    temperature: "तापमान",
    humidity: "वायु आर्द्रता",
    soilMoisture: "मिट्टी की नमी",
    activeMobiles: "2 KM सक्रिय फोन",
    opticalVision: "ऑप्टिकल विजन व कीट डिटेक्शन",
    ipStreamTab: "IP/CCTV स्ट्रीम",
    mobileCamTab: "मोबाइल/वेबकैम",
    scanStreamBtn: "स्कैन करें",
    takePhotoBtn: "फोटो लें व मच्छर/कीट काउंट करें",
    livePestCount: "लाइव कीट व मच्छर गणना",
    safeLevel: "सुरक्षित स्तर पर",
    outbreakWarning: "⚠️ थ्रेशोल्ड सीमा से अधिक (खतरा)",
    pesticideAdvice: "सटीक कीटनाशक सलाह:"
  },

  en: {
    // Nav & Common
    dashboard: "Dashboard",
    cropDoctor: "Crop Doctor",
    marketplace: "Marketplace & Agri Shop",
    sellCrop: "Sell Crop",
    weather: "Weather Forecast",
    community: "Kisan Community",
    aiAssistant: "AI Assistant",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    orders: "My Orders",
    crops: "My Crops",
    notifications: "Notifications",
    search: "Search...",
    submit: "Submit",
    save: "Save",
    cancel: "Cancel",
    back: "Back",
    loading: "Loading...",
    viewAll: "View All",

    // Tractor / Drone Rent Marketplace
    rentMarketTitle: "Tractor, Drone & Equipment Rental Service",
    rentSubTitle: "Hire nearby tractors, implements and agri-spraying drones directly from farmers.",
    addMachineBtn: "List Your Machine/Tractor for Rent",
    allEquipment: "All Equipment",
    droneOnly: "Drones Only (Spraying)",
    tractorRent: "Tractor Rent",
    droneSprayRent: "Drone Spray Rent",
    perHour: "hr",
    perAcre: "acre",
    implementsIncluded: "Included Implements / Attachments:",
    callNow: "Call Now",
    whatsappChat: "WhatsApp",
    viewMap: "View on Map",
    farmerName: "Farmer Full Name",
    mobileNumber: "Mobile Number",
    villageTown: "Village & Tehsil",
    selectMachine: "Primary Vehicle/Machine",
    rentPerHour: "Rental Rate (₹ per hour)",
    hasDrone: "Do you also offer an agricultural pesticide spraying drone?",
    liveGpsLocation: "Live Field GPS Location",
    getGpsBtn: "Capture Current GPS",
    registerServiceBtn: "Publish Rental Listing",

    // IoT & Pest Radar
    iotTitle: "Smart Pest Surveillance, Farm Telemetry & Live Camera",
    solarBattery: "Solar Battery",
    temperature: "Temperature",
    humidity: "Air Humidity",
    soilMoisture: "Soil Moisture",
    activeMobiles: "Active Mobiles (2 KM)",
    opticalVision: "Optical Vision & Pest Counting",
    ipStreamTab: "IP/CCTV Stream",
    mobileCamTab: "Mobile/Webcam",
    scanStreamBtn: "Scan Stream",
    takePhotoBtn: "Capture & Detect Pests",
    livePestCount: "Live Pest & Mosquito Count",
    safeLevel: "Within Safe Threshold",
    outbreakWarning: "⚠️ High Pest Outbreak Alert",
    pesticideAdvice: "Targeted Pesticide Advisory:"
  },

  mr: {
    // Nav & Common (मराठी)
    dashboard: "डॅशबोर्ड",
    cropDoctor: "पीक डॉक्टर",
    marketplace: "बाजारपेठ व औषधे",
    sellCrop: "पीक विक्री",
    weather: "हवामान अंदाज",
    community: "शेतकरी चावडी",
    aiAssistant: "AI कृषी मित्र",
    profile: "माझी प्रोफाइल",
    settings: "सेटिंग्ज",
    logout: "लॉगआउट",
    orders: "माझ्या ऑर्डर्स",
    crops: "माझी पिके",
    notifications: "सूचना",
    search: "शोधा...",
    submit: "सबमिट करा",
    save: "जतन करा",
    cancel: "रद्द करा",
    back: "मागे जा",
    loading: "लोड होत आहे...",
    viewAll: "सर्व पहा",

    // Tractor / Drone Rent Marketplace (मराठी)
    rentMarketTitle: "ट्रॅक्टर, ड्रोन व कृषी अवजारे भाडे सेवा",
    rentSubTitle: "नांगरणी, पेरणी आणि ड्रोन फवारणीसाठी जवळच्या शेतकऱ्यांशी थेट संपर्क साधा.",
    addMachineBtn: "आपला ट्रॅक्टर/मशीन भाड्याने द्या",
    allEquipment: "सर्व अवजारे",
    droneOnly: "केवळ फवारणी ड्रोन",
    tractorRent: "ट्रॅक्टर भाडे",
    droneSprayRent: "ड्रोन फवारणी दर",
    perHour: "तास",
    perAcre: "एकर",
    implementsIncluded: "सोबत उपलब्ध असलेली अवजारे:",
    callNow: "थेट कॉल करा",
    whatsappChat: "व्हॉट्सॲप",
    viewMap: "नकाशावर लोकेशन",
    farmerName: "शेतकऱ्याचे पूर्ण नाव",
    mobileNumber: "मोबाईल नंबर",
    villageTown: "गाव व तालुका",
    selectMachine: "मुख्य वाहन/यंत्र",
    rentPerHour: "भाडे दर (₹ प्रति तास)",
    hasDrone: "आपल्याकडे औषध फवारणीसाठी कृषी ड्रोन उपलब्ध आहे का?",
    liveGpsLocation: "शेताचे थेट GPS लोकेशन",
    getGpsBtn: "सध्याचे GPS मिळवा",
    registerServiceBtn: "सेवा त्वरित नोंदवा",

    // IoT & Pest Radar (मराठी)
    iotTitle: "स्मार्ट कीड देखरेख, शेत टेलिमेट्री व थेट कॅमेरा",
    solarBattery: "सोलर बॅटरी",
    temperature: "तापमान",
    humidity: "हवेतील आर्द्रता",
    soilMoisture: "मातीतील ओलावा",
    activeMobiles: "२ किमी सक्रिय शेतकरी",
    opticalVision: "ऑप्टिकल व्हिजन व कीड मोजणी",
    ipStreamTab: "IP/CCTV प्रवाह",
    mobileCamTab: "मोबाईल/वेबकॅम",
    scanStreamBtn: "तपासा",
    takePhotoBtn: "फोटो घ्या व कीड मोजा",
    livePestCount: "थेट कीड व डास संख्या",
    safeLevel: "सुरक्षित पातळीवर",
    outbreakWarning: "⚠️ धोक्याची पातळी (जास्त प्रादुर्भाव)",
    pesticideAdvice: "कीटकनाशक सल्ला:"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("agri_lang") || "hi";
  });

  // Direct language setter (hi, en, mr)
  const changeLanguage = (newLang) => {
    if (["hi", "en", "mr"].includes(newLang)) {
      setLang(newLang);
      localStorage.setItem("agri_lang", newLang);
    }
  };

  // Toggle between 3 languages: Hindi -> English -> Marathi -> Hindi
  const toggleLanguage = () => {
    const cycle = { hi: "en", en: "mr", mr: "hi" };
    const next = cycle[lang] || "hi";
    changeLanguage(next);
  };

  /**
   * Smart Translation Function:
   * 1. t("dashboard") -> Dictionary lookup
   * 2. t({ hi: "गेहूं", en: "Wheat", mr: "गहू" }) -> Multilingual object
   */
  const t = (input) => {
    if (!input) return "";

    // If direct multilingual object passed
    if (typeof input === "object") {
      return input[lang] || input["hi"] || input["en"] || "";
    }

    // Dictionary lookup with fallbacks
    if (baseDictionary[lang] && baseDictionary[lang][input]) {
      return baseDictionary[lang][input];
    }
    if (baseDictionary["hi"] && baseDictionary["hi"][input]) {
      return baseDictionary["hi"][input];
    }
    if (baseDictionary["en"] && baseDictionary["en"][input]) {
      return baseDictionary["en"][input];
    }

    return input;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);