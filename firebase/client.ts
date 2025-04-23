'use client';

// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Using hardcoded config to avoid environment variable issues
const firebaseConfig = {
  apiKey: "AIzaSyA8h42xzrX_cGIGOs3TwiMHaAHLBQnqoKw",
  authDomain: "ai-interview-app-295bb.firebaseapp.com",
  projectId: "ai-interview-app-295bb",
  storageBucket: "ai-interview-app-295bb.firebasestorage.app",
  messagingSenderId: "475840663322",
  appId: "1:475840663322:web:599a40bbaa41e6f80da6a3"
};

// Initialize Firebase - only in browser
let auth: Auth | undefined;
let db: Firestore | undefined;
let isInitializing = false;
let isInitialized = false;

// Safely initialize Firebase with retry mechanism
const initializeFirebase = () => {
  // Skip if not in browser
  if (typeof window === 'undefined') return { auth: undefined, db: undefined };
  
  // Skip if already initialized
  if (isInitialized && auth && db) return { auth, db };
  
  // Skip if currently initializing
  if (isInitializing) return { auth, db };
  
  isInitializing = true;
  
  try {
    // Initialize Firebase app
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    
    // Initialize auth
    try {
      auth = getAuth(app);
    } catch (authError) {
      console.error('Failed to initialize Firebase Auth:', authError);
    }
    
    // Initialize Firestore
    try {
      db = getFirestore(app);
    } catch (dbError) {
      console.error('Failed to initialize Firestore:', dbError);
    }
    
    isInitialized = true;
    isInitializing = false;
    return { auth, db };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    isInitializing = false;
    return { auth: undefined, db: undefined };
  }
};

// Detect browser for Edge-specific fixes
const isEdgeBrowser = () => {
  if (typeof window === 'undefined') return false;
  return navigator.userAgent.indexOf("Edg") !== -1;
};

// Only initialize in browser
if (typeof window !== 'undefined') {
  // Use a longer timeout for Edge to ensure proper initialization
  const timeoutDelay = isEdgeBrowser() ? 100 : 0;
  
  // Use setTimeout to ensure this runs after hydration
  setTimeout(() => {
    initializeFirebase();
  }, timeoutDelay);
}

// Safe getter functions to prevent isolation errors
export const getFirebaseAuth = (): Auth | undefined => {
  if (typeof window === 'undefined') return undefined;
  
  if (!auth) {
    // Initialize Firebase if not already initialized
    initializeFirebase();
  }
  
  return auth;
};

export const getFirebaseDb = (): Firestore | undefined => {
  if (typeof window === 'undefined') return undefined;
  
  if (!db) {
    // Initialize Firebase if not already initialized
    initializeFirebase();
  }
  
  return db;
};

// Helper function to get both auth and db
export const getFirebaseInstances = () => {
  if ((!auth || !db) && typeof window !== 'undefined') {
    initializeFirebase();
  }
  return { auth, db };
};

// Initialize Firebase on load, but don't export the instances directly
if (typeof window !== 'undefined') {
  // Use setTimeout to delay initialization slightly, avoiding isolation errors
  setTimeout(() => {
    initializeFirebase();
  }, 10);
}
