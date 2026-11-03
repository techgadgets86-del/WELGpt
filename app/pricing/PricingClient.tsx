"use client";

import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Zap, Shield, ArrowRight, Loader2, Building2, Printer, FileCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { getPaddle } from "@/lib/paddle/client";
import { TIERS, Tier } from "@/lib/paddle/tiers";
import { useAuth } from "@/lib/AuthContext";
import type { PricePreviewParams, PricePreviewResponse } from "@paddle/paddle-js";

interface PricingClientProps {
  initialCountry?: string;
}

export default function PricingClient({ initialCountry }: PricingClientProps) {
  const [billingCycle, setBillingCycle] = useState<"month" | "year">("month");
  const [pricesByPriceId, setPricesByPriceId] = useState<Record<string, string>>({});
  const [currencyCode, setCurrencyCode] = useState<string>("");
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [subscribingTier, setSubscribingTier] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string>("");
  const [pricingMode, setPricingMode] = useState<"individual" | "corporate">("individual");
  const [, startTransition] = useTransition();

  const { user } = useAuth();
  const router = useRouter();

  const handlePrintExpenseLetter = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>WelGPT Corporate Reimbursement & Pre-Approval Receipt</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #fff; color: #111; line-height: 1.6; margin: 0; padding: 40px; }
          .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
          .badge { background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 12px; }
          .meta-table { width: 100%; border-collapse: collapse; margin: 25px 0; }
          .meta-table td { padding: 10px; border: 1px solid #e2e8f0; font-size: 13px; }
          .meta-label { font-weight: 700; width: 220px; background: #f8fafc; color: #475569; }
          .letter { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin: 25px 0; font-size: 13px; line-height: 1.7; }
          h2 { color: #0f172a; margin-top: 30px; font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #cbd5e1; font-size: 12px; color: #64748b; text-align: center; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 style="margin:0; font-size: 26px;">WELGPT CORPORATE EXPENSE RECEIPT & PRE-APPROVAL</h1>
            <p style="margin:4px 0 0; color: #64748b; font-size: 13px;">Cognitive Ergonomics & Enterprise Focus Software</p>
          </div>
          <div style="text-align:right;">
            <span class="badge">STIPEND REIMBURSABLE</span>
            <p style="margin:4px 0 0; font-size: 12px; font-family: monospace;">EXPENSE REF: WGC-CORP-${Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
          </div>
        </div>

        <table class="meta-table">
          <tr>
            <td class="meta-label">Software Vendor</td>
            <td>WelGPT Cognitive Systems (Paddle Merchant of Record)</td>
          </tr>
          <tr>
            <td class="meta-label">Software Classification</td>
            <td>Applied Cognitive Ergonomics, Deep-Work Time Blocking &amp; Stress Management Software</td>
          </tr>
          <tr>
            <td class="meta-label">Eligible Expense Categories</td>
            <td>Employee Wellness Stipend / L&amp;D Stipend / Productivity Software / Mental Health &amp; Ergonomics</td>
          </tr>
          <tr>
            <td class="meta-label">Standard Annual Fee</td>
            <td><strong>$99.00 USD / Year</strong> (Annual Single-Seat Professional License)</td>
          </tr>
          <tr>
            <td class="meta-label">Employee / Licensee</td>
            <td>${user?.displayName || user?.email || "Corporate Team Member"}</td>
          </tr>
          <tr>
            <td class="meta-label">Date Generated</td>
            <td>${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>
          </tr>
        </table>

        <h2>Corporate Justification & Business ROI</h2>
        <div class="letter">
          <p><strong>To:</strong> Accounts Payable / People &amp; Culture / Finance Department</p>
          <p><strong>Subject:</strong> Software Stipend Reimbursement Pre-Approval for WelGPT</p>
          <p>I am requesting reimbursement for an annual professional license to <strong>WelGPT</strong> under our organization's Employee Wellness, Productivity, or Learning &amp; Development software allowance.</p>
          <p><strong>Business Impact &amp; ROI:</strong></p>
          <ul>
            <li><strong>Reclaims 2.8+ Focus Hours/Day:</strong> Enforces structured 90-minute ultradian deep-work blocks, eliminating distraction triggers during critical development/strategic tasks.</li>
            <li><strong>Reduces Task-Switching Cognitive Fatigue:</strong> Implements science-backed non-sleep deep rest (NSDR) intervals and digital sunsets to mitigate employee burnout.</li>
            <li><strong>Habit Execution &amp; Mental Energy:</strong> Tracks bio-synchronous routines (sleep architecture, hydration, circadian sunlight) to sustain baseline cognitive endurance across high-intensity sprints.</li>
          </ul>
          <p>Payment is processed securely via corporate credit card with itemized VAT/Tax receipts issued upon purchase.</p>
        </div>

        <div class="footer">
          <p>© 2026 WelGPT Applied Cognitive Systems · Accepted by Expensify, Brex, Ramp, and Corporate Amex · Questions: support@welgpt.space</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Capture affiliate / creator referral code
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get("ref") || localStorage.getItem("welgpt_ref") || "";
      if (ref) {
        setReferralCode(ref);
        localStorage.setItem("welgpt_ref", ref);
      }
    }
  }, []);

  // Fetch country-localized prices from Paddle
  useEffect(() => {
    let isMounted = true;

    async function loadPrices() {
      setIsLoadingPrices(true);
      setPriceError(null);

      try {
        const paddle = await getPaddle();
        if (!paddle) {
          throw new Error("Unable to initialize Paddle.");
        }

        // Collect all unique price IDs across tiers (for both monthly and yearly)
        const priceIds = new Set<string>();
        TIERS.forEach((tier) => {
          if (tier.priceId.month) priceIds.add(tier.priceId.month);
          if (tier.priceId.year) priceIds.add(tier.priceId.year);
        });

        const itemsToPreview = Array.from(priceIds).map((id) => ({
          priceId: id,
          quantity: 1,
        }));

        // Build parameters for PricePreview:
        // If initialCountry is provided, pass address.countryCode.
        // If absent, omit countryCode so Paddle auto-detects from the visitor's IP!
        const previewParams: PricePreviewParams = {
          items: itemsToPreview,
          ...(initialCountry
            ? {
                address: {
                  countryCode: initialCountry,
                },
              }
            : {}),
        };

        const response: PricePreviewResponse = await paddle.PricePreview(previewParams);

        if (!isMounted) return;

        // Map formattedTotals.total directly from Paddle response.
        // Note: No client-side price math, no custom formatting, no Intl.NumberFormat!
        const priceMap: Record<string, string> = {};
        response.data.details.lineItems.forEach((lineItem) => {
          if (lineItem.price?.id && lineItem.formattedTotals?.total) {
            priceMap[lineItem.price.id] = lineItem.formattedTotals.total;
          }
        });

        startTransition(() => {
          setPricesByPriceId(priceMap);
          if (response.data.currencyCode) {
            setCurrencyCode(response.data.currencyCode);
          }
          setIsLoadingPrices(false);
        });
      } catch (err: unknown) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : "Failed to load pricing.";
        console.error("Paddle PricePreview error:", err);
        setPriceError(message);
        setIsLoadingPrices(false);
      }
    }

    loadPrices();

    return () => {
      isMounted = false;
    };
  }, [initialCountry]);

  // Open Paddle Checkout as an overlay with one-page variant
  const handleSubscribe = async (tier: Tier) => {
    if (tier.isFree) {
      router.push(user ? "/dashboard" : "/login");
      return;
    }

    const selectedPriceId = tier.priceId[billingCycle];
    if (!selectedPriceId) {
      alert("Selected plan price ID is not configured.");
      return;
    }

    setSubscribingTier(tier.name);

    try {
      const paddle = await getPaddle();
      if (!paddle || !paddle.Initialized) {
        alert("Payment system is still initializing. Please try again in a few moments.");
        setSubscribingTier(null);
        return;
      }

      const storedRef = referralCode || (typeof window !== "undefined" ? localStorage.getItem("welgpt_ref") || "" : "");

      // Open Paddle Checkout with required settings
      paddle.Checkout.open({
        settings: {
          displayMode: "overlay",
          variant: "one-page",
          theme: "dark",
          successUrl: `${window.location.origin}/welcome`,
        },
        items: [
          {
            priceId: selectedPriceId,
            quantity: 1,
          },
        ],
        customer: user?.email ? { email: user.email } : undefined,
        customData: storedRef ? { referral: storedRef } : undefined,
      });
    } catch (err: unknown) {
      console.error("Paddle Checkout open error:", err);
      alert("Could not launch checkout. Please refresh and try again.");
    } finally {
      setSubscribingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-base-100)] text-white pt-24 pb-28 px-4 sm:px-6 relative selection:bg-teal-400 selection:text-black">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-teal-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-40 right-10 w-[400px] h-[300px] bg-purple-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Country-Localized Pricing</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight mb-5 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70"
          >
            Choose Your Protocol
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-white/60 font-light"
          >
            Rewire your habits, eliminate digital fatigue, and execute at your peak.
            Switch plans or cancel at any time.
          </motion.p>

          {/* Individual vs. Corporate Stipend Mode */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setPricingMode("individual")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                pricingMode === "individual"
                  ? "bg-white/15 text-white border border-white/30 shadow-lg"
                  : "bg-white/5 text-white/50 hover:text-white border border-transparent"
              }`}
            >
              <span>👤 Individual Protocol</span>
            </button>
            <button
              onClick={() => {
                setPricingMode("corporate");
                setBillingCycle("year");
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                pricingMode === "corporate"
                  ? "bg-gradient-to-r from-teal-500/30 to-violet-500/30 text-teal-300 border border-teal-400/50 shadow-lg shadow-teal-500/10"
                  : "bg-white/5 text-white/50 hover:text-white border border-transparent"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-teal-400" />
              <span>🏢 Company Stipend &amp; Teams</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 font-bold">
                Expensable
              </span>
            </button>
          </div>

          {/* Corporate Stipend Banner */}
          {pricingMode === "corporate" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-teal-950/40 via-[#111127] to-violet-950/30 border border-teal-500/30 text-left max-w-2xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileCheck className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                    100% Corporate Reimbursable
                  </span>
                </div>
                <p className="text-xs text-white/70 font-light leading-relaxed">
                  Most employers provide a $500–$1,500 annual Wellness &amp; L&amp;D stipend. WelGPT is pre-formatted for 1-click reimbursement on Expensify, Ramp, and Brex.
                </p>
              </div>

              <button
                onClick={handlePrintExpenseLetter}
                className="px-4 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-black font-bold text-xs uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 transition-all shadow-md shrink-0 active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Pre-Approval PDF</span>
              </button>
            </motion.div>
          )}

          {/* Monthly / Yearly Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 inline-flex items-center p-1.5 rounded-full bg-white/5 border border-white/10"
          >
            <button
              onClick={() => setBillingCycle("month")}
              className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                billingCycle === "month"
                  ? "bg-white text-black shadow-lg"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("year")}
              className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                billingCycle === "year"
                  ? "bg-teal-400 text-black shadow-lg"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <span>Yearly</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/20 text-black">
                Save 20%
              </span>
            </button>
          </motion.div>

          {currencyCode && (
            <p className="text-xs text-white/40 mt-3 font-mono">
              Prices displayed in {currencyCode}
            </p>
          )}

          {priceError && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
              {priceError}
            </div>
          )}
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch mb-20">
          {TIERS.map((tier, idx) => {
            const activePriceId = tier.priceId[billingCycle];
            const displayPrice = pricesByPriceId[activePriceId];
            const isSubscribing = subscribingTier === tier.name;

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (idx + 1) }}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 border ${
                  tier.popular
                    ? "bg-gradient-to-b from-teal-950/40 via-[#111127] to-[#0d0d1e] border-teal-400/40 shadow-[0_0_40px_rgba(45,212,191,0.12)] scale-[1.02]"
                    : "bg-[#0f0f1d]/80 border-white/10 hover:border-white/20"
                }`}
              >
                {/* Popular Badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full ${
                        tier.popular
                          ? "bg-teal-400 text-black shadow-md"
                          : "bg-white/10 text-white/90 border border-white/20"
                      }`}
                    >
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed font-light min-h-[40px]">
                      {tier.description}
                    </p>
                  </div>

                  {/* Price display */}
                  <div className="mb-8 pt-4 border-t border-white/5">
                    {tier.isFree ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-white tracking-tight">
                          $0
                        </span>
                        <span className="text-sm text-white/50 font-medium">
                          / forever
                        </span>
                      </div>
                    ) : isLoadingPrices ? (
                      <div className="flex items-center gap-2 text-white/40 h-10">
                        <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                        <span className="text-xs font-mono">Loading local price...</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-white tracking-tight">
                          {displayPrice || "—"}
                        </span>
                        <span className="text-sm text-white/50 font-medium">
                          / {billingCycle === "month" ? "month" : "year"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3.5 mb-8 text-sm text-white/70 font-light">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                            tier.popular
                              ? "bg-teal-400/20 text-teal-300"
                              : "bg-white/10 text-white/70"
                          }`}
                        >
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Subscribe Button */}
                <button
                  onClick={() => handleSubscribe(tier)}
                  disabled={!tier.isFree && (isSubscribing || isLoadingPrices)}
                  className={`w-full py-4 rounded-2xl font-semibold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    tier.popular
                      ? "bg-teal-400 hover:bg-teal-300 text-black shadow-lg shadow-teal-500/20 hover:scale-[1.02]"
                      : "bg-white/10 hover:bg-white text-white hover:text-black border border-white/10"
                  }`}
                >
                  {isSubscribing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Opening Checkout...</span>
                    </>
                  ) : (
                    <>
                      <span>{tier.buttonText || (tier.isFree ? "Start Free" : "Go Premium")}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Reassurance Banner */}
        <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <Shield className="w-8 h-8 text-teal-400 shrink-0" />
            <div>
              <h4 className="font-bold text-white text-base">30-Day Money-Back Guarantee</h4>
              <p className="text-white/50 text-xs">
                Try WelGPT risk-free. If you don't feel a measurable increase in your focus and habit consistency, we issue a full refund—no questions asked.
              </p>
            </div>
          </div>
          <div className="text-xs text-white/40 font-mono">
            Secured by Paddle • Encrypted 256-bit SSL
          </div>
        </div>
      </div>
    </div>
  );
}
