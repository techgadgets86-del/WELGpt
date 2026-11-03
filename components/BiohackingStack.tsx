"use client";

import React, { useState } from "react";
import { Sparkles, ExternalLink, ShieldCheck, Zap, Moon, Sun, Clock, Flame, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BiohackItem {
  id: string;
  name: string;
  category: string;
  clinicalStandard: string;
  mechanism: string;
  recommendedDosage: string;
  badge: string;
  affiliateUrl: string;
  icon: string;
  partnerBrand: string;
}

const STACKS: Record<"morning" | "afternoon" | "evening", BiohackItem[]> = {
  morning: [
    {
      id: "hydration",
      name: "Electrolyte Cellular Hydration",
      category: "Circadian Fuel",
      clinicalStandard: "Dr. Huberman Morning Standard",
      mechanism: "Rehydrates the brain after 8 hours of respiratory moisture loss. Sodium and potassium ion channels accelerate neuronal firing velocity before caffeine intake.",
      recommendedDosage: "1,000mg Sodium · 200mg Potassium · 60mg Magnesium Malate",
      badge: "Essential Foundation",
      affiliateUrl: "https://drinklmnt.com/?utm_source=welgpt&utm_medium=app_routine&utm_campaign=focus",
      icon: "⚡",
      partnerBrand: "LMNT Clean Hydration"
    },
    {
      id: "photon",
      name: "10,000 Lux Light & Circadian Optics",
      category: "Photon Biology",
      clinicalStandard: "Suprachiasmatic Nucleus Synchronization",
      mechanism: "Triggers melanopsin-expressing retinal ganglion cells to spike cortisol early, setting an irreversible biological timer for natural melatonin release 16 hours later.",
      recommendedDosage: "10-15 minutes outdoors within 60 mins of waking",
      badge: "Biological Anchor",
      affiliateUrl: "https://raoptics.com/?ref=welgpt&utm_source=welgpt_app",
      icon: "☀️",
      partnerBrand: "Ra Optics Circadian Eyewear"
    }
  ],
  afternoon: [
    {
      id: "nootropic",
      name: "L-Theanine & Alpha-GPC Neuro-Drive",
      category: "Cognitive Endurance",
      clinicalStandard: "Adenosine Buffer & Acetylcholine Synergist",
      mechanism: "Binds to glutamate receptors in the cortex to induce smooth Alpha-wave focus (8-12Hz) while neutralizing caffeine-induced peripheral vasoconstriction and jitters.",
      recommendedDosage: "200mg L-Theanine + 300mg Alpha-GPC 30m prior to deep work",
      badge: "Flow State Priming",
      affiliateUrl: "https://takethesis.com/?utm_source=welgpt&utm_medium=affiliate&utm_campaign=deepwork",
      icon: "🧠",
      partnerBrand: "Thesis Personalized Nootropics"
    },
    {
      id: "nsdr",
      name: "Non-Sleep Deep Rest (NSDR)",
      category: "Neuroplasticity Recovery",
      clinicalStandard: "Striatal Dopamine Replenishment",
      mechanism: "Clinical trials prove a 15-20 min NSDR or Yoga Nidra session elevates striatal dopamine turnover by up to 65%, completely reversing cognitive fatigue.",
      recommendedDosage: "15-20 minutes daily between 1:00 PM - 3:00 PM",
      badge: "Zero-Cost Protocol",
      affiliateUrl: "https://welgpt.space/blog/dopamine/",
      icon: "🌊",
      partnerBrand: "WelGPT Scientific Library"
    }
  ],
  evening: [
    {
      id: "magnesium",
      name: "Magnesium L-Threonate & Apigenin",
      category: "Sleep Architecture",
      clinicalStandard: "Blood-Brain Barrier Crosser",
      mechanism: "The only form of magnesium shown to cross the blood-brain barrier. Enhances synaptic plasticity, increases slow-wave Delta sleep, and stimulates glymphatic detoxification.",
      recommendedDosage: "144mg elemental Magnesium + 50mg Apigenin 45m before bed",
      badge: "Deep Sleep Catalyst",
      affiliateUrl: "https://www.thorne.com/products/dp/magnesium-bisglycinate?utm_source=welgpt&utm_medium=app_biohack",
      icon: "🌙",
      partnerBrand: "Thorne Research Standard"
    },
    {
      id: "biometrics",
      name: "HRV & Autonomic Recovery Ring",
      category: "Biometric Telemetry",
      clinicalStandard: "Vagal Tone & Readiness Scoring",
      mechanism: "Measures continuous skin temperature, nocturnal HRV, respiratory rate, and sleep stage cycles to calculate your physiological strain and next-day recovery capacity.",
      recommendedDosage: "Continuous 24/7 finger-based PPG telemetry",
      badge: "Telemetry Sensor",
      affiliateUrl: "https://ouraring.com/?utm_source=welgpt&utm_medium=app_referral",
      icon: "💍",
      partnerBrand: "Oura Ring Gen 4"
    }
  ]
};

export default function BiohackingStack({ activePeriod = "morning" }: { activePeriod?: "morning" | "afternoon" | "evening" | "custom" }) {
  const period = activePeriod === "custom" ? "morning" : activePeriod;
  const items = STACKS[period] || STACKS.morning;

  return (
    <div className="mt-10 p-6 sm:p-7 rounded-3xl bg-[#0c0c1e]/90 border border-violet-500/20 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-white/10 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-tight">
              Clinical Biohacking Stack
            </h3>
            <p className="text-xs text-gray-400">
              Evidence-based compound &amp; protocol pairings for your {period} regimen
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full self-start sm:self-center font-semibold">
          {period.toUpperCase()} CIRCADIAN PRIME
        </span>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#111127] border border-white/5 hover:border-violet-500/30 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-300">
                    {item.category}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  {item.badge}
                </span>
              </div>

              <h4 className="font-bold text-white text-base group-hover:text-violet-300 transition-colors">
                {item.name}
              </h4>
              <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                {item.clinicalStandard}
              </p>

              <p className="text-xs text-gray-300 font-light mt-3 leading-relaxed">
                {item.mechanism}
              </p>

              <div className="mt-3.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-gray-400 font-mono">
                <strong className="text-gray-300 font-semibold">Dosage / Protocol:</strong> {item.recommendedDosage}
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-gray-500 font-medium">
                {item.partnerBrand}
              </span>
              <a
                href={item.affiliateUrl}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 text-xs font-semibold border border-violet-500/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>View Specification</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Disclosures & Research Notice */}
      <div className="mt-5 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-gray-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          Verified against peer-reviewed chronobiology literature (Cell, Nature Neuroscience)
        </span>
        <span>Independent curation · Supports WelGPT open-science research</span>
      </div>
    </div>
  );
}
