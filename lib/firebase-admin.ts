import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

function initAdminApp() {
  if (getApps().length > 0) {
    console.log('✅ Firebase Admin already initialized')
    return getApp()
  }

  console.log('🔵 Initializing Firebase Admin...')
  console.log('🔵 PROJECT_ID:', process.env.FIREBASE_PROJECT_ID)
  console.log('🔵 CLIENT_EMAIL:', process.env.FIREBASE_ADMIN_CLIENT_EMAIL)
  console.log(
    '🔵 BASE64 KEY exists:',
    !!process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64,
  )
  console.log(
    '🔵 BASE64 KEY length:',
    process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64?.length,
  )
  console.log('🔵 RAW KEY exists:', !!process.env.FIREBASE_ADMIN_PRIVATE_KEY)

  // ── Private key resolve karo ──────────────────────────────────────────
  let privateKey: string | undefined

  if (process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64) {
    // Base64 encoded key — Hostinger ke liye best
    privateKey = Buffer.from(
      process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64,
      'base64',
    ).toString('utf8')
    console.log('✅ Using BASE64 private key')
  } else if (process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    // Raw key with \n
    privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
    console.log('✅ Using RAW private key')
  }

  // ── Validation ────────────────────────────────────────────────────────
  if (!process.env.FIREBASE_PROJECT_ID) {
    throw new Error('❌ Missing FIREBASE_PROJECT_ID')
  }
  if (!process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
    throw new Error('❌ Missing FIREBASE_ADMIN_CLIENT_EMAIL')
  }
  if (!privateKey) {
    throw new Error(
      '❌ Missing FIREBASE_ADMIN_PRIVATE_KEY or FIREBASE_ADMIN_PRIVATE_KEY_BASE64',
    )
  }
  if (!privateKey.includes('BEGIN PRIVATE KEY')) {
    throw new Error(
      '❌ Private key format invalid — does not contain BEGIN PRIVATE KEY',
    )
  }

  console.log('✅ Private key format looks valid')
  console.log('✅ Private key first 40 chars:', privateKey.substring(0, 40))

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
  })
}

const adminApp = initAdminApp()
export const adminDb = getFirestore(adminApp)
export const adminAuth = getAuth(adminApp)
