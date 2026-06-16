import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IContact extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  company?: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'NEW' | 'READ' | 'REPLIED'
  createdAt: Date
}

const ContactSchema = new Schema<IContact>({
  name:    { type: String, required: true },
  company: { type: String },
  email:   { type: String, required: true },
  phone:   { type: String },
  subject: { type: String, default: 'General Enquiry' },
  message: { type: String, required: true },
  status:  { type: String, enum: ['NEW', 'READ', 'REPLIED'], default: 'NEW' },
}, { timestamps: true })

const Contact: Model<IContact> =
  mongoose.models.Contact ||
  mongoose.model<IContact>('Contact', ContactSchema, 'contacts')

export default Contact
