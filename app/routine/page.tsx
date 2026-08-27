"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Loader2, X, Sparkles } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import RoutineTracker, { INITIAL_MORNING_TASKS, INITIAL_EVENING_TASKS, Task } from "@/components/RoutineTracker";


export default function RoutinePage() {
  const [morning, setMorning] = useState<Task[]>(INITIAL_MORNING_TASKS);
  const [evening, setEvening] = useState<Task[]>(INITIAL_EVENING_TASKS);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [custom, setCustom] = useState<Task[]>([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  
  const handleGenerateCustom = async () => {
    if (!customPrompt.trim()) return;
    setIsGeneratingCustom(true);
    try {
      const res = await fetch("/api/custom-routine", { 
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: customPrompt })
      });
      const data = await res.json();
      if (data && data.tasks) {
        setCustom(data.tasks);
        setShowCustomModal(false);
        setCustomPrompt("");
      }
    } catch (err) {
      console.error(err);
    }
    setIsGeneratingCustom(false);
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch("/api/routine-optimize", { method: "POST" });
      const data = await res.json();
      if (data && data.morning && data.evening) {
        setMorning(data.morning);
        setEvening(data.evening);
      }
    } catch (err) {
      console.error(err);
    }
    setIsOptimizing(false);
  };

  return (
    <div className="max-w-5xl mx-auto relative z-10 pt-4 pb-20 h-full flex flex-col">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white"
          >
            Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-teal-400">Routine.</span>
          </motion.h1>
          <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg max-w-2xl"
          >
            Your personalized daily schedule based on your neuroscience profile.
          </motion.p>
        </div>
        <motion.button 
          onClick={handleOptimize}
          disabled={isOptimizing}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors self-start md:self-end disabled:opacity-50"
        >
          {isOptimizing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          {isOptimizing ? "Optimizing..." : "AI Optimize"}
        </motion.button>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <RoutineTracker morningTasks={morning} eveningTasks={evening} customTasks={custom} onGenerateCustom={() => setShowCustomModal(true)} />
      </motion.div>

      {/* Custom Routine Modal */}
      <AnimatePresence>
        {showCustomModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-[#111127] rounded-3xl border border-white/10 p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowCustomModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-fuchsia-500/20 text-fuchsia-400 rounded-xl">
                  <Sparkles size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">Custom Protocol</h2>
              </div>
              
              <p className="text-gray-400 mb-6">
                What are your specific needs and goals for today? The AI will generate a highly optimized sequence of tasks for you.
              </p>
              
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. 'I need to recover from a marathon', or 'I have a big presentation at 2pm and need to stay sharp'"
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-fuchsia-500 transition-colors mb-6 resize-none"
              />
              
              <button
                onClick={handleGenerateCustom}
                disabled={isGeneratingCustom || !customPrompt.trim()}
                className="w-full py-4 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-fuchsia-600 hover:bg-fuchsia-500 flex items-center justify-center gap-2"
              >
                {isGeneratingCustom ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                {isGeneratingCustom ? "Generating Protocol..." : "Generate AI Protocol"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}