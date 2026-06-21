import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { connectDB } from '@/lib/mongoose'
import { Category, Subcategory } from '@/models'
import { getSubcategoryImageUrl } from '@/lib/imageUrl'
import { toTitleCase, slugify } from '@/lib/utils'
import { ChevronRight, LayoutGrid, PackageOpen } from 'lucide-react'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/site'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  await connectDB()
  const categories = await Category.find().lean()
  const cat = categories.find((c: any) => (c.slug || slugify(c.name)) === slug)
  if (!cat) return {}
  return buildMetadata({
    title: `${toTitleCase(cat.name)} — Categories`,
    description: `Browse subcategories under ${cat.name} at Fortune India. High-quality parts and industrial supplies with pan-India shipping.`,
    path: `/categories/${slug}`,
  })
}

export const revalidate = 0

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params
  await connectDB()

  const categories = await Category.find().lean()
  const categoryDoc = categories.find((c: any) => (c.slug || slugify(c.name)) === slug)
  if (!categoryDoc) {
    notFound()
  }

  const subcategories = await Subcategory.find({ category: categoryDoc._id })
    .sort({ name: 1 })
    .lean()

  // Only show subcategories that have at least one active product
  const subcategoryIds = subcategories.map(s => s._id)
  const activeProducts = await Product.find(
    { subcategory: { $in: subcategoryIds }, active: { $ne: false } },
    'subcategory'
  ).lean()

  const activeSubcategoryIds = new Set(activeProducts.map(p => String(p.subcategory)))
  const subcategoryDocs = subcategories.filter(s => activeSubcategoryIds.has(String(s._id)))

  const categoryName = toTitleCase(categoryDoc.name)
  const categorySlug = categoryDoc.slug || slugify(categoryDoc.name)

  return (
    <div className="bg-[var(--color-canvas)] text-[var(--color-body)] min-h-screen">
      {/* BREADCRUMB BAR */}
      <section className="py-4 border-b border-[var(--color-border-light)] bg-white/50 backdrop-blur-sm">
        <div className="max-w-[var(--container)] mx-auto px-4 md:px-8">
          <nav className="flex items-center gap-2 text-[12px] font-medium font-[var(--font-mono)] text-[var(--color-muted)]">
            <Link href="/" className="hover:text-[var(--color-signal)] transition-colors">
              HOME
            </Link>
            <ChevronRight size={12} className="opacity-60" />
            <Link href="/products" className="hover:text-[var(--color-signal)] transition-colors">
              PRODUCTS
            </Link>
            <ChevronRight size={12} className="opacity-60" />
            <span className="text-[var(--color-ink)] truncate font-semibold">
              {categoryName.toUpperCase()}
            </span>
          </nav>
        </div>
      </section>

      {/* HEADER SECTION */}
      <section className="py-16 bg-white border-b border-[var(--color-border-light)]">
        <div className="max-w-[var(--container)] mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="font-[var(--font-mono)] text-[11px] font-bold text-[var(--color-signal)] tracking-widest uppercase block mb-3">
              / CATEGORY BROWSE
            </span>
            <h1 className="font-[var(--font-display)] text-[34px] md:text-[46px] font-extrabold text-[var(--color-ink)] leading-tight tracking-tight mb-4">
              {categoryName}
            </h1>
            <p className="font-[var(--font-body)] text-[15px] md:text-[16px] text-[var(--color-muted)] leading-relaxed">
              Explore our technical subcategories for {categoryName.toLowerCase()}. Select a subcategory to browse products, check pricing, and order online.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href={`/products?category=${categorySlug}`}
              className="inline-flex items-center justify-center h-[46px] px-6 rounded-full bg-[var(--color-signal)] hover:bg-[var(--color-signal-hover)] text-white text-[13px] font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Browse All Products &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* SUBCATEGORIES GRID */}
      <section className="py-16 max-w-[var(--container)] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2 text-[var(--color-ink)]">
            <LayoutGrid size={18} className="text-[var(--color-signal)]" />
            <h2 className="font-[var(--font-display)] text-[20px] font-bold">
              Subcategories
            </h2>
          </div>
          <div className="h-[1px] bg-[var(--color-border-light)] flex-grow" />
        </div>

        {subcategoryDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center bg-white border border-[var(--color-border)] rounded-[24px] p-12 max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[var(--color-signal-tint)] flex items-center justify-center text-[var(--color-signal)] mb-4 shrink-0">
              <PackageOpen size={28} />
            </div>
            <h3 className="font-[var(--font-display)] text-[18px] font-bold text-[var(--color-ink)] mb-2">
              No Subcategories Found
            </h3>
            <p className="font-[var(--font-body)] text-[14px] text-[var(--color-muted)] mb-6 max-w-xs">
              There are no individual subcategories created under {categoryDoc.name} yet.
            </p>
            <Link
              href={`/products?category=${categorySlug}`}
              className="h-[44px] px-6 rounded-full bg-[var(--color-signal)] hover:bg-[var(--color-signal-hover)] text-white text-[13px] font-bold flex items-center justify-center transition-all cursor-pointer"
            >
              View Products Directly
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {subcategoryDocs.map((sub) => {
              const imgUrl = getSubcategoryImageUrl(sub.image)
              const subName = toTitleCase(sub.name)
              const subSlug = sub.slug || slugify(sub.name)
              return (
                <Link
                  key={String(sub._id)}
                  href={`/products?category=${categorySlug}&subcategory=${subSlug}`}
                  className="group flex flex-col bg-white border border-[var(--color-border)] rounded-[24px] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-signal)] shadow-sm hover:shadow-md cursor-pointer"
                >
                  {/* Card Image Area */}
                  <div className="aspect-[4/3] bg-[var(--color-surface-alt)] relative flex items-center justify-center p-6 border-b border-[var(--color-border-light)] overflow-hidden shrink-0">
                    <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#141414_1px,transparent_1px)] [background-size:16px_16px] group-hover:scale-105 transition-transform duration-500"></div>
                    <div className="relative w-full h-full transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.04]">
                      <Image
                        src={imgUrl}
                        alt={subName}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-5 flex items-center justify-between gap-3 flex-grow">
                    <span className="font-[var(--font-display)] text-[14.5px] font-bold text-[var(--color-ink)] leading-snug group-hover:text-[var(--color-signal)] transition-colors">
                      {subName}
                    </span>
                    <div className="w-7 h-7 rounded-full border border-[var(--color-border)] flex items-center justify-center shrink-0 group-hover:border-[var(--color-signal)] group-hover:bg-[var(--color-signal-tint)] transition-all">
                      <span className="text-[11px] font-bold text-[var(--color-signal)]">&rarr;</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
