// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('admin-auth')?.value === 'true';

  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');

  if (isAdminPath && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin-login/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
