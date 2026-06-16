'use client'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export function OrderCheckmark() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
      className="w-16 h-16 rounded-full bg-[var(--color-success-tint)] border-2 border-[var(--color-success)] flex items-center justify-center text-[var(--color-success)] mx-auto mb-6 shrink-0"
    >
      <Check size={32} strokeWidth={3} />
    </motion.div>
  )
}
