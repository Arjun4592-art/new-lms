import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

function initAdminApp() {
  if (getApps().length > 0) return getApp()

  // Support both base64-encoded key and raw key with \n
  let privateKey: string
  if (process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64) {
    privateKey = Buffer.from(
      process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64,
      'base64',
    ).toString('utf8')
  } else {
    const rawKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? ''
    privateKey = rawKey.replace(/\\n/g, '\n')
  }

  if (!process.env.FIREBASE_PROJECT_ID)
    throw new Error('Missing FIREBASE_PROJECT_ID')
  if (!process.env.FIREBASE_ADMIN_CLIENT_EMAIL)
    throw new Error('Missing FIREBASE_ADMIN_CLIENT_EMAIL')
  if (!privateKey) throw new Error('Missing FIREBASE_ADMIN_PRIVATE_KEY')

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
