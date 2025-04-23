// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB2qo6Ke5O3uJq2aOI1mfV6iGijVH4if50",
  authDomain: "inellisense.firebaseapp.com",
  projectId: "inellisense",
  storageBucket: "inellisense.firebasestorage.app",
  messagingSenderId: "918997348497",
  appId: "1:918997348497:web:527f5b1586884c5d368f30",
  measurementId: "G-5W52M2WV9Q",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
