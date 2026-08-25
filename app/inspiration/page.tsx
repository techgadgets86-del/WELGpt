"use client";

import { motion } from "framer-motion";
import { Sparkles, Share2 } from "lucide-react";
import Image from "next/image";

export default function InspirationPage() {
  return (
    <div className="max-w-4xl mx-auto relative z-10 pt-4 h-full flex flex-col items-center justify-center">
      <header className="mb-12 text-center">
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center p-4 rounded-full mb-6"
        >
          <Image src="/logo-icon.png" alt="WelGPT" width={48} height={48} className="object-contain" priority />
        </motion.div>
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white"
        >
          Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-violet-400">Inspiration.</span>
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
        >
          Generate a new moment of clarity.
        </motion.p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-3xl relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-teal-500/20 blur-xl rounded-3xl" />
        <div className="relative bg-[#111127]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-12 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-serif italic font-medium text-white leading-relaxed">
            &quot;Peace comes from within. Do not seek it without.&quot;
          </h2>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-4 mt-12"
      >
        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/5">
          <Sparkles size={18} />
          Generate New
        </button>
        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 text-white font-medium transition-opacity">
          <Share2 size={18} />
          Share to IG
        </button>
      </motion.div>
    </div>
  );
}
