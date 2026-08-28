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
    { label: "Meditation", score: "5/7", percent: (5/7)*100, icon: Sparkles, color: "text-cyan-400", bg: "bg-cyan-500/20" },
    { label: "Movement", score: "4/7", percent: (4/7)*100, icon: Activity, color: "text-rose-400", bg: "bg-rose-500/20" },
    { label: "Nutrition", score: "6/7", percent: (6/7)*100, icon: Utensils, color: "text-orange-400", bg: "bg-orange-500/20" },
    { label: "Routine", score: "82%", percent: 82, icon: Calendar, color: "text-violet-400", bg: "bg-violet-500/20" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Top Gamification row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-[#111127] border border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Neuro Level</h3>
            <p className="text-3xl font-bold text-white">Lvl {level}</p>
          </div>
          <div className="p-4 rounded-full bg-violet-500/10 text-violet-400"><Brain size={24} /></div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-3xl bg-[#111127] border border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Total XP</h3>
            <p className="text-3xl font-bold text-white">{xp} XP</p>
          </div>
          <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400"><Target size={24} /></div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-3xl bg-[#111127] border border-white/10 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors" />
          <div className="relative z-10">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Active Streak</h3>
            <p className="text-3xl font-bold text-white">{streak} Days</p>
          </div>
          <div className="relative z-10 p-4 rounded-full bg-orange-500/20 text-orange-400"><Flame size={24} /></div>
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
          <h3 className="text-2xl font-bold text-white mb-8">This Week</h3>
          
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

      <PremiumModal isOpen={showPremium} onClose={() => setShowPremium(false)} />
    </div>
  );
}
