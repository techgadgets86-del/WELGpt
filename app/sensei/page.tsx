"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useAudioFrequencies } from "@/lib/useAudioFrequencies";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Play, X, Activity, Sparkles, Flame, Shield, Zap, Target, Bot, Loader2, Plus, List } from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { auth, db } from "@/lib/firebase";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import AnimatedGuide from "@/components/AnimatedGuide";

type BodyPart = string | null;
interface SavedRoutine { id: string; title: string; color: string; description: string; exercise: string; duration?: number; }


// (BodyData remains unchanged)
export type BodyDataConfig = { title: string; icon: React.ReactNode; description: string; diagram: string; exercise: string; duration: number; color: string; };
const INITIAL_BODY_DATA: Record<string, BodyDataConfig> = {
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
  
  // Customization State
  const [bodyData, setBodyData] = useState<Record<string, BodyDataConfig>>(INITIAL_BODY_DATA);
  const [showQuestionnaire, setShowQuestionnaire] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { addXP } = useAuth();
  const { playingId, toggleSound, stopAudio } = useAudioFrequencies();
  const [user, setUser] = useState<User | null>(null); 
  const [savedRoutines, setSavedRoutines] = useState<SavedRoutine[]>([]) 
  const [showRoutinesMenu, setShowRoutinesMenu] = useState(false);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(collection(db, `users/${currentUser.uid}/customExercises`), orderBy("createdAt", "desc"));
        const unsubDb = onSnapshot(q, (snapshot) => {
          const routines = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as SavedRoutine));
          setSavedRoutines(routines);
        });
        return () => unsubDb();
      } else {
        setSavedRoutines([]);
      }
    });
    return () => unsubscribe();
  }, []);

    const launchSavedRoutine = (routine: SavedRoutine) => {
    const newData = {
      ...bodyData,
      [routine.id]: {
        title: routine.title,
        color: routine.color,
        description: routine.description,
        diagram: "AI GENERATED VECTOR",
        exercise: routine.exercise,
        duration: routine.duration || 180,
        icon: <Sparkles className="text-white" size={24} />
      }
    };
    setBodyData(newData);
    setActiveExercise(routine.id as BodyPart);
    setShowRoutinesMenu(false);
  };


  const [showCustomTargetModal, setShowCustomTargetModal] = useState(false);
  const [customTargetPrompt, setCustomTargetPrompt] = useState("");
  const [isGeneratingCustomTarget, setIsGeneratingCustomTarget] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const autoTarget = params.get('autoTarget');
      if (autoTarget) {
        setTimeout(() => {
          setCustomTargetPrompt(autoTarget);
          setShowCustomTargetModal(true);
        }, 0);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);
  
  const handleGenerateCustomTarget = async () => {
    if (!customTargetPrompt.trim()) return;
    setIsGeneratingCustomTarget(true);
    try {
      const res = await fetch("/api/custom-exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: customTargetPrompt })
      });
      const json = await res.json();
      if (json && json.data) {
        const newRoutine = {
          title: json.data.title,
          color: json.data.color || "#d946ef",
          description: json.data.desc,
          exercise: json.data.exercise,
          duration: 180,
          createdAt: new Date().toISOString()
        };
        
        // Save to Firestore if logged in
        let routineId = "custom";
        if (user) {
          const docRef = await addDoc(collection(db, `users/${user.uid}/customExercises`), newRoutine);
          routineId = docRef.id;
        }

        const newData = {
          ...bodyData,
          [routineId]: {
            ...newRoutine,
            diagram: "AI GENERATED VECTOR",
            icon: <Sparkles className="text-white" size={24} />
          }
        };
        setBodyData(newData);
        setShowCustomTargetModal(false);
        setCustomTargetPrompt("");
        setActiveExercise(routineId as BodyPart);
      }
    } catch (err) {
      console.error(err);
    }
    setIsGeneratingCustomTarget(false);
  };

  const [formData, setFormData] = useState({ age: "", weight: "", height: "", goal: "Hypertrophy" });

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOptimizing(true);
    try {
      const res = await fetch("/api/sensei-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data && data.core) {
        setBodyData({
          chest: INITIAL_BODY_DATA.chest, // Keep fallback
          shoulders: INITIAL_BODY_DATA.shoulders, // Keep fallback
          ...data,
          // Re-inject icons and colors for generated parts
          core: { ...data.core, icon: <Flame className="text-red-400" size={24} />, color: "#ef4444" },
          arms: { ...data.arms, icon: <Zap className="text-yellow-400" size={24} />, color: "#eab308" },
          legs: { ...data.legs, icon: <Activity className="text-emerald-400" size={24} />, color: "#34d399" },
        });
      }
      setShowQuestionnaire(false);
    } catch(err) {
      console.error(err);
      setShowQuestionnaire(false); // fallback
    }
    setIsOptimizing(false);
  };

  
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
      setTimeout(() => setActiveExercise(null), 0);
      stopAudio();
      addXP(50);
    }
    return () => clearInterval(interval);
  }, [activeExercise, timeLeft, addXP, stopAudio]);

  const startExercise = (part: BodyPart) => {
    if (!part) return;
    setActiveExercise(part);
    setTimeLeft(bodyData[part].duration);
  };

  const endExercise = () => {
    setActiveExercise(null);
    setTimeLeft(0);
    stopAudio();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto relative z-10 pt-4 h-full flex flex-col">
      {/* AI Optimize Questionnaire Modal */}
      <AnimatePresence>
        {showQuestionnaire && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#050510]/95 backdrop-blur-2xl flex items-center justify-center p-4 pt-safe pb-safe"
          >
            <motion.form 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#111127] border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden"
              onSubmit={handleOptimize}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-teal-500" />
              
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/5 rounded-full border border-white/10">
                  <Bot size={32} className="text-teal-400" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-center text-white mb-2">AI Protocol Optimization</h2>
              <p className="text-gray-400 text-center text-sm mb-8">
                Enter your biometrics to generate a scientifically optimal training protocol.
              </p>

              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Age</label>
                    <input type="number" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500" placeholder="e.g. 28" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Weight</label>
                    <input type="text" required value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500" placeholder="e.g. 180 lbs" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Height</label>
                    <input type="text" required value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500" placeholder="e.g. 5'10" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Primary Goal</label>
                    <select value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})} className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500">
                      <option>Hypertrophy</option>
                      <option>Fat Loss</option>
                      <option>Endurance</option>
                      <option>Flexibility</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                disabled={isOptimizing}
                type="submit" 
                className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-teal-600 text-white font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isOptimizing ? <Loader2 size={24} className="animate-spin" /> : <Activity size={24} />}
                {isOptimizing ? "Generating Protocol..." : "Optimize AI"}
              </button>
              
              <button 
                type="button"
                onClick={() => setShowQuestionnaire(false)}
                className="w-full mt-4 py-3 text-gray-400 text-sm hover:text-white transition-colors"
              >
                Skip & Use Standard Protocol
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
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
                  fill={hoveredPart === "shoulders" ? bodyData.shoulders.color : "rgba(255,255,255,0.05)"} 
                  stroke={hoveredPart === "shoulders" ? "#fff" : "rgba(255,255,255,0.2)"} 
                  strokeWidth="2" 
                  style={{ filter: hoveredPart === "shoulders" ? `drop-shadow(0 0 15px ${bodyData.shoulders.color})` : 'none', transition: 'fill 0.3s' }}
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
                  fill={hoveredPart === "chest" ? bodyData.chest.color : "rgba(255,255,255,0.08)"} 
                  stroke={hoveredPart === "chest" ? "#fff" : "rgba(255,255,255,0.2)"} 
                  strokeWidth="2"
                  style={{ filter: hoveredPart === "chest" ? `drop-shadow(0 0 15px ${bodyData.chest.color})` : 'none', transition: 'fill 0.3s' }}
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
                  fill={hoveredPart === "core" ? bodyData.core.color : "rgba(255,255,255,0.05)"} 
                  stroke={hoveredPart === "core" ? "#fff" : "rgba(255,255,255,0.2)"} 
                  strokeWidth="2"
                  style={{ filter: hoveredPart === "core" ? `drop-shadow(0 0 15px ${bodyData.core.color})` : 'none', transition: 'fill 0.3s' }}
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
                  fill={hoveredPart === "arms" ? bodyData.arms.color : "rgba(255,255,255,0.06)"} 
                  stroke={hoveredPart === "arms" ? "#fff" : "rgba(255,255,255,0.2)"} 
                  strokeWidth="2"
                  style={{ filter: hoveredPart === "arms" ? `drop-shadow(0 0 15px ${bodyData.arms.color})` : 'none', transition: 'fill 0.3s' }}
                />
                {/* Right Arm */}
                <path d="M165,115 Q180,160 175,210 L155,205 Q150,150 150,115 Z" 
                  fill={hoveredPart === "arms" ? bodyData.arms.color : "rgba(255,255,255,0.06)"} 
                  stroke={hoveredPart === "arms" ? "#fff" : "rgba(255,255,255,0.2)"} 
                  strokeWidth="2"
                  style={{ filter: hoveredPart === "arms" ? `drop-shadow(0 0 15px ${bodyData.arms.color})` : 'none', transition: 'fill 0.3s' }}
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
                  fill={hoveredPart === "legs" ? bodyData.legs.color : "rgba(255,255,255,0.07)"} 
                  stroke={hoveredPart === "legs" ? "#fff" : "rgba(255,255,255,0.2)"} 
                  strokeWidth="2"
                  style={{ filter: hoveredPart === "legs" ? `drop-shadow(0 0 15px ${bodyData.legs.color})` : 'none', transition: 'fill 0.3s' }}
                />
                {/* Right Leg */}
                <path d="M125,235 Q140,300 135,360 L105,360 Q105,280 102,240 Z" 
                  fill={hoveredPart === "legs" ? bodyData.legs.color : "rgba(255,255,255,0.07)"} 
                  stroke={hoveredPart === "legs" ? "#fff" : "rgba(255,255,255,0.2)"} 
                  strokeWidth="2"
                  style={{ filter: hoveredPart === "legs" ? `drop-shadow(0 0 15px ${bodyData.legs.color})` : 'none', transition: 'fill 0.3s' }}
                />
              </motion.g>

              {/* Head / Helmet (Non-interactive for now, just aesthetic) */}
              <motion.g animate={{ z: 10 }}>
                <path d="M85,30 Q100,10 115,30 L115,65 Q100,80 85,65 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                {/* Visor */}
                <path d="M88,45 Q100,55 112,45 L112,50 Q100,60 88,50 Z" fill="#fff" style={{ filter: 'drop-shadow(0 0 5px #fff)' }} />
              </motion.g>
            </svg>
            <div className="mt-8 flex justify-center gap-4">
              <button 
                onClick={() => setShowCustomTargetModal(true)}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center gap-2 text-fuchsia-400 font-medium transition-colors"
              >
                <Sparkles size={18} /> Generate Custom Target
              </button>
              <button 
                onClick={() => setShowRoutinesMenu(true)}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center gap-2 text-teal-400 font-medium transition-colors"
              >
                <List size={18} /> My Routines
              </button>
            </div>
            
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
                <MagicCard gradientColor={bodyData[hoveredPart].color} gradientOpacity={0.15} className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10" style={{ boxShadow: `0 0 20px ${bodyData[hoveredPart].color}40` }}>
                      {bodyData[hoveredPart].icon}
                    </div>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wider">{bodyData[hoveredPart].title}</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Physiology</h4>
                      <p className="text-gray-300 leading-relaxed border-l-2 pl-4" style={{ borderColor: bodyData[hoveredPart].color }}>
                        {bodyData[hoveredPart].description}
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Target Diagram</h4>
                      <p className="text-white text-sm font-mono opacity-80">
                        &gt; {bodyData[hoveredPart].diagram}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Protocol</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">{bodyData[hoveredPart].exercise}</span>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-mono text-white">
                          {Math.floor(bodyData[hoveredPart].duration / 60)} MIN
                        </span>
                      </div>
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => startExercise(hoveredPart)}
                      className="w-full py-4 mt-4 rounded-xl font-bold text-white uppercase tracking-widest transition-all"
                      style={{ 
                        backgroundColor: bodyData[hoveredPart].color, 
                        boxShadow: `0 10px 30px -10px ${bodyData[hoveredPart].color}` 
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
              <div className="mb-8 relative group">
                <AnimatedGuide part={activeExercise as string} color={bodyData[activeExercise].color} />
              </div>
              <button
                onClick={() => toggleSound(activeExercise as string, "binaural", 40)}
                className={`mb-8 px-6 py-2 rounded-full border flex items-center justify-center gap-2 mx-auto transition-all ${
                  playingId === activeExercise 
                    ? "bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-400" 
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {playingId === activeExercise ? (
                  <>
                    <Activity size={16} className="animate-pulse" />
                    <span>40Hz Gamma Waves Active</span>
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    <span>Enable Neural Sync</span>
                  </>
                )}
              </button>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 uppercase tracking-tight">
                {bodyData[activeExercise].exercise}
              </h2>
              <p className="text-2xl text-gray-400 mb-16">{bodyData[activeExercise].title} Protocol</p>
              
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
                    stroke={bodyData[activeExercise].color} 
                    strokeWidth="8" 
                    fill="none"
                    strokeDasharray="283%" // roughly 2 * pi * r
                    initial={{ strokeDashoffset: "0%" }}
                    animate={{ strokeDashoffset: `${(1 - timeLeft / bodyData[activeExercise].duration) * 283}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 10px ${bodyData[activeExercise].color})` }}
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

      {/* Custom Target Modal */}
      <AnimatePresence>
        {showCustomTargetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-[#111127] rounded-3xl border border-white/10 p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowCustomTargetModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-fuchsia-500/20 text-fuchsia-400 rounded-xl">
                  <Sparkles size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">Custom Target</h2>
              </div>
              
              <p className="text-gray-400 mb-6">
                What do you want to train today? (e.g., &quot;Neck&quot;, &quot;Grip Strength&quot;, &quot;Posture&quot;, &quot;Ankles&quot;)
              </p>
              
              <input
                type="text"
                value={customTargetPrompt}
                onChange={(e) => setCustomTargetPrompt(e.target.value)}
                placeholder="Enter custom muscle group or goal..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-fuchsia-500 transition-colors mb-6"
              />
              
              <button
                onClick={handleGenerateCustomTarget}
                disabled={isGeneratingCustomTarget || !customTargetPrompt.trim()}
                className="w-full py-4 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-fuchsia-600 hover:bg-fuchsia-500 flex items-center justify-center gap-2"
              >
                {isGeneratingCustomTarget ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                {isGeneratingCustomTarget ? "Generating Protocol..." : "Generate AI Protocol"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Routines Menu Modal */}
      <AnimatePresence>
        {showRoutinesMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg max-h-[80vh] overflow-y-auto bg-[#111127] rounded-3xl border border-white/10 p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowRoutinesMenu(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-teal-500/20 text-teal-400 rounded-xl">
                  <List size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">My Custom Routines</h2>
              </div>
              
              {!user ? (
                <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-gray-400 mb-4">Please log in to save and view your custom AI routines.</p>
                </div>
              ) : savedRoutines.length === 0 ? (
                <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-gray-400 mb-4">You haven&apos;t generated any custom routines yet.</p>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {savedRoutines.map((routine) => (
                    <div 
                      key={routine.id}
                      onClick={() => launchSavedRoutine(routine)}
                      className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer transition-colors flex justify-between items-center group"
                    >
                      <div>
                        <h3 className="text-white font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: routine.color }} />
                          {routine.title}
                        </h3>
                        <p className="text-sm text-gray-400">{routine.exercise}</p>
                      </div>
                      <Play size={18} className="text-gray-500 group-hover:text-white transition-colors" />
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => { setShowRoutinesMenu(false); setShowCustomTargetModal(true); }}
                className="w-full py-4 mt-4 rounded-xl font-bold text-teal-400 transition-all bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Create New Routine
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
