// Images live in /public/uploads/{products,categories,subcategories}/ and are
// served by Next.js from the same origin. Set NEXT_PUBLIC_IMAGE_URL_BASE only
// if they move to an external host/CDN (e.g. https://cdn.example.com).
const BASE = process.env.NEXT_PUBLIC_IMAGE_URL_BASE || ''

function buildUrl(folder: string, placeholder: string, filename?: string | null): string {
  if (!filename) return placeholder
  if (filename.startsWith('http://') || filename.startsWith('https://')) return filename
  if (filename.startsWith('/')) return filename
  return `${BASE}/uploads/${folder}/${filename}`
}

export function getProductImageUrl(filename?: string | null): string {
  return buildUrl('products', '/placeholder-product.png', filename)
}

export function getCategoryImageUrl(filename?: string | null): string {
  return buildUrl('categories', '/placeholder-category.png', filename)
}

export function getSubcategoryImageUrl(filename?: string | null): string {
  return buildUrl('subcategories', '/placeholder-category.png', filename)
}
