"use client";

import { useEffect, useState } from 'react';
import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';
import { useAuth } from './AuthContext';

export function useRevenueCat() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    if (Capacitor.getPlatform() === 'web') return; // RevenueCat is native mobile only for this plugin

    const initRevenueCat = async () => {
      try {
        await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });

        // Configure with Apple/Google API keys
        if (Capacitor.getPlatform() === 'ios') {
          await Purchases.configure({ apiKey: process.env.NEXT_PUBLIC_RC_IOS_KEY || 'appl_YOUR_KEY' });
        } else if (Capacitor.getPlatform() === 'android') {
          await Purchases.configure({ apiKey: process.env.NEXT_PUBLIC_RC_ANDROID_KEY || 'goog_YOUR_KEY' });
        }

        if (user?.uid) {
          await Purchases.logIn({ appUserID: user.uid });
        }

        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
          setPackages(offerings.current.availablePackages);
        }

        const customerInfo = await Purchases.getCustomerInfo();
        if (typeof customerInfo.entitlements.active['Premium'] !== "undefined") {
          setIsPremium(true);
        }
      } catch (e) {
        console.error("RevenueCat Init Error", e);
      }
    };

    initRevenueCat();
  }, [user]);

  const purchasePackage = async (pack: any) => {
    if (Capacitor.getPlatform() === 'web') {
      alert("Please download the iOS/Android app to purchase Premium.");
      return false;
    }
    
    try {
      const { customerInfo } = await Purchases.purchasePackage({ aPackage: pack });
      if (typeof customerInfo.entitlements.active['Premium'] !== "undefined") {
        setIsPremium(true);
        return true;
      }
    } catch (e) {
      console.error("Purchase Failed", e);
    }
    return false;
  };

  const restorePurchases = async () => {
    try {
      const customerInfo = await Purchases.restorePurchases();
      if (typeof customerInfo.entitlements.active['Premium'] !== "undefined") {
        setIsPremium(true);
        return true;
      }
    } catch (e) {
      console.error("Restore Failed", e);
    }
    return false;
  };

  return { isPremium, packages, purchasePackage, restorePurchases };
}
