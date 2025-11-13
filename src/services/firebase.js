// =========================
// File: firebase.js
//
// SUMMARY:
// This is the Firebase service configuration file for SplitUp. It initializes Firebase services
// (Authentication and Firestore database) and provides enhanced authentication functions with
// custom admin handling. This file serves as the bridge between our React app and Firebase backend.
//
// WHAT IT DOES:
// - Initializes Firebase app with configuration
// - Sets up Firebase Authentication for user login/signup
// - Sets up Firestore database for storing user and order data
// - Provides enhanced auth functions with admin support
// - Handles user profile creation and updates
//
// WHY IT'S IMPORTANT:
// - Centralizes all Firebase configuration and setup
// - Provides consistent authentication across the app
// - Handles both regular users and special admin users
// - Manages user data storage and retrieval
//
// HOW IT WORKS:
// - Reads Firebase config from environment variables
// - Creates Firebase app instance and services
// - Wraps Firebase auth with custom admin logic
// - Exports configured services for use in components
// =========================

// Import Firebase app initialization function
import { initializeApp } from "firebase/app";
// Import Firebase Authentication functions
import { 
  getAuth,                          // Get auth instance
  GoogleAuthProvider,               // Google OAuth provider
  signInWithPopup,                  // Google sign-in method
  signInWithEmailAndPassword,       // Email/password sign-in
  createUserWithEmailAndPassword,   // Email/password registration
  signOut,                          // Sign out function
  onAuthStateChanged                // Auth state listener
} from "firebase/auth";
// Import Firestore database functions
import { 
  getFirestore,     // Get database instance
  collection,       // Reference to collection
  doc,              // Reference to document
  addDoc,           // Add new document
  getDoc,           // Get single document
  getDocs,          // Get multiple documents
  updateDoc,        // Update existing document
  setDoc,           // Set document data
  query,            // Create database query
  where,            // Query filter
  orderBy,          // Query ordering
  serverTimestamp   // Server-side timestamp
} from "firebase/firestore";

// =========================
// FIREBASE CONFIGURATION
// =========================

// Firebase project configuration object
// Uses environment variables for security, with fallback values for development
const firebaseConfig = {
  // API key for Firebase services authentication
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDkaYijK6hGteSuEi2kZD7OYBKlVftDY-0",
  // Auth domain for Firebase Authentication
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "split-up-d77e1.firebaseapp.com",
  // Project ID for Firestore database
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "split-up-d77e1",
  // Storage bucket for file uploads (not currently used)
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "split-up-d77e1.firebasestorage.app",
  // Messaging sender ID for push notifications (not currently used)
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "118530154667",
  // App ID for Firebase app identification
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:118530154667:web:e7785a297ffd665ffdd7ee"
};

// =========================
// FIREBASE INITIALIZATION
// =========================

// Declare variables for Firebase services
let app, auth, db, googleProvider;

// Initialize Firebase services with error handling
try {
  console.log('🔥 Initializing Firebase');
  
  // Initialize the Firebase app with our configuration
  app = initializeApp(firebaseConfig);
  
  // Get Firebase Authentication service
  auth = getAuth(app);
  
  // Get Firestore database service
  db = getFirestore(app);
  
  // Create Google OAuth provider for Google sign-in
  googleProvider = new GoogleAuthProvider();
  
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  // Log error and throw for proper error handling
  console.error('❌ Firebase initialization failed:', error);
  throw new Error(`Firebase initialization failed: ${error.message}`);
}

// =========================
// ADMIN CONFIGURATION
// =========================

// Special admin credentials for admin portal access
// In production, this should be more secure (environment variables, etc.)
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin';

// Auth wrapper class for Firebase compatibility
class FirebaseAuth {
  constructor() {
    this.currentUser = null;
    this.listeners = [];
    
    onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? user.email : 'No user');
      this.currentUser = user;
      this.listeners.forEach(callback => callback(user));
    });
  }

  onAuthStateChanged(callback) {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  async signOut() {
    console.log('Signing out user');
    localStorage.removeItem('splitup_admin');
    await signOut(auth);
    this.currentUser = null;
    this.listeners.forEach(callback => callback(null));
  }
}

const authInstance = new FirebaseAuth();

// Enhanced sign-in with email and password
const enhancedSignInWithEmailAndPassword = async (authInstance, email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    let userData = result.user;
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      userData = {
        ...userData,
        isAdmin: true,
        isSuperAdmin: true
      };
      localStorage.setItem('splitup_admin', JSON.stringify(userData));
    } else {
      await createOrUpdateUser(userData);
    }
    
    return { user: userData };
  } catch (error) {
    throw error;
  }
};

// Enhanced create user with email and password
const enhancedCreateUserWithEmailAndPassword = async (authInstance, email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const userData = result.user;
    await createOrUpdateUser(userData);
    return { user: userData };
  } catch (error) {
    throw error;
  }
};

// Enhanced Google sign-in
const enhancedSignInWithPopup = async (authInstance, provider) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const userData = result.user;
    await createOrUpdateUser(userData);
    return { user: userData };
  } catch (error) {
    throw error;
  }
};

// Create or update user profile in Firestore
const createOrUpdateUser = async (user) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL || null,
      lastLoginAt: serverTimestamp()
    };
    
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp()
      });
    } else {
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
  }
};

// Helper function for timestamp conversion
const convertTimestamps = (data) => {
  if (data && data.createdAt && typeof data.createdAt.toDate === 'function') {
    data.createdAt = data.createdAt.toDate();
  }
  if (data && data.updatedAt && typeof data.updatedAt.toDate === 'function') {
    data.updatedAt = data.updatedAt.toDate();
  }
  return data;
};

// Export Firebase services
export {
  authInstance as auth,
  db,
  googleProvider,
  enhancedSignInWithPopup as signInWithPopup,
  enhancedSignInWithEmailAndPassword as signInWithEmailAndPassword,
  enhancedCreateUserWithEmailAndPassword as createUserWithEmailAndPassword,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp,
  setDoc,
  getDoc
};
