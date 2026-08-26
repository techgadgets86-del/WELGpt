"use client";

import { motion } from "framer-motion";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto relative z-10 pt-4 pb-20 h-full flex flex-col">
      <header className="mb-10">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white"
        >
          Neuro <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Analytics.</span>
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl"
        >
          Real-time visualization of your dopamine baseline, circadian rhythms, and cognitive performance.
        </motion.p>
      </header>

      <AnalyticsDashboard />
    </div>
  );
}
