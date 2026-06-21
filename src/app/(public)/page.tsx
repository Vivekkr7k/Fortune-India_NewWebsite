import { connectDB } from '@/lib/mongoose'
import { Product, Category } from '@/models'
import { toClientProduct, toClientCategory, type RawProduct } from '@/lib/serialize'
import { BentoHero } from '@/components/home/BentoHero'
import { TrustStrip } from '@/components/home/TrustStrip'
import { SuppliersStrip } from '@/components/home/SuppliersStrip'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { StatsRow } from '@/components/home/StatsRow'
import { IndustrySolutions } from '@/components/home/IndustrySolutions'
import { CTABanner } from '@/components/home/CTABanner'

export const revalidate = 0 // Fetch fresh data on every request for B2B price/stock accuracy

export default async function HomePage() {
  await connectDB()

  const [featuredDocs, categoryDocs] = await Promise.all([
    Product.find({ active: { $ne: false } })
      .populate('category', '_id name slug')
      .populate('subcategory', '_id name slug image')
      .sort({ featured: -1, createdAt: -1 })
      .limit(6)
      .lean<RawProduct[]>(),
    Category.find().sort({ name: 1 }).lean(),
  ])

  const products = featuredDocs.map(toClientProduct)
  const categories = categoryDocs.map(toClientCategory)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Section 1: Bento Grid Hero */}
      <BentoHero />

      {/* Section 2: Trust Strip */}
      <TrustStrip />

      {/* Section 3: Suppliers Strip */}
      <SuppliersStrip />

      {/* Section 4: Categories Grid */}
      <CategoryGrid categories={categories} />

      {/* Section 5: Featured Products Grid */}
      <FeaturedProducts initialProducts={products} categories={categories} />

      {/* Section 6: Stats Row */}
      <StatsRow />

      {/* Section 7: Industry Solutions Grid */}
      <IndustrySolutions />

      {/* Section 8: CTA Banner */}
      <CTABanner />
    </div>
  )
}
