import BlogPageClient from '@/components/blog/BlogPageClient'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Blog & Insights',
  description:
    'Industrial printing insights, compliance guides (HAL, BHEL, TATA), barcode and labelling guidelines, and the latest news from Fortune India, Bangalore.',
  path: '/blog',
  keywords: [
    'industrial printing blog',
    'nameplate guide',
    'aerospace label standards india',
    'barcode vs qr labels',
  ],
})

const posts = [
  {
    id: '1',
    slug: 'types-of-industrial-nameplates',
    title: 'A Complete Guide to Industrial Nameplate Types',
    excerpt: 'From aluminium engraving to stainless steel etching — understanding which nameplate type fits your application.',
    category: 'Printing Guides',
    date: '2025-01-15',
    readTime: '7 min read',
    featured: true
  },
  {
    id: '2',
    slug: 'aerospace-label-standards-india',
    title: 'Aerospace Label Standards in India: What You Need to Know',
    excerpt: 'HAL and ISRO procurement teams specify strict label standards. Here is what suppliers must comply with.',
    category: 'Industry News',
    date: '2025-01-08',
    readTime: '5 min read',
    featured: false
  },
  {
    id: '3',
    slug: 'barcode-vs-qr-labels-manufacturing',
    title: 'Barcode vs QR Code Labels: Which is Right for Your Manufacturing Floor?',
    excerpt: 'A practical breakdown of when to use barcodes and when QR codes offer better value for industrial tracking.',
    category: 'Printing Guides',
    date: '2024-12-20',
    readTime: '6 min read',
    featured: false
  },
  {
    id: '4',
    slug: 'pharma-labelling-requirements-2025',
    title: 'Pharmaceutical Labelling Requirements in India for 2025',
    excerpt: 'CDSCO updates and what they mean for pharmaceutical packaging print specifications.',
    category: 'Industry News',
    date: '2024-12-10',
    readTime: '8 min read',
    featured: false
  },
  {
    id: '5',
    slug: 'fortune-india-bhel-partnership',
    title: 'Fortune India Becomes Authorized BHEL Supplier',
    excerpt: 'We are proud to announce our approved vendor status with Bharat Heavy Electricals Limited.',
    category: 'Company Updates',
    date: '2024-11-28',
    readTime: '3 min read',
    featured: false
  },
  {
    id: '6',
    slug: 'outdoor-signage-weather-resistance',
    title: 'What Makes an Outdoor Sign Weather-Resistant?',
    excerpt: 'UV resistance, substrate choice, lamination grades — the science behind durable outdoor printing.',
    category: 'Printing Guides',
    date: '2024-11-15',
    readTime: '5 min read',
    featured: false
  }
]

export default function BlogPage() {
  return <BlogPageClient posts={posts} />
}
