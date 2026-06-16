import { connectDB } from '@/lib/mongoose'
import { Product, Category } from '@/models'
import { toClientProduct, toClientCategory, type RawProduct } from '@/lib/serialize'
import { ProductsPageClient } from '@/components/products/ProductsPageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products — Fortune India Precision Printing',
  description: 'Browse our full catalogue of precision printing products: nameplates, safety labels, decals, packaging, and more. Authorized supplier to HAL, BHEL, TATA.',
}

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
