'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter,
  CreditCard,
  User,
  MapPin,
  ClipboardList
} from 'lucide-react'

interface OrderItem {
  productId: string
  name: string
  code?: string
  price: number
  shippingCharge: number
  quantity: number
  total: number
  image?: string
}

interface OrderData {
  _id: string
  orderNumber: string
  name: string
  email: string
  phone: string
  company?: string
  address: string
  city: string
  state: string
  pincode: string
  gstNumber?: string
  poNumber?: string
  items: OrderItem[]
  subtotal: number
  shipping: number

  total: number
  paymentMethod: 'RAZORPAY' | 'BANK_TRANSFER' | 'UPI_QR'
  razorpayOrderId?: string
  razorpayPaymentId?: string
  upiTransactionId?: string
  bankTransactionId?: string
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED'
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  notes?: string
  createdAt: string
}

export function OrdersPageClient({ initialOrders }: { initialOrders: OrderData[] }) {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderData[]>(initialOrders)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | OrderData['status']>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id)
  }

  const handleUpdateStatus = async (
    orderId: string, 
    newStatus?: OrderData['status'], 
    newPaymentStatus?: OrderData['paymentStatus']
  ) => {
    setUpdatingId(orderId)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          paymentStatus: newPaymentStatus
        })
      })

      if (!res.ok) {
        throw new Error('Failed to update order status')
      }

      const updatedOrder = await res.json()
      
      // Update local state
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, ...updatedOrder } : o))
      toast.success('Order updated successfully!')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to update status.')
    } finally {
      setUpdatingId(null)
    }
  }

  // Filter & Search Logic
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.upiTransactionId && order.upiTransactionId.includes(searchTerm)) ||
      (order.bankTransactionId && order.bankTransactionId.includes(searchTerm))

    return matchesStatus && matchesSearch
  })

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const range = 1
    pages.push(1)
    const start = Math.max(2, currentPage - range)
    const end = Math.min(totalPages - 1, currentPage + range)
    if (currentPage - range > 2) {
      pages.push('...')
    }
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    if (currentPage + range < totalPages - 1) {
      pages.push('...')
    }
    if (totalPages > 1) {
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="flex flex-col gap-6 text-[var(--color-body)]">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-[20px] shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search by order #, name, email..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[13.5px] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] placeholder-[var(--color-placeholder)] transition-all"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={15} className="text-[var(--color-signal)]" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any)
              setCurrentPage(1)
            }}
            className="px-3 py-2 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[13.5px] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] cursor-pointer"
          >
            <option value="all">All Order Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-4">
        {paginatedOrders.length === 0 ? (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] p-12 text-center text-[var(--color-muted)] text-[14px]">
            No orders match the current search or filter.
          </div>
        ) : (
          paginatedOrders.map((order) => {
            const isExpanded = expandedOrderId === order._id
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })

            return (
              <div 
                key={order._id} 
                className={`bg-[var(--color-surface)] border rounded-[20px] transition-all overflow-hidden flex flex-col ${
                  isExpanded ? 'border-[var(--color-signal)]/50 shadow-md' : 'border-[var(--color-border)] hover:border-[var(--color-signal)]/30'
                }`}
              >
                {/* Header Row (Summary) */}
                <div 
                  onClick={() => toggleExpand(order._id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider">Order No</span>
                      <span className="font-mono text-[14px] font-bold text-[var(--color-ink)]">#{order.orderNumber}</span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider">Date</span>
                      <span className="text-[13px] text-[var(--color-body)] font-medium">{dateStr}</span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider">Customer</span>
                      <span className="text-[13px] text-[var(--color-ink)] font-bold">{order.name}</span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider">Payment Method</span>
                      <span className="text-[13px] text-[var(--color-body)] font-bold uppercase">
                        {order.paymentMethod === 'RAZORPAY' 
                          ? 'Razorpay' 
                          : order.paymentMethod === 'UPI_QR' 
                          ? 'UPI QR' 
                          : 'NEFT'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 self-end md:self-auto">
                    {/* Status Badge */}
                    <div className="flex flex-col gap-0.5 items-end">
                      <span className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider">Status</span>
                      <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase mt-0.5 ${
                        order.status === 'DELIVERED'
                          ? 'bg-[#1A9E5C]/10 text-[#1A9E5C]'
                          : order.status === 'CANCELLED'
                          ? 'bg-[#E63946]/10 text-[#E63946]'
                          : 'bg-[#FF5A1F]/10 text-[#FF5A1F]'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Total */}
                    <div className="flex flex-col gap-0.5 items-end pr-2">
                      <span className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider">Amount</span>
                      <span className="text-[15px] font-extrabold text-[var(--color-ink)] font-[var(--font-display)]">
                        {formatPrice(order.total)}
                      </span>
                    </div>

                    {isExpanded ? <ChevronUp className="text-[var(--color-muted)] shrink-0" size={18} /> : <ChevronDown className="text-[var(--color-muted)] shrink-0" size={18} />}
                  </div>
                </div>

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-alt)]/30 p-6 flex flex-col gap-6 text-[13.5px]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Customer Details */}
                      <div className="flex flex-col gap-3">
                        <h4 className="font-bold text-[var(--color-ink)] border-b border-[var(--color-border)] pb-2 flex items-center gap-1.5 uppercase text-[11px] tracking-wider font-mono">
                          <User size={13} className="text-[var(--color-signal)]" />
                          <span>Customer Contact</span>
                        </h4>
                        <div className="flex flex-col gap-1.5 text-[var(--color-muted)]">
                          <span>Name: <strong className="text-[var(--color-ink)]">{order.name}</strong></span>
                          <span>Email: <strong className="text-[var(--color-ink)]">{order.email}</strong></span>
                          <span>Phone: <strong className="text-[var(--color-ink)]">{order.phone}</strong></span>
                          {order.company && <span>Company: <strong className="text-[var(--color-ink)]">{order.company}</strong></span>}
                          {order.gstNumber && <span>GSTIN: <strong className="text-[var(--color-ink)] uppercase font-mono">{order.gstNumber}</strong></span>}
                          {order.poNumber && <span>PO Reference: <strong className="text-[var(--color-ink)] font-mono">{order.poNumber}</strong></span>}
                        </div>
                      </div>

                      {/* Delivery Details */}
                      <div className="flex flex-col gap-3">
                        <h4 className="font-bold text-[var(--color-ink)] border-b border-[var(--color-border)] pb-2 flex items-center gap-1.5 uppercase text-[11px] tracking-wider font-mono">
                          <MapPin size={13} className="text-[var(--color-signal)]" />
                          <span>Delivery Address</span>
                        </h4>
                        <div className="flex flex-col gap-1.5 text-[var(--color-muted)] leading-relaxed">
                          <span>{order.address}</span>
                          <span>{order.city}, {order.state} - {order.pincode}</span>
                        </div>
                      </div>

                      {/* Payment & Order Status Control */}
                      <div className="flex flex-col gap-3">
                        <h4 className="font-bold text-[var(--color-ink)] border-b border-[var(--color-border)] pb-2 flex items-center gap-1.5 uppercase text-[11px] tracking-wider font-mono">
                          <CreditCard size={13} className="text-[var(--color-signal)]" />
                          <span>Payment & Status Control</span>
                        </h4>
                        <div className="flex flex-col gap-4">
                          {/* Payment status line */}
                          <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-[var(--color-muted)]">Payment:</span>
                              <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                order.paymentStatus === 'PAID' ? 'bg-[#1A9E5C]/10 text-[#1A9E5C]' : 'bg-[#E6A817]/10 text-[#E6A817]'
                              }`}>{order.paymentStatus}</span>
                            </div>
                            {order.upiTransactionId && (
                              <span className="text-[11px] text-[var(--color-muted)] font-mono break-all mt-1">
                                UPI UTR: <strong className="text-[var(--color-body)]">{order.upiTransactionId}</strong>
                              </span>
                            )}
                            {order.bankTransactionId && (
                              <span className="text-[11px] text-[var(--color-muted)] font-mono break-all mt-1">
                                NEFT Ref: <strong className="text-[var(--color-body)]">{order.bankTransactionId}</strong>
                              </span>
                            )}
                          </div>

                          {/* Control Dropdowns */}
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-[11px] font-bold text-[var(--color-muted)] uppercase font-mono">Update Order Status</span>
                              <select
                                disabled={updatingId === order._id}
                                value={order.status}
                                onChange={(e) => handleUpdateStatus(order._id, e.target.value as any, undefined)}
                                className="w-full px-3 py-2 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[13px] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] cursor-pointer disabled:opacity-40"
                              >
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                              </select>
                            </div>

                            <div className="flex flex-col gap-1 mt-1">
                              <span className="text-[11px] font-bold text-[var(--color-muted)] uppercase font-mono">Update Payment Status</span>
                              <select
                                disabled={updatingId === order._id}
                                value={order.paymentStatus}
                                onChange={(e) => handleUpdateStatus(order._id, undefined, e.target.value as any)}
                                className="w-full px-3 py-2 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[13px] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] cursor-pointer disabled:opacity-40"
                              >
                                <option value="PENDING">Pending</option>
                                <option value="PAID">Paid</option>
                                <option value="FAILED">Failed</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Order Items Table */}
                    <div className="flex flex-col gap-3 mt-4 border-t border-[var(--color-border)] pt-4">
                      <h4 className="font-bold text-[var(--color-ink)] flex items-center gap-1.5 uppercase text-[11px] tracking-wider font-mono">
                        <ClipboardList size={13} className="text-[var(--color-signal)]" />
                        <span>Order Items ({order.items.length})</span>
                      </h4>
                      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-[12.5px] border-collapse">
                          <thead>
                            <tr className="bg-[var(--color-surface-alt)] border-b border-[var(--color-border)] text-[var(--color-muted)] font-mono text-[9.5px] uppercase">
                              <th className="px-4 py-3">Item</th>
                              <th className="px-4 py-3 text-center">Qty</th>
                              <th className="px-4 py-3 text-right">Unit Price</th>
                              <th className="px-4 py-3 text-right">Shipping</th>
                              <th className="px-4 py-3 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--color-border)]">
                            {order.items.map((item, index) => (
                              <tr key={index} className="hover:bg-[var(--color-surface-alt)]/30 transition-colors">
                                <td className="px-4 py-3 font-semibold text-[var(--color-ink)]">
                                  {item.name}
                                  {item.code && <span className="block font-mono text-[10px] text-[var(--color-muted)] mt-0.5">{item.code}</span>}
                                </td>
                                <td className="px-4 py-3 text-center font-bold text-[var(--color-ink)]">{item.quantity}</td>
                                <td className="px-4 py-3 text-right font-medium text-[var(--color-muted)]">{formatPrice(item.price)}</td>
                                <td className="px-4 py-3 text-right font-medium text-[var(--color-muted)]">{formatPrice(item.shippingCharge)}</td>
                                <td className="px-4 py-3 text-right font-bold text-[var(--color-ink)]">{formatPrice(item.total)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Calculations breakdown */}
                      <div className="flex flex-col gap-2 self-end w-full max-w-[280px] bg-[var(--color-canvas)] p-4 rounded-xl border border-[var(--color-border)] text-[12.5px] text-[var(--color-muted)] mt-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span className="font-semibold text-[var(--color-ink)]">{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span className="font-semibold text-[var(--color-ink)]">{formatPrice(order.shipping)}</span>
                        </div>

                        <div className="flex justify-between border-t border-[var(--color-border)] pt-2 mt-1 text-[14px] font-bold text-[var(--color-signal)]">
                          <span>Grand Total:</span>
                          <span className="font-extrabold text-[var(--color-ink)]">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="bg-[var(--color-signal-tint)] border border-[var(--color-signal)]/20 p-4 rounded-xl mt-4 flex flex-col gap-1 text-[13px]">
                        <span className="text-[10.5px] font-mono uppercase text-[var(--color-signal)] tracking-wider font-bold">Special Instructions / Customer Notes</span>
                        <p className="text-[var(--color-body)] leading-normal">{order.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-2 pb-6">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-body)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-surface-alt)] font-semibold transition-all cursor-pointer text-[13px]"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, idx) => {
              if (page === '...') {
                return (
                  <span key={`dots-${idx}`} className="px-2 text-[var(--color-muted)] font-bold">
                    ...
                  </span>
                )
              }
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(Number(page))}
                  className={`w-9 h-9 rounded-full font-mono text-[13px] font-bold flex items-center justify-center transition-all cursor-pointer border ${
                    currentPage === page
                      ? 'bg-[var(--color-signal)] border-[var(--color-signal)] text-white'
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-body)] hover:bg-[var(--color-surface-alt)]'
                  }`}
                >
                  {page}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-body)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-surface-alt)] font-semibold transition-all cursor-pointer text-[13px]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
