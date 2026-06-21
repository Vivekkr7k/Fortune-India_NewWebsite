'use client'
import { useEffect } from 'react'
import { Search, ChevronDown, Check } from 'lucide-react'
import * as Select from '@radix-ui/react-select'
import { toTitleCase } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
}

interface Subcategory {
  id: string
  name: string
  slug: string
  image?: string | null
  category: string
}

interface FilterBarProps {
  categories: Category[]
  subcategories: Subcategory[]
  activeCategory: string
  setActiveCategory: (slug: string) => void
  activeSubcategory: string
  setActiveSubcategory: (slug: string) => void
  search: string
  setSearch: (query: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  totalCount: number
  activeSearch?: string         // the debounced term actually filtering results
  activeCategoryName?: string
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
]

export function FilterBar({
  categories,
  subcategories,
  activeCategory,
  setActiveCategory,
  activeSubcategory,
  setActiveSubcategory,
  search,
  setSearch,
  sortBy,
  setSortBy,
  totalCount,
  activeSearch = '',
  activeCategoryName,
}: FilterBarProps) {

  // Keep the sticky offset in sync with the real header height
  // (h-16 on mobile, h-20 on desktop — a hardcoded top-16 slides under it)
  useEffect(() => {
    const header = document.querySelector('header')
    if (!header) return

    const setVar = () =>
      document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`)

    setVar()
    const observer = new ResizeObserver(setVar)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  const activeCategoryObj = categories.find((c) => c.slug === activeCategory)
  const activeCategoryId = activeCategoryObj?.id || ''
  const activeSubcategoryName = subcategories.find((s) => s.slug === activeSubcategory)?.name

  const activeSubcategories = subcategories.filter(
    (sub) => sub.category === activeCategoryId
  )

  // Contextual count text reflecting the live filter + search state
  const noun = activeSearch ? 'result' : 'product'
  const countText = (
    <>
      Showing {totalCount} {noun}{totalCount !== 1 ? 's' : ''}
      {activeSearch && <> for &ldquo;{activeSearch}&rdquo;</>}
      {activeCategory !== 'all' && activeCategoryName && (
        <>
          {' '}in{' '}
          <span className="font-semibold text-[var(--color-ink)]">
            {toTitleCase(activeCategoryName)}
          </span>
          {activeSubcategory !== 'all' && activeSubcategoryName && (
            <>
              {' '}&rarr;{' '}
              <span className="font-semibold text-[var(--color-ink)]">
                {toTitleCase(activeSubcategoryName)}
              </span>
            </>
          )}
        </>
      )}
    </>
  )

  return (
    <div
      className="sticky bg-white/95 backdrop-blur-md border-b border-[var(--color-border)] z-30 py-1.5 shadow-sm"
      style={{ top: 'var(--header-height, 64px)' }}
    >
      <div className="max-w-[var(--container)] mx-auto px-4 md:px-8 flex flex-col gap-2">

        {/* Row 1: Categories — Always single line, full width */}
        <div className="w-full flex items-center gap-1.5 overflow-x-auto flex-nowrap scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 pb-0.5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all border whitespace-nowrap cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[var(--color-signal-tint)] border-[var(--color-signal)] text-[var(--color-signal)] font-bold'
                : 'bg-transparent border-[var(--color-border-dark)] text-[var(--color-body)] hover:border-[var(--color-signal)] hover:text-[var(--color-signal)]'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all border whitespace-nowrap cursor-pointer ${
                activeCategory === cat.slug
                  ? 'bg-[var(--color-signal-tint)] border-[var(--color-signal)] text-[var(--color-signal)] font-bold'
                  : 'bg-transparent border-[var(--color-border-dark)] text-[var(--color-body)] hover:border-[var(--color-signal)] hover:text-[var(--color-signal)]'
              }`}
            >
              {toTitleCase(cat.name)}
            </button>
          ))}
        </div>

        {/* Row 1.5: Subcategories (Contextual) */}
        {activeCategory !== 'all' && activeSubcategories.length > 0 && (
          <>
            <div className="h-[1px] bg-[#EBE8E0]/40 w-full" />
            <div className="w-full flex items-center gap-1.5 overflow-x-auto flex-nowrap scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 pb-0.5 animate-fade-up">
              <span className="font-[var(--font-mono)] text-[9.5px] font-bold text-[var(--color-muted)] uppercase tracking-wider mr-1 select-none">
                Subcategory:
              </span>
              <button
                onClick={() => setActiveSubcategory('all')}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all border whitespace-nowrap cursor-pointer ${
                  activeSubcategory === 'all'
                    ? 'bg-neutral-800 border-neutral-800 text-white font-bold'
                    : 'bg-transparent border-neutral-200 text-[var(--color-body)] hover:border-[var(--color-signal)] hover:text-[var(--color-signal)]'
                }`}
              >
                All {toTitleCase(activeCategoryObj?.name || '')}
              </button>
              {activeSubcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubcategory(sub.slug)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all border whitespace-nowrap cursor-pointer ${
                    activeSubcategory === sub.slug
                      ? 'bg-neutral-800 border-neutral-800 text-white font-bold'
                      : 'bg-transparent border-neutral-200 text-[var(--color-body)] hover:border-[var(--color-signal)] hover:text-[var(--color-signal)]'
                  }`}
                >
                  {toTitleCase(sub.name)}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Divider line between categories and controls */}
        <div className="h-[1px] bg-[#EBE8E0]/50 w-full" />

        {/* Row 2: Controls — Results count, search input, and sort dropdown */}
        <div className="flex items-center justify-between gap-3 w-full">
          <span className="font-[var(--font-mono)] text-[10.5px] text-[var(--color-muted)] truncate mr-2">
            {countText}
          </span>

          <div className="flex items-center gap-2 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-placeholder)]" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[120px] sm:w-[160px] pl-7 pr-2.5 py-1 text-[11px] border border-[var(--color-border)] rounded-md bg-[var(--color-surface)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] focus:ring-1 focus:ring-[var(--color-signal)]"
              />
            </div>

            {/* Sort Dropdown */}
            <Select.Root value={sortBy} onValueChange={setSortBy}>
              <Select.Trigger
                aria-label="Sort products"
                className="inline-flex items-center justify-between gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-[var(--color-border-dark)] bg-white text-[var(--color-body)] hover:border-[var(--color-signal)] hover:text-[var(--color-signal)] transition-all cursor-pointer focus:outline-none focus:border-[var(--color-signal)] data-[state=open]:border-[var(--color-signal)] data-[state=open]:text-[var(--color-signal)] whitespace-nowrap"
              >
                <Select.Value />
                <Select.Icon>
                  <ChevronDown size={11} className="transition-transform duration-200" />
                </Select.Icon>
              </Select.Trigger>

              <Select.Portal>
                <Select.Content
                  position="popper"
                  sideOffset={6}
                  align="end"
                  className="z-50 min-w-[160px] bg-white border border-[var(--color-border)] rounded-xl shadow-lg overflow-hidden"
                >
                  <Select.Viewport className="p-1">
                    {SORT_OPTIONS.map((option) => (
                      <Select.Item
                          key={option.value}
                          value={option.value}
                          className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-[var(--color-body)] cursor-pointer select-none outline-none data-[highlighted]:bg-[var(--color-signal-tint)] data-[highlighted]:text-[var(--color-signal)] data-[state=checked]:bg-[var(--color-signal-tint)] data-[state=checked]:text-[var(--color-signal)]"
                      >
                        <Select.ItemText>{option.label}</Select.ItemText>
                        <Select.ItemIndicator>
                          <Check size={11} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        </div>

      </div>
    </div>
  )
}
