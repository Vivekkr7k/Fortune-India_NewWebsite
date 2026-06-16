import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  email: string
  password: string
  phone?: string
  company?: string
  role: 'ADMIN' | 'CUSTOMER'
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone:    { type: String },
  company:  { type: String },
  role:     { type: String, enum: ['ADMIN', 'CUSTOMER'], default: 'CUSTOMER' },
}, { timestamps: true })

const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema, 'users')

export default User
