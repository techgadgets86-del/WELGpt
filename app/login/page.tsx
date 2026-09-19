"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Mail, Lock, UserPlus, AlertCircle } from "lucide-react";
import Image from "next/image";
import { auth, googleProvider, db } from "@/lib/firebase";
import { signInWithPopup, linkWithPopup, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      if (auth.currentUser && auth.currentUser.isAnonymous) {
        try {
          const oldUid = auth.currentUser.uid;
          const oldDocRef = doc(db, 'users', oldUid);
          const oldDocSnap = await getDoc(oldDocRef);
          
          const result = await linkWithPopup(auth.currentUser, googleProvider);
          const newUid = result.user.uid;
          
          if (oldDocSnap.exists() && oldUid !== newUid) {
            await setDoc(doc(db, 'users', newUid), oldDocSnap.data(), { merge: true });
          }
        } catch (linkError: any) {
          if (linkError.code === 'auth/credential-already-in-use') {
            await signInWithPopup(auth, googleProvider);
          } else {
            throw linkError;
          }
        }
      } else {
        await signInWithPopup(auth, googleProvider);
      }
    } catch (error: any) {
      console.error("Authentication Error", error);
      setErrorMsg(error.message.includes("unauthorized-domain") 
        ? "Google login blocked by Firebase. Use Email instead." 
        : error.message.replace("Firebase: ", ""));
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error("Email Auth Error", error);
      let friendlyError = error.message.replace("Firebase: ", "");
      if (error.code === 'auth/invalid-credential') friendlyError = "Invalid email or password.";
      if (error.code === 'auth/email-already-in-use') friendlyError = "Email is already registered.";
      setErrorMsg(friendlyError);
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      setLoading(true);
      await signInAnonymously(auth);
    } catch (error: any) {
      console.error("Guest Sign In Error", error);
      setErrorMsg("Failed to continue as guest.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#050510] overflow-hidden p-4">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] bg-violet-600 blur-[120px] rounded-full pointer-events-none mix-blend-screen" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-teal-500 blur-[120px] rounded-full pointer-events-none mix-blend-screen" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px] z-10"
      >
        <div className="bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl overflow-hidden rounded-3xl p-8">
          <div className="text-center pb-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex mx-auto p-3 rounded-2xl bg-white/10 border border-white/20 mb-4 backdrop-blur-xl"
            >
              <Image src="/logo-icon.png" alt="WelGPT" width={40} height={40} className="drop-shadow-lg" />
            </motion.div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              WelGPT
            </h1>
            <p className="text-gray-400 mt-2">
              Sync your circadian metrics.
            </p>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl mb-4">
                    <AlertCircle size={18} />
                    <p className="text-sm font-medium">{errorMsg}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <input 
                    type="email" 
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 h-12 rounded-xl transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 h-12 rounded-xl transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 flex items-center justify-center gap-2 text-base font-bold bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all"
              >
                {loading ? "Processing..." : isRegistering ? <><UserPlus className="h-5 w-5" /> Create Account</> : <><LogIn className="h-5 w-5" /> Sign In</>}
              </button>
            </form>

            <div className="text-center pt-2">
              <button 
                type="button" 
                onClick={() => setIsRegistering(!isRegistering)} 
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {isRegistering ? "Already have an account? Sign In" : "Need an account? Register"}
              </button>
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink-0 mx-4 text-xs font-mono text-gray-500 uppercase tracking-widest">Or</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <div className="space-y-3">
              <button 
                type="button"
                disabled={loading}
                onClick={handleGoogleSignIn}
                className="w-full h-12 flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold shadow-lg transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>

              <button 
                type="button"
                disabled={loading}
                onClick={handleGuestSignIn}
                className="w-full h-12 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 rounded-xl font-semibold transition-all"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
