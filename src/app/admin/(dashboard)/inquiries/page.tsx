import { connectDB } from '@/lib/mongoose'
import { Contact } from '@/models'
import { InquiriesPageClient } from './InquiriesPageClient'

export const revalidate = 0

export default async function AdminInquiriesPage() {
  await connectDB()

  // Fetch all inquiries sorted by newest first
  const inquiries = await Contact.find().sort({ createdAt: -1 }).lean()

  // Serialize ObjectIds / Dates and sanitize for the client component
  const serializedInquiries = JSON.parse(JSON.stringify(inquiries)).map((inq: any) => ({
    ...inq,
    name: inq.name || 'Anonymous Sender',
    email: inq.email || 'no-email@fortuneindia.com',
    subject: inq.subject || 'General Enquiry',
    message: inq.message || 'No message content provided.',
    status: inq.status || 'NEW',
    createdAt: inq.createdAt || new Date().toISOString(),
  }))

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5 border-b border-[var(--color-border)] pb-6">
        <span className="font-mono text-[10px] text-[var(--color-signal)] uppercase tracking-[0.15em] font-semibold">
          / Management
        </span>
        <h1 className="text-[28px] md:text-[32px] font-extrabold tracking-tight font-[var(--font-display)] text-[var(--color-ink)]">
          Manage Inquiries
        </h1>
        <p className="text-[14px] text-[var(--color-muted)]">
          Review incoming visual print procurement requests, view message details, and track follow-up status.
        </p>
      </div>

      {/* Inquiries Client Container */}
      <InquiriesPageClient initialInquiries={serializedInquiries} />
    </div>
  )
}
