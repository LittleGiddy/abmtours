import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Maintenance mode example (fixed)
  if (process.env.MAINTENANCE_MODE === 'true') {
    if (!request.nextUrl.pathname.startsWith('/maintenance')) {
      return NextResponse.rewrite(new URL('/maintenance', request.url))
    }
    return NextResponse.next()
  }

  // Admin auth example (fixed)
  const isLoggedIn = request.cookies.get('admin-auth')?.value === 'true'
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')

  if (isAdminPath && !isLoggedIn) {
    // Fixed redirect - no dynamic segments in destination
    return NextResponse.redirect(new URL('/admin-login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - maintenance (maintenance page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|maintenance).*)',
  ],
}
