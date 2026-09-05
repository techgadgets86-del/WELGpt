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

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  addXP: (amount: number) => Promise<void>;
  updateUserData: (data: Partial<UserProfile>) => Promise<void>;
  logActivity: (activity: string) => Promise<void>;
  toggleTaskComplete: (taskId: string, completed: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true, addXP: async () => {}, updateUserData: async () => {}, logActivity: async () => {}, toggleTaskComplete: async () => {} });

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
                  
                  // Attempt to aggressively re-sync the entire backup to Firestore to heal it
                  setDoc(doc(db, 'users', currentUser.uid), fullBackup, { merge: true });
                } else {
                  // Legacy fallback
                  const backup = localStorage.getItem('welgpt_backup_plan');
                  if (backup) {
                    const parsed = JSON.parse(backup);
                    setProfile(prev => prev ? { ...prev, dailyPlan: parsed, coachMessage: localStorage.getItem('welgpt_backup_msg') || prev.coachMessage } : null);
                    setDoc(doc(db, 'users', currentUser.uid), { dailyPlan: parsed, coachMessage: localStorage.getItem('welgpt_backup_msg') }, { merge: true });
                  }
                }
              } catch(e) {}
            }
          } else {
            // Initialize profile
            const initData = { xp: 0, streak: 0, lastActiveDate: "", goals: [], preferences: { dietary: "none", fitnessLevel: "beginner", focusAreas: [] }, recentActivity: [], dailyPlan: null };
            let restoredPlan = null;
            let restoredMsg = undefined;
            let fullBackup = {};
            try {
              const fullBackupStr = localStorage.getItem('welgpt_full_backup');
              if (fullBackupStr) {
                 fullBackup = JSON.parse(fullBackupStr);
              } else {
                const backup = localStorage.getItem('welgpt_backup_plan');
                if (backup) {
                  restoredPlan = JSON.parse(backup);
                  restoredMsg = localStorage.getItem('welgpt_backup_msg') || undefined;
                  fullBackup = { dailyPlan: restoredPlan, coachMessage: restoredMsg };
                }
              }
            } catch(e) {}
            
            const mergedInit: any = { ...initData, ...fullBackup };
            setDoc(userRef, mergedInit);
            
            setProfile({ 
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
      


  return () => unsubProfile();
      } else {
        // Automatically sign in anonymous users so their session persists
        try {
          await signInAnonymously(auth);
        } catch (err) {
          console.error("Anonymous auth failed", err);
          setProfile(null);
          setLoading(false);
        }
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
    <AuthContext.Provider value={{ user, profile, loading, addXP, updateUserData, logActivity, toggleTaskComplete }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
