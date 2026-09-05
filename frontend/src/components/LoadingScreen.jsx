import React from "react";
import { motion } from "framer-motion";
import { Sprout, Sparkles } from "lucide-react";

export default function LoadingScreen({ message = "AI Field Engine & Satellite Radar Syncing..." }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#080d16] flex flex-col items-center justify-center p-6 font-sans text-white select-none overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]"
        />
      </div>

      {/* Central Animated Logo Core */}
      <div className="relative flex items-center justify-center mb-8">
        
        {/* Rotating Outer Radar Dashed Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-28 h-28 rounded-full border border-dashed border-emerald-500/40"
        />

        {/* Counter-Rotating Medium Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute w-22 h-22 rounded-full border border-emerald-400/20"
        />

        {/* Pulsing Backglow Aura */}
        <motion.div
          animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-16 h-16 rounded-2xl bg-emerald-500/30 blur-md"
        />

        {/* Center Green Badge */}
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-14 h-14 rounded-2xl bg-emerald-700 border border-emerald-400/40 flex items-center justify-center shadow-lg shadow-emerald-950"
        >
          <Sprout className="w-7 h-7 text-white stroke-[2.5]" />
        </motion.div>
      </div>

      {/* Brand Title & Tagline */}
      <div className="relative z-10 text-center space-y-2 max-w-sm">
        
        <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            Agri<span className="text-emerald-400 font-black">Scan</span> AI
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </div>

        <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-100">
          {message}
        </h3>

        {/* Precision Progress Bar */}
        <div className="w-64 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden border border-white/5 mt-3 relative">
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full shadow-[0_0_10px_#34d399]"
          />
        </div>

        <p className="text-[11px] text-slate-500 font-medium pt-1">
          स्मार्ट खेती • सटीक रोग पहचान • डिजिटल मंडी
        </p>
      </div>

    </div>
  );
}