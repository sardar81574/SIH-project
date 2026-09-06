// import React, { useState, useEffect } from "react";
// import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
// import {
//   Home,
//   ScanLine,
//   CloudSun,
//   ShoppingCart,
//   Bot,
//   User,
//   LogIn,
//   Pill,
//   ShieldAlert,
//   Sprout,
//   MapPin,
//   Sparkles,
//   Menu,
//   X,
//   ArrowLeft,
//   ChevronRight,
//   PlusCircle,
//   ShoppingBag,
//   ChevronDown,
//   Layers,
//   ShieldCheck,
//   Bell,
//   Users,
//   Sun,
//   Moon,
//   Languages
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../services/firebase";
// import { useTheme } from "../context/ThemeContext";
// import { useLanguage } from "../context/LanguageContext";

// // Authorized Super Admin Email
// const ADMIN_EMAIL = ["sardardhakad81@gmail.com","katariyavishal74@gmail.com"];

// export default function Navbar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
//   const [user, setUser] = useState(null);

//   // Day/Night & Multi-Language Global Context Hooks
//   const { isDarkMode, toggleTheme } = useTheme();
//   const { lang, toggleLanguage, t } = useLanguage();

//   // Check if current route is Crop Doctor / AI Scan page
//   const isScanRoute = location.pathname.startsWith("/crop-doctor");

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   const closeMenu = () => {
//     setMobileMenuOpen(false);
//     setMoreDropdownOpen(false);
//   };

//   const isAdmin = user && user.email === ADMIN_EMAIL;

//   /* -------------------------------------------------------------
//      1. PRIMARY NAVBAR LINKS (Main Desktop Bar)
//   ------------------------------------------------------------- */
//   const defaultNavLinks = [
//     { name: lang === "hi" ? "डैशबोर्ड" : "Dashboard", path: "/", icon: Home },
//     { name: lang === "hi" ? "AI स्कैन" : "AI Scan", path: "/crop-doctor", icon: ScanLine, highlight: true },
//     { name: lang === "hi" ? "फसल व दवाइयां" : "Buy Crop & Medicine", path: "/marketplace", icon: ShoppingCart },
//     { name: lang === "hi" ? "फसल बेचें" : "Sell Crop", path: "/sell-crop", icon: PlusCircle,  },
//     { name: lang === "hi" ? "मौसम" : "Weather", path: "/weather", icon: CloudSun },
//     { name: lang === "hi" ? "किसान चौपाल" : "Community", path: "/community", icon: Users, },
//     { name: lang === "hi" ? "AI सहायक" : "AI Assistant", path: "/ai-assistant", icon: Bot },
//   ];

//   /* -------------------------------------------------------------
//      2. SECONDARY LINKS (Desktop "More" Dropdown + Mobile Drawer)
//   ------------------------------------------------------------- */
//   const extraNavLinks = [
//     { name: lang === "hi" ? "मेरी फसलें (My Crops)" : "My Crops", path: "/crops", icon: Sprout },
//     { name: lang === "hi" ? "मेरे ऑर्डर (My Orders)" : "My Orders", path: "/orders", icon: ShoppingBag },
//     { name: lang === "hi" ? "सूचनाएं (Alerts)" : "Activity Alerts", path: "/notifications", icon: Bell },
//   ];

//   /* -------------------------------------------------------------
//      3. DYNAMIC AI SCAN MODE NAVBAR (Jab AI Scan open ho)
//   ------------------------------------------------------------- */
//   const scanSubLinks = [
//     {
//       name: "Buy Medicine",
//       hindi: "दवाइयां खरीदें",
//       path: "/marketplace",
//       icon: Pill,
//       color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60",
//     },
//     {
//       name: "Bimari & Upchar",
//       hindi: "रोग व सटीक उपाय",
//       path: "/crop-doctor#treatment",
//       icon: ShieldAlert,
//       color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60",
//     },
//     {
//       name: "Healthy Crops",
//       hindi: "स्वस्थ फसल मानक",
//       path: "/crops",
//       icon: Sprout,
//       color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60",
//     },
//     {
//       name: "Sell Harvest",
//       hindi: "फसल बेचें व मंडी स्लॉट",
//       path: "/sell-crop",
//       icon: PlusCircle,
//       color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60",
//     },
//     {
//       name: "Area & Kendra",
//       hindi: "नजदीकी केंद्र व दुकानें",
//       path: "/marketplace#locations",
//       icon: MapPin,
//       color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60",
//     },
//   ];

//   return (
//     <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#070c18]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-300">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
//         {/* =====================================================
//             LEFT: BRAND LOGO OR SCAN BACK BUTTON
//         ===================================================== */}
//         <div className="flex items-center gap-3">
//           <AnimatePresence mode="wait">
//             {isScanRoute ? (
//               <motion.div
//                 key="scan-back"
//                 initial={{ opacity: 0, x: -12 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -12 }}
//                 transition={{ duration: 0.2 }}
//                 className="flex items-center gap-2.5"
//               >
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => navigate("/")}
//                   className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
//                   title="Back to Dashboard"
//                 >
//                   <ArrowLeft className="w-5 h-5" />
//                 </motion.button>
//                 <div>
//                   <div className="flex items-center gap-1.5">
//                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
//                     <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
//                       AI Diagnostic Lab
//                     </span>
//                   </div>
//                   <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-none">
//                     Crop Doctor Portal
//                   </h1>
//                 </div>
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="default-logo"
//                 initial={{ opacity: 0, x: -12 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -12 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <Link to="/" className="flex items-center gap-2.5 group">
//                   <motion.div 
//                     whileHover={{ rotate: 12, scale: 1.08 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                     className="w-10 h-10 rounded-2xl bg-emerald-800 dark:bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-800/25"
//                   >
//                     <Sprout className="w-6 h-6 stroke-[2.5]" />
//                   </motion.div>
//                   <div>
//                     <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
//                       Smart<span className="text-emerald-700 dark:text-emerald-400">Farmer</span>
//                     </span>
//                     <span className="text-[9px] font-black tracking-widest text-emerald-700 dark:text-emerald-400 block uppercase -mt-0.5">
//                       Ai-scan-app </span>
//                   </div>
//                 </Link>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* =====================================================
//             CENTER: DYNAMIC NAVIGATION LINKS
//         ===================================================== */}
//         <nav className="hidden xl:flex items-center gap-1">
//           <AnimatePresence mode="wait">
//             {isScanRoute ? (
//               <motion.div
//                 key="scan-nav"
//                 initial={{ opacity: 0, y: -8 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 8 }}
//                 transition={{ duration: 0.25 }}
//                 className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800"
//               >
//                 {scanSubLinks.map((item) => {
//                   const Icon = item.icon;
//                   return (
//                     <NavLink
//                       key={item.name}
//                       to={item.path}
//                       className={({ isActive }) =>
//                         `flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
//                           isActive
//                             ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700"
//                             : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/40"
//                         }`
//                       }
//                     >
//                       <div className={`p-1 rounded-lg border ${item.color}`}>
//                         <Icon className="w-3.5 h-3.5" />
//                       </div>
//                       <div className="text-left">
//                         <span className="block leading-tight">{item.name}</span>
//                         <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold block leading-none">
//                           {item.hindi}
//                         </span>
//                       </div>
//                     </NavLink>
//                   );
//                 })}
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="default-nav"
//                 initial={{ opacity: 0, y: -8 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 8 }}
//                 transition={{ duration: 0.25 }}
//                 className="flex items-center gap-1 bg-slate-50/80 dark:bg-slate-900/60 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800/80"
//               >
//                 {defaultNavLinks.map((item) => {
//                   const Icon = item.icon;
//                   return (
//                     <NavLink
//                       key={item.name}
//                       to={item.path}
//                       className={({ isActive }) =>
//                         `relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all duration-200 ${
//                           item.highlight
//                             ? "bg-emerald-800 dark:bg-emerald-600 text-white shadow-md shadow-emerald-800/20 hover:bg-emerald-900 dark:hover:bg-emerald-500"
//                             : isActive
//                             ? "bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-300 shadow-xs border border-slate-200 dark:border-slate-700"
//                             : "text-slate-600 dark:text-slate-400 hover:text-emerald-900 dark:hover:text-emerald-300 hover:bg-white/60 dark:hover:bg-slate-800/50"
//                         }`
//                       }
//                     >
//                       <Icon className="w-4 h-4" />
//                       <span>{item.name}</span>
//                       {item.badge && (
//                         <span className="text-[8px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded-md font-black">
//                           {item.badge}
//                         </span>
//                       )}
//                     </NavLink>
//                   );
//                 })}

//                 {/* More Dropdown */}
//                 <div className="relative">
//                   <button
//                     type="button"
//                     onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
//                     className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-black transition ${
//                       moreDropdownOpen 
//                         ? "bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-300" 
//                         : "text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/50"
//                     }`}
//                   >
//                     <Layers className="w-3.5 h-3.5" />
//                     <span>{lang === "hi" ? "अधिक" : "More"}</span>
//                     <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? "rotate-180" : ""}`} />
//                   </button>

//                   <AnimatePresence>
//                     {moreDropdownOpen && (
//                       <motion.div 
//                         initial={{ opacity: 0, y: 10, scale: 0.96 }}
//                         animate={{ opacity: 1, y: 0, scale: 1 }}
//                         exit={{ opacity: 0, y: 10, scale: 0.96 }}
//                         transition={{ duration: 0.15 }}
//                         className="absolute right-0 mt-2 w-54 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 space-y-1 z-50"
//                       >
//                         {extraNavLinks.map((extra) => {
//                           const ExtraIcon = extra.icon;
//                           return (
//                             <NavLink
//                               key={extra.name}
//                               to={extra.path}
//                               onClick={() => setMoreDropdownOpen(false)}
//                               className={({ isActive }) =>
//                                 `flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition ${
//                                   isActive 
//                                     ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300" 
//                                     : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
//                                 }`
//                               }
//                             >
//                               <ExtraIcon className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
//                               <span>{extra.name}</span>
//                             </NavLink>
//                           );
//                         })}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 {/* Exclusive Admin Link */}
//                 {isAdmin && (
//                   <NavLink
//                     to="/admin"
//                     className={({ isActive }) =>
//                       `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition ${
//                         isActive
//                           ? "bg-rose-600 text-white border-rose-700 shadow-sm"
//                           : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60 hover:bg-rose-100"
//                       }`
//                     }
//                   >
//                     <ShieldCheck className="w-4 h-4" />
//                     <span>Admin Panel</span>
//                   </NavLink>
//                 )}
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </nav>

//         {/* =====================================================
//             RIGHT: DAY/NIGHT, LANGUAGE, ALERTS, PROFILE & HAMBURGER
//         ===================================================== */}
//         <div className="flex items-center gap-2">
          
//           {/* 🌟 1. Animated Language Switcher Button */}
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={toggleLanguage}
//             className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-200 transition shadow-2xs"
//             title="भाषा बदलें (Switch Language)"
//           >
//             <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
//             <span className="tracking-wide">{lang === "hi" ? "EN" : "हिं"}</span>
//           </motion.button>

//           {/* 🌟 2. Animated Day / Night Mode Toggle */}
//           <motion.button
//             whileHover={{ scale: 1.08 }}
//             whileTap={{ scale: 0.92 }}
//             onClick={toggleTheme}
//             className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition relative overflow-hidden shadow-2xs"
//             title={isDarkMode ? "Day Mode on karein" : "Night Mode on karein"}
//           >
//             <AnimatePresence mode="wait" initial={false}>
//               {isDarkMode ? (
//                 <motion.div
//                   key="sun-icon"
//                   initial={{ y: -16, opacity: 0, rotate: -60 }}
//                   animate={{ y: 0, opacity: 1, rotate: 0 }}
//                   exit={{ y: 16, opacity: 0, rotate: 60 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   key="moon-icon"
//                   initial={{ y: -16, opacity: 0, rotate: 60 }}
//                   animate={{ y: 0, opacity: 1, rotate: 0 }}
//                   exit={{ y: 16, opacity: 0, rotate: -60 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <Moon className="w-4 h-4 text-slate-700 fill-slate-700/20" />
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.button>

//           {/* Activity Alerts */}
//           <Link
//             to="/notifications"
//             className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
//             title="Activity Alerts"
//           >
//             <Bell className="w-4 h-4" />
//           </Link>

//           {/* Profile & Auth Buttons */}
//           {user ? (
//             <Link
//               to="/profile"
//               className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 transition"
//             >
//               <div className="w-8 h-8 rounded-xl bg-emerald-800 dark:bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
//                 {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
//               </div>
//               <div className="hidden sm:block text-left">
//                 <span className="block text-xs font-black text-slate-900 dark:text-white leading-tight max-w-[90px] truncate">
//                   {user.displayName || (lang === "hi" ? "किसान" : "Farmer")}
//                 </span>
//                 <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 block">
//                   {isAdmin ? "Admin" : (lang === "hi" ? "प्रोफ़ाइल" : "Profile")}
//                 </span>
//               </div>
//             </Link>
//           ) : (
//             <Link
//               to="/login"
//               className="flex items-center gap-1.5 bg-slate-900 dark:bg-emerald-600 hover:bg-emerald-800 dark:hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-black transition active:scale-95 shadow-xs"
//             >
//               <LogIn className="w-4 h-4" />
//               <span>{lang === "hi" ? "लॉगिन" : "Sign In"}</span>
//             </Link>
//           )}

//           {/* Mobile Hamburger Button */}
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="xl:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
//             aria-label="Toggle Menu"
//           >
//             {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//           </button>
//         </div>

//       </div>

//       {/* =====================================================
//           MOBILE DRAWER MENU (With Dark Mode & Translation)
//       ===================================================== */}
//       <AnimatePresence>
//         {mobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.25, ease: "easeInOut" }}
//             className="xl:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#070c18] px-4 py-4 space-y-3 overflow-hidden shadow-xl"
//           >
//             {isScanRoute ? (
//               <div className="space-y-1.5">
//                 <span className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-400 tracking-wider block px-1">
//                   AI Scan Specialized Suite
//                 </span>
//                 {scanSubLinks.map((item) => {
//                   const Icon = item.icon;
//                   return (
//                     <NavLink
//                       key={item.name}
//                       to={item.path}
//                       onClick={closeMenu}
//                       className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-black text-slate-800 dark:text-slate-200"
//                     >
//                       <div className="flex items-center gap-2.5">
//                         <div className={`p-1.5 rounded-lg border ${item.color}`}>
//                           <Icon className="w-4 h-4" />
//                         </div>
//                         <div>
//                           <span>{item.name}</span>
//                           <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold">{item.hindi}</span>
//                         </div>
//                       </div>
//                       <ChevronRight className="w-4 h-4 text-slate-400" />
//                     </NavLink>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div className="space-y-1.5">
//                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block px-1">
//                   {lang === "hi" ? "पोर्टल नेविगेशन" : "Portal Navigation"}
//                 </span>

//                 {isAdmin && (
//                   <NavLink
//                     to="/admin"
//                     onClick={closeMenu}
//                     className="flex items-center justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-black text-rose-700 dark:text-rose-300 mb-2"
//                   >
//                     <div className="flex items-center gap-2.5">
//                       <ShieldCheck className="w-4 h-4 text-rose-600" />
//                       <span>Admin Master Control Panel</span>
//                     </div>
//                     <span className="text-[9px] uppercase bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 px-1.5 py-0.5 rounded">
//                       Owner Only
//                     </span>
//                   </NavLink>
//                 )}

//                 {[...defaultNavLinks, ...extraNavLinks].map((item) => {
//                   const Icon = item.icon;
//                   return (
//                     <NavLink
//                       key={item.name}
//                       to={item.path}
//                       onClick={closeMenu}
//                       className={({ isActive }) =>
//                         `flex items-center justify-between p-3 rounded-xl text-xs font-black transition ${
//                           isActive
//                             ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
//                             : "bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
//                         }`
//                       }
//                     >
//                       <div className="flex items-center gap-2.5">
//                         <Icon className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
//                         <span>{item.name}</span>
//                         {item.badge && (
//                           <span className="text-[9px] bg-emerald-200 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 px-1.5 py-0.2 rounded-md font-black">
//                             {item.badge}
//                           </span>
//                         )}
//                       </div>
//                       <ChevronRight className="w-4 h-4 text-slate-400" />
//                     </NavLink>
//                   );
//                 })}
//               </div>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// }







import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  ScanLine,
  CloudSun,
  ShoppingCart,
  Bot,
  User,
  LogIn,
  Pill,
  ShieldAlert,
  Sprout,
  MapPin,
  Sparkles,
  Menu,
  X,
  ArrowLeft,
  ChevronRight,
  PlusCircle,
  ShoppingBag,
  ChevronDown,
  Layers,
  ShieldCheck,
  Bell,
  Users,
  Sun,
  Moon,
  Languages
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

// Authorized Super Admin Emails
const ADMIN_EMAILS = [
  "sardardhakad81@gmail.com",
  "katariyavishal74@gmail.com"
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Day/Night & Multi-Language Global Context Hooks
  const { isDarkMode, toggleTheme } = useTheme();
  const { lang, toggleLanguage } = useLanguage();

  // Check if current route is Crop Doctor / AI Scan page
  const isScanRoute = location.pathname.startsWith("/crop-doctor");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  };

  // Robust case-insensitive email check
  const isAdmin = Boolean(
    user?.email &&
      ADMIN_EMAILS.some(
        (adminEmail) => adminEmail.toLowerCase().trim() === user.email.toLowerCase().trim()
      )
  );

  /* -------------------------------------------------------------
      1. PRIMARY NAVBAR LINKS (Main Desktop Bar)
  ------------------------------------------------------------- */
  const defaultNavLinks = [
    { name: lang === "hi" ? "डैशबोर्ड" : "Dashboard", path: "/", icon: Home },
    { name: lang === "hi" ? "AI स्कैन" : "AI Scan", path: "/crop-doctor", icon: ScanLine, highlight: true },
    { name: lang === "hi" ? "दवाइयां" : "Medicine", path: "/marketplace", icon: ShoppingCart },
    { name: lang === "hi" ? "फसल बेचें" : "Sell Crop", path: "/sell-crop", icon: PlusCircle },
    { name: lang === "hi" ? "मौसम" : "Weather", path: "/weather", icon: CloudSun },
    { name: lang === "hi" ? "किसान चौपाल" : "Community", path: "/community", icon: Users },
    { name: lang === "hi" ? "AI सहायक" : "AI Assistant", path: "/ai-assistant", icon: Bot },
  ];

  /* -------------------------------------------------------------
      2. SECONDARY LINKS (Desktop "More" Dropdown + Mobile Drawer)
  ------------------------------------------------------------- */
  const extraNavLinks = [
    { name: lang === "hi" ? "मेरी फसलें (My Crops)" : "My Crops", path: "/crops", icon: Sprout },
    { name: lang === "hi" ? "मेरे ऑर्डर (My Orders)" : "My Orders", path: "/orders", icon: ShoppingBag },
    { name: lang === "hi" ? "सूचनाएं (Alerts)" : "Activity Alerts", path: "/notifications", icon: Bell },
  ];

  /* -------------------------------------------------------------
      3. DYNAMIC AI SCAN MODE NAVBAR (Jab AI Scan open ho)
  ------------------------------------------------------------- */
  const scanSubLinks = [
    {
      name: "Buy Medicine",
      hindi: "दवाइयां खरीदें",
      path: "/marketplace",
      icon: Pill,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60",
    },
    {
      name: "Bimari & Upchar",
      hindi: "रोग व सटीक उपाय",
      path: "/crop-doctor#treatment",
      icon: ShieldAlert,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60",
    },
    {
      name: "Healthy Crops",
      hindi: "स्वस्थ फसल मानक",
      path: "/crops",
      icon: Sprout,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60",
    },
    {
      name: "Sell Harvest",
      hindi: "फसल बेचें व मंडी स्लॉट",
      path: "/sell-crop",
      icon: PlusCircle,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60",
    },
    {
      name: "Area & Kendra",
      hindi: "नजदीकी केंद्र व दुकानें",
      path: "/marketplace#locations",
      icon: MapPin,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#070c18]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* LEFT: LOGO OR SCAN BACK BUTTON */}
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait">
            {isScanRoute ? (
              <motion.div
                key="scan-back"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2.5"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/")}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                      AI Diagnostic Lab
                    </span>
                  </div>
                  <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-none">
                    Crop Doctor Portal
                  </h1>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="default-logo"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/" className="flex items-center gap-2.5 group">
                  <motion.div 
                    whileHover={{ rotate: 12, scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-10 h-10 rounded-2xl bg-emerald-800 dark:bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-800/25"
                  >
                    <Sprout className="w-6 h-6 stroke-[2.5]" />
                  </motion.div>
                  <div>
                    <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                      Smart<span className="text-emerald-700 dark:text-emerald-400">Farmer</span>
                    </span>
                    <span className="text-[9px] font-black tracking-widest text-emerald-700 dark:text-emerald-400 block uppercase -mt-0.5">
                      Ai-scan-app 
                    </span>
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CENTER: DESKTOP NAVIGATION */}
        <nav className="hidden xl:flex items-center gap-1">
          <AnimatePresence mode="wait">
            {isScanRoute ? (
              <motion.div
                key="scan-nav"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800"
              >
                {scanSubLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                          isActive
                            ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/40"
                        }`
                      }
                    >
                      <div className={`p-1 rounded-lg border ${item.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <span className="block leading-tight">{item.name}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold block leading-none">
                          {item.hindi}
                        </span>
                      </div>
                    </NavLink>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="default-nav"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-1 bg-slate-50/80 dark:bg-slate-900/60 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800/80"
              >
                {defaultNavLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        `relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all duration-200 ${
                          item.highlight
                            ? "bg-emerald-800 dark:bg-emerald-600 text-white shadow-md shadow-emerald-800/20 hover:bg-emerald-900 dark:hover:bg-emerald-500"
                            : isActive
                            ? "bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-300 shadow-xs border border-slate-200 dark:border-slate-700"
                            : "text-slate-600 dark:text-slate-400 hover:text-emerald-900 dark:hover:text-emerald-300 hover:bg-white/60 dark:hover:bg-slate-800/50"
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}

                {/* More Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-black transition ${
                      moreDropdownOpen 
                        ? "bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-300" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{lang === "hi" ? "अधिक" : "More"}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {moreDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-54 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 space-y-1 z-50"
                      >
                        {extraNavLinks.map((extra) => {
                          const ExtraIcon = extra.icon;
                          return (
                            <NavLink
                              key={extra.name}
                              to={extra.path}
                              onClick={() => setMoreDropdownOpen(false)}
                              className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition ${
                                  isActive 
                                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300" 
                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`
                              }
                            >
                              <ExtraIcon className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                              <span>{extra.name}</span>
                            </NavLink>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Exclusive Admin Link on Desktop */}
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition ${
                        isActive
                          ? "bg-rose-600 text-white border-rose-700 shadow-sm"
                          : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60 hover:bg-rose-100"
                      }`
                    }
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </NavLink>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* RIGHT: THEME, LANGUAGE, ALERTS, PROFILE */}
        <div className="flex items-center gap-2">
          
          {/* Language Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-200 transition shadow-2xs"
            title="भाषा बदलें (Switch Language)"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="tracking-wide">{lang === "hi" ? "EN" : "हिं"}</span>
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition relative overflow-hidden shadow-2xs"
            title={isDarkMode ? "Day Mode" : "Night Mode"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isDarkMode ? (
                <motion.div
                  key="sun-icon"
                  initial={{ y: -16, opacity: 0, rotate: -60 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 16, opacity: 0, rotate: 60 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon-icon"
                  initial={{ y: -16, opacity: 0, rotate: 60 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 16, opacity: 0, rotate: -60 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-4 h-4 text-slate-700 fill-slate-700/20" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Alerts */}
          <Link
            to="/notifications"
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
            title="Activity Alerts"
          >
            <Bell className="w-4 h-4" />
          </Link>

          {/* Profile & Auth */}
          {user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 transition"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-800 dark:bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-black text-slate-900 dark:text-white leading-tight max-w-[90px] truncate">
                  {user.displayName || (lang === "hi" ? "किसान" : "Farmer")}
                </span>
                <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 block">
                  {isAdmin ? "Admin" : (lang === "hi" ? "प्रोफ़ाइल" : "Profile")}
                </span>
              </div>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 bg-slate-900 dark:bg-emerald-600 hover:bg-emerald-800 dark:hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-black transition active:scale-95 shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>{lang === "hi" ? "लॉगिन" : "Sign In"}</span>
            </Link>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="xl:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#070c18] px-4 py-4 space-y-3 overflow-hidden shadow-xl"
          >
            {isScanRoute ? (
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-400 tracking-wider block px-1">
                  AI Scan Specialized Suite
                </span>
                {scanSubLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={closeMenu}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-black text-slate-800 dark:text-slate-200"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg border ${item.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span>{item.name}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold">{item.hindi}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </NavLink>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block px-1">
                  {lang === "hi" ? "पोर्टल नेविगेशन" : "Portal Navigation"}
                </span>

                {isAdmin && (
                  <NavLink
                    to="/admin"
                    onClick={closeMenu}
                    className="flex items-center justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-black text-rose-700 dark:text-rose-300 mb-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-rose-600" />
                      <span>Admin Master Control Panel</span>
                    </div>
                    <span className="text-[9px] uppercase bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 px-1.5 py-0.5 rounded">
                      Admin Access
                    </span>
                  </NavLink>
                )}

                {[...defaultNavLinks, ...extraNavLinks].map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center justify-between p-3 rounded-xl text-xs font-black transition ${
                          isActive
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : "bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </NavLink>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}