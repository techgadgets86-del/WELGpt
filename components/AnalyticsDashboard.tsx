"use client";

import { motion } from "framer-motion";
import { Brain, Flame, Target, Sparkles, Activity, Utensils, Calendar } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useState } from "react";
import PremiumModal from "@/components/PremiumModal";

export default function AnalyticsDashboard() {
  const { profile } = useAuth();
  const [showPremium, setShowPremium] = useState(false);
  
  const xp = profile?.xp || 0;
  const level = profile?.level || 1;
  const streak = profile?.streak || 0;
  const xpToNextLevel = (level * 100) - xp;

  const weeklyScores = [
    { label: "Focus", score: "88%", percent: 88, icon: Target, color: "text-cyan-400", bg: "bg-cyan-500/20" },
    { label: "Calm", score: "72%", percent: 72, icon: Sparkles, color: "text-violet-400", bg: "bg-violet-500/20" },
    { label: "Energy", score: "94%", percent: 94, icon: Flame, color: "text-orange-400", bg: "bg-orange-500/20" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Top Gamification row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-3xl bg-[#111127] border border-white/10 flex flex-col justify-center relative overflow-hidden group">
          <h3 className="text-gray-400 text-xs font-medium mb-1 uppercase tracking-wider">Wellness Level</h3>
          <p className="text-2xl font-bold text-white">Level {level}</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-5 rounded-3xl bg-[#111127] border border-white/10 flex flex-col justify-center relative overflow-hidden group">
          <h3 className="text-gray-400 text-xs font-medium mb-1 uppercase tracking-wider">Total XP</h3>
          <p className="text-2xl font-bold text-white">{xp} XP</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 rounded-3xl bg-[#111127] border border-white/10 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors" />
          <h3 className="text-gray-400 text-xs font-medium mb-1 uppercase tracking-wider">Streak</h3>
          <p className="text-2xl font-bold text-white">{streak} days</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-5 rounded-3xl bg-[#111127] border border-white/10 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-teal-500/5 group-hover:bg-teal-500/10 transition-colors" />
          <h3 className="text-gray-400 text-xs font-medium mb-1 uppercase tracking-wider">Today&apos;s Completion</h3>
          <p className="text-2xl font-bold text-teal-400">80%</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* THIS WEEK (Core Analytics) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 p-8 rounded-3xl bg-[#111127] border border-white/10 flex flex-col"
        >
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-1">Weekly Wellness Trend</h3>
            <p className="text-gray-400 text-sm">Based on your check-ins and activity patterns</p>
          </div>
          
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {weeklyScores.map((stat, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-white font-medium">{stat.label}</span>
                    <span className="text-white font-bold">{stat.score}</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percent}%` }}
                      transition={{ duration: 1.5, delay: 0.5 + (i * 0.2) }}
                      className={`h-full ${stat.bg.replace('/20', '')}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI INSIGHT / PREMIUM ADAPTATION */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="p-8 rounded-3xl bg-gradient-to-b from-[#1a1a3a] to-[#111127] border border-violet-500/30 flex flex-col relative overflow-hidden group cursor-pointer"
          onClick={() => setShowPremium(true)}
        >
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 blur-3xl rounded-full" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold tracking-widest uppercase mb-6 border border-violet-500/30 w-fit">
            <Brain size={14} />
            WelGPT Insight
          </div>

          <p className="text-xl text-white font-medium leading-relaxed mb-8 relative z-10">
            &quot;Your consistency is strongest in the morning. I&apos;ve moved tomorrow&apos;s workout to 6 AM based on your routine.&quot;
          </p>

          <div className="mt-auto relative z-10">
            <button className="w-full py-3 rounded-xl font-bold text-white text-sm bg-violet-600 hover:bg-violet-500 transition-colors shadow-lg">
              Unlock Adaptive Planning
            </button>
          </div>
        </motion.div>

      </div>


      {/* RECENT ACTIVITY FEED */}
      {profile?.recentActivity && profile.recentActivity.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-6 md:p-8 rounded-3xl bg-[#111127] border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-teal-400" size={24} />
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>
          </div>
          <div className="flex flex-col gap-4">
            {profile.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="p-2 rounded-full bg-teal-500/20 text-teal-400 mt-1">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="text-white font-medium">{activity}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {i === 0 ? "Just now" : i === 1 ? "Earlier today" : "Yesterday or older"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <PremiumModal isOpen={showPremium} onClose={() => setShowPremium(false)} />
    </div>
  );
}
