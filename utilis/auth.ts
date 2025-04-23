'use client';

import { getFirebaseAuth, getFirebaseDb } from '@/firebase/client';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  UserCredential,
  onAuthStateChanged,
  Auth
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, Firestore } from 'firebase/firestore';

// Safely get Firebase instances with error handling
const getFirebaseInstances = () => {
  // Make sure we're in a browser environment
  if (typeof window === 'undefined') {
    throw new Error('Firebase can only be used in the browser');
  }
  
  // Get Firebase instances using the safe getters
  const auth = getFirebaseAuth();
  const db = getFirebaseDb();
  
  // Make sure both instances are available
  if (!auth || !db) {
    throw new Error('Firebase is not initialized yet');
  }
  
  return { auth, db };
};

// Type for signup parameters
export type SignupParams = {
  name: string;
  email: string;
  password: string;
};

// Type for signin parameters
export type SigninParams = {
  email: string;
  password: string;
};

// Check if user is authenticated
export const isAuthenticated = (): Promise<boolean> => {

  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }
  
  // First check for the auth cookie as a fast path
  try {
    if (document.cookie.includes('auth-token')) {
      return Promise.resolve(true);
    }
  } catch (cookieError) {
    console.warn('Error checking auth cookie:', cookieError);
  }
  
  // Then try to check Firebase auth state
  try {
    const auth = getFirebaseAuth();
    if (!auth) return Promise.resolve(false);
    
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(!!user);
      });
      
      // Set a timeout to prevent hanging
      setTimeout(() => {
        resolve(false);
      }, 2000);
    });
  } catch (error) {
    console.error('Error checking authentication:', error);
    return Promise.resolve(false);
  }
};

// Signup user with Firebase and save to Firestore
export const signupUser = async ({ name, email, password }: SignupParams) => {
 
  if (typeof window === 'undefined') {
    return { success: false, message: 'Cannot sign up server-side' };
  }
  
  try {
    // Set auth cookie first - this ensures middleware works even if Firebase has issues
    setAuthCookie();
    
    // Get Firebase instances
    const { auth, db } = getFirebaseInstances();
    
    if (!auth) {
      return { success: false, message: 'Authentication service is not available' };
    }
    
    // Create user in Firebase Auth
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with name
    await updateProfile(user, {
      displayName: name
    });
    
    // Try to save user data to Firestore, but don't fail if it doesn't work
    if (db) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name,
          email,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
      } catch (firestoreError) {
        // Log the error but continue with authentication
        console.warn('Could not save user data to Firestore:', firestoreError);
      }
    }
    
    return { success: true, uid: user.uid };
  } catch (error: any) {
    console.error('Error during signup:', error);
    
    // Make sure to clear the auth cookie if signup fails
    removeAuthCookie();
    
    return { 
      success: false, 
      message: error.message || 'Failed to create account. Please try again.'
    };
  }
};

// Signin user with Firebase
export const signinUser = async ({ email, password }: SigninParams) => {

  if (typeof window === 'undefined') {
    return { success: false, message: 'Cannot sign in server-side' };
  }
  
  try {
    // Get Firebase instances
    const { auth, db } = getFirebaseInstances();
    
    // Sign in with Firebase Auth
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Try to update last login time in Firestore, but don't fail if it doesn't work
    if (db) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          await setDoc(userRef, {
            lastLogin: serverTimestamp()
          }, { merge: true });
        }
      } catch (firestoreError) {
        // Log the error but continue with authentication
        console.warn('Could not update user data in Firestore:', firestoreError);
      }
    }
    
    // Set auth cookie for middleware
    document.cookie = `auth-token=authenticated; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
    
    return { success: true, uid: user.uid };
  } catch (error: any) {
    console.error('Error during signin:', error);
    
    // Make sure to clear the auth cookie if signin fails
    try {
      document.cookie = "auth-token=; expires=Thu, 1 Jan 1970 00:00:00 UTC; path=/;";
    } catch (cookieError) {}
    
    return { 
      success: false, 
      message: error.message || 'Failed to sign in. Please check your credentials.'
    };
  }
};

// Detect if we're in Microsoft Edge
const isEdgeBrowser = () => {
  if (typeof window === 'undefined') return false;
  return navigator.userAgent.indexOf("Edg") !== -1;
};

// Simple function to set the auth cookie
export const setAuthCookie = () => {
  if (typeof document === 'undefined') return;
  document.cookie = `auth-token=authenticated; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
};

// Simple function to remove the auth cookie
export const removeAuthCookie = () => {
  if (typeof document === 'undefined') return;
  document.cookie = "auth-token=; expires=Thu, 1 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "auth-token=; path=/; max-age=0";
};

// Logout user - client-side only function
export const logout = () => {
  // Make sure we're in a browser environment
  if (typeof window === 'undefined') {
    return;
  }
  
  // First, remove the auth cookie - this is what the middleware checks
  removeAuthCookie();
  
  // Clear any Firebase data from storage
  try {
    sessionStorage.removeItem('firebase:authUser');
    localStorage.removeItem('firebase:authUser');
    localStorage.removeItem('auth_in_progress');
  } catch (e) {}
  
  // Try to sign out of Firebase - but don't wait for it
  try {
    const auth = getFirebaseAuth();
    if (auth) {
      // Fire and forget - don't await this
      signOut(auth).catch(() => {});
    }
  } catch (e) {}
  
  // Navigate to signin page after a delay
  setTimeout(() => {
    try {
      window.location.replace("/signin");
    } catch (e) {
      // Fallback to reload
      window.location.reload();
    }
  }, 300);
};