import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Subcategory } from '@/models'
import mongoose from 'mongoose'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 })
    }

    const body = await req.json()

    const subcategory = await Subcategory.findByIdAndUpdate(id, body, { new: true })
    if (!subcategory) {
      return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 })
    }

    return NextResponse.json(subcategory)
  } catch (err) {
    console.error('PUT /api/subcategories/[id] error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 })
    }

    await Subcategory.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/subcategories/[id] error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
