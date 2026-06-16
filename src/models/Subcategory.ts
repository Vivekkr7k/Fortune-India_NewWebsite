import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISubcategory extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  slug?: string
  category: mongoose.Types.ObjectId
  image?: string
}

const SubcategorySchema = new Schema<ISubcategory>({
  name:     { type: String, required: true },
  slug:     { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  image:    { type: String },
}, { timestamps: true })

const Subcategory: Model<ISubcategory> =
  mongoose.models.Subcategory ||
  mongoose.model<ISubcategory>('Subcategory', SubcategorySchema, 'subcategories')

export default Subcategory
