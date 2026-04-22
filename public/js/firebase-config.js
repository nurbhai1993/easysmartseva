// firebase-config.js (Eti apnar central configuration file)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDZk3xpBUZySq3rgQCG1hQP9Hjpa3U5Fu4",
  authDomain: "easysmartseva.firebaseapp.com",
  projectId: "easysmartseva",
  storageBucket: "easysmartseva.firebasestorage.app",
  messagingSenderId: "656809368255",
  appId: "1:656809368255:web:05795b3de86d3191bb440a",
  measurementId: "G-GWQ1CNXCS9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);      // Database-er jonno
export const auth = getAuth(app);        // Login/Security-r jonno
export const storage = getStorage(app);  // Image ba File upload-er jonno
export const analytics = getAnalytics(app); // Traffic track korar jonno

export default app;