'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email, {
        url: 'https://radiantrisewithmasuma.com/login', // redirect after reset
        handleCodeInApp: false,
      })
      setSent(true)
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.')
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-bg flex items-center justify-center px-4 py-8 sm:py-12'>
      <div className='w-full max-w-sm sm:max-w-md'>
        {/* Logo */}
        <div className='text-center mb-6 sm:mb-8'>
          <Link
            href='/'
            className='inline-flex flex-col items-center no-underline'
          >
            <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center mb-2 sm:mb-3'>
              <svg
                width='20'
                height='20'
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
            <p className='font-serif text-lg sm:text-[20px] font-bold text-primary-dark'>
              Pain to Power
            </p>
            <p className='text-xs sm:text-[13px] text-primary-muted'>
              Reset your password
            </p>
          </Link>
        </div>

        {/* Card */}
        <div className='bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-[#b8a898]/30 border border-surface-border p-6 sm:p-8'>
          {sent ? (
            <div className='text-center py-2 sm:py-4'>
              <div className='w-14 h-14 sm:w-16 sm:h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='#16a34a'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <polyline points='20 6 9 17 4 12' />
                </svg>
              </div>
              <h2 className='font-serif text-lg sm:text-[20px] font-bold text-primary-dark mb-2'>
                Check your email
              </h2>
              <p className='text-xs sm:text-[14px] text-primary-mid mb-6'>
                We sent a password reset link to{' '}
                <strong className='break-all text-primary-dark'>{email}</strong>
                . Check your inbox and follow the instructions.
              </p>
              <Link
                href='/login'
                className='block w-full py-2.5 sm:py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-center text-sm no-underline transition-colors'
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h2 className='font-serif text-lg sm:text-[20px] font-bold text-primary-dark mb-1.5 sm:mb-2'>
                Forgot your password?
              </h2>
              <p className='text-xs sm:text-[13.5px] text-primary-muted mb-5 sm:mb-6'>
                Enter your email and we'll send you a reset link.
              </p>

              {error && (
                <div className='mb-4 sm:mb-5 bg-red-50 border border-red-200 text-red-600 text-xs sm:text-[13px] px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl'>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label className='block text-xs sm:text-[13px] font-semibold text-primary-dark mb-1.5'>
                    Email Address
                  </label>
                  <input
                    type='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='you@example.com'
                    className='w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-surface-border rounded-xl text-sm sm:text-[14px] text-primary-dark outline-none focus:border-primary focus:ring-2 focus:ring-[#7a6a58]/15 transition-all bg-bg placeholder:text-primary-muted'
                  />
                </div>

                <button
                  type='submit'
                  disabled={loading}
                  className='w-full py-3 sm:py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#b8a898]/40 disabled:opacity-50 flex items-center justify-center gap-2'
                >
                  {loading && (
                    <svg
                      className='animate-spin w-4 h-4 sm:w-5 sm:h-5'
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
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>

              <p className='mt-4 sm:mt-5 text-center text-xs sm:text-[13px] text-primary-muted'>
                Remember your password?{' '}
                <Link
                  href='/login'
                  className='text-primary font-semibold hover:text-primary-hover no-underline transition-colors'
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>

        {/* Footer note */}
        <p className='text-center text-[11px] text-primary-muted mt-5 opacity-70'>
          Reset email will be sent from{' '}
          <span className='font-medium'>radiantrisewithmasuma.com</span>
        </p>
      </div>
    </div>
  )
}
