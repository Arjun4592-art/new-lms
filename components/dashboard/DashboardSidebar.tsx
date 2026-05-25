'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SparkleIcon,
  BookIcon,
  HeartIcon,
  UsersIcon,
  DownloadIcon,
  MenuIcon,
  CloseIcon,
} from '@/components/ui/Icons'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const NAV: NavItem[] = [
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
    label: 'Resources',
    href: '/dashboard/resources',
    icon: <DownloadIcon size={16} />,
  },
  {
    label: 'Community',
    href: '/dashboard/community',
    icon: <UsersIcon size={16} />,
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
      {/* Logo */}
      <div className='flex items-center gap-3 px-4 py-4 border-b border-purple-100'>
        <div className='w-9 h-9 rounded-full bg-gradient-to-br from-[#7C5CBF] to-[#C084F5] flex items-center justify-center shrink-0'>
          <span className='text-white text-[11px] font-bold'>P2P</span>
        </div>
        <div>
          <p className='font-serif text-[14px] font-bold text-[#2D1B5E]'>
            Pain to Power
          </p>
          <p className='text-[10px] text-[#A67DD4]'>Student Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className='flex-1 px-3 py-4 space-y-1'>
        {NAV.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium no-underline transition-all ${
                active
                  ? 'bg-[#7C5CBF] text-white shadow-md shadow-purple-200'
                  : 'text-[#4A3570] hover:bg-[#F3EEFF] hover:text-[#7C5CBF]'
              }`}
            >
              <span className={active ? 'text-white' : 'text-[#A67DD4]'}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className='px-3 py-4 border-t border-purple-100'>
        <div className='bg-gradient-to-br from-[#F3EEFF] to-[#FDF4FF] rounded-2xl p-4 mb-3'>
          <p className='text-[12px] font-bold text-[#2D1B5E] mb-1'>
            Need Support?
          </p>
          <p className='text-[11px] text-[#8470A8] mb-3'>
            Reach out to Masuma directly.
          </p>
          <Link
            href='/contact'
            onClick={onLinkClick}
            className='block text-center text-[12px] font-semibold text-[#7C5CBF] bg-white border border-purple-200 rounded-lg py-1.5 no-underline hover:bg-[#F3EEFF] transition-colors'
          >
            Contact Coach
          </Link>
        </div>
        <Link
          href='/'
          onClick={onLinkClick}
          className='flex items-center gap-2 text-[12.5px] text-[#8470A8] hover:text-[#7C5CBF] no-underline transition-colors px-2'
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
    ;(window as Window & { __openDashSidebar?: () => void }).__openDashSidebar =
      () => setMobileOpen(true)
    return () => {
      delete (window as Window & { __openDashSidebar?: () => void })
        .__openDashSidebar
    }
  }, [])

  return (
    <>
      {/* Desktop */}
      <aside className='hidden lg:flex w-56 h-screen bg-white border-r border-purple-100 flex-col shrink-0 fixed top-0 left-0 z-30'>
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
        className={`fixed top-0 left-0 h-full w-[240px] bg-white border-r border-purple-100 flex flex-col z-50 lg:hidden transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className='flex items-center justify-end px-4 pt-3'>
          <button
            onClick={() => setMobileOpen(false)}
            className='w-8 h-8 flex items-center justify-center text-[#8470A8] hover:bg-[#F3EEFF] rounded-lg'
          >
            <CloseIcon size={18} />
          </button>
        </div>
        <SidebarContent onLinkClick={() => setMobileOpen(false)} />
      </aside>
    </>
  )
}
