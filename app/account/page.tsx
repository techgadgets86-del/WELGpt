"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { CreditCard, ExternalLink, ShieldCheck, Zap, AlertCircle, ArrowRight, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { user, profile, loading } = useAuth();
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleOpenCustomerPortal = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setIsOpeningPortal(true);
      setErrorMessage(null);

      const token = await user.getIdToken();
      const res = await fetch("/api/customer-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.noCustomer) {
          setErrorMessage("No active billing account found. Choose a plan to unlock premium features.");
        } else {
          setErrorMessage(data.error || "Failed to load customer portal. Please try again.");
        }
        setIsOpeningPortal(false);
        return;
      }

      if (data.url) {
        // Redirect directly to the Paddle-hosted Customer Portal
        window.location.href = data.url;
      } else {
        throw new Error("No portal URL returned.");
      }
    } catch (err) {
      console.error("Portal redirect error:", err);
      setErrorMessage("Network error opening billing portal. Please try again.");
      setIsOpeningPortal(false);
    }
  };

  const isPremium = profile?.isPremium;
  const status = profile?.subscriptionStatus || (isPremium ? "active" : "free");

  return (
    <div className="max-w-4xl mx-auto relative z-10 pt-4 min-h-full flex pb-[160px] md:pb-12 flex-col px-4">
      <header className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-3 tracking-tight text-white"
        >
          Account & <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Billing.</span>
        </motion.h1>
        <p className="text-gray-400 text-sm md:text-base">
          Manage your membership tier, self-service billing, payment methods, and invoices.
        </p>
      </header>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <Link
            href="/pricing"
            className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-200 text-xs font-semibold hover:bg-red-500/30 transition shrink-0"
          >
            View Plans
          </Link>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Account Overview */}
        <div className="md:col-span-2 bg-[#111127] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                <ShieldCheck size={16} /> Verified Account
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  isPremium
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-white/10 text-gray-300"
                }`}
              >
                {isPremium ? `● ${status.toUpperCase()}` : "FREE PLAN"}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">
              {user?.displayName || "Wellness Seeker"}
            </h2>
            <p className="text-gray-400 text-sm mb-6">{user?.email}</p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="bg-white/5 p-4 rounded-2xl">
                <div className="text-xs text-gray-400 mb-1">AI Chat Tokens</div>
                <div className="text-xl font-bold text-white flex items-center gap-1.5">
                  <Zap size={18} className="text-violet-400" />
                  {profile?.aiChatTokens ?? (isPremium ? 9999 : 5)}
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl">
                <div className="text-xs text-gray-400 mb-1">Daily Plan Tokens</div>
                <div className="text-xl font-bold text-white flex items-center gap-1.5">
                  <Sparkles size={18} className="text-teal-400" />
                  {profile?.aiPlanTokens ?? (isPremium ? 999 : 3)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {isPremium ? (
              <button
                onClick={handleOpenCustomerPortal}
                disabled={isOpeningPortal || loading}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold transition shadow-lg shadow-violet-500/25 disabled:opacity-50"
              >
                {isOpeningPortal ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Connecting to Paddle Portal...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Manage Subscription & Invoices
                    <ExternalLink size={14} className="opacity-75" />
                  </>
                )}
              </button>
            ) : (
              <Link
                href="/pricing"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold transition shadow-lg shadow-violet-500/25"
              >
                Upgrade to Premium
                <ArrowRight size={18} />
              </Link>
            )}

            <Link
              href="/profile"
              className="px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition text-sm font-semibold flex items-center"
            >
              Back to Profile
            </Link>
          </div>
        </div>

        {/* Self-Service Portal Info */}
        <div className="bg-[#111127] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <CreditCard size={20} className="text-violet-400" />
              Paddle Self-Service
            </h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              All subscription management is powered securely by Paddle. You can perform the following actions 24/7 without waiting for support:
            </p>

            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Update debit/credit cards or PayPal</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Download VAT / tax invoices & receipts</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Pause, resume, or cancel subscription anytime</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Switch between Monthly and Yearly cycles</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 text-[11px] text-gray-500">
            Transactions processed securely by Paddle.com.
          </div>
        </div>
      </div>
    </div>
  );
}
