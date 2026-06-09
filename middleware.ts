import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'

const AUTH_PATHS = [
  '/login',
  '/signup',
  '/forgot-password',
  '/verify-email',
  '/verify-email-pending',
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p))
  const isDashboard = pathname.startsWith('/dashboard')
  const isAdmin = pathname.startsWith('/admin')

  const session = req.cookies.get('session')?.value

  if (isDashboard || isAdmin) {
    if (!session) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      // ← Session cookie verify karo
      await adminAuth.verifySessionCookie(session, true)
      return NextResponse.next()
    } catch {
      // Cookie invalid ya expired — login pe bhejo
      const res = NextResponse.redirect(new URL('/login', req.url))
      res.cookies.delete('session')
      return res
    }
  }

  // Login page pe hai aur valid session hai — dashboard pe bhejo
  if (isAuthPath && session) {
    try {
      await adminAuth.verifySessionCookie(session, true)
      return NextResponse.redirect(new URL('/dashboard', req.url))
    } catch {
      // Invalid session — login pe rehne do
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
