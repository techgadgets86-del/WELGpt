"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";

const VISITOR_ID_KEY = "welgpt_analytics_visitor_id";
const SESSION_ID_KEY = "welgpt_analytics_session_id";
const SESSION_START_KEY = "welgpt_analytics_session_start";

function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = `vis_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    sessionStorage.setItem(SESSION_START_KEY, Date.now().toString());
  }
  return sessionId;
}

// Global function to track feature interaction anywhere in the app
export function trackFeature(featureName: string, metadata?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const sessionId = getOrCreateSessionId();
  const visitorId = getOrCreateVisitorId();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      visitorId,
      feature: featureName,
      timezone: tz,
      metadata,
    }),
    keepalive: true,
  }).catch(() => {});
}

// Global function to log security event from client actions
export function reportSecurityEvent(
  type: string,
  severity: "INFO" | "LOW" | "WARN" | "HIGH" | "CRITICAL",
  description: string,
  status: "ALLOWED" | "BLOCKED" | "FLAGGED" = "ALLOWED"
) {
  if (typeof window === "undefined") return;

  fetch("/api/security/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type,
      severity,
      description,
      status,
    }),
    keepalive: true,
  }).catch(() => {});
}

/**
 * Top-level Tracker Component mounted in AppLayout
 */
export default function AnalyticsTracker() {
  const pathname = usePathname();
  const { user } = useAuth();
  const activeSecondsRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  // Initialize session and send pageview on navigation
  useEffect(() => {
    if (typeof window === "undefined") return;

    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Send pageview track
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        visitorId,
        userId: user?.uid || null,
        userEmail: user?.email || null,
        page: pathname,
        timezone: tz,
        durationSeconds: activeSecondsRef.current,
        source: "app",
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname, user]);

  // Session duration timer and visibility monitor
  useEffect(() => {
    if (typeof window === "undefined") return;

    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Handle tab focus / blur (pause tracking when user tabs away)
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === "visible";
      if (!isVisibleRef.current) {
        // Tab hidden: flush current duration beacon
        const payload = JSON.stringify({
          sessionId,
          visitorId,
          durationSeconds: activeSecondsRef.current,
          timezone: tz,
        });
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/analytics/track", payload);
        } else {
          fetch("/api/analytics/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Active seconds counter (ticks every second while tab is visible)
    const secondInterval = setInterval(() => {
      if (isVisibleRef.current) {
        activeSecondsRef.current += 1;
      }
    }, 1000);

    // Heartbeat sync to server every 25 seconds
    const heartbeatInterval = setInterval(() => {
      if (isVisibleRef.current && activeSecondsRef.current > 0) {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            visitorId,
            userId: user?.uid || null,
            userEmail: user?.email || null,
            durationSeconds: activeSecondsRef.current,
            timezone: tz,
          }),
          keepalive: true,
        }).catch(() => {});
      }
    }, 25000);

    // Unload beacon
    const handleBeforeUnload = () => {
      const payload = JSON.stringify({
        sessionId,
        visitorId,
        durationSeconds: activeSecondsRef.current,
        timezone: tz,
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics/track", payload);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(secondInterval);
      clearInterval(heartbeatInterval);
    };
  }, [user]);

  return null;
}
