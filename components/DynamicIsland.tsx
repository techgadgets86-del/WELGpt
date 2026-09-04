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
          initial={{ y: -50, opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ y: -50, opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          // We use top-[11px] instead of safe-area to explicitly bleed into the Apple physical hardware island
          className="fixed top-[11px] left-1/2 -translate-x-1/2 z-[100] pointer-events-none md:hidden"
        >
          {/* 
            Hardware-simulated PWA Dynamic Island. 
            By keeping bg-black with no borders and a specific min-height/padding, 
            this visually merges with the physical iPhone 14/15/16 Pro Dynamic Island.
          */}
          <div className="bg-black text-white px-6 py-2.5 rounded-full flex items-center justify-between gap-4 min-w-[220px] shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-3">
              {/* Audio waveform / pulsing indicator */}
              <div className="flex items-center gap-[2px]">
                <motion.div animate={{ height: [6, 14, 6] }} transition={{ repeat: Infinity, duration: 1 }} className={`w-[2px] rounded-full ${color}`} />
                <motion.div animate={{ height: [6, 18, 6] }} transition={{ repeat: Infinity, duration: 1, delay: 0.15 }} className={`w-[2px] rounded-full ${color}`} />
                <motion.div animate={{ height: [6, 10, 6] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }} className={`w-[2px] rounded-full ${color}`} />
              </div>
              <span className={`text-xs font-bold tracking-wider uppercase ${color} opacity-90`}>
                {label}
              </span>
            </div>
            
            <span className="text-sm font-medium opacity-80 pl-2">
              {time}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
