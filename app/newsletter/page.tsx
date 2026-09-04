"use client";

import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";

export default function NewsletterPage() {
  return (
    <div className="max-w-4xl mx-auto relative z-10 pt-12 min-h-full flex pb-[160px] md:pb-12 flex-col items-center justify-center text-center ">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-20 h-20 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-full flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.15)]"
      >
        <Mail size={32} className="text-violet-400" />
      </motion.div>

      <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white font-serif"
      >
        Weekly Wellness <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Newsletter.</span>
      </motion.h1>
      <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg max-w-xl mx-auto mb-12"
      >
        Get the latest on neuroscience and mindfulness delivered to your inbox. Subscribe to receive exclusive insights on dopamine detoxing, sleep optimization, and peak mental performance.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-md"
      >
        <form className="relative flex items-center" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Your email address" 
            required 
            className="w-full bg-[#111127] border border-white/10 rounded-full py-4 pl-6 pr-32 text-white placeholder:text-gray-500 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all shadow-inner"
          />
          <button 
            type="submit" 
            className="absolute right-2 top-2 bottom-2 bg-violet-600 hover:bg-violet-500 text-white px-6 rounded-full font-medium transition-colors flex items-center gap-2 shadow-lg shadow-violet-900/20"
          >
            Subscribe
            <ArrowRight size={16} />
          </button>
        </form>
        <p className="text-gray-500 text-xs mt-6">
          * We respect your privacy. Unsubscribe at any time.
        </p>
      </motion.div>
    </div>
  );
}
