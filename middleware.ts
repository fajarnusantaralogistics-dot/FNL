import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protect /admin routes. If no valid session cookie, redirect to /login
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow Next internals and public files
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/static') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // Only protect admin paths (matcher also narrows this, but keep safe-check)
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('token')?.value;
    // treat any non-empty token as authenticated (token contains user id)
    if (token) return NextResponse.next();

    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
