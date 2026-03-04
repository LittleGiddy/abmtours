import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  /*
   * ============================================
   * DOMAIN SUBSCRIPTION EXPIRED MODE
   * ============================================
   */
  if (process.env.MAINTENANCE_MODE === 'true') {
    // Allow maintenance page itself
    if (pathname.startsWith('/maintenance')) {
      return NextResponse.next()
    }

    // Rewrite everything else to maintenance page
    return NextResponse.rewrite(new URL('/maintenance', request.url))
  }

  /*
   * ============================================
   * ADMIN AUTH PROTECTION
   * ============================================
   */
  const isLoggedIn = request.cookies.get('admin-auth')?.value === 'true'
  const isAdminPath = pathname.startsWith('/admin')

  if (isAdminPath && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin-login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes
     * - Next.js static files
     * - image optimization
     * - favicon
     * - maintenance page
     */
    '/((?!api|_next/static|_next/image|favicon.ico|maintenance).*)',
  ],
}
