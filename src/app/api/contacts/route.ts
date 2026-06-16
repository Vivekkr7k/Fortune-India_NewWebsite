import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Contact } from '@/models'

export async function GET() {
  try {
    await connectDB()
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean()
    return NextResponse.json(contacts)
  } catch (err) {
    console.error('GET /api/contacts error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const contact = await Contact.create(body)
    return NextResponse.json({ success: true, id: contact._id.toString() })
  } catch (err) {
    console.error('POST /api/contacts error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
