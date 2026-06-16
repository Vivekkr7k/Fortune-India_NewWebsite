import { Truck, Target, Zap, PhoneCall } from 'lucide-react'

export function TrustStrip() {
  const features = [
    {
      icon: <Truck className="text-[var(--signal)] shrink-0" size={24} />,
      title: 'Pan-India Delivery',
      desc: 'From Bangalore to your doorstep',
    },
    {
      icon: <Target className="text-[var(--signal)] shrink-0" size={24} />,
      title: 'Precision Guaranteed',
      desc: 'Micron-level accuracy on all runs',
    },
    {
      icon: <Zap className="text-[var(--signal)] shrink-0" size={24} />,
      title: 'Fast Turnaround',
      desc: '5–7 working days standard',
    },
    {
      icon: <PhoneCall className="text-[var(--signal)] shrink-0" size={24} />,
      title: 'Dedicated Support',
      desc: 'Direct line to technical experts',
    },
  ]

  return (
    <section className="bg-white border-y border-[var(--border)]">
      <div className="max-w-[var(--container)] mx-auto px-4 md:px-0 grid grid-cols-1 md:grid-cols-4">
        {features.map((f, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-4 p-6 md:p-8 ${
              idx !== 3 ? 'md:border-r border-[var(--border)]' : ''
            } ${idx !== 0 ? 'border-t md:border-t-0 border-[var(--border)]' : ''}`}
          >
            <div className="w-12 h-12 rounded-full bg-[var(--signal-tint)] flex items-center justify-center shrink-0">
              {f.icon}
            </div>
            <div className="flex flex-col gap-0.5">
              <h4 className="font-[var(--font-display)] text-[15px] font-bold text-[var(--ink)]">
                {f.title}
              </h4>
              <p className="font-[var(--font-body)] text-[12.5px] text-[var(--muted)] leading-snug">
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
