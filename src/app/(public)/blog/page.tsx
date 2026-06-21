import BlogPageClient from '@/components/blog/BlogPageClient'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Blog & Insights',
  description:
    'B2B electronics insights, carbon fiber sheet guides, drone motor selection tutorials, and the latest hardware news from Fortune India, Bangalore.',
  path: '/blog',
  keywords: [
    'b2b electronics blog',
    'drone components guide',
    'carbon fiber panels guide',
    'iot hardware comparison',
  ],
})

const posts = [
  {
    id: '1',
    slug: 'carbon-fiber-sheets-guide',
    title: 'A Complete Guide to Carbon Fiber Sheets and Grades',
    excerpt: 'From standard weave to high-strength glossy sheets — understanding which carbon fiber panel fits your application.',
    category: 'Guides',
    date: '2025-01-15',
    readTime: '7 min read',
    featured: true
  },
  {
    id: '2',
    slug: 'choosing-drone-motors-rc-parts',
    title: 'Choosing the Right Drone Motors and RC Parts: A B2B Guide',
    excerpt: 'Understanding thrust, KV ratings, and efficiency specs to select optimal motors for your commercial drone projects.',
    category: 'Guides',
    date: '2025-01-08',
    readTime: '5 min read',
    featured: false
  },
  {
    id: '3',
    slug: 'b2b-sensor-integration-robotics',
    title: 'B2B Sensors Integration: Ultrasonic vs Infrared in Robotics',
    excerpt: 'A practical breakdown of when to use ultrasonic distance sensors versus infrared for industrial and drone collision avoidance.',
    category: 'Guides',
    date: '2024-12-20',
    readTime: '6 min read',
    featured: false
  },
  {
    id: '4',
    slug: 'development-boards-comparison-2026',
    title: 'Microcontroller & Development Boards Comparison: 2026 Edition',
    excerpt: 'Comparing ESP32, Arduino, and Raspberry Pi Pico boards for B2B prototyping and industrial IoT systems.',
    category: 'Guides',
    date: '2024-12-10',
    readTime: '8 min read',
    featured: false
  },
  {
    id: '5',
    slug: 'fortune-india-b2b-electronics-catalog',
    title: 'Fortune India Expands B2B Electronics & Drone Parts Catalog',
    excerpt: 'We are proud to announce our expanded inventory of carbon fiber sheets, sensors, and development boards.',
    category: 'Company Updates',
    date: '2024-11-28',
    readTime: '3 min read',
    featured: false
  },
  {
    id: '6',
    slug: 'rc-battery-care-and-safety',
    title: 'LiPo Battery Care and Safety Standards for Drone Fleets',
    excerpt: 'Best practices for storing, charging, and maintaining high-capacity LiPo batteries used in commercial drone fleets.',
    category: 'Guides',
    date: '2024-11-15',
    readTime: '5 min read',
    featured: false
  }
]

export default function BlogPage() {
  return <BlogPageClient posts={posts} />
}
