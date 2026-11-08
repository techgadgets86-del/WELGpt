"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { useAuth } from "@/lib/AuthContext";
import { 
  Send, 
  Loader2, 
  Sparkles, 
  Zap, 
  Brain, 
  ShieldCheck, 
  RotateCcw, 
  Copy, 
  Check, 
  Flame, 
  Volume2, 
  VolumeX, 
  Sun, 
  CheckSquare, 
  Compass, 
  HeartHandshake,
  Activity,
  Mic,
  MicOff,
  Plus,
  Clock
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import PremiumModal from "./PremiumModal";

// Play subtle tactile audio pop using Web Audio API
function playHapticTone(freq = 440, duration = 0.06) {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // AudioContext blocked or not allowed yet
  }
}

type WelBuddyPersona = "operator" | "stoic" | "compassionate";

export interface ChatInterfaceProps {
  injectedPrompt?: string | null;
  onClearInjectedPrompt?: () => void;
  onSwitchTab?: (tab: "chat" | "tasks" | "routine" | "audio") => void;
}

export default function ChatInterface({
  injectedPrompt,
  onClearInjectedPrompt,
  onSwitchTab,
}: ChatInterfaceProps = {}) {
  const { user, profile, updateUserData } = useAuth();
  const [isFocused, setIsFocused] = useState(false);
  const [loadedSessionCount, setLoadedSessionCount] = useState(0);
  const [persona, setPersona] = useState<WelBuddyPersona>("operator");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savedTasksIndex, setSavedTasksIndex] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hasAutoPrompted, setHasAutoPrompted] = useState(false);
  
  const [isPersonalized, setIsPersonalized] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Load persona from profile or localStorage
  useEffect(() => {
    const savedPersona = localStorage.getItem("welbuddy_persona");
    if (savedPersona === "stoic" || savedPersona === "compassionate" || savedPersona === "operator") {
      setPersona(savedPersona);
    }
  }, []);

  const handlePersonaChange = (newPersona: WelBuddyPersona) => {
    setPersona(newPersona);
    localStorage.setItem("welbuddy_persona", newPersona);
    if (soundEnabled) playHapticTone(580, 0.08);
  };
  
  const { messages, setMessages, input, handleInputChange, handleSubmit, append, isLoading } = useChat({
    api: '/api/chat',
    body: {
      persona,
      userContext: (profile && isPersonalized) ? JSON.stringify({
        level: profile.level,
        xp: profile.xp,
        streak: profile.streak,
        goals: profile.goals || [],
        preferences: profile.preferences || {},
        recentActivity: profile.recentActivity || [],
        dailyPlan: profile.dailyPlan || null,
        activePersona: persona
      }) : ""
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      console.error("Chat Error:", err);
      alert("WelBuddy Error: " + err.message);
    }
  });

  // Load chat history on mount
  useEffect(() => {
    const saved = localStorage.getItem("welgpt_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setMessages(parsed);
          setLoadedSessionCount(parsed.length);
        }
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    }
  }, [setMessages]);

  // Save chat history on update
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("welgpt_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle URL prompt integration
  useEffect(() => {
    const promptParams = searchParams.get("prompt");
    if (promptParams && !hasAutoPrompted) {
      setTimeout(() => setHasAutoPrompted(true), 0);
      setTimeout(() => {
        append({
          role: "user",
          content: promptParams
        });
      }, 500);
      router.replace("/coach");
    }
  }, [searchParams, router, append, hasAutoPrompted]);

  // Handle injected prompt from workspace tabs
  useEffect(() => {
    if (injectedPrompt) {
      setTimeout(() => {
        append({
          role: "user",
          content: injectedPrompt,
        });
        if (onClearInjectedPrompt) onClearInjectedPrompt();
      }, 200);
    }
  }, [injectedPrompt, append, onClearInjectedPrompt]);

  // Setup Web Speech API for voice dictation in chat
  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rec.onresult = (evt: any) => {
          const text = evt.results[0][0].transcript;
          if (text) {
            handleInputChange({ target: { value: text } } as any);
          }
          setIsRecording(false);
          if (soundEnabled) playHapticTone(520, 0.08);
        };
        rec.onerror = () => setIsRecording(false);
        rec.onend = () => setIsRecording(false);
        recognitionRef.current = rec;
      }
    }
  }, [handleInputChange, soundEnabled]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Voice input is supported in Google Chrome, Safari, and Edge.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      if (soundEnabled) playHapticTone(340, 0.06);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        if (soundEnabled) playHapticTone(620, 0.08);
      } catch (err) {
        console.warn("Mic error:", err);
      }
    }
  };

  const handleSaveToTasks = (text: string, idx: number) => {
    const lines = text.split(/\n/).map((l) => l.trim()).filter((l) => l.length > 4);
    const taskCandidates = lines.filter((l) => /^(\[ \]|[-*•]|\d+\.)/.test(l));
    const toSave = taskCandidates.length > 0 ? taskCandidates.slice(0, 4) : lines.slice(0, 3);

    const saved = localStorage.getItem("welbuddy_tasks");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let existing: any[] = [];
    if (saved) {
      try {
        existing = JSON.parse(saved);
      } catch (e) {}
    }

    const newTasks = toSave.map((line, i) => {
      const clean = line.replace(/^(\[ \]|[-*•]|\d+\.)\s*/, "").trim();
      const lower = clean.toLowerCase();
      const isWellness = /sleep|stress|sigh|rest|water|hydrate|nsdr|walk|meditat/i.test(lower);
      const isSprint = /90m|flow|deep work|code|sprint/i.test(lower);
      return {
        id: `task_${Date.now()}_${i}`,
        title: clean.length > 80 ? clean.slice(0, 77) + "..." : clean,
        category: isSprint ? "sprint" : isWellness ? "wellness" : "business",
        priority: i === 0 ? "high" : "medium",
        estimatedMinutes: isSprint ? 90 : isWellness ? 15 : 45,
        completed: false,
        createdAt: Date.now() + i * 10,
      };
    });

    localStorage.setItem("welbuddy_tasks", JSON.stringify([...newTasks, ...existing]));
    setSavedTasksIndex(idx);
    if (soundEnabled) playHapticTone(720, 0.12);
    setTimeout(() => setSavedTasksIndex(null), 2500);
  };

  const handleSuggestion = (title: string) => {
    if (soundEnabled) playHapticTone(520, 0.08);
    append({
      role: "user",
      content: title
    });
  };

  const handleClearHistory = () => {
    if (window.confirm("Start a clean session with WelBuddy?")) {
      localStorage.removeItem("welgpt_chat_history");
      setMessages([]);
      setLoadedSessionCount(0);
      if (soundEnabled) playHapticTone(300, 0.1);
    }
  };

  const handleCopyMessage = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    if (soundEnabled) playHapticTone(660, 0.06);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (soundEnabled) playHapticTone(440, 0.08);

    if (isPersonalized && profile && !profile.isPremium) {
      if ((profile.aiChatTokens || 0) <= 0) {
        setShowPremiumModal(true);
        return;
      }
      updateUserData({ aiChatTokens: (profile.aiChatTokens || 0) - 1 });
    }
    
    try {
      handleSubmit(e);
    } catch (err) {
      console.error(err);
    }
  };

  const quickModes = [
    { 
      label: "90m Flow Sprint", 
      icon: "⚡", 
      prompt: "I need to lock in for a 90-minute deep business sprint. Help me identify my single highest-leverage task, set up the protocol, and eliminate dopamine traps." 
    },
    { 
      label: "Vagus Stress Reset", 
      icon: "🧘", 
      prompt: "My nervous system feels dysregulated with high cortisol and mental tension. Guide me step-by-step through an immediate 2-minute physiological sigh & vagal reset." 
    },
    { 
      label: "2 PM Dopamine NSDR", 
      icon: "🧠", 
      prompt: "Afternoon brain fog is setting in. Walk me through a 10-minute Non-Sleep Deep Rest (NSDR) protocol to replenish basal dopamine and restore executive focus." 
    },
    { 
      label: "Eat The Frog Priority", 
      icon: "🎯", 
      prompt: "I have too many competing tasks right now. Help me ruthlessly triage: what is the 1 task that makes everything else easier or unnecessary today?" 
    },
    { 
      label: "Digital Sunset Protocol", 
      icon: "🌅", 
      prompt: "Help me transition my mind from intense business problem-solving into evening recovery mode. What is my exact 45-minute digital sunset protocol?" 
    },
    { 
      label: "Optimize Daily Routine", 
      icon: "📋", 
      prompt: "Review my circadian flow. How can I structure tomorrow for peak morning cognitive output, mid-day recovery, and restorative deep sleep?" 
    }
  ];

  const followUpChips = [
    { label: "📌 Turn into 3 Tasks", prompt: "Convert your previous response into 3 prioritized, actionable checkbox tasks I can execute immediately." },
    { label: "⚡ 60s Summary", prompt: "Summarize your last point into a 60-second ultra-tactical cheat sheet." },
    { label: "🔬 Neuroscience Mechanism", prompt: "What is the biological / neurological mechanism behind why this works?" },
    { label: "🛡️ Beat Procrastination", prompt: "What is the biggest mental friction point here, and how do I bypass procrastination on it?" }
  ];

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto relative z-10 pt-2">
      
      {/* Top WelBuddy Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-3 border-b border-white/5 mb-3">
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            WelBuddy™ Co-Pilot
          </span>
          <span className="text-[10px] font-mono text-gray-400 hidden sm:inline">
            • Mental & Business Engine
          </span>
        </div>

        {/* Persona Selector */}
        <div className="flex items-center gap-1 bg-[#111127] p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => handlePersonaChange("operator")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              persona === "operator"
                ? "bg-violet-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
            title="High-Stakes Operator: Executive decision speed & high-leverage 90m flow blocks"
          >
            ⚡ Operator
          </button>
          <button
            type="button"
            onClick={() => handlePersonaChange("stoic")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              persona === "stoic"
                ? "bg-violet-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
            title="Stoic Partner: Direct, zero-fluff accountability and calm emotional composure"
          >
            🏛️ Stoic
          </button>
          <button
            type="button"
            onClick={() => handlePersonaChange("compassionate")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              persona === "compassionate"
                ? "bg-violet-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
            title="Compassionate Anchor: Vagus soothing, nervous system sanctuary, anti-burnout"
          >
            🌊 Anchor
          </button>
        </div>

        {/* Controls: Audio & Clear */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title={soundEnabled ? "Mute audio cues" : "Enable tactile audio cues"}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
              title="Clear Thread"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Chat History / Greeting */}
      <div className="flex-1 overflow-y-auto pb-6 no-scrollbar flex flex-col">
        {messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} 
            className="my-auto w-full text-center py-6"
          >
            {/* WelBuddy Avatar Badge */}
            <div className="relative inline-flex items-center justify-center p-3 rounded-2xl mb-4 bg-gradient-to-br from-violet-600/30 via-purple-600/20 to-teal-500/20 border border-violet-500/30 shadow-[0_0_30px_rgba(124,58,237,0.25)]">
              <Image src="/logo-icon.png" alt="WelBuddy" width={44} height={44} className="object-contain" priority />
              <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-[9px] font-mono font-bold uppercase tracking-widest text-teal-300">
                Co-Pilot Active
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight text-white">
              Hey 👋 I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-teal-300">WelBuddy.</span>
            </h1>
            <p className="text-gray-300 text-sm md:text-base max-w-lg mx-auto mb-2 font-medium">
              The best AI assistant for the wellness of your mental &amp; business life.
            </p>
            <p className="text-gray-500 text-xs mb-8">
              Pick a quick mode below or ask anything about your focus, stress, or business leverage.
            </p>
            
            {/* Quick interactive mode buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto px-2">
              {quickModes.map((s, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSuggestion(s.prompt)}
                  className="p-3.5 rounded-2xl bg-[#111127] border border-white/10 hover:border-violet-500/50 flex items-start gap-3 text-left transition-all group shadow-sm hover:shadow-[0_0_20px_rgba(124,58,237,0.15)]"
                >
                  <span className="text-xl p-2 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform">
                    {s.icon}
                  </span>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm group-hover:text-violet-300 transition-colors">
                      {s.label}
                    </p>
                    <p className="text-gray-400 text-xs line-clamp-2 mt-0.5 leading-snug">
                      {s.prompt}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-5 flex-1 flex flex-col justify-end">
            <AnimatePresence>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {messages.map((msg: any, index: number) => (
                <div key={msg.id}>
                  {index === 0 && loadedSessionCount > 0 && (
                    <div className="flex items-center justify-center my-6 opacity-60">
                      <div className="h-px bg-gray-600 flex-1"></div>
                      <span className="px-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Prior WelBuddy Thread</span>
                      <div className="h-px bg-gray-600 flex-1"></div>
                    </div>
                  )}
                  
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 450, damping: 28 }}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    {/* Message Bubble */}
                    <div className="group relative max-w-[85%] md:max-w-[78%]">
                      <div className={`p-4 md:p-5 rounded-2xl text-[1rem] leading-relaxed shadow-lg whitespace-pre-wrap ${
                        msg.role === "user" 
                          ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-br-sm" 
                          : "bg-[#111127] text-gray-100 border border-white/10 rounded-bl-sm"
                      }`}>
                        {msg.role !== "user" && (
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
                            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-teal-400 flex items-center gap-1.5">
                              <Brain size={12} /> WelBuddy
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleSaveToTasks(msg.content, index)}
                                className="text-gray-400 hover:text-teal-300 transition-colors p-1 flex items-center gap-1 text-[11px]"
                                title="Extract & save action items to WelBuddy Tasks"
                              >
                                {savedTasksIndex === index ? (
                                  <Check size={13} className="text-emerald-400" />
                                ) : (
                                  <Plus size={13} />
                                )}
                                <span className="text-[10px] hidden sm:inline">
                                  {savedTasksIndex === index ? "Saved to Tasks!" : "Save to Tasks"}
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopyMessage(msg.content, index)}
                                className="text-gray-400 hover:text-white transition-colors p-1"
                                title="Copy response"
                              >
                                {copiedIndex === index ? (
                                  <Check size={13} className="text-emerald-400" />
                                ) : (
                                  <Copy size={13} />
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                        {msg.content}
                      </div>
                    </div>

                    {/* Contextual Follow-up Chips under the LAST WelBuddy message */}
                    {msg.role !== "user" && index === messages.length - 1 && !isLoading && (
                      <motion.div 
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap gap-2 mt-3 pl-1"
                      >
                        {followUpChips.map((chip, chipIdx) => (
                          <button
                            key={chipIdx}
                            type="button"
                            onClick={() => handleSuggestion(chip.prompt)}
                            className="px-3 py-1 rounded-full bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/40 text-gray-300 hover:text-white text-xs font-medium transition-all"
                          >
                            {chip.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* WelBuddy Input Bar */}
      <div className="pt-2 pb-4 relative flex flex-col gap-2">
        <div className="flex items-center justify-between px-2">
          <button
            type="button"
            onClick={() => {
               if (!isPersonalized && profile && !profile.isPremium && (profile.aiChatTokens || 0) <= 0) {
                 setShowPremiumModal(true);
                 return;
               }
               setIsPersonalized(!isPersonalized);
               if (soundEnabled) playHapticTone(520, 0.05);
            }}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all border ${
              isPersonalized 
                ? "bg-violet-500/20 text-violet-300 border-violet-500/30 shadow-[0_0_15px_rgba(124,58,237,0.15)]" 
                : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
            }`}
          >
            <Sparkles size={13} className={isPersonalized ? "text-violet-400" : "text-gray-500"} />
            {isPersonalized ? "HEALTH & BUSINESS CONTEXT SYNCED" : "ENABLE MEMORY SYNC"}
            {profile && !profile.isPremium && (
              <span className={`ml-1.5 px-1.5 py-0.2 rounded text-[10px] ${isPersonalized ? "bg-violet-500/30" : "bg-gray-800"}`}>
                {profile.aiChatTokens || 0} left
              </span>
            )}
          </button>

          <span className="text-[11px] text-gray-500 font-mono hidden sm:inline">
            Active: <strong className="text-gray-300 capitalize">{persona}</strong> mode
          </span>
        </div>

        <form onSubmit={onSubmit} className="relative">
          <motion.div 
            animate={{ 
              boxShadow: isFocused ? "0 0 35px rgba(124,58,237,0.22)" : "0 0 0px rgba(124,58,237,0)",
              borderColor: isFocused ? "rgba(124,58,237,0.6)" : "rgba(255,255,255,0.12)"
            }}
            className="relative flex items-center bg-[#111127] border rounded-2xl overflow-hidden transition-colors"
          >
            <input 
              type="text"
              value={input}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isPersonalized ? "Message WelBuddy (e.g. 'Prioritize my day' or 'I feel overwhelmed')..." : "Message WelBuddy..."}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-500 py-3.5 px-5 font-medium text-sm md:text-base"
            />
            <button
              type="button"
              onClick={toggleMic}
              className={`p-3 text-sm transition-colors rounded-xl mr-1 ${
                isRecording
                  ? "bg-rose-500/20 text-rose-400 animate-pulse border border-rose-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              title={isRecording ? "Listening... click to stop" : "Voice dictation"}
              aria-label="Voice input"
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3.5 text-violet-400 hover:text-violet-300 disabled:text-gray-600 transition-colors mr-1"
              aria-label="Send message to WelBuddy"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </motion.div>
        </form>
        <p className="text-center text-[11px] text-gray-500">
          WelBuddy is your AI assistant for business execution and mental wellness. Verify medical decisions with a physician.
        </p>
      </div>
      
      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </div>
  );
}
