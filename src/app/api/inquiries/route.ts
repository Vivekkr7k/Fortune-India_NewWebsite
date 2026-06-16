import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { connectDB } from '@/lib/mongoose'
import { Contact } from '@/models'

const inquirySchema = z.object({
  name: z.string().min(2),
  company: z.string().optional().nullable(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  subject: z.string().min(1),
  message: z.string().min(20),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = inquirySchema.parse(body)

    await connectDB()

    // Stored in the existing `contacts` collection on Atlas
    const inquiry = await Contact.create({
      name: validated.name,
      company: validated.company || undefined,
      email: validated.email,
      phone: validated.phone || undefined,
      subject: validated.subject,
      message: validated.message,
      status: 'NEW',
    })

    return NextResponse.json({ success: true, id: inquiry._id.toString() })
  } catch (error) {
    console.error('Inquiry API Error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
