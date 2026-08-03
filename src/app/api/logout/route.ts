import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';

function clearAndRedirect(request: Request) {
  const response = NextResponse.redirect(new URL('/login', request.url));
  response.cookies.delete(AUTH_COOKIE);
  return response;
}

export async function GET(request: Request) {
  return clearAndRedirect(request);
}

export async function POST(request: Request) {
  return clearAndRedirect(request);
}
