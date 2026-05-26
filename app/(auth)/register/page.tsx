'use client'

export const dynamic = 'force-dynamic'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUpWithEmail, signInWithGoogle } from '@/lib/firebase/auth'

function EyeIcon({ show, onClick }: { show: boolean; onClick: () => void }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='text-[#B0A0CC] hover:text-[#7C5CBF] transition-colors'
    >
      {show ? (
        <svg
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94' />
          <path d='M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19' />
          <line x1='1' y1='1' x2='23' y2='23' />
        </svg>
      ) : (
        <svg
          width='16'
          height='16'
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
      )}
    </button>
  )
}

function SignupForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const [error, setError] = useState('')

  function friendlyError(code: string) {
    if (code.includes('email-already-in-use'))
      return 'An account with this email already exists.'
    if (code.includes('weak-password'))
      return 'Password must be at least 6 characters.'
    if (code.includes('invalid-email'))
      return 'Please enter a valid email address.'
    return 'Something went wrong. Please try again.'
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signUpWithEmail(email, password, name, 'student')
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(friendlyError((err as { code?: string }).code ?? ''))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setGLoading(true)
    try {
      await signInWithGoogle('student')
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(friendlyError((err as { code?: string }).code ?? ''))
    } finally {
      setGLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#F9F5FF] via-[#F3EEFF] to-[#FDF4FF] flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md'>
        {/* Logo */}
        <div className='text-center mb-8'>
          <Link
            href='/'
            className='inline-flex flex-col items-center no-underline'
          >
            <div className='w-12 h-12 rounded-full bg-gradient-to-br from-[#7C5CBF] to-[#C084F5] flex items-center justify-center mb-3'>
              <svg
                width='22'
                height='22'
                viewBox='0 0 24 24'
                fill='none'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z' />
                <path d='M5 3L5.5 4.5L7 5L5.5 5.5L5 7L4.5 5.5L3 5L4.5 4.5L5 3Z' />
                <path d='M19 17L19.5 18.5L21 19L19.5 19.5L19 21L18.5 19.5L17 19L18.5 18.5L19 17Z' />
              </svg>
            </div>
            <p className='font-serif text-[20px] font-bold text-[#2D1B5E]'>
              Pain to Power
            </p>
            <p className='text-[13px] text-[#8470A8]'>
              Create your free account
            </p>
          </Link>
        </div>

        <div className='bg-white rounded-3xl shadow-xl shadow-purple-100/60 border border-purple-100 p-8'>
          {/* Error */}
          {error && (
            <div className='mb-5 bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl'>
              {error}
            </div>
          )}

          {/* Google */}
          <button
            type='button'
            onClick={handleGoogle}
            disabled={gLoading || loading}
            className='w-full flex items-center justify-center gap-3 py-3 border border-purple-200 rounded-xl text-[14px] font-medium text-[#4A3570] hover:bg-[#F9F5FF] transition-colors disabled:opacity-50'
          >
            {gLoading ? (
              <svg
                className='animate-spin w-4 h-4'
                viewBox='0 0 24 24'
                fill='none'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8v8H4z'
                />
              </svg>
            ) : (
              <svg width='18' height='18' viewBox='0 0 24 24'>
                <path
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  fill='#4285F4'
                />
                <path
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  fill='#34A853'
                />
                <path
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z'
                  fill='#FBBC05'
                />
                <path
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  fill='#EA4335'
                />
              </svg>
            )}
            Continue with Google
          </button>

          <div className='my-5 flex items-center gap-3'>
            <div className='flex-1 h-px bg-purple-100' />
            <span className='text-[12px] text-[#B0A0CC]'>or</span>
            <div className='flex-1 h-px bg-purple-100' />
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className='space-y-4'>
            {/* Name */}
            <div>
              <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
                Full Name
              </label>
              <div className='relative'>
                <svg
                  width='15'
                  height='15'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-[#B0A0CC]'
                >
                  <path d='M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2' />
                  <circle cx='12' cy='7' r='4' />
                </svg>
                <input
                  type='text'
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Your name'
                  className='w-full pl-9 pr-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] placeholder-[#B0A0CC] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
                Email
              </label>
              <div className='relative'>
                <svg
                  width='15'
                  height='15'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-[#B0A0CC]'
                >
                  <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' />
                  <polyline points='22,6 12,13 2,6' />
                </svg>
                <input
                  type='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='you@example.com'
                  className='w-full pl-9 pr-4 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] placeholder-[#B0A0CC] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className='block text-[13px] font-semibold text-[#4A3570] mb-1.5'>
                Password
              </label>
              <div className='relative'>
                <svg
                  width='15'
                  height='15'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-[#B0A0CC]'
                >
                  <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
                  <path d='M7 11V7a5 5 0 0110 0v4' />
                </svg>
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Min. 6 characters'
                  className='w-full pl-9 pr-10 py-3 border border-purple-200 rounded-xl text-[14px] text-[#2D1B5E] placeholder-[#B0A0CC] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
                />
                <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                  <EyeIcon
                    show={showPwd}
                    onClick={() => setShowPwd((v) => !v)}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={loading || gLoading}
              className='w-full py-3.5 bg-[#7C5CBF] hover:bg-[#6A4DAD] text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-200 disabled:opacity-50 flex items-center justify-center gap-2'
            >
              {loading && (
                <svg
                  className='animate-spin w-5 h-5'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8v8H4z'
                  />
                </svg>
              )}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className='mt-5 text-center text-[13px] text-[#8470A8]'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='text-[#7C5CBF] font-semibold hover:text-[#6A4DAD] no-underline'
            >
              Sign in
            </Link>
          </p>

          <p className='mt-3 text-center text-[11.5px] text-[#B0A0CC] leading-relaxed'>
            By signing up you agree to our Terms of Service. 🔒 Safe & secure.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-gradient-to-br from-[#F9F5FF] to-[#FDF4FF] flex items-center justify-center'>
          <div className='w-8 h-8 border-4 border-[#7C5CBF] border-t-transparent rounded-full animate-spin' />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  )
}
