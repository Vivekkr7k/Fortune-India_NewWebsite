import { connectDB } from '@/lib/mongoose'
import { Product, Category } from '@/models'
import { toClientProduct, toClientCategory, type RawProduct } from '@/lib/serialize'
import { ProductsPageClient } from '@/components/products/ProductsPageClient'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Products & Catalogue',
  description:
    'Browse Fortune India’s full catalogue of precision printing products — industrial nameplates, safety labels, decals, barcode labels, flex banners and packaging. Authorized supplier to HAL, BHEL & TATA with pan-India delivery.',
  path: '/products',
  keywords: [
    'industrial printing catalogue',
    'buy nameplates online india',
    'safety labels supplier',
    'barcode label manufacturer',
  ],
})

export const revalidate = 0

export default async function ProductsPage() {
  await connectDB()

  const [productDocs, categoryDocs] = await Promise.all([
    Product.find({ active: { $ne: false } })
      .populate('category', '_id name slug')
      .sort({ createdAt: -1 })
      .lean<RawProduct[]>(),
    Category.find().sort({ name: 1 }).lean(),
  ])

  const products = productDocs.map(toClientProduct)
  const categories = categoryDocs.map(toClientCategory)

  return (
    <ProductsPageClient
      products={products}
      categories={categories}
    />
  )
}
