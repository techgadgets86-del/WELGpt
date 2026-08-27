"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc, getDoc, increment } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfile {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  addXP: (amount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true, addXP: async () => {} });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      setUser(currentUser);
      if (currentUser) {
        // Subscribe to user profile
        const userRef = doc(db, 'users', currentUser.uid);
        const unsubProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const lastActive = data.lastActiveDate || "";
            const today = new Date().toISOString().split('T')[0];
            
            // Check streak logic (simple version)
            let currentStreak = data.streak || 0;
            if (lastActive) {
              const lastDate = new Date(lastActive);
              const currentDate = new Date(today);
              const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
              
              if (diffDays > 1 && diffDays < 3) {
                 // Missed a day? Wait, diffDays === 1 means yesterday.
                 // Actually, if it's not today and not yesterday, reset.
              }
              if (diffDays > 1) {
                currentStreak = 0;
              } else if (diffDays === 1) {
                 // Will increment if they do an action today, handled in addXP
              }
            }

            setProfile({
              xp: data.xp || 0,
              level: Math.floor((data.xp || 0) / 100) + 1,
              streak: currentStreak,
              lastActiveDate: lastActive
            });
          } else {
            // Initialize profile
            const initData = { xp: 0, streak: 0, lastActiveDate: "" };
            setDoc(userRef, initData);
            setProfile({ xp: 0, level: 1, streak: 0, lastActiveDate: "" });
          }
        });
        setLoading(false);
        return () => unsubProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const addXP = async (amount: number) => {
    if (!user || !profile) return;
    
    const today = new Date().toISOString().split('T')[0];
    const userRef = doc(db, 'users', user.uid);
    
    let newStreak = profile.streak;
    if (profile.lastActiveDate !== today) {
       // First action of the day
       const lastDate = profile.lastActiveDate ? new Date(profile.lastActiveDate) : null;
       const currentDate = new Date(today);
       
       if (lastDate) {
         const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
         if (diffDays === 1) {
           newStreak += 1;
         } else if (diffDays > 1) {
           newStreak = 1;
         }
       } else {
         newStreak = 1;
       }
    }
    
    await updateDoc(userRef, {
      xp: increment(amount),
      streak: newStreak,
      lastActiveDate: today
    });
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, addXP }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
