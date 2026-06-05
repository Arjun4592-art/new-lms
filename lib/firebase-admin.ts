import 'server-only'

import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function getFirebaseCredential() {
  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  if (rawServiceAccount) {
    try {
      const fixed = rawServiceAccount.replace(/\\n/g, '\n').replace(/\\"/g, '"')
      const serviceAccount = JSON.parse(fixed)
      // Fix private key newlines
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '')
          .trim()
      }
      return cert(serviceAccount)
    } catch (e) {
      console.error('Service account parse error:', e)
    }
  }

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

  return cert({ projectId, clientEmail, privateKey })
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({ credential: getFirebaseCredential() })

export const adminAuth = getAuth(app)
export const adminDb = getFirestore(app)
