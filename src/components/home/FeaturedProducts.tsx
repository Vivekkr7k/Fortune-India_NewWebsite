'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/ui/ProductCard'

interface DBProduct {
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

interface CategoryTab {
  id: string
  name: string
  slug: string
}

interface FeaturedProductsProps {
  initialProducts: DBProduct[]
  categories?: CategoryTab[]
}

export function FeaturedProducts({ initialProducts, categories = [] }: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState('all')

  // Tabs come from the live categories in MongoDB; only show ones
  // that actually have featured products on display
  const tabs = [
    { label: 'All', slug: 'all' },
    ...categories
      .filter(c => initialProducts.some(p => p.category.slug === c.slug))
      .map(c => ({ label: c.name, slug: c.slug })),
  ]

  const filteredProducts = activeTab === 'all'
    ? initialProducts
    : initialProducts.filter(p => p.category.slug === activeTab)

  return (
    <section className="py-20 max-w-[var(--container)] mx-auto px-4 md:px-8">
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="flex flex-col gap-2">
          <span className="font-[var(--font-mono)] text-[11px] font-bold text-[var(--signal)] tracking-widest uppercase">
            / FEATURED PRODUCTS
          </span>
          <h2 className="font-[var(--font-display)] text-[32px] md:text-[40px] font-extrabold text-[var(--ink)] leading-none tracking-tight">
            Built to Perform.
          </h2>
        </div>

        {/* BROWSE ALL LINK */}
        <Link 
          href="/products"
          className="font-[var(--font-mono)] text-[12px] font-bold text-[var(--ink)] hover:text-[var(--signal)] transition-colors inline-flex items-center gap-1.5 uppercase self-start md:self-end"
        >
          Browse All Products &rarr;
        </Link>
      </div>

      {/* TABS FILTER */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 -mx-4 px-4 scrollbar-none">
        {tabs.map(tab => {
          const isActive = activeTab === tab.slug
          return (
            <button
              key={tab.slug}
              onClick={() => setActiveTab(tab.slug)}
              className={`px-5 py-2.5 rounded-full text-[12.5px] font-bold tracking-wide transition-all border whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[var(--signal)] border-[var(--signal)] text-white shadow-sm'
                  : 'bg-white border-[var(--border)] text-[var(--body-text)] hover:border-[var(--border-dark)]'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* PRODUCTS GRID */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            // Safe JSON parse images
            let parsedImages: string[] = []
            try {
              parsedImages = JSON.parse(product.images)
              if (!Array.isArray(parsedImages)) {
                parsedImages = []
              }
            } catch (err) {
              parsedImages = []
            }

            return (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                code={product.code}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice || undefined}
                shippingCharge={product.shippingCharge}
                images={parsedImages}
                category={product.category.name}
                brand={product.brand}
                rating={product.rating}
                reviewCount={product.reviewCount}
                soldCount={product.soldCount}
                stock={product.stock}
              />
            )
          })}
        </div>
      ) : (
        <div className="bg-white border border-[var(--border)] rounded-[var(--r-xl)] p-12 text-center shadow-[var(--sh-card)]">
          <p className="font-[var(--font-body)] text-[15px] text-[var(--muted)]">
            No featured products in this category currently.
          </p>
        </div>
      )}
    </section>
  )
}
