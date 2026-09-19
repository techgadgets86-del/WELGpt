"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { useAuth } from "@/lib/AuthContext";
import { Send, Paperclip, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import PremiumModal from "./PremiumModal";

export default function ChatInterface() {
  const { user, profile, updateUserData } = useAuth();
  const [isFocused, setIsFocused] = useState(false);
  const [loadedSessionCount, setLoadedSessionCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hasAutoPrompted, setHasAutoPrompted] = useState(false);
  
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  const { messages, setMessages, input, handleInputChange, handleSubmit, append, isLoading } = useChat({
    api: '/api/chat',
    body: {
      userContext: (profile && isPersonalized) ? JSON.stringify({
        level: profile.level,
        xp: profile.xp,
        streak: profile.streak,
        goals: profile.goals || [],
        preferences: profile.preferences || {},
        recentActivity: profile.recentActivity || [],
        dailyPlan: profile.dailyPlan || null
      }) : ""
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      console.error("Chat Error:", err);
      alert("Chat Error: " + err.message);
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
          // eslint-disable-next-line react-hooks/set-state-in-effect
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
      
      // Clean up URL so we don't re-trigger on refresh
      router.replace("/coach");
    }
  }, [searchParams, router, append, hasAutoPrompted]);

  const handleSuggestion = (title: string) => {
    append({
      role: "user",
      content: title
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

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

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto relative z-10 pt-4">
      {/* Chat History / Greeting */}
      <div className="flex-1 overflow-y-auto pb-8 no-scrollbar flex flex-col">
        {messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
            className="m-auto w-full text-center"
          >
            <div className="inline-flex items-center justify-center p-4 rounded-full mb-6">
              <Image src="/logo-icon.png" alt="WelGPT" width={48} height={48} className="object-contain" priority />
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold mb-3 tracking-tight text-white">
              Hey 👋 I&apos;m your WelGPT Coach.
            </h1>
            <p className="text-gray-400 text-lg mb-10">
              What would you like to work on today?
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto">
              {[
                { label: "Sleep", icon: "🌙", prompt: "I want to improve my sleep quality." },
                { label: "Stress", icon: "🧘", prompt: "I'm feeling stressed and need to calm down." },
                { label: "Nutrition", icon: "🥑", prompt: "Help me optimize my nutrition." },
                { label: "Fitness", icon: "💪", prompt: "I need a workout or fitness protocol." },
                { label: "Focus", icon: "🧠", prompt: "I need to do deep work. How can I improve my focus?" }
              ].map((s, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSuggestion(s.prompt)}
                  className="px-6 py-3 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 transition-colors text-white font-medium"
                >
                  <span>{s.icon}</span>
                  {s.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6 flex-1 flex flex-col justify-end">
            <AnimatePresence>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {messages.map((msg: any, index: number) => (
                <div key={msg.id}>
                  {index === 0 && loadedSessionCount > 0 && (
                    <div className="flex items-center justify-center my-8 opacity-60">
                      <div className="h-px bg-gray-600 flex-1"></div>
                      <span className="px-4 text-xs font-bold tracking-widest text-gray-400 uppercase">Last Session</span>
                      <div className="h-px bg-gray-600 flex-1"></div>
                    </div>
                  )}
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl text-[1.05rem] leading-relaxed shadow-lg whitespace-pre-wrap ${
                    msg.role === "user" 
                      ? "bg-violet-600 text-white rounded-br-sm" 
                      : "bg-[#111127] text-gray-100 border border-white/10 rounded-bl-sm"
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
                </div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Magic UI Animated Input */}
      <div className="pt-2 pb-6 relative flex flex-col gap-3">
        <div className="flex items-center justify-between px-2">
          <button
            type="button"
            onClick={() => {
               if (!isPersonalized && profile && !profile.isPremium && (profile.aiChatTokens || 0) <= 0) {
                 setShowPremiumModal(true);
                 return;
               }
               setIsPersonalized(!isPersonalized);
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all border ${
              isPersonalized 
                ? "bg-violet-500/20 text-violet-300 border-violet-500/30 shadow-[0_0_15px_rgba(124,58,237,0.15)]" 
                : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
            }`}
          >
            <Sparkles size={14} className={isPersonalized ? "text-violet-400" : "text-gray-500"} />
            {isPersonalized ? "PERSONALIZED CONTEXT ENABLED" : "ENABLE PERSONALIZED CONTEXT"}
            {profile && !profile.isPremium && (
              <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${isPersonalized ? "bg-violet-500/30" : "bg-gray-800"}`}>
                {profile.aiChatTokens || 0} left
              </span>
            )}
          </button>
        </div>

        <form onSubmit={onSubmit} className="relative">
          <motion.div 
            animate={{ 
              boxShadow: isFocused ? "0 0 40px rgba(124,58,237,0.2)" : "0 0 0px rgba(124,58,237,0)",
              borderColor: isFocused ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.1)"
            }}
            className="relative flex items-center bg-[#111127] border rounded-2xl overflow-hidden transition-colors"
          >
            <button type="button" className="p-4 text-gray-400 hover:text-white transition-colors">
              <Paperclip size={20} />
            </button>
            <input 
              type="text"
              value={input}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isPersonalized ? "Message your personalized WelGPT Coach..." : "Message WelGPT..."}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-500 py-4 font-medium"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-4 text-violet-400 hover:text-violet-300 disabled:text-gray-600 transition-colors"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </motion.div>
        </form>
        <p className="text-center text-xs text-gray-500 mt-2">
          WelGPT can make mistakes. Consider verifying important information.
        </p>
      </div>
      
      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </div>
  );
}
