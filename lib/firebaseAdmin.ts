import type { Firestore } from 'firebase-admin/firestore';
import type { Auth } from 'firebase-admin/auth';
import type { Messaging } from 'firebase-admin/messaging';

// Lazy loader functions so firebase-admin is only required when an export is actually accessed
let firebaseApp: any = null;

function getOrInitApp() {
  if (firebaseApp) return firebaseApp;
  try {
    const { getApps, initializeApp, cert, getApp } = require('firebase-admin/app');
    if (getApps().length > 0) {
      firebaseApp = getApp();
      return firebaseApp;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (projectId && clientEmail && privateKey) {
      try {
        firebaseApp = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
        return firebaseApp;
      } catch (e) {
        console.warn('[FirebaseAdmin] Failed initializing with cert:', e);
      }
    }

    try {
      firebaseApp = initializeApp({
        projectId: projectId || 'welgpt-c7d90',
      });
      return firebaseApp;
    } catch (e) {
      console.warn('[FirebaseAdmin] Fallback initialization skipped:', e);
      return null;
    }
  } catch (e) {
    console.warn('[FirebaseAdmin] firebase-admin package unavailable:', e);
    return null;
  }
}

// Proxied lazy exports so module load never throws on serverless functions
export const adminDb: Firestore = new Proxy({} as Firestore, {
  get(_target, prop) {
    const app = getOrInitApp();
    if (!app) return () => ({});
    try {
      const { getFirestore } = require('firebase-admin/firestore');
      const db = getFirestore(app);
      const value = (db as any)[prop];
      return typeof value === 'function' ? value.bind(db) : value;
    } catch (e) {
      return () => ({});
    }
  },
});

export const adminAuth: Auth = new Proxy({} as Auth, {
  get(_target, prop) {
    const app = getOrInitApp();
    if (!app) return () => ({});
    try {
      const { getAuth } = require('firebase-admin/auth');
      const auth = getAuth(app);
      const value = (auth as any)[prop];
      return typeof value === 'function' ? value.bind(auth) : value;
    } catch (e) {
      return () => ({});
    }
  },
});

export const adminMessaging: Messaging = new Proxy({} as Messaging, {
  get(_target, prop) {
    const app = getOrInitApp();
    if (!app) return () => ({});
    try {
      const { getMessaging } = require('firebase-admin/messaging');
      const messaging = getMessaging(app);
      const value = (messaging as any)[prop];
      return typeof value === 'function' ? value.bind(messaging) : value;
    } catch (e) {
      return () => ({});
    }
  },
});
