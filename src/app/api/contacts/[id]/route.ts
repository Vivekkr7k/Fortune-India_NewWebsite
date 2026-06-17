import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Contact } from '@/models'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()

    const { status } = body as {
      status?: string
    }

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true }).lean()

    if (!contact) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    return NextResponse.json(contact)
  } catch (err: any) {
    console.error('PATCH /api/contacts/[id] error:', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
