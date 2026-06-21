'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import { Shield, Trophy, Users, ArrowRight } from 'lucide-react'

export function BentoHero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-[var(--container)] mx-auto px-4 md:px-8 py-8 md:py-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 md:grid-rows-[minmax(380px,_auto)_160px]">
        {/* TILE 1: Main CTA Tile (col 1, row 1) - spans 6 cols, 2 rows on desktop */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-6 md:row-span-2 border border-[rgba(255,90,31,0.15)] rounded-[var(--r-xl)] p-6 md:p-[40px_44px] flex flex-col justify-between overflow-hidden relative group"
        >
          {/* Background Image */}
          <Image 
            src="/images/vision-to-reality.png" 
            alt="Transforming Your Vision into Reality" 
            fill 
            className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F0]/95 via-white/85 to-[#FFF5F0]/95 z-0"></div>

          <div className="flex flex-col gap-4 relative z-10">
            <span className="font-[var(--font-mono)] text-[11px] font-bold text-[var(--signal)] tracking-widest uppercase bg-white/50 w-fit px-2 py-1 rounded-sm backdrop-blur-sm">
              / B2B Electronics & Drone Parts
            </span>
            <h1 className="font-[var(--font-display)] text-[32px] md:text-[46px] font-extrabold text-[var(--ink)] leading-[1.15] tracking-tight drop-shadow-sm" style={{ fontSize: 'clamp(26px, 3.2vw, 44px)' }}>
              Transforming Your Vision into Reality.
            </h1>
            <p className="font-[var(--font-body)] text-[14px] md:text-[15px] text-[var(--body-text)] leading-relaxed max-w-lg bg-white/40 p-2 rounded-lg backdrop-blur-sm" style={{ marginBottom: '12px' }}>
              High-quality drone parts, carbon fiber sheets, sensors, development boards, and B2B electronics for modern engineering projects.
            </p>
          </div>

          <div className="flex flex-col mt-4 md:mt-0 relative z-10">
            {/* Chips */}
            <div className="flex flex-wrap gap-[6px] mb-[16px]">
              <span className="bg-white/90 backdrop-blur-md border border-[var(--border)] text-[var(--ink)] text-[11px] font-semibold font-[var(--font-mono)] px-3 py-1.5 rounded-full shadow-sm">
                Premium Quality
              </span>
              <span className="bg-white/90 backdrop-blur-md border border-[var(--border)] text-[var(--ink)] text-[11px] font-semibold font-[var(--font-mono)] px-3 py-1.5 rounded-full shadow-sm">
                B2B Electronics
              </span>
              <span className="bg-white/90 backdrop-blur-md border border-[var(--border)] text-[var(--ink)] text-[11px] font-semibold font-[var(--font-mono)] px-3 py-1.5 rounded-full shadow-sm">
                Pan-India Delivery
              </span>
              <span className="bg-white/90 backdrop-blur-md border border-[var(--border)] text-[var(--ink)] text-[11px] font-semibold font-[var(--font-mono)] px-3 py-1.5 rounded-full shadow-sm">
                B2B Specialist
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--signal)] hover:bg-[var(--signal-hover)] text-white text-[13px] font-bold transition-all shadow-[var(--sh-card)] hover:shadow-[var(--sh-hover)] cursor-pointer"
              >
                Shop Products &rarr;
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[var(--border-dark)] hover:border-[var(--ink)] text-[var(--ink)] text-[13px] font-bold transition-all bg-transparent cursor-pointer"
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        </motion.div>

        {/* TILE 2: Image tile (col 2, row 1) - spans 3 cols, 1 row on desktop */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-3 rounded-[var(--r-xl)] overflow-hidden shadow-[var(--sh-card)] relative group md:h-full border border-[var(--border)]"
        >
          <div className="w-full h-full flex items-center justify-center relative">
            <Image 
              src="/images/carbon_fiber.png" 
              alt="Carbon Fiber Structurals" 
              fill 
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors z-0"></div>

            <div className="flex flex-col items-center gap-2 z-10 text-center px-4">
              <span className="text-[28px] drop-shadow-md">🛠️</span>
              <span className="font-[var(--font-display)] text-[15px] font-bold text-white drop-shadow-md">Carbon Fiber Structurals</span>
              <span className="font-[var(--font-mono)] text-[10px] text-white/80 font-semibold tracking-wide">High-Strength Sheets & Parts</span>
            </div>
            
            {/* Badge bottom-right */}
            <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 text-[11px] font-semibold text-white shadow-sm font-[var(--font-mono)] z-10">
              500+ Products Delivered
            </div>
          </div>
        </motion.div>

        {/* TILE 3: Defence spec dark tile (col 3, row 1) - spans 3 cols, 1 row on desktop */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-3 rounded-[var(--r-xl)] p-6 flex flex-col justify-between md:h-full relative overflow-hidden group shadow-[var(--sh-card)] border border-[#333]"
        >
          <Image 
            src="/images/drone_parts.png" 
            alt="Drone & RC Parts" 
            fill 
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#141414]/90 to-[#141414]/70 transition-opacity z-0"></div>

          <div className="flex flex-col gap-3 relative z-10">
            <div className="w-8 h-8 rounded-full bg-[var(--signal)] flex items-center justify-center text-[15px] shadow-lg shadow-[var(--signal)]/20">
              🚁
            </div>
            <span className="font-[var(--font-mono)] text-[9px] font-bold text-[var(--signal)] tracking-widest uppercase drop-shadow-md">
              HIGH PERFORMANCE
            </span>
            <h3 className="font-[var(--font-display)] text-[18px] font-bold text-white leading-tight drop-shadow-md">
              Brushless Motors & RC Parts
            </h3>
            <p className="text-[12px] text-[#A0A0A0] leading-relaxed drop-shadow-sm font-medium">
              High-performance brushless motors, ESCs, propellers, and RC components for commercial drone assemblies.
            </p>
          </div>
          <Link
            href="/products?category=drone-rc-parts"
            className="font-[var(--font-mono)] text-[11px] text-[var(--signal)] hover:text-white transition-colors flex items-center gap-1.5 mt-4 md:mt-0 relative z-10 w-fit drop-shadow-md"
          >
            Explore Range <ArrowRight size={12} />
          </Link>
        </motion.div>

        {/* TILE 4: Stats 15+ years (col 1 left, row 2) - spans 3 cols, 1 row on desktop */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-3 bg-white border border-[var(--border)] rounded-[var(--r-xl)] p-5 flex items-center justify-between shadow-[var(--sh-card)] md:h-full"
        >
          <div className="flex flex-col">
            <span className="font-[var(--font-display)] text-[42px] font-extrabold text-[var(--ink)] leading-none tracking-tight">
              15+
            </span>
            <span className="font-[var(--font-body)] text-[13px] text-[var(--muted)] mt-1.5 leading-snug">
              Years in B2B Components
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[var(--signal-tint)] flex items-center justify-center text-[16px] text-[var(--signal)]">
            🏆
          </div>
        </motion.div>

        {/* TILE 5: Stats 10+ industries (col 1 right, row 2) - spans 3 cols, 1 row on desktop */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-3 bg-white border border-[var(--border)] rounded-[var(--r-xl)] p-5 flex items-center justify-between shadow-[var(--sh-card)] md:h-full"
        >
          <div className="flex flex-col">
            <span className="font-[var(--font-display)] text-[42px] font-extrabold text-[var(--ink)] leading-none tracking-tight">
              10+
            </span>
            <span className="font-[var(--font-body)] text-[13px] text-[var(--muted)] mt-1.5 leading-snug">
              Industries Served
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[var(--signal-tint)] flex items-center justify-center text-[16px] text-[var(--signal)]">
            🏭
          </div>
        </motion.div>

        {/* TILE 6: Bulk order pricing (col 3, row 2) - spans 3 cols, 1 row on desktop */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-3 bg-[var(--signal)] rounded-[var(--r-xl)] p-5 flex flex-col justify-between text-white md:h-full"
        >
          <div className="flex flex-col gap-1">
            <h4 className="font-[var(--font-display)] text-[15px] font-bold text-white leading-tight">
              Bulk Order Pricing
            </h4>
            <p className="text-[12px] text-white/80 leading-snug">
              Custom pricing for large-volume orders
            </p>
          </div>
          <Link
            href="/contact?subject=Bulk Quote"
            className="inline-flex items-center justify-center px-4 py-2 border border-white/40 hover:border-white rounded-full bg-transparent text-white text-[11px] font-bold font-[var(--font-mono)] tracking-wider transition-colors w-full cursor-pointer mt-3 md:mt-0"
          >
            Request Quote &rarr;
          </Link>
        </motion.div>

        {/* TILE 7: Review tile (col 3, row 2) - spans 3 cols, 1 row on desktop */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-3 bg-white border border-[var(--border)] rounded-[var(--r-xl)] p-5 flex flex-col justify-between shadow-[var(--sh-card)] md:h-full"
        >
          <div className="flex gap-0.5 text-[#F5A623] text-sm">
            ★ ★ ★ ★ ★
          </div>
          <p className="italic text-[12px] text-[var(--body-text)] leading-snug mt-2">
            "Outstanding component build quality and consistent specifications. The drone motors and carbon fiber sheets exceeded our engineering standards."
          </p>
          <span className="font-[var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--muted)] mt-1.5 block">
            — AeroVanguard Technologies
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}
