"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect } from "react";
import PremiumModal from "@/components/PremiumModal";
import { Brain, Flame, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { user, profile, updateUserData, toggleTaskComplete } = useAuth();
  const router = useRouter();
  const [showPremium, setShowPremium] = useState(false);
  
  // Selection state for goals
  
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [feeling, setFeeling] = useState("");
  const [obstacle, setObstacle] = useState("");
  const [timeCommitment, setTimeCommitment] = useState("");
  const [dayType, setDayType] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const [hasPlan, setHasPlan] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [generatedPlanPreview, setGeneratedPlanPreview] = useState<any>(null);

  const feelings = ["Great", "Good", "Okay", "Stressed", "Tired"];
  const obstacles = ["Time", "Motivation", "Energy", "Consistency"];
  const timeCommitments = ["5-10 mins", "15-30 mins", "30-60 mins", "1+ hour"];
  const dayTypes = ["9 to 5", "Student", "Flexible", "Hectic"];
  const fitnessLevels = ["Beginner", "Intermediate", "Advanced"];

  const handleBuildPlan = () => {
    setOnboardingStep(1);
  };

  const [isAdjustingPlan, setIsAdjustingPlan] = useState(false);

  // Check for daily rollover
  useEffect(() => {
    if (profile?.dailyPlan && user && !isAdjustingPlan) {
      const todayDate = new Date().toISOString().split('T')[0];
      if (profile.dailyPlan.date !== todayDate) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsAdjustingPlan(true);
        // Call adjust endpoint
        fetch('/api/plan-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'adjust_daily',
            goals: profile.goals || [],
            previousPlan: profile.dailyPlan
          })
        }).then(res => res.json()).then(data => {
          if (data.plan) {
            data.plan.date = todayDate;
            updateUserData({
              dailyPlan: data.plan,
              coachMessage: data.coachMessage || "Based on yesterday, I've adjusted today's plan."
            });
          }
        }).catch(err => console.error(err))
        .finally(() => setIsAdjustingPlan(false));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.dailyPlan, user]);

  const completeOnboarding = async () => {
    setIsBuilding(true);
    try {
      const res = await fetch('/api/plan-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_new',
          goals: selectedGoals,
          feeling,
          obstacle,
          timeCommitment,
          dayType,
          fitnessLevel
        })
      });
      const data = await res.json();
      
      if (data.plan) {
        data.plan.date = new Date().toISOString().split('T')[0];
        setGeneratedPlanPreview({
          plan: data.plan,
          coachMessage: data.coachMessage || "I've built a custom plan to help you reach your goals."
        });
        setOnboardingStep(6); // Go to step 6 to preview the plan
      } else {
        setOnboardingStep(0);
      }
    } catch (err) {
      console.error("Error generating plan:", err);
      setOnboardingStep(0);
    }
    setIsBuilding(false);
  };

  const handleSavePlan = () => {
    if (user && generatedPlanPreview) {
      updateUserData({ 
        preferences: { ...profile?.preferences, feeling, obstacle, timeCommitment, dayType, fitnessLevel },
        recentActivity: ["Generated AI Wellness Plan", ...(profile?.recentActivity || [])].slice(0, 10),
        dailyPlan: { ...generatedPlanPreview.plan, date: new Date().toISOString().split("T")[0] },
        coachMessage: generatedPlanPreview.coachMessage
      });
    }
    setOnboardingStep(0);
    setHasPlan(true);
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

    const showDashboard = hasPlan || (profile?.dailyPlan && profile.dailyPlan.morning);
  
  // Dynamic Subtitle Logic
  let subtitle = "What do you want to improve?";
  if (showDashboard) {
    if (progressPercent === 100) subtitle = "You crushed your entire daily plan. Rest well!";
    else if (profile?.streak && profile.streak > 1) subtitle = `You're on a ${profile.streak}-day streak 🔥 Keep the momentum going!`;
    else subtitle = "Your personalized plan is ready for action.";
  }

  return (
    <div className="max-w-3xl mx-auto relative z-10 pt-8  min-h-full flex pb-[160px] md:pb-12 flex-col items-center">
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
            ) : onboardingStep === 6 && generatedPlanPreview ? (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex flex-col items-center w-full max-w-md">
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-teal-400 mb-2 text-center">Your WelGPT Plan</h2>
                <p className="text-gray-300 font-medium mb-8 text-center">Built around your goals: {selectedGoals.join(', ')}</p>
                
                <div className="bg-[#111127] border border-white/10 rounded-3xl p-6 w-full mb-8 max-h-[50vh] overflow-y-auto">
                  <div className="space-y-6">
                    {generatedPlanPreview.plan.morning && generatedPlanPreview.plan.morning.length > 0 && (
                      <div>
                        <h4 className="text-violet-400 font-bold text-xs uppercase tracking-wider mb-3">Morning</h4>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {generatedPlanPreview.plan.morning.map((task: any, i: number) => (
                          <div key={task.id} className={`flex items-center gap-3 ${i < generatedPlanPreview.plan.morning.length - 1 ? ' border-b border-white/5 mb-4' : ''}`}>
                            <span className="text-2xl">☀️</span>
                            <span className="font-bold text-lg text-white">{task.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {generatedPlanPreview.plan.afternoon && generatedPlanPreview.plan.afternoon.length > 0 && (
                      <div>
                        <h4 className="text-teal-400 font-bold text-xs uppercase tracking-wider mb-3">Afternoon</h4>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {generatedPlanPreview.plan.afternoon.map((task: any, i: number) => (
                          <div key={task.id} className={`flex items-center gap-3 ${i < generatedPlanPreview.plan.afternoon.length - 1 ? ' border-b border-white/5 mb-4' : ''}`}>
                            <span className="text-2xl">⚡</span>
                            <span className="font-bold text-lg text-white">{task.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {generatedPlanPreview.plan.evening && generatedPlanPreview.plan.evening.length > 0 && (
                      <div>
                        <h4 className="text-orange-400 font-bold text-xs uppercase tracking-wider mb-3">Evening</h4>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {generatedPlanPreview.plan.evening.map((task: any, i: number) => (
                          <div key={task.id} className={`flex items-center gap-3 ${i < generatedPlanPreview.plan.evening.length - 1 ? ' border-b border-white/5 mb-4' : ''}`}>
                            <span className="text-2xl">🌙</span>
                            <span className="font-bold text-lg text-white">{task.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={handleSavePlan}
                  className="w-full px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all hover:scale-105"
                >
                  SAVE & START TODAY
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="bg-[#111127] border border-white/10 rounded-3xl p-8 w-full max-w-md"
              >
                {onboardingStep === 1 && (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-gray-500 text-sm font-bold tracking-widest">STEP 1/5</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">How are you feeling today?</h2>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {feelings.map(f => (
                        <button 
                          key={f} onClick={() => setFeeling(f)}
                          className={`p-4 rounded-xl font-bold transition-all ${feeling === f ? 'bg-violet-600 text-white border-2 border-violet-400 shadow-[0_0_15px_rgba(124,58,237,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 border-2 border-transparent'}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => setOnboardingStep(2)} disabled={!feeling}
                      className="w-full py-4 bg-white text-black rounded-xl font-bold transition-all disabled:opacity-50 hover:scale-105"
                    >
                      Continue
                    </button>
                  </>
                )}

                {onboardingStep === 2 && (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <button onClick={() => setOnboardingStep(1)} className="text-gray-400 hover:text-white">← Back</button>
                      <span className="text-gray-500 text-sm font-bold tracking-widest">STEP 2/5</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">What&apos;s holding you back the most?</h2>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {obstacles.map(o => (
                        <button 
                          key={o} onClick={() => setObstacle(o)}
                          className={`p-4 rounded-xl font-bold transition-all ${obstacle === o ? 'bg-violet-600 text-white border-2 border-violet-400 shadow-[0_0_15px_rgba(124,58,237,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 border-2 border-transparent'}`}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => setOnboardingStep(3)} disabled={!obstacle}
                      className="w-full py-4 bg-white text-black rounded-xl font-bold transition-all disabled:opacity-50 hover:scale-105"
                    >
                      Continue
                    </button>
                  </>
                )}

                {onboardingStep === 3 && (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <button onClick={() => setOnboardingStep(2)} className="text-gray-400 hover:text-white">← Back</button>
                      <span className="text-gray-500 text-sm font-bold tracking-widest">STEP 3/5</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">How much time can you commit daily?</h2>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {timeCommitments.map(t => (
                        <button 
                          key={t} onClick={() => setTimeCommitment(t)}
                          className={`p-4 rounded-xl font-bold transition-all ${timeCommitment === t ? 'bg-violet-600 text-white border-2 border-violet-400 shadow-[0_0_15px_rgba(124,58,237,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 border-2 border-transparent'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => setOnboardingStep(4)} disabled={!timeCommitment}
                      className="w-full py-4 bg-white text-black rounded-xl font-bold transition-all disabled:opacity-50 hover:scale-105"
                    >
                      Continue
                    </button>
                  </>
                )}

                {onboardingStep === 4 && (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <button onClick={() => setOnboardingStep(3)} className="text-gray-400 hover:text-white">← Back</button>
                      <span className="text-gray-500 text-sm font-bold tracking-widest">STEP 4/5</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">What does your typical day look like?</h2>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {dayTypes.map(d => (
                        <button 
                          key={d} onClick={() => setDayType(d)}
                          className={`p-4 rounded-xl font-bold transition-all ${dayType === d ? 'bg-violet-600 text-white border-2 border-violet-400 shadow-[0_0_15px_rgba(124,58,237,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 border-2 border-transparent'}`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => setOnboardingStep(5)} disabled={!dayType}
                      className="w-full py-4 bg-white text-black rounded-xl font-bold transition-all disabled:opacity-50 hover:scale-105"
                    >
                      Continue
                    </button>
                  </>
                )}

                {onboardingStep === 5 && (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <button onClick={() => setOnboardingStep(4)} className="text-gray-400 hover:text-white">← Back</button>
                      <span className="text-gray-500 text-sm font-bold tracking-widest">STEP 5/5</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">What is your current wellness/fitness level?</h2>
                    <div className="grid grid-cols-1 gap-3 mb-8">
                      {fitnessLevels.map(fl => (
                        <button 
                          key={fl} onClick={() => setFitnessLevel(fl)}
                          className={`p-4 rounded-xl font-bold transition-all ${fitnessLevel === fl ? 'bg-teal-500 text-white border-2 border-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 border-2 border-transparent'}`}
                        >
                          {fl}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={completeOnboarding} disabled={!fitnessLevel}
                      className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:opacity-50 hover:scale-105 transition-all"
                    >
                      Generate Plan
                    </button>
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
              className="bg-gradient-to-b from-[#1a1a3a] to-[#111127] border border-violet-500/50 rounded-3xl p-8 text-center relative overflow-hidden group cursor-pointer shadow-[0_0_30px_rgba(124,58,237,0.15)] mb-6"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 blur-3xl rounded-full" />
              
              <div className="flex justify-center mb-4 relative z-10">
                <div className="p-3 bg-violet-500/20 rounded-full">
                  <Brain size={28} className="text-violet-400" />
                </div>
              </div>
              <p className="text-2xl text-white font-medium leading-relaxed relative z-10 tracking-tight">
                {profile?.coachMessage || "Based on your week, I've adjusted tomorrow's plan."}
              </p>
            </div>
            
            <div className="w-full flex justify-end mb-4 -mt-2">
              <button 
                onClick={async () => {
                  if (profile?.dailyPlan && user) {
                    const pastDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                    await updateUserData({ dailyPlan: { ...profile.dailyPlan, date: pastDate } });
                    window.location.reload();
                  }
                }}
                className="text-xs bg-fuchsia-500/20 hover:bg-fuchsia-500/40 text-fuchsia-300 px-4 py-2 rounded-lg border border-fuchsia-500/30 transition-all font-bold tracking-wide"
              >
                🛠️ DEBUG: SIMULATE TOMORROW
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-[#111127] border border-white/10 rounded-3xl">
              <p className="text-gray-300 font-medium">What are you working on today?</p>
              <button 
                onClick={() => router.push('/coach')}
                className="w-full md:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <Brain size={18} className="text-teal-400" />
                Ask Your Coach
              </button>
            </div>
          </div>

          {/* 2. YOUR PLAN TODAY */}
          <div className="w-full max-w-md mx-auto mb-12">
            <h3 className="text-gray-400 font-bold tracking-widest uppercase text-sm mb-6 text-center">Your WelGPT Plan</h3>
            
            <div className="bg-[#111127] border border-white/10 rounded-3xl p-6 mb-6">
               <div className="space-y-6">
                  {profile?.dailyPlan?.morning && profile.dailyPlan.morning.length > 0 && (
                    <div>
                      <h4 className="text-violet-400 font-bold text-xs uppercase tracking-wider mb-3">Morning</h4>
                      {profile.dailyPlan.morning.map((task, i) => (
                        <div key={task.id} onClick={() => toggleTaskComplete(task.id, !task.completed)} className={`flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity ${i < profile.dailyPlan!.morning.length - 1 ? ' border-b border-white/5 mb-4' : ''}`}>
                          <span className="text-2xl">{task.completed ? '✅' : '☀️'}</span>
                          <span className={`font-bold text-lg ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>{task.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {profile?.dailyPlan?.afternoon && profile.dailyPlan.afternoon.length > 0 && (
                    <div>
                      <h4 className="text-teal-400 font-bold text-xs uppercase tracking-wider mb-3">Afternoon</h4>
                      {profile.dailyPlan.afternoon.map((task, i) => (
                        <div key={task.id} onClick={() => toggleTaskComplete(task.id, !task.completed)} className={`flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity ${i < profile.dailyPlan!.afternoon.length - 1 ? ' border-b border-white/5 mb-4' : ''}`}>
                          <span className="text-2xl">{task.completed ? '✅' : '⚡'}</span>
                          <span className={`font-bold text-lg ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>{task.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {profile?.dailyPlan?.evening && profile.dailyPlan.evening.length > 0 && (
                    <div>
                      <h4 className="text-orange-400 font-bold text-xs uppercase tracking-wider mb-3">Evening</h4>
                      {profile.dailyPlan.evening.map((task, i) => (
                        <div key={task.id} onClick={() => toggleTaskComplete(task.id, !task.completed)} className={`flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity ${i < profile.dailyPlan!.evening.length - 1 ? ' border-b border-white/5 mb-4' : ''}`}>
                          <span className="text-2xl">{task.completed ? '✅' : '🌙'}</span>
                          <span className={`font-bold text-lg ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>{task.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
               </div>
            </div>
            
            <button 
              onClick={() => router.push('/routine')}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-2xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]"
            >
              VIEW TODAY&apos;S PLAN
            </button>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-10" />

          {/* 3. YOUR PROGRESS */}
          <div className="w-full max-w-md mx-auto mb-6 text-center">
            
            <div className="bg-[#111127] border border-white/10 rounded-3xl p-8 text-left">
              <div className="mb-8">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-white font-bold text-xl">Today</span>
                  <span className="text-teal-400 font-bold">{progressPercent}% complete</span>
                </div>
                <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]`} style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
              
              <div className="pt-6 border-t border-white/5">
                <div className="flex flex-col gap-2">
                  <span className="text-white font-bold text-lg">Streak</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔥</span>
                    <span className="text-orange-400 font-bold">{profile?.streak || 0} days</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                    {progressPercent === 100 
                      ? "Incredible job! You've secured your streak for today." 
                      : (progressPercent > 0 ? "Complete the rest of your plan to build your streak." : "Complete one more activity to start your streak.")}
                  </p>
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