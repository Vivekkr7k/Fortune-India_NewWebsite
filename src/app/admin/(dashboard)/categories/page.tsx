import { connectDB } from '@/lib/mongoose'
import { Category, Subcategory } from '@/models'
import { CategoriesPageClient } from './CategoriesPageClient'

export const revalidate = 0

export default async function AdminCategoriesPage() {
  await connectDB()

  // Fetch all categories and subcategories concurrently
  const [categories, subcategories] = await Promise.all([
    Category.find().sort({ name: 1 }).lean(),
    Subcategory.find().sort({ name: 1 }).lean(),
  ])

  // Map subcategories under their respective parent categories
  const processedCategories = categories.map(cat => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
    image: cat.image,
    subcategories: subcategories
      .filter(sub => sub.category?.toString() === cat._id.toString())
      .map(sub => ({
        _id: sub._id.toString(),
        name: sub.name,
        slug: sub.slug,
        image: sub.image,
      })),
  }))

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5 border-b border-[var(--color-border)] pb-6">
        <span className="font-mono text-[10px] text-[var(--color-signal)] uppercase tracking-[0.15em] font-semibold">
          / Management
        </span>
        <h1 className="text-[28px] md:text-[32px] font-extrabold tracking-tight font-[var(--font-display)] text-[var(--color-ink)]">
          Manage Categories
        </h1>
        <p className="text-[14px] text-[var(--color-muted)]">
          Create B2B categories and technical subcategories, upload category logos/icons, and configure product taxonomies.
        </p>
      </div>

      {/* Categories Manager Client Container */}
      <CategoriesPageClient initialCategories={processedCategories} />
    </div>
  )
}
