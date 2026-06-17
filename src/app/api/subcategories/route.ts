import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Subcategory } from '@/models'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()

    if (!body.name || !body.category) {
      return NextResponse.json({ error: 'Subcategory name and parent category are required' }, { status: 400 })
    }

    // Generate slug from name if not provided
    if (!body.slug) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    }

    const subcategory = await Subcategory.create(body)
    return NextResponse.json(subcategory, { status: 201 })
  } catch (err: any) {
    console.error('POST /api/subcategories error:', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
