// ==============================================================================
// WelBuddy Advanced Notification & Lock-Screen Manager
// ==============================================================================
"use client";

import { Capacitor } from '@capacitor/core';
import { VAPID_PUBLIC_KEY } from './vapidConfig';

export interface NotificationPreferences {
  morningAlert: boolean;
  morningTime: string; // e.g. "07:30"
  middayFocus: boolean;
  middayTime: string; // e.g. "13:00"
  routineExercises: boolean;
  eveningDownregulation: boolean;
  eveningTime: string; // e.g. "21:30"
  hydrationNudges: boolean;
  hydrationFrequencyHours: number; // e.g. 2
  lockScreenEnabled: boolean;
}

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  morningAlert: true,
  morningTime: "07:30",
  middayFocus: true,
  middayTime: "13:00",
  routineExercises: true,
  eveningDownregulation: true,
  eveningTime: "21:30",
  hydrationNudges: true,
  hydrationFrequencyHours: 2,
  lockScreenEnabled: true,
};

const STORAGE_KEY_PREFS = 'welbuddy_notification_preferences';
const STORAGE_KEY_SUB = 'welbuddy_webpush_subscription';

/**
 * Converts a Base64-URL string to a Uint8Array for VAPID applicationServerKey
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Check if the browser or platform supports notifications & service workers
 */
export function isNotificationSupported(): boolean {
  if (typeof window === 'undefined') return false;
  if (Capacitor.isNativePlatform()) return true;
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Check if Web Push PushManager is available
 */
export function isPushManagerSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'PushManager' in window && 'serviceWorker' in navigator;
}

/**
 * Check if app is running as standalone PWA
 */
export function isStandalonePWA(): boolean {
  if (typeof window === 'undefined') return false;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isNavStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true;
  return isStandalone || isNavStandalone || Capacitor.isNativePlatform();
}

/**
 * Check if user is on iOS
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
}

/**
 * Check if user is on Android
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
}

/**
 * Get current system permission status
 */
export function getPermissionStatus(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined') return 'unsupported';
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

/**
 * Register Service Worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    await navigator.serviceWorker.ready;
    return reg;
  } catch (err) {
    console.error('[WelBuddy Notifications] SW Registration failed:', err);
    return null;
  }
}

/**
 * Request notification permission from the system
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported';

  // Native Capacitor platform
  if (Capacitor.isNativePlatform()) {
    try {
      const { PushNotifications } = await import('@capacitor/push-notifications');
      const res = await PushNotifications.requestPermissions();
      return res.receive === 'granted' ? 'granted' : 'denied';
    } catch (e) {
      console.warn('[WelBuddy Notifications] Native request error:', e);
    }
  }

  // Web platform
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch (err) {
    console.error('[WelBuddy Notifications] Permission request error:', err);
    return 'denied';
  }
}

/**
 * Subscribe user device to Web Push
 */
export async function subscribeToWebPush(userId?: string): Promise<{ success: boolean; subscription?: PushSubscription; error?: string }> {
  if (!isPushManagerSupported()) {
    return { success: false, error: 'Web Push is not supported in this browser environment' };
  }

  try {
    const perm = await requestNotificationPermission();
    if (perm !== 'granted') {
      return { success: false, error: 'Notification permission was not granted by user' };
    }

    const reg = await registerServiceWorker();
    if (!reg) {
      return { success: false, error: 'Service Worker could not be activated' };
    }

    // Check existing subscription
    let sub = await reg.pushManager.getSubscription();

    if (!sub) {
      const appServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: appServerKey as any,
      });
    }

    // Persist subscription locally
    const subJson = sub.toJSON();
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_SUB, JSON.stringify(subJson));
    }

    // Send subscription to server
    try {
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: subJson,
          userId: userId || 'anonymous',
          platform: isStandalonePWA() ? 'pwa' : isIOS() ? 'ios_web' : isAndroid() ? 'android_web' : 'desktop_web',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          preferences: getNotificationPreferences(),
        }),
      });
    } catch (apiErr) {
      console.warn('[WelBuddy Notifications] Server sync deferred:', apiErr);
    }

    return { success: true, subscription: sub };
  } catch (err: unknown) {
    console.error('[WelBuddy Notifications] Web Push subscribe failed:', err);
    const msg = err instanceof Error ? err.message : 'Subscription error';
    return { success: false, error: msg };
  }
}

/**
 * Retrieve saved local push subscription
 */
export function getSavedSubscription(): PushSubscriptionJSON | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUB);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Get notification preferences
 */
export function getNotificationPreferences(): NotificationPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFS);
    return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Save notification preferences
 */
export function saveNotificationPreferences(prefs: Partial<NotificationPreferences>): NotificationPreferences {
  const current = getNotificationPreferences();
  const updated = { ...current, ...prefs };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('welbuddy_notification_prefs_updated', { detail: updated }));
  }
  return updated;
}

/**
 * Test Lock-Screen Notification with 5-second countdown
 * Works by scheduling via the active Service Worker background thread
 * AND dispatching a high-urgency delayed push from the server so the screen wakes up!
 */
export async function testLockScreenNotification(options?: {
  delaySeconds?: number;
  title?: string;
  message?: string;
  url?: string;
  userId?: string;
}): Promise<{ success: boolean; message: string }> {
  const delaySeconds = options?.delaySeconds ?? 5;
  const delayMs = delaySeconds * 1000;
  const title = options?.title || 'WelBuddy AI • Lock Screen Active 🔒';
  const body = options?.message || 'Tap to review your executive tasks & routine exercises.';
  const url = options?.url || '/coach?tab=tasks';

  // 1. Ensure permission is granted
  const perm = await requestNotificationPermission();
  if (perm !== 'granted') {
    return {
      success: false,
      message: 'System notification permission is required. Please enable notifications in your browser settings.',
    };
  }

  // 2. Trigger Haptic Vibration warning so user knows the countdown started
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([100, 50, 100]);
    } catch {
      // Ignore vibration errors
    }
  }

  // 3. Native Capacitor Local Notification Schedule
  if (Capacitor.isNativePlatform()) {
    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      await LocalNotifications.schedule({
        notifications: [
          {
            title: title,
            body: body,
            id: Math.floor(Math.random() * 100000),
            schedule: { at: new Date(Date.now() + delayMs) },
            sound: 'beep.wav',
            extra: { url },
          },
        ],
      });
      return {
        success: true,
        message: `Scheduled! Lock your screen now. The notification will arrive in ${delaySeconds} seconds.`,
      };
    } catch (e) {
      console.warn('[WelBuddy] Native local notification error:', e);
    }
  }

  // 4. Web Service Worker Background Promise (fires even when screen is locked)
  const reg = await registerServiceWorker();
  if (reg && reg.active) {
    reg.active.postMessage({
      type: 'SCHEDULE_LOCKSCREEN_NOTIFICATION',
      delayMs: delayMs,
      title: title,
      body: body,
      url: url,
    });
  }

  // 5. Remote Web Push Server Delay Trigger (Fail-safe for closed apps)
  const savedSub = getSavedSubscription();
  if (savedSub && savedSub.endpoint) {
    try {
      fetch('/api/notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: savedSub,
          delaySeconds: delaySeconds,
          title: title,
          message: body,
          url: url,
        }),
      }).catch((e) => console.warn('[WelBuddy] Server test push error:', e));
    } catch {
      // Non-blocking
    }
  }

  return {
    success: true,
    message: `Lock your phone screen now! Your WelBuddy alert will light up your screen in ${delaySeconds} seconds.`,
  };
}
