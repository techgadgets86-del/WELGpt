import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Star, Sparkles } from "lucide-react";

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
            className="w-full max-w-2xl my-8 bg-gradient-to-b from-[#111127] to-[#0a0a1a] rounded-3xl border border-violet-500/30 p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 text-violet-300 text-sm font-bold tracking-widest uppercase mb-6 border border-violet-500/30 shadow-[0_0_15px_rgba(124,58,237,0.2)]">
                <Crown size={16} />
                WelGPT Adaptive Premium
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                Don&apos;t just follow a wellness plan.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-teal-400">Let WelGPT adapt it for you.</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Unlock the Adaptive Engine. If you skip a workout, WelGPT instantly recalibrates tomorrow&apos;s plan.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 relative z-10">
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="p-3 bg-teal-500/20 rounded-xl text-teal-400 shrink-0">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Adaptive Recalibration</h3>
                  <p className="text-gray-400 text-sm">&quot;You&apos;ve been consistent with nutrition but routine completion dropped. I&apos;ve shortened tomorrow&apos;s workout to ensure a win.&quot;</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-2">
                {[
                  "Personalized daily plan",
                  "AI Wellness Coach",
                  "Clinical Nutrition",
                  "Bio-Frequency Meditation",
                  "Sensei Movement",
                  "Adaptive routines",
                  "Weekly review & insights",
                  "Ad-free experience"
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 text-white text-sm font-medium">
                    <Star size={16} className="text-violet-400 shrink-0 fill-violet-400" /> {feat}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative z-10">
              <button className="w-full py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-violet-600 to-teal-600 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(124,58,237,0.4)] mb-4">
                Upgrade to Adaptive Premium
              </button>
              <p className="text-center text-gray-500 text-sm">Cancel anytime. $14.99/mo.</p>
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
