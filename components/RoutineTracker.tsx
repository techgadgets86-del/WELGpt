"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sun, Moon, Sparkles } from "lucide-react";

export interface Task {
  id: string;
  time: string;
  title: string;
  desc: string;
}

export const INITIAL_MORNING_TASKS: Task[] = [
  { id: "m1", time: "07:00 AM", title: "Cellular Hydration", desc: "Drink 500ml of water with a pinch of sea salt for electrolytes." },
  { id: "m2", time: "07:15 AM", title: "Photon Absorption", desc: "10-15 minutes of direct sunlight viewing to spike morning cortisol." },
  { id: "m3", time: "07:45 AM", title: "Kinetic Activation", desc: "20 minutes of Zone 2 movement or mobility stretching." },
  { id: "m4", time: "08:30 AM", title: "Deep Work Block", desc: "90 minutes of hyper-focused flow state with zero distractions." }
];

export const INITIAL_EVENING_TASKS: Task[] = [
  { id: "e1", time: "08:00 PM", title: "Lux Reduction", desc: "Dim all overhead artificial lighting to signal melatonin production." },
  { id: "e2", time: "08:30 PM", title: "Digital Sunset", desc: "Strict blue-light blocking. Put all screens in another room." },
  { id: "e3", time: "09:00 PM", title: "Neuro-Supplements", desc: "Magnesium L-Threonate & Apigenin protocol." },
  { id: "e4", time: "09:30 PM", title: "Yoga Nidra", desc: "Non-sleep deep rest (NSDR) to transition into deep Delta sleep." }
];

export default function RoutineTracker({ morningTasks = INITIAL_MORNING_TASKS, eveningTasks = INITIAL_EVENING_TASKS }: { morningTasks?: Task[], eveningTasks?: Task[] }) {
  const [activeTab, setActiveTab] = useState<"morning" | "evening">("morning");
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const currentTasks = activeTab === "morning" ? morningTasks : eveningTasks;
  const progress = Math.round((currentTasks.filter(t => completed.has(t.id)).length / currentTasks.length) * 100);

  const toggleTask = (id: string) => {
    setCompleted(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        
        {/* Tab Switcher */}
        <div className="flex bg-[#111127] border border-white/10 p-1.5 rounded-2xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab("morning")}
            className={`relative flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "morning" ? "text-white" : "text-gray-500 hover:text-white"
            }`}
          >
            {activeTab === "morning" && (
              <motion.div layoutId="routineTab" className="absolute inset-0 bg-violet-600 rounded-xl" />
            )}
            <Sun size={18} className="relative z-10" />
            <span className="relative z-10">Morning Protocol</span>
          </button>
          <button
            onClick={() => setActiveTab("evening")}
            className={`relative flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "evening" ? "text-white" : "text-gray-500 hover:text-white"
            }`}
          >
            {activeTab === "evening" && (
              <motion.div layoutId="routineTab" className="absolute inset-0 bg-indigo-600 rounded-xl" />
            )}
            <Moon size={18} className="relative z-10" />
            <span className="relative z-10">Evening Protocol</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-4 w-full md:w-1/3">
          <span className="text-gray-400 text-sm font-medium w-12">{progress}%</span>
          <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden relative border border-white/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`absolute top-0 left-0 h-full ${activeTab === "morning" ? "bg-violet-500" : "bg-indigo-500"}`}
            />
          </div>
        </div>

      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-white/5" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 relative"
          >
            {currentTasks.map((task, index) => {
              const isDone = completed.has(task.id);
              
              return (
                <div key={task.id} className="flex gap-6 relative z-10 group">
                  
                  {/* Glowing Checkbox Node */}
                  <div className="relative shrink-0 mt-1">
                    {/* The connector line glow overlay */}
                    {isDone && index !== currentTasks.length - 1 && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: "4rem" }}
                        className={`absolute left-[11px] top-6 w-0.5 ${activeTab === "morning" ? "bg-violet-500" : "bg-indigo-500"} shadow-[0_0_10px_rgba(124,58,237,0.5)] z-0`}
                      />
                    )}
                    
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 bg-[#070714] ${
                        isDone 
                          ? (activeTab === "morning" ? "border-violet-500 bg-violet-500 shadow-[0_0_15px_rgba(124,58,237,0.6)]" : "border-indigo-500 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]")
                          : "border-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: isDone ? 1 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Check size={14} className="text-white" />
                      </motion.div>
                    </button>
                  </div>

                  {/* Task Card */}
                  <motion.div 
                    onClick={() => toggleTask(task.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                      isDone 
                        ? "bg-white/5 border-white/20" 
                        : "bg-[#111127] border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <h3 className={`text-xl font-semibold transition-colors duration-300 ${isDone ? "text-gray-300 line-through decoration-gray-500" : "text-white"}`}>
                        {task.title}
                      </h3>
                      <span className={`font-mono text-sm px-3 py-1 rounded-full ${isDone ? "bg-white/5 text-gray-500" : "bg-white/10 text-gray-300"}`}>
                        {task.time}
                      </span>
                    </div>
                    <p className={`text-sm transition-colors duration-300 ${isDone ? "text-gray-600" : "text-gray-400"}`}>
                      {task.desc}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* 100% Completion Message */}
        <AnimatePresence>
          {progress === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-violet-600/20 to-teal-600/20 border border-emerald-500/30 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-3xl" />
              <Sparkles size={32} className="text-emerald-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Protocol Optimized</h2>
              <p className="text-gray-300 max-w-md mx-auto">
                You have successfully executed your {activeTab} regimen. Your neurochemistry is fully primed for optimal performance.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
