


























// // import React, { useEffect, useState } from "react";
// // import { Link } from "react-router-dom";
// // import {
// //   Stethoscope,
// //   Bot,
// //   TrendingUp,
// //   Store,
// //   Sprout,
// //   PlusCircle,
// //   ShoppingBag,
// //   Bell,
// //   User,
// //   Settings,
// //   ArrowUpRight,
// //   Sparkles,
// //   CloudSun,
// //   ShieldCheck,
// //   ChevronRight,
// //   Droplets,
// //   Wind,
// //   MapPin,
// //   CalendarDays,
// //   IndianRupee,
// //   CheckCircle2,
// //   Wheat,
// //   Activity,
// //   Leaf,
// //   ScanLine,
// //   BarChart3,
// //   Pill,
// //   Camera,
// //   ShieldAlert,
// //   CircleCheck,
// //   ShoppingCart,
// //   Zap,
// //   HeartPulse,
// // } from "lucide-react";

// // import { doc, getDoc } from "firebase/firestore";
// // import { auth, db } from "../services/firebase";
// // import axios from "axios";

// // export default function Dashboard() {
// //   /* =====================================================
// //      USER
// //   ===================================================== */

// //   const [userName, setUserName] = useState(() => {
// //     return localStorage.getItem("farmerName") || "किसान साथी";
// //   });

// //   const [farmerData, setFarmerData] = useState({
// //     name: localStorage.getItem("farmerName") || "किसान साथी",

// //     location: "जबलपुर, मध्य प्रदेश",

// //     crop: {
// //       name: "शरबती गेहूं",
// //       englishName: "Sharbati Wheat",
// //       variety: "C-306",
// //       area: "6.5 एकड़",
// //       sowingDate: "15 जुलाई 2026",
// //       status: "उत्कृष्ट स्वास्थ्य",
// //       healthScore: 96,
// //       imageUrl:
// //         "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&auto=format&fit=crop&q=85",
// //     },

// //     mandiAlert: {
// //       crop: "Sharbati Wheat",
// //       currentPrice: "₹ 3,650",
// //       trend: "+5.2%",
// //       market: "Sehore Mandi",
// //     },
// //   });

// //   /* =====================================================
// //      WEATHER
// //   ===================================================== */

// //   const [liveWeather, setLiveWeather] = useState({
// //     temp: 29,
// //     condition: "Partly Sunny",
// //     humidity: 74,
// //     rainChance: 35,
// //     wind: 12,
// //     riskLevel: "Low",
// //     riskText:
// //       "मौसम फसलों के लिए अनुकूल है। नियमित सिंचाई और पोषण प्रबंधन बनाए रखें।",
// //   });

// //   /* =====================================================
// //      GREETING
// //   ===================================================== */

// //   const getGreeting = () => {
// //     const hour = new Date().getHours();

// //     if (hour < 12) return "सुप्रभात";
// //     if (hour < 17) return "शुभ दोपहर";
// //     return "शुभ संध्या";
// //   };

// //   /* =====================================================
// //      FIREBASE USER
// //   ===================================================== */

// //   useEffect(() => {
// //     const unsubscribe = auth.onAuthStateChanged(async (user) => {
// //       if (!user) return;

// //       const displayName =
// //         user.displayName ||
// //         user.phoneNumber ||
// //         user.email?.split("@")[0] ||
// //         localStorage.getItem("farmerName") ||
// //         "किसान साथी";

// //       setUserName(displayName);
// //       localStorage.setItem("farmerName", displayName);

// //       try {
// //         const docRef = doc(db, "farmers", user.uid);
// //         const docSnap = await getDoc(docRef);

// //         if (docSnap.exists()) {
// //           const data = docSnap.data();

// //           setFarmerData((prev) => ({
// //             ...prev,
// //             name: data.name || displayName,
// //             location: data.location || prev.location,
// //             crop: {
// //               ...prev.crop,
// //               ...(data.crop || {}),
// //             },
// //           }));
// //         }
// //       } catch (error) {
// //         console.warn("Firestore sync:", error);
// //       }
// //     });

// //     return () => unsubscribe();
// //   }, []);

// //   /* =====================================================
// //      WEATHER API
// //   ===================================================== */

// //   useEffect(() => {
// //     const fetchWeather = async () => {
// //       try {
// //         const response = await axios.get(
// //           "https://api.open-meteo.com/v1/forecast",
// //           {
// //             params: {
// //               latitude: 23.1815,
// //               longitude: 79.9864,
// //               current:
// //                 "temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation",
// //               timezone: "auto",
// //             },
// //           }
// //         );

// //         const curr = response.data?.current;

// //         if (!curr) return;

// //         const humidity = curr.relative_humidity_2m;

// //         setLiveWeather({
// //           temp: Math.round(curr.temperature_2m),

// //           condition:
// //             humidity > 75
// //               ? "Humid Weather"
// //               : "Favorable Weather",

// //           humidity,

// //           rainChance: Math.min(
// //             95,
// //             Math.round(curr.precipitation * 20)
// //           ),

// //           wind: Math.round(curr.wind_speed_10m),

// //           riskLevel:
// //             humidity > 80
// //               ? "Moderate"
// //               : "Low",

// //           riskText:
// //             humidity > 80
// //               ? "उच्च आर्द्रता के कारण पत्तियों पर फफूंद की निगरानी करें।"
// //               : "मौसम फसल के लिए अनुकूल है। नियमित सिंचाई प्रबंधन बनाए रखें।",
// //         });
// //       } catch (error) {
// //         console.warn("Weather API fallback:", error);
// //       }
// //     };

// //     fetchWeather();
// //   }, []);

// //   /* =====================================================
// //      CORE AI SERVICES
// //   ===================================================== */

// //   const coreServices = [
// //     {
// //       title: "AI Crop Doctor",
// //       hindi: "फसल रोग पहचान",
// //       desc:
// //         "पत्ती की फोटो स्कैन करें और AI से संभावित बीमारी, कारण और उपचार की जानकारी पाएं।",
// //       button: "Scan Leaf",
// //       link: "/crop-doctor",
// //       icon: Stethoscope,
// //       badge: "AI VISION",
// //       iconBox:
// //         "bg-emerald-50 text-emerald-700 border-emerald-200",
// //       buttonBg:
// //         "bg-emerald-700 hover:bg-emerald-800",
// //       featured: true,
// //     },

// //     {
// //       title: "Medicine Store",
// //       hindi: "दवाई और उपचार",
// //       desc:
// //         "फसल की बीमारी के अनुसार कृषि दवाइयां और उपचार उत्पाद खोजें।",
// //       button: "Buy Medicine",
// //       link: "/marketplace",
// //       icon: Pill,
// //       badge: "TREATMENT",
// //       iconBox:
// //         "bg-rose-50 text-rose-700 border-rose-200",
// //       buttonBg:
// //         "bg-rose-600 hover:bg-rose-700",
// //     },

// //     {
// //       title: "AI Kisan Assistant",
// //       hindi: "कृषि विशेषज्ञ",
// //       desc:
// //         "फसल, खाद, सिंचाई, कीट और सरकारी योजनाओं से जुड़े सवाल पूछें।",
// //       button: "Ask AI",
// //       link: "/ai-assistant",
// //       icon: Bot,
// //       badge: "24/7 AI",
// //       iconBox:
// //         "bg-violet-50 text-violet-700 border-violet-200",
// //       buttonBg:
// //         "bg-violet-700 hover:bg-violet-800",
// //     },

// //     {
// //       title: "Mandi Bhav",
// //       hindi: "आज का मंडी भाव",
// //       desc:
// //         "गेहूं, सोयाबीन, चना और अन्य फसलों के ताजा बाजार भाव देखें।",
// //       button: "View Rates",
// //       link: "/mandi-prices",
// //       icon: TrendingUp,
// //       badge: "LIVE",
// //       iconBox:
// //         "bg-amber-50 text-amber-700 border-amber-200",
// //       buttonBg:
// //         "bg-amber-600 hover:bg-amber-700",
// //     },
// //   ];

// //   /* =====================================================
// //      QUICK ACTIONS
// //   ===================================================== */

// //   const quickActions = [
// //     {
// //       title: "AI Scan",
// //       desc: "Disease Detection",
// //       link: "/crop-doctor",
// //       icon: ScanLine,
// //       featured: true,
// //     },

// //     {
// //       title: "दवाई खरीदें",
// //       desc: "Medicines",
// //       link: "/marketplace",
// //       icon: Pill,
// //       featured: true,
// //     },

// //     {
// //       title: "मेरी फसलें",
// //       desc: "Crops",
// //       link: "/crops",
// //       icon: Sprout,
// //     },

// //     {
// //       title: "मेरे ऑर्डर",
// //       desc: "Orders",
// //       link: "/orders",
// //       icon: ShoppingBag,
// //     },

// //     {
// //       title: "मौसम",
// //       desc: "Weather",
// //       link: "/weather",
// //       icon: CloudSun,
// //     },

// //     {
// //       title: "नोटिफिकेशन",
// //       desc: "Alerts",
// //       link: "/notifications",
// //       icon: Bell,
// //     },

// //     {
// //       title: "फसल बेचें",
// //       desc: "Sell Crop",
// //       link: "/sell-crop",
// //       icon: PlusCircle,
// //     },

// //     {
// //       title: "प्रोफाइल",
// //       desc: "Profile",
// //       link: "/profile",
// //       icon: User,
// //     },
// //   ];

// //   return (
// //     <div className="min-h-screen bg-[#f4f8f5] text-slate-900">
// //       <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-7 py-4 sm:py-7 pb-28">

// //         {/* =====================================================
// //             HERO / AI FIRST
// //         ===================================================== */}

// //         <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#043b2c] via-[#075c43] to-[#087b61] text-white shadow-2xl">

// //           {/* Background Decorations */}

// //           <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full bg-emerald-300/10 blur-3xl" />

// //           <div className="absolute -left-20 bottom-[-150px] w-96 h-96 rounded-full bg-teal-300/10 blur-3xl" />

// //           <div className="absolute right-[25%] top-10 w-20 h-20 rounded-full bg-white/5" />

// //           <div className="relative z-10 p-5 sm:p-8 lg:p-10">

// //             <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-center">

// //               {/* LEFT */}

// //               <div>

// //                 <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-black mb-4">

// //                   <Sparkles className="w-3.5 h-3.5 text-emerald-300" />

// //                   {getGreeting()} • SMART FARMER AI

// //                 </div>

// //                 <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">

// //                   नमस्ते,{" "}

// //                   <span className="text-emerald-300">
// //                     {userName}
// //                   </span>{" "}
// //                   👋
// //                 </h1>

// //                 <p className="mt-3 text-sm sm:text-base text-emerald-100 max-w-2xl leading-relaxed">

// //                   आपकी फसल में बीमारी दिखे?
// //                   <br className="sm:hidden" />

// //                   <span className="font-black text-white">
// //                     {" "}बस पत्ती की फोटो स्कैन करें।
// //                   </span>

// //                   {" "}AI संभावित बीमारी और उपचार की जानकारी देने में आपकी सहायता करेगा।

// //                 </p>

// //                 {/* Location */}

// //                 <div className="flex flex-wrap gap-2 mt-5">

// //                   <div className="flex items-center gap-2 text-[11px] font-bold bg-black/10 border border-white/10 px-3 py-2 rounded-xl">

// //                     <MapPin className="w-3.5 h-3.5 text-emerald-300" />

// //                     {farmerData.location}

// //                   </div>

// //                   <div className="flex items-center gap-2 text-[11px] font-bold bg-black/10 border border-white/10 px-3 py-2 rounded-xl">

// //                     <CalendarDays className="w-3.5 h-3.5 text-emerald-300" />

// //                     कृषि सत्र 2026–27

// //                   </div>

// //                 </div>

// //                 {/* DESKTOP ACTIONS */}

// //                 <div className="hidden sm:flex flex-wrap gap-3 mt-6">

// //                   <Link
// //                     to="/crop-doctor"
// //                     className="group flex items-center justify-center gap-2 bg-white text-emerald-950 px-6 py-3.5 rounded-2xl text-xs font-black shadow-xl hover:-translate-y-0.5 transition"
// //                   >
// //                     <ScanLine className="w-4 h-4" />

// //                     Scan Crop Leaf

// //                     <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
// //                   </Link>

// //                   <Link
// //                     to="/marketplace"
// //                     className="flex items-center justify-center gap-2 bg-rose-500/20 border border-rose-300/30 text-white px-6 py-3.5 rounded-2xl text-xs font-black hover:bg-rose-500/30 transition"
// //                   >
// //                     <Pill className="w-4 h-4" />

// //                     Buy Medicine
// //                   </Link>

// //                 </div>

// //               </div>

// //               {/* AI SCANNER VISUAL */}

// //               <div className="relative">

// //                 <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-black/20 backdrop-blur-md p-4">

// //                   <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/10 to-transparent" />

// //                   <div className="relative">

// //                     <div className="flex items-center justify-between mb-3">

// //                       <div className="flex items-center gap-2">

// //                         <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
// //                           <Camera className="w-4 h-4 text-emerald-200" />
// //                         </div>

// //                         <div>
// //                           <p className="text-[9px] text-emerald-300 font-black uppercase">
// //                             AI Computer Vision
// //                           </p>

// //                           <p className="text-xs font-black">
// //                             Crop Health Scanner
// //                           </p>
// //                         </div>

// //                       </div>

// //                       <span className="flex items-center gap-1 text-[9px] font-black text-emerald-300">
// //                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
// //                         READY
// //                       </span>

// //                     </div>

// //                     {/* Scanner Box */}

// //                     <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900 to-teal-950 border border-white/10">

// //                       <img
// //                         src={farmerData.crop.imageUrl}
// //                         alt="Crop"
// //                         className="absolute inset-0 w-full h-full object-cover opacity-55"
// //                       />

// //                       <div className="absolute inset-0 bg-black/25" />

// //                       {/* Scan Corners */}

// //                       <div className="absolute inset-5 border-2 border-emerald-300/70 rounded-xl" />

// //                       <div className="absolute left-5 right-5 top-1/2 h-px bg-emerald-300/80 shadow-[0_0_15px_rgba(110,231,183,0.9)] animate-pulse" />

// //                       <div className="absolute inset-0 flex items-center justify-center">

// //                         <div className="w-16 h-16 rounded-full bg-emerald-400/20 border border-emerald-200/40 flex items-center justify-center backdrop-blur">

// //                           <ScanLine className="w-8 h-8 text-emerald-200" />

// //                         </div>

// //                       </div>

// //                       <div className="absolute bottom-3 left-3 right-3 flex justify-between">

// //                         <span className="text-[9px] bg-black/50 backdrop-blur px-2 py-1 rounded-lg font-bold">
// //                           Leaf Analysis
// //                         </span>

// //                         <span className="text-[9px] bg-emerald-500/20 border border-emerald-300/20 px-2 py-1 rounded-lg text-emerald-200 font-bold">
// //                           AI READY
// //                         </span>

// //                       </div>

// //                     </div>

// //                     {/* MOBILE PRIMARY ACTION */}

// //                     <Link
// //                       to="/crop-doctor"
// //                       className="sm:hidden mt-3 w-full flex items-center justify-center gap-2 bg-white text-emerald-950 py-3.5 rounded-2xl text-xs font-black shadow-lg active:scale-[0.98]"
// //                     >
// //                       <ScanLine className="w-4 h-4" />
// //                       Scan Leaf with AI
// //                       <ArrowUpRight className="w-4 h-4" />
// //                     </Link>

// //                     <div className="grid grid-cols-2 gap-2 mt-3">

// //                       <Link
// //                         to="/crop-doctor"
// //                         className="flex items-center justify-center gap-1.5 bg-emerald-500/10 border border-emerald-300/20 py-2.5 rounded-xl text-[10px] font-black text-emerald-100"
// //                       >
// //                         <HeartPulse className="w-3.5 h-3.5" />
// //                         Check Health
// //                       </Link>

// //                       <Link
// //                         to="/marketplace"
// //                         className="flex items-center justify-center gap-1.5 bg-rose-500/10 border border-rose-300/20 py-2.5 rounded-xl text-[10px] font-black text-rose-100"
// //                       >
// //                         <Pill className="w-3.5 h-3.5" />
// //                         Buy Medicine
// //                       </Link>

// //                     </div>

// //                   </div>

// //                 </div>

// //               </div>

// //             </div>

// //           </div>
// //         </section>

// //         {/* =====================================================
// //             AI / HEALTH STAT STRIP
// //         ===================================================== */}

// //         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">

// //           <StatCard
// //             icon={Leaf}
// //             label="Crop Health"
// //             value={`${farmerData.crop.healthScore}%`}
// //             sub="Excellent"
// //           />

// //           <StatCard
// //             icon={ShieldCheck}
// //             label="Disease Status"
// //             value="Healthy"
// //             sub="AI Checked"
// //           />

// //           <StatCard
// //             icon={Pill}
// //             label="Treatment"
// //             value="Available"
// //             sub="Medicines"
// //           />

// //           <StatCard
// //             icon={Activity}
// //             label="Weather Risk"
// //             value={liveWeather.riskLevel}
// //             sub="Today"
// //           />

// //         </div>

// //         {/* =====================================================
// //             AI PRIORITY CARD
// //         ===================================================== */}

// //         <section className="mt-5">

// //           <div className="relative overflow-hidden rounded-[28px] bg-white border border-emerald-100 shadow-sm">

// //             <div className="absolute right-0 top-0 w-56 h-56 bg-emerald-50 rounded-full blur-3xl" />

// //             <div className="relative p-5 sm:p-6">

// //               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

// //                 <div className="flex gap-4">

// //                   <div className="shrink-0 w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">

// //                     <ScanLine className="w-6 h-6" />

// //                   </div>

// //                   <div>

// //                     <div className="flex flex-wrap items-center gap-2">

// //                       <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
// //                         AI Crop Health Check
// //                       </p>

// //                       <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-black">
// //                         RECOMMENDED
// //                       </span>

// //                     </div>

// //                     <h2 className="text-lg sm:text-xl font-black mt-1">
// //                       फसल में कोई दाग या पीलापन दिखाई दे रहा है?
// //                     </h2>

// //                     <p className="text-xs text-slate-500 font-medium mt-1 max-w-2xl">
// //                       पत्ती की साफ फोटो upload करें। AI आपको संभावित बीमारी,
// //                       severity और treatment की जानकारी देने में मदद करेगा।
// //                     </p>

// //                   </div>

// //                 </div>

// //                 <div className="flex flex-col sm:flex-row gap-2">

// //                   <Link
// //                     to="/crop-doctor"
// //                     className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-3 rounded-xl text-xs font-black transition shadow-sm"
// //                   >
// //                     <Camera className="w-4 h-4" />
// //                     Scan Leaf
// //                   </Link>

// //                   <Link
// //                     to="/marketplace"
// //                     className="flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-5 py-3 rounded-xl text-xs font-black transition"
// //                   >
// //                     <ShoppingCart className="w-4 h-4" />
// //                     Medicine Store
// //                   </Link>

// //                 </div>

// //               </div>

// //             </div>

// //           </div>

// //         </section>

// //         {/* =====================================================
// //             CROP + WEATHER
// //         ===================================================== */}

// //         <section className="grid lg:grid-cols-[1.5fr_1fr] gap-5 mt-5">

// //           {/* CROP */}

// //           <div className="bg-white border border-slate-200 rounded-[28px] p-5 sm:p-6 shadow-sm">

// //             <div className="flex justify-between items-center mb-5">

// //               <div className="flex items-center gap-3">

// //                 <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
// //                   <Wheat className="w-5 h-5" />
// //                 </div>

// //                 <div>

// //                   <p className="text-[10px] uppercase tracking-wider text-slate-400 font-black">
// //                     Active Crop
// //                   </p>

// //                   <h2 className="text-base font-black">
// //                     मेरी मुख्य फसल
// //                   </h2>

// //                 </div>

// //               </div>

// //               <Link
// //                 to="/crops"
// //                 className="text-xs font-bold text-emerald-700 flex items-center gap-1"
// //               >
// //                 View
// //                 <ChevronRight className="w-4 h-4" />
// //               </Link>

// //             </div>

// //             <div className="grid md:grid-cols-[1fr_230px] gap-5">

// //               <div>

// //                 <div className="flex items-start justify-between gap-3">

// //                   <div>

// //                     <h3 className="text-2xl font-black text-slate-900">
// //                       {farmerData.crop.name}
// //                     </h3>

// //                     <p className="text-xs text-slate-500 font-semibold mt-1">
// //                       {farmerData.crop.englishName}
// //                     </p>

// //                   </div>

// //                   <span className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-100">
// //                     HEALTHY
// //                   </span>

// //                 </div>

// //                 <div className="grid grid-cols-2 gap-3 mt-5">

// //                   <InfoBox
// //                     label="Variety"
// //                     value={farmerData.crop.variety}
// //                   />

// //                   <InfoBox
// //                     label="Farm Area"
// //                     value={farmerData.crop.area}
// //                   />

// //                   <InfoBox
// //                     label="Sowing Date"
// //                     value={farmerData.crop.sowingDate}
// //                   />

// //                   <InfoBox
// //                     label="Status"
// //                     value="Excellent"
// //                   />

// //                 </div>

// //                 <div className="mt-5">

// //                   <div className="flex justify-between mb-2">

// //                     <span className="text-xs font-bold text-slate-500">
// //                       Crop Health Score
// //                     </span>

// //                     <span className="text-xs font-black text-emerald-700">
// //                       {farmerData.crop.healthScore}%
// //                     </span>

// //                   </div>

// //                   <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

// //                     <div
// //                       className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
// //                       style={{
// //                         width: `${farmerData.crop.healthScore}%`,
// //                       }}
// //                     />

// //                   </div>

// //                   <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-700 font-bold">

// //                     <CheckCircle2 className="w-3.5 h-3.5" />

// //                     AI analysis के अनुसार फसल स्वस्थ है

// //                   </div>

// //                 </div>

// //               </div>

// //               <div className="relative min-h-[210px]">

// //                 <img
// //                   src={farmerData.crop.imageUrl}
// //                   alt="Wheat Farm"
// //                   className="absolute inset-0 w-full h-full object-cover rounded-2xl"
// //                 />

// //                 <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/70 via-transparent to-transparent" />

// //                 <div className="absolute top-3 right-3">

// //                   <span className="flex items-center gap-1 bg-emerald-500/90 text-white px-2.5 py-1 rounded-lg text-[9px] font-black">
// //                     <CircleCheck className="w-3 h-3" />
// //                     HEALTHY
// //                   </span>

// //                 </div>

// //                 <div className="absolute bottom-3 left-3 right-3">

// //                   <p className="text-white text-sm font-black">
// //                     🌾 Sharbati Wheat
// //                   </p>

// //                   <p className="text-white/70 text-[10px]">
// //                     Healthy Standing Crop
// //                   </p>

// //                 </div>

// //               </div>

// //             </div>

// //           </div>

// //           {/* WEATHER */}

// //           <div className="relative overflow-hidden bg-gradient-to-br from-[#064c3a] to-[#032f27] rounded-[28px] p-6 text-white shadow-lg">

// //             <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-emerald-300/10 blur-xl" />

// //             <div className="relative">

// //               <div className="flex justify-between items-center">

// //                 <div className="flex items-center gap-2">

// //                   <CloudSun className="w-5 h-5 text-emerald-300" />

// //                   <span className="text-xs font-black">
// //                     LIVE WEATHER
// //                   </span>

// //                 </div>

// //                 <span className="px-2.5 py-1 rounded-lg bg-emerald-400/10 border border-emerald-300/20 text-[10px] font-black text-emerald-200">
// //                   {liveWeather.riskLevel} RISK
// //                 </span>

// //               </div>

// //               <div className="mt-7 flex items-end gap-3">

// //                 <span className="text-6xl font-black tracking-tighter">
// //                   {liveWeather.temp}°
// //                 </span>

// //                 <div className="pb-2">

// //                   <p className="text-sm font-bold">
// //                     {liveWeather.condition}
// //                   </p>

// //                   <p className="text-[10px] text-emerald-200 mt-1">
// //                     Jabalpur, MP
// //                   </p>

// //                 </div>

// //               </div>

// //               <div className="grid grid-cols-3 gap-2 mt-7">

// //                 <WeatherStat
// //                   icon={Droplets}
// //                   label="Humidity"
// //                   value={`${liveWeather.humidity}%`}
// //                 />

// //                 <WeatherStat
// //                   icon={CloudSun}
// //                   label="Rain"
// //                   value={`${liveWeather.rainChance}%`}
// //                 />

// //                 <WeatherStat
// //                   icon={Wind}
// //                   label="Wind"
// //                   value={`${liveWeather.wind} km/h`}
// //                 />

// //               </div>

// //               <div className="mt-5 bg-black/20 border border-white/10 rounded-2xl p-3.5">

// //                 <p className="text-[11px] text-emerald-100 leading-relaxed">
// //                   💡 {liveWeather.riskText}
// //                 </p>

// //               </div>

// //               <Link
// //                 to="/weather"
// //                 className="flex items-center justify-between mt-4 text-xs font-black text-emerald-200 hover:text-white transition"
// //               >
// //                 <span>View 7-Day Forecast</span>
// //                 <ArrowUpRight className="w-4 h-4" />
// //               </Link>

// //             </div>

// //           </div>

// //         </section>

// //         {/* =====================================================
// //             MEDICINE + MANDI
// //         ===================================================== */}

// //         <section className="grid md:grid-cols-2 gap-5 mt-5">

// //           {/* MEDICINE */}

// //           <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-orange-50 border border-rose-100 rounded-[26px] p-5 shadow-sm">

// //             <div className="absolute right-[-30px] top-[-30px] w-32 h-32 rounded-full bg-rose-100/60 blur-2xl" />

// //             <div className="relative">

// //               <div className="flex items-center justify-between">

// //                 <div className="flex gap-3">

// //                   <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
// //                     <Pill className="w-5 h-5" />
// //                   </div>

// //                   <div>

// //                     <p className="text-[10px] text-rose-500 font-black uppercase">
// //                       Crop Treatment
// //                     </p>

// //                     <h3 className="font-black">
// //                       दवाई और उपचार
// //                     </h3>

// //                   </div>

// //                 </div>

// //                 <span className="text-[9px] bg-rose-100 text-rose-700 px-2 py-1 rounded-lg font-black">
// //                   FARM CARE
// //                 </span>

// //               </div>

// //               <p className="text-sm font-semibold text-slate-600 leading-relaxed mt-5">
// //                 AI से बीमारी पहचानने के बाद फसल के लिए जरूरी
// //                 कृषि दवाइयां और उपचार उत्पाद खोजें।
// //               </p>

// //               <div className="grid grid-cols-2 gap-2 mt-4">

// //                 <Link
// //                   to="/crop-doctor"
// //                   className="flex items-center justify-center gap-1.5 bg-white border border-rose-200 text-rose-700 rounded-xl py-3 text-[10px] font-black"
// //                 >
// //                   <ScanLine className="w-3.5 h-3.5" />
// //                   Scan First
// //                 </Link>

// //                 <Link
// //                   to="/marketplace"
// //                   className="flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-3 text-[10px] font-black transition"
// //                 >
// //                   <ShoppingCart className="w-3.5 h-3.5" />
// //                   Buy Medicine
// //                 </Link>

// //               </div>

// //             </div>

// //           </div>

// //           {/* MANDI */}

// //           <div className="bg-white border border-slate-200 rounded-[26px] p-5 shadow-sm">

// //             <div className="flex justify-between">

// //               <div className="flex gap-3">

// //                 <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
// //                   <BarChart3 className="w-5 h-5" />
// //                 </div>

// //                 <div>

// //                   <p className="text-[10px] text-slate-400 font-black uppercase">
// //                     Market Update
// //                   </p>

// //                   <h3 className="font-black">
// //                     आज का मंडी भाव
// //                   </h3>

// //                 </div>

// //               </div>

// //               <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg font-black h-fit">
// //                 {farmerData.mandiAlert.trend}
// //               </span>

// //             </div>

// //             <div className="flex items-end justify-between mt-6">

// //               <div>

// //                 <p className="text-xs text-slate-400 font-semibold">
// //                   {farmerData.mandiAlert.crop}
// //                 </p>

// //                 <p className="text-3xl font-black mt-1">

// //                   {farmerData.mandiAlert.currentPrice}

// //                   <span className="text-xs text-slate-400 font-bold ml-1">
// //                     / क्विंटल
// //                   </span>

// //                 </p>

// //               </div>

// //               <div className="text-right">

// //                 <p className="text-[10px] text-slate-400">
// //                   Market
// //                 </p>

// //                 <p className="text-xs font-black">
// //                   {farmerData.mandiAlert.market}
// //                 </p>

// //               </div>

// //             </div>

// //             <Link
// //               to="/mandi-prices"
// //               className="flex items-center justify-center gap-2 mt-5 w-full bg-slate-900 hover:bg-emerald-800 text-white rounded-xl py-3 text-xs font-black transition"
// //             >
// //               View Live Mandi Rates
// //               <ArrowUpRight className="w-4 h-4" />
// //             </Link>

// //           </div>

// //         </section>

// //         {/* =====================================================
// //             AI TOOLS
// //         ===================================================== */}

// //         <section className="mt-8">

// //           <div className="flex items-end justify-between mb-4">

// //             <div>

// //               <p className="text-[10px] text-emerald-700 font-black uppercase tracking-wider">
// //                 AI + FARM CARE
// //               </p>

// //               <h2 className="text-xl font-black mt-1">
// //                 स्मार्ट कृषि सेवाएं
// //               </h2>

// //             </div>

// //             <span className="hidden sm:block text-xs text-slate-400 font-bold">
// //               Disease • Treatment • AI
// //             </span>

// //           </div>

// //           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

// //             {coreServices.map((service, index) => {

// //               const Icon = service.icon;

// //               return (
// //                 <div
// //                   key={index}
// //                   className={`group bg-white border rounded-[26px] p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
// //                     service.featured
// //                       ? "border-emerald-200 ring-1 ring-emerald-50"
// //                       : "border-slate-200"
// //                   }`}
// //                 >

// //                   <div className="flex justify-between items-start">

// //                     <div
// //                       className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${service.iconBox}`}
// //                     >
// //                       <Icon className="w-6 h-6" />
// //                     </div>

// //                     <span className="text-[9px] font-black bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-slate-500">
// //                       {service.badge}
// //                     </span>

// //                   </div>

// //                   <h3 className="font-black text-base mt-5">
// //                     {service.title}
// //                   </h3>

// //                   <p className="text-xs text-slate-400 font-bold mt-1">
// //                     {service.hindi}
// //                   </p>

// //                   <p className="text-xs text-slate-500 leading-relaxed mt-3 min-h-[54px]">
// //                     {service.desc}
// //                   </p>

// //                   <Link
// //                     to={service.link}
// //                     className={`flex items-center justify-center gap-2 w-full mt-5 py-3 rounded-xl text-white text-xs font-black transition ${service.buttonBg}`}
// //                   >
// //                     {service.button}

// //                     <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
// //                   </Link>

// //                 </div>
// //               );
// //             })}

// //           </div>

// //         </section>

// //         {/* =====================================================
// //             QUICK SERVICES
// //         ===================================================== */}

// //         <section className="mt-8">

// //           <div className="flex items-end justify-between mb-4">

// //             <div>

// //               <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
// //                 Quick Access
// //               </p>

// //               <h2 className="text-xl font-black mt-1">
// //                 किसान पोर्टल हब
// //               </h2>

// //             </div>

// //             <span className="text-xs text-slate-400 font-bold">
// //               One Click
// //             </span>

// //           </div>

// //           <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">

// //             {quickActions.map((item, index) => {

// //               const Icon = item.icon;

// //               return (
// //                 <Link
// //                   key={index}
// //                   to={item.link}
// //                   className={`group rounded-2xl p-4 text-center transition-all hover:-translate-y-1 ${
// //                     item.featured
// //                       ? "bg-emerald-50 border border-emerald-200 shadow-sm"
// //                       : "bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-lg"
// //                   }`}
// //                 >

// //                   <div
// //                     className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center transition ${
// //                       item.featured
// //                         ? "bg-emerald-100 text-emerald-700"
// //                         : "bg-slate-50 group-hover:bg-emerald-50 text-slate-600 group-hover:text-emerald-700"
// //                     }`}
// //                   >

// //                     <Icon className="w-5 h-5" />

// //                   </div>

// //                   <p className="text-[11px] font-black mt-3">
// //                     {item.title}
// //                   </p>

// //                   <p className="text-[9px] text-slate-400 font-bold mt-0.5 line-clamp-1">
// //                     {item.desc}
// //                   </p>

// //                 </Link>
// //               );
// //             })}

// //           </div>

// //         </section>

// //         {/* =====================================================
// //             FINAL AI CTA
// //         ===================================================== */}

// //         <section className="relative overflow-hidden mt-8 rounded-[30px] bg-gradient-to-r from-[#043b2c] via-[#075c43] to-[#087b61] p-6 sm:p-8 text-white shadow-xl">

// //           <div className="absolute right-[-60px] top-[-100px] w-72 h-72 rounded-full border-[45px] border-white/5" />

// //           <div className="absolute left-[-80px] bottom-[-100px] w-56 h-56 rounded-full bg-emerald-300/10 blur-2xl" />

// //           <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">

// //             <div>

// //               <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1 rounded-full text-[10px] font-black">

// //                 <Sparkles className="w-3 h-3 text-emerald-300" />

// //                 AI COMPUTER VISION

// //               </div>

// //               <h2 className="text-xl sm:text-2xl font-black mt-3">
// //                 🌿 फसल में बीमारी दिखे तो इंतजार न करें
// //               </h2>

// //               <p className="text-xs sm:text-sm text-emerald-100 mt-2 max-w-2xl leading-relaxed">
// //                 पत्ती की फोटो AI Crop Doctor में upload करें।
// //                 संभावित बीमारी की पहचान करें और फिर
// //                 उपलब्ध उपचार व कृषि दवाइयों को देखें।
// //               </p>

// //               <div className="flex flex-wrap gap-2 mt-4">

// //                 <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-lg text-[9px] font-bold">
// //                   <ScanLine className="w-3 h-3" />
// //                   AI Scan
// //                 </span>

// //                 <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-lg text-[9px] font-bold">
// //                   <ShieldAlert className="w-3 h-3" />
// //                   Disease Detection
// //                 </span>

// //                 <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-lg text-[9px] font-bold">
// //                   <Pill className="w-3 h-3" />
// //                   Treatment
// //                 </span>

// //               </div>

// //             </div>

// //             <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">

// //               <Link
// //                 to="/crop-doctor"
// //                 className="bg-white text-emerald-950 hover:bg-emerald-50 px-6 py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg transition"
// //               >

// //                 <ScanLine className="w-4 h-4" />

// //                 Scan Crop Leaf

// //                 <ArrowUpRight className="w-4 h-4" />

// //               </Link>

// //               <Link
// //                 to="/marketplace"
// //                 className="bg-rose-500/20 border border-rose-300/30 hover:bg-rose-500/30 px-6 py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition"
// //               >

// //                 <Pill className="w-4 h-4" />

// //                 Buy Medicine

// //               </Link>

// //             </div>

// //           </div>

// //         </section>

// //       </div>
// //     </div>
// //   );
// // }

// // /* =====================================================
// //    STAT CARD
// // ===================================================== */

// // function StatCard({
// //   icon: Icon,
// //   label,
// //   value,
// //   sub,
// // }) {
// //   return (
// //     <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition">

// //       <div className="flex items-center gap-3">

// //         <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
// //           <Icon className="w-5 h-5" />
// //         </div>

// //         <div className="min-w-0">

// //           <p className="text-[9px] uppercase font-black text-slate-400">
// //             {label}
// //           </p>

// //           <div className="flex items-center gap-2 mt-0.5">

// //             <p className="text-lg font-black truncate">
// //               {value}
// //             </p>

// //             <span className="text-[9px] font-black text-emerald-600 truncate">
// //               {sub}
// //             </span>

// //           </div>

// //         </div>

// //       </div>

// //     </div>
// //   );
// // }

// // /* =====================================================
// //    INFO BOX
// // ===================================================== */

// // function InfoBox({ label, value }) {
// //   return (
// //     <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">

// //       <p className="text-[9px] uppercase text-slate-400 font-black">
// //         {label}
// //       </p>

// //       <p className="text-xs font-black text-slate-700 mt-1">
// //         {value}
// //       </p>

// //     </div>
// //   );
// // }

// // /* =====================================================
// //    WEATHER STAT
// // ===================================================== */

// // function WeatherStat({
// //   icon: Icon,
// //   label,
// //   value,
// // }) {
// //   return (
// //     <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">

// //       <Icon className="w-4 h-4 mx-auto text-emerald-300 mb-1.5" />

// //       <p className="text-[9px] text-emerald-300 font-bold">
// //         {label}
// //       </p>

// //       <p className="text-xs font-black mt-0.5">
// //         {value}
// //       </p>

// //     </div>
// //   );
// // }









// import React, { useEffect, useState } from "react";
// import { useLanguage } from '../context/LanguageContext';
// import { Link } from "react-router-dom";
// import {
//   ScanLine,
//   CloudSun,
//   ShoppingCart,
//   Bot,
//   ShieldCheck,
//   CheckCircle2,
//   AlertTriangle,
//   Camera,
//   ArrowUpRight,
//   Zap,
//   MapPin,
//   Pill,
//   PlusCircle,
//   TrendingUp,
//   Activity,
//   Droplets,
//   Wind
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { doc, getDoc } from "firebase/firestore";
// import { onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
// import { auth, db } from "../services/firebase";
// import axios from "axios";
// import Footer from "../components/Footer";

// // High-Definition Real Farm Backgrounds
// const heroBackgrounds = [
//   "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&auto=format&fit=crop&q=90", // Golden Wheat Harvest
//   "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&auto=format&fit=crop&q=90", // Lush Green Aerial Farmland
//   "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1920&auto=format&fit=crop&q=90", // Tractor in sunset field
//   "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=1920&auto=format&fit=crop&q=90"  // Sugarcane & Organic field
// ];

// export default function Dashboard() {
//   const { t } = useLanguage();
//   const [userName, setUserName] = useState(() => localStorage.getItem("farmerName") || "किसान साथी");
//   const [currentBgIndex, setCurrentBgIndex] = useState(0);

//   const [farmerData, setFarmerData] = useState({
//     name: localStorage.getItem("farmerName") || "किसान साथी",
//     location: "जबलपुर, मध्य प्रदेश",
//     crop: {
//       name: "शरबती गेहूं",
//       variety: "C-306 Grade-A",
//       area: "6.5 एकड़",
//       healthScore: 96,
//       sowingDate: "Nov 2025",
//       stage: "दाने भरने की अवस्था (Grain Filling)"
//     },
//   });

//   const [liveWeather, setLiveWeather] = useState({
//     temp: 28,
//     condition: "Clear Sky",
//     humidity: 58,
//     wind: 11,
//     riskLevel: "Low Risk",
//   });

//   // Background Rotation
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentBgIndex((prev) => (prev + 1) % heroBackgrounds.length);
//     }, 6000);
//     return () => clearInterval(timer);
//   }, []);

//   // Auth Persistence & Firestore Sync
//   useEffect(() => {
//     setPersistence(auth, browserLocalPersistence).catch(() => {});
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         const name = user.displayName || user.phoneNumber || user.email?.split("@")[0] || "किसान साथी";
//         setUserName(name);
//         localStorage.setItem("farmerName", name);

//         try {
//           const docSnap = await getDoc(doc(db, "farmers", user.uid));
//           if (docSnap.exists()) {
//             const data = docSnap.data();
//             setFarmerData((prev) => ({
//               ...prev,
//               name: data.name || name,
//               location: data.location || prev.location,
//               crop: { ...prev.crop, ...(data.crop || {}) },
//             }));
//           }
//         } catch (e) {
//           console.warn("Firestore sync skipped:", e);
//         }
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   // Live Weather
//   useEffect(() => {
//     axios
//       .get("https://api.open-meteo.com/v1/forecast?latitude=23.1815&longitude=79.9864&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto")
//       .then((res) => {
//         const curr = res.data?.current;
//         if (curr) {
//           setLiveWeather({
//             temp: Math.round(curr.temperature_2m),
//             condition: curr.relative_humidity_2m > 75 ? "Humid / Fog" : "Clear Sunshine",
//             humidity: curr.relative_humidity_2m,
//             wind: Math.round(curr.wind_speed_10m),
//             riskLevel: curr.relative_humidity_2m > 80 ? "High Fungus Risk" : "Low Crop Risk",
//           });
//         }
//       })
//       .catch(() => {});
//   }, []);

//   const coreTools = [
//     { title: "AI Crop Doctor", desc: "Instant Leaf Pathology & Cures", path: "/crop-doctor", icon: ScanLine, tag: "AI Vision" },
//     { title: "Agri Marketplace", desc: "Certified Seeds & Crop Medicines", path: "/marketplace", icon: Pill, tag: "Store" },
//     { title: "Sell Harvest & Mandi", desc: "MSP Mandi Slots & Farmgate Pickup", path: "/sell-crop", icon: PlusCircle, tag: "Trade" },
//     { title: "Weather & Spray Radar", desc: "Rain probability & Wind Forecast", path: "/weather", icon: CloudSun, tag: "Live Radar" },
//     { title: "Kisan Mitra AI", desc: "24/7 Voice & Agronomist Assistant", path: "/ai-assistant", icon: Bot, tag: "Assistant" },
//     { title: "Consignment Orders", desc: "Live Shipment & Vehicle Tracking", path: "/orders", icon: ShoppingCart, tag: "Logistics" },
//   ];

//   return (
//     <div className="w-full min-h-screen bg-[#f8faf9] text-slate-900 font-sans">
      
//       {/* =========================================================================
//           1. HERO SECTION WITH CLEAR VISIBLE BACKGROUNDS & LASER SCANNER
//       ========================================================================= */}
//       <section className="relative w-full min-h-[720px] lg:min-h-[780px] flex items-center justify-center overflow-hidden bg-slate-950 text-white">
        
//         {/* Crisp Crossfading HD Backgrounds */}
//         <AnimatePresence mode="sync">
//           <motion.div
//             key={currentBgIndex}
//             initial={{ opacity: 0, scale: 1.05 }}
//             animate={{ opacity: 0.72, scale: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 1.8, ease: "easeInOut" }}
//             className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
//             style={{ backgroundImage: `url('${heroBackgrounds[currentBgIndex]}')` }}
//           />
//         </AnimatePresence>

//         {/* Subtle Vignette Gradient: Visible Background with Readable Text */}
//         <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
//         <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f8faf9] via-[#f8faf9]/70 to-transparent pointer-events-none" />

//         {/* Hero Content */}
//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
//           <div className="grid lg:grid-cols-[1.15fr_440px] gap-10 lg:gap-14 items-center">
            
//             {/* Left Narrative */}
//             <div className="space-y-6">
              
//               <div className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-md">
//                 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
//                 <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
//                   Smart AI Agriculture Platform
//                 </span>
//                 <span className="text-xs text-slate-300 font-bold border-l border-white/20 pl-2.5">
//                   10,000+ Kisan Network
//                 </span>
//               </div>

//               <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white drop-shadow-md">
//                 Smart Farming <br />
//                 <span className="text-emerald-400">Powered by AI</span> <br />
//                 Crop Intelligence.
//               </h1>

//               <p className="text-sm sm:text-base text-slate-200 max-w-lg leading-relaxed font-medium drop-shadow-sm">
//                 Real-time leaf disease diagnosis, certified seeds & medicine marketplace, automated Mandi slot booking, and hyper-local spray weather advisories.
//               </p>

//               {/* Farmer Profile Status Bar */}
//               <div className="flex flex-wrap items-center gap-2.5 pt-1">
//                 <div className="flex items-center gap-2 text-xs font-bold bg-slate-900/80 border border-white/20 px-3.5 py-2 rounded-xl backdrop-blur-md text-slate-200">
//                   <MapPin className="w-3.5 h-3.5 text-emerald-400" />
//                   <span>{farmerData.location}</span>
//                 </div>

//                 <div className="flex items-center gap-2 text-xs font-bold bg-slate-900/80 border border-white/20 px-3.5 py-2 rounded-xl backdrop-blur-md text-slate-200">
//                   <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
//                   <span>सत्यापित किसान: {userName}</span>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-wrap items-center gap-3.5 pt-2">
//                 <Link
//                   to="/crop-doctor"
//                   className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-7 py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-emerald-900/40 transition active:scale-95"
//                 >
//                   <ScanLine className="w-4 h-4" />
//                   <span>Scan Crop Leaf Now</span>
//                 </Link>

//                 <Link
//                   to="/marketplace"
//                   className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white px-7 py-3.5 rounded-2xl text-xs font-black backdrop-blur-md transition active:scale-95"
//                 >
//                   <ShoppingCart className="w-4 h-4" />
//                   <span>Buy Seeds & Sprays</span>
//                 </Link>
//               </div>

//               {/* Mini Guarantees */}
//               <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-300 font-bold">
//                 <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 98% AI Precision</span>
//                 <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-emerald-400" /> Instant Diagnosis</span>
//                 <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> ICAR Certified Advice</span>
//               </div>

//             </div>

//             {/* Right: Glassmorphism Live Scanner Hologram */}
//             <motion.div
//               animate={{ 
//                 y: [0, -10, 0],
//               }}
//               transition={{ 
//                 duration: 6, 
//                 repeat: Infinity, 
//                 ease: "easeInOut" 
//               }}
//               className="w-full max-w-md mx-auto"
//             >
//               <div className="bg-white/95 backdrop-blur-xl text-slate-900 rounded-3xl p-6 shadow-2xl border border-white/40 space-y-4">
                
//                 <div className="flex items-center justify-between border-b border-slate-100 pb-3">
//                   <div className="flex items-center gap-2">
//                     <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
//                     <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
//                       Live AI Pathology Radar
//                     </h3>
//                   </div>
//                   <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
//                     Ready to Scan
//                   </span>
//                 </div>

//                 {/* Camera Viewport Simulation */}
//                 <div className="relative h-60 rounded-2xl overflow-hidden bg-black border border-slate-200 group">
//                   <img
//                     src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=85"
//                     alt="Tomato Leaf Diagnosis"
//                     className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
//                   />

//                   {/* Laser Scan Sweep */}
//                   <motion.div
//                     animate={{ y: [0, 230, 0] }}
//                     transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
//                     className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_18px_#34d399] pointer-events-none z-10"
//                   />

//                   {/* Central Reticle Box */}
//                   <div className="absolute inset-4 border-2 border-dashed border-white/70 rounded-xl pointer-events-none flex items-center justify-center">
//                     <motion.div
//                       animate={{ scale: [1, 1.12, 1] }}
//                       transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//                       className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg"
//                     >
//                       <Camera className="w-6 h-6 text-white" />
//                     </motion.div>
//                   </div>
//                 </div>

//                 {/* Immediate Detection Preview Card */}
//                 <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between">
//                   <div className="flex items-center gap-2.5">
//                     <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
//                     <div>
//                       <h4 className="text-xs font-black text-slate-900">Early Blight / पत्ती झुलसा Detected</h4>
//                       <p className="text-[10px] text-slate-500 font-bold">Severity: Moderate • Confidence: 94%</p>
//                     </div>
//                   </div>
//                   <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">
//                     Urgent
//                   </span>
//                 </div>

//                 <Link
//                   to="/crop-doctor"
//                   className="w-full bg-slate-900 hover:bg-black text-white py-3.5 rounded-2xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 active:scale-95"
//                 >
//                   <CheckCircle2 className="w-4 h-4 text-emerald-400" />
//                   <span>Start Live Leaf Diagnostics</span>
//                 </Link>

//               </div>
//             </motion.div>

//           </div>
//         </div>
//       </section>

//       {/* =========================================================================
//           2. REAL-TIME FARM METRICS STRIP
//       ========================================================================= */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
//         <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          
//           <div className="flex items-center gap-3.5 p-2">
//             <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
//               <Activity className="w-5 h-5" />
//             </div>
//             <div>
//               <span className="text-[10px] font-bold uppercase text-slate-400 block">सक्रिय फसल (Crop)</span>
//               <span className="text-sm font-black text-slate-900">{farmerData.crop.name}</span>
//               <span className="text-[10px] text-emerald-700 font-bold block">{farmerData.crop.healthScore}% Health Score</span>
//             </div>
//           </div>

//           <div className="flex items-center gap-3.5 p-2">
//             <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
//               <Droplets className="w-5 h-5" />
//             </div>
//             <div>
//               <span className="text-[10px] font-bold uppercase text-slate-400 block">खेत का रकबा व आर्द्रता</span>
//               <span className="text-sm font-black text-slate-900">{farmerData.crop.area}</span>
//               <span className="text-[10px] text-slate-500 font-bold block">नमी: {liveWeather.humidity}%</span>
//             </div>
//           </div>

//           <div className="flex items-center gap-3.5 p-2">
//             <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
//               <CloudSun className="w-5 h-5" />
//             </div>
//             <div>
//               <span className="text-[10px] font-bold uppercase text-slate-400 block">लाइव मौसम (Radar)</span>
//               <span className="text-sm font-black text-slate-900">{liveWeather.temp}°C, {liveWeather.condition}</span>
//               <span className="text-[10px] text-emerald-700 font-bold block">{liveWeather.riskLevel}</span>
//             </div>
//           </div>

//           <div className="flex items-center gap-3.5 p-2">
//             <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
//               <TrendingUp className="w-5 h-5" />
//             </div>
//             <div>
//               <span className="text-[10px] font-bold uppercase text-slate-400 block">फसल वृद्धि चरण</span>
//               <span className="text-sm font-black text-slate-900 truncate block max-w-[150px]">{farmerData.crop.stage}</span>
//               <span className="text-[10px] text-slate-500 font-bold block">बुवाई: {farmerData.crop.sowingDate}</span>
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* =========================================================================
//           3. COMPLETE 6-MODULE APPLICATION SUITE
//       ========================================================================= */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
//           <div>
//             <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
//               किसान सेवा केंद्र (Agricultural Super Suite)
//             </h2>
//             <p className="text-xs text-slate-500 font-medium">
//               Every tool engineered for precision yields, zero middleman mandi sales, and crop protection.
//             </p>
//           </div>
//           <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
//             6 Integrated Services
//           </span>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {coreTools.map((tool, idx) => {
//             const Icon = tool.icon;
//             return (
//               <motion.div
//                 key={idx}
//                 whileHover={{ y: -4 }}
//                 transition={{ duration: 0.2 }}
//                 className="bg-white border border-slate-200/90 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-xl transition group"
//               >
//                 <Link to={tool.path} className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-emerald-800 transition-colors shadow-sm">
//                       <Icon className="w-6 h-6" />
//                     </div>
//                     <span className="text-[10px] font-black uppercase bg-slate-50 text-slate-500 px-2.5 py-1 rounded-lg border border-slate-100">
//                       {tool.tag}
//                     </span>
//                   </div>

//                   <div>
//                     <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
//                       {tool.title}
//                     </h3>
//                     <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
//                       {tool.desc}
//                     </p>
//                   </div>
//                 </Link>

//                 <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-slate-400 group-hover:text-slate-900 transition">
//                   <span>Open Portal</span>
//                   <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       </section>

//       {/* Reusable Clean Footer Component */}
//       <Footer />

//     </div>
//   );
// }






















import React, { useEffect, useState } from "react";
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from "react-router-dom";
import {
  ScanLine,
  CloudSun,
  ShoppingCart,
  Bot,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Camera,
  ArrowUpRight,
  Zap,
  MapPin,
  Pill,
  PlusCircle,
  TrendingUp,
  Activity,
  Droplets,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth, db } from "../services/firebase";
import axios from "axios";
import Footer from "../components/Footer";

// 10 Vibrant / Elegant Background Palettes jo har 1 second me rotate honge
const dynamicLightColors = [
  "#f0fdf4", // Emerald 50
  "#eff6ff", // Blue 50
  "#fefce8", // Yellow 50
  "#fdf4ff", // Fuchsia 50
  "#f0fdfa", // Teal 50
  "#fff7ed", // Orange 50
  "#faf5ff", // Purple 50
  "#ecfeff", // Cyan 50
  "#f7fee7", // Lime 50
  "#f8fafc", // Slate 50
];

const dynamicDarkColors = [
  "#061412", // Deep Emerald Night
  "#091224", // Deep Navy
  "#141206", // Dark Amber
  "#14081c", // Dark Purple Plum
  "#041416", // Deep Teal
  "#1c0e06", // Dark Rust
  "#0f091f", // Deep Violet
  "#06141a", // Deep Cyan Midnight
  "#0c1606", // Deep Moss
  "#080c14", // Deep Obsidian Slate
];

export default function Dashboard() {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const [userName, setUserName] = useState(() => localStorage.getItem("farmerName") || "किसान साथी");
  const [colorIndex, setColorIndex] = useState(0);

  // Har 1 Second (1000ms) me background color change timer
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % 10);
    }, 1000);
    return () => clearInterval(colorInterval);
  }, []);

  const [farmerData, setFarmerData] = useState({
    name: localStorage.getItem("farmerName") || "किसान साथी",
    location: "जबलपुर, मध्य प्रदेश",
    crop: {
      name: "शरबती गेहूं",
      variety: "C-306 Grade-A",
      area: "6.5 एकड़",
      healthScore: 96,
      sowingDate: "Nov 2025",
      stage: "दाने भरने की अवस्था (Grain Filling)"
    },
  });

  const [liveWeather, setLiveWeather] = useState({
    temp: 28,
    condition: "Clear Sky",
    humidity: 58,
    wind: 11,
    riskLevel: "Low Risk",
  });

  // Auth Persistence & Firestore Sync
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(() => {});
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const name = user.displayName || user.phoneNumber || user.email?.split("@")[0] || "किसान साथी";
        setUserName(name);
        localStorage.setItem("farmerName", name);

        try {
          const docSnap = await getDoc(doc(db, "farmers", user.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFarmerData((prev) => ({
              ...prev,
              name: data.name || name,
              location: data.location || prev.location,
              crop: { ...prev.crop, ...(data.crop || {}) },
            }));
          }
        } catch (e) {
          console.warn("Firestore sync skipped:", e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Live Weather API
  useEffect(() => {
    axios
      .get("https://api.open-meteo.com/v1/forecast?latitude=23.1815&longitude=79.9864&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto")
      .then((res) => {
        const curr = res.data?.current;
        if (curr) {
          setLiveWeather({
            temp: Math.round(curr.temperature_2m),
            condition: curr.relative_humidity_2m > 75 ? "Humid / Fog" : "Clear Sunshine",
            humidity: curr.relative_humidity_2m,
            wind: Math.round(curr.wind_speed_10m),
            riskLevel: curr.relative_humidity_2m > 80 ? "High Fungus Risk" : "Low Crop Risk",
          });
        }
      })
      .catch(() => {});
  }, []);

  // Public/image folder me save kiye gaye paths
  const coreTools = [
    {
      title: "AI Crop Doctor",
      desc: "Instant Leaf Pathology, Pixel Heatmap & Exact Spray Cures",
      path: "/crop-doctor",
      icon: ScanLine,
      tag: "AI Vision",
      bgImage: "/image/aiscan.jpg",
      accentGradient: "from-emerald-600/30 via-slate-950/80 to-slate-950/95",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
    },
    {
      title: "Agri Marketplace",
      desc: "Certified Bio-Medicines, Seeds & Organic Formulations",
      path: "/marketplace",
      icon: Pill,
      tag: "Store",
      bgImage: "/image/agrimarket.jpg",
      accentGradient: "from-rose-600/30 via-slate-950/80 to-slate-950/95",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-400/30"
    },
    {
      title: "Sell Harvest & Mandi",
      desc: "Live MSP Rates, Mandi Gate Booking & Direct Bulk Trades",
      path: "/sell-crop",
      icon: PlusCircle,
      tag: "Trade",
      bgImage: "/image/sell.jpg",
      accentGradient: "from-amber-600/30 via-slate-950/80 to-slate-950/95",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/30"
    },
    {
      title: "Weather & Spray Radar",
      desc: "Microclimate Rain Windows & Rainfastness Risk Advisories",
      path: "/weather",
      icon: CloudSun,
      tag: "Live Radar",
      bgImage: "/image/weather.jpg",
      accentGradient: "from-cyan-600/30 via-slate-950/80 to-slate-950/95",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30"
    },
    {
      title: "Kisan Mitra AI & Community",
      desc: "24/7 Voice Agronomist & 2 KM Peer Outbreak Alerts",
      path: "/community",
      icon: Bot,
      tag: "Community",
      bgImage: "/image/kisanmantra.jpg",
      accentGradient: "from-purple-600/30 via-slate-950/80 to-slate-950/95",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/30"
    },
    {
      title: "Consignment Logistics",
      desc: "Real-time Vehicle Tracking & Farmgate Dispatch Verification",
      path: "/orders",
      icon: ShoppingCart,
      tag: "Logistics",
      bgImage: "/image/const.jpg",
      accentGradient: "from-blue-600/30 via-slate-950/80 to-slate-950/95",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/30"
    },
  ];

  const activeBgColor = isDarkMode ? dynamicDarkColors[colorIndex] : dynamicLightColors[colorIndex];

  return (
    <div 
      style={{ backgroundColor: activeBgColor }}
      className={`w-full min-h-screen transition-colors duration-1000 ease-in-out font-sans ${
        isDarkMode ? "text-white" : "text-slate-900"
      }`}
    >
      
      {/* 1. HERO SECTION */}
      <section className={`relative w-full py-14 sm:py-20 border-b transition-colors duration-500 ${
        isDarkMode ? "border-slate-800/80" : "border-slate-200/80"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.15fr_440px] gap-10 lg:gap-14 items-center">
            
            {/* Left Narrative */}
            <div className="space-y-6">
              <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border backdrop-blur-md shadow-xs ${
                isDarkMode 
                  ? "bg-slate-900/60 border-slate-700 text-slate-200" 
                  : "bg-white/80 border-emerald-200 text-emerald-900"
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Smart AI Agriculture Platform
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold border-l border-slate-300 dark:border-slate-700 pl-2.5">
                  10,000+ Kisan Network
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Smart Farming <br />
                <span className="text-emerald-600 dark:text-emerald-400">Powered by AI</span> <br />
                Crop Intelligence.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed font-medium">
                Real-time leaf disease diagnosis, certified seeds & medicine marketplace, automated Mandi slot booking, and hyper-local spray weather advisories.
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <div className={`flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl border backdrop-blur-sm ${
                  isDarkMode 
                    ? "bg-slate-900/70 border-slate-800 text-slate-200" 
                    : "bg-white/80 border-slate-200 text-slate-800"
                }`}>
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{farmerData.location}</span>
                </div>

                <div className={`flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl border backdrop-blur-sm ${
                  isDarkMode 
                    ? "bg-slate-900/70 border-slate-800 text-slate-200" 
                    : "bg-white/80 border-slate-200 text-slate-800"
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>सत्यापित किसान: {userName}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/crop-doctor"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 rounded-2xl text-xs font-black shadow-md transition active:scale-95"
                >
                  <ScanLine className="w-4 h-4" />
                  <span>Scan Crop Leaf Now</span>
                </Link>

                <Link
                  to="/marketplace"
                  className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-xs font-black border transition active:scale-95 backdrop-blur-sm ${
                    isDarkMode 
                      ? "bg-slate-800/80 hover:bg-slate-700 text-white border-slate-700" 
                      : "bg-white/80 hover:bg-white text-slate-900 border-slate-300"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Buy Seeds & Sprays</span>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-500 dark:text-slate-400 font-bold">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 98% AI Precision</span>
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-emerald-500" /> Instant Diagnosis</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> ICAR Certified Advice</span>
              </div>
            </div>

            {/* Right Interactive Card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="w-full max-w-md mx-auto"
            >
              <div className={`rounded-3xl p-6 shadow-xl border backdrop-blur-md space-y-4 ${
                isDarkMode 
                  ? "bg-slate-900/90 border-slate-800 text-white" 
                  : "bg-white/95 border-slate-200 text-slate-900"
              }`}>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <h3 className="text-xs font-black uppercase tracking-wider">
                      Live AI Pathology Radar
                    </h3>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                    isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"
                  }`}>
                    Ready to Scan
                  </span>
                </div>

                <div className="relative h-60 rounded-2xl overflow-hidden bg-black border border-slate-300 dark:border-slate-800 group">
                  <img
                    src="/image/gana.jpg"
                    alt="Leaf Diagnosis"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />

                  <motion.div
                    animate={{ y: [0, 230, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_18px_#34d399] pointer-events-none z-10"
                  />

                  <div className="absolute inset-4 border-2 border-dashed border-white/70 rounded-xl pointer-events-none flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className={`border p-3.5 rounded-2xl flex items-center justify-between ${
                  isDarkMode 
                    ? "bg-slate-950/60 border-slate-800" 
                    : "bg-slate-50 border-slate-200"
                }`}>
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-black">Early Blight / पत्ती झुलसा Detected</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Severity: Moderate • Confidence: 94%</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.5 rounded-md">
                    Urgent
                  </span>
                </div>

                <Link
                  to="/crop-doctor"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-2xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Start Live Leaf Diagnostics</span>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. REAL-TIME FARM METRICS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`rounded-3xl border p-6 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x backdrop-blur-md transition-colors duration-500 ${
          isDarkMode 
            ? "bg-slate-900/80 border-slate-800 divide-slate-800/80" 
            : "bg-white/80 border-slate-200 divide-slate-200/80"
        }`}>
          <div className="flex items-center gap-3.5 p-2">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isDarkMode ? "bg-emerald-950/50 text-emerald-400" : "bg-emerald-50 text-emerald-700"
            }`}>
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">सक्रिय फसल (Crop)</span>
              <span className="text-sm font-black">{farmerData.crop.name}</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">{farmerData.crop.healthScore}% Health Score</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isDarkMode ? "bg-blue-950/50 text-blue-400" : "bg-blue-50 text-blue-700"
            }`}>
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">खेत का रकबा व आर्द्रता</span>
              <span className="text-sm font-black">{farmerData.crop.area}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">नमी: {liveWeather.humidity}%</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isDarkMode ? "bg-amber-950/50 text-amber-400" : "bg-amber-50 text-amber-600"
            }`}>
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">लाइव मौसम (Radar)</span>
              <span className="text-sm font-black">{liveWeather.temp}°C, {liveWeather.condition}</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">{liveWeather.riskLevel}</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isDarkMode ? "bg-purple-950/50 text-purple-400" : "bg-slate-100 text-slate-700"
            }`}>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">फसल वृद्धि चरण</span>
              <span className="text-sm font-black truncate block max-w-[150px]">{farmerData.crop.stage}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">बुवाई: {farmerData.crop.sowingDate}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC SUPER SUITE WITH LOCAL IMAGES FROM /image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
          <div className="space-y-1">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-1 ${
              isDarkMode ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40" : "bg-emerald-100 text-emerald-800"
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
              <span>Real Indian Agriculture Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              किसान सेवा केंद्र (Autonomous Super Modules)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Precision disease diagnosis, direct MSP mandi trading, and continuous community radar.
            </p>
          </div>
          <span className={`text-xs font-black px-4 py-2 rounded-2xl border self-start sm:self-auto ${
            isDarkMode 
              ? "bg-slate-800 text-emerald-400 border-slate-700" 
              : "bg-white/80 text-emerald-800 border-emerald-200 shadow-2xs"
          }`}>
            6 AI Systems Active
          </span>
        </div>

        {/* Dynamic Interactive Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreTools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -7, scale: 1.02 }}
                className="relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between min-h-[310px] bg-slate-950"
              >
                {/* 1. Zooming Photo Background from public/image */}
                <motion.div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{ backgroundImage: `url('${tool.bgImage}')` }}
                />

                {/* 2. Glassmorphism Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-b ${tool.accentGradient} backdrop-blur-[1px] group-hover:backdrop-blur-0 transition-all duration-500`} />

                {/* 3. Card Top Header */}
                <div className="relative z-10 p-6 flex items-start justify-between">
                  <motion.div 
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-13 h-13 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center shadow-lg group-hover:bg-emerald-500 group-hover:border-emerald-400 transition-colors duration-300"
                  >
                    <Icon className="w-6 h-6 stroke-[2.5]" />
                  </motion.div>
                  
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border backdrop-blur-md shadow-2xs ${tool.badgeColor}`}>
                    {tool.tag}
                  </span>
                </div>

                {/* 4. Card Bottom Content */}
                <div className="relative z-10 p-6 pt-0 space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors duration-200 flex items-center gap-1.5">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed mt-1.5 line-clamp-2">
                      {tool.desc}
                    </p>
                  </div>

                  <Link 
                    to={tool.path}
                    className="pt-3 border-t border-white/20 flex items-center justify-between text-xs font-black text-slate-200 group-hover:text-white transition-colors"
                  >
                    <span className="tracking-wide">सक्रिय करें (Open Portal)</span>
                    <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 shadow-sm">
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </Link>
                </div>

                {/* 5. Glowing Border Effect on Hover */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-emerald-400/40 pointer-events-none transition-colors duration-300" />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}