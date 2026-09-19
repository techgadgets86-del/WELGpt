"use client";

import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function NotificationBell() {
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <button 
      onClick={() => {
        setHasUnread(false);
        // We trigger a demo hyper-real meditation just to show the UI works!
        // @ts-ignore
        if (window.triggerWelGptMeditation) window.triggerWelGptMeditation();
      }}
      className="p-2 rounded-lg hover:bg-white/10 transition-colors relative group"
    >
      <Bell size={24} className="text-gray-400 group-hover:text-white transition-colors" />
      
      <AnimatePresence>
        {hasUnread && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#111127]"
          />
        )}
      </AnimatePresence>
    </button>
  );
}
