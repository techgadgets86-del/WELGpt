import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Star, Sparkles, Check, Minus } from "lucide-react";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-4xl my-8 bg-gradient-to-b from-[#111127] to-[#0a0a1a] rounded-3xl border border-violet-500/30 p-6 md:p-10 shadow-2xl relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10 p-2"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-10 relative z-10 mt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 text-violet-300 text-sm font-bold tracking-widest uppercase mb-6 border border-violet-500/30 shadow-[0_0_15px_rgba(124,58,237,0.2)]">
                <Crown size={16} />
                WelGPT Adaptive Premium
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
                WelGPT <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-teal-400">adapts to you.</span>
              </h2>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-gray-400 font-medium text-sm md:text-base">
                <span>Today</span>
                <span className="hidden md:block">→</span>
                <span className="md:hidden">↓</span>
                <span className="text-white">You take action</span>
                <span className="hidden md:block">→</span>
                <span className="md:hidden">↓</span>
                <span className="text-violet-400">WelGPT learns</span>
                <span className="hidden md:block">→</span>
                <span className="md:hidden">↓</span>
                <span className="text-teal-400">Tomorrow&apos;s plan changes</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 relative z-10">
              
              {/* FREE TIER */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-400 mb-2">Free</h3>
                <p className="text-gray-500 text-sm mb-6 pb-6 border-b border-white/5">The foundational wellness toolkit.</p>
                
                <div className="space-y-4 flex-1">
                  {[
                    "Basic daily plan",
                    "Limited AI Coach",
                    "Basic nutrition",
                    "Basic meditation",
                    "Basic movement",
                    "Basic progress"
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-400">
                      <Minus size={16} className="text-gray-600 shrink-0" />
                      <span className="text-sm">{feat}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 text-gray-400 opacity-50 mt-4">
                    <span className="text-xs uppercase tracking-wider font-bold border border-gray-600 px-2 py-0.5 rounded text-gray-500">Ad-Supported</span>
                  </div>
                </div>
              </div>

              {/* PREMIUM TIER */}
              <div className="bg-gradient-to-b from-violet-900/40 to-teal-900/20 border border-violet-500/40 rounded-3xl p-8 flex flex-col relative shadow-[0_0_30px_rgba(124,58,237,0.15)] transform md:scale-105">
                <div className="absolute -top-4 right-8 bg-gradient-to-r from-violet-500 to-teal-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  Recommended
                </div>
                
                <h3 className="text-2xl font-black text-white mb-2">Premium</h3>
                <p className="text-violet-300 text-sm mb-6 pb-6 border-b border-violet-500/20">The adaptive personalization engine.</p>
                
                <div className="space-y-4 flex-1">
                  {[
                    "Personalized daily plan",
                    "Expanded AI Coach",
                    "Personalized nutrition",
                    "Adaptive training",
                    "Personalized meditation",
                    "Advanced routines",
                    "Weekly AI review",
                    "Advanced analytics"
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-white">
                      <Check size={18} className="text-teal-400 shrink-0" />
                      <span className="text-sm font-bold">{feat}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 text-emerald-400 mt-4">
                    <Sparkles size={16} className="shrink-0" />
                    <span className="text-sm font-bold">Completely Ad-Free</span>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="relative z-10 max-w-md mx-auto text-center">
              <button className="w-full py-5 rounded-2xl font-black tracking-wide text-white text-lg bg-gradient-to-r from-violet-600 to-teal-600 hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(45,212,191,0.3)] mb-4 uppercase">
                Unlock Adaptive Premium
              </button>
              <p className="text-gray-500 text-sm">Cancel anytime. Only $9.99/month.</p>
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
