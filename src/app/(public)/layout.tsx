import { AnnouncementStrip } from '@/components/layout/AnnouncementStrip'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from 'sonner'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--canvas)]">
      <AnnouncementStrip />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  )
}
