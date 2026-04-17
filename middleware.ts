import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths - no authentication needed
  const publicPaths = [
    '/admin/login',
    '/admin/setup',
    '/_next',
    '/api',
    '/favicon.ico',
  ];

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // Only protect /admin routes
  if (pathname.startsWith('/admin') && !isPublicPath) {
    const isLoggedIn = request.cookies.get('admin-auth')?.value === 'true';
    
    if (!isLoggedIn) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// This matcher ensures middleware runs only on specific paths
export const config = {
  matcher: ['/admin/:path*'],
};