import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZD3pVM4FFiRbxRDhzOdeI-Ksg4IoSl1o",
  authDomain: "welgpt-c7d90.firebaseapp.com",
  projectId: "welgpt-c7d90",
  storageBucket: "welgpt-c7d90.firebasestorage.app",
  messagingSenderId: "89627019187",
  appId: "1:89627019187:web:ca3611d25f6685a2472dc6"
};

// Initialize Firebase (prevent double initialization in Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

let db;
if (!getApps().length) {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
  });
} else {
  db = getFirestore(app);
}
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
