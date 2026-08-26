"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, Loader2 } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
// @ts-expect-error - AI SDK might not export this depending on version
import { useChat } from "ai/react";

const SUGGESTIONS = [
  { icon: "🌿", title: "Guided Meditation", desc: "5 minutes to center yourself" },
  { icon: "🫁", title: "Breathing Exercise", desc: "Box breathing for anxiety" },
  { icon: "🧠", title: "Mental Reframing", desc: "Shift a negative thought" },
  { icon: "📓", title: "Gratitude Journal", desc: "Log 3 things you are grateful for" }
];

export default function ChatInterface() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [isFocused, setIsFocused] = useState(false);
  const [hasAutoPrompted, setHasAutoPrompted] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, append, isLoading } = useChat({
    api: '/api/chat',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      console.error("Chat Error:", err);
      alert("Chat Error: " + err.message);
    }
  });

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

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto relative z-10 pt-4">
      {/* Chat History / Greeting */}
      <div className="flex-1 overflow-y-auto pb-8 no-scrollbar flex flex-col">
        {messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Unlumen UI smooth easing curve
            className="m-auto w-full text-center"
          >
            <div className="inline-flex items-center justify-center p-4 rounded-full mb-6">
              <Image src="/logo-icon.png" alt="WelGPT" width={48} height={48} className="object-contain" priority />
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold mb-3 tracking-tight text-white">Take a deep breath.</h1>
            <p className="text-gray-400 text-lg mb-12">How can I support your mind today?</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              {SUGGESTIONS.map((s, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSuggestion(s.title)}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4 transition-colors text-left"
                >
                  <span className="text-2xl drop-shadow-md">{s.icon}</span>
                  <div>
                    <h3 className="text-white font-medium">{s.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{s.desc}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6 flex-1 flex flex-col justify-end">
            <AnimatePresence>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {messages.map((msg: any) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }} // Smooth UI physics
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
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Magic UI Animated Input */}
      <div className="pt-2 pb-6 relative">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            try {
              handleSubmit(e);
            } catch (err) {
              console.error(err);
            }
          }}
          className="relative"
        >
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
              placeholder="Message WelGPT..."
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
        <p className="text-center text-xs text-gray-500 mt-4">
          WelGPT can make mistakes. Consider verifying important information.
        </p>
      </div>
    </div>
  );
}
