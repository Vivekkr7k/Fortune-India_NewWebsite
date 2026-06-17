import Link from 'next/link'
import { ShieldAlert, Award, Plane, Truck, Landmark, BarChart } from 'lucide-react'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'About Us',
  description:
    'Learn about Fortune India — a Bangalore (Attibele) precision printing company since 2009 and authorized supplier of nameplates and safety labels to HAL, BHEL and TATA, serving aerospace, defence, automotive and pharma.',
  path: '/about',
  keywords: [
    'about fortune india',
    'precision printing company bangalore',
    'authorized HAL BHEL TATA supplier',
    'industrial nameplate manufacturer india',
  ],
})

export default function AboutPage() {
  const stats = [
    { number: '500+', label: 'Projects Completed' },
    { number: '15+', label: 'Years Experience' },
    { number: '10+', label: 'Industries Served' },
    { number: '3', label: 'PSU Clients (HAL, BHEL, TATA)' },
  ]

  const strengths = [
    {
      emoji: '🎯',
      title: 'Precision Guaranteed',
      desc: 'Micron-level accuracy on every print run. Tolerances that meet aerospace and defence standards.',
    },
    {
      emoji: '🛡️',
      title: 'Defence Certified',
      desc: 'Approved vendor to HAL and BHEL. Our nameplates and labels meet strict military-grade requirements.',
    },
    {
      emoji: '🚚',
      title: 'Pan-India Delivery',
      desc: 'From Bangalore to any corner of India. Reliable tracking and packaging provided for every shipment.',
    },
    {
      emoji: '💼',
      title: 'B2B First',
      desc: 'Custom quotes, high-volume pricing grids, GST invoices, and dedicated account management.',
    },
  ]

  const partners = [
    { name: 'HAL', fullName: 'Hindustan Aeronautics Limited' },
    { name: 'BHEL', fullName: 'Bharat Heavy Electricals Limited' },
    { name: 'TATA', fullName: 'Tata Group Companies' },
  ]

  const industries = [
    {
      title: 'Aerospace & Aviation',
      specs: 'HAL · Cockpit Labels · MIL-Spec Nameplates',
      emoji: '✈️',
    },
    {
      title: 'Defence & Drone',
      specs: 'DRDO · BHEL · Tactical Decals · Parts ID',
      emoji: '🛡️',
    },
    {
      title: 'Automotive',
      specs: 'TATA · OEM Labels · VIN Plates · Dashboards',
      emoji: '🚗',
    },
    {
      title: 'Pharma',
      specs: 'FDA Labels · Serialization · Tamper-Proof Seals',
      emoji: '💊',
    },
    {
      title: 'Construction & Architecture',
      specs: 'Signboards · ACP Printing · Wayfinding',
      emoji: '🏗️',
    },
    {
      title: 'Industrial & Heavy Machinery',
      specs: 'BHEL · Safety Labels · Equipment Nameplates',
      emoji: '⚙️',
    },
  ]

  return (
    <div className="bg-[var(--color-canvas)] text-[var(--color-body)] min-h-screen">
      
      {/* SECTION 1: HERO */}
      <section className="bg-[var(--color-signal-tint)] py-16 md:py-24 border-b border-[var(--color-border-light)]">
        <div className="max-w-[var(--container)] mx-auto px-4 md:px-8 flex flex-col items-center text-center gap-6">
          <span className="font-[var(--font-mono)] text-[11px] font-bold text-[var(--color-signal)] tracking-widest uppercase">
            / OUR STORY
          </span>
          <h1 className="font-[var(--font-display)] text-[34px] md:text-[46px] lg:text-[54px] font-extrabold text-[var(--color-ink)] leading-tight tracking-tight max-w-5xl">
            Your Most Trusted Brand for High-Quality, Durable & Precision Printing Solutions
          </h1>
          <p className="font-[var(--font-body)] text-[16px] md:text-[18px] text-[var(--color-body)] max-w-2xl leading-relaxed font-medium">
            Transforming Your Vision into Reality.
            <br/><span className="text-[14px] md:text-[15px] font-normal text-[var(--color-muted)]">15+ years of delivering high-quality printing solutions to India's most demanding industries.</span>
          </p>
          
          <Link
            href="/products"
            className="px-8 py-3.5 rounded-full bg-[var(--color-signal)] hover:bg-[var(--color-signal-hover)] text-white text-[13px] font-bold shadow-md hover:shadow-lg transition-all cursor-pointer mt-2"
          >
            Explore Our Products &rarr;
          </Link>

          {/* Company Image Placeholder */}
          <div className="w-full max-w-5xl aspect-[21/9] bg-[var(--color-surface-alt)] rounded-[24px] border border-[var(--color-border)] mt-12 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#141414_1px,transparent_1px)] [background-size:20px_20px]"></div>
            <span className="text-4xl opacity-50 mb-2">🏭</span>
            <span className="font-[var(--font-display)] text-[16px] font-bold text-[var(--color-ink)]">Fortune India Corporate Facility</span>
            <span className="font-[var(--font-mono)] text-[11px] text-[var(--color-muted)] mt-1">Address: 369, Attibele, Bangalore, Karnataka</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHO WE ARE */}
      <section className="py-20 max-w-[var(--container)] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <span className="font-[var(--font-mono)] text-[10px] font-bold text-[var(--color-signal)] tracking-widest uppercase">
            / WHO WE ARE
          </span>
          <h2 className="font-[var(--font-display)] text-[28px] md:text-[38px] font-extrabold text-[var(--color-ink)] tracking-tight leading-tight">
            India's Trusted Precision Printing Partner.
          </h2>
          <div className="font-[var(--font-body)] text-[15px] leading-relaxed text-[var(--color-body)] flex flex-col gap-4 mt-2">
            <p>
              Fortune India has been serving India's industrial sector since 2009, delivering precision printing solutions that meet the most exacting standards in Aerospace, Defence, and Manufacturing.
            </p>
            <p>
              Based at <strong>369, Attibele, Bangalore, Karnataka</strong> — India's industrial heartland — we are an authorized supplier to HAL, BHEL, and TATA. Our products carry quality certifications recognized across PSU and private sector organizations.
            </p>
            <p>
              From a single aluminium nameplate to a production run of 100,000 safety labels — we bring the same precision, durability, and care to every order.
            </p>
          </div>
        </div>

        {/* Right Stats Grid */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          {stats.map((s, idx) => (
            <div key={idx} className="bg-white border border-[var(--color-border)] rounded-[20px] p-6 shadow-sm flex flex-col justify-between">
              <span className="font-[var(--font-display)] text-[44px] md:text-[48px] font-extrabold text-[var(--color-ink)] leading-none tracking-tight">
                {s.number}
              </span>
              <span className="font-[var(--font-body)] text-[13px] text-[var(--color-muted)] font-medium leading-snug mt-3">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: AUTHORIZED PARTNERS (Dark BG) */}
      <section className="bg-[#141414] py-16 text-white border-y border-white/5">
        <div className="max-w-[var(--container)] mx-auto px-4 md:px-8 flex flex-col items-center gap-8">
          <div className="text-center flex flex-col gap-2">
            <span className="font-[var(--font-mono)] text-[11px] font-bold text-[var(--color-signal)] tracking-widest uppercase">
              / AUTHORIZED SUPPLIER TO
            </span>
            <h2 className="font-[var(--font-display)] text-[26px] md:text-[34px] font-extrabold text-white tracking-tight leading-tight">
              We are authorized supplier of: HAL, BHEL, TATA
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mt-2">
            {partners.map((p, idx) => (
              <div 
                key={idx}
                className="bg-[#1E1E1E] border border-white/5 rounded-[20px] p-5 flex items-center gap-4 group hover:border-white/10"
              >
                <div className="w-2 h-2 rounded-full bg-[var(--color-signal)] shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-[var(--font-display)] text-[18px] font-extrabold text-white tracking-tight uppercase">
                    {p.name}
                  </span>
                  <span className="font-[var(--font-mono)] text-[10px] uppercase text-white/50 tracking-wider">
                    {p.fullName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: WHY CHOOSE US */}
      <section className="py-20 max-w-[var(--container)] mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center gap-2 mb-12">
          <span className="font-[var(--font-mono)] text-[11px] font-bold text-[var(--color-signal)] tracking-widest uppercase">
            / OUR STRENGTHS
          </span>
          <h2 className="font-[var(--font-display)] text-[28px] md:text-[38px] font-extrabold text-[var(--color-ink)] tracking-tight">
            Why Fortune India?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {strengths.map((s, idx) => (
            <div key={idx} className="bg-white border border-[var(--color-border)] rounded-[20px] p-7 shadow-sm flex flex-col gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--color-signal-tint)] flex items-center justify-center text-[20px] shrink-0">
                {s.emoji}
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-[var(--font-display)] text-[17px] font-bold text-[var(--color-ink)] leading-snug">
                  {s.title}
                </h3>
                <p className="font-[var(--font-body)] text-[13.5px] text-[var(--color-muted)] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: INDUSTRIES SERVED */}
      <section className="py-20 bg-[var(--color-surface-alt)]">
        <div className="max-w-[var(--container)] mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center text-center gap-3 mb-12">
            <span className="font-[var(--font-mono)] text-[11px] font-bold text-[var(--color-signal)] tracking-widest uppercase">
              / INDUSTRIES
            </span>
            <h2 className="font-[var(--font-display)] text-[28px] md:text-[38px] font-extrabold text-[var(--color-ink)] tracking-tight">
              We are supplier to:
            </h2>
            <p className="font-[var(--font-body)] text-[15px] md:text-[17px] text-[var(--color-muted)] max-w-4xl">
              Automotive, Aerospace Company, Defence, Drone, Aviation, Pharma, Architectural, Construction, etc.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind, idx) => (
              <div
                key={idx}
                className="group relative aspect-[16/9] bg-[#1E1E1E] rounded-[20px] overflow-hidden border border-white/5 shadow-md hover:scale-[1.03] transition-transform duration-300"
              >
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent z-10"></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-20">
                  <span className="text-[28px] self-start opacity-75">
                    {ind.emoji}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-[var(--font-display)] text-[17px] font-bold text-white leading-tight">
                      {ind.title}
                    </h3>
                    <p className="font-[var(--font-mono)] text-[11px] text-white/50 leading-snug">
                      {ind.specs}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: TERMS & CONDITIONS */}
      <section className="py-20 max-w-[var(--container)] mx-auto px-4 md:px-8">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto bg-white border border-[var(--color-border)] rounded-[20px] p-8 md:p-12 shadow-sm">
          <div className="flex flex-col gap-2 items-center text-center">
            <h2 className="font-[var(--font-display)] text-[24px] md:text-[28px] font-extrabold text-[var(--color-ink)] tracking-tight">
              Terms & Conditions
            </h2>
            <div className="w-12 h-1 bg-[var(--color-signal)] rounded-full mt-2"></div>
          </div>
          
          <ul className="flex flex-col gap-5 text-[15px] font-[var(--font-body)] text-[var(--color-body)] leading-relaxed mt-4">
            <li className="flex gap-4 items-start bg-[var(--color-canvas)] p-5 rounded-xl border border-[var(--color-border-light)]">
              <div className="w-2 h-2 rounded-full bg-[var(--color-signal)] shrink-0 mt-2"></div>
              <span>Once the order is placed, it will be delivered within <strong>5 to 10 working days</strong>.</span>
            </li>
            <li className="flex gap-4 items-start bg-[var(--color-canvas)] p-5 rounded-xl border border-[var(--color-border-light)]">
              <div className="w-2 h-2 rounded-full bg-[var(--color-signal)] shrink-0 mt-2"></div>
              <span>If the customer cancels the order, <strong>5% will be deducted</strong> from the total amount.</span>
            </li>
            <li className="flex gap-4 items-start bg-[var(--color-canvas)] p-5 rounded-xl border border-[var(--color-border-light)]">
              <div className="w-2 h-2 rounded-full bg-[var(--color-signal)] shrink-0 mt-2"></div>
              <span>If any product is received damaged, we will take action against the delivery partner.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* SECTION 7: CTA BANNER */}
      <section className="bg-[var(--color-signal)] py-16 md:py-20 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 flex flex-col items-center gap-6">
          <h2 className="font-[var(--font-display)] text-[28px] md:text-[42px] font-extrabold text-white tracking-tight leading-none">
            Partner with Fortune India
          </h2>
          <p className="font-[var(--font-body)] text-[15px] md:text-[16px] text-white/90 leading-relaxed max-w-xl">
            Join hundreds of manufacturers, PSUs, and enterprises who trust us for precision printing and ISO compliance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white hover:bg-[#F6F4F0] text-[var(--color-ink)] text-[13px] font-bold transition-all shadow-md cursor-pointer"
            >
              View Products &rarr;
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border-2 border-white hover:bg-white/10 text-white text-[13px] font-bold transition-all cursor-pointer"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
