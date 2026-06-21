import Link from 'next/link'

export function CTABanner() {
  return (
    <section className="bg-[var(--signal)] py-16 md:py-24 text-white">
      <div className="max-w-[var(--container)] mx-auto px-4 md:px-8 flex flex-col items-center text-center gap-6 md:gap-8">
        <h2 className="font-[var(--font-display)] text-[28px] md:text-[48px] font-extrabold text-white tracking-tight leading-[1.1] max-w-3xl">
          Ready to Source B2B Electronics & Drone Parts?
        </h2>
        <p className="font-[var(--font-body)] text-[15px] md:text-[17px] text-white/95 max-w-xl leading-relaxed">
          Join 200+ businesses who trust Fortune India for premium B2B components. Get durable carbon fiber products, sensors, motors, and electronic supplies.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white hover:bg-[#F6F4F0] text-[var(--ink)] text-[13px] font-extrabold transition-all shadow-md cursor-pointer"
          >
            Shop Products &rarr;
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border-2 border-white hover:bg-white/10 text-white text-[13px] font-extrabold transition-all cursor-pointer"
          >
            Get a Free Quote
          </Link>
        </div>
      </div>
    </section>
  )
}
