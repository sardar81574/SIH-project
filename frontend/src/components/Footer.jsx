import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Sprout, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Mail, 
  Heart,
  Tractor,
  Radio,
  ExternalLink
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

// 10 Dynamic Shifting Color Palettes (Same as Dashboard & Orders)
const dynamicLightColors = [
  "#f0fdf4", "#eff6ff", "#fefce8", "#fdf4ff", "#f0fdfa",
  "#fff7ed", "#faf5ff", "#ecfeff", "#f7fee7", "#f8fafc",
];

const dynamicDarkColors = [
  "#061412", "#091224", "#141206", "#14081c", "#041416",
  "#1c0e06", "#0f091f", "#06141a", "#0c1606", "#080c14",
];

export default function Footer() {
  const { isDarkMode } = useTheme();
  const { lang } = useLanguage();
  const [colorIndex, setColorIndex] = useState(0);

  // 1-Sec Color Rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % 10);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getLabel = (hi, en, mr) => {
    if (lang === "mr") return mr || hi;
    if (lang === "en") return en;
    return hi;
  };

  const activeBgColor = isDarkMode ? dynamicDarkColors[colorIndex] : dynamicLightColors[colorIndex];

  return (
    <footer 
      style={{ backgroundColor: activeBgColor }}
      className={`w-full max-w-full overflow-x-clip border-t transition-colors duration-1000 ease-in-out pt-12 pb-8 ${
        isDarkMode 
          ? "border-slate-800 text-white" 
          : "border-slate-200 text-slate-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-800/25">
                <Sprout className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight">
                  Smart<span className="text-emerald-600 dark:text-emerald-400">farmer</span>
                </span>
                <span className="text-[9px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 block uppercase -mt-0.5">
                  AI Agriculture Platform
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm font-medium">
              {getLabel(
                "भारतीय किसानों के लिए एआई आधारित फसल रोग पहचान, स्मार्ट कीट निगरानी रडार, ट्रैक्टर/ड्रोन रेंट सेवा और प्रमाणित कृषि सामग्री का संपूर्ण डिजिटल मंच।",
                "Empowering Indian farmers with artificial intelligence for crop leaf disease detection, IoT pest surveillance, equipment rental, and farm supplies.",
                "भारतीय शेतकऱ्यांसाठी एआय आधारित पीक रोग निदान, स्मार्ट कीड नियंत्रण, ट्रॅक्टर/ड्रोन भाडे सेवा आणि कृषी औषधांचे डिजिटल व्यासपीठ."
              )}
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{getLabel("ICAR व KVK प्रमाणित मानक", "ICAR & KVK Integrated Standards", "ICAR व KVK प्रमाणित मानके")}</span>
            </div>
          </div>

          {/* Core Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-200">
              {getLabel("मुख्य सेवाएं", "Services", "मुख्य सेवा")}
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/crop-doctor" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  {getLabel("फसल डॉक्टर (AI स्कैन)", "Crop Doctor (AI Scan)", "पीक डॉक्टर (AI स्कॅन)")}
                </Link>
              </li>
              <li>
                <Link to="/iot-dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1">
                  <span>{getLabel("IoT खेत निगरानी", "IoT Live Farm Radar", "IoT शेत देखरेख")}</span>
                  <Radio className="w-3 h-3 text-cyan-500 animate-pulse" />
                </Link>
              </li>
              <li>
                <Link to="/crops" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1">
                  <span>{getLabel("ट्रैक्टर व ड्रोन रेंट", "Rent Tractor & Drone", "ट्रॅक्टर व ड्रोन भाडे")}</span>
                  <Tractor className="w-3 h-3 text-emerald-500" />
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  {getLabel("बीज व दवाइयां", "Buy Seeds & Meds", "बियाणे व औषधे")}
                </Link>
              </li>
              <li>
                <Link to="/sell-crop" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  {getLabel("फसल बेचें व मंडी स्लॉट", "Sell Harvest & Mandi", "पीक विक्री")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & Orders */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-200">
              {getLabel("किसान टूल्स", "Farmer Tools", "शेतकरी साधने")}
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/ai-assistant" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  {getLabel("किसान AI सहायक", "Kisan Mitra AI Chat", "AI सहाय्यक")}
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  {getLabel("मेरे ऑर्डर व डिलीवरी", "My Orders & Tracking", "माझ्या ऑर्डर्स")}
                </Link>
              </li>
              <li>
                <Link to="/weather" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  {getLabel("मौसम व स्प्रे रडार", "Weather & Spray Radar", "हवामान अंदाज")}
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  {getLabel("किसान चौपाल", "Kisan Community", "शेतकरी चावडी")}
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  {getLabel("मेरी प्रोफाइल", "Farmer Profile", "माझी प्रोफाइल")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Helpline & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-200">
              {getLabel("हेल्पलाइन व केंद्र", "Helpline & Support", "मदत केंद्र")}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{getLabel("टोल-फ्री: 1800-180-1551", "Toll-Free: 1800-180-1551", "टोल-फ्री: 1800-180-1551")}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{getLabel("केंद्र: जबलपुर व इंदौर (म.प्र.)", "Central Hub: Jabalpur & Indore, MP", "केंद्र: जबलपूर व इंदूर")}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>support@smartfarmer.in</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <p>© 2026 SmartFarmer AI Platform. {getLabel("सर्वाधिकार सुरक्षित।", "All rights reserved.", "सर्व हक्क राखीव.")}</p>
          <p className="flex items-center gap-1.5 font-semibold">
            <span>{getLabel("भारतीय किसानों के लिए समर्पित", "Built with pride for Indian Farmers", "भारतीय शेतकऱ्यांसाठी समर्पित")}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>

      </div>
    </footer>
  );
}