import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Your Cart',
  description: 'Review the precision printing products in your Fortune India cart before checkout.',
  path: '/cart',
  noindex: true,
})

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}
