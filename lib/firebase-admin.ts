import 'server-only'

import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function initAdmin() {
  if (getApps().length > 0) return getApp()

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail =
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL ?? process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = (
    process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? process.env.FIREBASE_PRIVATE_KEY
  )
    ?.replace(/\\n/g, '\n')
    ?.replace(/\\r/g, '')
    ?.replace(/^['"]|['"]$/g, '')
    ?.trim()

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase Admin credentials.')
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  })
}

export const adminAuth = getAuth(initAdmin())
export const adminDb = getFirestore(initAdmin())
