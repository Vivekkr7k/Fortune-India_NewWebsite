'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { ShieldAlert, Lock, Mail, Loader2, Key } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter both email and password.')
      return
    }

    setLoading(true)
    try {
      const res = await signIn('credentials', {
        email: email.toLowerCase(),
        password,
        redirect: false,
      })

      if (res?.error) {
        toast.error('Invalid credentials. Access denied.')
      } else {
        toast.success('Authentication successful! Loading dashboard...')
        router.replace('/admin')
        router.refresh()
      }
    } catch (err: any) {
      console.error('Login error:', err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[var(--color-canvas)] text-[var(--color-body)] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Subtle Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#FF5A1F]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#FF5A1F]/3 rounded-full blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] p-8 md:p-10 shadow-xl relative z-10 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center">
            <ShieldAlert className="text-[#FF5A1F]" size={22} />
          </div>
          <div className="flex flex-col gap-1.5 mt-2">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#FF5A1F] uppercase font-bold">
              Control Portal
            </span>
            <h1 className="text-[22px] font-extrabold tracking-tight font-[var(--font-display)] text-[var(--color-ink)]">
              Administrator Login
            </h1>
            <p className="text-[12px] text-[var(--color-muted)] max-w-[280px]">
              Access restricted to authorized personnel. Session activity is monitored.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[var(--color-body)] tracking-wide">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fortuneindia.com"
                className="w-full pl-11 pr-4 py-3 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[14px] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] placeholder-[var(--color-placeholder)] transition-all"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[var(--color-body)] tracking-wide">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-3 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[14px] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] placeholder-[var(--color-placeholder)] transition-all"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[var(--color-signal)] hover:bg-[var(--color-signal-hover)] text-white text-[14px] font-bold mt-2 shadow-lg shadow-[#FF5A1F]/10 hover:shadow-[#FF5A1F]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Authorizing...</span>
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        <div className="bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-[16px] p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Key className="text-[var(--color-signal)]" size={14} />
              <span className="text-[12px] font-semibold text-[var(--color-ink)]">Demo Credentials</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@fortuneindia.com')
                setPassword('Admin@123')
                toast.success('Demo credentials autofilled!')
              }}
              className="text-[11px] font-bold text-[var(--color-signal)] hover:text-[var(--color-signal-hover)] transition-colors cursor-pointer bg-[var(--color-signal-tint)] px-2.5 py-1 rounded-full"
            >
              Autofill
            </button>
          </div>
          <div className="text-[12px] text-[var(--color-body)] font-mono flex flex-col gap-1.5 border-t border-[var(--color-border)] pt-2.5">
            <div className="flex justify-between">
              <span>Email:</span>
              <span className="text-[var(--color-ink)] select-all font-semibold">admin@fortuneindia.com</span>
            </div>
            <div className="flex justify-between">
              <span>Password:</span>
              <span className="text-[var(--color-ink)] select-all font-semibold">Admin@123</span>
            </div>
          </div>
        </div>

        <div className="text-center border-t border-[var(--color-border)] pt-4">
          <span className="text-[10px] text-[var(--color-muted)] font-mono tracking-wide uppercase">
            Secured by NextAuth
          </span>
        </div>
      </div>
    </div>
  )
}
