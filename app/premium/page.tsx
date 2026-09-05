"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Star, Zap, BrainCircuit, Sparkles, Activity } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function PremiumPage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const handleSubscribe = (price: string) => {
    if (!user) {
      router.push("/login?redirect=/premium");
      return;
    }
    // TODO: Wire up Stripe Checkout here
    alert(`Simulating Stripe Checkout for ${price}...`);
  };

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-20 relative z-10 px-4">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="text-center mb-12 relative">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium text-sm mb-6">
          <Star size={16} className="fill-amber-400" />
          WelGPT Premium
        </motion.div>
        
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 mb-6 tracking-tight">
          Unlock Limitless Coaching
        </motion.h1>
        
        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-gray-300 max-w-2xl mx-auto">
          Upgrade to Premium to remove all AI limits, go entirely ad-free, and unlock advanced biometric insights.
        </motion.p>
      </div>

      {profile?.isPremium && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-amber-500/20 border border-amber-500/50 p-6 rounded-2xl mb-12 text-center">
          <h2 className="text-2xl font-bold text-amber-400 mb-2">You are a Premium Member! 🎉</h2>
          <p className="text-amber-200/70">Thank you for supporting WelGPT. You have unlimited access.</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        
        {/* FREE TIER */}
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-[#111127] border border-white/10 p-8 rounded-3xl flex flex-col opacity-70">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-gray-400">/ forever</span>
            </div>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex gap-3 text-gray-300"><CheckCircle2 className="text-gray-500 shrink-0" /> <span>Basic Wellness Dashboard</span></li>
            <li className="flex gap-3 text-gray-300"><CheckCircle2 className="text-gray-500 shrink-0" /> <span>Standard Habit Tracking</span></li>
            <li className="flex gap-3 text-gray-300"><CheckCircle2 className="text-gray-500 shrink-0" /> <span>3 AI Plan Generations / Day</span></li>
            <li className="flex gap-3 text-gray-300"><CheckCircle2 className="text-gray-500 shrink-0" /> <span>10 AI Coach Messages / Day</span></li>
            <li className="flex gap-3 text-gray-400/50 line-through"><CheckCircle2 className="text-gray-600 shrink-0" /> <span>Ad-Free Experience</span></li>
          </ul>
          
          <button disabled className="w-full py-4 rounded-xl font-bold bg-white/5 text-gray-500 cursor-not-allowed">
            Current Plan
          </button>
        </motion.div>

        {/* PREMIUM TIER */}
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-gradient-to-b from-amber-500/10 to-[#111127] border border-amber-500/30 p-8 rounded-3xl flex flex-col relative shadow-[0_0_50px_rgba(245,158,11,0.1)]">
          <div className="absolute top-0 right-8 transform -translate-y-1/2">
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-xs uppercase tracking-wider py-1 px-3 rounded-full">
              Recommended
            </span>
          </div>
          
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-amber-400 mb-2">Premium</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-black text-white">$14.99</span>
              <span className="text-gray-400 font-medium">/ month</span>
            </div>
            <p className="text-sm text-amber-200/60 font-medium">Or $49.99 / year (Save 72%)</p>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex gap-3 text-white font-medium"><Sparkles className="text-amber-400 shrink-0" /> <span>Unlimited AI Plan Generations</span></li>
            <li className="flex gap-3 text-white font-medium"><BrainCircuit className="text-amber-400 shrink-0" /> <span>Unlimited AI Coach Chat</span></li>
            <li className="flex gap-3 text-white font-medium"><Zap className="text-amber-400 shrink-0" /> <span>100% Ad-Free Experience</span></li>
            <li className="flex gap-3 text-white font-medium"><Activity className="text-amber-400 shrink-0" /> <span>Advanced Biometric Analytics</span></li>
            <li className="flex gap-3 text-white font-medium"><CheckCircle2 className="text-amber-400 shrink-0" /> <span>Priority Support</span></li>
          </ul>
          
          <div className="space-y-3">
            <button onClick={() => handleSubscribe("49.99")} className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              Subscribe Annually ($49.99)
            </button>
            <button onClick={() => handleSubscribe("14.99")} className="w-full py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10">
              Subscribe Monthly ($14.99)
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
