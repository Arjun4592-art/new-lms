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
    requestAnimationFrame(() => el.classList.add('card-in'))
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user, emailVerified } = await signInWithEmail(email, password)
      if (!emailVerified) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`)
        return
      }
      router.push(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err: any) {
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        setError('Invalid email or password')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.')
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
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign in was cancelled. Please try again.')
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups and try again.')
      } else {
        setError(err.message ?? 'Google sign in failed')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <>
      <style>{`
        .login-page {
          min-height: 100vh;
          background-color: var(--color-surface);
          display: flex; align-items: center; justify-content: center;
          padding: 48px 16px;
          position: relative; overflow: hidden;
        }
        .login-blob {
          position: absolute; border-radius: 50%; pointer-events: none;
          filter: blur(60px);
        }
        .login-card {
          width: 100%; max-width: 440px;
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 16px;
          padding: 36px 32px;
          position: relative; z-index: 1;
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .login-card.card-in { opacity: 1; transform: translateY(0); }

        .login-label {
          display: block; font-size: 13px; font-weight: 600;
          color: var(--color-primary-mid); margin-bottom: 6px;
        }
        .login-input {
          width: 100%; padding: 11px 16px;
          border: 1px solid var(--color-surface-border);
          border-radius: 10px; font-size: 14px;
          color: var(--color-text);
          background-color: var(--color-bg);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: var(--font-sans);
        }
        .login-input::placeholder { color: var(--color-primary-muted); }
        .login-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(122,106,88,0.12);
        }

        .login-btn-primary {
          width: 100%; padding: 13px;
          background-color: var(--color-primary);
          color: var(--color-bg);
          font-size: 13.5px; font-weight: 600;
          font-family: var(--font-sans);
          border: none; border-radius: 10px; cursor: pointer;
          letter-spacing: 0.05em; text-transform: uppercase;
          transition: background-color 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(122,106,88,0.22);
        }
        .login-btn-primary:hover:not(:disabled) {
          background-color: var(--color-primary-hover);
        }
        .login-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .login-btn-google {
          width: 100%; padding: 12px;
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 10px; cursor: pointer;
          font-size: 13.5px; font-weight: 500;
          font-family: var(--font-sans);
          color: var(--color-text);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: background-color 0.2s, border-color 0.2s;
        }
        .login-btn-google:hover:not(:disabled) {
          background-color: var(--color-surface);
          border-color: var(--color-primary-muted);
        }
        .login-btn-google:disabled { opacity: 0.6; cursor: not-allowed; }

        .login-divider {
          display: flex; align-items: center; gap: 12px; margin: 20px 0;
        }
        .login-divider-line {
          flex: 1; height: 1px;
          background-color: var(--color-surface-border);
        }
        .login-divider-text {
          font-size: 11.5px; color: var(--color-primary-muted);
          white-space: nowrap;
        }

        .login-error {
          margin-bottom: 16px; padding: 11px 16px;
          border-radius: 10px; font-size: 13px;
          background-color: #FEF2F2;
          border: 1px solid #FECACA;
          color: #DC2626;
        }
      `}</style>

      <div className='login-page'>
        {/* Decorative blobs */}
        <div
          className='login-blob'
          style={{
            width: 300,
            height: 300,
            top: -80,
            left: -80,
            backgroundColor: 'var(--color-primary-light)',
            opacity: 0.5,
          }}
        />
        <div
          className='login-blob'
          style={{
            width: 240,
            height: 240,
            bottom: -60,
            right: -60,
            backgroundColor: 'var(--color-surface-hover)',
            opacity: 0.6,
          }}
        />

        <div ref={cardRef} className='login-card'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div
              className='w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4'
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-surface-border)',
              }}
            >
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
            <h1
              className='font-serif text-[28px] font-medium mb-1'
              style={{ color: 'var(--color-text)' }}
            >
              Welcome Back
            </h1>
            <p
              className='text-[13.5px] font-light'
              style={{ color: 'var(--color-primary-muted)' }}
            >
              Sign in to continue learning
            </p>
          </div>

          {/* Error */}
          {error && <div className='login-error'>{error}</div>}

          {/* Form */}
          <form onSubmit={handleLogin} className='space-y-4'>
            <div>
              <label className='login-label'>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder='you@example.com'
                className='login-input'
              />
            </div>
            <div>
              <label className='login-label'>Password</label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder='Your password'
                className='login-input'
              />
            </div>

            <div className='flex justify-end'>
              <Link
                href='/forgot-password'
                className='text-[12px] no-underline hover:underline'
                style={{ color: 'var(--color-primary)' }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type='submit'
              disabled={loading || googleLoading}
              className='login-btn-primary'
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className='login-divider'>
            <div className='login-divider-line' />
            <span className='login-divider-text'>or continue with</span>
            <div className='login-divider-line' />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className='login-btn-google'
          >
            <svg
              className='w-5 h-5'
              viewBox='0 0 24 24'
              style={{ flexShrink: 0 }}
            >
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
          <p
            className='text-center text-[13px] mt-6'
            style={{ color: 'var(--color-primary-muted)' }}
          >
            Don&apos;t have an account?{' '}
            <Link
              href='/signup'
              className='font-medium no-underline hover:underline'
              style={{ color: 'var(--color-primary)' }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
