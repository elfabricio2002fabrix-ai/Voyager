import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "voyager-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "voyager-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "voyager-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Providers
const googleProvider = new GoogleAuthProvider()
const facebookProvider = new FacebookAuthProvider()

// Auth Service
export const authService = {
  // Email/Password Sign Up
  async signUp(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update profile
      await updateProfile(user, { displayName })

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        photoURL: user.photoURL || null,
        createdAt: new Date().toISOString(),
        stats: {
          countriesVisited: 0,
          citiesExplored: 0,
          photosUploaded: 0,
          tripsPlanned: 0,
        },
        preferences: {
          currency: 'USD',
          language: 'es',
          notifications: true,
        },
        level: 'Explorer',
        points: 0,
      })

      return { success: true, user }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: error.message }
    }
  },

  // Email/Password Sign In
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: userCredential.user }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: error.message }
    }
  },

  // Google Sign In
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      // Check if user document exists, if not create it
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          provider: 'google',
          stats: {
            countriesVisited: 0,
            citiesExplored: 0,
            photosUploaded: 0,
            tripsPlanned: 0,
          },
          preferences: {
            currency: 'USD',
            language: 'es',
            notifications: true,
          },
          level: 'Explorer',
          points: 0,
        })
      }

      return { success: true, user }
    } catch (error) {
      console.error('Google sign in error:', error)
      return { success: false, error: error.message }
    }
  },

  // Facebook Sign In
  async signInWithFacebook() {
    try {
      const result = await signInWithPopup(auth, facebookProvider)
      const user = result.user

      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          provider: 'facebook',
          stats: {
            countriesVisited: 0,
            citiesExplored: 0,
            photosUploaded: 0,
            tripsPlanned: 0,
          },
          preferences: {
            currency: 'USD',
            language: 'es',
            notifications: true,
          },
          level: 'Explorer',
          points: 0,
        })
      }

      return { success: true, user }
    } catch (error) {
      console.error('Facebook sign in error:', error)
      return { success: false, error: error.message }
    }
  },

  // Sign Out
  async signOut() {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      return { success: false, error: error.message }
    }
  },

  // Password Reset
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (error) {
      console.error('Password reset error:', error)
      return { success: false, error: error.message }
    }
  },

  // Get User Data
  async getUserData(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() }
      }
      return { success: false, error: 'User not found' }
    } catch (error) {
      console.error('Get user data error:', error)
      return { success: false, error: error.message }
    }
  },

  // Update User Data
  async updateUserData(uid, data) {
    try {
      await updateDoc(doc(db, 'users', uid), data)
      return { success: true }
    } catch (error) {
      console.error('Update user data error:', error)
      return { success: false, error: error.message }
    }
  },

  // Auth State Observer
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback)
  },

  // Get Current User
  getCurrentUser() {
    return auth.currentUser
  },
}

export default authService
