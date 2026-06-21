import { getProductImageUrl } from './imageUrl'
import { slugify } from './utils'

// Converts a MongoDB document (ObjectIds, Dates) to a plain serializable object
export function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc))
}

export function toId(doc: { _id: unknown }): string {
  return String(doc._id ?? '')
}

export interface ClientCategory {
  id: string
  name: string
  slug: string
  image?: string | null
}

export interface ClientSubcategory {
  id: string
  name: string
  slug: string
  image?: string | null
  category: string
}

// The product shape every client component (ProductGrid, FeaturedProducts,
// ProductDetailClient, ProductsPageClient) already expects. `images` stays a
// JSON string for compatibility with the existing JSON.parse calls.
export interface ClientProduct {
  id: string
  slug: string
  code: string
  name: string
  description: string
  price: number
  originalPrice: number | null
  shippingCharge: number
  images: string
  category: ClientCategory
  subcategory?: ClientSubcategory | null
  stock: number
  specs: string | null
  brand: string
  rating: number
  reviewCount: number
  soldCount: number
  featured: boolean
  createdAt: Date
}

interface RawCategory {
  _id?: unknown
  name?: string
  slug?: string
  image?: string
}

// Raw lean() product doc from the `foods` collection with populated category
export interface RawProduct {
  _id: unknown
  name?: string
  code?: string
  description?: string
  price?: number
  shippingCharge?: number
  image?: string
  category?: RawCategory | null
  subcategory?: any
  stock?: number
  featured?: boolean
  active?: boolean
  rating?: number
  reviewCount?: number
  soldCount?: number
  originalPrice?: number
  brand?: string
  createdAt?: Date
}

export function toClientCategory(cat: RawCategory | null | undefined): ClientCategory {
  const name = cat?.name ?? 'Uncategorized'
  return {
    id: String(cat?._id ?? ''),
    name,
    slug: cat?.slug || slugify(name),
    image: cat?.image || null,
  }
}

export function toClientSubcategory(sub: any): ClientSubcategory | null {
  if (!sub) return null
  const name = sub.name ?? 'Uncategorized'
  return {
    id: String(sub._id ?? ''),
    name,
    slug: sub.slug || slugify(name),
    image: sub.image || null,
    category: String(sub.category?._id || sub.category || ''),
  }
}

export function toClientProduct(p: RawProduct): ClientProduct {
  const imageUrl = getProductImageUrl(p.image)
  return {
    id: String(p._id),
    slug: p.code || String(p._id),   // product code (FI1, FI2…) doubles as the URL slug
    code: p.code || '',
    name: p.name ?? '',
    description: p.description ?? '',
    price: p.price ?? 0,
    originalPrice: p.originalPrice ?? null,
    shippingCharge: p.shippingCharge ?? 0,
    images: JSON.stringify(imageUrl ? [imageUrl] : []),
    category: toClientCategory(p.category),
    subcategory: toClientSubcategory(p.subcategory),
    stock: p.stock ?? 999,
    specs: null,
    brand: p.brand || 'Fortune India',
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    soldCount: p.soldCount ?? 0,
    featured: !!p.featured,
    createdAt: p.createdAt ?? new Date(0),
  }
}
