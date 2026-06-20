// middleware.js
import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/admin/:path*'],
};

export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname === '/admin/login') return NextResponse.next();

  const cookie = req.cookies.get('admin_session')?.value;
  if (!cookie) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  // Full HMAC verification happens in API routes (Node runtime).
  // Here we just check presence to avoid loading the dashboard shell;
  // each admin API call re-verifies the signature server-side.
  return NextResponse.next();
}
