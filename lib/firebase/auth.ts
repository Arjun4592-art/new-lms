import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  type UserCredential,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './config'
import type { LMSUser, UserRole } from '@/types'

const googleProvider = new GoogleAuthProvider()

// ── Session helpers ───────────────────────────────────────────────────────────

async function setSessionCookie(idToken: string) {
  const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })
  if (!res.ok) throw new Error('Failed to create session')
}

export async function clearSessionCookie() {
  await fetch('/api/auth/session', { method: 'DELETE' })
}

// ── Sign Up with Email ────────────────────────────────────────────────────────

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
  role: UserRole = 'student',
): Promise<LMSUser> {
  const credential: UserCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  )

  await updateProfile(credential.user, { displayName: name })

  const user: LMSUser = {
    uid: credential.user.uid,
    email,
    name,
    photoURL: null,
    role,
    createdAt: new Date().toISOString(),
    enrolledCourses: [],
  }

  await setDoc(doc(db, 'users', credential.user.uid), {
    ...user,
    createdAt: serverTimestamp(),
  })

  const idToken = await credential.user.getIdToken()
  await setSessionCookie(idToken)

  return user
}

// ── Sign In with Email ────────────────────────────────────────────────────────

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<LMSUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const user = await getUserFromFirestore(credential.user.uid)
  if (!user) throw new Error('User record not found. Please sign up.')

  const idToken = await credential.user.getIdToken()
  await setSessionCookie(idToken)

  return user
}

// ── Sign In with Google ───────────────────────────────────────────────────────

export async function signInWithGoogle(
  role: UserRole = 'student',
): Promise<LMSUser> {
  const credential = await signInWithPopup(auth, googleProvider)
  const { uid, email, displayName, photoURL } = credential.user

  const existing = await getUserFromFirestore(uid)

  let user: LMSUser
  if (existing) {
    user = existing
  } else {
    user = {
      uid,
      email: email!,
      name: displayName ?? 'Student',
      photoURL,
      role,
      createdAt: new Date().toISOString(),
      enrolledCourses: [],
    }
    await setDoc(doc(db, 'users', uid), {
      ...user,
      createdAt: serverTimestamp(),
    })
  }

  const idToken = await credential.user.getIdToken()
  await setSessionCookie(idToken)

  return user
}

// ── Sign Out ──────────────────────────────────────────────────────────────────

export async function logOut(): Promise<void> {
  await signOut(auth)
  await clearSessionCookie()
}

// ── Get User from Firestore ───────────────────────────────────────────────────

export async function getUserFromFirestore(
  uid: string,
): Promise<LMSUser | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null

  const data = snap.data()
  return {
    uid: snap.id,
    email: data.email,
    name: data.name,
    photoURL: data.photoURL ?? null,
    role: data.role as UserRole,
    createdAt:
      data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    enrolledCourses: data.enrolledCourses ?? [],
  }
}
