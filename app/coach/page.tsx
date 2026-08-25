"use client";

import { motion } from "framer-motion";
import { Suspense } from "react";
import ChatInterface from "@/components/ChatInterface";

export default function CoachPage() {
  return (
    <div className="max-w-5xl mx-auto relative z-10 pt-4 h-full flex flex-col">
      <header className="mb-6">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-white"
        >
          AI Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-teal-400">Coach.</span>
        </motion.h1>
      </header>

      <div className="flex-1 overflow-hidden relative">
        <Suspense fallback={<div className="text-white text-center mt-10">Loading...</div>}>
          <ChatInterface />
        </Suspense>
      </div>
    </div>
  );
}
