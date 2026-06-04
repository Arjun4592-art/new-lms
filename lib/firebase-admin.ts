import 'server-only'

import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function getFirebaseCredential() {
  // Preferred: full service account JSON
  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  if (rawServiceAccount) {
    try {
      const fixed = rawServiceAccount.replace(/\\n/g, '\n')
      const serviceAccount = JSON.parse(fixed)
      return cert(serviceAccount)
    } catch (e) {
      // Fall through to private key based initialization
    }
  }

  // Fallback: individual env vars
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin credentials. Set FIREBASE_SERVICE_ACCOUNT JSON or (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).',
    )
  }

  return cert({ projectId, clientEmail, privateKey })
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: getFirebaseCredential(),
    })

export const adminAuth = getAuth(app)
export const adminDb = getFirestore(app)
