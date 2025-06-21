// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Set this to true to enable maintenance mode
const MAINTENANCE_MODE = true;

export function middleware(request: NextRequest) {
  // Maintenance mode check - show for all non-admin paths
  if (MAINTENANCE_MODE && !request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }

  // Existing admin auth logic
  const isLoggedIn = request.cookies.get('admin-auth')?.value === 'true';
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');

  if (isAdminPath && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin-login/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Matcher excludes:
  // - API routes
  // - Static files
  // - Next.js internals
  // - The maintenance page itself
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|maintenance|.*\\.).*)'],
};
