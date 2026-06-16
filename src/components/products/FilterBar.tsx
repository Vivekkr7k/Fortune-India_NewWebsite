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

interface FilterBarProps {
  categories: Category[]
  activeCategory: string
  setActiveCategory: (slug: string) => void
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
  activeCategory,
  setActiveCategory,
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

  // Contextual count text reflecting the live filter + search state
  const noun = activeSearch ? 'result' : 'product'
  const countText = (
    <>
      Showing {totalCount} {noun}{totalCount !== 1 ? 's' : ''}
      {activeSearch && <> for &ldquo;{activeSearch}&rdquo;</>}
      {activeCategory !== 'all' && activeCategoryName && <> in {toTitleCase(activeCategoryName)}</>}
    </>
  )

  return (
    <div
      className="sticky bg-white/95 backdrop-blur-md border-b border-[var(--color-border)] z-30 py-2.5 shadow-sm"
      style={{ top: 'var(--header-height, 64px)' }}
    >
      <div className="max-w-[var(--container)] mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-3">

        {/* Categories — horizontally scrollable on mobile, wrapping on desktop */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto flex-nowrap scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-[16px] py-1.5 rounded-full text-[12px] font-semibold transition-all border whitespace-nowrap cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[var(--color-signal-tint)] border-[var(--color-signal)] text-[var(--color-signal)]'
                : 'bg-transparent border-[var(--color-border-dark)] text-[var(--color-body)] hover:border-[var(--color-signal)] hover:text-[var(--color-signal)]'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-[16px] py-1.5 rounded-full text-[12px] font-semibold transition-all border whitespace-nowrap cursor-pointer ${
                activeCategory === cat.slug
                  ? 'bg-[var(--color-signal-tint)] border-[var(--color-signal)] text-[var(--color-signal)]'
                  : 'bg-transparent border-[var(--color-border-dark)] text-[var(--color-body)] hover:border-[var(--color-signal)] hover:text-[var(--color-signal)]'
              }`}
            >
              {toTitleCase(cat.name)}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
          <span className="hidden lg:block font-[var(--font-mono)] text-[11px] text-[var(--color-muted)] mr-1">
            {countText}
          </span>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:flex-initial">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-placeholder)]" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-[180px] pl-8 pr-3 py-1.5 text-[12px] border border-[var(--color-border)] rounded-md bg-[var(--color-surface)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] focus:ring-1 focus:ring-[var(--color-signal)]"
              />
            </div>

            {/* Sort Dropdown */}
            <Select.Root value={sortBy} onValueChange={setSortBy}>
              <Select.Trigger
                aria-label="Sort products"
                className="inline-flex items-center justify-between gap-1.5 px-[14px] py-1.5 rounded-full text-[12px] font-semibold border border-[var(--color-border-dark)] bg-white text-[var(--color-body)] hover:border-[var(--color-signal)] hover:text-[var(--color-signal)] transition-all cursor-pointer focus:outline-none focus:border-[var(--color-signal)] data-[state=open]:border-[var(--color-signal)] data-[state=open]:text-[var(--color-signal)] whitespace-nowrap"
              >
                <Select.Value />
                <Select.Icon>
                  <ChevronDown size={13} className="transition-transform duration-200" />
                </Select.Icon>
              </Select.Trigger>

              <Select.Portal>
                <Select.Content
                  position="popper"
                  sideOffset={6}
                  align="end"
                  className="z-50 min-w-[180px] bg-white border border-[var(--color-border)] rounded-xl shadow-lg overflow-hidden"
                >
                  <Select.Viewport className="p-1">
                    {SORT_OPTIONS.map((option) => (
                      <Select.Item
                        key={option.value}
                        value={option.value}
                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold text-[var(--color-body)] cursor-pointer select-none outline-none data-[highlighted]:bg-[var(--color-signal-tint)] data-[highlighted]:text-[var(--color-signal)] data-[state=checked]:bg-[var(--color-signal-tint)] data-[state=checked]:text-[var(--color-signal)]"
                      >
                        <Select.ItemText>{option.label}</Select.ItemText>
                        <Select.ItemIndicator>
                          <Check size={12} />
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
