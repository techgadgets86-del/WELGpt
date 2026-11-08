"use client";

import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import AdvancedNotificationModal from "./AdvancedNotificationModal";
import { getPermissionStatus } from "@/lib/advancedNotifications";

export default function NotificationBell() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasPrompt, setHasPrompt] = useState(false);

  useEffect(() => {
    // Check permission status
    const perm = getPermissionStatus();
    setHasPrompt(perm !== "granted");

    const handleExternalOpen = () => setIsModalOpen(true);
    window.addEventListener("welbuddy_open_notifications_modal", handleExternalOpen);
    return () => window.removeEventListener("welbuddy_open_notifications_modal", handleExternalOpen);
  }, []);

  return (
    <>
      <button 
        onClick={() => {
          setIsModalOpen(true);
        }}
        title="Lock-Screen & Background Notifications"
        aria-label="Lock-Screen Notifications"
        className="p-2 rounded-xl hover:bg-white/10 transition-all relative group flex items-center justify-center touch-manipulation min-w-[40px] min-h-[40px]"
      >
        <Bell size={20} className="text-gray-400 group-hover:text-teal-300 transition-colors" />
        
        <AnimatePresence>
          {hasPrompt && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-2 right-2 w-2 h-2 bg-teal-400 rounded-full border-2 border-[#111127] shadow-[0_0_8px_rgba(45,212,191,0.8)]"
            />
          )}
        </AnimatePresence>
      </button>

      <AdvancedNotificationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setHasPrompt(getPermissionStatus() !== "granted");
        }}
      />
    </>
  );
}
