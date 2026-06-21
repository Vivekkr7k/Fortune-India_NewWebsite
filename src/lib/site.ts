import type { Metadata } from 'next'

// ─────────────────────────────────────────────────────────────
// Single source of truth for site-wide SEO, metadata & structured data.
// Used by the root layout, every page's metadata, sitemap.ts, robots.ts,
// manifest.ts and the JSON-LD structured-data blocks.
// ─────────────────────────────────────────────────────────────

const RAW_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://fortune-india-new-website.vercel.app'

export const SITE = {
  name: 'Fortune India',
  legalName: 'Fortune India B2B Components',
  shortName: 'Fortune India',
  // Absolute origin with no trailing slash — used to build canonical & OG URLs
  url: RAW_URL.replace(/\/+$/, ''),
  tagline: 'Transforming Your Vision into Reality',
  description:
    'Fortune India is a Bangalore-based B2B store for electronics, drone and RC parts, carbon fiber products, sensors, development boards, and industrial supplies. We supply premium parts with pan-India delivery.',
  locale: 'en_IN',
  founded: '2009',

  // Contact
  phone: '+918830575677',
  phoneDisplay: '+91 88305 75677',
  email: 'fortuneindiabgl@gmail.com',

  // Address
  address: {
    street: '369, Attibele',
    city: 'Bangalore',
    region: 'Karnataka',
    postalCode: '562107',
    country: 'IN',
  },

  // Brand / social
  ogImage: '/opengraph-image',
  clients: [],

  // Default keyword set — surfaced sitewide and extended per page
  keywords: [
    'drone parts',
    'electronics',
    'rc parts',
    'carbon fiber sheets',
    'sensors',
    'development boards',
    'motors',
    'batteries',
    'b2b electronics supplier',
    'industrial components Bangalore',
    'Attibele Bangalore',
    'B2B electronics India',
  ],
} as const

/**
 * Build a consistent, fully-formed Metadata object for a page.
 * Canonical URLs are relative — they resolve against `metadataBase`
 * (set once in the root layout).
 */
export function buildMetadata(opts: {
  title?: string
  description?: string
  path?: string
  keywords?: string[]
  image?: string
  noindex?: boolean
}): Metadata {
  const { title, description = SITE.description, path = '/', keywords, image, noindex } = opts
  const url = `${SITE.url}${path}`
  const ogImage = image ?? SITE.ogImage

  return {
    title,
    description,
    keywords: keywords ? [...keywords, ...SITE.keywords] : undefined,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: SITE.name,
      title: title ?? SITE.name,
      description,
      url,
      locale: SITE.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: title ?? SITE.name,
      description,
      images: [ogImage],
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  }
}

// ── Structured data (JSON-LD) ────────────────────────────────

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/logo.png`,
    image: `${SITE.url}/logo.png`,
    description: SITE.description,
    foundingDate: SITE.founded,
    slogan: SITE.tagline,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE.phone,
      email: SITE.email,
      contactType: 'sales',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
    knowsAbout: [...SITE.keywords],
  }
}

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.url}/#localbusiness`,
    name: SITE.legalName,
    image: `${SITE.url}/logo.png`,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    publisher: { '@id': `${SITE.url}/#organization` },
    inLanguage: 'en-IN',
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  }
}
