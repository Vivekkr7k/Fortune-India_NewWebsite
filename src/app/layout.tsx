import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400','500','600','700','800'],
  display: 'swap',
})
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400','500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Fortune India — Precision Printing Solutions',
  description: 'High-quality, durable & precision printing solutions. Authorized supplier to HAL, BHEL, TATA. Serving Aerospace, Defence, Automotive & more from Bangalore.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
