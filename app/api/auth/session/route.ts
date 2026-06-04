import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

const SESSION_DURATION = 60 * 60 * 24 * 5 * 1000 // 5 days

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json()
    if (!idToken)
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 })

    // Verify the token to get uid
    const decoded = await adminAuth.verifyIdToken(idToken)
    const uid = decoded.uid

    // Get role from Firestore
    const userDoc = await adminDb.collection('users').doc(uid).get()
    const role = userDoc.exists
      ? (userDoc.data()?.role ?? 'student')
      : 'student'

    // Set role as custom claim — this embeds role into the JWT
    await adminAuth.setCustomUserClaims(uid, { role })

    // Create session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION,
    })

    const response = NextResponse.json({ success: true, role })
    response.cookies.set('session', sessionCookie, {
      maxAge: SESSION_DURATION / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    })
    return response
  } catch (err) {
    console.error('Session error:', err)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('session')
  return response
}
