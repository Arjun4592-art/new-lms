import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json()
    const expiresIn = 60 * 60 * 24 * 5 * 1000

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    })

    const cookieStore = await cookies()
    cookieStore.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn / 1000,
      path: '/',
    })

    return NextResponse.json({ status: 'success' })
  } catch (err) {
    console.error('Session error:', err)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  return NextResponse.json({ status: 'cleared' })
}
