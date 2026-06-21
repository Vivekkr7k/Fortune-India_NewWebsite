import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — B2B Electronics & Carbon Fiber`,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#F6F4F0',
    theme_color: '#FF5A1F',
    lang: 'en-IN',
    categories: ['business', 'manufacturing', 'shopping'],
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
