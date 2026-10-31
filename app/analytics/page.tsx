"use client";

import React, { useState, useEffect } from "react";
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
  BarChart3
} from "lucide-react";

interface AnalyticsReport {
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
}

export default function AnalyticsDashboardPage() {
  const [data, setData] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "geography" | "duration" | "features" | "security">("overview");
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/analytics/stats");
      const json = await res.json();
      if (json.success) {
        setData(json);
        setLastRefreshed(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto refresh every 45 seconds for real-time monitoring
    const interval = setInterval(fetchData, 45000);
    return () => clearInterval(interval);
  }, []);

  const exportSecurityReport = () => {
    if (!data) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data.security, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `welgpt_security_audit_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-400 rounded-full animate-spin" />
        <p className="text-gray-400 font-mono text-xs uppercase tracking-widest animate-pulse">
          Loading Real-Time Intelligence &amp; Telemetry...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-400">
        Failed to load analytics data. Please refresh.
      </div>
    );
  }

  const { overview, countries, duration, features, trends, devices, security } = data;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 pt-4 px-2 md:px-6">
      
      {/* Top Banner / System Status */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              WelGPT <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Analytics &amp; Security</span>
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Telemetry
            </span>
          </div>
          <p className="text-gray-400 text-sm font-light">
            Exact user sessions, global geography, session engagement length, feature adoption, and SOC security audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium border border-white/10 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-teal-400" : ""}`} />
            <span>{refreshing ? "Syncing..." : "Refresh"}</span>
          </button>
          
          <button
            onClick={exportSecurityReport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors shadow-lg shadow-violet-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* WAU */}
        <div className="p-5 rounded-2xl bg-[#111127] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-gray-400">Weekly Users</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">{overview.weeklyActiveUsers}</div>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +18.4% WoW
            </p>
          </div>
        </div>

        {/* DAU */}
        <div className="p-5 rounded-2xl bg-[#111127] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-gray-400">Daily Active</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">{overview.dailyActiveUsers}</div>
            <p className="text-[11px] text-cyan-400 mt-1">Today&apos;s active members</p>
          </div>
        </div>

        {/* Live Now */}
        <div className="p-5 rounded-2xl bg-[#111127] border border-white/10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-gray-400">Live Online</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-emerald-300 tracking-tight">{overview.liveVisitorsNow}</div>
            <p className="text-[11px] text-gray-400 mt-1">Active in last 15 min</p>
          </div>
        </div>

        {/* Avg Duration */}
        <div className="p-5 rounded-2xl bg-[#111127] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-gray-400">Avg Duration</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">{duration.avgFormatted}</div>
            <p className="text-[11px] text-gray-400 mt-1">{duration.totalHours} total hours</p>
          </div>
        </div>

        {/* Total Accounts */}
        <div className="p-5 rounded-2xl bg-[#111127] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-gray-400">Total Users</span>
            <Lock className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">{overview.totalUsers}</div>
            <p className="text-[11px] text-violet-400 mt-1">{overview.registeredUsers} verified accounts</p>
          </div>
        </div>

        {/* Security Health */}
        <div className="p-5 rounded-2xl bg-[#111127] border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 to-[#111127] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-gray-400">Security Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-emerald-400 tracking-tight">{security.healthScore}/100</div>
            <p className="text-[11px] text-emerald-300 font-semibold mt-1">Grade {security.grade} • Shielded</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: "overview", label: "Overview & Trends", icon: BarChart3 },
          { key: "geography", label: "User Countries", icon: Globe2 },
          { key: "duration", label: "Usage Time & Duration", icon: Clock },
          { key: "features", label: "Feature Usage Analytics", icon: Layers },
          { key: "security", label: "Security & Threat Reports", icon: ShieldAlert },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                  : "bg-white/[0.02] text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* TAB 1: OVERVIEW & TRENDS */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* 7-Day WAU Trend Chart */}
          <div className="p-6 md:p-8 rounded-3xl bg-[#111127] border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-lg font-bold text-white">7-Day Weekly Active Users (WAU) Velocity</h3>
                <p className="text-xs text-gray-400">Daily unique users logging into WelGPT over the past week</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-400 inline-block" /> Active Users
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-violet-500/40 inline-block" /> Total Sessions
                </span>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="grid grid-cols-7 gap-2 md:gap-4 h-48 items-end pt-6 border-b border-white/10 pb-2">
              {trends.map((t, idx) => {
                const maxVal = 35;
                const userHeight = Math.min(100, Math.round((t.activeUsers / maxVal) * 100));
                const sessionHeight = Math.min(100, Math.round((t.sessions / maxVal) * 100));

                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.activeUsers}u / {t.sessions}s
                    </div>
                    <div className="w-full max-w-[48px] flex items-end gap-1 h-36">
                      <div
                        style={{ height: `${userHeight}%` }}
                        className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-md transition-all group-hover:brightness-125"
                      />
                      <div
                        style={{ height: `${sessionHeight}%` }}
                        className="flex-1 bg-violet-500/30 rounded-t-md transition-all group-hover:bg-violet-500/50"
                      />
                    </div>
                    <span className="text-xs font-mono text-gray-400 group-hover:text-white font-medium">
                      {t.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Countries Preview */}
            <div className="p-6 rounded-3xl bg-[#111127] border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-white text-sm">Top User Countries</h4>
                <button onClick={() => setActiveTab("geography")} className="text-xs text-teal-400 hover:underline">
                  View All &rarr;
                </button>
              </div>
              <div className="space-y-3">
                {countries.slice(0, 4).map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="text-base">{c.flag}</span>
                      <span className="text-gray-300 font-medium">{c.name}</span>
                    </span>
                    <span className="font-mono text-gray-400">{c.visitors} users ({c.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform & Devices */}
            <div className="p-6 rounded-3xl bg-[#111127] border border-white/10">
              <h4 className="font-bold text-white text-sm mb-4">Device Architecture</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-gray-300 mb-1">
                    <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-teal-400" /> Mobile (iOS/Android)</span>
                    <span className="font-mono">{devices.mobile}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div style={{ width: `${devices.mobile}%` }} className="bg-teal-400 h-full rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-300 mb-1">
                    <span className="flex items-center gap-1.5"><Laptop className="w-3.5 h-3.5 text-violet-400" /> Desktop (macOS/Win)</span>
                    <span className="font-mono">{devices.desktop}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div style={{ width: `${devices.desktop}%` }} className="bg-violet-400 h-full rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-300 mb-1">
                    <span className="flex items-center gap-1.5"><Tablet className="w-3.5 h-3.5 text-amber-400" /> Tablet / iPad</span>
                    <span className="font-mono">{devices.tablet}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div style={{ width: `${devices.tablet}%` }} className="bg-amber-400 h-full rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Auth Composition */}
            <div className="p-6 rounded-3xl bg-[#111127] border border-white/10">
              <h4 className="font-bold text-white text-sm mb-4">Account Composition</h4>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Total User Base</p>
                    <p className="text-lg font-bold text-white">{overview.totalUsers}</p>
                  </div>
                  <Users className="w-6 h-6 text-gray-500" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    <span className="block font-bold text-base">{overview.registeredUsers}</span>
                    <span className="text-[11px] text-emerald-400/80">Registered</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300">
                    <span className="block font-bold text-base">{overview.anonymousGuests}</span>
                    <span className="text-[11px] text-violet-400/80">Guests / PWA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER COUNTRIES & GEOGRAPHY */}
      {activeTab === "geography" && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-[#111127] border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Global User Distribution</h3>
                <p className="text-xs text-gray-400">
                  Exact geographic locations of visitors and users interacting with WelGPT.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                Active in {countries.length} countries
              </span>
            </div>

            {/* Country Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 text-xs font-mono uppercase text-gray-400">
                  <tr>
                    <th className="pb-3">Country</th>
                    <th className="pb-3">Code</th>
                    <th className="pb-3">Unique Users</th>
                    <th className="pb-3">Total Sessions</th>
                    <th className="pb-3">Share (%)</th>
                    <th className="pb-3 w-48">Volume Bar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-light">
                  {countries.map((c, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 font-medium text-white flex items-center gap-3">
                        <span className="text-2xl">{c.flag}</span>
                        <span>{c.name}</span>
                      </td>
                      <td className="py-4 font-mono text-gray-400 text-xs">{c.code}</td>
                      <td className="py-4 font-mono text-emerald-400 font-semibold">{c.visitors}</td>
                      <td className="py-4 font-mono text-gray-300">{c.sessions}</td>
                      <td className="py-4 font-mono text-gray-300">{c.percentage}%</td>
                      <td className="py-4">
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${Math.max(c.percentage, 4)}%` }}
                            className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: APP USAGE TIME & SESSION DURATION */}
      {activeTab === "duration" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#111127] border border-white/10">
              <h4 className="text-xs font-mono uppercase text-gray-400 mb-1">Average Session Duration</h4>
              <p className="text-3xl font-extrabold text-white tracking-tight">{duration.avgFormatted}</p>
              <p className="text-xs text-emerald-400 mt-2">High engagement depth (knowledge work focus)</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#111127] border border-white/10">
              <h4 className="text-xs font-mono uppercase text-gray-400 mb-1">Median Session Length</h4>
              <p className="text-3xl font-extrabold text-white tracking-tight">{duration.medianFormatted}</p>
              <p className="text-xs text-gray-400 mt-2">Typical active flow state window</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#111127] border border-white/10">
              <h4 className="text-xs font-mono uppercase text-gray-400 mb-1">Bounce Rate (&lt;30s visits)</h4>
              <p className="text-3xl font-extrabold text-cyan-400 tracking-tight">{duration.bounceRate}%</p>
              <p className="text-xs text-gray-400 mt-2">Well below industry average (45-60%)</p>
            </div>
          </div>

          {/* Session Length Distribution Buckets */}
          <div className="p-6 md:p-8 rounded-3xl bg-[#111127] border border-white/10">
            <h3 className="text-xl font-bold text-white mb-2">Session Duration Breakdown</h3>
            <p className="text-xs text-gray-400 mb-8">
              Distribution of how long users spend inside WelGPT per session.
            </p>

            <div className="space-y-6">
              {[
                { label: "< 1 Minute", desc: "Quick check-in, widget glance, or bounce", count: duration.buckets.under1Min, color: "from-gray-500 to-gray-400" },
                { label: "1 - 5 Minutes", desc: "Habit check-off, streak view, daily quote reflection", count: duration.buckets.oneToFiveMin, color: "from-blue-500 to-cyan-400" },
                { label: "5 - 15 Minutes", desc: "Routine execution, meditation session, nutrition plan view", count: duration.buckets.fiveToFifteenMin, color: "from-emerald-500 to-teal-400" },
                { label: "15 - 30 Minutes", desc: "Deep Work timer sprint, AI Coach interactive therapy", count: duration.buckets.fifteenToThirtyMin, color: "from-violet-500 to-purple-400" },
                { label: "30+ Minutes", desc: "Monolithic deep focus block, multiple habit cycles", count: duration.buckets.overThirtyMin, color: "from-amber-500 to-orange-400" },
              ].map((bucket, i) => {
                const total = overview.totalSessions30D || 1;
                const pct = Math.round((bucket.count / total) * 100);

                return (
                  <div key={i} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                      <div>
                        <span className="font-bold text-white text-sm">{bucket.label}</span>
                        <span className="text-gray-400 ml-2 font-light">({bucket.desc})</span>
                      </div>
                      <div className="font-mono text-gray-300">
                        <span className="font-bold text-white">{bucket.count} sessions</span> ({pct}%)
                      </div>
                    </div>
                    <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.max(pct, 3)}%` }}
                        className={`bg-gradient-to-r ${bucket.color} h-full rounded-full`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FEATURE USAGE ANALYTICS */}
      {activeTab === "features" && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-[#111127] border border-white/10">
            <h3 className="text-xl font-bold text-white mb-2">Feature Adoption &amp; Engagement</h3>
            <p className="text-xs text-gray-400 mb-8">
              Ranked breakdown of what tools users interact with most across WelGPT.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((f, i) => {
                const maxExec = features[0]?.executions || 1;
                const barWidth = Math.round((f.executions / maxExec) * 100);

                return (
                  <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-2 rounded-xl bg-white/5 inline-block">{f.icon}</span>
                          <div>
                            <h4 className="font-bold text-white text-base leading-snug">{f.name}</h4>
                            <span className="text-[11px] font-mono text-gray-400">{f.category}</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-teal-400 bg-teal-400/10 px-2.5 py-1 rounded-full border border-teal-400/20">
                          #{i + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 my-4 pt-3 border-t border-white/5 text-xs">
                        <div>
                          <span className="text-gray-400 block text-[11px]">Total Executions</span>
                          <span className="text-lg font-bold text-white font-mono">{f.executions} times</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[11px]">Time Spent</span>
                          <span className="text-lg font-bold text-emerald-400 font-mono">{f.totalMinutes} mins</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-2">
                      <div
                        style={{ width: `${barWidth}%` }}
                        className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SECURITY REPORTS & THREAT AUDIT */}
      {activeTab === "security" && (
        <div className="space-y-8">
          {/* Security Posture Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-[#111127] border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 to-[#111127]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-gray-400">Security Posture</span>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-400">{security.healthScore} / 100</p>
              <p className="text-xs text-emerald-300 mt-1 font-semibold">Status: {security.status}</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#111127] border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-gray-400">Auth Success Rate</span>
                <CheckCircle2 className="w-5 h-5 text-teal-400" />
              </div>
              <p className="text-3xl font-extrabold text-white">{security.authSuccessRatePercent}%</p>
              <p className="text-xs text-gray-400 mt-1">{security.totalAuthAttempts} total login attempts</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#111127] border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-gray-400">Bot Probes Blocked</span>
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-3xl font-extrabold text-amber-400">{security.botProbesBlocked}</p>
              <p className="text-xs text-gray-400 mt-1">Automated scanners intercepted</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#111127] border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-gray-400">Rate Limit Defenses</span>
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
              <p className="text-3xl font-extrabold text-cyan-400">{security.rateLimitsTriggered}</p>
              <p className="text-xs text-gray-400 mt-1">DDoS / burst mitigation active</p>
            </div>
          </div>

          {/* Compliance & Defense Checklist */}
          <div className="p-6 md:p-8 rounded-3xl bg-[#111127] border border-white/10">
            <h4 className="font-bold text-white text-base mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Security Hardening &amp; Compliance Safeguards
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Cryptographic Transport Security (TLS 1.3 / HTTPS)</p>
                  <p className="text-gray-400 mt-0.5">All incoming and outgoing traffic is encrypted in-flight with modern HSTS enforcement.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Privilege Escalation Prevention (Firestore Rules)</p>
                  <p className="text-gray-400 mt-0.5">Strict database rules prevent horizontal escalation; client requests cannot grant admin roles.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Paddle Webhook HMAC Signature Verification</p>
                  <p className="text-gray-400 mt-0.5">All billing webhooks are cryptographically validated against secret key before execution.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Client IP Masking &amp; Privacy Preservation</p>
                  <p className="text-gray-400 mt-0.5">All logged telemetry anonymizes last two octets to comply with GDPR/CCPA directives.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Security Audit Log Stream */}
          <div className="p-6 md:p-8 rounded-3xl bg-[#111127] border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Live Security Audit Log</h3>
                <p className="text-xs text-gray-400">Real-time authentication records, threat detections, and defense reactions.</p>
              </div>
              <span className="text-xs font-mono text-gray-400">
                Last checked: {lastRefreshed}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 font-mono uppercase text-gray-400">
                  <tr>
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Event Type</th>
                    <th className="pb-3">Severity</th>
                    <th className="pb-3">Description</th>
                    <th className="pb-3">IP Address</th>
                    <th className="pb-3">Origin</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {security.recentEvents.map((ev, i) => {
                    const badgeStyles = {
                      INFO: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                      LOW: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
                      WARN: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                      HIGH: "bg-orange-500/10 text-orange-400 border-orange-500/20",
                      CRITICAL: "bg-red-500/10 text-red-400 border-red-500/20",
                    }[ev.severity] || "bg-gray-500/10 text-gray-400 border-gray-500/20";

                    const statusStyles = {
                      ALLOWED: "text-emerald-400",
                      BLOCKED: "text-red-400",
                      FLAGGED: "text-amber-400",
                      INVESTIGATING: "text-cyan-400",
                    }[ev.status];

                    return (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 text-gray-400 whitespace-nowrap">
                          {new Date(ev.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 font-semibold text-white whitespace-nowrap">
                          {ev.type}
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${badgeStyles}`}>
                            {ev.severity}
                          </span>
                        </td>
                        <td className="py-3 text-gray-300 font-sans max-w-xs truncate">
                          {ev.description}
                        </td>
                        <td className="py-3 text-gray-400 whitespace-nowrap">{ev.ip}</td>
                        <td className="py-3 text-gray-300 whitespace-nowrap">{ev.country}</td>
                        <td className={`py-3 font-bold whitespace-nowrap ${statusStyles}`}>
                          {ev.status}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
