'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FolderTree, 
  Inbox, 
  LogOut, 
  ExternalLink,
  QrCode,
  ShieldAlert
} from 'lucide-react'

export function AdminSidebar({ email }: { email?: string | null }) {
  const pathname = usePathname()

  const links = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', href: '/admin/products', icon: QrCode },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Inquiries', href: '/admin/inquiries', icon: Inbox },
  ]

  return (
    <aside className="w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] h-screen flex flex-col justify-between sticky top-0 shrink-0 select-none text-[var(--color-body)]">
      {/* Top Brand Logo */}
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center">
            <ShieldAlert className="text-[#FF5A1F]" size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-[var(--font-display)] text-[14px] font-extrabold tracking-tight leading-none text-[var(--color-ink)]">
              Fortune India
            </span>
            <span className="text-[10px] font-mono tracking-wider text-[var(--color-muted)] uppercase mt-0.5">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5 mt-2">
          {links.map((link) => {
            const Icon = link.icon
            const active = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13.5px] font-semibold transition-all ${
                  active 
                    ? 'bg-[var(--color-signal)] text-white shadow-md shadow-[#FF5A1F]/10' 
                    : 'text-[var(--color-body)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)]'
                }`}
              >
                <Icon size={16} />
                <span>{link.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer Info & Logout */}
      <div className="flex flex-col gap-4 p-6 border-t border-[var(--color-border)]">
        {/* Profile Info */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-mono uppercase text-[var(--color-muted)]">Logged in as</span>
          <span className="text-[12.5px] text-[var(--color-ink)] truncate font-medium">{email || 'Administrator'}</span>
        </div>

        <div className="flex flex-col gap-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors font-bold uppercase tracking-wider"
          >
            <ExternalLink size={13} />
            <span>Go to Site</span>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13.5px] text-[var(--color-error)] hover:bg-[var(--color-error-tint)] transition-all font-semibold cursor-pointer w-full text-left"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
