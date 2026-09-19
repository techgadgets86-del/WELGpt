import { motion, AnimatePresence } from "framer-motion";
import { Lock, LogIn } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function GuestLoginModal() {
  const { showGuestModal, setShowGuestModal } = useAuth();
  const router = useRouter();

  if (!showGuestModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0a0a1a]/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-md bg-[#111127] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 blur-[60px] pointer-events-none rounded-full" />
          
          <div className="flex justify-center mb-6 relative z-10">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <Lock size={32} className="text-violet-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-white mb-2 relative z-10">
            Unlock This Feature
          </h2>
          <p className="text-center text-gray-400 mb-8 relative z-10">
            This feature requires a free account to securely sync your personalized AI metrics and routines.
          </p>

          <div className="space-y-4 relative z-10">
            <button
              onClick={() => {
                setShowGuestModal(false);
                router.push("/login");
              }}
              className="w-full py-4 rounded-xl font-bold text-black bg-white hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              Create Free Account
            </button>
            <button
              onClick={() => setShowGuestModal(false)}
              className="w-full py-4 rounded-xl font-medium text-gray-400 hover:bg-white/5 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
