"use client";

import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import RoutineTracker from "@/components/RoutineTracker";

export default function RoutinePage() {
  return (
    <div className="max-w-5xl mx-auto relative z-10 pt-4 pb-20 h-full flex flex-col">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white"
          >
            Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-teal-400">Routine.</span>
          </motion.h1>
          <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg max-w-2xl"
          >
            Your personalized daily schedule based on your neuroscience profile.
          </motion.p>
        </div>
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors self-start md:self-end"
        >
          <RefreshCw size={16} />
          AI Optimize
        </motion.button>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <RoutineTracker />
      </motion.div>
    </div>
  );
}
