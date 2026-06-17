import { connectDB } from '@/lib/mongoose'
import { Product, Category, Subcategory } from '@/models'
import { ProductsPageClient } from './ProductsPageClient'

export const revalidate = 0

export default async function AdminProductsPage() {
  await connectDB()

  // Fetch all products (populate category & subcategory) and sort by newest
  const [products, categories, subcategories] = await Promise.all([
    Product.find()
      .populate('category', '_id name')
      .populate('subcategory', '_id name')
      .sort({ createdAt: -1 })
      .lean(),
    Category.find().sort({ name: 1 }).lean(),
    Subcategory.find().sort({ name: 1 }).lean(),
  ])

  // Process categories structure
  const processedCategories = categories.map(cat => ({
    _id: cat._id.toString(),
    name: cat.name,
    subcategories: subcategories
      .filter(sub => sub.category?.toString() === cat._id.toString())
      .map(sub => ({
        _id: sub._id.toString(),
        name: sub.name,
      })),
  }))

  const serializedProducts = JSON.parse(JSON.stringify(products)).map((prod: any) => ({
    ...prod,
    code: prod.code || `FI-LEGACY-${prod._id.slice(-6).toUpperCase()}`,
    name: prod.name || 'Unnamed Product',
    price: prod.price || 0,
    shippingCharge: prod.shippingCharge || 0,
    stock: prod.stock || 999,
    category: prod.category || { _id: '', name: 'Uncategorized' },
  }))

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5 border-b border-[var(--color-border)] pb-6">
        <span className="font-mono text-[10px] text-[var(--color-signal)] uppercase tracking-[0.15em] font-semibold">
          / Management
        </span>
        <h1 className="text-[28px] md:text-[32px] font-extrabold tracking-tight font-[var(--font-display)] text-[var(--color-ink)]">
          Manage Products
        </h1>
        <p className="text-[14px] text-[var(--color-muted)]">
          Create and catalogue B2B visual products, configure custom pricing, specify technical properties, and upload product images.
        </p>
      </div>

      {/* Products Manager Client */}
      <ProductsPageClient 
        initialProducts={serializedProducts} 
        categories={processedCategories} 
      />
    </div>
  )
}
