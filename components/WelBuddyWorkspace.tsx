"use client";

import { useState, useEffect } from "react";
import { 
  Brain, 
  CheckSquare, 
  Calendar, 
  Mic, 
  Sparkles, 
  Zap, 
  Layers,
  ArrowRight,
  TrendingUp,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatInterface from "./ChatInterface";
import WelBuddyTasks from "./WelBuddyTasks";
import WelBuddyScheduler from "./WelBuddyScheduler";
import WelBuddyAudioNotes from "./WelBuddyAudioNotes";

export type WelBuddyTab = "chat" | "tasks" | "routine" | "audio";

function playTabTone(freq = 540, duration = 0.05) {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

export default function WelBuddyWorkspace() {
  const [activeTab, setActiveTab] = useState<WelBuddyTab>("chat");
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [injectedChatPrompt, setInjectedChatPrompt] = useState<string | null>(null);

  // Read pending tasks count
  useEffect(() => {
    const updateTaskCount = () => {
      const saved = localStorage.getItem("welbuddy_tasks");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const pending = parsed.filter((t) => !t.completed).length;
            setPendingTasksCount(pending);
          }
        } catch (e) {}
      }
    };

    updateTaskCount();
    window.addEventListener("storage", updateTaskCount);
    window.addEventListener("welbuddy_tasks_updated", updateTaskCount);
    const interval = setInterval(updateTaskCount, 2000);
    return () => {
      window.removeEventListener("storage", updateTaskCount);
      window.removeEventListener("welbuddy_tasks_updated", updateTaskCount);
      clearInterval(interval);
    };
  }, []);

  const handleTabSwitch = (tab: WelBuddyTab) => {
    setActiveTab(tab);
    playTabTone(tab === "chat" ? 540 : tab === "tasks" ? 600 : tab === "routine" ? 640 : 700);
  };

  const handleTaskToChat = (prompt: string) => {
    setInjectedChatPrompt(prompt);
    setActiveTab("chat");
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto relative z-10 pt-0 sm:pt-1 pb-1 sm:pb-4">
      {/* Top Workspace Segmented Control (Tabs) - Responsive Grid for all mobile screens */}
      <div className="px-1 sm:px-2 pb-2">
        <div className="grid grid-cols-4 gap-1 sm:gap-2 bg-[#111127] p-1 sm:p-1.5 rounded-2xl border border-white/10 shadow-lg">
          <button
            type="button"
            onClick={() => handleTabSwitch("chat")}
            className={`py-2 px-1 sm:px-3 rounded-xl font-bold text-[11px] sm:text-xs md:text-sm flex items-center justify-center gap-1 sm:gap-2 transition-all min-w-0 touch-manipulation ${
              activeTab === "chat"
                ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-600/30"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Brain size={14} className={`shrink-0 ${activeTab === "chat" ? "text-teal-300" : "text-gray-400"}`} />
            <span className="truncate">
              <span className="inline sm:hidden">Chat</span>
              <span className="hidden sm:inline">Co-Pilot Chat</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch("tasks")}
            className={`py-2 px-1 sm:px-3 rounded-xl font-bold text-[11px] sm:text-xs md:text-sm flex items-center justify-center gap-1 sm:gap-2 transition-all min-w-0 touch-manipulation ${
              activeTab === "tasks"
                ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-600/30"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <CheckSquare size={14} className={`shrink-0 ${activeTab === "tasks" ? "text-teal-300" : "text-gray-400"}`} />
            <span className="truncate">
              <span className="inline sm:hidden">Tasks</span>
              <span className="hidden sm:inline">WelBuddy Tasks</span>
            </span>
            {pendingTasksCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] font-mono font-bold shrink-0 ${
                activeTab === "tasks" ? "bg-white/20 text-white" : "bg-violet-500/30 text-violet-300"
              }`}>
                {pendingTasksCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch("routine")}
            className={`py-2 px-1 sm:px-3 rounded-xl font-bold text-[11px] sm:text-xs md:text-sm flex items-center justify-center gap-1 sm:gap-2 transition-all min-w-0 touch-manipulation ${
              activeTab === "routine"
                ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-600/30"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Calendar size={14} className={`shrink-0 ${activeTab === "routine" ? "text-teal-300" : "text-gray-400"}`} />
            <span className="truncate">
              <span className="inline sm:hidden">Routine</span>
              <span className="hidden sm:inline">Routine</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch("audio")}
            className={`py-2 px-1 sm:px-3 rounded-xl font-bold text-[11px] sm:text-xs md:text-sm flex items-center justify-center gap-1 sm:gap-2 transition-all min-w-0 touch-manipulation ${
              activeTab === "audio"
                ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-600/30"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Mic size={14} className={`shrink-0 ${activeTab === "audio" ? "text-teal-300" : "text-gray-400"}`} />
            <span className="truncate">
              <span className="inline sm:hidden">Audio</span>
              <span className="hidden sm:inline">Audio Notes</span>
            </span>
          </button>
        </div>
      </div>

      {/* Main Tab View */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="h-full"
            >
              <ChatInterface 
                injectedPrompt={injectedChatPrompt} 
                onClearInjectedPrompt={() => setInjectedChatPrompt(null)}
                onSwitchTab={handleTabSwitch}
              />
            </motion.div>
          )}

          {activeTab === "tasks" && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="h-full"
            >
              <WelBuddyTasks onSelectTaskForChat={handleTaskToChat} />
            </motion.div>
          )}

          {activeTab === "routine" && (
            <motion.div
              key="routine"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="h-full"
            >
              <WelBuddyScheduler onOptimizeInChat={handleTaskToChat} />
            </motion.div>
          )}

          {activeTab === "audio" && (
            <motion.div
              key="audio"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="h-full"
            >
              <WelBuddyAudioNotes onSwitchToTasks={() => handleTabSwitch("tasks")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
