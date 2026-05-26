import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PREFIXES = ['/dashboard']
const GUEST_ONLY_PREFIXES = ['/login', '/signup']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get('session')?.value

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
  const isGuestOnly = GUEST_ONLY_PREFIXES.some((p) => pathname.startsWith(p))

  if (isProtected && !session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isGuestOnly && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}
