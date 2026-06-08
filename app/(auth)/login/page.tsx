'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    requestAnimationFrame(() =>
      el.classList.add('opacity-100', 'translate-y-0'),
    )
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user, emailVerified } = await signInWithEmail(email, password)
      if (!emailVerified) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`)
        router.refresh()
        return
      }
      const target = user.role === 'admin' ? '/admin' : '/dashboard'
      router.push(target)
      router.refresh()
    } catch (err: any) {
      const code = err?.code ?? ''
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential' ||
        code === 'auth/invalid-email'
      ) {
        setError('Invalid email or password. Please try again.')
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.')
      } else if (code === 'auth/user-disabled') {
        setError('This account has been disabled. Please contact support.')
      } else if (code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection.')
      } else {
        setError('Something went wrong. Please try again.')
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
      const code = err?.code ?? ''
      if (code === 'auth/popup-closed-by-user') {
        setError('Google sign in was cancelled. Please try again.')
      } else if (code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups and try again.')
      } else if (code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection.')
      } else {
        setError('Google sign in failed. Please try again.')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-surface flex items-center justify-center px-4 py-12 relative overflow-hidden'>
      {/* ── Blobs ── */}
      <div className='absolute -top-20 -left-20 w-75 h-75 rounded-full bg-primary-light opacity-50 blur-[60px] pointer-events-none' />
      <div className='absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-surface-hover opacity-60 blur-[60px] pointer-events-none' />

      {/* ── Card ── */}
      <div
        ref={cardRef}
        className='w-full max-w-110 bg-bg border border-surface rounded-2xl px-8 py-9 relative z-10 opacity-0 translate-y-6 transition-all duration-700 ease-out'
      >
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
              <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
              <circle cx='12' cy='7' r='4' />
            </svg>
          </div>
          <h1 className='font-serif text-[28px] font-medium text-(--color-text)] mb-1'>
            Welcome Back
          </h1>
          <p className='text-[13.5px] font-light text-primary-muted'>
            Sign in to continue learning
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className='mb-4 px-4 py-3 rounded-xl text-[13px] bg-red-50 border border-red-200 text-red-600'>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className='space-y-4'>
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
              className='w-full px-4 py-2.75 border border-surface rounded-[10px] text-[14px] text-(--color-text) bg-bg outline-none font-sans placeholder:text-primary-muted focus:border-primary focus:shadow-[0_0_0_3px_rgba(122,106,88,0.12)] transition-all duration-200'
            />
          </div>

          <div>
            <label className='block text-[13px] font-semibold text-primary-mid mb-1.5'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='Your password'
              className='w-full px-4 py-2.75 border border-surface rounded-[10px] text-[14px] text-(--color-text) bg-bg outline-none font-sans placeholder:text-primary-muted focus:border-primary focus:shadow-[0_0_0_3px_rgba(122,106,88,0.12)] transition-all duration-200'
            />
          </div>

          <div className='flex justify-end'>
            <Link
              href='/forgot-password'
              className='text-[12px] text-primary no-underline hover:underline'
            >
              Forgot password?
            </Link>
          </div>

          <button
            type='submit'
            disabled={loading || googleLoading}
            className='w-full py-3 bg-primary text-bg font-sans text-[13.5px] font-semibold tracking-wider uppercase rounded-[10px] border-none cursor-pointer shadow-[0_4px_16px_rgba(122,106,88,0.22)] hover:bg-primary-hover transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {loading ? 'Signing in…' : 'Sign In'}
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
          className='w-full py-3 bg-bg border border-surface rounded-[10px] text-[13.5px] font-medium font-sans text-(--color-text) flex items-center justify-center gap-2.5 hover:bg-surface hover:border-primary-muted transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed'
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
          {googleLoading ? 'Signing in…' : 'Continue with Google'}
        </button>

        {/* Signup link */}
        <p className='text-center text-[13px] text-primary-muted mt-6'>
          Don&apos;t have an account?{' '}
          <Link
            href='/signup'
            className='font-medium text-primary no-underline hover:underline'
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
