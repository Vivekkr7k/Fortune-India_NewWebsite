import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Checkout',
  description: 'Securely complete your Fortune India order.',
  path: '/checkout',
  noindex: true,
})

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children
}
