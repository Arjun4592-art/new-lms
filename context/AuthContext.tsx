'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { getUserFromFirestore } from '@/lib/firebase/auth'
import { logOut } from '@/lib/firebase/auth'
import type { LMSUser } from '@/types'

// ── Types ─────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: LMSUser | null
  firebaseUser: User | null
  loading: boolean
  isAdmin: boolean
  isStudent: boolean
  refreshUser: () => Promise<void>
  signOut: () => Promise<void>
}

// ── Context ───────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  isAdmin: false,
  isStudent: false,
  refreshUser: async () => {},
  signOut: async () => {},
})

// ── Provider ──────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LMSUser | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async (fbUser: User) => {
    try {
      const lmsUser = await getUserFromFirestore(fbUser.uid)
      setUser(lmsUser)
    } catch (err) {
      console.error('Failed to load user from Firestore:', err)
      setUser(null)
    }
  }, [])

  const refreshUser = useCallback(async () => {
    if (!firebaseUser) return
    await loadUser(firebaseUser)
  }, [firebaseUser, loadUser])

  const handleSignOut = useCallback(async () => {
    await logOut()
    setUser(null)
    setFirebaseUser(null)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser)
        await loadUser(fbUser)
      } else {
        setFirebaseUser(null)
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [loadUser])

  const isAdmin = user?.role === 'admin'
  const isStudent = user?.role === 'student'

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isAdmin,
        isStudent,
        refreshUser,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used inside AuthProvider')
  }
  return context
}

// Legacy hook alias — keeps existing imports working
export function useAuth() {
  const ctx = useAuthContext()
  return { ...ctx, logOut: ctx.signOut }
}

export default AuthContext
