"use client";

import { Suspense } from "react";
import ChatInterface from "@/components/ChatInterface";
import Image from "next/image";

function ChatLoadingSkeleton() {
  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto relative z-10 pt-4">
      <div className="flex-1 flex flex-col items-center justify-center  opacity-50 animate-pulse">
        <div className="inline-flex items-center justify-center p-4 rounded-full mb-6">
          <Image src="/logo-icon.png" alt="WelGPT" width={48} height={48} className="object-contain" priority />
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold mb-3 tracking-tight text-white">
          Hey 👋 I&apos;m your WelGPT Coach.
        </h1>
        <p className="text-gray-400 text-lg mb-12">
          What would you like to work on today?
        </p>
      </div>
    </div>
  );
}

export default function CoachPage() {
  return (
    <div className="max-w-5xl mx-auto relative z-10 pt-4 h-full flex flex-col">
      <div className="flex-1 overflow-hidden relative">
        <Suspense fallback={<ChatLoadingSkeleton />}>
          <ChatInterface />
        </Suspense>
      </div>
    </div>
  );
}
