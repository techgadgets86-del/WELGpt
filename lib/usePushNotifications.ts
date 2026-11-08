"use client";

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';
import { registerServiceWorker, subscribeToWebPush, getPermissionStatus } from './advancedNotifications';

export function usePushNotifications() {
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    // 1. Web Platform (Browser & PWA)
    if (Capacitor.getPlatform() === 'web') {
      if (typeof window === 'undefined') return;

      // Always register the service worker for background and lock-screen support
      registerServiceWorker().then((reg) => {
        if (!reg || !isMounted) return;

        // If permission was already granted, ensure Web Push is synced
        if (getPermissionStatus() === 'granted' && user && !user.isAnonymous) {
          subscribeToWebPush(user.uid).catch((err) => {
            console.warn('[WebPush Auto-Sync] Skipped:', err);
          });
        }
      });

      return () => {
        isMounted = false;
      };
    }

    // 2. Native iOS/Android via Capacitor
    if (!user || user.isAnonymous) return;

    const initNativePush = async () => {
      try {
        const { PushNotifications } = await import('@capacitor/push-notifications');

        const permStatus = await PushNotifications.checkPermissions();
        
        if (permStatus.receive === 'prompt') {
          const requested = await PushNotifications.requestPermissions();
          if (requested.receive !== 'granted') return;
        } else if (permStatus.receive !== 'granted') {
          return;
        }

        await PushNotifications.register();

        PushNotifications.addListener('registration', async (token) => {
          if (isMounted && user) {
            const userRef = doc(db, 'users', user.uid);
            try {
              await setDoc(userRef, { 
                fcmToken: token.value,
                platform: Capacitor.getPlatform(),
                tokenUpdatedAt: new Date().toISOString()
              }, { merge: true });
              console.log("[Native Push] FCM Token saved to Firestore successfully.");
            } catch (e) {
              console.error("[Native Push] Failed to save FCM token:", e);
            }
          }
        });

        PushNotifications.addListener('registrationError', (error: unknown) => {
          console.error('[Native Push] Registration error:', error);
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('[Native Push] Notification received in foreground:', notification);
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
          console.log('[Native Push] User tapped notification:', notification);
        });
      } catch (err) {
        console.warn('[Native Push] Initialization failed:', err);
      }
    };

    initNativePush();

    return () => {
      isMounted = false;
    };
  }, [user]);
}
