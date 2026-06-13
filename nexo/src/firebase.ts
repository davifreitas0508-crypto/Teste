import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDW9rNctaWGWNKTdxPrgXy8HBoB7zWt_Ek",
  authDomain: "nexo-19a0c.firebaseapp.com",
  projectId: "nexo-19a0c",
  storageBucket: "nexo-19a0c.firebasestorage.app",
  messagingSenderId: "131837171232",
  appId: "1:131837171232:web:808c4a796c590c28fb0e45"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
