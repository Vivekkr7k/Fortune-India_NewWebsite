import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Product } from '@/models'
import mongoose from 'mongoose'

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { id } = await params

    // Look up by MongoDB _id or by product code (FI1, FI2…)
    const product = await Product.findOne(
      OBJECT_ID_RE.test(id) ? { _id: id } : { code: id }
    )
      .populate('category', '_id name slug')
      .populate('subcategory', '_id name slug')
      .lean()

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (err) {
    console.error('GET /api/products/[id] error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const body = await req.json()

    const product = await Product.findByIdAndUpdate(id, body, { new: true })
      .populate('category subcategory')

    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(product)
  } catch (err) {
    console.error('PUT /api/products/[id] error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    await Product.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/products/[id] error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
