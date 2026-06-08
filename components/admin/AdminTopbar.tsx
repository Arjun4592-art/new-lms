'use client'

import { useState } from 'react'
import { useAuthContext } from '@/context/AuthContext'
import { usePathname, useRouter } from 'next/navigation'
import { AdminMenuButton } from '@/components/admin/AdminSidebar'

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Overview',
  '/admin/courses': 'Courses',
  '/admin/courses/new': 'Add Course',
  '/admin/students': 'Students',
  '/admin/sessions': 'Sessions',
  '/admin/sessions/new': 'Add Session',
  '/admin/resources': 'Resources',
  '/admin/resources/new': 'Add Resource',
  '/admin/analytics': 'Analytics',
  '/admin/revenue': 'Revenue',
}

export default function AdminTopbar() {
  const { user, signOut } = useAuthContext()
  const pathname = usePathname()
  const router = useRouter()
  const title = PAGE_TITLES[pathname] ?? 'Admin'
  const [showMenu, setShowMenu] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
      router.push('/')
    } catch {
      setSigningOut(false)
    }
  }

  return (
    <>
      <style>{`
        .atb-dropdown {
          position: absolute; right: 0; top: calc(100% + 8px);
          width: 192px;
          background-color: var(--color-bg);
          border: 1px solid var(--color-surface-border);
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(44,34,24,0.12);
          padding: 6px 0; z-index: 20;
          animation: dropIn 0.15s ease forwards;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .atb-dropdown-btn {
          width: 100%; text-align: left;
          padding: 8px 16px; font-size: 13px;
          background: transparent; border: none; cursor: pointer;
          transition: background-color 0.15s;
        }
        .atb-dropdown-btn.normal {
          color: var(--color-primary-mid);
        }
        .atb-dropdown-btn.normal:hover { background-color: var(--color-surface); }
        .atb-dropdown-btn.danger { color: #EF4444; }
        .atb-dropdown-btn.danger:hover { background-color: #FEF2F2; color: #DC2626; }
        .atb-dropdown-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .atb-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background-color: var(--color-primary);
          color: var(--color-bg);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700;
          border: none; cursor: pointer;
          transition: opacity 0.2s;
        }
        .atb-avatar:hover { opacity: 0.85; }
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
          <AdminMenuButton />
          <h1
            className='font-serif text-[18px] font-medium'
            style={{ color: 'var(--color-text)' }}
          >
            {title}
          </h1>
        </div>

        {/* Right */}
        <div className='flex items-center gap-3'>
          <span
            className='hidden sm:block text-[13px]'
            style={{ color: 'var(--color-primary-muted)' }}
          >
            {user?.email}
          </span>

          {/* Avatar + dropdown */}
          <div className='relative'>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className='atb-avatar'
            >
              {user?.name?.charAt(0).toUpperCase() ?? 'A'}
            </button>

            {showMenu && (
              <>
                <div
                  className='fixed inset-0 z-10'
                  onClick={() => setShowMenu(false)}
                />
                <div className='atb-dropdown'>
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

                  <button
                    onClick={() => {
                      setShowMenu(false)
                      router.push('/dashboard')
                    }}
                    className='atb-dropdown-btn normal'
                  >
                    Go to Dashboard
                  </button>

                  <div
                    className='mt-1 pt-1'
                    style={{
                      borderTop: '1px solid var(--color-surface-border)',
                    }}
                  >
                    <button
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className='atb-dropdown-btn danger'
                    >
                      {signingOut ? 'Signing out…' : 'Sign Out'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
