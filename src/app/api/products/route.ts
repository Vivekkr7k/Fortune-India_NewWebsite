import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Product } from '@/models'

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const category    = searchParams.get('category')
    const subcategory = searchParams.get('subcategory')
    const search      = searchParams.get('search')
    const featured    = searchParams.get('featured')
    const page        = Math.max(parseInt(searchParams.get('page') || '1', 10), 1)
    const limit       = Math.min(Math.max(parseInt(searchParams.get('limit') || '12', 10), 1), 100)
    const sort        = searchParams.get('sort') || 'createdAt'

    const filter: Record<string, unknown> = { active: { $ne: false } }

    if (category)    filter.category    = category
    if (subcategory) filter.subcategory = subcategory
    if (featured)    filter.featured    = true
    if (search) {
      filter.$or = [
        { name:        { $regex: search, $options: 'i' } },
        { code:        { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      'createdAt':  { createdAt: -1 },
      'price-asc':  { price: 1 },
      'price-desc': { price: -1 },
      'popular':    { soldCount: -1 },
      'name':       { name: 1 },
    }

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', '_id name slug')
        .populate('subcategory', '_id name slug')
        .sort(sortMap[sort] || { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ])

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + products.length < total,
    })
  } catch (err) {
    console.error('GET /api/products error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()

    if (!body.code) {
      const count = await Product.countDocuments()
      body.code = `FI${count + 1}`
    }

    const product = await Product.create(body)
    const populated = await product.populate(['category', 'subcategory'])
    return NextResponse.json(populated, { status: 201 })
  } catch (err) {
    console.error('POST /api/products error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
