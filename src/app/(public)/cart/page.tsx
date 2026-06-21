'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Heart, ArrowLeft, ShieldCheck, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const { items, updateQty, removeItem, total, count, savedItems, saveForLater, moveToCart, removeSavedItem } = useCartStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--color-canvas)] py-20 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-signal)] border-t-transparent animate-spin"></div>
      </div>
    )
  }

  const subtotal = total()
  const gst = subtotal * 0.18
  const shipping = items.reduce((s, i) => s + (i.shippingCharge || 0) * i.quantity, 0)
  const grandTotal = subtotal + gst + shipping

  function handlePromoApply(e: React.FormEvent) {
    e.preventDefault()
    if (promoCode.trim().toUpperCase() === 'FORTUNE10') {
      setPromoApplied(true)
      toast.success('Promo code FI10 applied: 10% discount')
    } else {
      toast.error('Invalid promo code')
    }
  }

  return (
    <div className="bg-[var(--color-canvas)] min-h-screen py-10">
      <div className="max-w-[var(--container)] mx-auto px-4 md:px-8">
        
        {/* Page Header */}
        <div className="flex items-baseline gap-3 mb-8 border-b border-[var(--color-border-light)] pb-4">
          <h1 className="font-[var(--font-display)] text-[28px] font-extrabold text-[var(--color-ink)]">
            Your Cart
          </h1>
          <span className="font-[var(--font-mono)] text-[14px] text-[var(--color-muted)]">
            &middot; {count()} item{count() !== 1 ? 's' : ''}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center bg-white border border-[var(--color-border)] rounded-[20px] shadow-sm max-w-xl mx-auto p-10 md:p-16 mb-12">
            <div className="w-20 h-20 rounded-full bg-[var(--color-signal-tint)] flex items-center justify-center text-[var(--color-signal)] mb-6 shrink-0">
              <ShoppingCart size={36} />
            </div>
            <h2 className="font-[var(--font-display)] text-[24px] font-bold text-[var(--color-ink)] mb-2">
              Your cart is empty
            </h2>
            <p className="font-[var(--font-body)] text-[15px] text-[var(--color-muted)] max-w-sm mb-8">
              Add some products to your cart to get started. We support bulk orders and customized requirements.
            </p>
            <Link
              href="/products"
              className="h-[52px] px-8 rounded-full bg-[var(--color-signal)] hover:bg-[var(--color-signal-hover)] text-white text-[14px] font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Browse Products &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
            
            {/* LEFT COLUMN: Items List */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="flex flex-col bg-white border border-[var(--color-border)] rounded-[20px] overflow-hidden shadow-sm">
                {items.map((item, idx) => (
                  <div 
                    key={item.productId}
                    className={`p-5 md:p-6 flex gap-4 md:gap-6 flex-col md:flex-row ${
                      idx !== items.length - 1 ? 'border-b border-[var(--color-border-light)]' : ''
                    }`}
                  >
                    <div className="relative w-24 h-24 md:w-[90px] md:h-[90px] bg-[#EBEBEB] border border-[var(--color-border)] rounded-lg overflow-hidden shrink-0 self-start">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-[#BBBBBB] font-mono">No Image</div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="font-[var(--font-mono)] text-[10px] font-bold text-[var(--color-signal)] tracking-wider uppercase">
                          {item.category}
                        </span>
                        <h3 className="font-[var(--font-display)] text-[16px] font-bold text-[var(--color-ink)] mt-0.5 mb-1 leading-snug">
                          {item.name}
                        </h3>
                        <span className="font-[var(--font-mono)] text-[11px] text-[var(--color-muted)]">
                          by <span className="font-medium text-[#555]">{item.brand}</span>
                        </span>
                      </div>

                      <div className="flex items-end justify-between gap-4 flex-wrap pt-2 border-t border-[var(--color-border-light)]/50">
                        <div className="flex flex-col gap-1.5">
                          <div className="inline-flex items-center border border-[var(--color-border)] rounded-full overflow-hidden bg-white shadow-sm h-8">
                            <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="w-8 h-full flex items-center justify-center text-[var(--color-signal)] font-bold hover:bg-[var(--color-signal-tint)] transition-colors cursor-pointer text-sm">–</button>
                            <span className="w-10 text-center font-bold text-[13px] text-[var(--color-ink)]">{item.quantity}</span>
                            <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="w-8 h-full flex items-center justify-center text-[var(--color-signal)] font-bold hover:bg-[var(--color-signal-tint)] transition-colors cursor-pointer text-sm">+</button>
                          </div>
                          <span className="font-[var(--font-mono)] text-[10.5px] text-[var(--color-muted)] pl-1">{formatPrice(item.price)} per unit</span>
                        </div>

                        <div className="flex flex-col items-end text-right">
                          <span className="font-[var(--font-display)] text-[18px] font-extrabold text-[var(--color-ink)]">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <div className="flex gap-4 mt-2">
                            <button onClick={() => { removeItem(item.productId); toast.info(`${item.name} removed from cart`) }} className="font-[var(--font-mono)] text-[11px] text-[var(--color-muted)] hover:text-[var(--color-error)] transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0">
                              ✕ Remove
                            </button>
                            <button onClick={() => { saveForLater(item.productId); toast.success(`${item.name} saved for later`) }} className="font-[var(--font-mono)] text-[11px] text-[var(--color-muted)] hover:text-[var(--color-signal)] transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0">
                              ♡ Save for later
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/products" className="inline-flex items-center gap-2 font-[var(--font-mono)] text-[13px] font-bold text-[var(--color-signal)] hover:text-[var(--color-signal-hover)] transition-colors self-start mt-2">
                <ArrowLeft size={14} /> Continue Shopping
              </Link>
            </div>

            {/* RIGHT COLUMN: Summary */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="bg-white border border-[var(--color-border)] rounded-[20px] p-6 shadow-sm flex flex-col gap-6">
                <h2 className="font-[var(--font-display)] text-[18px] font-bold text-[var(--color-ink)]">Order Summary</h2>
                <div className="flex flex-col gap-3.5 border-b border-[var(--color-border-light)] pb-5 text-[14px]">
                  <div className="flex justify-between items-center text-[var(--color-muted)]">
                    <span>Subtotal ({count()} items)</span>
                    <span className="font-semibold text-[var(--color-ink)]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[var(--color-muted)]">
                    <span>Shipping</span>
                    <span className="font-semibold text-[var(--color-ink)]">
                      {shipping === 0 ? <span className="text-[var(--color-success)] uppercase font-bold text-[12px] tracking-wide bg-[var(--color-success-tint)] px-2.5 py-0.5 rounded-full">Free</span> : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[var(--color-muted)]">
                    <span>GST (18%)</span>
                    <span className="font-semibold text-[var(--color-ink)]">{formatPrice(gst)}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between items-center text-[var(--color-success)] font-medium">
                      <span>Discount (FI10)</span>
                      <span>-{formatPrice(subtotal * 0.1)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-end">
                  <span className="text-[15px] font-bold text-[var(--color-ink)]">Grand Total</span>
                  <span className="font-[var(--font-display)] text-[22px] font-extrabold text-[var(--color-ink)] tracking-tight leading-none">
                    {formatPrice(promoApplied ? grandTotal - subtotal * 0.1 : grandTotal)}
                  </span>
                </div>

                <form onSubmit={handlePromoApply} className="pt-5 border-t border-[var(--color-border-light)] flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[var(--color-ink)]">Promo Code</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Enter code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} disabled={promoApplied} className="flex-1 px-3 py-2 text-[13px] border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-signal)] bg-[var(--color-canvas)]/50" />
                    <button type="submit" disabled={promoApplied} className="px-4 py-2 border border-[var(--color-signal)] text-[var(--color-signal)] hover:bg-[var(--color-signal-tint)] transition-colors rounded-full font-bold text-[12px] uppercase tracking-wider disabled:opacity-40 cursor-pointer">Apply</button>
                  </div>
                </form>

                <Link href="/checkout" className="w-full h-[52px] rounded-full bg-[var(--color-signal)] hover:bg-[var(--color-signal-hover)] text-white text-[15px] font-bold flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer">
                  Proceed to Checkout &rarr;
                </Link>

                <div className="flex flex-col items-center gap-3 text-center border-t border-[var(--color-border-light)] pt-5">
                  <div className="flex items-center gap-1.5 font-[var(--font-mono)] text-[11px] text-[var(--color-muted)] uppercase tracking-wider">
                    <ShieldCheck size={14} className="text-[var(--color-success)]" />
                    <span>Secure checkout &bull; 100% Safe</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 opacity-40 select-none grayscale">
                    <span className="font-[var(--font-mono)] text-[12px] font-black tracking-widest text-[#000] border border-black px-1.5 py-0.5 rounded">VISA</span>
                    <span className="font-[var(--font-mono)] text-[12px] font-black tracking-widest text-[#000] border border-black px-1.5 py-0.5 rounded">MC</span>
                    <span className="font-[var(--font-mono)] text-[12px] font-black tracking-widest text-[#000] border border-black px-1.5 py-0.5 rounded">UPI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved for Later Section */}
        {savedItems && savedItems.length > 0 && (
          <div className="mt-8 border-t border-[var(--color-border)] pt-12">
            <h2 className="font-[var(--font-display)] text-[22px] font-bold text-[var(--color-ink)] mb-6 flex items-center gap-2">
              <Heart size={20} className="text-[var(--color-signal)] fill-[var(--color-signal)]" />
              Saved for Later ({savedItems.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedItems.map((item) => (
                <div key={item.productId} className="bg-white border border-[var(--color-border)] rounded-[20px] p-5 shadow-sm flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="relative w-20 h-20 bg-[#EBEBEB] border border-[var(--color-border)] rounded-lg overflow-hidden shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-[#BBBBBB] font-mono">No Image</div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-[var(--font-mono)] text-[9px] font-bold text-[var(--color-signal)] tracking-wider uppercase">
                        {item.category}
                      </span>
                      <h3 className="font-[var(--font-display)] text-[14px] font-bold text-[var(--color-ink)] mt-1 mb-2 line-clamp-2 leading-snug">
                        {item.name}
                      </h3>
                      <span className="font-[var(--font-display)] text-[16px] font-extrabold text-[var(--color-ink)]">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border-light)] mt-auto">
                    <button
                      onClick={() => { moveToCart(item.productId); toast.success(`${item.name} moved to cart`) }}
                      className="flex-1 h-9 rounded-full bg-[var(--color-signal-tint)] hover:bg-[var(--color-signal)] text-[var(--color-signal)] hover:text-white transition-colors flex items-center justify-center gap-1.5 font-bold text-[12px] cursor-pointer border border-transparent hover:border-[var(--color-signal)]"
                    >
                      <ShoppingCart size={14} /> Move to Cart
                    </button>
                    <button
                      onClick={() => { removeSavedItem(item.productId); toast.info(`${item.name} removed`) }}
                      className="h-9 w-9 flex items-center justify-center rounded-full border border-[var(--color-border-dark)] text-[var(--color-muted)] hover:text-[var(--color-error)] hover:border-[var(--color-error)] transition-colors cursor-pointer bg-white"
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
