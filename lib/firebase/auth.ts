import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
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

// ── Sign Up with Email ────────────────────────────────────────────────────

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
  role: UserRole = 'student',
): Promise<LMSUser> {
  try {
    console.log('🔵 [1] Starting signup for:', email)

    const credential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    )
    console.log('✅ [2] Firebase Auth user created:', credential.user.uid)

    await updateProfile(credential.user, { displayName: name })
    console.log('✅ [3] Profile updated')

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

    console.log('🔵 [4] Saving to Firestore...')
    await setDoc(doc(db, 'users', credential.user.uid), {
      ...user,
      createdAt: serverTimestamp(),
    })
    console.log('✅ [5] Firestore user saved')

    console.log('🔵 [6] Sending OTP...')
    const res = await fetch('/api/auth/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    console.log('✅ [7] OTP API response status:', res.status)

    if (!res.ok) {
      const errBody = await res.json()
      console.error('❌ OTP API error body:', errBody)
      throw new Error('Failed to send OTP email')
    }

    console.log('✅ [8] Signup complete')
    return user
  } catch (err: any) {
    console.error('❌ signUpWithEmail FAILED at some step')
    console.error('Error code:', err?.code)
    console.error('Error message:', err?.message)
    console.error('Full error:', err)
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
  if (user) {
    await updateDoc(doc(db, 'users', user.uid), { emailVerified: true })
  }
}

// ── Sign In with Email ────────────────────────────────────────────────────

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<{ user: LMSUser; emailVerified: boolean }> {
  try {
    console.log('🔵 [1] Starting login for:', email)

    const credential = await signInWithEmailAndPassword(auth, email, password)
    console.log('✅ [2] Firebase Auth login success:', credential.user.uid)

    const firebaseEmailVerified = credential.user.emailVerified
    console.log('🔵 [3] emailVerified:', firebaseEmailVerified)

    if (firebaseEmailVerified) {
      await updateDoc(doc(db, 'users', credential.user.uid), {
        emailVerified: true,
      })
      console.log('✅ [4] Firestore emailVerified updated')
    }

    console.log('🔵 [5] Fetching user from Firestore...')
    const user = await getUserFromFirestore(credential.user.uid)
    console.log('✅ [6] Firestore user:', user)

    if (!user) throw new Error('User record not found. Please sign up.')

    if (!firebaseEmailVerified && !user.emailVerified) {
      console.log('🔵 [7] Email not verified, sending OTP...')

      const otpRes = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      console.log('🔵 [7a] OTP response status:', otpRes.status)

      const otpData = await otpRes.json()
      console.log('🔵 [7b] OTP response data:', otpData)

      if (!otpRes.ok) {
        console.error('❌ OTP send failed:', otpData)
        throw new Error(otpData.error ?? 'Failed to send OTP')
      }

      console.log('✅ [7c] OTP sent successfully')
      return { user, emailVerified: false }
    }

    console.log('✅ [8] Login complete')
    return { user, emailVerified: true }
  } catch (err: any) {
    console.error('❌ signInWithEmail FAILED')
    console.error('Error code:', err?.code)
    console.error('Error message:', err?.message)
    console.error('Full error:', err)
    throw err
  }
}

// ── Sign In with Google (Popup) ───────────────────────────────────────────

export async function signInWithGoogle(
  role: UserRole = 'student',
): Promise<{ user: LMSUser; isNew: boolean }> {
  try {
    console.log('🔵 [G1] Starting Google login...')

    const credential = await signInWithPopup(auth, googleProvider)
    console.log('✅ [G2] Google login success:', credential.user.uid)

    const { uid, email, displayName, photoURL } = credential.user

    const existing = await getUserFromFirestore(uid)

    if (existing) {
      console.log('✅ [G3] Existing user found')
      return { user: existing, isNew: false }
    }

    console.log('🔵 [G3] New user — saving to Firestore...')
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
    console.log('✅ [G4] Firestore user saved')

    return { user, isNew: true }
  } catch (err: any) {
    console.error('❌ signInWithGoogle FAILED')
    console.error('Error code:', err?.code)
    console.error('Error message:', err?.message)
    throw err
  }
}

// ── Handle Google Redirect Result ────────────────────────────────────────

export async function handleGoogleRedirectResult(): Promise<{
  user: LMSUser
} | null> {
  try {
    const result = await getRedirectResult(auth)
    if (!result) return null

    const { uid, email, displayName, photoURL } = result.user

    const existing = await getUserFromFirestore(uid)
    if (existing) return { user: existing }

    const user: LMSUser = {
      uid,
      email: email!,
      name: displayName ?? 'User',
      photoURL,
      role: 'student',
      createdAt: new Date().toISOString(),
      enrolledCourses: [],
      emailVerified: true,
    }

    await setDoc(doc(db, 'users', uid), {
      ...user,
      createdAt: serverTimestamp(),
    })

    return { user }
  } catch (err: any) {
    console.error('❌ handleGoogleRedirectResult FAILED:', err?.message)
    throw err
  }
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
