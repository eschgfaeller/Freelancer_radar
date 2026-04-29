import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const size = parseInt(searchParams.get('size') || '192');

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#2563eb',
          borderRadius: size * 0.2,
          fontSize: size * 0.35,
          fontWeight: 700,
          color: 'white',
          letterSpacing: -2,
        }}
      >
        FR
      </div>
    ),
    { width: size, height: size }
  );
}
