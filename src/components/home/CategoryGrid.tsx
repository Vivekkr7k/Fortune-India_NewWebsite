'use client'
import Image from 'next/image'
import Link from 'next/link'
import { getCategoryImageUrl } from '@/lib/imageUrl'

interface Category {
  id: string
  name: string
  slug: string
  image?: string | null
}

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (!categories || categories.length === 0) return null

  return (
    <section className="max-w-[var(--container)] mx-auto w-full px-4 md:px-8 py-10 md:py-14">
      {/* Category Section Header */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <h2 className="font-[var(--font-display)] text-[22px] md:text-[26px] font-extrabold text-[var(--color-ink)] shrink-0">
          Categories
        </h2>
        <div className="h-[1px] bg-[var(--color-border)] flex-grow" />
        <Link
          href="/products"
          className="px-5 py-2 border border-[var(--color-border-dark)] rounded-full text-[12px] font-bold text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] hover:border-[var(--color-signal)] hover:text-[var(--color-signal)] transition-all shrink-0 cursor-pointer"
        >
          View All
        </Link>
      </div>

      {/* Grid Layout (6 columns on desktop, responsive layout below) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 md:gap-6">
        {categories.map((cat) => {
          const imgUrl = getCategoryImageUrl(cat.image)
          return (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col focus:outline-none"
            >
              {/* Rounded Clean Card Zone */}
              <div 
                className="aspect-square bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] relative overflow-hidden flex items-center justify-center p-5 transition-all duration-300 ease-[var(--ease-out)] group-hover:-translate-y-1 group-hover:border-[var(--color-signal)]"
                style={{ boxShadow: 'var(--shadow-card)' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-hover)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-card)'}
              >
                {/* Image centered and fully shown, blending naturally with the card background */}
                <div className="relative w-full h-full transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.04]">
                  <Image
                    src={imgUrl}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-category.png'
                    }}
                  />
                </div>
              </div>
              
              {/* Text label underneath */}
              <span className="text-[12px] md:text-[13px] font-bold text-[var(--color-ink)] mt-3 leading-tight tracking-wider uppercase transition-colors group-hover:text-[var(--color-signal)]">
                {cat.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
