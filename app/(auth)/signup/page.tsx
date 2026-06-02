'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUpWithEmail, signInWithGoogle } from '@/lib/firebase/auth'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
      // Redirect to OTP verification page
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
      router.push(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err: any) {
      setError(err.message ?? 'Google sign in failed')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-surface flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-surface'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-primary-dark font-serif mb-2'>
            Create Account
          </h1>
          <p className='text-primary-muted text-sm'>
            Join us and start learning today
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className='mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm'>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignup} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-primary-mid mb-1'>
              Full Name
            </label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder='John Doe'
              className='w-full px-4 py-2.5 rounded-lg border border-surface text-primary-dark placeholder:text-primary-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-primary-mid mb-1'>
              Email
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='you@example.com'
              className='w-full px-4 py-2.5 rounded-lg border border-surface text-primary-dark placeholder:text-primary-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-primary-mid mb-1'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='Min. 6 characters'
              className='w-full px-4 py-2.5 rounded-lg border border-surface text-primary-dark placeholder:text-primary-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-primary-mid mb-1'>
              Confirm Password
            </label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder='Re-enter your password'
              className='w-full px-4 py-2.5 rounded-lg border border-surface text-primary-dark placeholder:text-primary-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2'
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className='flex items-center gap-3 my-6'>
          <div className='flex-1 h-px bg-surface-border' />
          <span className='text-primary-muted text-xs'>or continue with</span>
          <div className='flex-1 h-px bg-surface-border' />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className='w-full py-3 rounded-lg border border-surface text-primary-dark font-medium text-sm hover:bg-surface transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3'
        >
          <svg className='w-5 h-5' viewBox='0 0 24 24'>
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
          {googleLoading ? 'Signing in...' : 'Continue with Google'}
        </button>

        {/* Login link */}
        <p className='text-center text-sm text-primary-muted mt-6'>
          Already have an account?{' '}
          <Link
            href='/login'
            className='text-primary font-medium hover:underline'
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
