'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { verifyOTP, resendOTP } from '@/lib/firebase/auth'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (countdown === 0) {
      setCanResend(true)
      return
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  useEffect(() => {
    if (!email) router.push('/signup')
  }, [email, router])

  // Auto focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
    if (newOtp.every((d) => d !== '') && value) handleVerify(newOtp.join(''))
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      inputRefs.current[5]?.focus()
      handleVerify(pasted)
    }
  }

  async function handleVerify(code?: string) {
    const finalOtp = code ?? otp.join('')
    if (finalOtp.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }
    setLoading(true)
    setError('')
    try {
      await verifyOTP(email, finalOtp)
      setSuccess('Email verified! Redirecting...')
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch (err: any) {
      setError(err.message ?? 'Verification failed')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (!canResend) return
    setResendLoading(true)
    setError('')
    setSuccess('')
    try {
      await resendOTP(email)
      setSuccess('New OTP sent to your email!')
      setCountdown(60)
      setCanResend(false)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (err: any) {
      setError(err.message ?? 'Failed to resend OTP')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-surface flex items-center justify-center px-4 py-8 sm:py-12'>
      <div className='w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-surface'>
        {/* Icon */}
        <div className='flex justify-center mb-5 sm:mb-6'>
          <div className='w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-surface flex items-center justify-center'>
            <svg
              className='w-7 h-7 sm:w-8 sm:h-8 text-primary'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
              />
            </svg>
          </div>
        </div>

        {/* Header */}
        <div className='text-center mb-6 sm:mb-8'>
          <h1 className='text-xl sm:text-2xl font-bold text-primary-dark font-serif mb-2'>
            Verify your email
          </h1>
          <p className='text-primary-muted text-xs sm:text-sm'>
            We sent a 6-digit code to
          </p>
          <p className='text-primary font-medium text-xs sm:text-sm mt-1 break-all px-2'>
            {email}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className='mb-4 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm text-center'>
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className='mb-4 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-xs sm:text-sm text-center'>
            {success}
          </div>
        )}

        {/* OTP Inputs */}
        <div
          className='flex gap-2 sm:gap-3 justify-center mb-5 sm:mb-6'
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type='text'
              inputMode='numeric'
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={loading}
              className='w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold rounded-lg border-2 border-surface text-primary-dark focus:outline-none focus:border-primary transition-colors disabled:opacity-50'
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={() => handleVerify()}
          disabled={loading || otp.some((d) => d === '')}
          className='w-full py-2.5 sm:py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>

        {/* Resend */}
        <div className='text-center mt-5 sm:mt-6'>
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className='text-primary text-sm font-medium hover:underline disabled:opacity-60'
            >
              {resendLoading ? 'Sending...' : 'Resend code'}
            </button>
          ) : (
            <p className='text-primary-muted text-xs sm:text-sm'>
              Resend code in{' '}
              <span className='text-primary font-medium'>{countdown}s</span>
            </p>
          )}
        </div>

        {/* Back */}
        <div className='text-center mt-3 sm:mt-4'>
          <Link
            href='/signup'
            className='text-primary-muted text-xs hover:text-primary transition-colors'
          >
            ← Back to signup
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-surface flex items-center justify-center'>
          <div className='w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-primary border-t-transparent animate-spin' />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
