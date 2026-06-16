import mongoose, { Schema, Document, Model } from 'mongoose'

// Maps to the existing `foods` collection in the `fortune` database
export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  code: string              // e.g. "FI1", "FI2" — used as the URL slug
  description: string
  price: number
  shippingCharge: number
  image: string             // filename, e.g. "products-1781274317421-522181276.jpg"
  category: mongoose.Types.ObjectId
  subcategory?: mongoose.Types.ObjectId
  // Optional fields not present on legacy documents — schema defaults apply
  stock?: number
  featured?: boolean
  active?: boolean
  rating?: number
  reviewCount?: number
  soldCount?: number
  originalPrice?: number
  brand?: string
  createdAt?: Date
  updatedAt?: Date
}

const ProductSchema = new Schema<IProduct>({
  name:           { type: String, required: true },
  code:           { type: String, required: true, unique: true },
  description:    { type: String },
  price:          { type: Number, required: true },
  shippingCharge: { type: Number, default: 0 },
  image:          { type: String },
  category:       { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory:    { type: Schema.Types.ObjectId, ref: 'Subcategory' },
  stock:          { type: Number, default: 999 },
  featured:       { type: Boolean, default: false },
  active:         { type: Boolean, default: true },
  rating:         { type: Number, default: 0 },
  reviewCount:    { type: Number, default: 0 },
  soldCount:      { type: Number, default: 0 },
  originalPrice:  { type: Number },
  brand:          { type: String, default: 'Fortune India' },
}, { timestamps: true })

ProductSchema.index({ name: 'text', description: 'text', code: 'text' })

const Product: Model<IProduct> =
  mongoose.models.Product ||
  mongoose.model<IProduct>('Product', ProductSchema, 'foods')

export default Product
