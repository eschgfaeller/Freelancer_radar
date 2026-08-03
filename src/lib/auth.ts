// Shared by middleware (Edge runtime) and API routes (Node runtime) —
// only Web Crypto + TextEncoder are used, both available in either runtime.

export const AUTH_COOKIE = 'radar_auth';

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function computeAuthToken(password: string): Promise<string> {
  return sha256Hex(`freelancer-radar:${password}`);
}

export async function isValidAuthToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const appPassword = process.env.APP_PASSWORD;
  if (!appPassword) return false;
  const expected = await computeAuthToken(appPassword);
  return token === expected;
}
