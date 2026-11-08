"use client";

import { useState, useEffect } from "react";
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Sparkles, 
  Flame, 
  Zap, 
  Brain, 
  Clock, 
  ArrowRight, 
  Check, 
  AlertCircle,
  TrendingUp,
  Filter,
  Layers,
  Activity,
  Dumbbell,
  Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { 
  WelBuddyTask, 
  syncAllRoutineExercises, 
  getSavedWelBuddyTasks, 
  saveWelBuddyTasks 
} from "@/lib/welbuddyTaskSync";

export type { WelBuddyTask };

function playHapticTone(freq = 520, duration = 0.08) {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

const DEFAULT_TASKS: WelBuddyTask[] = [
  {
    id: "task_1",
    title: "Execute 90m Deep Sprint: Primary business deliverable",
    category: "sprint",
    priority: "high",
    estimatedMinutes: 90,
    completed: false,
    createdAt: Date.now() - 3600000,
  },
  {
    id: "task_2",
    title: "10m Afternoon Dopamine NSDR reset (2 PM window)",
    category: "wellness",
    priority: "quick",
    estimatedMinutes: 10,
    completed: false,
    createdAt: Date.now() - 7200000,
  },
  {
    id: "task_3",
    title: "Review pipeline & follow up with 3 high-value clients",
    category: "business",
    priority: "high",
    estimatedMinutes: 30,
    completed: false,
    createdAt: Date.now() - 10800000,
  },
  {
    id: "task_4",
    title: "2-Minute Physiological Sigh to lower pre-meeting cortisol",
    category: "wellness",
    priority: "quick",
    estimatedMinutes: 5,
    completed: true,
    createdAt: Date.now() - 14400000,
  },
];

export default function WelBuddyTasks({
  onSelectTaskForChat,
}: {
  onSelectTaskForChat?: (taskTitle: string) => void;
}) {
  const router = useRouter();
  const { profile, updateUserData } = useAuth();
  const [tasks, setTasks] = useState<WelBuddyTask[]>([]);
  const [filter, setFilter] = useState<"all" | "business" | "wellness" | "sprint">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"business" | "wellness" | "sprint">("business");
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "quick">("high");
  const [newMinutes, setNewMinutes] = useState(45);
  const [breakingDownId, setBreakingDownId] = useState<string | null>(null);

  // Load and auto-sync routine exercises on mount
  useEffect(() => {
    // 1. Sync any exercises from daily plan / default routines into WelBuddy Tasks
    syncAllRoutineExercises({ dailyPlan: profile?.dailyPlan });

    const loadTasks = () => {
      const saved = getSavedWelBuddyTasks();
      if (saved.length > 0) {
        setTasks(saved);
      } else {
        setTasks(DEFAULT_TASKS);
        saveWelBuddyTasks(DEFAULT_TASKS);
      }
    };

    loadTasks();

    // Listen for real-time task updates from Routine Tracker or Chat
    const handleUpdate = () => {
      const current = getSavedWelBuddyTasks();
      if (current.length > 0) setTasks(current);
    };

    window.addEventListener("welbuddy_tasks_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("welbuddy_tasks_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [profile?.dailyPlan]);

  // Sync tasks on change
  const saveTasks = (updated: WelBuddyTask[]) => {
    setTasks(updated);
    saveWelBuddyTasks(updated);
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const nextState = !t.completed;
        if (nextState) {
          playHapticTone(680, 0.1);
        } else {
          playHapticTone(340, 0.06);
        }
        return { ...t, completed: nextState };
      }
      return t;
    });
    saveTasks(updated);
  };

  const handleToggleSubTask = (taskId: string, subId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId && t.subTasks) {
        const subUpdated = t.subTasks.map((s) => (s.id === subId ? { ...s, completed: !s.completed } : s));
        const allCompleted = subUpdated.every((s) => s.completed);
        return { ...t, subTasks: subUpdated, completed: allCompleted ? true : t.completed };
      }
      return t;
    });
    playHapticTone(580, 0.08);
    saveTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
    playHapticTone(280, 0.08);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: WelBuddyTask = {
      id: `task_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      estimatedMinutes: Number(newMinutes) || 30,
      completed: false,
      createdAt: Date.now(),
    };

    const updated = [newTask, ...tasks];
    saveTasks(updated);
    setNewTitle("");
    setShowAddModal(false);
    playHapticTone(620, 0.1);
  };

  // AI Task Decomposition (Muse.ai-style breakdown)
  const handleBreakdownTask = async (task: WelBuddyTask) => {
    setBreakingDownId(task.id);
    playHapticTone(500, 0.08);

    try {
      const res = await fetch("/api/welbuddy/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskTitle: task.title,
          mode: "task_breakdown",
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.tasks)) {
        const subTasks = data.tasks.slice(0, 3).map((st: { id: string; title: string }, i: number) => ({
          id: `sub_${Date.now()}_${i}`,
          title: st.title,
          completed: false,
        }));

        const updated = tasks.map((t) => (t.id === task.id ? { ...t, subTasks } : t));
        saveTasks(updated);
        playHapticTone(720, 0.12);
      }
    } catch (err) {
      console.error("Task breakdown failed:", err);
      // Fallback local breakdown
      const fallbackSubs = [
        { id: `sub_${Date.now()}_1`, title: "Define the core 20% output metric", completed: false },
        { id: `sub_${Date.now()}_2`, title: "Eliminate tabs & lock in 45m uninterrupted block", completed: false },
        { id: `sub_${Date.now()}_3`, title: "Ship iteration & execute 2m vagus breathing reset", completed: false },
      ];
      const updated = tasks.map((t) => (t.id === task.id ? { ...t, subTasks: fallbackSubs } : t));
      saveTasks(updated);
    } finally {
      setBreakingDownId(null);
    }
  };

  const handleLaunchSprint = (task: WelBuddyTask) => {
    localStorage.setItem("welgpt_active_task", task.title);
    playHapticTone(600, 0.1);
    router.push("/detox");
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "all") return true;
    return t.category === filter;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-2 py-3 overflow-y-auto no-scrollbar">
      {/* Top Banner Stats */}
      <div className="bg-[#111127] border border-white/10 rounded-2xl p-4 md:p-5 mb-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                WelBuddy Tasks Engine
              </span>
              <span className="text-gray-400 text-xs">
                • {tasks.length} Total • {completedCount} Done
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Daily Executive &amp; Wellness Action Hub
            </h2>
            <p className="text-gray-400 text-xs md:text-sm mt-0.5">
              High-leverage business tasks paired with mandatory nervous system protection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("welbuddy_open_notifications_modal"));
                }
              }}
              className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm touch-manipulation min-h-[40px]"
              title="Configure Lock-Screen & Background Notifications"
            >
              <Bell size={14} className="text-teal-400" />
              <span>Lock-Screen Alerts</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all touch-manipulation min-h-[40px]"
            >
              <Plus size={16} /> New Task
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-4">
          <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-teal-400 via-violet-500 to-purple-500"
            />
          </div>
          <span className="text-xs font-mono font-bold text-teal-300 shrink-0">
            {progressPercent}% Complete
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
        <div className="flex items-center gap-1 bg-[#111127] p-1 rounded-xl border border-white/10 text-xs overflow-x-auto no-scrollbar w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap text-[11px] sm:text-xs touch-manipulation ${
              filter === "all" ? "bg-violet-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("business")}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap text-[11px] sm:text-xs flex items-center gap-1 touch-manipulation ${
              filter === "business" ? "bg-violet-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
            }`}
          >
            ⚡ Business
          </button>
          <button
            type="button"
            onClick={() => setFilter("wellness")}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap text-[11px] sm:text-xs flex items-center gap-1 touch-manipulation ${
              filter === "wellness" ? "bg-violet-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
            }`}
          >
            🧘 Wellness
          </button>
          <button
            type="button"
            onClick={() => setFilter("sprint")}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap text-[11px] sm:text-xs flex items-center gap-1 touch-manipulation ${
              filter === "sprint" ? "bg-violet-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
            }`}
          >
            🎯 Sprints
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 px-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Routines Synced
          </span>
          {tasks.some((t) => t.completed) && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Clear completed tasks?")) {
                  saveTasks(tasks.filter((t) => !t.completed));
                }
              }}
              className="text-[11px] font-mono text-gray-500 hover:text-rose-400 transition-colors whitespace-nowrap"
            >
              Clear Done
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3 flex-1 pb-16">
        <AnimatePresence>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-[#111127]/50">
              <CheckSquare size={36} className="mx-auto text-gray-600 mb-3" />
              <p className="text-white font-bold text-sm">No tasks in this category.</p>
              <p className="text-gray-500 text-xs mt-1">
                Add a task above or ask WelBuddy to synthesize your daily priorities.
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isBreaking = breakingDownId === task.id;
              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-4 rounded-2xl border transition-all ${
                    task.completed
                      ? "bg-[#111127]/40 border-white/5 opacity-65"
                      : "bg-[#111127] border-white/10 hover:border-violet-500/40 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id)}
                      className="mt-0.5 text-gray-400 hover:text-teal-400 transition-colors shrink-0"
                    >
                      {task.completed ? (
                        <div className="w-5 h-5 rounded-md bg-teal-500/20 border border-teal-400/60 flex items-center justify-center text-teal-300">
                          <Check size={13} className="stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-md border border-white/20 hover:border-teal-400 transition-colors" />
                      )}
                    </button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {/* Priority Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono ${
                            task.priority === "high"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : task.priority === "quick"
                              ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          }`}
                        >
                          {task.priority === "high" ? "🔥 High Leverage" : task.priority === "quick" ? "⚡ Quick Win" : "📌 Standard"}
                        </span>

                        {/* Category Badge */}
                        <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                          {task.category === "business" && "💼 Business"}
                          {task.category === "wellness" && "🧘 Mental Wellness"}
                          {task.category === "sprint" && "🎯 Deep Flow Sprint"}
                        </span>

                        {/* Routine Exercise Origin Badge */}
                        {task.fromRoutine && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1 font-mono">
                            🏋️ Routine Exercise {task.routineTime && `(${task.routineTime})`}
                          </span>
                        )}

                        {/* Time estimate */}
                        <span className="text-[10px] font-mono text-gray-500 flex items-center gap-0.5 ml-auto">
                          <Clock size={11} /> {task.estimatedMinutes}m
                        </span>
                      </div>

                      {/* Title */}
                      <p
                        className={`text-sm md:text-base font-semibold leading-snug transition-all ${
                          task.completed ? "line-through text-gray-500" : "text-white"
                        }`}
                      >
                        {task.title}
                      </p>

                      {/* Sub-tasks breakdown if present */}
                      {task.subTasks && task.subTasks.length > 0 && (
                        <div className="mt-3 pl-2 border-l-2 border-violet-500/30 space-y-2">
                          <p className="text-[10px] font-mono uppercase font-bold text-violet-300 tracking-wider">
                            WelBuddy Sub-Steps:
                          </p>
                          {task.subTasks.map((st) => (
                            <div key={st.id} className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleSubTask(task.id, st.id)}
                                className="text-gray-400 hover:text-teal-400"
                              >
                                {st.completed ? (
                                  <div className="w-3.5 h-3.5 rounded bg-teal-500/20 border border-teal-400/60 flex items-center justify-center text-teal-300">
                                    <Check size={9} />
                                  </div>
                                ) : (
                                  <div className="w-3.5 h-3.5 rounded border border-white/20" />
                                )}
                              </button>
                              <span
                                className={`text-xs ${
                                  st.completed ? "line-through text-gray-500" : "text-gray-300"
                                }`}
                              >
                                {st.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action buttons under task */}
                      {!task.completed && (
                        <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-white/5">
                          {/* AI Breakdown Button */}
                          {!task.subTasks && (
                            <button
                              type="button"
                              onClick={() => handleBreakdownTask(task)}
                              disabled={isBreaking}
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/30 text-gray-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all"
                            >
                              <Sparkles size={12} className={isBreaking ? "animate-spin text-violet-400" : "text-violet-400"} />
                              {isBreaking ? "Breaking Down..." : "Decompose with AI"}
                            </button>
                          )}

                          {/* Launch 90m sprint */}
                          <button
                            type="button"
                            onClick={() => handleLaunchSprint(task)}
                            className="px-2.5 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-teal-300 text-xs font-medium flex items-center gap-1.5 transition-all"
                          >
                            <Zap size={12} /> Launch Flow Sprint
                          </button>

                          {/* Routine Link if from routine */}
                          {task.fromRoutine && (
                            <button
                              type="button"
                              onClick={() => router.push(`/routine`)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-1.5 transition-all"
                            >
                              <Activity size={12} /> Open in Routine
                            </button>
                          )}

                          {/* Ask in Chat */}
                          {onSelectTaskForChat && (
                            <button
                              type="button"
                              onClick={() => onSelectTaskForChat(`Help me execute this task efficiently: "${task.title}". What is the exact step-by-step strategy?`)}
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-medium flex items-center gap-1 transition-all"
                            >
                              <Brain size={12} /> Strategize in Chat
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-gray-500 hover:text-rose-400 p-1 rounded-lg hover:bg-white/5 transition-colors shrink-0"
                      title="Delete task"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Add Task Modal - Mobile bottom sheet / Desktop centered */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="w-full max-w-md bg-[#111127] border border-white/10 rounded-t-3xl sm:rounded-2xl p-5 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:pb-5 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus size={18} className="text-violet-400" /> New WelBuddy Task
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Finish client proposal deck without distractions"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-gray-600 text-sm outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                  >
                    <option value="business">💼 Business</option>
                    <option value="wellness">🧘 Wellness</option>
                    <option value="sprint">🎯 90m Sprint</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                  >
                    <option value="high">🔥 High Leverage</option>
                    <option value="medium">📌 Standard</option>
                    <option value="quick">⚡ Quick Win (&lt;15m)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Estimated Minutes: {newMinutes}m
                </label>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={newMinutes}
                  onChange={(e) => setNewMinutes(Number(e.target.value))}
                  className="w-full accent-violet-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold hover:from-violet-500 hover:to-purple-500 shadow-sm"
                >
                  Create Task
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
