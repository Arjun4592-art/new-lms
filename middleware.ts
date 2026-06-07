import { NextRequest, NextResponse } from 'next/server'

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

  // Dashboard/Admin — session nahi hai toh login pe bhejo
  if (!session && (isDashboard || isAdmin)) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Login/Signup — session hai toh dashboard pe bhejo
  if (session && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
