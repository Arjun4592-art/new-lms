import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'

// Middleware runs in the Edge runtime in many Next.js configs.
// Keep it explicitly on the Node.js runtime so firebase-admin can use Node core modules.
export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}

// NOTE: only one `config` export is allowed in this file.
// (removed the duplicate config export that was previously at the bottom)

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
