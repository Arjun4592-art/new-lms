import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'

const AUTH_PATHS = [
  '/login',
  '/signup',
  '/forgot-password',
  '/verify-email',
  '/verify-email-pending',
]

const PROTECTED_PATHS = ['/dashboard', '/admin', '/profile']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p))
  const isProtectedPath = PROTECTED_PATHS.some((p) => pathname.startsWith(p))

  const session = req.cookies.get('session')?.value
  let isLoggedIn = false

  if (session) {
    try {
      await adminAuth.verifyIdToken(session)
      isLoggedIn = true
    } catch {
      isLoggedIn = false // deleted/expired user
    }
  }

  if (isProtectedPath && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthPath && isLoggedIn && !pathname.startsWith('/verify-email')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|_next/data).*)'],
}
