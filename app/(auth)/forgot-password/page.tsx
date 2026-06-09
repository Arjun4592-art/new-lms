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
      await sendPasswordResetEmail(auth, email)
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
    <div className='min-h-screen bg-gradient-to-br from-[#F9F5FF] via-[#F3EEFF] to-[#FDF4FF] flex items-center justify-center px-4 py-8 sm:py-12'>
      <div className='w-full max-w-sm sm:max-w-md'>
        {/* Logo */}
        <div className='text-center mb-6 sm:mb-8'>
          <Link
            href='/'
            className='inline-flex flex-col items-center no-underline'
          >
            <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#7C5CBF] to-[#C084F5] flex items-center justify-center mb-2 sm:mb-3'>
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
            <p className='font-serif text-lg sm:text-[20px] font-bold text-[#2D1B5E]'>
              Pain to Power
            </p>
            <p className='text-xs sm:text-[13px] text-[#8470A8]'>
              Reset your password
            </p>
          </Link>
        </div>

        {/* Card */}
        <div className='bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-purple-100/60 border border-purple-100 p-6 sm:p-8'>
          {sent ? (
            <div className='text-center py-2 sm:py-4'>
              <div className='w-14 h-14 sm:w-16 sm:h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4'>
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
              <h2 className='font-serif text-lg sm:text-[20px] font-bold text-[#2D1B5E] mb-2'>
                Check your email
              </h2>
              <p className='text-xs sm:text-[14px] text-[#8470A8] mb-6'>
                We sent a password reset link to{' '}
                <strong className='break-all'>{email}</strong>. Check your inbox
                and follow the instructions.
              </p>
              <Link
                href='/login'
                className='block w-full py-2.5 sm:py-3 bg-[#7C5CBF] text-white font-bold rounded-xl text-center text-sm no-underline hover:bg-[#6A4DAD] transition-colors'
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h2 className='font-serif text-lg sm:text-[20px] font-bold text-[#2D1B5E] mb-1.5 sm:mb-2'>
                Forgot your password?
              </h2>
              <p className='text-xs sm:text-[13.5px] text-[#8470A8] mb-5 sm:mb-6'>
                Enter your email and we'll send you a reset link.
              </p>

              {error && (
                <div className='mb-4 sm:mb-5 bg-red-50 border border-red-200 text-red-600 text-xs sm:text-[13px] px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl'>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label className='block text-xs sm:text-[13px] font-semibold text-[#4A3570] mb-1.5'>
                    Email Address
                  </label>
                  <input
                    type='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='you@example.com'
                    className='w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-purple-200 rounded-xl text-sm sm:text-[14px] text-[#2D1B5E] outline-none focus:border-[#7C5CBF] focus:ring-2 focus:ring-[#7C5CBF]/15 transition-all'
                  />
                </div>

                <button
                  type='submit'
                  disabled={loading}
                  className='w-full py-3 sm:py-3.5 bg-[#7C5CBF] hover:bg-[#6A4DAD] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-purple-200 disabled:opacity-50 flex items-center justify-center gap-2'
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

              <p className='mt-4 sm:mt-5 text-center text-xs sm:text-[13px] text-[#8470A8]'>
                Remember your password?{' '}
                <Link
                  href='/login'
                  className='text-[#7C5CBF] font-semibold hover:text-[#6A4DAD] no-underline'
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
