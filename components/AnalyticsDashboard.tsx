"use client";

import { motion } from "framer-motion";
import { Activity, Brain, Moon, Sparkles, TrendingUp, Zap, Flame, Target } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function AnalyticsDashboard() {
  const { profile } = useAuth();
  
  const xp = profile?.xp || 0;
  const level = profile?.level || 1;
  const streak = profile?.streak || 0;
  const xpToNextLevel = (level * 100) - xp;

  const metrics = [
    { label: "Neuro Level", value: `Lvl ${level}`, trend: "Active", icon: Brain, color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/20" },
    { label: "Total XP", value: `${xp} XP`, trend: `${xpToNextLevel} to next`, icon: Target, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
    { label: "Active Streak", value: `${streak} Days`, trend: "On Fire", icon: Flame, color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
    { label: "Cognitive Score", value: "94%", trend: "Optimal", icon: Sparkles, color: "text-teal-400", bg: "bg-teal-400/10", border: "border-teal-400/20" }
  ];

  const weeklyData = [45, 52, 48, 65, 78, 85, 84]; // Sample dopamine scores

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-3xl bg-[#111127] border ${metric.border} relative overflow-hidden group`}
            >
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl ${metric.bg} transition-transform group-hover:scale-150 duration-500`} />
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-2xl ${metric.bg} ${metric.color}`}>
                  <Icon size={24} />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                  <TrendingUp size={12} /> {metric.trend}
                </span>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-gray-400 text-sm font-medium mb-1">{metric.label}</h3>
                <p className="text-3xl font-bold text-white tracking-tight">{metric.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Neuro-Recovery Graph */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 p-6 rounded-3xl bg-[#111127] border border-white/10 flex flex-col"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-semibold text-white">Neuro-Recovery Timeline</h3>
              <p className="text-sm text-gray-400">7-Day dopamine receptor resensitization</p>
            </div>
            <Activity className="text-violet-400" size={20} />
          </div>
          
          {/* Animated Bar Chart */}
          <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 mt-auto pt-10 border-b border-white/10 pb-4 relative">
            {/* Y-axis subtle grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-t border-white/20 w-full border-dashed" />
              <div className="border-t border-white/20 w-full border-dashed" />
              <div className="border-t border-white/20 w-full border-dashed" />
            </div>

            {weeklyData.map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-3 w-full group z-10">
                <div className="relative w-full flex justify-center h-48 items-end">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 text-white text-xs py-1 px-2 rounded font-mono">
                    {val}%
                  </div>
                  {/* Bar */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1), type: "spring", bounce: 0.3 }}
                    className={`w-full max-w-[40px] rounded-t-xl transition-all duration-300 ${
                      i === weeklyData.length - 1 ? "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.4)]" 
                      : "bg-white/10 group-hover:bg-violet-500/50"
                    }`}
                  />
                </div>
                <span className="text-xs text-gray-500 uppercase font-medium">Day {i+1}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Brain State Scanner */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-3xl bg-gradient-to-br from-[#111127] to-[#1a1a3a] border border-violet-500/20 flex flex-col relative overflow-hidden"
        >
          {/* Futuristic radar background */}
          <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border border-violet-500 rounded-full animate-[ping_4s_ease-in-out_infinite]" />
            <div className="absolute w-48 h-48 border border-violet-400 rounded-full animate-[ping_3s_ease-in-out_infinite_1s]" />
          </div>

          <h3 className="text-lg font-semibold text-white mb-2 relative z-10">Current Brain State</h3>
          <p className="text-sm text-gray-400 mb-8 relative z-10">Real-time cognitive profile</p>

          <div className="flex-1 flex flex-col justify-center gap-6 relative z-10">
            {[
              { label: "Focus (Beta)", value: 88, color: "bg-violet-400" },
              { label: "Calm (Alpha)", value: 72, color: "bg-teal-400" },
              { label: "Fatigue (Delta)", value: 15, color: "bg-red-400" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300 font-medium">{stat.label}</span>
                  <span className="text-white font-mono">{stat.value}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.value}%` }}
                    transition={{ duration: 1.5, delay: 0.8 + (i * 0.2) }}
                    className={`h-full ${stat.color} shadow-[0_0_10px_currentColor]`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
