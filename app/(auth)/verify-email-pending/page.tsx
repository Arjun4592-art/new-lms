'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function VerifyEmailPendingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  return (
    <div className='min-h-screen bg-surface flex items-center justify-center px-4 py-8 sm:py-12'>
      <div className='w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-surface text-center'>
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
                d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
        </div>

        <h1 className='text-xl sm:text-2xl font-bold text-primary-dark font-serif mb-2'>
          Check your email
        </h1>
        <p className='text-primary-muted text-xs sm:text-sm mb-2'>
          We sent a verification code to
        </p>
        {email && (
          <p className='text-primary font-medium text-xs sm:text-sm mb-6 sm:mb-8 break-all px-2'>
            {email}
          </p>
        )}

        <button
          onClick={() =>
            router.push(`/verify-email?email=${encodeURIComponent(email)}`)
          }
          className='w-full py-2.5 sm:py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors mb-3'
        >
          Enter Verification Code
        </button>

        <button
          onClick={() => router.push('/login')}
          className='w-full py-2.5 sm:py-3 rounded-lg border border-surface text-primary-dark font-medium text-sm hover:bg-surface transition-colors'
        >
          Go to Login
        </button>
      </div>
    </div>
  )
}

export default function VerifyEmailPendingPage() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-surface' />}>
      <VerifyEmailPendingContent />
    </Suspense>
  )
}
