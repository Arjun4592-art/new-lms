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
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase/config'
import { getUserFromFirestore, logOut } from '@/lib/firebase/auth'
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

// ── Protected paths — inpe bina login ke nahi jaana ──────────────────────
const PROTECTED_PATHS = ['/dashboard', '/admin', '/profile']

// ── Public paths — inpe logged in user ko redirect karo ──────────────────
const PUBLIC_PATHS = ['/login', '/signup', '/verify-email', '/forgot-password']

// ── Provider ──────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LMSUser | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loadUser = useCallback(async (fbUser: User) => {
    try {
      const lmsUser = await getUserFromFirestore(fbUser.uid)
      setUser(lmsUser)
      return lmsUser
    } catch (err) {
      console.error('Failed to load user from Firestore:', err)
      setUser(null)
      return null
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
    router.push('/login')
    router.refresh()
  }, [router])

  // ── Auth state listener ───────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      const currentPath = window.location.pathname

      if (fbUser) {
        setFirebaseUser(fbUser)
        const lmsUser = await loadUser(fbUser)

        // Firebase mein user hai lekin Firestore mein data nahi
        // (deleted user ya corrupted state) — website pe bhejo
        if (!lmsUser) {
          await logOut()
          setUser(null)
          setFirebaseUser(null)
          router.push('/')
          router.refresh()
          setLoading(false)
          return
        }

        const isOnPublicPage = PUBLIC_PATHS.some((p) =>
          currentPath.startsWith(p),
        )

        if (isOnPublicPage) {
          // Email verify nahi hua — verify page pe bhejo
          if (!lmsUser.emailVerified) {
            if (!currentPath.startsWith('/verify-email')) {
              router.push(
                `/verify-email?email=${encodeURIComponent(lmsUser.email)}`,
              )
              router.refresh()
            }
          } else {
            // Email verified — dashboard/admin pe bhejo
            const target = lmsUser.role === 'admin' ? '/admin' : '/dashboard'
            router.push(target)
            router.refresh()
          }
        }
      } else {
        // Firebase mein user nahi hai (logout ya deleted)
        setFirebaseUser(null)
        setUser(null)

        // Protected page pe hai toh website homepage pe bhejo
        const isOnProtectedPage = PROTECTED_PATHS.some((p) =>
          currentPath.startsWith(p),
        )

        if (isOnProtectedPage) {
          router.push('/')
          router.refresh()
        }
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [loadUser, router])

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

export function useAuth() {
  const ctx = useAuthContext()
  return { ...ctx, logOut: ctx.signOut }
}

export default AuthContext
