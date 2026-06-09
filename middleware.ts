import { NextRequest, NextResponse } from 'next/server'

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

  // Firebase client SDK cookies check karo
  // Firebase sets these cookies automatically
  const session = req.cookies.get('session')?.value
  const firebaseToken =
    req.cookies.get('__session')?.value ||
    req.cookies.get('firebase-auth-token')?.value ||
    session

  const isLoggedIn = !!firebaseToken

  // Protected page — cookie nahi hai toh login pe bhejo
  if (isProtectedPath && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Auth page — cookie hai toh dashboard pe bhejo
  // (AuthContext baad mein sahi redirect karega admin ke liye)
  if (isAuthPath && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|_next/data).*)'],
}
