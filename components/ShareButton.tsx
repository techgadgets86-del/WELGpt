"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Check } from "lucide-react";

export default function ShareButton({ title, text, url }: { title: string, text: string, url: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Construct the absolute URL if it's relative (for localhost or production)
    const shareUrl = typeof window !== 'undefined' ? window.location.href : url;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        return; // Success natively
      } catch (err) {
        // Fallback if they cancel or it fails
      }
    }
    
    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      className={`relative flex items-center gap-2 text-sm transition-colors px-4 py-2 rounded-full border overflow-hidden ${
        copied 
          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
          : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
      }`}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div 
            key="check"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <Check size={16} /> Link Copied
          </motion.div>
        ) : (
          <motion.div 
            key="share"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <Share2 size={16} /> Share Article
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Ripple/Flash effect */}
      {copied && (
        <motion.div 
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 bg-emerald-400 rounded-full z-0 pointer-events-none"
        />
      )}
    </motion.button>
  );
}
