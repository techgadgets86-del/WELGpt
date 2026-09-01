"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, LayoutDashboard, Menu, X, CheckSquare, Leaf, Activity, BookOpen, Mail, BarChart3 , Utensils, Waves, Home, Compass, UserCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useAuth } from "@/lib/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { LogIn, LogOut } from "lucide-react";

// 🌊 Smooth UI: Physical Spring Transitions
const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, profile, loading } = useAuth();

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: CheckSquare, label: "Today's Plan", href: "/routine" },
    { icon: Brain, label: "AI Coach", href: "/coach" },
    { icon: Compass, label: "Explore", href: "/explore" },
    { icon: BarChart3, label: "Progress", href: "/dashboard" },
    { icon: UserCircle, label: "Profile", href: "/profile" },
  ];

  // Core 4 items for the mobile bottom nav
  const bottomNavItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: CheckSquare, label: "Plan", href: "/routine" },
    { icon: Brain, label: "Coach", href: "/coach" },
    { icon: Compass, label: "Explore", href: "/explore" },
    { icon: UserCircle, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-[#0a0a1a] text-gray-100 overflow-hidden font-sans">
      
      {/* ============================================================== */}
      {/* DESKTOP SIDEBAR (Hidden on mobile) */}
      {/* ============================================================== */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={springTransition}
        className="hidden md:flex flex-col border-r border-white/10 bg-[#111127] relative z-20 shrink-0"
      >
        <div className="p-6 flex items-center justify-between min-h-[76px]">
          <motion.div animate={{ opacity: sidebarOpen ? 1 : 0, display: sidebarOpen ? "block" : "none" }}>
            <Image src="/logo-full.png" alt="WelGPT" width={120} height={28} className="h-[28px] w-auto object-contain" priority />
          </motion.div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-white/10 transition-colors shrink-0">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto no-scrollbar pb-24">
            {navItems.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <Link href={item.href} key={idx}>
                  <motion.button 
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-colors ${
                      isActive ? 'bg-violet-500/20 text-white' : 'hover:bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <item.icon size={22} className={isActive ? 'text-violet-400 shrink-0' : 'text-gray-500 shrink-0'} />
                    <motion.span animate={{ opacity: sidebarOpen ? 1 : 0 }} className="whitespace-nowrap font-medium">
                        {sidebarOpen && item.label}
                    </motion.span>
                  </motion.button>
                </Link>
              );
            })}
        </nav>

        {/* Desktop Profile Footer */}
        <div className="p-4 border-t border-white/10 shrink-0">
          {!loading && user ? (
            <motion.div className="w-full flex items-center justify-between gap-3 p-2 rounded-xl text-left">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center shrink-0 border border-white/10 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || "User"}&background=7c3aed&color=fff`} alt="User" width={40} height={40} />
                </div>
                <motion.div animate={{ opacity: sidebarOpen ? 1 : 0, display: sidebarOpen ? "block" : "none" }} className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{user.displayName || "User"}</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                    <span>Level {profile?.level || 1} • 🔥 {profile?.streak || 0}</span>
                  </div>
                </motion.div>
              </div>
              <motion.button animate={{ opacity: sidebarOpen ? 1 : 0, display: sidebarOpen ? "block" : "none" }} onClick={() => signOut(auth)} className="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5">
                <LogOut size={16} />
              </motion.button>
            </motion.div>
          ) : (
            <Link href="/login">
              <motion.button whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }} className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left border border-white/5 bg-white/[0.02]">
                <LogIn size={20} className="text-violet-400 shrink-0 ml-1" />
                <motion.span animate={{ opacity: sidebarOpen ? 1 : 0 }} className="whitespace-nowrap font-medium text-white">
                    {sidebarOpen && "Sign In / Register"}
                </motion.span>
              </motion.button>
            </Link>
          )}
        </div>
      </motion.aside>

      {/* ============================================================== */}
      {/* MOBILE TOP BAR */}
      {/* ============================================================== */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#111127]/90 backdrop-blur-md sticky top-0 z-30 pt-[env(safe-area-inset-top)]">
        <Link href="/">
          <Image src="/logo-full.png" alt="WelGPT" width={100} height={24} className="h-[24px] w-auto object-contain" priority />
        </Link>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
          <Menu size={24} />
        </button>
      </div>

      {/* MOBILE FULLSCREEN MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#0a0a1a] flex flex-col pt-[env(safe-area-inset-top)]"
          >
            <div className="p-4 flex justify-between items-center border-b border-white/10">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-white/10">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {navItems.map((item, idx) => (
                <Link href={item.href} key={idx} onClick={() => setMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-4 p-4 rounded-xl ${pathname === item.href ? 'bg-violet-500/20 text-white' : 'text-gray-400'}`}>
                    <item.icon size={24} className={pathname === item.href ? 'text-violet-400' : ''} />
                    <span className="font-medium text-lg">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Mobile Footer Login */}
            <div className="p-6 border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
              {!loading && user ? (
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || "User"}&background=7c3aed&color=fff`} className="w-12 h-12 rounded-full border border-white/10" alt="Profile" />
                    <div>
                      <p className="font-medium text-white">{user.displayName || "User"}</p>
                      <p className="text-xs text-violet-400">Level {profile?.level || 1} • 🔥 {profile?.streak || 0} Streak</p>
                    </div>
                  </div>
                  <button onClick={() => { signOut(auth); setMobileMenuOpen(false); }} className="p-3 bg-red-500/20 text-red-400 rounded-xl">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-4 rounded-xl bg-violet-600 text-white font-bold flex items-center justify-center gap-2">
                    <LogIn size={20} /> Sign In or Register
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Unlumen UI Ambient Glows - FIXED so they don't cause lag on scroll */}
      <div className="fixed top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-violet-600/20 blur-[100px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-[-10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none z-0" />
      
      {/* ============================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ============================================================== */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative p-4 md:p-8 lg:p-12 pb-[140px] md:pb-8 no-scrollbar bg-[#0a0a1a]">        
        {children}
      </main>

      {/* ============================================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR */}
      {/* ============================================================== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111127]/90 backdrop-blur-md border-t border-white/10 pb-[calc(0.5rem+env(safe-area-inset-bottom))] z-50">
        <div className="flex items-center justify-around p-2">
          {bottomNavItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <Link href={item.href} key={idx} className="flex-1">
                <button className="w-full flex flex-col items-center justify-center py-2 gap-1 relative">
                  {isActive && (
                    <motion.div layoutId="mobileNavGlow" className="absolute inset-0 bg-violet-500/20 rounded-xl" transition={springTransition} />
                  )}
                  <item.icon size={22} className={`relative z-10 ${isActive ? 'text-violet-400' : 'text-gray-500'}`} />
                  <span className={`text-[10px] relative z-10 font-medium ${isActive ? 'text-violet-200' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
