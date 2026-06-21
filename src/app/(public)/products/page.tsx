import { connectDB } from '@/lib/mongoose'
import { Product, Category, Subcategory } from '@/models'
import { toClientProduct, toClientCategory, toClientSubcategory, type RawProduct, type ClientSubcategory } from '@/lib/serialize'
import { ProductsPageClient } from '@/components/products/ProductsPageClient'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Products & Catalogue',
  description:
    'Browse Fortune India’s full catalogue of B2B components, including drone and RC parts, electronics, carbon fiber sheets, sensors, development boards, and industrial supplies with pan-India delivery.',
  path: '/products',
  keywords: [
    'B2B electronics catalogue',
    'buy drone parts online india',
    'carbon fiber supplier Bangalore',
    'industrial components store',
  ],
})

export const revalidate = 0

interface PageProps {
  searchParams: Promise<{ search?: string; category?: string; subcategory?: string }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const initialSearch = params.search || ''
  const initialCategory = params.category || 'all'
  const initialSubcategory = params.subcategory || 'all'

  await connectDB()

  const [productDocs, categoryDocs, subcategoryDocs] = await Promise.all([
    Product.find({ active: { $ne: false } })
      .populate('category', '_id name slug')
      .populate('subcategory', '_id name slug image')
      .sort({ createdAt: -1 })
      .lean<RawProduct[]>(),
    Category.find().sort({ name: 1 }).lean(),
    Subcategory.find().sort({ name: 1 }).lean(),
  ])

  const products = productDocs.map(toClientProduct)
  const categories = categoryDocs.map(toClientCategory)
  const subcategories = subcategoryDocs.map(toClientSubcategory).filter(Boolean) as ClientSubcategory[]

  return (
    <ProductsPageClient
      products={products}
      categories={categories}
      subcategories={subcategories}
      initialSearch={initialSearch}
      initialCategory={initialCategory}
      initialSubcategory={initialSubcategory}
    />
  )
}
