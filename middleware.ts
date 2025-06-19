 import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  const isLoggedIn = request.cookies.get('admin-auth')?.value === 'true';

  const isAdminPath = url.pathname.startsWith('/admin');
  const isAdminLogin = url.pathname.startsWith('/admin-login');

  // Allow admin and login pages to work normally
  if (isAdminPath || isAdminLogin) {
    if (isAdminPath && !isLoggedIn) {
      return NextResponse.redirect(new URL('/admin-login/login', request.url));
    }
    return NextResponse.next();
  }

  // For all other paths, redirect to maintenance page
  return NextResponse.rewrite(new URL('/maintenance', request.url));
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'], // Match everything except assets and favicon
};
