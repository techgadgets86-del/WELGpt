"use client";

import { motion } from "framer-motion";
import { Utensils, Activity, Waves, Sparkles, Leaf, Headphones } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ExploreHub() {
  const router = useRouter();

  const tools = [
    { icon: Utensils, label: "Nutrition", desc: "AI generated meal protocols", href: "/nutrition", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { icon: Activity, label: "Training", desc: "Sensei gamified workouts", href: "/sensei", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { icon: Waves, label: "Meditation", desc: "Find your center", href: "/meditation", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { icon: Leaf, label: "Detox Reset", desc: "Dopamine fasting tracker", href: "/detox", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { icon: Sparkles, label: "Inspiration", desc: "Daily philosophy & quotes", href: "/inspiration", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { icon: Headphones, label: "Soundscapes", desc: "Binaural & nature sounds", href: "/meditation", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  ];

  return (
    <div className="max-w-5xl mx-auto relative z-10 pt-4 pb-20 h-full flex flex-col">
      <header className="mb-10">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white"
        >
          Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-teal-400">WelGPT.</span>
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl"
        >
          Access all specialized neuroscience and wellness modules.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(tool.href)}
              className={`flex flex-col items-start p-6 rounded-3xl bg-[#111127] border \${tool.border} text-left group hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all`}
            >
              <div className={`p-4 rounded-2xl \${tool.bg} \${tool.color} mb-4 transition-transform group-hover:scale-110`}>
                <Icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{tool.label}</h3>
              <p className="text-gray-400 text-sm">{tool.desc}</p>
            </motion.button>
          )
        })}
      </div>
    </div>
  );
}
