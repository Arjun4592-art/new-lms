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
  const session = req.cookies.get('session')?.value

  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p))
  const isDashboard = pathname.startsWith('/dashboard')

  // Dashboard protect karo
  if (isDashboard && !session) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Logged in user auth pages pe na jaye
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
