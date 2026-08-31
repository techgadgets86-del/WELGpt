"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, Play, Square, Droplets, Waves, TreePine, Activity } from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { Marquee } from "@/components/ui/marquee";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAudioFrequencies } from "@/lib/useAudioFrequencies";
import { useAuth } from "@/lib/AuthContext";

export default function WelGPTDashboard() {
  const router = useRouter();
  const { playingId, toggleSound } = useAudioFrequencies();
  const { logActivity } = useAuth();

  const chunks = [
    { icon: "🌙", title: "Melatonin Boost", desc: "5 mins · 4-7-8 Breathing Method" },
    { icon: "🧠", title: "Brain Freshness", desc: "5 mins · Alternate Nostril Breathing" },
    { icon: "⚡", title: "Vagus Nerve Reset", desc: "5 mins · Reduce stress, increase clarity" }
  ];

  const soundscapes = [
    { id: "noise-brown", type: "noise", value: "brown", icon: <Droplets size={24} />, title: "Gentle Rain", desc: "15 mins" },
    { id: "noise-pink", type: "noise", value: "pink", icon: <Waves size={24} />, title: "Ocean Waves", desc: "30 mins" },
    { id: "noise-white", type: "noise", value: "white", icon: <TreePine size={24} />, title: "Deep Forest", desc: "45 mins" }
  ];

  const frequencies = [
    { id: "osc-432", type: "oscillator", value: 432, freq: "432Hz", title: "Healing", desc: "Continuous" },
    { id: "osc-528", type: "oscillator", value: 528, freq: "528Hz", title: "Repair", desc: "Deep sleep" },
    { id: "bin-40", type: "binaural", value: 40, freq: "40Hz", title: "Focus", desc: "Binaural beat" },
    { id: "osc-174", type: "oscillator", value: 174, freq: "174Hz", title: "Relief", desc: "Pain management" },
    { id: "osc-285", type: "oscillator", value: 285, freq: "285Hz", title: "Healing", desc: "Tissue & organs" },
    { id: "osc-396", type: "oscillator", value: 396, freq: "396Hz", title: "Courage", desc: "Liberate fear" },
    { id: "osc-417", type: "oscillator", value: 417, freq: "417Hz", title: "Change", desc: "Clear negativity" },
    { id: "osc-639", type: "oscillator", value: 639, freq: "639Hz", title: "Harmony", desc: "Relationships" },
    { id: "osc-741", type: "oscillator", value: 741, freq: "741Hz", title: "Intuition", desc: "Awaken clarity" },
    { id: "osc-852", type: "oscillator", value: 852, freq: "852Hz", title: "Spirit", desc: "Spiritual order" },
    { id: "osc-963", type: "oscillator", value: 963, freq: "963Hz", title: "Divine", desc: "Highest frequency" },
    { id: "osc-111", type: "oscillator", value: 111, freq: "111Hz", title: "Joy", desc: "Endorphin release" }
  ];

  const research = [
    { icon: "🔬", title: "Binaural Beats (FFR)", desc: "Frequency Following Response induces targeted brainwave states." },
    { icon: "🧬", title: "528 Hz DNA Repair", desc: "Studies suggest 528Hz may reduce stress biomarkers." },
    { icon: "🫀", title: "432 Hz Relaxation", desc: "Clinical trials show 432Hz lowers heart rate and blood pressure." },
    { icon: "🧠", title: "40 Hz Gamma Waves", desc: "Linked to increased focus and potential memory enhancement." },
  ];

  return (
    <div className="max-w-6xl mx-auto relative z-10 pt-4 pb-20">
      <header className="mb-12">
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
        >
          <Image src="/logo-icon.png" alt="WelGPT" width={48} height={48} className="object-contain" priority />
        </motion.div>
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
        >
          Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-teal-400">center.</span>
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl"
        >
            Curated routines, sounds, and exercises for every stage of life.
        </motion.p>
      </header>

      {/* 5-Minute Targeted Chunks */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-6">5-Minute Targeted Chunks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {chunks.map((chunk, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer h-full"
              onClick={() => router.push(`/coach?prompt=I would like to start the ${chunk.title} chunk.`)}
            >
              <MagicCard gradientColor="#8b5cf6" gradientOpacity={0.15}>
                <div className="text-3xl mb-3">{chunk.icon}</div>
                <h3 className="text-lg font-medium text-white mb-1">{chunk.title}</h3>
                <p className="text-gray-400 text-sm">{chunk.desc}</p>
              </MagicCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Nature Soundscapes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-6">Nature Soundscapes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {soundscapes.map((sound, idx) => {
            const isPlaying = playingId === sound.id;
            return (
              <motion.button 
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleSound(sound.id, sound.type as "oscillator" | "binaural" | "noise", sound.value)}
                className={`border rounded-2xl p-6 flex items-center justify-between group transition-all text-left ${
                  isPlaying 
                    ? "bg-teal-500/20 border-teal-500/50 shadow-[0_0_20px_rgba(45,212,191,0.2)]" 
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full transition-colors ${
                    isPlaying ? "bg-teal-500 text-white" : "bg-teal-500/10 text-teal-400 group-hover:bg-teal-500 group-hover:text-white"
                  }`}>
                    {sound.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{sound.title}</h3>
                    <p className={isPlaying ? "text-teal-200 text-sm" : "text-gray-400 text-sm"}>{sound.desc}</p>
                  </div>
                </div>
                {isPlaying ? (
                  <Square className="text-teal-400 fill-teal-400" size={20} />
                ) : (
                  <Play className="text-gray-500 group-hover:text-white transition-colors" size={20} />
                )}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Ambient Frequencies Library Shelf */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          Ambient Frequencies <span className="text-sm font-normal text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">Library</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6 bg-[#0a0a1a]/50 rounded-3xl border border-white/5 shadow-inner">
          {frequencies.map((freq, idx) => {
            const isPlaying = playingId === freq.id;
            return (
              <motion.div
                key={freq.id}
                layout
                initial={{ scale: 1 }}
                animate={{ 
                  scale: isPlaying ? 1.1 : 1,
                  zIndex: isPlaying ? 50 : 1,
                  y: isPlaying ? -10 : 0,
                  boxShadow: isPlaying ? "0 25px 50px -12px rgba(45,212,191,0.5)" : "none"
                }}
                whileHover={!isPlaying ? { 
                  scale: 1.05,
                  filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(180deg)", "hue-rotate(270deg)", "hue-rotate(360deg)"],
                  transition: { duration: 2, repeat: Infinity, ease: "linear" }
                } : {}}
                className={`relative rounded-2xl ${isPlaying ? 'ring-2 ring-teal-400' : ''}`}
                onClick={() => toggleSound(freq.id, freq.type as "oscillator" | "binaural" | "noise", freq.value)}
              >
                <MagicCard gradientColor="#2dd4bf" gradientOpacity={isPlaying ? 0.4 : 0.15} className="cursor-pointer h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-2xl font-bold transition-colors ${isPlaying ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-teal-400'}`}>
                      {freq.freq}
                    </span>
                    <button className="focus:outline-none pointer-events-none">
                      {isPlaying ? (
                        <Activity className="text-white animate-pulse" size={20} />
                      ) : (
                        <Play className="text-gray-600 transition-colors" size={20} />
                      )}
                    </button>
                  </div>
                  <h3 className="text-white font-medium text-lg">{freq.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{freq.desc}</p>
                </MagicCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Frequency Research Marquee */}
      <section className="mt-16 pb-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-white uppercase tracking-widest font-mono">
            Clinical Data Stream
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
        </div>
        
        <div className="relative border-y border-white/10 bg-gradient-to-r from-transparent via-cyan-900/10 to-transparent overflow-hidden py-12">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#050510] to-transparent z-10"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#050510] to-transparent z-10"></div>
          
          {/* Subtle grid background for the tape */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
          
          <Marquee pauseOnHover className="[--duration:35s]" style={{ '--duration': '35s' } as React.CSSProperties}>
            {research.map((item, idx) => (
              <div key={idx} className="mx-6 group">
                <MagicCard 
                  gradientColor="#06b6d4" 
                  gradientOpacity={0.2} 
                  className="min-w-[340px] p-6 rounded-2xl border border-cyan-500/20 bg-[#050510]/80 backdrop-blur-md relative overflow-hidden transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_10px_30px_-10px_rgba(6,182,212,0.3)]"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full group-hover:bg-cyan-500/30 transition-all duration-700" />
                  
                  <div className="flex items-start gap-5 relative z-10">
                    <div className="text-3xl p-4 bg-cyan-950/40 rounded-xl border border-cyan-500/30 shadow-[inset_0_0_15px_rgba(6,182,212,0.1)] group-hover:border-cyan-400/50 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2 font-mono uppercase tracking-wide">
                        {item.title}
                        <span className="flex h-2 w-2 relative ml-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                      </h4>
                      <p className="text-cyan-100/60 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </MagicCard>
              </div>
            ))}
          </Marquee>
        </div>
      </section>
    </div>
  );
}
