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
    <header className='h-14 bg-white border-b border-surface-border flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-20'>
      {/* Left */}
      <div className='flex items-center gap-3'>
        <AdminMenuButton />
        <h1 className='font-serif text-[18px] font-bold text-primary-dark'>
          {title}
        </h1>
      </div>

      {/* Right */}
      <div className='flex items-center gap-3'>
        <span className='hidden sm:block text-[13px] text-primary-muted'>
          {user?.email}
        </span>

        {/* Avatar + dropdown */}
        <div className='relative'>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className='w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary-light flex items-center justify-center text-white text-[11px] font-bold hover:opacity-90 transition-opacity'
          >
            {user?.name?.charAt(0).toUpperCase() ?? 'A'}
          </button>

          {showMenu && (
            <>
              {/* Backdrop */}
              <div
                className='fixed inset-0 z-10'
                onClick={() => setShowMenu(false)}
              />

              {/* Dropdown */}
              <div className='absolute right-0 top-full mt-2 w-48 bg-white border border-surface-border rounded-2xl shadow-xl shadow-purple-100/60 py-2 z-20'>
                <div className='px-4 py-2 border-b border-surface-border mb-1'>
                  <p className='text-[13px] font-semibold text-primary-dark truncate'>
                    {user?.name}
                  </p>
                  <p className='text-[11px] text-primary-muted truncate'>
                    {user?.email}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowMenu(false)
                    router.push('/dashboard')
                  }}
                  className='w-full text-left px-4 py-2 text-[13px] text-primary-mid hover:bg-surface transition-colors'
                >
                  Go to Dashboard
                </button>

                <div className='border-t border-surface-border mt-1 pt-1'>
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className='w-full text-left px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60'
                  >
                    {signingOut ? 'Signing out...' : 'Sign Out'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
