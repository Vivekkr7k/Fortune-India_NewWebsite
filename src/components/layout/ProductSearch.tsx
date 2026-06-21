'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X, Loader2, Compass, ArrowRight } from 'lucide-react'
import { getProductImageUrl } from '@/lib/imageUrl'
import { formatPrice } from '@/lib/utils'

interface SearchProduct {
  _id: string
  name: string
  code: string
  price: number
  image?: string
  category?: {
    _id: string
    name: string
    slug: string
  }
}

interface SuggestionCategory {
  _id: string
  name: string
  slug: string
}

const POPULAR_SEARCHES = [
  'Aluminium',
  'Nameplate',
  'Safety Label',
  'Barcode',
  'Stainless Steel'
]

export function ProductSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [results, setResults] = useState<SearchProduct[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [categories, setCategories] = useState<SuggestionCategory[]>([])
  const [loading, setLoading] = useState(false)
  
  // Dropdown visibility states
  const [showDropdown, setShowDropdown] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  // Refs for click outside
  const desktopContainerRef = useRef<HTMLDivElement>(null)
  const mobileContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  // Fetch categories for suggested list
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data.slice(0, 4)) // Display top 4 categories
        }
      } catch (err) {
        console.error('Failed to load search menu categories:', err)
      }
    }
    loadCategories()
  }, [])

  // Debounce query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query)
    }, 250)
    return () => clearTimeout(handler)
  }, [query])

  // Fetch results when query updates
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([])
      setTotalResults(0)
      return
    }

    let active = true
    async function fetchProducts() {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(debouncedQuery)}&limit=5`
        )
        if (res.ok && active) {
          const data = await res.json()
          setResults(data.products || [])
          setTotalResults(data.total || 0)
        }
      } catch (err) {
        console.error('Search fetch error:', err)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchProducts()
    return () => {
      active = false
    }
  }, [debouncedQuery])

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        desktopContainerRef.current &&
        !desktopContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
      if (
        mobileContainerRef.current &&
        !mobileContainerRef.current.contains(event.target as Node)
      ) {
        // Only close mobile search if it wasn't triggered by clicking inside it
        setMobileSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard controls
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowDropdown(false)
      setMobileSearchOpen(false)
      inputRef.current?.blur()
      mobileInputRef.current?.blur()
    } else if (e.key === 'Enter') {
      triggerSearch(query)
    }
  }

  const triggerSearch = (searchVal: string) => {
    if (!searchVal.trim()) return
    setShowDropdown(false)
    setMobileSearchOpen(false)
    router.push(`/products?search=${encodeURIComponent(searchVal.trim())}`)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    triggerSearch(suggestion)
  }

  const handleCategoryClick = (slug: string) => {
    setShowDropdown(false)
    setMobileSearchOpen(false)
    router.push(`/categories/${slug}`)
  }

  const handleItemClick = (slug: string) => {
    setShowDropdown(false)
    setMobileSearchOpen(false)
    setQuery('')
    router.push(`/products/${slug}`)
  }

  return (
    <>
      {/* ── DESKTOP SEARCH BAR ── */}
      <div 
        ref={desktopContainerRef} 
        className="hidden md:block relative w-56 lg:w-72 transition-all duration-300"
      >
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            className="w-full pl-9 pr-8 py-2 bg-[var(--canvas)] border border-[var(--border)] rounded-full text-[13.5px] text-[var(--ink)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--signal)] focus:bg-white focus:ring-1 focus:ring-[var(--signal)] transition-all"
          />
          <Search 
            size={15} 
            className="absolute left-3.5 text-[var(--muted)] pointer-events-none" 
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="absolute right-3 p-1 rounded-full text-[var(--muted)] hover:bg-[var(--surface-alt)] transition-colors cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Desktop Suggestions Dropdown */}
        {showDropdown && (
          <div className="absolute top-full mt-2 right-0 w-[400px] bg-white border border-[var(--border)] rounded-2xl shadow-[var(--shadow-hover)] overflow-hidden z-50 animate-fade-up select-none">
            <div className="p-4 max-h-[460px] overflow-y-auto scrollbar-none">
              {/* LOADING STATE */}
              {loading && (
                <div className="flex items-center justify-center py-8 text-[var(--muted)]">
                  <Loader2 size={20} className="animate-spin mr-2 text-[var(--signal)]" />
                  <span className="text-[13px] font-medium">Searching catalogue...</span>
                </div>
              )}

              {/* SEARCH RESULTS */}
              {!loading && query.trim().length >= 2 && (
                <div>
                  <h4 className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2 font-mono">
                    Search Results ({totalResults})
                  </h4>
                  {results.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {results.map((product) => {
                        const slug = product.code || product._id
                        const imgUrl = getProductImageUrl(product.image)
                        return (
                          <div
                            key={product._id}
                            onClick={() => handleItemClick(slug)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--canvas)] transition-all cursor-pointer group"
                          >
                            <div className="relative w-12 h-12 rounded-lg bg-[#EBEBEB] overflow-hidden shrink-0">
                              <Image
                                src={imgUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline justify-between gap-2">
                                <h5 className="text-[13.5px] font-bold text-[var(--ink)] truncate group-hover:text-[var(--signal)] transition-colors">
                                  {product.name}
                                </h5>
                                <span className="text-[12px] font-extrabold text-[var(--ink)] shrink-0">
                                  {formatPrice(product.price)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-mono text-[9px] text-[var(--muted)] tracking-wider">
                                  {product.code}
                                </span>
                                {product.category && (
                                  <>
                                    <span className="text-[10px] text-black/10">•</span>
                                    <span className="text-[10.5px] text-[var(--muted)] truncate">
                                      {product.category.name}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}

                      {/* View all results button */}
                      {totalResults > results.length && (
                        <button
                          onClick={() => triggerSearch(query)}
                          className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[var(--signal-tint)] text-[var(--signal)] hover:bg-[var(--signal)] hover:text-white text-[12.5px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          View all {totalResults} results
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-[13px] text-[var(--muted)]">
                        No products found matching &ldquo;{query}&rdquo;.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* POPULAR SEARCHES & SUGGESTED CATEGORIES (shown when query is empty or short) */}
              {!loading && query.trim().length < 2 && (
                <div className="flex flex-col gap-5">
                  {/* Popular Keywords */}
                  <div>
                    <h4 className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                      <Compass size={12} className="text-[var(--signal)]" />
                      Popular Searches
                    </h4>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {POPULAR_SEARCHES.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSuggestionClick(term)}
                          className="text-[11.5px] px-3 py-1.5 bg-[var(--canvas)] text-[var(--ink)] hover:bg-[var(--signal-tint)] hover:text-[var(--signal)] rounded-full transition-all border border-transparent hover:border-[var(--border)] cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Categories */}
                  {categories.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2 font-mono">
                        Browse Categories
                      </h4>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {categories.map((cat) => (
                          <button
                            key={cat._id}
                            onClick={() => handleCategoryClick(cat.slug)}
                            className="text-left text-[12px] p-2.5 rounded-xl border border-[var(--border)] hover:border-[var(--signal)] hover:bg-[var(--signal-tint)] transition-all flex items-center justify-between group cursor-pointer"
                          >
                            <span className="font-medium text-[var(--ink)] group-hover:text-[var(--signal)] truncate transition-colors">
                              {cat.name}
                            </span>
                            <ArrowRight size={12} className="text-[var(--muted)] group-hover:text-[var(--signal)] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE SEARCH ACTION BUTTON ── */}
      <button
        onClick={() => {
          setMobileSearchOpen(!mobileSearchOpen)
          // focus mobile input on next tick
          setTimeout(() => {
            mobileInputRef.current?.focus()
          }, 100)
        }}
        className="md:hidden p-2 text-[var(--ink)] hover:text-[var(--signal)] transition-colors cursor-pointer"
        aria-label="Search Catalogue"
      >
        <Search size={20} />
      </button>

      {/* ── MOBILE SLIDE-DOWN SEARCH BAR ── */}
      {mobileSearchOpen && (
        <div 
          ref={mobileContainerRef}
          className="md:hidden absolute top-16 md:top-[80px] left-0 w-full bg-white border-b border-[var(--border)] z-30 animate-fade-up"
        >
          <div className="p-3 flex items-center gap-2 border-b border-[var(--border)]">
            <div className="relative flex-1 flex items-center">
              <input
                ref={mobileInputRef}
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-9 pr-8 py-2 bg-[var(--canvas)] border border-[var(--border)] rounded-full text-[14px] text-[var(--ink)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--signal)]"
              />
              <Search 
                size={15} 
                className="absolute left-3.5 text-[var(--muted)] pointer-events-none" 
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('')
                    mobileInputRef.current?.focus()
                  }}
                  className="absolute right-3 p-1 rounded-full text-[var(--muted)] cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="text-[13px] font-bold text-[var(--muted)] hover:text-[var(--ink)] px-2 py-1 shrink-0 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Mobile Results/Suggestions Dropdown Content */}
          <div className="max-h-[360px] overflow-y-auto bg-white p-4">
            {/* LOADING STATE */}
            {loading && (
              <div className="flex items-center justify-center py-8 text-[var(--muted)]">
                <Loader2 size={18} className="animate-spin mr-2 text-[var(--signal)]" />
                <span className="text-[12.5px] font-medium">Searching catalogue...</span>
              </div>
            )}

            {/* RESULTS */}
            {!loading && query.trim().length >= 2 && (
              <div>
                <h4 className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2 font-mono">
                  Results ({totalResults})
                </h4>
                {results.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {results.map((product) => {
                      const slug = product.code || product._id
                      const imgUrl = getProductImageUrl(product.image)
                      return (
                        <div
                          key={product._id}
                          onClick={() => handleItemClick(slug)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--canvas)] cursor-pointer"
                        >
                          <div className="relative w-10 h-10 rounded-lg bg-[#EBEBEB] overflow-hidden shrink-0">
                            <Image
                              src={imgUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between gap-2">
                              <h5 className="text-[13px] font-bold text-[var(--ink)] truncate">
                                {product.name}
                              </h5>
                              <span className="text-[12px] font-extrabold text-[var(--ink)] shrink-0">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-[9px] text-[var(--muted)]">
                                {product.code}
                              </span>
                              {product.category && (
                                <>
                                  <span className="text-[9px] text-black/10">•</span>
                                  <span className="text-[10px] text-[var(--muted)] truncate">
                                    {product.category.name}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {totalResults > results.length && (
                      <button
                        onClick={() => triggerSearch(query)}
                        className="w-full mt-2 py-2.5 rounded-xl bg-[var(--signal-tint)] text-[var(--signal)] hover:bg-[var(--signal)] hover:text-white text-[12.5px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        View all {totalResults} results
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-[12px] text-[var(--muted)]">
                      No products found matching &ldquo;{query}&rdquo;.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* SUGGESTIONS */}
            {!loading && query.trim().length < 2 && (
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                    Popular Searches
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {POPULAR_SEARCHES.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSuggestionClick(term)}
                        className="text-[11px] px-2.5 py-1.5 bg-[var(--canvas)] text-[var(--ink)] rounded-full border border-transparent cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {categories.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2 font-mono">
                      Browse Categories
                    </h4>
                    <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                      {categories.map((cat) => (
                        <button
                          key={cat._id}
                          onClick={() => handleCategoryClick(cat.slug)}
                          className="text-left text-[11px] p-2 rounded-xl border border-[var(--border)] hover:border-[var(--signal)] hover:bg-[var(--signal-tint)] transition-all flex items-center justify-between group cursor-pointer"
                        >
                          <span className="font-medium text-[var(--ink)] group-hover:text-[var(--signal)] truncate">
                            {cat.name}
                          </span>
                          <ArrowRight size={10} className="text-[var(--muted)] shrink-0 ml-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
