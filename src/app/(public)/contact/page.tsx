'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Phone, Mail, MapPin, CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const contactSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  company: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.enum([
    'Product Enquiry',
    'Request a Quote',
    'Bulk Order / Pricing',
    'Partnership / Supplier',
    'General Enquiry'
  ]),
  message: z.string().min(20, 'Please provide more detail (minimum 20 characters)')
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedName, setSubmittedName] = useState('')
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      subject: 'Product Enquiry',
      message: ''
    }
  })

  async function onSubmit(data: ContactFormData) {
    setLoading(true)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        throw new Error('Failed to submit message')
      }

      setSubmittedName(data.name)
      setSubmittedEmail(data.email)
      setIsSubmitted(true)
      toast.success('Inquiry submitted successfully!')
      reset()
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[var(--color-canvas)] text-[var(--color-body)] min-h-screen">
      {/* PAGE HEADER */}
      <section className="py-16 bg-[var(--color-canvas)] border-b border-[var(--color-border-light)]">
        <div className="max-w-[var(--container)] mx-auto px-4 md:px-8">
          <span className="font-[var(--font-mono)] text-[11px] font-bold text-[var(--color-signal)] tracking-widest uppercase block mb-3">
            / GET IN TOUCH
          </span>
          <h1 className="font-[var(--font-display)] text-[34px] md:text-[52px] font-extrabold text-[var(--color-ink)] leading-none tracking-tight mb-4">
            Talk to Our Team.
          </h1>
          <p className="font-[var(--font-body)] text-[15px] md:text-[17px] text-[var(--color-muted)] max-w-2xl leading-relaxed">
            For orders, quotes, custom requirements, or any queries. We respond within 1 business day.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <section className="py-16 max-w-[var(--container)] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: Contact Form / Success state */}
          <div className="lg:col-span-7 bg-white border border-[var(--color-border)] rounded-[24px] p-6 md:p-8 shadow-sm">
            {isSubmitted ? (
              <div className="flex flex-col items-center text-center py-10">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-6 border border-green-100 shadow-sm animate-bounce">
                  <CheckCircle size={28} />
                </div>
                <h2 className="font-[var(--font-display)] text-[24px] font-extrabold text-[var(--color-ink)] mb-3">
                  Message Sent!
                </h2>
                <p className="font-[var(--font-body)] text-[15px] text-[var(--color-muted)] max-w-md leading-relaxed mb-8">
                  Thank you, <span className="font-semibold text-[var(--color-ink)]">{submittedName}</span>. We will respond to <span className="font-semibold text-[var(--color-ink)]">{submittedEmail}</span> within 1 business day.
                </p>
                <Link
                  href="/"
                  className="font-[var(--font-mono)] text-[13px] font-bold text-[var(--color-signal)] hover:underline flex items-center gap-1.5 transition-all"
                >
                  &larr; Back to Home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-[var(--font-body)] text-[13px] font-semibold text-[var(--color-ink)]">
                      Full Name*
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register('name')}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] text-[var(--color-ink)] font-[var(--font-body)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-signal)] focus:border-transparent transition-all placeholder:text-[var(--color-muted)]/60"
                    />
                    {errors.name && (
                      <p className="text-red-500 font-[var(--font-body)] text-[12px] mt-0.5">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Company Name */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="company" className="font-[var(--font-body)] text-[13px] font-semibold text-[var(--color-ink)]">
                      Company Name <span className="text-[var(--color-muted)] font-normal">(Optional)</span>
                    </label>
                    <input
                      id="company"
                      type="text"
                      {...register('company')}
                      placeholder="e.g. Aerotech Dynamics"
                      className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] text-[var(--color-ink)] font-[var(--font-body)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-signal)] focus:border-transparent transition-all placeholder:text-[var(--color-muted)]/60"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-[var(--font-body)] text-[13px] font-semibold text-[var(--color-ink)]">
                      Email Address*
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="e.g. rajesh@aerotech.com"
                      className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] text-[var(--color-ink)] font-[var(--font-body)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-signal)] focus:border-transparent transition-all placeholder:text-[var(--color-muted)]/60"
                    />
                    {errors.email && (
                      <p className="text-red-500 font-[var(--font-body)] text-[12px] mt-0.5">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="font-[var(--font-body)] text-[13px] font-semibold text-[var(--color-ink)]">
                      Mobile Number <span className="text-[var(--color-muted)] font-normal">(Optional)</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] text-[var(--color-ink)] font-[var(--font-body)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-signal)] focus:border-transparent transition-all placeholder:text-[var(--color-muted)]/60"
                    />
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="font-[var(--font-body)] text-[13px] font-semibold text-[var(--color-ink)]">
                      Subject*
                    </label>
                    <div className="relative">
                      <select
                        id="subject"
                        {...register('subject')}
                        className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] text-[var(--color-ink)] font-[var(--font-body)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-signal)] focus:border-transparent transition-all appearance-none cursor-pointer"
                      >
                        <option value="Product Enquiry">Product Enquiry</option>
                        <option value="Request a Quote">Request a Quote</option>
                        <option value="Bulk Order / Pricing">Bulk Order / Pricing</option>
                        <option value="Partnership / Supplier">Partnership / Supplier</option>
                        <option value="General Enquiry">General Enquiry</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[var(--color-muted)]">
                        &darr;
                      </div>
                    </div>
                    {errors.subject && (
                      <p className="text-red-500 font-[var(--font-body)] text-[12px] mt-0.5">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="font-[var(--font-body)] text-[13px] font-semibold text-[var(--color-ink)]">
                      Message*
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      {...register('message')}
                      placeholder="Please details your request (materials, sizes, quantities, specifications)..."
                      className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas)] text-[var(--color-ink)] font-[var(--font-body)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-signal)] focus:border-transparent transition-all placeholder:text-[var(--color-muted)]/60 resize-y"
                    ></textarea>
                    {errors.message && (
                      <p className="text-red-500 font-[var(--font-body)] text-[12px] mt-0.5">
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[52px] rounded-full bg-[var(--color-signal)] hover:bg-[var(--color-signal-hover)] text-white text-[14px] font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    'Send Message &rarr;'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN: Info Cards & Office Hours */}
          <div className="lg:col-span-5 space-y-6">
            {/* Call card */}
            <div className="bg-white border border-[var(--color-border)] rounded-[20px] p-6 shadow-sm flex gap-4 items-start">
              <div className="w-12 h-12 bg-[var(--color-signal-tint)] text-[var(--color-signal)] rounded-full flex items-center justify-center shrink-0">
                <Phone size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-[var(--font-mono)] text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-wider">
                  CALL US
                </span>
                <span className="font-[var(--font-display)] text-[20px] font-extrabold text-[var(--color-ink)]">
                  +91 88305 75677
                </span>
                <span className="font-[var(--font-body)] text-[13px] text-[var(--color-muted)] mt-0.5">
                  Mon–Sat, 9:00 AM – 6:00 PM
                </span>
              </div>
            </div>

            {/* Email card */}
            <div className="bg-white border border-[var(--color-border)] rounded-[20px] p-6 shadow-sm flex gap-4 items-start">
              <div className="w-12 h-12 bg-[var(--color-signal-tint)] text-[var(--color-signal)] rounded-full flex items-center justify-center shrink-0">
                <Mail size={20} />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-[var(--font-mono)] text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-wider">
                  EMAIL US
                </span>
                <span className="font-[var(--font-display)] text-[15px] md:text-[16px] font-extrabold text-[var(--color-ink)] truncate hover:underline">
                  <a href="mailto:fortuneindiabgl@gmail.com">fortuneindiabgl@gmail.com</a>
                </span>
                <span className="font-[var(--font-body)] text-[13px] text-[var(--color-muted)] mt-0.5">
                  Response within 24 hours
                </span>
              </div>
            </div>

            {/* Visit card */}
            <div className="bg-white border border-[var(--color-border)] rounded-[20px] p-6 shadow-sm flex gap-4 items-start">
              <div className="w-12 h-12 bg-[var(--color-signal-tint)] text-[var(--color-signal)] rounded-full flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-[var(--font-mono)] text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-wider">
                  VISIT US
                </span>
                <span className="font-[var(--font-display)] text-[16px] font-extrabold text-[var(--color-ink)]">
                  369, Attibele
                </span>
                <span className="font-[var(--font-body)] text-[13px] text-[var(--color-muted)] mt-0.5">
                  Bangalore, Karnataka — 562107
                </span>
              </div>
            </div>

            {/* Office Hours card */}
            <div className="bg-white border border-[var(--color-border)] rounded-[20px] p-6 shadow-sm">
              <h3 className="font-[var(--font-display)] text-[14px] font-bold text-[var(--color-ink)] mb-4 uppercase tracking-wider">
                Office Hours
              </h3>
              <div className="space-y-3 font-[var(--font-body)] text-[13.5px]">
                <div className="flex justify-between items-center border-b border-[var(--color-border-light)] pb-2">
                  <span className="font-[var(--font-mono)] text-[12px] text-[var(--color-muted)]">
                    Monday – Friday
                  </span>
                  <span className="font-semibold text-[var(--color-ink)]">
                    9:00 AM – 6:00 PM
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-[var(--color-border-light)] pb-2">
                  <span className="font-[var(--font-mono)] text-[12px] text-[var(--color-muted)]">
                    Saturday
                  </span>
                  <span className="font-semibold text-[var(--color-ink)]">
                    10:00 AM – 4:00 PM
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-[var(--font-mono)] text-[12px] text-[var(--color-muted)]">
                    Sunday
                  </span>
                  <span className="font-semibold text-red-500">
                    Closed
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  )
}
