import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Category, Subcategory, Product } from '@/models'
import { slugify } from '@/lib/utils'

export async function GET() {
  try {
    await connectDB()

    const [categories, subcategories, activeProducts] = await Promise.all([
      Category.find().sort({ name: 1 }).lean(),
      Subcategory.find().sort({ name: 1 }).lean(),
      Product.find({ active: { $ne: false } }, 'category subcategory').lean()
    ])

    const result = categories.map((cat: any) => {
      // Calculate how many active products this category has
      const catProductCount = activeProducts.filter(
        (p: any) => String(p.category) === String(cat._id)
      ).length

      return {
        ...cat,
        slug: cat.slug || slugify(cat.name),
        productCount: catProductCount,
        subcategories: subcategories
          .filter((sub: any) => String(sub.category) === String(cat._id))
          .map((sub: any) => ({
            ...sub,
            slug: sub.slug || slugify(sub.name),
            productCount: activeProducts.filter(
              (p: any) => String(p.subcategory) === String(sub._id)
            ).length
          })),
      }
    })

    // Filter out categories that have no products (for user-facing UI)
    const activeCategories = result.filter(cat => cat.productCount > 0)

    return NextResponse.json(activeCategories)
  } catch (err) {
    console.error('GET /api/categories error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const category = await Category.create(body)
    return NextResponse.json(category, { status: 201 })
  } catch (err) {
    console.error('POST /api/categories error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
