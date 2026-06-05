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

  // Dashboard aur Admin ke liye — client side AuthContext handle karega
  // Middleware sirf basic redirect karega
  const session = req.cookies.get('session')?.value

  if (!session && (isDashboard || isAdmin)) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
