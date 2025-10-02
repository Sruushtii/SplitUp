// Firebase service for SplitUp - handles authentication and database operations
import { initializeApp } from "firebase/app";
import { 
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { 
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDkaYijK6hGteSuEi2kZD7OYBKlVftDY-0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "split-up-d77e1.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "split-up-d77e1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "split-up-d77e1.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "118530154667",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:118530154667:web:e7785a297ffd665ffdd7ee"
};

// Initialize Firebase services
let app, auth, db, googleProvider;

try {
  console.log('🔥 Initializing Firebase');
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw new Error(`Firebase initialization failed: ${error.message}`);
}

// Admin configuration
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
