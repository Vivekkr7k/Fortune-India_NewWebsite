import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { connectDB } from '@/lib/mongoose'
import { Order } from '@/models'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json({ error: 'Missing payment verification details' }, { status: 400 })
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim()
    if (!keySecret || keySecret.includes('dummy')) {
      return NextResponse.json({ error: 'Payment verification is not configured (missing RAZORPAY_KEY_SECRET).' }, { status: 503 })
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSig = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex')

    if (expectedSig !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus:     'PAID',
      status:            'CONFIRMED',
      razorpayPaymentId: razorpay_payment_id,
    })

    return NextResponse.json({ success: true, orderId })
  } catch (err) {
    console.error('Error verifying payment:', err)
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
