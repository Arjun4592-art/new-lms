import { NextRequest, NextResponse } from 'next/server'

// Routes that require the user to be logged in
const PROTECTED_PREFIXES = ['/dashboard']

// Routes only for guests (logged-in users get redirected away)
const GUEST_ONLY_PREFIXES = ['/login', '/signup']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Read the session cookie set after Firebase login
  const session = request.cookies.get('session')?.value

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
  const isGuestOnly = GUEST_ONLY_PREFIXES.some((p) => pathname.startsWith(p))

  // Not logged in → redirect to login, remembering where they were going
  if (isProtected && !session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Already logged in → redirect away from login/signup
  if (isGuestOnly && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}
