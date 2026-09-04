"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MagicCard } from "@/components/ui/magic-card";
import { Marquee } from "@/components/ui/marquee";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot, setDoc, updateDoc, increment } from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import { ShieldAlert, Play, XOctagon, Trophy, Flame } from "lucide-react";

export default function DetoxHub() {
  const router = useRouter();
  const { addXP, logActivity } = useAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const [activeDetox, setActiveDetox] = useState<{type: string, startTime: string} | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, `users/${currentUser.uid}/detoxTracker`, 'current');
        const unsubDb = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists() && docSnap.data().active) {
            setActiveDetox({
              type: docSnap.data().type,
              startTime: docSnap.data().startTime
            });
          } else {
            setActiveDetox(null);
          }
        });
        return () => unsubDb();
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeDetox) {
      interval = setInterval(() => {
        const start = new Date(activeDetox.startTime).getTime();
        const now = new Date().getTime();
        setElapsedTime(Math.floor((now - start) / 1000));
      }, 1000);
    } else {
      setTimeout(() => setElapsedTime(0), 0);
    }
    return () => clearInterval(interval);
  }, [activeDetox]);

  const startDetox = async (type: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    const docRef = doc(db, `users/${user.uid}/detoxTracker`, 'current');
    await setDoc(docRef, {
      active: true,
      type,
      startTime: new Date().toISOString()
    });
  };

  const endDetox = async (success: boolean) => {
    if (!user || !activeDetox) return;
    const docRef = doc(db, `users/${user.uid}/detoxTracker`, 'current');
    await updateDoc(docRef, { active: false });
    
    if (success) {
      // Base XP + Bonus XP for time
      const hoursCompleted = elapsedTime / 3600;
      const xpReward = Math.floor(50 + (hoursCompleted * 10)); 
      addXP(xpReward);
    }
    setActiveDetox(null);
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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
    <div className="max-w-5xl mx-auto relative z-10 pt-4 min-h-full flex pb-[160px] md:pb-12 flex-col">
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

      
      {/* Active Tracker */}
      <AnimatePresence mode="wait">
        {activeDetox ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-12 border border-teal-500/30 rounded-3xl p-8 bg-teal-500/10 flex flex-col items-center justify-center text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111127] opacity-80" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/20 text-teal-400 text-sm font-bold tracking-widest uppercase mb-6 border border-teal-500/30">
                <Flame size={16} className="animate-pulse" />
                Active Fast: {activeDetox.type}
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 font-mono tracking-tighter mb-8 drop-shadow-2xl">
                {formatTime(elapsedTime)}
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => endDetox(false)}
                  className="px-6 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 font-bold flex items-center gap-2 hover:bg-red-500/20 transition-all"
                >
                  <XOctagon size={20} />
                  Relapsed
                </button>
                <button 
                  onClick={() => endDetox(true)}
                  className="px-6 py-3 rounded-xl border border-teal-500/50 bg-teal-500 text-white font-bold flex items-center gap-2 hover:bg-teal-400 shadow-[0_0_30px_rgba(20,184,166,0.3)] transition-all"
                >
                  <Trophy size={20} />
                  Complete Fast
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="inactive" className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Start a Protocol</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {protocols.map((protocol, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer h-full"
                  onClick={() => startDetox(protocol.title)}
                >
                  <MagicCard gradientColor="#2dd4bf" gradientTo="#10b981" gradientOpacity={0.15}>
                    <div className="text-4xl mb-4 drop-shadow-md">{protocol.icon}</div>
                    <h3 className="text-lg font-medium text-white mb-2">{protocol.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{protocol.desc}</p>
                    <button className="text-teal-400 font-bold text-sm flex items-center gap-2 bg-teal-500/10 px-4 py-2 rounded-lg w-full justify-center border border-teal-500/20">
                      <Play size={14} /> Begin Fast
                    </button>
                  </MagicCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <section className="mt-8 ">
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
