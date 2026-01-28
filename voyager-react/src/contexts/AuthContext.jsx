import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/auth'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Load user data from Firestore
        const result = await authService.getUserData(firebaseUser.uid)
        if (result.success) {
          setUserData(result.data)
        }
      } else {
        setUser(null)
        setUserData(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    setError(null)
    const result = await authService.signIn(email, password)
    if (!result.success) {
      setError(result.error)
    }
    return result
  }

  const signUp = async (email, password, displayName) => {
    setError(null)
    const result = await authService.signUp(email, password, displayName)
    if (!result.success) {
      setError(result.error)
    }
    return result
  }

  const signInWithGoogle = async () => {
    setError(null)
    const result = await authService.signInWithGoogle()
    if (!result.success) {
      setError(result.error)
    }
    return result
  }

  const signInWithFacebook = async () => {
    setError(null)
    const result = await authService.signInWithFacebook()
    if (!result.success) {
      setError(result.error)
    }
    return result
  }

  const signOut = async () => {
    setError(null)
    const result = await authService.signOut()
    if (!result.success) {
      setError(result.error)
    }
    return result
  }

  const resetPassword = async (email) => {
    setError(null)
    const result = await authService.resetPassword(email)
    if (!result.success) {
      setError(result.error)
    }
    return result
  }

  const updateUser = async (data) => {
    if (!user) return { success: false, error: 'No user logged in' }
    
    const result = await authService.updateUserData(user.uid, data)
    if (result.success) {
      setUserData({ ...userData, ...data })
    }
    return result
  }

  const value = {
    user,
    userData,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
    resetPassword,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
