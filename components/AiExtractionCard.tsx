"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  CheckSquare, 
  Calendar, 
  Bell, 
  FileText, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  ArrowRight,
  Clock,
  Zap,
  Tag
} from "lucide-react";
import { ExtractionBatch } from "@/lib/welbuddySmartSeparation";

interface AiExtractionCardProps {
  batch: ExtractionBatch;
  onSwitchTab?: (tab: "chat" | "tasks" | "routine" | "audio") => void;
}

export default function AiExtractionCard({ batch, onSwitchTab }: AiExtractionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "notes" | "tasks" | "routines" | "reminders">("all");

  const notesCount = batch.notes?.length || 0;
  const tasksCount = batch.tasks?.length || 0;
  const routinesCount = batch.routines?.length || 0;
  const remindersCount = batch.reminders?.length || 0;
  const totalCount = notesCount + tasksCount + routinesCount + remindersCount;

  if (totalCount === 0) return null;

  return (
    <div className="mt-3.5 mb-1 w-full rounded-2xl bg-gradient-to-br from-[#12112a] via-[#151230] to-[#0d0d1e] border border-violet-500/30 p-3.5 shadow-[0_4px_25px_rgba(124,58,237,0.18)] transition-all">
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-2 cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-violet-600 to-teal-500 text-white shadow-sm">
            <Sparkles size={14} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white tracking-wide">
                AI Autonomous Extraction
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold uppercase">
                Auto-Saved
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
              Separated into your Hub: {notesCount > 0 && `${notesCount} Note `}
              {tasksCount > 0 && `• ${tasksCount} Task `}
              {routinesCount > 0 && `• ${routinesCount} Routine `}
              {remindersCount > 0 && `• ${remindersCount} Reminder`}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="p-1 rounded-lg text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Pill summary chips (Always visible) */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-white/5">
        {notesCount > 0 && (
          <span 
            onClick={(e) => { e.stopPropagation(); setActiveFilter("notes"); setIsExpanded(true); }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-500/15 text-teal-300 border border-teal-500/30 text-[10px] font-medium cursor-pointer hover:bg-teal-500/25 transition-colors"
          >
            <FileText size={11} /> {notesCount} Note{notesCount > 1 ? "s" : ""}
          </span>
        )}
        {tasksCount > 0 && (
          <span 
            onClick={(e) => { e.stopPropagation(); setActiveFilter("tasks"); setIsExpanded(true); }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/30 text-[10px] font-medium cursor-pointer hover:bg-violet-500/25 transition-colors"
          >
            <CheckSquare size={11} /> {tasksCount} Task{tasksCount > 1 ? "s" : ""}
          </span>
        )}
        {routinesCount > 0 && (
          <span 
            onClick={(e) => { e.stopPropagation(); setActiveFilter("routines"); setIsExpanded(true); }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[10px] font-medium cursor-pointer hover:bg-blue-500/25 transition-colors"
          >
            <Calendar size={11} /> {routinesCount} Routine{routinesCount > 1 ? "s" : ""}
          </span>
        )}
        {remindersCount > 0 && (
          <span 
            onClick={(e) => { e.stopPropagation(); setActiveFilter("reminders"); setIsExpanded(true); }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-medium cursor-pointer hover:bg-amber-500/25 transition-colors"
          >
            <Bell size={11} /> {remindersCount} Reminder{remindersCount > 1 ? "s" : ""}
          </span>
        )}

        <div className="ml-auto flex items-center gap-1 text-[10px] text-gray-500 font-mono">
          <Check size={11} className="text-emerald-400" /> Synced to Hub
        </div>
      </div>

      {/* Expanded Details Accordion */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 pt-3 border-t border-white/10 space-y-3"
          >
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl text-[10px] w-fit">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`px-2 py-0.5 rounded-lg font-semibold transition-all ${
                  activeFilter === "all" ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                All ({totalCount})
              </button>
              {notesCount > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveFilter("notes")}
                  className={`px-2 py-0.5 rounded-lg font-semibold transition-all ${
                    activeFilter === "notes" ? "bg-teal-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Notes ({notesCount})
                </button>
              )}
              {tasksCount > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveFilter("tasks")}
                  className={`px-2 py-0.5 rounded-lg font-semibold transition-all ${
                    activeFilter === "tasks" ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Tasks ({tasksCount})
                </button>
              )}
              {routinesCount > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveFilter("routines")}
                  className={`px-2 py-0.5 rounded-lg font-semibold transition-all ${
                    activeFilter === "routines" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Routines ({routinesCount})
                </button>
              )}
              {remindersCount > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveFilter("reminders")}
                  className={`px-2 py-0.5 rounded-lg font-semibold transition-all ${
                    activeFilter === "reminders" ? "bg-amber-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Reminders ({remindersCount})
                </button>
              )}
            </div>

            {/* Notes Section */}
            {(activeFilter === "all" || activeFilter === "notes") && notesCount > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-teal-300">
                  <span className="flex items-center gap-1.5">
                    <FileText size={12} /> Captured Smart Notes
                  </span>
                  {onSwitchTab && (
                    <button
                      type="button"
                      onClick={() => onSwitchTab("audio")}
                      className="text-[10px] text-teal-400 hover:underline flex items-center gap-0.5"
                    >
                      Open in Audio & Notes <ArrowRight size={10} />
                    </button>
                  )}
                </div>
                {batch.notes.map((note) => (
                  <div key={note.id} className="p-2 rounded-xl bg-white/[0.04] border border-teal-500/20 text-xs">
                    <p className="font-semibold text-white">{note.title}</p>
                    <p className="text-gray-300 text-[11px] mt-0.5">{note.summary}</p>
                    {note.insights && note.insights.length > 0 && (
                      <ul className="mt-1 space-y-0.5 list-disc list-inside text-gray-400 text-[10px]">
                        {note.insights.map((ins, idx) => (
                          <li key={idx}>{ins}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tasks Section */}
            {(activeFilter === "all" || activeFilter === "tasks") && tasksCount > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-violet-300">
                  <span className="flex items-center gap-1.5">
                    <CheckSquare size={12} /> Extracted Actionable Tasks
                  </span>
                  {onSwitchTab && (
                    <button
                      type="button"
                      onClick={() => onSwitchTab("tasks")}
                      className="text-[10px] text-violet-400 hover:underline flex items-center gap-0.5"
                    >
                      Open in WelBuddy Tasks <ArrowRight size={10} />
                    </button>
                  )}
                </div>
                {batch.tasks.map((task) => (
                  <div key={task.id} className="p-2 rounded-xl bg-white/[0.04] border border-violet-500/20 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                      <span className="text-white font-medium truncate">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-[10px]">
                      <span className="px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 font-mono">
                        {task.estimatedMinutes}m
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-white/10 text-gray-300 capitalize">
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Routines Section */}
            {(activeFilter === "all" || activeFilter === "routines") && routinesCount > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-blue-300">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} /> Scheduled Circadian Routines
                  </span>
                  {onSwitchTab && (
                    <button
                      type="button"
                      onClick={() => onSwitchTab("routine")}
                      className="text-[10px] text-blue-400 hover:underline flex items-center gap-0.5"
                    >
                      Open in Routine <ArrowRight size={10} />
                    </button>
                  )}
                </div>
                {batch.routines.map((r) => (
                  <div key={r.id} className="p-2 rounded-xl bg-white/[0.04] border border-blue-500/20 text-xs flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-white font-medium block truncate">{r.title}</span>
                      <span className="text-gray-400 text-[10px]">{r.description}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-mono text-[10px] shrink-0 font-bold">
                      {r.time}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Reminders Section */}
            {(activeFilter === "all" || activeFilter === "reminders") && remindersCount > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <Bell size={12} /> Scheduled Reminders & Alerts
                  </span>
                  <span className="text-[10px] text-gray-400">Lock-Screen Active</span>
                </div>
                {batch.reminders.map((rem) => (
                  <div key={rem.id} className="p-2 rounded-xl bg-white/[0.04] border border-amber-500/20 text-xs flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-white font-medium block truncate">{rem.title}</span>
                      <span className="text-amber-400/80 text-[10px] font-mono flex items-center gap-1 mt-0.5">
                        <Clock size={10} /> {rem.targetTime}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] uppercase font-bold shrink-0">
                      {rem.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
