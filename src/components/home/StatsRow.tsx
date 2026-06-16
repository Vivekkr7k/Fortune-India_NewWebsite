'use client'
import { useEffect, useState, useRef } from 'react'

function StatCount({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hasStarted) return

    let start = 0
    const duration = 1500 // 1.5 seconds animation
    const startTime = performance.now()

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Quadratic ease-out
      const ease = progress * (2 - progress)
      
      setCount(Math.floor(ease * target))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    requestAnimationFrame(animate)
  }, [hasStarted, target])

  return (
    <span ref={elementRef}>
      {count}
      {suffix}
    </span>
  )
}

export function StatsRow() {
  const stats = [
    { target: 500, suffix: '+', label: 'Projects Completed' },
    { target: 15, suffix: '+', label: 'Years Experience' },
    { target: 98, suffix: '%', label: 'Satisfaction Rate' },
    { target: 10, suffix: '+', label: 'Industries Served' },
  ]

  return (
    <section className="bg-[#141414] py-16 border-y border-white/5">
      <div className="max-w-[var(--container)] mx-auto px-4 md:px-0 grid grid-cols-2 md:grid-cols-4 gap-y-10">
        {stats.map((s, idx) => (
          <div 
            key={idx}
            className={`flex flex-col items-center justify-center text-center px-4 ${
              idx !== 3 ? 'md:border-r border-white/10' : ''
            }`}
          >
            <span className="font-[var(--font-display)] text-[44px] md:text-[54px] font-extrabold text-white leading-none tracking-tight">
              <StatCount target={s.target} suffix={s.suffix} />
            </span>
            <span className="font-[var(--font-body)] text-[12px] md:text-[13px] uppercase tracking-wider text-[#6A7A8A] mt-3 font-semibold">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
