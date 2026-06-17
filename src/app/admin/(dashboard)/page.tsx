import { connectDB } from '@/lib/mongoose'
import { Order, Product, Contact } from '@/models'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Mail, 
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

export const revalidate = 0

export default async function AdminDashboardPage() {
  await connectDB()

  // Fetch stats concurrently
  const [rawOrders, productsCount, contacts] = await Promise.all([
    Order.find().sort({ createdAt: -1 }).limit(100).lean(),
    Product.countDocuments(),
    Contact.find().sort({ createdAt: -1 }).limit(100).lean(),
  ])

  // Sanitize orders (to handle nested address objects and serialize dates/ObjectIds)
  const orders = JSON.parse(JSON.stringify(rawOrders)).map((order: any) => {
    let name = order.name
    let phone = order.phone
    
    if (order.address && typeof order.address === 'object') {
      const addr = order.address
      if (!name && (addr.firstName || addr.lastName)) {
        name = [addr.firstName, addr.lastName].filter(Boolean).join(' ')
      }
      if (!phone && addr.phone) {
        phone = addr.phone
      }
    }

    if (name && typeof name === 'object') {
      name = name.firstName || name.lastName ? [name.firstName, name.lastName].filter(Boolean).join(' ') : JSON.stringify(name)
    }
    if (phone && typeof phone === 'object') {
      phone = phone.phone || JSON.stringify(phone)
    }

    return {
      ...order,
      name: name || 'Anonymous Customer',
      phone: phone || 'N/A',
    }
  })

  // Calculations
  const totalOrders = orders.length
  const totalRevenue = orders
    .filter((o: any) => o.paymentStatus === 'PAID' || o.paymentMethod === 'COD' || o.status === 'CONFIRMED')
    .reduce((sum: number, o: any) => sum + (o.total || 0), 0)
  const totalInquiries = contacts.length

  const recentOrders = orders.slice(0, 5)
  const recentInquiries = contacts.slice(0, 5)

  const stats = [
    { name: 'Total Revenue', value: formatPrice(totalRevenue), icon: TrendingUp, color: 'text-[#1A9E5C]', bg: 'bg-[#1A9E5C]/10' },
    { name: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'text-[#FF5A1F]', bg: 'bg-[#FF5A1F]/10' },
    { name: 'Active Products', value: productsCount, icon: Package, color: 'text-[#E6A817]', bg: 'bg-[#E6A817]/10' },
    { name: 'Total Inquiries', value: totalInquiries, icon: Mail, color: 'text-[#3399CC]', bg: 'bg-[#3399CC]/10' },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5 border-b border-[var(--color-border)] pb-6">
        <span className="font-mono text-[10px] text-[var(--color-signal)] uppercase tracking-[0.15em] font-semibold">
          / Overview
        </span>
        <h1 className="text-[28px] md:text-[32px] font-extrabold tracking-tight font-[var(--font-display)] text-[var(--color-ink)]">
          System Dashboard
        </h1>
        <p className="text-[14px] text-[var(--color-muted)]">
          Live summary of Fortune India operations, B2B product inventory, and customer orders.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] p-6 flex items-center justify-between shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="text-[11.5px] font-bold text-[var(--color-muted)] uppercase tracking-wider font-mono">
                  {stat.name}
                </span>
                <span className="text-[24px] font-extrabold text-[var(--color-ink)] font-[var(--font-display)]">
                  {stat.value}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <Icon size={20} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Grid Layout: Recent Orders & Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Orders (60%) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <h2 className="text-[18px] font-extrabold text-[var(--color-ink)] font-[var(--font-display)]">
              Recent Orders
            </h2>
            <Link 
              href="/admin/orders" 
              className="text-[12px] font-bold text-[var(--color-signal)] hover:text-[var(--color-signal-hover)] flex items-center gap-1 uppercase tracking-wider font-mono"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] overflow-hidden shadow-sm">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-[var(--color-muted)]">
                No orders placed yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[13.5px] text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--color-surface-alt)] text-[var(--color-muted)] font-mono text-[10px] uppercase border-b border-[var(--color-border)]">
                      <th className="px-5 py-4 font-semibold">Order</th>
                      <th className="px-5 py-4 font-semibold">Customer</th>
                      <th className="px-5 py-4 font-semibold">Payment</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {recentOrders.map((order: any) => {
                      const orderDate = order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })
                        : 'N/A'

                      return (
                        <tr key={order._id.toString()} className="hover:bg-[var(--color-surface-alt)]/50 transition-colors">
                          <td className="px-5 py-4 font-mono font-bold">
                            <Link href="/admin/orders" className="text-[var(--color-signal)] hover:underline">
                              #{order.orderNumber ? (order.orderNumber.split('-')[1] || order.orderNumber) : order._id.toString().slice(-6)}
                            </Link>
                            <span className="block text-[10.5px] text-[var(--color-muted)] font-normal font-sans mt-0.5">
                              {orderDate}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-medium text-[var(--color-ink)]">
                            {order.name || 'Anonymous Customer'}
                            <span className="block text-[11px] text-[var(--color-muted)] font-normal mt-0.5">
                              {order.phone || 'N/A'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded-full uppercase ${
                              order.paymentStatus === 'PAID'
                                ? 'bg-[#1A9E5C]/10 text-[#1A9E5C]'
                                : 'bg-[#E6A817]/10 text-[#E6A817]'
                            }`}>
                              {order.paymentStatus || 'PENDING'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded-full uppercase ${
                              order.status === 'DELIVERED'
                                ? 'bg-[#1A9E5C]/10 text-[#1A9E5C]'
                                : order.status === 'CANCELLED'
                                ? 'bg-[#E63946]/10 text-[#E63946]'
                                : 'bg-[#FF5A1F]/10 text-[#FF5A1F]'
                            }`}>
                              {order.status || 'PENDING'}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right font-bold text-[var(--color-ink)]">
                            {formatPrice(order.total || 0)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right: Recent Inquiries (40%) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <h2 className="text-[18px] font-extrabold text-[var(--color-ink)] font-[var(--font-display)]">
              Recent Inquiries
            </h2>
            <Link 
              href="/admin/inquiries" 
              className="text-[12px] font-bold text-[var(--color-signal)] hover:text-[var(--color-signal-hover)] flex items-center gap-1 uppercase tracking-wider font-mono"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {recentInquiries.length === 0 ? (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] p-6 text-center text-[var(--color-muted)] text-[13.5px] shadow-sm">
                No customer inquiries received yet.
              </div>
            ) : (
              recentInquiries.map((inquiry) => {
                const date = new Date(inquiry.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                })

                return (
                  <div key={inquiry._id.toString()} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] p-5 flex flex-col gap-2.5 shadow-sm hover:border-[#FF5A1F]/30 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-[13.5px] font-bold text-[var(--color-ink)] leading-tight">
                          {inquiry.name}
                        </span>
                        <span className="text-[11px] text-[var(--color-muted)]">
                          {inquiry.email} {inquiry.company ? `• ${inquiry.company}` : ''}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--color-muted)] uppercase shrink-0">
                        {date}
                      </span>
                    </div>

                    <div className="border-t border-[var(--color-border)] pt-2.5 mt-0.5">
                      <span className="text-[10.5px] font-mono uppercase text-[var(--color-signal)] tracking-wider font-bold">
                        Subject: {inquiry.subject}
                      </span>
                      <p className="text-[12.5px] text-[var(--color-body)] mt-1 leading-normal line-clamp-2">
                        {inquiry.message}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
