"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MagicCard } from "@/components/ui/magic-card";
import { Marquee } from "@/components/ui/marquee";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";
import { ShieldAlert, Play, XOctagon, Trophy, Flame, Award, Download } from "lucide-react";
import { getCertificateFallback } from "@/lib/certificateDb";

export default function DetoxHub() {
  const router = useRouter();
  const { addXP, logActivity } = useAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const [activeDetox, setActiveDetox] = useState<{type: string, startTime: string, targetDuration: number} | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(600); // Default 10 mins (600s)
  
  const [showCertificate, setShowCertificate] = useState(false);
  const [earnedCert, setEarnedCert] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, `users/${currentUser.uid}/detoxTracker`, 'current');
        const unsubDb = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists() && docSnap.data().active) {
            setActiveDetox({
              type: docSnap.data().type,
              startTime: docSnap.data().startTime,
              targetDuration: docSnap.data().targetDuration || 600
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
        const elapsed = Math.floor((now - start) / 1000);
        setElapsedTime(elapsed);

        // Auto-complete if target reached
        if (elapsed >= activeDetox.targetDuration) {
          clearInterval(interval);
          handleAutoCompletion(activeDetox.type);
        }
      }, 1000);
    } else {
      setTimeout(() => setElapsedTime(0), 0);
    }
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDetox]);

  const handleAutoCompletion = async (type: string) => {
    if (!user) return;
    const cert = getCertificateFallback(type);
    setEarnedCert(cert);
    setShowCertificate(true);
    
    // End the detox in db
    const docRef = doc(db, `users/${user.uid}/detoxTracker`, 'current');
    await updateDoc(docRef, { active: false });
    
    const xpReward = Math.floor(100); 
    addXP(xpReward);
  };

  const startDetox = async (type: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    const docRef = doc(db, `users/${user.uid}/detoxTracker`, 'current');
    await setDoc(docRef, {
      active: true,
      type,
      startTime: new Date().toISOString(),
      targetDuration: selectedDuration
    });
  };

  const endDetox = async (success: boolean) => {
    if (!user || !activeDetox) return;
    const docRef = doc(db, `users/${user.uid}/detoxTracker`, 'current');
    await updateDoc(docRef, { active: false });
    
    if (success) {
      handleAutoCompletion(activeDetox.type);
    } else {
      setActiveDetox(null);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const protocols = [
    { icon: "📱", title: "Digital Detox", desc: "Reset your distraction loops by unplugging." },
    { icon: "🥤", title: "3-Day Juice Cleanse", desc: "Flood your system with micronutrients." },
    { icon: "🔥", title: "Heavy Metal Sweep", desc: "Niacin flush and sauna protocol." },
    { icon: "🦠", title: "Microbiome Reset", desc: "Clear out bad bacteria and repopulate the gut." },
  ];

  const benefits = [
    { icon: "🧠", title: "Mental Clarity", desc: "Eliminate brain fog." },
    { icon: "⚡", title: "Energy Spike", desc: "Awaken your natural vitality." },
    { icon: "😴", title: "Deep Sleep", desc: "Restore circadian rhythms." },
    { icon: "🧬", title: "Cellular Repair", desc: "Trigger autophagy & renewal." },
    { icon: "😌", title: "Stress Relief", desc: "Lower cortisol levels." },
  ];
  
  // Calculate fill percentage (max 100)
  const progressPercent = activeDetox ? Math.min((elapsedTime / activeDetox.targetDuration) * 100, 100) : 0;

  return (
    <div className="max-w-5xl mx-auto relative z-10 pt-4 min-h-full flex pb-[160px] md:pb-12 flex-col">
      <header className="mb-8">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white"
        >
          Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Detox.</span>
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl"
        >
          Reset your focus, lock in, and reclaim your attention span.
        </motion.p>
      </header>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificate && earnedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#111127] border border-teal-500/30 rounded-3xl p-8 md:p-12 max-w-xl text-center relative overflow-hidden shadow-[0_0_50px_rgba(20,184,166,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-transparent pointer-events-none" />
              <div className="text-6xl mb-6">{earnedCert.badge}</div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-white mb-2">
                {earnedCert.title}
              </h2>
              <p className="text-teal-400 font-bold tracking-widest uppercase text-sm mb-6">Official Certification</p>
              
              <p className="text-gray-300 italic mb-6">"{earnedCert.quote}"</p>
              <p className="text-gray-400 text-sm mb-8">{earnedCert.description}</p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    // Simulating download/save
                    alert("Certificate saved to your achievements!");
                    setShowCertificate(false);
                    setEarnedCert(null);
                  }}
                  className="w-full py-4 rounded-xl bg-teal-500 text-white font-bold flex justify-center items-center gap-2 hover:bg-teal-400 transition-all shadow-[0_0_20px_rgba(20,184,166,0.4)]"
                >
                  <Download size={20} /> Claim & Save Certificate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Active Tracker */}
      <AnimatePresence mode="wait">
        {activeDetox ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-12 border border-white/10 rounded-3xl bg-[#050505] flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[400px]"
          >
            {/* The Blacked out timer washing with white droplets effect */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-white/10 transition-all duration-1000 ease-linear backdrop-blur-[2px]"
              style={{ height: `${progressPercent}%` }}
            >
              {/* Droplet overlay effect using CSS borders/shadows to simulate liquid edge */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
            </div>

            <div className="relative z-10 flex flex-col items-center p-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 text-white/50 text-sm font-bold tracking-widest uppercase mb-6 border border-white/10 backdrop-blur-md">
                <Flame size={16} className="animate-pulse text-white" />
                Active Fast: {activeDetox.type}
              </div>
              
              {/* Timer text that gets slightly brighter as progress increases */}
              <h2 
                className="text-7xl md:text-9xl font-black font-mono tracking-tighter mb-4 drop-shadow-2xl transition-all duration-1000"
                style={{ color: `rgba(255, 255, 255, ${0.3 + (progressPercent / 100) * 0.7})` }}
              >
                {formatTime(activeDetox.targetDuration - elapsedTime)}
              </h2>
              
              <p className="text-white/40 font-bold uppercase tracking-widest mb-12">Remaining Time</p>

              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => endDetox(false)}
                  className="px-6 py-3 rounded-xl border border-white/10 bg-black text-white/50 font-bold flex items-center gap-2 hover:bg-white/5 hover:text-white transition-all backdrop-blur-md"
                >
                  <XOctagon size={20} />
                  Abort
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="inactive" className="mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-semibold text-white">Start a Protocol</h2>
              
              {/* Duration Selector */}
              <div className="flex items-center gap-2 bg-[#111127] border border-white/10 rounded-xl p-1">
                {[
                  { label: "10 Min", val: 600 },
                  { label: "30 Min", val: 1800 },
                  { label: "1 Hour", val: 3600 },
                  { label: "24 Hours", val: 86400 }
                ].map(dur => (
                  <button
                    key={dur.val}
                    onClick={() => setSelectedDuration(dur.val)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      selectedDuration === dur.val 
                        ? 'bg-teal-500 text-white shadow-[0_0_10px_rgba(20,184,166,0.3)]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

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
                      <Play size={14} /> Begin {selectedDuration < 3600 ? `${selectedDuration/60}m` : `${selectedDuration/3600}h`} Fast
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
