"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Clock, 
  Check, 
  Plus, 
  Copy, 
  FileText, 
  Loader2, 
  Layers, 
  ArrowRight,
  ListOrdered,
  Zap,
  Brain,
  Volume2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WelBuddyTask } from "./WelBuddyTasks";

interface SmartChapter {
  id: string;
  timestamp: string;
  title: string;
  insight: string;
}

interface ExtractedTask {
  id: string;
  title: string;
  category: "business" | "wellness" | "sprint";
  priority: "high" | "medium" | "quick";
  estimatedMinutes: number;
}

function playHapticTone(freq = 560, duration = 0.08) {
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

export default function WelBuddyAudioNotes({
  onSwitchToTasks,
}: {
  onSwitchToTasks?: () => void;
}) {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [chapters, setChapters] = useState<SmartChapter[]>([]);
  const [tasks, setTasks] = useState<ExtractedTask[]>([]);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [importedTasks, setImportedTasks] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Setup Web Speech API for voice dictation
  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          let interim = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            interim += event.results[i][0].transcript;
          }
          setInputText((prev) => (prev ? prev + " " + interim : interim));
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Live voice dictation is supported in Chrome, Safari, and Edge. You can also paste or type your notes directly!");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      playHapticTone(360, 0.08);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setRecordingSeconds(0);
        timerRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
        playHapticTone(640, 0.1);
      } catch (err) {
        console.error("Speech start error:", err);
      }
    }
  };

  const handleSynthesize = async () => {
    if (!inputText.trim()) return;

    if (isRecording) {
      toggleRecording();
    }

    setIsSynthesizing(true);
    setImportedTasks(false);
    playHapticTone(520, 0.08);

    try {
      const res = await fetch("/api/welbuddy/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: inputText,
          mode: "brain_dump",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSummary(data.summary || "Synthesized actionable execution plan.");
        setChapters(Array.isArray(data.chapters) ? data.chapters : []);
        setTasks(Array.isArray(data.tasks) ? data.tasks : []);
        playHapticTone(720, 0.12);
      }
    } catch (err) {
      console.error("Synthesize error:", err);
      alert("Failed to synthesize. Please check your network connection.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleImportAllToTasks = () => {
    if (tasks.length === 0) return;

    const saved = localStorage.getItem("welbuddy_tasks");
    let existing: WelBuddyTask[] = [];
    if (saved) {
      try {
        existing = JSON.parse(saved);
      } catch (e) {}
    }

    const newWelBuddyTasks: WelBuddyTask[] = tasks.map((t, i) => ({
      id: `task_${Date.now()}_${i}`,
      title: t.title,
      category: t.category,
      priority: t.priority,
      estimatedMinutes: t.estimatedMinutes || 30,
      completed: false,
      createdAt: Date.now() + i * 10,
    }));

    const combined = [...newWelBuddyTasks, ...existing];
    localStorage.setItem("welbuddy_tasks", JSON.stringify(combined));
    setImportedTasks(true);
    playHapticTone(800, 0.15);

    setTimeout(() => {
      if (onSwitchToTasks) onSwitchToTasks();
    }, 800);
  };

  const handlePreset = (text: string) => {
    setInputText(text);
    playHapticTone(500, 0.05);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-2 py-3 overflow-y-auto no-scrollbar">
      {/* Top Muse.ai Inspired Banner */}
      <div className="bg-[#111127] border border-white/10 rounded-2xl p-4 md:p-5 mb-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Brain size={11} /> Muse Audio &amp; Brain Dump Hub
              </span>
              <span className="text-gray-400 text-xs">
                • In-Audio Indexing &amp; Smart Chaptering
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Speak or Paste: Instant Action Synthesizer
            </h2>
            <p className="text-gray-400 text-xs md:text-sm mt-0.5">
              Dictate raw thoughts, customer calls, or meetings. WelBuddy automatically extracts structured chapters and prioritized tasks.
            </p>
          </div>

          {/* Record button */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all ${
              isRecording
                ? "bg-rose-600 text-white animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                : "bg-white/5 hover:bg-white/10 text-white border border-white/10 shadow-sm"
            }`}
          >
            {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            {isRecording ? `Recording... (${recordingSeconds}s)` : "Live Voice Dictation"}
          </button>
        </div>

        {/* Preset Prompt Templates */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/5">
          <span className="text-[10px] font-mono uppercase text-gray-500 font-bold">Quick Templates:</span>
          <button
            type="button"
            onClick={() => handlePreset("Here is my morning brain dump: I have to finish the client proposal deck before 11 AM, reply to 4 urgent investor emails, and my neck feels stiff. I also need to make time for lunch and a short walk.")}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[11px] font-medium transition-colors"
          >
            ☀️ Morning Brain Dump
          </button>
          <button
            type="button"
            onClick={() => handlePreset("Meeting Recap: We agreed to launch the new pricing tier next Tuesday. Sarah is handling the customer support macros, and I am responsible for configuring the Paddle webhook and stress-testing the authentication flow. We need a 30m sync on Monday.")}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[11px] font-medium transition-colors"
          >
            💼 Meeting Debrief
          </button>
          <button
            type="button"
            onClick={() => handlePreset("Evening Reflection: Brain feels fried from 8 hours of screen time. Need to shut off all blue light devices by 9:30 PM, do 10 minutes of NSDR or yoga nidra, and prepare tomorrow's top 20% priority list.")}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[11px] font-medium transition-colors"
          >
            🌙 Nightly Mental Unload
          </button>
        </div>
      </div>

      {/* Input Textarea & Action Bar */}
      <div className="bg-[#111127] border border-white/10 rounded-2xl p-4 mb-5 shadow-sm">
        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Speak or paste your unstructured meeting notes, audio transcription, or stream-of-consciousness thoughts here..."
          className="w-full bg-transparent border-none outline-none text-white placeholder:text-gray-600 text-sm md:text-base resize-none"
        />

        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <span className="text-xs font-mono text-gray-500">
            {inputText.split(/\s+/).filter(Boolean).length} words
          </span>

          <div className="flex items-center gap-2">
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText("")}
                className="px-3 py-1.5 rounded-lg text-gray-500 hover:text-gray-300 text-xs font-bold"
              >
                Clear
              </button>
            )}

            <button
              type="button"
              onClick={handleSynthesize}
              disabled={!inputText.trim() || isSynthesizing}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-teal-500 hover:from-violet-500 hover:to-teal-400 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all disabled:opacity-50"
            >
              {isSynthesizing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {isSynthesizing ? "Synthesizing Plan..." : "Synthesize Action Plan"}
            </button>
          </div>
        </div>
      </div>

      {/* Synthesis Results (Muse.ai Smart Chapters & Extracted Tasks) */}
      <AnimatePresence>
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5 pb-16"
          >
            {/* Executive Summary Card */}
            <div className="bg-[#111127] border border-teal-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                  <Brain size={14} /> Executive Synthesis
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(summary);
                    setCopiedSummary(true);
                    setTimeout(() => setCopiedSummary(false), 2000);
                  }}
                  className="text-gray-400 hover:text-white text-xs font-mono flex items-center gap-1"
                >
                  {copiedSummary ? <Check size={13} className="text-teal-400" /> : <Copy size={13} />}
                  {copiedSummary ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="text-white text-sm md:text-base leading-relaxed font-medium">
                {summary}
              </p>
            </div>

            {/* Smart Chapters (Muse.ai Style Indexing) */}
            {chapters.length > 0 && (
              <div className="bg-[#111127] border border-white/10 rounded-2xl p-5 shadow-lg">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
                  <ListOrdered size={16} className="text-purple-400" /> Smart Chapters &amp; Key Insights
                </h3>
                <div className="space-y-3">
                  {chapters.map((ch) => (
                    <div
                      key={ch.id}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3 hover:border-purple-500/30 transition-all"
                    >
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono font-bold text-xs shrink-0 mt-0.5">
                        {ch.timestamp}
                      </span>
                      <div>
                        <h4 className="text-white font-bold text-sm">{ch.title}</h4>
                        <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{ch.insight}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Action Items with One-Click Import */}
            {tasks.length > 0 && (
              <div className="bg-[#111127] border border-white/10 rounded-2xl p-5 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                      <Zap size={16} className="text-amber-400" /> Extracted Action Items ({tasks.length})
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Prioritized by business leverage and nervous system recovery.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleImportAllToTasks}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all"
                  >
                    {importedTasks ? <Check size={14} /> : <Plus size={14} />}
                    {importedTasks ? "Imported to WelBuddy Tasks!" : "Import All to WelBuddy Tasks"}
                  </button>
                </div>

                <div className="space-y-2.5">
                  {tasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            t.priority === "high"
                              ? "bg-rose-500/20 text-rose-300"
                              : t.priority === "quick"
                              ? "bg-teal-500/20 text-teal-300"
                              : "bg-blue-500/20 text-blue-300"
                          }`}
                        >
                          {t.priority}
                        </span>
                        <span className="text-white text-sm font-medium">{t.title}</span>
                      </div>
                      <span className="text-xs font-mono text-gray-500 shrink-0">
                        {t.estimatedMinutes}m
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
