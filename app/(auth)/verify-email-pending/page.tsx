'use client'

import { useRouter } from 'next/navigation'

export default function VerifyEmailPendingPage() {
  const router = useRouter()

  return (
    <div className='min-h-screen bg-surface flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-surface text-center'>
        <div className='flex justify-center mb-6'>
          <div className='w-16 h-16 rounded-full bg-surface flex items-center justify-center'>
            <svg
              className='w-8 h-8 text-primary'
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

        <h1 className='text-2xl font-bold text-primary-dark font-serif mb-2'>
          Check your email
        </h1>
        <p className='text-primary-muted text-sm mb-8'>
          We sent a verification code to your email address. Please check your
          inbox and enter the code to verify your account.
        </p>

        <button
          onClick={() => router.push('/signup')}
          className='w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors'
        >
          Back to Signup
        </button>

        <button
          onClick={() => router.push('/login')}
          className='w-full py-3 rounded-lg border border-surface text-primary-dark font-medium text-sm hover:bg-surface transition-colors mt-3'
        >
          Go to Login
        </button>
      </div>
    </div>
  )
}
