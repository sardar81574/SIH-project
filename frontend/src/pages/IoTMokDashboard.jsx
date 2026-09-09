// import React, { useState, useEffect } from "react";
// import {
//   Activity,
//   BatteryCharging,
//   Thermometer,
//   Droplets,
//   Sprout,
//   Camera,
//   AlertTriangle,
//   CheckCircle2,
//   RefreshCw,
//   Radio,
//   Bug,
//   ShieldAlert,
//   Layers
// } from "lucide-react";
// import axios from "axios";

// export default function IoTMokDashboard() {
//   const [deviceData, setDeviceData] = useState({
//     device_id: "ESP32_KHET_SEHORE_01",
//     status: "Online",
//     battery_level: 94.5,
//     temperature: 31.2,
//     humidity: 68.0,
//     soil_moisture: 42.5,
//     last_sync: "Just now"
//   });

//   const [pestData, setPestData] = useState({
//     pest_count: 14,
//     severity: "High",
//     action_required: true,
//     recommendation: "क्लोरांट्रानिलिप्रोल (Coragen) @ 6ml प्रति 15L पंप का छिड़काव करें।",
//     trap_image: null,
//     processed_image: null
//   });

//   const [loading, setLoading] = useState(false);
//   const [autoSync, setAutoSync] = useState(true);

//   const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

//   // Backend se Live Dashboard Data Fetch karna
//   const fetchDashboardData = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/api/iot/dashboard-data`);
//       if (res.data) {
//         if (res.data.devices && res.data.devices.length > 0) {
//           const dev = res.data.devices[0];
//           setDeviceData((prev) => ({
//             ...prev,
//             ...dev,
//             last_sync: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
//           }));
//         }
//         if (res.data.latest_detection) {
//           setPestData(res.data.latest_detection);
//         }
//       }
//     } catch (err) {
//       // Backend disconnected fallback simulation
//       console.warn("Backend connect nahi hua, demo values dikhayi ja rahi hain:", err);
//     }
//   };

//   // Manual Trigger: Simulated Snapshot aur Detection
//   const handleTriggerCapture = async () => {
//     setLoading(true);
//     try {
//       // Agar simulator ya direct test run karna ho
//       await fetchDashboardData();
//     } finally {
//       setTimeout(() => setLoading(false), 800);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//     let interval;
//     if (autoSync) {
//       interval = setInterval(fetchDashboardData, 5000); // Har 5 second me live updates
//     }
//     return () => clearInterval(interval);
//   }, [autoSync]);

//   return (
//     <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 font-sans">
//       {/* 1. Header with Live Status Indicator */}
//       <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
//             <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
//             <span>ESP32-CAM Smart Pest Node (Live)</span>
//           </div>
//           <h1 className="text-2xl font-black tracking-tight">स्मार्ट कीट निगरानी व खेत टेलीमेट्री</h1>
//           <p className="text-xs text-slate-400">डिवाइस आईडी: {deviceData.device_id} • 2 KM कम्युनिटी नेटवर्क से कनेक्टेड</p>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setAutoSync(!autoSync)}
//             className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
//               autoSync ? "bg-emerald-800/80 border-emerald-600 text-emerald-100" : "bg-slate-800 border-slate-700 text-slate-400"
//             }`}
//           >
//             {autoSync ? "🔴 ऑटो-सिंक ऑन" : "ऑटो-सिंक रुका"}
//           </button>

//           <button
//             onClick={handleTriggerCapture}
//             disabled={loading}
//             className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md transition active:scale-95 disabled:opacity-50"
//           >
//             <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
//             <span>लाइव स्कैन रिफ्रेश</span>
//           </button>
//         </div>
//       </div>

//       {/* 2. Sensor Telemetry Grid */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {/* Battery */}
//         <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
//           <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 rounded-xl">
//             <BatteryCharging className="w-6 h-6" />
//           </div>
//           <div>
//             <span className="text-[11px] font-bold text-slate-400 uppercase block">सोलर बैटरी</span>
//             <span className="text-lg font-black text-slate-900 dark:text-white">{deviceData.battery_level}%</span>
//           </div>
//         </div>

//         {/* Temperature */}
//         <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
//           <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-xl">
//             <Thermometer className="w-6 h-6" />
//           </div>
//           <div>
//             <span className="text-[11px] font-bold text-slate-400 uppercase block">तापमान</span>
//             <span className="text-lg font-black text-slate-900 dark:text-white">{deviceData.temperature}°C</span>
//           </div>
//         </div>

//         {/* Humidity */}
//         <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
//           <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-xl">
//             <Droplets className="w-6 h-6" />
//           </div>
//           <div>
//             <span className="text-[11px] font-bold text-slate-400 uppercase block">वायु आर्द्रता</span>
//             <span className="text-lg font-black text-slate-900 dark:text-white">{deviceData.humidity}%</span>
//           </div>
//         </div>

//         {/* Soil Moisture */}
//         <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
//           <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-xl">
//             <Sprout className="w-6 h-6" />
//           </div>
//           <div>
//             <span className="text-[11px] font-bold text-slate-400 uppercase block">मिट्टी की नमी</span>
//             <span className="text-lg font-black text-slate-900 dark:text-white">{deviceData.soil_moisture}%</span>
//           </div>
//         </div>
//       </div>

//       {/* 3. Main Camera & Pest Computer Vision Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Left 2 Cols: Sticky Trap Vision Feed */}
//         <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
//           <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
//             <div className="flex items-center gap-2">
//               <Camera className="w-5 h-5 text-emerald-600" />
//               <h3 className="font-black text-sm text-slate-900 dark:text-white">येलो स्टिकी ट्रैप - ऑप्टिकल विजन फीड</h3>
//             </div>
//             <span className="text-[11px] text-slate-400 font-semibold">सिंक समय: {deviceData.last_sync}</span>
//           </div>

//           <div className="relative bg-slate-950 rounded-2xl overflow-hidden min-h-[300px] flex items-center justify-center p-4">
//             {pestData.trap_image ? (
//               <img
//                 src={pestData.trap_image}
//                 alt="Live Trap Feed"
//                 className="max-h-[320px] w-full object-contain rounded-xl"
//               />
//             ) : (
//               /* Simulated Graphic Trap when no image is loaded */
//               <div className="w-full h-64 bg-amber-300 rounded-xl relative overflow-hidden flex flex-col justify-between p-4 shadow-inner border-4 border-amber-400">
//                 <div className="flex justify-between items-center text-amber-950 text-xs font-black">
//                   <span>STICKY TRAP MATRIX #A1</span>
//                   <span className="bg-amber-950/20 px-2 py-0.5 rounded">OPENCV CONTOURS ACTIVE</span>
//                 </div>

//                 {/* Simulated pest specks */}
//                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                   <div className="w-3 h-3 bg-stone-900 rounded-full absolute top-12 left-20 ring-2 ring-rose-500 animate-ping" />
//                   <div className="w-2.5 h-3.5 bg-stone-900 rounded-full absolute top-24 right-32 ring-2 ring-rose-500" />
//                   <div className="w-3 h-2 bg-stone-900 rounded-full absolute bottom-16 left-36 ring-2 ring-rose-500" />
//                   <div className="w-4 h-4 bg-stone-900 rounded-full absolute bottom-20 right-20 ring-2 ring-rose-500" />
//                   <div className="w-2 h-2 bg-stone-900 rounded-full absolute top-1/2 left-1/2 ring-2 ring-rose-500" />
//                 </div>

//                 <div className="text-center bg-black/60 backdrop-blur-xs text-white p-2 rounded-xl text-xs font-bold w-fit mx-auto">
//                   कंप्यूटर विजन ट्रैप एक्टिव • {pestData.pest_count} कीट पहचाने गए
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="grid grid-cols-2 gap-3 text-center">
//             <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
//               <span className="text-[10px] uppercase font-bold text-slate-400 block">कुल कीट गिनती (Pest Count)</span>
//               <span className="text-xl font-black text-rose-600 flex items-center justify-center gap-1 mt-0.5">
//                 <Bug className="w-5 h-5" />
//                 {pestData.pest_count} कीट/ट्रैप
//               </span>
//             </div>
//             <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
//               <span className="text-[10px] uppercase font-bold text-slate-400 block">जोखिम स्तर (Severity)</span>
//               <span className={`text-xl font-black mt-0.5 block ${
//                 pestData.severity === "High" ? "text-rose-600" : "text-emerald-600"
//               }`}>
//                 {pestData.severity === "High" ? "⚠️ गंभीर (High)" : "सामान्य (Normal)"}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Right 1 Col: Automated Alert & Action Recommendation */}
//         <div className="space-y-4">
//           {/* Outbreak Status Card */}
//           <div className={`p-5 rounded-3xl border space-y-3 ${
//             pestData.action_required 
//               ? "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-950 dark:text-rose-100" 
//               : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-950"
//           }`}>
//             <div className="flex items-center gap-2">
//               {pestData.action_required ? (
//                 <ShieldAlert className="w-5 h-5 text-rose-600" />
//               ) : (
//                 <CheckCircle2 className="w-5 h-5 text-emerald-600" />
//               )}
//               <h4 className="font-black text-sm">
//                 {pestData.action_required ? "कीट प्रकोप चेतावनी (Threshold Exceeded)" : "सुरक्षित स्तर (Safe Limits)"}
//               </h4>
//             </div>

//             <p className="text-xs leading-relaxed opacity-90">
//               {pestData.action_required
//                 ? `पीले चिपचिपे ट्रैप पर कीटों की संख्या थ्रेशोल्ड (10 कीट) पार कर चुकी है। 2 KM किसान कम्युनिटी में अलर्ट भेजा गया है।`
//                 : `वर्तमान में खेत में कीटों की संख्या सुरक्षित सीमा के भीतर है। नियमित निगरानी जारी रखें।`}
//             </p>

//             {pestData.action_required && (
//               <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-800 space-y-1">
//                 <span className="text-[10px] font-bold text-slate-400 uppercase block">अनुशंसित स्प्रे उपचार:</span>
//                 <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 block">
//                   {pestData.recommendation}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Quick Hardware Diagnostics */}
//           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-3 shadow-sm">
//             <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">हार्डवेयर हेल्थ डायग्नोस्टिक्स</h4>
            
//             <div className="space-y-2 text-xs">
//               <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
//                 <span className="text-slate-500 font-medium">कैमरा मॉड्यूल (OV2640)</span>
//                 <span className="font-bold text-emerald-600">सक्रिय (OK)</span>
//               </div>
//               <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
//                 <span className="text-slate-500 font-medium">Wi-Fi / LoRa सिग्नल</span>
//                 <span className="font-bold text-slate-900 dark:text-white">-68 dBm (उत्कृष्ट)</span>
//               </div>
//               <div className="flex justify-between items-center py-1.5">
//                 <span className="text-slate-500 font-medium">ऑटो-क्लीनर वाइपर</span>
//                 <span className="font-bold text-blue-600">स्टैंडबाय</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






import React, { useState, useEffect, useRef } from "react";
import {
  Activity,
  BatteryCharging,
  Thermometer,
  Droplets,
  Sprout,
  Camera,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Radio,
  Bug,
  ShieldAlert,
  Smartphone,
  Wifi,
  Play,
  FlipHorizontal,
  Layers
} from "lucide-react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../services/firebase";

// 10 Dynamic Shifting Color Palettes
const dynamicLightColors = [
  "#f0fdf4", "#eff6ff", "#fefce8", "#fdf4ff", "#f0fdfa",
  "#fff7ed", "#faf5ff", "#ecfeff", "#f7fee7", "#f8fafc",
];

const dynamicDarkColors = [
  "#061412", "#091224", "#141206", "#14081c", "#041416",
  "#1c0e06", "#0f091f", "#06141a", "#0c1606", "#080c14",
];

export default function IoTMokDashboard() {
  const { isDarkMode } = useTheme();
  const [colorIndex, setColorIndex] = useState(0);

  // 1-Sec Color Rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % 10);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Telemetry States
  const [deviceData, setDeviceData] = useState({
    device_id: "ESP32_KHET_SEHORE_01",
    status: "Online",
    battery_level: 94.5,
    temperature: 31.2,
    humidity: 68.0,
    soil_moisture: 42.5,
    last_sync: "Just now"
  });

  const [pestData, setPestData] = useState({
    pest_count: 0,
    severity: "Normal",
    action_required: false,
    recommendation: "निगरानी चालू है। कैमरा चालू करके स्कैन करें।",
    timestamp: "Live"
  });

  const [loading, setLoading] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  // Camera Mode: 'ip_stream' | 'mobile_webcam'
  const [cameraMode, setCameraMode] = useState("ip_stream");

  // IP Camera Stream State & Detection Preview
  const [ipAddress, setIpAddress] = useState("http://10.240.226.117:8080/video");
  const [detectedImage, setDetectedImage] = useState(null);
  const [ipScanning, setIpScanning] = useState(false);
  const [streamError, setStreamError] = useState("");
  const [streamKey, setStreamKey] = useState(Date.now());

  // Built-in Mobile Camera States
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");

  // 2 KM Area Active Mobiles Radar State
  const [activeMobilesCount, setActiveMobilesCount] = useState(4);
  const [activeFarmers] = useState([
    { name: "सुरेश पटेल (Mobile Online)", distance: "0.4 KM" },
    { name: "राजेश वर्मा (Mobile Online)", distance: "0.8 KM" },
    { name: "दिनेश यादव (Mobile Online)", distance: "1.2 KM" }
  ]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  // 1. Fetch Backend IoT Telemetry
  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/iot/dashboard-data`);
      if (res.data) {
        if (res.data.devices && res.data.devices.length > 0) {
          const dev = res.data.devices[0];
          setDeviceData((prev) => ({
            ...prev,
            ...dev,
            last_sync: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
          }));
        }
        if (res.data.latest_detection) {
          setPestData(res.data.latest_detection);
        }
      }
    } catch (err) {
      console.warn("Telemetry fallback active:", err);
    }
  };

  // 2. Sync Active Mobiles in 2 KM from Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, "farmers"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          setActiveMobilesCount(Math.max(snapshot.size, 3));
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Presence sync fallback active:", e);
    }
  }, []);

  // Telemetry Polling
  useEffect(() => {
    fetchDashboardData();
    let interval;
    if (autoSync) {
      interval = setInterval(fetchDashboardData, 5000);
    }
    return () => clearInterval(interval);
  }, [autoSync]);

  // 3. IP Camera Stream Scanner Execution
  const handleScanIPStream = async () => {
    if (!ipAddress.trim()) {
      setStreamError("कृपया वैध IP Stream URL दर्ज करें");
      return;
    }
    setStreamError("");
    setIpScanning(true);

    try {
      const res = await axios.post(`${API_BASE}/api/iot/ip-camera-scan`, {
        stream_url: ipAddress.trim(),
        latitude: 22.7196,
        longitude: 75.8577
      });
      if (res.data) {
        setPestData(res.data);
        if (res.data.annotated_image) {
          setDetectedImage(res.data.annotated_image);
        }
      }
    } catch (err) {
      console.error(err);
      setStreamError(err.response?.data?.detail || "कैमरा IP से कनेक्ट नहीं हो सका।");
    } finally {
      setIpScanning(false);
    }
  };

  // 4. Mobile Native Camera Controls
  const startMobileCamera = async (mode = facingMode) => {
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
      alert("कैमरा चालू नहीं हो सका। ब्राउज़र पर कैमरा परमिशन Allow करें।");
    }
  };

  const stopMobileCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
  };

  const toggleCameraFacing = () => {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    startMobileCamera(next);
  };

  const captureMobilePestFrame = () => {
    if (!videoRef.current || !canvasRef.current || loading) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      setLoading(true);

      const formData = new FormData();
      formData.append("file", blob, "mobile_pest_snap.jpg");
      formData.append("device_id", "MOBILE_OPTICAL_SCANNER");
      formData.append("latitude", "22.7196");
      formData.append("longitude", "75.8577");

      try {
        const res = await axios.post(`${API_BASE}/api/iot/pest-detect`, formData);
        if (res.data) {
          setPestData(res.data);
        }
      } catch (err) {
        console.error(err);
        alert("Pest Detection सर्वर से कनेक्ट नहीं हो सका।");
      } finally {
        setLoading(false);
      }
    }, "image/jpeg", 0.90);
  };

  useEffect(() => {
    return () => {
      stopMobileCamera();
    };
  }, []);

  const activeBgColor = isDarkMode ? dynamicDarkColors[colorIndex] : dynamicLightColors[colorIndex];

  return (
    <div
      style={{ backgroundColor: activeBgColor }}
      className={`min-h-screen p-4 sm:p-7 font-sans pb-28 transition-colors duration-1000 ease-in-out ${
        isDarkMode ? "text-white" : "text-slate-900"
      }`}
    >
      <canvas ref={canvasRef} className="hidden" />

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* 1. Header with Live Status Indicator */}
        <div className={`p-6 rounded-3xl border shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors duration-500 backdrop-blur-md ${
          isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/90 border-slate-200 text-slate-900"
        }`}>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Smart IoT Pest & Multi-Camera Surveillance Node</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">स्मार्ट कीट निगरानी, खेत टेलीमेट्री व लाइव कैमरा</h1>
            <p className="text-xs text-slate-400">
              नोड आईडी: {deviceData.device_id} • 2 KM कम्युनिटी रडार व IP कैमरा स्ट्रीम एक्टिव
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setAutoSync(!autoSync)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                autoSync
                  ? "bg-emerald-600/30 border-emerald-500 text-emerald-300"
                  : "bg-slate-800 border-slate-700 text-slate-400"
              }`}
            >
              {autoSync ? "🔴 ऑटो-सिंक ऑन" : "ऑटो-सिंक रुका"}
            </button>

            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>टेलीमेट्री रिफ्रेश</span>
            </button>
          </div>
        </div>

        {/* 2. Top Sensor Telemetry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <div className={`p-4 rounded-2xl border shadow-xs flex items-center gap-3 backdrop-blur-sm ${
            isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/85 border-slate-200"
          }`}>
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">2 KM सक्रिय फोन</span>
              <span className="text-lg font-black text-blue-500">{activeMobilesCount} किसान लाइव</span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border shadow-xs flex items-center gap-3 backdrop-blur-sm ${
            isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/85 border-slate-200"
          }`}>
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <BatteryCharging className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">सोलर बैटरी</span>
              <span className="text-lg font-black text-emerald-500">{deviceData.battery_level}%</span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border shadow-xs flex items-center gap-3 backdrop-blur-sm ${
            isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/85 border-slate-200"
          }`}>
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
              <Thermometer className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">तापमान</span>
              <span className="text-lg font-black text-amber-500">{deviceData.temperature}°C</span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border shadow-xs flex items-center gap-3 backdrop-blur-sm ${
            isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/85 border-slate-200"
          }`}>
            <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">वायु आर्द्रता</span>
              <span className="text-lg font-black text-cyan-500">{deviceData.humidity}%</span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border shadow-xs flex items-center gap-3 backdrop-blur-sm col-span-2 md:col-span-1 ${
            isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/85 border-slate-200"
          }`}>
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">मिट्टी की नमी</span>
              <span className="text-lg font-black text-indigo-500">{deviceData.soil_moisture}%</span>
            </div>
          </div>
        </div>

        {/* 3. Dual-Mode Camera Vision Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className={`lg:col-span-7 p-6 rounded-3xl border shadow-md space-y-4 backdrop-blur-md ${
            isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/95 border-slate-200"
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-500" />
                <h3 className="font-black text-sm">ऑप्टिकल विजन व कीट डिटेक्शन</h3>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => {
                    setCameraMode("ip_stream");
                    stopMobileCamera();
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                    cameraMode === "ip_stream"
                      ? "bg-cyan-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  IP/CCTV स्ट्रीम
                </button>
                <button
                  onClick={() => {
                    setCameraMode("mobile_webcam");
                    startMobileCamera();
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                    cameraMode === "mobile_webcam"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  मोबाइल/वेबकैम
                </button>
              </div>
            </div>

            {cameraMode === "ip_stream" ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">
                    Camera Stream URL (मोबाइल IP Webcam या CCTV RTSP):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={ipAddress}
                      onChange={(e) => setIpAddress(e.target.value)}
                      placeholder="http://10.240.226.117:8080/video"
                      className={`flex-1 px-3.5 py-2 rounded-xl border text-xs font-mono font-semibold outline-none ${
                        isDarkMode 
                          ? "bg-slate-950 border-slate-800 text-white focus:border-cyan-500" 
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-800"
                      }`}
                    />
                    <button
                      onClick={handleScanIPStream}
                      disabled={ipScanning}
                      className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50 shrink-0"
                    >
                      {ipScanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
                      <span>स्कैन करें</span>
                    </button>
                  </div>
                </div>

                {streamError && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{streamError}</span>
                  </div>
                )}

                {/* Viewport: Live Stream or AI-detected Bounding Box Preview */}
                <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 aspect-video flex items-center justify-center">
                  <img
                    key={streamKey}
                    src={detectedImage || ipAddress}
                    alt="Live Stream & Detection"
                    className="w-full h-full object-contain relative z-10"
                    onError={(e) => {
                      if (!detectedImage && ipAddress.endsWith("/video")) {
                        e.target.src = ipAddress.replace("/video", "/shot.jpg");
                      }
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-0">
                    <Radio className="w-8 h-8 text-cyan-400 mb-2 animate-pulse opacity-60" />
                    <span className="text-[10px] text-slate-400 font-bold bg-black/60 px-3 py-1 rounded-full">
                      IP Stream Viewport (Ready)
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 aspect-video flex items-center justify-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

                  <div className="absolute inset-8 border-2 border-dashed border-cyan-400/60 rounded-xl pointer-events-none flex items-center justify-center">
                    <span className="text-[10px] font-black text-cyan-300 bg-black/60 px-2.5 py-1 rounded-full uppercase">
                      पत्ती या कीट को बॉक्स में रखें
                    </span>
                  </div>

                  <button
                    onClick={toggleCameraFacing}
                    className="absolute top-3 right-3 p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition z-10"
                  >
                    <FlipHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={captureMobilePestFrame}
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Camera className="w-4 h-4" />
                  <span>{loading ? "कीट विश्लेषण जारी..." : "फोटो लें व मच्छर/कीट काउंट करें"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Action & 2 KM Presence Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`p-5 rounded-3xl border space-y-3 shadow-sm ${
              pestData.action_required
                ? "bg-rose-950/40 border-rose-800 text-white"
                : isDarkMode ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bug className="w-5 h-5 text-rose-500" />
                  <span className="text-xs font-black uppercase">लाइव कीट व मच्छर गणना</span>
                </div>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                  pestData.action_required
                    ? "bg-rose-600 text-white border-rose-500"
                    : "bg-emerald-600 text-white border-emerald-500"
                }`}>
                  {pestData.severity || "Normal"}
                </span>
              </div>

              <div>
                <span className="text-3xl font-black">{pestData.pest_count} कीट/मच्छर</span>
                <span className="text-xs text-slate-400 block mt-0.5">
                  {pestData.action_required ? "⚠️ थ्रेशोल्ड सीमा से अधिक" : "सुरक्षित स्तर पर"}
                </span>
              </div>

              <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                isDarkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <strong className="text-emerald-400 block">सटीक कीटनाशक सलाह:</strong>
                <p className="text-slate-300 font-medium">{pestData.recommendation}</p>
              </div>
            </div>

            <div className={`p-5 rounded-3xl border space-y-3 shadow-sm ${
              isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <h3 className="text-xs font-black uppercase text-slate-400 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  <span>2 KM दायरे में सक्रिय किसान फोन</span>
                </h3>
                <span className="text-[10px] font-black bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                  {activeMobilesCount} एक्टिव
                </span>
              </div>

              <div className="space-y-2">
                {activeFarmers.map((f, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                      isDarkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-bold">{f.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{f.distance}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-3xl border space-y-2 shadow-xs text-xs ${
              isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 font-medium">कैमरा मॉड्यूल (OV2640 / RTSP)</span>
                <span className="font-black text-emerald-500">सक्रिय (OK)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 font-medium">Wi-Fi / LoRa सिग्नल</span>
                <span className="font-black text-cyan-400">-68 dBm (उत्कृष्ट)</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}