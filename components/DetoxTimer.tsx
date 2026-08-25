"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Square, BrainCircuit } from "lucide-react";

export default function DetoxTimer() {
  const [duration, setDuration] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setTimeout(() => setIsActive(false), 0);
      // Play a sound or notify?
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startDetox = (seconds: number) => {
    setDuration(seconds);
    setTimeLeft(seconds);
    setIsActive(true);
  };

  const stopDetox = () => {
    setIsActive(false);
    setTimeLeft(0);
    setDuration(0);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Calculate progress 0 to 1
  const progress = duration > 0 ? 1 - (timeLeft / duration) : 0;

  return (
    <div className="mt-16 p-8 md:p-12 rounded-[2rem] border border-white/10 bg-[#050510]/50 relative overflow-hidden backdrop-blur-xl">
      {/* Background ambient glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors duration-1000"
        style={{
          backgroundColor: isActive ? `rgb(${255 * (1 - progress)}, ${100 + 155 * progress}, 255)` : 'rgba(124, 58, 237, 0.5)'
        }}
      />

      <div className="flex flex-col items-center relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <BrainCircuit className="text-fuchsia-400" />
          <h2 className="text-2xl font-bold tracking-widest uppercase font-mono text-white">Receptor Reset Protocol</h2>
        </div>
        <p className="text-gray-400 text-center max-w-md mb-12">
          Initiate a dopamine fast. The neuro-core visualizer will track your receptor up-regulation in real time.
        </p>

        {/* Completely new designed element: The Neuro-Core Visualizer */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-12">
          {/* Base Rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              animate={{ rotate: isActive ? 360 : 0 }}
              transition={{ duration: 20 * ring, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-white/5"
              style={{ width: `${100 + ring * 20}%`, height: `${100 + ring * 20}%`, top: `-${ring * 10}%`, left: `-${ring * 10}%` }}
            />
          ))}

          {/* Liquid Core */}
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-white/10 bg-black/50 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
            <motion.div
              className="absolute bottom-0 left-0 right-0 w-full bg-gradient-to-t from-emerald-500 to-cyan-400 opacity-80"
              initial={{ height: "0%" }}
              animate={{ height: `${progress * 100}%` }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            {/* Toxic residue that fades out */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-rose-600/40 to-orange-500/20 mix-blend-overlay"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 - progress }}
            />
            
            {/* Center Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center mix-blend-difference text-white">
              <span className="font-mono text-4xl font-bold tracking-tighter">
                {isActive ? formatTime(timeLeft) : "00:00:00"}
              </span>
              <span className="text-xs tracking-widest uppercase mt-1 opacity-70">
                {isActive ? `${Math.round(progress * 100)}% Cleansed` : "Awaiting Protocol"}
              </span>
            </div>
          </div>
          
          {/* Orbital Particles */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
              >
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full"
                    animate={{
                      x: [0, Math.cos(i * 30) * (100 + ((i * 17) % 50))],
                      y: [0, Math.sin(i * 30) * (100 + ((i * 23) % 50))],
                      opacity: [1, 0],
                      scale: [1, 0],
                    }}
                    transition={{
                      duration: 2 + ((i * 7) % 2),
                      repeat: Infinity,
                      delay: ((i * 11) % 20) / 10,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        {!isActive ? (
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={() => startDetox(60)}
              className="px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 text-gray-300 font-mono text-sm uppercase tracking-wider transition-colors"
            >
              1 Min Test
            </button>
            <button 
              onClick={() => startDetox(3600)}
              className="px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 text-gray-300 font-mono text-sm uppercase tracking-wider transition-colors"
            >
              1 Hour
            </button>
            <button 
              onClick={() => startDetox(86400)}
              className="px-8 py-3 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-mono text-sm uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(192,132,252,0.4)]"
            >
              24 Hours
            </button>
          </div>
        ) : (
          <button 
            onClick={stopDetox}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 font-mono text-sm uppercase tracking-wider transition-colors"
          >
            <Square size={16} /> Abort Protocol
          </button>
        )}
      </div>
    </div>
  );
}
