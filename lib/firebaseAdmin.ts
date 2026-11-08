import { getApps, initializeApp, cert, getApp } from 'firebase-admin/app';
import type { App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getMessaging, type Messaging } from 'firebase-admin/messaging';

function getOrInitApp(): App | null {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    try {
      return initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (e) {
      console.warn('[FirebaseAdmin] Failed initializing with cert:', e);
    }
  }

  try {
    return initializeApp({
      projectId: projectId || 'welgpt-c7d90',
    });
  } catch (e) {
    console.warn('[FirebaseAdmin] Fallback initialization skipped:', e);
    return null;
  }
}

// Proxied lazy exports so module load never throws on serverless functions without env vars
export const adminDb: Firestore = new Proxy({} as Firestore, {
  get(_target, prop) {
    const app = getOrInitApp();
    if (!app) return () => ({});
    const db = getFirestore(app);
    const value = (db as any)[prop];
    return typeof value === 'function' ? value.bind(db) : value;
  },
});

export const adminAuth: Auth = new Proxy({} as Auth, {
  get(_target, prop) {
    const app = getOrInitApp();
    if (!app) return () => ({});
    const auth = getAuth(app);
    const value = (auth as any)[prop];
    return typeof value === 'function' ? value.bind(auth) : value;
  },
});

export const adminMessaging: Messaging = new Proxy({} as Messaging, {
  get(_target, prop) {
    const app = getOrInitApp();
    if (!app) return () => ({});
    const messaging = getMessaging(app);
    const value = (messaging as any)[prop];
    return typeof value === 'function' ? value.bind(messaging) : value;
  },
});
