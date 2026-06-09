'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUpWithEmail, signInWithGoogle } from '@/lib/firebase/auth'

/* ── Password strength helper ── */
function getStrength(pwd: string): {
  score: number
  label: string
  color: string
} {
  if (!pwd) return { score: 0, label: '', color: '' }
  let score = 0
  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  if (score <= 1) return { score: 1, label: 'Weak', color: '#ef4444' }
  if (score <= 2) return { score: 2, label: 'Fair', color: '#f97316' }
  if (score <= 3) return { score: 3, label: 'Good', color: '#eab308' }
  if (score <= 4) return { score: 4, label: 'Strong', color: '#22c55e' }
  return { score: 5, label: 'Very Strong', color: '#16a34a' }
}

function PasswordStrengthBar({ password }: { password: string }) {
  const { score, label, color } = getStrength(password)
  if (!password) return null
  return (
    <div className='mt-2'>
      <div className='flex gap-1 mb-1'>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className='h-1 flex-1 rounded-full transition-all duration-300'
            style={{ background: i <= score ? color : 'var(--color-surface)' }}
          />
        ))}
      </div>
      <p className='text-[11px] font-medium' style={{ color }}>
        {label}
      </p>
    </div>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await signUpWithEmail(email, password, name)
      // After signup → go to verify-email
      // verify-email page already redirects to /dashboard after OTP verified
      router.push(`/verify-email?email=${encodeURIComponent(email)}`)
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists')
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak')
      } else {
        setError(err.message ?? 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setGoogleLoading(true)
    try {
      const { user } = await signInWithGoogle()
      const target = user.role === 'admin' ? '/admin' : '/dashboard'
      router.push(target)
      router.refresh()
    } catch (err: any) {
      setError(err.message ?? 'Google sign in failed')
    } finally {
      setGoogleLoading(false)
    }
  }

  /* eye icon helpers */
  const EyeIcon = () => (
    <svg
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
      <circle cx='12' cy='12' r='3' />
    </svg>
  )
  const EyeOffIcon = () => (
    <svg
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' />
      <line x1='1' y1='1' x2='23' y2='23' />
    </svg>
  )

  const inputClass =
    'w-full px-4 py-2.5 rounded-[10px] border border-surface text-[var(--color-text)] bg-bg placeholder:text-primary-muted focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(122,106,88,0.12)] transition-all duration-200 text-[14px] font-sans'

  return (
    <div className='min-h-screen bg-surface flex items-center justify-center px-4 py-12 relative overflow-hidden'>
      <div className='absolute -top-20 -left-20 w-75 h-75 rounded-full bg-primary-light opacity-50 blur-[60px] pointer-events-none' />
      <div className='absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-surface-hover opacity-60 blur-[60px] pointer-events-none' />

      <div className='w-full max-w-md bg-bg border border-surface rounded-2xl px-8 py-9 relative z-10'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='w-12 h-12 rounded-full bg-surface border border-surface flex items-center justify-center mx-auto mb-4'>
            <svg
              width='22'
              height='22'
              viewBox='0 0 24 24'
              fill='none'
              stroke='var(--color-primary)'
              strokeWidth='1.8'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
              <circle cx='9' cy='7' r='4' />
              <line x1='19' y1='8' x2='19' y2='14' />
              <line x1='22' y1='11' x2='16' y2='11' />
            </svg>
          </div>
          <h1 className='font-serif text-[28px] font-medium text-[var(--color-text)] mb-1'>
            Create Account
          </h1>
          <p className='text-[13.5px] font-light text-primary-muted'>
            Join us and start learning today
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className='mb-4 px-4 py-3 rounded-xl text-[13px] bg-red-50 border border-red-200 text-red-600'>
            {error}
          </div>
        )}

        {googleLoading && (
          <div className='mb-4 px-4 py-3 rounded-xl text-[13px] bg-blue-50 border border-blue-200 text-blue-600 text-center'>
            Redirecting to Google... Please wait.
          </div>
        )}

        <form onSubmit={handleSignup} className='space-y-4'>
          {/* Name */}
          <div>
            <label className='block text-[13px] font-semibold text-primary-mid mb-1.5'>
              Full Name
            </label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder='John Doe'
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div>
            <label className='block text-[13px] font-semibold text-primary-mid mb-1.5'>
              Email
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='you@example.com'
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div>
            <label className='block text-[13px] font-semibold text-primary-mid mb-1.5'>
              Password
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder='Min. 6 characters'
                className={`${inputClass} pr-11`}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-primary-muted hover:text-primary transition-colors'
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {/* Strength bar */}
            <PasswordStrengthBar password={password} />
          </div>

          {/* Confirm Password */}
          <div>
            <label className='block text-[13px] font-semibold text-primary-mid mb-1.5'>
              Confirm Password
            </label>
            <div className='relative'>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder='Re-enter your password'
                className={`${inputClass} pr-11`}
              />
              <button
                type='button'
                onClick={() => setShowConfirm(!showConfirm)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-primary-muted hover:text-primary transition-colors'
                tabIndex={-1}
              >
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {/* Match indicator */}
            {confirmPassword && (
              <p
                className={`text-[11px] font-medium mt-1.5 ${password === confirmPassword ? 'text-green-600' : 'text-red-500'}`}
              >
                {password === confirmPassword
                  ? '✓ Passwords match'
                  : '✗ Passwords do not match'}
              </p>
            )}
          </div>

          <button
            type='submit'
            disabled={loading || googleLoading}
            className='w-full py-3 bg-primary text-bg font-sans text-[13.5px] font-semibold tracking-wider uppercase rounded-[10px] border-none cursor-pointer shadow-[0_4px_16px_rgba(122,106,88,0.22)] hover:bg-primary-hover transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2'
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className='flex items-center gap-3 my-5'>
          <div className='flex-1 h-px bg-surface' />
          <span className='text-[11.5px] text-primary-muted whitespace-nowrap'>
            or continue with
          </span>
          <div className='flex-1 h-px bg-surface' />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          className='w-full py-3 bg-bg border border-surface rounded-[10px] text-[13.5px] font-medium font-sans text-[var(--color-text)] flex items-center justify-center gap-2.5 hover:bg-surface hover:border-primary-muted transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed'
        >
          <svg className='w-5 h-5 shrink-0' viewBox='0 0 24 24'>
            <path
              fill='#4285F4'
              d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
            />
            <path
              fill='#34A853'
              d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
            />
            <path
              fill='#FBBC05'
              d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z'
            />
            <path
              fill='#EA4335'
              d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
            />
          </svg>
          {googleLoading ? 'Redirecting…' : 'Continue with Google'}
        </button>

        <p className='text-center text-[13px] text-primary-muted mt-6'>
          Already have an account?{' '}
          <Link
            href='/login'
            className='font-medium text-primary no-underline hover:underline'
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
