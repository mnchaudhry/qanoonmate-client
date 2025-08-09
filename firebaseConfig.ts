// analytics.ts
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, logEvent, isSupported, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBPryOZPOW6rIpXHX9AyVbCFUbcVfLQRX8",
  authDomain: "qanoonmate-599f1.firebaseapp.com",
  projectId: "qanoonmate-599f1",
  storageBucket: "qanoonmate-599f1.firebasestorage.app",
  messagingSenderId: "718398621092",
  appId: "1:718398621092:web:6e599097dd1765a5e8ed31",
  measurementId: "G-J9PW4HD7GC",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) analytics = getAnalytics(app);
  });
}

export function trackChatbotEvent(action: string, params?: Record<string, any>) {
  if (analytics) {
    logEvent(analytics, `chatbot_${action}`, params);
  }
}

export function trackKnowledgeBaseEvent(action: string, params?: Record<string, any>) {
  if (analytics) {
    logEvent(analytics, `knowledgebase_${action}`, params);
  }
}

export { analytics, app };
