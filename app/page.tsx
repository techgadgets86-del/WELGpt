
"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Brain, Target, Calendar, Utensils, Activity, Sparkles, BarChart3, TrendingUp, RefreshCw, ChevronDown } from "lucide-react";

const Line = ({ h = "h-8" }: { h?: string }) => (
  <div className={`w-0.5 ${h} bg-gradient-to-b from-violet-500/50 to-teal-500/50 mx-auto my-2`} />
);

function HeroFlowchart() {
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
            <button 
              onClick={() => router.push('/coach')}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold text-lg transition-all"
            >
              Explore WelGPT
            </button>
          </div>
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
