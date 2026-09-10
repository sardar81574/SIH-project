// import React from "react";
// import { motion } from "framer-motion";
// import { Sprout, Sparkles } from "lucide-react";

// export default function LoadingScreen({ message = "AI Field Engine & Satellite Radar Syncing..." }) {
//   return (
//     <div className="fixed inset-0 z-50 bg-[#080d16] flex flex-col items-center justify-center p-6 font-sans text-white select-none overflow-hidden">
      
//       {/* Background Ambient Glow */}
//       <div className="absolute inset-0 pointer-events-none">
//         <motion.div
//           animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.3, 0.15] }}
//           transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
//           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]"
//         />
//       </div>

//       {/* Central Animated Logo Core */}
//       <div className="relative flex items-center justify-center mb-8">
        
//         {/* Rotating Outer Radar Dashed Ring */}
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
//           className="w-28 h-28 rounded-full border border-dashed border-emerald-500/40"
//         />

//         {/* Counter-Rotating Medium Ring */}
//         <motion.div
//           animate={{ rotate: -360 }}
//           transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
//           className="absolute w-22 h-22 rounded-full border border-emerald-400/20"
//         />

//         {/* Pulsing Backglow Aura */}
//         <motion.div
//           animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.3, 0.7, 0.3] }}
//           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//           className="absolute w-16 h-16 rounded-2xl bg-emerald-500/30 blur-md"
//         />

//         {/* Center Green Badge */}
//         <motion.div
//           animate={{ y: [-2, 2, -2] }}
//           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//           className="relative z-10 w-14 h-14 rounded-2xl bg-emerald-700 border border-emerald-400/40 flex items-center justify-center shadow-lg shadow-emerald-950"
//         >
//           <Sprout className="w-7 h-7 text-white stroke-[2.5]" />
//         </motion.div>
//       </div>

//       {/* Brand Title & Tagline */}
//       <div className="relative z-10 text-center space-y-2 max-w-sm">
        
//         <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">
//           <Sparkles className="w-3.5 h-3.5 text-amber-400" />
//           <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
//             Agri<span className="text-emerald-400 font-black">Scan</span> AI
//           </span>
//           <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
//         </div>

//         <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-100">
//           {message}
//         </h3>

//         {/* Precision Progress Bar */}
//         <div className="w-64 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden border border-white/5 mt-3 relative">
//           <motion.div
//             animate={{ x: ["-100%", "100%"] }}
//             transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
//             className="w-full h-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full shadow-[0_0_10px_#34d399]"
//           />
//         </div>

//         <p className="text-[11px] text-slate-500 font-medium pt-1">
//           स्मार्ट खेती • सटीक रोग पहचान • डिजिटल मंडी
//         </p>
//       </div>

//     </div>
//   );
// }










import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Sparkles, Satellite, Radio, ShieldCheck, Cpu, Wifi } from "lucide-react";

const AGRI_TIPS = [
  "उपग्रह रडार व मौसम सेंसर कनेक्ट हो रहे हैं...",
  "फसल रोग पहचान AI मॉडल लोड हो रहा है...",
  "नमी, मिट्टी व तापमान डेटा सिंक्रोनाइज़ हो रहा है...",
  "लाइव मंडी भाव व स्थानीय एडवाइजरी तैयार है..."
];

// Floating Nano Spores / Firefly coordinates
const PARTICLES = [
  { id: 1, x: "18%", y: "25%", delay: 0, duration: 4 },
  { id: 2, x: "78%", y: "30%", delay: 0.8, duration: 5 },
  { id: 3, x: "30%", y: "75%", delay: 1.4, duration: 4.5 },
  { id: 4, x: "85%", y: "68%", delay: 2, duration: 3.8 },
  { id: 5, x: "12%", y: "60%", delay: 0.4, duration: 5.2 },
  { id: 6, x: "65%", y: "82%", delay: 1.1, duration: 4.2 }
];

export default function LoadingScreen({ 
  message = "स्मार्ट किसान AI इंजन व सैटेलाइट रडार कनेक्ट हो रहा है..." 
}) {
  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(12);

  // Rotating tips timer
  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % AGRI_TIPS.length);
    }, 2200);
    return () => clearInterval(tipTimer);
  }, []);

  // Smooth pseudo-progress counter (12% -> 99%)
  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev < 96 ? prev + Math.floor(Math.random() * 4) + 1 : 99));
    }, 120);
    return () => clearInterval(progressTimer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#02060d] flex flex-col items-center justify-center p-6 font-sans text-white select-none overflow-hidden">
      
      {/* 🌟 1. HUD Cyber Corner Brackets */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-emerald-500/30 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-emerald-500/30 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-emerald-500/30 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-emerald-500/30 rounded-br-lg pointer-events-none" />

      {/* 🌟 2. Precision Radar Field Grid */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#10b981 1.2px, transparent 1.2px), linear-gradient(to right, #059669 1px, transparent 1px), linear-gradient(to bottom, #059669 1px, transparent 1px)",
          backgroundSize: "32px 32px, 64px 64px, 64px 64px"
        }}
      />

      {/* 🌟 3. Ambient Pulsing Aurora Beams */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.35, 1], opacity: [0.15, 0.32, 0.15], rotate: [0, 90, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-emerald-500/25 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1.2, 0.85, 1.2], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[380px] h-[380px] bg-teal-400/20 rounded-full blur-[110px]"
        />
      </div>

      {/* 🌟 4. Floating Micro Spores / Bio-Particles */}
      {PARTICLES.map((pt) => (
        <motion.span
          key={pt.id}
          initial={{ opacity: 0, y: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0], 
            y: [-10, -40, -10],
            scale: [0.8, 1.2, 0.8] 
          }}
          transition={{ 
            duration: pt.duration, 
            repeat: Infinity, 
            delay: pt.delay,
            ease: "easeInOut" 
          }}
          style={{ left: pt.x, top: pt.y }}
          className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] pointer-events-none"
        />
      ))}

      {/* 🌟 5. Central Reactor & Planetary Satellite Radar Core */}
      <div className="relative flex items-center justify-center mb-8">
        
        {/* Outermost Pulsing Signal Ring */}
        <motion.div
          animate={{ scale: [0.75, 1.6], opacity: [0.7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          className="absolute w-44 h-44 rounded-full border border-emerald-400/35 pointer-events-none"
        />

        {/* Outer Orbiting Satellite Track */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "linear" }}
          className="absolute w-40 h-40 rounded-full border border-emerald-500/20 flex items-center justify-center"
        >
          {/* Orbiting Satellite Node */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-pulse" />
            <span className="text-[8px] font-mono text-cyan-300 tracking-tighter opacity-80 mt-0.5">SAT-01</span>
          </div>
        </motion.div>

        {/* Conical Radar Sweep Ray */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
          className="absolute w-36 h-36 rounded-full pointer-events-none"
          style={{
            background: "conic-gradient(from 0deg, rgba(16,185,129,0.25) 0deg, transparent 60deg, transparent 360deg)"
          }}
        />

        {/* 360° Rotating Dashed Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 rounded-full border-2 border-dashed border-emerald-500/40 relative flex items-center justify-center"
        >
          {/* Target Blip 1 */}
          <span className="absolute top-2 right-4 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-ping" />
          {/* Target Blip 2 */}
          <span className="absolute bottom-4 left-3 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
        </motion.div>

        {/* Counter-Rotating Gyroscopic Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute w-24 h-24 rounded-full border border-teal-300/30 border-t-emerald-400 border-b-cyan-400"
        />

        {/* Core Pulsing Glow Aura */}
        <motion.div
          animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-16 h-16 rounded-3xl bg-emerald-500/40 blur-xl"
        />

        {/* Central 3D Agro Leaf Emblem */}
        <motion.div
          animate={{ y: [-4, 4, -4], rotate: [-2, 2, -2] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-800 via-emerald-600 to-teal-400 border border-emerald-300/60 flex items-center justify-center shadow-2xl shadow-emerald-950 backdrop-blur-md"
        >
          <Sprout className="w-8 h-8 text-white stroke-[2.5] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]" />
        </motion.div>
      </div>

      {/* 🌟 6. Brand Header & Live AI Progress Status */}
      <div className="relative z-10 text-center space-y-3.5 max-w-sm">
        
        {/* Futuristic Pill Badge with Live Ping */}
        <div className="inline-flex items-center gap-2 bg-white/[0.05] border border-emerald-500/30 px-3.5 py-1 rounded-full backdrop-blur-xl shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: "4s" }} />
          <span className="text-[11px] font-black text-slate-200 tracking-wider uppercase">
            Smart<span className="text-emerald-400">Farmer</span> Precision AI
          </span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        </div>

        {/* Main Title Message */}
        <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-100 px-3 leading-snug">
          {message}
        </h3>

        {/* Precision Progress Bar with Live % Tag */}
        <div className="space-y-1.5 max-w-xs mx-auto">
          <div className="w-68 h-2 bg-slate-900/90 rounded-full overflow-hidden border border-emerald-500/30 relative shadow-inner p-[1px]">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.3 }}
              className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-300 rounded-full shadow-[0_0_12px_#34d399]"
            />
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" /> 5G Satellite Uplink
            </span>
            <span className="font-bold text-emerald-400">{progress}%</span>
          </div>
        </div>

        {/* Rotating Live Agro Diagnostic Tips Card */}
        <div className="h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={tipIndex}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.3 }}
              className="bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2 shadow-xs"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
              <span>{AGRI_TIPS[tipIndex]}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Feature Badges */}
        <div className="pt-2 flex items-center justify-center gap-3 text-[10px] text-slate-400 font-bold tracking-wide">
          <span className="flex items-center gap-1">
            <Satellite className="w-3 h-3 text-cyan-400" /> उपग्रह रडार
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-emerald-400" /> AI फसल डॉक्टर
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-400" /> 100% सुरक्षित
          </span>
        </div>

      </div>

    </div>
  );
}