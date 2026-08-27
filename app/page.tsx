
"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Brain, Target, Calendar, Utensils, Activity, Sparkles, BarChart3, TrendingUp, RefreshCw, ChevronDown } from "lucide-react";

const Line = ({ h = "h-8" }: { h?: string }) => (
  <div className={`w-0.5 ${h} bg-gradient-to-b from-violet-500/50 to-teal-500/50 mx-auto my-2`} />
);

export default function Home() {
  const router = useRouter();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };



  return (
    <div className="max-w-4xl mx-auto relative z-10 pt-10 pb-32 h-full flex flex-col items-center">
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full flex flex-col items-center text-center"
      >
        
        {/* WELGPT ROOT */}
        <motion.div variants={item} className="mb-2">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 p-1 shadow-[0_0_30px_rgba(124,58,237,0.3)] flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0a1a] rounded-full flex items-center justify-center">
              <Brain className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white mt-4 tracking-widest uppercase">WelGPT</h1>
        </motion.div>

        <Line h="h-10" />

        {/* BIFURCATION 1 */}
        <motion.div variants={item} className="w-full max-w-lg relative">
          <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          <div className="flex justify-between w-full px-4 pt-6">
            <button 
              onClick={() => router.push('/coach')}
              className="flex-1 max-w-[160px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all hover:scale-105"
            >
              <Target className="text-violet-400 mx-auto mb-2" size={24} />
              <h2 className="text-white font-bold text-sm">YOUR GOAL</h2>
            </button>
            <button 
              onClick={() => router.push('/routine')}
              className="flex-1 max-w-[160px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all hover:scale-105"
            >
              <Calendar className="text-violet-400 mx-auto mb-2" size={24} />
              <h2 className="text-white font-bold text-sm">DAILY PLAN</h2>
            </button>
          </div>
        </motion.div>

        <div className="relative w-full max-w-lg h-10 mt-6">
           <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
           <div className="absolute top-0 left-1/2 w-0.5 h-10 bg-gradient-to-b from-violet-500/50 to-teal-500/50 -translate-x-1/2" />
        </div>

        {/* AI WELLNESS COACH */}
        <motion.div variants={item} className="w-full max-w-[250px]">
          <button 
            onClick={() => router.push('/coach')}
            className="w-full bg-gradient-to-r from-violet-600/20 to-teal-600/20 border border-teal-500/30 rounded-2xl p-4 shadow-[0_0_20px_rgba(45,212,191,0.15)] transition-all hover:scale-105"
          >
            <Brain className="text-teal-400 mx-auto mb-2" size={24} />
            <h2 className="text-white font-bold tracking-widest text-sm uppercase">AI Wellness Coach</h2>
          </button>
        </motion.div>

        <Line h="h-10" />

        {/* TRIFURCATION */}
        <motion.div variants={item} className="w-full max-w-2xl relative">
          <div className="absolute top-0 left-1/6 right-1/6 w-[66%] mx-auto h-0.5 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
          <div className="grid grid-cols-3 gap-4 px-4 pt-6">
            <button onClick={() => router.push('/nutrition')} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all hover:scale-105 flex flex-col items-center">
              <Utensils className="text-orange-400 mb-2" size={24} />
              <h2 className="text-white font-bold text-sm">Nutrition</h2>
              <p className="text-gray-500 text-xs mt-1">Meals</p>
            </button>
            <button onClick={() => router.push('/sensei')} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all hover:scale-105 flex flex-col items-center">
              <Activity className="text-rose-400 mb-2" size={24} />
              <h2 className="text-white font-bold text-sm">Movement</h2>
              <p className="text-gray-500 text-xs mt-1">Training</p>
            </button>
            <button onClick={() => router.push('/meditation')} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all hover:scale-105 flex flex-col items-center">
              <Sparkles className="text-cyan-400 mb-2" size={24} />
              <h2 className="text-white font-bold text-sm">Mind</h2>
              <p className="text-gray-500 text-xs mt-1">Meditation</p>
            </button>
          </div>
        </motion.div>

        <div className="relative w-full max-w-2xl h-10 mt-6">
           <div className="absolute top-0 left-1/6 right-1/6 w-[66%] mx-auto h-0.5 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
           <div className="absolute top-0 left-1/2 w-0.5 h-10 bg-gradient-to-b from-teal-500/50 to-emerald-500/50 -translate-x-1/2" />
        </div>

        {/* ANALYTICS */}
        <motion.div variants={item}>
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-6 py-3 transition-all hover:scale-105"
          >
            <BarChart3 className="text-emerald-400" size={20} />
            <h2 className="text-white font-bold text-sm tracking-widest uppercase">Analytics</h2>
          </button>
        </motion.div>

        <Line h="h-8" />

        {/* PROGRESS */}
        <motion.div variants={item}>
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-6 py-3 transition-all hover:scale-105"
          >
            <TrendingUp className="text-emerald-400" size={20} />
            <h2 className="text-white font-bold text-sm tracking-widest uppercase">Progress</h2>
          </button>
        </motion.div>

        <Line h="h-8" />

        {/* AI ADJUSTS PLAN */}
        <motion.div variants={item}>
          <button 
            onClick={() => router.push('/coach')}
            className="flex items-center gap-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-full px-6 py-3 transition-all hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          >
            <RefreshCw className="text-emerald-400 animate-spin-slow" size={20} />
            <h2 className="text-white font-bold text-sm tracking-widest uppercase">AI Adjusts Plan</h2>
          </button>
        </motion.div>

        <Line h="h-8" />

        {/* TOMORROW */}
        <motion.div variants={item}>
          <button 
            onClick={() => router.push('/routine')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <h2 className="font-bold tracking-widest uppercase">Tomorrow</h2>
            <ChevronDown size={16} />
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}
