"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, RefreshCw, Loader2, Sparkles, Activity, Check, Crown, X, Star } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import PremiumModal from "@/components/PremiumModal";

interface FoodItem {
  name: string;
  reason: string;
  ingredients: string[];
  searchPrompt: string;
}

export default function NutritionPage() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { profile, updateUserData } = useAuth();
  
  // Auto-sync initial prompt from global profile!
  const [goal, setGoal] = useState(() => {
    let base = "maximizing height growth, boosting HGH naturally, and increasing bone mineral density";
    if (typeof window !== "undefined" && profile) {
      if (profile.goals && profile.goals.length > 0) {
        base = profile.goals.join(" and ");
      }
      if (profile.preferences?.dietary && profile.preferences.dietary !== "none") {
        base += ` (Dietary restriction: ${profile.preferences.dietary})`;
      }
    }
    return base;
  });
  
  // Re-sync if profile loads late
  useEffect(() => {
    if (profile?.goals && profile.goals.length > 0) {
      let updated = profile.goals.join(" and ");
      if (profile.preferences?.dietary && profile.preferences.dietary !== "none") {
        updated += ` (Dietary restriction: ${profile.preferences.dietary})`;
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGoal(updated);
    }
  }, [profile?.goals, profile?.preferences?.dietary]);

  const [showPricing, setShowPricing] = useState(false);
  // gamification coming soon for nutrition

  const generateFood = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/nutrition-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: goal })
      });
      const data = await res.json();
      if (data && data.items) {
        setItems(data.items);
        if (profile) {
          updateUserData({ nutritionPlan: data.items });
        }
      }
    } catch (err) {
      console.error(err);
    }
    setIsGenerating(false);
  };

  // Load saved plan or generate on first mount
  useEffect(() => {
    if (profile?.nutritionPlan && profile.nutritionPlan.length > 0) {
      setItems(profile.nutritionPlan);
    } else if (items.length === 0 && !isGenerating) {
      setTimeout(() => generateFood(), 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.nutritionPlan]);

  return (
    <div className="max-w-5xl mx-auto relative z-10 pt-4  min-h-full flex pb-[160px] md:pb-12 flex-col">
      
      {profile?.dailyPlan && (
        <div className="bg-orange-500/20 border border-orange-500/50 rounded-2xl p-4 mb-8 flex items-center justify-between text-orange-300 w-full">
          <div className="flex items-center gap-3">
            <Utensils size={24} />
            <div>
              <p className="font-bold">Your Daily Plan requires hitting your Nutrition Goal this evening.</p>
              <p className="text-sm opacity-80">Use the generator below to find the optimal meals.</p>
            </div>
          </div>
        </div>
      )}

      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white"
          >
            AI Nutrition <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">Coach.</span>
          </motion.h1>
          <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg max-w-2xl"
          >
            Personalized nutrition guidance built around your goals, preferences and lifestyle.
          </motion.p>
        </div>
        <div className="flex gap-4 self-start md:self-end">
          <motion.button 
            onClick={() => setShowPricing(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold transition-transform hover:scale-105 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
          >
            <Crown size={18} />
            Pro Plans
          </motion.button>
          <motion.button 
            onClick={generateFood}
            disabled={isGenerating}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400 font-bold transition-all disabled:opacity-50"
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
            {isGenerating ? "Synthesizing..." : "Generate New Protocol"}
          </motion.button>
        </div>
      </header>

      <div className="mb-8">
        <label className="text-sm text-gray-400 font-medium mb-2 block uppercase tracking-wider">Current Bio-Goal</label>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2 pl-4 focus-within:border-orange-500/50 transition-colors">
          <Activity size={20} className="text-orange-500" />
          <input 
            type="text" 
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="flex-1 bg-transparent text-white font-medium focus:outline-none py-2"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center py-20"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-t-2 border-l-2 border-orange-500 animate-spin" />
              <div className="w-24 h-24 rounded-full border-r-2 border-b-2 border-rose-500 animate-spin absolute inset-0 animation-delay-150" />
              <Utensils className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-400" size={32} />
            </div>
            <p className="mt-8 text-orange-400 font-medium tracking-widest uppercase animate-pulse">Running Nutrient Synthesis...</p>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {items.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#15152a] rounded-3xl border border-white/10 overflow-hidden flex flex-col group hover:border-orange-500/30 transition-all duration-300"
              >
                <div className="h-48 relative overflow-hidden bg-black/50">
                  {/* Using Pollinations.ai for instantly generated AI images without an API key */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={`https://image.pollinations.ai/prompt/${encodeURIComponent(item.searchPrompt)}?width=600&height=400&nologo=true`} 
                    alt={item.name}
                    onError={(e) => {
                      // Fallback to Unsplash if AI generation fails or times out
                      e.currentTarget.src = `https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop&q=80`;
                    }}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 bg-gray-900"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#15152a] via-[#15152a]/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">{item.name}</h3>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start gap-3 mb-6">
                    <Sparkles className="text-orange-400 shrink-0 mt-1" size={18} />
                    <p className="text-gray-300 leading-relaxed text-sm">{item.reason}</p>
                  </div>
                  
                  <div className="mt-auto">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Core Ingredients</h4>
                    <ul className="space-y-2">
                      {item.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 rounded-lg px-3 py-1.5 w-fit">
                          <Check size={14} className="text-green-400" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

            {/* Global Adaptive Premium Modal */}
      <PremiumModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
