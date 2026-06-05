import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
  type UserCredential,
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { auth, db } from './config'
import type { LMSUser, UserRole } from '@/types'

const googleProvider = new GoogleAuthProvider()

// ── Session helpers ───────────────────────────────────────────────────────

async function setSessionCookie(idToken: string): Promise<void> {
  const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })
  if (!res.ok) throw new Error('Failed to create session')
}

export async function clearSessionCookie(): Promise<void> {
  await fetch('/api/auth/session', { method: 'DELETE' })
}

// ── Sign Up with Email ────────────────────────────────────────────────────

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
    emailVerified: false,
  }

  await setDoc(doc(db, 'users', credential.user.uid), {
    ...user,
    createdAt: serverTimestamp(),
  })

  const res = await fetch('/api/auth/otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) throw new Error('Failed to send OTP email')

  return user
}

// ── Resend OTP ────────────────────────────────────────────────────────────

export async function resendOTP(email: string): Promise<void> {
  const res = await fetch('/api/auth/otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) throw new Error('Failed to resend OTP')
}

// ── Verify OTP ────────────────────────────────────────────────────────────

export async function verifyOTP(email: string, otp: string): Promise<void> {
  const res = await fetch('/api/auth/otp', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  })

  const data = await res.json()

  if (!res.ok) {
    if (res.status === 410)
      throw new Error('OTP expired. Please request a new one.')
    if (res.status === 401) throw new Error('Invalid OTP. Please try again.')
    throw new Error(data.error ?? 'Verification failed')
  }

  const user = auth.currentUser
  if (user) {
    const idToken = await user.getIdToken(true)
    await setSessionCookie(idToken)
  }
}

// ── Sign In with Email ────────────────────────────────────────────────────

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<{ user: LMSUser; emailVerified: boolean }> {
  const credential = await signInWithEmailAndPassword(auth, email, password)

  const firebaseEmailVerified = credential.user.emailVerified

  if (firebaseEmailVerified) {
    await updateDoc(doc(db, 'users', credential.user.uid), {
      emailVerified: true,
    })
  }

  const user = await getUserFromFirestore(credential.user.uid)
  if (!user) throw new Error('User record not found. Please sign up.')

  if (!firebaseEmailVerified && !user.emailVerified) {
    await fetch('/api/auth/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    return { user, emailVerified: false }
  }

  const idToken = await credential.user.getIdToken(true)
  await setSessionCookie(idToken)

  return { user, emailVerified: true }
}

// ── Sign In with Google (Redirect) ────────────────────────────────────────

export async function signInWithGoogle(): Promise<void> {
  await signInWithRedirect(auth, googleProvider)
}

// ── Handle Google Redirect Result ─────────────────────────────────────────
// Call this on app load / auth page load

export async function handleGoogleRedirectResult(
  role: UserRole = 'student',
): Promise<{ user: LMSUser; isNew: boolean } | null> {
  const credential = await getRedirectResult(auth)
  if (!credential) return null

  const { uid, email, displayName, photoURL } = credential.user

  const existing = await getUserFromFirestore(uid)

  if (existing) {
    const idToken = await credential.user.getIdToken(true)
    await setSessionCookie(idToken)
    return { user: existing, isNew: false }
  }

  const user: LMSUser = {
    uid,
    email: email!,
    name: displayName ?? 'Student',
    photoURL,
    role,
    createdAt: new Date().toISOString(),
    enrolledCourses: [],
    emailVerified: true,
  }

  await setDoc(doc(db, 'users', uid), {
    ...user,
    createdAt: serverTimestamp(),
  })

  const idToken = await credential.user.getIdToken(true)
  await setSessionCookie(idToken)

  return { user, isNew: true }
}

// ── Forgot Password ───────────────────────────────────────────────────────

export async function forgotPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email)
}

// ── Change Password ───────────────────────────────────────────────────────

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const user = auth.currentUser
  if (!user || !user.email) throw new Error('No user signed in')
  const credential = EmailAuthProvider.credential(user.email, currentPassword)
  await reauthenticateWithCredential(user, credential)
  await updatePassword(user, newPassword)
}

// ── Sign Out ──────────────────────────────────────────────────────────────

export async function logOut(): Promise<void> {
  await signOut(auth)
  await clearSessionCookie()
}

// ── Get User from Firestore ───────────────────────────────────────────────

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
    emailVerified: data.emailVerified ?? false,
    phone: data.phone ?? '',
  }
}

// ── Update User Profile ───────────────────────────────────────────────────

export async function updateUserProfile(
  uid: string,
  data: { name?: string; phone?: string },
): Promise<void> {
  await updateDoc(doc(db, 'users', uid), data)
  if (data.name && auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: data.name })
  }
}
