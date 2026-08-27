"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, RefreshCw, Loader2, Sparkles, Activity, Check } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

interface FoodItem {
  name: string;
  reason: string;
  ingredients: string[];
  searchPrompt: string;
}

export default function NutritionPage() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [goal, setGoal] = useState("maximizing height growth, boosting HGH naturally, and increasing bone mineral density");
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
      }
    } catch (err) {
      console.error(err);
    }
    setIsGenerating(false);
  };

  // Generate on first mount if empty
  useEffect(() => {
    if (items.length === 0) {
      setTimeout(() => generateFood(), 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-5xl mx-auto relative z-10 pt-4 pb-20 h-full flex flex-col">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white"
          >
            Clinical <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">Nutrition.</span>
          </motion.h1>
          <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg max-w-2xl"
          >
            Hyper-optimized daily intake protocols tailored for your physiological goals.
          </motion.p>
        </div>
        <div className="flex gap-4 self-start md:self-end">
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
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
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
    </div>
  );
}
