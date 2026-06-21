import Link from 'next/link'
import type { Metadata } from 'next'
import { buildMetadata, breadcrumbJsonLd, SITE } from '@/lib/site'
import { FaqAccordion, type FaqCategory } from '@/components/faq/FaqAccordion'

export const metadata: Metadata = buildMetadata({
  title: 'Frequently Asked Questions',
  description:
    'Answers to common questions about Fortune India — ordering, bulk pricing, delivery timelines, electronics, drone parts, GST invoicing, and custom supplies.',
  path: '/faq',
  keywords: [
    'fortune india faq',
    'drone parts and electronics questions',
    'bulk order components india',
    'nameplate minimum order quantity',
    'industrial label delivery time',
    'custom nameplate quote',
  ],
})

const FAQ_GROUPS: FaqCategory[] = [
  {
    category: 'Orders & Pricing',
    items: [
      {
        question: 'How do I request a quote for a custom or bulk order?',
        answer:
          'Use the "Get a Quote" button or the Contact page and share your material, size, quantity and artwork/specifications. Our B2B desk responds within 1 business day with pricing, lead time and a GST invoice estimate. For high-volume runs we offer tiered pricing grids.',
      },
      {
        question: 'Is there a minimum order quantity (MOQ)?',
        answer:
          'No fixed MOQ. We handle everything from a single aluminium nameplate prototype to production runs of 100,000+ safety labels. Per-unit pricing improves with volume — ask for our bulk pricing grid.',
      },
      {
        question: 'Do you provide GST invoices and work with PSU/enterprise procurement?',
        answer:
          'Yes. We issue GST-compliant invoices and are set up for B2B and PSU procurement workflows, including purchase orders and dedicated account management.',
      },
      {
        question: 'What payment methods do you accept?',
        answer:
          'Online orders are processed securely through Razorpay (UPI, cards, net banking and wallets). For bulk and enterprise orders we also support bank transfer and PO-based billing against a GST invoice.',
      },
      {
        question: 'What is your cancellation policy?',
        answer:
          'If an order is cancelled after it has been placed, 5% of the total amount is deducted to cover setup and processing. Custom-printed items that are already in production may not be cancellable — please confirm specifications before placing the order.',
      },
    ],
  },
  {
    category: 'Products & Customization',
    items: [
      {
        question: 'What products does Fortune India manufacture?',
        answer:
          'Premium B2B electronics, drone and RC parts, carbon fiber sheets and tubes, sensors, development boards, motors, batteries, and industrial supplies.',
      },
      {
        question: 'Can you supply custom dimensions or bulk parts for aerospace and defence?',
        answer:
          'Yes. We supply carbon fiber components, customized electronic modules, and wiring assemblies that meet high aerospace and defence standards. Share your drawings or data sheet and we will confirm specifications.',
      },
      {
        question: 'Do you offer fully custom artwork, sizes and materials?',
        answer:
          'Absolutely. Every job can be customised by substrate (aluminium, steel, vinyl, polyester), finish, lamination grade, size and artwork. Send us a design file or a description and our team will advise the best material for your environment.',
      },
      {
        question: 'Which industries do you serve?',
        answer:
          'Aerospace and aviation, defence and drone, automotive, pharmaceutical, construction and architecture, and heavy industrial machinery — across both PSU and private-sector organisations.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    items: [
      {
        question: 'How long does delivery take?',
        answer:
          'Once an order is placed it is typically delivered within 5 to 10 working days, depending on quantity and customization. Bulk and highly custom runs may vary — your confirmed lead time is shared at the quote stage.',
      },
      {
        question: 'Do you ship across India?',
        answer:
          'Yes, we deliver pan-India from our Bangalore (Attibele) facility with reliable tracking and protective packaging on every shipment. Shipping is calculated per item at checkout.',
      },
      {
        question: 'What happens if my order arrives damaged?',
        answer:
          'If any product is received damaged, contact us immediately with photos. We take the matter up with the delivery partner and arrange a replacement or resolution for the affected items.',
      },
    ],
  },
  {
    category: 'Company',
    items: [
      {
        question: 'Where is Fortune India located and how can I reach you?',
        answer:
          `We are based at ${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} — ${SITE.address.postalCode}. Call ${SITE.phoneDisplay} (Mon–Sat) or email ${SITE.email}. We respond to enquiries within 1 business day.`,
      },
      {
        question: 'How long has Fortune India been in business?',
        answer:
          'We have been serving India’s industrial sector since 2009 — over 15 years of supplying components and parts for the country’s most demanding aerospace, defence and manufacturing clients.',
      },
    ],
  },
]

export default function FaqPage() {
  // FAQPage structured data (drives Google FAQ rich results)
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_GROUPS.flatMap((g) =>
      g.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    ),
  }

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'FAQ', path: '/faq' },
  ])

  return (
    <div className="bg-[var(--color-canvas)] text-[var(--color-body)] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([faqJsonLd, breadcrumb]) }}
      />

      {/* HERO */}
      <section className="bg-[var(--color-signal-tint)] py-16 md:py-20 border-b border-[var(--color-border-light)]">
        <div className="max-w-[var(--container)] mx-auto px-4 md:px-8 flex flex-col gap-4">
          <span className="font-[var(--font-mono)] text-[11px] font-bold text-[var(--color-signal)] tracking-widest uppercase">
            / HELP CENTRE
          </span>
          <h1 className="font-[var(--font-display)] text-[34px] md:text-[48px] font-extrabold text-[var(--color-ink)] leading-tight tracking-tight max-w-3xl">
            Frequently Asked Questions
          </h1>
          <p className="font-[var(--font-body)] text-[15px] md:text-[17px] text-[var(--color-body)] max-w-2xl leading-relaxed">
            Everything you need to know about ordering electronics, drone parts, and B2B supplies from
            Fortune India — pricing, customization, and delivery. Can&rsquo;t find your answer? {' '}
            <Link href="/contact" className="text-[var(--color-signal)] font-semibold hover:underline">
              Talk to our team
            </Link>.
          </p>
        </div>
      </section>

      {/* FAQ LIST */}
      <section className="py-16 md:py-20 max-w-3xl mx-auto px-4 md:px-8">
        <FaqAccordion groups={FAQ_GROUPS} />
      </section>

      {/* CTA */}
      <section className="bg-[#141414] py-16 md:py-20 text-white text-center border-t border-white/5">
        <div className="max-w-2xl mx-auto px-4 flex flex-col items-center gap-5">
          <h2 className="font-[var(--font-display)] text-[26px] md:text-[36px] font-extrabold text-white tracking-tight leading-tight">
            Still have questions?
          </h2>
          <p className="font-[var(--font-body)] text-[15px] text-white/70 max-w-lg leading-relaxed">
            Our B2B client desk responds within one business day with quotes,
            lead times and material guidance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[var(--color-signal)] hover:bg-[var(--color-signal-hover)] text-white text-[13px] font-bold transition-all shadow-md cursor-pointer"
            >
              Contact Us &rarr;
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border-2 border-white/30 hover:bg-white/10 text-white text-[13px] font-bold transition-all cursor-pointer"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
