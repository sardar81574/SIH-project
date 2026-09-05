import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Bell, 
  Moon, 
  Sun, 
  Smartphone, 
  Lock, 
  Database, 
  Trash2, 
  LogOut, 
  Save, 
  CheckCircle2, 
  Cpu, 
  LandPlot, 
  IndianRupee, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

export default function Settings() {
  const navigate = useNavigate();

  // Settings State (Loaded from localStorage)
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('kisan_app_settings');
    return saved ? JSON.parse(saved) : {
      language: 'hi',
      currency: 'INR',
      landUnit: 'Acre',
      weatherAlerts: true,
      mandiPush: true,
      orderSms: true,
      aiVoiceSupport: true,
      highAccuracyGps: true,
      dataSaver: false,
      autoSyncFirebase: true
    };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Toggle helper
  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Save Settings
  const saveAllSettings = () => {
    localStorage.setItem('kisan_app_settings', JSON.stringify(settings));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Clear Local Cache
  const handleClearCache = () => {
    if (window.confirm("क्या आप लोकल कैशे (Offline Data) साफ करना चाहते हैं?")) {
      localStorage.removeItem('kisan_app_cache');
      alert("कैशे सफलतापूर्वक साफ हो गया!");
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    if (window.confirm("क्या आप अपने किसान खाते से लॉगआउट करना चाहते हैं?")) {
      try {
        await signOut(auth);
      } catch (e) {
        // Safe fallback
      }
      localStorage.removeItem('userToken');
      localStorage.removeItem('farmerName');
      navigate('/login');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-28 md:pb-10 font-sans px-2 sm:px-4">
      
      {/* 🌟 Top Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> System Preferences
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 tracking-tight">ऐप सेटिंग्स (Settings)</h1>
          <p className="text-xs text-gray-500 font-medium">भाषा, अलर्ट, AI मॉडल प्रेफरेंस और अकाउंट सेटिंग्स कस्टमाइज़ करें</p>
        </div>

        <button
          onClick={saveAllSettings}
          className="bg-[#1b5e20] hover:bg-[#154a19] text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md transition flex items-center justify-center gap-2 active:scale-95 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>सभी सेटिंग्स सफलतापूर्वक सुरक्षित (Save) कर दी गई हैं!</span>
        </div>
      )}

      {/* 🌟 1. General & Localization */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-700" />
          <span>सामान्य व भाषा (General & Language)</span>
        </h3>

        <div className="space-y-4 text-xs font-bold text-gray-700">
          
          {/* App Language */}
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div>
              <p className="text-sm font-extrabold text-gray-900">ऐप की भाषा (App Language)</p>
              <p className="text-[11px] text-gray-400 font-medium">पोर्टल के सभी टेक्स्ट की प्राथमिक भाषा</p>
            </div>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-black text-gray-800 outline-none focus:border-emerald-700"
            >
              <option value="hi">हिंदी (Hindi)</option>
              <option value="en">English (अंग्रेज़ी)</option>
            </select>
          </div>

          {/* Land Unit */}
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div>
              <p className="text-sm font-extrabold text-gray-900">जमीन नापने की इकाई (Land Unit)</p>
              <p className="text-[11px] text-gray-400 font-medium">खेत का क्षेत्रफल किस यूनिट में देखें</p>
            </div>
            <select
              value={settings.landUnit}
              onChange={(e) => setSettings({ ...settings, landUnit: e.target.value })}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-black text-gray-800 outline-none focus:border-emerald-700"
            >
              <option value="Acre">एकड़ (Acre)</option>
              <option value="Bigha">बीघा (Bigha)</option>
              <option value="Hectare">हेक्टेयर (Hectare)</option>
            </select>
          </div>

        </div>
      </div>

      {/* 🌟 2. Notifications & Live Alerts */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-700" />
          <span>नोटिफिकेशन व अलर्ट सेटिंग्स (Notifications)</span>
        </h3>

        <div className="space-y-4 text-xs font-bold text-gray-700">
          
          {/* Weather Alert */}
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div>
              <p className="text-sm font-extrabold text-gray-900">मौसम चेतावनी SMS (Weather SMS Alerts)</p>
              <p className="text-[11px] text-gray-400 font-medium">बारिश व ओलावृष्टि की समय पूर्व सूचना</p>
            </div>
            <input
              type="checkbox"
              checked={settings.weatherAlerts}
              onChange={() => handleToggle('weatherAlerts')}
              className="w-5 h-5 accent-[#1b5e20] cursor-pointer rounded-lg"
            />
          </div>

          {/* Mandi Bhav Push */}
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div>
              <p className="text-sm font-extrabold text-gray-900">दैनिक मंडी भाव अलर्ट (Mandi Price Push)</p>
              <p className="text-[11px] text-gray-400 font-medium">दैनिक मॉडल भाव में ₹100 से अधिक बदलाव पर सूचना</p>
            </div>
            <input
              type="checkbox"
              checked={settings.mandiPush}
              onChange={() => handleToggle('mandiPush')}
              className="w-5 h-5 accent-[#1b5e20] cursor-pointer rounded-lg"
            />
          </div>

          {/* Order SMS */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-extrabold text-gray-900">बीज ऑर्डर ट्रैकिंग SMS (Order SMS Updates)</p>
              <p className="text-[11px] text-gray-400 font-medium">डिलीवरी व डिस्पैच का रियल-टाइम SMS</p>
            </div>
            <input
              type="checkbox"
              checked={settings.orderSms}
              onChange={() => handleToggle('orderSms')}
              className="w-5 h-5 accent-[#1b5e20] cursor-pointer rounded-lg"
            />
          </div>

        </div>
      </div>

      {/* 🌟 3. AI & Diagnosis Engine */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-700" />
          <span>AI फसल डॉक्टर व GPS इंजन (AI & Hardware)</span>
        </h3>

        <div className="space-y-4 text-xs font-bold text-gray-700">
          
          {/* High Accuracy GPS */}
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div>
              <p className="text-sm font-extrabold text-gray-900">सटीक खेत GPS टैगिंग (High-Accuracy GPS)</p>
              <p className="text-[11px] text-gray-400 font-medium">फसल पिकअप के लिए 1-मीटर सटीक नेविगेशन</p>
            </div>
            <input
              type="checkbox"
              checked={settings.highAccuracyGps}
              onChange={() => handleToggle('highAccuracyGps')}
              className="w-5 h-5 accent-[#1b5e20] cursor-pointer rounded-lg"
            />
          </div>

          {/* AI Voice */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-extrabold text-gray-900">AI वॉयस गाइडेंस (Hindi Voice Assistant)</p>
              <p className="text-[11px] text-gray-400 font-medium">बीमारी के उपचार को हिंदी आवाज में सुनें</p>
            </div>
            <input
              type="checkbox"
              checked={settings.aiVoiceSupport}
              onChange={() => handleToggle('aiVoiceSupport')}
              className="w-5 h-5 accent-[#1b5e20] cursor-pointer rounded-lg"
            />
          </div>

        </div>
      </div>

      {/* 🌟 4. Storage, Cache & Account */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-700" />
          <span>डेटा व अकाउंट सेटिंग्स (Account & Storage)</span>
        </h3>

        <div className="space-y-3 pt-1">
          
          <button
            onClick={handleClearCache}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition"
          >
            <div>
              <p className="text-xs font-black text-gray-800">लोकल कैशे साफ करें (Clear Offline Cache)</p>
              <p className="text-[10px] text-gray-400 font-semibold">पुराने फोटो और ऑफलाइन मंडी भाव का डेटा हटाएं</p>
            </div>
            <Trash2 className="w-4 h-4 text-gray-500" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-left transition text-rose-800"
          >
            <div>
              <p className="text-xs font-black">खाता लॉगआउट करें (Logout Account)</p>
              <p className="text-[10px] text-rose-600 font-semibold">वर्तमान डिवाइस से सुरक्षित रूप से बाहर निकलें</p>
            </div>
            <LogOut className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* App Version Stamp */}
      <div className="text-center pt-2">
        <p className="text-[11px] font-bold text-gray-400">
          Smart Farmer Assistant • Version 2.4.0 (2026 Build)
        </p>
      </div>

    </div>
  );
}