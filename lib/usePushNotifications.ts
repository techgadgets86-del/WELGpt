"use client";

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';

export function usePushNotifications() {
  const { user } = useAuth();

  useEffect(() => {
    // Only run on native iOS/Android devices
    if (Capacitor.getPlatform() === 'web') return;
    if (!user || user.isAnonymous) return;

    let isMounted = true;

    const initPush = async () => {
      // Dynamically import to prevent SSR issues in Next.js
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
            // Save token securely to Firestore using setDoc with merge to avoid overwriting
            await setDoc(userRef, { 
                fcmToken: token.value,
                platform: Capacitor.getPlatform(),
                tokenUpdatedAt: new Date().toISOString()
            }, { merge: true });
            console.log("FCM Token saved to database successfully.");
          } catch (e) {
            console.error("Failed to save FCM token", e);
          }
        }
      });

      PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Error on registration: ' + JSON.stringify(error));
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        // Here we could trigger our in-app NotificationSystem
        console.log('Push received: ', notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push action performed: ', notification);
      });
    };

    initPush();

    return () => {
      isMounted = false;
      // We don't strictly remove all listeners on unmount in dev because HMR can break registration,
      // but typically we'd clean them up.
    };
  }, [user]);
}
