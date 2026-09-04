"use client";

import { motion } from "framer-motion";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto relative z-10 pt-4  min-h-full flex pb-[160px] md:pb-12 flex-col">
      <header className="mb-10">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white"
        >
          Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Progress.</span>
        </motion.h1>
      </header>

      <AnalyticsDashboard />
    </div>
  );
}
