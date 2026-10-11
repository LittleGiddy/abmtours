import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminLogin =
    pathname === '/admin-login' || pathname === '/admin-login/login';

  // Only protect /admin routes (and the bare /admin index)
  if (pathname.startsWith('/admin')) {
    const isPublicPath =
      pathname === '/admin' ||
      pathname.startsWith('/admin/login') ||
      pathname.startsWith('/admin/setup');

    if (!isPublicPath) {
      const isLoggedIn = request.cookies.get('admin-auth')?.value === 'true';
      if (!isLoggedIn) {
        const loginUrl = new URL('/admin-login', request.url);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  if (isAdminLogin) {
    const isLoggedIn = request.cookies.get('admin-auth')?.value === 'true';
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/Dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// This matcher ensures middleware runs only on specific paths
export const config = {
  matcher: ['/admin/:path*', '/admin', '/admin-login', '/admin-login/:path*'],
};