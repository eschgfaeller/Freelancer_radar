import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE, isValidAuthToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (await isValidAuthToken(token)) {
    return NextResponse.next();
  }

  if (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/api/login')
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = '/login';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|api/icon|icon|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
