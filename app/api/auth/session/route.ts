import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json()
    if (!idToken)
      return NextResponse.json({ error: 'No token' }, { status: 400 })

    const res = NextResponse.json({ success: true })
    res.cookies.set('session', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
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
