"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Sparkles, BrainCircuit, Target } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function WelcomePage() {
  useEffect(() => {
    // Launch celebratory confetti burst on arrival
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#2dd4bf", "#8b5cf6", "#f59e0b", "#ffffff"],
      });
    } catch {
      // Ignore if canvas not available
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-base-100)] text-white flex items-center justify-center px-4 py-20 relative selection:bg-teal-400 selection:text-black">
      {/* Glow Effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-500/15 blur-[140px] pointer-events-none rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full p-8 sm:p-12 rounded-3xl border border-white/10 bg-[#0f0f1d]/90 backdrop-blur-xl shadow-2xl text-center relative z-10"
      >
        <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-400/40 flex items-center justify-center mx-auto mb-6 text-teal-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Subscription Activated</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">
          Welcome to the Protocol.
        </h1>

        <p className="text-white/70 text-sm sm:text-base leading-relaxed font-light mb-8">
          Your payment was processed successfully by Paddle. All premium WelBuddy Co-Pilot limits, daily routine customizers, and deep work timers have been unlocked on your account.
        </p>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="w-full py-4 rounded-2xl bg-teal-400 hover:bg-teal-300 text-black font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
          >
            <span>Enter Your Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/routine"
            className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-widest border border-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <Target className="w-4 h-4 text-teal-400" />
            <span>Start Daily Routine</span>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-xs text-white/40 font-mono">
          Transaction verified via Paddle • WelGPT OS
        </div>
      </motion.div>
    </div>
  );
}
