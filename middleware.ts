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

  const session = req.cookies.get('session')?.value
  const isLoggedIn = !!session

  // No session — protected page pe hai toh root pe bhejo
  if (isProtectedPath && !isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Session hai — auth page pe aa gaya (verify-email chhod ke)
  if (isAuthPath && isLoggedIn && !pathname.startsWith('/verify-email')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|_next/data).*)'],
}
