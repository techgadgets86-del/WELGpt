"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import MindfulBreathing from "@/components/MindfulBreathing";
import { useAuth } from "@/lib/AuthContext";
import { isOfficialAdminEmail } from "@/lib/adminAuth";

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = isOfficialAdminEmail(user?.email);

  return (
    <div className="max-w-6xl mx-auto relative z-10 pt-4  min-h-full flex pb-[160px] md:pb-12 flex-col">
      <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white"
        >
          Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Progress.</span>
        </motion.h1>

        {isAdmin && (
          <Link
            href="/analytics"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-colors w-fit"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>WelGPT Analytics &amp; SOC</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
           <AnalyticsDashboard />
        </div>
        <div className="lg:col-span-1">
           <MindfulBreathing />
        </div>
      </div>
    </div>
  );
}
