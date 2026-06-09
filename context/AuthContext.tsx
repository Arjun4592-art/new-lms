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

interface AuthContextType {
  user: LMSUser | null
  firebaseUser: User | null
  loading: boolean
  isAdmin: boolean
  isStudent: boolean
  refreshUser: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  isAdmin: false,
  isStudent: false,
  refreshUser: async () => {},
  signOut: async () => {},
})

async function createSession(fbUser: User) {
  try {
    const idToken = await fbUser.getIdToken(true)
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    })
  } catch (err) {
    console.error('Failed to create session:', err)
    await logOut()
    await deleteSession()
  }
}

async function deleteSession() {
  try {
    await fetch('/api/auth/session', { method: 'DELETE' })
  } catch (err) {
    console.error('Failed to delete session:', err)
  }
}

const PROTECTED_PATHS = ['/dashboard', '/admin', '/profile']
const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password', '/verify-email']

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
    await deleteSession()
    setUser(null)
    setFirebaseUser(null)
    router.push('/')
    router.refresh()
  }, [router])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      const currentPath = window.location.pathname

      if (fbUser) {
        setFirebaseUser(fbUser)

        const firebaseEmailVerified = fbUser.emailVerified

        if (!firebaseEmailVerified) {
          const firestoreUser = await getUserFromFirestore(fbUser.uid)

          if (!firestoreUser?.emailVerified) {
            setUser(null)
            await deleteSession()
            setLoading(false)

            if (!currentPath.startsWith('/verify-email')) {
              router.push(
                `/verify-email?email=${encodeURIComponent(fbUser.email ?? '')}`,
              )
              router.refresh()
            }
            return
          }
        }

        const lmsUser = await loadUser(fbUser)

        if (!lmsUser) {
          await logOut()
          await deleteSession()
          setUser(null)
          setFirebaseUser(null)
          setLoading(false)
          router.push('/')
          router.refresh()
          return
        }

        // ✅ Session set karo
        await createSession(fbUser)

        // ✅ Loading false karo PEHLE redirect se
        setLoading(false)

        const isOnPublicPage = PUBLIC_PATHS.some((p) =>
          currentPath.startsWith(p),
        )

        if (isOnPublicPage) {
          const target = lmsUser.role === 'admin' ? '/admin' : '/dashboard'
          window.location.href = target
        }
      } else {
        setFirebaseUser(null)
        setUser(null)
        await deleteSession()

        // ✅ Loading false pehle
        setLoading(false)

        const isOnProtectedPage = PROTECTED_PATHS.some((p) =>
          currentPath.startsWith(p),
        )

        if (isOnProtectedPage) {
          router.push('/')
          router.refresh()
        }
      }
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
