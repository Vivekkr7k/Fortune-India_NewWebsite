'use client'
import Link from 'next/link'
import { Send, Phone, Mail, MapPin } from 'lucide-react'

const TICKER_ITEMS = [
  'NAMEPLATES',
  'SAFETY LABELS',
  'DECALS',
  'FLEX BANNERS',
  'PACKAGING',
  'BARCODES',
  'AEROSPACE LABELS',
  'INDUSTRIAL PRINTS',
]

export function Footer() {
  // Double the list for seamless marquee looping
  const tickerText = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <footer className="bg-[#141414] text-white">
      {/* SECTION 8: CONTINUOUS ORANGE TICKER */}
      <div className="bg-[var(--signal)] h-12 flex items-center overflow-hidden border-b border-white/10 group select-none">
        <div className="flex gap-8 whitespace-nowrap animate-ticker group-hover:[animation-play-state:paused]">
          {tickerText.map((item, idx) => (
            <div key={idx} className="flex items-center gap-8 font-[var(--font-mono)] text-[12px] md:text-[13px] font-bold text-white tracking-widest">
              <span>{item}</span>
              <span className="opacity-40">·</span>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER CORE GRID */}
      <div className="max-w-[var(--container)] mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left Column: Brand & Info */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <Link href="/" className="flex flex-col">
            <span className="font-[var(--font-display)] text-xl font-extrabold text-white tracking-tight uppercase">
              ☆ Fortune India
            </span>
            <span className="font-[var(--font-mono)] text-[10px] tracking-widest uppercase text-[var(--signal)] -mt-1">
              Precision Printing
            </span>
          </Link>
          <p className="italic text-white/70 text-[14px] leading-relaxed max-w-sm">
            "Transforming Your Vision into Reality." Authorized supplier to HAL, BHEL, and TATA. Serving Aerospace, Defence, Automotive & Pharma.
          </p>
          <div className="flex flex-col gap-3 text-[13px] text-white/60 font-[var(--font-mono)]">
            <div className="flex items-start gap-2.5">
              <MapPin size={16} className="text-[var(--signal)] shrink-0 mt-0.5" />
              <span>369, Attibele, Bangalore, Karnataka</span>
            </div>
          </div>
        </div>

        {/* Center Column: Navigation Links */}
        <div className="md:col-span-4 grid grid-cols-2 gap-8">
          {/* Products Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-[var(--font-mono)] text-[11px] uppercase tracking-wider text-[var(--signal)] font-bold">
              Products
            </h4>
            <ul className="flex flex-col gap-2.5 text-[13px] text-white/75 font-[var(--font-body)]">
              <li>
                <Link href="/products?category=nameplates" className="hover:text-white transition-colors">
                  Nameplates
                </Link>
              </li>
              <li>
                <Link href="/products?category=labels-decals" className="hover:text-white transition-colors">
                  Labels & Decals
                </Link>
              </li>
              <li>
                <Link href="/products?category=stickers" className="hover:text-white transition-colors">
                  Stickers
                </Link>
              </li>
              <li>
                <Link href="/products?category=flex-banners" className="hover:text-white transition-colors">
                  Flex & Banners
                </Link>
              </li>
              <li>
                <Link href="/products?category=packaging" className="hover:text-white transition-colors">
                  Packaging
                </Link>
              </li>
              <li>
                <Link href="/products?category=barcode-labels" className="hover:text-white transition-colors">
                  Barcode Labels
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-[var(--font-mono)] text-[11px] uppercase tracking-wider text-[var(--signal)] font-bold">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5 text-[13px] text-white/75">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/contact?subject=Bulk Inquiry" className="hover:text-white transition-colors">
                  Bulk Orders
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Contact Card */}
        <div className="md:col-span-3">
          <div className="bg-[#1E1E1E] border border-white/5 rounded-[var(--r-xl)] p-5 flex flex-col gap-4 shadow-lg">
            <h4 className="font-[var(--font-display)] text-[15px] font-bold text-white">
              B2B Client Desk
            </h4>
            
            <div className="flex flex-col gap-3.5 text-[13px]">
              <a href="tel:+918830575677" className="flex items-center gap-2.5 hover:text-[var(--signal)] transition-colors">
                <Phone size={14} className="text-[var(--signal)]" />
                <span>+91 88305 75677</span>
              </a>
              <a href="mailto:fortuneindiabgl@gmail.com" className="flex items-center gap-2.5 hover:text-[var(--signal)] transition-colors break-all">
                <Mail size={14} className="text-[var(--signal)]" />
                <span>fortuneindiabgl@gmail.com</span>
              </a>
            </div>

            <Link
              href="/contact"
              className="w-full mt-2 py-2.5 rounded-full bg-[var(--signal)] hover:bg-[var(--signal-hover)] text-white text-[12px] font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send size={12} />
              Send Enquiry
            </Link>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/5 bg-[#0F0F0F]">
        <div className="max-w-[var(--container)] mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-white/40 font-[var(--font-mono)]">
          <span>&copy; 2025 Fortune India. All Rights Reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/delivery" className="hover:text-white transition-colors">
              Delivery Info
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
