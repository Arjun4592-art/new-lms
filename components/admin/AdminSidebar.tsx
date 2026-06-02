'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthContext } from '@/context/AuthContext'
import {
  LayoutDashboardIcon,
  BookIcon,
  UsersIcon,
  CalendarIcon,
  FileIcon,
  BarChartIcon,
  CreditCardIcon,
  SettingsIcon,
  MenuIcon,
  CloseIcon,
} from '@/components/ui/Icons'

const NAV = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboardIcon },
  { label: 'Courses', href: '/admin/courses', icon: BookIcon },
  { label: 'Students', href: '/admin/students', icon: UsersIcon },
  { label: 'Sessions', href: '/admin/sessions', icon: CalendarIcon },
  { label: 'Resources', href: '/admin/resources', icon: FileIcon },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChartIcon },
  { label: 'Revenue', href: '/admin/revenue', icon: CreditCardIcon },
]

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut, user } = useAuthContext()
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
      {/* Logo */}
      <div className='px-6 py-5 border-b border-surface-border'>
        <p className='font-serif text-[18px] font-bold text-primary-dark'>
          Pain to Power
        </p>
        <span className='inline-block mt-1 px-2 py-0.5 bg-surface text-primary text-[10px] font-bold rounded-full uppercase tracking-wider'>
          Admin Panel
        </span>
      </div>

      {/* Admin info */}
      <div className='px-4 py-3 border-b border-surface-border'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary-light flex items-center justify-center shrink-0'>
            <span className='text-white text-[11px] font-bold'>
              {user?.name?.charAt(0).toUpperCase() ?? 'A'}
            </span>
          </div>
          <div className='min-w-0'>
            <p className='text-[13px] font-semibold text-primary-dark truncate'>
              {user?.name ?? 'Admin'}
            </p>
            <p className='text-[11px] text-primary-muted truncate'>
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className='flex-1 px-3 py-4 space-y-0.5 overflow-y-auto'>
        {NAV.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium no-underline transition-all ${
                isActive
                  ? 'bg-surface text-primary font-semibold'
                  : 'text-primary-mid hover:bg-surface hover:text-primary'
              }`}
            >
              <item.icon
                size={17}
                className={isActive ? 'text-primary' : 'text-primary-accent'}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className='px-3 py-4 border-t border-surface-border space-y-0.5'>
        <Link
          href='/dashboard'
          onClick={onLinkClick}
          className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium text-primary-mid hover:bg-surface hover:text-primary no-underline transition-all'
        >
          <SettingsIcon size={17} className='text-primary-accent' />
          Back to Dashboard
        </Link>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-60'
        >
          <svg
            width='17'
            height='17'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4' />
            <polyline points='16 17 21 12 16 7' />
            <line x1='21' y1='12' x2='9' y2='12' />
          </svg>
          {signingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </>
  )
}

// Mobile trigger button — import and place this in AdminTopbar
export function AdminMenuButton() {
  return (
    <button
      onClick={() => (window as any).__openAdminSidebar?.()}
      className='lg:hidden w-8 h-8 flex items-center justify-center text-primary-muted hover:bg-surface rounded-lg'
    >
      <MenuIcon size={18} />
    </button>
  )
}

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    ;(window as any).__openAdminSidebar = () => setMobileOpen(true)
    return () => {
      delete (window as any).__openAdminSidebar
    }
  }, [])

  return (
    <>
      {/* Desktop */}
      <aside className='hidden lg:flex flex-col w-64 h-screen bg-white border-r border-surface-border fixed left-0 top-0 z-30'>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className='fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden'
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-surface-border flex flex-col z-50 lg:hidden transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className='flex items-center justify-end px-4 pt-3'>
          <button
            onClick={() => setMobileOpen(false)}
            className='w-8 h-8 flex items-center justify-center text-primary-muted hover:bg-surface rounded-lg'
          >
            <CloseIcon size={18} />
          </button>
        </div>
        <SidebarContent onLinkClick={() => setMobileOpen(false)} />
      </aside>
    </>
  )
}
