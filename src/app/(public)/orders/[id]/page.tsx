import { connectDB } from '@/lib/mongoose'
import { Order, type IOrder } from '@/models'
import { getProductImageUrl } from '@/lib/imageUrl'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { OrderCheckmark } from '@/components/orders/OrderCheckmark'
import { formatPrice } from '@/lib/utils'
import { Calendar, CreditCard, MapPin } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export const revalidate = 0

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { id } = await params

  if (!OBJECT_ID_RE.test(id)) {
    notFound()
  }

  await connectDB()

  // Items are embedded in the order document — no join needed
  const order = await Order.findById(id).lean<IOrder>()

  if (!order) {
    notFound()
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-[var(--color-canvas)] min-h-screen py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">

        {/* Success checkmark animation (Client side) */}
        <OrderCheckmark />

        <h1 className="font-[var(--font-display)] text-[28px] md:text-[32px] font-extrabold text-[var(--color-ink)] tracking-tight leading-none mb-3">
          Order Confirmed!
        </h1>
        <p className="font-[var(--font-body)] text-[14.5px] text-[var(--color-muted)] mb-1">
          Your order <strong>#{order.orderNumber}</strong> has been placed successfully.
        </p>
        <p className="font-[var(--font-body)] text-[14px] text-[var(--color-muted)] mb-8">
          A confirmation invoice has been queued for dispatch to <strong>{order.email}</strong>.
        </p>

        {/* Order Card */}
        <div className="bg-white border border-[var(--color-border)] rounded-[20px] p-6 text-left shadow-sm mb-8 flex flex-col gap-5">

          <div className="grid grid-cols-2 gap-4 border-b border-[var(--color-border-light)] pb-4 text-[13px]">
            <div className="flex flex-col gap-0.5">
              <span className="font-[var(--font-mono)] text-[10px] text-[var(--color-muted)] uppercase tracking-wider">Order Number</span>
              <span className="font-semibold text-[var(--color-ink)]">#{order.orderNumber}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-[var(--font-mono)] text-[10px] text-[var(--color-muted)] uppercase tracking-wider">Order Date</span>
              <span className="font-semibold text-[var(--color-ink)] flex items-center gap-1">
                <Calendar size={13} className="text-[var(--color-signal)]" />
                {orderDate}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-[var(--font-mono)] text-[10px] text-[var(--color-muted)] uppercase tracking-wider">Payment Method</span>
              <span className="font-semibold text-[var(--color-ink)] flex items-center gap-1 uppercase">
                <CreditCard size={13} className="text-[var(--color-signal)]" />
                {order.paymentMethod === 'RAZORPAY' ? 'Paid Online' : order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'NEFT / Bank Transfer'}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-[var(--font-mono)] text-[10px] text-[var(--color-muted)] uppercase tracking-wider">Status</span>
              <span className="font-bold text-[var(--color-success)] uppercase text-[11px] tracking-wider bg-[var(--color-success-tint)] px-2.5 py-0.5 rounded-full self-start mt-0.5">
                {order.status}
              </span>
            </div>
          </div>

          {/* Items list */}
          <div className="flex flex-col divide-y divide-[var(--color-border-light)]">
            {order.items.map((item, idx) => {
              const imgSrc = getProductImageUrl(item.image)

              return (
                <div key={`${String(item.productId)}-${idx}`} className="py-3.5 flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-[#EBEBEB] border border-[var(--color-border)] rounded-md overflow-hidden shrink-0">
                      {imgSrc ? (
                        <Image
                          src={imgSrc}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[7px] text-[#BBB] font-mono leading-none">
                          Placeholder
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-[var(--font-body)] text-[13.5px] font-semibold text-[var(--color-ink)] leading-snug">
                        {item.name}
                      </h4>
                      <span className="font-[var(--font-mono)] text-[10px] text-[var(--color-muted)] mt-0.5">
                        Qty: {item.quantity} &bull; {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                  <span className="font-[var(--font-body)] text-[14px] font-bold text-[var(--color-ink)]">
                    {formatPrice(item.total)}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Shipping Address */}
          <div className="border-t border-[var(--color-border-light)] pt-4 flex flex-col gap-1 text-[13px] text-[var(--color-body)]">
            <span className="font-[var(--font-mono)] text-[10px] text-[var(--color-muted)] uppercase tracking-wider mb-0.5">Shipping Address</span>
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-[var(--color-signal)] shrink-0 mt-0.5" />
              <span>
                <strong>{order.name}</strong> ({order.phone})<br />
                {order.address}, {order.city}, {order.state} - {order.pincode}
              </span>
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-[var(--color-border-light)] pt-4 flex flex-col gap-2.5 text-[13.5px] text-[var(--color-muted)]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[var(--color-ink)]">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-[var(--color-ink)]">
                {order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span className="font-semibold text-[var(--color-ink)]">{formatPrice(order.gst ?? order.subtotal * 0.18)}</span>
            </div>
            <div className="flex justify-between pt-2.5 border-t border-[var(--color-border-light)] text-[16px] font-bold text-[var(--color-ink)]">
              <span>Total Paid</span>
              <span className="font-[var(--font-display)] text-[20px] font-extrabold text-[var(--color-ink)]">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

        </div>

        {/* Processing Timeline */}
        <div className="bg-white border border-[var(--color-border)] rounded-[20px] p-6 text-left shadow-sm mb-8">
          <span className="font-[var(--font-mono)] text-[10px] text-[var(--color-muted)] uppercase tracking-wider block mb-4">
            Estimated Timeline
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
            {/* Horizontal Line connector */}
            <div className="hidden sm:block absolute left-4 right-4 top-[10px] h-[1px] bg-[var(--color-border-dark)] -z-0" />

            <div className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center sm:gap-2 relative z-10 flex-1">
              <span className="w-5 h-5 rounded-full bg-[var(--color-signal)] text-white text-[10px] font-bold flex items-center justify-center font-mono shrink-0">✓</span>
              <div className="flex flex-col gap-0.5">
                <span className="font-[var(--font-mono)] text-[11px] font-bold text-[var(--color-signal)] uppercase tracking-wider">Order Confirmed</span>
                <span className="text-[12px] text-[var(--color-muted)]">Payment received</span>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center sm:gap-2 relative z-10 flex-1">
              <span className="w-5 h-5 rounded-full bg-[var(--color-canvas)] border border-[var(--color-border-dark)] text-[var(--color-muted)] text-[10px] font-bold flex items-center justify-center font-mono shrink-0">2</span>
              <div className="flex flex-col gap-0.5">
                <span className="font-[var(--font-mono)] text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wider">Processing</span>
                <span className="text-[12px] text-[var(--color-muted)]">Print run production (1-2 days)</span>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center sm:gap-2 relative z-10 flex-1">
              <span className="w-5 h-5 rounded-full bg-[var(--color-canvas)] border border-[var(--color-border-dark)] text-[var(--color-muted)] text-[10px] font-bold flex items-center justify-center font-mono shrink-0">3</span>
              <div className="flex flex-col gap-0.5">
                <span className="font-[var(--font-mono)] text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wider">Shipped</span>
                <span className="text-[12px] text-[var(--color-muted)]">Pan-India delivery (5-7 days)</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/products"
            className="w-full sm:w-auto px-8 py-3 rounded-full border border-[var(--color-signal)] text-[var(--color-signal)] font-bold text-[13px] hover:bg-[var(--color-signal-tint)] transition-all cursor-pointer text-center"
          >
            Continue Shopping &rarr;
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-transparent hover:text-[var(--color-signal)] text-[var(--color-ink)] font-bold text-[13px] transition-colors cursor-pointer text-center"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  )
}
