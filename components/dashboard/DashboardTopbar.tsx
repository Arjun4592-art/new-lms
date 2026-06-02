'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MenuIcon } from '@/components/ui/Icons'
import { useAuth } from '@/context/AuthContext'

function BellIconSVG() {
  return (
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
      <path d='M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9' />
      <path d='M13.73 21a2 2 0 01-3.46 0' />
    </svg>
  )
}

export default function DashboardTopbar() {
  const router = useRouter()
  const [showProfile, setShowProfile] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const { user, loading, signOut } = useAuth()

  function openSidebar() {
    const fn = (window as Window & { __openDashSidebar?: () => void })
      .__openDashSidebar
    if (fn) fn()
  }

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
      router.push('/')
    } catch (err) {
      console.error('Sign out error:', err)
      setSigningOut(false)
    }
  }

  const avatar = user?.photoURL ? (
    <img
      src={user.photoURL}
      alt={user.name}
      className='w-7 h-7 rounded-full object-cover'
    />
  ) : (
    <div className='w-7 h-7 rounded-full bg-linear-to-br from-primary to-primary-light flex items-center justify-center text-white text-[11px] font-bold'>
      {user?.name?.charAt(0).toUpperCase() ?? '?'}
    </div>
  )

  return (
    <header className='h-14 bg-white border-b border-surface-border flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-20'>
      {/* Left */}
      <div className='flex items-center gap-3'>
        <button
          onClick={openSidebar}
          className='lg:hidden w-8 h-8 flex items-center justify-center text-primary-muted hover:bg-surface rounded-lg'
        >
          <MenuIcon size={18} />
        </button>
        <div className='hidden sm:block'>
          {loading ? (
            <div className='h-4 w-32 bg-surface rounded animate-pulse' />
          ) : (
            <>
              <p className='text-[14px] font-semibold text-primary-dark'>
                Welcome back, {user?.name?.split(' ')[0] ?? 'Student'} 🌸
              </p>
              <p className='text-[11px] text-primary-accent'>
                Continue your healing journey
              </p>
            </>
          )}
        </div>
      </div>

      {/* Right */}
      <div className='flex items-center gap-2'>
        <button className='relative w-8 h-8 flex items-center justify-center text-primary-muted hover:bg-surface rounded-lg transition-colors'>
          <BellIconSVG />
          <span className='absolute top-1.5 right-1.5 w-2 h-2 bg-primary-light rounded-full' />
        </button>

        <div className='relative'>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className='flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-surface rounded-xl transition-colors'
          >
            {loading ? (
              <div className='w-7 h-7 rounded-full bg-surface animate-pulse' />
            ) : (
              avatar
            )}
            <span className='hidden sm:block text-[13px] font-medium text-primary-mid'>
              {user?.name?.split(' ')[0] ?? 'Student'}
            </span>
          </button>

          {showProfile && (
            <div className='absolute right-0 top-full mt-2 w-48 bg-white border border-surface-border rounded-2xl shadow-xl shadow-purple-100/60 py-2 z-50'>
              <div className='px-4 py-2 border-b border-surface-border mb-1'>
                <p className='text-[13px] font-semibold text-primary-dark truncate'>
                  {user?.name}
                </p>
                <p className='text-[11px] text-primary-muted truncate'>
                  {user?.email}
                </p>
              </div>
              <Link
                href='/dashboard/profile'
                onClick={() => setShowProfile(false)}
                className='flex items-center gap-2 px-4 py-2 text-[13px] text-primary-mid hover:bg-surface transition-colors no-underline'
              >
                My Profile
              </Link>
              <Link
                href='/dashboard'
                onClick={() => setShowProfile(false)}
                className='flex items-center gap-2 px-4 py-2 text-[13px] text-primary-mid hover:bg-surface transition-colors no-underline'
              >
                Dashboard
              </Link>
              <div className='border-t border-surface-border mt-1 pt-1'>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className='w-full text-left flex items-center gap-2 px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60'
                >
                  {signingOut ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
