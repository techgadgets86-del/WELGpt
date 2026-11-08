"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Zap,
  Moon,
  Droplets,
  Dumbbell,
  ArrowRight,
  Share2,
  Lock,
} from "lucide-react";
import { useAdvancedNotifications } from "@/lib/useAdvancedNotifications";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdvancedNotificationModal({ isOpen, onClose }: Props) {
  const {
    permission,
    isSubscribed,
    isPWA,
    isIOS,
    preferences,
    updatePreferences,
    enableNotifications,
    triggerLockScreenTest,
  } = useAdvancedNotifications();

  const [countdown, setCountdown] = useState<number | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(false);

  // Handle test countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCountdown(null);
      setTestResult("Alert dispatched! Check your lock screen now.");
      setTimeout(() => setTestResult(null), 8000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleStartTest = async () => {
    setTestResult(null);
    setCountdown(5);
    try {
      await triggerLockScreenTest(5);
    } catch (e: any) {
      setCountdown(null);
      setTestResult(e?.message || "Failed to trigger test.");
    }
  };

  const handleEnable = async () => {
    setIsActivating(true);
    try {
      const res = await enableNotifications();
      if (!res.success && res.error) {
        setTestResult(res.error);
      }
    } finally {
      setIsActivating(false);
    }
  };

  if (!isOpen) return null;

  const isGranted = permission === "granted";
  const isDenied = permission === "denied";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="relative w-full max-w-lg bg-[#0e0e24] border border-white/15 rounded-3xl shadow-2xl p-5 sm:p-7 text-white my-auto max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-teal-400 p-[1px] flex items-center justify-center shadow-lg shadow-violet-500/20">
                <div className="w-full h-full bg-[#0a0a1a] rounded-2xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-teal-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Lock-Screen Alerts
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Background
                  </span>
                </h3>
                <p className="text-xs text-gray-400">
                  Sends protocol nudges even when app is closed or phone is locked
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* System Status Banner */}
          <div className="mt-5 p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-semibold text-gray-300">Lock-Screen Status</span>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${
                  isGranted
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : isDenied
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isGranted ? "bg-emerald-400 animate-ping" : isDenied ? "bg-rose-400" : "bg-amber-400"
                  }`}
                />
                {isGranted ? "Active & Ready" : isDenied ? "Blocked in Settings" : "Permission Needed"}
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              {isGranted
                ? "Your device is configured. WelBuddy can light up your lock screen for scheduled morning briefs, workouts, and executive resets."
                : isDenied
                ? "Notification permissions are denied in your browser settings. To receive lock-screen alerts, tap the lock/settings icon in your address bar and toggle Notifications to Allow."
                : "Grant lock-screen access so WelBuddy can keep you accountable for your daily routine even when your phone is in your pocket or asleep."}
            </p>

            {/* iOS Safari PWA note */}
            {isIOS && !isPWA && (
              <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/30 flex items-start gap-2.5 text-xs text-violet-200">
                <Share2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">iPhone Lock Screen Requirement:</strong>
                  Apple requires Web Apps to be added to the Home Screen for lock-screen push. Tap <span className="underline font-medium">Share</span> in Safari, then select <span className="underline font-medium">'Add to Home Screen'</span>.
                </div>
              </div>
            )}

            {!isGranted && !isDenied && (
              <button
                onClick={handleEnable}
                disabled={isActivating}
                className="w-full mt-1 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <Bell size={16} />
                {isActivating ? "Requesting System Access..." : "Enable Lock-Screen Access"}
              </button>
            )}
          </div>

          {/* Test on Locked Screen Tool */}
          <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-violet-950/40 via-indigo-950/30 to-[#0e0e24] border border-violet-500/30">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-violet-400" />
                Test on Locked Phone
              </h4>
              <span className="text-[11px] text-gray-400">5-second delay</span>
            </div>
            <p className="text-xs text-gray-300 mb-3 leading-relaxed">
              Click below, then <strong>lock your phone screen immediately</strong> with the power button. Your screen will light up with a WelBuddy protocol alert in 5 seconds.
            </p>

            {countdown !== null ? (
              <div className="p-4 rounded-xl bg-violet-900/60 border border-violet-400/50 flex flex-col items-center justify-center text-center gap-2">
                <div className="text-3xl font-black text-teal-300 animate-bounce">{countdown}s</div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Lock size={14} className="text-amber-300" />
                  PRESS YOUR PHONE POWER BUTTON NOW!
                </div>
                <p className="text-[11px] text-gray-300">
                  Screen will wake up when the countdown reaches 0.
                </p>
              </div>
            ) : (
              <button
                onClick={handleStartTest}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Zap size={14} className="text-amber-400" />
                Send Test Lock-Screen Alert (5s)
              </button>
            )}

            {testResult && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-teal-950/50 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2">
                <CheckCircle2 size={14} className="shrink-0" />
                <span>{testResult}</span>
              </div>
            )}
          </div>

          {/* Lock-Screen Preview Card */}
          <div className="mt-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
              <Lock size={12} />
              Lock Screen Banner Preview
            </h4>
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-teal-400 flex items-center justify-center text-[9px] font-bold text-black">
                    W
                  </div>
                  <span className="font-semibold text-gray-200">WELBUDDY</span>
                  <span>•</span>
                  <span>Now</span>
                </div>
              </div>
              <div className="text-xs font-bold text-white mb-0.5">
                Executive Focus & Kinetic Activation ⚡
              </div>
              <p className="text-[11px] text-gray-300 leading-snug">
                Anaerobic threshold sprint & posture reset scheduled. Tap to open your routine.
              </p>
              <div className="mt-2 pt-2 border-t border-white/10 flex gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-[10px] font-semibold text-teal-300">
                  Open Routine ⚡
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-[10px] font-semibold text-gray-300">
                  View Tasks 📋
                </span>
              </div>
            </div>
          </div>

          {/* Notification Schedule Automation */}
          <div className="mt-5 pt-4 border-t border-white/10 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Automated Alert Channels
            </h4>

            {/* 1. Morning Briefing */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Zap size={16} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Morning Kinetic Activation</div>
                  <div className="text-[11px] text-gray-400">Executive brief & daily goals</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={preferences.morningTime}
                  onChange={(e) => updatePreferences({ morningTime: e.target.value })}
                  className="bg-black/40 border border-white/15 rounded-lg px-2 py-1 text-xs text-white"
                />
                <button
                  onClick={() => updatePreferences({ morningAlert: !preferences.morningAlert })}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    preferences.morningAlert ? "bg-teal-500" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      preferences.morningAlert ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 2. Routine & Exercise Auto-Sync */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                  <Dumbbell size={16} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Routine Exercise Alerts</div>
                  <div className="text-[11px] text-gray-400">Auto-sync with today's scheduled workouts</div>
                </div>
              </div>
              <button
                onClick={() => updatePreferences({ routineExercises: !preferences.routineExercises })}
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  preferences.routineExercises ? "bg-teal-500" : "bg-gray-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    preferences.routineExercises ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* 3. Midday Focus Sprint */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Clock size={16} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Midday Focus & Posture</div>
                  <div className="text-[11px] text-gray-400">Break mental fatigue & reset spine</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={preferences.middayTime}
                  onChange={(e) => updatePreferences({ middayTime: e.target.value })}
                  className="bg-black/40 border border-white/15 rounded-lg px-2 py-1 text-xs text-white"
                />
                <button
                  onClick={() => updatePreferences({ middayFocus: !preferences.middayFocus })}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    preferences.middayFocus ? "bg-teal-500" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      preferences.middayFocus ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 4. Evening Downregulation */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                  <Moon size={16} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Evening Downregulation</div>
                  <div className="text-[11px] text-gray-400">Parasympathetic calm & sleep prep</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={preferences.eveningTime}
                  onChange={(e) => updatePreferences({ eveningTime: e.target.value })}
                  className="bg-black/40 border border-white/15 rounded-lg px-2 py-1 text-xs text-white"
                />
                <button
                  onClick={() => updatePreferences({ eveningDownregulation: !preferences.eveningDownregulation })}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    preferences.eveningDownregulation ? "bg-teal-500" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      preferences.eveningDownregulation ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 5. Hydration Nudges */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                  <Droplets size={16} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Hydration & Breathwork</div>
                  <div className="text-[11px] text-gray-400">
                    Nervous system resets every {preferences.hydrationFrequencyHours}h
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={preferences.hydrationFrequencyHours}
                  onChange={(e) => updatePreferences({ hydrationFrequencyHours: Number(e.target.value) })}
                  className="bg-black/40 border border-white/15 rounded-lg px-2 py-1 text-xs text-white"
                >
                  <option value={1}>1h</option>
                  <option value={2}>2h</option>
                  <option value={3}>3h</option>
                </select>
                <button
                  onClick={() => updatePreferences({ hydrationNudges: !preferences.hydrationNudges })}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    preferences.hydrationNudges ? "bg-teal-500" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      preferences.hydrationNudges ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Close / Done Button */}
          <div className="mt-6 pt-3 border-t border-white/10 flex justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
            >
              Done & Save Settings
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
