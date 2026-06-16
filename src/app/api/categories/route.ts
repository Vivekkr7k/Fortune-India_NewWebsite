import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Category, Subcategory } from '@/models'

export async function GET() {
  try {
    await connectDB()

    const [categories, subcategories] = await Promise.all([
      Category.find().sort({ name: 1 }).lean(),
      Subcategory.find().sort({ name: 1 }).lean(),
    ])

    const result = categories.map(cat => ({
      ...cat,
      subcategories: subcategories.filter(
        sub => sub.category?.toString() === cat._id.toString()
      ),
    }))

    return NextResponse.json(result)
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
