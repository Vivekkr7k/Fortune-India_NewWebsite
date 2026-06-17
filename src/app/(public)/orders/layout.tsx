import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Order Details',
  description: 'View your Fortune India order details and status.',
  path: '/orders',
  noindex: true,
})

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return children
}
