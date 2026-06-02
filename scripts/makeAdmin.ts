import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { initializeApp } from 'firebase-admin/app'
import { cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
})

const auth = getAuth()

async function makeAdmin(uid: string) {
  await auth.setCustomUserClaims(uid, { role: 'admin' })
  console.log(`✅ User ${uid} is now admin`)
  process.exit(0)
}

makeAdmin('y0D1zeU7kGOhtjhPRIsGWT5TTrt2')
