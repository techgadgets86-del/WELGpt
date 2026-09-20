"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, RotateCcw, BookOpen, Clock, Activity } from "lucide-react";

export default function TimerModal({
  isOpen,
  onClose,
  task
}: {
  isOpen: boolean;
  onClose: () => void;
  task: { title: string; desc: string } | null;
}) {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
  const [isActive, setIsActive] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialImages, setTutorialImages] = useState<string[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a sound or vibrate here if possible
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (task) {
      // Pre-generate prompts for the tutorial
      const encodedTitle = encodeURIComponent(task.title.replace(/[^a-zA-Z0-9 ]/g, ""));
      setTutorialImages([
        `https://image.pollinations.ai/prompt/Step%201%20starting%20position%20for%20${encodedTitle}%20exercise%20fitness%20instruction%20realistic%20hyperdetailed%20gym?width=400&height=300&nologo=true`,
        `https://image.pollinations.ai/prompt/Step%202%20execution%20movement%20for%20${encodedTitle}%20exercise%20fitness%20instruction%20realistic%20hyperdetailed?width=400&height=300&nologo=true`,
        `https://image.pollinations.ai/prompt/Step%203%20final%20stretch%20pose%20for%20${encodedTitle}%20exercise%20fitness%20instruction%20realistic%20hyperdetailed?width=400&height=300&nologo=true`,
      ]);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setIsActive(false); setTimeLeft(300); };
  const addTime = (secondsToAdd: number) => setTimeLeft((prev) => prev + secondsToAdd);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0f0f23] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{task.title}</h2>
              <p className="text-sm text-gray-400">{task.desc}</p>
            </div>
            <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 md:p-8">
            {!showTutorial ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-4"
              >
                {/* Custom Timer UI */}
                <div className="relative mb-10 w-64 h-64 rounded-full border-4 border-white/5 flex items-center justify-center shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] bg-[#0a0a18]">
                  <div className="absolute inset-0 rounded-full border-4 border-fuchsia-500/20" />
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle 
                      cx="128" cy="128" r="124" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      className="text-fuchsia-500 transition-all duration-1000 ease-linear"
                      strokeDasharray={2 * Math.PI * 124}
                      strokeDashoffset={2 * Math.PI * 124 * (1 - timeLeft / 300)}
                    />
                  </svg>
                  <div className="text-center z-10">
                    <div className="text-6xl font-mono font-black text-white tracking-tighter shadow-fuchsia-500/50 drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </div>
                    <p className="text-fuchsia-400 font-medium uppercase tracking-widest text-xs mt-2 opacity-80">Remaining</p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => addTime(-60)} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-colors border border-white/10">-1 Min</button>
                  <button 
                    onClick={toggleTimer}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all shadow-lg ${isActive ? "bg-rose-500 hover:bg-rose-400 shadow-rose-500/30" : "bg-fuchsia-600 hover:bg-fuchsia-500 shadow-fuchsia-600/30"} transform hover:scale-105`}
                  >
                    {isActive ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                  </button>
                  <button onClick={resetTimer} className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10">
                    <RotateCcw size={18} />
                  </button>
                  <button onClick={() => addTime(60)} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-colors border border-white/10">+1 Min</button>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

                <button 
                  onClick={() => setShowTutorial(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-fuchsia-500/20 hover:from-indigo-500/30 hover:to-fuchsia-500/30 border border-fuchsia-500/30 text-white font-bold flex items-center justify-center gap-3 transition-all group"
                >
                  <BookOpen size={20} className="text-fuchsia-400 group-hover:scale-110 transition-transform" />
                  Deep Tutorial & AI Guide
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <button 
                  onClick={() => setShowTutorial(false)}
                  className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-fit"
                >
                  ← Back to Timer
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <Activity className="text-fuchsia-400" size={24} />
                  <h3 className="text-xl font-bold text-white">AI Step-by-Step Guide</h3>
                </div>

                <div className="space-y-6">
                  {tutorialImages.map((src, idx) => (
                    <div key={idx} className="bg-black/30 rounded-2xl p-4 border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full bg-fuchsia-600 flex items-center justify-center font-bold text-white shadow-lg">
                        {idx + 1}
                      </div>
                      <div className="aspect-video relative rounded-xl overflow-hidden bg-[#0a0a1a]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={src} 
                          alt={`Step ${idx + 1}`}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] to-transparent opacity-80" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-white font-medium text-sm md:text-base drop-shadow-md">
                            {idx === 0 && "Assume the starting position and stabilize your core."}
                            {idx === 1 && "Execute the primary movement smoothly with controlled breathing."}
                            {idx === 2 && "Hold the peak contraction or stretch before resetting."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
