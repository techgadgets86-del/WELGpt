"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function DynamicIsland() {
  const pathname = usePathname();
  const [time, setTime] = useState("");
  
  // Only show on detox and coach pages
  const isActive = pathname === "/detox" || pathname === "/coach";
  
  const label = pathname === "/detox" ? "Detox Active" : "Sensei Active";
  const color = pathname === "/detox" ? "text-emerald-400" : "text-violet-400";
  const bgGlow = pathname === "/detox" ? "shadow-emerald-500/20" : "shadow-violet-500/20";

  useEffect(() => {
    if (!isActive) return;
    
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ y: -40, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -40, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed top-[env(safe-area-inset-top,10px)] left-1/2 -translate-x-1/2 z-[100] pointer-events-none md:hidden pt-2"
        >
          {/* Hardware-simulated PWA Dynamic Island */}
          <div className={`bg-black text-white px-5 py-1.5 rounded-full flex items-center justify-between gap-3 min-w-[140px] shadow-2xl ${bgGlow} border border-white/5`}>
            <div className="flex items-center gap-2">
              {/* Audio waveform / pulsing indicator */}
              <div className="flex items-center gap-0.5">
                <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 1 }} className={`w-0.5 rounded-full ${color}`} />
                <motion.div animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.1 }} className={`w-0.5 rounded-full ${color}`} />
                <motion.div animate={{ height: [4, 8, 4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className={`w-0.5 rounded-full ${color}`} />
              </div>
              <span className={`text-[10px] font-bold tracking-widest uppercase ${color} opacity-90`}>
                {label}
              </span>
            </div>
            
            <span className="text-[11px] font-medium opacity-80 pl-2">
              {time}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
