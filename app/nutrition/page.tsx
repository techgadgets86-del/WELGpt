"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, RefreshCw, Loader2, Sparkles, Activity, Check, Crown, X, Star } from "lucide-react";
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

      {/* Pricing Modal */}
      <AnimatePresence>
        {showPricing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-5xl my-8 bg-[#111127] rounded-3xl border border-white/10 p-4 md:p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowPricing(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X size={24} />
              </button>
              
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Upgrade Your Nutrition</h2>
                <p className="text-gray-400">Unlock advanced personalized meal plans and one-off transformation protocols.</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                {/* FREE TIER */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col">
                  <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
                  <div className="text-3xl font-black text-white mb-6">Free</div>
                  <ul className="space-y-4 mb-8 flex-1">
                    {["Enter basic information", "Generate 1 nutrition protocol", "See calories/macros", "Get basic meal suggestions", "View basic nutrition education", "Save 1 plan", "Use limited AI Coach", "See ads"].map((feat, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-300">
                        <Check size={18} className="text-gray-500 shrink-0" /> {feat}
                      </li>
                    ))}
                  </ul>
                  <button disabled className="w-full py-4 rounded-xl font-bold text-gray-400 bg-white/5 border border-white/10 cursor-not-allowed">Current Plan</button>
                </div>
                
                {/* PREMIUM TIER */}
                <div className="bg-gradient-to-b from-orange-500/20 to-rose-500/5 border border-orange-500/50 rounded-3xl p-8 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">Most Popular</div>
                  <h3 className="text-2xl font-bold text-orange-400 mb-2 flex items-center gap-2"><Crown size={24} /> Premium</h3>
                  <div className="text-3xl font-black text-white mb-1">$14.99<span className="text-lg text-gray-400 font-normal">/mo</span></div>
                  <p className="text-sm text-gray-400 mb-6">Full access to the AI Nutrition Engine.</p>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    {["Unlimited nutrition protocols", "Personalized meal plans", "Macro/calorie adjustments", "Dietary preferences & Food substitutions", "Weekly meal planning & Grocery lists", "Progress tracking", "Advanced AI nutrition coach", "Saved plans & Advanced analytics", "No ads"].map((feat, i) => (
                      <li key={i} className="flex items-center gap-3 text-white">
                        <Star size={18} className="text-orange-400 shrink-0 fill-orange-400" /> {feat}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:scale-[1.02] transition-transform shadow-lg shadow-orange-500/20">Upgrade to Premium</button>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-10">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">One-Off Transformation Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "7-Day Fat-Loss Meal Plan", price: "$4.99", color: "from-blue-500 to-cyan-500" },
                    { title: "30-Day High-Protein Plan", price: "$9.99", color: "from-fuchsia-500 to-purple-500" },
                    { title: "30-Day Healthy Eating Reset", price: "$9.99", color: "from-emerald-500 to-teal-500" },
                    { title: "90-Day Transformation Plan", price: "$19.99", color: "from-amber-500 to-orange-500" }
                  ].map((prod, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors flex flex-col items-center text-center cursor-pointer group">
                      <div className={`w-12 h-12 rounded-full mb-4 bg-gradient-to-br ${prod.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Activity size={24} className="text-white" />
                      </div>
                      <h4 className="text-white font-bold mb-2 flex-1">{prod.title}</h4>
                      <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">{prod.price}</div>
                    </div>
                  ))}
                </div>
              </div>
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
