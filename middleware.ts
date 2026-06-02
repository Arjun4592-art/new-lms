import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/', '/courses', '/contact']
const AUTH_PATHS = [
  '/login',
  '/signup',
  '/forgot-password',
  '/verify-email',
  '/verify-email-pending',
]

// Decode JWT payload without verification (Edge-safe)
// Full verification happens in API routes via firebase-admin
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1]
    if (!base64) return null
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = req.cookies.get('session')?.value

  const isAuth = AUTH_PATHS.some((p) => pathname.startsWith(p))
  const isAdmin = pathname.startsWith('/admin')
  const isDashboard = pathname.startsWith('/dashboard')

  // No session
  if (!session) {
    if (isDashboard || isAdmin) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return NextResponse.next()
  }

  // Decode session cookie (Firebase session cookies are JWTs)
  const payload = decodeJwtPayload(session)

  // Invalid or expired token
  if (!payload) {
    const response = NextResponse.redirect(new URL('/login', req.url))
    response.cookies.delete('session')
    return response
  }

  // Check expiry
  const exp = payload.exp as number | undefined
  if (exp && Date.now() / 1000 > exp) {
    const response = NextResponse.redirect(new URL('/login', req.url))
    response.cookies.delete('session')
    return response
  }

  const role = payload.role as string | undefined

  // Logged-in user trying to access auth pages → redirect away (except verify-email)
  if (isAuth) {
    const isVerifyEmailFlow =
      pathname.startsWith('/verify-email') ||
      pathname.startsWith('/verify-email-pending')

    // If user is NOT verified yet, allow them to stay on verify-email pages
    if (isVerifyEmailFlow) {
      const emailVerified =
        (payload.emailVerified as boolean | undefined) ??
        (payload.email_verified as boolean | undefined)

      if (!emailVerified) return NextResponse.next()
    }

    // Verified users shouldn't see auth pages
    return NextResponse.redirect(
      new URL(role === 'admin' ? '/admin' : '/dashboard', req.url),
    )
  }

  // Non-admin trying to access admin
  if (isAdmin && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
