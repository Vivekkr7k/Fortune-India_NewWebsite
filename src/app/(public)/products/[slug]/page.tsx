import { connectDB } from '@/lib/mongoose'
import { Product } from '@/models'
import { toClientProduct, type RawProduct } from '@/lib/serialize'
import { notFound } from 'next/navigation'
import { ProductDetailClient } from '@/components/products/ProductDetailClient'
import type { Metadata } from 'next'
import { buildMetadata, breadcrumbJsonLd, SITE } from '@/lib/site'
import { getProductImageUrl } from '@/lib/imageUrl'

interface PageProps {
  params: Promise<{ slug: string }>
}

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/

// The URL slug is the product code (FI1, FI2…); falls back to MongoDB _id
function slugFilter(slug: string) {
  return OBJECT_ID_RE.test(slug)
    ? { $or: [{ code: slug }, { _id: slug }], active: { $ne: false } }
    : { code: slug, active: { $ne: false } }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  await connectDB()

  const product = await Product.findOne(slugFilter(slug)).lean<RawProduct>()
  if (!product) {
    return buildMetadata({ title: 'Product Not Found', path: `/products/${slug}`, noindex: true })
  }

  const code = product.code || slug
  const name = product.name ?? 'Product'
  const description =
    (product.description ?? '').slice(0, 160) ||
    `${name} — precision printing from Fortune India, authorized supplier to HAL, BHEL & TATA.`
  const image = product.image ? getProductImageUrl(product.image) : undefined

  return buildMetadata({
    title: name,
    description,
    path: `/products/${code}`,
    image: image?.startsWith('http') ? image : undefined,
    keywords: [name, `${name} supplier`, `buy ${name} india`, product.brand || 'Fortune India'],
  })
}

export const revalidate = 0

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  await connectDB()

  const productDoc = await Product.findOne(slugFilter(slug))
    .populate('category', '_id name slug')
    .lean<RawProduct>()

  if (!productDoc) {
    notFound()
  }

  const categoryId = String((productDoc.category as { _id?: unknown })?._id ?? '')
  const relatedDocs = await Product.find({
    category: categoryId,
    _id: { $ne: String(productDoc._id) },
    active: { $ne: false },
  })
    .populate('category', '_id name slug')
    .limit(4)
    .lean<RawProduct[]>()

  const product = toClientProduct(productDoc)
  const relatedProducts = relatedDocs.map(toClientProduct)

  // Generate JSON-LD Structured Data
  const productUrl = `${SITE.url}/products/${product.slug}`
  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "sku": product.code,
    "image": JSON.parse(product.images)[0] || '',
    "brand": { "@type": "Brand", "name": product.brand },
    "category": product.category?.name,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "INR",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": productUrl,
      "seller": { "@id": `${SITE.url}/#organization` }
    }
  }

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: product.name, path: `/products/${product.slug}` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([productJsonLd, breadcrumb]) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  )
}
