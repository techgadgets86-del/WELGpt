"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, LayoutDashboard, Menu, X, CheckSquare, Leaf, Activity, BookOpen, Mail, BarChart3 } from "lucide-react";
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
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: "Meditation Hub", href: "/" },
    { icon: Sparkles, label: "Daily Inspiration", href: "/inspiration" },
    { icon: CheckSquare, label: "Routine Checklist", href: "/routine" },
    { icon: BarChart3, label: "Analytics Dashboard", href: "/dashboard" },
    { icon: Leaf, label: "Detox Hub", href: "/detox" },
    { icon: Brain, label: "AI Coach", href: "/coach" },
    { icon: Activity, label: "Sensei Training", href: "/sensei" },
    { icon: BookOpen, label: "Neuroscience Blog", href: "/blog" },
    { icon: Mail, label: "Newsletter", href: "/newsletter" },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a1a] text-gray-100 overflow-hidden font-sans">
      {/* Sidebar - Smooth UI animated width */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={springTransition}
        className="flex flex-col border-r border-white/10 bg-[#111127] relative z-20"
      >
        <div className="p-6 flex items-center justify-between min-h-[76px]">
          <motion.div 
            animate={{ opacity: sidebarOpen ? 1 : 0, display: sidebarOpen ? "block" : "none" }}
          >
            <Image 
              src="/logo-full.png" 
              alt="WelGPT" 
              width={120} 
              height={28} 
              className="h-[28px] w-auto object-contain"
              priority
            />
          </motion.div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-white/10 transition-colors shrink-0">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto no-scrollbar">
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
                    <motion.span 
                        animate={{ opacity: sidebarOpen ? 1 : 0 }} 
                        className="whitespace-nowrap font-medium"
                    >
                        {sidebarOpen && item.label}
                    </motion.span>
                  </motion.button>
                </Link>
              );
            })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-white/10">
          {!loading && user ? (
            <motion.div 
              className="w-full flex items-center justify-between gap-3 p-2 rounded-xl text-left"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center shrink-0 border border-white/10 overflow-hidden">
                  <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || "User"}&background=7c3aed&color=fff`} alt="User" width={40} height={40} />
                </div>
                <motion.div animate={{ opacity: sidebarOpen ? 1 : 0, display: sidebarOpen ? "block" : "none" }} className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{user.displayName || "User"}</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                    <span>Premium</span>
                  </div>
                </motion.div>
              </div>
              
              <motion.button
                animate={{ opacity: sidebarOpen ? 1 : 0, display: sidebarOpen ? "block" : "none" }}
                onClick={() => signOut(auth)}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
              >
                <LogOut size={16} />
              </motion.button>
            </motion.div>
          ) : (
            <Link href="/login">
              <motion.button 
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left border border-white/5 bg-white/[0.02]"
              >
                <LogIn size={20} className="text-violet-400 shrink-0 ml-1" />
                <motion.span 
                    animate={{ opacity: sidebarOpen ? 1 : 0 }} 
                    className="whitespace-nowrap font-medium text-white"
                >
                    {sidebarOpen && "Sign In / Register"}
                </motion.span>
              </motion.button>
            </Link>
          )}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative p-8 md:p-12">
        {/* Unlumen UI Ambient Glows - Shared across all pages */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        {/* Page Content injected here */}
        {children}
      </main>
    </div>
  );
}
