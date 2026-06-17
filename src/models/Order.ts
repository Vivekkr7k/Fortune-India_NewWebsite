import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IOrderItem {
  productId: mongoose.Types.ObjectId
  name: string
  code?: string
  price: number
  shippingCharge: number
  quantity: number
  total: number
  image?: string
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId
  orderNumber: string
  name: string
  email: string
  phone: string
  company?: string
  address: string
  city: string
  state: string
  pincode: string
  gstNumber?: string
  poNumber?: string
  items: IOrderItem[]
  subtotal: number
  shipping: number
  gst: number
  total: number
  paymentMethod: 'RAZORPAY' | 'COD' | 'BANK_TRANSFER' | 'UPI_QR'
  razorpayOrderId?: string
  razorpayPaymentId?: string
  upiTransactionId?: string
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED'
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId:      { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name:           { type: String, required: true },
  code:           { type: String },
  price:          { type: Number, required: true },
  shippingCharge: { type: Number, default: 0 },
  quantity:       { type: Number, required: true },
  total:          { type: Number, required: true },
  image:          { type: String },
}, { _id: false })

const OrderSchema = new Schema<IOrder>({
  orderNumber:       { type: String, required: true, unique: true },
  name:              { type: String, required: true },
  email:             { type: String, required: true },
  phone:             { type: String, required: true },
  company:           { type: String },
  address:           { type: String, required: true },
  city:              { type: String, required: true },
  state:             { type: String, required: true },
  pincode:           { type: String, required: true },
  gstNumber:         { type: String },
  poNumber:          { type: String },
  items:             [OrderItemSchema],
  subtotal:          { type: Number, required: true },
  shipping:          { type: Number, default: 0 },
  gst:               { type: Number, default: 0 },
  total:             { type: Number, required: true },
  paymentMethod:     { type: String, enum: ['RAZORPAY', 'COD', 'BANK_TRANSFER', 'UPI_QR'], default: 'COD' },
  razorpayOrderId:   { type: String },
  razorpayPaymentId: { type: String },
  upiTransactionId:  { type: String },
  paymentStatus:     { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
  status:            { type: String, enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], default: 'PENDING' },
  notes:             { type: String },
}, { timestamps: true })

const Order: Model<IOrder> =
  mongoose.models.Order ||
  mongoose.model<IOrder>('Order', OrderSchema, 'orders')

export default Order
