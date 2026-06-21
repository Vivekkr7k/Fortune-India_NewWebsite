'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { ShoppingCart, Menu, X } from 'lucide-react'
import Image from 'next/image'
import { ProductSearch } from './ProductSearch'

export function Header() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const cartCount = useCartStore(s => s.count())

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 w-full bg-white/95 backdrop-blur-md border-b border-[var(--border)] z-40">
      <div className="max-w-[var(--container)] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo.png"
            alt="Fortune India Logo"
            width={400}
            height={120}
            className="h-10 md:h-11 w-auto object-contain scale-[1.25] origin-left transition-transform group-hover:scale-[1.3]"
            priority
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-[14px]">
          <Link href="/" className="text-[var(--ink)] hover:text-[var(--signal)] transition-colors">
            Home
          </Link>
          <Link href="/products" className="text-[var(--ink)] hover:text-[var(--signal)] transition-colors">
            Products
          </Link>
          <Link href="/about" className="text-[var(--ink)] hover:text-[var(--signal)] transition-colors">
            About Us
          </Link>
          <Link href="/faq" className="text-[var(--ink)] hover:text-[var(--signal)] transition-colors">
            FAQ
          </Link>
          <Link href="/contact" className="text-[var(--ink)] hover:text-[var(--signal)] transition-colors">
            Contact
          </Link>
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          {/* Product Search */}
          <ProductSearch />

          {/* Cart Icon Link */}
          <Link 
            href="/cart" 
            className="relative p-2 text-[var(--ink)] hover:text-[var(--signal)] transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={20} />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--signal)] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Get a Quote Button */}
          <Link 
            href="/contact?subject=Quote Request" 
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[var(--signal)] hover:bg-[var(--signal-hover)] text-white text-[13px] font-bold transition-all shadow-[var(--sh-card)] hover:shadow-[var(--sh-hover)] cursor-pointer"
          >
            Get a Quote
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[var(--ink)] cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[var(--border)] px-4 py-6 flex flex-col gap-4 font-medium text-[15px] animate-fade-up">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-[var(--ink)] hover:text-[var(--signal)] transition-colors py-1.5"
          >
            Home
          </Link>
          <Link 
            href="/products" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-[var(--ink)] hover:text-[var(--signal)] transition-colors py-1.5"
          >
            Products
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[var(--ink)] hover:text-[var(--signal)] transition-colors py-1.5"
          >
            About Us
          </Link>
          <Link
            href="/faq"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[var(--ink)] hover:text-[var(--signal)] transition-colors py-1.5"
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[var(--ink)] hover:text-[var(--signal)] transition-colors py-1.5"
          >
            Contact
          </Link>
          <Link 
            href="/contact?subject=Quote Request"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-3 rounded-full bg-[var(--signal)] hover:bg-[var(--signal-hover)] text-white font-bold text-[14px] mt-2 block"
          >
            Get a Quote
          </Link>
        </div>
      )}
    </header>
  )
}
