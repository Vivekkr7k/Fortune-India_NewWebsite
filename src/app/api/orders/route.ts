import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { connectDB } from '@/lib/mongoose'
import { Order, type IOrder } from '@/models'

interface IncomingItem {
  productId: string
  name: string
  code?: string
  price: number
  shippingCharge?: number
  quantity: number
  image?: string
}

// Round to 2 decimal places to avoid float drift (e.g. 68.39999999 GST)
const round2 = (n: number) => Math.round(n * 100) / 100

// Treats unset keys and the committed dummy placeholders as "not configured"
function getRazorpayKeys() {
  const key_id = process.env.RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET
  const configured =
    !!key_id && !!key_secret &&
    !key_id.includes('dummy') && !key_secret.includes('dummy')
  return { key_id, key_secret, configured }
}

// Razorpay SDK rejects with a plain object { statusCode, error: { description } },
// not an Error instance — pull out a human-readable message for either shape.
function describeError(err: unknown): { message: string; status: number } {
  if (err && typeof err === 'object') {
    const e = err as { statusCode?: number; error?: { description?: string }; message?: string }
    if (e.error?.description) {
      return { message: `Razorpay: ${e.error.description}`, status: e.statusCode ?? 502 }
    }
    if (e.message) return { message: e.message, status: 500 }
  }
  return { message: 'Internal Server Error', status: 500 }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const page   = Math.max(parseInt(searchParams.get('page') || '1', 10), 1)
    const limit  = 20

    const filter = status && status !== 'all'
      ? { status: status as IOrder['status'] }
      : {}

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Order.countDocuments(filter),
    ])

    return NextResponse.json({ orders, total, page, totalPages: Math.ceil(total / limit) })
  } catch (err) {
    console.error('GET /api/orders error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.json()
    const { items, customer, paymentMethod } = body as {
      items: IncomingItem[]
      customer: Record<string, string | undefined>
      paymentMethod: 'RAZORPAY' | 'COD' | 'BANK_TRANSFER'
    }

    // Validate required fields up front
    if (!items || !items.length || !customer) {
      return NextResponse.json({ error: 'Missing order items or customer details' }, { status: 400 })
    }
    const missing = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode']
      .filter(f => !customer[f])
    if (missing.length) {
      return NextResponse.json({ error: `Missing customer field(s): ${missing.join(', ')}` }, { status: 400 })
    }

    // Razorpay keys must be valid before we create anything, so we never leave
    // an orphaned PENDING order behind when the gateway is misconfigured
    const keys = getRazorpayKeys()
    if (paymentMethod === 'RAZORPAY' && !keys.configured) {
      return NextResponse.json(
        { error: 'Online payment is not configured. Set valid RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local, or use Cash on Delivery.' },
        { status: 503 }
      )
    }

    const subtotal = round2(items.reduce((s, i) => s + i.price * i.quantity, 0))
    const shipping = round2(items.reduce((s, i) => s + (i.shippingCharge || 0) * i.quantity, 0))
    const gst      = round2(subtotal * 0.18)
    const total    = round2(subtotal + shipping + gst)

    // Date.now() alone can collide on rapid submits; add a random suffix
    const orderNumber = `FI-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

    const order = await Order.create({
      orderNumber,
      name:      customer.name,
      email:     customer.email,
      phone:     customer.phone,
      company:   customer.company,
      address:   `${customer.address}${customer.address2 ? ', ' + customer.address2 : ''}`,
      city:      customer.city,
      state:     customer.state,
      pincode:   customer.pincode,
      gstNumber: customer.gst,
      poNumber:  customer.poNumber,
      notes:     customer.notes,
      items: items.map(i => ({
        productId:      i.productId,
        name:           i.name,
        code:           i.code,
        price:          i.price,
        shippingCharge: i.shippingCharge || 0,
        quantity:       i.quantity,
        total:          round2(i.price * i.quantity),
        image:          i.image,
      })),
      subtotal,
      shipping,
      gst,
      total,
      paymentMethod,
      paymentStatus: 'PENDING',
      status: paymentMethod === 'RAZORPAY' ? 'PENDING' : 'CONFIRMED',
    })

    if (paymentMethod === 'RAZORPAY') {
      // Instantiate per-request (not at module load) so a misconfig can't crash
      // the whole route, and so we can surface the gateway's real error
      const razorpay = new Razorpay({ key_id: keys.key_id!, key_secret: keys.key_secret! })

      try {
        const rzpOrder = await razorpay.orders.create({
          amount: Math.round(total * 100), // paise, integer
          currency: 'INR',
          receipt: orderNumber,
        })

        await Order.findByIdAndUpdate(order._id, { razorpayOrderId: rzpOrder.id })

        return NextResponse.json({
          orderId: order._id.toString(),
          orderNumber,
          razorpayOrderId: rzpOrder.id,
          amount: total,
        })
      } catch (rzpErr) {
        // Don't leave a dangling PENDING order if the gateway rejects us
        await Order.findByIdAndDelete(order._id)
        const { message, status } = describeError(rzpErr)
        console.error('Razorpay order creation failed:', rzpErr)
        return NextResponse.json({ error: message }, { status })
      }
    }

    return NextResponse.json({ orderId: order._id.toString(), orderNumber, amount: total })
  } catch (err) {
    console.error('Error creating order:', err)
    const { message, status } = describeError(err)
    return NextResponse.json({ error: message }, { status })
  }
}
