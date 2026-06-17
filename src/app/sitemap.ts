import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'
import { connectDB } from '@/lib/mongoose'
import { Product, Category } from '@/models'

export const revalidate = 3600 // refresh the sitemap hourly

// Static, indexable marketing/content routes
const STATIC_ROUTES: {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}[] = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/products', changeFrequency: 'daily', priority: 0.9 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.6 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE.url}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  // Pull product + category routes from the database. Failures here must not
  // break the build/serve, so fall back to just the static routes.
  try {
    await connectDB()

    const [products, categories] = await Promise.all([
      Product.find({ active: { $ne: false } })
        .select('code _id updatedAt createdAt')
        .lean<{ code?: string; _id: unknown; updatedAt?: Date; createdAt?: Date }[]>(),
      Category.find().select('slug updatedAt').lean<{ slug?: string; updatedAt?: Date }[]>(),
    ])

    const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${SITE.url}/products/${p.code || String(p._id)}`,
      lastModified: p.updatedAt ?? p.createdAt ?? now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    const categoryEntries: MetadataRoute.Sitemap = categories
      .filter((c) => c.slug)
      .map((c) => ({
        url: `${SITE.url}/products?category=${c.slug}`,
        lastModified: c.updatedAt ?? now,
        changeFrequency: 'weekly',
        priority: 0.6,
      }))

    return [...staticEntries, ...categoryEntries, ...productEntries]
  } catch {
    return staticEntries
  }
}
