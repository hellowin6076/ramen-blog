import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'
  const isAdminLoggedIn = request.cookies.get('admin-token')?.value === 'authenticated'

  if (isAdminPage && !isLoginPage && !isAdminLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (isLoginPage && isAdminLoggedIn) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
