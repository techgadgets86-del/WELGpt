"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect } from "react";
import PremiumModal from "@/components/PremiumModal";
import { Brain, Flame } from "lucide-react";

export default function Home() {
  const { user, profile, updateUserData } = useAuth();
  const router = useRouter();
  const [showPremium, setShowPremium] = useState(false);
  
  // Selection state for goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  
  // Sync with Firestore profile goals
  useEffect(() => {
    if (profile?.goals && profile.goals.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedGoals(profile.goals);
    }
  }, [profile?.goals]);

  const toggleGoal = (goal: string) => {
    let newGoals = [];
    if (selectedGoals.includes(goal)) {
      newGoals = selectedGoals.filter(g => g !== goal);
    } else {
      newGoals = [...selectedGoals, goal];
    }
    setSelectedGoals(newGoals);
    // Auto-save to backend
    if (user) {
      updateUserData({ goals: newGoals });
    }
  };

  const goals = ["Better Sleep", "Less Stress", "Better Fitness", "Nutrition", "Focus", "Better Habits"];

  return (
    <div className="max-w-3xl mx-auto relative z-10 pt-8 pb-32 h-full flex flex-col items-center">
      
      {/* 1. HERO & ONBOARDING (Tell us what you want to improve) */}
      <div className="w-full text-center mb-12">
        <h2 className="text-xl font-bold tracking-widest text-white uppercase mb-2">WELGPT</h2>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-teal-400 tracking-tight mb-8 drop-shadow-sm">
          Your AI Wellness Coach
        </h1>
        
        <p className="text-gray-300 mb-6 font-medium">Tell us what you want to improve.</p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-2xl mx-auto">
          {goals.map(goal => (
            <button
              key={goal}
              onClick={() => toggleGoal(goal)}
              className={`px-6 py-3 rounded-full border transition-all text-sm font-bold ${
                selectedGoals.includes(goal) 
                  ? 'bg-violet-600 border-violet-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]'
                  : 'bg-[#111127] border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => router.push('/routine')}
          className="w-full max-w-sm mx-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all hover:scale-105"
        >
          BUILD MY PLAN
        </button>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-10" />

      {/* 2. YOUR PLAN TODAY */}
      <div className="w-full max-w-md mx-auto mb-12">
        <h3 className="text-gray-400 font-bold tracking-widest uppercase text-sm mb-6 text-center">Your Plan Today</h3>
        
        <div className="bg-[#111127] border border-white/10 rounded-3xl p-6 mb-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧘</span>
                <span className="font-bold text-white">Meditation</span>
              </div>
              <span className="text-gray-400 font-medium">10 min</span>
            </div>
            
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🥗</span>
                <span className="font-bold text-white">Nutrition</span>
              </div>
              <span className="text-orange-400 font-medium">Today&apos;s goal</span>
            </div>
            
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏃</span>
                <span className="font-bold text-white">Movement</span>
              </div>
              <span className="text-gray-400 font-medium">20 min</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📓</span>
                <span className="font-bold text-white">Reflection</span>
              </div>
              <span className="text-gray-400 font-medium">3 min</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => router.push('/routine')}
          className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold text-lg transition-all"
        >
          START
        </button>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-10" />

      {/* 3. YOUR PROGRESS */}
      <div className="w-full max-w-md mx-auto mb-12 text-center">
        <h3 className="text-gray-400 font-bold tracking-widest uppercase text-sm mb-6">Your Progress</h3>
        
        <div className="bg-[#111127] border border-white/10 rounded-3xl p-8">
          <div className="flex justify-between items-end mb-3">
            <span className="text-gray-400 text-sm font-medium">Daily Completion</span>
            <span className="text-white font-bold text-xl">80%</span>
          </div>
          <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden mb-8">
            <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 w-[80%] rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <div className="p-3 bg-orange-500/20 text-orange-400 rounded-full">
              <Flame size={24} />
            </div>
            <div className="text-left">
              <p className="text-2xl font-black text-white">{profile?.streak || 0} Day</p>
              <p className="text-orange-400 font-bold tracking-widest uppercase text-xs">Active Streak</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-10" />

      {/* 4. AI COACH */}
      <div className="w-full max-w-md mx-auto">
        <h3 className="text-gray-400 font-bold tracking-widest uppercase text-sm mb-6 text-center">AI Coach</h3>
        
        <div 
          onClick={() => setShowPremium(true)}
          className="bg-gradient-to-b from-[#1a1a3a] to-[#111127] border border-violet-500/30 rounded-3xl p-8 text-center relative overflow-hidden group cursor-pointer mb-6"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 blur-3xl rounded-full" />
          
          <p className="text-xl text-white font-medium leading-relaxed mb-2 relative z-10">
            &quot;Based on your week, I&apos;ve<br/>adjusted tomorrow&apos;s plan.&quot;
          </p>
        </div>
        
        <button 
          onClick={() => router.push('/coach')}
          className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold text-lg py-4 transition-all"
        >
          <Brain size={20} className="text-teal-400" />
          TALK TO WELGPT
        </button>
      </div>
      
      <PremiumModal isOpen={showPremium} onClose={() => setShowPremium(false)} />
    </div>
  );
}
