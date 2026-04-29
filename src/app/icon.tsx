import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: 6,
          fontSize: 16,
          fontWeight: 700,
          color: 'white',
          letterSpacing: -1,
        }}
      >
        FR
      </div>
    ),
    { ...size }
  );
}
