"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Sparkles, 
  Zap, 
  Brain, 
  RotateCcw, 
  Check, 
  Radio, 
  CheckSquare, 
  Calendar, 
  Bell, 
  FileText 
} from "lucide-react";
import { AgentState } from "@/lib/useVoiceTalkingAgent";
import { ExtractionBatch } from "@/lib/welbuddySmartSeparation";

interface VoiceTalkingAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentState: AgentState;
  transcript: string;
  interimTranscript: string;
  lastAssistantMessage: string;
  audioLevel: number;
  isHandsFreeEnabled: boolean;
  onToggleHandsFree: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
  latestBatch: ExtractionBatch | null;
  persona: "operator" | "stoic" | "compassionate";
}

export default function VoiceTalkingAgentModal({
  isOpen,
  onClose,
  agentState,
  transcript,
  interimTranscript,
  lastAssistantMessage,
  audioLevel,
  isHandsFreeEnabled,
  onToggleHandsFree,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  latestBatch,
  persona,
}: VoiceTalkingAgentModalProps) {
  if (!isOpen) return null;

  const isListening = agentState === "listening";
  const isSpeaking = agentState === "speaking";
  const isThinking = agentState === "thinking";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl"
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#161435] via-[#111026] to-[#0a0a18] border border-violet-500/30 p-6 sm:p-8 shadow-[0_0_80px_rgba(124,58,237,0.35)] flex flex-col items-center text-center overflow-hidden"
        >
          {/* Background Ambient Glows */}
          <div className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-[100px] pointer-events-none transition-colors duration-700 ${
            isListening ? "bg-emerald-500/25" : isSpeaking ? "bg-cyan-500/25" : isThinking ? "bg-violet-600/35" : "bg-purple-600/20"
          }`} />
          <div className={`absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-[100px] pointer-events-none transition-colors duration-700 ${
            isSpeaking ? "bg-teal-500/25" : isListening ? "bg-emerald-400/20" : "bg-violet-500/20"
          }`} />

          {/* Top Bar */}
          <div className="w-full flex items-center justify-between z-10 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                WelBuddy Voice Agent
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-gray-300 capitalize">
                {persona}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Close Voice Agent"
            >
              <X size={18} />
            </button>
          </div>

          {/* Status Badge */}
          <div className="z-10 mb-6">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold tracking-wide transition-all ${
              isListening
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                : isSpeaking
                ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                : isThinking
                ? "bg-violet-500/20 border-violet-500/40 text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.3)] animate-pulse"
                : "bg-white/5 border-white/10 text-gray-400"
            }`}>
              <Radio size={14} className={isListening || isSpeaking ? "animate-pulse" : ""} />
              {isListening
                ? "LISTENING • SPEAK FREELY"
                : isSpeaking
                ? "WELBUDDY SPEAKING..."
                : isThinking
                ? "AI THINKING & SEPARATING..."
                : "READY TO TALK"}
            </div>
          </div>

          {/* Central Neural Voice Orb */}
          <div className="relative my-4 flex items-center justify-center w-52 h-52 sm:w-60 sm:h-60 z-10">
            {/* Outer Pulsing Wave Rings */}
            <motion.div
              animate={{
                scale: isListening || isSpeaking ? [1, 1.18 + audioLevel * 0.003, 1] : 1,
                opacity: isListening || isSpeaking ? [0.4, 0.8, 0.4] : 0.2,
              }}
              transition={{ repeat: Infinity, duration: isSpeaking ? 1.4 : 2, ease: "easeInOut" }}
              className={`absolute inset-0 rounded-full border-2 transition-colors duration-500 ${
                isListening ? "border-emerald-400" : isSpeaking ? "border-cyan-400" : isThinking ? "border-violet-500" : "border-white/20"
              }`}
            />
            <motion.div
              animate={{
                scale: isListening || isSpeaking ? [1.1, 1.35 + audioLevel * 0.004, 1.1] : 1.05,
                opacity: isListening || isSpeaking ? [0.2, 0.5, 0.2] : 0.1,
              }}
              transition={{ repeat: Infinity, duration: isSpeaking ? 1.8 : 2.5, ease: "easeInOut", delay: 0.2 }}
              className={`absolute inset-0 rounded-full border transition-colors duration-500 ${
                isListening ? "border-emerald-300" : isSpeaking ? "border-cyan-300" : "border-purple-500"
              }`}
            />

            {/* Glowing Core Sphere */}
            <motion.div
              animate={{
                scale: isListening || isSpeaking ? [1, 1.08, 0.98, 1] : [1, 1.02, 1],
              }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center p-4 shadow-2xl transition-all duration-700 ${
                isListening
                  ? "bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 shadow-[0_0_60px_rgba(16,185,129,0.5)]"
                  : isSpeaking
                  ? "bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-500 shadow-[0_0_60px_rgba(6,182,212,0.5)]"
                  : isThinking
                  ? "bg-gradient-to-tr from-purple-700 via-violet-600 to-indigo-600 shadow-[0_0_60px_rgba(139,92,246,0.5)]"
                  : "bg-gradient-to-tr from-violet-900/80 to-[#1e1b4b] shadow-[0_0_40px_rgba(124,58,237,0.3)]"
              }`}
            >
              {isSpeaking ? (
                <Volume2 size={42} className="text-white animate-bounce" />
              ) : isListening ? (
                <Mic size={42} className="text-white animate-pulse" />
              ) : isThinking ? (
                <Sparkles size={42} className="text-white animate-spin" />
              ) : (
                <Brain size={42} className="text-violet-300" />
              )}

              {/* Dynamic waveform simulation bars */}
              {(isListening || isSpeaking) && (
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      animate={{ height: [6, 18 + ((audioLevel + i * 8) % 18), 6] }}
                      transition={{ repeat: Infinity, duration: 0.6 + i * 0.1, ease: "easeInOut" }}
                      className="w-1 bg-white rounded-full"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Dynamic Transcript & Speech Display */}
          <div className="w-full min-h-[90px] max-h-36 overflow-y-auto px-4 py-2 text-sm z-10 flex flex-col justify-center items-center">
            {isListening ? (
              <p className="text-emerald-300 font-medium italic">
                {interimTranscript || transcript ? `"${interimTranscript || transcript}"` : "Listening for your voice... speak anytime"}
              </p>
            ) : isThinking ? (
              <p className="text-violet-300 font-medium">
                WelBuddy is synthesizing your thoughts and extracting actions...
              </p>
            ) : isSpeaking ? (
              <p className="text-gray-200 line-clamp-3 leading-relaxed">
                {lastAssistantMessage ? `"${lastAssistantMessage.slice(0, 180)}..."` : "Speaking..."}
              </p>
            ) : (
              <p className="text-gray-400 text-xs">
                Tap &quot;Talk to WelBuddy&quot; to begin hands-free conversation.
              </p>
            )}
          </div>

          {/* Real-Time Extraction Ticker */}
          {latestBatch && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full my-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 z-10 flex flex-wrap items-center justify-center gap-2 text-[11px]"
            >
              <span className="text-gray-400 font-medium flex items-center gap-1">
                <Sparkles size={12} className="text-teal-400" /> Auto-Separated:
              </span>
              {latestBatch.notes?.length > 0 && (
                <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-semibold flex items-center gap-1">
                  <FileText size={10} /> {latestBatch.notes.length} Note
                </span>
              )}
              {latestBatch.tasks?.length > 0 && (
                <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-semibold flex items-center gap-1">
                  <CheckSquare size={10} /> {latestBatch.tasks.length} Task{latestBatch.tasks.length > 1 ? "s" : ""}
                </span>
              )}
              {latestBatch.routines?.length > 0 && (
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold flex items-center gap-1">
                  <Calendar size={10} /> {latestBatch.routines.length} Routine
                </span>
              )}
              {latestBatch.reminders?.length > 0 && (
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold flex items-center gap-1">
                  <Bell size={10} /> {latestBatch.reminders.length} Reminder
                </span>
              )}
            </motion.div>
          )}

          {/* Action & Control Buttons */}
          <div className="w-full mt-4 flex items-center justify-center gap-3 z-10">
            {isSpeaking ? (
              <button
                type="button"
                onClick={onStopSpeaking}
                className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all active:scale-95"
              >
                <VolumeX size={18} />
                <span>Stop Speaking / Interrupt</span>
              </button>
            ) : isListening ? (
              <button
                type="button"
                onClick={onStopListening}
                className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all active:scale-95"
              >
                <MicOff size={18} />
                <span>Pause Listening</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onStartListening}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-teal-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-all active:scale-95"
              >
                <Mic size={18} />
                <span>Talk to WelBuddy</span>
              </button>
            )}
          </div>

          {/* Hands-Free Auto-Turn Toggle */}
          <div className="mt-5 pt-3 border-t border-white/10 w-full flex items-center justify-between z-10 text-xs">
            <span className="text-gray-400">
              Hands-Free Auto-Conversation
            </span>
            <button
              type="button"
              onClick={onToggleHandsFree}
              className={`px-3 py-1 rounded-full font-bold text-[11px] transition-all border ${
                isHandsFreeEnabled
                  ? "bg-teal-500/20 text-teal-300 border-teal-500/40"
                  : "bg-white/5 text-gray-400 border-white/10"
              }`}
            >
              {isHandsFreeEnabled ? "AUTO-LISTEN ON" : "PUSH-TO-TALK"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
