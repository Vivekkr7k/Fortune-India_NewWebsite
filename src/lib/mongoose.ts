import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Cache the connection across hot reloads in dev so we don't open
// a new connection on every request
const globalWithCache = globalThis as typeof globalThis & { _mongoose?: MongooseCache }

const cached: MongooseCache = globalWithCache._mongoose ?? { conn: null, promise: null }
globalWithCache._mongoose = cached

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in .env.local')
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
  }

  try {
    cached.conn = await cached.promise
  } catch (err) {
    cached.promise = null
    throw err
  }

  return cached.conn
}
