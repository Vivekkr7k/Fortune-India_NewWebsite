import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function discountPercent(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100)
}

// Display-only formatting for raw ALL-CAPS database names,
// e.g. "HARDWARE & TOOLS PRODUCTS" → "Hardware & Tools Products"
export function toTitleCase(text: string): string {
  return text.toLowerCase().replace(/(^|[\s\-/(])([a-z])/g, (_, sep, ch) => sep + ch.toUpperCase())
}
