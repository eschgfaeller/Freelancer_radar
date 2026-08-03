import { NextResponse } from 'next/server';
import { AUTH_COOKIE, computeAuthToken } from '@/lib/auth';

export async function POST(request: Request) {
  const appPassword = process.env.APP_PASSWORD;
  if (!appPassword) {
    return NextResponse.json(
      { error: 'APP_PASSWORD is not configured on the server.' },
      { status: 500 }
    );
  }

  const { password } = await request.json();

  if (typeof password !== 'string' || password !== appPassword) {
    return NextResponse.json({ error: 'Wrong password.' }, { status: 401 });
  }

  const token = await computeAuthToken(appPassword);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
