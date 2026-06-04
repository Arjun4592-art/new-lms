import { NextRequest, NextResponse } from 'next/server'

const AUTH_PATHS = [
  '/login',
  '/signup',
  '/forgot-password',
  '/verify-email',
  '/verify-email-pending',
]

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

  // ── No session ────────────────────────────────────────────────────────
  if (!session) {
    if (isDashboard || isAdmin) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // ── Decode session cookie ─────────────────────────────────────────────
  const payload = decodeJwtPayload(session)

  if (!payload) {
    const res = NextResponse.redirect(new URL('/login', req.url))
    res.cookies.delete('session')
    return res
  }

  // ── Check expiry ──────────────────────────────────────────────────────
  const exp = payload.exp as number | undefined
  if (exp && Date.now() / 1000 > exp) {
    const res = NextResponse.redirect(new URL('/login', req.url))
    res.cookies.delete('session')
    return res
  }

  // role is now a real custom claim set by /api/auth/session
  const role = payload.role as string | undefined
  const emailVerified = (payload.email_verified ?? payload.emailVerified) as
    | boolean
    | undefined

  // ── Auth pages ────────────────────────────────────────────────────────
  if (isAuth) {
    const isVerifyFlow =
      pathname.startsWith('/verify-email') ||
      pathname.startsWith('/verify-email-pending')

    // Unverified users stay on verify-email pages
    if (isVerifyFlow && !emailVerified) return NextResponse.next()

    // Everyone else gets redirected to their home
    return NextResponse.redirect(
      new URL(role === 'admin' ? '/admin' : '/dashboard', req.url),
    )
  }

  // ── Admin protection ──────────────────────────────────────────────────
  if (isAdmin && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
