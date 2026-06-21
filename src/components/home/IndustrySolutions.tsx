import Image from 'next/image'
import { Cpu, Layers, Wifi, Wrench, Boxes, Gauge, ArrowRight } from 'lucide-react'

export function IndustrySolutions() {
  const industries = [
    {
      title: 'Drone & UAV Systems',
      specs: 'Brushless Motors · ESCs · Propellers · Frames',
      icon: Cpu,
      glowColor: 'from-orange-500',
      image: '/images/industry_defence.png',
    },
    {
      title: 'Robotics & Automation',
      specs: 'Sensors · Actuators · Hardware · Microcontrollers',
      icon: Gauge,
      glowColor: 'from-blue-500',
      image: '/images/industry_aerospace.png',
    },
    {
      title: 'Carbon Fiber Structurals',
      specs: 'Twill Sheets · Carbon Tubes · CNC Plates · Custom Cuts',
      icon: Layers,
      glowColor: 'from-purple-500',
      image: '/images/industry_automotive.png',
    },
    {
      title: 'Smart IoT & Prototyping',
      specs: 'Development Boards · WiFi/BLE Modules · Prototyping Gear',
      icon: Wifi,
      glowColor: 'from-emerald-500',
      image: '/images/industry_pharma.png',
    },
    {
      title: 'Industrial Assemblies',
      specs: 'Double-Sided Tapes · Thermal Pads · Heat Shrink Tubes',
      icon: Boxes,
      glowColor: 'from-amber-500',
      image: '/images/industry_construction.png',
    },
    {
      title: 'Custom Prototyping',
      specs: 'Custom CNC Carbon Fiber · Precision Standoffs & Fasteners',
      icon: Wrench,
      glowColor: 'from-cyan-500',
      image: '/images/industry_machinery.png',
    },
  ]

  return (
    <section className="py-24 max-w-[var(--container)] mx-auto px-4 md:px-8">
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto gap-3 mb-16">
        <span className="font-[var(--font-mono)] text-[11px] font-bold text-[var(--signal)] tracking-widest uppercase">
          / CORE APPLICATIONS
        </span>
        <h2 className="font-[var(--font-display)] text-[36px] md:text-[44px] font-extrabold text-[var(--ink)] tracking-tight leading-none">
          Built for Every Sector.
        </h2>
        <p className="font-[var(--font-body)] text-[15px] md:text-[16px] text-[var(--muted)] mt-2">
          Fortune India supplies premium electronics, drone parts, and carbon fiber products across India's engineering sectors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industries.map((ind, idx) => {
          const Icon = ind.icon
          return (
            <div
              key={idx}
              className="group relative flex flex-col justify-between p-8 bg-[#0D0D0D] rounded-[24px] overflow-hidden border border-[#262626] hover:border-[#555] transition-colors duration-500 min-h-[220px]"
              style={{ boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
            >
              {/* Background Image */}
              <Image 
                src={ind.image} 
                alt={ind.title} 
                fill 
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover opacity-20 transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent"></div>

              {/* Background ambient glow on hover */}
              <div className={`absolute -top-20 -right-20 w-[200px] h-[200px] bg-gradient-to-bl ${ind.glowColor} to-transparent rounded-full blur-[70px] opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none z-0`} />
              
              {/* Top Section: Icon */}
              <div className="relative z-10 flex items-start justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-[#333] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-out shadow-inner">
                  <Icon size={22} className="text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight size={14} className="text-white" />
                </div>
              </div>
              
              {/* Bottom Section: Text */}
              <div className="relative z-10 flex flex-col gap-2.5">
                <h3 className="font-[var(--font-display)] text-[20px] font-bold text-white leading-tight tracking-tight">
                  {ind.title}
                </h3>
                <p className="font-[var(--font-mono)] text-[12px] text-[#888] leading-relaxed uppercase tracking-wider">
                  {ind.specs}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
