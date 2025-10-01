// analytics.ts
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, logEvent, isSupported, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBJVgc6T62-SCPzb4MhI-vLF9b4Nuhgy6o",
  authDomain: "qanoonmate-project.firebaseapp.com",
  projectId: "qanoonmate-project",
  storageBucket: "qanoonmate-project.firebasestorage.app",
  messagingSenderId: "380906697875",
  appId: "1:380906697875:web:834d02f5cdc7dd5b570966",
  measurementId: "G-FFX5P5E4Z7"
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
