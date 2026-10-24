import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCVR1-faoqsjvPl4OTrig-xaZ3J-iIhefE",
  authDomain: "blooddonnerapp-7ab93.firebaseapp.com",
  projectId: "blooddonnerapp-7ab93",
  storageBucket: "blooddonnerapp-7ab93.firebasestorage.app",
  messagingSenderId: "676794948574",
  appId: "1:676794948574:web:b0822d8de7c4af32a7db4f",
  measurementId: "G-QZ72YXTGP2"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export default app;
export { db, storage, auth };
