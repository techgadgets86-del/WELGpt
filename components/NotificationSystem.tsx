"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Sparkles, Brain, Activity, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  icon: "bell" | "meditation" | "routine" | "streak";
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export default function NotificationSystem() {
  const { profile, user } = useAuth();
  const router = useRouter();
  const [activeToasts, setActiveToasts] = useState<AppNotification[]>([]);
  const [triggeredIds, setTriggeredIds] = useState<Set<string>>(new Set());

  // Function to add a toast
  const triggerToast = (toast: AppNotification) => {
    if (triggeredIds.has(toast.id)) return;
    
    setTriggeredIds(prev => {
      const newSet = new Set(prev);
      newSet.add(toast.id);
      return newSet;
    });

    setActiveToasts(prev => [...prev, toast]);
    
    // Auto remove after 6 seconds
    setTimeout(() => {
      setActiveToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 6000);
  };

  const removeToast = (id: string) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (!profile || !user) return;

    // The advanced checking loop (runs every minute)
    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
      
      // 1. Hyper-Real Meditation Reminders (Triggers around 2PM or randomly if stressed)
      // Let's trigger a mindfulness check at random times or specifically at 2:30 PM (afternoon slump)
      if (currentHour === 14 && currentMinutes === 30) {
        triggerToast({
          id: `meditation-${now.toDateString()}-1430`,
          title: "Mindfulness Check",
          message: "Take a deep breath. Drop your shoulders. Unclench your jaw. You are doing great.",
          icon: "meditation",
          timestamp: now,
          read: false,
          actionUrl: "/meditation"
        });
      }

      // 2. Routine Reminders based on profile's Daily Plan
      if (profile.dailyPlan && profile.dailyPlan.date === now.toISOString().split('T')[0]) {
        // Morning Routine Reminder (8 AM)
        if (currentHour === 8 && currentMinutes === 0) {
          const incomplete = profile.dailyPlan.morning?.filter(t => !t.completed);
          if (incomplete && incomplete.length > 0) {
            triggerToast({
              id: `routine-morning-${now.toDateString()}`,
              title: "Morning Routine",
              message: `You have ${incomplete.length} morning tasks waiting for you. Let's start the day right!`,
              icon: "routine",
              timestamp: now,
              read: false,
              actionUrl: "/routine"
            });
          }
        }
        
        // Evening Routine Reminder (8 PM)
        if (currentHour === 20 && currentMinutes === 0) {
          const incomplete = profile.dailyPlan.evening?.filter(t => !t.completed);
          if (incomplete && incomplete.length > 0) {
            triggerToast({
              id: `routine-evening-${now.toDateString()}`,
              title: "Wind Down",
              message: `It's time to prep for bed. You have ${incomplete.length} evening tasks left.`,
              icon: "routine",
              timestamp: now,
              read: false,
              actionUrl: "/routine"
            });
          }
        }
      }

    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [profile, user, triggeredIds]);

  // Expose a global way to trigger tests for the user (optional, just for demo)
  useEffect(() => {
    // @ts-ignore
    window.triggerWelGptMeditation = () => {
      triggerToast({
        id: `meditation-demo-${Date.now()}`,
        title: "Hyper-Real Meditation",
        message: "Close your eyes. Listen to the room around you. Breathe in for 4 seconds, out for 6.",
        icon: "meditation",
        timestamp: new Date(),
        read: false,
        actionUrl: "/meditation"
      });
    };
    
    // @ts-ignore
    window.triggerWelGptRoutine = () => {
      triggerToast({
        id: `routine-demo-${Date.now()}`,
        title: "Routine Check-in",
        message: "You haven't completed your deep work block yet. Ready to focus?",
        icon: "routine",
        timestamp: new Date(),
        read: false,
        actionUrl: "/routine"
      });
    };
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "meditation": return <Brain className="text-teal-400" size={20} />;
      case "routine": return <Activity className="text-violet-400" size={20} />;
      case "streak": return <Sparkles className="text-orange-400" size={20} />;
      default: return <Bell className="text-gray-400" size={20} />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4 md:px-0">
      <AnimatePresence>
        {activeToasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="bg-[#111127]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] p-4 flex gap-4 pointer-events-auto relative overflow-hidden group cursor-pointer"
            onClick={() => {
              if (toast.actionUrl) {
                router.push(toast.actionUrl);
                removeToast(toast.id);
              }
            }}
          >
            {/* Ambient glow inside toast */}
            <div className={`absolute top-0 left-0 w-full h-1 opacity-50 ${toast.icon === 'meditation' ? 'bg-teal-500' : 'bg-violet-500'}`} />
            
            <div className={`p-2 rounded-xl bg-white/5 h-fit ${toast.icon === 'meditation' ? 'border border-teal-500/20 shadow-[0_0_15px_rgba(45,212,191,0.2)]' : 'border border-violet-500/20 shadow-[0_0_15px_rgba(124,58,237,0.2)]'}`}>
              {getIcon(toast.icon)}
            </div>
            
            <div className="flex-1 pt-1">
              <h4 className="text-white font-bold text-sm mb-1">{toast.title}</h4>
              <p className="text-gray-400 text-xs leading-relaxed">{toast.message}</p>
              
              {toast.actionUrl && (
                <div className="mt-2 text-xs font-semibold text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Tap to view action &rarr;
                </div>
              )}
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); removeToast(toast.id); }}
              className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
