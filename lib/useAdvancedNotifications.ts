"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import {
  getPermissionStatus,
  registerServiceWorker,
  subscribeToWebPush,
  isStandalonePWA,
  isIOS,
  isAndroid,
  isNotificationSupported,
  testLockScreenNotification,
  getNotificationPreferences,
  saveNotificationPreferences,
  NotificationPreferences,
} from "./advancedNotifications";

export function useAdvancedNotifications() {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>(getNotificationPreferences());

  useEffect(() => {
    setIsSupported(isNotificationSupported());
    setPermission(getPermissionStatus());
    setIsPWA(isStandalonePWA());

    // Auto-register service worker on startup
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      registerServiceWorker().then((reg) => {
        if (reg) {
          reg.pushManager.getSubscription().then((sub) => {
            setIsSubscribed(!!sub);
            // If already permitted but subscription needs refresh
            if (sub && user && !user.isAnonymous) {
              subscribeToWebPush(user.uid);
            }
          });
        }
      });
    }

    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener("welbuddy_open_notifications_modal", handleOpenModal);

    const handlePrefsUpdated = (e: any) => {
      if (e.detail) setPreferences(e.detail);
    };
    window.addEventListener("welbuddy_notification_prefs_updated", handlePrefsUpdated);

    return () => {
      window.removeEventListener("welbuddy_open_notifications_modal", handleOpenModal);
      window.removeEventListener("welbuddy_notification_prefs_updated", handlePrefsUpdated);
    };
  }, [user]);

  const enableNotifications = useCallback(async () => {
    const res = await subscribeToWebPush(user?.uid);
    setPermission(getPermissionStatus());
    if (res.success) {
      setIsSubscribed(true);
    }
    return res;
  }, [user]);

  const updatePreferences = useCallback((newPrefs: Partial<NotificationPreferences>) => {
    const updated = saveNotificationPreferences(newPrefs);
    setPreferences(updated);
  }, []);

  const triggerLockScreenTest = useCallback(async (delaySeconds: number = 5) => {
    return await testLockScreenNotification({
      delaySeconds,
      userId: user?.uid,
    });
  }, [user]);

  return {
    permission,
    isSubscribed,
    isPWA,
    isSupported,
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isModalOpen,
    setIsModalOpen,
    preferences,
    updatePreferences,
    enableNotifications,
    triggerLockScreenTest,
  };
}
