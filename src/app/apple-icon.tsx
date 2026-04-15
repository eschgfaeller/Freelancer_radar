import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#059669',
          borderRadius: 40,
          fontSize: 80,
          fontWeight: 700,
          color: 'white',
          letterSpacing: -2,
        }}
      >
        FR
      </div>
    ),
    { ...size }
  );
}
