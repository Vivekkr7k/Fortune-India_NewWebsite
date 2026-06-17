import { connectDB } from '@/lib/mongoose'
import { Order } from '@/models'
import { OrdersPageClient } from './OrdersPageClient'

export const revalidate = 0

export default async function AdminOrdersPage() {
  await connectDB()

  // Fetch all orders sorted by newest first
  const orders = await Order.find().sort({ createdAt: -1 }).lean()

  // Serialize Mongoose ObjectIds / Dates to strings and sanitize for the client component
  const serializedOrders = JSON.parse(JSON.stringify(orders)).map((order: any) => {
    let name = order.name
    let email = order.email
    let phone = order.phone
    let address = order.address
    let city = order.city
    let state = order.state
    let pincode = order.pincode

    if (order.address && typeof order.address === 'object') {
      const addr = order.address
      address = addr.street || ''
      city = city || addr.city || ''
      state = state || addr.state || ''
      pincode = pincode || addr.zipcode || addr.pincode || ''
      
      if (!name && (addr.firstName || addr.lastName)) {
        name = [addr.firstName, addr.lastName].filter(Boolean).join(' ')
      }
      if (!email && addr.email) {
        email = addr.email
      }
      if (!phone && addr.phone) {
        phone = addr.phone
      }
    }

    if (name && typeof name === 'object') {
      name = name.firstName || name.lastName ? [name.firstName, name.lastName].filter(Boolean).join(' ') : JSON.stringify(name)
    }
    if (email && typeof email === 'object') {
      email = email.email || JSON.stringify(email)
    }
    if (phone && typeof phone === 'object') {
      phone = phone.phone || JSON.stringify(phone)
    }
    if (address && typeof address === 'object') {
      address = JSON.stringify(address)
    }

    return {
      ...order,
      orderNumber: order.orderNumber || `FI-LEGACY-${order._id.slice(-6).toUpperCase()}`,
      name: name || 'Anonymous Customer',
      email: email || 'no-email@fortuneindia.com',
      phone: phone || 'N/A',
      address: address || 'Address Not Provided',
      city: city || 'N/A',
      state: state || 'N/A',
      pincode: pincode || 'N/A',
      items: order.items || [],
      subtotal: order.subtotal || 0,
      shipping: order.shipping || 0,
      gst: order.gst || 0,
      total: order.total || 0,
      paymentMethod: order.paymentMethod || 'COD',
      paymentStatus: order.paymentStatus || 'PENDING',
      status: order.status || 'PENDING',
      createdAt: order.createdAt || new Date().toISOString(),
    }
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5 border-b border-[var(--color-border)] pb-6">
        <span className="font-mono text-[10px] text-[var(--color-signal)] uppercase tracking-[0.15em] font-semibold">
          / Management
        </span>
        <h1 className="text-[28px] md:text-[32px] font-extrabold tracking-tight font-[var(--font-display)] text-[var(--color-ink)]">
          Manage Orders
        </h1>
        <p className="text-[14px] text-[var(--color-muted)]">
          Monitor B2B transactions, verify manual UPI QR payments via UTR Transaction IDs, and update fulfillment statuses.
        </p>
      </div>

      {/* Orders Manager Client Container */}
      <OrdersPageClient initialOrders={serializedOrders} />
    </div>
  )
}
