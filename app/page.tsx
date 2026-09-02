"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect } from "react";
import PremiumModal from "@/components/PremiumModal";
import { Brain, Flame, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { user, profile, updateUserData } = useAuth();
  const router = useRouter();
  const [showPremium, setShowPremium] = useState(false);
  
  // Selection state for goals
  
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [feeling, setFeeling] = useState("");
  const [dayType, setDayType] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const [hasPlan, setHasPlan] = useState(false);

  const feelings = ["Great", "Good", "Okay", "Stressed", "Tired"];
  const dayTypes = ["Work", "Student", "Flexible", "Busy"];

  const handleBuildPlan = () => {
    setOnboardingStep(1);
  };

  const completeOnboarding = () => {
    setIsBuilding(true);
    setTimeout(() => {
      setIsBuilding(false);
      setOnboardingStep(0);
      setHasPlan(true);
      
      const newPlan = {
        date: new Date().toISOString().split('T')[0],
        morning: [
          { id: "m1", time: "Morning", title: "5 min breathing", desc: "Focus on deep diaphragm breathing", completed: false }
        ],
        afternoon: [
          { id: "a1", time: "Afternoon", title: "20 min movement", desc: "Cardio or mobility work", completed: false }
        ],
        evening: [
          { id: "e1", time: "Evening", title: "Nutrition goal", desc: "Hit protein macros", completed: false },
          { id: "e2", time: "Evening", title: "Reflection", desc: "3 min gratitude journal", completed: false }
        ]
      };
      
      if (user) {
        updateUserData({ 
          preferences: { ...profile?.preferences, feeling, dayType },
          recentActivity: ["Generated AI Wellness Plan", ...(profile?.recentActivity || [])].slice(0, 10),
          dailyPlan: newPlan
        });
      }
    }, 2500);
  };

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

  
  // Dynamic Greeting Logic
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.displayName ? user.displayName.split(' ')[0] : "";
  
    // Calculate Live Progress
  let progressPercent = 0;
  if (profile?.dailyPlan) {
    let total = 0;
    let completed = 0;
    (['morning', 'afternoon', 'evening'] as const).forEach((timeOfDay) => {
      profile.dailyPlan![timeOfDay]?.forEach(task => {
        total++;
        if (task.completed) completed++;
      });
    });
    if (total > 0) progressPercent = Math.round((completed / total) * 100);
  }

    const showDashboard = hasPlan || !!profile?.dailyPlan;
  
  // Dynamic Subtitle Logic
  let subtitle = "What do you want to improve?";
  if (showDashboard) {
    if (progressPercent === 100) subtitle = "You crushed your entire daily plan. Rest well!";
    else if (profile?.streak && profile.streak > 1) subtitle = `You're on a ${profile.streak}-day streak 🔥 Keep the momentum going!`;
    else subtitle = "Your personalized plan is ready for action.";
  }

  return (
    <div className="max-w-3xl mx-auto relative z-10 pt-8 pb-32 h-full flex flex-col items-center">
      <AnimatePresence>
        {onboardingStep > 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0a0a1a]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
          >
            {isBuilding ? (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex flex-col items-center text-center">
                <Loader2 size={48} className="text-violet-500 animate-spin mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">Building your plan...</h2>
                <p className="text-gray-400">Analyzing your profile and goals</p>
              </motion.div>
            ) : (
              <motion.div 
                key={onboardingStep}
                initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                className="w-full max-w-md"
              >
                {onboardingStep === 1 && (
                  <>
                    <h2 className="text-3xl font-black text-white mb-2 text-center">How are you feeling?</h2>
                    <p className="text-gray-400 text-center mb-8">This helps WelGPT adjust your intensity.</p>
                    <div className="flex flex-col gap-3 mb-10">
                      {feelings.map(f => (
                        <button
                          key={f}
                          onClick={() => setFeeling(f)}
                          className={`px-6 py-4 rounded-xl border transition-all text-lg font-bold text-left ${
                            feeling === f 
                              ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.2)]'
                              : 'bg-[#111127] border-white/10 text-gray-300'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setOnboardingStep(2)} disabled={!feeling} className="w-full py-4 bg-white text-black font-bold rounded-2xl disabled:opacity-50">Next</button>
                  </>
                )}

                {onboardingStep === 2 && (
                  <>
                    <h2 className="text-3xl font-black text-white mb-2 text-center">What does your day look like?</h2>
                    <p className="text-gray-400 text-center mb-8">WelGPT will schedule around your life.</p>
                    <div className="flex flex-col gap-3 mb-10">
                      {dayTypes.map(d => (
                        <button
                          key={d}
                          onClick={() => setDayType(d)}
                          className={`px-6 py-4 rounded-xl border transition-all text-lg font-bold text-left ${
                            dayType === d 
                              ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
                              : 'bg-[#111127] border-white/10 text-gray-300'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                    <button onClick={completeOnboarding} disabled={!dayType} className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-2xl disabled:opacity-50 shadow-[0_0_20px_rgba(124,58,237,0.3)]">Create My Plan</button>
                  </>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      
      {!showDashboard ? (
        /* 1. HERO & ONBOARDING (Tell us what you want to improve) - ONLY SHOW FOR NEW USERS */
        <div className="w-full text-center mb-12 mt-12">
          <h2 className="text-xl font-bold tracking-widest text-white uppercase mb-4">Welcome to</h2>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-teal-400 tracking-tight mb-8 drop-shadow-sm">
            WELGPT
          </h1>
          
          <p className="text-gray-300 mb-8 font-medium text-lg">{subtitle}</p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-10 max-w-2xl mx-auto">
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
            onClick={handleBuildPlan}
            disabled={selectedGoals.length === 0}
            className="w-full max-w-sm mx-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            BUILD MY PLAN
          </button>
        </div>
      ) : (
        /* DASHBOARD (ONLY SHOW IF THEY HAVE A PLAN) */
        <div className="w-full">
          {/* Header */}
          <div className="w-full text-center mb-10">
            {firstName && <h2 className="text-xl font-bold tracking-widest text-white mb-2">{timeOfDay}, {firstName} 👋</h2>}
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-teal-400 tracking-tight mb-4 drop-shadow-sm">
              Your Dashboard
            </h1>
            <p className="text-gray-300 font-medium">{subtitle}</p>
          </div>

          {/* 4. AI COACH (MOVED TO TOP TO EMPHASIZE THE MOAT) */}
          <div className="w-full max-w-md mx-auto mb-12">
            <div 
              onClick={() => setShowPremium(true)}
              className="bg-gradient-to-b from-[#1a1a3a] to-[#111127] border border-violet-500/50 rounded-3xl p-8 text-center relative overflow-hidden group cursor-pointer shadow-[0_0_30px_rgba(124,58,237,0.15)]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 blur-3xl rounded-full" />
              
              <div className="flex justify-center mb-4 relative z-10">
                <div className="p-3 bg-violet-500/20 rounded-full">
                  <Brain size={28} className="text-violet-400" />
                </div>
              </div>
              <p className="text-2xl text-white font-medium leading-relaxed relative z-10 tracking-tight">
                &quot;Based on your week, I&apos;ve<br/>adjusted tomorrow&apos;s plan.&quot;
              </p>
            </div>
          </div>

          {/* 2. YOUR PLAN TODAY */}
          <div className="w-full max-w-md mx-auto mb-12">
            <h3 className="text-gray-400 font-bold tracking-widest uppercase text-sm mb-6 text-center">Your WelGPT Plan</h3>
            
            <div className="bg-[#111127] border border-white/10 rounded-3xl p-6 mb-6">
               <div className="space-y-6">
                  <div>
                    <h4 className="text-violet-400 font-bold text-xs uppercase tracking-wider mb-3">Morning</h4>
                    <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                      <span className="text-2xl">🧘</span>
                      <span className="font-bold text-white text-lg">5 min breathing</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-teal-400 font-bold text-xs uppercase tracking-wider mb-3">Afternoon</h4>
                    <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                      <span className="text-2xl">🏃</span>
                      <span className="font-bold text-white text-lg">20 min movement</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-orange-400 font-bold text-xs uppercase tracking-wider mb-3">Evening</h4>
                    <div className="flex items-center gap-3 pb-3">
                      <span className="text-2xl">🥗</span>
                      <span className="font-bold text-white text-lg">Nutrition goal</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📓</span>
                      <span className="font-bold text-white text-lg">Reflection</span>
                    </div>
                  </div>
               </div>
            </div>
            
            <button 
              onClick={() => router.push('/routine')}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-2xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]"
            >
              START TRACKING
            </button>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-10" />

          {/* 3. YOUR PROGRESS */}
          <div className="w-full max-w-md mx-auto mb-6 text-center">
            <h3 className="text-gray-400 font-bold tracking-widest uppercase text-sm mb-6">Your Progress</h3>
            
            <div className="bg-[#111127] border border-white/10 rounded-3xl p-8">
              <div className="flex justify-between items-end mb-3">
                <span className="text-gray-400 text-sm font-medium">Daily Completion</span>
                <span className="text-white font-bold text-xl">{progressPercent}%</span>
              </div>
              <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden mb-8">
                <div className={`h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]`} style={{ width: `${progressPercent}%` }} />
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
        </div>
      )}
      
      <PremiumModal isOpen={showPremium} onClose={() => setShowPremium(false)} />
    </div>
  );
}