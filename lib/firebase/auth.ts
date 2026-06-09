import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
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

// ── Sign Up with Email ────────────────────────────────────────────────────

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
  role: UserRole = 'student',
): Promise<LMSUser> {
  try {
    const credential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    )

    await updateProfile(credential.user, { displayName: name })

    // ← Firestore mein mat likho abhi
    // Sirf OTP bhejo
    const res = await fetch('/api/auth/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!res.ok) {
      const errBody = await res.json()
      console.error('❌ OTP API error body:', errBody)
      throw new Error('Failed to send OTP email')
    }

    // Sirf return karo — Firestore write nahi
    return {
      uid: credential.user.uid,
      email,
      name,
      photoURL: null,
      role,
      createdAt: new Date().toISOString(),
      enrolledCourses: [],
      emailVerified: false,
    }
  } catch (err: any) {
    console.error('❌ signUpWithEmail FAILED at some step')
    console.error('Error code:', err?.code)
    console.error('Error message:', err?.message)
    throw err
  }
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
  console.log('🔍 currentUser at verify time:', user?.uid, user?.email)
  if (user) {
    console.log('💾 Firestore mein save karne ki koshish...')
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      name: user.displayName ?? 'User',
      photoURL: null,
      role: 'student',
      createdAt: serverTimestamp(),
      enrolledCourses: [],
      emailVerified: true,
    })
    console.log('✅ Firestore save ho gaya!')
    await user.reload()
  }
}

// ── Sign In with Email ────────────────────────────────────────────────────

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<{ user: LMSUser; emailVerified: boolean }> {
  try {
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
      const otpRes = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const otpData = await otpRes.json()

      if (!otpRes.ok) {
        console.error('❌ OTP send failed:', otpData)
        throw new Error(otpData.error ?? 'Failed to send OTP')
      }

      return { user, emailVerified: false }
    }

    await setSessionCookie()

    return { user, emailVerified: true }
  } catch (err: any) {
    console.error('❌ signInWithEmail FAILED')
    console.error('Error code:', err?.code)
    console.error('Error message:', err?.message)
    throw err
  }
}

// ── Sign In with Google (Popup) ───────────────────────────────────────────

export async function signInWithGoogle(
  role: UserRole = 'student',
): Promise<{ user: LMSUser; isNew: boolean }> {
  try {
    const credential = await signInWithPopup(auth, googleProvider)

    const { uid, email, displayName, photoURL } = credential.user

    const existing = await getUserFromFirestore(uid)
    if (existing) {
      await setSessionCookie()
      return { user: existing, isNew: false }
    }

    const user: LMSUser = {
      uid,
      email: email!,
      name: displayName ?? 'User',
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

    await setSessionCookie()
    return { user, isNew: true }
  } catch (err: any) {
    console.error('❌ signInWithGoogle FAILED')
    console.error('Error code:', err?.code)
    console.error('Error message:', err?.message)
    throw err
  }
}

// ── Handle Google Redirect Result — deprecated ────────────────────────────

export async function handleGoogleRedirectResult(): Promise<{
  user: LMSUser
} | null> {
  return null
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
  await fetch('/api/auth/session', { method: 'DELETE' })
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

// ── Helper — session cookie set karo ─────────────────────────────────────

async function setSessionCookie() {
  try {
    const idToken = await auth.currentUser?.getIdToken()
    if (!idToken) return
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    })
  } catch (err) {
    console.error('Failed to set session cookie:', err)
  }
}
