import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Category, Subcategory } from '@/models'
import mongoose from 'mongoose'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    const category = await Category.findById(id).lean()

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    const subcategories = await Subcategory.find({ category: id }).lean()
    return NextResponse.json({ ...category, subcategories })
  } catch (err) {
    console.error('GET /api/categories/[id] error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    const body = await req.json()

    const category = await Category.findByIdAndUpdate(id, body, { new: true })
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (err) {
    console.error('PUT /api/categories/[id] error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Also delete all subcategories under this category
    await Subcategory.deleteMany({ category: id })
    await Category.findByIdAndDelete(id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/categories/[id] error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
