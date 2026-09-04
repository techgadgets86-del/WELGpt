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
          initial={{ y: -50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          // Anchor strictly to top-0. 
          // If iOS is letterboxing, this touches the black status bar and seamlessly extends it.
          // If iOS is edge-to-edge, this touches the physical bezel and surrounds the camera.
          className="fixed top-0 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none md:hidden"
        >
          {/* We use rounded-b-3xl to make it look like a smooth hardware dropdown from the top bezel/status bar */}
          <div className="bg-black text-white px-8 pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-4 rounded-b-[2.5rem] flex items-center justify-center gap-6 min-w-[240px] shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-[2px]">
                <motion.div animate={{ height: [6, 14, 6] }} transition={{ repeat: Infinity, duration: 1 }} className={`w-[2px] rounded-full ${color}`} />
                <motion.div animate={{ height: [6, 18, 6] }} transition={{ repeat: Infinity, duration: 1, delay: 0.15 }} className={`w-[2px] rounded-full ${color}`} />
                <motion.div animate={{ height: [6, 10, 6] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }} className={`w-[2px] rounded-full ${color}`} />
              </div>
              <span className={`text-xs font-bold tracking-widest uppercase ${color} opacity-100`}>
                {label}
              </span>
            </div>
            
            <span className="text-sm font-medium opacity-90 pl-2 mt-2">
              {time}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
