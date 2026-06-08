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
    <div
      className='w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold'
      style={{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-bg)',
      }}
    >
      {user?.name?.charAt(0).toUpperCase() ?? '?'}
    </div>
  )

  return (
    <>
      <style>{`
        .topbar-icon-btn {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; border: none; background: transparent; cursor: pointer;
          color: var(--color-primary-muted);
          transition: background-color 0.2s, color 0.2s;
        }
        .topbar-icon-btn:hover {
          background-color: var(--color-surface);
          color: var(--color-primary);
        }
        .topbar-profile-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 10px 6px 8px;
          border-radius: 10px; border: none; background: transparent; cursor: pointer;
          transition: background-color 0.2s;
        }
        .topbar-profile-btn:hover { background-color: var(--color-surface); }

        .topbar-dropdown {
          position: absolute; right: 0; top: calc(100% + 8px);
          width: 192px;
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(44,34,24,0.12);
          padding: 6px 0; z-index: 50;
          animation: dropIn 0.15s ease forwards;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .topbar-dropdown-link {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 16px; font-size: 13px; text-decoration: none;
          color: var(--color-primary-mid);
          transition: background-color 0.15s;
        }
        .topbar-dropdown-link:hover { background-color: var(--color-surface); }
        .topbar-signout-btn {
          width: 100%; text-align: left;
          display: flex; align-items: center; gap: 8px;
          padding: 8px 16px; font-size: 13px;
          background: transparent; border: none; cursor: pointer;
          color: #DC2626;
          transition: background-color 0.15s;
        }
        .topbar-signout-btn:hover { background-color: #FEF2F2; }
        .topbar-signout-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <header
        className='h-14 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-20'
        style={{
          backgroundColor: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-surface-border)',
        }}
      >
        {/* Left */}
        <div className='flex items-center gap-3'>
          <button onClick={openSidebar} className='topbar-icon-btn lg:hidden'>
            <MenuIcon size={18} />
          </button>
          <div className='hidden sm:block'>
            {loading ? (
              <div
                className='h-4 w-32 rounded animate-pulse'
                style={{ backgroundColor: 'var(--color-surface)' }}
              />
            ) : (
              <>
                <p
                  className='text-[14px] font-semibold'
                  style={{ color: 'var(--color-text)' }}
                >
                  Welcome back, {user?.name?.split(' ')[0] ?? 'Student'} 🌿
                </p>
                <p
                  className='text-[11px]'
                  style={{ color: 'var(--color-primary-muted)' }}
                >
                  Continue your healing journey
                </p>
              </>
            )}
          </div>
        </div>

        {/* Right */}
        <div className='flex items-center gap-2'>
          {/* Bell */}
          <button className='topbar-icon-btn relative'>
            <BellIconSVG />
            <span
              className='absolute top-1.5 right-1.5 w-2 h-2 rounded-full'
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
          </button>

          {/* Profile */}
          <div className='relative'>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className='topbar-profile-btn'
            >
              {loading ? (
                <div
                  className='w-7 h-7 rounded-full animate-pulse'
                  style={{ backgroundColor: 'var(--color-surface)' }}
                />
              ) : (
                avatar
              )}
              <span
                className='hidden sm:block text-[13px] font-medium'
                style={{ color: 'var(--color-primary-mid)' }}
              >
                {user?.name?.split(' ')[0] ?? 'Student'}
              </span>
            </button>

            {showProfile && (
              <div className='topbar-dropdown'>
                {/* User info */}
                <div
                  className='px-4 py-2.5 mb-1'
                  style={{
                    borderBottom: '1px solid var(--color-surface-border)',
                  }}
                >
                  <p
                    className='text-[13px] font-semibold truncate'
                    style={{ color: 'var(--color-text)' }}
                  >
                    {user?.name}
                  </p>
                  <p
                    className='text-[11px] truncate'
                    style={{ color: 'var(--color-primary-muted)' }}
                  >
                    {user?.email}
                  </p>
                </div>

                <Link
                  href='/dashboard/profile'
                  onClick={() => setShowProfile(false)}
                  className='topbar-dropdown-link'
                >
                  My Profile
                </Link>
                <Link
                  href='/dashboard'
                  onClick={() => setShowProfile(false)}
                  className='topbar-dropdown-link'
                >
                  Dashboard
                </Link>

                <div
                  className='mt-1 pt-1'
                  style={{ borderTop: '1px solid var(--color-surface-border)' }}
                >
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className='topbar-signout-btn'
                  >
                    {signingOut ? 'Signing out…' : 'Sign Out'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
