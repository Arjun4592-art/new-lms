'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SparkleIcon,
  BookIcon,
  HeartIcon,
  DownloadIcon,
  MenuIcon,
  CloseIcon,
  CalendarIcon,
  PlayIcon,
} from '@/components/ui/Icons'

const NAV = [
  {
    label: 'My Dashboard',
    href: '/dashboard',
    icon: <SparkleIcon size={16} />,
  },
  {
    label: 'My Courses',
    href: '/dashboard/my-courses',
    icon: <BookIcon size={16} />,
  },
  {
    label: 'Live Sessions',
    href: '/dashboard/sessions',
    icon: <CalendarIcon size={16} />,
  },
  {
    label: 'Recordings',
    href: '/dashboard/recordings',
    icon: <PlayIcon size={16} />,
  },
  {
    label: 'Resources',
    href: '/dashboard/resources',
    icon: <DownloadIcon size={16} />,
  },
  {
    label: 'My Profile',
    href: '/dashboard/profile',
    icon: <HeartIcon size={16} />,
  },
]

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()
  return (
    <>
      <div className='flex items-center gap-3 px-4 py-4 border-b border-surface-border'>
        <div className='w-9 h-9 rounded-full bg-linear-to-br from-primary to-primary-light flex items-center justify-center shrink-0'>
          <span className='text-white text-[11px] font-bold'>P2P</span>
        </div>
        <div>
          <p className='font-serif text-[14px] font-bold text-primary-dark'>
            Pain to Power
          </p>
          <p className='text-[10px] text-primary-accent'>Student Portal</p>
        </div>
      </div>

      <nav className='flex-1 px-3 py-4 space-y-1 overflow-y-auto'>
        {NAV.map((item) => {
          const active =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium no-underline transition-all ${
                active
                  ? 'bg-primary text-white shadow-md shadow-purple-200'
                  : 'text-primary-mid hover:bg-surface hover:text-primary'
              }`}
            >
              <span className={active ? 'text-white' : 'text-primary-accent'}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className='px-3 py-4 border-t border-surface-border'>
        <div className='bg-surface rounded-2xl p-4 mb-3'>
          <p className='text-[12px] font-bold text-primary-dark mb-1'>
            Need Support?
          </p>
          <p className='text-[11px] text-primary-muted mb-3'>
            Reach out to Masuma directly.
          </p>
          <Link
            href='/contact'
            onClick={onLinkClick}
            className='block text-center text-[12px] font-semibold text-primary bg-white border border-surface-border rounded-lg py-1.5 no-underline hover:bg-surface transition-colors'
          >
            Contact Coach
          </Link>
        </div>
        <Link
          href='/'
          onClick={onLinkClick}
          className='flex items-center gap-2 text-[12.5px] text-primary-muted hover:text-primary no-underline transition-colors px-2'
        >
          <svg
            width='14'
            height='14'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' />
            <polyline points='9 22 9 12 15 12 15 22' />
          </svg>
          Back to Website
        </Link>
      </div>
    </>
  )
}

export default function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    ;(window as any).__openDashSidebar = () => setMobileOpen(true)
    return () => {
      delete (window as any).__openDashSidebar
    }
  }, [])

  return (
    <>
      <aside className='hidden lg:flex w-56 h-screen bg-white border-r border-surface-border flex-col shrink-0 fixed top-0 left-0 z-30'>
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div
          className='fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden'
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-surface-border flex flex-col z-50 lg:hidden transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
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
