import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
})

async function check(uid: string) {
  const user = await getAuth().getUser(uid)
  console.log('Custom claims:', user.customClaims)
  process.exit(0)
}

check('y0D1zeU7kGOhtjhPRIsGWT5TTrt2')
