import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.get('admin-auth')?.value === 'true';

  // NOTE: '/admin-login' also startsWith('/admin'), so match the admin area
  // explicitly as '/admin' or '/admin/...' to avoid redirecting the login page
  // to itself (infinite redirect loop).
  const isAdminArea = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAdminLogin =
    pathname === '/admin-login' || pathname.startsWith('/admin-login/');

  if (isAdminArea) {
    const isPublicPath =
      pathname === '/admin' ||
      pathname.startsWith('/admin/login') ||
      pathname.startsWith('/admin/setup');

    if (!isPublicPath && !isLoggedIn) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
  }

  if (isAdminLogin && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/Dashboard', request.url));
  }

  return NextResponse.next();
}

// This matcher ensures middleware runs only on specific paths
export const config = {
  matcher: ['/admin/:path*', '/admin', '/admin-login', '/admin-login/:path*'],
};