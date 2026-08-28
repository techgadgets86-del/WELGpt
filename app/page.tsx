
"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PremiumModal from "@/components/PremiumModal";
import { useAuth } from "@/lib/AuthContext";
import { Brain, Target, Calendar, Utensils, Activity, Sparkles, BarChart3, RefreshCw } from "lucide-react";

const Line = ({ h = "h-8" }: { h?: string }) => (
  <div className={`w-0.5 ${h} bg-gradient-to-b from-violet-500/50 to-teal-500/50 mx-auto my-2`} />
);

function HeroFlowchart() {
  const [showPremium, setShowPremium] = useState(false);
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
        
        {/* HERO SECTION */}
        <motion.div variants={item} className="mb-12 mt-4 max-w-3xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-teal-400 tracking-tight mb-6 leading-tight drop-shadow-sm">
            Your AI Wellness Coach
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            One personalized plan for your mind, movement, nutrition and daily habits—adapted as you progress.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => router.push('/routine')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all hover:scale-105"
            >
              Build My Wellness Plan
            </button>
          </div>
        </motion.div>

        {/* STRICT VERTICAL FUNNEL */}
        <div className="w-full max-w-[250px] mx-auto flex flex-col items-center gap-4 mt-8">
          
          {/* GOAL */}
          <motion.div variants={item} className="w-full">
            <button onClick={() => router.push('/profile')} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all hover:scale-105 shadow-sm">
              <Target className="text-violet-400 mx-auto mb-2" size={24} />
              <h2 className="text-white font-bold text-sm tracking-widest uppercase">Goal</h2>
            </button>
          </motion.div>
          
          <Line h="h-8" />
          
          {/* DAILY PLAN */}
          <motion.div variants={item} className="w-full">
            <button onClick={() => router.push('/routine')} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all hover:scale-105 shadow-sm">
              <Calendar className="text-violet-400 mx-auto mb-2" size={24} />
              <h2 className="text-white font-bold text-sm tracking-widest uppercase">Daily Plan</h2>
            </button>
          </motion.div>
          
          <Line h="h-8" />
          
          {/* AI COACH */}
          <motion.div variants={item} className="w-full">
            <button onClick={() => router.push('/coach')} className="w-full bg-gradient-to-r from-violet-600/20 to-teal-600/20 border border-teal-500/30 rounded-2xl p-4 shadow-[0_0_20px_rgba(45,212,191,0.15)] transition-all hover:scale-105">
              <Brain className="text-teal-400 mx-auto mb-2" size={24} />
              <h2 className="text-white font-bold tracking-widest text-sm uppercase">AI Coach</h2>
            </button>
          </motion.div>
          
          <Line h="h-8" />
          
          {/* ACTIONS (EXPLORE) */}
          <motion.div variants={item} className="w-full">
            <button onClick={() => router.push('/explore')} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all hover:scale-105 flex flex-col items-center">
              <div className="flex gap-2 mb-2">
                <Utensils className="text-orange-400" size={18} />
                <Activity className="text-rose-400" size={18} />
                <Sparkles className="text-cyan-400" size={18} />
              </div>
              <h2 className="text-white font-bold text-sm tracking-widest uppercase">Actions</h2>
            </button>
          </motion.div>
          
          <Line h="h-8" />
          
          {/* PROGRESS */}
          <motion.div variants={item} className="w-full">
            <button onClick={() => router.push('/dashboard')} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all hover:scale-105">
              <BarChart3 className="text-emerald-400 mx-auto mb-2" size={24} />
              <h2 className="text-white font-bold text-sm tracking-widest uppercase">Progress</h2>
            </button>
          </motion.div>
          
          <Line h="h-8" />
          
          {/* AI ADJUSTS TOMORROW */}
          <motion.div variants={item} className="w-full">
            <button onClick={() => setShowPremium(true)} className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-teal-600 hover:scale-105 rounded-2xl px-6 py-4 transition-transform shadow-[0_0_20px_rgba(45,212,191,0.3)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <RefreshCw className="text-white animate-spin-slow relative z-10" size={20} />
              <h2 className="text-white font-bold text-xs tracking-widest uppercase relative z-10 leading-tight">AI Adjusts<br/>Tomorrow</h2>
            </button>
          </motion.div>

        </div>

      </motion.div>
      <PremiumModal isOpen={showPremium} onClose={() => setShowPremium(false)} />
    </div>
  );
}

export default function Home() {
  const { user, profile } = useAuth();
  const router = useRouter();

  // If no user is logged in, show the landing page hero flowchart
  if (!user) {
    return <HeroFlowchart />;
  }

  // Determine greeting based on time of day
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  return (
    <div className="max-w-4xl mx-auto relative z-10 pt-10 pb-32 h-full flex flex-col">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          {greeting} <span className="text-teal-400">👋</span>
        </h1>
        <p className="text-gray-400 text-lg">Today&apos;s goal: <span className="text-white font-medium">Build consistency</span></p>
      </header>

      {/* AI INSIGHT */}
      <div className="bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 rounded-3xl p-6 mb-8 flex gap-4 items-start relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-violet-500/20 blur-3xl rounded-full" />
        <div className="p-3 bg-violet-500/20 rounded-xl text-violet-300 shrink-0">
          <Brain size={24} />
        </div>
        <div>
          <h3 className="text-violet-300 font-bold text-sm tracking-wider uppercase mb-1">AI Coach Insight</h3>
          <p className="text-white text-lg leading-relaxed">
            &quot;You reported feeling tired yesterday, so I&apos;ve dynamically reduced today&apos;s workout intensity and prioritized deep recovery protocols.&quot;
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* YOUR PLAN */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Your Plan</h2>
            <button onClick={() => router.push('/routine')} className="text-teal-400 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="bg-[#111127] border border-white/10 rounded-3xl p-6 flex flex-col gap-4">
            {[
              { icon: "🧘", text: "8 min meditation", color: "text-cyan-400" },
              { icon: "🥗", text: "Protein-focused nutrition", color: "text-orange-400" },
              { icon: "🏃", text: "20 min movement", color: "text-rose-400" },
              { icon: "📓", text: "3 min reflection", color: "text-amber-400" }
            ].map((task, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                <span className="text-2xl">{task.icon}</span>
                <span className="text-white font-medium">{task.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PROGRESS */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Progress</h2>
          
          <div className="bg-[#111127] border border-white/10 rounded-3xl p-6 flex flex-col justify-between h-[calc(100%-2rem)]">
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full border-4 border-orange-500/30 flex items-center justify-center bg-orange-500/10">
                <span className="text-3xl">🔥</span>
              </div>
              <div>
                <div className="text-4xl font-black text-white">{profile?.streak || 0}-Day</div>
                <p className="text-orange-400 font-bold tracking-widest uppercase text-sm mt-1">Active Streak</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Daily Completion</span>
                <span className="text-white font-bold">72%</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 w-[72%] rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
