import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Freelancer Earnings Radar',
    short_name: 'Earnings Radar',
    description: 'Track freelance earnings and forecast monthly income',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#059669',
    orientation: 'portrait',
    icons: [
      {
        src: '/api/icon?size=192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/api/icon?size=512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
