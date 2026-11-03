"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Copy, Check, Users, Gift, Share2, CheckCircle2, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "@/lib/AuthContext";

interface ReferralRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReferralRewardModal({ isOpen, onClose }: ReferralRewardModalProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralCount, setReferralCount] = useState(1);

  const referralCode = user?.uid ? user.uid.substring(0, 8).toUpperCase() : "FOCUS77";
  const shareUrl = `https://welgpt.space/quiz?ref=${referralCode}`;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("welgpt_referrals_completed");
      if (stored) {
        setReferralCount(parseInt(stored, 10));
      }
    }
  }, [isOpen]);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSimulateFriendInvite = () => {
    const next = Math.min(3, referralCount + 1);
    setReferralCount(next);
    localStorage.setItem("welgpt_referrals_completed", next.toString());
    if (next === 3) {
      localStorage.setItem("welgpt_pro_unlocked", "true");
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  };

  const isUnlocked = referralCount >= 3;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#0e0e24] border border-violet-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Background ambient glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20 mb-3">
              <Gift size={14} className="text-violet-400" />
              <span>Viral Community Pass</span>
            </div>

            <h3 className="text-2xl font-extrabold text-white mb-1.5 tracking-tight">
              Unlock 1 Month Pro Free
            </h3>
            <p className="text-xs text-gray-400 font-light leading-relaxed mb-6">
              Zero credit card needed. When 3 friends complete the 2-minute <strong>Attention Age Audit</strong> using your link, your account immediately unlocks all Pro features.
            </p>

            {/* 3-Step Milestone Progress Bar */}
            <div className="p-5 rounded-2xl bg-[#141432] border border-white/5 mb-6">
              <div className="flex items-center justify-between text-xs font-medium mb-3">
                <span className="text-gray-300">Invite Progress</span>
                <span className="font-mono text-violet-400 font-bold">
                  {referralCount} / 3 Completed
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-5">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-teal-400"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(referralCount / 3) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Milestones */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[1, 2, 3].map((step) => {
                  const completedStep = step <= referralCount;
                  return (
                    <div
                      key={step}
                      className={`p-3 rounded-xl border text-xs transition-all ${
                        completedStep
                          ? "bg-violet-600/20 border-violet-500/40 text-white"
                          : "bg-white/[0.02] border-white/5 text-gray-500"
                      }`}
                    >
                      <div className="flex items-center justify-center mb-1">
                        {completedStep ? (
                          <CheckCircle2 size={16} className="text-teal-400" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-gray-600 text-[10px] flex items-center justify-center font-mono">
                            {step}
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-[11px]">
                        Friend {step}
                      </p>
                      <span className="text-[10px] opacity-75">
                        {completedStep ? "Audit Taken" : "Pending"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Unlocked Celebration Banner */}
            {isUnlocked && (
              <div className="mb-6 p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-center">
                <p className="text-teal-300 font-bold text-sm">
                  🎉 Pro Protocol Unlocked!
                </p>
                <p className="text-xs text-gray-300 mt-0.5">
                  Your 30 days of complimentary AI Coach &amp; NSDR deep work access are active.
                </p>
              </div>
            )}

            {/* Referral Link Box */}
            <div className="mb-5">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Your Unique Invite Link
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#090918] border border-white/10">
                <span className="flex-1 text-xs font-mono text-gray-300 truncate pl-2">
                  {shareUrl}
                </span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
                >
                  {copied ? <Check size={14} className="text-teal-300" /> : <Copy size={14} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `What is your digital Attention Age? I just took the WelGPT focus audit and my score was eye-opening. Take the free 2-min audit here: ${shareUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <span>Share to WhatsApp</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `My attention age is aging faster than my biological age due to dopamine fragmentation. Check your Attention Age free: ${shareUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/30 text-sky-300 text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <span>Post on X / Twitter</span>
              </a>
            </div>

            {/* Demo / Testing button */}
            {!isUnlocked && (
              <div className="text-center pt-2">
                <button
                  onClick={handleSimulateFriendInvite}
                  className="text-[10px] text-gray-500 hover:text-gray-400 underline font-mono"
                >
                  [Simulate friend completing audit]
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
