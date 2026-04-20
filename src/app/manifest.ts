// app/manifest.ts
import type { MetadataRoute } from 'next';
import CONFIG from '~/portfolio.config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: CONFIG.seo.title || 'Portfolio',
    short_name: 'Portfolio',
    description: CONFIG.seo.description || 'Github Portfolio',
    start_url: CONFIG.base || '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/logo.png',
        sizes: '64x64 32x32 24x24 16x16 192x192 512x512',
        type: 'image/png',
      },
    ],
  };
}