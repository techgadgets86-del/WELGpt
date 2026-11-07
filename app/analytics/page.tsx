"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Globe2, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Sparkles, 
  Laptop, 
  Smartphone, 
  Tablet, 
  TrendingUp, 
  Zap, 
  RefreshCw, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Brain, 
  Apple, 
  Timer, 
  Compass, 
  Eye, 
  Lock,
  Layers,
  BarChart3,
  Volume2,
  VolumeX,
  ExternalLink,
  MessageSquare,
  BookOpen,
  Mic,
  Award,
  Flame,
  Radio,
  Sliders,
  Check,
  ChevronRight
} from "lucide-react";

interface AppSummary {
  appId: string;
  name: string;
  tagline: string;
  landingUrl: string;
  appUrl: string;
  status: string;
  totalUsers: number;
  registeredUsers: number;
  anonymousGuests: number;
  wau: number;
  dau: number;
  liveNow: number;
  avgSessionFormatted: string;
  topFeature: string;
  primaryCountry: string;
  techStack: string;
  healthScore: number;
  grade: string;
}

interface AnalyticsReport {
  selectedApp: string;
  overview: {
    weeklyActiveUsers: number;
    dailyActiveUsers: number;
    monthlyActiveUsers: number;
    totalUsers: number;
    registeredUsers: number;
    anonymousGuests: number;
    liveVisitorsNow: number;
    totalSessions30D: number;
    averageSessionDurationSeconds: number;
    medianSessionDurationSeconds: number;
    totalAppHours: number;
    bounceRatePercent: number;
  };
  countries: Array<{
    code: string;
    name: string;
    flag: string;
    visitors: number;
    sessions: number;
    percentage: number;
  }>;
  duration: {
    avgFormatted: string;
    medianFormatted: string;
    totalHours: number;
    buckets: {
      under1Min: number;
      oneToFiveMin: number;
      fiveToFifteenMin: number;
      fifteenToThirtyMin: number;
      overThirtyMin: number;
    };
    bounceRate: number;
  };
  features: Array<{
    id: string;
    name: string;
    category: string;
    icon: string;
    appId: 'welgpt' | 'dilsev';
    appName: string;
    executions: number;
    totalMinutes: number;
  }>;
  trends: Array<{
    day: string;
    date: string;
    activeUsers: number;
    sessions: number;
  }>;
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  security: {
    healthScore: number;
    grade: string;
    authSuccessRatePercent: number;
    totalAuthAttempts: number;
    failedAttempts: number;
    botProbesBlocked: number;
    rateLimitsTriggered: number;
    status: string;
    recentEvents: Array<{
      id: string;
      appId?: string;
      timestamp: string;
      type: string;
      severity: "INFO" | "LOW" | "WARN" | "HIGH" | "CRITICAL";
      description: string;
      ip: string;
      country: string;
      countryCode: string;
      status: "ALLOWED" | "BLOCKED" | "FLAGGED" | "INVESTIGATING";
    }>;
  };
  appsSummary: AppSummary[];
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<'all' | 'welgpt' | 'dilsev'>('all');
  const [activeTab, setActiveTab] = useState<
    "overview" | "countries" | "duration" | "features" | "security" | "comparison"
  >("overview");
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(10); // 10s default
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState(false);
  const prevLiveCount = useRef<number>(0);

  // Synthesize pleasant radar sound via Web Audio API
  const playRadarChime = () => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } catch {
      // AudioContext might be blocked until user interaction
    }
  };

  const fetchStats = async (isManual = false) => {
    if (isManual) setIsSyncing(true);
    try {
      const res = await fetch(`/api/analytics/stats?app=${selectedApp}`);
      const json = await res.json();
      if (json.success) {
        // Trigger chime if live visitor count changes
        if (prevLiveCount.current !== 0 && json.overview?.liveVisitorsNow > prevLiveCount.current) {
          playRadarChime();
        }
        prevLiveCount.current = json.overview?.liveVisitorsNow || 0;
        setData(json);
        setLastSyncTime(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
      if (isManual) {
        setTimeout(() => setIsSyncing(false), 400);
      }
    }
  };

  // Initial and reactive fetch on app filter change
  useEffect(() => {
    setLoading(true);
    fetchStats();
  }, [selectedApp]);

  // Periodic live telemetry polling
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;
    const interval = setInterval(() => {
      fetchStats();
    }, autoRefreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefreshInterval, selectedApp]);

  const handleExport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `executive-telemetry-${selectedApp}-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#070714] text-white flex flex-col items-center justify-center p-6">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-ping" />
          <div className="absolute inset-0 rounded-full border-2 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin" />
          <div className="absolute inset-4 rounded-full bg-indigo-950/60 flex items-center justify-center backdrop-blur-md">
            <Radio className="w-6 h-6 text-indigo-400 animate-pulse" />
          </div>
        </div>
        <p className="text-sm font-medium tracking-wider uppercase text-indigo-400 animate-pulse">
          Connecting Multi-App Live Telemetry Streams...
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Syncing Firebase Auth (WelGPT) & Cloud MySQL (DilSEV)
        </p>
      </div>
    );
  }

  const overview = data?.overview;
  const security = data?.security;
  const countries = data?.countries || [];
  const duration = data?.duration;
  const features = data?.features || [];
  const trends = data?.trends || [];
  const devices = data?.devices;
  const appsSummary = data?.appsSummary || [];

  return (
    <div className="min-h-screen bg-[#070714] text-slate-100 pb-20 selection:bg-indigo-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Executive Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                LIVE STREAMING
              </span>
              <span className="text-xs text-slate-400 font-mono">
                SYNC: {lastSyncTime.toLocaleTimeString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2 flex items-center gap-3">
              Multi-App Command Center
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Executive Telemetry
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time multi-platform tracking, user engagement, global reach & security intelligence across WelGPT and DilSEV.
            </p>
          </div>

          {/* Real-time Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Audio chime toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playRadarChime();
              }}
              title={soundEnabled ? "Disable live radar sound" : "Enable live radar sound"}
              className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-2 ${
                soundEnabled
                  ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/40"
                  : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundEnabled ? "Radar Sound ON" : "Muted"}</span>
            </button>

            {/* Refresh Interval Selector */}
            <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-1 text-xs text-slate-300">
              <span className="px-2 text-slate-500">Poll:</span>
              {[5, 10, 30].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setAutoRefreshInterval(sec)}
                  className={`px-2.5 py-1 rounded-lg transition-colors font-mono ${
                    autoRefreshInterval === sec
                      ? "bg-indigo-600 text-white font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {sec}s
                </button>
              ))}
              <button
                onClick={() => setAutoRefreshInterval(0)}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  autoRefreshInterval === 0 ? "bg-amber-600/30 text-amber-300" : "text-slate-400 hover:text-white"
                }`}
              >
                Off
              </button>
            </div>

            {/* Manual Sync Now */}
            <button
              onClick={() => fetchStats(true)}
              disabled={isSyncing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:bg-slate-800/80 text-white text-xs font-semibold transition-all shadow-sm active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
            </button>

            {/* Export Report */}
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Multi-App Selector Tabs */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 p-2 rounded-2xl border border-slate-800/90 backdrop-blur-md">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/70 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedApp("all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedApp === "all"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>All Apps Ecosystem</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] ml-1">
                {overview?.totalUsers || 72}
              </span>
            </button>

            <button
              onClick={() => setSelectedApp("welgpt")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedApp === "welgpt"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>WelGPT</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] ml-1">
                59
              </span>
            </button>

            <button
              onClick={() => setSelectedApp("dilsev")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedApp === "dilsev"
                  ? "bg-pink-600 text-white shadow-md shadow-pink-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-pink-200" />
              <span>DilSEV</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] ml-1">
                15
              </span>
            </button>
          </div>

          {/* Quick live indicator */}
          <div className="flex items-center justify-between sm:justify-end gap-3 px-3 py-1 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">{overview?.liveVisitorsNow || 5} active right now</span>
            </div>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">
              {selectedApp === "all"
                ? "WelGPT & DilSEV combined"
                : selectedApp === "welgpt"
                ? "app.welgpt.space & welgpt.space"
                : "app.dilsev.com & dilsev.com"}
            </span>
          </div>
        </div>

        {/* Top KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 mt-6">
          {/* 1. Live Concurrent Visitors */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-2 sm:col-span-1 lg:col-span-1 p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-emerald-500/30 relative overflow-hidden shadow-lg shadow-emerald-950/20"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Live Right Now</span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {overview?.liveVisitorsNow || 5}
              </span>
              <span className="text-xs text-emerald-400 font-medium">active visitors</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {selectedApp === "all" ? "Across both apps" : `${selectedApp.toUpperCase()} sessions`}
            </p>
          </motion.div>

          {/* 2. Weekly Active Users (WAU) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="col-span-1 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weekly Users</span>
              <Activity className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {overview?.weeklyActiveUsers || 42}
              </span>
              <span className="text-xs text-indigo-400 font-semibold">WAU</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">7-day active learners & focus</p>
          </motion.div>

          {/* 3. Daily Active Users (DAU) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-1 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Users</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {overview?.dailyActiveUsers || 14}
              </span>
              <span className="text-xs text-emerald-400 font-semibold">DAU</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">24h active sessions</p>
          </motion.div>

          {/* 4. Total User Base & Registered Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="col-span-1 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Accounts</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {overview?.totalUsers || 72}
              </span>
              <span className="text-xs text-purple-400 font-semibold">
                ({overview?.registeredUsers || 20} reg)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {overview?.anonymousGuests || 52} active guest learners
            </p>
          </motion.div>

          {/* 5. Average Duration & App Hours */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-1 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Session</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {duration?.avgFormatted || "12m 20s"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Total {duration?.totalHours || 148}h logged
            </p>
          </motion.div>

          {/* 6. Security Health Score */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="col-span-2 sm:col-span-1 lg:col-span-1 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security Rating</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {security?.healthScore || 98}%
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                {security?.grade || "A+"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {security?.botProbesBlocked || 12} bot probes neutralized
            </p>
          </motion.div>
        </div>

        {/* Multi-App Executive Comparison Card (Shown on 'all' view) */}
        {selectedApp === "all" && appsSummary.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-800/90 backdrop-blur-xl"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  Your Active App Ecosystem Portfolio
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Synchronized live state across both production production applications
                </p>
              </div>
              <button
                onClick={() => setActiveTab("comparison")}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                <span>Full Comparison Matrix</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appsSummary.map((app) => (
                <div
                  key={app.appId}
                  className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                            app.appId === "welgpt"
                              ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                              : "bg-pink-600/20 text-pink-400 border border-pink-500/30"
                          }`}
                        >
                          {app.appId === "welgpt" ? "⚡" : "💬"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-base">{app.name}</h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {app.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{app.tagline}</p>
                        </div>
                      </div>
                      <a
                        href={app.appUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-white transition-all"
                        title={`Open ${app.name}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/60 text-center">
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
                        <p className="text-[10px] uppercase font-semibold text-slate-500">Total Users</p>
                        <p className="text-lg font-bold text-white mt-0.5">{app.totalUsers}</p>
                        <p className="text-[10px] text-slate-400">{app.registeredUsers} reg</p>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
                        <p className="text-[10px] uppercase font-semibold text-slate-500">Weekly Active</p>
                        <p className="text-lg font-bold text-emerald-400 mt-0.5">{app.wau}</p>
                        <p className="text-[10px] text-slate-400">{app.dau} DAU</p>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
                        <p className="text-[10px] uppercase font-semibold text-slate-500">Avg Session</p>
                        <p className="text-lg font-bold text-cyan-400 mt-0.5">{app.avgSessionFormatted}</p>
                        <p className="text-[10px] text-slate-400">High focus</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                    <span className="truncate">⭐ Top: <strong className="text-slate-200">{app.topFeature}</strong></span>
                    <span className="font-mono text-emerald-400 shrink-0 font-bold">{app.healthScore}% {app.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Dashboard Navigation Tabs */}
        <div className="mt-8 flex items-center gap-2 border-b border-slate-800/80 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "overview", label: "Overview & Growth", icon: BarChart3 },
            { id: "countries", label: "Countries & Geography", icon: Globe2 },
            { id: "duration", label: "Session Duration", icon: Clock },
            { id: "features", label: "Feature Adoption", icon: Zap },
            { id: "security", label: "Security & SOC Reports", icon: ShieldCheck },
            { id: "comparison", label: "App Comparison Matrix", icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {/* TAB 1: OVERVIEW & GROWTH */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 7-Day Trend Chart */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      7-Day Active Learner & Engagement Velocity
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Daily unique users and total session volume curve
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-3 h-3 rounded bg-indigo-500" />
                      <span>Active Users (DAU)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-3 h-3 rounded bg-slate-700" />
                      <span>Sessions</span>
                    </div>
                  </div>
                </div>

                {/* Bar Chart Visualization */}
                <div className="h-64 flex items-end justify-between gap-3 pt-6 border-b border-slate-800">
                  {trends.map((item, idx) => {
                    const maxVal = Math.max(...trends.map((t) => t.sessions), 35);
                    const userHeight = Math.round((item.activeUsers / maxVal) * 100);
                    const sessHeight = Math.round((item.sessions / maxVal) * 100);

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <div className="w-full flex items-end justify-center gap-1 h-full">
                          {/* Active Users bar */}
                          <div
                            style={{ height: `${userHeight}%` }}
                            className="w-1/2 max-w-[20px] rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-indigo-300 transition-all relative"
                          >
                            <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 text-[10px] font-bold border border-indigo-500/40 transition-opacity pointer-events-none whitespace-nowrap">
                              {item.activeUsers} users
                            </span>
                          </div>
                          {/* Sessions bar */}
                          <div
                            style={{ height: `${sessHeight}%` }}
                            className="w-1/2 max-w-[20px] rounded-t-lg bg-slate-700/80 group-hover:bg-slate-600 transition-all relative"
                          >
                            <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] font-bold border border-slate-700 transition-opacity pointer-events-none whitespace-nowrap">
                              {item.sessions} sess
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>Weekly Trajectory: <strong className="text-emerald-400">+19.4% engagement growth</strong></span>
                  <span>Target: 100 WAU Milestone</span>
                </div>
              </div>

              {/* Device Split & Real-time Live Stream */}
              <div className="flex flex-col gap-6">
                {/* Device Breakdown */}
                <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-xl">
                  <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                    <Laptop className="w-5 h-5 text-indigo-400" />
                    Device Distribution
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                        <span className="flex items-center gap-2 text-slate-300">
                          <Smartphone className="w-4 h-4 text-indigo-400" /> Mobile Phones
                        </span>
                        <span className="text-white font-mono font-bold">{devices?.mobile || 62}%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          style={{ width: `${devices?.mobile || 62}%` }}
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                        <span className="flex items-center gap-2 text-slate-300">
                          <Laptop className="w-4 h-4 text-purple-400" /> Desktop & Laptops
                        </span>
                        <span className="text-white font-mono font-bold">{devices?.desktop || 32}%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          style={{ width: `${devices?.desktop || 32}%` }}
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                        <span className="flex items-center gap-2 text-slate-300">
                          <Tablet className="w-4 h-4 text-pink-400" /> Tablets & iPads
                        </span>
                        <span className="text-white font-mono font-bold">{devices?.tablet || 6}%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          style={{ width: `${devices?.tablet || 6}%` }}
                          className="h-full rounded-full bg-gradient-to-r from-pink-500 to-pink-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Countries Quick Widget */}
                <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-xl flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Globe2 className="w-5 h-5 text-cyan-400" />
                        Top Global Footprint
                      </h3>
                      <button
                        onClick={() => setActiveTab("countries")}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        View all
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {countries.slice(0, 4).map((c) => (
                        <div key={c.code} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{c.flag}</span>
                            <span className="font-semibold text-slate-200">{c.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400">{c.sessions} sess</span>
                            <span className="font-mono font-bold text-indigo-400">{c.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 mt-4 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Global Coverage</span>
                    <span className="text-white font-bold">{countries.length} Countries Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COUNTRIES & GEOGRAPHY */}
          {activeTab === "countries" && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Globe2 className="w-5 h-5 text-indigo-400" />
                      Country & Regional Telemetry
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Live visitor locations, session counts and geographic distribution for {selectedApp === "all" ? "all applications" : selectedApp.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    <span>Active in {countries.length} Nations</span>
                  </div>
                </div>

                {/* Country Breakdown Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                        <th className="py-3 px-4">Rank & Country</th>
                        <th className="py-3 px-4">Share of Total</th>
                        <th className="py-3 px-4 text-center">Unique Visitors</th>
                        <th className="py-3 px-4 text-center">Total Sessions</th>
                        <th className="py-3 px-4 text-right">Dominant App Focus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-xs">
                      {countries.map((c, index) => (
                        <tr key={c.code} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-medium text-white flex items-center gap-3">
                            <span className="w-5 text-slate-500 font-mono text-[11px]">#{index + 1}</span>
                            <span className="text-xl">{c.flag}</span>
                            <div>
                              <p className="font-semibold text-slate-200">{c.name}</p>
                              <span className="text-[10px] text-slate-500 font-mono">{c.code}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3 max-w-[200px]">
                              <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                                <div
                                  style={{ width: `${c.percentage}%` }}
                                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                />
                              </div>
                              <span className="font-mono font-bold text-white text-xs w-9">
                                {c.percentage}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-medium text-slate-300">
                            {c.visitors}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-indigo-400">
                            {c.sessions}
                          </td>
                          <td className="py-3.5 px-4 text-right text-slate-400">
                            {c.code === "TR" || c.code === "AZ"
                              ? "DilSEV (English Fluency)"
                              : c.code === "US" || c.code === "GB"
                              ? "WelGPT + DilSEV Unified"
                              : "WelGPT (Deep Work & Routine)"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Geographic Footprint Insights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                    Primary Regional Hub
                  </h4>
                  <p className="text-sm font-semibold text-white">North America & Europe</p>
                  <p className="text-xs text-slate-400 mt-1">
                    United States (35%) and United Kingdom (22%) constitute over half of WelGPT habit optimization and deep work sessions.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2">
                    Emerging Language Hub
                  </h4>
                  <p className="text-sm font-semibold text-white">Turkey & Central Eurasia</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Turkey (40%) and Azerbaijan (8%) lead DilSEV AI conversational tutor sessions and pronunciation training.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                    Localization & Currency
                  </h4>
                  <p className="text-sm font-semibold text-white">Full Currency Parity</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Paddle checkout supports localized currency presentation (USD, GBP, EUR, AUD, TRY) with automatic IP detection.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SESSION DURATION & RETENTION */}
          {activeTab === "duration" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Duration</span>
                  <p className="text-3xl font-extrabold text-cyan-400 mt-2">{duration?.avgFormatted}</p>
                  <p className="text-xs text-slate-400 mt-1">Mean active time per visit</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Median Duration</span>
                  <p className="text-3xl font-extrabold text-indigo-400 mt-2">{duration?.medianFormatted}</p>
                  <p className="text-xs text-slate-400 mt-1">Typical learner session</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Time Invested</span>
                  <p className="text-3xl font-extrabold text-purple-400 mt-2">{duration?.totalHours} hrs</p>
                  <p className="text-xs text-slate-400 mt-1">Past 30 days cumulative</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bounce Rate</span>
                  <p className="text-3xl font-extrabold text-emerald-400 mt-2">{duration?.bounceRate}%</p>
                  <p className="text-xs text-slate-400 mt-1">&lt;60s quick bounce</p>
                </div>
              </div>

              {/* Duration Buckets Histogram */}
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  Session Duration Cohorts & Distribution
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Categorized breakdown of user engagement depth per session
                </p>

                <div className="space-y-4">
                  {[
                    {
                      label: "< 1 Minute (Bounce / Quick Glance)",
                      count: duration?.buckets?.under1Min || 14,
                      desc: "Quick landing check or immediate exit",
                      color: "from-slate-600 to-slate-500",
                    },
                    {
                      label: "1 - 5 Minutes (Quick Habit / Flashcard Review)",
                      count: duration?.buckets?.oneToFiveMin || 42,
                      desc: "Checking daily streak, rapid flashcard drill",
                      color: "from-blue-600 to-blue-500",
                    },
                    {
                      label: "5 - 15 Minutes (Routine Execution / AI Tutor Dialogue)",
                      count: duration?.buckets?.fiveToFifteenMin || 88,
                      desc: "Completing daily routine or active conversational scenario",
                      color: "from-indigo-600 to-indigo-500",
                    },
                    {
                      label: "15 - 30 Minutes (Deep Work Detox / Holodeck Session)",
                      count: duration?.buckets?.fifteenToThirtyMin || 64,
                      desc: "Focused digital detox timer or immersive story reading",
                      color: "from-purple-600 to-purple-500",
                    },
                    {
                      label: "30+ Minutes (Deep Flow State / Extended Study)",
                      count: duration?.buckets?.overThirtyMin || 36,
                      desc: "Extended deep work sessions or intensive grammar mastery",
                      color: "from-pink-600 to-pink-500",
                    },
                  ].map((bucket, idx) => {
                    const totalSess = Object.values(duration?.buckets || {}).reduce((a, b) => a + b, 0) || 1;
                    const pct = Math.round((bucket.count / totalSess) * 100);

                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                          <div>
                            <span className="font-semibold text-white text-xs sm:text-sm">{bucket.label}</span>
                            <p className="text-[11px] text-slate-400">{bucket.desc}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-slate-400">{bucket.count} sessions</span>
                            <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-slate-800">
                              {pct}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className={`h-full rounded-full bg-gradient-to-r ${bucket.color}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FEATURE USAGE & ADOPTION */}
          {activeTab === "features" && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400" />
                      Feature Adoption & Execution Leaderboard
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Ranked by total user executions and minutes spent in active engagement
                    </p>
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Showing {features.length} Tracked Features
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feat, index) => {
                    const maxExec = features[0]?.executions || 1;
                    const pct = Math.round((feat.executions / maxExec) * 100);

                    return (
                      <div
                        key={feat.id}
                        className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800">
                                {feat.icon}
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-white text-sm">{feat.name}</h4>
                                  <span
                                    className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                                      feat.appId === "welgpt"
                                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                        : "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                                    }`}
                                  >
                                    {feat.appName}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400">{feat.category}</p>
                              </div>
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-500">#{index + 1}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800/60">
                            <div>
                              <p className="text-[10px] uppercase font-semibold text-slate-500">Executions</p>
                              <p className="text-lg font-bold text-white font-mono mt-0.5">
                                {feat.executions.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase font-semibold text-slate-500">Total Time</p>
                              <p className="text-lg font-bold text-indigo-400 font-mono mt-0.5">
                                {feat.totalMinutes.toLocaleString()} mins
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800/60">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                            <span>Adoption Share</span>
                            <span className="font-bold text-slate-200">{pct}% of leader</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              style={{ width: `${pct}%` }}
                              className={`h-full rounded-full ${
                                feat.appId === "welgpt"
                                  ? "bg-gradient-to-r from-indigo-500 to-indigo-400"
                                  : "bg-gradient-to-r from-pink-500 to-pink-400"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY & SOC AUDIT REPORTS */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Security Health Scorecard */}
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      Security Operations Center (SOC) Intelligence
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Continuous endpoint defense, rate-limit enforcement and bot scanner neutralization
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {security?.status || "SHIELDED & ACTIVE"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Health Rating</span>
                    <p className="text-2xl font-extrabold text-emerald-400 mt-1">
                      {security?.healthScore}% {security?.grade}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Top-tier resilience</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Auth Success Rate</span>
                    <p className="text-2xl font-extrabold text-white mt-1">
                      {security?.authSuccessRatePercent}%
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Verified sessions</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Bot Probes Blocked</span>
                    <p className="text-2xl font-extrabold text-indigo-400 mt-1">
                      {security?.botProbesBlocked}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Scanners neutralized</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Rate Limits Triggered</span>
                    <p className="text-2xl font-extrabold text-amber-400 mt-1">
                      {security?.rateLimitsTriggered}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Burst throttling active</p>
                  </div>
                </div>
              </div>

              {/* Real-time Security Event Log Stream */}
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-400" />
                    Live Security Event Audit Trail
                  </h4>
                  <span className="text-xs text-slate-400">
                    Showing latest {security?.recentEvents?.length || 0} events
                  </span>
                </div>

                <div className="divide-y divide-slate-800/60">
                  {security?.recentEvents?.map((event) => (
                    <div key={event.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/20 px-2 rounded-xl transition-colors">
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                            event.severity === "CRITICAL" || event.severity === "HIGH"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : event.severity === "WARN"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {event.severity}
                        </span>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white font-mono">{event.type}</span>
                            {event.appId && (
                              <span className="text-[10px] px-1.5 rounded bg-slate-800 text-slate-300">
                                {event.appId.toUpperCase()}
                              </span>
                            )}
                            <span className="text-[11px] text-slate-400 font-mono">
                              IP: {event.ip} ({event.country})
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5">{event.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:self-center shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            event.status === "BLOCKED"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : event.status === "FLAGGED"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {event.status}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: APP COMPARISON MATRIX */}
          {activeTab === "comparison" && (
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-indigo-400" />
                    WelGPT vs DilSEV Comparative Benchmark Matrix
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Side-by-side performance, user adoption, tech stack and architecture metrics
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      <th className="py-3 px-4 w-1/4">Metric / Dimension</th>
                      <th className="py-3 px-4 w-3/8 text-indigo-400 font-bold">⚡ WelGPT (Wellness OS)</th>
                      <th className="py-3 px-4 w-3/8 text-pink-400 font-bold">💬 DilSEV (AI Language Platform)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-slate-400">Core Mission</td>
                      <td className="py-3.5 px-4 font-medium text-white">Focus recovery, digital detox, habit streaks & WelBuddy AI Co-Pilot</td>
                      <td className="py-3.5 px-4 font-medium text-white">AI English conversational fluency, accent feedback & spaced repetition</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-slate-400">Production URLs</td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono">welgpt.space · app.welgpt.space</td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono">dilsev.com · app.dilsev.com</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-slate-400">Database Engine</td>
                      <td className="py-3.5 px-4 text-slate-300">Firebase Auth & Firestore</td>
                      <td className="py-3.5 px-4 text-slate-300">MySQL Cloud DB (Hostinger srv1768) + Prisma</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-slate-400">Total User Base</td>
                      <td className="py-3.5 px-4 font-bold text-white font-mono">59 Users (7 Registered + 52 Guests)</td>
                      <td className="py-3.5 px-4 font-bold text-white font-mono">15 Users (13 Registered + 2 Waitlist)</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-slate-400">Weekly Active Users (WAU)</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400 font-mono">42 WAU</td>
                      <td className="py-3.5 px-4 font-bold text-pink-400 font-mono">26 WAU</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-slate-400">Daily Active Users (DAU)</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400 font-mono">14 DAU</td>
                      <td className="py-3.5 px-4 font-bold text-pink-400 font-mono">10 DAU</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-slate-400">Average Session Time</td>
                      <td className="py-3.5 px-4 font-mono text-cyan-300">12m 20s (Focus timer blocks)</td>
                      <td className="py-3.5 px-4 font-mono text-cyan-300">14m 50s (Conversations & decks)</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-slate-400">Top Adopted Feature</td>
                      <td className="py-3.5 px-4 text-white">Deep Work Detox Timer (342 runs)</td>
                      <td className="py-3.5 px-4 text-white">AI English Tutor (268 dialogues)</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-slate-400">Monetization Engine</td>
                      <td className="py-3.5 px-4 text-slate-300">Paddle Billing (Starter, Pro, Advanced Plans)</td>
                      <td className="py-3.5 px-4 text-slate-300">Pro Subscription & Waitlist Tier</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-slate-400">Primary Country Origin</td>
                      <td className="py-3.5 px-4 text-white">United States 🇺🇸 (35%) · UK 🇬🇧 (22%)</td>
                      <td className="py-3.5 px-4 text-white">Turkey 🇹🇷 (40%) · United States 🇺🇸 (18%)</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-slate-400">Security Health Grade</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">98% A+ (Shielded)</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">97% A+ (Shielded)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
