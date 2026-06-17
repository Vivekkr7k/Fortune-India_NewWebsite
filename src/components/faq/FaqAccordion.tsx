'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

export interface FaqItem {
  question: string
  answer: string
}

export interface FaqCategory {
  category: string
  items: FaqItem[]
}

export function FaqAccordion({ groups }: { groups: FaqCategory[] }) {
  // Track open items by a stable "group-index" key. The first item starts open.
  const [open, setOpen] = useState<Record<string, boolean>>({ '0-0': true })

  return (
    <div className="flex flex-col gap-12">
      {groups.map((group, gi) => (
        <div key={group.category} className="flex flex-col gap-5">
          <h2 className="font-[var(--font-mono)] text-[12px] font-bold text-[var(--color-signal)] tracking-widest uppercase">
            / {group.category}
          </h2>

          <div className="flex flex-col gap-3">
            {group.items.map((item, ii) => {
              const key = `${gi}-${ii}`
              const isOpen = !!open[key]
              const panelId = `faq-panel-${key}`
              const btnId = `faq-button-${key}`

              return (
                <div
                  key={key}
                  className="bg-white border border-[var(--color-border)] rounded-[16px] shadow-sm overflow-hidden transition-colors hover:border-[var(--color-border-dark)]"
                >
                  <h3>
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen((s) => ({ ...s, [key]: !s[key] }))}
                      className="w-full flex items-center justify-between gap-4 text-left px-5 md:px-6 py-5 cursor-pointer"
                    >
                      <span className="font-[var(--font-display)] text-[15px] md:text-[17px] font-bold text-[var(--color-ink)] leading-snug">
                        {item.question}
                      </span>
                      <span
                        className={`shrink-0 w-8 h-8 rounded-full bg-[var(--color-signal-tint)] text-[var(--color-signal)] flex items-center justify-center transition-transform duration-300 ${
                          isOpen ? 'rotate-45' : ''
                        }`}
                      >
                        <Plus size={18} />
                      </span>
                    </button>
                  </h3>

                  {/* grid-rows trick keeps the answer in the DOM (crawlable) while animating height */}
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    className={`grid transition-all duration-300 ease-[var(--ease-out)] ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 md:px-6 pb-5 font-[var(--font-body)] text-[14px] md:text-[15px] text-[var(--color-body)] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
