'use client'
import { motion, Variants } from 'framer-motion'
import { ProductCard } from '@/components/ui/ProductCard'

interface Product {
  id: string
  slug: string
  code?: string
  name: string
  price: number
  originalPrice: number | null
  shippingCharge?: number
  images: string
  category: {
    id: string
    name: string
    slug: string
  }
  stock: number
  specs: string | null
  brand: string
  rating: number
  reviewCount: number
  soldCount: number
  featured: boolean
}

interface ProductGridProps {
  products: Product[]
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {products.map((product, index) => {
        let parsedImages: string[] = []
        try {
          parsedImages = JSON.parse(product.images)
          if (!Array.isArray(parsedImages)) {
            parsedImages = []
          }
        } catch (err) {
          parsedImages = []
        }

        return (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCard
              id={product.id}
              slug={product.slug}
              code={product.code}
              imagePriority={index < 4}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice || undefined}
              shippingCharge={product.shippingCharge}
              images={parsedImages}
              category={product.category.name}
              brand={product.brand}
              rating={product.rating}
              reviewCount={product.reviewCount}
              soldCount={product.soldCount}
              stock={product.stock}
            />
          </motion.div>
        )
      })}
    </motion.div>
  )
}
