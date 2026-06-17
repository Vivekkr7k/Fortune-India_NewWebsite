'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ShoppingCart, ShieldCheck, CreditCard, Landmark, Truck, QrCode } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

const checkoutSchema = z.object({
  name: z.string().min(2, 'Full Name is required (minimum 2 characters)'),
  company: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  address: z.string().min(10, 'Full address is required (minimum 10 characters)'),
  address2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit pin code'),
  gst: z.string().optional(),
  poNumber: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(['RAZORPAY', 'COD', 'BANK_TRANSFER', 'UPI_QR']),
  upiTransactionId: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod === 'UPI_QR') {
    if (!data.upiTransactionId || data.upiTransactionId.trim().length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'UPI Transaction ID / UTR is required (minimum 6 characters)',
        path: ['upiTransactionId'],
      });
    }
  }
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const { items, total, count, clearCart } = useCartStore()

  // Load Razorpay checkout script and track when it's ready
  useEffect(() => {
    setMounted(true)

    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      setRazorpayLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setRazorpayLoaded(true)
    script.onerror = () => setRazorpayLoaded(false)
    document.body.appendChild(script)
    return () => {
      try {
        document.body.removeChild(script)
      } catch (err) {}
    }
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'RAZORPAY',
    }
  })

  const selectedPaymentMethod = watch('paymentMethod')

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--color-canvas)] py-20 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-signal)] border-t-transparent animate-spin"></div>
      </div>
    )
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="bg-[var(--color-canvas)] min-h-[60vh] py-20 px-4 flex items-center justify-center text-center">
        <div className="bg-white border border-[var(--color-border)] rounded-[20px] shadow-sm p-10 max-w-md w-full">
          <h2 className="font-[var(--font-display)] text-[22px] font-bold text-[var(--color-ink)] mb-2">
            Your Cart is Empty
          </h2>
          <p className="font-[var(--font-body)] text-[14px] text-[var(--color-muted)] mb-6">
            You cannot proceed to checkout without items in your cart.
          </p>
          <Link
            href="/products"
            className="px-6 py-2.5 rounded-full bg-[var(--color-signal)] hover:bg-[var(--color-signal-hover)] text-white text-[13px] font-bold inline-flex transition-colors cursor-pointer"
          >
            Go to Products
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = total()
  const gst = subtotal * 0.18
  // Shipping comes from each product's own shippingCharge
  const shipping = items.reduce((s, i) => s + (i.shippingCharge || 0) * i.quantity, 0)
  const grandTotal = subtotal + gst + shipping

  async function onSubmit(data: CheckoutFormData) {
    // Guard against submitting before the cart store has hydrated
    if (!items.length) {
      toast.error('Your cart is empty.')
      router.push('/cart')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            productId: i.productId,
            code: i.code,
            name: i.name,
            price: i.price,
            shippingCharge: i.shippingCharge || 0,
            quantity: i.quantity,
            image: i.image,
          })),
          customer: data,
          paymentMethod: data.paymentMethod,
          upiTransactionId: data.paymentMethod === 'UPI_QR' ? data.upiTransactionId : undefined,
        })
      })

      if (!res.ok) {
        // Surface the server's actual error instead of a generic string
        const errBody = await res.json().catch(() => ({}))
        const serverMessage = errBody?.error || `${res.status} ${res.statusText}`
        console.error('Order API error:', res.status, serverMessage, errBody)
        throw new Error(serverMessage)
      }

      const orderResult = await res.json()

      if (data.paymentMethod !== 'RAZORPAY') {
        clearCart()
        toast.success('Order placed successfully!')
        router.push(`/orders/${orderResult.orderId}`)
        return
      }

      // The server only returns razorpayOrderId when the gateway call succeeded
      if (!orderResult.razorpayOrderId) {
        throw new Error('Could not start the payment. Please try Cash on Delivery or contact us.')
      }

      // Razorpay script and a real (non-dummy) public key are both required
      const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      if (!razorpayLoaded || typeof window === 'undefined' || !(window as any).Razorpay) {
        toast.error('Payment system is still loading — please try again in a second.')
        setLoading(false)
        return
      }
      if (!rzpKey || rzpKey.includes('dummy')) {
        toast.error('Online payment key is not configured. Please use Cash on Delivery.')
        setLoading(false)
        return
      }

      // Trigger Razorpay payment gateway
      const options = {
        key: rzpKey,
        amount: Math.round(orderResult.amount * 100),
        currency: 'INR',
        name: 'Fortune India',
        description: `Order ${orderResult.orderNumber}`,
        order_id: orderResult.razorpayOrderId,
        prefill: {
          name: data.name,
          email: data.email,
          contact: data.phone,
        },
        theme: { color: '#FF5A1F' },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('/api/orders/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderResult.orderId,
              })
            })

            if (verifyRes.ok) {
              clearCart()
              toast.success('Payment verified! Order placed successfully.')
              router.push(`/orders/${orderResult.orderId}`)
            } else {
              toast.error('Payment verification failed. Please contact support.')
              setLoading(false)
            }
          } catch (verifyErr) {
            console.error('Payment verification exception:', verifyErr)
            toast.error('Payment verification failed.')
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            toast.warning('Payment process cancelled.')
          }
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()

    } catch (err: any) {
      console.error('Checkout error:', err)
      toast.error(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-[var(--color-canvas)] min-h-screen">
      {/* Step Indicator */}
      <div className="bg-white border-b border-[var(--color-border-light)] py-4">
        <div className="max-w-[var(--container)] mx-auto px-4 md:px-8 flex items-center justify-center gap-2 md:gap-4 text-[12px] md:text-[13px] font-[var(--font-mono)] font-semibold uppercase tracking-wider select-none">
          <Link href="/cart" className="flex items-center gap-1.5 text-[var(--color-success)] hover:text-[var(--color-signal)] transition-colors">
            <span className="w-5 h-5 rounded-full bg-[var(--color-success-tint)] text-[var(--color-success)] flex items-center justify-center font-mono font-bold text-[10px]">✓</span>
            <span>Cart</span>
          </Link>
          <span className="h-[1px] w-8 bg-[var(--color-border-dark)]" />
          <div className="flex items-center gap-1.5 text-[var(--color-signal)]">
            <span className="w-5 h-5 rounded-full bg-[var(--color-signal)] text-white flex items-center justify-center font-mono font-bold text-[10px]">2</span>
            <span>Details</span>
          </div>
          <span className="h-[1px] w-8 bg-[var(--color-border-dark)]" />
          <div className="flex items-center gap-1.5 text-[var(--color-muted)]">
            <span className="w-5 h-5 rounded-full border border-[var(--color-border-dark)] text-[var(--color-muted)] flex items-center justify-center font-mono text-[10px]">3</span>
            <span>Payment</span>
          </div>
          <span className="h-[1px] w-8 bg-[var(--color-border-dark)]" />
          <div className="flex items-center gap-1.5 text-[var(--color-muted)]">
            <span className="w-5 h-5 rounded-full border border-[var(--color-border-dark)] text-[var(--color-muted)] flex items-center justify-center font-mono text-[10px]">4</span>
            <span>Confirm</span>
          </div>
        </div>
      </div>

      <div className="max-w-[var(--container)] mx-auto px-4 md:px-8 py-10">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Checkout Form (55%) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Section 1: Contact Information */}
            <div className="bg-white border border-[var(--color-border)] rounded-[20px] p-6 shadow-sm flex flex-col gap-4">
              <h2 className="font-[var(--font-display)] text-[16px] font-bold text-[var(--color-ink)] border-b border-[var(--color-border-light)] pb-3.5 mb-2">
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[13px] font-semibold text-[var(--color-ink)]">Full Name*</label>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="Enter your full name"
                    className={`px-3.5 py-2.5 text-[14.5px] border rounded-lg focus:outline-none focus:border-[var(--color-signal)] ${errors.name ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'}`}
                  />
                  {errors.name && <span className="text-[11.5px] text-[var(--color-error)] mt-0.5">{errors.name.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[13px] font-semibold text-[var(--color-ink)]">Company Name</label>
                  <input
                    type="text"
                    {...register('company')}
                    placeholder="e.g. HAL, BHEL (Optional)"
                    className="px-3.5 py-2.5 text-[14.5px] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-signal)]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[var(--color-ink)]">Email Address*</label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="you@example.com"
                    className={`px-3.5 py-2.5 text-[14.5px] border rounded-lg focus:outline-none focus:border-[var(--color-signal)] ${errors.email ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'}`}
                  />
                  {errors.email && <span className="text-[11.5px] text-[var(--color-error)] mt-0.5">{errors.email.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[var(--color-ink)]">Mobile Number*</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14.5px] text-[var(--color-muted)] font-medium select-none">+91</span>
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="9876543210"
                      className={`w-full pl-12 pr-3.5 py-2.5 text-[14.5px] border rounded-lg focus:outline-none focus:border-[var(--color-signal)] ${errors.phone ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'}`}
                    />
                  </div>
                  {errors.phone && <span className="text-[11.5px] text-[var(--color-error)] mt-0.5">{errors.phone.message}</span>}
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Address */}
            <div className="bg-white border border-[var(--color-border)] rounded-[20px] p-6 shadow-sm flex flex-col gap-4">
              <h2 className="font-[var(--font-display)] text-[16px] font-bold text-[var(--color-ink)] border-b border-[var(--color-border-light)] pb-3.5 mb-2">
                Delivery Address
              </h2>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[var(--color-ink)]">Address Line 1*</label>
                <input
                  type="text"
                  {...register('address')}
                  placeholder="Building number, street address, area"
                  className={`px-3.5 py-2.5 text-[14.5px] border rounded-lg focus:outline-none focus:border-[var(--color-signal)] ${errors.address ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'}`}
                />
                {errors.address && <span className="text-[11.5px] text-[var(--color-error)] mt-0.5">{errors.address.message}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-semibold text-[var(--color-ink)]">Address Line 2</label>
                  <span className="text-[10.5px] font-[var(--font-mono)] uppercase text-[var(--color-muted)]">Optional</span>
                </div>
                <input
                  type="text"
                  {...register('address2')}
                  placeholder="Apartment, suite, unit, floor"
                  className="px-3.5 py-2.5 text-[14.5px] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-signal)]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[var(--color-ink)]">City*</label>
                  <input
                    type="text"
                    {...register('city')}
                    placeholder="Enter city"
                    className={`px-3.5 py-2.5 text-[14.5px] border rounded-lg focus:outline-none focus:border-[var(--color-signal)] ${errors.city ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'}`}
                  />
                  {errors.city && <span className="text-[11.5px] text-[var(--color-error)] mt-0.5">{errors.city.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[var(--color-ink)]">State*</label>
                  <input
                    type="text"
                    {...register('state')}
                    placeholder="Enter state"
                    className={`px-3.5 py-2.5 text-[14.5px] border rounded-lg focus:outline-none focus:border-[var(--color-signal)] ${errors.state ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'}`}
                  />
                  {errors.state && <span className="text-[11.5px] text-[var(--color-error)] mt-0.5">{errors.state.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[var(--color-ink)]">Pincode*</label>
                  <input
                    type="text"
                    {...register('pincode')}
                    placeholder="6-digit PIN code"
                    maxLength={6}
                    className={`px-3.5 py-2.5 text-[14.5px] border rounded-lg focus:outline-none focus:border-[var(--color-signal)] ${errors.pincode ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'}`}
                  />
                  {errors.pincode && <span className="text-[11.5px] text-[var(--color-error)] mt-0.5">{errors.pincode.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[var(--color-ink)]">Country</label>
                  <input
                    type="text"
                    value="India"
                    disabled
                    className="px-3.5 py-2.5 text-[14.5px] border border-[var(--color-border)] rounded-lg bg-[var(--color-canvas)] text-[var(--color-muted)] font-medium cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Additional Details Accordion */}
            <div className="bg-white border border-[var(--color-border)] rounded-[20px] p-6 shadow-sm flex flex-col gap-4">
              <h2 className="font-[var(--font-display)] text-[16px] font-bold text-[var(--color-ink)] border-b border-[var(--color-border-light)] pb-3.5 mb-2">
                Additional Details (B2B Billing)
              </h2>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-semibold text-[var(--color-ink)]">GST Number</label>
                    <span className="text-[10.5px] font-[var(--font-mono)] uppercase text-[var(--color-muted)]">Optional</span>
                  </div>
                  <input
                    type="text"
                    {...register('gst')}
                    placeholder="e.g. 29AAAAA1111A1Z1"
                    className="px-3.5 py-2.5 text-[14.5px] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-signal)] uppercase"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-semibold text-[var(--color-ink)]">Purchase Order (PO) Number</label>
                    <span className="text-[10.5px] font-[var(--font-mono)] uppercase text-[var(--color-muted)]">Optional</span>
                  </div>
                  <input
                    type="text"
                    {...register('poNumber')}
                    placeholder="Your corporate PO reference number"
                    className="px-3.5 py-2.5 text-[14.5px] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-signal)]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-semibold text-[var(--color-ink)]">Special Instructions</label>
                    <span className="text-[10.5px] font-[var(--font-mono)] uppercase text-[var(--color-muted)]">Optional</span>
                  </div>
                  <textarea
                    {...register('notes')}
                    placeholder="Enter dimensional modifications, tolerance expectations or delivery notes here..."
                    rows={4}
                    className="px-3.5 py-2.5 text-[14.5px] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-signal)] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Payment Method */}
            <div className="bg-white border border-[var(--color-border)] rounded-[20px] p-6 shadow-sm flex flex-col gap-4">
              <h2 className="font-[var(--font-display)] text-[16px] font-bold text-[var(--color-ink)] border-b border-[var(--color-border-light)] pb-3.5 mb-2">
                Payment Method
              </h2>
              
              <div className="flex flex-col gap-3">
                {/* Razorpay Option */}
                <label className={`border rounded-[14px] p-4 flex items-center justify-between cursor-pointer transition-all ${selectedPaymentMethod === 'RAZORPAY' ? 'border-[var(--color-signal)] border-2 bg-[var(--color-signal-tint)]' : 'border-[var(--color-border)] hover:border-[var(--color-border-dark)] bg-white'}`}>
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      value="RAZORPAY"
                      {...register('paymentMethod')}
                      className="accent-[var(--color-signal)] w-4 h-4 cursor-pointer"
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[14px] font-bold text-[var(--color-ink)]">Pay Online</span>
                      <span className="text-[12px] text-[var(--color-muted)]">Razorpay: UPI, Cards, NetBanking, Corporate Wallets</span>
                    </div>
                  </div>
                  <CreditCard size={18} className="text-[var(--color-signal)] shrink-0 hidden sm:block" />
                </label>

                {/* Cash on Delivery Option */}
                <label className={`border rounded-[14px] p-4 flex items-center justify-between cursor-pointer transition-all ${selectedPaymentMethod === 'COD' ? 'border-[var(--color-signal)] border-2 bg-[var(--color-signal-tint)]' : 'border-[var(--color-border)] hover:border-[var(--color-border-dark)] bg-white'}`}>
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      value="COD"
                      {...register('paymentMethod')}
                      className="accent-[var(--color-signal)] w-4 h-4 cursor-pointer"
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[14px] font-bold text-[var(--color-ink)]">Cash on Delivery (COD)</span>
                      <span className="text-[12px] text-[var(--color-muted)]">Pay by Cash / UPI upon receiving delivery at Attibele/Bangalore</span>
                    </div>
                  </div>
                  <Truck size={18} className="text-[var(--color-signal)] shrink-0 hidden sm:block" />
                </label>

                {/* Bank Transfer Option */}
                <label className={`border rounded-[14px] p-4 flex items-center justify-between cursor-pointer transition-all ${selectedPaymentMethod === 'BANK_TRANSFER' ? 'border-[var(--color-signal)] border-2 bg-[var(--color-signal-tint)]' : 'border-[var(--color-border)] hover:border-[var(--color-border-dark)] bg-white'}`}>
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      value="BANK_TRANSFER"
                      {...register('paymentMethod')}
                      className="accent-[var(--color-signal)] w-4 h-4 cursor-pointer"
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[14px] font-bold text-[var(--color-ink)]">NEFT / Bank Transfer</span>
                      <span className="text-[12px] text-[var(--color-muted)]">Official bank account invoice details shared to email</span>
                    </div>
                  </div>
                  <Landmark size={18} className="text-[var(--color-signal)] shrink-0 hidden sm:block" />
                </label>

                {/* UPI QR Option */}
                <label className={`border rounded-[14px] p-4 flex flex-col gap-4 cursor-pointer transition-all ${selectedPaymentMethod === 'UPI_QR' ? 'border-[var(--color-signal)] border-2 bg-[var(--color-signal-tint)]' : 'border-[var(--color-border)] hover:border-[var(--color-border-dark)] bg-white'}`}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3.5">
                      <input
                        type="radio"
                        value="UPI_QR"
                        {...register('paymentMethod')}
                        className="accent-[var(--color-signal)] w-4 h-4 cursor-pointer"
                      />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[14px] font-bold text-[var(--color-ink)]">Scan UPI QR Code</span>
                        <span className="text-[12px] text-[var(--color-muted)]">Scan Karnataka Bank QR to pay instantly with any UPI app</span>
                      </div>
                    </div>
                    <QrCode size={18} className="text-[var(--color-signal)] shrink-0 hidden sm:block" />
                  </div>

                  {selectedPaymentMethod === 'UPI_QR' && (
                    <div className="border-t border-[var(--color-border-light)] pt-4 mt-2 flex flex-col items-center gap-4 bg-white p-4 rounded-xl border w-full cursor-default" onClick={(e) => e.stopPropagation()}>
                      <div className="text-center flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wider">Karnataka Bank QR</span>
                        <span className="text-[20px] font-extrabold text-[var(--color-ink)] font-[var(--font-display)]">
                          {formatPrice(grandTotal)}
                        </span>
                        <span className="text-[11px] text-[var(--color-muted)] font-mono">
                          UPI ID: <strong className="text-[var(--color-ink)] select-all font-bold">fortuneindia@kbl</strong>
                        </span>
                      </div>
                      
                      <div className="relative w-[320px] h-[445px] bg-white border border-[var(--color-border-light)] rounded-lg overflow-hidden flex items-center justify-center p-1 shadow-sm">
                        <Image
                          src="/payment_qr.jpeg"
                          alt="Karnataka Bank UPI QR Code"
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="w-full flex flex-col gap-1.5 text-left">
                        <label className="text-[12px] font-bold text-[var(--color-ink)]">
                          Enter 12-digit UPI Transaction ID / UTR Number*
                        </label>
                        <input
                          type="text"
                          {...register('upiTransactionId')}
                          placeholder="e.g. 301234567890"
                          className={`px-3.5 py-2 text-[14px] border rounded-lg focus:outline-none focus:border-[var(--color-signal)] ${errors.upiTransactionId ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'}`}
                        />
                        {errors.upiTransactionId && (
                          <span className="text-[11.5px] text-[var(--color-error)] mt-0.5">
                            {errors.upiTransactionId.message}
                          </span>
                        )}
                        <span className="text-[11px] text-[var(--color-muted)] leading-normal mt-1">
                          Scan the QR code, pay the exact total via GPay/PhonePe/Paytm/BHIM, enter the UTR/Transaction ID above, then click place order below.
                        </span>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] rounded-full bg-[var(--color-signal)] hover:bg-[var(--color-signal-hover)] text-white text-[15px] font-bold flex items-center justify-center gap-2 mt-4 shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : selectedPaymentMethod === 'RAZORPAY' ? (
                  'Proceed to Pay →'
                ) : selectedPaymentMethod === 'COD' ? (
                  'Place Order →'
                ) : selectedPaymentMethod === 'UPI_QR' ? (
                  'Place Order →'
                ) : (
                  'Confirm Order →'
                )}
              </button>
              
              <div className="text-center mt-1">
                <span className="text-[11px] text-[var(--color-muted)] font-[var(--font-mono)]">
                  By placing this order, you agree to our{' '}
                  <Link href="/terms" className="underline hover:text-[var(--color-signal)] transition-colors">
                    Terms &amp; Conditions
                  </Link>
                </span>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Order Summary (45%) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white border border-[var(--color-border)] rounded-[20px] p-6 shadow-sm flex flex-col gap-5">
              
              <h2 className="font-[var(--font-display)] text-[18px] font-bold text-[var(--color-ink)]">
                Order Summary
              </h2>

              {/* Items scroll list */}
              <div className="max-h-[320px] overflow-y-auto flex flex-col divide-y divide-[var(--color-border-light)] pr-1">
                {items.map((item) => (
                  <div key={item.productId} className="py-3 flex gap-3 items-center">
                    <div className="relative w-14 h-14 bg-[#EBEBEB] border border-[var(--color-border)] rounded-md overflow-hidden shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-[#BBB] font-mono">
                          Placeholder
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col">
                      <span className="font-[var(--font-mono)] text-[9px] font-bold text-[var(--color-signal)] uppercase tracking-wide leading-none">
                        {item.category}
                      </span>
                      <h4 className="font-[var(--font-body)] text-[13px] font-semibold text-[var(--color-ink)] truncate mt-1">
                        {item.name}
                      </h4>
                      <span className="font-[var(--font-mono)] text-[10px] text-[var(--color-muted)] mt-0.5">
                        Qty: {item.quantity} &bull; {formatPrice(item.price)}
                      </span>
                    </div>

                    <div className="shrink-0 text-right font-[var(--font-body)] text-[14px] font-bold text-[var(--color-ink)] pl-1">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary calculations */}
              <div className="flex flex-col gap-3 pt-4 border-t border-[var(--color-border-light)] text-[13.5px] text-[var(--color-muted)]">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[var(--color-ink)]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  <span className="font-semibold text-[var(--color-ink)]">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-[var(--color-ink)]">{formatPrice(gst)}</span>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-[var(--color-border-light)] text-[15px] font-bold text-[var(--color-ink)]">
                  <span>Total Due</span>
                  <span className="font-[var(--font-display)] text-[22px] font-extrabold text-[var(--color-ink)] tracking-tight">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Security Lock Note */}
              <div className="flex flex-col items-center gap-3 text-center border-t border-[var(--color-border-light)] pt-5">
                <div className="flex items-center gap-1.5 font-[var(--font-mono)] text-[11px] text-[var(--color-muted)] uppercase tracking-wider">
                  <ShieldCheck size={14} className="text-[var(--color-success)]" />
                  <span>Payments secured by Razorpay</span>
                </div>
                
                {/* Payment Logos gray layout */}
                <div className="flex items-center justify-center gap-4 opacity-40 select-none grayscale">
                  <span className="font-[var(--font-mono)] text-[11px] font-black tracking-wider text-[#000] border border-black px-1.5 py-0.5 rounded leading-none">VISA</span>
                  <span className="font-[var(--font-mono)] text-[11px] font-black tracking-wider text-[#000] border border-black px-1.5 py-0.5 rounded leading-none">MC</span>
                  <span className="font-[var(--font-mono)] text-[11px] font-black tracking-wider text-[#000] border border-black px-1.5 py-0.5 rounded leading-none">UPI</span>
                  <span className="font-[var(--font-mono)] text-[11px] font-black tracking-wider text-[#000] border border-black px-1.5 py-0.5 rounded leading-none">NEFT</span>
                </div>
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  )
}
