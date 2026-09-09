



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
//   LogOut,
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
// import { 
//   onAuthStateChanged, 
//   signInWithPopup, 
//   GoogleAuthProvider, 
//   signOut,
//   setPersistence,
//   browserLocalPersistence 
// } from "firebase/auth";
// import { auth } from "../services/firebase";
// import { useTheme } from "../context/ThemeContext";
// import { useLanguage } from "../context/LanguageContext";

// // Authorized Super Admin Emails
// const ADMIN_EMAILS = [
//   "sardardhakad81@gmail.com",
//   "katariyavishal74@gmail.com"
// ];

// export default function Navbar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(false);

//   // Day/Night & Multi-Language Global Context Hooks
//   const { isDarkMode, toggleTheme } = useTheme();
//   const { lang, toggleLanguage } = useLanguage();

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

//   // Robust case-insensitive email check
//   const isAdmin = Boolean(
//     user?.email &&
//       ADMIN_EMAILS.some(
//         (adminEmail) => adminEmail.toLowerCase().trim() === user.email.toLowerCase().trim()
//       )
//   );

//   // Direct Reliable Google Login Handler
//   const handleDirectLogin = async () => {
//     try {
//       setAuthLoading(true);
//       const provider = new GoogleAuthProvider();
//       provider.setCustomParameters({ prompt: "select_account" });
//       await setPersistence(auth, browserLocalPersistence);
//       const res = await signInWithPopup(auth, provider);
//       setUser(res.user);
//       if (res.user?.displayName) {
//         localStorage.setItem("farmerName", res.user.displayName);
//       }
//     } catch (err) {
//       console.error("Login Error:", err);
//       // Fallback redirect if popup is blocked
//       navigate("/login");
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   // Direct Logout Handler
//   const handleDirectLogout = async () => {
//     try {
//       await signOut(auth);
//       localStorage.removeItem("farmerName");
//       sessionStorage.clear();
//       setUser(null);
//       navigate("/");
//     } catch (err) {
//       console.error("Logout Error:", err);
//     }
//   };

//   /* -------------------------------------------------------------
//       1. PRIMARY NAVBAR LINKS (Main Desktop Bar)
//   ------------------------------------------------------------- */
//   const defaultNavLinks = [
//     { name: lang === "hi" ? "डैशबोर्ड" : "Dashboard", path: "/", icon: Home },
//     { name: lang === "hi" ? "AI स्कैन" : "AI Scan", path: "/crop-doctor", icon: ScanLine, highlight: true },
//     { name: lang === "hi" ? "दवाइयां" : "Medicine", path: "/marketplace", icon: ShoppingCart },
//     { name: lang === "hi" ? "फसल बेचें" : "Sell Crop", path: "/sell-crop", icon: PlusCircle },
//     { name: lang === "hi" ? "मौसम" : "Weather", path: "/weather", icon: CloudSun },
//     { name: lang === "hi" ? "किसान चौपाल" : "Community", path: "/community", icon: Users },
//     { name: lang === "hi" ? "AI सहायक" : "AI Assistant", path: "/ai-assistant", icon: Bot },
//   ];

//   /* -------------------------------------------------------------
//       2. SECONDARY LINKS (Desktop "More" Dropdown + Mobile Drawer)
//   ------------------------------------------------------------- */
//   const extraNavLinks = [
//     { name: lang === "hi" ? "मेरी फसलें (My Crops)" : "My Crops", path: "/crops", icon: Sprout },
//     { name: lang === "hi" ? "मेरे ऑर्डर (My Orders)" : "My Orders", path: "/orders", icon: ShoppingBag },
//     { name: lang === "hi" ? "सूचनाएं (Alerts)" : "Activity Alerts", path: "/notifications", icon: Bell },
//   ];

//   /* -------------------------------------------------------------
//       3. DYNAMIC AI SCAN MODE NAVBAR (Jab AI Scan open ho)
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
        
//         {/* LEFT: LOGO OR SCAN BACK BUTTON */}
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
//                       Ai-scan-app 
//                     </span>
//                   </div>
//                 </Link>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* CENTER: DESKTOP NAVIGATION */}
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

//                 {/* Exclusive Admin Link on Desktop */}
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

//         {/* RIGHT: THEME, LANGUAGE, ALERTS, PROFILE & DIRECT AUTH */}
//         <div className="flex items-center gap-2">
          
//           {/* Language Toggle */}
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

//           {/* Theme Toggle */}
//           <motion.button
//             whileHover={{ scale: 1.08 }}
//             whileTap={{ scale: 0.92 }}
//             onClick={toggleTheme}
//             className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition relative overflow-hidden shadow-2xs"
//             title={isDarkMode ? "Day Mode" : "Night Mode"}
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

//           {/* Alerts */}
//           <Link
//             to="/notifications"
//             className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
//             title="Activity Alerts"
//           >
//             <Bell className="w-4 h-4" />
//           </Link>

//           {/* Profile & One-Click Login / Logout */}
//           {user ? (
//             <div className="flex items-center gap-1.5">
//               <Link
//                 to="/profile"
//                 className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 transition"
//               >
//                 <div className="w-8 h-8 rounded-xl bg-emerald-800 dark:bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
//                   {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
//                 </div>
//                 <div className="hidden sm:block text-left">
//                   <span className="block text-xs font-black text-slate-900 dark:text-white leading-tight max-w-[85px] truncate">
//                     {user.displayName || (lang === "hi" ? "किसान" : "Farmer")}
//                   </span>
//                   <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 block">
//                     {isAdmin ? "Admin" : (lang === "hi" ? "प्रोफ़ाइल" : "Profile")}
//                   </span>
//                 </div>
//               </Link>
//               <button
//                 onClick={handleDirectLogout}
//                 className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 transition"
//                 title="लॉगआउट करें (Sign Out)"
//               >
//                 <LogOut className="w-4 h-4" />
//               </button>
//             </div>
//           ) : (
//             <button
//               onClick={handleDirectLogin}
//               disabled={authLoading}
//               className="flex items-center gap-1.5 bg-slate-900 dark:bg-emerald-600 hover:bg-emerald-800 dark:hover:bg-emerald-700 disabled:opacity-50 text-white px-3.5 py-2 rounded-xl text-xs font-black transition active:scale-95 shadow-xs cursor-pointer"
//             >
//               <LogIn className="w-4 h-4" />
//               <span>{authLoading ? "..." : (lang === "hi" ? "लॉगिन" : "Sign In")}</span>
//             </button>
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

//       {/* MOBILE DRAWER */}
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
//                       Admin Access
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
//   ); }















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
//   LogOut,
//   Pill,
//   ShieldAlert,
//   Sprout,
//   MapPin,
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
//   Languages,
//   Radio
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   onAuthStateChanged, 
//   signInWithPopup, 
//   GoogleAuthProvider, 
//   signOut,
//   setPersistence,
//   browserLocalPersistence 
// } from "firebase/auth";
// import { auth } from "../services/firebase";
// import { useTheme } from "../context/ThemeContext";
// import { useLanguage } from "../context/LanguageContext";

// // Authorized Super Admin Emails
// const ADMIN_EMAILS = [
//   "sardardhakad81@gmail.com",
//   "katariyavishal74@gmail.com"
// ];

// export default function Navbar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(false);

//   // Day/Night & Multi-Language Global Context Hooks
//   const { isDarkMode, toggleTheme } = useTheme();
//   const { lang, toggleLanguage } = useLanguage();

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

//   // Robust case-insensitive email check
//   const isAdmin = Boolean(
//     user?.email &&
//       ADMIN_EMAILS.some(
//         (adminEmail) => adminEmail.toLowerCase().trim() === user.email.toLowerCase().trim()
//       )
//   );

//   // Direct Reliable Google Login Handler
//   const handleDirectLogin = async () => {
//     try {
//       setAuthLoading(true);
//       const provider = new GoogleAuthProvider();
//       provider.setCustomParameters({ prompt: "select_account" });
//       await setPersistence(auth, browserLocalPersistence);
//       const res = await signInWithPopup(auth, provider);
//       setUser(res.user);
//       if (res.user?.displayName) {
//         localStorage.setItem("farmerName", res.user.displayName);
//       }
//     } catch (err) {
//       console.error("Login Error:", err);
//       navigate("/login");
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   // Direct Logout Handler
//   const handleDirectLogout = async () => {
//     try {
//       await signOut(auth);
//       localStorage.removeItem("farmerName");
//       sessionStorage.clear();
//       setUser(null);
//       navigate("/");
//     } catch (err) {
//       console.error("Logout Error:", err);
//     }
//   };

//   /* -------------------------------------------------------------
//       1. PRIMARY NAVBAR LINKS (Main Desktop Bar)
//   ------------------------------------------------------------- */
//   const defaultNavLinks = [
//     { name: lang === "hi" ? "डैशबोर्ड" : "Dashboard", path: "/", icon: Home },
//     { name: lang === "hi" ? "AI स्कैन" : "AI Scan", path: "/crop-doctor", icon: ScanLine, highlight: true },
//     { name: lang === "hi" ? "IoT रडार" : "IoT Radar", path: "/iot-dashboard", icon: Radio, pulse: true },
//     { name: lang === "hi" ? "दवाइयां" : "Medicine", path: "/marketplace", icon: ShoppingCart },
//     { name: lang === "hi" ? "फसल बेचें" : "Sell Crop", path: "/sell-crop", icon: PlusCircle },
//     { name: lang === "hi" ? "मौसम" : "Weather", path: "/weather", icon: CloudSun },
//     { name: lang === "hi" ? "किसान चौपाल" : "Community", path: "/community", icon: Users },
//     { name: lang === "hi" ? "AI सहायक" : "AI Assistant", path: "/ai-assistant", icon: Bot },
//   ];

//   /* -------------------------------------------------------------
//       2. SECONDARY LINKS (Desktop "More" Dropdown + Mobile Drawer)
//   ------------------------------------------------------------- */
//   const extraNavLinks = [
//     { name: lang === "hi" ? "मेरी फसलें (My Crops)" : "My Crops", path: "/crops", icon: Sprout },
//     { name: lang === "hi" ? "मेरे ऑर्डर (My Orders)" : "My Orders", path: "/orders", icon: ShoppingBag },
//     { name: lang === "hi" ? "सूचनाएं (Alerts)" : "Activity Alerts", path: "/notifications", icon: Bell },
//   ];

//   /* -------------------------------------------------------------
//       3. DYNAMIC AI SCAN MODE NAVBAR (Jab AI Scan open ho)
//   ------------------------------------------------------------- */
//   const scanSubLinks = [
//     {
//       name: "IoT Live Radar",
//       hindi: "IoT खेत निगरानी",
//       path: "/iot-dashboard",
//       icon: Radio,
//       color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-900/60",
//     },
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
//     <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#070c18]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors duration-300">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
//         {/* LEFT: LOGO OR SCAN BACK BUTTON */}
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
//                   className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition shadow-2xs"
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
//                       Ai-scan-app 
//                     </span>
//                   </div>
//                 </Link>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* CENTER: DESKTOP NAVIGATION */}
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
//                         `relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all duration-200 ${
//                           item.highlight
//                             ? "bg-emerald-800 dark:bg-emerald-600 text-white shadow-md shadow-emerald-800/20 hover:bg-emerald-900 dark:hover:bg-emerald-500"
//                             : item.pulse
//                             ? isActive 
//                               ? "bg-cyan-600 text-white shadow-sm"
//                               : "text-cyan-700 dark:text-cyan-400 bg-cyan-50/70 dark:bg-cyan-950/30 hover:bg-cyan-100 dark:hover:bg-cyan-900/40"
//                             : isActive
//                             ? "bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-300 shadow-xs border border-slate-200 dark:border-slate-700"
//                             : "text-slate-600 dark:text-slate-400 hover:text-emerald-900 dark:hover:text-emerald-300 hover:bg-white/60 dark:hover:bg-slate-800/50"
//                         }`
//                       }
//                     >
//                       <Icon className={`w-4 h-4 ${item.pulse ? "animate-pulse" : ""}`} />
//                       <span>{item.name}</span>
//                       {item.pulse && (
//                         <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping -ml-0.5" />
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

//                 {/* Exclusive Admin Link on Desktop */}
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

//         {/* RIGHT: THEME, LANGUAGE, ALERTS, PROFILE & DIRECT AUTH */}
//         <div className="flex items-center gap-2">
          
//           {/* Language Toggle */}
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

//           {/* Theme Toggle */}
//           <motion.button
//             whileHover={{ scale: 1.08 }}
//             whileTap={{ scale: 0.92 }}
//             onClick={toggleTheme}
//             className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition relative overflow-hidden shadow-2xs"
//             title={isDarkMode ? "Day Mode" : "Night Mode"}
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

//           {/* Alerts */}
//           <Link
//             to="/notifications"
//             className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition shadow-2xs"
//             title="Activity Alerts"
//           >
//             <Bell className="w-4 h-4" />
//           </Link>

//           {/* Profile & One-Click Login / Logout */}
//           {user ? (
//             <div className="flex items-center gap-1.5">
//               <Link
//                 to="/profile"
//                 className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 transition shadow-2xs"
//               >
//                 <div className="w-8 h-8 rounded-xl bg-emerald-800 dark:bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
//                   {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
//                 </div>
//                 <div className="hidden sm:block text-left">
//                   <span className="block text-xs font-black text-slate-900 dark:text-white leading-tight max-w-[85px] truncate">
//                     {user.displayName || (lang === "hi" ? "किसान" : "Farmer")}
//                   </span>
//                   <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 block">
//                     {isAdmin ? "Admin" : (lang === "hi" ? "प्रोफ़ाइल" : "Profile")}
//                   </span>
//                 </div>
//               </Link>
//               <button
//                 onClick={handleDirectLogout}
//                 className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 transition shadow-2xs"
//                 title="लॉगआउट करें (Sign Out)"
//               >
//                 <LogOut className="w-4 h-4" />
//               </button>
//             </div>
//           ) : (
//             <button
//               onClick={handleDirectLogin}
//               disabled={authLoading}
//               className="flex items-center gap-1.5 bg-slate-900 dark:bg-emerald-600 hover:bg-emerald-800 dark:hover:bg-emerald-700 disabled:opacity-50 text-white px-3.5 py-2 rounded-xl text-xs font-black transition active:scale-95 shadow-xs cursor-pointer"
//             >
//               <LogIn className="w-4 h-4" />
//               <span>{authLoading ? "..." : (lang === "hi" ? "लॉगिन" : "Sign In")}</span>
//             </button>
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

//       {/* MOBILE DRAWER */}
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
//                       Admin Access
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
//                         <Icon className={`w-4 h-4 text-emerald-800 dark:text-emerald-400 ${item.pulse ? "animate-pulse" : ""}`} />
//                         <span>{item.name}</span>
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
  LogOut,
  Pill,
  ShieldAlert,
  Sprout,
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
  Languages,
  Radio,
  Tractor
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  setPersistence,
  browserLocalPersistence 
} from "firebase/auth";
import { auth } from "../services/firebase";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

// Authorized Super Admin Emails
const ADMIN_EMAILS = [
  "sardardhakad81@gmail.com",
  "katariyavishal74@gmail.com"
];

// 10 Dynamic Colors
const dynamicLightColors = [
  "#f0fdf4", "#eff6ff", "#fefce8", "#fdf4ff", "#f0fdfa",
  "#fff7ed", "#faf5ff", "#ecfeff", "#f7fee7", "#f8fafc",
];

const dynamicDarkColors = [
  "#061412", "#091224", "#141206", "#14081c", "#041416",
  "#1c0e06", "#0f091f", "#06141a", "#0c1606", "#080c14",
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);

  const { isDarkMode, toggleTheme } = useTheme();
  const { lang, toggleLanguage } = useLanguage();

  const isScanRoute = location.pathname.startsWith("/crop-doctor");

  useEffect(() => {
    const colorInterval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % 10);
    }, 1000);
    return () => clearInterval(colorInterval);
  }, []);

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

  const isAdmin = Boolean(
    user?.email &&
      ADMIN_EMAILS.some(
        (adminEmail) => adminEmail.toLowerCase().trim() === user.email.toLowerCase().trim()
      )
  );

  const handleDirectLogin = async () => {
    try {
      setAuthLoading(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await setPersistence(auth, browserLocalPersistence);
      const res = await signInWithPopup(auth, provider);
      setUser(res.user);
      if (res.user?.displayName) {
        localStorage.setItem("farmerName", res.user.displayName);
      }
    } catch (err) {
      console.error("Login Error:", err);
      navigate("/login");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDirectLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("farmerName");
      localStorage.removeItem("userToken");
      sessionStorage.clear();
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  const getLabel = (hi, en, mr) => {
    if (lang === "mr") return mr || hi;
    if (lang === "en") return en;
    return hi;
  };

  // Main Desktop Bar Links (Compact & Fit-to-screen)
  const defaultNavLinks = [
    { name: getLabel("डैशबोर्ड", "Dashboard", "डॅशबोर्ड"), path: "/", icon: Home },
    { name: getLabel("AI स्कैन", "AI Scan", "AI स्कॅन"), path: "/crop-doctor", icon: ScanLine, highlight: true },
    { name: getLabel("IoT रडार", "IoT Radar", "IoT रडार"), path: "/iot-dashboard", icon: Radio, pulse: true },
    { name: getLabel("दवाइयां", "Meds", "औषधे"), path: "/marketplace", icon: ShoppingCart },
    { name: getLabel("फसल बेचें", "Sell", "विक्री"), path: "/sell-crop", icon: PlusCircle },
    { name: getLabel("मौसम", "Weather", "हवामान"), path: "/weather", icon: CloudSun },
    { name: getLabel("चौपाल", "Community", "चावडी"), path: "/community", icon: Users },
  ];

  // Secondary Links inside Dropdown
  const extraNavLinks = [
    { name: getLabel("AI सहायक", "AI Assistant", "AI सहाय्यक"), path: "/ai-assistant", icon: Bot },
    { name: getLabel("उपकरण रेंट (ट्रैक्टर/ड्रोन)", "Rent Tractor/Drone", "ट्रॅक्टर/ड्रोन भाडे"), path: "/crops", icon: Tractor },
    { name: getLabel("मेरे ऑर्डर", "My Orders", "माझ्या ऑर्डर्स"), path: "/orders", icon: ShoppingBag },
    { name: getLabel("सूचनाएं", "Activity Alerts", "सूचना"), path: "/notifications", icon: Bell },
  ];

  const scanSubLinks = [
    {
      name: "Outbreak Radar",
      hindi: getLabel("प्रकोप रडार", "Outbreak Radar", "प्रादुर्भाव रडार"),
      path: "/outbreak-radar",
      icon: ShieldAlert,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60",
    },
    {
      name: "IoT Live Radar",
      hindi: getLabel("IoT खेत", "IoT Farm", "IoT शेत"),
      path: "/iot-dashboard",
      icon: Radio,
      color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-900/60",
    },
    {
      name: "Buy Medicine",
      hindi: getLabel("दवाइयां", "Medicine", "औषधे"),
      path: "/marketplace",
      icon: Pill,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60",
    },
    {
      name: "Rent Equipment",
      hindi: getLabel("उपकरण रेंट", "Equipment", "अवजारे भाडे"),
      path: "/crops",
      icon: Tractor,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60",
    },
    {
      name: "Sell Harvest",
      hindi: getLabel("फसल बेचें", "Sell Crop", "पीक विक्री"),
      path: "/sell-crop",
      icon: PlusCircle,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60",
    },
  ];

  const activeNavbarBg = isDarkMode ? dynamicDarkColors[colorIndex] : dynamicLightColors[colorIndex];

  return (
    <header 
      style={{ backgroundColor: activeNavbarBg }}
      className="sticky top-0 z-50 w-full max-w-full overflow-x-clip backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors duration-1000 ease-in-out"
    >
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6 h-16 sm:h-18 flex items-center justify-between gap-1 sm:gap-2">
        
        {/* LEFT: LOGO */}
        <div className="flex items-center shrink-0">
          <AnimatePresence mode="wait">
            {isScanRoute ? (
              <motion.div
                key="scan-back"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5 sm:gap-2"
              >
                <button
                  onClick={() => navigate("/")}
                  className="p-1.5 sm:p-2 rounded-xl bg-white/70 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition shadow-2xs border border-slate-200/60 dark:border-slate-700/60"
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                      Diagnostic
                    </span>
                  </div>
                  <h1 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-none">
                    Crop Doctor
                  </h1>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="default-logo"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-800 dark:bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <Sprout className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                      Smart<span className="text-emerald-700 dark:text-emerald-400">Farmer</span>
                    </span>
                    <span className="text-[8px] font-black tracking-widest text-emerald-700 dark:text-emerald-400 block uppercase -mt-0.5">
                      Ai-App
                    </span>
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CENTER: DESKTOP NAVIGATION (Compact) */}
        <nav className="hidden xl:flex items-center gap-0.5 min-w-0">
          <AnimatePresence mode="wait">
            {isScanRoute ? (
              <motion.div
                key="scan-nav"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="flex items-center gap-1 bg-white/70 dark:bg-slate-900/70 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md"
              >
                {scanSubLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black transition ${
                          isActive
                            ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60"
                        }`
                      }
                    >
                      <div className={`p-1 rounded-lg border ${item.color}`}>
                        <Icon className="w-3 h-3" />
                      </div>
                      <span>{item.hindi}</span>
                    </NavLink>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="default-nav"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="flex items-center gap-0.5 bg-white/70 dark:bg-slate-900/70 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md"
              >
                {defaultNavLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        `relative flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-black transition-all ${
                          item.highlight
                            ? "bg-emerald-800 dark:bg-emerald-600 text-white shadow-sm hover:bg-emerald-900"
                            : item.pulse
                            ? isActive 
                              ? "bg-cyan-600 text-white shadow-sm"
                              : "text-cyan-700 dark:text-cyan-400 bg-cyan-50/70 dark:bg-cyan-950/30 hover:bg-cyan-100"
                            : isActive
                            ? "bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-300 shadow-xs border border-slate-200 dark:border-slate-700"
                            : "text-slate-600 dark:text-slate-400 hover:text-emerald-900 dark:hover:text-emerald-300 hover:bg-white/60"
                        }`
                      }
                    >
                      <Icon className={`w-3.5 h-3.5 ${item.pulse ? "animate-pulse" : ""}`} />
                      <span className="whitespace-nowrap">{item.name}</span>
                      {item.pulse && (
                        <span className="w-1 h-1 rounded-full bg-cyan-500 animate-ping" />
                      )}
                    </NavLink>
                  );
                })}

                {/* OUTBREAK RADAR BUTTON */}
                <NavLink
                  to="/outbreak-radar"
                  className={({ isActive }) =>
                    `flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-black transition border whitespace-nowrap ${
                      isActive
                        ? "bg-rose-600 text-white border-rose-700 shadow-sm"
                        : "bg-rose-50/80 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60 hover:bg-rose-100"
                    }`
                  }
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-600"></span>
                  </span>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{getLabel("प्रकोप", "Radar", "रडार")}</span>
                </NavLink>

                {/* MORE DROPDOWN */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-black transition whitespace-nowrap ${
                      moreDropdownOpen 
                        ? "bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-300" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-white/60"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{getLabel("अधिक", "More", "अधिक")}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${moreDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {moreDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 space-y-1 z-50"
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

                {/* ADMIN LINK */}
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-black border transition ${
                        isActive
                          ? "bg-rose-600 text-white border-rose-700 shadow-sm"
                          : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60"
                      }`
                    }
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </NavLink>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* RIGHT CONTROLS: COMPACT & FIXED ON SCREEN */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-200 transition shadow-2xs cursor-pointer"
            title="भाषा बदलें (Switch Language)"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="tracking-wide uppercase font-bold text-[11px]">
              {lang === "hi" ? "हिं" : lang === "en" ? "EN" : "मरा"}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition shadow-2xs cursor-pointer"
            title={isDarkMode ? "Day Mode" : "Night Mode"}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 fill-slate-700/20" />
            )}
          </button>

          {/* Alerts */}
          <Link
            to="/notifications"
            className="p-1.5 sm:p-2 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 transition shadow-2xs"
            title="Alerts"
          >
            <Bell className="w-4 h-4" />
          </Link>

          {/* Profile & Auth */}
          {user ? (
            <div className="flex items-center gap-1">
              <Link
                to="/profile"
                className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 transition shadow-2xs"
              >
                <div className="w-7 h-7 rounded-xl bg-emerald-800 dark:bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                </div>
                <span className="hidden md:block text-xs font-black text-slate-900 dark:text-white max-w-[70px] truncate">
                  {user.displayName?.split(" ")[0] || getLabel("किसान", "Farmer", "शेतकरी")}
                </span>
              </Link>
              <button
                onClick={handleDirectLogout}
                className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 transition shadow-2xs cursor-pointer"
                title="लॉगआउट करें"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleDirectLogin}
              disabled={authLoading}
              className="flex items-center gap-1 bg-slate-900 dark:bg-emerald-600 hover:bg-emerald-800 text-white px-2.5 py-1.5 rounded-xl text-xs font-black transition active:scale-95 shadow-xs cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{authLoading ? "..." : getLabel("लॉगिन", "Sign In", "लॉगिन")}</span>
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 sm:p-2 rounded-xl bg-white/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition border border-slate-200 dark:border-slate-700 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
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
            style={{ backgroundColor: activeNavbarBg }}
            className="xl:hidden border-t border-slate-200/80 dark:border-slate-800 px-3 py-3 space-y-2 overflow-hidden shadow-xl"
          >
            <div className="space-y-1">
              {[...defaultNavLinks, ...extraNavLinks].map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `flex items-center justify-between p-2.5 rounded-xl text-xs font-black transition ${
                        isActive
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          : "bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300"
                      }`
                    }
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </NavLink>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}