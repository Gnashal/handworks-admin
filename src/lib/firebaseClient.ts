import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Messaging, getMessaging, isSupported } from "firebase/messaging";

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_APP_ID ?? "",
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

export const firebaseVapidKey =
  process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? "";

function hasRequiredFirebaseConfig(config: FirebaseConfig): boolean {
  return Boolean(
    config.apiKey &&
    config.authDomain &&
    config.projectId &&
    config.storageBucket &&
    config.messagingSenderId &&
    config.appId,
  );
}

function getOrCreateFirebaseApp(): FirebaseApp | null {
  if (!hasRequiredFirebaseConfig(firebaseConfig)) {
    return null;
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export async function getMessagingIfSupported(): Promise<Messaging | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const app = getOrCreateFirebaseApp();
  if (!app) {
    return null;
  }

  const supported = await isSupported();
  if (!supported) {
    return null;
  }

  return getMessaging(app);
}
