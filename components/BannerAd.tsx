"use client";

import { useAuth } from "@/lib/AuthContext";
import { Info } from "lucide-react";
import Link from "next/link";

export default function BannerAd() {
  const { profile } = useAuth();

  // Premium users don't see ads
  if (profile?.isPremium) return null;

  return (
    <div className="w-full my-6 bg-gradient-to-r from-gray-900 to-black border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-gray-500 uppercase font-bold tracking-wider">
        <span>Advertisement</span>
        <Info size={12} />
      </div>
      
      <div className="flex flex-col items-center justify-center text-center mt-2 mb-2">
        <h4 className="text-gray-400 font-medium mb-1">Unlock Unlimited Power</h4>
        <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 mb-3">
          WelGPT Premium
        </p>
        <Link href="/premium">
          <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-full transition-all border border-white/10">
            Remove Ads
          </button>
        </Link>
      </div>
    </div>
  );
}
