import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { AdminSidebar } from './AdminSidebar'

export const revalidate = 0

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect('/admin/login')
  }

  return (
    <div className="flex bg-[var(--color-canvas)] min-h-screen text-[var(--color-body)] font-[var(--font-body)]">
      {/* Sidebar Nav */}
      <AdminSidebar email={session.user?.email} />

      {/* Main Content Viewport */}
      <main className="flex-1 h-screen overflow-y-auto bg-[var(--color-canvas)] p-8 md:p-10">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
          {children}
        </div>
      </main>
    </div>
  )
}
