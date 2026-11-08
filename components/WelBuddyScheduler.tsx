"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  Sun, 
  Zap, 
  Brain, 
  Check, 
  Sparkles, 
  Download, 
  Copy, 
  ArrowRight,
  Moon,
  Coffee,
  RotateCcw,
  ShieldCheck,
  Activity,
  Dumbbell,
  Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  syncAllRoutineExercises, 
  syncExerciseToWelBuddyTasks, 
  isExerciseTask 
} from "@/lib/welbuddyTaskSync";

export interface RoutineBlock {
  id: string;
  time: string;
  startHour: number;
  startMinute: number;
  durationMinutes: number;
  title: string;
  category: "circadian" | "deep_work" | "recovery" | "nutrition" | "sleep";
  description: string;
  completed: boolean;
}

const DEFAULT_ROUTINE: RoutineBlock[] = [
  {
    id: "r1",
    time: "07:00 AM",
    startHour: 7,
    startMinute: 0,
    durationMinutes: 20,
    title: "Circadian Sunlight & Hydration Anchor",
    category: "circadian",
    description: "Get 10-15 mins of outdoor optic flow to set the master suprachiasmatic circadian clock and release cortisol for daytime alertness.",
    completed: true,
  },
  {
    id: "r2",
    time: "08:30 AM",
    startHour: 8,
    startMinute: 30,
    durationMinutes: 90,
    title: "90m Ultradian Flow Sprint #1 (Eat The Frog)",
    category: "deep_work",
    description: "Single highest-leverage business output. All phone notifications blocked, full-screen document/code, high dopamine engagement.",
    completed: false,
  },
  {
    id: "r3",
    time: "12:00 PM",
    startHour: 12,
    startMinute: 0,
    durationMinutes: 45,
    title: "Metabolic Refueling & Post-Meal Micro-Walk",
    category: "nutrition",
    description: "High protein, low-glycemic lunch followed by a 10-minute walk to blunt glucose spikes and avoid afternoon cognitive slump.",
    completed: false,
  },
  {
    id: "r4",
    time: "02:00 PM",
    startHour: 14,
    startMinute: 0,
    durationMinutes: 15,
    title: "10m Dopamine NSDR Reboot (Non-Sleep Deep Rest)",
    category: "recovery",
    description: "Restore basal striatal dopamine levels and reset autonomic nervous system to reverse afternoon brain fog without caffeine crash.",
    completed: false,
  },
  {
    id: "r5",
    time: "03:30 PM",
    startHour: 15,
    startMinute: 30,
    durationMinutes: 90,
    title: "90m Tactical Sprint #2 (Client & Team Velocity)",
    category: "deep_work",
    description: "High-speed tactical execution, client proposals, strategic communications, and team alignments.",
    completed: false,
  },
  {
    id: "r6",
    time: "06:30 PM",
    startHour: 18,
    startMinute: 30,
    durationMinutes: 30,
    title: "Somatic Vagus Reset & Physical Decompression",
    category: "recovery",
    description: "Spinal decompression, dead hangs, slow diaphragmatic nasal breathing, and physical boundary shift away from business work.",
    completed: false,
  },
  {
    id: "r7",
    time: "09:30 PM",
    startHour: 21,
    startMinute: 30,
    durationMinutes: 45,
    title: "Digital Sunset & Melatonin Architecture",
    category: "circadian",
    description: "Dim overhead lights, switch devices to red tint or night mode, warm shower to trigger thermoregulatory cooling for sleep initiation.",
    completed: false,
  },
  {
    id: "r8",
    time: "10:30 PM",
    startHour: 22,
    startMinute: 30,
    durationMinutes: 480,
    title: "Restorative Deep Sleep Chamber (8 Hours)",
    category: "sleep",
    description: "Cool room (65-68°F), total blackout, allowing glymphatic clearance of metabolic waste and cellular memory consolidation.",
    completed: false,
  },
];

function playTone(freq = 480, duration = 0.06) {
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

export default function WelBuddyScheduler({
  onOptimizeInChat,
}: {
  onOptimizeInChat?: (prompt: string) => void;
}) {
  const [blocks, setBlocks] = useState<RoutineBlock[]>([]);
  const [copiedCalendar, setCopiedCalendar] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    let currentBlocks = DEFAULT_ROUTINE;
    const saved = localStorage.getItem("welbuddy_routine_schedule");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentBlocks = parsed;
          setBlocks(parsed);
        } else {
          setBlocks(DEFAULT_ROUTINE);
          localStorage.setItem("welbuddy_routine_schedule", JSON.stringify(DEFAULT_ROUTINE));
        }
      } catch (e) {
        setBlocks(DEFAULT_ROUTINE);
      }
    } else {
      setBlocks(DEFAULT_ROUTINE);
      localStorage.setItem("welbuddy_routine_schedule", JSON.stringify(DEFAULT_ROUTINE));
    }

    // Auto-sync physical routine exercises to WelBuddy Tasks
    syncAllRoutineExercises({
      routineTasks: currentBlocks.map((b: RoutineBlock) => ({
        id: b.id,
        time: b.time,
        title: b.title,
        desc: b.description,
        durationMinutes: b.durationMinutes,
      }))
    });
  }, []);

  const saveBlocks = (updated: RoutineBlock[]) => {
    setBlocks(updated);
    localStorage.setItem("welbuddy_routine_schedule", JSON.stringify(updated));
  };

  const handleToggleBlock = (id: string) => {
    const updated = blocks.map((b) => {
      if (b.id === id) {
        const next = !b.completed;
        if (next) playTone(640, 0.08);
        else playTone(360, 0.06);
        return { ...b, completed: next };
      }
      return b;
    });
    saveBlocks(updated);
  };

  const handleResetSchedule = () => {
    if (window.confirm("Reset your routine schedule to standard science-backed baseline?")) {
      saveBlocks(DEFAULT_ROUTINE);
      playTone(400, 0.1);
    }
  };

  // Generate .ics calendar download file
  const handleExportICS = () => {
    playTone(550, 0.1);
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const dateStr = `${year}${month}${day}`;

    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//WelGPT//WelBuddy Schedule//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n";

    blocks.forEach((b) => {
      const startH = String(b.startHour).padStart(2, "0");
      const startM = String(b.startMinute).padStart(2, "0");
      const endTotalM = b.startHour * 60 + b.startMinute + b.durationMinutes;
      const endH = String(Math.floor(endTotalM / 60) % 24).padStart(2, "0");
      const endM = String(endTotalM % 60).padStart(2, "0");

      icsContent += `BEGIN:VEVENT\nSUMMARY:WelBuddy: ${b.title}\nDESCRIPTION:${b.description.replace(/\n/g, " ")}\nDTSTART:${dateStr}T${startH}${startM}00\nDTEND:${dateStr}T${endH}${endM}00\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `WelBuddy_Schedule_${dateStr}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedCalendar(true);
    setTimeout(() => setCopiedCalendar(false), 2500);
  };

  const handleTriggerOptimize = () => {
    if (onOptimizeInChat) {
      onOptimizeInChat("WelBuddy, review and optimize my daily circadian routine schedule for tomorrow. Focus on maximizing morning cognitive output and eliminating afternoon energy crashes.");
    }
  };

  const completedCount = blocks.filter((b) => b.completed).length;
  const progressPercent = Math.round((completedCount / blocks.length) * 100);

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-2 py-3 overflow-y-auto no-scrollbar">
      {/* Top Banner */}
      <div className="bg-[#111127] border border-white/10 rounded-2xl p-4 md:p-5 mb-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                WelBuddy Circadian Scheduler
              </span>
              <span className="text-gray-400 text-xs">
                • {completedCount}/{blocks.length} Completed
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Circadian &amp; Executive Timeblocking
            </h2>
            <p className="text-gray-400 text-xs md:text-sm mt-0.5">
              Synchronizing 90-minute ultradian business flow with biological circadian anchors.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("welbuddy_open_notifications_modal"));
                }
              }}
              className="flex-1 sm:flex-initial justify-center px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm touch-manipulation min-h-[40px]"
              title="Configure Lock-Screen & Routine Reminders"
            >
              <Bell size={14} className="text-teal-400" />
              <span>Lock-Screen Alarms</span>
            </button>

            <button
              type="button"
              onClick={handleExportICS}
              className="flex-1 sm:flex-initial justify-center px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm touch-manipulation min-h-[40px]"
              title="Download standard .ics file for Apple Calendar, Google Calendar, or Outlook"
            >
              {copiedCalendar ? <Check size={14} className="text-teal-400" /> : <Download size={14} />}
              <span>{copiedCalendar ? "Exported!" : "Export Calendar (.ics)"}</span>
            </button>

            {onOptimizeInChat && (
              <button
                type="button"
                onClick={handleTriggerOptimize}
                className="flex-1 sm:flex-initial justify-center px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-violet-600/30 touch-manipulation min-h-[40px]"
              >
                <Sparkles size={14} className="text-teal-300" />
                <span>Optimize with AI</span>
              </button>
            )}
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

      {/* Routine Timeline */}
      <div className="space-y-3.5 flex-1 pb-16">
        {blocks.map((b, index) => {
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`p-4 md:p-5 rounded-2xl border transition-all ${
                b.completed
                  ? "bg-[#111127]/40 border-white/5 opacity-65"
                  : "bg-[#111127] border-white/10 hover:border-violet-500/40 shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Time Indicator & Checkbox */}
                <button
                  type="button"
                  onClick={() => handleToggleBlock(b.id)}
                  className="mt-0.5 shrink-0"
                >
                  {b.completed ? (
                    <div className="w-5 h-5 rounded-md bg-teal-500/20 border border-teal-400/60 flex items-center justify-center text-teal-300">
                      <Check size={13} className="stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-md border border-white/20 hover:border-teal-400 transition-colors" />
                  )}
                </button>

                {/* Block Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-white font-mono font-bold text-xs">
                      {b.time}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider ${
                        b.category === "deep_work"
                          ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                          : b.category === "circadian"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : b.category === "recovery"
                          ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                          : b.category === "nutrition"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      }`}
                    >
                      {b.category === "deep_work" && "⚡ Deep Flow Sprint"}
                      {b.category === "circadian" && "☀️ Circadian Anchor"}
                      {b.category === "recovery" && "🧘 Nervous Recovery"}
                      {b.category === "nutrition" && "🥗 Metabolic Nutrition"}
                      {b.category === "sleep" && "🌙 Sleep Chamber"}
                    </span>

                    {isExerciseTask(b.title, b.description) && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        🏋️ In WelBuddy Tasks
                      </span>
                    )}

                    <span className="text-[10px] font-mono text-gray-400 ml-auto">
                      {b.durationMinutes} mins
                    </span>
                  </div>

                  <h3
                    className={`text-sm md:text-base font-bold leading-snug ${
                      b.completed ? "line-through text-gray-500" : "text-white"
                    }`}
                  >
                    {b.title}
                  </h3>

                  <p className="text-gray-400 text-xs md:text-sm mt-1 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
