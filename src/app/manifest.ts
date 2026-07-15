import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DevForge',
    short_name: 'DevForge',
    description: 'The ultimate all-in-one toolbox for software developers',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f1115',
    theme_color: '#00e5ff',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/file.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
