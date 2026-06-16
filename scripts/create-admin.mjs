// One-time script: creates the admin user in the existing MongoDB Atlas `users` collection.
// Reads MONGODB_URI from .env.local. Run with:  node scripts/create-admin.mjs
import { readFileSync } from 'node:fs'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

function loadEnvLocal() {
  const raw = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

async function main() {
  loadEnvLocal()

  const uri = process.env.MONGODB_URI
  if (!uri || uri.includes('<db_password>')) {
    console.error('✗ Set your real Atlas password in MONGODB_URI inside .env.local first.')
    process.exit(1)
  }

  await mongoose.connect(uri)

  const users = mongoose.connection.db.collection('users')

  const email = process.env.ADMIN_EMAIL || 'admin@fortuneindia.com'
  const password = process.env.ADMIN_PASSWORD || 'Admin@123'

  const existing = await users.findOne({ email })
  if (existing) {
    console.log(`✅ Admin user already exists: ${email}`)
    await mongoose.disconnect()
    return
  }

  const hashed = await bcrypt.hash(password, 10)

  await users.insertOne({
    name: 'Admin',
    email,
    password: hashed,
    role: 'ADMIN',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  console.log(`✅ Admin user created: ${email} / ${password}`)
  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
