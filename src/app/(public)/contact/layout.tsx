import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Contact Us',
  description:
    'Get in touch with Fortune India for quotes, bulk orders and custom B2B components. Call +91 88305 75677 or email us — based in Attibele, Bangalore. We respond within 1 business day.',
  path: '/contact',
  keywords: [
    'contact fortune india',
    'drone parts supplier bangalore',
    'b2b electronics enquiry',
    'bulk drone parts order',
  ],
})

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
