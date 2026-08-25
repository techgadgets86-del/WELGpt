"use client";

import { motion } from "framer-motion";
import { MagicCard } from "@/components/ui/magic-card";
import { Marquee } from "@/components/ui/marquee";
import { useRouter } from "next/navigation";

export default function DetoxHub() {
  const router = useRouter();

  const protocols = [
    { icon: "📱", title: "Dopamine Detox", desc: "Reset your dopamine loops by unplugging.", prompt: "I'd like to do a dopamine detox." },
    { icon: "🥤", title: "3-Day Juice Cleanse", desc: "Flood your system with micronutrients.", prompt: "Please provide me with a comprehensive 3-Day Juice Cleanse protocol to flood my system with micronutrients and reset my digestion." },
    { icon: "🔥", title: "Heavy Metal Sweep", desc: "Niacin flush and sauna protocol.", prompt: "Walk me through the Heavy Metal Sweep protocol, including the Niacin flush and sauna timing guidelines." },
    { icon: "🦠", title: "Microbiome Reset", desc: "Clear out bad bacteria and repopulate the gut.", prompt: "I want to initiate a Microbiome Reset. How do I clear out bad gut bacteria and repopulate my gut flora?" },
  ];

  const benefits = [
    { icon: "🧠", title: "Mental Clarity", desc: "Eliminate brain fog." },
    { icon: "⚡", title: "Energy Spike", desc: "Awaken your natural vitality." },
    { icon: "😴", title: "Deep Sleep", desc: "Restore circadian rhythms." },
    { icon: "🧬", title: "Cellular Repair", desc: "Trigger autophagy & renewal." },
    { icon: "😌", title: "Stress Relief", desc: "Lower cortisol levels." },
  ];

  return (
    <div className="max-w-5xl mx-auto relative z-10 pt-4 h-full flex flex-col">
      <header className="mb-12">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white"
        >
          Dopamine <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Detox.</span>
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl"
        >
          Reset your focus and reclaim your attention span.
        </motion.p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-6">Detox Protocols</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {protocols.map((protocol, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer h-full"
              onClick={() => router.push(`/coach?prompt=${encodeURIComponent(protocol.prompt)}`)}
            >
              <MagicCard gradientColor="#2dd4bf" gradientTo="#10b981" gradientOpacity={0.15}>
                <div className="text-4xl mb-4 drop-shadow-md">{protocol.icon}</div>
                <h3 className="text-lg font-medium text-white mb-2">{protocol.title}</h3>
                <p className="text-gray-400 text-sm">{protocol.desc}</p>
              </MagicCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-8 pb-12">
        <h2 className="text-2xl font-semibold text-white mb-6">Benefits of Detoxification</h2>
        <div className="relative border border-white/10 rounded-3xl bg-[#111127]/50 overflow-hidden py-8">
          {/* Gradient Masks for Marquee */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#111127] z-10"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#111127] z-10"></div>
          
          <Marquee pauseOnHover className="[--duration:20s]">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center min-w-[200px] p-6 rounded-2xl bg-white/5 border border-white/10 mx-4">
                <div className="text-3xl mb-3">{benefit.icon}</div>
                <h4 className="text-white font-medium mb-1">{benefit.title}</h4>
                <p className="text-gray-400 text-sm text-center">{benefit.desc}</p>
              </div>
            ))}
          </Marquee>
        </div>
      </section>
    </div>
  );
}
