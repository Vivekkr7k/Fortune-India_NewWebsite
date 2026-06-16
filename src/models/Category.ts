import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  slug?: string
  image?: string
  createdAt?: Date
  updatedAt?: Date
}

const CategorySchema = new Schema<ICategory>({
  name:  { type: String, required: true },
  slug:  { type: String },
  image: { type: String },
}, { timestamps: true })

const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>('Category', CategorySchema, 'categories')

export default Category
