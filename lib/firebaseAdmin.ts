import { getApps, initializeApp, cert, getApp } from 'firebase-admin/app';
import type { App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getMessaging, type Messaging } from 'firebase-admin/messaging';

let cachedApp: App | null = null;

function getOrInitApp(): App | null {
  if (cachedApp) return cachedApp;
  if (getApps().length > 0) {
    cachedApp = getApp();
    return cachedApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || 'welgpt-c7d90';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    try {
      cachedApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      return cachedApp;
    } catch (e) {
      console.warn('[FirebaseAdmin] Failed initializing with cert:', e);
    }
  }

  // Graceful fallback for build-time evaluation or environments without full private keys
  try {
    cachedApp = initializeApp({
      projectId,
    });
    return cachedApp;
  } catch (e) {
    console.warn('[FirebaseAdmin] Fallback initialization skipped:', e);
    return null;
  }
}

// Proxied lazy exports so build-time imports and static page collection never throw
export const adminDb: Firestore = new Proxy({} as Firestore, {
  get(_target, prop) {
    const app = getOrInitApp();
    if (!app) {
      return () => ({});
    }
    const db = getFirestore(app);
    const value = (db as any)[prop];
    return typeof value === 'function' ? value.bind(db) : value;
  },
});

export const adminAuth: Auth = new Proxy({} as Auth, {
  get(_target, prop) {
    const app = getOrInitApp();
    if (!app) {
      return () => ({});
    }
    const auth = getAuth(app);
    const value = (auth as any)[prop];
    return typeof value === 'function' ? value.bind(auth) : value;
  },
});

export const adminMessaging: Messaging = new Proxy({} as Messaging, {
  get(_target, prop) {
    const app = getOrInitApp();
    if (!app) {
      return () => ({});
    }
    const messaging = getMessaging(app);
    const value = (messaging as any)[prop];
    return typeof value === 'function' ? value.bind(messaging) : value;
  },
});

