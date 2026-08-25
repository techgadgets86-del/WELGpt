"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Play, X, Activity, Flame, Shield, Zap, Target } from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";

type BodyPart = "chest" | "core" | "arms" | "legs" | "shoulders" | null;

// (BodyData remains unchanged)
const BODY_DATA = {
  chest: {
    title: "Pectoral Forging",
    icon: <Shield className="text-orange-400" size={24} />,
    description: "Develop armor-plated chest strength and posture alignment.",
    diagram: "Muscle Fibers: Type II (Fast Twitch). Focus on the sternocostal head for mass.",
    exercise: "Decline Push-Ups & Dips",
    duration: 300,
    color: "#f97316", // Orange
  },
  core: {
    title: "Iron Core",
    icon: <Flame className="text-red-400" size={24} />,
    description: "Build foundational kinetic transfer and abdominal density.",
    diagram: "Transverse abdominis activation required. Anti-rotation and stabilization.",
    exercise: "L-Sit & Hollow Body Hold",
    duration: 180,
    color: "#ef4444", // Red
  },
  arms: {
    title: "Steel Cables",
    icon: <Zap className="text-yellow-400" size={24} />,
    description: "Bicep peaks and tricep horseshoes for explosive pulling power.",
    diagram: "Biceps brachii & triceps brachii isometric tension tracking.",
    exercise: "Isometric Chin-Up Holds",
    duration: 240,
    color: "#eab308", // Yellow
  },
  legs: {
    title: "Pillars of Atlas",
    icon: <Activity className="text-emerald-400" size={24} />,
    description: "Ground-up force generation and metabolic conditioning.",
    diagram: "Quadriceps sweep and gluteal activation patterns.",
    exercise: "Pistol Squats & Lunges",
    duration: 400,
    color: "#34d399", // Emerald
  },
  shoulders: {
    title: "Boulder Shoulders",
    icon: <Target className="text-cyan-400" size={24} />,
    description: "Deltoid capping for structural width and pressing mechanics.",
    diagram: "Anterior, lateral, and posterior deltoid synchronization.",
    exercise: "Pike Push-Ups",
    duration: 300,
    color: "#22d3ee", // Cyan
  }
};

export default function SenseiPage() {
  const [hoveredPart, setHoveredPart] = useState<BodyPart>(null);
  const [activeExercise, setActiveExercise] = useState<BodyPart>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // 3D Parallax Mouse Tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeExercise && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && activeExercise) {
      // Play a sound or show completion?
      // For now, it just hits 0.
    }
    return () => clearInterval(interval);
  }, [activeExercise, timeLeft]);

  const startExercise = (part: BodyPart) => {
    if (!part) return;
    setActiveExercise(part);
    setTimeLeft(BODY_DATA[part].duration);
  };

  const endExercise = () => {
    setActiveExercise(null);
    setTimeLeft(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto relative z-10 pt-4 h-full flex flex-col">
      <header className="mb-8">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-white font-serif"
        >
          Sensei <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Training.</span>
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl"
        >
          Hover over the muscular groups to analyze. Click to initiate the protocol.
        </motion.p>
      </header>

      <div className="flex-1 flex flex-col md:flex-row gap-8 relative">
        {/* Left Side: 3D Holographic Sensei Model */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="flex-1 flex items-center justify-center relative perspective-[1000px]"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#111127] to-transparent z-0 pointer-events-none" />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative z-10 w-[300px] h-[500px]"
          >
            {/* Ambient Background Aura */}
            <div className="absolute inset-0 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" style={{ transform: "translateZ(-50px)" }} />

            {/* The SVG Sensei */}
            <svg viewBox="0 0 200 400" className="w-full h-full overflow-visible drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]">
              {/* Shoulders */}
              <motion.g 
                onMouseEnter={() => setHoveredPart("shoulders")}
                onMouseLeave={() => setHoveredPart(null)}
                onClick={() => startExercise("shoulders")}
                className="cursor-pointer"
                animate={{ z: hoveredPart === "shoulders" ? 30 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <path d="M50,80 Q100,50 150,80 L160,110 Q100,100 40,110 Z" 
                  fill={hoveredPart === "shoulders" ? BODY_DATA.shoulders.color : "rgba(255,255,255,0.05)"} 
                  stroke={hoveredPart === "shoulders" ? "#fff" : "rgba(255,255,255,0.2)"} 
                  strokeWidth="2" 
                  style={{ filter: hoveredPart === "shoulders" ? `drop-shadow(0 0 15px ${BODY_DATA.shoulders.color})` : 'none', transition: 'fill 0.3s' }}
                />
              </motion.g>

              {/* Chest */}
              <motion.g 
                onMouseEnter={() => setHoveredPart("chest")}
                onMouseLeave={() => setHoveredPart(null)}
                onClick={() => startExercise("chest")}
                className="cursor-pointer"
                animate={{ z: hoveredPart === "chest" ? 40 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <path d="M55,115 Q100,105 145,115 L140,150 Q100,160 60,150 Z" 
                  fill={hoveredPart === "chest" ? BODY_DATA.chest.color : "rgba(255,255,255,0.08)"} 
                  stroke={hoveredPart === "chest" ? "#fff" : "rgba(255,255,255,0.2)"} 
                  strokeWidth="2"
                  style={{ filter: hoveredPart === "chest" ? `drop-shadow(0 0 15px ${BODY_DATA.chest.color})` : 'none', transition: 'fill 0.3s' }}
                />
                <line x1="100" y1="110" x2="100" y2="155" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              </motion.g>

              {/* Core / Abs */}
              <motion.g 
                onMouseEnter={() => setHoveredPart("core")}
                onMouseLeave={() => setHoveredPart(null)}
                onClick={() => startExercise("core")}
                className="cursor-pointer"
                animate={{ z: hoveredPart === "core" ? 35 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <path d="M65,155 Q100,165 135,155 L125,230 Q100,240 75,230 Z" 
                  fill={hoveredPart === "core" ? BODY_DATA.core.color : "rgba(255,255,255,0.05)"} 
                  stroke={hoveredPart === "core" ? "#fff" : "rgba(255,255,255,0.2)"} 
                  strokeWidth="2"
                  style={{ filter: hoveredPart === "core" ? `drop-shadow(0 0 15px ${BODY_DATA.core.color})` : 'none', transition: 'fill 0.3s' }}
                />
                {/* Ab grid lines */}
                <line x1="100" y1="160" x2="100" y2="235" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <line x1="70" y1="180" x2="130" y2="180" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <line x1="72" y1="205" x2="128" y2="205" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              </motion.g>

              {/* Arms (Left & Right grouped) */}
              <motion.g 
                onMouseEnter={() => setHoveredPart("arms")}
                onMouseLeave={() => setHoveredPart(null)}
                onClick={() => startExercise("arms")}
                className="cursor-pointer"
                animate={{ z: hoveredPart === "arms" ? 25 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Left Arm */}
                <path d="M35,115 Q20,160 25,210 L45,205 Q50,150 50,115 Z" 
                  fill={hoveredPart === "arms" ? BODY_DATA.arms.color : "rgba(255,255,255,0.06)"} 
                  stroke={hoveredPart === "arms" ? "#fff" : "rgba(255,255,255,0.2)"} 
                  strokeWidth="2"
                  style={{ filter: hoveredPart === "arms" ? `drop-shadow(0 0 15px ${BODY_DATA.arms.color})` : 'none', transition: 'fill 0.3s' }}
                />
                {/* Right Arm */}
                <path d="M165,115 Q180,160 175,210 L155,205 Q150,150 150,115 Z" 
                  fill={hoveredPart === "arms" ? BODY_DATA.arms.color : "rgba(255,255,255,0.06)"} 
                  stroke={hoveredPart === "arms" ? "#fff" : "rgba(255,255,255,0.2)"} 
                  strokeWidth="2"
                  style={{ filter: hoveredPart === "arms" ? `drop-shadow(0 0 15px ${BODY_DATA.arms.color})` : 'none', transition: 'fill 0.3s' }}
                />
              </motion.g>

              {/* Legs */}
              <motion.g 
                onMouseEnter={() => setHoveredPart("legs")}
                onMouseLeave={() => setHoveredPart(null)}
                onClick={() => startExercise("legs")}
                className="cursor-pointer"
                animate={{ z: hoveredPart === "legs" ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Left Leg */}
                <path d="M75,235 Q60,300 65,360 L95,360 Q95,280 98,240 Z" 
                  fill={hoveredPart === "legs" ? BODY_DATA.legs.color : "rgba(255,255,255,0.07)"} 
                  stroke={hoveredPart === "legs" ? "#fff" : "rgba(255,255,255,0.2)"} 
                  strokeWidth="2"
                  style={{ filter: hoveredPart === "legs" ? `drop-shadow(0 0 15px ${BODY_DATA.legs.color})` : 'none', transition: 'fill 0.3s' }}
                />
                {/* Right Leg */}
                <path d="M125,235 Q140,300 135,360 L105,360 Q105,280 102,240 Z" 
                  fill={hoveredPart === "legs" ? BODY_DATA.legs.color : "rgba(255,255,255,0.07)"} 
                  stroke={hoveredPart === "legs" ? "#fff" : "rgba(255,255,255,0.2)"} 
                  strokeWidth="2"
                  style={{ filter: hoveredPart === "legs" ? `drop-shadow(0 0 15px ${BODY_DATA.legs.color})` : 'none', transition: 'fill 0.3s' }}
                />
              </motion.g>

              {/* Head / Helmet (Non-interactive for now, just aesthetic) */}
              <motion.g animate={{ z: 10 }}>
                <path d="M85,30 Q100,10 115,30 L115,65 Q100,80 85,65 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                {/* Visor */}
                <path d="M88,45 Q100,55 112,45 L112,50 Q100,60 88,50 Z" fill="#fff" style={{ filter: 'drop-shadow(0 0 5px #fff)' }} />
              </motion.g>
            </svg>
            
            {/* Ambient Base Glow */}
            <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-[200px] h-[20px] bg-white/20 blur-xl rounded-full" />
          </motion.div>
        </div>

        {/* Right Side: Holographic UI Dashboard */}
        <div className="flex-1 min-w-[300px] max-w-md flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {hoveredPart ? (
              <motion.div
                key={hoveredPart}
                initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <MagicCard gradientColor={BODY_DATA[hoveredPart].color} gradientOpacity={0.15} className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10" style={{ boxShadow: `0 0 20px ${BODY_DATA[hoveredPart].color}40` }}>
                      {BODY_DATA[hoveredPart].icon}
                    </div>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wider">{BODY_DATA[hoveredPart].title}</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Physiology</h4>
                      <p className="text-gray-300 leading-relaxed border-l-2 pl-4" style={{ borderColor: BODY_DATA[hoveredPart].color }}>
                        {BODY_DATA[hoveredPart].description}
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Target Diagram</h4>
                      <p className="text-white text-sm font-mono opacity-80">
                        &gt; {BODY_DATA[hoveredPart].diagram}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Protocol</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">{BODY_DATA[hoveredPart].exercise}</span>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-mono text-white">
                          {Math.floor(BODY_DATA[hoveredPart].duration / 60)} MIN
                        </span>
                      </div>
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => startExercise(hoveredPart)}
                      className="w-full py-4 mt-4 rounded-xl font-bold text-white uppercase tracking-widest transition-all"
                      style={{ 
                        backgroundColor: BODY_DATA[hoveredPart].color, 
                        boxShadow: `0 10px 30px -10px ${BODY_DATA[hoveredPart].color}` 
                      }}
                    >
                      Initiate Protocol
                    </motion.button>
                  </div>
                </MagicCard>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center p-12 border border-white/5 border-dashed rounded-3xl bg-white/5 flex flex-col items-center justify-center gap-4"
              >
                <Target className="text-gray-500" size={48} />
                <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Awaiting target selection...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Fullscreen Exercise Modal Timer */}
      <AnimatePresence>
        {activeExercise && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-50 bg-[#050510]/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
          >
            <button 
              onClick={endExercise}
              className="absolute top-8 right-8 p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"
            >
              <X size={24} />
            </button>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center p-6 rounded-2xl bg-white/5 mb-8 border border-white/10" style={{ borderColor: BODY_DATA[activeExercise].color, boxShadow: `0 0 50px ${BODY_DATA[activeExercise].color}40` }}>
                {BODY_DATA[activeExercise].icon}
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 uppercase tracking-tight">
                {BODY_DATA[activeExercise].exercise}
              </h2>
              <p className="text-2xl text-gray-400 mb-16">{BODY_DATA[activeExercise].title} Protocol</p>
              
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-64 h-64 md:w-80 md:h-80 transform -rotate-90">
                  <circle 
                    cx="50%" 
                    cy="50%" 
                    r="45%" 
                    stroke="rgba(255,255,255,0.1)" 
                    strokeWidth="4" 
                    fill="none" 
                  />
                  <motion.circle 
                    cx="50%" 
                    cy="50%" 
                    r="45%" 
                    stroke={BODY_DATA[activeExercise].color} 
                    strokeWidth="8" 
                    fill="none"
                    strokeDasharray="283%" // roughly 2 * pi * r
                    initial={{ strokeDashoffset: "0%" }}
                    animate={{ strokeDashoffset: `${(1 - timeLeft / BODY_DATA[activeExercise].duration) * 283}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 10px ${BODY_DATA[activeExercise].color})` }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="font-mono text-6xl md:text-8xl font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] tracking-tighter">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
