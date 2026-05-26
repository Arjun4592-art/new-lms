'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import {
  getUserFromFirestore,
  logOut as firebaseLogOut,
} from '@/lib/firebase/auth'
import type { LMSUser } from '@/types'

// ── Types ─────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: LMSUser | null
  loading: boolean
  logOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LMSUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch fresh user data from Firestore
  const refreshUser = useCallback(async () => {
    const firebaseUser = auth.currentUser
    if (!firebaseUser) return
    const lmsUser = await getUserFromFirestore(firebaseUser.uid)
    setUser(lmsUser)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Force token refresh to ensure auth is ready
        await firebaseUser.getIdToken(true)
        const lmsUser = await getUserFromFirestore(firebaseUser.uid)
        setUser(lmsUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const logOut = useCallback(async () => {
    await firebaseLogOut()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, logOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
