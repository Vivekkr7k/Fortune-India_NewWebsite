export function SuppliersStrip() {
  const segments = [
    { name: 'Drone & RC Parts', desc: 'Motors, Propellers, Frame Parts & Accessories' },
    { name: 'Electronics & Sensors', desc: 'Development Boards, Modules, Sensors & Displays' },
    { name: 'Carbon Fiber & Tools', desc: 'High-Strength Products, Hardware & Tools' },
  ]

  return (
    <section className="bg-[#141414] py-12 md:py-16 border-b border-white/5">
      <div className="max-w-[var(--container)] mx-auto px-4 md:px-8 flex flex-col items-center gap-8">
        <span className="font-[var(--font-mono)] text-[11px] font-bold text-[var(--signal)] tracking-widest uppercase text-center block">
          / Core Product Segments
        </span>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
          {segments.map((s, idx) => (
            <div 
              key={idx}
              className="bg-[#1E1E1E] border border-white/5 rounded-[var(--r-xl)] p-5 flex items-center gap-4 transition-all hover:border-white/10 group"
            >
              {/* Orange dot */}
              <div className="w-2 h-2 rounded-full bg-[var(--signal)] group-hover:scale-125 transition-transform shrink-0" />
              
              <div className="flex flex-col gap-0.5">
                <span className="font-[var(--font-display)] text-[17px] font-extrabold text-white tracking-tight uppercase">
                  {s.name}
                </span>
                <span className="font-[var(--font-mono)] text-[10px] uppercase text-white/50 tracking-wider">
                  {s.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
