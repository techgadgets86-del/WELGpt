"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInAnonymously } from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc, getDoc, increment } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface RoutineTask {
  id: string;
  time: string;
  title: string;
  desc: string;
  completed?: boolean;
}

export interface UserProfile {
  isPremium?: boolean;
  aiChatTokens?: number;
  aiPlanTokens?: number;
  tokenResetDate?: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  goals: string[];
  preferences: {
    dietary?: string;
    fitnessLevel?: string;
    focusAreas?: string[];
    [key: string]: string | number | boolean | string[] | undefined;
  };
  recentActivity: string[];
  nutritionPlan?: any[];
  coachMessage?: string;
  dailyPlan?: {
    date: string;
    morning: RoutineTask[];
    afternoon: RoutineTask[];
    evening: RoutineTask[];
  };
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  addXP: (amount: number) => Promise<void>;
  updateUserData: (data: Partial<UserProfile>) => Promise<void>;
  logActivity: (activity: string) => Promise<void>;
  toggleTaskComplete: (taskId: string, completed: boolean) => Promise<void>;
  showGuestModal: boolean;
  setShowGuestModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  addXP: async () => {},
  updateUserData: async () => {},
  logActivity: async () => {},
  toggleTaskComplete: async () => {},
  showGuestModal: false,
  setShowGuestModal: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGuestModal, setShowGuestModal] = useState(false);

  useEffect(() => {
    let unsubProfile: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      setUser(currentUser);
      
      // Cleanup previous profile listener if it exists
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = undefined;
      }

      if (currentUser) {
        // Subscribe to user profile
        const userRef = doc(db, 'users', currentUser.uid);
        unsubProfile = onSnapshot(userRef, (docSnap) => {
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
              
              if (diffDays > 1) {
                currentStreak = 0;
              }
            }

            // Token Reset Logic
            let currentChatTokens = data.aiChatTokens ?? 5;
            let currentPlanTokens = data.aiPlanTokens ?? 3;
            let currentResetDate = data.tokenResetDate || today;
            
            if (currentResetDate !== today && !data.isPremium) {
              currentChatTokens = 10;
              currentPlanTokens = 3;
              currentResetDate = today;
              setDoc(userRef, { 
                aiChatTokens: 5, 
                aiPlanTokens: 3, 
                tokenResetDate: today 
              }, { merge: true });
            }

            setProfile({
              isPremium: data.isPremium || false,
              aiChatTokens: currentChatTokens,
              aiPlanTokens: currentPlanTokens,
              tokenResetDate: currentResetDate,
              xp: data.xp || 0,
              level: Math.floor((data.xp || 0) / 100) + 1,
              streak: currentStreak,
              lastActiveDate: lastActive,
              goals: data.goals || [],
              preferences: data.preferences || { dietary: "none", fitnessLevel: "beginner", focusAreas: [] },
              recentActivity: data.recentActivity || [],
              dailyPlan: data.dailyPlan || null,
              coachMessage: data.coachMessage || undefined,
              nutritionPlan: data.nutritionPlan || undefined
            });
            
            // Full State Failsafe Restore if Firestore is missing critical data
            if (!data.dailyPlan || !data.nutritionPlan) {
              try {
                const fullBackupStr = localStorage.getItem('welgpt_full_backup');
                if (fullBackupStr) {
                  const fullBackup = JSON.parse(fullBackupStr);
                  setProfile(prev => prev ? { ...prev, ...fullBackup } : null);
                  setDoc(doc(db, 'users', currentUser.uid), fullBackup, { merge: true });
                }
              } catch(e) {}
            }
          } else {
            // Initialize profile
            const initData = { isPremium: false, aiChatTokens: 5, aiPlanTokens: 3, tokenResetDate: new Date().toISOString().split('T')[0], xp: 0, streak: 0, lastActiveDate: "", goals: [], preferences: { dietary: "none", fitnessLevel: "beginner", focusAreas: [] }, recentActivity: [], dailyPlan: null };
            let fullBackup = {};
            try {
              const fullBackupStr = localStorage.getItem('welgpt_full_backup');
              if (fullBackupStr) fullBackup = JSON.parse(fullBackupStr);
            } catch(e) {}
            
            const mergedInit: any = { ...initData, ...fullBackup };
            setDoc(userRef, mergedInit);
            
            setProfile({ 
              isPremium: mergedInit.isPremium || false,
              aiChatTokens: mergedInit.aiChatTokens ?? 5,
              aiPlanTokens: mergedInit.aiPlanTokens ?? 3,
              tokenResetDate: mergedInit.tokenResetDate || new Date().toISOString().split('T')[0],
              xp: mergedInit.xp || 0, 
              level: mergedInit.level || 1, 
              streak: mergedInit.streak || 0, 
              lastActiveDate: mergedInit.lastActiveDate || "", 
              goals: mergedInit.goals || [], 
              preferences: mergedInit.preferences || { dietary: "none", fitnessLevel: "beginner", focusAreas: [] }, 
              recentActivity: mergedInit.recentActivity || [], 
              dailyPlan: mergedInit.dailyPlan || null, 
              coachMessage: mergedInit.coachMessage || undefined, 
              nutritionPlan: mergedInit.nutritionPlan || undefined 
            });
          }
        });
        setLoading(false);
      } else {
        // User is fully signed out.
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
    };
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
    
    try {
      await setDoc(userRef, {
        xp: increment(amount),
        streak: newStreak,
        lastActiveDate: today
      }, { merge: true });
    } catch(e) {}
  };

  const updateUserData = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    // Full State Failsafe Backup First!
    try {
      const existingBackupStr = localStorage.getItem('welgpt_full_backup');
      const existingBackup = existingBackupStr ? JSON.parse(existingBackupStr) : {};
      const newBackup = { ...existingBackup, ...data };
      localStorage.setItem('welgpt_full_backup', JSON.stringify(newBackup));
      
      // Legacy keys for backward compatibility during transition
      if (data.dailyPlan) localStorage.setItem('welgpt_backup_plan', JSON.stringify(data.dailyPlan));
      if (data.coachMessage) localStorage.setItem('welgpt_backup_msg', data.coachMessage);
    } catch (e) {}

    try {
      await setDoc(userRef, data, { merge: true });
    } catch (e) {
      console.error("Firestore write failed, but local backup succeeded:", e);
    }
  };

  const logActivity = async (activity: string) => {
    if (!user || !profile) return;
    const userRef = doc(db, 'users', user.uid);
    const newActivity = [activity, ...(profile.recentActivity || [])].slice(0, 10); // keep last 10
    try { await setDoc(userRef, { recentActivity: newActivity }, { merge: true }); } catch(e) {}
  };

  const toggleTaskComplete = async (taskId: string, completed: boolean) => {
    if (!user || !profile || !profile.dailyPlan) return;
    
    // Deep clone the daily plan
    const newPlan = JSON.parse(JSON.stringify(profile.dailyPlan));
    let found = false;
    
    ['morning', 'afternoon', 'evening'].forEach((timeOfDay) => {
      newPlan[timeOfDay].forEach((task: RoutineTask) => {
        if (task.id === taskId) {
          task.completed = completed;
          found = true;
        }
      });
    });
    
    if (found) {
      const userRef = doc(db, 'users', user.uid);
      try {
        await setDoc(userRef, { dailyPlan: newPlan }, { merge: true });
      } catch(e) {}
      // Sync completion to local backup
      try {
        localStorage.setItem('welgpt_backup_plan', JSON.stringify(newPlan));
      } catch(e) {}
      
      // Auto-log activity and grant XP if completed
      if (completed) {
        logActivity(`Completed daily task`);
        await addXP(25);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, addXP, updateUserData, logActivity, toggleTaskComplete, showGuestModal, setShowGuestModal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
