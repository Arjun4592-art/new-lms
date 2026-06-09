import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json()
    if (!idToken)
      return NextResponse.json({ error: 'No token' }, { status: 400 })

    // ← idToken ki jagah Firebase session cookie banao — 7 days valid
    const expiresIn = 60 * 60 * 24 * 7 * 1000 // 7 days milliseconds
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    })

    const res = NextResponse.json({ success: true })
    res.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days seconds
      path: '/',
    })

    return res
  } catch (err) {
    console.error('Session error:', err)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete('session')
  return res
}
