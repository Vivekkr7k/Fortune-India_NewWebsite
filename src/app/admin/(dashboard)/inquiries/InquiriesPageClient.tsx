'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Search, Filter, Mail } from 'lucide-react'

interface InquiryData {
  _id: string
  name: string
  company?: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'NEW' | 'READ' | 'REPLIED'
  createdAt: string
}

export function InquiriesPageClient({ initialInquiries }: { initialInquiries: InquiryData[] }) {
  const router = useRouter()
  const [inquiries, setInquiries] = useState<InquiryData[]>(initialInquiries)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | InquiryData['status']>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const handleUpdateStatus = async (id: string, newStatus: InquiryData['status']) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error('Failed to update inquiry status')
      const updated = await res.json()

      setInquiries((prev) => prev.map((inq) => (inq._id === id ? { ...inq, ...updated } : inq)))
      toast.success('Inquiry status updated!')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to update status.')
    } finally {
      setUpdatingId(null)
    }
  }

  // Filter & Search Logic
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter
    const matchesSearch =
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesSearch
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredInquiries.length / ITEMS_PER_PAGE)
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const range = 1
    pages.push(1)
    const start = Math.max(2, currentPage - range)
    const end = Math.min(totalPages - 1, currentPage + range)
    if (currentPage - range > 2) {
      pages.push('...')
    }
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    if (currentPage + range < totalPages - 1) {
      pages.push('...')
    }
    if (totalPages > 1) {
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="flex flex-col gap-6 text-[var(--color-body)] select-none">
      {/* Filters & Search Control */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-[20px] shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search inquiries by name, message..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[13.5px] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] placeholder-[var(--color-placeholder)] transition-all"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={15} className="text-[var(--color-signal)]" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any)
              setCurrentPage(1)
            }}
            className="px-3 py-2 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[13.5px] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] cursor-pointer"
          >
            <option value="all">All Inquiries</option>
            <option value="NEW">New Messages</option>
            <option value="READ">Read Messages</option>
            <option value="REPLIED">Replied</option>
          </select>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedInquiries.length === 0 ? (
          <div className="col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] p-12 text-center text-[var(--color-muted)] text-[14px]">
            No inquiries match the current search or filters.
          </div>
        ) : (
          paginatedInquiries.map((inq) => {
            const dateStr = new Date(inq.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })

            return (
              <div 
                key={inq._id}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-signal)]/30 rounded-[20px] p-6 flex flex-col justify-between gap-4 shadow-sm transition-all"
              >
                {/* Meta details */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-[14.5px] font-extrabold text-[var(--color-ink)] leading-tight">
                        {inq.name}
                      </span>
                      <span className="text-[11.5px] text-[var(--color-muted)] mt-0.5">
                        {inq.email} {inq.phone ? `• ${inq.phone}` : ''}
                      </span>
                      {inq.company && (
                        <span className="text-[11.5px] text-[var(--color-signal)] font-semibold mt-0.5">
                          Company: {inq.company}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-[var(--color-muted)] uppercase shrink-0">
                      {dateStr}
                    </span>
                  </div>

                  <div className="border-t border-[var(--color-border)] pt-4 flex flex-col gap-1.5">
                    <span className="text-[11.5px] font-mono uppercase text-[var(--color-muted)] tracking-wider font-bold">
                      Subject: {inq.subject}
                    </span>
                    <p className="text-[13.5px] text-[var(--color-body)] leading-relaxed whitespace-pre-wrap">
                      {inq.message}
                    </p>
                  </div>
                </div>

                {/* Status Dropdown control */}
                <div className="border-t border-[var(--color-border)] pt-4 mt-2 flex justify-between items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Mail size={14} className="text-[var(--color-signal)]" />
                    <span className="text-[11px] font-mono text-[var(--color-muted)] uppercase tracking-wider font-bold">Inquiry Status</span>
                  </div>

                  <select
                    disabled={updatingId === inq._id}
                    value={inq.status}
                    onChange={(e) => handleUpdateStatus(inq._id, e.target.value as any)}
                    className="px-3 py-1.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[12.5px] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] cursor-pointer disabled:opacity-40 font-semibold"
                  >
                    <option value="NEW">New</option>
                    <option value="READ">Read</option>
                    <option value="REPLIED">Replied</option>
                  </select>
                </div>

              </div>
            )
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-2 pb-6">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-body)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-surface-alt)] font-semibold transition-all cursor-pointer text-[13px]"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, idx) => {
              if (page === '...') {
                return (
                  <span key={`dots-${idx}`} className="px-2 text-[var(--color-muted)] font-bold">
                    ...
                  </span>
                )
              }
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(Number(page))}
                  className={`w-9 h-9 rounded-full font-mono text-[13px] font-bold flex items-center justify-center transition-all cursor-pointer border ${
                    currentPage === page
                      ? 'bg-[var(--color-signal)] border-[var(--color-signal)] text-white'
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-body)] hover:bg-[var(--color-surface-alt)]'
                  }`}
                >
                  {page}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-body)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-surface-alt)] font-semibold transition-all cursor-pointer text-[13px]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
