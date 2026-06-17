'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Package } from 'lucide-react'
import { FilterBar } from './FilterBar'
import { ProductGrid } from './ProductGrid'

interface Category {
  id: string
  name: string
  slug: string
}

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
  createdAt: Date
}

interface ProductsPageClientProps {
  products: Product[]
  categories: Category[]
}

const PER_PAGE = 12

// Smart truncated pagination: first, last, current ±2, with '…' for gaps.
// e.g. page 27 of 54 → [1, '…', 25, 26, 27, 28, 29, '…', 54]
function getPageNumbers(currentPage: number, totalPages: number): (number | '…')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const wanted = new Set<number>([1, totalPages])
  for (let p = currentPage - 2; p <= currentPage + 2; p++) {
    if (p >= 1 && p <= totalPages) wanted.add(p)
  }

  const sorted = [...wanted].sort((a, b) => a - b)
  const result: (number | '…')[] = []
  let prev = 0
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push('…')
    result.push(p)
    prev = p
  }
  return result
}

export function ProductsPageClient({ products, categories }: ProductsPageClientProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [searchInput, setSearchInput] = useState('') // what the user sees, updates instantly
  const [search, setSearch] = useState('')           // debounced value that drives the filter
  const [page, setPage] = useState(1)
  const [isFiltering, setIsFiltering] = useState(false)
  const gridTopRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  // Debounce: run the filter only after 300ms of no typing
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300)
    return () => clearTimeout(t)
  }, [searchInput])

  // Filtered and sorted products
  const filtered = products
    .filter((p) => activeCategory === 'all' || p.category.slug === activeCategory)
    .filter((p) => search === '' || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'popular') return b.reviewCount - a.reviewCount
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  // Reset page to 1 when any filter changes
  useEffect(() => {
    setPage(1)
  }, [activeCategory, search, sortBy])

  // Brief fade on category switch for visual feedback
  useEffect(() => {
    if (isFirstRender.current) return
    setIsFiltering(true)
    const t = setTimeout(() => setIsFiltering(false), 150)
    return () => clearTimeout(t)
  }, [activeCategory])

  // Scroll back to the top of the grid when the page changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [page])

  function clearFilters() {
    setSearchInput('')
    setSearch('')
    setActiveCategory('all')
  }

  const activeCategoryName = categories.find((c) => c.slug === activeCategory)?.name

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-canvas)]">
      {/* Sticky Filter Bar */}
      <FilterBar
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        search={searchInput}
        setSearch={setSearchInput}
        sortBy={sortBy}
        setSortBy={setSortBy}
        totalCount={filtered.length}
        activeSearch={search}
        activeCategoryName={activeCategoryName}
      />

      {/* Products Display Section */}
      <div className="flex-grow max-w-[var(--container)] mx-auto w-full px-4 md:px-8 py-8 pb-20">
        {/* Scroll anchor — offset accounts for the sticky header + compact filter bar */}
        <div ref={gridTopRef} className="scroll-mt-[130px]" aria-hidden="true" />

        {filtered.length > 0 ? (
          <div className="flex flex-col gap-10">
            <div className={`transition-opacity duration-150 ${isFiltering ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              {/* key remounts the grid when results change, so the entry animation
                  replays — without it, framer-motion leaves newly-mounted cards
                  stuck in their hidden (opacity-0) variant */}
              <ProductGrid
                key={`${activeCategory}|${search}|${sortBy}|${page}`}
                products={paginated}
              />
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-1.5 flex-wrap mt-4" aria-label="Pagination">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="min-w-9 h-9 px-2 rounded-full border border-[var(--color-border-dark)] bg-white flex items-center justify-center text-[13px] font-bold text-[var(--color-body)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-signal-tint)] hover:border-[var(--color-signal)] hover:text-[var(--color-signal)] transition-colors cursor-pointer"
                  aria-label="Previous Page"
                >
                  &larr;
                </button>

                {/* Mobile: compact "Page X of Y" */}
                <span className="sm:hidden font-[var(--font-mono)] text-[12px] text-[var(--color-muted)] px-3">
                  Page {page} of {totalPages}
                </span>

                {/* Desktop: smart truncated page numbers */}
                <div className="hidden sm:flex items-center gap-1.5">
                  {getPageNumbers(page, totalPages).map((item, idx) =>
                    item === '…' ? (
                      <span
                        key={`gap-${idx}`}
                        className="min-w-9 h-9 flex items-center justify-center text-[13px] text-[var(--color-muted)] select-none"
                        aria-hidden="true"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        aria-current={page === item ? 'page' : undefined}
                        className={`min-w-9 h-9 px-1 rounded-full text-[13px] font-bold transition-all border cursor-pointer ${
                          page === item
                            ? 'bg-[var(--color-signal)] border-[var(--color-signal)] text-white shadow-sm'
                            : 'bg-transparent border-[var(--color-border-dark)] text-[var(--color-body)] hover:bg-[var(--color-signal-tint)] hover:border-[var(--color-signal)] hover:text-[var(--color-signal)]'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="min-w-9 h-9 px-2 rounded-full border border-[var(--color-border-dark)] bg-white flex items-center justify-center text-[13px] font-bold text-[var(--color-body)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-signal-tint)] hover:border-[var(--color-signal)] hover:text-[var(--color-signal)] transition-colors cursor-pointer"
                  aria-label="Next Page"
                >
                  &rarr;
                </button>
              </nav>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border border-[var(--color-border)] rounded-[20px] shadow-sm max-w-xl mx-auto mt-6">
            <div className="w-16 h-16 rounded-full bg-[var(--color-signal-tint)] flex items-center justify-center text-[var(--color-signal)] mb-4 shrink-0">
              <Package size={28} />
            </div>
            <h3 className="font-[var(--font-display)] text-[20px] font-bold text-[var(--color-ink)] mb-2">
              No products found
            </h3>
            <p className="font-[var(--font-body)] text-[14px] text-[var(--color-muted)] max-w-sm mb-6">
              {search
                ? <>Nothing matches <strong>&ldquo;{search}&rdquo;</strong>. Try a different search term or browse all categories.</>
                : 'Try a different category, refine your search terms, or contact us for custom configurations.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--color-signal)] hover:bg-[var(--color-signal-hover)] text-white font-bold text-[13px] transition-all cursor-pointer"
              >
                Clear search &amp; filters
              </button>
              <Link
                href="/contact?subject=Custom Order Request"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[var(--color-signal)] text-[var(--color-signal)] font-bold text-[13px] hover:bg-[var(--color-signal-tint)] transition-all cursor-pointer"
              >
                Contact Us &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
