import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // On Vercel (and other reverse proxies) request.url origin can be an
      // internal address. x-forwarded-host carries the real public domain.
      const forwardedHost = request.headers.get('x-forwarded-host');
      const redirectBase = forwardedHost
        ? `https://${forwardedHost}`
        : origin;
      return NextResponse.redirect(`${redirectBase}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
