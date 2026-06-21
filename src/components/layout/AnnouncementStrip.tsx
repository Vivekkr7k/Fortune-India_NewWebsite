'use client'
import { useState } from 'react'
import { X, ShieldCheck } from 'lucide-react'

export function AnnouncementStrip() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="bg-[var(--signal)] text-white py-2.5 px-4 relative flex items-center justify-center text-center font-[var(--font-mono)] text-[12px] tracking-wider font-semibold z-50">
      <div className="flex items-center gap-2 flex-wrap justify-center pr-8">
        <ShieldCheck size={14} className="text-white shrink-0" />
        <span>DRONE PARTS · ELECTRONICS · CARBON FIBER & INDUSTRIAL SUPPLIES</span>
        <span className="hidden md:inline">|</span>
        <span>PAN-INDIA SHIPPING FROM BANGALORE</span>
      </div>
      <button 
        onClick={() => setVisible(false)}
        className="absolute right-3 hover:opacity-85 transition-opacity p-1 cursor-pointer"
        aria-label="Dismiss announcement"
      >
        <X size={14} />
      </button>
    </div>
  )
}
