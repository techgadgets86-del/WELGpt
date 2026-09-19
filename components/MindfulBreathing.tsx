"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, X, Play } from "lucide-react";

export default function MindfulBreathing() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "idle">("idle");
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setPhase("idle");
      setTimeLeft(0);
      return;
    }

    let timer: NodeJS.Timeout;
    
    const cycleBreathing = () => {
      // Inhale: 4 seconds
      setPhase("inhale");
      setTimeLeft(4);
      
      timer = setTimeout(() => {
        // Hold: 7 seconds
        setPhase("hold");
        setTimeLeft(7);
        
        timer = setTimeout(() => {
          // Exhale: 8 seconds
          setPhase("exhale");
          setTimeLeft(8);
          
          timer = setTimeout(() => {
            if (isActive) cycleBreathing();
          }, 8000);
        }, 7000);
      }, 4000);
    };

    cycleBreathing();

    return () => clearTimeout(timer);
  }, [isActive]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft > 0 && isActive) {
      const countdown = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timeLeft, isActive]);

  const getScale = () => {
    if (phase === "idle") return 1;
    if (phase === "inhale") return 1.5;
    if (phase === "hold") return 1.5;
    if (phase === "exhale") return 1;
    return 1;
  };

  const getDuration = () => {
    if (phase === "inhale") return 4;
    if (phase === "hold") return 7; // It stays expanded, so duration doesn't matter much for scale, but colors might shift
    if (phase === "exhale") return 8;
    return 1;
  };

  const getMessage = () => {
    switch (phase) {
      case "inhale": return "Breathe In...";
      case "hold": return "Hold...";
      case "exhale": return "Breathe Out...";
      default: return "4-7-8 Breathing";
    }
  };

  return (
    <div className="w-full bg-[#1c1c36] rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {isActive && (
          <button onClick={() => setIsActive(false)} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative w-32 h-32 flex items-center justify-center mb-6">
          {/* Breathing Orb */}
          <motion.div
            animate={{
              scale: getScale(),
              backgroundColor: phase === "hold" ? "#8b5cf6" : phase === "inhale" ? "#a78bfa" : "#6d28d9",
            }}
            transition={{
              duration: getDuration(),
              ease: "easeInOut",
            }}
            className="absolute w-24 h-24 rounded-full blur-xl opacity-50"
          />
          <motion.div
            animate={{
              scale: getScale(),
              backgroundColor: phase === "hold" ? "#6d28d9" : phase === "inhale" ? "#8b5cf6" : "#4c1d95",
            }}
            transition={{
              duration: getDuration(),
              ease: "easeInOut",
            }}
            className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border border-white/20"
          >
            {!isActive ? (
              <button 
                onClick={() => setIsActive(true)}
                className="w-full h-full flex items-center justify-center rounded-full"
              >
                <Play className="text-white ml-1" size={28} />
              </button>
            ) : (
              <span className="text-3xl font-bold text-white tabular-nums">{timeLeft}</span>
            )}
          </motion.div>
        </div>

        <h3 className="text-xl font-bold text-white mb-1 transition-all">
          {getMessage()}
        </h3>
        <p className="text-gray-400 text-sm text-center max-w-[200px]">
          {!isActive 
            ? "Calm your nervous system in 19 seconds." 
            : "Focus on your lungs expanding and contracting."}
        </p>
      </div>
    </div>
  );
}
