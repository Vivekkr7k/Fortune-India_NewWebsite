'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { formatPrice, discountPercent } from '@/lib/utils'
import { toast } from 'sonner'

interface ProductCardProps {
  id: string
  slug: string
  code?: string
  name: string
  price: number
  originalPrice?: number
  shippingCharge?: number
  images: string[]
  category: string
  brand?: string
  rating?: number
  reviewCount?: number
  soldCount?: number
  stock: number
  imagePriority?: boolean
}

export function ProductCard({
  id, slug, code, name, price, originalPrice, shippingCharge,
  images, category, brand = 'Fortune India',
  rating = 0, reviewCount = 0, soldCount, stock, imagePriority = false
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  const discount = originalPrice ? discountPercent(originalPrice, price) : null
  const stockStatus = stock === 0 ? 'OUT OF STOCK' : stock <= 5 ? 'LOW STOCK' : 'IN STOCK'
  const stockClass = stock === 0
    ? 'bg-[var(--color-error-tint)] text-[var(--color-error)]'
    : stock <= 5
    ? 'bg-[var(--color-warning-tint)] text-[var(--color-warning)]'
    : 'bg-[var(--color-success-tint)] text-[var(--color-success)]'

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (stock === 0) return
    addItem({
      id, productId: id, code, name, price, originalPrice, shippingCharge,
      image: images[0] ?? '', category, brand
    })
    toast.success(`${name} added to cart`)
  }

  function renderStars(r: number) {
    return Array.from({ length: 5 }, (_, i) => {
      const full = i + 1 <= Math.floor(r)
      const half = !full && i < r
      return (
        <span key={i} style={{ color: full ? '#F5A623' : half ? '#F5A623' : '#D1D5DB', fontSize: 14 }}>
          {half ? '⯨' : '★'}
        </span>
      )
    })
  }

  return (
    <Link href={`/products/${slug}`} className="block h-full group outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-signal)] focus-visible:ring-offset-2 rounded-[20px]">
      <div
        className="h-full flex flex-col bg-white border border-[var(--color-border)] rounded-[20px] overflow-hidden transition-all duration-300 ease-out group-hover:-translate-y-1"
        style={{ boxShadow: 'var(--shadow-card)' }}
        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-hover)'}
        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-card)'}
      >

        {/* ── IMAGE ZONE ── */}
        <div className="relative aspect-[4/3] shrink-0 bg-[#EBEBEB] overflow-hidden">

          {/* Product image */}
          {images[0] ? (
            <Image
              src={images[0]} alt={name} fill
              priority={imagePriority}
              loading={imagePriority ? undefined : 'lazy'}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-product.png'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-sm text-[#BBBBBB]" style={{ fontFamily: 'var(--font-body)' }}>
                Placeholder
              </span>
            </div>
          )}

          {/* Hover dark overlay + buttons */}
          <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex flex-col items-center justify-center gap-2.5 px-5 z-10">
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={stock === 0}
              className="w-full max-w-[220px] flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#141414] text-white text-sm font-semibold transition-transform duration-[280ms] ease-out translate-y-3 group-hover:translate-y-0 hover:bg-[#2a2a2a] disabled:opacity-40 cursor-pointer"
              style={{ fontFamily: 'var(--font-body)', transitionDelay: '0ms' }}
            >
              <ShoppingCart size={15} />
              Add to Cart
            </button>
            {/* View Details */}
            <div
              className="w-full max-w-[220px] flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#F6F4F0] text-[#0F0F0F] text-sm font-semibold transition-transform duration-[280ms] ease-out translate-y-3 group-hover:translate-y-0"
              style={{ fontFamily: 'var(--font-body)', transitionDelay: '40ms' }}
            >
              <Eye size={15} />
              View Details
            </div>
          </div>

          {/* TOP-LEFT: Brand badge */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-white/95 border border-black/10 rounded-full px-3 py-1.5 shadow-sm backdrop-blur-sm">
            <span style={{ color: 'var(--color-signal)', fontSize: 11 }}>☆</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0F0F0F', fontWeight: 500 }}>
              Fortune India
            </span>
          </div>

          {/* TOP-RIGHT: Wishlist */}
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); setWishlisted(w => !w) }}
            className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/95 shadow-md flex items-center justify-center transition-transform hover:scale-110 backdrop-blur-sm border-0 cursor-pointer"
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={16}
              className={wishlisted ? 'fill-red-500 text-red-500' : 'text-[#CCCCCC]'}
            />
          </button>

          {/* BOTTOM: Discount badge — straddles image/info border */}
          {discount && (
            <div
              className="absolute left-3.5 bottom-0 translate-y-1/2 z-20 bg-[#E63946] text-white text-[11px] font-bold rounded-full px-2.5 py-1"
              style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.02em' }}
            >
              -{discount}%
            </div>
          )}
        </div>

        {/* ── INFO ZONE ── */}
        <div className="flex-1 flex flex-col px-4 pt-5 pb-4 border-t border-[var(--color-border)]">

          {/* Category */}
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-signal)', marginBottom: 5, fontWeight: 500 }}>
            {category}
          </p>

          {/* Name — clamped to 2 lines, fixed 2-line height so all cards align */}
          <h3
            className="line-clamp-2"
            style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: '#0F0F0F', lineHeight: 1.25, minHeight: '2.5em', marginBottom: 3 }}
            title={name}
          >
            {name}
          </h3>

          {/* Brand line */}
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#7A7A7A', marginBottom: 10 }}>
            by <span style={{ fontWeight: 500, color: '#555' }}>{brand}</span>
          </p>

          {/* Stars + sold — space-between */}
          <div className="flex items-center justify-between mb-3.5 min-h-[21px]">
            <div className="flex items-center gap-1">
              <div className="flex">{renderStars(rating)}</div>
              {reviewCount > 0 && (
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#7A7A7A', marginLeft: 4 }}>
                  ({reviewCount})
                </span>
              )}
            </div>
            {soldCount && soldCount > 0 && (
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#7A7A7A' }}>
                {soldCount} sold
              </span>
            )}
          </div>

          {/* Price + Stock — pinned to bottom so every card ends at the same line */}
          <div className="mt-auto flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#0F0F0F', letterSpacing: '-0.3px' }}>
                {formatPrice(price)}
              </span>
              {originalPrice && (
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#7A7A7A', textDecoration: 'line-through' }}>
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            <span className={`text-[11px] font-bold uppercase tracking-wider rounded-full px-3 py-1.5 ${stockClass}`}
              style={{ fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
              {stockStatus}
            </span>
          </div>

        </div>
      </div>
    </Link>
  )
}
