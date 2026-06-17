import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Order } from '@/models'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()

    const { status, paymentStatus } = body as {
      status?: string
      paymentStatus?: string
    }

    const updates: Record<string, string> = {}
    if (status) updates.status = status
    if (paymentStatus) updates.paymentStatus = paymentStatus

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const order = await Order.findByIdAndUpdate(id, updates, { new: true }).lean()

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (err: any) {
    console.error('PATCH /api/orders/[id] error:', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
