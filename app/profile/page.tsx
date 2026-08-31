"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { Settings, User as UserIcon, Target, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, profile, updateUserData } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    signOut(auth);
    router.push('/login');
  };

  return (
    <div className="max-w-4xl mx-auto relative z-10 pt-4 pb-20 h-full flex flex-col">
      <header className="mb-10">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white"
        >
          Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Profile.</span>
        </motion.h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* User Identity */}
        <div className="md:col-span-2 bg-[#111127] border border-white/10 rounded-3xl p-8 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 p-1 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || "User"}&background=0a0a1a&color=fff`} alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-[#111127]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{user?.displayName || "Wellness Seeker"}</h2>
            <p className="text-gray-400 mb-3">{user?.email}</p>
            <div className="flex gap-3">
              <span className="text-xs font-bold px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full">Level {profile?.level || 1}</span>
              <span className="text-xs font-bold px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full">🔥 {profile?.streak || 0} Streak</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#111127] border border-white/10 rounded-3xl p-6 flex flex-col justify-center gap-3">
          
          <button onClick={handleSignOut} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors text-left font-medium mt-2">
            <LogOut size={20} /> Sign Out
          </button>
        </div>

      </div>

      {/* Preferences Section */}
      <div className="bg-[#111127] border border-white/10 rounded-3xl p-8 mb-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Settings size={20} className="text-gray-400" /> AI Coach Preferences</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Dietary Preference</label>
            <select 
              value={profile?.preferences?.dietary || "none"}
              onChange={(e) => updateUserData({ preferences: { ...profile?.preferences, dietary: e.target.value } })}
              className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-violet-500"
            >
              <option value="none">No Restrictions</option>
              <option value="vegan">Vegan</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Fitness Level</label>
            <select 
              value={profile?.preferences?.fitnessLevel || "beginner"}
              onChange={(e) => updateUserData({ preferences: { ...profile?.preferences, fitnessLevel: e.target.value } })}
              className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-violet-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="athlete">Pro Athlete</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  );
}
