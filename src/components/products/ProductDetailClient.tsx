'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, ShieldCheck, Truck, Receipt, Eye, ZoomIn, X } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice, discountPercent } from '@/lib/utils'
import { toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'
import { ProductCard } from '@/components/ui/ProductCard'

interface Product {
  id: string
  slug: string
  code?: string
  name: string
  price: number
  originalPrice: number | null
  shippingCharge?: number
  images: string
  category: {
    id: string
    name: string
    slug: string
  }
  stock: number
  specs: string | null
  brand: string
  rating: number
  reviewCount: number
  soldCount: number
  featured: boolean
  description: string
}

interface RelatedProduct {
  id: string
  slug: string
  code?: string
  name: string
  price: number
  originalPrice: number | null
  shippingCharge?: number
  images: string
  category: {
    id: string
    name: string
    slug: string
  }
  stock: number
  specs: string | null
  brand: string
  rating: number
  reviewCount: number
  soldCount: number
  featured: boolean
}

interface ProductDetailClientProps {
  product: Product
  relatedProducts: RelatedProduct[]
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [activeImgIdx, setActiveImgIdx] = useState(0)
  const [qty, setQty] = useState(1)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  // Safe parse images and specs
  let imagesList: string[] = []
  try {
    imagesList = JSON.parse(product.images)
    if (!Array.isArray(imagesList)) {
      imagesList = []
    }
  } catch (err) {
    imagesList = []
  }

  let specsObj: Record<string, string> = {}
  try {
    specsObj = JSON.parse(product.specs || '{}')
  } catch (err) {
    specsObj = {}
  }

  const discount = product.originalPrice ? discountPercent(product.originalPrice, product.price) : null

  function handleAddToCart() {
    if (product.stock === 0) return
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        productId: product.id,
        code: product.code,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || undefined,
        shippingCharge: product.shippingCharge,
        image: imagesList[0] ?? '',
        category: product.category.name,
        brand: product.brand,
      })
    }
    toast.success(`${qty}× ${product.name} added to cart`)
  }

  function renderStars(r: number) {
    return Array.from({ length: 5 }, (_, i) => {
      const full = i + 1 <= Math.floor(r)
      const half = !full && i < r
      return (
        <span key={i} className="text-[#F5A623] text-sm">
          {half ? '⯨' : '★'}
        </span>
      )
    })
  }

  return (
    <div className="bg-[var(--color-canvas)] pb-20">
      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && imagesList[activeImgIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-[var(--color-signal)] p-2 cursor-pointer z-50"
              aria-label="Close Lightbox"
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-4xl aspect-[4/3] rounded-xl overflow-hidden max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={imagesList[activeImgIdx]}
                alt={product.name}
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[var(--container)] mx-auto px-4 md:px-8">
        
        {/* Breadcrumb */}
        <div className="py-5 font-[var(--font-mono)] text-[12px] text-[var(--color-muted)] flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-[var(--color-signal)] transition-colors">Home</Link>
          <span className="text-[var(--color-signal)]">/</span>
          <Link href="/products" className="hover:text-[var(--color-signal)] transition-colors">Products</Link>
          <span className="text-[var(--color-signal)]">/</span>
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-[var(--color-signal)] transition-colors">
            {product.category.name}
          </Link>
          <span className="text-[var(--color-signal)]">/</span>
          <span className="text-[var(--color-ink)]">{product.name}</span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-4">
          
          {/* LEFT COLUMN: Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div 
              onClick={() => imagesList.length > 0 && setLightboxOpen(true)}
              className={`relative aspect-[4/3] bg-[#EBEBEB] border border-[var(--color-border)] rounded-xl overflow-hidden ${
                imagesList.length > 0 ? 'cursor-zoom-in group/gallery' : ''
              }`}
            >
              {imagesList[activeImgIdx] ? (
                <>
                  <Image
                    src={imagesList[activeImgIdx]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover/gallery:scale-[1.02]"
                    priority
                  />
                  {/* Zoom Icon Overlay */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white">
                      <ZoomIn size={20} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#BBBBBB]">
                  <span className="text-3xl mb-1">☆</span>
                  <span className="text-sm font-[var(--font-body)]">Fortune India Precision</span>
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            {imagesList.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIdx(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden bg-[#EBEBEB] border cursor-pointer shrink-0 transition-all ${
                      idx === activeImgIdx
                        ? 'border-2 border-[var(--color-signal)] ring-2 ring-[var(--color-signal)]/25'
                        : 'border-[var(--color-border)] hover:border-[var(--color-border-dark)]'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Info details */}
          <div className="lg:col-span-5 flex flex-col">
            
            {/* Category badge */}
            <span className="self-start px-3 py-1 rounded-full bg-[var(--color-signal-tint)] border border-[var(--color-signal)]/10 text-[var(--color-signal)] text-[11px] font-[var(--font-mono)] font-bold uppercase tracking-wider">
              {product.category.name}
            </span>

            {/* Product Title */}
            <h1 className="font-[var(--font-display)] text-[28px] md:text-[34px] font-extrabold text-[var(--color-ink)] leading-tight tracking-tight mt-3 mb-2">
              {product.name}
            </h1>

            {/* Stars rating + Sold */}
            <div className="flex items-center justify-between border-b border-[var(--color-border-light)] pb-4 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-[12px] text-[var(--color-muted)] font-[var(--font-body)]">
                  ({product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''})
                </span>
              </div>
              {product.soldCount > 0 && (
                <span className="text-[12.5px] text-[var(--color-muted)] font-[var(--font-body)] font-medium">
                  {product.soldCount} sold
                </span>
              )}
            </div>

            {/* Price Block */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="font-[var(--font-display)] text-[28px] md:text-[32px] font-extrabold text-[var(--color-ink)] tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-[16px] text-[var(--color-muted)] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="bg-[#E63946] text-white text-[11px] font-bold rounded-full px-2.5 py-1 font-[var(--font-body)] uppercase tracking-wider shadow-sm">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="font-[var(--font-body)] text-[14.5px] text-[var(--color-body)] leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Specifications Box */}
            {Object.keys(specsObj).length > 0 && (
              <div className="bg-white border border-[var(--color-border)] rounded-xl p-4 mb-6 shadow-sm">
                <h4 className="text-[13px] font-bold text-[var(--color-ink)] uppercase tracking-wider mb-3">
                  Specifications
                </h4>
                <div className="flex flex-col gap-2.5">
                  {Object.entries(specsObj).map(([key, val], idx, arr) => (
                    <div 
                      key={key} 
                      className={`flex items-start py-2 text-[13px] ${
                        idx !== arr.length - 1 ? 'border-b border-[var(--color-border-light)]' : ''
                      }`}
                    >
                      <span className="font-[var(--font-mono)] text-[11px] text-[var(--color-muted)] w-28 shrink-0">{key}</span>
                      <span className="font-[var(--font-body)] font-semibold text-[var(--color-ink)]">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feature Chips */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              <span className="bg-white border border-[var(--color-border-dark)] text-[var(--color-muted)] text-[10.5px] font-[var(--font-mono)] px-3 py-1 rounded-full uppercase tracking-wider">
                Authorized Vendor
              </span>
              <span className="bg-white border border-[var(--border-dark)] text-[var(--color-muted)] text-[10.5px] font-[var(--font-mono)] px-3 py-1 rounded-full uppercase tracking-wider">
                Industrial Spec
              </span>
              {specsObj['Material'] && (
                <span className="bg-white border border-[var(--border-dark)] text-[var(--color-muted)] text-[10.5px] font-[var(--font-mono)] px-3 py-1 rounded-full uppercase tracking-wider">
                  {specsObj['Material']}
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6 flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[var(--color-ink)]">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center border border-[var(--color-border)] rounded-full overflow-hidden bg-white shadow-sm h-[42px]">
                  <button
                    onClick={() => setQty((q) => Math.max(q - 1, 1))}
                    className="w-10 h-full flex items-center justify-center text-[var(--color-signal)] font-bold hover:bg-[var(--color-signal-tint)] transition-colors cursor-pointer"
                  >
                    –
                  </button>
                  <span className="w-12 text-center font-bold text-[14px] text-[var(--color-ink)]">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-10 h-full flex items-center justify-center text-[var(--color-signal)] font-bold hover:bg-[var(--color-signal-tint)] transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
                {specsObj['Min Order'] && (
                  <span className="font-[var(--font-mono)] text-[11px] text-[var(--color-muted)]">
                    * MOQ: {specsObj['Min Order']}
                  </span>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full h-[52px] rounded-full bg-[var(--color-signal)] hover:bg-[var(--color-signal-hover)] text-white text-[14px] font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              <Link
                href="/contact?subject=Custom Quote Request"
                className="w-full h-[44px] rounded-full border border-[var(--color-border-dark)] hover:border-[var(--color-ink)] bg-transparent text-[var(--color-ink)] text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                Request Custom Quote &rarr;
              </Link>
            </div>

            {/* Delivery Info Card */}
            <div className="bg-white border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-3 shadow-sm text-[13px] text-[var(--color-body)]">
              <div className="flex items-start gap-2.5">
                <Truck size={16} className="text-[var(--color-signal)] shrink-0 mt-0.5" />
                <span>Pan-India delivery in <strong>5–7 working days</strong></span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-[var(--color-signal)] shrink-0 mt-0.5" />
                <span>Bulk discounts available for large-volume orders</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Receipt size={16} className="text-[var(--color-signal)] shrink-0 mt-0.5" />
                <span>GST invoice provided for all corporate B2B orders</span>
              </div>
            </div>

          </div>

        </div>

        {/* FULL SPECIFICATIONS SECTION */}
        <div className="py-12 border-t border-[var(--color-border-light)] mt-12">
          <span className="font-[var(--font-mono)] text-[10px] font-bold text-[var(--color-signal)] tracking-widest uppercase block mb-1">
            / FULL SPECIFICATIONS
          </span>
          <h2 className="font-[var(--font-display)] text-[22px] md:text-[26px] font-extrabold text-[var(--color-ink)] tracking-tight mb-6">
            Technical Details
          </h2>
          
          <div className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden shadow-sm max-w-3xl">
            <div className="grid grid-cols-3 bg-[var(--color-canvas)] py-3 px-6 border-b border-[var(--color-border)] font-[var(--font-mono)] text-[11px] uppercase tracking-wider text-[var(--color-muted)] font-bold">
              <div className="col-span-1">Parameter</div>
              <div className="col-span-2">Specification Value</div>
            </div>
            
            <div className="flex flex-col">
              {Object.entries(specsObj).map(([key, val], idx, arr) => (
                <div 
                  key={key} 
                  className={`grid grid-cols-3 py-3.5 px-6 text-[13.5px] items-center hover:bg-[var(--color-canvas)]/30 transition-colors ${
                    idx !== arr.length - 1 ? 'border-b border-[var(--color-border-light)]' : ''
                  }`}
                >
                  <div className="col-span-1 font-[var(--font-mono)] text-[12px] text-[var(--color-muted)] font-medium">{key}</div>
                  <div className="col-span-2 font-[var(--font-body)] font-semibold text-[var(--color-ink)]">{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="py-12 border-t border-[var(--color-border-light)]">
            <span className="font-[var(--font-mono)] text-[10px] font-bold text-[var(--color-signal)] tracking-widest uppercase block mb-1">
              / YOU MAY ALSO LIKE
            </span>
            <h2 className="font-[var(--font-display)] text-[22px] md:text-[26px] font-extrabold text-[var(--color-ink)] tracking-tight mb-8">
              Related Products
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => {
                let parsedImgs: string[] = []
                try {
                  parsedImgs = JSON.parse(p.images)
                } catch (err) {}

                return (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    slug={p.slug}
                    code={p.code}
                    name={p.name}
                    price={p.price}
                    originalPrice={p.originalPrice || undefined}
                    shippingCharge={p.shippingCharge}
                    images={parsedImgs}
                    category={p.category.name}
                    brand={p.brand}
                    rating={p.rating}
                    reviewCount={p.reviewCount}
                    soldCount={p.soldCount}
                    stock={p.stock}
                  />
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
